//test go here
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Counter', () =>{

    let counter
    beforeEach(async () => {
        const Counter = await ethers.getContractFactory('Counter')
        counter = await Counter.deploy('My Counter', 1)
    })

    describe('Deployment', () =>{
        it('sets the initial count', async () =>{

            //fetch the count
            //check the count to make sure its what we expect
            const count = await counter.count()
            expect(count).to.equal(1);
        })
    
        it('sets the initial name', async () =>{
            const name = await counter.name()
            expect(name).to.equal('My Counter');
        })

    })

    //testing increment and decrement functions
    describe('Counting', () => {
        let transaction

        it('reads the count from the public variable', async () => {
            expect(await counter.count()).to.equal(1)
        })

        it('reads the count from the "getCount()" function', async () => {
            expect(await counter.getCount()).to.equal(1)
        })

        it('increments the count', async () => {
            transaction = await counter.increment()
            await transaction.wait()
            let count = await counter.count()

            expect(count).to.equal(2)

            //do it again
            transaction = await counter.increment()
            await transaction.wait()
            count = await counter.count()

            expect(count).to.equal(3)
        })

        it('decrement the count', async () => {
            transaction = await counter.decrement()
            await transaction.wait()
            let count = await counter.count()

            expect(count).to.equal(0)

            //if we decrement the count again the test will blow up
            //transaction = await counter.decrement() <- will blow up the test cause of uint
        
            //fix for the above
            await expect(counter.decrement()).to.be.reverted
        })

        it('reads the name from the public variable', async () => {
            expect(await counter.name()).to.equal('My Counter')
        })

        it('reads the name from the "getName()" function', async () => {
            expect(await counter.getName()).to.equal('My Counter')
        })

        it('updates the name', async () => {
            transaction = await counter.setName('Ayush')
            await transaction.wait()
            expect(await counter.name()).to.equal('Ayush')
        })
    })

})