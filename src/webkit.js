// rewrites = [
//   [/chrome-extension:\/\/([a-z]+)\.twitter\.com/, 'https://$1.twitter.com'],
//   [/chrome-extension:\/\/([a-z]+)\.twimg\.com/, 'https://$1.twimg.com']
// ];

// document.addEventListener('beforeload', function(e){
//   for (var i = 0, rule; rule = rewrites[i]; i++) {
//     if (rule[0].test(e.url)) {
//       e.preventDefault();
//       e.stopPropagation();
//       e.srcElement.src = e.srcElement.src.replace(rule[0], rule[1]);
//       break;
//     }
//   }
// }, true);

// !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
// You might need to use this hack for the twitter imbed hack