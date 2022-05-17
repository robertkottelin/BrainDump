import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import InputData from '../abis/InputData.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      const infoCount = await socialNetwork.methods.infoCount().call()
      const dataCount = await socialNetwork.methods.dataCount().call()
      this.setState({ postCount })
      this.setState({ dataCount })
      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      
      for (var p = 1; p <= dataCount; p++) {
        const data = await socialNetwork.methods.datamapping(p).call()
        this.setState({
          datamapping: [...this.state.datamapping, data]
        })
      }

      console.log({ datamapping: this.state.datamapping})
      
      //Load Info
      const info = await socialNetwork.methods.info().call()
      this.setState({ info })
      
      // Sort posts. Show highest tipped posts first
      
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  setInfo(info) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.setInfo(info).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  setData(data) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.setData(data).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  payPatient(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.payPatient(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      infoCount: 0,
      posts: [],
      info: '',
      datamapping: [],
      loading: true
    }

    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
    this.setInfo = this.setInfo.bind(this)
    this.setData = this.setData.bind(this)
    this.payPatient = this.payPatient.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              posts={this.state.posts}
              //createPost={this.createPost}
              //tipPost={this.tipPost}
              //setInfo={this.setInfo}
              setData={this.setData}
              payPatient={this.payPatient}
              datamapping = {this.state.datamapping}
            />
        }


        
        
      </div>
    );
  }
}

export default App;
