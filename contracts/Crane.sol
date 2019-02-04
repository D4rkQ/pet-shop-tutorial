pragma solidity ^0.4.24;

contract Crane {
    address owner;
    string name;

    constructor (string _name, address _owner) public {
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
