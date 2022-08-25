const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing Ticket contract", function () {
    beforeEach(async () => {
        [user1, user2] = await ethers.getSigners();
        const Ticket = await ethers.getContractFactory("Ticket");

        ticket = await Ticket.deploy();
    });

    describe("Testing `buy` function", () => {
        it("Fail: Check user buy more than 2 tickets", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await expect(
                ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.1"),
                })
            ).to.be.revertedWith("This user has already bought ticket!");
        });

        it("Fail: User does not pay enough fee (0.1 eth)", async () => {
            await expect(
                ticket.connect(user1).buy({
                    value: ethers.utils.parseEther("0.09"),
                })
            ).to.be.revertedWith("User must pay 0.1 eth to buy a ticket!");
        });

        it("Should be ok: Buy ticket successfully", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            const latestedTicketId1 = await ticket.latestedTicket();
            const user1TicketId = await ticket.getTicketId(user1.address);
            expect(user1TicketId, "ticketId of user1 must be equal to latestedTicketId1").to.equal(latestedTicketId1);

            await ticket.connect(user2).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            const latestedTicketId2 = await ticket.latestedTicket();
            const user2TicketId = await ticket.getTicketId(user2.address);

            expect(user2TicketId, "ticketId of user2 must be equal to latestedTicketId2").to.equal(latestedTicketId2);
        });
    });

    describe("Testing `subtractTimes` function", () => {
        it("Fail: Can not subtract times when user does not have ticket", async () => {
            await expect(ticket.connect(user1).subtractTimes(user1.address)).to.be.revertedWith(
                "This user has not bought ticket!"
            );
        });

        it("Fail: Subtract times when ticket expired", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);

            await expect(ticket.subtractTimes(user1.address)).to.be.revertedWith("This ticket has expired!");
        });

        it("Should be ok: Subtract times successfully", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await ticket.subtractTimes(user1.address);

            expect(await ticket.getTicketTimes(user1.address)).to.equal(2);
        });
    });

    describe("Testing `extendTicket` function", () => {
        it("Fail: User has not bought ticket", async () => {
            await expect(
                ticket.connect(user1).extendTicket({
                    value: ethers.utils.parseEther("0.1"),
                })
            ).to.be.revertedWith("This user has not bought ticket!");
        });

        it("Fail: User ticket has not been expired", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await expect(
                ticket.connect(user1).extendTicket({
                    value: ethers.utils.parseEther("0.1"),
                })
            ).to.be.revertedWith("This ticket has not been expired!");

            await ticket.connect(user2).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await ticket.subtractTimes(user2.address);
            await expect(
                ticket.connect(user2).extendTicket({
                    value: ethers.utils.parseEther("0.1"),
                })
            ).to.be.revertedWith("This ticket has not been expired!");
        });

        it("Fail: User must pay enough 0.1 eth to extend ticket", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);

            expect(await ticket.isExpired(user1.address)).to.equal(true);
            await expect(
                ticket.connect(user1).extendTicket({
                    value: ethers.utils.parseEther("0.09"),
                })
            ).to.be.revertedWith("User must pay 0.1 eth to buy a ticket!");
        });

        it("Should be ok: User extends ticket successful", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);

            expect(await ticket.isExpired(user1.address)).to.equal(true);
            await ticket.connect(user1).extendTicket({
                value: ethers.utils.parseEther("0.1"),
            });
            expect(await ticket.isExpired(user1.address)).to.equal(false);
        });
    });

    describe("Testing `isExpired` function", () => {
        it("Fail: User has not bought ticket", async () => {
            await expect(ticket.connect(user1).isExpired(user1.address)).to.be.revertedWith(
                "This user has not bought ticket!"
            );
        });

        it("Should be ok: Ticket of user is not expired", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            expect(await ticket.isExpired(user1.address)).to.be.equal(false);
        });

        it("Should be ok: Ticket of user is not expired after betting 2 times", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);
            expect(await ticket.isExpired(user1.address)).to.be.equal(false);
        });

        it("Should be ok: Ticket of user is expired after betting 3 times", async () => {
            await ticket.connect(user1).buy({
                value: ethers.utils.parseEther("0.1"),
            });
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);
            await ticket.subtractTimes(user1.address);
            expect(await ticket.isExpired(user1.address)).to.be.equal(true);
        });
    });
});
