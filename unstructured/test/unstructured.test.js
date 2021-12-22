const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;
const chai = require("chai");
utils = ethers.utils;
expect = chai.expect;

describe('unstructured', () => {
  let Unstructured, LogicV1, LogicV2;
  let unstructured, logicV1, logicV2;
  let proxyLogic, proxyLocation;
  let ower, user1, user2;
  
  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    Unstructured = await ethers.getContractFactory('OwnedUpgradeabilityProxy');
    LogicV1 = await ethers.getContractFactory('LogicV1');
    LogicV2 = await ethers.getContractFactory('LogicV2');
  })

  beforeEach(async () => {
    logicV1 = await LogicV1.deploy();
    logicV2 = await LogicV2.deploy();
    unstructured = await Unstructured.deploy();

    await logicV1.deployed();
    await logicV2.deployed();
    await unstructured.connect(owner).deployed();

    await unstructured.connect(owner).upgradeTo(logicV1.address);

    proxyLocation = unstructured.address;
    proxyLogic = LogicV1.attach(proxyLocation);
  })

  describe("Proxy correction check", () => {

    it('Should be correctly initiated, transfer ownership', async () => {
      expect(await unstructured.proxyOwner()).to.eql(owner.address);
    })

    it('Should execute logic contract correctly', async () => {
      let depositAmount = BigNumber.from(utils.parseEther('2'));
      expect(await proxyLogic.balanceOf(user1.address)).to.eql(BigNumber.from(0));
      await proxyLogic.connect(user1)['deposit()']({ value: depositAmount });
      expect(await proxyLogic.balanceOf(user1.address)).to.eql(depositAmount);
    })

    it("Should execute logic contract correctly after upgrade", async () => {
      let depositAmount = BigNumber.from(utils.parseEther('2'));
      await proxyLogic.connect(user1)['deposit()']({ value: depositAmount });
      await unstructured.connect(owner).upgradeTo(logicV2.address);
      proxyLogic = LogicV2.attach(proxyLocation);
      await proxyLogic.connect(user1)['withdraw(uint256)'](BigNumber.from(utils.parseEther('1')));
      expect(await proxyLogic.balanceOf(user1.address)).to.eql(BigNumber.from(utils.parseEther('1')));
    })

  })
})
