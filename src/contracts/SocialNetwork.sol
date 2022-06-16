pragma solidity ^0.5.10;

contract SocialNetwork {
    uint public dataCount = 0;
    mapping(uint => Data) public datamapping;

    struct Data {
        uint id;
        string dataContent;
        string date;
        address payable author;
        address payable hospital;
        uint tipAmount;
        }

    function setData(string memory _datacontent, string memory _date) public {
      dataCount++;
      datamapping[dataCount] = Data(dataCount, _datacontent, _date, msg.sender, 0x4Dd66071850Dc267c12D97397E8eD493399d5Aa9, 0);
    }

    function deleteData(uint _id) public {
      delete datamapping[_id];
      dataCount--;
    }

    function editData(uint _i, string memory _datacontent) public {
      datamapping[_i] = Data(_i, _datacontent, datamapping[_i].date, msg.sender, datamapping[_i].hospital, datamapping[_i].tipAmount);
    }

    function payPatient(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= dataCount);
    // Fetch the post
    Data memory _datacontent = datamapping[_id];
    // Fetch the author
    address payable _author = _datacontent.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Incremet the tip amount
    _datacontent.tipAmount = _datacontent.tipAmount + msg.value;
    // Update the post
    datamapping[_id] = _datacontent;
    }
}
