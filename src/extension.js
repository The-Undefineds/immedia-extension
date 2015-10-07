document.body.innerHTML = '';
var container = document.createElement('div')
container.id = 'extention';

if(document.getElementById('extention') === null){
  document.body.appendChild(container);
}; 

var ResultsComponent = React.createClass({
  displayName: ResultsComponent,

  getInitialState: function(){
    return {
      requestData: '',
      width: window.innerWidth,
      height: window.innerHeight,
    }
  },

  componentDidMount: function(){
    var component = this;
    window.addEventListener('resize', this.handleResize);
    // this.renderPreview({source: ''});

    // chrome.runtime.onMessage.addListener(function(request, sender){
    //   component.setState({requestData: request});
    //   console.log('request', request);
    // })
  },

  componentWillReceiveProps: function() {
    this.item = {source: ''};
    // this.renderPreview(this.item);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  item: {source: ''},
  // renderPreview: function(item) {
  //   React.render(
  //     <Preview previewItem={item} window={this.state} />,
  //     document.getElementById('preview')
  //   );
  // },

  handleResize: function(e) {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // this.renderPreview(this.item);
  },

  queryTerm: function(searchTerm){
    this.setState({
      searchTerm: searchTerm
    });
  },

  mouseOver: function(item){    
    this.item = item;
    // this.renderPreview(this.item);
  },

  render: function(){
    return (
      React.createElement('div', {id: "results"}, 
        React.createElement(TreeTimeLine, {mouseOver: this.mouseOver, windowHeight: this.state.height, windowWidth: this.state.width})
      )
    )
  }
})

// var d3Container = React.createElement('div', null, 'Hello World')
React.render(React.createElement(ResultsComponent, null), document.getElementById('extention'));
