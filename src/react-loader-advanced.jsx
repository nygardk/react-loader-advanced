import React from 'react';
import { EventEmitter } from 'events';

function uid() {
  return Math.random().toString(36).substr(2, 9);
}

const backgroundDefaultStyle = {
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 10
};

const foregroundDefaultStyle = {
  display: 'table',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  zIndex: 20,
  color: 'white'
};

const messageDefaultStyle = {
  display: 'table-cell',
  verticalAlign: 'middle'
};

const loaderStack = {...EventEmitter.prototype,
  stack: [],
  addLoader(id, priority = 0) {
    if (this.getIndex(id) === -1) {
      this.stack.push({id, priority});
      this.emitChange();
    }
  },
  removeLoader(id) {
    if (this.getIndex(id) !== -1) {
      this.stack.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },
  getIndex(id) {
    return this.stack.findIndex(loader => loader.id === id);
  },
  getMaxPriority() {
    let max = 0;

    for (let value of this.stack) {
      if (value.priority > max) {
        max = value.priority;
      }
    }

    return max;
  },
  emitChange() {
    this.emit('change');
  },
  addChangeListener(callback) {
    this.on('change', callback);
  },
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
};

const Loader = React.createClass({
  propTypes: {
    backgroundStyle: React.PropTypes.object,

    children: React.PropTypes.node,

    // blur loader content while loading
    contentBlur: React.PropTypes.number,

    // disables all default styles if true
    disableDefaultStyles: React.PropTypes.bool,

    foregroundStyle: React.PropTypes.object,

    hideContentOnLoad: React.PropTypes.bool,

    // loader message or element
    message: React.PropTypes.node,

    // stack priority
    priority: React.PropTypes.number,

    show: React.PropTypes.bool.isRequired,

    style: React.PropTypes.object
  },

  getDefaultProps() {
    return {priority: 0};
  },

  getInitialState() {
    return {active: false};
  },

  componentWillMount() {
    this._stackId = uid();
  },

  componentDidMount() {
    loaderStack.addChangeListener(this.onStackChange);
    this.initialize(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  },

  componentWillUnmount() {
    loaderStack.removeChangeListener(this.onStackChange);

    // Bugfix: 3.3.2016
    // setTimeout fixes rare bug with React 0.13 that is caused by unpredictable
    // component lifecycle (Uncaught Error: Invariant Violation:
    // must be mounted to trap events).
    setTimeout(() => {
      loaderStack.removeLoader(this._stackId);
    });
  },

  initialize(props) {
    if (props.show) {
      loaderStack.addLoader(this._stackId, props.priority);
    } else {
      loaderStack.removeLoader(this._stackId);
    }
  },

  onStackChange() {
    if (this.isMounted()) {
      this.setState({
        active: loaderStack.getMaxPriority() === this.props.priority
      });
    }
  },

  render() {
    const {
      backgroundStyle,
      children,
      contentBlur,
      disableDefaultStyles,
      foregroundStyle,
      hideContentOnLoad,
      message,
      style,
      show
    } = this.props;

    const {
      active
    } = this.state;

    const shouldShowLoader = !!active && !!show;

    const bgStyle = Object.assign({},
      disableDefaultStyles ? {} : backgroundDefaultStyle,
      backgroundStyle || {}
    );

    const fgStyle = Object.assign({},
      disableDefaultStyles ? {} : foregroundDefaultStyle,
      foregroundStyle || {}
    );

    const msgStyle = disableDefaultStyles ? {} : messageDefaultStyle;

    const loaderStyle = {position: 'relative', ...style};

    const contentStyle = Object.assign({
      position: 'relative',
      opacity: hideContentOnLoad && show ? 0 : 1
    }, shouldShowLoader && contentBlur ? {
      'WebkitFilter': `blur(${contentBlur}px)`,
      'MozFilter': `blur(${contentBlur}px)`,
      'OFilter': `blur(${contentBlur}px)`,
      'msFilter': `blur(${contentBlur}px)`,
      'filter': `blur(${contentBlur}px)`
    } : {});

    return shouldShowLoader ? (
      <div className="Loader" style={loaderStyle}>
        <div className="Loader__content" style={contentStyle}>
          {children}
        </div>

        <div className="Loader__background" style={bgStyle}>
          <div className="Loader__foreground" style={fgStyle}>
            <div className="Loader__message" style={msgStyle}>
              {message || 'loading...'}
            </div>
          </div>
        </div>
      </div>
    ) : (<div style={loaderStyle}>{children}</div>);
  }
});

export default Loader;
