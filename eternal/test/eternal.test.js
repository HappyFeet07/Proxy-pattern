const { ethers } = require("hardhat")
const BigNumber = ethers.BigNumber
const chai = require("chai")
utils = ethers.utils
expect = chai.expect

describe('eternal',() => {
  let EternalStorageProxy, LogicV1, LogicV2
  let eternalStorageProxy, logicV1, logicV2
  let proxyLogic, eternalProxy, proxyLocation

  before(async () => {

    EternalStorageProxy = await ethers.getContractFactory('EternalStorageProxy')
    LogicV1 = await ethers.getContractFactory('EternalLogicV1')
    LogicV2 = await ethers.getContractFactory('EternalLogicV2')
  })

  beforeEach(async () => {
    let [owner, newOwner, user1, user2] = await ethers.getSigners()
    this.owner = owner
    this.newOwner = newOwner
    this.user1 = user1
    this.user2 = user2

    logicV1 = await LogicV1.deploy()
    logicV2 = await LogicV2.deploy()
    eternalStorageProxy = await EternalStorageProxy.connect(owner).deploy()

    await logicV1.deployed()
    await logicV2.deployed()
    await eternalStorageProxy.deployed()

    const tx = await eternalStorageProxy.connect(owner).upgradeTo("version1", logicV1.address)
    const receipt = await tx.wait(1)
    proxyLocation = receipt.events.pop().args.implementation

    proxyLogic = LogicV1.attach(eternalStorageProxy.address)
    eternalProxy = eternalStorageProxy
  })

  describe("Proxy correctness check", () => {
    it("Should be correctly initiated, transfer ownership", async () => {
      expect(await eternalProxy.proxyOwner()).to.eql(this.owner.address)
      newOwner = this.newOwner.address
      await eternalProxy.connect(this.owner).transferProxyOwnership(newOwner)
      expect(await eternalProxy.proxyOwner()).to.eql(newOwner)
    })

    it("Should execute logic contract correctly", async () => {
      let user1 = this.user1
      let depositAmount = utils.parseEther("2")
      await proxyLogic.connect(user1)["deposit()"]({value: depositAmount})
      expect(await proxyLogic.balanceOf(user1.address)).to.eql(depositAmount)
    })

    it("Should execute logic contract correctly after upgrade", async () => {
      let user1 = this.user1
      let depositAmount = BigNumber.from(utils.parseEther("2"))
      await proxyLogic.connect(user1)["deposit()"]({value: depositAmount})
      await eternalProxy.connect(this.owner).upgradeTo("version2", logicV2.address)
      proxyLogic = LogicV2.attach(eternalProxy.address)
      expect(await proxyLogic.balanceOf(user1.address)).to.eql(depositAmount)
      await proxyLogic.connect(user1)['withdraw(uint256)'](utils.parseEther("1"))
      expect(await proxyLogic.balanceOf(user1.address)).to.eql(utils.parseEther("1"))
    })
  })
})
