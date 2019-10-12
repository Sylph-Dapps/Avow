import React from "react";
import {
  ecrecover,
  pubToAddress,
  hashPersonalMessage,
  toBuffer,
  fromRpcSig,
} from 'ethereumjs-util';

/**
 * Returns true if the signature is valid for the provided message + address.
 * @param {String} address - "0x" prefixed address
 * @param {String} message - The raw (i.e. not hashed) message that was signed
 * @param {String} signature - The signature
 */
const verify = (address, message, signature) => {
  /*
    web3.js methods for recovering addresses are lacking, so we use ethereumjs-util instead.
    - web3.eth.accounts.recover(message, signature) doesn't handle "—" characters correctly, among other things
    - web3.eth.personal.ecRecover(message, signature) requires a connected wallet :(
  */
   const hash = hashPersonalMessage(toBuffer(message));
   const { v, r, s } = fromRpcSig(signature);
   const pubKey = ecrecover(hash, v, r, s);
   const recoveredAddress = "0x" + pubToAddress(pubKey).toString('hex');

   // Do a case-insensitive match because the case of the address returned by pubToAddress 
   // does not always match the case of the address from the web3 provider.
   return recoveredAddress.toUpperCase() === address.toUpperCase();
}

const Results = {
  NOT_RUN: "notRun",
  VALID: "valid",
  INVALID: "invalid",
}

class Verifier extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      address: "",
      message: "",
      signature: "",
      showValidationErrors: false,
      result: Results.NOT_RUN,
    };
  }

  handleAddressChange = event => {
    this.setState({
      address: event.target.value,
      result: Results.NOT_RUN,
    });
  };

  handleMessageChange = event => {
    this.setState({
      message: event.target.value,
      result: Results.NOT_RUN,
    });
  };

  handleSignatureChange = event => {
    this.setState({
      signature: event.target.value,
      result: Results.NOT_RUN,
    });
  };

  handleSubmit = () => {
    const {
      address,
      message,
      signature,
    } = this.state;

    this.setState({
      result: Results.NOT_RUN,
    });

    if(!this.isValidAddressEntry(address) || !this.isValidSignatureEntry(signature)) {
      this.setState({
        showValidationErrors: true,
      });
      return;
    }

    this.setState({
      result: verify(address, message, signature) ? Results.VALID : Results.INVALID,
      showValidationErrors: false,
    });
  };

  handleReset = () => {
    this.setState({
      address: "",
      message: "",
      signature: "",
      showValidationErrors: false,
      result: Results.NOT_RUN,
    });
  };

  isValidAddressEntry = address => {
    return address && address.length === 42 && address.substring(0, 2) === "0x";
  };

  isValidSignatureEntry = signature => {
    return signature && signature.length === 132 && signature.substring(0, 2) === "0x";
  };

  render() {
    const {
      style,
    } = this.props;
    const {
      address,
      message,
      signature,
      showValidationErrors,
      result,
    } = this.state;

    const addressInputClassName = showValidationErrors && !this.isValidAddressEntry(address) ? "error" : "";
    const signatureInputClassName = showValidationErrors && !this.isValidSignatureEntry(signature) ? "error" : "";

    return (
      <div className="Verifier" style={style}>
        <div className="form-header">
          <h2>Verify a message signature</h2>
          <div className="help-button link"
            onClick={this.props.onHelpButtonClick}>Help</div>
        </div>
        <div className="form-row">
          <div className="label">Signer's address:</div>
          <input value={address}
            className={addressInputClassName}
            onChange={this.handleAddressChange} />
          { showValidationErrors && !this.isValidAddressEntry(address) &&
            <div className="validation-error-message">Enter a valid Ethereum address. Ethereum addresses are 40 hexidecimal characters long, including the "0x" prefix.</div>
          }
        </div>
        <div className="form-row">
          <div className="label">Message:</div>
          <textarea value={message}
            onChange={this.handleMessageChange} />
        </div>
        <div className="form-row">
          <div className="label">Signature:</div>
          <input value={signature}
            className={signatureInputClassName}
            onChange={this.handleSignatureChange} />
          { showValidationErrors && !this.isValidSignatureEntry(signature) &&
            <div className="validation-error-message">Enter a valid signature. Signatures are 132 hexidecimal characters long, including the "0x" prefix.</div>
          }
        </div>
        <div className="form-row">
          <button onClick={this.handleSubmit}>Verify signature</button>
          {/*<button onClick={this.handleReset}>Reset</button>*/}
        </div>
        { result === Results.VALID &&
            <div className="valid-result-message result-message">Hooray! The message signature is valid!</div>
        }
        { result === Results.INVALID &&
            <div className="invalid-result-message result-message">The message signature is invalid :(</div>
        }
      </div>
    );
  }

}

Verifier.defaulProps = {
  style: {},
};

export default Verifier;