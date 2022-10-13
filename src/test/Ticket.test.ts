import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
    Ticket__factory,
    TicketManager__factory,
    Cash__factory,
    CashManager__factory,
    Ticket,
    TicketManager,
    Cash,
    CashManager,
} from '../typechain-types';

describe('Testing Ticket contract', function () {
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;

    let TicketFactory: Ticket__factory;
    let TicketManagerFactory: TicketManager__factory;
    let CashFactory: Cash__factory;
    let CashManagerFactory: CashManager__factory;

    let ticket: Ticket;
    let ticketManager: TicketManager;
    let cash: Cash;
    let cashManager: CashManager;

    let pricePerTime: BigNumber;

    before(async () => {
        CashFactory = (await ethers.getContractFactory('Cash')) as Cash__factory;
        CashManagerFactory = (await ethers.getContractFactory('CashManager')) as CashManager__factory;
        TicketFactory = (await ethers.getContractFactory('Ticket')) as Ticket__factory;
        TicketManagerFactory = (await ethers.getContractFactory('TicketManager')) as TicketManager__factory;
    });

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        cash = (await upgrades.deployProxy(CashFactory)) as Cash;
        await cash.deployed();

        cashManager = (await upgrades.deployProxy(CashManagerFactory, [cash.address])) as CashManager;
        await cashManager.deployed();

        ticket = (await upgrades.deployProxy(TicketFactory)) as Ticket;
        await ticket.deployed();

        await expect(
            upgrades.deployProxy(TicketManagerFactory, [user1.address, cashManager.address])
        ).to.be.revertedWith('Invalid Ticket contract');

        await expect(upgrades.deployProxy(TicketManagerFactory, [ticket.address, user1.address])).to.be.revertedWith(
            'Invalid Cash contract'
        );

        ticketManager = (await upgrades.deployProxy(TicketManagerFactory, [
            ticket.address,
            cashManager.address,
        ])) as TicketManager;
        await ticketManager.deployed();
        await ticket.connect(owner).transferOwnership(ticketManager.address);

        pricePerTime = await ticketManager.pricePerTime();
    });

    describe('Testing `buy` function', () => {
        it('[Fail]: Check user buy 0 times', async () => {
            await expect(
                ticketManager.connect(user1).buy(0, {
                    value: 0,
                })
            ).to.be.revertedWith('Invalid times!');
        });

        it('[Fail]: User does not pay enough fee', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3).sub(1),
                })
            ).to.be.revertedWith('Invalid fee!');
        });

        it('[Fail]: Check user buy more than 2 tickets', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: pricePerTime.mul(3),
            });

            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                })
            ).to.be.revertedWith('Already bought ticket!');
        });

        it('[OK]: Buy ticket successfully', async () => {
            await expect(
                ticketManager.connect(user1).buy(10, {
                    value: pricePerTime.mul(10),
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 10, 1);

            const lastTicketId1 = await ticketManager.lastTicket();
            const user1TicketId = (await ticketManager.ticketOf(user1.address)).ticketId;
            expect(user1TicketId, 'ticketId of user1 must be equal to lastTicketId1').to.equal(lastTicketId1);

            await expect(
                ticketManager.connect(user2).buy(3, {
                    value: pricePerTime.mul(3),
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user2.address, 3, +lastTicketId1 + 1);

            const lastTicketId2 = await ticketManager.lastTicket();
            const user2TicketId = (await ticketManager.ticketOf(user2.address)).ticketId;

            expect(user2TicketId, 'ticketId of user2 must be equal to lastTicketId2').to.equal(lastTicketId2);
        });
    });

    describe('Testing `subtractTimes` function', () => {
        it('[Fail]: The caller is not owner', async () => {
            await expect(ticketManager.connect(user1).subtractTimes(user1.address)).to.be.revertedWith(
                'Ownable: caller is not the owner'
            );
        });

        it('[Fail]: Substract for zero address', async () => {
            await expect(ticketManager.connect(owner).subtractTimes(ethers.constants.AddressZero)).to.be.revertedWith(
                'Invalid address!'
            );
        });

        it('[Fail]: Can not subtract times when user does not have ticket', async () => {
            await expect(ticketManager.connect(owner).subtractTimes(user1.address)).to.be.revertedWith(
                'Invalid ticket!'
            );
        });

        it('[Fail]: Subtract times when ticket is out of times', async () => {
            await expect(
                ticketManager.connect(user1).buy(4, {
                    value: pricePerTime.mul(4),
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 4, 1);

            await expect(await ticketManager.connect(owner).subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 3);

            await expect(await ticketManager.connect(owner).subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 2);

            await expect(await ticketManager.connect(owner).subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 1);

            await expect(await ticketManager.connect(owner).subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 0);

            await expect(ticketManager.connect(owner).subtractTimes(user1.address)).to.be.revertedWith(
                'Ticket is out of times!'
            );
        });

        it('[OK]: Subtract times successfully', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 3, 1);

            await expect(await ticketManager.connect(owner).subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 2);

            expect((await ticketManager.ticketOf(user1.address)).times).to.equal(2);
        });
    });

    describe('Testing `extendTicket`,  function', () => {
        it('[Fail]: User extends 0 times', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 3, 1);

            await expect(
                ticketManager.connect(user1).extendTicket(0, {
                    value: 0,
                })
            ).to.be.revertedWith('Invalid times!');

            await expect(
                ticketManager.connect(user2).buy(7, {
                    value: pricePerTime.mul(7),
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user2.address, 7, 2);

            await expect(await ticketManager.connect(owner).subtractTimes(user2.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user2.address, 6);

            await expect(
                ticketManager.connect(user2).extendTicket(0, {
                    value: 0,
                })
            ).to.be.revertedWith('Invalid times!');
        });

        it('[Fail]: User must pay enough fee!', async () => {
            await expect(
                ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
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

            expect((await ticketManager.ticketOf(user1.address)).times.toNumber() == 0).to.equal(true);
            await expect(
                ticketManager.connect(user1).extendTicket(3, {
                    value: pricePerTime.mul(3).add(1),
                })
            ).to.be.revertedWith('Invalid fee!');
        });

        it('[Fail]: User has not bought ticket', async () => {
            await expect(
                ticketManager.connect(user1).extendTicket(3, {
                    value: pricePerTime.mul(3),
                })
            ).to.be.revertedWith('Invalid ticket!');
        });

        it('[OK]: User extends ticket after outing of times', async () => {
            await expect(
                ticketManager.connect(user1).buy(4, {
                    value: pricePerTime.mul(4),
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

            expect((await ticketManager.ticketOf(user1.address)).times.toNumber() == 0).to.equal(true);

            await expect(
                ticketManager.connect(user1).extendTicket(5, {
                    value: pricePerTime.mul(5),
                })
            )
                .to.emit(ticketManager, 'ExtendedTicket')
                .withArgs(user1.address, 5);
            expect((await ticketManager.ticketOf(user1.address)).times.toNumber() == 0).to.equal(false);
            const userRemainingTimes = (await ticketManager.ticketOf(user1.address)).times;
            expect(userRemainingTimes).to.equal(5);
        });

        it('[OK] User extends ticket when ticket is not expired', async () => {
            await expect(
                ticketManager.connect(user1).buy(4, {
                    value: pricePerTime.mul(4),
                })
            )
                .to.emit(ticketManager, 'Bought')
                .withArgs(user1.address, 4, 1);

            await expect(await ticketManager.subtractTimes(user1.address))
                .to.emit(ticketManager, 'SubTractedTimes')
                .withArgs(user1.address, 3);

            await expect(
                ticketManager.connect(user1).extendTicket(5, {
                    value: pricePerTime.mul(5),
                })
            )
                .to.emit(ticketManager, 'ExtendedTicket')
                .withArgs(user1.address, 5);

            const userRemainingTimes = (await ticketManager.ticketOf(user1.address)).times;
            expect(userRemainingTimes).to.equal(8);
        });
    });

    describe('Testing `setPricePerTime` function', () => {
        it('[Fail]: New price is equal to 0', async () => {
            await expect(ticketManager.setPricePerTime(0)).to.be.revertedWith('New price must be greater than 0!');
        });

        it('[OK] Set new price successfully', async () => {
            await expect(ticketManager.setPricePerTime(5)).to.be.emit(ticketManager, 'SetPricePerTime').withArgs(5);
            expect(await ticketManager.pricePerTime()).to.equal(5);
        });
    });

    describe('Testing `withdrawToDeployer` function', () => {
        it('[Fail]: Not deployer withdraw', async () => {
            await expect(ticketManager.connect(user1).withdrawToDeployer()).to.be.revertedWith('Not allowed!');
        });

        it('[OK] Withdraw successfully', async () => {
            await ticketManager.connect(user1).buy(10, {
                value: pricePerTime.mul(10),
            })

            await expect(ticketManager.connect(owner).withdrawToDeployer())
                .to.be.emit(ticketManager, 'WithdrawnToDeployer')
                .withArgs(owner.address, pricePerTime.mul(10));
            expect(await ethers.provider.getBalance(ticketManager.address)).to.equal(0);
        });
    });
});
