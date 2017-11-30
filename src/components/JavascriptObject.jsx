import React from 'react';
import PropTypes from 'prop-types';

const JavascriptObject = function JavascriptObject(props) {
  const {
    object,
    objectName,
  } = props;
  const objectString = JSON.stringify(object);
  return (
    <script type="text/plain" id={objectName} dangerouslySetInnerHTML={{ __html: objectString }} /> // eslint-disable-line react/no-danger
  );
};

JavascriptObject.propTypes = {
  objectName: PropTypes.string,
  object: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
};

JavascriptObject.defaultProps = {
  objectName: 'nocms.pageData',
  object: {},
};

module.exports = JavascriptObject;
