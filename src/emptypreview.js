// var StyleSheet = require('react-style');

// var styles = StyleSheet.create({
  // directions: {
    // fontFamily: 'Avenir',
    // fontSize: '24px',
    // color: '#00BFFF',
  // }
// });

var EmptyPreview = React.createClass({

  getInitialState: function() {
    return {
      width: this.props.window.width,
      height: this.props.window.height,
    }
  },

  render: function() {
    this.getDynamicStyles();

    return (
      React.createElement('span', { style : styles.directions }, "Hover over a recent event to preview its content")
    );
  },

  getDynamicStyles: function() {
    styles.directions.left = (this.state.width / 2) - 50 + 'px';
  },

});