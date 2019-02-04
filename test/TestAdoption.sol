pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CraneBuilder.sol";

contract TestAdoption {
    CraneBuilder adoption = CraneBuilder(DeployedAddresses.Adoption());
    uint public initialBalance = 1 ether;
    uint private testWei = 200000 wei;

    // Testing the adopt() function
    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt.value(testWei)(8);

        uint expected = 8;

        Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded.");
        Assert.equal(adoption.getBalance(), testWei, "d");
    }

    // Testing retrieval of a single pet's owner
    function testGetAdopterAddressByPetId() public {
        // Expected owner is this contract
        address expected = this;

        address adopter = adoption.adopters(8);

        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
    }

    // Testing retrieval of all pet owners
    function testGetAdopterAddressByPetIdInArray() public {
        // Expected owner is this contract
        address expected = this;

        // Store adopters in memory rather than contract's storage
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
    }

    function testTransferETH() public {
        address(adoption).transfer(testWei);
        address(adoption).send(testWei);
        Assert.equal(adoption.getBalance(), 3*testWei, "Ether Balance should be 10.");
    }
}