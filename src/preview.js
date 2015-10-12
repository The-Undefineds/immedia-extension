//var StyleSheet = require('react-style');

var previewStyles = {
  preview: {
    color: 'black',
    fontFamily: 'Nunito',
    position: 'fixed',
    paddingRight: '10px',
    textAlign: 'center',
    backgroundColor: 'rgb(237,239,240)',
    margins: '50px',
    borderRadius: '4px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
};

var Preview = React.createClass({

  getInitialState: function() {
    return {
      width: this.props.windowWidth,
      height: this.props.windowHeight,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      width: nextProps.windowWidth,
      height: nextProps.windowHeight,
    });
  },

  render: function() {
    this.getDynamicStyles();

    return (
      React.createElement('div', { id : 'previewContent', style : previewStyles.preview},
        this.props.previewItem.source === '' ?  null : null,
        this.props.previewItem.source === 'nyt' ?  React.createElement(NytPreview, { previewItem : this.props.previewItem }) : null,
        this.props.previewItem.source === 'twitter' ?  React.createElement(TwitterPreview, { previewItem : this.props.previewItem, width : previewStyles.preview.width, height : previewStyles.preview.height }) : null,
        this.props.previewItem.source === 'youtube' ?  React.createElement(YouTubePreview, { previewItem : this.props.previewItem, width : previewStyles.preview.width, height : previewStyles.preview.height }) : null
      )
    );
  },

  getDynamicStyles: function() {
    var $d3title = $('#d3title');
    previewStyles.preview.top = '7.5%';
    previewStyles.preview.left = (this.state.width / 2) - (this.state.width - 1350 < 0 ? 500 * (this.state.width / 1350) / 2 : 250) + 'px';
    previewStyles.preview.width = (this.state.width - 1350 < 0 ? 500 * (this.state.width/1350) : 550) + 'px';
    previewStyles.preview.height = (this.state.height - 600 < 0 ? 600 * (this.state.height/783) : 550) + 'px';
  },
});
