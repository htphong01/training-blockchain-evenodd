const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('[Integration Test] Testing flow of the game', () => {
    before(async () => {
        Cash = await ethers.getContractFactory('Cash');
        CashManager = await ethers.getContractFactory('CashManager');
        Ticket = await ethers.getContractFactory('Ticket');
        TicketManager = await ethers.getContractFactory('TicketManager');
        EvenOdd = await ethers.getContractFactory('EvenOdd');

        [owner, user1, user2, user3] = await ethers.getSigners();

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

        await cash.connect(user1).approve(evenOdd.address, ethers.constants.MaxUint256);
        await cash.connect(user2).approve(evenOdd.address, ethers.constants.MaxUint256);
        await cash.connect(user3).approve(evenOdd.address, ethers.constants.MaxUint256);

        decimals = await cash.decimals();
        pricePerCash = await cashManager.pricePerCash();
        pricePerTime = await ticketManager.pricePerTime();

        await evenOdd.supplyToken(ethers.utils.parseUnits('50000', decimals), {
            value: 50000 * pricePerCash,
        });
    });

    it("Play 3 games with 1 user -> User's ticket is expired -> Extends ticket -> Play 1 game with 1 user -> withdraw all token", async () => {
        await ticketManager.connect(user1).buy(3, {
            value: 3 * pricePerTime,
        });
        await cashManager.connect(user1).buy(ethers.utils.parseUnits('1000', decimals), {
            value: 1000 * pricePerCash,
        });

        const cashBetted = ethers.utils.parseUnits('10', decimals);
        const cashReward = ethers.utils.parseUnits('20', decimals);
        // Game 1
        let lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(true, cashBetted),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        let balanceOfUser = await cash.balanceOf(user1.address);

        const userTicket = await ticketManager.ticketOf(user1.address);
        let player = await evenOdd.playerList(lastMatch, userTicket.ticketId);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(cashBetted);

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser = balanceOfUser.add(cashReward);
        }

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(false, cashBetted),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);
        balanceOfUser = balanceOfUser.sub(cashBetted);
        player = await evenOdd.playerList(lastMatch, userTicket.ticketId);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(cashBetted);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser = balanceOfUser.add(cashReward);
        }

        // Game 3
        lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(true, cashBetted),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);
        balanceOfUser = balanceOfUser.sub(cashBetted);
        player = await evenOdd.playerList(lastMatch, userTicket.ticketId);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(cashBetted);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser = balanceOfUser.add(cashReward);
        }

        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.false;

        // Game 4
        lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(false, cashBetted),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);
        balanceOfUser = balanceOfUser.sub(cashBetted);
        player = await evenOdd.playerList(lastMatch, userTicket.ticketId);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(cashBetted);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser = balanceOfUser.add(cashReward);
        }

        if ((await evenOdd.matchList(0)).isOdd) {
            await evenOdd.connect(user1).withdraw(0);
        }
        if (!(await evenOdd.matchList(1)).isOdd) {
            await evenOdd.connect(user1).withdraw(1);
        }
        if ((await evenOdd.matchList(2)).isOdd) {
            await evenOdd.connect(user1).withdraw(2);
        }
        if (!(await evenOdd.matchList(3)).isOdd) {
            await evenOdd.connect(user1).withdraw(3);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser);
        const withdrawCash = balanceOfUser / 10 ** decimals;
        if (withdrawCash > 0) {
            await expect(cashManager.connect(user1).withdraw(balanceOfUser)).to.changeEtherBalances(
                [cashManager.address, user1.address],
                [`-${withdrawCash * pricePerCash}`, withdrawCash * pricePerCash]
            );
            expect(await cash.balanceOf(user1.address)).to.equal(0);
        }
    });

    it("Play 2 games with 3 user -> user1's ticket is expired -> extends ticket -> play 1 game with 3 users", async () => {
        await cashManager.connect(user1).buy(ethers.utils.parseUnits('1000', decimals), {
            value: 1000 * pricePerCash,
        });

        await ticketManager.connect(user2).buy(3, {
            value: 3 * pricePerTime,
        });
        await cashManager.connect(user2).buy(ethers.utils.parseUnits('1000', decimals), {
            value: 1000 * pricePerCash,
        });

        await ticketManager.connect(user3).buy(3, {
            value: 3 * pricePerTime,
        });
        await cashManager.connect(user3).buy(ethers.utils.parseUnits('1000', decimals), {
            value: 1000 * pricePerCash,
        });

        const cashBetted = ethers.utils.parseUnits('10', decimals);
        const cashReward = ethers.utils.parseUnits('20', decimals);
        // Game 1
        let lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        let balanceOfUser1 = await cash.balanceOf(user1.address);

        const user1Ticket = await ticketManager.ticketOf(user1.address);
        let player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        let balanceOfUser2 = await cash.balanceOf(user2.address);

        const user2Ticket = await ticketManager.ticketOf(user2.address);
        let player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        let balanceOfUser3 = await cash.balanceOf(user3.address);

        const user3Ticket = await ticketManager.ticketOf(user3.address);
        let player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser3 = balanceOfUser3.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user3).withdraw(lastMatch);
        } else {
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user2).withdraw(lastMatch);
        }

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        balanceOfUser1 = balanceOfUser1.sub(cashBetted);

        player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        balanceOfUser2 = balanceOfUser2.sub(cashBetted);

        player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        balanceOfUser3 = balanceOfUser3.sub(cashBetted);

        player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            await evenOdd.connect(user3).withdraw(lastMatch);
            balanceOfUser3 = balanceOfUser3.add(cashReward);
        } else {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user2).withdraw(lastMatch);
        }

        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.false;

        // Game 3
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        balanceOfUser1 = balanceOfUser1.sub(cashBetted);

        player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        balanceOfUser2 = balanceOfUser2.sub(cashBetted);

        player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        balanceOfUser3 = balanceOfUser3.sub(cashBetted);

        player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser3 = balanceOfUser3.add(cashReward);
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user2).withdraw(lastMatch);
            await evenOdd.connect(user3).withdraw(lastMatch);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);
    });

    it("User2, User3 ticket is expired -> Extends ticket -> Play 1 game with 3 users -> Play 1 game with user1, user2 -> User1's ticket is expired -> Extends ticket -> Play 1 game with 3 users -> ticket of user 2 is expired -> extend ticket -> play 1 game 3 users -> withdraw all token", async () => {
        const cashBetted = ethers.utils.parseUnits('10', decimals);
        const cashReward = ethers.utils.parseUnits('20', decimals);

        expect(await ticketManager.isOutOfTimes(user2.address)).to.be.true;
        await ticketManager.connect(user2).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user2.address)).to.be.false;

        expect(await ticketManager.isOutOfTimes(user3.address)).to.be.true;
        await ticketManager.connect(user3).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user3.address)).to.be.false;

        // Game 1
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        let balanceOfUser1 = await cash.balanceOf(user1.address);

        const user1Ticket = await ticketManager.ticketOf(user1.address);
        let player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        let balanceOfUser2 = await cash.balanceOf(user2.address);

        const user2Ticket = await ticketManager.ticketOf(user2.address);
        let player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        let balanceOfUser3 = await cash.balanceOf(user3.address);

        const user3Ticket = await ticketManager.ticketOf(user3.address);
        let player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser3 = balanceOfUser3.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user3).withdraw(lastMatch);
        } else {
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user2).withdraw(lastMatch);
        }

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        balanceOfUser1 = balanceOfUser1.sub(cashBetted);

        player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        balanceOfUser2 = balanceOfUser2.sub(cashBetted);

        player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user2).withdraw(lastMatch);
        }

        // User1's ticket is expired
        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.false;

        // Game 3
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        balanceOfUser1 = balanceOfUser1.sub(cashBetted);

        player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        balanceOfUser2 = balanceOfUser2.sub(cashBetted);

        player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        balanceOfUser3 = balanceOfUser3.sub(cashBetted);

        player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser3 = balanceOfUser3.add(cashReward);
            await evenOdd.connect(user3).withdraw(lastMatch);
        } else {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user2).withdraw(lastMatch);
        }

        // Ticket of user2 is expired
        expect(await ticketManager.isOutOfTimes(user2.address)).to.be.true;
        await ticketManager.connect(user2).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user2.address)).to.be.false;

        // Game 4
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        balanceOfUser1 = balanceOfUser1.sub(cashBetted);

        player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        balanceOfUser2 = balanceOfUser2.sub(cashBetted);

        player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        balanceOfUser3 = balanceOfUser3.sub(cashBetted);

        player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            balanceOfUser3 = balanceOfUser3.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user2).withdraw(lastMatch);
            await evenOdd.connect(user3).withdraw(lastMatch);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // withdraw token
        if (balanceOfUser1 > 0) {
            await expect(cashManager.connect(user1).withdraw(balanceOfUser1)).to.changeEtherBalances(
                [cashManager.address, user1.address],
                [
                    `-${(balanceOfUser1 * pricePerCash) / 10 ** decimals}`,
                    (balanceOfUser1 * pricePerCash) / 10 ** decimals,
                ]
            );
            expect(await cash.balanceOf(user1.address)).to.equal(0);
        }

        if (balanceOfUser2 > 0) {
            await expect(cashManager.connect(user2).withdraw(balanceOfUser2)).to.changeEtherBalances(
                [cashManager.address, user2.address],
                [
                    `-${(balanceOfUser2 * pricePerCash) / 10 ** decimals}`,
                    (balanceOfUser2 * pricePerCash) / 10 ** decimals,
                ]
            );
            expect(await cash.balanceOf(user2.address)).to.equal(0);
        }

        if (balanceOfUser3 > 0) {
            await expect(cashManager.connect(user3).withdraw(balanceOfUser3)).to.changeEtherBalances(
                [cashManager.address, user3.address],
                [
                    `-${(balanceOfUser3 * pricePerCash) / 10 ** decimals}`,
                    (balanceOfUser3 * pricePerCash) / 10 ** decimals,
                ]
            );
            expect(await cash.balanceOf(user3.address)).to.equal(0);
        }
    });

    it('Ticket of user3 is expired -> Extends ticket -> Play 1 game with 3 users -> Ticket of user1 is expired -> Extends ticket -> User3 withdraw all token -> Play 1 game with 3 users (user3 does not have enough token to bet) -> User1 transfer to User3 -> Play 1 game with 3 users -> withdraw) ', async () => {
        await cashManager.connect(user1).buy(ethers.utils.parseUnits('1000', decimals), {
            value: 1000 * pricePerCash,
        });

        await cashManager.connect(user2).buy(ethers.utils.parseUnits('1000', decimals), {
            value: 1000 * pricePerCash,
        });

        await cashManager.connect(user3).buy(ethers.utils.parseUnits('1000', decimals), {
            value: 1000 * pricePerCash,
        });

        const cashBetted = ethers.utils.parseUnits('10', decimals);
        const cashReward = ethers.utils.parseUnits('20', decimals);

        expect(await ticketManager.isOutOfTimes(user3.address)).to.be.true;
        await ticketManager.connect(user3).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user3.address)).to.be.false;

        // Game 1
        let lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        let balanceOfUser1 = await cash.balanceOf(user1.address);

        const user1Ticket = await ticketManager.ticketOf(user1.address);
        let player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        let balanceOfUser2 = await cash.balanceOf(user2.address);

        const user2Ticket = await ticketManager.ticketOf(user2.address);
        let player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        let balanceOfUser3 = await cash.balanceOf(user3.address);

        const user3Ticket = await ticketManager.ticketOf(user3.address);
        let player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser3 = balanceOfUser3.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user3).withdraw(lastMatch);
        } else {
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user2).withdraw(lastMatch);
        }

        // User1's ticket is expired'
        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 3 * pricePerTime,
        });
        expect(await ticketManager.isOutOfTimes(user1.address)).to.be.false;

        // User3 withdraw all tokens
        if (balanceOfUser3 > 0) {
            await expect(cashManager.connect(user3).withdraw(balanceOfUser3)).to.changeEtherBalances(
                [cashManager.address, user3.address],
                [
                    `-${(balanceOfUser3 * pricePerCash) / 10 ** decimals}`,
                    (balanceOfUser3 * pricePerCash) / 10 ** decimals,
                ]
            );
            expect(await cash.balanceOf(user3.address)).to.equal(0);
            balanceOfUser3 = ethers.BigNumber.from('0');
        }

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [cashBetted, -cashBetted]);

        balanceOfUser1 = balanceOfUser1.sub(cashBetted);

        player1 = await evenOdd.playerList(lastMatch, user1Ticket.ticketId);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [cashBetted, -cashBetted]);

        balanceOfUser2 = balanceOfUser2.sub(cashBetted);

        player2 = await evenOdd.playerList(lastMatch, user2Ticket.ticketId);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        // User3 bet but does not have enough tokens and user1 transfer `cashBetted` tokens to user3
        await expect(evenOdd.connect(user3).bet(true, cashBetted)).to.be.revertedWith(
            "User's balance is not enough to bet"
        );
        await expect(cash.connect(user1).transfer(user3.address, cashBetted)).to.changeTokenBalances(
            cash,
            [user1.address, user3.address],
            [-cashBetted, cashBetted]
        );
        balanceOfUser1 = balanceOfUser1.sub(cashBetted);
        balanceOfUser3 = balanceOfUser3.add(cashBetted);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, cashBetted),
            'Balance of contract must be added `cashBetted` tokens and user subtract `cashBetted` tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [cashBetted, -cashBetted]);

        balanceOfUser3 = balanceOfUser3.sub(cashBetted);

        player3 = await evenOdd.playerList(lastMatch, user3Ticket.ticketId);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(
            cashBetted
        );

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser3 = balanceOfUser3.add(cashReward);
            await evenOdd.connect(user3).withdraw(lastMatch);
        } else {
            balanceOfUser1 = balanceOfUser1.add(cashReward);
            balanceOfUser2 = balanceOfUser2.add(cashReward);
            await evenOdd.connect(user1).withdraw(lastMatch);
            await evenOdd.connect(user2).withdraw(lastMatch);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // withdraw token
        if (balanceOfUser1 > 0) {
            await expect(cashManager.connect(user1).withdraw(balanceOfUser1)).to.changeEtherBalances(
                [cashManager.address, user1.address],
                [
                    `-${(balanceOfUser1 * pricePerCash) / 10 ** decimals}`,
                    (balanceOfUser1 * pricePerCash) / 10 ** decimals,
                ]
            );
            expect(await cash.balanceOf(user1.address)).to.equal(0);
        }

        if (balanceOfUser2 > 0) {
            await expect(cashManager.connect(user2).withdraw(balanceOfUser2)).to.changeEtherBalances(
                [cashManager.address, user2.address],
                [
                    `-${(balanceOfUser2 * pricePerCash) / 10 ** decimals}`,
                    (balanceOfUser2 * pricePerCash) / 10 ** decimals,
                ]
            );
            expect(await cash.balanceOf(user2.address)).to.equal(0);
        }

        if (balanceOfUser3 > 0) {
            await expect(cashManager.connect(user3).withdraw(balanceOfUser3)).to.changeEtherBalances(
                [cashManager.address, user3.address],
                [
                    `-${(balanceOfUser3 * pricePerCash) / 10 ** decimals}`,
                    (balanceOfUser3 * pricePerCash) / 10 ** decimals,
                ]
            );
            expect(await cash.balanceOf(user3.address)).to.equal(0);
        }
    });
});
