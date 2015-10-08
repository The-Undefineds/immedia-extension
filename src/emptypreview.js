// var StyleSheet = require('react-style');

var emptyStyles = {
  directions: {
    fontFamily: 'Avenir',
    fontSize: '24px',
    color: '#00BFFF',
    left: '',
  }
};

var EmptyPreview = React.createClass({

  getInitialState: function() {
    return {
      width: this.props.windowWidth,
      height: this.props.windowHeight,
    }
  },

  render: function() {
    this.getDynamicStyles();

    return (
      React.createElement('span', { style : emptyStyles.directions }, "Hover over a recent event to preview its content")
    );
  },

  getDynamicStyles: function() {
    emptyStyles.directions.left = (this.state.width / 2) - 50 + 'px';
  },

});