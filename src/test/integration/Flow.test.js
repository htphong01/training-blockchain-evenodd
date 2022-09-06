// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// describe("[Integration Test] Testing flow of the game", () => {
//     beforeEach(async () => {
//         Cash = await ethers.getContractFactory('Cash');
//         CashManager = await ethers.getContractFactory('CashManager');
//         Ticket = await ethers.getContractFactory('Ticket');
//         TicketManager = await ethers.getContractFactory('TicketManager');
//         EvenOdd = await ethers.getContractFactory('EvenOdd');

//         [owner, user1, user2, user3] = await ethers.getSigners();

//         cash = await Cash.deploy();
//         ticket = await Ticket.deploy();
//         cashManager = await CashManager.deploy(cash.address);
//         ticketManager = await TicketManager.deploy(ticket.address);

//         await cash.connect(owner).setOwner(cashManager.address);
//         await ticket.connect(owner).setOwner(ticketManager.address);

//         evenOdd = await EvenOdd.deploy(cashManager.address, ticketManager.address, { value: ethers.utils.parseEther("5") });

//         await cash.connect(user1).approve(evenOdd.address, ethers.utils.parseEther('5'));
//         await cash.connect(user2).approve(evenOdd.address, ethers.utils.parseEther('5'));
//     });

//     it("Play 3 games with 1 user -> User's ticket is expired -> Extends ticket -> Play 1 game with 1 user -> withdraw all token", async () => {
//         await ticketManager.connect(user1).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user1).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user1).approve(evenOdd.address, 40);

//         // Game 1
//         await expect(
//             evenOdd.connect(user1).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         let balanceOfUser = await cashManager.balanceOf(user1.address);

//         const userTicket = await ticketManager.ticketOf(user1.address);
//         let player = await evenOdd.playerList(0, 0);

//         expect(player.ticketId, "Player ticket id must be equal to user ticket id").to.equal(userTicket.ticketId);
//         expect(player.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         let currentMatch = await evenOdd.matchList(0);
//         let isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser = balanceOfUser.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser);

//         // Game 2
//         await expect(
//             evenOdd.connect(user1).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);
//         balanceOfUser = await cashManager.balanceOf(user1.address);
//         player = await evenOdd.playerList(1, 0);

//         expect(player.ticketId, "Player ticket id must be equal to user ticket id").to.equal(userTicket.ticketId);
//         expect(player.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(1);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (!isOdd) {
//             balanceOfUser = balanceOfUser.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser);

//         // Game 3
//         await expect(
//             evenOdd.connect(user1).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);
//         balanceOfUser = await cashManager.balanceOf(user1.address);
//         player = await evenOdd.playerList(2, 0);

//         expect(player.ticketId, "Player ticket id must be equal to user ticket id").to.equal(userTicket.ticketId);
//         expect(player.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(2);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser = balanceOfUser.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser);

//         expect(await ticketManager.isExpired(user1.address)).to.be.true;
//         await ticketManager.connect(user1).extendTicket({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         expect(await ticketManager.isExpired(user1.address)).to.be.false;

//         // Game 4
//         await expect(
//             evenOdd.connect(user1).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);
//         balanceOfUser = await cashManager.balanceOf(user1.address);
//         player = await evenOdd.playerList(3, 0);

//         expect(player.ticketId, "Player ticket id must be equal to user ticket id").to.equal(userTicket.ticketId);
//         expect(player.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(3);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (!isOdd) {
//             balanceOfUser = balanceOfUser.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser);

//         const amount = balanceOfUser.toNumber();
//         const ethersChange = amount / 10;

//         await expect(cashManager.connect(user1).withdraw(amount)).to.changeEtherBalances(
//             [cashManager.address, user1.address],
//             [ethers.utils.parseEther(`-${ethersChange}`), ethers.utils.parseEther(`${ethersChange}`)]
//         );
//         expect(await cashManager.balanceOf(user1.address)).to.equal(0);
//     });

//     it("Play 3 games with 3 user", async () => {
//         await ticketManager.connect(user1).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user1).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user1).approve(evenOdd.address, 30);

//         await ticketManager.connect(user2).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user2).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user2).approve(evenOdd.address, 30);

//         await ticketManager.connect(user3).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user3).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user3).approve(evenOdd.address, 30);

//         // Game 1
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         let balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         const user1Ticket = await ticketManager.ticketOf(user1.address);
//         let player1 = await evenOdd.playerList(0, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         let balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         const user2Ticket = await ticketManager.ticketOf(user2.address);
//         let player2 = await evenOdd.playerList(0, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         let balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         const user3Ticket = await ticketManager.ticketOf(user3.address);
//         let player3 = await evenOdd.playerList(0, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         let currentMatch = await evenOdd.matchList(0);
//         let isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser3 = balanceOfUser3.add(20);
//         } else {
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);

//         // Game 2
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         player1 = await evenOdd.playerList(1, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         player2 = await evenOdd.playerList(1, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         player3 = await evenOdd.playerList(1, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(1);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser3 = balanceOfUser3.add(20);
//         } else {
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);

//         // Game 3
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         player1 = await evenOdd.playerList(2, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         player2 = await evenOdd.playerList(2, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         player3 = await evenOdd.playerList(2, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(2);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (!isOdd) {
//             balanceOfUser3 = balanceOfUser3.add(20);
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);
//     });

//     it("Play 1 game with 3 users -> Play 1 game with user1, user2, play 1 game with 3 users -> ticket of user1 and user 2 is expired -> extend ticket -> play 1 game 3 users -> withdraw all token", async () => {
//         await ticketManager.connect(user1).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user1).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user1).approve(evenOdd.address, 40);

//         await ticketManager.connect(user2).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user2).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user2).approve(evenOdd.address, 40);

//         await ticketManager.connect(user3).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user3).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user3).approve(evenOdd.address, 40);

//         // Game 1
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         let balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         const user1Ticket = await ticketManager.ticketOf(user1.address);
//         let player1 = await evenOdd.playerList(0, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         let balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         const user2Ticket = await ticketManager.ticketOf(user2.address);
//         let player2 = await evenOdd.playerList(0, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         let balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         const user3Ticket = await ticketManager.ticketOf(user3.address);
//         let player3 = await evenOdd.playerList(0, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         let currentMatch = await evenOdd.matchList(0);
//         let isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser3 = balanceOfUser3.add(20);
//         } else {
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);

//         // Game 2
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         player1 = await evenOdd.playerList(1, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         player2 = await evenOdd.playerList(1, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(1);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (!isOdd) {
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);

//         // Game 3
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         player1 = await evenOdd.playerList(2, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         player2 = await evenOdd.playerList(2, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         player3 = await evenOdd.playerList(2, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(2);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser3 = balanceOfUser3.add(20);
//         } else {
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);

//         // Ticket is expired
//         expect(await ticketManager.isExpired(user1.address)).to.be.true;
//         expect(await ticketManager.isExpired(user2.address)).to.be.true;
//         await ticketManager.connect(user1).extendTicket({ value: ethers.utils.parseEther('0.1') });
//         await ticketManager.connect(user2).extendTicket({ value: ethers.utils.parseEther('0.1') });
//         expect(await ticketManager.isExpired(user1.address)).to.be.false;
//         expect(await ticketManager.isExpired(user2.address)).to.be.false;

//         // Game 4
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         player1 = await evenOdd.playerList(3, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         player2 = await evenOdd.playerList(3, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         player3 = await evenOdd.playerList(3, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(3);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser3 = balanceOfUser3.add(20);
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);

//         // withdraw token
//         let amount = balanceOfUser1.toNumber();
//         let ethersChange = amount / 10;

//         await expect(cashManager.connect(user1).withdraw(amount)).to.changeEtherBalances(
//             [cashManager.address, user1.address],
//             [ethers.utils.parseEther(`-${ethersChange}`), ethers.utils.parseEther(`${ethersChange}`)]
//         );
//         expect(await cashManager.balanceOf(user1.address)).to.equal(0);

//         amount = balanceOfUser2.toNumber();
//         ethersChange = amount / 10;

//         await expect(cashManager.connect(user2).withdraw(amount)).to.changeEtherBalances(
//             [cashManager.address, user2.address],
//             [ethers.utils.parseEther(`-${ethersChange}`), ethers.utils.parseEther(`${ethersChange}`)]
//         );
//         expect(await cashManager.balanceOf(user2.address)).to.equal(0);

//         amount = balanceOfUser3.toNumber();
//         ethersChange = amount / 10;

//         await expect(cashManager.connect(user3).withdraw(amount)).to.changeEtherBalances(
//             [cashManager.address, user3.address],
//             [ethers.utils.parseEther(`-${ethersChange}`), ethers.utils.parseEther(`${ethersChange}`)]
//         );
//         expect(await cashManager.balanceOf(user3.address)).to.equal(0);
//     });

//     it('Play 1 game with 3 users -> User3 withdraw all token -> Play 1 game with 3 users (user3 does not have enough token to bet) -> User1 transfer to User3 -> Play 1 game with 3 users -> withdraw) ', async () => {
//         await ticketManager.connect(user1).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user1).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user1).approve(evenOdd.address, 20);

//         await ticketManager.connect(user2).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user2).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user2).approve(evenOdd.address, 20);

//         await ticketManager.connect(user3).buy({
//             value: ethers.utils.parseEther("0.1"),
//         });
//         await cashManager.connect(user3).buy({
//             value: ethers.utils.parseEther("5"),
//         });
//         await cashManager.connect(user3).approve(evenOdd.address, 20);

//         // Game 1
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         let balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         const user1Ticket = await ticketManager.ticketOf(user1.address);
//         let player1 = await evenOdd.playerList(0, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         let balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         const user2Ticket = await ticketManager.ticketOf(user2.address);
//         let player2 = await evenOdd.playerList(0, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         let balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         const user3Ticket = await ticketManager.ticketOf(user3.address);
//         let player3 = await evenOdd.playerList(0, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         let currentMatch = await evenOdd.matchList(0);
//         let isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser3 = balanceOfUser3.add(20);
//         } else {
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);

//         // User3 withdraw all tokens
//         let amount = balanceOfUser3.toNumber();
//         let ethersChange = amount / 10;

//         await expect(cashManager.connect(user3).withdraw(amount)).to.changeEtherBalances(
//             [cashManager.address, user3.address],
//             [ethers.utils.parseEther(`-${ethersChange}`), ethers.utils.parseEther(`${ethersChange}`)]
//         );
//         expect(await cashManager.balanceOf(user3.address)).to.equal(0);

//         // Game 2
//         // -- User 1
//         await expect(
//             evenOdd.connect(user1).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user1.address], [10, -10]);

//         balanceOfUser1 = await cashManager.balanceOf(user1.address);

//         player1 = await evenOdd.playerList(1, 0);

//         expect(player1.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user1Ticket.ticketId);
//         expect(player1.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player1.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // -- User2
//         await expect(
//             evenOdd.connect(user2).bet(false, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user2.address], [10, -10]);

//         balanceOfUser2 = await cashManager.balanceOf(user2.address);

//         player2 = await evenOdd.playerList(1, 1);

//         expect(player2.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user2Ticket.ticketId);
//         expect(player2.isOdd, "Value in match history must be the same as value the user has betted").to.equal(false);
//         expect(player2.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         // User3 bet but does not have enough tokens and user1 transfer 10 tokens to user3
//         await expect(evenOdd.connect(user3).bet(true, 10)).to.be.revertedWith("User's balance is not enough to bet")
//         await expect(
//             cashManager.connect(user1).transfer(user3.address, 10)
//         ).to.changeTokenBalances(cashManager, [user1.address, user3.address], [-10, 10])

//         // -- User3
//         await expect(
//             evenOdd.connect(user3).bet(true, 10),
//             "Balance of contract must be added 10 tokens and user subtract 10 tokens after user bet"
//         ).to.changeTokenBalances(cashManager, [evenOdd.address, user3.address], [10, -10]);

//         balanceOfUser1 = await cashManager.balanceOf(user1.address);
//         balanceOfUser3 = await cashManager.balanceOf(user3.address);

//         player3 = await evenOdd.playerList(1, 2);

//         expect(player3.ticketId, "Player ticket id must be equal to user ticket id").to.equal(user3Ticket.ticketId);
//         expect(player3.isOdd, "Value in match history must be the same as value the user has betted").to.equal(true);
//         expect(player3.bet, "Token in match history must be the same as token the user has betted").to.equal(10);

//         await evenOdd.connect(owner).play();

//         currentMatch = await evenOdd.matchList(1);
//         isOdd = currentMatch.roll1.add(currentMatch.roll2).mod(2).eq(1);
//         if (isOdd) {
//             balanceOfUser3 = balanceOfUser3.add(20);
//         } else {
//             balanceOfUser1 = balanceOfUser1.add(20);
//             balanceOfUser2 = balanceOfUser2.add(20);
//         }

//         expect(await cashManager.balanceOf(user1.address)).equal(balanceOfUser1);
//         expect(await cashManager.balanceOf(user2.address)).equal(balanceOfUser2);
//         expect(await cashManager.balanceOf(user3.address)).equal(balanceOfUser3);

//     })
// });
