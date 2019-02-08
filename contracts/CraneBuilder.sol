pragma solidity ^0.4.17;
import "./Crane.sol";

contract CraneBuilder {
    address[64] public renters;
    bytes32 public conPara;
    address[] public cranes;

    constructor (bytes32 _conPara) public {
        require(_conPara != 0);
        conPara = _conPara;
    }

    function createCrane(string name) public returns (Crane) {
        //Der Ethereum Account der den Crane einstellt ist Eigentümer
        Crane kran = new Crane(name, msg.sender);
        cranes.push(kran);
        return kran;
    }

    function getCranes() public view returns (address[]) {
        return cranes;
    }

    // Adopting a pet
    function adopt(uint petId) public payable returns (uint) {
        require(petId >= 0 && petId <= 63);

        renters[petId] = msg.sender;

        if(msg.value > 0) {
            address(this).transfer(msg.value);
        }
        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[64]) {
        return renters;
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
