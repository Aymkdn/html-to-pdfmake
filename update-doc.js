const package = require("./package.json");
const fs = require("fs");
const fileName = "./docs/index.html";

fs.readFile(fileName, 'utf8', function(err, content) {
  content = content.replace(/html-to-pdfmake@[\d\.]+\/browser\.js/, 'html-to-pdfmake@'+package.version+'/browser.js');
  fs.writeFile(fileName, content, function(err) {
    if (err) throw err;
    console.log("Documentation updated with last version");
  });
})
