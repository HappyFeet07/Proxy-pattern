import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { expect, use, util } from "chai";
import { 
  TransparentUpgradeabilityProxy__factory,
  TransparentUpgradeabilityProxy,
  LogicV1__factory,
  LogicV1,
  LogicV2__factory,
  LogicV2
} from '../typechain-types';
let utils = ethers.utils;

describe("Transparent", () => {
  let owner: Signer, user1: Signer;
  let LogicContractV1: LogicV1;
  let LogicContractV2: LogicV2;
  let transparent: TransparentUpgradeabilityProxy;
  let proxyLogic: any;

  beforeEach(async () => {

    [owner, user1] = await ethers.getSigners();
    const LogicV1Factory = await ethers.getContractFactory('LogicV1') as LogicV1__factory;
    const LogicV1 = await ethers.getContractAt
    LogicContractV1 = await LogicV1Factory.deploy();

    const LogicV2Factory = await ethers.getContractFactory('LogicV2') as LogicV2__factory;
    LogicContractV2 = await LogicV2Factory.deploy();

    const transparentFactory = await ethers.getContractFactory('TransparentUpgradeabilityProxy') as TransparentUpgradeabilityProxy__factory;
    transparent = await transparentFactory.deploy();
    await transparent.connect(owner).upgradeTo(LogicContractV1.address);

    proxyLogic = await ethers.getContractAt('LogicV1', transparent.address) as LogicV1;

  });

  describe('Proxy correctness check', () => {

    it('Should be initiated correctly', async () => {
      expect(await transparent.getAdmin()).to.eql(await owner.getAddress());
    })

    it('Should execute logic contract correctly', async () => {
      let depositAmount = BigNumber.from(utils.parseEther('2')) as BigNumber;
      await proxyLogic.connect(user1)['deposit()']({ value: depositAmount });
      expect(await proxyLogic.balanceOf(user1.getAddress())).to.eql(depositAmount);
    })

    it('Should execute logic contract correctly after upgrade', async () => {
      let depositAmount = BigNumber.from(utils.parseEther('2')) as BigNumber;
      await proxyLogic.connect(user1)['deposit()']({ value: depositAmount });
      expect(await proxyLogic.balanceOf(user1.getAddress())).to.eql(depositAmount);
      await transparent.connect(owner).upgradeTo(LogicContractV2.address);
      proxyLogic = await ethers.getContractAt('LogicV2', transparent.address) as LogicV2;
      let leftAmount = BigNumber.from(utils.parseEther('1')) as BigNumber;
      await proxyLogic.connect(user1)['withdraw(uint256)'](leftAmount);
      expect(await proxyLogic.balanceOf(user1.getAddress())).to.eql(leftAmount);  
    })

    it('Should seperate callee from admin and other users',async () => {
      let user1Address = await user1.getAddress() as string;
      let depositAmount = BigNumber.from(utils.parseEther('2')) as BigNumber;
      let leftAmount = BigNumber.from(utils.parseEther('1')) as BigNumber;

      await proxyLogic.connect(user1).upgradeTo(user1Address);
      expect(await proxyLogic.owner()).to.eql(user1Address);
      await transparent.connect(owner).upgradeTo(LogicContractV2.address);
      proxyLogic = await ethers.getContractAt('LogicV2', transparent.address) as LogicV2;

      await proxyLogic.connect(user1)['deposit()']({ value: depositAmount });
      await proxyLogic.connect(user1)['withdraw(uint256)'](leftAmount);

      expect(await proxyLogic.balanceOf(user1.getAddress())).to.eql(leftAmount);  
    })
  });
});
