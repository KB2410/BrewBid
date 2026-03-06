const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BuyMeACoffee", function () {
  let buyMeACoffee;
  let owner;
  let tipper;

  beforeEach(async function () {
    [owner, tipper] = await ethers.getSigners();
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    buyMeACoffee = await BuyMeACoffee.deploy();
  });

  // Test 1: Deployment
  it("Should set the right owner", async function () {
    expect(await buyMeACoffee.owner()).to.equal(owner.address);
  });

  // Test 2: State Change & Event Emission
  it("Should accept a tip, store the memo, and emit an event", async function () {
    const tipAmount = ethers.parseEther("0.001");
    
    await expect(
      buyMeACoffee.connect(tipper).buyCoffee("Alice", "Great project!", { value: tipAmount })
    )
      .to.emit(buyMeACoffee, "NewMemo")
      .withArgs(tipper.address, (anyValue) => true, "Alice", "Great project!");

    const memos = await buyMeACoffee.getMemos();
    expect(memos.length).to.equal(1);
    expect(memos[0].name).to.equal("Alice");
    expect(memos[0].message).to.equal("Great project!");
  });

  // Test 3: Revert/Error Handling
  it("Should revert if the tip amount is 0 ETH", async function () {
    await expect(
      buyMeACoffee.connect(tipper).buyCoffee("Bob", "Free coffee?", { value: 0 })
    ).to.be.revertedWith("Can't buy coffee with 0 eth");
  });
});
