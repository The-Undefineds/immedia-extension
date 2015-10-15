var extensionMounted,
    // d3On,
    bodyWidth;    // For storing the width of wiki's displaced body, so
                  // that we can return it back to normal when extension is deactivated
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  extensionMounted = false;
  if(tab.url.match(/wikipedia.org/g)){
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

      if (localStorage['immedia.chrome'] === 'on') {                      // If they previously had the extension activated, when 
        chrome.tabs.executeScript(null, {file: "./src/extension.js"});    // going to a new page the extension will be activated
      }
    }

  chrome.pageAction.show(tab.id);
  }

});

chrome.runtime.onMessage.addListener(function(message, sender){
  var searchTerm = parseUrl(sender.url);
  handleQuery(message, searchTerm);
  bodyWidth = message.bodyWidth;
});

chrome.pageAction.onClicked.addListener(function(tab){
  var d3On = localStorage['immedia.chrome'] || 'off';
  if(d3On === 'off'){
    chrome.tabs.executeScript(null, {file: "./src/extension.js"})
    localStorage['immedia.chrome'] = 'on';
  }
  else{
    chrome.tabs.executeScript(null, {code: "$(\'div\').remove(\'#extension\')"});
    localStorage['immedia.chrome'] = 'off';

    // Resizes and puts body back to original dimensions
    bodyWidth = (bodyWidth + 400).toString() + 'px';
    chrome.tabs.executeScript(null, {code: "$(\'.mediawiki\').css(\'margin-left\',\'0px\')"});
    chrome.tabs.executeScript(null, {code: "$(\'.mediawiki\').css(\'width\',\'" + bodyWidth + "\')"});
  }
  
})

function parseUrl(url){
  var index = url.lastIndexOf('/');
  var resultURL = url.slice(index + 1);
  return resultURL.replace(/_/g, ' ');
}

function handleQuery(searchQuery, searchTerm){
  searchQuery.searchTerm = searchTerm;  
  $.post(searchQuery.url, searchQuery)
    .done(function(response) {
      checkTabs(response);
      console.log('Post request was a Success...Here is the response', response)
   });
}

function checkTabs(response){
  chrome.tabs.query({active:true}, function(tabs){
    //chrome.tabs.executeScript(null, {file: "./assets/twitter.js"});
    chrome.tabs.sendMessage(tabs[0].id, response);               
  });
}