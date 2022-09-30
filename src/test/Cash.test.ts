import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Cash__factory, CashManager__factory, Cash, CashManager } from '../typechain-types';

describe('Testing CashManager contract', () => {
    let owner: SignerWithAddress;
    let user: SignerWithAddress;

    let CashFactory: Cash__factory;
    let CashManagerFactory: CashManager__factory;

    let cash: Cash;
    let cashManager: CashManager;

    let decimals: number;
    before(async () => {
        CashFactory = (await ethers.getContractFactory('Cash')) as Cash__factory;
        CashManagerFactory = (await ethers.getContractFactory('CashManager')) as CashManager__factory;
    });

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();

        cash = (await upgrades.deployProxy(CashFactory)) as Cash;
        await cash.deployed();

        await expect(upgrades.deployProxy(CashManagerFactory, [user.address])).to.be.revertedWith(
            'Invalid Cash contract'
        );

        cashManager = (await upgrades.deployProxy(CashManagerFactory, [cash.address])) as CashManager;
        await cashManager.deployed();

        decimals = await cash.decimals();
    });

    describe('Testing `buy` function', () => {
        it('[Fail]: User buy cash but had not set Owner', async () => {
            await expect(
                cashManager.connect(user).buy({
                    value: parseUnits('15', decimals),
                })
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('[Fail]: Set new owner so old owner can not calling mint function ', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);

            await expect(cash.connect(owner).mint(user.address, parseUnits('1', decimals))).to.be.revertedWith(
                'Ownable: caller is not the owner'
            );
        });

        it('[OK]: Set new owner to Cash contract ', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            expect(cashManager.address).to.equal(await cash.owner());
        });

        it.only('[OK]: User buy cash successfully', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);

            await cashManager.connect(user).buy({ value: parseUnits('1', decimals) });

            await expect(
                cashManager.connect(user).buy({
                    value: parseUnits('100', decimals),
                })
            )
                .to.changeEtherBalances(
                    [cashManager.address, user.address],
                    [parseUnits('100', decimals), parseUnits('-100', decimals)]
                )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits('100', decimals));

            await expect(
                cashManager.connect(user).buy({
                    value: parseUnits('0.001', decimals),
                })
            ).to.changeTokenBalance(cash, user.address, parseUnits('0.001', decimals));

            const balance = await cash.balanceOf(user.address);
            console.log('balance', ethers.utils.formatUnits(balance, decimals));
        });
    });

    describe('Testing `withdraw` function', () => {
        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(cashManager.connect(user).withdraw(parseUnits('0.5', decimals))).to.be.revertedWith(
                'ERC20: burn amount exceeds balance'
            );
        });

        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy({
                    value: parseUnits('100', decimals),
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits('100', decimals));

            await expect(cashManager.connect(user).withdraw(parseUnits('200', decimals))).to.be.revertedWith(
                'ERC20: burn amount exceeds balance'
            );
        });

        it('[Fail]: Withdraw 0 cash', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy({
                    value: parseUnits('100', decimals),
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits('100', decimals));

            await expect(cashManager.connect(user).withdraw(0)).to.be.revertedWith('Invalid value!');
        });

        it('[OK]: User withdraw successfully', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy({
                    value: parseUnits('10', decimals),
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits('10', decimals));

            await expect(cashManager.connect(user).withdraw(parseUnits('5', decimals)))
                .to.changeTokenBalance(cash, user.address, parseUnits('-5', decimals))
                .to.emit(cashManager, 'Withdrawn')
                .withArgs(user.address, parseUnits('5', decimals));

            await expect(cashManager.connect(user).withdraw(parseUnits('5', decimals)))
                .to.changeEtherBalance(user.address, parseUnits('5', decimals))
                .to.emit(cashManager, 'Withdrawn')
                .withArgs(user.address, parseUnits('5', decimals));
        });
    });
});
