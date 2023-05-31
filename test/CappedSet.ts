import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

describe("CappedSet", () => {
    let CappedSet: any;
    let cappedSet: any;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;
    let addr3: Signer;

    beforeEach(async () => {
        CappedSet = await ethers.getContractFactory("CappedSet");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        cappedSet = await CappedSet.deploy(3); // Set the maximum number of elements to 3
        await cappedSet.deployed();
    });

    it("should insert elements and return the new lowest element", async () => {
        const tx1 = await cappedSet.insert(addr1.address, 100);
        expect(tx1).to.emit(cappedSet, "ElementInserted").withArgs(addr1.address, 100);
        expect(await cappedSet.getValue(addr1.address)).to.equal(100);
        expect(await cappedSet.getValue(addr2.address)).to.equal(0);
        expect(await cappedSet.getValue(addr3.address)).to.equal(0);

        const tx2 = await cappedSet.insert(addr2.address, 50);
        expect(tx2).to.emit(cappedSet, "ElementInserted").withArgs(addr2.address, 50);
        expect(await cappedSet.getValue(addr1.address)).to.equal(100);
        expect(await cappedSet.getValue(addr2.address)).to.equal(50);
        expect(await cappedSet.getValue(addr3.address)).to.equal(0);

        const tx3 = await cappedSet.insert(addr3.address, 75);
        expect(tx3).to.emit(cappedSet, "ElementInserted").withArgs(addr3.address, 75);
        expect(await cappedSet.getValue(addr1.address)).to.equal(100);
        expect(await cappedSet.getValue(addr2.address)).to.equal(50);
        expect(await cappedSet.getValue(addr3.address)).to.equal(75);

        const tx4 = await cappedSet.insert(addr1.address, 80);
        expect(tx4).to.emit(cappedSet, "ElementInserted").withArgs(addr1.address, 80);
        expect(await cappedSet.getValue(addr1.address)).to.equal(80);
        expect(await cappedSet.getValue(addr2.address)).to.equal(50);
        expect(await cappedSet.getValue(addr3.address)).to.equal(75);
    });

    it("should update an existing element and return the new lowest element", async () => {
        await cappedSet.insert(addr1.address, 100);
        await cappedSet.insert(addr2.address, 50);
        await cappedSet.insert(addr3.address, 75);

        const tx1 = await cappedSet.update(addr2.address, 60);
        expect(tx1).to.emit(cappedSet, "ElementUpdated").withArgs(addr2.address, 60);
        expect(await cappedSet.getValue(addr2.address)).to.equal(60);

        const tx2 = await cappedSet.update(addr3.address, 70);
        expect(tx2).to.emit(cappedSet, "ElementUpdated").withArgs(addr3.address, 70);
        expect(await cappedSet.getValue(addr3.address)).to.equal(70);

        const tx3 = await cappedSet.update(addr1.address, 80);
        expect(tx3).to.emit(cappedSet, "ElementUpdated").withArgs(addr1.address, 80);
        expect(await cappedSet.getValue(addr1.address)).to.equal(80);
    });

    it("should remove an existing element and return the new lowest element", async () => {
        await cappedSet.insert(addr1.address, 100);
        await cappedSet.insert(addr2.address, 50);
        await cappedSet.insert(addr3.address, 75);

        const tx1 = await cappedSet.remove(addr2.address);
        expect(tx1).to.emit(cappedSet, "ElementRemoved").withArgs(addr2.address);
        expect(await cappedSet.getValue(addr2.address)).to.equal(0);

        const tx2 = await cappedSet.remove(addr3.address);
        expect(tx2).to.emit(cappedSet, "ElementRemoved").withArgs(addr3.address);
        expect(await cappedSet.getValue(addr3.address)).to.equal(0);

        const tx3 = await cappedSet.remove(addr1.address);
        expect(tx3).to.emit(cappedSet, "ElementRemoved").withArgs(addr1.address);
        expect(await cappedSet.getValue(addr1.address)).to.equal(0);
    });
});
