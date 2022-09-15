const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

describe('Testing CashManager contract', () => {
    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();
        
        const Cash = await ethers.getContractFactory('Cash');
        const CashManager = await ethers.getContractFactory('CashManager');

        cash = await upgrades.deployProxy(Cash);
        await cash.deployed();

        cashManager = await upgrades.deployProxy(CashManager, [cash.address]);
        await cashManager.deployed();
    });

    describe('Testing `buy` function', () => {
        it('[Fail]: User buy cash but had not set Owner', async () => {
            await expect(
                cashManager.connect(user).buy({
                    value: ethers.utils.parseEther('1'),
                })
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('[Fail]: Set new owner so old owner can not calling mint function ', async () => {
            await cash.connect(owner).setOwner(cashManager.address);

            await expect(cash.connect(owner).mint(user.address, ethers.utils.parseEther('1'))).to.be.revertedWith(
                'Ownable: caller is not the owner'
            );
        });

        it('[OK]: Set new owner to Cash contract ', async () => {
            await cash.connect(owner).setOwner(cashManager.address);
            expect(cashManager.address).to.equal(await cash.owner());            
        });

        it('[OK]: User buy cash successfully', async () => {            
            await cash.connect(owner).setOwner(cashManager.address);

            await expect(
                cashManager.connect(user).buy({
                    value: ethers.utils.parseEther('1'),
                })
            ).to.changeEtherBalances(
                [cashManager.address, user.address],
                [ethers.utils.parseEther('1'), ethers.utils.parseEther('-1')]
            );

            await expect(
                cashManager.connect(user).buy({
                    value: ethers.utils.parseEther('1'),
                })
            ).to.changeTokenBalance(cash, user.address, ethers.utils.parseEther('1'));
        });
    });

    describe('Testing `withdraw` function', () => {
        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).setOwner(cashManager.address);
            await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('2'))).to.be.revertedWith(
                'ERC20: burn amount exceeds balance'
            );
        });

        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).setOwner(cashManager.address);
            await cashManager.connect(user).buy({
                value: ethers.utils.parseEther('1'),
            });
            await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('2'))).to.be.revertedWith(
                'ERC20: burn amount exceeds balance'
            );
        });

        it('[Fail]: Withdraw 0 cash', async () => {
            await cash.connect(owner).setOwner(cashManager.address);
            await cashManager.connect(user).buy({
                value: ethers.utils.parseEther('1'),
            });
            await expect(cashManager.connect(user).withdraw(0)).to.be.revertedWith(
                'Amount is must be greater than 0!'
            );
        });

        it('[OK]: User withdraw successfully', async () => {
            await cash.connect(owner).setOwner(cashManager.address);
            await cashManager.connect(user).buy({
                value: ethers.utils.parseEther('1'),
            });

            await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('0.5'))).to.changeTokenBalance(
                cash,
                user.address,
                ethers.utils.parseEther('-0.5')
            );
            await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('0.5'))).to.changeEtherBalances(
                [cashManager.address, user.address],
                [ethers.utils.parseEther('-0.5'), ethers.utils.parseEther('0.5')]
            );
        });
    });
});
