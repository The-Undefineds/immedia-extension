//var StyleSheet = require('react-style');

var previewStyles = {
  preview: {
    position: 'absolute',
    paddingRight: '10px',
    textAlign: 'center',
  }
};

var Preview = React.createClass({

  getInitialState: function() {
    return {
      width: this.props.window.width,
      height: this.props.window.height,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      width: nextProps.window.width,
      height: nextProps.window.height,
    });
  },

  render: function() {
    this.getDynamicStyles();

    return (
      React.createElement('div', { id : 'previewContent', style : previewStyles.preview},
        this.props.previewItem.source === '' ?  React.createElement(EmptyPreview, { window : this.state }) : null,
        this.props.previewItem.source === 'nyt' ?  React.createElement(NytPreview, { previewItem : this.props.previewItem }) : null,
        this.props.previewItem.source === 'twitter' ?  React.createElement(TwitterPreview, { previewItem : this.props.previewItem }) : null,
        this.props.previewItem.source === 'youtube' ?  React.createElement(YouTubePreview, { previewItem : this.props.previewItem, width : previewStyles.preview.width, height : previewStyles.preview.height }) : null
      )
    );
  },

  getDynamicStyles: function() {
    var $d3title = $('#d3title');
    previewStyles.preview.top = (55 + $d3title.height() + 5 + 'px');
    previewStyles.preview.left = (this.state.width / 2) - (this.state.width - 1350 < 0 ? 500 * (this.state.width / 1350) / 2 : 250) + 'px';
    previewStyles.preview.width = (this.state.width - 1350 < 0 ? 500 * (this.state.width/1350) : 500) + 'px';
    previewStyles.preview.height = (this.state.height - 600 < 0 ? 600 * (this.state.height/783) : 600) + 'px';
  },
});
