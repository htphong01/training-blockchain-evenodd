const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing Cash contract", () => {
    beforeEach(async () => {
        [user] = await ethers.getSigners();
        const Cash = await ethers.getContractFactory("Cash");
        cashToken = await Cash.deploy();
    });

    describe("Testing `buy` function", () => {
        it("Should be ok: User buy cash successfully", async () => {
            await expect(
                cashToken.connect(user).buy({
                    value: ethers.utils.parseEther("1"),
                })
            ).to.changeEtherBalances(
                [cashToken.address, user.address],
                [ethers.utils.parseEther("1"), ethers.utils.parseEther("-1")]
            );

            await expect(
                cashToken.connect(user).buy({
                    value: ethers.utils.parseEther("1"),
                })
            ).to.changeTokenBalance(cashToken, user.address, 10);
        });
    });

    describe("Testing `withdraw` function", () => {
        it("Fail: Balance of user is not enough", async () => {
            await expect(cashToken.connect(user).withdraw(20)).to.be.revertedWith("Current balance is not enough");
        });

        it("Fail: Balance of user is not enough", async () => {
            await cashToken.connect(user).buy({
                value: ethers.utils.parseEther("10"),
            });
            await expect(cashToken.connect(user).withdraw(200)).to.be.revertedWith("Current balance is not enough");
        });

        it("Should be ok: User withdraw successfully", async () => {
            await cashToken.connect(user).buy({
                value: ethers.utils.parseEther("20"),
            });

            await expect(cashToken.connect(user).withdraw(50)).to.changeTokenBalance(cashToken, user.address, -50);
            await expect(cashToken.connect(user).withdraw(50)).to.changeEtherBalances(
                [cashToken.address, user.address],
                [ethers.utils.parseEther("-5"), ethers.utils.parseEther("5")]
            );
        });
    });
});
