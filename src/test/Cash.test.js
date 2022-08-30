const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('1. Testing Cash contract', () => {
    beforeEach(async () => {
        const Cash = await ethers.getContractFactory('Cash');
        const CashManger = await ethers.getContractFactory('CashManager');

        [owner, user] = await ethers.getSigners();

        cash = await Cash.deploy();
        cashManager = await CashManger.deploy(cash.address);
    });

    describe('1.1 Testing `buy` function', () => {
        it('1.1.1 [Fail]: User buy cash but had not set Owner', async () => {
            await expect(
                cashManager.connect(user).buy({
                    value: ethers.utils.parseEther('1'),
                })
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('1.1.2 [Fail]: Set new owner so old owner can not calling mint function ', async () => {
            await cash.connect(owner).setOwner(cashManager.address);

            await expect(cash.connect(owner).mint(user.address, ethers.utils.parseEther('1'))).to.be.revertedWith(
                'Ownable: caller is not the owner'
            );
        });

        it('1.1.3 [OK]: User buy cash successfully', async () => {
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
            ).to.changeTokenBalance(cashManager, user.address, ethers.utils.parseEther('1'));
        });
    });

    // describe('1.2 Testing `withdraw` function', () => {
    //     it('1.2.1 [Fail]: Balance of user is not enough', async () => {
    //         await cash.connect(owner).setOwner(cashManager.address);
    //         await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('2'))).to.be.revertedWith(
    //             'ERC20: burn amount exceeds balance'
    //         );
    //     });

    //     it('1.2.2 [Fail]: Balance of user is not enough', async () => {
    //         await cash.connect(owner).setOwner(cashManager.address);
    //         await cashManager.connect(user).buy({
    //             value: ethers.utils.parseEther('1'),
    //         });
    //         await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('2'))).to.be.revertedWith(
    //             'ERC20: burn amount exceeds balance'
    //         );
    //     });

    //     it('1.2.3 [OK]: User withdraw successfully', async () => {
    //         await cash.connect(owner).setOwner(cashManager.address);
    //         await cashManager.connect(user).buy({
    //             value: ethers.utils.parseEther('1'),
    //         });

    //         await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('0.5'))).to.changeTokenBalance(
    //             cashManager,
    //             user.address,
    //             ethers.utils.parseEther('-0.5')
    //         );
    //         await expect(cashManager.connect(user).withdraw(ethers.utils.parseEther('0.5'))).to.changeEtherBalances(
    //             [cashManager.address, user.address],
    //             [ethers.utils.parseEther('-0.5'), ethers.utils.parseEther('0.5')]
    //         );
    //     });
    // });
});
