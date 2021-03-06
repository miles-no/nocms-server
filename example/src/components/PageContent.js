import React from 'react';
import PropTypes from 'prop-types';

let i = 0;

const Main = (props) => {
  i += 1;
  return (
    <div>
      <h1>{props.pageTitle} - {i}</h1>
      <p><a href="/p1">Goto 1</a></p>
      <p><a href="/p2">Goto 2</a></p>
    </div>
  );
};

Main.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};

export default Main;
