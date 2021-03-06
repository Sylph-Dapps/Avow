import React from "react";

class HelpInfo extends React.Component {

  handleClick = event => {
    // Close the window if the user clicked the modal background or the close button
    if(['HelpInfo modal-background', 'close-button'].indexOf(event.target.className) !== -1) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <div className="HelpInfo modal-background"
        onClick={this.handleClick}>
        <div className="window">
          <div className="window-header">
            <div className="close-button">X</div>
          </div>
          <div className="window-content">
            <div className="q">What is this?</div>
            <div>
              <p>Avow lets you sign a message using your Ethereum account and verify signed message from other accounts.</p>
            </div>

            <div className="q">What does it mean to "sign a message"?</div>
            <div>
              <p>Signing a message is the act of combining your Ethereum account information with a free-text message to produce a unique string of 132 characters known as a signature.</p>
              <p>Only the owner of a particular Ethereum account can <i>sign</i> a message using that account, but given an account's address, a message, and a valid signature, anyone can <i>verify</i> that the signature was produced by combining the account information and the message.</p>
            </div>
            
            <div className="q">How are signed messages used?</div>
            <div>
              <p>Signed message can be used to prove account ownership. To do so, simply sign a message and share the signature. Anyone who doubts that you own the account can verify for themselves that your address and message produce the signature and that you must therefore be the account's owner.</p>
              <p>Some applications will have you sign a message to confirm that you agree to their terms and conditions or to authorize the application to take certain actions on your behalf.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

HelpInfo.defaultProps = {
  onClose: () => {},
};

export default HelpInfo;