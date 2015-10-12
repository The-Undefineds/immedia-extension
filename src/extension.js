// document.body.innerHTML = '';
var container = document.createElement('div')
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
    }
  },

  componentDidMount: function(){
    var component = this;
    window.addEventListener('resize', this.handleResize);
    this.renderPreview({source: ''});

  },

  componentWillReceiveProps: function() {
    this.item = {source: ''};
    this.renderPreview(this.item);
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
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.renderPreview(this.item);
  },

  mouseOver: function(item){    
    this.item = item;
    this.renderPreview(this.item);
  },

  styles: {
    results: {
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      position: 'fixed',
      zIndex: '10',
      borderStyle: 'solid',
      borderWidth: '2px',
      backgroundColor: 'rgba(0,0,0,.6)',
    },
    d3: {
      top: '0',
      left: '0',
      width: '350px',
      height: '100%',
      display: 'flex',
      position: 'relative',
      overflowY: 'hidden',
      overflowX: 'hidden',
      borderRadius: '4px',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(0,0,0,.6)',
      justifyContent: 'center',
      WebkitBoxAlign: 'start',
      zIndex: '20',
    },
    
  },

  getDynamicStyles: function() {
    //d3Styles.container.left = (this.state.width - 1350 > 0 ? (this.state.width - 1350) / 2 : 5) + 'px';
    this.styles.d3.width = (this.state.width - 1350 < 0 ? 350 * (this.state.width/1350) : 350) + 'px';
    //d3Styles.container.height = (this.dates.length*120) + 'px';
    return;
  },

  render: function(){
    this.getDynamicStyles();
    return (
      React.createElement('div', {id: "results", style: this.styles.results, onClick: this.closeModal()},
        React.createElement('div', {id: "modal-d3", style: this.styles.d3}, 
          React.createElement(TreeTimeLine, {mouseOver: this.mouseOver, windowHeight: this.state.height, windowWidth: this.state.width})
        ), 
        React.createElement('div', {id: "preview"}) 
      )
    )
  }

});

React.render(React.createElement(ResultsComponent, null), document.getElementById('extension'));
