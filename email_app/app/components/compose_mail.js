import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { showError, showSuccess } from '../utils/app_utils';
import { CONSTANTS } from '../constants';

export default class ComposeMail extends Component {
  constructor() {
    super();
    this.tempMailContent = null;
    this.sendMail = this.sendMail.bind(this);
    this.handleTextLimit = this.handleTextLimit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  sendMail(e) {
    const { app, fromMail, sendEmail } = this.props;

    e.preventDefault();
    const mailTo = this.mailTo.value.trim();
    const mailSub = this.mailSub.value.trim();
    const mailContent = this.mailContent.value.trim();
    if (!mailTo || !mailSub || !mailContent) {
      return;
    }
    if (mailContent.length > CONSTANTS.MAIL_CONTENT_LIMIT) {
      return showError('Mail Content is too Long', 'Mail Content is too long!');
    }

    let newEmail = {
      subject: mailSub,
      from: fromMail,
      time: (new Date()).toUTCString(),
      body: mailContent
    };
    return sendEmail(newEmail, mailTo)
        .then(() => this.context.router.push('/home'))
        .catch((err) => showError('Error sending email', err));
  }

  handleCancel() {
    this.props.cancelCompose();
    this.context.router.push('/home');
  }

  handleTextLimit(e) {
    if (this.mailContent.value.length > CONSTANTS.MAIL_CONTENT_LIMIT) {
      return this.mailContent.classList.add('hasError');
    }
    this.mailContent.classList.remove('hasError');
  }

  render() {
    const { error, processing } = this.props;

    return (
      <div className="compose-mail">
        <div className="compose-mail-b">
          <h3 className="title heading-lg text-center">Compose Mail</h3>
          <form className="form" onSubmit={this.sendMail}>
            <div className="inp-grp">
              <input type="text" name="mailTo" id="mailTo" ref={c => {
                this.mailTo = c;
              }} required="required" autoFocus="autoFocus"/>
              <label htmlFor="mailTo">To</label>
            </div>
            <div className="inp-grp">
              <input type="text" name="mailSub" id="mailSub" ref={c => {
                this.mailSub = c;
              }} required="required"/>
              <label htmlFor="mailSub">Subject</label>
            </div>
            <div className="inp-grp">
              <textarea name="mailContent" onKeyUp={this.handleTextLimit} ref={c => {
                this.mailContent = c;
              }} required="required" defaultValue=" " />
              <div className="limit">
                Only { CONSTANTS.MAIL_CONTENT_LIMIT } characters allowed (this restriction is to reduce the number of chunks managed by the tutorial).
              </div>
            </div>
            <div className="inp-btn-cnt">
              <button type="submit" className="mdl-button mdl-js-button mdl-button--raised bg-primary btn-eq" disabled={processing}>{processing ? 'Sending' : 'Send'}</button>
              <button type="button" className="mdl-button mdl-js-button mdl-button--raised btn-eq" disabled={processing ? 'disabled' : ''} onClick={this.handleCancel}>
                Cancel
              </button>
            </div>
          </form>
          <h3 className="error text-center">{error.message}</h3>
        </div>
      </div>
    );
  }
}

ComposeMail.contextTypes = {
  router: PropTypes.object.isRequired
};
