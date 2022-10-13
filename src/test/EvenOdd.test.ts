import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { BigNumber } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import {
    Cash__factory,
    CashManager__factory,
    Ticket__factory,
    TicketManager__factory,
    EvenOdd__factory,
    Cash,
    CashManager,
    Ticket,
    TicketManager,
    EvenOdd,
} from '../typechain-types';

describe('Test EvenOdd Contract', () => {
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;

    let CashFactory: Cash__factory;
    let CashManagerFactory: CashManager__factory;
    let TicketFactory: Ticket__factory;
    let TicketManagerFactory: TicketManager__factory;
    let EvenOddFactory: EvenOdd__factory;

    let cash: Cash;
    let cashManager: CashManager;
    let ticket: Ticket;
    let ticketManager: TicketManager;
    let evenOdd: EvenOdd;

    let decimals: number;
    let pricePerTime: BigNumber;
    let ethToCash: number;

    before(async () => {
        CashFactory = (await ethers.getContractFactory('Cash')) as Cash__factory;
        CashManagerFactory = (await ethers.getContractFactory('CashManager')) as CashManager__factory;
        TicketFactory = (await ethers.getContractFactory('Ticket')) as Ticket__factory;
        TicketManagerFactory = (await ethers.getContractFactory('TicketManager')) as TicketManager__factory;
        EvenOddFactory = (await ethers.getContractFactory('EvenOdd')) as EvenOdd__factory;
    });

    beforeEach(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners();

        cash = (await upgrades.deployProxy(CashFactory)) as Cash;
        await cash.deployed();

        cashManager = (await upgrades.deployProxy(CashManagerFactory, [cash.address])) as CashManager;
        await cashManager.deployed();
        
        ticket = (await upgrades.deployProxy(TicketFactory)) as Ticket;
        await ticket.deployed();

        ticketManager = (await upgrades.deployProxy(TicketManagerFactory, [
            ticket.address,
            cashManager.address,
        ])) as TicketManager;
        await ticketManager.deployed();

        await expect(
            upgrades.deployProxy(EvenOddFactory, [user1.address, cashManager.address, ticketManager.address])
        ).to.be.revertedWith('Invalid Cash contract');
        await expect(
            upgrades.deployProxy(EvenOddFactory, [cash.address, user1.address, ticketManager.address])
        ).to.be.revertedWith('Invalid Cash Manager contract');
        await expect(
            upgrades.deployProxy(EvenOddFactory, [cash.address, cashManager.address, user1.address])
        ).to.be.revertedWith('Invalid Ticket Manager contract');

        evenOdd = (await upgrades.deployProxy(EvenOddFactory, [
            cash.address,
            cashManager.address,
            ticketManager.address,
        ])) as EvenOdd;
        await evenOdd.deployed();

        await cash.connect(owner).transferOwnership(cashManager.address);
        await ticket.connect(owner).transferOwnership(ticketManager.address);
        await ticketManager.connect(owner).transferOwnership(evenOdd.address);

        decimals = await cash.decimals();
        pricePerTime = await ticketManager.pricePerTime();
        ethToCash = (await cashManager.ethToCash()).toNumber();

        await expect(
            evenOdd.supplyToken({
                value: parseEther('2'),
            })
        )
            .to.emit(evenOdd, 'SuppliedToken')
            .withArgs(owner.address, 2 * ethToCash);

        await cash.connect(user1).approve(evenOdd.address, ethers.constants.MaxUint256);
        await cash.connect(user2).approve(evenOdd.address, ethers.constants.MaxUint256);
    });

    describe('Testing contract after deploy', () => {
        it('[OK]: Check owner', async function () {
            expect(owner.address).to.equal(await evenOdd.owner());
            expect(cashManager.address).to.equal(await cash.owner());
            expect(ticketManager.address).to.equal(await ticket.owner());
            expect(evenOdd.address).to.equal(await ticketManager.owner());
        });
    });

    describe('Testing `receive` function', () => {
        it('[Fail]: Send a transaction with 0 wei to evenOdd contract', async () => {
            const tx: TransactionRequest = {
                to: evenOdd.address,
                value: 0,
            };
            await expect(user1.sendTransaction(tx)).to.be.revertedWith('Invalid value!');
        });

        it('[OK]: Send a transaction with 2 eth to evenOdd contract', async () => {
            const tx: TransactionRequest = {
                to: evenOdd.address,
                value: parseEther('2'),
            };
            await expect(user1.sendTransaction(tx))
                .to.emit(evenOdd, 'Received')
                .withArgs(user1.address, parseEther('2'));
        });
    });

    describe('Testing `bet` function', () => {
        it('[Fail]: Can not bet because amount of cash not greater than 0', async () => {
            await expect(evenOdd.connect(user1).bet(true, 0)).to.be.revertedWith('Invalid value!');
        });

        describe('Checking ticket of user', () => {
            it('[Fail]: Can not bet because user have not bought ticket', async () => {
                await expect(evenOdd.connect(user1).bet(true, parseUnits('0.1', decimals))).to.be.revertedWith(
                    'Invalid ticket!'
                );
            });

            it('[Fail]: Can not bet because ticket of user is out of times', async () => {
                await ticketManager.connect(user1).buy(1, {
                    value: pricePerTime.mul(1),
                });

                await cashManager.connect(user1).buy({
                    value: parseEther('1'),
                });

                await evenOdd.connect(user1).bet(true, parseUnits('20', decimals));
                await evenOdd.play();

                await expect(evenOdd.connect(user1).bet(true, parseUnits('0.1', decimals))).to.be.revertedWith(
                    'Ticket is out of times!'
                );
            });
        });

        describe('Checking that user has already bet', () => {
            it('[Fail]: Can not bet because this user has betted before', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                });

                await cashManager.connect(user1).buy({
                    value: parseEther('1'),
                });

                await expect(evenOdd.connect(user1).bet(false, parseUnits('0.3', decimals)))
                    .to.emit(evenOdd, 'Betted')
                    .withArgs(user1.address, 0, false, parseUnits('0.3', decimals));

                await expect(evenOdd.connect(user1).bet(true, parseUnits('0.2', decimals))).to.be.revertedWith(
                    'Betted before!'
                );
            });
        });

        describe('Checking the cash balance is enough to bet', () => {
            it('[Fail]: Can not bet because the balance of user is not enough', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                });

                await cashManager.connect(user1).buy({
                    value: parseEther('0.001'),
                });

                await expect(evenOdd.connect(user1).bet(true, parseUnits('1.1', decimals))).to.be.revertedWith(
                    'Exceeds balance!'
                );
            });

            it('[Fail]: Can not bet because the balance of contract is not enough', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                });

                await cashManager.connect(user1).buy({
                    value: parseEther('2.1'),
                });

                await expect(evenOdd.connect(user1).bet(true, parseUnits(`${2.1 * ethToCash}`, decimals))).to.be.revertedWith(
                    'Not enough to reward!'
                );
            });

            it('[Fail]: Can not bet because the balance of contract is not enough', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                });

                await cashManager.connect(user1).buy({
                    value: parseEther('1'),
                });
                await evenOdd.connect(user1).bet(true, parseUnits('100', decimals));

                await ticketManager.connect(user2).buy(3, {
                    value: pricePerTime.mul(3),
                });

                await cashManager.connect(user2).buy({
                    value: parseEther('1.5'),
                });

                await expect(evenOdd.connect(user2).bet(true, parseUnits('150', decimals))).to.be.revertedWith(
                    'Not enough to reward!'
                );
            });
        });

        describe('Betting successfully', () => {
            it('[OK]: User betting successfully', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: pricePerTime.mul(3),
                });
                await cashManager.connect(user1).buy({
                    value: parseEther('1'),
                });

                await expect(evenOdd.connect(user1).bet(true, parseUnits('20', decimals)))
                    .to.changeTokenBalances(
                        cash,
                        [evenOdd.address, user1.address],
                        [parseUnits('20', decimals), parseUnits('-20', decimals)]
                    )
                    .to.emit(evenOdd, 'Betted')
                    .withArgs(user1.address, 0, true, parseUnits('20', decimals));

                const userTicket = await ticketManager.ticketOf(user1.address);
                const lastMatch = await evenOdd.lastMatch();
                const player = await evenOdd.playerList(lastMatch, userTicket.ticketId);

                expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(
                    userTicket.ticketId
                );
                expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(
                    true
                );
                expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(
                    parseUnits('20', decimals)
                );
            });
        });
    });

    describe('Testing `play` function', () => {
        it('[Fail]: Only owner can play', async () => {
            await expect(evenOdd.connect(user1).play()).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('[OK]: Match id is increased after play a game', async () => {
            const beforeMatchId = await evenOdd.lastMatch();

            await ticketManager.connect(user1).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user1).buy({
                value: parseEther('1'),
            });

            await evenOdd.connect(user1).bet(true, parseUnits('20', decimals));
            await evenOdd.play();

            const afterMatchId = await evenOdd.lastMatch();
            expect(afterMatchId.sub(beforeMatchId), 'Match id must be increased after play').to.be.equal(1);
        });
    });

    describe('Tesing `withdraw` function', () => {
        it('[Fail] Player withdraw an invalid match', async () => {
            await expect(evenOdd.connect(user1).withdraw(0)).to.be.revertedWith('Invalid match!');
        });

        it('[Fail] Player withdraw after betting', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user1).buy({
                value: parseEther('1'),
            });
            await evenOdd.connect(user1).bet(false, parseUnits('20', decimals));

            await expect(evenOdd.connect(user1).withdraw(0)).to.be.revertedWith('Invalid match!');
        });

        it('[Fail] Player withdraw 1 game more than 2 times', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user1).buy({
                value: parseEther('1'),
            });
            await evenOdd.connect(user1).bet(true, parseUnits('20', decimals));

            await ticketManager.connect(user2).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user2).buy({
                value: parseEther('1'),
            });

            await evenOdd.connect(user2).bet(false, parseUnits('20', decimals));

            const lastMatch = await evenOdd.lastMatch();
            await evenOdd.play();

            const currentMatch = await evenOdd.matchList(lastMatch);
            const isOdd = currentMatch.isOdd;

            if (isOdd) {
                await evenOdd.connect(user1).withdraw(lastMatch);
                await expect(evenOdd.connect(user1).withdraw(lastMatch)).to.be.revertedWith(
                    'Has been withdrawn this game!'
                );
            } else {
                await evenOdd.connect(user2).withdraw(lastMatch);
                await expect(evenOdd.connect(user2).withdraw(lastMatch)).to.be.revertedWith(
                    'Has been withdrawn this game!'
                );
            }
        });

        it('[Fail] Player does not win but still withdraw', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user1).buy({
                value: parseEther('1'),
            });
            await evenOdd.connect(user1).bet(true, parseUnits('20', decimals));

            await ticketManager.connect(user2).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user2).buy({
                value: parseEther('1'),
            });
            await evenOdd.connect(user2).bet(false, parseUnits('20', decimals));

            const lastMatch = await evenOdd.lastMatch();
            await evenOdd.play();

            const currentMatch = await evenOdd.matchList(lastMatch);
            const isOdd = currentMatch.isOdd;

            if (isOdd) {
                await expect(evenOdd.connect(user2).withdraw(lastMatch)).to.be.revertedWith('Does not win this game!');
            } else {
                await expect(evenOdd.connect(user1).withdraw(lastMatch)).to.be.revertedWith('Does not win this game!');
            }
        });

        it('[OK]: User withdraw after ending game', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user1).buy({
                value: parseEther('0.5'),
            });
            await evenOdd.connect(user1).bet(true, parseUnits('2.5', decimals));

            await ticketManager.connect(user2).buy(3, {
                value: pricePerTime.mul(3),
            });
            await cashManager.connect(user2).buy({
                value: parseEther('0.5'),
            });
            await evenOdd.connect(user2).bet(false, parseUnits('2.5', decimals));

            const lastMatch = await evenOdd.lastMatch();
            await evenOdd.play();

            const currentMatch = await evenOdd.matchList(lastMatch);
            const isOdd = currentMatch.isOdd;
            let balanceOfUser1 = parseUnits('47.5', decimals);
            let balanceOfUser2 = parseUnits('47.5', decimals);

            if (isOdd) {
                balanceOfUser1 = balanceOfUser1.add(parseUnits('5', decimals));
                await expect(evenOdd.connect(user1).withdraw(lastMatch))
                    .to.emit(evenOdd, 'WithDrawn')
                    .withArgs(user1.address, lastMatch, parseUnits('5', decimals));
            } else {
                balanceOfUser2 = balanceOfUser2.add(parseUnits('5', decimals));
                await expect(evenOdd.connect(user2).withdraw(lastMatch))
                    .to.emit(evenOdd, 'WithDrawn')
                    .withArgs(user2.address, lastMatch, parseUnits('5', decimals));
            }

            expect(await cash.balanceOf(user1.address)).to.equal(balanceOfUser1);
            expect(await cash.balanceOf(user2.address)).to.equal(balanceOfUser2);
        });
    });
});
