const package = require("./package.json");
const fs = require("fs");
const fileName = "./docs/index.html";

// delete all browser-*.js files
let content = fs.readdirSync('./docs/');
content.forEach(function(file) {
  if (/^browser-[\d\.]+\.js$/.test(file)) fs.unlinkSync('./docs/'+file);
});
// copy the new one
fs.copyFileSync('./browser.js', './docs/browser-'+package.version+'.js');
// update the html file
fs.readFile(fileName, 'utf8', function(err, content) {
  content = content.replace(/browser-[\d\.]+\.js/, 'browser-'+package.version+'.js');
  fs.writeFile(fileName, content, function(err) {
    if (err) throw err;
    console.log("Documentation updated with last version");
  });
})
