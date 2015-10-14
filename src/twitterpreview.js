var TwitterPreview = React.createClass({

  twitterStyles: {
    height: '600px',
    width: '600px',
    textAlign: 'center'
  },


  componentDidMount: function() {
    this.componentDidUpdate();
  },

  componentDidUpdate: function() {
    $('#twitterPreview').empty();
    var twitterItem = this.props.previewItem;
    this.embedTweet(twitterItem.tweetId);
  },

  embedTweet: function(tweetId) {
    $('#twitterPreview').append('<div id="tweet" style="margin-left:65px;margin-top:90px"></div>')
    
    script = document.getElementById('embedTweet');
    if (script !== null) script.parentNode.removeChild(script);
    
    var embedTweet = document.createElement('SCRIPT');
    embedTweet.id='embedTweet';
    embedTweet.type= 'text/javascript';
    embedTweet.innerHTML = "twttr.widgets.createTweet('"+tweetId+"', document.getElementById('tweet'));";

    script = document.getElementsByTagName('SCRIPT')[0];
    script.parentNode.insertBefore(embedTweet, script);
  },

  render: function() {
    return (
      React.createElement('div', { id:'twitterPreview' })
      )
  }

});