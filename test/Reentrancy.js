const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Reentrancy', () => {
    let deployer
    let bank, attackerContract

    beforeEach(async () => {

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user = accounts[1]
        attacker = accounts[2]

        const Bank = await ethers.getContractFactory('Bank', deployer)
        bank = await Bank.deploy()

        await bank.deposit({value : ethers.utils.parseEther('100')})
        await bank.connect(user).deposit({value : ethers.utils.parseEther('50')})
    
        const Attacker = await ethers.getContractFactory('Attacker', attacker)
        attackerContract = await Attacker.deploy(bank.address)
    })

    describe('facilitates deposits and withdraws', () => {

        it('accepts deposits', async () => {
            //check deposit balance
            const deployBalance = await bank.balanceOf(deployer.address)
            expect(deployBalance).to.eq(ethers.utils.parseEther('100'))
        
            const userBalance = await bank.balanceOf(user.address)
            expect(userBalance).to.eq(ethers.utils.parseEther('50'))
        })

        it('accepts withdraws', async () => {
            //withdraw funds 
            await bank.withdraw()
            const deployBalance = await bank.balanceOf(deployer.address)
            const userBalance = await bank.balanceOf(user.address)

            expect(deployBalance).to.eq(0)
            expect(userBalance).to.eq(ethers.utils.parseEther('50'))
        })

        it('allows attacker to drain funds from withdrawl()', async () => {
            console.log('***Before***')
            console.log(`Bank's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`)
            console.log(`Attacker's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)
        
            //perform attack
            await attackerContract.attack({value : ethers.utils.parseEther('10')})

            console.log('***After***')
            console.log(`Bank's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`)
            console.log(`Attacker's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)
        
            //check bank balance has been drained
            expect(await ethers.provider.getBalance(bank.address)).to.equal(0)

        })
        
    })
    
    describe('Non-Reentrancy', () => {
        let deployer, user, attacker
        let bank, attackerContract
      
        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            user = accounts[1]
            attacker = accounts[2]
      
            const BankNonReentrant = await ethers.getContractFactory('BankNonReentrant', deployer)
            bank = await BankNonReentrant.deploy()
      
            await bank.deposit({ value: ethers.utils.parseEther('100') })
            await bank.connect(user).deposit({ value: ethers.utils.parseEther('50') })
      
            const Attacker = await ethers.getContractFactory('Attacker', attacker)
            attackerContract = await Attacker.deploy(bank.address)
        });
      
        describe('Facilitates deposits and withdraws', () => {
      
            it('should not allow reentrant attack to drain funds', async () => {
                console.log('***Before Attack***')
                console.log(`Bank's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`)
                console.log(`Attacker's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)
      
                // Attempt reentrant attack
                let transactionPromise = attackerContract.attack({ value: ethers.utils.parseEther('10') })
    
                // Expect reentrancy to fail
                await expect(transactionPromise).to.be.revertedWith("Address: unable to send value, recipient may have reverted")
    
                console.log('***After Attack***')
                console.log(`Bank's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`);
                console.log(`Attacker's balance : ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)
      
                // Verify bank balance remains unchanged
                const bankBalance = await ethers.provider.getBalance(bank.address)
                expect(bankBalance).to.equal(ethers.utils.parseEther('150')) // 100 + 50 (initial deposits)
            })
      
        })
    })
    
})