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
    color: 'black',
    fontSize: '20px'
  },
  byline: {
    marginTop: '2px',
    marginBottom: '2px',
    textAlign: 'center',
    fontSize: '10px',
  },
  image: {
    textAlign: 'center',

  },
  body: {
    textAlign: 'left',
    paddingLeft: '15px',
    paddingRight: '15px'
  },
  searchButton: {
      verticalAlign: 'middle',
      marginLeft: '2px',
      marginTop: '10px',
      marginBottom: '10px',
      width: '100px',
      height: '25px',
      fontFamily: 'San Serif',
      fontSize: '12px',
      color: 'black',
      textAlign: 'center',
      background: '#3498db',
      cursor: 'pointer',
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
          this.props.previewItem.img !== '' ? React.createElement('img', { src : this.props.previewItem.img , style : { textAlign : 'left', marginLeft: '15px', width: '40%', height: '40%', float: 'left'}, height : this.props.previewItem.height * ratio, width : this.props.previewItem.width * ratio }) : null,
          React.createElement('span', { style: { width: '15px', height: '100px', float: 'left' } }),
          React.createElement('p', { style : NytStyles.body }, this.props.previewItem.abstract),
          React.createElement('button', { style : NytStyles.searchButton }, 'Read More' )
        )
      )
    );
  },

});