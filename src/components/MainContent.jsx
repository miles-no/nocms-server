import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { listenToGlobal, stopListenToGlobal } from 'nocms-events';

const getTemplateComponent = (templateId, templates) => {
  const template = templates.find((tmpl) => {
    return tmpl.id === templateId;
  });
  return template.component;
};

const setMomentLocale = (lang) => {
  if (lang === 'en') {
    moment.locale('en');
    return;
  }
  moment.locale('nb');
};

export default class MainContent extends Component {
  constructor(props) {
    super(props);
    this.toggleEdit = this.toggleEdit.bind(this);

    this.state = {
      editMode: false,
      lang: props.pageData.lang || 'no',
    };
    listenToGlobal('nocms.toggle-edit', this.toggleEdit);
    setMomentLocale(props.pageData.lang);
  }

  getChildContext() {
    return {
      editMode: this.state.editMode,
      lang: this.state.lang,
      isNoCMSUser: this.state.isNoCMSUser,
      config: this.context.config,
      adminLang: 'no',
    };
  }

  componentWillReceiveProps(props) {
    setMomentLocale(props.pageData.lang);
    this.setState({ lang: props.pageData.lang });
  }

  componentWillUnmount() {
    stopListenToGlobal('nocms.toggle-edit', this.toggleEdit);
  }

  toggleEdit() {
    this.setState({ editMode: !this.state.editMode });
  }

  render() {
    const {
      pageData,
      templates,
    } = this.props;
    return React.cloneElement(getTemplateComponent(pageData.templateId, templates), pageData);
  }
}

MainContent.propTypes = {
  pageData: PropTypes.object,
  templates: PropTypes.array,
};

MainContent.contextTypes = {
  config: PropTypes.object,
};

MainContent.childContextTypes = {
  editMode: PropTypes.bool,
  lang: PropTypes.string,
  adminLang: PropTypes.string,
  isNoCMSUser: PropTypes.bool,
  config: PropTypes.object,
};
