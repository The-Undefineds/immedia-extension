window.twttr = (function(d, s, id) {

  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
 
  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
 
  return t;
}(document, "script", "twitter-wjs"));

var TwitterPreview = React.createClass({

  twitterStyles: {
    height: '600px',
    width: '600px',
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
    $('#twitterPreview').append('<webview id="tweet" src="https://platform.twitter.com/widgets.js" style="width:640px; height:480px"></webview>');

    console.log(twttr.widgets.createTweet)
    var webview = document.getElementById('tweet');
    webview.addEventListener("loadstart", function(){
      twttr.widgets.createTweet("'"+ tweetId + "'", document.getElementById('tweet'), {
        theme: 'dark'
      });
    })

    // $('#tweet').html('Hello World');
    
  },

  render: function() {

    return (
      React.createElement('div', { id:'twitterPreview', style: this.twitterStyles})
      )

  }

});