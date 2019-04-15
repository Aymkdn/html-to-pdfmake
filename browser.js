(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// source: https://github.com/OpenSlides/OpenSlides/blob/f4f8b8422f9b3fbab58e35ac3f8f870d35813b7d/client/src/app/core/ui-services/html-to-pdf.service.ts
// and https://github.com/bpampuch/pdfmake/issues/205

/**
  To use it:
  import htmlToPdfMake from 'html-to-pdfmake.js'
  htmlToPdfMake('<b>my bold text</b>');
*/

var LineNumberingMode = {
  None: 'none',
  Inside: 'inline',
  Outside: 'outside'
}

module.exports = function(htmlText, lnMode) {
  // holds the desired line number mode
  var lineNumberingMode = LineNumberingMode.None;

  // Space between list elements
  var LI_MARGIN_BOTTOM = 0;

  // Normal line height for paragraphs
  var LINE_HEIGHT = 1;

  // space above paragraphs
  var P_MARGIN_TOP = 6.0;

  // space below paragraphs
  var P_MARGIN_BOTTOM = 0;

  // Space above H
  var H_MARGIN_TOP = 10.0;

  // Conversion of HTML tags into pdfmake directives
  var elementStyles = {
    // should be the same for most HTML code
    b: ['font-weight:bold'],
    strong: ['font-weight:bold'],
    u: ['text-decoration:underline'],
    em: ['font-style:italic'],
    i: ['font-style:italic'],
    h1: ['font-size:14', 'font-weight:bold'],
    h2: ['font-size:12', 'font-weight:bold'],
    h3: ['font-size:10', 'font-weight:bold'],
    h4: ['font-size:10', 'font-style:italic'],
    h5: ['font-size:10'],
    h6: ['font-size:10'],
    a: ['color:blue', 'text-decoration:underline'],
    strike: ['text-decoration:line-through'],
    // Pretty specific stuff that might be excluded for other projects than OpenSlides
    del: ['color:red', 'text-decoration:line-through'],
    ins: ['color:green', 'text-decoration:underline']
  };

  /**
   * Treatment of required CSS-Classes
   * Checking CSS is not possible
   */
  var classStyles = {
    delete: ['color:red', 'text-decoration:line-through'],
    insert: ['color:green', 'text-decoration:underline'],
    paragraphcontext: ['color:grey']
  };


  /**
   * Determine the ideal top margin for a given node
   *
   * @param nodeName the node to parse
   * @returns the margin tip as number
   */
  var getMarginTop = function(nodeName) {
    switch (nodeName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        return H_MARGIN_TOP;
      }
      case 'p': {
        return P_MARGIN_TOP;
      }
      default: {
        return 0;
      }
    }
  }

  /**
   * Determine the ideal margin for a given node
   *
   * @param nodeName the node to parse
   * @returns the margin bottom as number
   */
  var getMarginBottom = function(nodeName) {
    switch (nodeName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        return P_MARGIN_BOTTOM;
      }
      case 'li': {
        return LI_MARGIN_BOTTOM;
      }
      default: {
        return P_MARGIN_BOTTOM;
      }
    }
  }

  /**
   * Takes an HTML string, converts to HTML using a DOM parser and recursivly parses
   * the content into pdfmake compatible doc definition
   *
   * @param htmlText the html text to translate as string
   * @param lnMode determines the line numbering
   * @returns pdfmake doc definition as object
   */
  var convertHtml = function(htmlText, lnMode) {
    var docDef = [];
    lineNumberingMode = lnMode || LineNumberingMode.None;

    // Cleanup of dirty html would happen here

    // Create a HTML DOM tree out of html string
    var parser = new DOMParser();
    var parsedHtml = parser.parseFromString(htmlText, 'text/html');
    // Go thru each child
    [].forEach.call(parsedHtml.body.childNodes, function(child) {
      var parsedElement = parseElement(child);
      docDef.push(parsedElement);
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
  var parseElement = function(element, styles) {
    var nodeName = element.nodeName.toLowerCase();
    var classes = [];
    var newParagraph={}, k;

    // extract explicit style information
    styles = styles || [];

    // to leave out plain text elements
    if (element.getAttribute) {
      var nodeStyle = element.getAttribute('style');
      var nodeClass = element.getAttribute('class');

      // add styles like `color:#ff00ff` content into styles array
      if (nodeStyle) {
        styles = nodeStyle
          .split(';')
          .map(function(style) { return style.replace(/\s/g, '') })
          .concat(styles);
      }

      // Handle CSS classes
      if (nodeClass) {
        classes = nodeClass.toLowerCase().split(' ');

        for (var cssClass of classes) {
          if (classStyles[cssClass]) {
            classStyles[cssClass].forEach(function(style) {
              styles.push(style);
            });
          }
        }
      }
    }

    switch (nodeName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'li':
      case 'p':
      case 'div': {
        var children = parseChildren(element, styles);

        // this introduces a bug with rendering sub-lists in PDF
        if (
          lineNumberingMode === LineNumberingMode.Outside &&
          !isInsideAList(element) &&
          classes.indexOf('insert')===-1
        ) {
          newParagraph = create('stack');
          newParagraph.stack = children;
        } else {
          newParagraph = create('text');
          newParagraph.text = children;
        }

        newParagraph.margin = [0, 0, 0, 0];

        // determine the "normal" top and button margins
        newParagraph.margin[1] = getMarginTop(nodeName);
        newParagraph.margin[3] = getMarginBottom(nodeName);

        if (lineNumberingMode === LineNumberingMode.Outside) {
          // that is usually the case for inserted change which should appear
          // under a set of line numbers with correct alignment
          if (classes.indexOf('insert')!==-1) {
            newParagraph.margin[0] = 20;
            newParagraph.margin[3] = P_MARGIN_BOTTOM;
          }
        }

        // stop enumeration if the list was inserted
        if (classes.indexOf('os-split-before')!==-1) {
          newParagraph.listType = 'none';
        }

        // if the list ends (usually due to a new insert cr) prevent margins
        if (classes.indexOf('os-split-after')!==-1) {
          newParagraph.margin[3] = 0;
        }

        newParagraph.lineHeight = LINE_HEIGHT;

        var computedStyles = computeStyle(styles);
        var nodeStyles = computeStyle(elementStyles[nodeName]);
        for (k in computedStyles) {
          if (computedStyles.hasOwnProperty(k)) {
            newParagraph[k] = computedStyles[k];
          }
        }
        for (k in nodeStyles) {
          if (nodeStyles.hasOwnProperty(k)) {
            newParagraph[k] = nodeStyles[k];
          }
        }
        break;
      }
      case 'a':
      case 'b':
      case 'strong':
      case 'u':
      case 'em':
      case 'i':
      case 'ins':
      case 'del':
      case 'strike': {
        var children = parseChildren(element, styles.concat(elementStyles[nodeName]));
        newParagraph = create('text');
        newParagraph.text = children;
        break;
      }
      case 'span': {
        // Line numbering feature, will prevent compatibility to most other projects
        if (element.getAttribute('data-line-number') && !isInsideAList(element)) {
          if (lineNumberingMode === LineNumberingMode.Inside) {
            // TODO: algorithm for "inline" line numbers is not yet implemented
          } else if (lineNumberingMode === LineNumberingMode.Outside) {
            var currentLineNumber = element.getAttribute('data-line-number');
            newParagraph = {
              columns: [
                // the line number column
                getLineNumberObject({
                  lineNumber: +currentLineNumber
                }), {
                  text: []
                }
              ]
            };
          }
        } else {
          var children = parseChildren(element, styles);
          var crt = create('text');
          var computedStyles = computeStyle(styles);
          for (k in crt) {
            if (crt.hasOwnProperty(k)) {
              newParagraph[k] = crt[k];
            }
          }
          for (k in computedStyles) {
            if (computedStyles.hasOwnProperty(k)) {
              newParagraph[k] = computedStyles[k];
            }
          }

          newParagraph.text = children;
        }
        break;
      }
      case 'br': {
        if (lineNumberingMode === LineNumberingMode.None && classes.includes('os-line-break')) {
          break;
        } else {
          newParagraph = create('text');
          // yep thats all
          newParagraph.text = '\n';
          newParagraph.lineHeight = LINE_HEIGHT;
        }
        break;
      }
      case 'ul':
      case 'ol': {
        var list = create(nodeName);

        // keep the numbers of the ol list
        if (nodeName === 'ol') {
          var start = element.getAttribute('start');
          if (start) {
            list.start = +start;
          }
        }

        // in case of line numbers and only of the list is not nested in another list.
        if (lineNumberingMode === LineNumberingMode.Outside && !isInsideAList(element)) {
          var lines = extractLineNumbers(element);

          var cleanedChildDom = cleanLineNumbers(element);
          var cleanedChildren = parseChildren(cleanedChildDom, styles);

          if (lines.length > 0) {
            var listCol = {
              columns: [{
                width: 20,
                stack: []
              }],
              margin: [0, 0, 0, 0]
            };

            // This has the effect that changed complex lists will look good with line numbers,
            // but simple lists will be too close. The information in the HTML is highly redundant and
            // there is currently no clear way to determine what to do with the lists.
            if (classes.includes('os-split-after')) {
              listCol.margin[3] = -LI_MARGIN_BOTTOM;
            }

            for (var line of lines) {
              listCol.columns[0].stack.push(getLineNumberObject(line));
            }

            list[nodeName] = cleanedChildren;
            listCol.columns.push(list);
            newParagraph = listCol;
          } else {
            // that is usually the case for "inserted" lists during change recomendations
            list.margin = [20, 0, 0, 0];
            newParagraph = list;
            newParagraph[nodeName] = cleanedChildren;
          }
        } else {
          var children = parseChildren(element, styles);
          newParagraph = list;
          newParagraph[nodeName] = children;
        }
        break;
      }
      default: {
        var crt = create('text', element.textContent.replace(/\n/g, ''));
        var computedStyles = computeStyle(styles);
        for (k in crt) {
          if (crt.hasOwnProperty(k)) {
            newParagraph[k] = crt[k];
          }
        }
        for (k in computedStyles) {
          if (computedStyles.hasOwnProperty(k)) {
            newParagraph[k] = computedStyles[k];
          }
        }
        break;
      }
    }
    return newParagraph;
  }

  /**
   * Helper routine to parse an elements children and return the children as parsed pdfmake doc string
   *
   * @param element the parent element to parse
   * @param currentParagraph the context of the element
   * @param styles the styles array, usually just to parse back into the `parseElement` function
   * @returns an array of parsed children
   */
  var parseChildren = function(element, styles) {
    var childNodes = [].slice.call(element.childNodes, 0);
    var paragraph = [];
    var childNodesLen = childNodes.length;
    if (childNodesLen > 0) {
      for (var i=0; i<childNodesLen; i++) {
        var child=childNodes[i];
        // skip empty child nodes
        if (!(child.nodeName === '#text' && child.textContent.trim() === '')) {
          var parsedElement = parseElement(child, styles);
          var firstChild = element.firstChild;

          if (
            // add the line number column
            lineNumberingMode === LineNumberingMode.Outside &&
            child &&
            child.classList &&
            child.classList.contains('os-line-number')
          ) {
            paragraph.push(parsedElement);
          } else if (
            // if the first child of the parsed element is line number
            lineNumberingMode === LineNumberingMode.Outside &&
            firstChild &&
            firstChild.classList &&
            firstChild.classList.contains('os-line-number')
          ) {
            var currentLine = paragraph.pop();
            // push the parsed element into the "text" array
            currentLine.columns[1].text.push(parsedElement);
            paragraph.push(currentLine);
          } else {
            paragraph.push(parsedElement);
          }
        }
      }
    }
    return paragraph;
  }

  /**
   * Helper function to make a line-number object
   *
   * @param line and object in the shape: { lineNumber: X }
   * @returns line number as pdfmake-object
   */
  var getLineNumberObject = function(line) {
    return {
      width: 20,
      text: [{
        // Add a blank with the normal font size here, so in rare cases the text
        // is rendered on the next page and the line number on the previous page.
        text: ' ',
        fontSize: 10,
        decoration: ''
      }, {
        text: line.lineNumber,
        color: 'gray',
        fontSize: 8
      }],
      marginBottom: line.marginBottom,
      lineHeight: LINE_HEIGHT
    };
  }

  /**
   * Cleans the elements children from line-number spans
   *
   * @param element a html dom tree
   * @returns a DOM element without line number spans
   */
  var cleanLineNumbers = function(element) {
    var elementCopy = element.cloneNode(true);
    var children = elementCopy.childNodes;

    // using for-of did not work as expected
    for (var i = 0; i < children.length; i++) {
      if (getLineNumber(children[i])) {
        children[i].remove();
      }

      if (children[i].childNodes.length > 0) {
        var cleanChildren = cleanLineNumbers(children[i]);
        elementCopy.replaceChild(cleanChildren, children[i]);
      }
    }

    return elementCopy;
  }

  /**
   * Helper function to extract line numbers from child elements
   *
   * TODO: Cleanup
   *
   * @param element element to check for containing line numbers (usually a list)
   * @returns a list with the line numbers
   */
  var extractLineNumbers = function(element) {
    var foundLineNumbers = [];
    var lineNumber = getLineNumber(element);
    if (lineNumber) {
      foundLineNumbers.push({
        lineNumber: lineNumber
      });
    } else if (element.nodeName === 'BR') {
      // Check if there is a new line, but it does not get a line number.
      // If so, insert a dummy line, so the line numbers stays aligned with
      // the text.
      if (!getLineNumber(element.nextSibling)) {
        foundLineNumbers.push({
          lineNumber: ''
        });
      }
    } else {
      var children = [].slice.call(element.childNodes, 0);
      var childrenLength = children.length;
      var childrenLineNumbers = [];
      for (var i = 0; i < children.length; i++) {
        childrenLineNumbers = childrenLineNumbers.concat(extractLineNumbers(children[i]));
        if (children.length < childrenLength) {
          i -= childrenLength - children.length;
          childrenLength = children.length;
        }
      }

      // If this is an list item, add some space to the lineNumbers:
      if (childrenLineNumbers.length && element.nodeName === 'LI') {
        childrenLineNumbers[childrenLineNumbers.length - 1].marginBottom = LI_MARGIN_BOTTOM;
      }

      foundLineNumbers = foundLineNumbers.concat(childrenLineNumbers);
    }
    return foundLineNumbers;
  }

  /**
   * Recursive helper function to determine if the element is inside a list
   *
   * @param element the current html node
   * @returns wether the element is inside a list or not
   */
  var isInsideAList = function(element) {
    var parent = element.parentNode;
    while (parent !== null) {
      if (parent.nodeName === 'UL' || parent.nodeName === 'OL') {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }

  /**
   * Helper function to safer extract a line number from an element
   *
   * @param element
   * @returns the line number of the element
   */
  var getLineNumber = function(element) {
    if (
      element &&
      element.nodeName === 'SPAN' &&
      element.getAttribute('class') &&
      element.getAttribute('class').indexOf('os-line-number') > -1
    ) {
      return +element.getAttribute('data-line-number');
    }
  }

  /**
   * Extracts the style information from the given array
   *
   * @param styles an array of inline css styles (i.e. `style="margin: 10px"`)
   * @returns an object with style pdfmake compatible style information
   */
  var computeStyle = function(styles) {
    var styleObject = {};
    if (styles && styles.length > 0) {
      for (var style of styles) {
        var styleDefinition = style
          .trim()
          .toLowerCase()
          .split(':');
        var key = styleDefinition[0];
        var value = styleDefinition[1];

        if (styleDefinition.length === 2) {
          switch (key) {
            case 'padding-left': {
              styleObject.margin = [+value, 0, 0, 0];
              break;
            }
            case 'font-size': {
              styleObject.fontSize = +value;
              break;
            }
            case 'text-align': {
              switch (value) {
                case 'right':
                case 'center':
                case 'justify':
                  {
                    styleObject.alignment = value;
                    break;
                  }
              }
              break;
            }
            case 'font-weight': {
              switch (value) {
                case 'bold':
                  {
                    styleObject.bold = true;
                    break;
                  }
              }
              break;
            }
            case 'text-decoration': {
              switch (value) {
                case 'underline': {
                  styleObject.decoration = 'underline';
                  break;
                }
                case 'line-through': {
                  styleObject.decoration = 'lineThrough';
                  break;
                }
              }
              break;
            }
            case 'font-style': {
              switch (value) {
                case 'italic': {
                  styleObject.italics = true;
                  break;
                }
              }
              break;
            }
            case 'color': {
              styleObject.color = parseColor(value);
              break;
            }
            case 'background-color': {
              styleObject.background = parseColor(value);
              break;
            }
          }
        }
      }
    }
    return styleObject;
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

  /**
   * Helper function to create valid doc definitions container elements for pdfmake
   *
   * @param name should be a pdfMake container element, like 'text' or 'stack'
   * @param content
   */
  var create = function(name, content) {
    var container = {};
    var docDef = content || [];
    container[name] = docDef;
    return container;
  }

  return convertHtml(htmlText, lnMode)
}

},{}]},{},[1]);
