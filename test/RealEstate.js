const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),'ether')
}

const ether = tokens

describe('RealEstate', ()=> {
    let realEstate,escrow
    let deployer, seller
    let nftID = 1
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)

    beforeEach(async () => {

        //set up accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]
        inspector = accounts[2]
        lender = accounts[3]

        //load contracts
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')
        

        //deploy contract
        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy(realEstate.address, nftID, purchasePrice, escrowAmount, seller.address, buyer.address, inspector.address, lender.address )
    
        //seller approves nft
        transaction = await realEstate.connect(seller).approve(escrow.address, nftID)
        await transaction.wait()
    })

    describe('Deployment' , async () => {
        
        it('sends an NFT to the seller/ deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe('Selling Real Estate' , async () => {
        
        let balance, transaction
        it('executes a successful transaction', async () => {
            //Expects seller to be the nft owner before the sale
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
            
            //check escrow balance before
            balance = await escrow.getBalance()
            console.log("escrow balance : ", ethers.utils.formatEther(balance))

            //buyer deposits earnest
            transaction = await escrow.connect(buyer).depositEarnest({value: ether(20)})
            await transaction.wait()
            console.log("Buyer deposits earnest money")

            //check escrow balance
            balance = await escrow.getBalance()
            console.log("escrow balance : ", ethers.utils.formatEther(balance))

            //inspector updates status
            transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            console.log("Inspector updates status")

            //buyer approves sale
            transaction = await escrow.connect(buyer).approveSale()
            await transaction.wait()
            console.log("buyer approves sale")

            //seller approves sale
            transaction = await escrow.connect(seller).approveSale()
            await transaction.wait()
            console.log("seller approves sale")

            //lender funds sale
            transaction = await lender.sendTransaction({to : escrow.address, value: ether(80)})

            //lender approves sale
            transaction = await escrow.connect(lender).approveSale()
            await transaction.wait()
            console.log("lender approves sale")

            //finalise the sale
            transaction = await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("Buyer finalizes sale")

            //Expects buyer to be the nft owner after the sale
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)

            //expect seller to receive the funds
            balance = await ethers.provider.getBalance(seller.address)
            console.log("Seller balance : ", ethers.utils.formatEther(balance))
            expect(balance).to.be.above(ether(10099))
        })
    })

})