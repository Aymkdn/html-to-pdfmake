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
 * @param  {Object} [options]
 *   @param  {Object} [defaultStyles] An object with the default styles for each elements
 *   @param  {Object} [window] The `window` object (only used for the tests)
 * @return {Object} it returns a PdfMake object
 *
 * @example
 * // Some styles are applied by defaults for the supported HTML elements
 * // but you can pass your own styles if you prefer
 * htmlToPdfMake('<div><h1>My Title</h1><p>My paragraph</p></div>');
 *
 * // If you want to overwrite the default styles, e.g. you want <li> to not have a margin-left, and links to be 'purple' and not 'blue', and links without 'underline'
 * htmlToPdfMake('<ul><li>this is <a href="...">a link</a></li><li>another item</li></ul>', {
 *   defaultStyles:{
 *     a:{
 *       color:'purple',
 *       decoration:null
 *     },
 *     li:null
 *   }
 * });
 */
//var util = require("util"); // to debug
module.exports = function(htmlText, options) {
  var wndw = (options && options.window ? options.window : window);

  // set default styles
  var defaultStyles = {
    b: {bold:true},
    strong: {bold:true},
    u: {decoration:'underline'},
    s: {decoration: 'lineThrough'},
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

  var inlineTags = [ 'p', 'li', 'span', 'strong', 'em', 'b', 'i', 'u', 'th', 'td' ];

  /**
   * Permit to change the default styles based on the options
   * @return {[type]} [description]
   */
  function changeDefaultStyles () {
    for (var keyStyle in options.defaultStyles) {
      if (defaultStyles.hasOwnProperty(keyStyle)) {
        // if we want to remove a default style
        if (options.defaultStyles.hasOwnProperty(keyStyle) && !options.defaultStyles[keyStyle]) {
          delete defaultStyles[keyStyle];
        } else {
          for (var k in options.defaultStyles[keyStyle]) {
            // if we want to delete a specific property
            if (!options.defaultStyles[keyStyle][k]) delete defaultStyles[keyStyle][k];
            else defaultStyles[keyStyle][k] = options.defaultStyles[keyStyle][k];
          }
        }
      }
    }
  }

  if (options && options.defaultStyles) {
    changeDefaultStyles();
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
   * @param parentNode the parent node for the current element
   * @param parents Array of node names of all the parents for the element
   * @returns the doc def to the given element in consideration to the given paragraph and styles
   */
  var parseElement = function(element, parentNode, parents) {
    var nodeName = element.nodeName.toLowerCase();
    var parentNodeName = (parentNode ? parentNode.nodeName.toLowerCase() : '');
    var ret, text, cssClass, dataset, key, dist, isInlineTag, hasStackTags;
    parents = parents || [];

    // check the node type
    switch(element.nodeType) {
      case 3: { // TEXT_NODE
        if (element.textContent) {
          text = element.textContent.replace(/\n(\s+)?/g, "");
          if (text) {
            // if 'text' is just blank and parentNodeName is a TABLE/THEAD/TBODY/TR, then ignore it
            if (/^\s+$/.test(text) && ['table','thead','tbody','tr'].indexOf(parentNodeName) > -1) return ret;

            ret = {'text': text};
            if (parentNodeName) {
              // check if we have inherent styles to apply when a text is inside several <tag>
              applyParentsStyle(ret, element);
              // for links
              if (parentNodeName === "a") {
                ret.link = parentNode.getAttribute("href");
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
        parents.push(nodeName);
        // check children
        // if it's a table cell (TH/TD) with an empty content
        if (element.childNodes.length === 0 && (parents.indexOf('th') > -1 || parents.indexOf('td') > -1)) {
          // if one of the parents is a TH or a TD, then we go up until them to see if all ancestors are empty too
          var ancestor = element;
          var allEmpty = true;
          while (ancestor.nodeName !== "TH" && ancestor.nodeName !== "TD") {
            if (ancestor.textContent !== '') {
              allEmpty=false;
              break;
            }
            ancestor = ancestor.parentNode;
          }
          // if empty, we need to add it
          if (allEmpty) ret.push({text:''});
        }
        else {
          [].forEach.call(element.childNodes, function(child) {
            child = parseElement(child, element, parents);
            if (child) {
              if (Array.isArray(child) && child.length === 1) child=child[0];
              ret.push(child);
            }
          });
          parents.pop();
        }

        if (ret.length===0) ret="";

        // check which kind of tag we have
        switch (nodeName) {
          case "svg": {
            ret = {
              svg: element.outerHTML
            }
            ret.style = ['html-'+nodeName];
            break;
          }
          case "br": {
            // for BR we return '\n'
            ret = '\n';
            break;
          }
          case "hr": {
            // default style for the HR
            var styleHR = {
              width: 514,
              type: "line",
              margin: [0, 12, 0, 12],
              thickness: 0.5,
              color: "#000000",
              left: 0
            };
            if (element.dataset && element.dataset.pdfmake) {
              dataset = JSON.parse(element.dataset.pdfmake);
              for (key in dataset) {
                styleHR[key] = dataset[key];
              }
            }

            ret = {
              margin: styleHR.margin,
              canvas: [
                {
                  type: styleHR.type,
                  x1: styleHR.left,
                  y1: 0,
                  x2: styleHR.width,
                  y2: 0,
                  lineWidth: styleHR.thickness,
                  lineColor: styleHR.color
                }
              ]
            };

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
            setComputedStyle(ret, element);
            break;
          }
          case "table":{
            ret = {"_":ret, table:{body:[]}};
            ret._.forEach(function(re) {
              if (re.stack) {
                var td = [], rowspan = {};
                re.stack.forEach(function(r, indexRow) {
                  var c, cell, i, indexCell;
                  if (r.stack) {
                    // do we have a rowspan to apply from previous rows?
                    if (rowspan[indexRow]) {
                      // insert empty cell due to rowspan
                      rowspan[indexRow].forEach(function(cell) {
                        r.stack.splice(cell.index, 0, {text:'', style: ['html-td', 'html-tr'], colSpan:cell.colspan});
                      });
                    }

                    // insert empty cells due to colspan
                    for (c=0, cell; c<r.stack.length;) {
                      cell = r.stack[c];
                      if (cell.colSpan > 1) {
                        for (i=0; i<cell.colSpan-1; i++) {
                          r.stack.splice(c+1, 0, "")
                        }
                        c += cell.colSpan;
                      } else c++;
                    }

                    // check rowspan for the current row in order to then apply it to the next ones
                    indexCell = 0;
                    r.stack.forEach(function(cell) {
                      if (cell.rowSpan) {
                        for (var i=0; i<cell.rowSpan; i++) {
                          if (!rowspan[indexRow+i]) rowspan[indexRow+i] = [];
                          // we also remember the colSpan for cells with both rowspan and colspan
                          rowspan[indexRow+i].push({index:indexCell, colspan:cell.colSpan||1});
                        }
                      }
                      indexCell += cell.colSpan || 1;
                    });
                    ret.table.body.push(r.stack)
                  } else {
                    td.push(r);
                    // insert empty cells due to colspan
                    if (r.colSpan > 1) {
                      for (i=0; i<r.colSpan-1; i++) {
                        td.push("");
                      }
                    }
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
            setComputedStyle(ret, element);
            // if we have P or DIV in a table cell TD or TH, then we need to add \n
            var insertBreakLine = function(content, prevContent, firstStyleOnly) {
              var breakLine=false, i;
              // if the previous content was not P or DIV, then we need to add a \n too
              if (prevContent && Array.isArray(content.style)) {
                for (i=0; i<content.style.length; i++) {
                  if (firstStyleOnly && i>0) break;
                  if (content.style[i] === 'html-p' || content.style[i] === 'html-div') {
                    breakLine=true;
                    break;
                  }
                  else if (content.style[i] === 'html-td') break;
                }

                if (breakLine) {
                  if (typeof prevContent.text === 'string') {
                    prevContent.text += "\n";
                  }
                  else if (Array.isArray(prevContent.text)) {
                    prevContent.text.push({text:"\n"});
                  }
                } else if (!firstStyleOnly && Array.isArray(prevContent.style)) {
                  for (i=0; i<prevContent.style.length; i++) {
                    if (prevContent.style[i] === 'html-p' || prevContent.style[i] === 'html-div') {
                      breakLine=true;
                      break;
                    }
                    else if (prevContent.style[i] === 'html-td') break;
                  }
                  if (breakLine) {
                    if (typeof prevContent.text === 'string') {
                      prevContent.text += "\n";
                    }
                    else if (Array.isArray(prevContent.text)) {
                      prevContent.text.push({text:"\n"});
                    }
                  }
                }
              }
              if (Array.isArray(content.text)) {
                for (i=0; i<content.text.length; i++) {
                  insertBreakLine(content.text[i], content.text[i-1], true)
                }
              }
            }
            ret.table.body.forEach(function(row) {
              row.forEach(function(cell) {
                if (Array.isArray(cell.text)) {
                  for (var i=0; i<cell.text.length; i++) {
                    insertBreakLine(cell.text[i], cell.text[i-1]);
                  }
                }
              })
            })
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
            setComputedStyle(ret, element);
            break;
          }
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6": {
            // encapsule in a stack
            ret = {stack:[{text:ret}]};
            ret.stack[0].style = ['html-'+nodeName];
            cssClass = element.getAttribute("class");
            if (cssClass) {
              ret.stack[0].style = ret.stack[0].style.concat(cssClass.split(' '));
            }
            // apply default style
            applyDefaultStyle(ret.stack[0], nodeName);
            // check if the element has a "style" attribute
            setComputedStyle(ret.stack[0], element);
            break;
          }
        }
        // add a custom class to let the user customize the element
        if (ret) {
          if (Array.isArray(ret)) {
            // "tr" elements should always contain an array
            if (ret.length === 1 && nodeName !== "tr") {
              ret=ret[0];
              if (typeof ret === "string") ret={text:ret};
              if (ret.text) {
                applyDefaultStyle(ret, nodeName);
                setComputedStyle(ret, element);
              }

              ret.style = (ret.style||[]).concat(['html-'+nodeName]);

              // for TD and TH we want to include the style from TR
              if (nodeName === "td" || nodeName === "th") ret.style.push('html-tr');
            } else {
              isInlineTag = (inlineTags.indexOf(nodeName) > -1);
              hasStackTags = /{"(stack|table|ol|ul|image)"/.test(JSON.stringify(ret));
              // if it's a DIV and only inline tags in its section, then we want to use 'text' instead of 'stack'
              if (nodeName === 'div' && !hasStackTags) ret = {text:ret};
              // if we have an inline tag with stack tags in its section, then we want to use 'stack'
              else if (isInlineTag && hasStackTags) ret = {stack:ret};
              // if it's not an inline tag, then we use 'stack'
              else if (!isInlineTag) ret = {stack:ret};
              // otherwise, for inline tags, we use 'text'
              else ret = {text:ret};

              // we apply the default style for the inline tags
              if (isInlineTag) {
                applyDefaultStyle(ret, nodeName);
              }
              ret.style = ['html-'+nodeName];
            }

            // check if we have inherent styles to apply when a text is inside several <tag>
            applyParentsStyle(ret, element);

            // for 'td' and 'th' we check if we have "rowspan" or "colspan"
            if (nodeName === "td" || nodeName === "th") {
              if (element.getAttribute("rowspan")) ret.rowSpan = element.getAttribute("rowspan")*1;
              if (element.getAttribute("colspan")) ret.colSpan = element.getAttribute("colspan")*1;
            }

            // is there any class to this element?
            cssClass = element.getAttribute("class");
            if (cssClass) {
              ret.style = (ret.style||[]).concat(cssClass.split(' '));
            }

            // check if the element has a "style" attribute
            if (ret.text) {
              setComputedStyle(ret, element);
            }
          } else if (ret.table || ret.ol || ret.ul) { // for TABLE / UL / OL
            ret.style = ['html-'+nodeName];
            // is there any class to this element?
            cssClass = element.getAttribute("class");
            if (cssClass) {
              ret.style = ret.style.concat(cssClass.split(' '));
            }
            // do we have a default style to apply?
            applyDefaultStyle(ret, nodeName);
          }

          if (element.dataset && element.dataset.pdfmake) {
            dataset = JSON.parse(element.dataset.pdfmake);
            dist = ret[nodeName] || ret;
            for (key in dataset) {
              dist[key] = dataset[key];
            }
          }

          // retrieve the class from the parent
          cssClass = element.getAttribute("class");
          if (cssClass && typeof ret === 'object') {
            ret.style = (ret.style || [])
                        .concat(cssClass.split(' '))
          }

          // remove doublon in classes
          if (typeof ret === 'object' && Array.isArray(ret.style)) {
            ret.style = ret.style
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

  var applyParentsStyle = function(ret, node) {
    // while the parents are an inline tag, we want to apply the default style and the class to the children too
    var classes = [], defaultStyles = [], cssClass, cssStyles=[];
    var parentNode=node.parentNode;
    var inlineParentNode=node.parentNode;
    while (inlineParentNode) {
      var defaultStyle = {};
      var inlineParentNodeName=inlineParentNode.nodeName.toLowerCase();
      if (inlineTags.indexOf(inlineParentNodeName) > -1) {
        cssClass = inlineParentNode.getAttribute("class");
        classes = classes.concat(['html-'+inlineParentNodeName], cssClass||[]);
        applyDefaultStyle(defaultStyle, inlineParentNodeName);
        defaultStyles.push(defaultStyle);

        inlineParentNode=inlineParentNode.parentNode;
      } else break;
    }
    ret.style = (ret.style||[]).concat(classes);
    defaultStyles.forEach(function(defaultStyle) {
      for (var key in defaultStyle) {
        if (key.indexOf("margin") === -1 && ret[key] === undefined) ret[key] = defaultStyle[key];
      }
    });
    // all the css 'style' of the parents must be transferred to the children
    while (parentNode.nodeType === 1) {
      cssStyles = cssStyles.concat(computeStyle(parentNode.getAttribute('style'), parentNode));
      parentNode = parentNode.parentNode;
    }
    cssStyles.reverse();
    cssStyles.forEach(function(stl) {
      ret[stl.key] = stl.value;
    })
    if (ret.style.length===0) delete ret.style;
  }

  /**
   * Transform a CSS expression (e.g. 'margin:10px') in the PDFMake version
   *
   * @param {String} style The CSS expression to transform
   * @param {DOMElement} element
   * @returns {Array} array of {key, value}
   */
  var computeStyle = function(style, element) {
    if (!style) return [];
    var styleDefs = style.split(';').map(function(style) { return style.toLowerCase().split(':') });
    var ret = [];
    var borders = []; // special treatment for borders
    var nodeName = element.nodeName.toUpperCase();
    styleDefs.forEach(function(styleDef) {
      if (styleDef.length===2) {
        var key = styleDef[0].trim();
        var value = styleDef[1].trim();
        switch (key) {
          case "margin": {
            value = value.replace(/(\d+)(\.\d+)?([^\d]+)/g,"$1$2 ").trim().split(' ');
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
          case "font-family": {
            ret.push({key:"font", value:value.replace(/"|^'|'$/g,"")});
            break;
          }
          case "color": {
            ret.push({key:"color", value:parseColor(value)})
            break;
          }
          case "background-color": {
            // if TH/TD and key is 'background', then we use 'fillColor' instead
            ret.push({key:(nodeName === 'TD' || nodeName === 'TH' ? "fillColor" : "background"), value:parseColor(value)})
            break;
          }
          default: {
            // for borders
            if (key === 'border' || key.indexOf('border-left') === 0 || key.indexOf('border-top') === 0 || key.indexOf('border-right') === 0 || key.indexOf('border-bottom') === 0) {
              borders.push({key:key, value:value});
            } else {
              if (key.indexOf("-") > -1) key=toCamelCase(key);
              if (value) {
                value = value.replace(/(\d+)(\.\d+)?([^\d]+)/g,"$1$2 ").trim();
                if (!isNaN(value)) value=+value; // turn it into a number
                ret.push({key:key, value:value});
              }
            }
          }
        }
      }
    });
    // for borders
    if (borders.length > 0) {
      // we have to merge together the borders in two properties
      var border = []; // array of boolean
      var borderColor = []; // array of colors
      borders.forEach(function(b) {
        // we have 3 properties: width style color
        var properties = b.value.split(' ');
        var width = properties[0].replace(/(\d+)(\.\d+)?([^\d]+)/g,"$1$2 ").trim();
        var index = -1, i;
        if (b.key.indexOf('-left') > -1) index=0;
        else if (b.key.indexOf('-top') > -1) index=1;
        else if (b.key.indexOf('-right') > -1) index=2;
        else if (b.key.indexOf('-bottom') > -1) index=3;
        // for the width
        if (index > -1) {
          border[index] = (width > 0);
        } else {
          for (i=0; i<4; i++) border[i] = (width > 0);
        }
        // for the color
        if (properties.length > 2) {
          var color = properties.slice(2).join(' ');
          if (index > -1) {
            borderColor[index] = parseColor(color);
          } else {
            for (i=0; i<4; i++) borderColor[i] = parseColor(color);
          }
        }
      });
      // fill the gaps
      for (var i=0; i<4; i++) {
        if (border.length > 0 && typeof border[i] === "undefined") border[i]=true;
        if (borderColor.length > 0 && typeof borderColor[i] === "undefined") borderColor[i]='#000000';
      }
      if (border.length > 0) ret.push({key:'border', value:border});
      if (borderColor.length > 0) ret.push({key:'borderColor', value:borderColor});
    }
    return ret;
  }

  /**
   * Go throught the CSS styles for the element and apply them
   * @param {Object} ret Our pdfmake object
   * @param {DOMElement} element The DOM elemnet
   */
  var setComputedStyle = function(ret, element) {
    var cssStyle = element.getAttribute("style");
    if (cssStyle) {
      cssStyle = computeStyle(cssStyle, element);
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
