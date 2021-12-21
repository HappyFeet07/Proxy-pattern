const { ethers } = require("hardhat")
const BigNumber = ethers.BigNumber
const chai = require("chai")
utils = ethers.utils
expect = chai.expect

describe('inherit',() => {
  before(async () => {
    const [
      account1,
      account2,
      account3
    ] = await ethers.getSigners()

    this.Registry = await ethers.getContractFactory('Registry')
    this.LogicV1 = await ethers.getContractFactory('InheritLogicV1')
    this.LogicV2 = await ethers.getContractFactory('InheritLogicV2')
    this.LogicMock = await ethers.getContractFactory('LogicMock')
    this.UpProxy = await ethers.getContractFactory('UpgradeabilityProxy')
  })

  beforeEach(async () => {

    this.logicV1 = await this.LogicV1.deploy()
    this.logicV2 = await this.LogicV2.deploy()
    this.logicMock = await this.LogicMock.deploy()
    this.registry = await this.Registry.deploy()

    await this.logicV1.deployed()
    await this.logicV1.deployed()
    await this.logicMock.deployed()
    await this.registry.deployed()

    const registry = this.registry
    await registry.addVersion("Version1", this.logicV1.address)
    await registry.addVersion("Version2", this.logicV2.address)
    await registry.addVersion("NoInherit", this.logicMock.address)
    const tx = await registry.createProxy("Version1")
    const receipt = await tx.wait(1)
    const proxyLocation = receipt.events.pop().args.proxy

    this.proxy = this.LogicV1.attach(proxyLocation)
    this.upProxy = this.UpProxy.attach(proxyLocation)
  })

  describe("Proxy correctness check", () => {

    it("Versions should be registered correctly", async () => {
      const registry = this.registry
      const correctAddress1 = await registry.getVersion("Version1")
      const correctAddress2 = await registry.getVersion("Version2")
      const correctAddress3 = await registry.getVersion("NoInherit")

      expect(correctAddress1).to.eql(this.logicV1.address)
      expect(correctAddress2).to.eql(this.logicV2.address)
      expect(correctAddress3).to.eql(this.logicMock.address)
    })

    it("Proxy should be correctly initiated", async () => {
      const addressA = await this.proxy.importantDataA()
      expect(addressA).to.eql(this.registry.address)
    })

    it("Proxy should execute logic contract correctly", async () => {
      const before = await this.proxy.getSlot(1)
      expect(BigNumber.from(before)).to.eql(BigNumber.from("0"))
      await this.proxy.setSlot(1, 10000)
      const after = await this.proxy.getSlot(1)
      expect(BigNumber.from(after)).to.eql(BigNumber.from(10000))
    })

    it("Proxy should update to a different contract", async () => {
      await this.upProxy.upgradeTo("Version2")
      const tmp = this.proxy.address
      this.proxy = await this.LogicV2.attach(tmp)
      await this.proxy["setSlot(uint256,address)"](2, "0xB31E829F5345F8a767Fb9Dfd55e594f92f780591")
      const after = await this.proxy.getSlot(2)
      expect(after).to.eql("0x000000000000000000000000b31e829f5345f8a767fb9dfd55e594f92f780591")
    })
  })

  describe("Data Collision", () => {

    beforeEach(async () => {
      await this.proxy.setSlot(1, 4129889)
    })

    it("Shouldn't happen if new logic inherit Upgradeability", async () => {
      await this.upProxy.upgradeTo("Version2")
      const tmp = this.proxy.address
      this.proxy = await this.LogicV2.attach(tmp)
      const before = await this.proxy.getSlot(1)
      await this.proxy.updateB(123)
      const after = await this.proxy.getSlot(1)
      expect(before).to.eql(after)
    })

    it("Should happen while new logic didn't inherit Upgradeability", async () => {
      await this.upProxy.upgradeTo("NoInherit")
      const tmp = this.proxy.address
      this.proxy = await this.logicMock.attach(tmp)
      const before = await this.proxy.getSlot(1)
      await this.proxy.updateB(123)
      const after = await this.proxy.getSlot(1)
      expect(before).to.not.eql(after)
    })
  })
})
