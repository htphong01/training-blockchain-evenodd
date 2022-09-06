const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('3. Test EvenOdd Contract', () => {
    beforeEach(async () => {
        Cash = await ethers.getContractFactory('Cash');
        CashManager = await ethers.getContractFactory('CashManager');
        Ticket = await ethers.getContractFactory('Ticket');
        TicketManager = await ethers.getContractFactory('TicketManager');
        EvenOdd = await ethers.getContractFactory('EvenOdd');

        [owner, user1, user2] = await ethers.getSigners();

        cash = await Cash.deploy();
        ticket = await Ticket.deploy();
        cashManager = await CashManager.deploy(cash.address);
        ticketManager = await TicketManager.deploy(ticket.address);

        evenOdd = await EvenOdd.deploy(cashManager.address, ticketManager.address);
        
        await cash.connect(owner).setOwner(cashManager.address);
        await ticket.connect(owner).setOwner(ticketManager.address);

        await evenOdd.supplyToken({ value: ethers.utils.parseEther('5') });

        await cash.connect(user1).approve(cashManager.address, ethers.constants.MaxUint256);
        await cash.connect(user2).approve(cashManager.address, ethers.constants.MaxUint256);
    });

    describe('3.1 Testing contract after deploy', () => {
        it('3.1.1 [OK]: Check owner', async function () {
            expect(owner.address).to.equal(await evenOdd.owner());
            expect(cashManager.address).to.equal(await cash.owner());
            expect(ticketManager.address).to.equal(await ticket.owner());
        });
    });

    describe('3.2 Testing `bet` function', () => {
        describe('3.2.1 Checking ticket of user', () => {
            it('3.2.1.1 [Fail]: Can not bet because user have not bought ticket', async () => {
                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.1'))).to.be.revertedWith(
                    'This user does not have ticket. Please buy a one to play'
                );
            });

            it('3.2.1.2 [Fail]: Can not bet because ticket of user is expired', async () => {
                await ticketManager.connect(user1).buy({
                    value: 10,
                });

                await ticketManager.subtractTimes(user1.address);
                await ticketManager.subtractTimes(user1.address);
                await ticketManager.subtractTimes(user1.address);

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.1'))).to.be.revertedWith(
                    "This user's ticket is expired. Please buy a new one to play"
                );
            });
        });

        describe('3.2.2 Checking that user has already bet', () => {
            it('3.2.2.1 [Fail]: Can not bet because this user has betted before', async () => {
                await ticketManager.connect(user1).buy({
                    value: 10,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('0.5'),
                });

                await evenOdd.connect(user1).bet(false, ethers.utils.parseEther('0.3'));

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'))).to.be.revertedWith(
                    'This user has betted before!'
                );
            });
        });

        describe('3.2.3 Checking the cash balance is enough to bet', () => {
            it('3.2.3.1 [Fail]: Can not bet because the balance of user is not enough', async () => {
                await ticketManager.connect(user1).buy({
                    value: 10,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('1'),
                });

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('1.1'))).to.be.revertedWith(
                    "User's balance is not enough to bet"
                );
            });

            it('3.2.3.2 [Fail]: Can not bet because the balance of contract is not enough', async () => {
                await ticketManager.connect(user1).buy({
                    value: 10,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('5.1'),
                });

                await expect(evenOdd.connect(user1).bet(true, ethers.utils.parseEther('5.1'))).to.be.revertedWith(
                    'Contract is not enough cash to reward if user win'
                );
            });

            it('3.2.3.3 [Fail]: Can not bet because the balance of contract is not enough', async () => {
                await ticketManager.connect(user1).buy({
                    value: 10,
                });

                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('3'),
                });
                await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('3'));

                await ticketManager.connect(user2).buy({
                    value: 10,
                });

                await cashManager.connect(user2).buy({
                    value: ethers.utils.parseEther('3'),
                });

                await expect(evenOdd.connect(user2).bet(true, ethers.utils.parseEther('3'))).to.be.revertedWith(
                    'Contract is not enough cash to reward if user win'
                );
            });
        });

        describe('3.2.4 Betting successfully', () => {
            it('3.2.4.1 [OK]: User betting successfully', async () => {
                await ticketManager.connect(user1).buy({
                    value: 10,
                });
                await cashManager.connect(user1).buy({
                    value: ethers.utils.parseEther('2'),
                });
                await expect(
                    evenOdd.connect(user1).bet(true, ethers.utils.parseEther('1'))
                ).to.changeTokenBalances(
                    cash,
                    [evenOdd.address, user1.address],
                    [ethers.utils.parseEther('1'), ethers.utils.parseEther('-1')]
                );

                const userTicket = await ticketManager.ticketOf(user1.address);
                const latestedMatchId = await evenOdd.latestedMatchId();
                const player = await evenOdd.playerList(latestedMatchId, 0);

                expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(
                    userTicket.ticketId
                );
                expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(
                    true
                );
                expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(ethers.utils.parseEther('1'));
            });
        });
    });

    describe('3.3 Testing `play` function', () => {
        it('3.3.1 [Fail]: Only owner can play', async () => {
            expect(await evenOdd.play());
            await expect(evenOdd.connect(user1).play()).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('3.3.2 [OK]: Match id is increased after play a game', async () => {
            const beforeMatchId = await evenOdd.latestedMatchId();

            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await cashManager.connect(user1).buy({
                value: ethers.utils.parseEther('0.5'),
            });

            await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'));
            await evenOdd.play();

            const afterMatchId = await evenOdd.latestedMatchId();
            expect(afterMatchId - beforeMatchId, 'Match id must be increased after play').to.be.equal(1);
        });

        it('3.3.3 [OK]: Blance of user is increased/descreased after play', async () => {
            await ticketManager.connect(user1).buy({
                value: 10,
            });
            await cashManager.connect(user1).buy({
                value: ethers.utils.parseEther('0.5'),
            });
            await evenOdd.connect(user1).bet(true, ethers.utils.parseEther('0.2'));

            await ticketManager.connect(user2).buy({
                value: 10,
            });
            await cashManager.connect(user2).buy({
                value: ethers.utils.parseEther('0.5'),
            });
            await evenOdd.connect(user2).bet(false, ethers.utils.parseEther('0.2'));

            const latestedMatchId = await evenOdd.latestedMatchId();
            await evenOdd.play();

            const currentMatch = await evenOdd.matchList(latestedMatchId);
            const isOdd = currentMatch.isOdd;
            let balanceOfUser1 = ethers.BigNumber.from(ethers.utils.parseEther('0.3'));
            let balanceOfUser2 = ethers.BigNumber.from(ethers.utils.parseEther('0.3'));

            if (isOdd) {
                balanceOfUser1 = balanceOfUser1.add(ethers.utils.parseEther('0.4'));
            } else {
                balanceOfUser2 = balanceOfUser2.add(ethers.utils.parseEther('0.4'));
            }

            expect(await cashManager.balanceOf(user1.address)).to.equal(balanceOfUser1);
            expect(await cashManager.balanceOf(user2.address)).to.equal(balanceOfUser2);
        });
    });
});
