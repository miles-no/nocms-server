const componentDataSources = {};

const applyComponentDataToPageData = (nocms, componentType, componentId, componentData) => {
  if (typeof nocms.pageData.componentData === 'undefined') {
    nocms.pageData.componentData = {};
  }

  if (typeof nocms.pageData.componentData[componentType] === 'undefined') {
    nocms.pageData.componentData[componentType] = {};
  }

  nocms.pageData.componentData[componentType][componentId] = componentData;

  return nocms;
};

const addComponentDataSource = (componentType, fn) => {
  if (typeof componentType !== 'string') {
    throw new Error('Invalid pattern. Must be string');
  }

  if (componentDataSources[componentType]) {
    throw new Error(`requestHandler: datasource for component ${componentType} allready registered`);
  }

  componentDataSources[componentType] = fn;
};

const fetchComponentData = (nocms) => {
  return new Promise((resolve) => {
    if (!nocms.pageData) {
      resolve(nocms);
      return;
    }
    const {
      componentsWithData = {},
    } = nocms.pageData;

    const componentTypes = Object.keys(componentsWithData);
    if (componentTypes.length === 0) {
      if (nocms.verbose) {
        nocms.logger.debug(`requestHandler: no components with data on url ${nocms.url}`);
      }

      resolve(nocms);
    }

    const promiseList = [];
    componentTypes.forEach((componentType) => {
      const componentIds = Object.keys(componentsWithData[componentType]);
      componentIds.forEach((componentId) => {
        if (typeof componentDataSources[componentType] !== 'function') {
          nocms.logger.error(`requestHandler: no datasource registered for type ${componentType}`);
          promiseList.push(Promise.resolve(applyComponentDataToPageData(nocms, componentType, componentId, {})));

          return;
        }

        const datasourceHandler = componentDataSources[componentType];
        const datasourceArgs = componentsWithData[componentType][componentId];

        promiseList.push(new Promise((resolveComponentDataLoaded) => {
          datasourceHandler(nocms, datasourceArgs, componentType, componentId).then((componentData) => {
            resolveComponentDataLoaded(applyComponentDataToPageData(nocms, componentType, componentId, componentData));
          }, (error) => {
            nocms.logger.error(`requestHandler: fetch datasource failed for type ${componentType} with id ${componentId}`, { error });
            resolveComponentDataLoaded(applyComponentDataToPageData(nocms, componentType, componentId, error));
          });
        }));
      });
    });

    Promise.all(promiseList).then(() => {
      resolve(nocms);
    }, (reason) => {
      nocms.logger.error('requestHandler: could not get all component data', { reason });
      resolve(nocms);
    });
  });
};

export default {
  fetchComponentData,
  addComponentDataSource,
};
