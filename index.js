// source: https://github.com/OpenSlides/OpenSlides/blob/f4f8b8422f9b3fbab58e35ac3f8f870d35813b7d/client/src/app/core/ui-services/html-to-pdf.service.ts
// and https://github.com/bpampuch/pdfmake/issues/205

/**
  To use it:
  import htmlToPdfMake from 'html-to-pdfmake.js'
  htmlToPdfMake('<b>my bold text</b>');
*/

/**
 * Transform HTML code to a PdfMake object
 * @param  {String} htmlText The HTML code to transform
 * @param  {Object} [window] The `window` object (only used for the tests)
 * @return {Object} it returns a PdfMake object
 *
 * @example
 * // Some styles are applied by defaults for the supported HTML elements
 * // but you can pass your own styles if you prefer
 * htmlToPdfMake('<div><h1>My Title</h1><p>My paragraph</p></div>')
 */
//var util = require("util"); // to debug
module.exports = function(htmlText, wndw) {
  wndw = wndw || window;

  // set default styles
  var defaultStyles = {
    b: {bold:true},
    strong: {bold:true},
    u: {decoration:'underline'},
    em: {italics:true},
    i: {italics:true},
    h1: {fontSize:24, bold:true, marginBottom:5},
    h2: {fontSize:22, bold:true, marginBottom:5},
    h3: {fontSize:20, bold:true, marginBottom:5},
    h4: {fontSize:18, bold:true, marginBottom:5},
    h5: {fontSize:16, bold:true, marginBottom:5},
    h6: {fontSize:14, bold:true, marginBottom:5},
    a: {color:'blue', decoration:'underline'},
    strike: {decoration: 'lineThrough'},
    p: {margin:[0, 5, 0, 10]},
    ul: {marginBottom:5},
    li: {marginLeft:5},
    table: {marginBottom:5},
    th: {bold:true, fillColor:'#EEEEEE'}
  }

  /**
   * Takes an HTML string, converts to HTML using a DOM parser and recursivly parses
   * the content into pdfmake compatible doc definition
   *
   * @param htmlText the html text to translate as string
   * @returns pdfmake doc definition as object
   */
  var convertHtml = function(htmlText) {
    var docDef = [];

    // Cleanup of dirty html would happen here

    // Create a HTML DOM tree out of html string
    var parser = new wndw.DOMParser();
    var parsedHtml = parser.parseFromString(htmlText, 'text/html');

    // Go thru each child
    [].forEach.call(parsedHtml.body.childNodes, function(child) {
      var ret = parseElement(child);
      if (ret) {
        // to reduce the amount of code
        if (Array.isArray(ret) && ret.length === 1) ret=ret[0];
        //console.log(util.inspect(ret, {showHidden: false, depth: null})); // to debug
        docDef.push(ret);
      }
    });

    return docDef;
  }

  /**
   * Converts a single HTML element to pdfmake, calls itself recursively for child html elements
   *
   * @param element can be an HTML element (<p>) or plain text ("Hello World")
   * @param currentParagraph usually holds the parent element, to allow nested structures
   * @param styles holds the style attributes of HTML elements (`<div style="color: green">...`)
   * @returns the doc def to the given element in consideration to the given paragraph and styles
   */
  var parseElement = function(element, parentNode) {
    var nodeName = element.nodeName.toLowerCase();
    var parentNodeName = (parentNode ? parentNode.nodeName.toLowerCase() : '');
    var ret, text, cssClass;

    // check the node type
    switch(element.nodeType) {
      case 3: { // TEXT_NODE
        if (element.textContent) {
          text = element.textContent.replace(/\n(\s+)?/g, "").trim();
          if (text) {
            ret = {'text': text};
            if (parentNodeName) {
              // do we have a default style to apply?
              // for 'p' we want to apply it from the parent
              if (parentNodeName !== 'p') {
                applyDefaultStyle(ret, parentNodeName);
              }

              // for links
              if (parentNodeName === "a") {
                ret.link = parentNode.getAttribute("href");
              }

              // is there any class to this element?
              cssClass = parentNode.getAttribute("class");
              if (cssClass) {
                ret.style = cssClass.split(' ');
              }

              // check if the element has a "style" attribute
              if (ret.text) {
                setComputedStyle(ret, parentNode.getAttribute("style"));
              }
            } else {
              ret = text;
            }
          }
        }

        return ret;
      }
      case 1: { // ELEMENT_NODE
        ret = [];

        // check children
        [].forEach.call(element.childNodes, function(child) {
          // for THEAD and TBODY we go straight to the TR
          //if (child.nodeName === "THEAD" || child.nodeName === "TBODY" || child.nodeName === "TFOOTER") continue;
          child = parseElement(child, element);
          if (child) {
            if (Array.isArray(child) && child.length === 1) child=child[0];
            ret.push(child);
          }
        });

        if (ret.length===0) ret="";

        // check which kind of tag we have
        switch (nodeName) {
          case "br": {
            // for BR we return '\n'
            ret = '\n';
            break;
          }
          case "ol":
          case "ul": {
            ret = {"_":ret};
            ret[nodeName] = ret._;
            delete ret._;
            // add a custom class to let the user customize the element
            ret.style = ['html-'+nodeName];
            // is there any class to this element?
            cssClass = element.getAttribute("class");
            if (cssClass) {
              ret.style = ret.style.concat(cssClass.split(' '));
            }
            // check if the element has a "style" attribute
            setComputedStyle(ret, element.getAttribute("style"));
            break;
          }
          case "table":{
            ret = {"_":ret, table:{body:[]}};
            ret._.forEach(function(re) {
              if (re.stack) {
                var td = []
                re.stack.forEach(function(r) {
                  if (r.stack) {
                    ret.table.body.push(r.stack)
                  } else {
                    td.push(r);
                  }
                });
                if (td.length>0) ret.table.body.push(td);
              } else {
                // only one row
                ret.table.body.push([re]);
              }
            });
            delete ret._;
            // check if the element has a "style" attribute
            setComputedStyle(ret, element.getAttribute("style"));
            break;
          }
          case "img": {
            ret = {image:element.getAttribute("src")};
            ret.style = ['html-img'];
            cssClass = element.getAttribute("class");
            if (cssClass) {
              ret.style = ret.style.concat(cssClass.split(' '));
            }
            // check if we have 'width' and 'height'
            if (element.getAttribute("width")) {
              ret.width = parseFloat(element.getAttribute("width"))
            }
            if (element.getAttribute("height")) {
              ret.height = parseFloat(element.getAttribute("height"))
            }
            // check if the element has a "style" attribute
            setComputedStyle(ret, element.getAttribute("style"));
            break;
          }
        }
        // add a custom class to let the user customize the element
        if (ret) {
          if (Array.isArray(ret)) {
            // add a custom class to let the user customize the element
              // "tr" elements should always contain an array
            if (ret.length === 1 && nodeName !== "tr") {
              ret=ret[0];
              // check if we have a default css style to apply when a text is inside several <tag>
              // e.g. <strong><em>text</em></strong>
              if (ret.text) {
                applyDefaultStyle(ret, nodeName);
                setComputedStyle(ret, element.getAttribute("style"));
              }
              ret.style = (ret.style||[]).concat(['html-'+nodeName]);
              // for TD and TH we want to include the style from TR
              if (nodeName === "td" || nodeName === "th") ret.style.push('html-tr');
            } else {
              ret = (nodeName==='p' ? {text:ret} : {stack:ret});
              // we apply the default style if it's a "p"
              if (nodeName === 'p') {
                applyDefaultStyle(ret, 'p');
              }
              ret.style = ['html-'+nodeName];
            }
          } else if (ret.table || ret.ol || ret.ul) { // for TABLE / UL / OL
            ret.style = ['html-'+nodeName];
            // is there any class to this element?
            cssClass = element.getAttribute("class");
            if (cssClass) {
              ret.style = ret.style.concat(cssClass.split(' '));
            }
            // do we have a default style to apply?
            applyDefaultStyle(ret, 'table');
          }

          // set class to its children
          cssClass = element.getAttribute("class");
          
          // prevent null or non object
          if (cssClass && typeof ret === 'object') {
            ret.style = (ret.style || [])
              .concat(cssClass.split(' '))
              .filter(function (value, index, self) { 
                return self.indexOf(value) === index;
              });
          }
        }

        return ret;
      }
    }
    return "";
  }

  var applyDefaultStyle = function(ret, nodeName) {
    if (defaultStyles[nodeName]) {
      for (var style in defaultStyles[nodeName]) {
        if (defaultStyles[nodeName].hasOwnProperty(style)) {
          ret[style] = defaultStyles[nodeName][style];
        }
      }
    }
  }

  /**
   * Transform a CSS expression (e.g. 'margin:10px') in the PDFMake version
   *
   * @param {String} style The CSS expression to transform
   * @returns {Array} array of {key, value}
   */
  var computeStyle = function(style) {
    var styleDefs = style.split(';').map(function(style) { return style.replace(/\s/g, '').toLowerCase().split(':') });
    var ret = [];
    styleDefs.forEach(function(styleDef) {
      var key = styleDef[0];
      var value = styleDef[1];
      switch (key) {
        case "margin": {
          value = value.replace(/(\d+)([^\d]+)/g,"$1 ").trim().split(' ');
          // pdfMake uses a different order than CSS
          if (value.length===1) value=+value[0]; // single value
          else if (value.length===2) value=[+value[1], +value[0]]; // vertical | horizontal ==> horizontal | vertical
          else if (value.length===3) value=[+value[1], +value[0], +value[1], +value[2]]; // top | horizontal | bottom ==> left | top | right | bottom
          else if (value.length===4) value=[+value[3], +value[0], +value[1], +value[2]]; // top | right | bottom | left ==> left | top | right | bottom
          ret.push({key:key, value:value});
          break;
        }
        case "text-align": {
          ret.push({key:"alignment", value:value})
          break;
        }
        case "font-weight": {
          if (value === "bold") ret.push({key:"bold", value:true});
          break;
        }
        case "text-decoration": {
          ret.push({key:"decoration", value:toCamelCase(value)})
          break;
        }
        case "font-style": {
          if (value==="italic") ret.push({key:"italics", value:true});
          break;
        }
        case "color": {
          ret.push({key:"color", value:parseColor(value)})
          break;
        }
        case "background-color": {
          ret.push({key:"background", value:parseColor(value)})
          break;
        }
        default: {
          if (key.indexOf("-") > -1) key=toCamelCase(key);
          if (value) {
            value = value.replace(/(\d+)([^\d]+)/g,"$1 ").trim();
            if (!isNaN(value)) value=+value; // turn it into a number
            ret.push({key:key, value:value});
          }
        }
      }
    });
    return ret;
  }

  /**
   * Go throught the CSS styles for the element and apply them
   * @param {Object} ret Our pdfmake object
   * @param {String} cssStyle The CSS style string
   */
  var setComputedStyle = function(ret, cssStyle) {
    if (cssStyle) {
      cssStyle = computeStyle(cssStyle);
      cssStyle.forEach(function(style) {
        ret[style.key] = style.value;
      })
    }
  }

  var toCamelCase = function(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });
  }

  /**
   * Returns the color in a hex format (e.g. #12ff00).
   * Also tries to convert RGB colors into hex values
   *
   * @param color color as string representation
   * @returns color as hex values for pdfmake
   */
  var parseColor = function(color) {
    var haxRegex = new RegExp('^#([0-9a-f]{3}|[0-9a-f]{6})$');

    // e.g. `#fff` or `#ff0048`
    var rgbRegex = new RegExp('^rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)$');

    // e.g. rgb(0,255,34) or rgb(22, 0, 0)
    var nameRegex = new RegExp('^[a-z]+$');

    if (haxRegex.test(color)) {
      return color;
    } else if (rgbRegex.test(color)) {
      var decimalColors = rgbRegex.exec(color).slice(1);
      for (var i = 0; i < 3; i++) {
        var decimalValue = +decimalColors[i];
        if (decimalValue > 255) {
          decimalValue = 255;
        }
        var hexString = '0' + decimalValue.toString(16);
        hexString = hexString.slice(-2);
        decimalColors[i] = hexString;
      }
      return '#' + decimalColors.join('');
    } else if (nameRegex.test(color)) {
      return color;
    } else {
      console.error('Could not parse color "' + color + '"');
      return color;
    }
  }

  return convertHtml(htmlText)
}
