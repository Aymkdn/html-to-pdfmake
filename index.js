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
 *   @param  {Boolean} [tableAutoSize=false] It permits to use the width/height defined in styles for a table's cells and rows
 *   @param  {Object} [window] The `window` object (required for NodeJS server side use)
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
  var tableAutoSize = (options && typeof options.tableAutoSize === "boolean" ? options.tableAutoSize : false);

  // Used with the size attribute on the font elements to calculate relative font size
  var fontSizes = (options && Array.isArray(options.fontSizes) ? options.fontSizes : [10, 14, 16, 18, 20, 24, 28]);

  // set default styles
  var defaultStyles = {
    b: {bold:true},
    strong: {bold:true},
    u: {decoration:'underline'},
    del: {decoration:'lineThrough'},
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
    ul: {marginBottom:5,marginLeft:5},
    table: {marginBottom:5},
    th: {bold:true, fillColor:'#EEEEEE'}
  }

  /**
   * Permit to change the default styles based on the options
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
            if (options.defaultStyles[keyStyle][k] === '') delete defaultStyles[keyStyle][k];
            else defaultStyles[keyStyle][k] = options.defaultStyles[keyStyle][k];
          }
        }
      } else {
        // if we add default styles
        defaultStyles[keyStyle] = {}
        for (var ks in options.defaultStyles[keyStyle]) {
          defaultStyles[keyStyle][ks] = options.defaultStyles[keyStyle][ks];
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
    // Create a HTML DOM tree out of html string
    var parser = new wndw.DOMParser();
    var parsedHtml = parser.parseFromString(htmlText, 'text/html');

    var docDef = parseElement(parsedHtml.body, []);
    // remove first level
    return  docDef.stack || docDef.text;
  }

  /**
   * Converts a single HTML element to pdfmake, calls itself recursively for child html elements
   *
   * @param element can be an HTML element (<p>) or plain text ("Hello World")
   * @param parentNode the parent node for the current element
   * @param parents Array of node names of all the parents for the element
   * @returns the doc def to the given element in consideration to the given paragraph and styles
   */
  var parseElement = function(element, parents) {
    var nodeName = element.nodeName.toUpperCase();
    var nodeNameLowerCase = nodeName.toLowerCase();
    var ret = {text:[]};
    var text, needStack=false;
    var dataset, i, key;

    // ignore some HTML tags
    if (['COLGROUP','COL'].indexOf(nodeName) > -1) return '';

    switch(element.nodeType) {
      case 3: { // TEXT_NODE
        if (element.textContent) {
          text = element.textContent;
          // check if we have 'white-space' in the parent's style
          var styleParentTextNode = parseStyle(parents[parents.length-1], true);
          var hasWhiteSpace = false;
          for (i=0; i<styleParentTextNode.length; i++) {
            if (styleParentTextNode[i].key === "preserveLeadingSpaces") {
              hasWhiteSpace=styleParentTextNode[i].value;
              break;
            }
          }
          // if no 'white-space' style, then remove blanks
          if (!hasWhiteSpace) text = element.textContent.replace(/\n(\s+)?/g, "");
          if (options && typeof options.replaceText === "function") text = options.replaceText(text, parents);

          // for table, thead, tbody, tfoot, tr, ul, ol: remove all empty space
          if (['TABLE','THEAD','TBODY','TFOOT','TR','UL','OL'].indexOf(parents[parents.length-1].nodeName) > -1) text = text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
          if (text) {
            ret = {'text':text};
            ret = applyStyle({ret:ret, parents:parents});
            return ret;
          }
        }

        return '';
      }
      case 1: { // ELEMENT_NODE
        ret.nodeName = nodeName;
        parents.push(element);
        if (element.childNodes && element.childNodes.length>0) {
          [].forEach.call(element.childNodes, function(child) {
            var res = parseElement(child, parents);
            if (res) {
              if (Array.isArray(res.text) && res.text.length===0) res.text='';
              ret.text.push(res);
            }
          });
          //console.log(nodeName,'=>',util.inspect(ret.text, {showHidden: false, depth: null})); // to debug
          // find if we need a 'stack' instead of a 'text'
          needStack = searchForStack(ret);
          if (needStack) {
            ret.stack = ret.text.slice(0);
            delete ret.text;
          } else {
            // apply all the inhirent classes and styles from the parents
            ret = applyStyle({ret:ret, parents:parents});
          }
        }
        parents.pop();

        switch(nodeName) {
          case "TABLE":{
            var rowIndex, cellIndex;
            // the format for the table is table.body[[], [], …]
            ret.table = {body:[]};
            var tbodies = (ret.stack || ret.text);
            if (Array.isArray(tbodies)) {
              rowIndex = 0;
              // Array with All Rows including THEAD
              var allRows = [];
              // for each THEAD / TBODY
              tbodies.forEach(function(tbody) {
                // for each row
                var rows = (tbody.stack || tbody.text);
                if (Array.isArray(rows)) {
                  // Add rows to allRows
                  allRows = allRows.concat(rows);
                  rows.forEach(function(row) {
                    var cells = (row.stack || row.text);
                    // for each cell
                    if (Array.isArray(cells)) {
                      cellIndex = 0;
                      ret.table.body[rowIndex] = [];
                      cells.forEach(function(cell) {
                        ret.table.body[rowIndex].push(cell);

                        // do we have a colSpan?
                        // if yes, insert empty cells due to colspan
                        if (cell.colSpan) {
                          i = cell.colSpan;
                          // do we have a rowSpan in addition of the colSpan?
                          setRowSpan({rows:allRows, cell:cell, rowIndex:rowIndex, cellIndex:cellIndex});
                          while (--i > 0) {
                            ret.table.body[rowIndex].push({text:''});
                            // keep adding empty cell due to rowspan
                            setRowSpan({rows:allRows, cell:cell, rowIndex:rowIndex, cellIndex:cellIndex});
                            cellIndex++;
                          }
                        } else {
                          // do we have a rowSpan ?
                          setRowSpan({rows:allRows, cell:cell, rowIndex:rowIndex, cellIndex:cellIndex});
                        }

                        cellIndex++;
                      });
                      rowIndex++;
                    }
                 });
                }
              });
            }

            delete ret.stack;
            delete ret.text;
            // apply all the inhirent classes and styles from the parents, or for the current element
            ret = applyStyle({ret:ret, parents:parents.concat([element])});

            // if option tableAutoSize, then we try to apply the correct width/height on the table
            if (tableAutoSize) {
              var cellsWidths = [];
              var cellsHeights = [];
              var tableWidths = [];
              var tableHeights = [];

              ret.table.body.forEach(function(row, rowIndex) {
                cellsWidths.push([]);
                cellsHeights.push([]);
                row.forEach(function(cell) {
                  // we want to remember the different sizes
                  var width = typeof cell.width !== 'undefined' ? cell.width : 'auto';
                  var height = typeof cell.height !== 'undefined' ? cell.height : 'auto';
                  // check if we have colspan or rowspan
                  // if yes, and if width/height is a number, we divide by the col/rowspan, otherwise we use 'auto'
                  if (width !== 'auto' && cell.colSpan) {
                    if (!isNaN(width)) width /= cell.colSpan;
                    else width = 'auto';
                  }
                  if (height !== 'auto' && cell.rowSpan) {
                    if (!isNaN(height)) height /= cell.colSpan;
                    else height = 'auto';
                  }
                  cellsWidths[rowIndex].push(width);
                  cellsHeights[rowIndex].push(height);
                });
              });

              // determine the max width for each cell
              cellsWidths.forEach(function(row) {
                row.forEach(function(cellWidth, cellIndex) {
                  var type = typeof tableWidths[cellIndex];
                  if (type === "undefined" || (cellWidth !== 'auto' && type === "number" && cellWidth > tableWidths[cellIndex]) || (cellWidth !== 'auto' && tableWidths[cellIndex] === 'auto')) {
                    tableWidths[cellIndex] = cellWidth;
                  }
                });
              });
              // determine the max height for each row
              cellsHeights.forEach(function(row, rowIndex) {
                row.forEach(function(cellHeight) {
                  var type = typeof tableHeights[rowIndex];
                  if (type === "undefined" || (cellHeight !== 'auto' && type === "number" && cellHeight > tableHeights[rowIndex]) || (cellHeight !== 'auto' && tableHeights[rowIndex] === 'auto')) {
                    tableHeights[rowIndex] = cellHeight;
                  }
                });
              });
              if (tableWidths.length > 0) ret.table.widths = tableWidths;
              if (tableHeights.length > 0) ret.table.heights = tableHeights;
            }

            // check if we have some data-pdfmake to apply
            if (element.dataset && element.dataset.pdfmake) {
              dataset = JSON.parse(element.dataset.pdfmake);
              for (key in dataset) {
                if (key === "layout") {
                  ret.layout = dataset[key];
                } else {
                  ret.table[key] = dataset[key];
                }
              }
            }
            break;
          }
          case "TH":
          case "TD":{
            if (element.getAttribute("rowspan")) ret.rowSpan = element.getAttribute("rowspan")*1;
            if (element.getAttribute("colspan")) ret.colSpan = element.getAttribute("colspan")*1;
            // apply all the inhirent classes and styles from the parents, or for the current element
            ret = applyStyle({ret:ret, parents:parents.concat([element])});
            break;
          }
          case "SVG": {
            ret = {
              svg:element.outerHTML.replace(/\n(\s+)?/g, ""),
              nodeName:'SVG',
              style:['html-svg']
            }
            break;
          }
          case "BR": {
            // for BR we return '\n'
            ret.text = [{text:'\n'}];
            break;
          }
          case "SUB":
          case "SUP": {
            ret[nodeName.toLowerCase()] = { offset: '30%', fontSize: 8 };
            break;
          }
          case "HR": {
            // default style for the HR
            var styleHR = {
              width: 514,
              type: "line",
              margin: [0, 12, 0, 12],
              thickness: 0.5,
              color: "#000000",
              left: 0
            };
            // we can override the default HR style with "data-pdfmake"
            if (element.dataset && element.dataset.pdfmake) {
              dataset = JSON.parse(element.dataset.pdfmake);
              for (key in dataset) {
                styleHR[key] = dataset[key];
              }
            }

            ret.margin = styleHR.margin;
            ret.canvas = [
              {
                type: styleHR.type,
                x1: styleHR.left,
                y1: 0,
                x2: styleHR.width,
                y2: 0,
                lineWidth: styleHR.thickness,
                lineColor: styleHR.color
              }
            ];
            delete ret.text;

            break;
          }
          case "OL":
          case "UL": {
            ret[nodeNameLowerCase] = (ret.stack || ret.text).slice(0);
            delete ret.stack;
            delete ret.text;
            // apply all the inhirent classes and styles from the parents, or for the current element
            ret = applyStyle({ret:ret, parents:parents.concat([element])});
            // check if we have `list-style-type` or `list-style`
            if (ret.listStyle || ret.listStyleType) ret.type = ret.listStyle || ret.listStyleType;
            break;
          }
          case "IMG": {
            ret.image = element.getAttribute("src");
            delete ret.stack;
            delete ret.text;
            // apply all the inhirent classes and styles from the parents, or for the current element
            ret = applyStyle({ret:ret, parents:parents.concat([element])});
            break;
          }
          case "A": {
            ret.link = element.getAttribute("href");
            break;
          }
          case "FONT": {
            if (element.getAttribute("color")) {
              ret.color = parseColor(element.getAttribute("color"));
            }
            // Checking if the element has a size attribute
            if (element.getAttribute("size")) {
              // Getting and sanitizing the size value – it should be included between 1 and 7
              var size = Math.min(Math.max(1, parseInt(element.getAttribute("size"))), 7);

              // Getting the relative fontsize
              var fontSize = Math.max(fontSizes[0], fontSizes[size - 1]);

              // Assigning the font size
              ret.fontSize = fontSize;
            }

            // Applying inherited styles
            ret = applyStyle({
              ret: ret,
              parents: parents.concat([element]),
            });
            break;
          }
        }
        if (Array.isArray(ret.text) && ret.text.length === 1 && ret.text[0].text && !ret.text[0].nodeName) {
          ret.text = ret.text[0].text;
        }

        // chekck if we have some data-pdfmake to apply
        if (['HR','TABLE'].indexOf(nodeName) === -1 && element.dataset && element.dataset.pdfmake) {
          dataset = JSON.parse(element.dataset.pdfmake);
          for (key in dataset) {
            ret[key] = dataset[key];
          }
        }

        return ret;
      }
    }
  }

  var searchForStack = function(ret) {
    if (Array.isArray(ret.text)) {
      for (var i=0; i<ret.text.length; i++) {
        if (ret.text[i].stack || ['P','DIV','TABLE','SVG','UL','OL','IMG','H1','H2','H3','H4','H5','H6'].indexOf(ret.text[i].nodeName) > -1) return true;
        if (searchForStack(ret.text[i]) === true) return true;
      }
    }
    return false;
  }

  /**
   * Add empty cells due to rowspan
   *
   * @param {Object} params
   *   @param {Array} rows
   *   @param {Object} cell
   *   @param {Number} rowIndex Current row index
   *   @param {Number} cellIndex Current cell index
   */
  var setRowSpan = function(params) {
    var cells;
    if (params.cell.rowSpan) {
      for (var i=1; i <= params.cell.rowSpan-1; i++) {
        cells = (params.rows[params.rowIndex+i].text || params.rows[params.rowIndex+i].stack);
        cells.splice(params.cellIndex, 0, {text:''});
      }
    }
  }

  /**
   * Apply style and classes from all the parents
   *
   * @param  {Object} params
   *   @param {Object} ret The object that will receive the 'style' and other properties
   *   @param {Array} parents Array of node elements
   * @return {Object} the modified 'ret'
   */
  var applyStyle = function(params) {
    var cssClass = [];
    var lastIndex = params.parents.length-1;
    params.parents.forEach(function(parent, parentIndex) {
      // classes
      var parentNodeName = parent.nodeName.toLowerCase();
      var htmlClass = 'html-' + parentNodeName;
      if (htmlClass !== 'html-body' && cssClass.indexOf(htmlClass) === -1) cssClass.unshift(htmlClass);
      var parentClass = (parent.getAttribute("class")||"").split(' ');
      parentClass.forEach(function(p) {
        if (p) cssClass.push(p);
      });
      // styles
      var style;
      // not all the CSS properties should be inhirent
      var ignoreNonDescendentProperties = (parentIndex!==lastIndex);
      // 1) the default styles
      if (defaultStyles[parentNodeName]) {
        for (style in defaultStyles[parentNodeName]) {
          if (defaultStyles[parentNodeName].hasOwnProperty(style)) {
            if (!ignoreNonDescendentProperties ||
                (ignoreNonDescendentProperties &&
                  style.indexOf('margin') === -1 &&
                  style.indexOf('border') === -1
                )
               ) {
              // 'decoration' can be an array
              if (style === 'decoration') {
                if (!Array.isArray(params.ret[style])) params.ret[style]=[];
                params.ret[style].push(defaultStyles[parentNodeName][style]);
              } else {
                params.ret[style] = defaultStyles[parentNodeName][style];
              }
            }
          }
        }
      }
      // 2) element's style
      // we want TD/TH to receive descendent properties from TR
      if (parentNodeName === 'tr') ignoreNonDescendentProperties=false;
      style = parseStyle(parent, ignoreNonDescendentProperties);
      style.forEach(function(stl) {
        // 'decoration' can be an array
        if (stl.key === "decoration") {
          if (!Array.isArray(params.ret[stl.key])) params.ret[stl.key]=[];
          params.ret[stl.key].push(stl.value);
        } else {
          params.ret[stl.key] = stl.value;
        }
      });
    });
    params.ret.style = cssClass;
    return params.ret;
  }

  /**
   * Transform a CSS expression (e.g. 'margin:10px') in the PDFMake version
   *
   * @param {String} style The CSS expression to transform
   * @param {DOMElement} element
   * @param {Boolean} ignoreProperties TRUE when we have to ignore some properties, like border, padding, margin
   * @returns {Array} array of {key, value}
   */
  var parseStyle = function(element, ignoreProperties) {
    var style = element.getAttribute("style") || "";
    style = style.split(';');
    // check if we have "width" or "height"
    if (element.getAttribute("width")) {
      style.unshift("width:" + element.getAttribute("width") + "px");
    }
    if (element.getAttribute("height")) {
      style.unshift("height:" + element.getAttribute("height") + "px");
    }
    var styleDefs = style.map(function(style) { return style.toLowerCase().split(':') });
    var ret = [];
    var borders = []; // special treatment for borders
    var nodeName = element.nodeName.toUpperCase();
    styleDefs.forEach(function(styleDef) {
      if (styleDef.length===2) {
        var key = styleDef[0].trim();
        var value = styleDef[1].trim();
        switch (key) {
          case "margin": {
            if (ignoreProperties) break;
            // pdfMake uses a different order than CSS
            value = value.split(' ');
            if (value.length===1) value=[value[0], value[0], value[0], value[0]];
            else if (value.length===2) value=[value[1], value[0]]; // vertical | horizontal ==> horizontal | vertical
            else if (value.length===3) value=[value[1], value[0], value[1], value[2]]; // top | horizontal | bottom ==> left | top | right | bottom
            else if (value.length===4) value=[value[3], value[0], value[1], value[2]]; // top | right | bottom | left ==> left | top | right | bottom

            // we now need to convert to PT
            value.forEach(function(val, i) {
              value[i] = convertToUnit(val);
            });
            // ignore if we have a FALSE in the table
            if (value.indexOf(false) === -1) ret.push({key:key, value:value});
            break;
          }
          case "text-align": {
            ret.push({key:"alignment", value:value});
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
            ret.push({key:"font", value:value.split(',')[0].replace(/"|^'|^\s*|\s*$|'$/g,"").replace(/^([a-z])/g, function (g) { return g[0].toUpperCase() }).replace(/ ([a-z])/g, function (g) { return g[1].toUpperCase() })});
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
          case "text-indent": {
            ret.push({key:"leadingIndent", value:convertToUnit(value)});
            break;
          }
          case "white-space": {
            ret.push({key:"preserveLeadingSpaces", value:(value==='break-spaces' || value.slice(0,3) === 'pre')});
            break;
          }
          default: {
            // for borders
            if (key === 'border' || key.indexOf('border-left') === 0 || key.indexOf('border-top') === 0 || key.indexOf('border-right') === 0 || key.indexOf('border-bottom') === 0) {
              if (!ignoreProperties) borders.push({key:key, value:value});
            } else {
              // ignore some properties
              if (ignoreProperties && (key.indexOf("margin-") === 0 || key === 'width' || key === 'height')) break;
              // padding is not supported by PDFMake
              if (key.indexOf("padding") === 0) break;
              if (key.indexOf("-") > -1) key=toCamelCase(key);
              if (value) {
                // convert value to a 'pt' when possible
                var parsedValue = convertToUnit(value);
                ret.push({key:key, value:(parsedValue === false ? value : parsedValue)});
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
      return (color === "transparent" ? "white" : color);
    } else {
      console.error('Could not parse color "' + color + '"');
      return color;
    }
  }

  /**
   * Convert 'px'/'rem'/'cm' to 'pt', and return false for the other ones. If it's only a number, it will just return it
   *
   * @param  {String} val The value with units (e.g. 12px)
   * @return {Number|Boolean} Return the pt value, or false
   */
  var convertToUnit = function(val) {
    // if it's just a number, then return it
    if (!isNaN(parseFloat(val)) && isFinite(val)) return val*1;
    var mtch = (val+"").trim().match(/^(\d+(\.\d+)?)(pt|px|rem|cm)$/);
    // if we don't have a number with supported units, then return false
    if (!mtch) return false;
    val = mtch[1];
    switch(mtch[3]) {
      case 'px':{
        val = Math.round(val * 0.75292857248934); // 1px => 0.75292857248934pt
        break;
      }
      case 'rem':{
        val *= 12; // default font-size is 12pt
        break;
      }
      case 'cm':{
        val = Math.round(val * 28.34646); // 1cm => 28.34646
        break;
      }
    }
    return val*1;
  }

  return convertHtml(htmlText)
}
