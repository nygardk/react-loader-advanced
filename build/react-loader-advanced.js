'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _events = require('events');

var _lodashMax = require('lodash.max');

var _lodashMax2 = _interopRequireDefault(_lodashMax);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

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
    var max = (0, _lodashMax2['default'])(this.stack, function (loader) {
      return loader.priority;
    });
    return max ? max.priority : 0;
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

var Loader = _react2['default'].createClass({
  displayName: 'Loader',

  propTypes: {
    backgroundStyle: _react2['default'].PropTypes.object,

    children: _react2['default'].PropTypes.node,

    // blur loader content while loading
    contentBlur: _react2['default'].PropTypes.number,

    // disables all default styles if true
    disableDefaultStyles: _react2['default'].PropTypes.bool,

    foregroundStyle: _react2['default'].PropTypes.object,

    hideContentOnLoad: _react2['default'].PropTypes.bool,

    // loader message or element
    message: _react2['default'].PropTypes.node,

    // stack priority
    priority: _react2['default'].PropTypes.number,

    show: _react2['default'].PropTypes.bool.isRequired,

    style: _react2['default'].PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return { priority: 0 };
  },

  getInitialState: function getInitialState() {
    return { active: false };
  },

  componentWillMount: function componentWillMount() {
    this._stackId = _uuid2['default'].v1();
  },

  componentDidMount: function componentDidMount() {
    loaderStack.addChangeListener(this.onStackChange);
    this.initialize(this.props);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  },

  componentWillUnmount: function componentWillUnmount() {
    loaderStack.removeChangeListener(this.onStackChange);
    loaderStack.removeLoader(this._stackId);
  },

  initialize: function initialize(props) {
    if (props.show) {
      loaderStack.addLoader(this._stackId, props.priority);
    } else {
      loaderStack.removeLoader(this._stackId);
    }
  },

  onStackChange: function onStackChange() {
    this.setState({
      active: loaderStack.getMaxPriority() === this.props.priority
    });
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

    return shouldShowLoader ? _react2['default'].createElement(
      'div',
      { className: 'Loader', style: loaderStyle },
      _react2['default'].createElement(
        'div',
        { className: 'Loader__content', style: contentStyle },
        children
      ),
      _react2['default'].createElement(
        'div',
        { className: 'Loader__background', style: bgStyle },
        _react2['default'].createElement(
          'div',
          { className: 'Loader__foreground', style: fgStyle },
          _react2['default'].createElement(
            'div',
            { className: 'Loader__message', style: msgStyle },
            message || 'loading...'
          )
        )
      )
    ) : _react2['default'].createElement(
      'div',
      { style: loaderStyle },
      children
    );
  }
});

exports['default'] = Loader;
module.exports = exports['default'];