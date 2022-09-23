const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

describe('Test EvenOdd Contract', () => {
    before(async () => {
        Cash = await ethers.getContractFactory('Cash');
        CashManager = await ethers.getContractFactory('CashManager');
        Ticket = await ethers.getContractFactory('Ticket');
        TicketManager = await ethers.getContractFactory('TicketManager');
        EvenOdd = await ethers.getContractFactory('EvenOdd');
    });

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        cash = await upgrades.deployProxy(Cash);
        await cash.deployed();

        ticket = await upgrades.deployProxy(Ticket);
        await ticket.deployed();

        cashManager = await upgrades.deployProxy(CashManager, [cash.address]);
        await cashManager.deployed();

        ticketManager = await upgrades.deployProxy(TicketManager, [ticket.address]);
        await ticketManager.deployed();

        evenOdd = await upgrades.deployProxy(EvenOdd, [cash.address, cashManager.address, ticketManager.address]);
        await evenOdd.deployed();

        await cash.connect(owner).transferOwnership(cashManager.address);
        await ticket.connect(owner).transferOwnership(ticketManager.address);

        await expect(evenOdd.supplyToken({ value: ethers.utils.parseEther('5') }))
            .to.emit(evenOdd, 'SuppliedToken')
            .withArgs(owner.address, ethers.utils.parseEther('5'));

        await cash.connect(user1).approve(evenOdd.address, ethers.constants.MaxUint256);
        await cash.connect(user2).approve(evenOdd.address, ethers.constants.MaxUint256);
    });

    describe('Testing contract after deploy', () => {
        it('[OK]: Check owner', async function () {
            expect(owner.address).to.equal(await evenOdd.owner());
            expect(cashManager.address).to.equal(await cash.owner());
            expect(ticketManager.address).to.equal(await ticket.owner());
        });
    });

    describe('Testing `receive` function', () => {
        it('[Fail]: Send a transaction with 0 wei to evenOdd contract', async () => {
            tx = {
                to: evenOdd.address,
                value: 0
            };
            await expect(user1.sendTransaction(tx)).to.be.revertedWith('Value must be more than zero!')
        })

        it('[OK]: Send a transaction with 2 eth to evenOdd contract', async () => {
            tx = {
                to: evenOdd.address,
                value: ethers.utils.parseEther('2')
            };
            await expect(user1.sendTransaction(tx)).to.emit(evenOdd, 'Received').withArgs(user1.address, ethers.utils.parseEther('2'));
        })
    });

    describe('Testing `bet` function', () => {
        it('[Fail]: Can not bet because amount of cash not greater than 0', async () => {
            await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0'))).to.be.revertedWith(
                'Value must be more than zero!'
            );
        });

        describe('Checking ticket of user', () => {
            it('[Fail]: Can not bet because user have not bought ticket', async () => {
                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.1'))).to.be.revertedWith(
                    'This user does not have ticket. Please buy a one to play'
                );
            });

            it('[Fail]: Can not bet because ticket of user is expired', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: 6,
                });

                await ticketManager.subtractTimes(user1.address);
                await ticketManager.subtractTimes(user1.address);
                await ticketManager.subtractTimes(user1.address);

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.1'))).to.be.revertedWith(
                    'This ticket is out of times. Please buy some turns to play!'
                );
            });
        });

        describe('Checking that user has already bet', () => {
            it('[Fail]: Can not bet because this user has betted before', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: 6,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('0.5'),
                });

                await expect(evenOdd.connect(user1).bet(false, ethers.utils.parseEther('0.3')))
                    .to.emit(evenOdd, 'Betted')
                    .withArgs(user1.address, 0, ethers.utils.parseEther('0.3'));

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'))).to.be.revertedWith(
                    'This user has betted before!'
                );
            });
        });

        describe('Checking the cash balance is enough to bet', () => {
            it('[Fail]: Can not bet because the balance of user is not enough', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: 6,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('1'),
                });

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('1.1'))).to.be.revertedWith(
                    "User's balance is not enough to bet"
                );
            });

            it('[Fail]: Can not bet because the balance of contract is not enough', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: 6,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('5.1'),
                });

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('5.1'))).to.be.revertedWith(
                    'Contract is not enough cash to reward if user win'
                );
            });

            it('[Fail]: Can not bet because the balance of contract is not enough', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: 6,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('3'),
                });
                await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('3'));

                await ticketManager.connect(user2).buy(3, {
                    value: 6,
                });

                await cashManager.connect(user2).buy({
                    value: ethers.utils.parseEther('3'),
                });

                await expect(evenOdd.connect(user2).bet(true, ethers.utils.parseEther('3'))).to.be.revertedWith(
                    'Contract is not enough cash to reward if user win'
                );
            });
        });

        describe(' Betting successfully', () => {
            it('[OK]: User betting successfully', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: 6,
                });
                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('2'),
                });
                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('1')))
                    .to.changeTokenBalances(
                        cash,
                        [evenOdd.address, user1.address],
                        [ethers.utils.parseEther('1'), ethers.utils.parseEther('-1')]
                    )
                    .to.emit(evenOdd, 'Betted')
                    .withArgs(user1.address, 0, ethers.utils.parseEther('1'));

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
                    ethers.utils.parseEther('1')
                );
            });
        });
    });

    describe('Testing `play` function', () => {
        it('[Fail]: Only owner can play', async () => {
            expect(await evenOdd.play());
            await expect(evenOdd.connect(user1).play()).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('[OK]: Match id is increased after play a game', async () => {
            const beforeMatchId = await evenOdd.lastMatch();

            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });
            await cashManager.connect(user1).buy({
                value: ethers.utils.parseEther('0.5'),
            });

            await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'));
            await evenOdd.play();

            const afterMatchId = await evenOdd.lastMatch();
            expect(afterMatchId - beforeMatchId, 'Match id must be increased after play').to.be.equal(1);
        });
    });

    describe('Tesing `withdraw` function', () => {
        it('[Fail] Player withdraw an invalid match', async () => {
            await expect(evenOdd.connect(user1).withdraw(0)).to.be.revertedWith('Match is not valid!');
        });

        it('[Fail] Player withdraw after betting', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });
            await cashManager.connect(user1).buy({
                value: ethers.utils.parseEther('0.5'),
            });
            await evenOdd.connect(user1).bet(false, ethers.utils.parseEther('0.2'));

            await expect(evenOdd.connect(user1).withdraw(0)).to.be.revertedWith('Match is not valid!');
        })

        it('[Fail] Player withdraw 1 game more than 2 times', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });
            await cashManager.connect(user1).buy({
                value: ethers.utils.parseEther('0.5'),
            });
            await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'));

            await ticketManager.connect(user2).buy(3, {
                value: 6,
            });
            await cashManager.connect(user2).buy({
                value: ethers.utils.parseEther('0.5'),
            });
            await evenOdd.connect(user2).bet(false, ethers.utils.parseEther('0.2'));

            const lastMatch = await evenOdd.lastMatch();
            await evenOdd.play();

            const currentMatch = await evenOdd.matchList(lastMatch);
            const isOdd = currentMatch.isOdd;

            if (isOdd) {
                await evenOdd.connect(user1).withdraw(lastMatch);
                await expect(evenOdd.connect(user1).withdraw(lastMatch)).to.be.revertedWith(
                    'Player has been withdrawn this game!'
                );
            } else {
                await evenOdd.connect(user2).withdraw(lastMatch);
                await expect(evenOdd.connect(user1).withdraw(lastMatch)).to.be.revertedWith(
                    'Player does not win this game!'
                );
            }
        });

        it('[Fail] Player does not win but still withdraw', async () => {
            it('[OK]: Balance of user is increased/descreased after play', async () => {
                await ticketManager.connect(user1).buy(3, {
                    value: 6,
                });
                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('0.5'),
                });
                await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'));

                await ticketManager.connect(user2).buy(3, {
                    value: 6,
                });
                await cashManager.connect(user2).buy({
                    value: ethers.utils.parseEther('0.5'),
                });
                await evenOdd.connect(user2).bet(false, ethers.utils.parseEther('0.2'));

                const lastMatch = await evenOdd.lastMatch();
                await evenOdd.play();

                const currentMatch = await evenOdd.matchList(lastMatch);
                const isOdd = currentMatch.isOdd;

                if (isOdd) {
                    await expect(evenOdd.connect(user2).withdraw(lastMatch)).to.be.revertedWith(
                        'Player does not win this game!'
                    );
                } else {
                    await expect(evenOdd.connect(user1).withdraw(lastMatch)).to.be.revertedWith(
                        'Player does not win this game!'
                    );
                }
            });
        });

        it('[OK]: User withdraw after ending game', async () => {
            await ticketManager.connect(user1).buy(3, {
                value: 6,
            });
            await cashManager.connect(user1).buy({
                value: ethers.utils.parseEther('0.5'),
            });
            await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'));

            await ticketManager.connect(user2).buy(3, {
                value: 6,
            });
            await cashManager.connect(user2).buy({
                value: ethers.utils.parseEther('0.5'),
            });
            await evenOdd.connect(user2).bet(false, ethers.utils.parseEther('0.2'));

            const lastMatch = await evenOdd.lastMatch();
            await evenOdd.play();

            const currentMatch = await evenOdd.matchList(lastMatch);
            const isOdd = currentMatch.isOdd;
            let balanceOfUser1 = ethers.BigNumber.from(ethers.utils.parseEther('0.3'));
            let balanceOfUser2 = ethers.BigNumber.from(ethers.utils.parseEther('0.3'));

            if (isOdd) {
                balanceOfUser1 = balanceOfUser1.add(ethers.utils.parseEther('0.4'));
                await expect(evenOdd.connect(user1).withdraw(lastMatch))
                    .to.emit(evenOdd, 'WithDrawn')
                    .withArgs(user1.address, lastMatch, ethers.utils.parseEther('0.4'));
            } else {
                balanceOfUser2 = balanceOfUser2.add(ethers.utils.parseEther('0.4'));
                await expect(evenOdd.connect(user2).withdraw(lastMatch))
                    .to.emit(evenOdd, 'WithDrawn')
                    .withArgs(user2.address, lastMatch, ethers.utils.parseEther('0.4'));
            }

            expect(await cash.balanceOf(user1.address)).to.equal(balanceOfUser1);
            expect(await cash.balanceOf(user2.address)).to.equal(balanceOfUser2);
        });
    });
});
