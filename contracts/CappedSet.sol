// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract CappedSet {
    using Address for address;
    uint256 private constant DEFAULT_VALUE = type(uint256).max;

    struct Element {
        uint256 value;
        bool exists;
    }

    mapping(address => Element) private elements;
    address private lowestAddress;
    uint256 private lowestValue;
    uint256 private numElements;

    address[] private keys;

    constructor(uint256 _numElements) {
        require(_numElements > 0, "Number of elements must be greater than zero");
        numElements = _numElements;
        lowestValue = DEFAULT_VALUE;
    }

    function insert(address addr, uint256 value) public returns (address, uint256) {
        require(addr != address(0), "Invalid address");
        require(value != 0, "Value cannot be zero");

        if (elements[addr].exists) {
            // Update existing element
            elements[addr].value = value;
        } else {
            // Insert new element
            elements[addr] = Element(value, true);
            keys.push(addr);

            // Check if it's the new lowest value
            if (value < lowestValue) {
                lowestAddress = addr;
                lowestValue = value;
            }
        }

        if (numElements == 1 && lowestValue != DEFAULT_VALUE) {
            return (lowestAddress, lowestValue);
        }

        return (address(0), 0);
    }

    function update(address addr, uint256 newVal) public returns (address, uint256) {
        require(addr != address(0), "Invalid address");
        require(newVal != 0, "Value cannot be zero");

        require(elements[addr].exists, "Element does not exist");

        uint256 oldValue = elements[addr].value;
        elements[addr].value = newVal;

        if (newVal < lowestValue) {
            lowestAddress = addr;
            lowestValue = newVal;
        } else if (oldValue == lowestValue) {
            updateLowest();
        }

        return (lowestAddress, lowestValue);
    }

    function remove(address addr) public returns (address, uint256) {
        require(addr != address(0), "Invalid address");

        require(elements[addr].exists, "Element does not exist");

        delete elements[addr];

        if (elements[lowestAddress].exists) {
            if (addr == lowestAddress) {
                updateLowest();
            }
        } else {
            lowestAddress = address(0);
            lowestValue = 0;
        }

        return (lowestAddress, lowestValue);
    }

    function getValue(address addr) public view returns (uint256) {
        require(addr != address(0), "Invalid address");

        return elements[addr].value;
    }

    function updateLowest() private {
        lowestValue = DEFAULT_VALUE;

        for (uint256 i = 0; i < keys.length; i++) {
            address addr = keys[i];
            uint256 value = elements[addr].value;
            if (value < lowestValue) {
                lowestAddress = addr;
                lowestValue = value;
            }
        }
    }
}
