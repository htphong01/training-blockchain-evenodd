const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Testing Ticket contract', function () {
    beforeEach(async () => {
        const Ticket = await ethers.getContractFactory('Ticket');
        const TicketManager = await ethers.getContractFactory('TicketManager');

        [owner, user1, user2] = await ethers.getSigners();

        ticket = await Ticket.deploy();
        ticketManager = await TicketManager.deploy(ticket.address);

        await ticket.connect(owner).setOwner(ticketManager.address);
    });

    describe('Testing `buy` function', () => {
        it('[Fail]: Check user buy more than 2 tickets', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });

            await expect(
                ticketManager.connect(user1).buy({
                    value: 10,
                })
            ).to.be.revertedWith('This user has already bought ticket!');
        });

        it('[Fail]: User does not pay enough fee (10 wei)', async () => {
            await expect(
                ticketManager.connect(user1).buy({
                    value: 9,
                })
            ).to.be.revertedWith('User must pay 10 wei to buy a ticket!');
        });

        it('[OK]: Buy ticket successfully', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            const latestedTicketId1 = await ticketManager.latestedTicket();
            const user1TicketId = await ticketManager.getTicketId(user1.address);
            expect(user1TicketId, 'ticketId of user1 must be equal to latestedTicketId1').to.equal(latestedTicketId1);

            await ticketManager.connect(user2).buy({
                value: 10,
            });
            const latestedTicketId2 = await ticketManager.latestedTicket();
            const user2TicketId = await ticketManager.getTicketId(user2.address);

            expect(user2TicketId, 'ticketId of user2 must be equal to latestedTicketId2').to.equal(latestedTicketId2);
        });
    });

    describe('Testing `subtractTimes` function', () => {
        it('[Fail]: Can not subtract times when user does not have ticket', async () => {
            await expect(ticketManager.connect(user1).subtractTimes(user1.address)).to.be.revertedWith(
                'This user has not bought ticket!'
            );
        });

        it('[Fail]: Subtract times when ticket expired', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);

            await expect(ticketManager.subtractTimes(user1.address)).to.be.revertedWith('This ticket has expired!');
        });

        it('[OK]: Subtract times successfully', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await ticketManager.subtractTimes(user1.address);

            expect(await ticketManager.getTicketTimes(user1.address)).to.equal(2);
        });
    });

    describe('Testing `extendTicket` function', () => {
        it('[Fail]: User has not bought ticket', async () => {
            await expect(
                ticketManager.connect(user1).extendTicket({
                    value: 10,
                })
            ).to.be.revertedWith('This user has not bought ticket!');
        });

        it('[Fail]: User ticket has not been expired', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await expect(
                ticketManager.connect(user1).extendTicket({
                    value: 10,
                })
            ).to.be.revertedWith('This ticket has not been expired!');

            await ticketManager.connect(user2).buy({
                value: 10,
            });
            await ticketManager.subtractTimes(user2.address);
            await expect(
                ticketManager.connect(user2).extendTicket({
                    value: 10,
                })
            ).to.be.revertedWith('This ticket has not been expired!');
        });

        it('[Fail]: User must pay 10 wei to buy a ticket!', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);

            expect(await ticketManager.isExpired(user1.address)).to.equal(true);
            await expect(
                ticketManager.connect(user1).extendTicket({
                    value: ethers.utils.parseEther('0.09'),
                })
            ).to.be.revertedWith('User must pay 10 wei to buy a ticket!');
        });

        it('[OK]: User extends ticket successful', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);

            expect(await ticketManager.isExpired(user1.address)).to.equal(true);
            await ticketManager.connect(user1).extendTicket({
                value: 10,
            });
            expect(await ticketManager.isExpired(user1.address)).to.equal(false);
        });
    });

    describe('Testing `isExpired` function', () => {
        it('[Fail]: User has not bought ticket', async () => {
            await expect(ticketManager.connect(user1).isExpired(user1.address)).to.be.revertedWith(
                'This user has not bought ticket!'
            );
        });

        it('[OK]: Ticket of user is not expired', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            expect(await ticketManager.isExpired(user1.address)).to.be.equal(false);
        });

        it('[OK]: Ticket of user is not expired after betting 2 times', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            expect(await ticketManager.isExpired(user1.address)).to.be.equal(false);
        });

        it('[OK]: Ticket of user is expired after betting 3 times', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            expect(await ticketManager.isExpired(user1.address)).to.be.equal(true);
        });
    });
});
