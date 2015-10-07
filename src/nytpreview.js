// var StyleSheet = require('react-style');

var NytStyles = {
  anchor: {
    textDecoration: 'none',
    color: 'inherit',
  },
};

var NytPreview = React.createClass({

  render: function() {
    var ratio = 1;
    if(this.props.previewItem.height > this.props.previewItem.width) {
      if((320 / this.props.previewItem.height) < 1) {
        ratio = 320 / this.props.previewItem.height;
      }
    } else {
      if((365 / this.props.previewItem.width) < 1) {
        ratio = 365 / this.props.previewItem.width;
      }
    }
    return (
      React.createElement('a', { style : NytStyles.anchor, href : this.props.previewItem.url, target : '_blank'},
        React.createElement('div', null,
          React.createElement('h1', { style : { marginTop : '0px', marginBottom : '10px' } }, this.props.previewItem.title),
          React.createElement('h3', { style : { marginTop : '5px', marginBottom : '5px' } }, this.props.previewItem.byline),
          this.props.previewItem.img !== '' ? React.createElement('img', { src : this.props.previewItem.img , style : { textAlign : 'center'}, height : this.props.previewItem.height * ratio, width : this.props.previewItem.width * ratio }) : null,
          React.createElement('p', { style : {textAlign: 'left', paddingLeft: '15px', paddingRight: '15px'} }, this.props.previewItem.abstract)
        )
      )
    );
  },

});