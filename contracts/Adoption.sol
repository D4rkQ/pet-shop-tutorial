pragma solidity ^0.4.17;
import "./Kran.sol";

contract Adoption {
    address[16] public adopters;
    bytes32 public conPara;
    address[] public krane;

    constructor (bytes32 _conPara) public {
        require(_conPara != 0);
        conPara = _conPara;
    }

    function createKran(bytes32 name) public returns (Kran) {
        Kran kran = new Kran(name);
        krane.push(kran);
        return kran;
    }

    function getKrane() public view returns (address[]) {
        return krane;
    }

    // Adopting a pet
    function adopt(uint petId) public payable returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender;

        if(msg.value > 0) {
            address(this).transfer(msg.value);
        }

        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16]) {
        return adopters;
    }

    function storeETH() payable public {
        // nothing to do here
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Constructor which allows us to fund contract on creation
    function Payable() public payable {
    }

    // `fallback` function called when eth is sent to Payable contract
    function () public payable {
    }

}
