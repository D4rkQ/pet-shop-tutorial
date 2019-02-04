pragma solidity ^0.4.24;

contract Kran {
    // owner ist inner Contract und nicht der adopter das ist falsch
    address owner;
    string name;
    bytes32 hOhOhO;

    constructor (string _name, address _owner) public {
        //require definieren!!!
        //require(_name != 0);
        name = _name;
        owner = _owner;
    }

    function getName() public view returns (string) {
        return name;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

}
