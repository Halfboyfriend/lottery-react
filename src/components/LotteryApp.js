import React, { Component } from "react";
import web3 from "../web3";
import lottery from "../lottery";
import './styles.css'

class LotteryApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: "",
      manager: "",
      players: [],
      balance: "",
      value: "",
      message: "",
    };
  }

  updateValue = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  pickEtherWinner = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    if (accounts[0] === this.state.manager) {
      this.setState({
        message: "Waiting on transaction sucess...",
      });
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      this.setState({
        message: " A winner has been picked!",
      });
    } else {
      this.setState({
        message: "Only the manager can pick a winner, Contact the Manager!",
      });
    }
  };

  walletConnection = () => {
    const btn = document.getElementById("conn__btn");
    try {
      web3.eth.requestAccounts().then((response) => {
        this.setState({
          userAddress: response[0],
        });
        console.log(response);
      });
      if (this.state.userAddress) {
        btn.innerHTML = `${this.state.userAddress.substring(
          0,
          7
        )}...${this.state.userAddress.substring(35, 42)}`;
      }
    } catch (err) {
      throw new Error(`${err} while trying to connect your wallet`);
    }
  };

  submittedForm = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    if (this.state.value > '0.01'){
      if (typeof parseFloat(this.state.value) === "number") {
        this.setState({
          message: "Waiting on transaction sucess...",
        });
        await lottery.methods.enter().send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, "ether"),
        });
  
        this.setState({
          message: "You have been entered!",
        });
      } else {
        this.setState({
          message: "Value can only be number!",
        });
      }
    } else {
      this.setState({
        message: "Ether value cannot be less than 0.011ether!",
      });
    }
  
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getAllPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    console.log(players);
    this.setState({
      manager: manager,
      players: players,
      balance: balance,
    });
  }
  render() {
    const { manager, players, balance, value, message } = this.state;
    return (
      <React.Fragment>
        <h1>Lottery Contract!</h1>

        <button id="conn__btn" onClick={this.walletConnection}>
          Connect wallet
        </button>

        <div id="landind__page">
          <h2>
            WELCOME TO GOERLI ETH LOTTERY
          </h2>
          <p >
          ✅ Compete in this lottery and get a chance to win ETH for yourself🥳🥳🥳
              
          </p>
          <p>
          ✅ Join the lottery by putting a minimum of 0.011 ether, and click enter!!!.
          </p>
          <p>
          ✅ Wait patiently for the manager to pick a winner!!!
          </p>
        </div>

        <div id="content">
          <p>
            Manager address:{" "}
            {`${manager.substring(0, 7)}...${manager.substring(
              35,
              manager.length - 1
            )}`}
          </p>
          <p id="notice">
            There are currently {players.length} people in this contract
            competing to win <span>{web3.utils.fromWei(balance, "ether")}</span>  ether!
          </p>
        </div>
      
        <div>

          <form onSubmit={this.submittedForm}>
          
          <div>
         {message ? <p id="message"> {message} </p> : null}
          </div>
            <h2>Want to try your luck?</h2>
            <p>
              <label>
                Amount of Ether:
                <input onChange={this.updateValue} type="text" value={value} placeholder="Enter amount" />
              </label>
            </p>

            <button type="submit" id="enter">Enter</button>
          </form>
         
          
        </div>

        <div id="manager__page">
       
          <h3>Ready to pick WINNER?</h3>

          <button id="enter" onClick={this.pickEtherWinner}>Pick a winner</button>
        </div>
      </React.Fragment>
    );
  }
}

export default LotteryApp;

//5286553
