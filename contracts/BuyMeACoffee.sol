// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] public memos;
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy coffee with 0 eth");
        
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));
        
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    function withdrawTips() public {
        require(owner == msg.sender, "Only the owner can withdraw");
        require(address(this).balance > 0, "No funds to withdraw");
        owner.transfer(address(this).balance);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
