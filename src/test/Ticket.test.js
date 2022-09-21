const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

describe.only('Testing Ticket contract', function () {
    before(async () => {
        Ticket = await ethers.getContractFactory('Ticket');
        TicketManager = await ethers.getContractFactory('TicketManager');
    });

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        ticket = await upgrades.deployProxy(Ticket);
        await ticket.deployed();

        ticketManager = await upgrades.deployProxy(TicketManager, [ticket.address]);
        await ticketManager.deployed();

        await ticket.connect(owner).transferOwnership(ticketManager.address);
    });

    describe('Testing `buy` function', () => {
        it('[Fail]: Check user buy 0 times', async () => {
            await expect(
                ticketManager.connect(user1).buy(0, {
                    value: 0,
                })
            ).to.be.revertedWith('The times must be greater than 0!');
        });

        it('[Fail]: Check user buy more than 2 tickets', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });

            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: 6,
                })
            ).to.be.revertedWith('This user has already bought ticket!');
        });

        it('[Fail]: User does not pay enough fee', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: 9,
                })
            ).to.be.revertedWith('User must pay enough fee!');
        });

        it('[OK]: Buy ticket successfully', async () => {
            await expect(
                ticketManager.connect(user1).buy(10, {
                    value: 20,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 10, 1);

            const lastTicketId1 = await ticketManager.lastTicket();
            const user1TicketId = await ticketManager.getTicketId(user1.address);
            expect(user1TicketId, 'ticketId of user1 must be equal to lastTicketId1').to.equal(lastTicketId1);

            await expect(
                ticketManager.connect(user2).buy(3, {
                    value: 6,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user2.address, 3, +lastTicketId1 + 1);

            const lastTicketId2 = await ticketManager.lastTicket();
            const user2TicketId = await ticketManager.getTicketId(user2.address);

            expect(user2TicketId, 'ticketId of user2 must be equal to lastTicketId2').to.equal(lastTicketId2);
        });
    });

    describe('Testing `subtractTimes` function', () => {
        it('[Fail]: Can not subtract times for account with address(0)', async () => {
            await expect(ticketManager.subtractTimes(ethers.constants.AddressZero)).to.be.revertedWith(
                'The address of account is not valid!'
            );
        });

        it('[Fail]: Can not subtract times when user does not have ticket', async () => {
            await expect(ticketManager.connect(user1).subtractTimes(user1.address)).to.be.revertedWith(
                'This user has not bought ticket!'
            );
        });

        it('[Fail]: Subtract times when ticket expired', async () => {
            await expect(
                ticketManager.connect(user1).buy(5, {
                    value: 10,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 5, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 4);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 3);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 2);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 0);

            await expect(ticketManager.subtractTimes(user1.address)).to.be.revertedWith('This ticket has expired!');
        });

        it('[OK]: Subtract times successfully', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: 6,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 3, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 2);

            expect(await ticketManager.getTicketTimes(user1.address)).to.equal(2);
        });
    });

    describe('Testing `extendTicket`,  function', () => {
        it('[Fail]: User has not bought ticket', async () => {
            await expect(
                ticketManager.connect(user1).extendTicket(3, {
                    value: 6,
                })
            ).to.be.revertedWith('This user has not bought ticket!');
        });

        it('[Fail]: User extends 0 times', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: 6,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 3, 1);

            await expect(
                ticketManager.connect(user1).extendTicket(0, {
                    value: 0,
                })
            ).to.be.revertedWith('The times must be greater than 0!');

            await expect(
                ticketManager.connect(user2).buy(7, {
                    value: 14,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user2.address, 7, 2);

            await expect(await ticketManager.subtractTimes(user2.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user2.address, 6);

            await expect(
                ticketManager.connect(user2).extendTicket(0, {
                    value: 0,
                })
            ).to.be.revertedWith('The times must be greater than 0!');
        });

        it('[Fail]: User must pay enough fee!', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: 6,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 3, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 2);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 0);

            expect(await ticketManager.isExpired(user1.address)).to.equal(true);
            await expect(
                ticketManager.connect(user1).extendTicket(3, {
                    value: 9,
                })
            ).to.be.revertedWith('User must pay enough fee!');
        });

        it('[OK]: User extends ticket after expired', async () => {
            await expect(
                ticketManager.connect(user1).buy(4, {
                    value: 8,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 4, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 3);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 2);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 0);

            expect(await ticketManager.isExpired(user1.address)).to.equal(true);

            await expect(
                ticketManager.connect(user1).extendTicket(5, {
                    value: 10,
                })
            )
                .to.emit(ticketManager, 'ExtendedTicket')
                .withArgs(user1.address, 5);
            expect(await ticketManager.isExpired(user1.address)).to.equal(false);
            const userRemainingTimes = (await ticketManager.ticketOf(user1.address)).times;
            expect(userRemainingTimes).to.equal(5);
        });

        it('[OK] User extends ticket when ticket is not expired', async () => {
            await expect(
                ticketManager.connect(user1).buy(4, {
                    value: 8,
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 4, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 3);

            await expect(
                ticketManager.connect(user1).extendTicket(5, {
                    value: 10,
                })
            )
                .to.emit(ticketManager, 'ExtendedTicket')
                .withArgs(user1.address, 8);

            const userRemainingTimes = (await ticketManager.ticketOf(user1.address)).times;
            expect(userRemainingTimes).to.equal(8);
        })
    });

    describe('Testing `isExpired` function', () => {
        it('[Fail]: Can not check Expired for account with address(0)', async () => {
            await expect(ticketManager.isExpired(ethers.constants.AddressZero)).to.be.revertedWith(
                'The address of account is not valid!'
            );
        });

        it('[Fail]: User has not bought ticket', async () => {
            await expect(ticketManager.connect(user1).isExpired(user1.address)).to.be.revertedWith(
                'This user has not bought ticket!'
            );
        });

        it('[OK]: Ticket of user is not expired', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });
            expect(await ticketManager.isExpired(user1.address)).to.be.equal(false);
        });

        it('[OK]: User buy ticket with 3 times, ticket of user is not expired after betting 2 times', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            expect(await ticketManager.isExpired(user1.address)).to.be.equal(false);
        });

        it('[OK]: User bought ticket with 3 times, ticket of user is expired after betting 3 times', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            await ticketManager.subtractTimes(user1.address);
            expect(await ticketManager.isExpired(user1.address)).to.be.equal(true);
        });
    });

    describe('Testing `setPricePerTime` function', () => {
        it('[Fail]: New price is equal to 0', async () => {
            await expect(ticketManager.setPricePerTime(0)).to.be.revertedWith('The new price must be greater than 0!');
        });

        it('[OK] Set new price successfully', async () => {
            await expect(ticketManager.setPricePerTime(5)).to.be.emit(ticketManager, 'SetPricePerTime').withArgs(5);
            expect(await ticketManager.pricePerTime()).to.equal(5);
        });
    });
});
