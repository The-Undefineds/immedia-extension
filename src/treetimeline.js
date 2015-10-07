//var StyleSheet = require('react-style');

var i = 0;

var d3Styles = {
  container: {
    position: 'absolute',
    top: '55px',
    left: '100px',
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: '24px',
    color: '#00BFFF',
    marginTop: '5px',
    marginBottom: '1px',
    textAlign: 'left',
    paddingLeft: '5px',
  },
  d3: {
    position: 'absolute',
    top: '40px',
    borderRight: 'solid 1px gray',
  }
};

var TreeTimeLine = React.createClass({

  renderCount: 0,

  getInitialState: function(){
    return {
      timeSpan: 7,
      apiData: [],
      width: this.props.window.width,
      height: this.props.window.height,
    };
  },

  // apis: [
    // 'nyt',
    // 'twitter',
    // 'youtube',
    // 'news'
  // ],

  // query: function(searchTerm){
  //   var index = searchTerm.indexOf('(');
  //   if (index !== -1) searchTerm = searchTerm.slice(0, index);
  //   for(var i = 0; i < this.apis.length; i++){
  //     this.handleQuery({
  //       searchTerm: searchTerm,
  //       url: '//immedia.xyz/api/' + this.apis[i],
  //       api: this.apis[i]
  //     });
  //   }
  // },

  // componentDidMount: function(){
  //   var component = this;
  //   // this.query(this.props.searchTerm);
  //   $(window).scroll(function() {
  //      if($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
  //          console.log("bottom!");
  //          if (component.dates.length > 30) {
  //           return;
  //          }
  //          component.setTimeSpan(component.dates.length + 7);
  //      }
  //   });
  // },

  componentDidMount: function(){
    var component = this;
    chrome.runtime.onMessage.addListener(function(response, sender){
  
      console.log('request', response);
      component.setState(function(previousState, currentProps) {
        
        var previousApiData = previousState['apiData'].slice();
        console.log('currentProps', currentProps);

        for(var date in response) {
          var j = 0;
          for(; j < previousApiData.length; j++) {
            if(previousApiData[j]['date'] === date) {
              previousApiData[j]['children'].push(response[date]);
              break;
            }
          }
          
          if(j === previousApiData.length) {
            previousApiData.push(
              {
                'date': date, 
                'children': [
                  response[date]
                ]
            });
          }
        }
        
        previousApiData.sort(function(a, b) {
          var aDate = new Date(a['date']);
          var bDate = new Date(b['date']);
          return bDate - aDate;
        });
        console.log('previousApiData', previousApiData)
        return {
          apiData: previousApiData,
          width: this.props.window.width,
          height: this.props.window.height
        }
      });
    })
  },

  // handleQuery: function(searchQuery){
  //   $.post(searchQuery.url, searchQuery)
  //    .done(function(response) {
        // this.setState(function(previousState, currentProps) {
        //   var previousApiData = previousState['apiData'].slice();
          
        //   for(var date in response) {
        //     var i = 0;
            
        //     for(; i < previousApiData.length; i++) {
        //       if(previousApiData[i]['date'] === date) {
        //         previousApiData[i]['children'].push(response[date]);
        //         break;
        //       }
        //     }
            
        //     if(i === previousApiData.length) {
        //       previousApiData.push(
        //         {
        //           'date': date, 
        //           'children': [
        //             response[date]
        //           ]
        //         }
        //       );
        //     }
        //   }
          
        //   previousApiData.sort(function(a, b) {
        //     var aDate = new Date(a['date']);
        //     var bDate = new Date(b['date']);
        //     return bDate - aDate;
        //   });
        //   return {apiData: previousApiData};
  //       });
  //    }.bind(this));
  // },

  dates: [],

  setTimeSpan: function(timeSpan) {
    this.setState({ timeSpan: timeSpan });
  },

  render: function() {

    var component = this;

    var generateDates = function(timeSpan) {
        component.dates = [];
        for (var i = -1; i < timeSpan; i++) {
        var date = new Date();
        date.setDate(date.getDate() - i);
        component.dates.push(date.toJSON().slice(0, 10));
      }
    }

    generateDates(this.state.timeSpan);

    this.renderCanvas();
    this.getDynamicStyles();
    console.log('coming from d3 render', this.state.apiData);
    return (
      React.createElement('div', { style : d3Styles.container},
        React.createElement('span', { id : 'd3title', style : d3Styles.title }, 'recent events'),
        React.createElement('div', { id : 'd3container', style : d3Styles.d3})
      )
    );
  },

  getDynamicStyles: function() {
    d3Styles.container.left = (this.state.width - 1350 > 0 ? (this.state.width - 1350) / 2 : 5) + 'px';
    d3Styles.container.width = (this.state.width - 1350 < 0 ? 350 * (this.state.width/1350) : 350) + 'px';
    d3Styles.container.height = (this.dates.length*120) + 'px';
    return;
  },

  mouseOver: function(item) {
    if (this.mousedOver === item) {
      return;
    } else {
      this.mousedOver = item;
    }
    this.props.mouseOver({
        title: item.title,
        date: item.date,
        url: item.url,
        img: item.img,
        source: item.parent.source,
        id: item.id,
        tweet: item.tweet,
        byline: (item.hasOwnProperty('byline') ? item.byline : ''),
        abstract: (item.hasOwnProperty('abstract') ? item.abstract : ''),
        height: (item.hasOwnProperty('height') ? item.height : ''),
        width: (item.hasOwnProperty('width') ? item.width : ''),
      });
  },

  renderCanvas: function() {

    var component = this;
    d3.select('svg').remove();

    var colors = d3.scale.category20c();

    var margin = {
      top: 10,
      right: 40,
      bottom: 20,
      left: 40
    };

    var width = (this.state.width - 1350 < 0 ? this.state.width * (350/1350) : 350),
        height = this.dates.length*120;

    var oldestItem = this.state.apiData[this.state.apiData.length - 1] ? 
                      this.state.apiData[this.state.apiData.length - 1] : null;

    var y = d3.time.scale()
      .domain([new Date(this.dates[this.dates.length - 1]), new Date(this.dates[0])])
      .rangeRound([height - 4*(margin.top) - margin.bottom, 0])
      // .clamp(true)

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(d3.time.days, 1)
      .tickFormat(d3.time.format('%a %d'))
      .tickSize(0)
      .tickPadding(20)

    var svg = d3.select('#d3container').append('svg')
      .attr('class', 'timeLine')
      .attr('width', width)
      .attr('height', this.state.height - 100)
      .append('g')
      .attr('transform', 'translate(60, ' + margin.top + ')')

    svg.append('g')
      .attr('class', 'yAxis')
      .attr({
        'font-family': 'Arial, sans-serif',
        'font-size': 10 * (this.state.width / 1350) + 'px',
      })
      .attr({
        fill: 'none',
        stroke: '#000',
        'shape-rendering': 'crispEdges',
      })
      .call(yAxis);

    var timeLine = svg.selectAll('.timeLine')
      .data({ 'name': 'data', 'children': this.state.apiData })
      .attr('y', function(d) { return y(new Date(d.date)); })

    svg.selectAll('g.node').remove();


    //-----draw tree from each tick on yAxis timeline ------

    var root;

    var tree = d3.layout.tree()
        .size([height, width])

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

      root = { 'name': 'data', 'children': this.state.apiData };
      root.x0 = height / 1.5;
      root.y0 = 0;

    function toggleAll(d) {
        if (d.children) {
          d.children.forEach(toggleAll);
          toggle(d);
        }
      }

      update(root);

    function update(source) {

      var duration = function(d) {
        // if (d.rendered < component.apis.length) {
        //   d.rendered++;
        //   return 5;
        // } else if (!d.rendered) {
        //   d.rendered = 1;
        // }
        return 500;
      }

      var nodes = tree.nodes(root).reverse();
      var links = d3.layout.tree().links(nodes);

      nodes.forEach(function(d) { 
        if (d.depth === 1) {
          if (d === oldestItem) {
            d.x = height - 2*(margin.top);
            d.y = 0;
            return;
          }
          d.x = y(new Date(d.date)) - 20;
          d.y = 0;
          d.fixed = true;
        }
        else {
          if (d.depth === 2) {
            d.y = 120;
          };
          if (d.depth === 3) {
            d.y = 240;
            }
          }
        });

      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .on("click", function(d) {
          console.log(d);
          if (d.url) { 
            window.open(d.url,'_blank');
            return;
          } else if (d.parent.source === 'youtube') {
            window.open('https://www.youtube.com/watch?v=' + d.id, '_blank');
            return;
          }
          toggle(d); 
          update(d); 
        })
        .on("mouseenter", function(d) {
          console.log(d);
          if (d.depth === 3) {
            component.mouseOver(d);
          }
        })
        .on('mouseover', function(d) {
          if (d.depth === 3) {
            d3.select(this).select('circle')
              .transition()
              .attr({
                r: 28,
              })
            }
        })
        .on('mouseout', function(d) {
          if (d.depth === 3) {
            d3.select(this).select('circle')
              .transition()
              .attr({
                r: 25,
              })
          }
        })

      var defs = svg.append('svg:defs');
        defs.append('svg:pattern')
          .attr('id', 'tile-twitter')
          .attr('width', '20')
          .attr('height', '20')
          .append('svg:image')
          .attr('xlink:href', 'https://g.twimg.com/Twitter_logo_blue.png')
          .attr('x', 4)
          .attr('y', 5)
          .attr('width', 15)
          .attr('height', 15)
        defs.append('svg:pattern')
          .attr('id', 'tile-nyt')
          .attr('width', '20')
          .attr('height', '20')
          .append('svg:image')
          .attr('xlink:href', 'http://www.hitthefloor.com/wp-content/uploads/2014/03/20-new-york-times-t-1.jpg')
          .attr('x', -7)
          .attr('y', -7)
          .attr('width', 40)
          .attr('height', 40)
        defs.append('svg:pattern')
          .attr('id', 'tile-youtube')
          .attr('width', '20')
          .attr('height', '20')
          .append('svg:image')
          .attr('xlink:href', 'https://lh5.ggpht.com/jZ8XCjpCQWWZ5GLhbjRAufsw3JXePHUJVfEvMH3D055ghq0dyiSP3YxfSc_czPhtCLSO=w300')
          .attr('x', 4)
          .attr('y', 5)
          .attr('width', 15)
          .attr('height', 15)

      nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
        .style({
          cursor: 'pointer',
          fill: '#fff',
          stroke: 'steelblue',
          strokeWidth: '1.5px',
        })

      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { 
            if (d == root) {
              d.y = -1000;
            }
            return "translate(" + d.y + "," + d.x + ")"; 
          });

      nodeUpdate.select("circle")
          .attr("r", function(d) {
            if (d.depth === 1 && d._children) {
              return 12;
            } else if (d.depth === 1 && d.children) {
              return Math.max(d.children.length * 6, 9);
            } else if (d.source) {
              return 12;
            } else if (d.depth === 3)
              return 25;
          })
          .style('fill', 'white')
          .style("fill", function(d) { 
            var dat = d;
            if (d.source == 'twitter') {
              return 'url(/#tile-twitter)';
            } else if (d.source == 'nyt') {
              return 'url(/#tile-nyt)';
            } else if (d.source == 'youtube') {
              return 'url(/#tile-youtube)';
            } else if (d.img === '') {
              return colors(d.id);
            } else if (d.depth === 3) {
              defs.append('svg:pattern')
                .attr('id', 'tile-img' + d.id)
                .attr({
                  'width': '40',
                  'height': '40',
                })
                .append('svg:image')
                .attr('xlink:href', function() {
                  if (d.thumbnail) {
                    return d.thumbnail.medium.url;
                  } else if (d.img) {
                    return d.img;
                  }
                })
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 55)
                .attr('height', 55)
              return 'url(/#tile-img' + d.id + ')'
            }
            return d._children ? "lightsteelblue" : "#fff"; 
          })

      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      var link = svg.selectAll("path.link")
          .data(tree.links(nodes), function(d) { return d.target.id; })

      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var origin = { x: source.x0, y: source.y0 };
            return diagonal({ source: origin, target: origin });
          })
          .style({
            fill: 'none',
            stroke: '#ccc',
            strokeWidth: '1.5px',
          })
        .transition()
          .duration(500)
          .attr("d", diagonal)

      link.transition()
          .duration(500)
          .attr("d", diagonal);

      link.exit().transition()
          .duration(500)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function toggle(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(root);
    }
  },

});
