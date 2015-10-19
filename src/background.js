var bodyWidth;           // For storing the width of wiki's displaced body, so
                         // that we can return it back to normal when extension is deactivated
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  // Ensures that on reloads, the gate is opened for the extension to load again (the next 'if' statement)
  if(tab.status === 'loading') {
    localStorage['immedia' + tab.id] = 0;     // localStorage used so that we can keep track of the state of different tabs
  }

  if(localStorage['immedia' + tab.id] === '0' && tab.status === 'complete' && tab.url.match(/wikipedia.org\/wiki/g)){
    localStorage['immedia' + tab.id] = 1;
    if(tab.url.indexOf('#') === -1) {  // To prevent these scripts running again when the user redirects themselves within the same entry
      exception = false;
      chrome.tabs.executeScript(id, {file: "./assets/jquery.min.js"});
      chrome.tabs.executeScript(id, {file: "./assets/d3.min.js"});
      chrome.tabs.executeScript(id, {file: "./assets/react.js"});
      chrome.tabs.executeScript(id, {file: "./assets/youtube1.js"});
      chrome.tabs.executeScript(id, {file: "./assets/youtube2.js"});
      chrome.tabs.executeScript(id, {code: "window.twttr = (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};if (d.getElementById(id)) return t;js = d.createElement(s);js.id = id;js.src = '  https://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js, fjs);t._e = [];t.ready = function(f) {t._e.push(f);};return t;}(document, 'script', 'twitter-wjs'));"});
      // chrome.tabs.executeScript(null, {file: "./src/loadmeta.js"}); //used to stop the Twitter error msg
      chrome.tabs.executeScript(id, {file: "./src/treetimeline.js"});
      chrome.tabs.executeScript(id, {file: "./src/preview.js"});
      chrome.tabs.executeScript(id, {file: "./src/emptypreview.js"});
      chrome.tabs.executeScript(id, {file: "./src/nytpreview.js"});
      chrome.tabs.executeScript(id, {file: "./src/twitterpreview.js"});
      chrome.tabs.executeScript(id, {file: "./src/youtubepreview.js"});
    }

    if (localStorage['immedia.chrome'] === 'on') {                     
      chrome.tabs.executeScript(id, {file: "./src/extension.js"});     // If they previously had the extension turned 'on',
    }                                                                    // when going to a new page the extension will load again

    // Renders icon (moved down here so that it doesn't show up before the extension has loaded (if the extension is 'on'))
    chrome.pageAction.show(tab.id);
  }

});

chrome.runtime.onMessage.addListener(function(message, sender){
  var searchTerm = parseUrl(sender.url).replace(/\s\(.*$/,'').toLowerCase();
  if (searchTerm === 'main page') {
    searchTerm = 'immediahomepage';
  }
  handleQuery(message, searchTerm, sender);
  bodyWidth = message.bodyWidth;
});

chrome.pageAction.onClicked.addListener(function(tab){
  var d3On = localStorage['immedia.chrome'] || 'off';
  if(d3On === 'off'){
    chrome.tabs.executeScript(tab.id, {file: "./src/extension.js"})
    localStorage['immedia.chrome'] = 'on';
  }
  else{
    chrome.tabs.executeScript(tab.id, {code: "$(\'div\').remove(\'#extension\')"});
    localStorage['immedia.chrome'] = 'off';

    // Resizes and puts body back to original dimensions
    bodyWidth = (bodyWidth + 400).toString() + 'px';
    chrome.tabs.executeScript(tab.id, {code: "$(\'.mediawiki\').css(\'margin-left\',\'0px\')"});
    chrome.tabs.executeScript(tab.id, {code: "$(\'.mediawiki\').css(\'width\',\'" + bodyWidth + "\')"});
  }
  
})

function parseUrl(url){
  var index = url.lastIndexOf('/');
  var resultURL = url.slice(index + 1);
  resultURL = resultURL.replace(/_/g, ' ');

  var newURL = '';  // For wiki-URL's that have '#' in them 
  for (var i = 0; i < resultURL.length; i++) {
    if (resultURL[i] === '#') {
      i += resultURL.length;
    } else {
      newURL += resultURL[i];
    }
  }
  console.log(newURL);
  return newURL;
}

function handleQuery(searchQuery, searchTerm, sender){
  searchQuery.searchTerm = searchTerm;
  $.post(searchQuery.url, searchQuery)
    .done(function(response) {
      chrome.tabs.sendMessage(sender.tab.id, response);
      console.log('Post request was a Success...Here is the response', response)
   });
}
