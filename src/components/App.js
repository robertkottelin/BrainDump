import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
import Main from './Main';

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
    console.log(accounts)
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, '0x6c68E16857555482d9Ab182d1dd702Cb3F689a27')

      this.setState({ socialNetwork })
      const dataCount = await socialNetwork.methods.dataCount().call()
      this.setState({ dataCount })
      // Load Data      
      for (var p = 1; p <= dataCount; p++) {
        const data = await socialNetwork.methods.datamapping(p).call()
        //const _id = data.id;
        //console.log(typeof _id)
        this.setState({
          datamapping: [...this.state.datamapping, data]
        })
      }

      console.log({ datamapping: this.state.datamapping})
      
      /*//Sort data
      this.setState({
        datamapping: this.state.datamapping.sort((a,b) => b.tipAmount - a.tipAmount )
      })*/
      this.setState({ loading: false})
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  async loadThisUser() {
    const thisuser = this.props.account;
    console.log(typeof(this.props.account))
    return(thisuser)
  }

  setData(data) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.setData(data).send({ from: this.state.account })
    .on('receipt', (_receipt) => {
      this.setState({ loading: false })
      window.location.reload(false);
    })
  }

  deleteData(id) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.deleteData(id).send({ from: this.state.account })
    .on('receipt', (_receipt) => {
      this.setState({ loading: false })
      window.location.reload(false);
    })
  }
/*
  payPatient(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.payPatient(id).send({ from: this.state.account, value: tipAmount })
    .on('receipt', (_receipt) => {
      this.setState({ loading: false })
      window.location.reload(false);
    })
  }
  */

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      datamapping: [],
      loading: true
    }

    this.setData = this.setData.bind(this)
    this.deleteData = this.deleteData.bind(this)
    //this.payPatient = this.payPatient.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              setData={this.setData}
              deleteData={this.deleteData}
              payPatient={this.payPatient}
              datamapping = {this.state.datamapping}
              loadThisUser
            />
        }
      </div>
    );
  }
}
export default App;