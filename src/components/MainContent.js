import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { listenToGlobal, stopListenToGlobal, triggerGlobal } from 'nocms-events';

const componentsWithDataScope = 'componentsWithData';
const componentsDataScope = 'componentData';

const getTemplateComponent = (templateId, templates) => {
  const template = templates.find((tmpl) => {
    return tmpl.id === templateId;
  });
  if (!template) {
    throw new Error(`Template "${templateId}" was not found`);
  }
  return template.component;
};

const createComponentDataApi = (getPageData) => {
  return {
    registerComponent: (componentType, componentId) => {
      triggerGlobal('nocms.value-changed', `${componentsWithDataScope}.${componentType}.${componentId}`, {});
    },
    unregisterComponent: (componentType, componentId) => {
      const pageData = getPageData();
      const {
        componentsWithData = {},
      } = pageData;

      if (componentsWithData[componentType] && componentsWithData[componentType][componentId]) {
        delete componentsWithData[componentType][componentId];

        if (Object.keys(componentsWithData[componentType]).length === 0) {
          delete componentsWithData[componentType];
        }

        triggerGlobal('nocms.value-changed', componentsWithDataScope, componentsWithData);
      }
    },
    isComponentRegistered: (componentType, componentId) => {
      const pageData = getPageData();
      const {
        componentsWithData = {},
      } = pageData;

      return componentsWithData[componentType] && componentsWithData[componentType][componentId];
    },
    getComponentData: (componentType, componentId) => {
      const pageData = getPageData();
      const {
        componentData = {},
      } = pageData;

      if (componentData[componentType] && componentData[componentType][componentId]) {
        return componentData[componentType][componentId];
      }

      return null;
    },
    setComponentData: (componentType, componentId, componentData) => {
      triggerGlobal('nocms.value-changed', `${componentsDataScope}.${componentType}.${componentId}`, componentData);
    },
  };
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
  }

  getChildContext() {
    const {
      pageData,
    } = this.props;

    return {
      editMode: this.state.editMode,
      lang: this.state.lang,
      isNoCMSUser: this.state.isNoCMSUser,
      config: this.context.config,
      adminLang: 'no',
      componentDataApi: createComponentDataApi(() => { return pageData; }),
    };
  }

  componentWillReceiveProps(props) {
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
    return React.createElement(getTemplateComponent(pageData.templateId, templates), pageData);
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
  componentDataApi: PropTypes.object,
};
