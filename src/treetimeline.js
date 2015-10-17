//var StyleSheet = require('react-style');

var idCounter = 0;

var d3Styles = {
  container: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    marginTop: '30px',
    marginBottom: '5px',
    paddingTop: '0px',
    height: '300px',
    textAlign: 'left',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '384px',
  },
  title: {
    fontFamily: 'Serif',
    fontSize: '24px',
    color: 'black',
    // marginTop: '25px',
    marginBottom: '10px',
    paddingLeft: '5px',
    borderBottom: '1px solid gray',
    width: '370px',
  },
  d3: {
    position: 'absolute',
    top: '40px',
    borderRight: 'solid 1px gray',
    // backgroundColor: 'white',
  },
  treeBox: {
    // border: 'solid 1px #a7d7f9',
    // marginTop: '15px',
    // backgroundColor: 'white',
    // width: '384px',
    // overflowY: 'scroll',
    overflowY: 'visible',
    paddingBottom: '50px',

  },
};

var TreeTimeLine = React.createClass({

  renderCount: 0,

  getInitialState: function(){
    return {
      timeSpan: 7,
      apiData: [],
      width: this.props.windowWidth,
      height: this.props.windowHeight,
    };
  },

  apis: [
    'nyt',
    'twitter',
    'news',
    'youtube'
  ],

  query: function(searchTerm){
    var bodyWidth = $('.mediawiki').width();
    for(var i = 0; i < this.apis.length; i++){
      chrome.runtime.sendMessage({
        url: 'http://immedia.xyz/api/' + this.apis[i],
        api: this.apis[i],
        bodyWidth: bodyWidth,
        days: 30
      });
    }
  },

  componentDidMount: function(){
    var component = this;
    this.query();

    chrome.runtime.onMessage.addListener(function(message, sender){
      component.handleQuery(message);
    });
  },

  componentWillReceiveProps: function(newProps){
    this.renderCount = 0;
    this.setState({
      width: newProps.windowWidth,
      height: newProps.windowHeight
    });
  },

  handleQuery: function(response){
    this.renderCount++;
    this.setState(function(previousState, currentProps) {
      var previousApiData = previousState['apiData'].slice();
      
      for(var date in response) {
        var i = 0;
        
        for(; i < previousApiData.length; i++) {
          if(previousApiData[i]['date'] === date) {
            previousApiData[i]['children'].push(response[date]);
            break;
          }
        }
        
        if(i === previousApiData.length) {
          previousApiData.push(
            {
              'date': date, 
              'children': [
                response[date]
              ]
            }
          );
        }
      }
      
      previousApiData.sort(function(a, b) {
        var aDate = new Date(a['date']);
        var bDate = new Date(b['date']);
        return bDate - aDate;
      });
      return {apiData: previousApiData};
    });
  },

  dates: [],

  generateDates: function(startTime, endTime, canvas) {
      this.dates[canvas] = [];
      for (var i = startTime; i <= endTime; i++) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      this.dates[canvas].push(date.toJSON().slice(0, 10));
    }
  },

  render: function() {

    this.renderCanvas(0, 6, 1);    // Crucial step that (re-)renders D3 canvas
    this.renderCanvas(7, 13, 2);
    this.renderCanvas(14, 20, 3);
    this.renderCanvas(21, 28, 4);

    this.getDynamicStyles();
    // this.onlyKeepContainerFixedVertically();
    
    return (
      React.createElement('div', { id: 'd3container', style : d3Styles.container },
        // React.createElement('div', { style: {textAlign: 'center'} },
        //  React.createElement('img', { id: 'logo', style: {width: '100px', height: '100px', opacity: '.8', marginTop: '10px' }, src: chrome.extension.getURL('assets/immedia.png') })
        // ),
        React.createElement('div', { id : 'd3title', style : d3Styles.title }, 'Recent Media'),
        React.createElement('div', { id: 'd3', style: d3Styles.treeBox}, 
          React.createElement('div', { id : 'd3canvas1'}),
          React.createElement('div', { id : 'd3canvas2'}),
          React.createElement('div', { id : 'd3canvas3'}),
          React.createElement('div', { id : 'd3canvas4'})
        )
      )
    );
  },

  // onlyKeepContainerFixedVertically: function(){
  //   $(window).scroll(function(){
  //     $('#d3container').css('left',-$(window).scrollLeft());
  //   });
  // },

  getDynamicStyles: function() {
    // d3Styles.container.left = (this.state.width - 1350 > 0 ? (this.state.width - 1350) / 2 : 5) + 'px';
    // d3Styles.container.width = (this.state.width - 1350 < 0 ? 330 * (this.state.width/1350) : 330) + 'px';
    d3Styles.container.height = window.innerHeight - 290 + 'px';
    return;
  },

  mouseOver: function(item) {
    if (this.mousedOver === item && $('#preview').html() !== "") {  // This line ensures that preview box doesn't accidentally reload when 
      return;                                                       // mouseover occurs over the preview currently being viewed,
    } else {                                                        // and the second predicate ensures that this does not deactivate
      this.mousedOver = item;                                       // other mouseovers after the box has been exited
    }
    this.props.mouseOver({
        title: item.title,
        date: item.date,
        url: item.url,
        img: item.img,
        source: item.parent.source,
        id: item.videoId,
        tweetId: (item.hasOwnProperty('tweet_id') ? item.tweet_id : ''),
        byline: (item.hasOwnProperty('byline') ? item.byline : ''),
        videoId: (item.hasOwnProperty('videoId') ? item.videoId : ''),
        abstract: (item.hasOwnProperty('abstract') ? item.abstract : ''),
        height: (item.hasOwnProperty('height') ? item.height : ''),
        width: (item.hasOwnProperty('width') ? item.width : ''),
      });
  },

  renderCanvas: function(startDay, endDay, canvas) {

    this.generateDates(startDay, endDay, canvas);
    var component = this;
    d3.select('#d3canvas' + canvas).select('svg').remove();

    var colors = d3.scale.category20c();

    var margin = {
      top: 10,
      right: 40,
      bottom: 20,
      left: 40
    };

    var width = (this.state.width - 1350 < 0 ? this.state.width * (350/1350) : 350),
        height = this.state.height - 100;

    var oldestItem = this.state.apiData[this.state.apiData.length - 1] ? 
                      this.state.apiData[this.state.apiData.length - 1] : null;

    /* Because each canvas represents one week in time, only data dated within that week's time period
    will be included and rendered on the canvas */
    var canvasData = [];
    for (var i = 0; i < this.state.apiData.length; i++) {
      if (this.dates[canvas].indexOf(this.state.apiData[i].date) !== -1) {
        canvasData.push(this.state.apiData[i]);
      }
    };

    /* Create a vertical D3 time scale, organized by day in descending order based on the 7-day period of dates
    generated by the component's generateDates function (dates are stored in the component's date property) */
    var y = d3.time.scale()
      .domain([new Date(this.dates[canvas][this.dates[canvas].length - 1]), d3.time.day.offset(new Date(this.dates[canvas][0]), 1)])
      .rangeRound([height - margin.bottom, canvas === 1 ? 80 : 0])

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(d3.time.days, 1)
      .tickFormat(d3.time.format('%a %d'))
      .tickSize(0)
      .tickPadding(20)

    var svg = d3.select('#d3canvas' + canvas).append('svg')
      .attr('class', 'timeLine')
      .attr('width', width)
      .attr('height', this.state.height - 100)
      .append('g')
      .attr('transform', 'translate(60, ' + margin.top + ')')

    svg.append('g')
      .attr('class', 'yAxis')
      .attr({
        'font-family': "Linux Libertine,Georgia,Times,serif",
        'font-size': 9 * (this.state.width / 1350) + 'px',
      })
      .attr({
        fill: 'none',
        stroke: 'black',
        'shape-rendering': 'crispEdges',
      })
      .call(yAxis);

    // var timeLine = svg.selectAll('.timeLine')
    //   .data({ 'name': 'data', 'children': this.state.apiData })
    //   .attr('y', function(d) { return y(new Date(d.date)); })

    svg.selectAll('g.node').remove();


    //-----draw tree from each tick on yAxis timeline ------

    var root;

    var tree = d3.layout.tree()
        .size([height, width])

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var root = { 'name': 'data', 'children': canvasData };

    /* When all data has been loaded, toggle the nodes so that only the first two days of each week
    will be expanded (the other days are collapsed). This makes the canvas less crowded. */
    if (this.renderCount === this.apis.length) {
      root.children.forEach(collapse);
      toggle(root.children[0]);
      toggle(root.children[1]);
    }

    update(root, canvas);

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      }
    }

    function update(root, canvas) {

      var duration = 500;

      var nodes = tree.nodes(root).reverse();
      var links = tree.links(nodes);

      nodes.forEach(function(d) { 
        if (d.depth === 1) {
          if (d === oldestItem) {
            d.x = height - margin.bottom;
            d.y = 0;
            return;
          }
          d.x = y(new Date(d.date)) - 20;
          d.y = 0;
          d.fixed = true;
        }
        else {
          if (d.depth === 2) {
            d.y = 120 * (component.state.width > 1350 ? 1 : (component.state.width / 1350));
          };
          if (d.depth === 3) {
            d.y = 240 * (component.state.width > 1350 ? 1 : (component.state.width / 1350));
            }
          }
        });

      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++idCounter); });

      var nodeEnter = node.enter().append('svg:g')
              .attr('class', 'node')
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
              .on('click', function(d) {
                if (d.url) { 
                  window.open(d.url,'_blank');
                  return;
                } else if (d.parent.source === 'youtube') {
                  window.open('https://www.youtube.com/watch?v=' + d.videoId, '_blank');
                  return;
                }
                toggle(d); 
                update(root, canvas); 
              })
              .on('mouseenter', function(d) {
                d3.select(this).select('circle')
                  .style({
                    stroke: 'blue',
                    strokeWidth: 1.5 + 'px',
                  })
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
                d3.select(this).select('circle')
                  .style({
                    stroke: 'steelblue',
                    strokeWidth: 1.5 + 'px',
                  })
                if (d.depth === 3) {
                  d3.select(this).select('circle')
                    .transition()
                    .attr({
                      r: 25,
                    })
                  }
              });

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
        defs.append('svg:pattern')
          .attr('id', 'tile-twitternews')
          .attr('width', '20')
          .attr('height', '20')
          .append('svg:image')
          .attr('xlink:href', 'https://pbs.twimg.com/profile_images/3756363930/c96b2ab95a4149493229210abaf1f1fa_400x400.png')
          .attr('x', -2)
          .attr('y', -1)
          .attr('width', 27)
          .attr('height', 27)

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
            return "translate(" + d.y + "," + d.x + ")"; 
          });

      nodeUpdate.select("circle")
          .attr('r', function(d) {
            if (d.depth === 1 && d._children) {
              return Math.max(d._children.length * 6, 10);
            } else if (d.depth === 1 && d.children) {
              return 10;
            } else if (d.source) {
              return 12;
            } else if (d.depth === 3)
              return 25;
          })
          .style('fill', 'lightsteelblue')
          .style("fill", function(d) { 
            if (d.source == 'twitter') {
              return 'url(#tile-twitter)';
            } else if (d.source == 'nyt') {
              return 'url(#tile-nyt)';
            } else if (d.source == 'youtube') {
              return 'url(#tile-youtube)';
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
                .attr('x', -2)
                .attr('y', -2)
                .attr('width', 55)
                .attr('height', 55)
              return 'url(#tile-img' + d.id + ')'
            }
            return d._children ? "lightsteelblue" : "#fff"; 
          })

      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr('transform', function(d) { return 'translate(' + d.parent.y + ',' + d.parent.x + ')'; })

      nodeExit.select('circle')
          .attr('r', 1e-6);

      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      var link = svg.selectAll("path.link")
          .data(tree.links(nodes), function(d) { return d.target.id; })

      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var origin = { x: d.source.x0, y: d.source.y0 };
            return diagonal({ source: origin, target: origin });
          })
          .style({
            fill: 'none',
            strokeWidth: '1.5px',
          })
          //The links from the hidden root node to the nodes on the timeline will not show.
          .style('stroke', function(d) {
            if (d.target.depth === 1) { return 'white'; }
            else { return '#ccc'; };
          })

  
      link.transition()
          .duration(500)
          .attr("d", diagonal);

      link.exit().transition()
          .duration(500)
          .attr("d", function(d) {
            var origin = {x: d.source.x, y: d.source.y};
            return diagonal({source: origin, target: origin});
          })
          .remove();

      if (canvas === 1 && canvasData[0] && canvasData[0].children[0]) {component.mouseOver(canvasData[0].children[0].children[0])}

    }

    function toggle(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    }
  },

});
