/* eslint-disable react/jsx-boolean-value */
import React, { Component } from 'react';
import Loader from 'react-loader-advanced';

const customMessageElement = (
  <div>custom message element</div>
);

class Demo extends Component {
  render() {
    return (
      <div>
        <Loader show={true} message={customMessageElement}>
          <div style={{ padding: 30 }}>
            demo content
          </div>
        </Loader>
      </div>
    );
  }
}

export default Demo;
