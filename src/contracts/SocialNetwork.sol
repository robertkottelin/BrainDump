pragma solidity ^0.5.0;

contract SocialNetwork {
    uint public dataCount = 0;
    mapping(uint => Data) public datamapping;




    struct Data {
        uint id;
        string dataContent;
        address payable author;
        address payable hospital;
        uint tipAmount;
    }

    function setData(string memory _datacontent) public {
        dataCount ++;
        datamapping[dataCount] = Data(dataCount, _datacontent, msg.sender, 0x4Dd66071850Dc267c12D97397E8eD493399d5Aa9, 0);
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

    string public info;
    uint public infoCount = 0;

    function setInfo(string memory _info) public {
        info = _info;
        infoCount ++;
    }

    function getInfo() public view returns (string memory) {
        return info;
    }

    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public {
        name = "Dapp University Social Network";
        setInfo("the dark con of man");
    }

    function createPost(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        // Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        // Trigger event
        emit PostCreated(postCount, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Incremet the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
}
