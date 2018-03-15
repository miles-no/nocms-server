import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { triggerGlobal, listenToGlobal } from 'nocms-events';
import MainContent from '../components/MainContent';
import pageStore from './page_store';

import './navigation';

// TODO Tracking need to be put into a seperate package

export default class NoCMSComponent extends Component {
  constructor(props) {
    super(props);

    this.updatePageData = this.updatePageData.bind(this);

    const config = JSON.parse(document.getElementById('nocms.config').innerHTML);
    const i18n = JSON.parse(document.getElementById('nocms.i18n').innerHTML);
    const pageData = pageStore.init(config)
      .getPageData();

    this.state = {
      pageData,
      clientConfig: config,
      i18n,
    };

    this.state.isNoCMSUser = this.isNoCMSUser();

    if (global.environment !== 'server') {
      global.NoCMS = {
        getPageData: () => { return this.state.pageData; },
        getNoCMSUserInfo: () => { return this.getNoCMSUserInfo(); },
        getConfig: (field) => { return this.getConfig(field); },
      };
      listenToGlobal('nocms.pagedata-updated', this.updatePageData);
    }
  }

  getChildContext() {
    return {
      config: this.state.clientConfig,
      i18n: this.state.i18n,
    };
  }

  componentDidMount() {
    triggerGlobal('nocms.client-loaded', this.state.pageData.uri, this.state.pageData);
  }

  getConfig(field) {
    return this.state.clientConfig[field];
  }

  getNoCMSUserInfo() {
    const cookieName = this.getConfig('nocmsUserInfoCookieName');
    const regEx = new RegExp(`${cookieName}=(.*?)(;|$)`);
    const adminInfo = document.cookie.match(regEx);
    if (adminInfo && adminInfo.length > 0) {
      return JSON.parse(atob(decodeURIComponent(adminInfo[1])));
    }
    return null;
  }

  updatePageData(newPageData) {
    this.setState({ pageData: newPageData });
  }

  isNoCMSUser() {
    return this.getNoCMSUserInfo() !== null;
  }

  render() {
    return <MainContent templates={this.props.templates} pageData={this.state.pageData} isNoCMSUser={this.state.isNoCMSUser} />;
  }
}

NoCMSComponent.childContextTypes = {
  config: PropTypes.object,
  i18n: PropTypes.object,
};

NoCMSComponent.propTypes = {
  templates: PropTypes.array,
};

NoCMSComponent.defaultProps = {
  templates: [],
};
