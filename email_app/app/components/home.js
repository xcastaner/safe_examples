import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';
import { ModalDialog, ModalPortal, ModalBackground } from 'react-modal-dialog';
import ReactSpinner from 'react-spinjs';
import className from 'classnames';
import pkg from '../../package.json';
import { CONSTANTS } from '../constants';

export default class Home extends Component {
  constructor() {
    super();

    this.reconnect = this.reconnect.bind(this);
  }

  reconnect() {
    const { reconnectApplication, account, refreshEmail } = this.props;
    return reconnectApplication()
      .then(() => refreshEmail(account),
            (err) => 'failed reconnecting');
  }

  render() {
    const { router } = this.context;
    const { coreData, inboxSize, savedSize, networkStatus, processing } = this.props;

    const isModalOpen = processing.state || (networkStatus !== CONSTANTS.NET_STATUS_CONNECTED);
    const spinnerBackgroundStyle = {
      zIndex: '5',
      position: 'fixed',
      height: '100%',
      width: '100%',
      opacity: '0.75',
      backgroundColor: 'white'
    }

    return (
      <div className="home">
        {
          isModalOpen &&
          <ModalPortal>
            {
              processing.state ?
                <div style={spinnerBackgroundStyle}>
                  <ReactSpinner />
                </div>
                :
                <ModalBackground>
                  <ModalDialog>
                    <div className="text-center">
                        <div>The application hast lost network connection.</div><br />
                        <div>Make sure the network link is up before trying to reconnect.</div><br />
                        <button className="mdl-button mdl-js-button bg-primary" onClick={this.reconnect}>Reconnect</button>
                    </div>
                  </ModalDialog>
                </ModalBackground>
            }
          </ModalPortal>
        }

        <div className="home-b">
          <div className={className('float-btn', { hide: router.isActive('/compose_mail')  })}>
            <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--primary">
              <Link id="new_mail" to="/compose_mail"><i className="material-icons">add</i></Link>
            </button>
          </div>
          <header className="home-head">
            <div className="lt-sec">
              <h3 className="title heading-md"><span className="bold">Email ID: </span>{coreData.id}</h3>
            </div>
            <div className="rt-sec text-right"></div>
          </header>
          <div className="home-cnt mdl-layout mdl-js-layout">
            <div className="home-nav mdl-list">
              <IndexLink className="home-nav-link" activeClassName="active" to="/home">
                <div className="mdl-list__item">
                  <span className="mdl-list__item-primary-content">
                    <i className="material-icons">email</i>
                    <span>Inbox</span>
                  </span>
                  <span className="mdl-list__item-secondary-action">{inboxSize === 0 ? '' : `${inboxSize}`}</span>
                </div>
              </IndexLink>
              <Link className="home-nav-link" activeClassName="active" to="/saved">
                <div className="mdl-list__item">
                  <span className="mdl-list__item-primary-content">
                    <i className="material-icons">drafts</i>
                    <span>Saved</span>
                  </span>
                  <span className="mdl-list__item-secondary-action">{savedSize === 0 ? '' : `${savedSize}`}</span>
                </div>
              </Link>
             </div>
            <div className="home-list-cnt  mdl-layout__content">
              <div className="page-content">{this.props.children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.contextTypes = {
  router: PropTypes.object.isRequired
};
