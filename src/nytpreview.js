// var StyleSheet = require('react-style');

var NytStyles = {
  anchor: {
    textDecoration: 'none',
    color: 'inherit',
  },
  headline: {
    marginTop: '0px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  byline: {
    marginTop: '5px',
    marginBottom: '5px',
    textAlign: 'center',
  },
  image: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    paddingLeft: '15px',
    paddingRight: '15px',
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
      if((465 / this.props.previewItem.width) < 1) {
        ratio = 465 / this.props.previewItem.width;
      }
    }
    return (
      React.createElement('a', { style : NytStyles.anchor, href : this.props.previewItem.url, target : '_blank'},
        React.createElement('div', null,
          React.createElement('h1', { style : NytStyles.headline}, this.props.previewItem.title),
          React.createElement('h3', { style : NytStyles.byline}, this.props.previewItem.byline),
          this.props.previewItem.img !== '' ? React.createElement('img', { src : this.props.previewItem.img , style : { textAlign : 'center'}, height : this.props.previewItem.height * ratio, width : this.props.previewItem.width * ratio }) : null,
          React.createElement('p', { style : NytStyles.body }, this.props.previewItem.abstract)
        )
      )
    );
  },

});