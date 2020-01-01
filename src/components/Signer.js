import React from "react";
import getWeb3 from "../utils/getWeb3";

class Signer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      adddress: null,
      message: "",
    };
    this.messageInput = React.createRef();
  }

  connectWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      if(window.ethereum && window.ethereum.on) {
        window.ethereum.on('accountsChanged', accounts => {
          this.setState({
            address: accounts[0]
          }, this.resetForm);
        });
      }
      
      const accounts = await web3.eth.getAccounts();
      this.setState({
        web3,
        address: accounts[0],
      }, this.resetForm);
    } catch (error) {
      alert("Failed to load web3 or accounts. Check console for details.");
    }
  };

  handleMessageChange = event => {
    this.setState({
      message: event.target.value,
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const {
      web3,
      message,
      address,
    } = this.state;

    this.setState({
      loading: true,
    });
    
    let signature = "";
    try {
      signature = await web3.eth.personal.sign(message, address);
    } catch(error) {
      this.setState({
        loading: false,
      });
    }

    this.setState({
      signature,
      loading: false,
    });
  };

  resetForm = () => {
    this.setState({
      message: "",
      signature: undefined,
    }, () => {
      if(this.messageInput.current) {
        this.messageInput.current.focus();
      }
    });
  };

  renderNoWeb3AvailableMessage = () => {
    return (
      <div className="Signer" style={this.props.style}>
        <div className="form-header">
          <h2>Sign a message</h2>
          <div className="help-button link"
            onClick={this.props.onHelpButtonClick}>Help</div>
        </div>
        <div>
          <p>In order to sign a message, you need to use a Ethereum-enabled browser.</p>
          <p>
            You can turn Chrome and Firefox into Ethereum-enabled browsers by installing the <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Metamask</a> plugin, or you can use <a href="https://www.brave.com/" target="_blank" rel="noopener noreferrer">Brave</a> or <a href="https://www.opera.com/" target="_blank" rel="noopener noreferrer">Opera</a>.
          </p>
          <p style={{marginBottom: '0px'}}>
            On mobile you can use <a href="https://status.im/get/" target="_blank" rel="noopener noreferrer">Status</a> and the mobile version of <a href="https://www.opera.com/" target="_blank" rel="noopener noreferrer">Opera</a>.
          </p>
        </div>
      </div>
    );
  }

  render() {
    const {
      style,
    } = this.props;
    const {
      web3,
      address,
      message,
      signature,
      loading,
    } = this.state;

    if(!window.ethereum && !window.web3) {
      return this.renderNoWeb3AvailableMessage();
    }

    const labelClassName = signature ? "label signed" : "label";

    return (
      <div className="Signer" style={style}>
        <div className="form-header">
          { !signature &&
            <h2>Sign a message</h2>
          }
          { signature &&
            <h2>You've signed a message!</h2>
          }
          <div className="help-button link"
            onClick={this.props.onHelpButtonClick}>Help</div>
        </div>
        { !web3 &&
          <div>
            <p>Before you sign a message, you need to connect Avow to your Ethereum-enabled browser.</p>
            <button onClick={this.connectWeb3}>Connect</button>
          </div>
        }
        { web3 &&
          <React.Fragment>
            { loading && <div>Confirm the signature request in your browser's user interface.</div>}
            { !loading &&
              <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-row">
                    <div className={labelClassName}>Your address:</div>
                    <div style={{wordBreak: "break-all"}}>{address}</div>
                  </div>
                  <div className="form-row">
                    <div className={labelClassName}>Message:</div>
                    <div>
                      { !signature &&
                        <textarea ref={this.messageInput}
                          value={message}
                          onChange={this.handleMessageChange}
                        ></textarea>
                      }
                      { signature &&
                        <pre>{message}</pre>
                      }
                    </div>
                  </div>
                  { !signature &&
                    <div className="form-row">
                      <button type="submit">Submit</button>
                    </div>
                  }
                  { signature &&
                    <React.Fragment>
                      <div className="form-row">
                        <div className={labelClassName}>Signature:</div>
                        <div style={{wordBreak: "break-all"}}>{signature}</div>
                      </div>
                      <div className="form-row">
                        <button onClick={this.resetForm}>Sign another message</button>
                      </div>
                    </React.Fragment>
                  }
                </form>
              </React.Fragment>
            }
          </React.Fragment>
        }
      </div>
    );
  }

}

Signer.defaulProps = {
  style: {},
};

export default Signer;