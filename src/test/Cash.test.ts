import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { parseUnits, parseEther } from 'ethers/lib/utils';
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
    let ethToCash: number;
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
        ethToCash = (await cashManager.ethToCash()).toNumber();
    });

    describe('Testing `buy` function', () => {
        it('[Fail]: User buy cash but had not set Owner', async () => {
            await expect(
                cashManager.connect(user).buy({
                    value: parseEther('1'),
                })
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it('[Fail]: Set new owner so old owner can not calling mint function ', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);

            await expect(cash.connect(owner).mint(user.address, parseEther('1'))).to.be.revertedWith(
                'Ownable: caller is not the owner'
            );
        });

        it('[OK]: Set new owner to Cash contract ', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            expect(cashManager.address).to.equal(await cash.owner());
        });

        it('[OK]: User buy cash successfully', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);

            await cashManager.connect(user).buy({ value: parseEther('1') });

            await expect(
                cashManager.connect(user).buy({
                    value: parseEther('1'),
                })
            )
                .to.changeEtherBalances([cashManager.address, user.address], [parseEther('1'), parseEther('-1')])
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits(`${10 ** ethToCash}`, decimals));

            await expect(
                cashManager.connect(user).buy({
                    value: parseEther('1'),
                })
            ).to.changeTokenBalance(cash, user.address, parseUnits(`${10 ** ethToCash}`, decimals));
        });
    });

    describe('Testing `withdraw` function', () => {
        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(cashManager.connect(user).withdraw(parseUnits('0.5', decimals))).to.be.revertedWith(
                'Exceeds balance!'
            );
        });

        it('[Fail]: Balance of user is not enough', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy({
                    value: parseEther('1'),
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits(`${10 ** ethToCash}`, decimals));

            await expect(cashManager.connect(user).withdraw(parseUnits('200', decimals))).to.be.revertedWith(
                'Exceeds balance!'
            );
        });

        it('[Fail]: Withdraw 0 cash', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy({
                    value: parseEther('1'),
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits(`${10 ** ethToCash}`, decimals));

            await expect(cashManager.connect(user).withdraw(0)).to.be.revertedWith('Invalid value!');
        });

        it('[OK]: User withdraw successfully', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(
                cashManager.connect(user).buy({
                    value: parseEther('0.1'),
                })
            )
                .to.emit(cashManager, 'Bought')
                .withArgs(user.address, parseUnits(`${0.1 * 10 ** ethToCash}`, decimals));

            await expect(cashManager.connect(user).withdraw(parseUnits('5', decimals)))
                .to.changeTokenBalance(cash, user.address, parseUnits('-5', decimals))
                .to.emit(cashManager, 'Withdrawn')
                .withArgs(user.address, parseUnits('5', decimals));

            await expect(cashManager.connect(user).withdraw(parseUnits('5', decimals)))
                .to.changeEtherBalance(user.address, parseEther(`${5 / 10 ** ethToCash}`))
                .to.emit(cashManager, 'Withdrawn')
                .withArgs(user.address, parseUnits('5', decimals));
        });
    });

    describe('Testing `setETHToCash` function', () => {
        it('[Fail] Caller is not owner', async () => {
            await expect(cashManager.connect(user).setETHToCash(1)).to.be.revertedWith(
                'Ownable: caller is not the owner'
            );
        });

        it('[Fail] Amount is not valid', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(cashManager.connect(owner).setETHToCash(20)).to.be.revertedWith(
                'Invalid amount!'
            );
        });

        it('[OK] Set new amount successfully', async () => {
            await cash.connect(owner).transferOwnership(cashManager.address);
            await expect(cashManager.connect(owner).setETHToCash(5))
                .emit(cashManager, 'SetETHToCash')
                .withArgs(5);
        })
    });
});
