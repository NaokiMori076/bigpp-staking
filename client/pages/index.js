import React from "react";
import { Alert } from "react-bootstrap";

import { getStakedBalance, getRewardsStats } from "../web3/stakes";
import { getBalance as getBalanceLP } from "../web3/cake_lp";

import { getCurrentRewardPeriod } from "../web3/reward_phases";

import Header from "../components/Header";
import { Page, Center } from "../components/Layout";
import { AlertDismissible } from "../components/AlertDismissible";
import StakeView from "../components/StakeView";

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountConnected: false,
      currentRewardPeriod: undefined,
    };
    this.headerRef = React.createRef();
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    this.loadBalances();
  }

  stakeUpdated = async () => {
    await this.headerRef.current.reload();
    await this.reload();
  };

  setAccountConnected = (connected) => {
    this.setState({
      accountConnected: connected,
    });
  };

  // async loadBalances() {
  //   getCurrentRewardPeriod()
  //     .then((period) => {
  //       this.setState({ currentRewardPeriod: period });
  //       if (period) {
  //         return getStakedBalance();
  //       }
  //     })
  //     .then((stakedBalance) => {
  //       this.setState({ lpStaked: stakedBalance });
  //       return getBalanceLP();
  //     })
  //     .then((balanceLP) => {
  //       this.setState({ lpUnstaked: balanceLP.units });
  //       return getRewardsStats();
  //     })
  //     .then((info) => {
  //       console.log(">>> info: ", info);
  //       this.setState(info);
  //     })
  //     .catch((error) => {
  //       this.setState({ error: error.message });
  //     });
  // }

  async loadBalances() {
    getCurrentRewardPeriod()
      .then((period) => {
        this.setState({ currentRewardPeriod: period }); // Corrected the typo here
        if (period) {
          return getStakedBalance();
        }
      })
      .then((stakedBalance) => {
        this.setState({ lpStaked: stakedBalance });
        return getBalanceLP();
      })
      .then((balanceLP) => {
        this.setState({ lpUnstaked: balanceLP.units });
        return getRewardsStats();
      })
      .then((info) => {
        console.log(">>> info: ", info);
        this.setState(info);
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  async handleAllowanceUpdated() {
    console.log(">>> handleAllowanceUpdated() -- TODO");
  }

  handleSuccess = (result) => {
    this.headerRef.current.reload();
    this.reload();
    this.setState({
      info: {
        title: "Success!",
        detail: result, //JSON.stringify(result, null, 2),
      },
    });
  };

  handleError = (error, message) => {
    if (message) {
      this.setState({ error: message });
    } else if (error && error.message) {
      this.setState({ error: error.message });
    } else {
      this.setState({ error: `An error occurred (${error})` });
    }
  };

  render() {
    console.log(">>>> render", this.state);
    const {
      accountConnected,
      lpUnstaked,
      lpStaked,
      claimableRewards,
      rewardsPaid,
      rewardRate,
      totalRewardsPaid,
    } = this.state;

    if (!accountConnected)
      return (
        <Page>
          <Header
            ref={this.headerRef}
            reload={() => this.reload()}
            setAccountConnected={(connected) =>
              this.setAccountConnected(connected)
            }
          />
          <Center>
            <Alert
              variant="info"
              title="No Ethereum account connected"
              style={{ textAlign: "center" }}
            >
              Please connect an Ethereum account to use the dapp!
            </Alert>
          </Center>
        </Page>
      );

    return (
      <Page>
        <Header
          ref={this.headerRef}
          reload={() => this.reload()}
          setAccountConnected={(connected) =>
            this.setAccountConnected(connected)
          }
        />

        <div className="w-100 divisor"> </div>

        <h1 className="text-center-top">BIGPP LP STAKING</h1>

        <Center>
          {this.state.error && (
            <AlertDismissible variant="danger" title="Error">
              {" "}
              {this.state.error}{" "}
            </AlertDismissible>
          )}
          {this.state.info && (
            <AlertDismissible variant="info" title={this.state.info.title}>
              {this.state.info.detail}
            </AlertDismissible>
          )}

          {!this.state.currentRewardPeriod && (
            <Alert variant="info"> No Active Reward Period. </Alert>
          )}

          {this.state.currentRewardPeriod && (
            <StakeView
              lpUnstaked={lpUnstaked}
              lpStaked={lpStaked}
              claimableRewards={claimableRewards}
              rewardsPaid={rewardsPaid}
              rewardRate={rewardRate}
              totalRewardsPaid={totalRewardsPaid}
              handleSuccess={(result) => this.handleSuccess(result)}
              handleError={(error, message) => this.handleError(error, message)}
              allowanceUpdated={() => this.handleAllowanceUpdated()}
              rewardPeriod={this.state.currentRewardPeriod}
            />
          )}
        </Center>
      </Page>
    );
  }
}
