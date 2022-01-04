import { ethers } from 'hardhat';
import { BigNumber, Signer } from 'ethers';
import { expect, use, util } from 'chai';
import {
  Proxy__factory,
  Proxy,
  LogicV1__factory,
  LogicV1,
  LogicV2__factory,
  LogicV2
} from '../typechain-types';
let utils = ethers.utils;

describe("UUPS", () => {
  let owner: Signer, user1: Signer, user2: Signer;
  let proxyContract: Proxy;
  let logicV1Contract: LogicV1;
  let logicV2Contract: LogicV2;
  let proxyLogic: any;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    let logicV1Factory = await ethers.getContractFactory('LogicV1') as LogicV1__factory;
    logicV1Contract = await logicV1Factory.deploy();
    await logicV1Contract.deployed();

    let logicV2Factory = await ethers.getContractFactory('LogicV2') as LogicV2__factory;
    logicV2Contract = await logicV2Factory.deploy();
    await logicV2Contract.deployed();

    let proxyFactory = await ethers.getContractFactory('Proxy') as Proxy__factory;
    proxyContract = await proxyFactory.deploy("0x8129fc1c", logicV1Contract.address);
    proxyLogic = await logicV1Contract.attach(proxyContract.address);
  })

  describe("Proxy correction check", () => {

    it("Should be initialized", async () => {
      const ret = await proxyLogic.initialized();
      expect(ret).to.eql(true);
    })

    it("Should be able to execute logic function", async () => {
      const depositAmount = BigNumber.from(utils.parseEther('1')) as BigNumber;
      await proxyLogic.connect(user1)['deposit()']({ value: depositAmount });
      expect(await proxyLogic.balanceOf(await user1.getAddress())).to.eql(depositAmount);
    })

    it("Should be able to upgrade to new logic Address", async () => {
      const depositAmount = BigNumber.from(utils.parseEther('1')) as BigNumber;
      await proxyLogic.connect(user2)['deposit()']({ value: depositAmount });
      expect(await proxyLogic.balanceOf(await user2.getAddress())).to.eql(depositAmount);
      await proxyLogic.updateCode(logicV2Contract.address);
      proxyLogic = await logicV2Contract.attach(proxyContract.address) as LogicV2;
      await proxyLogic.connect(user2)['withdraw(uint256)'](depositAmount);
      expect(await proxyLogic.balanceOf(await user2.getAddress())).to.eql(BigNumber.from('0'));
    })
  })
})
