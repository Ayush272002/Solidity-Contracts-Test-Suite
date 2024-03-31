const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),'ether')
}

const ether = tokens

describe('FlashLoan', () => {
    let token,flashLoan, FlashLoanReceiver, deployer

    beforeEach(async () => {
        //setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]

        //load accounts
        const FlashLoan =  await ethers.getContractFactory('FlashLoan')
        const FlashLoanReceiver =  await ethers.getContractFactory('FlashLoanReceiver')
        const Token = await ethers.getContractFactory('Token')
    
        //deploy token
        token = await Token.deploy('XYZ', 'xyzz', '1000000')

        //deploy flash loan pool
        flashLoan = await FlashLoan.deploy(token.address)

        //approve tokens before depositing
        let transaction = await token.connect(deployer).approve(flashLoan.address, tokens(1000000))
        await transaction.wait()

        //deposit the tokens in the pool
        transaction = await flashLoan.connect(deployer).depositTokens(tokens(1000000))
        await transaction.wait()

        //deploy flash loan receiver
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address)
    })

    describe('Deploment', () => {

        it('sends token to the flash loan pool contract', async () => {
            expect(await token.balanceOf(flashLoan.address)).to.equal(tokens(1000000))
        })
    })

    describe('Borrowing  Funds', () => {
        it('borrows funds from the pool', async () => {
            let amount = tokens(100)
            let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(amount)
            let result = transaction.wait()

            await expect(transaction).to.emit(flashLoanReceiver,'LoanReceived').withArgs(token.address, amount)
        })

        it('invests borrowed funds', async () => {
            let amount = tokens(100);
            let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(amount);
            let result = await transaction.wait()

            // Retrieve the amount invested event
            let fundsInvestedEvent = result.events.find(event => event.event === 'FundsInvested')

            // Expect the event to exist
            expect(fundsInvestedEvent).to.not.be.undefined

            // Retrieve the amount invested from the event
            let amountInvested = fundsInvestedEvent.args.amountInvested

            // Expect the amount invested to match the borrowed amount
            expect(amountInvested).to.equal(amount)
        });

        it('returns remaining funds to the pool after investment', async () => {
            let initialPoolBalance = await token.balanceOf(flashLoan.address)
            let amount = tokens(100)

            // Execute flash loan and investment
            await flashLoanReceiver.connect(deployer).executeFlashLoan(amount)

            // Retrieve the final pool balance after investment
            let finalPoolBalance = await token.balanceOf(flashLoan.address)

            // Expect the final pool balance to be the same as the initial balance
            expect(finalPoolBalance).to.equal(initialPoolBalance)
        });
    })
})