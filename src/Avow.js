import React from "react";
import Signer from "./components/Signer";
import Verifier from "./components/Verifier";
import HelpInfo from "./components/HelpInfo";

import "./Avow.scss";

const Modes = {
  SIGN: "sign",
  VERIFY: "verify",
};

class Avow extends React.Component {

  constructor() {
    super();
    this.state = {
      mode: Modes.SIGN,
    };
  }

  handleHelpButtonClick = () => {
    this.setState({
      helpInfoVisible: true
    });

    // Don't allow the page to be scrolled while the popup is open. It will
    // handle scrolling its own content, and we don't want two scroll bars.
    document.getElementsByTagName("html")[0].style = "overflow:hidden";
  };

  handleHelpInfoClose = () => {
    this.setState({
      helpInfoVisible: false
    });
    document.getElementsByTagName("html")[0].style = "overflow:auto";
  }
  
  render() {
    const {
      mode,
    } = this.state;

    const signerStyle = {
      display: mode === Modes.SIGN ? "block" : "none"
    };
    const verifierStyle = {
      display: mode === Modes.VERIFY ? "block" : "none"
    };

    return (
      <div className="Avow">
        <header>
          <h1>A V O W</h1>
          <h2>An Ethereum Message Signer and Signature Verifier</h2>
          <p>By <a href="https://michaelvandaniker.com">Michael VanDaniker</a></p>
        </header>
        <div className="container">
          <div className="tab-navigator">
            <div className="tabs">
              <button className={mode === Modes.SIGN ? "selected" : ""}
                onClick={() => {
                  this.setState({ mode: Modes.SIGN })
                }}>Sign a message</button>
              <button className={mode === Modes.VERIFY ? "selected" : ""}
                onClick={() => {
                  this.setState({ mode: Modes.VERIFY })
                }}>Verify a message signature</button>
            </div>
            <div className="tab-content">
              <Signer style={signerStyle}
                onHelpButtonClick={this.handleHelpButtonClick} />
              <Verifier style={verifierStyle} 
                onHelpButtonClick={this.handleHelpButtonClick} />
            </div>
          </div>
        </div>
        { this.state.helpInfoVisible &&
          <HelpInfo onClose={this.handleHelpInfoClose}/>
        }
      </div>
    );
  }
}

export default Avow;
