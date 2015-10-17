// document.body.innerHTML = '';
var createStyle = document.createElement('STYLE');
createStyle.id='createStyle';
createStyle.innerHTML = "::-webkit-scrollbar {-webkit-appearance: none;width: 7px;height: 7px;}::-webkit-scrollbar-thumb {border-radius: 4px;background-color: rgba(0,0,0,.5);-webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);}";

var script = document.getElementsByTagName('SCRIPT')[0];
if (document.getElementById('createStyle') === null) script.parentNode.insertBefore(createStyle, script);

var container = document.createElement('div');
container.id = 'extension';

if(document.getElementById('extension') === null){
  document.body.appendChild(container);
}; 

var ResultsComponent = React.createClass({
  displayName: ResultsComponent,

  getInitialState: function(){
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      previewing: false
    }
  },

  componentDidMount: function(){
    // var component = this;
    window.addEventListener('resize', this.handleResize);
    this.renderPreview({source: ''});

  },

  componentWillReceiveProps: function() {
    this.item = {source: ''};
    // this.renderPreview(this.item);
  },

  componentWillMount: function() {
    $('.mediawiki').width(window.innerWidth-400);
    $('.mediawiki').css({'margin-left': '400px'});
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  item: {source: ''},

  renderPreview: function(item) {
    React.render(
      React.createElement(Preview, {previewItem: item, windowHeight: this.state.height, windowWidth: this.state.width}),
      document.getElementById('preview')
    )
  },

  handleResize: function(e) {
    // this.setState({
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // });
  },

  mouseOver: function(item){   
    this.renderPreview(item);
  },

  styles: {
    results: {
      top: '0',
      left: '0',
      width: '350px',
      height: '100%',
      position: 'fixed',
      zIndex: '10',
      borderStyle: 'solid',
      borderWidth: '2px',
      // backgroundColor: 'rgba(0,0,0,.6)',
    },
    d3: {
      top: '290px',
      left: '180px',
      width: '350px',
      height: '100%',
      display: 'flex',
      position: 'fixed',
      // overflowY: 'hidden',
      // overflowX: 'hidden',
      borderRadius: '4px',
      alignItems: 'flex-start',
      // backgroundColor: 'rgba(0,0,0,.8)',
      justifyContent: 'center',
      WebkitBoxAlign: 'start',
      zIndex: '20',
    },
    
  },

  // closeModal: function(){
  //   $(document).on("keyup", function (e) {
  //       if (e.which == 27) {
  //         $('div').remove('#extension');
  //       }
  //   }); 
  // },

  // getDynamicStyles: function() {
  //   //d3Styles.container.left = (this.state.width - 1350 > 0 ? (this.state.width - 1350) / 2 : 5) + 'px';
  //   this.styles.d3.width = (this.state.width - 1350 < 0 ? 350 * (this.state.width/1350) : 350) + 'px';
  //   //d3Styles.container.height = (this.dates.length*120) + 'px';
  //   return;
  // },

  exitModal: function(event){
    console.log('key ', event.which);
  },

  // onlyKeepContainerFixedVertically: function(){
  //   $(window).scroll(function(){
  //     $('#results').css('left',-$(window).scrollLeft());
  //   });
  // },

  render: function(){
    var showingLogo;

    $(document).on("keyup", function (e) {
        if (e.which == 27) {
          $('#preview').empty();
        }
    })

    // .on("scroll", function () {
    //   var scrollOffset = $('#d3container').offset().top;
    //   if (!showingLogo && scrollOffset > 160) {
    //     showingLogo = true;
    //     $('#logo').css({ opacity: '.8' });
    //   } else if (showingLogo && scrollOffset <= 160) {
    //     showingLogo = false;
    //     $('#logo').css({ opacity: '.0' });
    //   }
    // })

    // .on("click", function(event){
    //   if (!(event.clientX < 1170 && event.clientY < 455)) {

    //     $('#preview').empty();
    //   }
    //   console.log(event);
    // })

    // this.getDynamicStyles();
    this.onlyKeepContainerFixedVertically();

    return (
      React.createElement('div', {id: "results" },
        React.createElement('div', {id: "modal-d3", style: this.styles.d3}, 
          React.createElement(TreeTimeLine, {mouseOver: this.mouseOver, windowHeight: this.state.height, windowWidth: this.state.width})
          // this.state.previewing ? React.createElement(Preview, {previewItem: this.state.previewing, windowHeight: this.state.height, windowWidth: this.state.width}) : null
        ),
        React.createElement('div', {id: "preview"}) 
      )
    )
  },

  onlyKeepContainerFixedVertically: function(){
    $(window).scroll(function(){
      $('#results').css('left',-$(window).scrollLeft());
    });
  },

});

React.render(React.createElement(ResultsComponent, null), document.getElementById('extension'));
