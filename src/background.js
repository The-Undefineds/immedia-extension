var searchTerm;
var extensionMounted;
var d3On;
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  extensionMounted = false;
  d3On = false;
  if(tab.url.match(/wikipedia.org/g)){
    //load our dependencies and content scripts
    if (!extensionMounted){
      extensionMounted = true;
      chrome.tabs.executeScript(null, {file: "./assets/jquery.min.js"});
      chrome.tabs.executeScript(null, {file: "./assets/d3.min.js"});
      chrome.tabs.executeScript(null, {file: "./assets/react.js"});
      chrome.tabs.executeScript(null, {file: "./assets/youtube1.js"});
      chrome.tabs.executeScript(null, {file: "./assets/youtube2.js"});
      chrome.tabs.executeScript(null, {code: "window.twttr = (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};if (d.getElementById(id)) return t;js = d.createElement(s);js.id = id;js.src = '  https://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js, fjs);t._e = [];t.ready = function(f) {t._e.push(f);};return t;}(document, 'script', 'twitter-wjs'));"});
  
      // chrome.tabs.executeScript(null, {file: "./src/loadmeta.js"}); //used to stop the Twitter error msg
      chrome.tabs.executeScript(null, {file: "./src/treetimeline.js"});
      chrome.tabs.executeScript(null, {file: "./src/preview.js"});
      chrome.tabs.executeScript(null, {file: "./src/emptypreview.js"});
      chrome.tabs.executeScript(null, {file: "./src/nytpreview.js"});
      chrome.tabs.executeScript(null, {file: "./src/twitterpreview.js"});
      chrome.tabs.executeScript(null, {file: "./src/youtubepreview.js"});
  
      //Once on the page, parse the url for the search term
      chrome.tabs.query({active: true, currentWindow: true}, function(results){
        searchTerm = parseUrl(results[0].url);
      });
    }

    chrome.pageAction.show(tab.id);
    
  }
});

chrome.runtime.onMessage.addListener(function(message, sender){
  handleQuery(message);
});

chrome.pageAction.onClicked.addListener(function(tab){
  if(d3On === false){
    chrome.tabs.executeScript(null, {file: "./src/extension.js"})
    d3On = true;
  }
  else{
    chrome.tabs.executeScript(null, {code: "$(\'div\').remove(\'#extension\')"})
    //tabs need to reload unless, searchterm is not mounted to be searched
    //only random youtube videos appear
    chrome.tabs.reload();
    d3On = false;
  }
  
})

function parseUrl(url){
  var index = url.lastIndexOf('/');
  var resultURL = url.slice(index + 1);
  return resultURL.replace(/_/g, ' ');
}

function handleQuery(searchQuery, results){
  searchQuery.searchTerm = searchTerm;  
  $.post(searchQuery.url, searchQuery)
   .done(function(response) {
    checkTabs(response);
      console.log('Post request was a Success...Here is the response', response)
   });
}

function checkTabs(response){
  console.log('checkTabs', response);
  chrome.tabs.query({active:true}, function(tabs){
    //chrome.tabs.executeScript(null, {file: "./assets/twitter.js"});
    chrome.tabs.sendMessage(tabs[0].id, response);               
  });
}