const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

describe('Testing CashManager contract', () => {
    before(async () => {
        Cash = await ethers.getContractFactory('Cash');
        CashManager = await ethers.getContractFactory('CashManager');
    });

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();

        cash = await upgrades.deployProxy(Cash);
        await cash.deployed();

        await expect(upgrades.deployProxy(CashManager, [user.address])).to.be.revertedWith('Invalid Cash contract');

        cashManager = await upgrades.deployProxy(CashManager, [cash.address]);
        await cashManager.deployed();

        decimals = await cash.decimals();
        pricePerCash = await cashManager.pricePerCash();
    });

    describe('Testing `mint` function', () => {
        it('[Fail]: Mint for zero address', async () => {
            await expect(
                cash.connect(owner).mint(ethers.constants.AddressZero, ethers.utils.parseUnits('3', decimals))
            ).to.be.revertedWith('Address is not valid!');
        });

        it('[Fail]: Mint invalid amount', async () => {
            await expect(cash.connect(owner).mint(user.address, 10 ** decimals - 1)).to.be.revertedWith(
                'Invalid amount!'
            );
        });

        it('[OK]: Mint successfully', async () => {
            await cash.connect(owner).mint(user.address, ethers.utils.parseUnits('3', decimals));
            expect(await cash.balanceOf(user.address)).to.equal(ethers.utils.parseUnits('3', decimals));
        });
    });

    describe('Testing `burn` function', () => {
        it('[Fail]: Burn for zero address', async () => {
            await expect(
                cash.connect(owner).burn(ethers.constants.AddressZero, ethers.utils.parseUnits('3', decimals))
            ).to.be.revertedWith('Address is not valid!');
        });

        it('[Fail]: Burn invalid amount', async () => {
            await expect(cash.connect(owner).burn(user.address, 10 ** decimals - 1)).to.be.revertedWith(
                'Invalid amount!'
            );
        });

        it('[OK]: Burn successfully', async () => {
            await cash.connect(owner).mint(user.address, ethers.utils.parseUnits('3', decimals));
            await cash.connect(owner).burn(user.address, ethers.utils.parseUnits('3', decimals));
            expect(await cash.balanceOf(user.address)).to.equal(0);
        });
    });

    describe('Testing `buy` function', () => {
        it('[Fail]: User buy cash but had not set Owner', async () => {
            await expect(
                cashManager.connect(user).buy(ethers.utils.parseUnits('15', decimals), {
                    value: 15 * pricePerCash,
                })
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('[Fail]: Set new owner so old owner can not calling mint function ', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);

            await expect(
                cash.connect(owner).mint(user.address, ethers.utils.parseUnits('15', decimals))
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('[OK]: Set new owner to Cash contract ', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            expect(cashManager.address).to.equal(await cash.owner());
        });

        it('[OK]: User buy cash successfully', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);

            await cashManager
                .connect(user)
                .buy(ethers.utils.parseUnits('1000', decimals), { value: 1000 * pricePerCash });

            await expect(
                cashManager.connect(user).buy(ethers.utils.parseUnits('100', decimals), {
                    value: 100 * pricePerCash,
                })
            )
                .to.changeEtherBalances([cashManager.address, user.address], [100 * pricePerCash, -100 * pricePerCash])
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, 100);

            await expect(
                cashManager.connect(user).buy(ethers.utils.parseUnits('100', decimals), {
                    value: 100 * pricePerCash,
                })
            ).to.changeTokenBalance(cash, user.address, ethers.utils.parseUnits('100', decimals));
        });
    });

    describe('Testing `withdraw` function', () => {
        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).withdraw(ethers.utils.parseUnits('100', decimals))
            ).to.be.revertedWith('ERC20: burn amount exceeds balance');
        });

        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy(ethers.utils.parseUnits('100', decimals), {
                    value: 100 * pricePerCash,
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, 100);

            await expect(
                cashManager.connect(user).withdraw(ethers.utils.parseUnits('200', decimals))
            ).to.be.revertedWith('ERC20: burn amount exceeds balance');
        });

        it('[Fail]: Withdraw 0 cash', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy(ethers.utils.parseUnits('100', decimals), {
                    value: 100 * pricePerCash,
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, 100);

            await expect(cashManager.connect(user).withdraw(0)).to.be.revertedWith('Invalid amount!');
        });

        it('[OK]: User withdraw successfully', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy(ethers.utils.parseUnits('10', decimals), {
                    value: 10 * pricePerCash,
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, 10);

            await expect(cashManager.connect(user).withdraw(ethers.utils.parseUnits('5', decimals)))
                .to.changeTokenBalance(cash, user.address, ethers.utils.parseUnits('-5', decimals))
                .to.emit(cashManager, 'Withdrawn')
                .withArgs(user.address, 5);

            await expect(cashManager.connect(user).withdraw(ethers.utils.parseUnits('5', decimals)))
                .to.changeEtherBalance(user.address, 5 * pricePerCash)
                .to.emit(cashManager, 'Withdrawn')
                .withArgs(user.address, 5);
        });
    });

    describe('Testing setPricePerCash function', () => {
        it('[Fail]: newPrice is not greater than 0', async () => {
            await expect(cashManager.connect(owner).setPricePerCash(0)).to.be.revertedWith(
                'New price must be greater than 0!'
            );
        });

        it('[OK]: Set new price successfully', async () => {
            await expect(cashManager.connect(owner).setPricePerCash(10))
                .to.emit(cashManager, 'SetPricePerCash')
                .withArgs(10);

            const newRate = await cashManager.pricePerCash();
            expect(newRate, 'New rate must be equal to 10').to.equal(10);
            await expect(
                cashManager.connect(user).buy(ethers.utils.parseUnits('1000', decimals), { value: 1000 * pricePerCash })
            ).to.be.revertedWith('You must pay enough fee!');
        });
    });
});
