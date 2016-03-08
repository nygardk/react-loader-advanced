'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function uid() {
  return Math.random().toString(36).substr(2, 9);
}

var backgroundDefaultStyle = {
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 10
};

var foregroundDefaultStyle = {
  display: 'table',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  zIndex: 20,
  color: 'white'
};

var messageDefaultStyle = {
  display: 'table-cell',
  verticalAlign: 'middle'
};

var loaderStack = _extends({}, _events.EventEmitter.prototype, {
  stack: [],
  addLoader: function addLoader(id) {
    var priority = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    if (this.getIndex(id) === -1) {
      this.stack.push({ id: id, priority: priority });
      this.emitChange();
    }
  },
  removeLoader: function removeLoader(id) {
    if (this.getIndex(id) !== -1) {
      this.stack.splice(this.getIndex(id), 1);
      this.emitChange();
    }
  },
  getIndex: function getIndex(id) {
    return this.stack.findIndex(function (loader) {
      return loader.id === id;
    });
  },
  getMaxPriority: function getMaxPriority() {
    var max = 0;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.stack[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var value = _step.value;

        if (value.priority > max) {
          max = value.priority;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return max;
  },
  emitChange: function emitChange() {
    this.emit('change');
  },
  addChangeListener: function addChangeListener(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
});

var Loader = _react2.default.createClass({
  displayName: 'Loader',

  propTypes: {
    backgroundStyle: _react2.default.PropTypes.object,

    children: _react2.default.PropTypes.node,

    // blur loader content while loading
    contentBlur: _react2.default.PropTypes.number,

    // disables all default styles if true
    disableDefaultStyles: _react2.default.PropTypes.bool,

    foregroundStyle: _react2.default.PropTypes.object,

    hideContentOnLoad: _react2.default.PropTypes.bool,

    // loader message or element
    message: _react2.default.PropTypes.node,

    // stack priority
    priority: _react2.default.PropTypes.number,

    show: _react2.default.PropTypes.bool.isRequired,

    style: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return { priority: 0 };
  },
  getInitialState: function getInitialState() {
    return { active: false };
  },
  componentWillMount: function componentWillMount() {
    this._stackId = uid();
  },
  componentDidMount: function componentDidMount() {
    loaderStack.addChangeListener(this.onStackChange);
    this.initialize(this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  },
  componentWillUnmount: function componentWillUnmount() {
    var _this = this;

    loaderStack.removeChangeListener(this.onStackChange);

    // Bugfix: 3.3.2016
    // setTimeout fixes rare bug with React 0.13 that is caused by unpredictable
    // component lifecycle (Uncaught Error: Invariant Violation:
    // must be mounted to trap events).
    setTimeout(function () {
      loaderStack.removeLoader(_this._stackId);
    });
  },
  initialize: function initialize(props) {
    if (props.show) {
      loaderStack.addLoader(this._stackId, props.priority);
    } else {
      loaderStack.removeLoader(this._stackId);
    }
  },
  onStackChange: function onStackChange() {
    if (this.isMounted()) {
      this.setState({
        active: loaderStack.getMaxPriority() === this.props.priority
      });
    }
  },
  render: function render() {
    var _props = this.props;
    var backgroundStyle = _props.backgroundStyle;
    var children = _props.children;
    var contentBlur = _props.contentBlur;
    var disableDefaultStyles = _props.disableDefaultStyles;
    var foregroundStyle = _props.foregroundStyle;
    var hideContentOnLoad = _props.hideContentOnLoad;
    var message = _props.message;
    var style = _props.style;
    var show = _props.show;
    var active = this.state.active;


    var shouldShowLoader = !!active && !!show;

    var bgStyle = Object.assign({}, disableDefaultStyles ? {} : backgroundDefaultStyle, backgroundStyle || {});

    var fgStyle = Object.assign({}, disableDefaultStyles ? {} : foregroundDefaultStyle, foregroundStyle || {});

    var msgStyle = disableDefaultStyles ? {} : messageDefaultStyle;

    var loaderStyle = _extends({ position: 'relative' }, style);

    var contentStyle = Object.assign({
      position: 'relative',
      opacity: hideContentOnLoad && show ? 0 : 1
    }, shouldShowLoader && contentBlur ? {
      'WebkitFilter': 'blur(' + contentBlur + 'px)',
      'MozFilter': 'blur(' + contentBlur + 'px)',
      'OFilter': 'blur(' + contentBlur + 'px)',
      'msFilter': 'blur(' + contentBlur + 'px)',
      'filter': 'blur(' + contentBlur + 'px)'
    } : {});

    return _react2.default.createElement(
      'div',
      { className: 'Loader', style: loaderStyle },
      _react2.default.createElement(
        'div',
        { className: 'Loader__content', style: contentStyle },
        children
      ),
      !!shouldShowLoader && _react2.default.createElement(
        'div',
        { className: 'Loader__background', style: bgStyle },
        _react2.default.createElement(
          'div',
          { className: 'Loader__foreground', style: fgStyle },
          _react2.default.createElement(
            'div',
            { className: 'Loader__message', style: msgStyle },
            message || 'loading...'
          )
        )
      )
    );
  }
});

exports.default = Loader;