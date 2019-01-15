pragma solidity ^0.4.24;

contract Kran {
    address owner;
    bytes32 name;
    bytes32 hOhOhO;

    constructor (bytes32 _name) public {
        require(_name != 0);
        name = _name;
        owner = msg.sender;
    }

    function getName() public view returns (bytes32) {
        return name;
    }

}
