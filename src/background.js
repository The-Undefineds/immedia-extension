chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.match(/wikipedia.org/g)){
    chrome.tabs.executeScript(null, {file: "./assests/jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "./assests/d3.min.js"});
    chrome.tabs.executeScript(null, {file: "./assests/react.js"});
    chrome.tabs.executeScript(null, {file: "./src/treetimeline.js"})
    chrome.tabs.executeScript(null, {file: "./src/preview.js"})
    chrome.tabs.executeScript(null, {file: "./src/emptypreview.js"})


    chrome.pageAction.show(tab.id);
    
  }
});

chrome.pageAction.onClicked.addListener(function(tab){
 
  if(tab.url.match(/wikipedia.org/g)){

    chrome.tabs.executeScript(null, {file: "./src/extension.js"}, function(){
      checkTab();
    })
  }
  
})

function parseUrl(url){
  var resultURL = url.slice(30, url.length)
  return resultURL.replace(/_/g, ' ');
}

function handleQuery(searchQuery, results){
  $.post(searchQuery.url, searchQuery)
   .done(function(response) {
      chrome.tabs.sendMessage(results[0].id, response);
      console.log('Post request was a Success...Here is the response', response)
   }.bind(this));
}

function checkTab(){
  chrome.tabs.query({active: true, currentWindow: true}, function(results){
      console.log('success', results);
      var searchTerm = parseUrl(results[0].url)
      var apis = [
        'nyt',
        // 'twitter',
        'youtube',
        // 'news'
      ];

      for(var i = 0; i <apis.length; i++){
        handleQuery({
          searchTerm: searchTerm,
          url: 'http://immedia.xyz/api/' + apis[i],
          api: apis[i]
        }, results);
      }
  })
} 