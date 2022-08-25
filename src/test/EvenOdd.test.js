const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Test EvenOdd Contract", () => {
    async function deployContractFixture() {
        const [owner, user1, user2] = await ethers.getSigners();
        const CashContract = await ethers.getContractFactory("Cash");
        const cash = await CashContract.deploy();

        const TicketContract = await ethers.getContractFactory("Ticket");
        const ticket = await TicketContract.deploy();

        const EvenOddContract = await ethers.getContractFactory("EvenOdd");
        const evenOdd = await EvenOddContract.deploy(cash.address, ticket.address, {
            value: ethers.utils.parseEther("50"),
        });

        await cash.connect(user1).approve(evenOdd.address, ethers.utils.parseEther("30"));
        await cash.connect(user2).approve(evenOdd.address, ethers.utils.parseEther("30"));

        // Fixtures can return anything you consider useful for your tests
        return {
            owner,
            user1,
            user2,
            cash,
            ticket,
            evenOdd,
        };
    }

    describe("Testing contract after deploy", () => {
        it("Should be ok: Check owner", async function () {
            const { owner, evenOdd, cash } = await loadFixture(deployContractFixture);
            expect(owner.address).to.equal(await evenOdd.owner());
        });
    });

    describe("Testing `bet` function", () => {
        describe("Checking ticket of user", () => {
            it("Fail: Can not bet because user have not bought ticket", async () => {
                const { user1, evenOdd } = await loadFixture(deployContractFixture);
                await expect(evenOdd.connect(user1).bet(true, 2)).to.be.revertedWith(
                    "This user does not have ticket. Please buy a one to play"
                );
            });

            it("Fail: Can not bet because ticket of user is expired", async () => {
                const { user1, evenOdd, ticket } = await loadFixture(deployContractFixture);
                await ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.1"),
                });

                await ticket.subtractTimes(user1.address);
                await ticket.subtractTimes(user1.address);
                await ticket.subtractTimes(user1.address);

                await expect(evenOdd.connect(user1).bet(true, 2)).to.be.revertedWith(
                    "This user's ticket is expired. Please buy a new one to play"
                );
            });
        });

        describe("Checking that user has already bet", () => {
            it("Fail: Can not bet because this user has bet before", async () => {
                const { user1, evenOdd, ticket, cash } = await loadFixture(deployContractFixture);

                await ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.1"),
                });

                await cash.connect(user1).buy({
                    value: ethers.utils.parseEther("5"),
                });

                await evenOdd.connect(user1).bet(false, 10);

                await expect(evenOdd.connect(user1).bet(true, 5)).to.be.revertedWith("This user has bet before!");
            });
        });

        describe("Checking the cash balance is enough to bet", () => {
            it("Fail: Can not bet because the balance of user is not enough", async () => {
                const { user1, evenOdd, ticket, cash } = await loadFixture(deployContractFixture);

                await ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.1"),
                });

                await cash.connect(user1).buy({
                    value: ethers.utils.parseEther("1"),
                });

                await expect(evenOdd.connect(user1).bet(true, 11)).to.be.revertedWith(
                    "User's balance is not enough to bet"
                );
            });

            it("Fail: Can not bet because the balance of contract is not enough", async () => {
                const { user1, evenOdd, ticket, cash } = await loadFixture(deployContractFixture);

                await ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.1"),
                });

                await cash.connect(user1).buy({
                    value: ethers.utils.parseEther("51"),
                });

                await expect(evenOdd.connect(user1).bet(true, 501)).to.be.revertedWith(
                    "Contract is not enough cash to reward if user win"
                );
            });

            it("Fail: Can not bet because the balance of contract is not enough", async () => {
                const { user1, user2, evenOdd, ticket, cash } = await loadFixture(deployContractFixture);

                await ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.1"),
                });

                await cash.connect(user1).buy({
                    value: ethers.utils.parseEther("30"),
                });
                await evenOdd.connect(user1).bet(true, 300);

                await ticket.connect(user2).buy({
                    value: ethers.utils.parseEther("0.1"),
                });

                await cash.connect(user2).buy({
                    value: ethers.utils.parseEther("30"),
                });

                await expect(evenOdd.connect(user2).bet(true, 300)).to.be.revertedWith(
                    "Contract is not enough cash to reward if user win"
                );
            });
        });

        describe("Betting successfully", () => {
            it("Should be ok: User betting successfully", async () => {
                const { cash, evenOdd, ticket, user1 } = await loadFixture(deployContractFixture);
                await ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.1"),
                });
                await cash.connect(user1).buy({
                    value: ethers.utils.parseEther("2"),
                });
                await expect(
                    evenOdd.connect(user1).bet(true, 10),
                    "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
                ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

                const userTicket = await ticket.ticketOf(user1.address);
                const latestedMatchId = await evenOdd.latestedMatchId();
                const player = await evenOdd.playerList(latestedMatchId, 0);

                expect(player.ticketId, "Player ticket id must be equal to user ticket id").to.equal(
                    userTicket.ticketId
                );
                expect(player.isOdd, "Value in match history must be the same as value the user has betted").to.equal(
                    true
                );
                expect(player.bet, "Token in match history must be the same as token the user has betted").to.equal(10);
            });
        });
    });

    describe("Testing `play` function", () => {
        it("Fail: Only owner can play", async () => {
            const { user1, evenOdd } = await loadFixture(deployContractFixture);
            expect(await evenOdd.play());
            await expect(evenOdd.connect(user1).play()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should be ok: Match id is increased after play a game", async () => {
            const { user1, evenOdd, cash, ticket } = await loadFixture(deployContractFixture);

            const beforeMatchId = await evenOdd.latestedMatchId();

            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await cash.connect(user1).buy({
                value: ethers.utils.parseEther("5"),
            });

            await evenOdd.connect(user1).bet(true, 10);
            await evenOdd.play();

            const afterMatchId = await evenOdd.latestedMatchId();
            expect(afterMatchId - beforeMatchId, "Match id must be increased after play").to.be.equal(1);
        });

        it("Should be ok: Blance of user is increased/descreased after play", async () => {
            const { user1, user2, evenOdd, cash, ticket } = await loadFixture(deployContractFixture);

            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await cash.connect(user1).buy({
                value: ethers.utils.parseEther("5"),
            });
            await evenOdd.connect(user1).bet(true, 20);

            await ticket.connect(user2).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await cash.connect(user2).buy({
                value: ethers.utils.parseEther("5"),
            });
            await evenOdd.connect(user2).bet(false, 20);

            const latestedMatchId = await evenOdd.latestedMatchId();
            await evenOdd.play();

            const currentMatch = await evenOdd.matchList(latestedMatchId);
            const isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
            let balanceOfUser1 = ethers.BigNumber.from(30);
            let balanceOfUser2 = ethers.BigNumber.from(30);

            if (isOdd) {
                balanceOfUser1 = balanceOfUser1.add(40);
            } else {
                balanceOfUser2 = balanceOfUser2.add(40);
            }

            expect(await cash.balanceOf(user1.address)).to.equal(balanceOfUser1);
            expect(await cash.balanceOf(user2.address)).to.equal(balanceOfUser2);
        });
    });
});
