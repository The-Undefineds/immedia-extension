var searchTerm;
var extensionMounted;
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.match(/wikipedia.org/g)){
    //load our dependencies and content scripts
    extensionMounted = false;
    chrome.tabs.executeScript(null, {file: "./assests/jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "./assests/d3.min.js"});
    chrome.tabs.executeScript(null, {file: "./assests/react.js"});
    chrome.tabs.executeScript(null, {file: "./assests/youtube1.js"});
    chrome.tabs.executeScript(null, {file: "./assests/youtube2.js"});
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

    chrome.pageAction.show(tab.id);
    
  }
});

chrome.runtime.onMessage.addListener(function(message, sender){
  handleQuery(message);
});

chrome.pageAction.onClicked.addListener(function(tab){
  if(!extensionMounted){
    chrome.tabs.executeScript(null, {file: "./src/extension.js"})
  }
  else{
    chrome.tabs.executeScript(null, {code: "document.body.removeChild(document.getElementId('extension'))"})
  }
  
  extensionMounted = !extensionMounted;
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
    chrome.tabs.sendMessage(tabs[0].id, response);               
  });
}