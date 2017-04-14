import React, { Component } from 'react';
import Loader from 'react-loader-advanced';

const contentBoxStyle = {
  backgroundColor: 'white',
  position: 'relative',
  padding: 20,
  border: '1px solid lightgrey',
};

const transitionConfig = {
  transitionName: 'fadeTransition',
  transitionEnterTimeout: 300,
  transitionLeaveTimeout: 300,
};

class Demo extends Component {
  state = {
    loader1: false,
    loader2: false,
    loader3: false,
    loader4: false,
  }

  componentDidMount() {
    this.load();
  }

  load = () => {
    this.setState({
      loader1: true,
      loader2: true,
      loader3: true,
      loader4: true,
    });

    setTimeout(() => {
      this.setState({ loader1: false });
    }, 1000);

    setTimeout(() => {
      this.setState({ loader2: false });
    }, 3000);

    setTimeout(() => {
      this.setState({ loader3: false });
    }, 5000);

    setTimeout(() => {
      this.setState({ loader4: false });
    }, 6000);
  }

  render() {
    const {
      loader1,
      loader2,
      loader3,
      loader4,
    } = this.state;

    return (
      <div>
        {!loader4 && (
          <button onClick={this.load}>Load</button>
        )}

        <Loader transitionConfig={transitionConfig} show={loader1} priority={10}>
          <div style={contentBoxStyle}>
            Loader 1 content

            <Loader
              transitionConfig={transitionConfig}
              show={loader2}
              hideContentOnLoad
              priority={5}>
              <div style={contentBoxStyle}>
                Loader 2 content (hidden until load)

                <Loader transitionConfig={transitionConfig} show={loader4} priority={5}>
                  <div style={contentBoxStyle}>
                    Loader 4 content
                  </div>
                </Loader>
              </div>
            </Loader>

            <Loader transitionConfig={transitionConfig} show={loader3} priority={5}>
              <div style={{ ...contentBoxStyle, marginTop: 20 }}>
                Loader 3 content
              </div>
            </Loader>
          </div>
        </Loader>
      </div>
    );
  }
}

export default Demo;
