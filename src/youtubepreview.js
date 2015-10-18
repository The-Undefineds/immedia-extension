var YouTubePreview = React.createClass({

  getInitialState: function() {
    return {
      width: this.props.width,
      height: this.props.height,
    };
  },

  componentDidMount: function() {
    this.mountYouTubeVideo(this.props.previewItem.id);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      width: nextProps.width,
      height: nextProps.height,
    });
  },

  componentWillUpdate: function() {
    var $youtube = $('#youtube');
    if($youtube[0].localName === 'iframe') {
      $youtube.replaceWith('<div id=\"youtube\"></div>');
    }
  },

  componentDidUpdate: function() {
    this.mountYouTubeVideo(this.props.previewItem.id);
    $('#youtube').css('margin-top', '5px');
  },

  render: function() {
    return (
      React.createElement('div', { id : 'youtube', style: {marginTop: '5px'} })
    );
  },

  mountYouTubeVideo: function(videoId){
    console.log('this is YT', YT);
    console.log('this is YT.Player', YT.PlayerState);

    var player = new YT.Player('youtube', { // The 'player' refers to an id attached to an element
      height: 216 * .95,
      width: 384 * .95,
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    var onPlayerReady = function(event) {
      event.target.playVideo();
    }
    var done = false;
    var onPlayerStateChange = function(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
      }
    }
    var stopVideo = function() {
      player.stopVideo();
    }
  },

});