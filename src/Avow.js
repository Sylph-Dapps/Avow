import React from "react";
import {
  Redirect,
  NavLink,
  withRouter,
} from "react-router-dom";
import Signer from "./components/Signer";
import Verifier from "./components/Verifier";
import HelpInfo from "./components/HelpInfo";

import "./Avow.scss";

// Dynamically determine what pathname represents the route of the app by checking if we are at "/sign" or "/verify" and using
// everything in the pathname that appears before it as the new pathname. This obviates the need to have different configurations
// for dev (where the app is served from the route URL) or production (where it could be hosted anywhere).
let pathname = window.location.pathname;
let needToRedirect = true;
const routeList = ["/sign", "/verify"];
for(var a = 0; a < routeList.length; a++) {
  const route = routeList[a];
  if(pathname.endsWith(route)) {
    pathname = pathname.slice(0, pathname.lastIndexOf(route));
    needToRedirect = false; // If the user is on "/sign" or "/verify" we do not redirect to "/sign".
    break;
  }
}
// We're goign to add the slash before "sign" and "verify" where we define our Routes, so if the pathname ends with a slash we can remove it.
if(pathname.endsWith("/")) {
  pathname = pathname.slice(0, pathname.lastIndexOf("/"));
}
const Routes = {
  SIGN: pathname + "/sign",
  VERIFY: pathname + "/verify",
}

class Avow extends React.Component {

  constructor() {
    super();
    this.state = {
      helpInfoVisible: false
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
      location,
    } = this.props;

    // We store Signer and Verfier's form field values in those components' state. To avoid having the form fields
    // become empty when we switch from one to the other and back again, we keep both components mounted at all times
    // and toggle their visiblity. Using <Switch> and <Route/> would unmount them.
    const signerStyle = {
      display: location.pathname === Routes.SIGN ? "block" : "none"
    };
    const verifierStyle = {
      display: location.pathname === Routes.VERIFY ? "block" : "none"
    };

    return (
      <div className="Avow">
        <header>
          <h1>A V O W</h1>
          <h2>An Ethereum Message Signer and Signature Verifier</h2>
          <p>By <a href="https://michaelvandaniker.com">Michael VanDaniker</a></p>
        </header>
        <div className="container">
          { needToRedirect && <Redirect exact from="/" to={Routes.SIGN}/> }
          <div className="tab-navigator">
            <div className="tabs">
              <NavLink to={Routes.SIGN} activeClassName="selected">Sign a message</NavLink>
              <NavLink to={Routes.VERIFY} activeClassName="selected">Verify a message signature</NavLink>
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

export default withRouter(Avow);
