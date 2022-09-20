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

        await evenOdd.supplyToken({ value: ethers.utils.parseEther('10') });

        await cash.connect(user1).approve(evenOdd.address, ethers.constants.MaxUint256);
        await cash.connect(user2).approve(evenOdd.address, ethers.constants.MaxUint256);
        await cash.connect(user3).approve(evenOdd.address, ethers.constants.MaxUint256);
    });

    it("Play 3 games with 1 user -> User's ticket is expired -> Extends ticket -> Play 1 game with 1 user -> withdraw all token", async () => {
        await ticketManager.connect(user1).buy(3, {
            value: 6,
        });
        await cashManager.connect(user1).buy({
            value: ethers.utils.parseEther('0.1'),
        });

        // Game 1
        let lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        let balanceOfUser = await cash.balanceOf(user1.address);

        const userTicket = await ticketManager.ticketOf(user1.address);
        let player = await evenOdd.playerList(lastMatch, 0);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser = balanceOfUser.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser);

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);
        balanceOfUser = await cash.balanceOf(user1.address);
        player = await evenOdd.playerList(lastMatch, 0);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser = balanceOfUser.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser);

        // Game 3
        lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);
        balanceOfUser = await cash.balanceOf(user1.address);
        player = await evenOdd.playerList(lastMatch, 0);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser = balanceOfUser.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser);

        expect(await ticketManager.isExpired(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user1.address)).to.be.false;

        // Game 4
        lastMatch = await evenOdd.lastMatch();
        await expect(
            evenOdd.connect(user1).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);
        balanceOfUser = await cash.balanceOf(user1.address);
        player = await evenOdd.playerList(lastMatch, 0);

        expect(player.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(userTicket.ticketId);
        expect(player.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser = balanceOfUser.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser);

        if (balanceOfUser > 0) {
            await expect(cashManager.connect(user1).withdraw(balanceOfUser)).to.changeEtherBalances(
                [cashManager.address, user1.address],
                [`-${balanceOfUser}`, balanceOfUser]
            );
            expect(await cash.balanceOf(user1.address)).to.equal(0);
        }
    });

    it("Play 2 games with 3 user -> user1's ticket is expired -> extends ticket -> play 1 game with 3 users", async () => {
        await cashManager.connect(user1).buy({
            value: ethers.utils.parseEther('1'),
        });

        await ticketManager.connect(user2).buy(3, {
            value: 6,
        });
        await cashManager.connect(user2).buy({
            value: ethers.utils.parseEther('1'),
        });

        await ticketManager.connect(user3).buy(3, {
            value: 6,
        });
        await cashManager.connect(user3).buy({
            value: ethers.utils.parseEther('1'),
        });

        // Game 1
        let lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        let balanceOfUser1 = await cash.balanceOf(user1.address);

        const user1Ticket = await ticketManager.ticketOf(user1.address);
        let player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        let balanceOfUser2 = await cash.balanceOf(user2.address);

        const user2Ticket = await ticketManager.ticketOf(user2.address);
        let player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        let balanceOfUser3 = await cash.balanceOf(user3.address);

        const user3Ticket = await ticketManager.ticketOf(user3.address);
        let player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser3 = balanceOfUser3.add(20);
        } else {
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        balanceOfUser1 = await cash.balanceOf(user1.address);

        player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        balanceOfUser2 = await cash.balanceOf(user2.address);

        player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        balanceOfUser3 = await cash.balanceOf(user3.address);

        player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser3 = balanceOfUser3.add(20);
        } else {
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        expect(await ticketManager.isExpired(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user1.address)).to.be.false;

        // Game 3
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        balanceOfUser1 = await cash.balanceOf(user1.address);

        player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        balanceOfUser2 = await cash.balanceOf(user2.address);

        player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        balanceOfUser3 = await cash.balanceOf(user3.address);

        player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser3 = balanceOfUser3.add(20);
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);
    });

    it("User2, User3 ticket is expired -> Extends ticket -> Play 1 game with 3 users -> Play 1 game with user1, user2 -> User1's ticket is expired -> Extends ticket -> Play 1 game with 3 users -> ticket of user 2 is expired -> extend ticket -> play 1 game 3 users -> withdraw all token", async () => {
        expect(await ticketManager.isExpired(user2.address)).to.be.true;
        await ticketManager.connect(user2).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user2.address)).to.be.false;
        expect(await ticketManager.isExpired(user3.address)).to.be.true;
        await ticketManager.connect(user3).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user3.address)).to.be.false;

        await cashManager.connect(user1).buy({
            value: ethers.utils.parseEther('1'),
        });
        await cashManager.connect(user2).buy({
            value: ethers.utils.parseEther('1'),
        });
        await cashManager.connect(user3).buy({
            value: ethers.utils.parseEther('1'),
        });

        // Game 1
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        let balanceOfUser1 = await cash.balanceOf(user1.address);

        const user1Ticket = await ticketManager.ticketOf(user1.address);
        let player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        let balanceOfUser2 = await cash.balanceOf(user2.address);

        const user2Ticket = await ticketManager.ticketOf(user2.address);
        let player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        let balanceOfUser3 = await cash.balanceOf(user3.address);

        const user3Ticket = await ticketManager.ticketOf(user3.address);
        let player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser3 = balanceOfUser3.add(20);
        } else {
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        balanceOfUser1 = await cash.balanceOf(user1.address);

        player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        balanceOfUser2 = await cash.balanceOf(user2.address);

        player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (!isOdd) {
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);

        // User1's ticket is expired
        expect(await ticketManager.isExpired(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user1.address)).to.be.false;

        // Game 3
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        balanceOfUser1 = await cash.balanceOf(user1.address);

        player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        balanceOfUser2 = await cash.balanceOf(user2.address);

        player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        balanceOfUser3 = await cash.balanceOf(user3.address);

        player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser3 = balanceOfUser3.add(20);
        } else {
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // Ticket of user2 is expired
        expect(await ticketManager.isExpired(user2.address)).to.be.true;
        await ticketManager.connect(user2).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user2.address)).to.be.false;

        // Game 4
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        balanceOfUser1 = await cash.balanceOf(user1.address);

        player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        balanceOfUser2 = await cash.balanceOf(user2.address);

        player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        balanceOfUser3 = await cash.balanceOf(user3.address);

        player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser3 = balanceOfUser3.add(20);
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // withdraw token
        if (balanceOfUser1 > 0) {
            await expect(cashManager.connect(user1).withdraw(balanceOfUser1)).to.changeEtherBalances(
                [cashManager.address, user1.address],
                [`-${balanceOfUser1}`, balanceOfUser1]
            );
            expect(await cash.balanceOf(user1.address)).to.equal(0);
        }

        if (balanceOfUser2 > 0) {
            await expect(cashManager.connect(user2).withdraw(balanceOfUser2)).to.changeEtherBalances(
                [cashManager.address, user2.address],
                [`-${balanceOfUser2}`, balanceOfUser2]
            );
            expect(await cash.balanceOf(user2.address)).to.equal(0);
        }

        if (balanceOfUser3 > 0) {
            await expect(cashManager.connect(user3).withdraw(balanceOfUser3)).to.changeEtherBalances(
                [cashManager.address, user3.address],
                [`-${balanceOfUser3}`, balanceOfUser3]
            );
            expect(await cash.balanceOf(user3.address)).to.equal(0);
        }
    });

    it('Ticket of user3 is expired -> Extends ticket -> Play 1 game with 3 users -> Ticket of user1 is expired -> Extends ticket -> User3 withdraw all token -> Play 1 game with 3 users (user3 does not have enough token to bet) -> User1 transfer to User3 -> Play 1 game with 3 users -> withdraw) ', async () => {
        expect(await ticketManager.isExpired(user3.address)).to.be.true;
        await ticketManager.connect(user3).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user3.address)).to.be.false;

        await cashManager.connect(user1).buy({
            value: ethers.utils.parseEther('1'),
        });

        await cashManager.connect(user2).buy({
            value: ethers.utils.parseEther('1'),
        });

        await cashManager.connect(user3).buy({
            value: ethers.utils.parseEther('1'),
        });

        // Game 1
        let lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        let balanceOfUser1 = await cash.balanceOf(user1.address);

        const user1Ticket = await ticketManager.ticketOf(user1.address);
        let player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        let balanceOfUser2 = await cash.balanceOf(user2.address);

        const user2Ticket = await ticketManager.ticketOf(user2.address);
        let player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        let balanceOfUser3 = await cash.balanceOf(user3.address);

        const user3Ticket = await ticketManager.ticketOf(user3.address);
        let player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        let currentMatch = await evenOdd.matchList(lastMatch);
        let isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser3 = balanceOfUser3.add(20);
        } else {
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // User1's ticket is expired'
        expect(await ticketManager.isExpired(user1.address)).to.be.true;
        await ticketManager.connect(user1).extendTicket(3, {
            value: 6,
        });
        expect(await ticketManager.isExpired(user1.address)).to.be.false;

        // User3 withdraw all tokens
        if (balanceOfUser3 > 0) {
            await expect(cashManager.connect(user3).withdraw(balanceOfUser3)).to.changeEtherBalances(
                [cashManager.address, user3.address],
                [`-${balanceOfUser3}`, balanceOfUser3]
            );
            expect(await cash.balanceOf(user3.address)).to.equal(0);
        }

        // Game 2
        lastMatch = await evenOdd.lastMatch();
        // -- User 1
        await expect(
            evenOdd.connect(user1).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user1.address], [10, -10]);

        balanceOfUser1 = await cash.balanceOf(user1.address);

        player1 = await evenOdd.playerList(lastMatch, 0);

        expect(player1.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user1Ticket.ticketId);
        expect(player1.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player1.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // -- User2
        await expect(
            evenOdd.connect(user2).bet(false, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user2.address], [10, -10]);

        balanceOfUser2 = await cash.balanceOf(user2.address);

        player2 = await evenOdd.playerList(lastMatch, 1);

        expect(player2.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user2Ticket.ticketId);
        expect(player2.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(false);
        expect(player2.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        // User3 bet but does not have enough tokens and user1 transfer 10 tokens to user3
        await expect(evenOdd.connect(user3).bet(true, 10)).to.be.revertedWith("User's balance is not enough to bet");
        await expect(cash.connect(user1).transfer(user3.address, 10)).to.changeTokenBalances(
            cash,
            [user1.address, user3.address],
            [-10, 10]
        );

        // -- User3
        await expect(
            evenOdd.connect(user3).bet(true, 10),
            'Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet'
        ).to.changeTokenBalances(cash, [evenOdd.address, user3.address], [10, -10]);

        balanceOfUser1 = await cash.balanceOf(user1.address);
        balanceOfUser3 = await cash.balanceOf(user3.address);

        player3 = await evenOdd.playerList(lastMatch, 2);

        expect(player3.ticketId, 'Player ticket id must be equal to user ticket id').to.equal(user3Ticket.ticketId);
        expect(player3.isOdd, 'Value in match history must be the same as value the user has betted').to.equal(true);
        expect(player3.bet, 'Token in match history must be the same as token the user has betted').to.equal(10);

        await evenOdd.connect(owner).play();

        currentMatch = await evenOdd.matchList(lastMatch);
        isOdd = currentMatch.isOdd;
        if (isOdd) {
            balanceOfUser3 = balanceOfUser3.add(20);
        } else {
            balanceOfUser1 = balanceOfUser1.add(20);
            balanceOfUser2 = balanceOfUser2.add(20);
        }

        expect(await cash.balanceOf(user1.address)).equal(balanceOfUser1);
        expect(await cash.balanceOf(user2.address)).equal(balanceOfUser2);
        expect(await cash.balanceOf(user3.address)).equal(balanceOfUser3);

        // withdraw token
        if (balanceOfUser1 > 0) {
            await expect(cashManager.connect(user1).withdraw(balanceOfUser1)).to.changeEtherBalances(
                [cashManager.address, user1.address],
                [`-${balanceOfUser1}`, balanceOfUser1]
            );
            expect(await cash.balanceOf(user1.address)).to.equal(0);
        }

        if (balanceOfUser2 > 0) {
            await expect(cashManager.connect(user2).withdraw(balanceOfUser2)).to.changeEtherBalances(
                [cashManager.address, user2.address],
                [`-${balanceOfUser2}`, balanceOfUser2]
            );
            expect(await cash.balanceOf(user2.address)).to.equal(0);
        }

        if (balanceOfUser3 > 0) {
            await expect(cashManager.connect(user3).withdraw(balanceOfUser3)).to.changeEtherBalances(
                [cashManager.address, user3.address],
                [`-${balanceOfUser3}`, balanceOfUser3]
            );
            expect(await cash.balanceOf(user3.address)).to.equal(0);
        }
    });
});
