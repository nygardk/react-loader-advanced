/* eslint-disable
  react/sort-comp,
  camelcase,
  prefer-template,
  quote-props,
  no-underscore-dangle,
  react/require-default-props,
  react/forbid-prop-types
  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import EventEmitter from 'wolfy87-eventemitter';

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
  zIndex: 10,
};

const foregroundDefaultStyle = {
  display: 'table',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  zIndex: 20,
  color: 'white',
};

const messageDefaultStyle = {
  display: 'table-cell',
  verticalAlign: 'middle',
};

export const createLoaderStack = () => ({
  ...EventEmitter.prototype,

  stack: [],

  addLoader(id, priority = 0) {
    if (this.getIndex(id) === -1) {
      this.stack.push({ id, priority });
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

    Object.keys(this.stack).forEach((key) => {
      if (this.stack[key].priority > max) {
        max = this.stack[key].priority;
      }
    });

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
  },
});

const createLoader = loaderStack => (class Loader extends Component {
  static propTypes = {
    backgroundStyle: PropTypes.object,

    children: PropTypes.node,

    className: PropTypes.string,

    // blur loader content while loading
    contentBlur: PropTypes.number,

    contentStyle: PropTypes.object,

    // disables all default styles if true
    disableDefaultStyles: PropTypes.bool,

    foregroundStyle: PropTypes.object,

    hideContentOnLoad: PropTypes.bool,

    // loader message or element
    message: PropTypes.node,

    messageStyle: PropTypes.object,

    // stack priority
    priority: PropTypes.number,

    show: PropTypes.bool.isRequired,

    style: PropTypes.object,

    transitionConfig: PropTypes.shape({
      classNames: PropTypes.string.isRequired,
      timeout: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          enter: PropTypes.number,
          exit: PropTypes.number,
        }),
      ]).isRequired,
    }),
  }

  static defaultProps = {
    message: 'loading...',
    priority: 0,
  }

  state = {
    active: false,
  }

  UNSAFE_componentWillMount() {
    this._stackId = uid();
  }

  componentDidMount() {
    loaderStack.addChangeListener(this.onStackChange);
    this.initialize(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  componentWillUnmount() {
    loaderStack.removeChangeListener(this.onStackChange);

    // Bugfix: 3.3.2016
    // setTimeout fixes rare bug with React 0.13 that is caused by unpredictable
    // component lifecycle (Uncaught Error: Invariant Violation:
    // must be mounted to trap events).
    setTimeout(() => {
      loaderStack.removeLoader(this._stackId);
    });
  }

  onStackChange = () => {
    // if (this.isMounted()) {
    this.setState({
      active: loaderStack.getMaxPriority() === this.props.priority,
    });
    // }
  }

  initialize = (props) => {
    if (props.show) {
      loaderStack.addLoader(this._stackId, props.priority);
    } else {
      loaderStack.removeLoader(this._stackId);
    }
  }

  render() {
    const {
      backgroundStyle,
      children,
      className,
      contentBlur,
      contentStyle,
      disableDefaultStyles,
      foregroundStyle,
      hideContentOnLoad,
      message,
      messageStyle,
      style,
      show,
      transitionConfig,
    } = this.props;

    const {
      active,
    } = this.state;

    const shouldShowLoader = !!active && !!show;

    const bgStyle = {
      ...(disableDefaultStyles ? {} : backgroundDefaultStyle),
      ...backgroundStyle,
    };

    const fgStyle = {
      ...(disableDefaultStyles ? {} : foregroundDefaultStyle),
      ...foregroundStyle,
    };

    const msgStyle = {
      ...(disableDefaultStyles ? {} : messageDefaultStyle),
      ...messageStyle,
    };

    const loaderStyle = { position: 'relative', ...style };

    const finalContentStyle = Object.assign(shouldShowLoader && contentBlur ? {
      'WebkitFilter': `blur(${contentBlur}px)`,
      'MozFilter': `blur(${contentBlur}px)`,
      'OFilter': `blur(${contentBlur}px)`,
      'msFilter': `blur(${contentBlur}px)`,
      'filter': `blur(${contentBlur}px)`,
    } : {}, contentStyle, {
      opacity: hideContentOnLoad && show ? 0 : 1,
    });

    const classes = 'Loader' + (className ? (' ' + className) : '');

    const loaderElement = !!shouldShowLoader && (
      <div className="Loader__background" style={bgStyle}>
        <div className="Loader__foreground" style={fgStyle}>
          <div className="Loader__message" style={msgStyle}>
            {message}
          </div>
        </div>
      </div>
    );

    return (
      <div className={classes} style={loaderStyle}>
        <div className="Loader__content" style={finalContentStyle}>
          {children}
        </div>

        {transitionConfig ? (
          <TransitionGroup>
            {loaderElement && (
              <CSSTransition {...transitionConfig}>
                {loaderElement}
              </CSSTransition>
            )}
          </TransitionGroup>
        ) : loaderElement}
      </div>
    );
  }
});

export default createLoader(createLoaderStack());
