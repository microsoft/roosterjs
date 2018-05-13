/*
    VERSION: 6.10.3

    RoosterJS
    Copyright (c) Microsoft Corporation
    All rights reserved.

    MIT License

    Copyright (c) Microsoft Corporation. All rights reserved.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE

*/
define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BlockElement_1 = __webpack_require__(11);
exports.NodeBlockElement = BlockElement_1.NodeBlockElement;
exports.StartEndBlockElement = BlockElement_1.StartEndBlockElement;
exports.getBlockElementAtNode = BlockElement_1.getBlockElementAtNode;
exports.getFirstBlockElement = BlockElement_1.getFirstBlockElement;
exports.getLastBlockElement = BlockElement_1.getLastBlockElement;
exports.getNextBlockElement = BlockElement_1.getNextBlockElement;
exports.getPreviousBlockElement = BlockElement_1.getPreviousBlockElement;
exports.getFirstInlineElement = BlockElement_1.getFirstInlineElement;
exports.getLastInlineElement = BlockElement_1.getLastInlineElement;
exports.getInlineElementAtNode = BlockElement_1.getInlineElementAtNode;
exports.getNextInlineElement = BlockElement_1.getNextInlineElement;
exports.getPreviousInlineElement = BlockElement_1.getPreviousInlineElement;
exports.getInlineElementBeforePoint = BlockElement_1.getInlineElementBeforePoint;
exports.getInlineElementAfterPoint = BlockElement_1.getInlineElementAfterPoint;
var ContentTraverser_1 = __webpack_require__(54);
exports.ContentTraverser = ContentTraverser_1.default;
var getLeafSibling_1 = __webpack_require__(16);
exports.getNextLeafSibling = getLeafSibling_1.getNextLeafSibling;
exports.getPreviousLeafSibling = getLeafSibling_1.getPreviousLeafSibling;
var getLeafNode_1 = __webpack_require__(30);
exports.getFirstLeafNode = getLeafNode_1.getFirstLeafNode;
exports.getLastLeafNode = getLeafNode_1.getLastLeafNode;
var ImageInlineElement_1 = __webpack_require__(31);
exports.ImageInlineElement = ImageInlineElement_1.default;
var InlineElementFactory_1 = __webpack_require__(55);
exports.InlineElementFactory = InlineElementFactory_1.default;
var LinkInlineElement_1 = __webpack_require__(33);
exports.LinkInlineElement = LinkInlineElement_1.default;
var NodeInlineElement_1 = __webpack_require__(8);
exports.NodeInlineElement = NodeInlineElement_1.default;
var PartialInlineElement_1 = __webpack_require__(12);
exports.PartialInlineElement = PartialInlineElement_1.default;
var TextInlineElement_1 = __webpack_require__(20);
exports.TextInlineElement = TextInlineElement_1.default;
var BodyScoper_1 = __webpack_require__(57);
exports.BodyScoper = BodyScoper_1.default;
var EditorSelection_1 = __webpack_require__(21);
exports.EditorSelection = EditorSelection_1.default;
var SelectionBlockScoper_1 = __webpack_require__(58);
exports.SelectionBlockScoper = SelectionBlockScoper_1.default;
var SelectionScoper_1 = __webpack_require__(59);
exports.SelectionScoper = SelectionScoper_1.default;
var applyFormat_1 = __webpack_require__(60);
exports.applyFormat = applyFormat_1.default;
var changeElementTag_1 = __webpack_require__(61);
exports.changeElementTag = changeElementTag_1.default;
var contains_1 = __webpack_require__(14);
exports.contains = contains_1.default;
var convertInlineCss_1 = __webpack_require__(62);
exports.convertInlineCss = convertInlineCss_1.default;
var sanitizeHtml_1 = __webpack_require__(34);
exports.sanitizeHtml = sanitizeHtml_1.default;
var fromHtml_1 = __webpack_require__(19);
exports.fromHtml = fromHtml_1.default;
var getComputedStyle_1 = __webpack_require__(15);
exports.getComputedStyle = getComputedStyle_1.default;
exports.getComputedStyles = getComputedStyle_1.getComputedStyles;
var getTagOfNode_1 = __webpack_require__(7);
exports.getTagOfNode = getTagOfNode_1.default;
var isBlockElement_1 = __webpack_require__(29);
exports.isBlockElement = isBlockElement_1.default;
var isDocumentPosition_1 = __webpack_require__(6);
exports.isDocumentPosition = isDocumentPosition_1.default;
var isEditorPointAfter_1 = __webpack_require__(13);
exports.isEditorPointAfter = isEditorPointAfter_1.default;
var isNodeEmpty_1 = __webpack_require__(63);
exports.isNodeEmpty = isNodeEmpty_1.default;
var isTextualInlineElement_1 = __webpack_require__(64);
exports.isTextualInlineElement = isTextualInlineElement_1.default;
var matchWhiteSpaces_1 = __webpack_require__(65);
exports.matchWhiteSpaces = matchWhiteSpaces_1.default;
var normalizeEditorPoint_1 = __webpack_require__(22);
exports.normalizeEditorPoint = normalizeEditorPoint_1.default;
var splitParentNode_1 = __webpack_require__(66);
exports.splitParentNode = splitParentNode_1.default;
var unwrap_1 = __webpack_require__(67);
exports.unwrap = unwrap_1.default;
var wrap_1 = __webpack_require__(32);
exports.wrap = wrap_1.default;
var wrapAll_1 = __webpack_require__(68);
exports.wrapAll = wrapAll_1.default;
var VTable_1 = __webpack_require__(69);
exports.VTable = VTable_1.default;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Execute format with undo
 * It tries to add undo snapshot at begin and end of the function. Duplicated snapshot will only be added once
 * @param editor The editor instance
 * @param formatter The callback format function we want to perform, it also creates a fallback node for selection.
 * A fallback node is a node to update selection to if start point or end point is not avaiable/valid
 * @param preserveSelection (Optional) Whether to preserve selection, if set to true,
 * we update the selection to original selection range.
 */
function execFormatWithUndo(editor, formatter, preserveSelection) {
    editor.addUndoSnapshot();
    var range = editor.getSelectionRange();
    var startPoint = range
        ? { containerNode: range.startContainer, offset: range.startOffset }
        : null;
    var endPoint = range ? { containerNode: range.endContainer, offset: range.endOffset } : null;
    var fallbackNode = formatter(startPoint, endPoint);
    editor.triggerContentChangedEvent("Format" /* Format */);
    if (preserveSelection && startPoint && endPoint) {
        updateSelection(editor, startPoint, endPoint, fallbackNode);
    }
    editor.addUndoSnapshot();
}
exports.default = execFormatWithUndo;
function updateSelection(editor, startPoint, endPoint, fallbackNode) {
    editor.focus();
    var range = editor.getDocument().createRange();
    if (validateEditorPoint(editor, startPoint) && validateEditorPoint(editor, endPoint)) {
        range.setStart(startPoint.containerNode, startPoint.offset);
        range.setEnd(endPoint.containerNode, endPoint.offset);
    }
    else if (fallbackNode instanceof Node) {
        range.selectNode(fallbackNode);
    }
    else {
        return;
    }
    editor.updateSelection(range);
}
function validateEditorPoint(editor, point) {
    if (point.containerNode && editor.contains(point.containerNode)) {
        if (point.containerNode.nodeType == 3 /* Text */) {
            point.offset = Math.min(point.offset, point.containerNode.data.length);
        }
        else if (point.containerNode.nodeType == 1 /* Element */) {
            point.offset = Math.min(point.offset, point.containerNode.childNodes.length);
        }
        return point.offset >= 0;
    }
    return false;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Editor_1 = __webpack_require__(53);
exports.Editor = Editor_1.default;
var Undo_1 = __webpack_require__(25);
exports.Undo = Undo_1.default;
var UndoSnapshots_1 = __webpack_require__(26);
exports.UndoSnapshotsService = UndoSnapshots_1.default;
var BrowserData_1 = __webpack_require__(10);
exports.browserData = BrowserData_1.default;
var eventDataCacheUtils_1 = __webpack_require__(82);
exports.clearEventDataCache = eventDataCacheUtils_1.clearEventDataCache;
exports.cacheGetEventData = eventDataCacheUtils_1.cacheGetEventData;
var snapshotUtils_1 = __webpack_require__(27);
exports.buildSnapshot = snapshotUtils_1.buildSnapshot;
exports.restoreSnapshot = snapshotUtils_1.restoreSnapshot;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
/**
 * Query nodes intersected with current selection using a selector
 * @param editor The editor
 * @param selector The selector to query
 * @param nodeContainedByRangeOnly When set to true, only return the nodes contained by current selection. Default value is false
 * @param forEachCallback An optional callback to be invoked on each node in query result
 * @returns The nodes intersected with current selection, returns an empty array if no result is found
 */
function queryNodesWithSelection(editor, selector, nodeContainedByRangeOnly, forEachCallback) {
    var nodes = editor.queryElements(selector);
    var range = editor.getSelectionRange();
    nodes = nodes.filter(function (node) { return isIntersectWithNodeRange(node, range, nodeContainedByRangeOnly); });
    if (forEachCallback) {
        nodes.forEach(forEachCallback);
    }
    return nodes;
}
exports.default = queryNodesWithSelection;
function isIntersectWithNodeRange(node, range, nodeContainedByRangeOnly) {
    var startPosition = node.compareDocumentPosition(range.startContainer);
    var endPosition = node.compareDocumentPosition(range.endContainer);
    var targetPositions = [0 /* Same */, 8 /* Contains */];
    if (!nodeContainedByRangeOnly) {
        targetPositions.push(16 /* ContainedBy */);
    }
    return (roosterjs_editor_dom_1.isDocumentPosition(startPosition, targetPositions) || // intersectStart
        roosterjs_editor_dom_1.isDocumentPosition(endPosition, targetPositions) || // intersectEnd // Contains
        (roosterjs_editor_dom_1.isDocumentPosition(startPosition, 2 /* Preceding */) &&
            roosterjs_editor_dom_1.isDocumentPosition(endPosition, 4 /* Following */) &&
            !roosterjs_editor_dom_1.isDocumentPosition(endPosition, 16 /* ContainedBy */)));
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cacheGetCursorEventData_1 = __webpack_require__(83);
exports.cacheGetCursorEventData = cacheGetCursorEventData_1.default;
exports.clearCursorEventDataCache = cacheGetCursorEventData_1.clearCursorEventDataCache;
var CursorData_1 = __webpack_require__(23);
exports.CursorData = CursorData_1.default;
var getNodeAtCursor_1 = __webpack_require__(9);
exports.getNodeAtCursor = getNodeAtCursor_1.default;
exports.cacheGetListElement = getNodeAtCursor_1.cacheGetListElement;
exports.cacheGetNodeAtCursor = getNodeAtCursor_1.cacheGetNodeAtCursor;
var queryNodesWithSelection_1 = __webpack_require__(3);
exports.queryNodesWithSelection = queryNodesWithSelection_1.default;
var replaceRangeWithNode_1 = __webpack_require__(37);
exports.replaceRangeWithNode = replaceRangeWithNode_1.default;
var replaceTextBeforeCursorWithNode_1 = __webpack_require__(84);
exports.replaceTextBeforeCursorWithNode = replaceTextBeforeCursorWithNode_1.default;
exports.validateAndGetRangeForTextBeforeCursor = replaceTextBeforeCursorWithNode_1.validateAndGetRangeForTextBeforeCursor;
var cacheGetListState_1 = __webpack_require__(38);
exports.cacheGetListState = cacheGetListState_1.default;
var clearFormat_1 = __webpack_require__(85);
exports.clearFormat = clearFormat_1.default;
var createLink_1 = __webpack_require__(86);
exports.createLink = createLink_1.default;
var execFormatWithUndo_1 = __webpack_require__(1);
exports.execFormatWithUndo = execFormatWithUndo_1.default;
var getFormatState_1 = __webpack_require__(44);
exports.getFormatState = getFormatState_1.default;
var insertImage_1 = __webpack_require__(88);
exports.insertImage = insertImage_1.default;
var insertTable_1 = __webpack_require__(89);
exports.insertTable = insertTable_1.default;
var editTable_1 = __webpack_require__(90);
exports.editTable = editTable_1.default;
var formatTable_1 = __webpack_require__(45);
exports.formatTable = formatTable_1.default;
var removeLink_1 = __webpack_require__(91);
exports.removeLink = removeLink_1.default;
var setAlignment_1 = __webpack_require__(92);
exports.setAlignment = setAlignment_1.default;
var setBackgroundColor_1 = __webpack_require__(39);
exports.setBackgroundColor = setBackgroundColor_1.default;
var setTextColor_1 = __webpack_require__(42);
exports.setTextColor = setTextColor_1.default;
var setDirection_1 = __webpack_require__(93);
exports.setDirection = setDirection_1.default;
var setFontName_1 = __webpack_require__(40);
exports.setFontName = setFontName_1.default;
var setFontSize_1 = __webpack_require__(41);
exports.setFontSize = setFontSize_1.default;
var setImageAltText_1 = __webpack_require__(94);
exports.setImageAltText = setImageAltText_1.default;
var setIndentation_1 = __webpack_require__(95);
exports.setIndentation = setIndentation_1.default;
var toggleBold_1 = __webpack_require__(96);
exports.toggleBold = toggleBold_1.default;
var toggleBullet_1 = __webpack_require__(46);
exports.toggleBullet = toggleBullet_1.default;
var toggleItalic_1 = __webpack_require__(97);
exports.toggleItalic = toggleItalic_1.default;
var toggleNumbering_1 = __webpack_require__(98);
exports.toggleNumbering = toggleNumbering_1.default;
var toggleBlockQuote_1 = __webpack_require__(99);
exports.toggleBlockQuote = toggleBlockQuote_1.default;
var toggleStrikethrough_1 = __webpack_require__(100);
exports.toggleStrikethrough = toggleStrikethrough_1.default;
var toggleSubscript_1 = __webpack_require__(101);
exports.toggleSubscript = toggleSubscript_1.default;
var toggleSuperscript_1 = __webpack_require__(102);
exports.toggleSuperscript = toggleSuperscript_1.default;
var toggleUnderline_1 = __webpack_require__(103);
exports.toggleUnderline = toggleUnderline_1.default;
var toggleHeader_1 = __webpack_require__(104);
exports.toggleHeader = toggleHeader_1.default;
var matchLink_1 = __webpack_require__(43);
exports.matchLink = matchLink_1.default;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check if editor has a collapsed selection
 * @param editor The editor instance
 * @returns True if selection is collapsed, false otherwise
 */
function isSelectionCollapsed(editor) {
    var range = editor.getSelectionRange();
    return range && range.collapsed ? true : false;
}
exports.default = isSelectionCollapsed;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check if position is or encompasses any of targets
 * @param position The doucment position to check
 * @param targets The target position or position array
 */
function isDocumentPosition(position, targets) {
    targets = targets instanceof Array ? targets : [targets];
    return targets.some(function (target) {
        return target == 0 /* Same */
            ? position == 0 /* Same */
            : (position & target) == target;
    });
}
exports.default = isDocumentPosition;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Returns the html tag of a node, or empty if it is not an element
function getTagOfNode(node) {
    // TODO: we need to standardize on use of lower or upper case
    return node && node.nodeType == 1 /* Element */ ? node.tagName.toUpperCase() : '';
}
exports.default = getTagOfNode;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contains_1 = __webpack_require__(14);
var getTagOfNode_1 = __webpack_require__(7);
var isDocumentPosition_1 = __webpack_require__(6);
var isEditorPointAfter_1 = __webpack_require__(13);
var isNodeAfter_1 = __webpack_require__(17);
var wrap_1 = __webpack_require__(32);
var getLeafSibling_1 = __webpack_require__(16);
// This presents an inline element that can be reprented by a single html node.
// This serves as base for most inline element as it contains most implentation
// of all operations that can happen on an inline element. Other sub inline elements mostly
// just identify themself for a certain type
var NodeInlineElement = /** @class */ (function () {
    function NodeInlineElement(containerNode, parentBlock) {
        this.containerNode = containerNode;
        this.parentBlock = parentBlock;
    }
    // The text content for this inline element
    NodeInlineElement.prototype.getTextContent = function () {
        // nodeValue is better way to retrieve content for a text. Others, just use textContent
        return this.containerNode.nodeType == 3 /* Text */
            ? this.containerNode.nodeValue
            : this.containerNode.textContent;
    };
    // Get the container node
    NodeInlineElement.prototype.getContainerNode = function () {
        return this.containerNode;
    };
    // Get the parent block
    NodeInlineElement.prototype.getParentBlock = function () {
        return this.parentBlock;
    };
    // Get the start point of the inline element
    NodeInlineElement.prototype.getStartPoint = function () {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        var firstChild = this.containerNode;
        while (firstChild.firstChild) {
            firstChild = firstChild.firstChild;
        }
        return { containerNode: firstChild, offset: 0 /* Begin */ };
    };
    // Get the end point of the inline element
    NodeInlineElement.prototype.getEndPoint = function () {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        var lastChild = this.containerNode;
        while (lastChild.lastChild) {
            lastChild = lastChild.lastChild;
        }
        return {
            containerNode: lastChild,
            offset: lastChild.nodeType == 3 /* Text */ ? lastChild.nodeValue.length : 1 /* End */,
        };
    };
    // Checks if an inline element is after the current inline element
    NodeInlineElement.prototype.isAfter = function (inlineElement) {
        return isNodeAfter_1.default(this.containerNode, inlineElement.getContainerNode());
    };
    // Checks if an editor point is contained in the inline element
    NodeInlineElement.prototype.contains = function (editorPoint) {
        var startPoint = this.getStartPoint();
        var endPoint = this.getEndPoint();
        return (isEditorPointAfter_1.default(editorPoint, startPoint) && isEditorPointAfter_1.default(endPoint, editorPoint));
    };
    // Apply inline style to a region of an inline element. The region is identified thorugh the from and to point
    // The fromPoint and toPoint are optional and when bing missed, it indicates the boundary of the element
    // The function finds the minimal DOM on top of which styles can be applied, or create DOM when needed, i.e.
    // when the style has to be applied to partial of a text node, in that case, it wraps that in a SPAN and returns the SPAN
    // The actuall styling is done by consumer through the styler callback
    NodeInlineElement.prototype.applyStyle = function (styler, fromPoint, toPoint) {
        var ownerDoc = this.containerNode.ownerDocument;
        var startNode = null;
        var endNode = null;
        var startOffset = 0 /* Begin */;
        var endOffset = 1 /* End */;
        // Adjust the start point
        if (fromPoint) {
            startNode = fromPoint.containerNode;
            startOffset = fromPoint.offset;
            if ((startNode.nodeType == 3 /* Text */ &&
                startOffset == startNode.nodeValue.length) ||
                (startNode.nodeType == 1 /* Element */ && startOffset == 1 /* End */)) {
                // The point is at the end of container element
                startNode = getLeafSibling_1.getNextLeafSibling(this.containerNode, startNode);
                startOffset = 0 /* Begin */;
            }
        }
        else {
            startNode = this.containerNode;
            while (startNode.firstChild) {
                startNode = startNode.firstChild;
                startOffset = 0 /* Begin */;
            }
        }
        // Adjust the end point
        if (toPoint) {
            endNode = toPoint.containerNode;
            endOffset = toPoint.offset;
            if (endOffset == 0 /* Begin */) {
                // The point is at the begin of container element, use previous leaf
                // Set endOffset to end of node
                endNode = getLeafSibling_1.getPreviousLeafSibling(this.containerNode, endNode);
                endOffset =
                    endNode && endNode.nodeType == 3 /* Text */
                        ? endNode.nodeValue.length
                        : 1 /* End */;
            }
        }
        else {
            endNode = this.containerNode;
            while (endNode.lastChild) {
                endNode = endNode.lastChild;
            }
            endOffset =
                endNode && endNode.nodeType == 3 /* Text */
                    ? endNode.nodeValue.length
                    : 1 /* End */;
        }
        if (!startNode || !endNode) {
            // we need a valid start and end node, if either one is null, we will just exit
            // this isn't an error, it just tells the fact we don't see a good node to apply a style
            return;
        }
        while (startNode == this.containerNode || contains_1.default(this.containerNode, startNode)) {
            // The code below modifies DOM. Need to get the next sibling first otherwise you won't be able to reliably get a good next sibling node
            var nextLeafNode = getLeafSibling_1.getNextLeafSibling(this.containerNode, startNode);
            var withinRange = startNode == endNode ||
                isDocumentPosition_1.default(startNode.compareDocumentPosition(endNode), 4 /* Following */);
            if (!withinRange) {
                break;
            }
            // Apply the style
            // If a node has only white space and new line and is in table, we ignore it,
            // otherwise the table will be distorted
            if (startNode.nodeType == 3 /* Text */ &&
                startNode.nodeValue &&
                !(startNode.nodeValue.trim() == '' && getTagOfNode_1.default(startNode.parentNode) == 'TR')) {
                var adjustedEndOffset = startNode == endNode ? endOffset : startNode.nodeValue.length;
                if (adjustedEndOffset > startOffset) {
                    var len = adjustedEndOffset - startOffset;
                    var parentNode = startNode.parentNode;
                    if (getTagOfNode_1.default(parentNode) == 'SPAN' &&
                        parentNode.textContent.length == len) {
                        // If the element is in a span and this element is everything of the parent
                        // apply the style on parent span
                        styler(parentNode);
                    }
                    else if (len == startNode.nodeValue.length) {
                        // It is whole text node
                        styler(wrap_1.default(startNode, '<span></span>'));
                    }
                    else {
                        // It is partial of a text node
                        var newNode = ownerDoc.createElement('SPAN');
                        newNode.textContent = startNode.nodeValue.substring(startOffset, adjustedEndOffset);
                        var range = ownerDoc.createRange();
                        range.setStart(startNode, startOffset);
                        range.setEnd(startNode, adjustedEndOffset);
                        range.deleteContents();
                        range.insertNode(newNode);
                        styler(newNode);
                    }
                }
            }
            startNode = nextLeafNode;
            startOffset = 0 /* Begin */;
        }
    };
    return NodeInlineElement;
}());
exports.default = NodeInlineElement;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_dom_1 = __webpack_require__(0);
/**
 * Get the node at selection. If an expectedTag is specified, return the nearest ancestor of current node
 * which matches the tag name, or null if no match found in editor.
 * @param editor The editor instance
 * @param expectedTags The expected tag names. If null, return the element at cursor
 * @param startNode If specified, use this node as start node to search instead of current node
 * @returns The node at cursor or the nearest ancestor with the tag name is specified
 */
function getNodeAtCursor(editor, expectedTags, startNode) {
    var node = startNode;
    if (!node && editor.hasFocus()) {
        var sel = editor.getSelection();
        node = sel ? sel.focusNode : null;
    }
    if (!node) {
        var selectionRange = editor.getSelectionRange();
        if (selectionRange) {
            node = selectionRange.collapsed
                ? selectionRange.startContainer
                : selectionRange.commonAncestorContainer;
        }
    }
    node = node && node.nodeType == 3 /* Text */ ? node.parentNode : node;
    if (expectedTags) {
        if (expectedTags instanceof Array) {
            expectedTags = expectedTags.map(function (tag) { return (tag ? tag.toUpperCase() : ''); });
        }
        else {
            expectedTags = [expectedTags.toUpperCase()];
        }
        while (editor.contains(node)) {
            var tag = roosterjs_editor_dom_1.getTagOfNode(node);
            if (tag && expectedTags.indexOf(tag) >= 0) {
                return node;
            }
            node = node.parentNode;
        }
    }
    return editor.contains(node) ? node : null;
}
exports.default = getNodeAtCursor;
/**
 * Get the node at selection from event cache if it exists.
 * If an expectedTag is specified, return the nearest ancestor of current node
 * which matches the tag name, or null if no match found in editor.
 * @param editor The editor instance
 * @param event Event object to get cached object from
 * @param expectedTags The expected tag names. If null, return the element at cursor
 * @returns The element at cursor or the nearest ancestor with the tag name is specified
 */
function cacheGetNodeAtCursor(editor, event, expectedTags) {
    var tagNames = expectedTags instanceof Array ? expectedTags.join() : expectedTags;
    return roosterjs_editor_core_1.cacheGetEventData(event, 'GET_NODE_AT_CURSOR_' + tagNames, function () {
        return getNodeAtCursor(editor, expectedTags);
    });
}
exports.cacheGetNodeAtCursor = cacheGetNodeAtCursor;
/**
 * @deprecated Use cacheGetNodeAtCursor instead
 */
function cacheGetListElement(editor, event) {
    return cacheGetNodeAtCursor(editor, event, 'LI');
}
exports.cacheGetListElement = cacheGetListElement;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getBrowserData(userAgent, appVersion) {
    // In case universal render somehow hits this code path
    if (typeof window == 'undefined') {
        return {
            isMac: false,
            isWin: false,
            isWebKit: false,
            isIE: false,
            isIE11OrGreater: false,
            isSafari: false,
            isChrome: false,
            isFirefox: false,
            isEdge: false,
        };
    }
    var rawValue = userAgent || window.navigator.userAgent;
    var appVer = appVersion || window.navigator.appVersion;
    // checks whether the browser is running in IE
    // IE11 will use rv in UA instead of MSIE. Unfortunately Firefox also uses this. We should also look for "Trident" to confirm this.
    // There have been cases where companies using older version of IE and custom UserAgents have broken this logic (e.g. IE 10 and KellyServices)
    // therefore we should check that the Trident/rv combo is not just from an older IE browser
    var isIE11OrGreater = rawValue.indexOf('rv:') != -1 && rawValue.indexOf('Trident') != -1;
    var isIE = rawValue.indexOf('MSIE') != -1 || isIE11OrGreater;
    var isWebKit = rawValue.indexOf('WebKit') != -1;
    // IE11+ may also send Chrome, Firefox and Safari. But it will send trident also
    var isChrome = false;
    var isFirefox = false;
    var isSafari = false;
    var isEdge = false;
    if (!isIE) {
        isChrome = rawValue.indexOf('Chrome') != -1;
        isFirefox = rawValue.indexOf('Firefox') != -1;
        if (rawValue.indexOf('Safari') != -1) {
            // Android and Chrome have Safari in the user string
            isSafari = rawValue.indexOf('Chrome') == -1 && rawValue.indexOf('Android') == -1;
        }
        // Sample Edge UA: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10121
        isEdge = rawValue.indexOf('Edge') != -1;
        // When it is edge, it should not be chrome or firefox. and it is also not webkit
        if (isEdge) {
            isWebKit = isChrome = isFirefox = false;
        }
    }
    var isMac = appVer.indexOf('Mac') != -1;
    var isWin = appVer.indexOf('Win') != -1 || appVer.indexOf('NT') != -1;
    return {
        isMac: isMac,
        isWin: isWin,
        isWebKit: isWebKit,
        isIE: isIE,
        isIE11OrGreater: isIE11OrGreater,
        isSafari: isSafari,
        isChrome: isChrome,
        isFirefox: isFirefox,
        isEdge: isEdge,
    };
}
exports.getBrowserData = getBrowserData;
var browserData = getBrowserData();
exports.default = browserData;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(12);
var contains_1 = __webpack_require__(14);
var getTagOfNode_1 = __webpack_require__(7);
var isBlockElement_1 = __webpack_require__(29);
var isDocumentPosition_1 = __webpack_require__(6);
var isNodeAfter_1 = __webpack_require__(17);
var shouldSkipNode_1 = __webpack_require__(18);
var getLeafNode_1 = __webpack_require__(30);
var getLeafSibling_1 = __webpack_require__(16);
// Get the inline element at a node
function getInlineElementAtNode(rootNode, node, inlineElementFactory) {
    // An inline element has to be in a block element, get the block first and then resolve through the factory
    var parentBlock = node ? getBlockElementAtNode(rootNode, node, inlineElementFactory) : null;
    return parentBlock ? inlineElementFactory.resolve(node, rootNode, parentBlock) : null;
}
exports.getInlineElementAtNode = getInlineElementAtNode;
// Get first inline element
function getFirstInlineElement(rootNode, inlineElementFactory) {
    // getFirstLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    var node = getLeafNode_1.getFirstLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node, inlineElementFactory) : null;
}
exports.getFirstInlineElement = getFirstInlineElement;
// Get last inline element
function getLastInlineElement(rootNode, inlineElementFactory) {
    // getLastLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    var node = getLeafNode_1.getLastLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node, inlineElementFactory) : null;
}
exports.getLastInlineElement = getLastInlineElement;
function getNextPreviousInlineElement(rootNode, inlineElement, inlineElementFactory, isNext) {
    var result;
    if (inlineElement) {
        if (inlineElement instanceof PartialInlineElement_1.default &&
            inlineElement.nextInlineElement) {
            // if current is partial, get the the other half of the inline unless it is no more
            result = inlineElement.nextInlineElement;
        }
        else {
            // Get a leaf node after startNode and use that base to find next inline
            var startNode = inlineElement.getContainerNode();
            startNode = getLeafSibling_1.getLeafSibling(rootNode, startNode, isNext);
            result = startNode
                ? getInlineElementAtNode(rootNode, startNode, inlineElementFactory)
                : null;
        }
    }
    return result;
}
// Get next inline element
function getNextInlineElement(rootNode, inlineElement, inlineElementFactory) {
    return getNextPreviousInlineElement(rootNode, inlineElement, inlineElementFactory, true /*isNext*/);
}
exports.getNextInlineElement = getNextInlineElement;
// Get previous inline element
function getPreviousInlineElement(rootNode, inlineElement, inlineElementFactory) {
    return getNextPreviousInlineElement(rootNode, inlineElement, inlineElementFactory, false /*isNext*/);
}
exports.getPreviousInlineElement = getPreviousInlineElement;
// Get inline element before an editor point
// This is mostly used when users want to get the inline element before selection/cursor
// There is a good possibility that the cursor is in middle of an inline element (i.e. mid of a text node)
// in this case, we only want to return what is before cursor (a partial of an inline) to indicate
// that we're in middle. The logic is largely to detect if the editor point runs across an inline element
function getInlineElementBeforePoint(rootNode, position, inlineElementFactory) {
    var inlineElement;
    var containerNode = position.containerNode;
    var offset = position.offset;
    if (containerNode) {
        var isPartial = false;
        if (offset == 0 /* Begin */) {
            // The point is at the begin of container element
            containerNode = getLeafSibling_1.getPreviousLeafSibling(rootNode, containerNode);
        }
        else if (containerNode.nodeType == 3 /* Text */ &&
            offset < containerNode.nodeValue.length) {
            // Run across a text node
            isPartial = true;
        }
        if (containerNode && shouldSkipNode_1.default(containerNode)) {
            containerNode = getLeafSibling_1.getPreviousLeafSibling(rootNode, containerNode);
        }
        inlineElement = containerNode
            ? getInlineElementAtNode(rootNode, containerNode, inlineElementFactory)
            : null;
        // if the inline element we get in the end wraps around the point (contains), this has to be a partial
        isPartial = isPartial || (inlineElement && inlineElement.contains(position));
        if (isPartial && inlineElement) {
            inlineElement = new PartialInlineElement_1.default(inlineElement, null, position);
        }
    }
    return inlineElement;
}
exports.getInlineElementBeforePoint = getInlineElementBeforePoint;
// Similar to getInlineElementBeforePoint, to get inline element after an editor point
function getInlineElementAfterPoint(rootNode, editorPoint, inlineElementFactory) {
    var inlineElement;
    var containerNode = editorPoint.containerNode;
    var offset = editorPoint.offset;
    if (containerNode) {
        var isPartial = false;
        if ((containerNode.nodeType == 3 /* Text */ && offset == containerNode.nodeValue.length) ||
            (containerNode.nodeType == 1 /* Element */ && offset == 1 /* End */)) {
            // The point is at the end of container element
            containerNode = getLeafSibling_1.getNextLeafSibling(rootNode, containerNode);
        }
        else if (containerNode.nodeType == 3 /* Text */ &&
            offset > 0 /* Begin */ &&
            offset < containerNode.nodeValue.length) {
            // Run across a text node, this inline has to be partial
            isPartial = true;
        }
        if (containerNode && shouldSkipNode_1.default(containerNode)) {
            containerNode = getLeafSibling_1.getNextLeafSibling(rootNode, containerNode);
        }
        inlineElement = containerNode
            ? getInlineElementAtNode(rootNode, containerNode, inlineElementFactory)
            : null;
        // if the inline element we get in the end wraps (contains) the editor point, this has to be a partial
        // the point runs across a test node in a link
        isPartial = isPartial || (inlineElement && inlineElement.contains(editorPoint));
        if (isPartial && inlineElement) {
            inlineElement = new PartialInlineElement_1.default(inlineElement, editorPoint, null);
        }
    }
    return inlineElement;
}
exports.getInlineElementAfterPoint = getInlineElementAfterPoint;
// Checks if the node is a BR
function isBrElement(node) {
    return getTagOfNode_1.default(node) == 'BR';
}
// Given a node and container block, identify the first leaf (head) node
// A leaf node is defined as deepest first node in a block
// i.e. <div><span style="font-family: Arial">abc</span></div>, abc is the head leaf of the block
// Often <br> or a child <div> is used to create a block. In that case, the leaf after the sibling div or br should be the head leaf
// i.e. <div>123<br>abc</div>, abc is the head of a block because of a previous sibling <br>
// i.e. <div><div>123</div>abc</div>, abc is also the head of a block because of a previous sibling <div>
// To identify the head leaf of a block, we basically start from a node, go all the way towards left till a sibling <div> or <br>
// in DOM tree traversal, it is three traversal:
// 1) previous sibling traversal
// 2) parent traversal looking for a previous sibling from parent
// 3) last child traversal, repeat from 1-3
function findHeadLeafNodeInBlock(node, containerBlockNode) {
    var headNode = node;
    var blockOrBrEncountered = false;
    while (!blockOrBrEncountered) {
        // 1) previous sibling traversal
        while (headNode.previousSibling) {
            var previousSibling = headNode.previousSibling;
            if (isBlockElement_1.default(previousSibling) || isBrElement(previousSibling)) {
                blockOrBrEncountered = true;
                break;
            }
            else {
                // move to previous sibling
                headNode = previousSibling;
            }
        }
        // break if a block or BR is seen
        if (blockOrBrEncountered) {
            break;
        }
        // 2) parent traversal looking for a previous sibling from parent
        var parentPreviousSibiling = void 0;
        var parentNode = headNode.parentNode;
        while (parentNode != containerBlockNode) {
            if (parentNode.previousSibling) {
                parentPreviousSibiling = parentNode.previousSibling;
                break;
            }
            else {
                parentNode = parentNode.parentNode;
            }
        }
        // 3) last child traversal
        while (parentPreviousSibiling && parentPreviousSibiling.lastChild) {
            parentPreviousSibiling = parentPreviousSibiling.lastChild;
        }
        // parentPreviousSibiling is the seed for traversal
        // Check if it is a block or <br>, if so, stop right away. Otherwise, repeat the traversal
        if (parentPreviousSibiling) {
            if (isBlockElement_1.default(parentPreviousSibiling) || isBrElement(parentPreviousSibiling)) {
                blockOrBrEncountered = true;
                break;
            }
            else {
                headNode = parentPreviousSibiling;
            }
        }
        else {
            break;
        }
    }
    return headNode;
}
// This is similar to findHeadLeafNodeInBlock, but the other direction to identify the last leaf (tail) node
// One difference from findHeadLeafNodeInBlock, when it sees a <br>, the <br> should be used as tail.
// In another word, we consider <br> to be part of a block as ending node
function findTailLeafNodeInBlock(node, containerBlockNode) {
    var tailNode = node;
    var blockOrBrEncountered = false;
    var isBr = false;
    while (!blockOrBrEncountered) {
        // 1) next sibling traversal
        while (tailNode.nextSibling) {
            var nextSibling = tailNode.nextSibling;
            if (isBlockElement_1.default(nextSibling) || (isBr = isBrElement(nextSibling))) {
                blockOrBrEncountered = true;
                // if br, consider it to be ending node for a block
                if (isBr) {
                    tailNode = nextSibling;
                }
                break;
            }
            else {
                // move to next sibling
                tailNode = nextSibling;
            }
        }
        if (blockOrBrEncountered) {
            break;
        }
        // 2) parent traversal looking for a next sibling from parent
        var parentNextSibiling = void 0;
        var parentNode = tailNode.parentNode;
        while (parentNode != containerBlockNode) {
            if (parentNode.nextSibling) {
                parentNextSibiling = parentNode.nextSibling;
                break;
            }
            else {
                parentNode = parentNode.parentNode;
            }
        }
        // 3) first child traversal
        while (parentNextSibiling && parentNextSibiling.firstChild) {
            parentNextSibiling = parentNextSibiling.firstChild;
        }
        // parentPreviousSibiling is the seed for traversal
        // Check if it is a block or <br>, if so, stop right away. Otherwise, repeat the traversal
        if (parentNextSibiling) {
            if (isBlockElement_1.default(parentNextSibiling) || (isBr = isBrElement(parentNextSibiling))) {
                blockOrBrEncountered = true;
                if (isBr) {
                    tailNode = parentNextSibiling;
                }
                break;
            }
            else {
                tailNode = parentNextSibiling;
            }
        }
        else {
            break;
        }
    }
    return tailNode;
}
function getFirstLastBlockElement(rootNode, inlineElementFactory, isFirst) {
    var getChild = isFirst ? function (node) { return node.firstChild; } : function (node) { return node.lastChild; };
    var node = getChild(rootNode);
    while (node && getChild(node)) {
        node = getChild(node);
    }
    return node ? getBlockElementAtNode(rootNode, node, inlineElementFactory) : null;
}
// Get the first block element
// NOTE: this can return null for empty container
function getFirstBlockElement(rootNode, inlineElementFactory) {
    return getFirstLastBlockElement(rootNode, inlineElementFactory, true /*isFirst*/);
}
exports.getFirstBlockElement = getFirstBlockElement;
// Get the last block element
// NOTE: this can return null for empty container
function getLastBlockElement(rootNode, inlineElementFactory) {
    return getFirstLastBlockElement(rootNode, inlineElementFactory, false /*isFirst*/);
}
exports.getLastBlockElement = getLastBlockElement;
function getNextPreviousBlockElement(rootNode, blockElement, inlineElementFactory, isNext) {
    var getNode = isNext
        ? function (element) { return element.getEndNode(); }
        : function (element) { return element.getStartNode(); };
    var result;
    if (blockElement) {
        // Get a leaf node after block's end element and use that base to find next block
        // TODO: this code is used to identify block, maybe we shouldn't exclude those empty nodes
        // We can improve this later on
        var leaf = getLeafSibling_1.getLeafSibling(rootNode, getNode(blockElement), isNext);
        result = leaf ? getBlockElementAtNode(rootNode, leaf, inlineElementFactory) : null;
    }
    return result;
}
// Get next block
function getNextBlockElement(rootNode, blockElement, inlineElementFactory) {
    return getNextPreviousBlockElement(rootNode, blockElement, inlineElementFactory, true /*isNext*/);
}
exports.getNextBlockElement = getNextBlockElement;
// Get previous block
function getPreviousBlockElement(rootNode, blockElement, inlineElementFactory) {
    return getNextPreviousBlockElement(rootNode, blockElement, inlineElementFactory, false /*isNext*/);
}
exports.getPreviousBlockElement = getPreviousBlockElement;
// This presents a content block that can be reprented by a single html block type element.
// In most cases, it corresponds to an HTML block level element, i.e. P, DIV, LI, TD etc.
var NodeBlockElement = /** @class */ (function () {
    function NodeBlockElement(containerNode, inlineElementFactory) {
        this.containerNode = containerNode;
        this.inlineElementFactory = inlineElementFactory;
    }
    // Get the text content in the block
    NodeBlockElement.prototype.getTextContent = function () {
        return this.containerNode.textContent;
    };
    // Get the start node of the block
    // For NodeBlockElement, start and end essentially refers to same node
    NodeBlockElement.prototype.getStartNode = function () {
        return this.containerNode;
    };
    // Get the end node of the block
    // For NodeBlockElement, start and end essentially refers to same node
    NodeBlockElement.prototype.getEndNode = function () {
        return this.containerNode;
    };
    // Get all nodes represented in a Node array
    NodeBlockElement.prototype.getContentNodes = function () {
        return [this.containerNode];
    };
    // Get the first inline element in the block
    NodeBlockElement.prototype.getFirstInlineElement = function () {
        if (!this.firstInline) {
            this.firstInline = getFirstInlineElement(this.containerNode, this.inlineElementFactory);
        }
        return this.firstInline;
    };
    // Get the last inline element in the block
    NodeBlockElement.prototype.getLastInlineElement = function () {
        if (!this.lastInline) {
            this.lastInline = getLastInlineElement(this.containerNode, this.inlineElementFactory);
        }
        return this.lastInline;
    };
    // Gets all inline in the block
    NodeBlockElement.prototype.getInlineElements = function () {
        var allInlines = [];
        var startInline = this.getFirstInlineElement();
        while (startInline) {
            allInlines.push(startInline);
            startInline = getNextInlineElement(this.containerNode, startInline, this.inlineElementFactory);
        }
        return allInlines;
    };
    // Checks if it refers to same block
    NodeBlockElement.prototype.equals = function (blockElement) {
        // Ideally there is only one unique way to generate a block so we only need to compare the startNode
        return this.containerNode == blockElement.getStartNode();
    };
    // Checks if a block is after the current block
    NodeBlockElement.prototype.isAfter = function (blockElement) {
        // if the block's startNode is after current node endEnd, we say it is after
        return isNodeAfter_1.default(this.containerNode, blockElement.getEndNode());
    };
    // Checks if an inline element falls within the block
    NodeBlockElement.prototype.isInBlock = function (inlineElement) {
        return this.contains(inlineElement.getContainerNode());
    };
    // Checks if a certain html node is within the block
    NodeBlockElement.prototype.contains = function (node) {
        // if it is same node or it is being contained, we say it is contained.
        var documentPosition = this.containerNode.compareDocumentPosition(node);
        return (documentPosition == 0 /* Same */ ||
            isDocumentPosition_1.default(documentPosition, 16 /* ContainedBy */));
    };
    return NodeBlockElement;
}());
exports.NodeBlockElement = NodeBlockElement;
// This reprents a block that is identified by a start and end node
// This is for cases like <ced>Hello<BR>World</ced>
// in that case, Hello<BR> is a block, World is another block
// Such block cannot be represented by a NodeBlockElement since they don't chained up
// to a single parent node, instead they have a start and end
// This start and end must be in same sibling level and have same parent in DOM tree
var StartEndBlockElement = /** @class */ (function () {
    function StartEndBlockElement(rootNode, startNode, endNode, inlineElementFactory) {
        this.rootNode = rootNode;
        this.startNode = startNode;
        this.endNode = endNode;
        this.inlineElementFactory = inlineElementFactory;
    }
    // Gets the text content
    StartEndBlockElement.prototype.getTextContent = function () {
        var range = this.rootNode.ownerDocument.createRange();
        range.setStartBefore(this.startNode);
        range.setEndAfter(this.endNode);
        return range.toString();
    };
    // Get all nodes represented in a Node array
    // NOTE: this only works for balanced node -- start and end is at same level
    StartEndBlockElement.prototype.getContentNodes = function () {
        var currentNode = this.startNode;
        var allNodes = [];
        if (currentNode.parentNode == this.endNode.parentNode) {
            // get a node array from start and end and do DIV wrapping
            while (currentNode) {
                allNodes.push(currentNode);
                if (currentNode == this.endNode) {
                    break;
                }
                else {
                    currentNode = currentNode.nextSibling;
                }
            }
        }
        return allNodes;
    };
    // Gets the start node
    StartEndBlockElement.prototype.getStartNode = function () {
        return this.startNode;
    };
    // Gets the end node
    StartEndBlockElement.prototype.getEndNode = function () {
        return this.endNode;
    };
    // Gets first inline
    StartEndBlockElement.prototype.getFirstInlineElement = function () {
        if (!this.firstInline) {
            this.firstInline = getInlineElementAtNode(this.rootNode, this.startNode, this.inlineElementFactory);
        }
        return this.firstInline;
    };
    // Gets last inline
    StartEndBlockElement.prototype.getLastInlineElement = function () {
        if (!this.lastInline) {
            this.lastInline = getInlineElementAtNode(this.rootNode, this.endNode, this.inlineElementFactory);
        }
        return this.lastInline;
    };
    // Gets all inline in the block
    StartEndBlockElement.prototype.getInlineElements = function () {
        var allInlines = [];
        var startInline = this.getFirstInlineElement();
        while (startInline) {
            allInlines.push(startInline);
            startInline = getNextInlineElement(this.rootNode, startInline, this.inlineElementFactory);
        }
        return allInlines;
    };
    // Checks equals of two blocks
    StartEndBlockElement.prototype.equals = function (blockElement) {
        return (this.startNode == blockElement.getStartNode() &&
            this.endNode == blockElement.getEndNode());
    };
    // Checks if another block is after this current
    StartEndBlockElement.prototype.isAfter = function (blockElement) {
        return isNodeAfter_1.default(this.getStartNode(), blockElement.getEndNode());
    };
    // Checks if an inline falls inside me
    StartEndBlockElement.prototype.isInBlock = function (inlineElement) {
        return this.contains(inlineElement.getContainerNode());
    };
    // Checks if an Html node is contained within the block
    StartEndBlockElement.prototype.contains = function (node) {
        var inBlock = node == this.startNode || node == this.endNode;
        if (!inBlock) {
            var startComparision = this.startNode.compareDocumentPosition(node);
            var endComparision = this.endNode.compareDocumentPosition(node);
            var inOrAfterStart = isDocumentPosition_1.default(startComparision, 4 /* Following */) ||
                isDocumentPosition_1.default(startComparision, 16 /* ContainedBy */);
            var inOrBeforeEnd = isDocumentPosition_1.default(endComparision, 2 /* Preceding */) ||
                isDocumentPosition_1.default(endComparision, 16 /* ContainedBy */);
            inBlock = inOrAfterStart && inOrBeforeEnd;
        }
        return inBlock;
    };
    return StartEndBlockElement;
}());
exports.StartEndBlockElement = StartEndBlockElement;
// This produces a block element from a a node
// It needs to account for various HTML structure. Examples:
// 1) <ced><div>abc</div></ced>
//   This is most common the case, user passes in a node pointing to abc, and get back a block representing <div>abc</div>
// 2) <ced><p><br></p></ced>
//   Common content for empty block for email client like OWA, user passes node pointing to <br>, and get back a block representing <p><br></p>
// 3) <ced>abc</ced>
//   Not common, but does happen. It is still a block in user's view. User passes in abc, and get back a start-end block representing abc
//   NOTE: abc could be just one node. However, since it is not a html block, it is more appropriate to use start-end block although they point to same node
// 4) <ced><div>abc<br>123</div></ced>
//   A bit tricky, but can happen when user use Ctrl+Enter which simply inserts a <BR> to create a link break. There're two blocks:
//   block1: 1) abc<br> block2: 123
// 5) <ced><div>abc<div>123</div></div></ced>
//   Nesting div and there is text node in same level as a DIV. Two blocks: 1) abc 2) <div>123</div>
// 6) <ced<div>abc<span>123<br>456</span></div></ced>
//   This is really tricky. Essentially there is a <BR> in middle of a span breaking the span into two blocks;
//   block1: abc<span>123<br> block2: 456
// In summary, given any arbitary node (leaf), to identify the head and tail of the block, following rules need to be followed:
// 1) to identify the head, it needs to crawl DOM tre left/up till a block node or BR is encountered
// 2) same for identifying tail
// 3) should also apply a block ceiling, meaning as it crawls up, it should stop at a block node
function getBlockElementAtNode(rootNode, node, inlineElementFactory) {
    // TODO: assert node to be a leaf node
    var blockElement;
    if (node && contains_1.default(rootNode, node)) {
        // if the node is already a block, return right away
        if (isBlockElement_1.default(node)) {
            return new NodeBlockElement(node, inlineElementFactory);
        }
        // Identify the containing block. This serves as ceiling for traversing down below
        // NOTE: this container block could be just the rootNode,
        // which cannot be used to create block element. We will special case handle it later on
        var containerBlockNode = node.parentNode;
        while (!isBlockElement_1.default(containerBlockNode)) {
            containerBlockNode = containerBlockNode.parentNode;
        }
        // Find the head and leaf node in the block
        var headNode = findHeadLeafNodeInBlock(node, containerBlockNode);
        var tailNode = findTailLeafNodeInBlock(node, containerBlockNode);
        // TODO: assert headNode and tailNode to be leaf, and are within containerBlockNode
        // At this point, we have the head and tail of a block, here are some examples and where head and tail point to
        // 1) <ced><div>hello<br></div></ced>, head: hello, tail: <br>
        // 2) <ced><div>hello<span style="font-family: Arial">world</span></div></ced>, head: hello, tail: world
        // Both are actually completely and exclusively wrapped in a parent div, and can be represented with a Node block
        // So we shall try to collapse as much as we can to the nearest common ancester
        var parentNode = headNode.parentNode;
        while (parentNode.firstChild == headNode && parentNode != containerBlockNode) {
            if (contains_1.default(parentNode, tailNode)) {
                // this is an indication that the nearest common ancester has been reached
                break;
            }
            else {
                headNode = parentNode;
                parentNode = parentNode.parentNode;
            }
        }
        // Do same for the tail
        parentNode = tailNode.parentNode;
        while (parentNode.lastChild == tailNode && parentNode != containerBlockNode) {
            if (contains_1.default(parentNode, headNode)) {
                // this is an indication that the nearest common ancester has been reached
                break;
            }
            else {
                tailNode = parentNode;
                parentNode = parentNode.parentNode;
            }
        }
        if (headNode.parentNode != tailNode.parentNode) {
            // Un-balanced start and end, create a start-end block
            blockElement = new StartEndBlockElement(rootNode, headNode, tailNode, inlineElementFactory);
        }
        else {
            // Balanced start and end (point to same parent), need to see if further collapsing can be done
            parentNode = headNode.parentNode;
            while (parentNode.firstChild == headNode && parentNode.lastChild == tailNode) {
                if (parentNode == containerBlockNode) {
                    // Has reached the container block
                    if (containerBlockNode != rootNode) {
                        // If the container block is not the root, use the container block
                        headNode = tailNode = parentNode;
                    }
                    break;
                }
                else {
                    // Continue collapsing to parent
                    headNode = tailNode = parentNode;
                    parentNode = parentNode.parentNode;
                }
            }
            // If head and tail are same and it is a block element, create NodeBlock, otherwise start-end block
            blockElement =
                headNode == tailNode && isBlockElement_1.default(headNode)
                    ? new NodeBlockElement(headNode, inlineElementFactory)
                    : new StartEndBlockElement(rootNode, headNode, tailNode, inlineElementFactory);
        }
    }
    return blockElement;
}
exports.getBlockElementAtNode = getBlockElementAtNode;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var editorPointEquals_1 = __webpack_require__(28);
var isDocumentPosition_1 = __webpack_require__(6);
var isEditorPointAfter_1 = __webpack_require__(13);
// This is a special version of inline element that identifies a section of an inline element
// We often have the need to cut an inline element in half and perform some operation only on half of an inline element
// i.e. users select only some text of a text node and apply format, in that case, format has to happen on partial of an inline element
// PartialInlineElement is implemented in a way that decorate another full inline element with its own override on methods like isAfter
// It also offers some special methods that others don't have, i.e. nextInlineElement etc.
var PartialInlineElement = /** @class */ (function () {
    function PartialInlineElement(inlineElement, startPoint, endPoint) {
        if (startPoint === void 0) { startPoint = null; }
        if (endPoint === void 0) { endPoint = null; }
        this.inlineElement = inlineElement;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }
    // Get the full inline element that this partial inline decorates
    PartialInlineElement.prototype.getDecoratedInline = function () {
        return this.inlineElement;
    };
    // Gets the container node
    PartialInlineElement.prototype.getContainerNode = function () {
        return this.inlineElement.getContainerNode();
    };
    // Gets the parent block
    PartialInlineElement.prototype.getParentBlock = function () {
        return this.inlineElement.getParentBlock();
    };
    // Gets the text content
    PartialInlineElement.prototype.getTextContent = function () {
        var range = this.getRange();
        return range.toString();
    };
    // Gets the start point
    PartialInlineElement.prototype.getStartPoint = function () {
        return this.startPoint ? this.startPoint : this.inlineElement.getStartPoint();
    };
    // Gets the end point
    PartialInlineElement.prototype.getEndPoint = function () {
        return this.endPoint ? this.endPoint : this.inlineElement.getEndPoint();
    };
    // Checks if the partial is on start point
    PartialInlineElement.prototype.isStartPartial = function () {
        return this.startPoint != null;
    };
    // Checks if the partial is on the end point
    PartialInlineElement.prototype.isEndPartial = function () {
        return this.endPoint != null;
    };
    Object.defineProperty(PartialInlineElement.prototype, "nextInlineElement", {
        // Get next partial inline element if it is not at the end boundary yet
        get: function () {
            return this.endPoint
                ? new PartialInlineElement(this.inlineElement, this.endPoint, null)
                : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartialInlineElement.prototype, "previousInlineElement", {
        // Get previous partial inline element if it is not at the begin boundary yet
        get: function () {
            return this.startPoint != null
                ? new PartialInlineElement(this.inlineElement, null, this.startPoint)
                : null;
        },
        enumerable: true,
        configurable: true
    });
    // Checks if it contains an editor point
    PartialInlineElement.prototype.contains = function (editorPoint) {
        return (isEditorPointAfter_1.default(editorPoint, this.getStartPoint()) &&
            isEditorPointAfter_1.default(this.getEndPoint(), editorPoint));
    };
    // Check if this inline element is after the other inline element
    PartialInlineElement.prototype.isAfter = function (inlineElement) {
        // First node level check to see if this element's container node is after (following) the other element (inlineElement)
        // If node level says after (following), it is really "is after"
        var documentPosition = inlineElement
            .getContainerNode()
            .compareDocumentPosition(this.getContainerNode());
        var isAfter = isDocumentPosition_1.default(documentPosition, 4 /* Following */);
        // If node level is not "is after", need to do extra check if the other inline element is also a partial that decorates same inline element
        // and this partical is partial on start (this.startPoint != null)
        // The idea here is to take this partial's start to compare with the other inline end. We consider "is after" only when
        // this partial's start is after or same as the other inline's end
        if (!isAfter &&
            documentPosition == 0 /* Same */ &&
            inlineElement instanceof PartialInlineElement &&
            this.startPoint) {
            // get partial's end
            var otherInline = inlineElement;
            var otherInlineEndPoint = otherInline.getEndPoint();
            // this partial's start
            var thisStartPoint = this.getStartPoint();
            isAfter =
                isEditorPointAfter_1.default(thisStartPoint, otherInlineEndPoint) ||
                    editorPointEquals_1.default(thisStartPoint, otherInlineEndPoint);
        }
        return isAfter;
    };
    // apply style
    PartialInlineElement.prototype.applyStyle = function (styler, fromPoint, toPoint) {
        this.inlineElement.applyStyle(styler, fromPoint ? fromPoint : this.startPoint, toPoint ? toPoint : this.endPoint);
    };
    // get the entire inline element as a range
    PartialInlineElement.prototype.getRange = function () {
        var ownerDoc = this.inlineElement.getContainerNode().ownerDocument;
        var range = null;
        if (ownerDoc) {
            range = ownerDoc.createRange();
            if (this.startPoint) {
                range.setStart(this.startPoint.containerNode, this.startPoint.offset);
            }
            else {
                range.setStartBefore(this.inlineElement.getContainerNode());
            }
            if (this.endPoint) {
                range.setEnd(this.endPoint.containerNode, this.endPoint.offset);
            }
            else {
                range.setEndAfter(this.inlineElement.getContainerNode());
            }
        }
        return range;
    };
    return PartialInlineElement;
}());
exports.default = PartialInlineElement;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isNodeAfter_1 = __webpack_require__(17);
// Checks if point1 is after point2
function isEditorPointAfter(point1, point2) {
    return point1.containerNode == point2.containerNode
        ? point1.offset > point2.offset
        : isNodeAfter_1.default(point1.containerNode, point2.containerNode);
}
exports.default = isEditorPointAfter;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(6);
// Test if a node contains another node
function contains(container, contained) {
    return !!(container &&
        contained &&
        isDocumentPosition_1.default(container.compareDocumentPosition(contained), 16 /* ContainedBy */));
}
exports.default = contains;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getComputedStyle(node, styleName) {
    return getComputedStyles(node, styleName)[0] || '';
}
exports.default = getComputedStyle;
/**
 * Get computed styles of a node
 * @param node The node to get computed styles from
 * @param styleNames Names of style to get, can be a single name or an array.
 * Default value is font-family, font-size, color, background-color
 * @returns An array of the computed styles
 */
function getComputedStyles(node, styleNames) {
    if (styleNames === void 0) { styleNames = ['font-family', 'font-size', 'color', 'background-color']; }
    var result = [];
    styleNames = styleNames instanceof Array ? styleNames : [styleNames];
    if (node && node.nodeType == 1 /* Element */) {
        var win = node.ownerDocument.defaultView || window;
        var styles = win.getComputedStyle(node);
        for (var _i = 0, styleNames_1 = styleNames; _i < styleNames_1.length; _i++) {
            var style = styleNames_1[_i];
            result.push(((styles && styles.getPropertyValue(style)) || '').toLowerCase());
        }
    }
    return result;
}
exports.getComputedStyles = getComputedStyles;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contains_1 = __webpack_require__(14);
var shouldSkipNode_1 = __webpack_require__(18);
function getLeafSibling(rootNode, startNode, isNext) {
    var result = null;
    var getSibling = isNext
        ? function (node) { return node.nextSibling; }
        : function (node) { return node.previousSibling; };
    var getChild = isNext ? function (node) { return node.firstChild; } : function (node) { return node.lastChild; };
    if (startNode && contains_1.default(rootNode, startNode)) {
        var curNode = startNode;
        var shouldContinue = true;
        while (shouldContinue) {
            // Find next/previous node, starting from next/previous sibling, then one level up to find next/previous sibling from parent
            // till a non-null nextSibling/previousSibling is found or the ceiling is encountered (rootNode)
            var parentNode = curNode.parentNode;
            curNode = getSibling(curNode);
            while (!curNode && parentNode != rootNode) {
                curNode = getSibling(parentNode);
                parentNode = parentNode.parentNode;
            }
            // Now traverse down to get first/last child
            while (curNode && getChild(curNode)) {
                curNode = getChild(curNode);
            }
            // Check special nodes (i.e. node that has a display:none etc.) and continue looping if so
            shouldContinue = curNode && shouldSkipNode_1.default(curNode);
            if (!shouldContinue) {
                // Found a good leaf node, assign and exit
                result = curNode;
                break;
            }
        }
    }
    return result;
}
exports.getLeafSibling = getLeafSibling;
// This walks forwards (from left to right) DOM tree to get next meaningful node
// A null is returned when it reaches the very end - beyond the scope as defined by rootNode
function getNextLeafSibling(rootNode, startNode) {
    return getLeafSibling(rootNode, startNode, true /*isNext*/);
}
exports.getNextLeafSibling = getNextLeafSibling;
// This walks backwards (from right to left) DOM tree to get previous meaningful node
// A null is returned when it reaches the very first - beyond the scope as defined by rootNode
function getPreviousLeafSibling(rootNode, startNode) {
    return getLeafSibling(rootNode, startNode, false /*isNext*/);
}
exports.getPreviousLeafSibling = getPreviousLeafSibling;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(6);
// Checks if node1 is after node2
function isNodeAfter(node1, node2) {
    return !!(node1 &&
        node2 &&
        isDocumentPosition_1.default(node2.compareDocumentPosition(node1), 4 /* Following */));
}
exports.default = isNodeAfter;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getComputedStyle_1 = __webpack_require__(15);
// Check if it is an empty text node
function isEmptyTextNode(node) {
    return !!(node &&
        node.nodeType == 3 /* Text */ &&
        (!node.nodeValue || node.textContent == ''));
}
// Checks if it is text node that contains only CRLF
// Use case: Edge/IE often injects some CRLF text node in-between elements i.e.
// <div>{CRLF}<div>hello world</div></div>, those {CRLF} is not shown but creates noise
// that we want to skip
function isCRLFOnlyTextNode(node) {
    var isCRLF = false;
    if (node && node.nodeType == 3 /* Text */ && node.nodeValue) {
        var reg = /^[\r\n]+$/gm;
        isCRLF = reg.test(node.nodeValue);
    }
    return isCRLF;
}
// Checks if the element has a display: none or empty if it is not an element
function isDisplayNone(node) {
    return getComputedStyle_1.default(node, 'display') == 'none';
}
// Skip a node when any of following conditions are true
// - it is neither Element nor Text
// - it is a text node but is empty
// - it is a text node but contains just CRLF (noisy text node that often comes in-between elements)
// - has a display:none
function shouldSkipNode(node) {
    return ((node.nodeType != 1 /* Element */ && node.nodeType != 3 /* Text */) ||
        isEmptyTextNode(node) ||
        isCRLFOnlyTextNode(node) ||
        isDisplayNone(node));
}
exports.default = shouldSkipNode;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Creates a HTMLElement array from html
function fromHtml(htmlFragment, ownerDocument) {
    var element = ownerDocument.createElement('DIV');
    element.innerHTML = htmlFragment;
    var children = [];
    for (var index = 0; index < element.childNodes.length; index++) {
        children.push(element.childNodes.item(index));
    }
    return children;
}
exports.default = fromHtml;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NodeInlineElement_1 = __webpack_require__(8);
// This refers to an inline element that represents a text node
var TextInlineElement = /** @class */ (function (_super) {
    __extends(TextInlineElement, _super);
    function TextInlineElement(containerNode, parentBlock) {
        return _super.call(this, containerNode, parentBlock) || this;
    }
    return TextInlineElement;
}(NodeInlineElement_1.default));
exports.default = TextInlineElement;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(12);
var editorPointEquals_1 = __webpack_require__(28);
var isEditorPointAfter_1 = __webpack_require__(13);
var normalizeEditorPoint_1 = __webpack_require__(22);
var BlockElement_1 = __webpack_require__(11);
// This is a utility like class that produces editor point/inline/block element around or within a selection range
var EditorSelection = /** @class */ (function () {
    function EditorSelection(rootNode, selectionRange, inlineElementFactory) {
        this.rootNode = rootNode;
        this.selectionRange = selectionRange;
        this.inlineElementFactory = inlineElementFactory;
        this.startEndCalculated = false;
        // compute the start and end point
        this.startPoint = normalizeEditorPoint_1.default(this.selectionRange.startContainer, this.selectionRange.startOffset);
        this.endPoint = this.selectionRange.collapsed
            ? this.startPoint
            : normalizeEditorPoint_1.default(this.selectionRange.endContainer, this.selectionRange.endOffset);
    }
    Object.defineProperty(EditorSelection.prototype, "collapsed", {
        // Get the collapsed state of the selection
        get: function () {
            return this.selectionRange.collapsed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorSelection.prototype, "inlineElementBeforeStart", {
        // Get the inline element before start of the selection
        get: function () {
            return BlockElement_1.getInlineElementBeforePoint(this.rootNode, this.startPoint, this.inlineElementFactory);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorSelection.prototype, "startInlineElement", {
        // Get the start inline element of the selection (the first inline after the selection)
        get: function () {
            this.calculateStartEndIfNecessory();
            return this.startInline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorSelection.prototype, "endInlineElement", {
        // Get the inline element at the end of the selection
        get: function () {
            this.calculateStartEndIfNecessory();
            return this.endInline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorSelection.prototype, "startBlockElement", {
        // Get start block element
        get: function () {
            if (!this.startBlock && this.startPoint) {
                this.startBlock = BlockElement_1.getBlockElementAtNode(this.rootNode, this.startPoint.containerNode, this.inlineElementFactory);
            }
            return this.startBlock;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorSelection.prototype, "endBlockElement", {
        // Get end block element
        get: function () {
            if (!this.endBlock && this.endPoint) {
                this.endBlock = BlockElement_1.getBlockElementAtNode(this.rootNode, this.endPoint.containerNode, this.inlineElementFactory);
            }
            return this.endBlock;
        },
        enumerable: true,
        configurable: true
    });
    // Trim an inline element to ensure it fits in the selection boundary
    // Return null if the inline element completely falls out of the selection
    EditorSelection.prototype.trimInlineElement = function (inlineElement) {
        this.calculateStartEndIfNecessory();
        // Always return null for collapsed selection
        if (this.collapsed) {
            return null;
        }
        var trimmedInline;
        if (inlineElement && this.startInline && this.endInline) {
            // Start with the decorated inline, and trim first by startInline, and then endInline
            // if we end up getting a trimmed trimmedStartPoint or trimmedEndPoint, we know the new element
            // has to be partial. otherwise return a full inline
            var decoratedInline = void 0;
            var trimmedStartPoint = void 0;
            var trimmedEndPoint = void 0;
            // First unwrap inlineElement if it is partial
            if (inlineElement instanceof PartialInlineElement_1.default) {
                var partialInline = inlineElement;
                decoratedInline = partialInline.getDecoratedInline();
                trimmedStartPoint = partialInline.isStartPartial()
                    ? partialInline.getStartPoint()
                    : null;
                trimmedEndPoint = partialInline.isEndPartial() ? partialInline.getEndPoint() : null;
            }
            else {
                decoratedInline = inlineElement;
            }
            // Trim by start point
            if (this.startInline.isAfter(decoratedInline)) {
                // Out of scope
                decoratedInline = null;
            }
            else if (decoratedInline.getContainerNode() == this.startInline.getContainerNode() &&
                this.startInline instanceof PartialInlineElement_1.default &&
                this.startInline.isStartPartial) {
                // On same container, and startInline is a partial, compare start point
                if (!trimmedStartPoint ||
                    isEditorPointAfter_1.default(this.startInline.getStartPoint(), trimmedStartPoint)) {
                    // selection start is after the element, use selection start's as new start point
                    trimmedStartPoint = this.startInline.getStartPoint();
                }
            }
            // Trim by the end point
            if (decoratedInline != null) {
                if (decoratedInline.isAfter(this.endInline)) {
                    // Out of scope
                    decoratedInline = null;
                }
                else if (decoratedInline.getContainerNode() == this.endInline.getContainerNode() &&
                    this.endInline instanceof PartialInlineElement_1.default &&
                    this.endInline.isEndPartial) {
                    // On same container, and endInline is a partial, compare end point
                    if (!trimmedEndPoint ||
                        isEditorPointAfter_1.default(trimmedEndPoint, this.endInline.getEndPoint())) {
                        // selection end is before the element, use selection end's as new end point
                        trimmedEndPoint = this.endInline.getEndPoint();
                    }
                }
            }
            // Conclusion
            if (decoratedInline != null) {
                // testing following conditions:
                // 1) both points are null, means it is full node, no need to decorate
                // 2) both points are not null and they actually point to same point, this isn't an invalid inline element, set null
                // 3) rest, create a new partial inline element
                if (!trimmedStartPoint && !trimmedEndPoint) {
                    trimmedInline = decoratedInline;
                }
                else {
                    trimmedInline =
                        trimmedStartPoint &&
                            trimmedEndPoint &&
                            editorPointEquals_1.default(trimmedStartPoint, trimmedEndPoint)
                            ? null
                            : new PartialInlineElement_1.default(decoratedInline, trimmedStartPoint, trimmedEndPoint);
                }
            }
        }
        return trimmedInline;
    };
    // Check if a block is in scope
    // A block is considered in scope as long as it falls in the selection
    // or overlap with the selection start or end block
    EditorSelection.prototype.isBlockInScope = function (blockElement) {
        this.calculateStartEndIfNecessory();
        var inScope = false;
        var selStartBlock = this.startBlockElement;
        if (this.collapsed) {
            inScope = !selStartBlock && selStartBlock.equals(blockElement);
        }
        else {
            var selEndBlock = this.endBlockElement;
            // There are three cases that are considered as "block in scope"
            // 1) The start of selection falls on the block
            // 2) The end of selection falls on the block
            // 3) the block falls in-between selection start and end
            inScope =
                selStartBlock &&
                    selEndBlock &&
                    (blockElement.equals(selStartBlock) ||
                        blockElement.equals(selEndBlock) ||
                        (blockElement.isAfter(selStartBlock) && selEndBlock.isAfter(blockElement)));
        }
        return inScope;
    };
    // Check if start and end inline has been calculated and do so if not
    EditorSelection.prototype.calculateStartEndIfNecessory = function () {
        if (!this.startEndCalculated) {
            this.calculateStartEndInline();
            this.startEndCalculated = true;
        }
    };
    // calculate start and end inline element
    EditorSelection.prototype.calculateStartEndInline = function () {
        // Compute the start point
        this.startInline = BlockElement_1.getInlineElementAfterPoint(this.rootNode, this.startPoint, this.inlineElementFactory);
        if (this.collapsed) {
            // For collapsed range, set end to be same as start
            this.endInline = this.startInline;
        }
        else {
            // For non-collapsed range, get same for end point
            this.endInline = BlockElement_1.getInlineElementBeforePoint(this.rootNode, this.endPoint, this.inlineElementFactory);
            // it is possible that start and end points to same inline element, which
            // is often the case where users select partial text of a text node
            // in that case, we want to fix startInline and endInline to be a partial inline element
            if (this.startInline &&
                this.endInline &&
                this.startInline.getContainerNode() == this.endInline.getContainerNode()) {
                var fromPoint = void 0;
                var decoratedInline = void 0;
                if (this.startInline instanceof PartialInlineElement_1.default) {
                    fromPoint = this.startInline.getStartPoint();
                    decoratedInline = this
                        .startInline.getDecoratedInline();
                }
                else {
                    decoratedInline = this.startInline;
                }
                var toPoint = this.endInline instanceof PartialInlineElement_1.default
                    ? this.endInline.getEndPoint()
                    : null;
                this.startInline = this.endInline =
                    !fromPoint && !toPoint
                        ? decoratedInline
                        : new PartialInlineElement_1.default(decoratedInline, fromPoint, toPoint);
            }
        }
    };
    return EditorSelection;
}());
exports.default = EditorSelection;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The browser returned point (StartContainer/EndContainer as in Selection range) can be a container with offset pointing to a child
// in the container. This is bad when we do point to point comparison. This function normalizes to the point to closest leaf node.
// End goal of normalization:
// 1) The editor point has a container points to a leaf node (it can be a text node, or an element that has 0 child
// 2) offet of the new editor point means:
// offset = NodeBoundary.Begin: begin of the node
// offset = NodeBoundary.End: end of node for non-textual node (leaf element type node)
// offset = offset into text node: text node
function normalizeEditorPoint(container, offset) {
    var childCount;
    while (container.nodeType == 1 /* Element */ &&
        (childCount = container.childNodes.length) > 0) {
        var isAtEnd = offset >= childCount;
        var childContainer = isAtEnd ? container.lastChild : container.childNodes[offset];
        if (childContainer.nodeType == 1 /* Element */) {
            container = childContainer;
            offset = isAtEnd
                ? Math.max(childContainer.childNodes.length, 1 /* End */)
                : 0 /* Begin */;
        }
        else if (childContainer.nodeType == 3 /* Text */) {
            container = childContainer;
            offset = isAtEnd ? childContainer.data.length : 0 /* Begin */;
            break;
        }
        else {
            break;
        }
    }
    return { containerNode: container, offset: offset };
}
exports.default = normalizeEditorPoint;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
// The class that helps parse content around cursor
var CursorData = /** @class */ (function () {
    /**
     * Create a new CursorData instance
     * @param editor The editor instance
     */
    function CursorData(editor) {
        this.editor = editor;
    }
    Object.defineProperty(CursorData.prototype, "wordBeforeCursor", {
        /**
         * Get the word before cursor. The word is determined by scanning backwards till the first white space, the portion
         * between cursor and the white space is the word before cursor
         * @returns The word before cursor
         */
        get: function () {
            var _this = this;
            if (!this.cachedWordBeforeCursor && !this.backwardTraversingComplete) {
                this.continueTraversingBackwardTill(function () { return _this.cachedWordBeforeCursor != null; });
            }
            return this.cachedWordBeforeCursor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorData.prototype, "inlineElementBeforeCursor", {
        /**
         * Get the inline element before cursor
         * @returns The inlineElement before cursor
         */
        get: function () {
            if (!this.inlineBeforeCursor && !this.backwardTraversingComplete) {
                // Just return after it moves the needle by one step
                this.continueTraversingBackwardTill(function () { return true; });
            }
            return this.inlineBeforeCursor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorData.prototype, "inlineElementAfterCursor", {
        /**
         * Get the inline element after cursor
         * @returns The inline element after cursor
         */
        get: function () {
            if (!this.inlineAfterCursor && !this.forwardTraversingComplete) {
                // TODO: this may needs to be extended to support read more than just one inline element after cursor
                if (!this.forwardTraverser) {
                    this.forwardTraverser = this.editor.getContentTraverser(0 /* Block */, 2 /* SelectionStart */);
                }
                if (this.forwardTraverser) {
                    this.inlineAfterCursor = this.forwardTraverser.currentInlineElement;
                }
                // Set traversing to be complete once we read
                this.forwardTraversingComplete = true;
            }
            return this.inlineAfterCursor;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get X number of chars before cursor
     * The actual returned chars may be less than what is requested. e.g, length of text before cursor is less then X
     * @param numChars The X number of chars user want to get
     * @returns The actual chars we get as a string
     */
    CursorData.prototype.getXCharsBeforeCursor = function (numChars) {
        var _this = this;
        if ((!this.cachedTextBeforeCursor || this.cachedTextBeforeCursor.length < numChars) &&
            !this.backwardTraversingComplete) {
            // The cache is not built yet or not to the point the client asked for
            this.continueTraversingBackwardTill(function () {
                return _this.cachedTextBeforeCursor != null &&
                    _this.cachedTextBeforeCursor.length >= numChars;
            });
        }
        if (this.cachedTextBeforeCursor) {
            return this.cachedTextBeforeCursor.length >= numChars
                ? this.cachedTextBeforeCursor.substr(this.cachedTextBeforeCursor.length - numChars)
                : this.cachedTextBeforeCursor;
        }
        else {
            return '';
        }
    };
    /**
     * Get text section before cursor till stop condition is met.
     * This offers consumers to retrieve text section by section
     * The section essentially is just an inline element which has Container element
     * so that the consumer can remember it for anchoring popup or verification purpose
     * when cursor moves out of context etc.
     * @param stopFunc The callback stop function
     */
    CursorData.prototype.getTextSectionBeforeCursorTill = function (stopFunc) {
        // We cache all text sections read so far
        // Every time when you ask for textSection, we start with the cached first
        // and resort to further reading once we exhausted with the cache
        var shouldStop = false;
        if (this.inlineElementsBeforeCursor && this.inlineElementsBeforeCursor.length > 0) {
            for (var i = 0; i < this.inlineElementsBeforeCursor.length; i++) {
                shouldStop = stopFunc(this.inlineElementsBeforeCursor[i]);
                if (shouldStop) {
                    break;
                }
            }
        }
        // The cache does not completely fulfill the need, resort to extra parsing
        if (!shouldStop && !this.backwardTraversingComplete) {
            this.continueTraversingBackwardTill(stopFunc);
        }
    };
    /**
     * Get first non textual inline element before cursor
     * @returns First non textutal inline element before cursor or null if no such element exists
     */
    CursorData.prototype.getFirstNonTextInlineBeforeCursor = function () {
        if (!this.firstNonTextInlineBeforeCursor && !this.backwardTraversingComplete) {
            this.continueTraversingBackwardTill(function () {
                return false;
            });
        }
        return this.firstNonTextInlineBeforeCursor;
    };
    /// Continue traversing backward till stop condition is met or begin of block is reached
    CursorData.prototype.continueTraversingBackwardTill = function (stopFunc) {
        if (!this.backwardTraverser) {
            this.backwardTraverser = this.editor.getContentTraverser(0 /* Block */, 2 /* SelectionStart */);
        }
        if (!this.backwardTraverser) {
            return;
        }
        var previousInline = this.backwardTraverser.getPreviousInlineElement();
        while (!this.backwardTraversingComplete) {
            if (previousInline && roosterjs_editor_dom_1.isTextualInlineElement(previousInline)) {
                var textContent = previousInline.getTextContent();
                if (!this.inlineBeforeCursor) {
                    // Make sure the inline before cursor is a non-empty text inline
                    this.inlineBeforeCursor = previousInline;
                }
                // build the word before cursor if it is not built yet
                if (!this.cachedWordBeforeCursor) {
                    // Match on the white space, the portion after space is on the index of 1 of the matched result
                    // (index at 0 is whole match result, index at 1 is the word)
                    var matches = roosterjs_editor_dom_1.matchWhiteSpaces(textContent);
                    if (matches && matches.length == 2) {
                        this.cachedWordBeforeCursor = matches[1];
                        // if this.cachedTextBeforeCursor is not null, what we get is just a portion of it, need to append this.cachedTextBeforeCursor
                        if (this.cachedTextBeforeCursor) {
                            this.cachedWordBeforeCursor =
                                this.cachedWordBeforeCursor + this.cachedTextBeforeCursor;
                        }
                    }
                }
                this.cachedTextBeforeCursor = !this.cachedTextBeforeCursor
                    ? textContent
                    : textContent + this.cachedTextBeforeCursor;
                if (!this.inlineElementsBeforeCursor) {
                    this.inlineElementsBeforeCursor = [previousInline];
                }
                else {
                    this.inlineElementsBeforeCursor.push(previousInline);
                }
                // Check if stop condition is met
                if (stopFunc && stopFunc(previousInline)) {
                    break;
                }
            }
            else {
                /* non-textual inline or null is seen */
                if (!this.inlineBeforeCursor) {
                    // When we're here, it means we first hit a non-text inline node
                    // Make sure to set inlineBeforeCursor if it is not set
                    this.inlineBeforeCursor = previousInline;
                }
                this.firstNonTextInlineBeforeCursor = previousInline;
                this.backwardTraversingComplete = true;
                if (!this.cachedWordBeforeCursor) {
                    // if parsing is done, whatever we get so far in this.cachedText should also be in this.cachedWordBeforeCursor
                    this.cachedWordBeforeCursor = this.cachedTextBeforeCursor;
                }
                // When a non-textual inline element, or null is seen, we consider parsing complete
                // TODO: we may need to change this if there is a future need to parse beyond text, i.e.
                // we have aaa @someone bbb<cursor>, and we want to read the text before @someone
                break;
            }
            previousInline = this.backwardTraverser.getPreviousInlineElement();
        }
    };
    return CursorData;
}());
exports.default = CursorData;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DefaultShortcut_1 = __webpack_require__(52);
exports.DefaultShortcut = DefaultShortcut_1.default;
var HyperLink_1 = __webpack_require__(105);
exports.HyperLink = HyperLink_1.default;
var ContentEdit_1 = __webpack_require__(106);
exports.ContentEdit = ContentEdit_1.default;
var Paste_1 = __webpack_require__(107);
exports.Paste = Paste_1.default;
var ContentEditFeatures_1 = __webpack_require__(47);
exports.getDefaultContentEditFeatures = ContentEditFeatures_1.getDefaultContentEditFeatures;
var Watermark_1 = __webpack_require__(115);
exports.Watermark = Watermark_1.default;
var TableResize_1 = __webpack_require__(116);
exports.TableResize = TableResize_1.default;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UndoSnapshots_1 = __webpack_require__(26);
var snapshotUtils_1 = __webpack_require__(27);
var KEY_BACKSPACE = 8;
var KEY_DELETE = 46;
var KEY_SPACE = 32;
var KEY_ENTER = 13;
var KEY_PAGEUP = 33;
var KEY_DOWN = 40;
/**
 * Provides snapshot based undo service for Editor
 */
var Undo = /** @class */ (function () {
    /**
     * Create an instance of Undo
     * @param preserveSnapshots True to preserve the snapshots after dispose, this allows
     * this object to be reused when editor is disposed and created again
     * @param maxBufferSize The max buffer size for snapshots. Default value is 10MB
     */
    function Undo(preserveSnapshots, maxBufferSize) {
        if (maxBufferSize === void 0) { maxBufferSize = 1e7; }
        var _this = this;
        this.preserveSnapshots = preserveSnapshots;
        this.maxBufferSize = maxBufferSize;
        this.onNativeEvent = function () {
            _this.addUndoSnapshot();
            _this.hasNewContent = true;
        };
    }
    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    Undo.prototype.initialize = function (editor) {
        this.editor = editor;
        this.onDropDisposer = this.editor.addDomEventHandler('drop', this.onNativeEvent);
        this.onCutDisposer = this.editor.addDomEventHandler('cut', this.onNativeEvent);
        // Add an initial snapshot if snapshotsManager isn't created yet
        if (!this.undoSnapshots) {
            this.addUndoSnapshot();
        }
    };
    /**
     * Dispose this plugin
     */
    Undo.prototype.dispose = function () {
        this.onDropDisposer();
        this.onCutDisposer();
        this.onDropDisposer = null;
        this.onCutDisposer = null;
        this.editor = null;
        if (!this.preserveSnapshots) {
            this.clear();
        }
    };
    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    Undo.prototype.onPluginEvent = function (event) {
        // if editor is in IME, don't do anything
        if (this.editor.isInIME()) {
            return;
        }
        switch (event.eventType) {
            case 0 /* KeyDown */:
                this.onKeyDown(event);
                break;
            case 1 /* KeyPress */:
                this.onKeyPress(event);
                break;
            case 3 /* CompositionEnd */:
                this.clearRedoForInput();
                break;
            case 6 /* ContentChanged */:
                if (!this.isRestoring) {
                    this.clearRedoForInput();
                }
                break;
        }
    };
    /**
     * Clear all existing undo snapshots
     */
    Undo.prototype.clear = function () {
        this.undoSnapshots = null;
        this.hasNewContent = false;
    };
    /**
     * Restore an undo snapshot to editor
     */
    Undo.prototype.undo = function () {
        if (this.hasNewContent) {
            this.addUndoSnapshot();
        }
        this.restoreSnapshot(-1 /*previousSnapshot*/);
    };
    /**
     * Restore a redo snapshot to editor
     */
    Undo.prototype.redo = function () {
        this.restoreSnapshot(1 /*nextSnapshot*/);
    };
    /**
     * Whether there is a snapshot for undo
     */
    Undo.prototype.canUndo = function () {
        return this.hasNewContent || this.getSnapshotsManager().canMove(-1 /*previousSnapshot*/);
    };
    /**
     * Whether there is a snapshot for redo
     */
    Undo.prototype.canRedo = function () {
        return this.getSnapshotsManager().canMove(1 /*nextSnapshot*/);
    };
    /**
     * Add an undo snapshot
     */
    Undo.prototype.addUndoSnapshot = function () {
        var snapshot = snapshotUtils_1.buildSnapshot(this.editor);
        this.getSnapshotsManager().addSnapshot(snapshot);
        this.hasNewContent = false;
    };
    Undo.prototype.getSnapshotsManager = function () {
        if (!this.undoSnapshots) {
            this.undoSnapshots = new UndoSnapshots_1.default(this.maxBufferSize);
        }
        return this.undoSnapshots;
    };
    Undo.prototype.restoreSnapshot = function (delta) {
        var snapshot = this.getSnapshotsManager().move(delta);
        if (snapshot != null) {
            try {
                this.isRestoring = true;
                snapshotUtils_1.restoreSnapshot(this.editor, snapshot);
            }
            finally {
                this.isRestoring = false;
            }
        }
    };
    Undo.prototype.onKeyDown = function (pluginEvent) {
        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        var evt = pluginEvent.rawEvent;
        if (evt.which == KEY_BACKSPACE || evt.which == KEY_DELETE) {
            var selectionRange = this.editor.getSelectionRange();
            // Add snapshot when
            // 1. Something has been selected (not collapsed), or
            // 2. It has a different key code from the last keyDown event (to prevent adding too many snapshot when keeping press the same key), or
            // 3. Ctrl/Meta key is pressed so that a whole word will be deleted
            if (selectionRange &&
                (!selectionRange.collapsed ||
                    this.lastKeyPress != evt.which ||
                    evt.ctrlKey ||
                    evt.metaKey)) {
                this.addUndoSnapshot();
            }
            // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
            this.hasNewContent = true;
            this.lastKeyPress = evt.which;
        }
        else if (evt.which >= KEY_PAGEUP && evt.which <= KEY_DOWN) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (this.hasNewContent) {
                this.addUndoSnapshot();
            }
            this.lastKeyPress = 0;
        }
    };
    Undo.prototype.onKeyPress = function (pluginEvent) {
        var evt = pluginEvent.rawEvent;
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing hasNewContent to true when meta + v to paste on Safari.
            return;
        }
        var shouldTakeUndo = false;
        var selectionRange = this.editor.getSelectionRange();
        if (selectionRange && !selectionRange.collapsed) {
            // The selection will be removed, should take undo
            shouldTakeUndo = true;
        }
        else if ((evt.which == KEY_SPACE && this.lastKeyPress != KEY_SPACE) ||
            evt.which == KEY_ENTER) {
            shouldTakeUndo = true;
        }
        if (shouldTakeUndo) {
            this.addUndoSnapshot();
        }
        else {
            this.clearRedoForInput();
        }
        this.lastKeyPress = evt.which;
    };
    Undo.prototype.clearRedoForInput = function () {
        this.getSnapshotsManager().clearRedo();
        this.lastKeyPress = 0;
        this.hasNewContent = true;
    };
    return Undo;
}());
exports.default = Undo;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
var MAXSIZELIMIT = 10000000;
var UndoSnapshots = /** @class */ (function () {
    function UndoSnapshots(maxSize) {
        if (maxSize === void 0) { maxSize = MAXSIZELIMIT; }
        this.maxSize = maxSize;
        this.snapshots = [];
        this.totalSize = 0;
        this.currentIndex = -1;
    }
    UndoSnapshots.prototype.canMove = function (delta) {
        var newIndex = this.currentIndex + delta;
        return newIndex >= 0 && newIndex < this.snapshots.length;
    };
    UndoSnapshots.prototype.move = function (delta) {
        if (this.canMove(delta)) {
            this.currentIndex += delta;
            return this.snapshots[this.currentIndex];
        }
        else {
            return null;
        }
    };
    UndoSnapshots.prototype.addSnapshot = function (snapshot) {
        if (this.currentIndex < 0 || snapshot != this.snapshots[this.currentIndex]) {
            this.clearRedo();
            this.snapshots.push(snapshot);
            this.currentIndex++;
            this.totalSize += snapshot.length;
            var removeCount = 0;
            while (removeCount < this.snapshots.length && this.totalSize > this.maxSize) {
                this.totalSize -= this.snapshots[removeCount].length;
                removeCount++;
            }
            if (removeCount > 0) {
                this.snapshots.splice(0, removeCount);
                this.currentIndex -= removeCount;
            }
        }
    };
    UndoSnapshots.prototype.clearRedo = function () {
        if (this.canMove(1)) {
            var removedSize = 0;
            for (var i = this.currentIndex + 1; i < this.snapshots.length; i++) {
                removedSize += this.snapshots[i].length;
            }
            this.snapshots.splice(this.currentIndex + 1);
            this.totalSize -= removedSize;
        }
    };
    return UndoSnapshots;
}());
exports.default = UndoSnapshots;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BrowserData_1 = __webpack_require__(10);
var roosterjs_editor_dom_1 = __webpack_require__(0);
// Undo cursor marker
var CURSOR_START = 'cursor-start';
var CURSOR_END = 'cursor-end';
// Build undo snapshot
function buildSnapshot(editor) {
    // Build the snapshot in-between adding and removing cursor marker
    var selectionRange = editor.getSelectionRange();
    if (selectionRange) {
        addCursorMarkersToSelection(editor, selectionRange);
    }
    var htmlContent = editor.getContent(false /*triggerExtractContentEvent*/) || '';
    // This extra update selection to cursor marker post building snapshot is added for Mac safari
    // We temporarily inject a cursor marker to current selection prior to build snapshot and remove it afterwards
    // The insertion of cursor marker for some reasons has caused the selection maintained in browser to be lost.
    // This restores the selection prior to removing the cursor marker.
    // The code may throw error for Firefox and IE, hence keep it only for Mac Safari
    if (BrowserData_1.default.isSafari) {
        updateSelectionToCursorMarkers(editor);
    }
    removeCursorMarkers(editor);
    return htmlContent;
}
exports.buildSnapshot = buildSnapshot;
// Restore a snapshot
function restoreSnapshot(editor, snapshot) {
    editor.setContent(snapshot);
    // Restore the selection and delete the cursor marker afterwards
    updateSelectionToCursorMarkers(editor);
    removeCursorMarkers(editor);
}
exports.restoreSnapshot = restoreSnapshot;
// Remove the temporarily added cursor markers
function removeCursorMarkers(editor) {
    removeCursorMarkerById(editor, CURSOR_START);
    removeCursorMarkerById(editor, CURSOR_END);
}
// Temporarily inject a SPAN marker to the selection which is used to remember where the selection is
// The marker is used on restore selection on undo
function addCursorMarkersToSelection(editor, selectionRange) {
    // First to insert the start marker
    var startMarker = createCursorMarker(editor, CURSOR_START);
    var startPoint = roosterjs_editor_dom_1.normalizeEditorPoint(selectionRange.startContainer, selectionRange.startOffset);
    insertCursorMarkerToEditorPoint(editor, startPoint, startMarker);
    // Then the end marker
    // For collapsed selection, use the start marker as the editor so that
    // the end marker is always placed after the start marker
    var endMarker = createCursorMarker(editor, CURSOR_END);
    var endPoint = selectionRange.collapsed
        ? { containerNode: startMarker, offset: 1 /* End */ }
        : roosterjs_editor_dom_1.normalizeEditorPoint(selectionRange.endContainer, selectionRange.endOffset);
    insertCursorMarkerToEditorPoint(editor, endPoint, endMarker);
}
// Update selection to where cursor marker is
// This is used in post building snapshot to restore selection
function updateSelectionToCursorMarkers(editor) {
    var startMarker = getCursorMarkerByUniqueId(editor, CURSOR_START);
    var endMarker = getCursorMarkerByUniqueId(editor, CURSOR_END);
    if (startMarker && endMarker) {
        var selectionRange = editor.getDocument().createRange();
        selectionRange.setEndBefore(endMarker);
        selectionRange.setStartAfter(startMarker);
        editor.updateSelection(selectionRange);
    }
}
// Insert cursor marker to an editor point
// The original code uses range.insertNode which "damages" some browser node & selection state
// i.e. on chrome, when the cursor is right at begin of a list, range.insertNode will cause some
// extra "empty" text node to be created as cursor marker is inserted. That extra "empty" text node
// will cause indentation to behave really weirdly
// This revised version uses DOM parentNode.insertBefore when it sees the insertion point is in node boundary_begin
// which gives precise control over DOM structure and solves the chrome issue
function insertCursorMarkerToEditorPoint(editor, editorPoint, cursorMaker) {
    if (editor.contains(editorPoint.containerNode)) {
        var containerNode = editorPoint.containerNode;
        var offset = editorPoint.offset;
        var parentNode = containerNode.parentNode;
        if (editorPoint.offset == 0 /* Begin */) {
            // For boundary_begin, insert the marker before the node
            parentNode.insertBefore(cursorMaker, containerNode);
        }
        else if (containerNode.nodeType == 1 /* Element */ ||
            (containerNode.nodeType == 3 /* Text */ &&
                editorPoint.offset == containerNode.nodeValue.length)) {
            // otherwise, insert after
            parentNode.insertBefore(cursorMaker, containerNode.nextSibling);
        }
        else {
            // This is for insertion in-between a text node
            var insertionRange = editor.getDocument().createRange();
            insertionRange.setStart(containerNode, offset);
            insertionRange.collapse(true /* toStart */);
            insertionRange.insertNode(cursorMaker);
        }
    }
}
// Remove an element from editor by Id
function removeCursorMarkerById(editor, id) {
    getCursorMarkNodes(editor, id, function (span) {
        var parent = span.parentNode;
        span.parentNode.removeChild(span);
        if (BrowserData_1.default.isSafari) {
            parent.normalize();
        }
    });
}
// Get an element by unique id. If there is more than one element by the id, it should return null
function getCursorMarkerByUniqueId(editor, id) {
    var nodes = getCursorMarkNodes(editor, id);
    return nodes && nodes.length == 1 ? nodes[0] : null;
}
function getCursorMarkNodes(editor, id, callback) {
    return editor.queryElements("span[id=\"" + id + "\"]:empty", callback);
}
// Create a cursor marker by id
function createCursorMarker(editor, id) {
    var editorDocument = editor.getDocument();
    var cursorMarker = editorDocument.createElement('SPAN');
    cursorMarker.id = id;
    return cursorMarker;
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Checks if the two EditorPoint points to same location
function editorPointEquals(point1, point2) {
    return point1.containerNode == point2.containerNode && point1.offset == point2.offset;
}
exports.default = editorPointEquals;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getComputedStyle_1 = __webpack_require__(15);
// Checks if the node is a block like element. Block like element are usually those P, DIV, LI, TD etc.
// TODO: should inline-block be considered as block?
// Other block like style to consider: table-caption, table-header-group, table-footer-group etc.
function isBlockElement(node) {
    if (node && node.nodeType == 1 /* Element */) {
        var displayStyle = getComputedStyle_1.default(node, 'display');
        return (displayStyle == 'block' || displayStyle == 'list-item' || displayStyle == 'table-cell');
    }
    return false;
}
exports.default = isBlockElement;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shouldSkipNode_1 = __webpack_require__(18);
var getLeafSibling_1 = __webpack_require__(16);
function getLeafNode(rootNode, isFirst) {
    var getChild = isFirst ? function (node) { return node.firstChild; } : function (node) { return node.lastChild; };
    var result = getChild(rootNode);
    while (result && getChild(result)) {
        result = getChild(result);
    }
    if (result && shouldSkipNode_1.default(result)) {
        result = getLeafSibling_1.getLeafSibling(rootNode, result, isFirst);
    }
    return result;
}
// Get the first meaningful leaf node
// NOTE: this can return null for empty container or
// container that does not contain any meaningful node
function getFirstLeafNode(rootNode) {
    return getLeafNode(rootNode, true /*isFirst*/);
}
exports.getFirstLeafNode = getFirstLeafNode;
// Get the last meaningful leaf node
// NOTE: this can return null for empty container or
// container that does not contain any meaningful node
function getLastLeafNode(rootNode) {
    return getLeafNode(rootNode, false /*isFirst*/);
}
exports.getLastLeafNode = getLastLeafNode;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NodeInlineElement_1 = __webpack_require__(8);
// This is an inline element representing an Html image
var ImageInlineElement = /** @class */ (function (_super) {
    __extends(ImageInlineElement, _super);
    function ImageInlineElement(containerNode, parentBlock) {
        return _super.call(this, containerNode, parentBlock) || this;
    }
    return ImageInlineElement;
}(NodeInlineElement_1.default));
exports.default = ImageInlineElement;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fromHtml_1 = __webpack_require__(19);
// Wrap the node with html and return the wrapped node
function wrap(node, htmlFragment) {
    if (!node) {
        return null;
    }
    var wrapper = node;
    if (htmlFragment) {
        wrapper = fromHtml_1.default(htmlFragment, node.ownerDocument)[0];
        if (node.parentNode) {
            node.parentNode.insertBefore(wrapper, node);
            node.parentNode.removeChild(node);
        }
        wrapper.appendChild(node);
    }
    return wrapper;
}
exports.default = wrap;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NodeInlineElement_1 = __webpack_require__(8);
// This is inline element presenting an html hyperlink
var LinkInlineElement = /** @class */ (function (_super) {
    __extends(LinkInlineElement, _super);
    function LinkInlineElement(containerNode, parentBlock) {
        return _super.call(this, containerNode, parentBlock) || this;
    }
    return LinkInlineElement;
}(NodeInlineElement_1.default));
exports.default = LinkInlineElement;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getTagOfNode_1 = __webpack_require__(7);
var HTML_REGEX = /<html[^>]*>[\s\S]*<\/html>/i;
var START_FRAGMENT = '<!--StartFragment-->';
var END_FRAGMENT = '<!--EndFragment-->';
var LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
var LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
var LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
var LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;
/**
 * Sanitize HTML string
 * This function will do the following work:
 * 1. Convert global CSS into inline CSS
 * 2. Remove dangerous HTML tags and attributes
 * 3. Remove useless CSS properties
 * @param html The input HTML
 * @param additionalStyleNodes additional style nodes for inline css converting
 * @param convertInlineCssOnly Whether only convert inline css and skip html content sanitizing
 * @param propertyCallbacks A callback function map to handle HTML properties
 * @param preserveFragmentOnly If set to true, only preserve the html content between <!--StartFragment--> and <!--Endfragment-->
 */
function sanitizeHtml(html, additionalStyleNodes, convertInlineCssOnly, propertyCallbacks, preserveFragmentOnly, currentStyle) {
    var parser = new DOMParser();
    var matches = HTML_REGEX.exec(html);
    html = matches ? matches[0] : html;
    var doc;
    if (!html ||
        !html.trim() ||
        !(doc = parser.parseFromString(html, 'text/html')) ||
        !doc.body ||
        !doc.body.firstChild) {
        return '';
    }
    // 1. Filter out html code outside of Fragment tags if need
    if (preserveFragmentOnly) {
        html = trimWithFragment(html);
        doc.body.innerHTML = html;
    }
    // 2. Convert global CSS into inline CSS
    convertInlineCss(doc, additionalStyleNodes);
    // 3, 4: Remove dangerous HTML tags and attributes, remove useless CSS properties
    if (!convertInlineCssOnly) {
        var callbackPropertyNames = (propertyCallbacks ? Object.keys(propertyCallbacks) : []).map(function (name) { return name.toLowerCase(); });
        removeUnusedCssAndDangerousContent(doc.body, callbackPropertyNames, propertyCallbacks, currentStyle || {});
    }
    return doc.body.innerHTML;
}
exports.default = sanitizeHtml;
var ALLOWED_HTML_TAGS = 'BODY,H1,H2,H3,H4,H5,H6,FORM,P,BR,NOBR,HR,ACRONYM,ABBR,ADDRESS,B,BDI,BDO,BIG,BLOCKQUOTE,CENTER,CITE,CODE,DEL,DFN,EM,FONT,I,INS,KBD,MARK,METER,PRE,PROGRESS,Q,RP,RT,RUBY,S,SAMP,SMALL,STRIKE,STRONG,SUB,SUP,TEMPLATE,TIME,TT,U,VAR,WBR,XMP,INPUT,TEXTAREA,BUTTON,SELECT,OPTGROUP,OPTION,LABEL,FIELDSET,LEGEND,DATALIST,OUTPUT,IMG,MAP,AREA,CANVAS,FIGCAPTION,FIGURE,PICTURE,A,NAV,UL,OL,LI,DIR,UL,DL,DT,DD,MENU,MENUITEM,TABLE,CAPTION,TH,TR,TD,THEAD,TBODY,TFOOT,COL,COLGROUP,DIV,SPAN,HEADER,FOOTER,MAIN,SECTION,ARTICLE,ASIDE,DETAILS,DIALOG,SUMMARY,DATA'.split(',');
var ALLOWED_HTML_ATTRIBUTES = 'accept,align,alt,checked,cite,cols,colspan,contextmenu,coords,datetime,default,dir,dirname,disabled,download,headers,height,hidden,high,href,hreflang,ismap,kind,label,lang,list,low,max,maxlength,media,min,multiple,open,optimum,pattern,placeholder,readonly,rel,required,reversed,rows,rowspan,scope,selected,shape,size,sizes,span,spellcheck,src,srclang,srcset,start,step,style,tabindex,target,title,translate,type,usemap,value,width,wrap'.split(',');
var DROPPED_STYLE = ['white-space'];
function convertInlineCss(doc, additionalStyleNodes) {
    var styleNodes = toArray(doc.querySelectorAll('style'));
    var styleSheets = (additionalStyleNodes || [])
        .reverse()
        .map(function (node) { return node.sheet; })
        .concat(styleNodes.map(function (node) { return node.sheet; }).reverse());
    for (var _i = 0, styleSheets_1 = styleSheets; _i < styleSheets_1.length; _i++) {
        var styleSheet = styleSheets_1[_i];
        var _loop_1 = function (j) {
            // Skip any none-style rule, i.e. @page
            var styleRule = styleSheet.cssRules[j];
            var text = styleRule && styleRule.style ? styleRule.style.cssText : null;
            if (styleRule.type != CSSRule.STYLE_RULE || !text || !styleRule.selectorText) {
                return "continue";
            }
            // Make sure the selector is not empty
            for (var _i = 0, _a = styleRule.selectorText.split(','); _i < _a.length; _i++) {
                var selector = _a[_i];
                if (!selector || !selector.trim() || selector.indexOf(':') >= 0) {
                    continue;
                }
                var nodes = toArray(doc.querySelectorAll(selector));
                // Always put existing styles after so that they have higher priority
                // Which means if both global style and inline style apply to the same element,
                // inline style will have higher priority
                nodes.forEach(function (node) {
                    return node.setAttribute('style', text + (node.getAttribute('style') || ''));
                });
            }
        };
        for (var j = styleSheet.cssRules.length - 1; j >= 0; j--) {
            _loop_1(j);
        }
    }
}
function nativeAssign(source) {
    return Object.assign({}, source);
}
function customAssign(source) {
    var result = {};
    for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
        var key = _a[_i];
        result[key] = source[key];
    }
    return result;
}
var assign = Object.assign ? nativeAssign : customAssign;
function removeUnusedCssAndDangerousContent(node, callbackPropertyNames, propertyCallbacks, currentStyle) {
    var thisStyle = assign(currentStyle);
    var nodeType = node.nodeType;
    var tag = getTagOfNode_1.default(node) || '';
    var isElement = nodeType == 1 /* Element */;
    var isText = nodeType == 3 /* Text */;
    if ((isElement && ALLOWED_HTML_TAGS.indexOf(tag) < 0 && tag.indexOf(':') < 0) ||
        (isText && /^[\r\n]*$/g.test(node.nodeValue)) ||
        (!isElement && !isText)) {
        node.parentNode.removeChild(node);
    }
    if (isText && currentStyle['white-space'] == 'pre') {
        node.nodeValue = node.nodeValue.replace(/\s\s/g, ' \u00A0');
    }
    else if (nodeType == 1 /* Element */) {
        var element = node;
        if (element.hasAttribute('style')) {
            removeUnusedCss(element, thisStyle);
        }
        removeDisallowedAttributes(element, callbackPropertyNames, propertyCallbacks);
        var child = element.firstChild;
        var next = void 0;
        for (; child; child = next) {
            next = child.nextSibling;
            removeUnusedCssAndDangerousContent(child, callbackPropertyNames, propertyCallbacks, thisStyle);
        }
    }
}
function removeUnusedCss(element, thisStyle) {
    var tag = getTagOfNode_1.default(element);
    var source = element
        .getAttribute('style')
        .split(';')
        .filter(function (style) { return style && style.trim() != ''; });
    var result = source.filter(function (style) {
        var pair = style.split(':');
        if (pair.length == 2) {
            var name_1 = pair[0].trim().toLowerCase();
            var value = pair[1].trim().toLowerCase();
            var isInheritable = thisStyle[name_1] != undefined;
            var keep = value != 'inherit' &&
                ((isInheritable && value != thisStyle[name_1]) ||
                    (!isInheritable && value != 'initial' && value != 'normal')) &&
                !shouldRemove(tag, name_1, value);
            if (keep && isInheritable) {
                thisStyle[name_1] = value;
            }
            return keep && DROPPED_STYLE.indexOf(name_1) < 0;
        }
        else {
            return false;
        }
    });
    if (source.length != result.length) {
        if (result.length > 0) {
            element.setAttribute('style', result.join(';'));
        }
        else {
            element.removeAttribute('style');
        }
    }
}
function shouldRemove(tag, name, value) {
    if (name == 'position') {
        return true;
    }
    if (value.indexOf('expression') >= 0) {
        return true;
    }
    if (tag == 'LI' && name == 'width') {
        return true;
    }
    return false;
}
function removeDisallowedAttributes(element, callbackPropertyNames, propertyCallbacks) {
    for (var i = element.attributes.length - 1; i >= 0; i--) {
        var attribute = element.attributes[i];
        var name_2 = attribute.name.toLowerCase().trim();
        var value = attribute.value.trim();
        if (callbackPropertyNames.indexOf(name_2) >= 0) {
            value = propertyCallbacks[name_2](value);
            if (value != null) {
                attribute.value = value;
            }
            else {
                element.removeAttribute(name_2);
            }
        }
        else if (ALLOWED_HTML_ATTRIBUTES.indexOf(name_2) < 0 ||
            value.toLowerCase().indexOf('script:') >= 0) {
            element.removeAttribute(attribute.name);
        }
    }
}
function toArray(list) {
    return [].slice.call(list);
}
function trimWithFragment(html) {
    var startIndex = html.indexOf(START_FRAGMENT);
    var endIndex = html.lastIndexOf(END_FRAGMENT);
    if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        var before = html.substr(0, startIndex);
        html = html.substring(startIndex + START_FRAGMENT.length, endIndex);
        // Fix up table for Excel
        if (html.match(LAST_TD_END_REGEX)) {
            var trMatch = before.match(LAST_TR_REGEX);
            var tr = trMatch ? trMatch[0] : '<TR>';
            html = tr + html + '</TR>';
        }
        if (html.match(LAST_TR_END_REGEX)) {
            var tableMatch = before.match(LAST_TABLE_REGEX);
            var table = tableMatch ? tableMatch[0] : '<TABLE>';
            html = table + html + '</TABLE>';
        }
    }
    return html;
}


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
// HTML void elements
// Per https://www.w3.org/TR/html/syntax.html#syntax-elements, cannot have child nodes
// This regex is used when we move focus to very begin of editor. We should avoid putting focus inside
// void elements so users don't accidently create child nodes in them
var HTML_VOID_ELEMENTS_REGEX = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/i;
// check if it is html void element. void element cannot have childen
function isVoidHtmlElement(element) {
    return element && HTML_VOID_ELEMENTS_REGEX.test(roosterjs_editor_dom_1.getTagOfNode(element)) ? true : false;
}
exports.default = isVoidHtmlElement;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isRangeInContainer(range, container) {
    var ancestorContainer = range ? range.commonAncestorContainer : null;
    // use the parentNode if ancestorContainer is a text node
    if (ancestorContainer && ancestorContainer.nodeType == 3 /* Text */) {
        ancestorContainer = ancestorContainer.parentNode;
    }
    return (ancestorContainer &&
        (container == ancestorContainer || container.contains(ancestorContainer)));
}
exports.default = isRangeInContainer;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Replace the specified range with a node
 * @param editor The editor instance
 * @param range The range in which content needs to be replaced
 * @param node The node to be inserted
 * @param exactMatch exactMatch is to match exactly
 * @returns True if we complete the replacement, false otherwise
 */
function replaceRangeWithNode(editor, range, node, exactMatch) {
    // Make sure the range and node is valid
    if (!range || !node) {
        return false;
    }
    var backupRange = editor.getSelectionRange();
    range.deleteContents();
    range.insertNode(node);
    if (exactMatch) {
        range.setEndAfter(node);
        range.collapse(false /*toStart*/);
        editor.updateSelection(range);
    }
    else if (backupRange && editor.contains(backupRange.startContainer)) {
        editor.updateSelection(backupRange);
    }
    return true;
}
exports.default = replaceRangeWithNode;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queryNodesWithSelection_1 = __webpack_require__(3);
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_dom_1 = __webpack_require__(0);
var EVENTDATACACHE_LISTSTATE = 'LISTSTATE';
/**
 * Get the list state at selection
 * The list state refers to the HTML elements <OL> or <UL>
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will query the first <LI> node in selection and return the list state of its direct parent
 * @returns The list state. ListState.Numbering indicates <OL>, ListState.Bullets indicates <UL>,
 * ListState.None indicates no <OL> or <UL> elements found at current selection
 */
function cacheGetListState(editor, event) {
    return roosterjs_editor_core_1.cacheGetEventData(event, EVENTDATACACHE_LISTSTATE, function () {
        var itemNodes = queryNodesWithSelection_1.default(editor, 'li');
        if (itemNodes.length > 0) {
            var tagName = roosterjs_editor_dom_1.getTagOfNode(itemNodes[0].parentNode);
            if (tagName == 'OL') {
                return 2 /* Numbering */;
            }
            else if (tagName == 'UL') {
                return 1 /* Bullets */;
            }
        }
        return 0 /* None */;
    });
}
exports.default = cacheGetListState;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
/**
 * Set background color at current selection
 * @param editor The editor instance
 * @param color The color string, can be any of the predefined color names (e.g, 'red')
 * or hexadecimal color string (e.g, '#FF0000') or rgb value (e.g, 'rgb(255, 0, 0)') supported by browser.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setBackgroundColor(editor, color) {
    editor.focus();
    // TODO: Verify color
    var validatedColor = color.trim();
    if (validatedColor) {
        execFormatWithUndo_1.default(editor, function () {
            editor.applyInlineStyle(function (element) {
                element.style.backgroundColor = validatedColor;
            });
        });
    }
}
exports.default = setBackgroundColor;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
/**
 * Set font name at selection
 * @param editor The editor instance
 * @param fontName The fontName string, should be a valid CSS font-family style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setFontName(editor, fontName) {
    editor.focus();
    // TODO: Verify font name
    var validatedFontName = fontName.trim();
    if (validatedFontName) {
        execFormatWithUndo_1.default(editor, function () {
            // The browser provided execCommand creates a HTML <font> tag with face attribute. <font> is not HTML5 standard
            // (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
            // for here, we use CSS font-family style
            editor.applyInlineStyle(function (element) {
                element.style.fontFamily = validatedFontName;
            });
        });
    }
}
exports.default = setFontName;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
/**
 * Set font size at selection
 * @param editor The editor instance
 * @param fontSize The fontSize string, should be a valid CSS font-size style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setFontSize(editor, fontSize) {
    editor.focus();
    // TODO: Verify font size
    var validatedFontSize = fontSize.trim();
    if (validatedFontSize) {
        execFormatWithUndo_1.default(editor, function () {
            // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
            // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
            // for here, we use CSS font-size style
            editor.applyInlineStyle(function (element) {
                element.style.fontSize = fontSize;
            });
        });
    }
}
exports.default = setFontSize;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
/**
 * Set text color at selection
 * @param editor The editor instance
 * @param color The color string, can be any of the predefined color names (e.g, 'red')
 * or hexadecimal color string (e.g, '#FF0000') or rgb value (e.g, 'rgb(255, 0, 0)') supported by browser.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setTextColor(editor, color) {
    editor.focus();
    // TODO: Verify color
    var validatedColor = color.trim();
    if (validatedColor) {
        execFormatWithUndo_1.default(editor, function () {
            editor.applyInlineStyle(function (element) {
                element.style.color = validatedColor;
            });
        });
    }
}
exports.default = setTextColor;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// http exclude matching regex
// invalid URL example (in paricular on IE and Edge):
// - http://www.bing.com%00, %00 before ? (question mark) is considered invalid. IE/Edge throws invalid argument exception
// - http://www.bing.com%1, %1 is invalid
// - http://www.bing.com%g, %g is invalid (IE and Edge expects a two hex value after a %)
// - http://www.bing.com%, % as ending is invalid (IE and Edge expects a two hex value after a %)
// All above % cases if they're after ? (question mark) is then considered valid again
// Similar for @, it needs to be after / (forward slash), or ? (question mark). Otherwise IE/Edge will throw security exception
// - http://www.bing.com@name, @name before ? (question mark) is considered invalid
// - http://www.bing.com/@name, is valid sine it is after / (forward slash)
// - http://www.bing.com?@name, is also valid sinve it is after ? (question mark)
// The regex below is essentially a break down of:
// ^[^?]+%[^0-9a-f]+ => to exclude URL like www.bing.com%%
// ^[^?]+%[0-9a-f][^0-9a-f]+ => to exclude URL like www.bing.com%1
// ^[^?]+%00 => to exclude URL like www.bing.com%00
// ^[^?]+%$ => to exclude URL like www.bing.com%
// ^https?:\/\/[^?\/]+@ => to exclude URL like http://www.bing.com@name
// ^www\.[^?\/]+@ => to exclude URL like www.bing.com@name
var httpExcludeRegEx = /^[^?]+%[^0-9a-f]+|^[^?]+%[0-9a-f][^0-9a-f]+|^[^?]+%00|^[^?]+%$|^https?:\/\/[^?\/]+@|^www\.[^?\/]+@/i;
var linkMatchRules = {
    http: {
        match: /^(microsoft-edge:)?http:\/\/\S+|www\.\S+/i,
        except: httpExcludeRegEx,
        normalizeUrl: function (url) { return (/^(microsoft-edge:)?http:\/\//i.test(url) ? url : 'http://' + url); },
    },
    https: {
        match: /^(microsoft-edge:)?https:\/\/\S+/i,
        except: httpExcludeRegEx,
    },
    mailto: { match: /^mailto:\S+@\S+\.\S+/i },
    notes: { match: /^notes:\/\/\S+/i },
    file: { match: /^file:\/\/\/?\S+/i },
    unc: { match: /^\\\\\S+/i },
    ftp: {
        match: /^ftp:\/\/\S+|ftp\.\S+/i,
        normalizeUrl: function (url) { return (/^ftp:\/\//i.test(url) ? url : 'ftp://' + url); },
    },
    news: { match: /^news:(\/\/)?\S+/i },
    telnet: { match: /^telnet:\S+/i },
    gopher: { match: /^gopher:\/\/\S+/i },
    wais: { match: /^wais:\S+/i },
};
/**
 * Try to match a given string with link match rules, return matched link
 * @param url Input url to match
 * @param option Link match option, exact or partial. If it is exact match, we need
 * to check the length of matched link and url
 * @param rules Optional link match rules, if not passed, only the default link match
 * rules will be applied
 * @returns The matched link data, or null if no match found.
 * The link data includes an original url and a normalized url
 */
function matchLink(url) {
    if (url) {
        for (var _i = 0, _a = Object.keys(linkMatchRules); _i < _a.length; _i++) {
            var schema = _a[_i];
            var rule = linkMatchRules[schema];
            var matches = url.match(rule.match);
            if (matches && matches[0] == url && (!rule.except || !rule.except.test(url))) {
                return {
                    scheme: schema,
                    originalUrl: url,
                    normalizedUrl: rule.normalizeUrl ? rule.normalizeUrl(url) : url,
                };
            }
        }
    }
    return null;
}
exports.default = matchLink;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var cacheGetListState_1 = __webpack_require__(38);
var cacheGetHeaderLevel_1 = __webpack_require__(87);
var queryNodesWithSelection_1 = __webpack_require__(3);
// Get certain style of a node
// useComputed controls from where to get the style, from computed style or crawl DOM tree to find inline style
// attached to a node. Use case:
// font-family, can use the computed style. Suppose that is more efficient
// font-size, the browser computed style use px, i.e. even though you set font-size to be 12pt, the computed style will
// be something like 14.399px. So for font-size, we should do the DOM tree crawl (useComputed = false)
function getStyleAtNode(editor, node, styleName, useComputed) {
    if (useComputed === void 0) { useComputed = true; }
    var styleValue = '';
    var startNode = node && node.nodeType == 3 /* Text */ ? node.parentNode : node;
    if (useComputed) {
        styleValue = roosterjs_editor_dom_1.getComputedStyle(node, styleName);
    }
    else {
        while (startNode && editor.contains(startNode)) {
            var styles = startNode.style;
            var style = styles ? styles.getPropertyValue(styleName) : '';
            if (style && style.trim()) {
                styleValue = style;
                break;
            }
            startNode = startNode.parentNode;
        }
    }
    return styleValue;
}
// Query command state, used for query Bold, Italic, Underline state
function queryCommandState(editor, command) {
    return editor.getDocument().queryCommandState(command);
}
/**
 * Get format state at cursor
 * A format state is a collection of all format related states, e.g.,
 * bold, italic, underline, font name, font size, etc.
 * @param editor The editor
 * @param (Optional) The plugin event, it stores the event cached data for looking up.
 * In this function the event cache is used to get list state and header level. If not passed,
 * it will query the node within selection to get the info
 * @returns The format state at cursor
 */
function getFormatState(editor, event) {
    // TODO: for background and color, shall we also use computed style?
    // TODO: for font size, we're not using computed style since it will size in PX while we want PT
    // We could possibly introduce some convertion from PX to PT so we can also use computed style
    // TODO: for BIU etc., we're using queryCommandState. Reason is users may do a Bold without first selecting anything
    // in that case, the change is not DOM and querying DOM won't give us anything. queryCommandState can read into browser
    // to figure out the state. It can be discussed if there is a better way since it has been seen that queryCommandState may throw error
    var range = editor.getSelectionRange();
    var nodeAtCursor = range
        ? roosterjs_editor_dom_1.normalizeEditorPoint(range.startContainer, range.startOffset).containerNode
        : null;
    if (!nodeAtCursor) {
        return null;
    }
    if (nodeAtCursor.nodeType == 3 /* Text */) {
        nodeAtCursor = nodeAtCursor.parentNode;
    }
    var listState = cacheGetListState_1.default(editor, event);
    var headerLevel = cacheGetHeaderLevel_1.default(editor, event);
    return {
        fontName: getStyleAtNode(editor, nodeAtCursor, 'font-family', true /* useComputed*/),
        fontSize: getStyleAtNode(editor, nodeAtCursor, 'font-size', false /* useComputed*/),
        isBold: queryCommandState(editor, 'bold'),
        isItalic: queryCommandState(editor, 'italic'),
        isUnderline: queryCommandState(editor, 'underline'),
        isStrikeThrough: queryCommandState(editor, 'strikeThrough'),
        isSubscript: queryCommandState(editor, 'subscript'),
        isSuperscript: queryCommandState(editor, 'superscript'),
        backgroundColor: getStyleAtNode(editor, nodeAtCursor, 'background-color', true /* useComputed*/),
        textColor: getStyleAtNode(editor, nodeAtCursor, 'color', true /* useComputed*/),
        isBullet: listState == 1 /* Bullets */,
        isNumbering: listState == 2 /* Numbering */,
        canUnlink: queryNodesWithSelection_1.default(editor, 'a[href]').length > 0,
        canAddImageAltText: queryNodesWithSelection_1.default(editor, 'img').length > 0,
        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
        isBlockQuote: queryNodesWithSelection_1.default(editor, 'blockquote').length > 0,
        headerLevel: headerLevel,
    };
}
exports.default = getFormatState;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var getNodeAtCursor_1 = __webpack_require__(9);
var roosterjs_editor_dom_1 = __webpack_require__(0);
/**
 * Format table
 * @param table The table to format
 * @param formatName Name of the format to use
 */
function formatTable(editor, format, table) {
    var td = table
        ? table.rows[0].cells[0]
        : getNodeAtCursor_1.default(editor, ['TD', 'TH']);
    if (td) {
        execFormatWithUndo_1.default(editor, function () {
            var vtable = new roosterjs_editor_dom_1.VTable(td);
            vtable.applyFormat(format);
            vtable.writeBack();
            td = editor.contains(td) ? td : vtable.getCurrentTd();
            editor.focus();
            return td;
        }, true /*preserveSelection*/);
    }
}
exports.default = formatTable;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var getNodeAtCursor_1 = __webpack_require__(9);
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_dom_1 = __webpack_require__(0);
var ZERO_WIDTH_SPACE = '&#8203;';
var WORKAROUND_CLASS = 'ROOSTER_WORKAROUND';
var WORKAROUND_HTML = "<img class=\"" + WORKAROUND_CLASS + "\">";
var WORKAROUND_SELECTOR = 'img.' + WORKAROUND_CLASS;
/**
 * Toggle bullet/numbering at selection
 * @param editor The editor instance
 * @param isNumbering Whether this is to toggle numbering or bullet
 */
function toggleList(editor, isNumbering) {
    editor.focus();
    execFormatWithUndo_1.default(editor, function () {
        var workaroundSpan;
        // Edge may incorrectly put cursor after toggle bullet, workaround it by adding a space.
        if (roosterjs_editor_core_1.browserData.isEdge) {
            var node = getNodeAtCursor_1.default(editor);
            if (node && node.nodeType == 1 /* Element */ && node.textContent == '') {
                workaroundSpan = editor.getDocument().createElement('span');
                node.insertBefore(workaroundSpan, node.firstChild);
                workaroundSpan.innerHTML = ZERO_WIDTH_SPACE;
            }
        }
        else if (roosterjs_editor_core_1.browserData.isChrome) {
            // Chrome may lose the inline styles after toggle bullet, workaround it by add an empty IMG before each line
            var workaroundPrototype = roosterjs_editor_dom_1.fromHtml(WORKAROUND_HTML, editor.getDocument())[0];
            var traverser = editor.getContentTraverser(1 /* Selection */);
            var block = traverser.currentBlockElement;
            while (block) {
                var workaroundNode = workaroundPrototype.cloneNode(true);
                var startNode = block.getStartNode();
                if (startNode.nodeType == 1 /* Element */) {
                    startNode.insertBefore(workaroundNode, startNode.firstChild);
                }
                else if (startNode.nodeType == 3 /* Text */) {
                    startNode.parentNode.insertBefore(workaroundNode, startNode);
                }
                block = traverser.getNextBlockElement();
            }
        }
        editor
            .getDocument()
            .execCommand(isNumbering ? 'insertOrderedList' : 'insertUnorderedList', false, null);
        editor.deleteNode(workaroundSpan);
        editor.queryElements(WORKAROUND_SELECTOR, function (img) { return editor.deleteNode(img); });
    });
}
exports.toggleList = toggleList;
/**
 * Toggle bullet at selection
 * If selection contains bullet in deep level, toggle bullet will decrease the bullet level by one
 * If selection contains number list, toggle bullet will convert the number list into bullet list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * browser execCommand API
 * @param editor The editor instance
 */
function toggleBullet(editor) {
    toggleList(editor, false /*isNumbering*/);
}
exports.default = toggleBullet;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get default feature set of ContentEdit plugin
 */
function getDefaultContentEditFeatures() {
    return {
        indentWhenTab: true,
        outdentWhenShiftTab: true,
        outdentWhenBackspaceOnEmptyFirstLine: true,
        outdentWhenEnterOnEmptyLine: true,
        mergeInNewLineWhenBackspaceOnFirstChar: false,
        unquoteWhenBackspaceOnEmptyFirstLine: true,
        unquoteWhenEnterOnEmptyLine: true,
        autoBullet: true,
        tabInTable: true,
    };
}
exports.getDefaultContentEditFeatures = getDefaultContentEditFeatures;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/** NodeId attribute */
var NODE_ID_ATTRIBUTE_NAME = 'NodeId';
;
/** create an empty CustomData */
function createCustomData() {
    return {
        dict: {},
        nextNodeId: 1,
    };
}
exports.createCustomData = createCustomData;
/**
 * Sets the specified object data
 */
function setObject(customData, element, key, value) {
    // Get the id for the element
    if (element.nodeType == 1 /* Element */) {
        var id = getAndSetNodeId(customData, element);
        if (id != '') {
            // Get the values for the element
            if (!customData.dict[id]) {
                // First time dictionary creation
                customData.dict[id] = {};
            }
            customData.dict[id][key] = value;
        }
    }
}
exports.setObject = setObject;
/**
 * Reads the specified object data
 */
function getObject(customData, element, key) {
    if (element.nodeType == 1 /* Element */) {
        var id = getAndSetNodeId(customData, element);
        if (id != '') {
            return customData.dict[id] && customData.dict[id][key];
        }
    }
    return null;
}
exports.getObject = getObject;
/** Get the unique id for the specified node... */
function getAndSetNodeId(customData, element) {
    var id = element.getAttribute(NODE_ID_ATTRIBUTE_NAME);
    if (!id) {
        id = customData.nextNodeId.toString();
        customData.nextNodeId++;
        element.setAttribute(NODE_ID_ATTRIBUTE_NAME, id);
    }
    return id;
}


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
;
/** create an empty LevelLists */
function createLevelLists() {
    return {
        listsMetadata: {},
        currentUniqueListId: -1,
    };
}
exports.createLevelLists = createLevelLists;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var createEditor_1 = __webpack_require__(51);
exports.createEditor = createEditor_1.default;
__export(__webpack_require__(117));
__export(__webpack_require__(0));
__export(__webpack_require__(2));
__export(__webpack_require__(4));
__export(__webpack_require__(24));
__export(__webpack_require__(118));


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_plugins_1 = __webpack_require__(24);
var roosterjs_editor_core_1 = __webpack_require__(2);
/**
 * Create an editor instance with most common options
 * @param contentDiv The html div element needed for creating the editor
 * @param additionalPlugins The additional user defined plugins. Currently the default plugins that are already included are
 * DefalutShortcut, HyperLink, Paste, and ContentEdit, user don't need to add those.
 * @param initialContent The initial content to show in editor. It can't be removed by undo, user need to manually remove it if needed.
 * @returns The editor instance
 */
function createEditor(contentDiv, additionalPlugins, initialContent) {
    var plugins = [
        new roosterjs_editor_plugins_1.DefaultShortcut(),
        new roosterjs_editor_plugins_1.HyperLink(),
        new roosterjs_editor_plugins_1.Paste(),
        new roosterjs_editor_plugins_1.ContentEdit(),
    ];
    if (additionalPlugins) {
        plugins = plugins.concat(additionalPlugins);
    }
    var options = {
        plugins: plugins,
        initialContent: initialContent,
        defaultFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };
    return new roosterjs_editor_core_1.Editor(contentDiv, options);
}
exports.default = createEditor;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_api_1 = __webpack_require__(4);
var KEY_B = 66;
var KEY_I = 73;
var KEY_U = 85;
var KEY_Y = 89;
var KEY_Z = 90;
var KEY_PERIOD = 190;
var KEY_FORWARDSLASH = 191;
function createShortcutCommand(metaKey, ctrlKey, shiftKey, which, command) {
    return {
        metaKey: metaKey,
        ctrlKey: ctrlKey,
        shiftKey: shiftKey,
        which: which,
        command: command,
    };
}
var macCommands = [
    // Bold for Mac: Command (Meta) + B
    createShortcutCommand(true /*metaKey*/, false /*ctrlKey*/, false /*shiftKey*/, KEY_B, 1 /* Bold */),
    // Italic for Mac: Command (Meta) + I
    createShortcutCommand(true /*metaKey*/, false /*ctrlKey*/, false /*shiftKey*/, KEY_I, 2 /* Italic */),
    // Underline for Mac: Command (Meta) + U
    createShortcutCommand(true /*metaKey*/, false /*ctrlKey*/, false /*shiftKey*/, KEY_U, 3 /* Underline */),
    // Undo for Mac: Command (Meta) + Z
    createShortcutCommand(true /*metaKey*/, false /*ctrlKey*/, false /*shiftKey*/, KEY_Z, 4 /* Undo */),
    // Redo for Mac: Command (meta) + SHIFT + Z
    createShortcutCommand(true /*metaKey*/, false /*ctrlKey*/, true /*shiftKey*/, KEY_Z, 5 /* Redo */),
    // Bullet for Mac: Command (meta) + .
    createShortcutCommand(true /*metaKey*/, false /*ctrlKey*/, false /*shiftKey*/, KEY_PERIOD, 6 /* Bullet */),
    // Numbering for Mac: Command (meta) + /
    createShortcutCommand(true /*metaKey*/, false /*ctrlKey*/, false /*shiftKey*/, KEY_FORWARDSLASH, 7 /* Numbering */),
];
var winCommands = [
    // Bold for Windows: Ctrl + B
    createShortcutCommand(false /*metaKey*/, true /*ctrlKey*/, false /*shiftKey*/, KEY_B, 1 /* Bold */),
    // Italic for Windows: Ctrl + I
    createShortcutCommand(false /*metaKey*/, true /*ctrlKey*/, false /*shiftKey*/, KEY_I, 2 /* Italic */),
    // Underline for Windows: Ctrl + U
    createShortcutCommand(false /*metaKey*/, true /*ctrlKey*/, false /*shiftKey*/, KEY_U, 3 /* Underline */),
    // Undo for Windows: Ctrl + Z
    createShortcutCommand(false /*metaKey*/, true /*ctrlKey*/, false /*shiftKey*/, KEY_Z, 4 /* Undo */),
    // Redo for Windows: Ctrl + Y
    createShortcutCommand(false /*metaKey*/, true /*ctrlKey*/, false /*shiftKey*/, KEY_Y, 5 /* Redo */),
    // Bullet for Windows: Ctrl + .
    createShortcutCommand(false /*metaKey*/, true /*ctrlKey*/, false /*shiftKey*/, KEY_PERIOD, 6 /* Bullet */),
    // Numbering for Windows: Ctrl + /
    createShortcutCommand(false /*metaKey*/, true /*ctrlKey*/, false /*shiftKey*/, KEY_FORWARDSLASH, 7 /* Numbering */),
];
// Try get command from the event
function tryGetCommandFromEvent(event) {
    if (event.eventType == 0 /* KeyDown */) {
        var commands = roosterjs_editor_core_1.browserData.isMac ? macCommands : winCommands;
        var keyboardEvent = event.rawEvent;
        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
            var cmd = commands_1[_i];
            if (!keyboardEvent.altKey &&
                cmd.ctrlKey == keyboardEvent.ctrlKey &&
                cmd.metaKey == keyboardEvent.metaKey &&
                cmd.shiftKey == keyboardEvent.shiftKey &&
                cmd.which == keyboardEvent.which) {
                return cmd.command;
            }
        }
    }
    return 0 /* None */;
}
// An editor plugin to respond to default common keyboard short
// i.e. Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y
var DefaultShortcut = /** @class */ (function () {
    function DefaultShortcut() {
    }
    DefaultShortcut.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    DefaultShortcut.prototype.dispose = function () {
        this.editor = null;
    };
    // Handle the event if it is a tab event, and cursor is at begin of a list
    DefaultShortcut.prototype.willHandleEventExclusively = function (event) {
        var command = tryGetCommandFromEvent(event);
        return command != 0 /* None */;
    };
    // Handle the event
    DefaultShortcut.prototype.onPluginEvent = function (event) {
        var command = tryGetCommandFromEvent(event);
        if (!command) {
            return;
        }
        var commandExecuted = true;
        switch (command) {
            case 1 /* Bold */:
                roosterjs_editor_api_1.toggleBold(this.editor);
                break;
            case 2 /* Italic */:
                roosterjs_editor_api_1.toggleItalic(this.editor);
                break;
            case 3 /* Underline */:
                roosterjs_editor_api_1.toggleUnderline(this.editor);
                break;
            case 4 /* Undo */:
                this.editor.undo();
                break;
            case 5 /* Redo */:
                this.editor.redo();
                break;
            case 6 /* Bullet */:
                roosterjs_editor_api_1.toggleBullet(this.editor);
                break;
            case 7 /* Numbering */:
                roosterjs_editor_api_1.toggleNumbering(this.editor);
                break;
            default:
                commandExecuted = false;
        }
        if (commandExecuted) {
            event.rawEvent.preventDefault();
            event.rawEvent.stopPropagation();
        }
    };
    return DefaultShortcut;
}());
exports.default = DefaultShortcut;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Undo_1 = __webpack_require__(25);
var BrowserData_1 = __webpack_require__(10);
var createEditorCore_1 = __webpack_require__(70);
var roosterjs_editor_dom_1 = __webpack_require__(0);
var IS_IE_OR_EDGE = BrowserData_1.default.isIE || BrowserData_1.default.isEdge;
var Editor = /** @class */ (function () {
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    function Editor(contentDiv, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.stopPropagation = function (event) {
            if (!event.ctrlKey &&
                !event.altKey &&
                !event.metaKey &&
                (event.which == 32 || // Space
                    (event.which >= 65 && event.which <= 90) || // A-Z
                    (event.which >= 48 && event.which <= 57) || // 0-9
                    (event.which >= 96 && event.which <= 105) || // 0-9 on num pad
                    (event.which >= 186 && event.which <= 192) || // ';', '=', ',', '-', '.', '/', '`'
                    (event.which >= 219 && event.which <= 222))) {
                // '[', '\', ']', '''
                event.stopPropagation();
            }
        };
        // Check if user is typing right under the content div
        // When typing goes directly under content div, many things can go wrong
        // We fix it by wrapping it with a div and reposition cursor within the div
        // TODO: we only fix the case when selection is collapsed
        // When selection is not collapsed, i.e. users press ctrl+A, and then type
        // We don't have a good way to fix that for the moment
        this.onKeyPress = function (event) {
            var selectionRange = _this.core.api.getSelectionRange(_this.core, true /*tryGetFromCache*/);
            var focusNode;
            if (selectionRange &&
                selectionRange.collapsed &&
                (focusNode = selectionRange.startContainer) &&
                (focusNode == _this.core.contentDiv ||
                    (focusNode.nodeType == 3 /* Text */ &&
                        focusNode.parentNode == _this.core.contentDiv))) {
                var editorSelection = new roosterjs_editor_dom_1.EditorSelection(_this.core.contentDiv, selectionRange, _this.core.inlineElementFactory);
                var blockElement = editorSelection.startBlockElement;
                if (!blockElement) {
                    // Only reason we don't get the selection block is that we have an empty content div
                    // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
                    // The fix is to add a DIV wrapping, apply default format and move cursor over
                    var nodes = roosterjs_editor_dom_1.fromHtml('<div><br></div>', _this.core.document);
                    var element = _this.core.contentDiv.appendChild(nodes[0]);
                    roosterjs_editor_dom_1.applyFormat(element, _this.core.defaultFormat);
                    // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
                    _this.selectEditorPoint(element.firstChild, 0 /* Begin */);
                }
                else if (blockElement.getStartNode().parentNode == blockElement.getEndNode().parentNode) {
                    // Only fix the balanced start-end block where start and end node is under same parent
                    // The focus node could be pointing to the content div, normalize it to have it point to a child first
                    var focusOffset = selectionRange.startOffset;
                    var editorPoint = roosterjs_editor_dom_1.normalizeEditorPoint(focusNode, focusOffset);
                    var element = roosterjs_editor_dom_1.wrapAll(blockElement.getContentNodes());
                    if (roosterjs_editor_dom_1.getTagOfNode(blockElement.getStartNode()) == 'BR') {
                        // if the block is just BR, apply default format
                        // Otherwise, leave it as it is as we don't want to change the style for existing data
                        roosterjs_editor_dom_1.applyFormat(element, _this.core.defaultFormat);
                    }
                    // Last restore the selection using the normalized editor point
                    _this.selectEditorPoint(editorPoint.containerNode, editorPoint.offset);
                }
            }
            _this.stopPropagation(event);
        };
        // 1. Make sure all parameters are valid
        if (roosterjs_editor_dom_1.getTagOfNode(contentDiv) != 'DIV') {
            throw new Error('contentDiv must be an HTML DIV element');
        }
        // 2. Store options values to local variables
        this.core = createEditorCore_1.default(contentDiv, options);
        this.disableRestoreSelectionOnFocus = options.disableRestoreSelectionOnFocus;
        this.omitContentEditable = options.omitContentEditableAttributeChanges;
        // 3. Initialize plugins
        this.core.plugins.forEach(function (plugin) {
            if (!plugin.name) {
                plugin.name = plugin.constructor.name;
            }
            plugin.initialize(_this);
        });
        // 4. Ensure initial content and its format
        if (options.initialContent) {
            this.setContent(options.initialContent);
        }
        else if (contentDiv.innerHTML != '') {
            this.triggerContentChangedEvent();
        }
        this.ensureInitialContent();
        // 5. Initialize undo service
        // This need to be after step 4 so that undo service can pickup initial content
        this.undoService = options.undo || new Undo_1.default();
        this.undoService.initialize(this);
        this.core.plugins.push(this.undoService);
        // 6. Create event handler to bind DOM events
        this.createEventHandlers();
        // 7. Finally make the container editable and set its selection styles
        if (!this.omitContentEditable) {
            contentDiv.setAttribute('contenteditable', 'true');
            var styles = contentDiv.style;
            styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = 'text';
        }
        // 8. Disable these operations for firefox since its behavior is usually wrong
        // Catch any possible exception since this should not block the initialization of editor
        try {
            this.core.document.execCommand('enableObjectResizing', false, false);
            this.core.document.execCommand('enableInlineTableEditing', false, false);
        }
        catch (e) { }
        // 9. Start a timer loop if required
        if (options.idleEventTimeSpanInSecond > 0) {
            this.startIdleLoop(options.idleEventTimeSpanInSecond * 1000);
        }
    }
    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    Editor.prototype.dispose = function () {
        if (this.core.idleLoopHandle > 0) {
            var win = this.core.contentDiv.ownerDocument.defaultView || window;
            win.clearInterval(this.core.idleLoopHandle);
            this.core.idleLoopHandle = 0;
        }
        this.core.plugins.forEach(function (plugin) {
            plugin.dispose();
        });
        this.eventDisposers.forEach(function (disposer) { return disposer(); });
        this.eventDisposers = null;
        for (var _i = 0, _a = Object.keys(this.core.customData); _i < _a.length; _i++) {
            var key = _a[_i];
            var data = this.core.customData[key];
            if (data && data.disposer) {
                data.disposer(data.value);
            }
            delete this.core.customData[key];
        }
        if (!this.omitContentEditable) {
            var styles = this.core.contentDiv.style;
            styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = '';
            this.core.contentDiv.removeAttribute('contenteditable');
        }
        this.core = null;
    };
    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    Editor.prototype.isDisposed = function () {
        return !this.core;
    };
    //#region Node API
    /**
     * Insert node into editor
     * @param node The node to insert
     * @param option Insert options. Default value is:
     *  position: ContentPosition.SelectionStart
     *  updateCursor: true
     *  replaceSelection: true
     *  insertOnNewLine: false
     * @returns true if node is inserted. Otherwise false
     */
    Editor.prototype.insertNode = function (node, option) {
        return node ? this.core.api.insertNode(this.core, node, option) : false;
    };
    /**
     * Delete a node from editor content
     * @param node The node to delete
     * @returns true if node is deleted. Otherwise false
     */
    Editor.prototype.deleteNode = function (node) {
        // Only remove the node when it falls within editor
        if (node && this.contains(node)) {
            node.parentNode.removeChild(node);
            return true;
        }
        return false;
    };
    /**
     * Replace a node in editor content with another node
     * @param existingNode The existing node to be replaced
     * @param new node to replace to
     * @returns true if node is replaced. Otherwise false
     */
    Editor.prototype.replaceNode = function (existingNode, toNode) {
        // Only replace the node when it falls within editor
        if (existingNode && toNode && this.contains(existingNode)) {
            existingNode.parentNode.replaceChild(toNode, existingNode);
            return true;
        }
        return false;
    };
    /**
     * Get InlineElement at given node
     * @param node The node to create InlineElement
     * @requires The InlineElement result
     */
    Editor.prototype.getInlineElementAtNode = function (node) {
        return roosterjs_editor_dom_1.getInlineElementAtNode(this.core.contentDiv, node, this.core.inlineElementFactory);
    };
    /**
     * Check if the node falls in the editor content
     * @param node The node to check
     * @returns True if the given node is in editor content, otherwise false
     */
    Editor.prototype.contains = function (node) {
        return roosterjs_editor_dom_1.contains(this.core.contentDiv, node);
    };
    /**
     * Query HTML elements in editor using querySelectorAll() method
     * @param selector Selector string to query
     * @param forEachCallback An optional callback to be invoked on each node in query result
     * @returns HTML Element list of the query result
     */
    Editor.prototype.queryElements = function (selector, forEachCallback) {
        var nodes = [].slice.call(this.core.contentDiv.querySelectorAll(selector));
        if (forEachCallback) {
            nodes.forEach(forEachCallback);
        }
        return nodes;
    };
    //#endregion
    //#region Content API
    /**
     * Check whether the editor contains any visible content
     * @param trim Whether trime the content string before check. Default is false
     * @returns True if there's no visible content, otherwise false
     */
    Editor.prototype.isEmpty = function (trim) {
        return roosterjs_editor_dom_1.isNodeEmpty(this.core.contentDiv, trim);
    };
    /**
     * Get current editor content as HTML string
     * @param triggerExtractContentEvent Whether trigger ExtractContent event to all plugins
     * before return. Use this parameter to remove any temporary content added by plugins.
     * @returns HTML string representing current editor content
     */
    Editor.prototype.getContent = function (triggerExtractContentEvent) {
        if (triggerExtractContentEvent === void 0) { triggerExtractContentEvent = true; }
        var content = this.core.contentDiv.innerHTML;
        if (triggerExtractContentEvent) {
            var extractContentEvent = {
                eventType: 7 /* ExtractContent */,
                content: content,
            };
            this.triggerEvent(extractContentEvent, true /*broadcast*/);
            content = extractContentEvent.content;
        }
        return content;
    };
    /**
     * Get plain text content inside editor
     * @returns The text content inside editor
     */
    Editor.prototype.getTextContent = function () {
        return this.core.contentDiv.innerText;
    };
    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * @param content HTML content to set in
     */
    Editor.prototype.setContent = function (content) {
        this.core.contentDiv.innerHTML = content || '';
        this.triggerContentChangedEvent();
    };
    /**
     * Insert HTML content into editor
     * @param HTML content to insert
     * @param option Insert options. Default value is:
     *  position: ContentPosition.SelectionStart
     *  updateCursor: true
     *  replaceSelection: true
     *  insertOnNewLine: false
     */
    Editor.prototype.insertContent = function (content, option) {
        if (content) {
            var allNodes = roosterjs_editor_dom_1.fromHtml(content, this.core.document);
            // If it is to insert on new line, and there are more than one node in the collection, wrap all nodes with
            // a parent DIV before calling insertNode on each top level sub node. Otherwise, every sub node may get wrapped
            // separately to show up on its own line
            if (option && option.insertOnNewLine && allNodes.length > 0) {
                allNodes = [roosterjs_editor_dom_1.wrapAll(allNodes)];
            }
            for (var i = 0; i < allNodes.length; i++) {
                this.insertNode(allNodes[i], option);
            }
        }
    };
    /**
     * @deprecated Use queryElements instead
     */
    Editor.prototype.queryContent = function (selector) {
        return this.core.contentDiv.querySelectorAll(selector);
    };
    //#endregion
    //#region Focus and Selection
    /**
     * Get current selection range from Editor.
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @returns current selection range, or null if editor never got focus before
     */
    Editor.prototype.getSelectionRange = function () {
        return this.core.api.getSelectionRange(this.core, true /*tryGetFromCache*/);
    };
    /**
     * Get current selection
     * @return current selection object
     */
    Editor.prototype.getSelection = function () {
        return this.core.document.defaultView.getSelection();
    };
    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    Editor.prototype.hasFocus = function () {
        return this.core.api.hasFocus(this.core);
    };
    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    Editor.prototype.focus = function () {
        this.core.api.focus(this.core);
    };
    /**
     * Update selection in editor
     * @param selectionRange The selection range to update to
     * @returns true if selection range is updated. Otherwise false.
     */
    Editor.prototype.updateSelection = function (selectionRange) {
        return this.core.api.updateSelection(this.core, selectionRange);
    };
    /**
     * Save the current selection in editor so that when focus again, the selection can be restored
     */
    Editor.prototype.saveSelectionRange = function () {
        this.core.cachedSelectionRange = this.core.api.getSelectionRange(this.core, false /*tryGetFromCache*/);
    };
    /**
     * Get a rect representing the location of the cursor.
     * @returns a Rect object representing cursor location
     */
    Editor.prototype.getCursorRect = function () {
        return this.core.api.getCursorRect(this.core);
    };
    /**
     * Apply inline style to current selection
     * @param styler The callback function to apply style
     */
    Editor.prototype.applyInlineStyle = function (styler) {
        this.core.api.applyInlineStyle(this.core, styler);
    };
    //#endregion
    //#region EVENT API
    /**
     * Add a custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param eventName DOM event name to handle
     * @param handler Handler callback
     * @returns A dispose function. Call the function to dispose this event handler
     */
    Editor.prototype.addDomEventHandler = function (eventName, handler) {
        return this.core.api.attachDomEvent(this.core, eventName, null /*pluginEventType*/, handler);
    };
    /**
     * Trigger an event to be dispatched to all plugins
     * @param pluginEvent The event object to trigger
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     */
    Editor.prototype.triggerEvent = function (pluginEvent, broadcast) {
        if (broadcast === void 0) { broadcast = true; }
        this.core.api.triggerEvent(this.core, pluginEvent, broadcast);
    };
    /**
     * Trigger a ContentChangedEvent
     * @param source Source of this event, by default is 'SetContent'
     * @param data additional data for this event
     */
    Editor.prototype.triggerContentChangedEvent = function (source, data) {
        if (source === void 0) { source = "SetContent" /* SetContent */; }
        this.triggerEvent({
            eventType: 6 /* ContentChanged */,
            source: source,
            data: data,
        });
    };
    //#endregion
    //#region Undo API
    /**
     * Undo last edit operation
     */
    Editor.prototype.undo = function () {
        this.focus();
        this.undoService.undo();
    };
    /**
     * Redo next edit operation
     */
    Editor.prototype.redo = function () {
        this.focus();
        this.undoService.redo();
    };
    /**
     * Run a callback with undo suspended.
     * @param callback The callback to run
     */
    Editor.prototype.runWithoutAddingUndoSnapshot = function (callback) {
        try {
            this.suspendAddingUndoSnapshot = true;
            callback();
        }
        finally {
            this.suspendAddingUndoSnapshot = false;
        }
    };
    /**
     * Add an undo snapshot if undo is not suspended
     */
    Editor.prototype.addUndoSnapshot = function () {
        if (!this.suspendAddingUndoSnapshot) {
            this.undoService.addUndoSnapshot();
        }
    };
    /**
     * Whether there is an available undo snapshot
     */
    Editor.prototype.canUndo = function () {
        return this.undoService.canUndo();
    };
    /**
     * Whether there is an available redo snapshot
     */
    Editor.prototype.canRedo = function () {
        return this.undoService.canRedo();
    };
    //#endregion
    //#region Misc
    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    Editor.prototype.getDocument = function () {
        return this.core.document;
    };
    /**
     * Get custom data related to this editor
     * @param key Key of the custom data
     * @param getter Getter function. If custom data for the given key doesn't exist,
     * call this function to get one and store it.
     * @param disposer An optional disposer function to dispose this custom data when
     * dispose editor.
     */
    Editor.prototype.getCustomData = function (key, getter, disposer) {
        return this.core.api.getCustomData(this.core, key, getter);
    };
    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    Editor.prototype.isInIME = function () {
        return this.inIME;
    };
    /**
     * Get default format of this editor
     * @returns Default format object of this editor
     */
    Editor.prototype.getDefaultFormat = function () {
        return this.core.defaultFormat;
    };
    /**
     * Get a content traverser that can be used to travse content within editor
     * @param scope Content scope type. There are 3 kinds of scoper:
     * 1) SelectionBlockScoper is a block based scoper that restrict traversing within the block where the selection is
     *    it allows traversing from start, end or selection start position
     *    this is commonly used to parse content from cursor as user type up to the begin or end of block
     * 2) SelectionScoper restricts traversing within the selection. It is commonly used for applying style to selection
     * 3) BodyScoper will traverse the entire editor body from the beginning (ignoring the passed in position parameter)
     * @param position Start position of the traverser
     * @returns A content traverser to help travse among InlineElemnt/BlockElement within scope
     */
    Editor.prototype.getContentTraverser = function (scope, position) {
        if (position === void 0) { position = 2 /* SelectionStart */; }
        return this.core.api.getContentTraverser(this.core, scope, position);
    };
    /**
     * Run a callback function asynchronously
     * @param callback The callback function to run
     */
    Editor.prototype.runAsync = function (callback) {
        var _this = this;
        var win = this.core.contentDiv.ownerDocument.defaultView || window;
        win.requestAnimationFrame(function () {
            if (!_this.isDisposed() && callback) {
                callback();
            }
        });
    };
    //#endregion
    //#region Private functions
    Editor.prototype.createEventHandlers = function () {
        var _this = this;
        this.eventDisposers = [
            this.core.api.attachDomEvent(this.core, 'input', null, this.stopPropagation),
            this.core.api.attachDomEvent(this.core, 'keypress', 1 /* KeyPress */, this.onKeyPress),
            this.core.api.attachDomEvent(this.core, 'keydown', 0 /* KeyDown */, this.stopPropagation),
            this.core.api.attachDomEvent(this.core, 'keyup', 2 /* KeyUp */, this.stopPropagation),
            this.core.api.attachDomEvent(this.core, 'mousedown', 4 /* MouseDown */),
            this.core.api.attachDomEvent(this.core, 'mouseup', 5 /* MouseUp */),
            this.core.api.attachDomEvent(this.core, 'compositionstart', null, function () { return (_this.inIME = true); }),
            this.core.api.attachDomEvent(this.core, 'compositionend', 3 /* CompositionEnd */, function () { return (_this.inIME = false); }),
            this.core.api.attachDomEvent(this.core, 'focus', null, function () {
                // Restore the last saved selection first
                if (_this.core.cachedSelectionRange && !_this.disableRestoreSelectionOnFocus) {
                    _this.updateSelection(_this.core.cachedSelectionRange);
                }
                _this.core.cachedSelectionRange = null;
            }),
            this.core.api.attachDomEvent(this.core, IS_IE_OR_EDGE ? 'beforedeactivate' : 'blur', null, function () {
                _this.saveSelectionRange();
            }),
        ];
    };
    Editor.prototype.selectEditorPoint = function (container, offset) {
        if (!this.contains(container)) {
            return false;
        }
        var range = this.core.document.createRange();
        if (container.nodeType == 3 /* Text */ && offset <= container.nodeValue.length) {
            range.setStart(container, offset);
        }
        else if (offset == 0 /* Begin */) {
            range.setStartBefore(container);
        }
        else {
            range.setStartAfter(container);
        }
        range.collapse(true /* toStart */);
        return this.core.api.updateSelection(this.core, range);
    };
    Editor.prototype.ensureInitialContent = function () {
        var firstBlock = roosterjs_editor_dom_1.getFirstBlockElement(this.core.contentDiv, this.core.inlineElementFactory);
        var defaultFormatBlockElement;
        if (!firstBlock) {
            // No first block, let's create one
            var nodes = roosterjs_editor_dom_1.fromHtml('<div><br></div>', this.core.document);
            defaultFormatBlockElement = this.core.contentDiv.appendChild(nodes[0]);
        }
        else if (firstBlock instanceof roosterjs_editor_dom_1.NodeBlockElement) {
            // There is a first block and it is a Node (P, DIV etc.) block
            // Check if it is empty block and apply default format if so
            // TODO: what about first block contains just an image? testing getTextContent won't tell that
            // Probably it is no harm since apply default format on an image block won't change anything for the image
            if (firstBlock.getTextContent() == '') {
                defaultFormatBlockElement = firstBlock.getStartNode();
            }
        }
        if (defaultFormatBlockElement) {
            roosterjs_editor_dom_1.applyFormat(defaultFormatBlockElement, this.core.defaultFormat);
        }
    };
    Editor.prototype.startIdleLoop = function (interval) {
        var _this = this;
        var win = this.core.contentDiv.ownerDocument.defaultView || window;
        this.core.idleLoopHandle = win.setInterval(function () {
            if (_this.core.ignoreIdleEvent) {
                _this.core.ignoreIdleEvent = false;
            }
            else {
                _this.core.api.triggerEvent(_this.core, {
                    eventType: 9 /* Idle */,
                }, true /*broadcast*/);
            }
        }, interval);
    };
    return Editor;
}());
exports.default = Editor;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BlockElement_1 = __webpack_require__(11);
// The provides traversing of content inside editor.
// There are two ways to traverse, block by block, or inline element by inline element
// Block and inline traversing is independent from each other, meanning if you traverse block by block, it does not change
// the current inline element position
var ContentTraverser = /** @class */ (function () {
    function ContentTraverser(rootNode, scoper, inlineElementFactory) {
        this.rootNode = rootNode;
        this.scoper = scoper;
        this.inlineElementFactory = inlineElementFactory;
    }
    Object.defineProperty(ContentTraverser.prototype, "currentBlockElement", {
        // Get current block
        get: function () {
            // Prepare currentBlock from the scoper
            if (!this.currentBlock) {
                this.currentBlock = this.scoper.getStartBlockElement();
            }
            return this.currentBlock;
        },
        enumerable: true,
        configurable: true
    });
    // Get next block element
    ContentTraverser.prototype.getNextBlockElement = function () {
        var thisBlock = this.currentBlockElement;
        var nextBlock = thisBlock
            ? BlockElement_1.getNextBlockElement(this.rootNode, thisBlock, this.inlineElementFactory)
            : null;
        // Make sure this is right block:
        // 1) the block is in scope per scoper
        // 2) the block is after the current block
        // Then:
        // 1) Re-position current block to newly found block
        if (nextBlock && this.scoper.isBlockInScope(nextBlock) && nextBlock.isAfter(thisBlock)) {
            this.currentBlock = nextBlock;
            return this.currentBlock;
        }
        return null;
    };
    // Get previous block element
    ContentTraverser.prototype.getPreviousBlockElement = function () {
        var thisBlock = this.currentBlockElement;
        var previousBlock = thisBlock
            ? BlockElement_1.getPreviousBlockElement(this.rootNode, thisBlock, this.inlineElementFactory)
            : null;
        // Make sure this is right block:
        // 1) the block is in scope per scoper
        // 2) the block is before the current block
        // Then:
        // 1) Re-position current block to newly found block
        if (previousBlock &&
            this.scoper.isBlockInScope(previousBlock) &&
            thisBlock.isAfter(previousBlock)) {
            this.currentBlock = previousBlock;
            return this.currentBlock;
        }
        return null;
    };
    Object.defineProperty(ContentTraverser.prototype, "currentInlineElement", {
        // Current inline element getter
        get: function () {
            // Retrieve a start inline from scoper
            if (!this.currentInline) {
                this.currentInline = this.scoper.getStartInlineElement();
            }
            return this.currentInline;
        },
        enumerable: true,
        configurable: true
    });
    // Get next inline element
    ContentTraverser.prototype.getNextInlineElement = function () {
        var thisInline = this.currentInlineElement;
        var nextInline;
        if (thisInline) {
            nextInline = BlockElement_1.getNextInlineElement(this.rootNode, thisInline, this.inlineElementFactory);
        }
        else {
            nextInline = this.scoper.getInlineElementAfterStart
                ? this.scoper.getInlineElementAfterStart()
                : null;
        }
        // For inline, we need to make sure:
        // 1) it is really next to current, unless current is null
        // 2) pass on the new inline to this.scoper to do the triming and we still get back an inline
        // Then
        // 1) re-position current inline
        if (nextInline &&
            (!thisInline || nextInline.isAfter(thisInline)) &&
            (nextInline = this.scoper.trimInlineElement(nextInline))) {
            this.currentInline = nextInline;
            return this.currentInline;
        }
        return null;
    };
    // Get previous inline element
    ContentTraverser.prototype.getPreviousInlineElement = function () {
        var thisInline = this.currentInlineElement;
        var previousInline;
        if (thisInline) {
            previousInline = BlockElement_1.getPreviousInlineElement(this.rootNode, thisInline, this.inlineElementFactory);
        }
        else {
            previousInline = this.scoper.getInlineElementBeforeStart
                ? this.scoper.getInlineElementBeforeStart()
                : null;
        }
        // For inline, we need to make sure:
        // 1) it is really previous to current
        // 2) pass on the new inline to this.scoper to do the trimming and we still get back an inline
        // Then
        // 1) re-position current inline
        if (previousInline &&
            (!thisInline || thisInline.isAfter(previousInline)) &&
            (previousInline = this.scoper.trimInlineElement(previousInline))) {
            this.currentInline = previousInline;
            return this.currentInline;
        }
        return null;
    };
    return ContentTraverser;
}());
exports.default = ContentTraverser;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DefaultInlineElementResolver_1 = __webpack_require__(56);
var NodeInlineElement_1 = __webpack_require__(8);
// This factory holds all resolvers and provide function to resolve DOM node to inline element
var InlineElementFactory = /** @class */ (function () {
    function InlineElementFactory(customResolvers) {
        this.customResolvers = customResolvers;
        // Initialize default resolver and custom resolver array
        this.defaultResolver = new DefaultInlineElementResolver_1.default();
    }
    // Resolve an inline element by a leaf node
    InlineElementFactory.prototype.resolve = function (node, rootNode, parentBlock) {
        var inlineElement;
        // First, prepare the node chain starting from current node up to block (not including the parent block node)
        var nodeChain = [node];
        var parentNode = node.parentNode;
        while (parentNode && parentBlock.contains(parentNode)) {
            // Use the unshift to push the node to very front
            nodeChain.unshift(parentNode);
            parentNode = parentNode.parentNode;
        }
        // Now loop through the node chain from top down, and ask through each custom resolver
        // till anyone resolves to an inline element
        // We give custom resolver a high pri, and fall back to default resolver when none of custom resolver
        // can resolve the inline element
        if (this.customResolvers && this.customResolvers.length > 0) {
            for (var i = 0; i < nodeChain.length; i++) {
                for (var _i = 0, _a = this.customResolvers; _i < _a.length; _i++) {
                    var resolver = _a[_i];
                    inlineElement = resolver.resolve(nodeChain[i], rootNode, parentBlock, this);
                    if (inlineElement) {
                        break;
                    }
                }
                // If at this point we already have an inline element, exit the loop
                if (inlineElement) {
                    break;
                }
            }
        }
        // Still no inline element, resolve through the default resolver
        // The reason this default resolver is put as last is we want to give third-party a high pri
        // i.e. for html like <a><span>#hashtag</span></a>, default resolver resolves against <a>
        // if default resolver is in same pri as custom, we will get an LinkInlineElement, instead of hashtag inline`
        if (!inlineElement) {
            for (var i = 0; i < nodeChain.length; i++) {
                inlineElement = this.defaultResolver.resolve(nodeChain[i], rootNode, parentBlock, this);
                if (inlineElement) {
                    break;
                }
            }
        }
        // Last fallback, resolve it as a simple NodeInlineElement
        if (!inlineElement) {
            inlineElement = new NodeInlineElement_1.default(node, parentBlock);
        }
        return inlineElement;
    };
    return InlineElementFactory;
}());
exports.default = InlineElementFactory;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageInlineElement_1 = __webpack_require__(31);
var LinkInlineElement_1 = __webpack_require__(33);
var TextInlineElement_1 = __webpack_require__(20);
var getTagOfNode_1 = __webpack_require__(7);
// This is default inline element resolver which produces very basic inline elements
var DefaultInlineElementResolver = /** @class */ (function () {
    function DefaultInlineElementResolver() {
    }
    DefaultInlineElementResolver.prototype.resolve = function (node, rootNode, parentBlock, inlineElementFactory) {
        // Create LinkInlineElement or ImageInlineElement depending on the tag, and resort to TextInlineElement at last
        var inlineElement = null;
        var tag = getTagOfNode_1.default(node);
        if (tag == 'A') {
            inlineElement = new LinkInlineElement_1.default(node, parentBlock);
        }
        else if (tag == 'IMG') {
            inlineElement = new ImageInlineElement_1.default(node, parentBlock);
        }
        else if (node.nodeType == 3 /* Text */) {
            inlineElement = new TextInlineElement_1.default(node, parentBlock);
        }
        return inlineElement;
    };
    return DefaultInlineElementResolver;
}());
exports.default = DefaultInlineElementResolver;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BlockElement_1 = __webpack_require__(11);
// This provides scoper for traversing the entire editor body starting from the beginning
var BodyScoper = /** @class */ (function () {
    function BodyScoper(rootNode, inlineElementFactory) {
        this.rootNode = rootNode;
        this.inlineElementFactory = inlineElementFactory;
    }
    // Get the start block element
    BodyScoper.prototype.getStartBlockElement = function () {
        return BlockElement_1.getFirstBlockElement(this.rootNode, this.inlineElementFactory);
    };
    // Get the first inline element in the editor
    BodyScoper.prototype.getStartInlineElement = function () {
        return BlockElement_1.getFirstInlineElement(this.rootNode, this.inlineElementFactory);
    };
    // Since the scope is global, all blocks under the root node are in scope
    BodyScoper.prototype.isBlockInScope = function (blockElement) {
        return this.rootNode.contains(blockElement.getStartNode());
    };
    // Since we're at body scope, inline elements never need to be trimmed
    BodyScoper.prototype.trimInlineElement = function (inlineElement) {
        return inlineElement;
    };
    return BodyScoper;
}());
exports.default = BodyScoper;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditorSelection_1 = __webpack_require__(21);
// This provides traversing content in a selection start block
// This is commonly used for those cursor context sensitive plugin
// i.e. Mentions, Hashtag etc. they want to know text being typed at cursor
// This provides a scope for parsing from cursor position up to begin of the selection block
var SelectionBlockScoper = /** @class */ (function () {
    function SelectionBlockScoper(rootNode, selectionRange, startPosition, inlineElementFactory) {
        this.startPosition = startPosition;
        this.editorSelection = new EditorSelection_1.default(rootNode, selectionRange, inlineElementFactory);
    }
    // Get the start block element
    SelectionBlockScoper.prototype.getStartBlockElement = function () {
        if (!this.selectionBlock) {
            this.selectionBlock = this.editorSelection.startBlockElement;
        }
        return this.selectionBlock;
    };
    // Get the start inline element
    // The start inline refers to inline before the selection start
    // The reason why we choose the one before rather after is, when cursor is at the end of a paragragh,
    // the one after likely will point to inline in next paragragh which may be null if the cursor is at bottom of editor
    SelectionBlockScoper.prototype.getStartInlineElement = function () {
        var theBlock = this.getStartBlockElement();
        var startInline;
        if (theBlock) {
            switch (this.startPosition) {
                case 0 /* Begin */:
                    startInline = theBlock.getFirstInlineElement();
                    break;
                case 1 /* End */:
                    startInline = theBlock.getLastInlineElement();
                    break;
                case 2 /* SelectionStart */:
                    // Get the inline before selection start point, and ensure it falls in the selection block
                    startInline = this.editorSelection.startInlineElement;
                    if (startInline && !theBlock.isInBlock(startInline)) {
                        startInline = null;
                    }
                    break;
            }
        }
        return startInline;
    };
    // This is special case to support when startInlineElement is null
    // startInlineElement being null can happen when cursor is in the end of block. In that case, there
    // isn't anything after the cursor so you get a null startInlineElement. The scoper works together
    // with content traverser. When users ask for a previous inline element and content traverser sees
    // a null startInline element, it will fall back to call this getInlineElementBeforeStart to get a
    // a previous inline element
    SelectionBlockScoper.prototype.getInlineElementBeforeStart = function () {
        var inlineBeforeStart;
        var theBlock = this.getStartBlockElement();
        if (theBlock && this.startPosition == 2 /* SelectionStart */) {
            // Get the inline before selection start point, and ensure it falls in the selection block
            inlineBeforeStart = this.editorSelection.inlineElementBeforeStart;
            if (inlineBeforeStart && !theBlock.isInBlock(inlineBeforeStart)) {
                inlineBeforeStart = null;
            }
        }
        return inlineBeforeStart;
    };
    SelectionBlockScoper.prototype.isBlockInScope = function (blockElement) {
        var theBlock = this.getStartBlockElement();
        return theBlock && blockElement ? theBlock.equals(blockElement) : false;
    };
    // Trim the incoming inline element, and return an inline element
    // This just tests and return the inline element if it is in block
    // This is a block scoper, which is not like selection scoper where it may cut an inline element in half
    // A block scoper does not cut an inline in half
    SelectionBlockScoper.prototype.trimInlineElement = function (inlineElement) {
        var theBlock = this.getStartBlockElement();
        return theBlock && inlineElement && theBlock.isInBlock(inlineElement)
            ? inlineElement
            : null;
    };
    return SelectionBlockScoper;
}());
exports.default = SelectionBlockScoper;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditorSelection_1 = __webpack_require__(21);
// This is selection scoper that provide a start inline as the start of the selection
// and checks if a block falls in the selection (isBlockInScope)
// last trimInlineElement to trim any inline element to return a partial that falls in the selection
var SelectionScoper = /** @class */ (function () {
    function SelectionScoper(rootNode, selectionRange, inlineElementFactory) {
        this.editorSelection = new EditorSelection_1.default(rootNode, selectionRange, inlineElementFactory);
    }
    // Provide a start block as the first block after the cursor
    SelectionScoper.prototype.getStartBlockElement = function () {
        return this.editorSelection.startBlockElement;
    };
    // Provide a start inline as the first inline after the cursor
    SelectionScoper.prototype.getStartInlineElement = function () {
        return this.editorSelection.startInlineElement;
    };
    // Checks if a block completely falls in the selection
    SelectionScoper.prototype.isBlockInScope = function (blockElement) {
        return blockElement ? this.editorSelection.isBlockInScope(blockElement) : false;
    };
    // Trim an incoming inline. If it falls completely outside selection, return null
    // otherwise return a partial that represents the portion that falls in the selection
    SelectionScoper.prototype.trimInlineElement = function (inlineElement) {
        return inlineElement ? this.editorSelection.trimInlineElement(inlineElement) : null;
    };
    return SelectionScoper;
}());
exports.default = SelectionScoper;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function applyFormat(element, format) {
    if (format) {
        var elementStyle = element.style;
        if (format.fontFamily) {
            elementStyle.fontFamily = format.fontFamily;
        }
        if (format.fontSize) {
            elementStyle.fontSize = format.fontSize;
        }
        if (format.textColor) {
            elementStyle.color = format.textColor;
        }
        if (format.backgroundColor) {
            elementStyle.backgroundColor = format.backgroundColor;
        }
        if (format.bold) {
            elementStyle.fontWeight = 'bold';
        }
        if (format.italic) {
            elementStyle.fontStyle = 'italic';
        }
        if (format.underline) {
            elementStyle.textDecoration = 'underline';
        }
    }
}
exports.default = applyFormat;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getComputedStyle_1 = __webpack_require__(15);
var getTagOfNode_1 = __webpack_require__(7);
var normalizeEditorPoint_1 = __webpack_require__(22);
function changeElementTag(element, newTag, range) {
    var start;
    var end;
    if (range) {
        start = normalizeEditorPoint_1.default(range.startContainer, range.startOffset);
        end = normalizeEditorPoint_1.default(range.endContainer, range.endOffset);
    }
    var newElement = element.ownerDocument.createElement(newTag);
    for (var i = 0; i < element.attributes.length; i++) {
        var attr = element.attributes[i];
        newElement.setAttribute(attr.name, attr.value);
    }
    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }
    if (getTagOfNode_1.default(element) == 'P') {
        newElement.style.marginTop = getComputedStyle_1.default(element, 'margin-top');
        newElement.style.marginBottom = getComputedStyle_1.default(element, 'margin-bottom');
    }
    if (element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
    }
    if (range && start.containerNode != element && end.containerNode != element) {
        try {
            range.setStart(start.containerNode, start.offset);
            range.setEnd(end.containerNode, end.offset);
        }
        catch (e) { }
    }
    return newElement;
}
exports.default = changeElementTag;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sanitizeHtml_1 = __webpack_require__(34);
/**
 * @deprecated Use sanitizeHtml() instead
 */
function convertInlineCss(sourceHtml, additionalStyleNodes) {
    return sanitizeHtml_1.default(sourceHtml, additionalStyleNodes, true /*convertInlineCssOnly*/);
}
exports.default = convertInlineCss;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VISIBLE_ELEMENT_SELECTORS = ['table', 'img', 'li'];
var ZERO_WIDTH_SPACE = '\u200b';
/**
 * Check if a given node has visible content
 */
function isNodeEmpty(node, trim) {
    var trimmer = trim ? function (text) { return text.trim(); } : function (text) { return text; };
    if (node.nodeType == 3 /* Text */) {
        return trimmer(node.data) == '';
    }
    else if (node.nodeType == 1 /* Element */) {
        var element = node;
        var textContent = trimmer(element.textContent);
        if (textContent != '' && textContent != ZERO_WIDTH_SPACE) {
            return false;
        }
        for (var _i = 0, VISIBLE_ELEMENT_SELECTORS_1 = VISIBLE_ELEMENT_SELECTORS; _i < VISIBLE_ELEMENT_SELECTORS_1.length; _i++) {
            var selector = VISIBLE_ELEMENT_SELECTORS_1[_i];
            if (element.querySelectorAll(selector).length > 0) {
                return false;
            }
        }
    }
    return true;
}
exports.default = isNodeEmpty;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(12);
var TextInlineElement_1 = __webpack_require__(20);
// Check if the inline is a text type inline element
// This essentially test if the inline is TextInlineElement
// or a partial inline element that decorates a TextInlineElement
function isTextualInlineElement(inlineElement) {
    var isTextualInlineElement = false;
    if (inlineElement) {
        isTextualInlineElement =
            inlineElement instanceof TextInlineElement_1.default ||
                (inlineElement instanceof PartialInlineElement_1.default &&
                    inlineElement.getDecoratedInline() instanceof
                        TextInlineElement_1.default);
    }
    return isTextualInlineElement;
}
exports.default = isTextualInlineElement;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// White space matching regex. It matches following chars:
// \s: white space
// \u00A0: no-breaking white space
// \u200B: zero width space
// \u3000: full width space (which can come from JPN IME)
var WHITESPACE_REGEX = /[\s\u00A0\u200B\u3000]+([^\s\u00A0\u200B\u3000]*)$/i;
function matchWhiteSpaces(source) {
    return WHITESPACE_REGEX.exec(source);
}
exports.default = matchWhiteSpaces;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Split parent node of the given node before/after the given node.
 * When a parent node contains [A,B,C] and pass B as the given node,
 * If split before, the new nodes will be [A][B,C] and returns [A];
 * otherwise, it will be [A,B][C] and returns [C].
 * @param node The node to split before/after
 * @param splitBefore Whether split before or after
 * @returns The new parent node
 */
function splitParentNode(node, splitBefore) {
    var parentNode = node.parentNode;
    var newParent = parentNode.cloneNode(false /*deep*/);
    if (splitBefore) {
        while (parentNode.firstChild && parentNode.firstChild != node) {
            newParent.appendChild(parentNode.firstChild);
        }
    }
    else {
        while (node.nextSibling) {
            newParent.appendChild(node.nextSibling);
        }
    }
    if (newParent.firstChild) {
        parentNode.parentNode.insertBefore(newParent, splitBefore ? parentNode : parentNode.nextSibling);
    }
    else {
        newParent = null;
    }
    return newParent;
}
exports.default = splitParentNode;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Removes the node and keep all children in place, return the parentNode where the children are attached
function unwrap(node) {
    // Unwrap requires a parentNode
    var parentNode = node ? node.parentNode : null;
    if (!parentNode) {
        return null;
    }
    while (node.firstChild) {
        parentNode.insertBefore(node.firstChild, node);
    }
    parentNode.removeChild(node);
    return parentNode;
}
exports.default = unwrap;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fromHtml_1 = __webpack_require__(19);
// Wrap all the node with html and return the wrapped node
// All nodes should be under same parent
function wrapAll(nodes, htmlFragment) {
    if (htmlFragment === void 0) { htmlFragment = '<div></div>'; }
    if (!nodes || nodes.length == 0) {
        return null;
    }
    var parentNode = nodes[0].parentNode;
    var wrapper = parentNode;
    if (htmlFragment) {
        wrapper = fromHtml_1.default(htmlFragment, nodes[0].ownerDocument)[0];
        if (parentNode) {
            parentNode.insertBefore(wrapper, nodes[0]);
        }
        for (var i = 0; i < nodes.length; i++) {
            wrapper.appendChild(nodes[i]);
        }
    }
    return wrapper;
}
exports.default = wrapAll;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VTable = /** @class */ (function () {
    function VTable(node) {
        var _this = this;
        this.trs = [];
        this.table = node instanceof HTMLTableElement ? node : getTableFromTd(node);
        if (this.table) {
            var currentTd_1 = node instanceof HTMLTableElement ? null : node;
            var trs = [].slice.call(this.table.rows);
            this.cells = trs.map(function (row) { return []; });
            trs.forEach(function (tr, rowIndex) {
                _this.trs[rowIndex % 2] = tr;
                for (var sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
                    // Skip the cells which already initialized
                    for (; _this.cells[rowIndex][targetCol]; targetCol++) { }
                    var td = tr.cells[sourceCol];
                    if (td == currentTd_1) {
                        _this.col = targetCol;
                        _this.row = rowIndex;
                    }
                    for (var colSpan = 0; colSpan < td.colSpan; colSpan++, targetCol++) {
                        for (var rowSpan = 0; rowSpan < td.rowSpan; rowSpan++) {
                            _this.cells[rowIndex + rowSpan][targetCol] = {
                                td: colSpan + rowSpan == 0 ? td : null,
                                spanLeft: colSpan > 0,
                                spanAbove: rowSpan > 0,
                            };
                        }
                    }
                }
            });
        }
    }
    VTable.prototype.writeBack = function () {
        var _this = this;
        if (this.cells) {
            VTable.moveChildren(this.table);
            this.table.style.borderCollapse = 'collapse';
            this.cells.forEach(function (row, r) {
                var tr = VTable.cloneNode(_this.trs[r % 2] || _this.trs[0]);
                _this.table.appendChild(tr);
                row.forEach(function (cell, c) {
                    if (cell.td) {
                        _this.recalcSpans(r, c);
                        tr.appendChild(cell.td);
                    }
                });
            });
        }
        else {
            this.table.parentNode.removeChild(this.table);
        }
    };
    VTable.prototype.applyFormat = function (format) {
        this.trs[0].style.backgroundColor = format.bgColorOdd || 'transparent';
        if (this.trs[1]) {
            this.trs[1].style.backgroundColor = format.bgColorEven || 'transparent';
        }
        this.cells.forEach(function (row) {
            return row.filter(function (cell) { return cell.td; }).forEach(function (cell) {
                cell.td.style.borderTop = getBorderStyle(format.topBorderColor);
                cell.td.style.borderBottom = getBorderStyle(format.bottomBorderColor);
                cell.td.style.borderLeft = getBorderStyle(format.verticalBorderColor);
                cell.td.style.borderRight = getBorderStyle(format.verticalBorderColor);
            });
        });
    };
    VTable.prototype.forEachCellOfCurrentColumn = function (callback) {
        for (var i = 0; i < this.cells.length; i++) {
            callback(this.getCell(i, this.col), this.cells[i], i);
        }
    };
    VTable.prototype.forEachCellOfCurrentRow = function (callback) {
        for (var i = 0; i < this.cells[this.row].length; i++) {
            callback(this.getCell(this.row, i), i);
        }
    };
    VTable.prototype.getCell = function (row, col) {
        return (this.cells[row] && this.cells[row][col]) || {};
    };
    VTable.prototype.getCurrentTd = function () {
        if (this.cells) {
            var row = Math.min(this.cells.length - 1, this.row);
            var col = Math.min(this.cells[row].length - 1, this.col);
            while (row >= 0 && col >= 0) {
                var cell = this.getCell(row, col);
                if (cell.td) {
                    return cell.td;
                }
                else if (cell.spanLeft) {
                    col--;
                }
                else if (cell.spanAbove) {
                    row--;
                }
                else {
                    break;
                }
            }
        }
        return null;
    };
    VTable.moveChildren = function (fromNode, toNode) {
        while (fromNode.firstChild) {
            if (toNode) {
                toNode.appendChild(fromNode.firstChild);
            }
            else {
                fromNode.removeChild(fromNode.firstChild);
            }
        }
    };
    VTable.cloneNode = function (node) {
        var newNode = node ? node.cloneNode(false /*deep*/) : null;
        if (newNode && newNode instanceof HTMLTableCellElement && !newNode.firstChild) {
            newNode.appendChild(node.ownerDocument.createElement('br'));
        }
        return newNode;
    };
    VTable.cloneCell = function (cell) {
        return {
            td: VTable.cloneNode(cell.td),
            spanAbove: cell.spanAbove,
            spanLeft: cell.spanLeft,
        };
    };
    VTable.prototype.recalcSpans = function (row, col) {
        var td = this.getCell(row, col).td;
        if (td) {
            td.colSpan = 1;
            td.rowSpan = 1;
            for (var i = col + 1; i < this.cells[row].length; i++) {
                var cell = this.getCell(row, i);
                if (cell.td || !cell.spanLeft) {
                    break;
                }
                td.colSpan = i + 1 - col;
            }
            for (var i = row + 1; i < this.cells.length; i++) {
                var cell = this.getCell(i, col);
                if (cell.td || !cell.spanAbove) {
                    break;
                }
                td.rowSpan = i + 1 - row;
            }
        }
    };
    return VTable;
}());
exports.default = VTable;
function getTableFromTd(td) {
    var result = td;
    for (; result && result.tagName != 'TABLE'; result = result.parentElement) { }
    return result;
}
function getBorderStyle(style) {
    return 'solid 1px ' + (style || 'transparent');
}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var applyInlineStyle_1 = __webpack_require__(71);
var attachDomEvent_1 = __webpack_require__(72);
var focus_1 = __webpack_require__(73);
var getContentTraverser_1 = __webpack_require__(74);
var getCustomData_1 = __webpack_require__(75);
var getCursorRect_1 = __webpack_require__(76);
var getSelectionRange_1 = __webpack_require__(77);
var hasFocus_1 = __webpack_require__(78);
var insertNode_1 = __webpack_require__(79);
var triggerEvent_1 = __webpack_require__(80);
var updateSelection_1 = __webpack_require__(81);
var roosterjs_editor_dom_1 = __webpack_require__(0);
function createEditorCore(contentDiv, options) {
    return {
        contentDiv: contentDiv,
        document: contentDiv.ownerDocument,
        inlineElementFactory: new roosterjs_editor_dom_1.InlineElementFactory(),
        defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat),
        customData: {},
        cachedSelectionRange: null,
        plugins: (options.plugins || []).filter(function (plugin) { return !!plugin; }),
        idleLoopHandle: 0,
        ignoreIdleEvent: false,
        api: createCoreApiMap(options.coreApiOverride),
    };
}
exports.default = createEditorCore;
function calcDefaultFormat(node, baseFormat) {
    baseFormat = baseFormat || {};
    return {
        fontFamily: baseFormat.fontFamily || roosterjs_editor_dom_1.getComputedStyle(node, 'font-family'),
        fontSize: baseFormat.fontSize || roosterjs_editor_dom_1.getComputedStyle(node, 'font-size'),
        textColor: baseFormat.textColor || roosterjs_editor_dom_1.getComputedStyle(node, 'color'),
        backgroundColor: baseFormat.backgroundColor || '',
        bold: baseFormat.bold,
        italic: baseFormat.italic,
        underline: baseFormat.underline,
    };
}
function createCoreApiMap(map) {
    map = map || {};
    return {
        applyInlineStyle: map.applyInlineStyle || applyInlineStyle_1.default,
        attachDomEvent: map.attachDomEvent || attachDomEvent_1.default,
        focus: map.focus || focus_1.default,
        getContentTraverser: map.getContentTraverser || getContentTraverser_1.default,
        getCustomData: map.getCustomData || getCustomData_1.default,
        getCursorRect: map.getCursorRect || getCursorRect_1.default,
        getSelectionRange: map.getSelectionRange || getSelectionRange_1.default,
        hasFocus: map.hasFocus || hasFocus_1.default,
        insertNode: map.insertNode || insertNode_1.default,
        triggerEvent: map.triggerEvent || triggerEvent_1.default,
        updateSelection: map.updateSelection || updateSelection_1.default,
    };
}


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ZERO_WIDTH_SPACE = '&#8203;';
// Apply inline style to collapsed selection
// Use case is that users do not select anything, and then choose a style first (i.e. a font name), and then type and expect text to have the style
// The problem here is that there isn't a concrete DOM element to apply the style
// The workaround is to create a SPAN and have the style applied on the SPAN, and then re-position cursor within the SPAN where typing can happen
// TODO: what if user position this in an inlne element, i.e. hashtag, creating a span within an existing inline element may not be a good idea
function applyInlineStyleToCollapsedSelection(core, selectionRange, styler) {
    // let's just be simple to create a new span to hold the style
    // TODO: maybe we should be a bit smarter to see if we're in a span, and apply the style in parent span
    var element = core.document.createElement('SPAN');
    // Some content is needed to position selection into the span
    // for here, we inject ZWS - zero width space
    element.innerHTML = ZERO_WIDTH_SPACE;
    styler(element);
    selectionRange.insertNode(element);
    // reset selection to be after the ZWS (rather than selecting it)
    // This is needed so that the cursor still looks blinking inside editor
    // This also means an extra ZWS will be in editor
    // TODO: somewhere in returning content to consumer, we may need to do a cleanup for ZWS
    var updatedRange = core.document.createRange();
    updatedRange.selectNodeContents(element);
    updatedRange.collapse(false /* toStart */);
    core.api.updateSelection(core, updatedRange);
}
// Apply style to non collapsed selection
// It does that by looping through all inline element that can be found in the selection
// and apply style on each individual inline element
function applyInlineStyleToNonCollapsedSelection(core, selectionRange, styler) {
    // This is start and end node that get the style. The start and end needs to be recorded so that selection
    // can be re-applied post-applying style
    var startNode;
    var endNode;
    var contentTraverser = core.api.getContentTraverser(core, 1 /* Selection */);
    // Just loop through all inline elements in the selection and apply style for each
    var startInline = contentTraverser.currentInlineElement;
    while (startInline) {
        // Need to obtain next inline first. Applying styles changes DOM which may mess up with the navigation
        var nextInline = contentTraverser.getNextInlineElement();
        startInline.applyStyle(function (element) {
            styler(element);
            if (!startNode) {
                startNode = element;
            }
            endNode = element;
        });
        startInline = nextInline;
    }
    // When selectionStartNode/EndNode is set, it means there is DOM change. Re-create the selection
    if (startNode && endNode) {
        // Set the selection
        var updatedRange = core.document.createRange();
        updatedRange.setStartBefore(startNode);
        updatedRange.setEndAfter(endNode);
        core.api.updateSelection(core, updatedRange);
    }
}
// Apply inline style to current selection
var applyInlineStyle = function (core, styler) {
    core.api.focus(core);
    var selectionRange = core.api.getSelectionRange(core, false /*tryGetFromCache*/);
    if (selectionRange) {
        // TODO: Chrome has a bug that when the selection spans over several empty text nodes,
        // it may incorrectly report range not to be collapsed.
        // We may do a browser check to force it to go collapsed code path when we see an empty range
        // UserAgent.GetInstance().IsBrowserChrome && range.toString() == _String.Empty
        if (selectionRange.collapsed) {
            applyInlineStyleToCollapsedSelection(core, selectionRange, styler);
        }
        else {
            applyInlineStyleToNonCollapsedSelection(core, selectionRange, styler);
        }
    }
};
exports.default = applyInlineStyle;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var attachDomEvent = function (core, eventName, pluginEventType, beforeDispatch) {
    var onEvent = function (event) {
        if (beforeDispatch) {
            beforeDispatch(event);
        }
        if (pluginEventType != null) {
            core.api.triggerEvent(core, {
                eventType: pluginEventType,
                rawEvent: event,
            }, false /*broadcast*/);
        }
        // Ignore idle event since there is DOM event happened
        core.ignoreIdleEvent = true;
    };
    core.contentDiv.addEventListener(eventName, onEvent);
    return function () {
        core.contentDiv.removeEventListener(eventName, onEvent);
    };
};
exports.default = attachDomEvent;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isVoidHtmlElement_1 = __webpack_require__(35);
var roosterjs_editor_dom_1 = __webpack_require__(0);
var focus = function (core) {
    if (!core.api.hasFocus(core) || !core.api.getSelectionRange(core, false /*tryGetFromCache*/)) {
        // Focus (document.activeElement indicates) and selection are mostly in sync, but could be out of sync in some extreme cases.
        // i.e. if you programmatically change window selection to point to a non-focusable DOM element (i.e. tabindex=-1 etc.).
        // On Chrome/Firefox, it does not change document.activeElement. On Edge/IE, it change document.activeElement to be body
        // Although on Chrome/Firefox, document.activeElement points to editor, you cannot really type which we don't want (no cursor).
        // So here we always do a live selection pull on DOM and make it point in Editor. The pitfall is, the cursor could be reset
        // to very begin to of editor since we don't really have last saved selection (created on blur which does not fire in this case).
        // It should be better than the case you cannot type
        if (!core.cachedSelectionRange ||
            !core.api.updateSelection(core, core.cachedSelectionRange)) {
            setSelectionToBegin(core);
        }
    }
    // remember to clear cachedSelectionRange
    core.cachedSelectionRange = null;
    // This is more a fallback to ensure editor gets focus if it didn't manage to move focus to editor
    if (!core.api.hasFocus(core)) {
        core.contentDiv.focus();
    }
};
function setSelectionToBegin(core) {
    var range;
    var firstNode = roosterjs_editor_dom_1.getFirstLeafNode(core.contentDiv);
    if (firstNode) {
        if (firstNode.nodeType == 3 /* Text */) {
            // First node is text, move range to the begin
            range = core.document.createRange();
            range.setStart(firstNode, 0);
        }
        else if (firstNode.nodeType == 1 /* Element */) {
            if (isVoidHtmlElement_1.default(firstNode)) {
                // First node is a html void element (void elements cannot have child nodes), move range before it
                range = core.document.createRange();
                range.setStartBefore(firstNode);
            }
            else {
                // Other html element, move range inside it
                range = core.document.createRange();
                range.setStart(firstNode, 0);
            }
        }
    }
    else {
        // No first node, likely we have an empty content DIV, move range inside it
        range = core.document.createRange();
        range.setStart(core.contentDiv, 0);
    }
    if (range) {
        core.api.updateSelection(core, range);
    }
}
exports.default = focus;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var getContentTraverser = function (core, scope, position) {
    if (position === void 0) { position = 2 /* SelectionStart */; }
    var selectionRange = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
    if (scope != 2 /* Body */ && !selectionRange) {
        return null;
    }
    var contentTraverser;
    var scoper;
    switch (scope) {
        case 0 /* Block */:
            scoper = new roosterjs_editor_dom_1.SelectionBlockScoper(core.contentDiv, selectionRange, position, core.inlineElementFactory);
            break;
        case 1 /* Selection */:
            scoper = new roosterjs_editor_dom_1.SelectionScoper(core.contentDiv, selectionRange, core.inlineElementFactory);
            break;
        case 2 /* Body */:
            scoper = new roosterjs_editor_dom_1.BodyScoper(core.contentDiv, core.inlineElementFactory);
            break;
    }
    if (scoper) {
        contentTraverser = new roosterjs_editor_dom_1.ContentTraverser(core.contentDiv, scoper, core.inlineElementFactory);
    }
    return contentTraverser;
};
exports.default = getContentTraverser;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getCustomData = function (core, key, getter, disposer) {
    var customData = core.customData;
    return (customData[key] = customData[key] || {
        value: getter(),
        disposer: disposer,
    }).value;
};
exports.default = getCustomData;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var BrowserData_1 = __webpack_require__(10);
/**
 * Returns a rect representing the location of the cursor.
 * In case there is a uncollapsed selection witin editor, this returns
 * the position for focus node.
 * The returned rect structure has a left and right and they should be same
 * here since it is for cursor, not for a range.
 */
var getCursorRect = function (core) {
    var selection = core.document.defaultView.getSelection();
    var range = core.api.getSelectionRange(core, false /*tryGetFromCache*/);
    if (!range || !selection || !selection.focusNode || !selection.anchorNode) {
        return null;
    }
    var focusPosition = roosterjs_editor_dom_1.normalizeEditorPoint(selection.focusNode, selection.focusOffset);
    var node = focusPosition.containerNode;
    // 1) obtain a collapsed range pointing to cursor
    if (!range.collapsed) {
        var forwardSelection = roosterjs_editor_dom_1.isEditorPointAfter(focusPosition, roosterjs_editor_dom_1.normalizeEditorPoint(selection.anchorNode, selection.anchorOffset));
        range = range.cloneRange();
        range.collapse(!forwardSelection /*toStart*/);
    }
    // 2) try to get rect using range.getBoundingClientRect()
    var rect = getRectFromClientRect(range.getBoundingClientRect());
    // 3) if current cursor is inside text node, use range.getClientRects() for safari or insert a SPAN and get the rect of SPAN for others
    if (!rect) {
        if (BrowserData_1.default.isSafari) {
            var rects = range.getClientRects();
            if (rects && rects.length == 1) {
                rect = getRectFromClientRect(rects[0]);
            }
        }
        else {
            if (!rect && node.nodeType == 3 /* Text */) {
                var document_1 = core.document;
                var span = document_1.createElement('SPAN');
                var range_1 = document_1.createRange();
                range_1.setStart(node, focusPosition.offset);
                range_1.collapse(true /*toStart*/);
                range_1.insertNode(span);
                rect = getRectFromClientRect(span.getBoundingClientRect());
                span.parentNode.removeChild(span);
            }
        }
    }
    // 4) fallback to element.getBoundingClientRect()
    if (!rect) {
        node = node.nodeType == 1 /* Element */ ? node : node.parentNode;
        if (node && node.nodeType == 1 /* Element */) {
            rect = getRectFromClientRect(node.getBoundingClientRect());
        }
    }
    return rect;
};
function getRectFromClientRect(clientRect) {
    // A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
    // We validate that and only return a rect when the passed in ClientRect is valid
    return clientRect &&
        (clientRect.left != 0 ||
            clientRect.right != 0 ||
            clientRect.left != 0 ||
            clientRect.right != 0)
        ? {
            left: Math.round(clientRect.left),
            right: Math.round(clientRect.right),
            top: Math.round(clientRect.top),
            bottom: Math.round(clientRect.bottom),
        }
        : null;
}
exports.default = getCursorRect;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isRangeInContainer_1 = __webpack_require__(36);
var getSelectionRange = function (core, tryGetFromCache) {
    var result = null;
    if (!tryGetFromCache || core.api.hasFocus(core)) {
        var selection = core.document.defaultView.getSelection();
        if (selection && selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            if (isRangeInContainer_1.default(range, core.contentDiv)) {
                result = range;
            }
        }
    }
    if (!result && tryGetFromCache) {
        result = core.cachedSelectionRange;
    }
    return result;
};
exports.default = getSelectionRange;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var hasFocus = function (core) {
    var activeElement = core.document.activeElement;
    return (activeElement &&
        (core.contentDiv == activeElement || roosterjs_editor_dom_1.contains(core.contentDiv, activeElement)));
};
exports.default = hasFocus;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isVoidHtmlElement_1 = __webpack_require__(35);
var roosterjs_editor_dom_1 = __webpack_require__(0);
var HTML_EMPTY_DIV = '<div></div>';
var insertNode = function (core, node, option) {
    option = option || {
        position: 2 /* SelectionStart */,
        updateCursor: true,
        replaceSelection: true,
        insertOnNewLine: false,
    };
    if (option.updateCursor) {
        core.api.focus(core);
    }
    switch (option.position) {
        case 0 /* Begin */:
            insertNodeAtBegin(core, node, option);
            break;
        case 1 /* End */:
            insertNodeAtEnd(core, node, option);
            break;
        case 2 /* SelectionStart */:
            insertNodeAtSelection(core, node, option);
            break;
        case 3 /* Outside */:
            core.contentDiv.parentNode.insertBefore(node, core.contentDiv.nextSibling);
            break;
    }
    return true;
};
exports.default = insertNode;
// Insert a node at begin of the editor
function insertNodeAtBegin(core, node, option) {
    var firstBlock = roosterjs_editor_dom_1.getFirstBlockElement(core.contentDiv, core.inlineElementFactory);
    var insertedNode;
    if (firstBlock) {
        var refNode = firstBlock.getStartNode();
        var refParentNode = refNode.parentNode;
        if (option.insertOnNewLine) {
            // For insert on new line, insert it before the start of block
            insertedNode = refParentNode.insertBefore(node, refNode);
        }
        else {
            // not to insert on new line (to insert inline)
            // we shall try to insert the node in the block
            if (refNode.firstChild) {
                // if the refNode has firstChild, insert the new node before first child
                // i.e. <div>hello</div>, first child will be hello. We want to insert the content
                // before hello, but still within the DIV
                insertedNode = refNode.insertBefore(node, refNode.firstChild);
            }
            else if (refNode.nodeType == 3 /* Text */ ||
                isVoidHtmlElement_1.default(refNode)) {
                // refNode is text or void html element (HR, BR etc.) which cannot have children
                // i.e. <div>hello<br>world</div>, first block is hello<br>
                // we want to insert the node before hello, but still within the DIV
                insertedNode = refParentNode.insertBefore(node, refNode);
            }
            else {
                // refNode is element type. It does not have children, but can have children
                // i.e. empty block <div></div>
                // Use appendChild to append it into refNode
                insertedNode = refNode.appendChild(node);
            }
        }
    }
    else {
        // No first block, this can happen when editor is empty. Use appendChild to insert the content in contentDiv
        insertedNode = core.contentDiv.appendChild(node);
    }
    // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
    // add a DIV wrapping
    if (insertedNode && option.insertOnNewLine && !roosterjs_editor_dom_1.isBlockElement(insertedNode)) {
        roosterjs_editor_dom_1.wrap(insertedNode, HTML_EMPTY_DIV);
    }
}
// Insert a node at end of the editor
function insertNodeAtEnd(core, node, option) {
    var lastBlock = roosterjs_editor_dom_1.getLastBlockElement(core.contentDiv, core.inlineElementFactory);
    var insertedNode;
    if (lastBlock) {
        var refNode = lastBlock.getEndNode();
        var refParentNode = refNode.parentNode;
        if (option.insertOnNewLine) {
            // For insert on new line, insert it after the refNode (before refNode's next sibling)
            // The second param to insertBefore can be null, which means to insert at the end
            // refNode.nextSibling can be null, which ok and in that case, insertBefore behaves just like appendChild
            insertedNode = refParentNode.insertBefore(node, refNode.nextSibling);
        }
        else {
            // not to insert on new line (to insert inline)
            // the node needs to be inserted within the block
            if (refNode.lastChild) {
                // if the refNode has lastChild, use appendChild (which is like to insert as last child)
                // i.e. <div>hello</div>, the content will be inserted after hello
                insertedNode = refNode.appendChild(node);
            }
            else if (refNode.nodeType == 3 /* Text */ ||
                isVoidHtmlElement_1.default(refNode)) {
                // refNode is text or void html element (HR, BR etc.) which cannot have children
                // i.e. <div>hello<br>world</div>, world is the last block
                insertedNode = refParentNode.insertBefore(node, refNode.nextSibling);
            }
            else {
                // refNode is element type (other than void element), insert it as a child to refNode
                // i.e. <div></div>
                insertedNode = refNode.appendChild(node);
            }
        }
    }
    else {
        // No last block, editor is likely empty, use appendChild
        insertedNode = core.contentDiv.appendChild(node);
    }
    // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
    // add a DIV wrapping
    if (insertedNode && option.insertOnNewLine && !roosterjs_editor_dom_1.isBlockElement(insertedNode)) {
        roosterjs_editor_dom_1.wrap(insertedNode, HTML_EMPTY_DIV);
    }
}
// Insert node at selection
function insertNodeAtSelection(core, node, option) {
    var selectionRange = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
    if (selectionRange) {
        // if to replace the selection and the selection is not collapsed, remove the the content at selection first
        if (option.replaceSelection && !selectionRange.collapsed) {
            selectionRange.deleteContents();
        }
        // Create a clone (backup) for the selection first as we may need to restore to it later
        var originalSelectionRange = selectionRange.cloneRange();
        var editorSelection = new roosterjs_editor_dom_1.EditorSelection(core.contentDiv, selectionRange, core.inlineElementFactory);
        var blockElement = editorSelection.startBlockElement;
        if (blockElement) {
            var endNode = blockElement.getEndNode();
            if (option.insertOnNewLine) {
                // Adjust the insertion point
                // option.insertOnNewLine means to insert on a block after the selection, not really right at the selection
                // This is commonly used when users want to insert signature. They could place cursor somewhere mid of a line
                // and insert signature, they actually want signature to be inserted the line after the selection
                selectionRange.setEndAfter(endNode);
                selectionRange.collapse(false /*toStart*/);
            }
            else {
                preprocessNode(core, selectionRange, node, endNode);
            }
        }
        var nodeForCursor = node.nodeType == 11 /* DocumentFragment */ ? node.lastChild : node;
        selectionRange.insertNode(node);
        if (option.updateCursor && nodeForCursor) {
            selectionRange.setEndAfter(nodeForCursor);
            selectionRange.collapse(false /*toStart*/);
            core.api.updateSelection(core, selectionRange);
        }
        else {
            core.api.updateSelection(core, originalSelectionRange);
        }
    }
}
function preprocessNode(core, range, nodeToInsert, currentNode) {
    var rootNodeToInsert = nodeToInsert;
    if (rootNodeToInsert.nodeType == 11 /* DocumentFragment */) {
        var rootNodes = [].slice.call(rootNodeToInsert.childNodes).filter(function (n) { return roosterjs_editor_dom_1.getTagOfNode(n) != 'BR'; });
        rootNodeToInsert = rootNodes.length == 1 ? rootNodes[0] : null;
    }
    var tag = roosterjs_editor_dom_1.getTagOfNode(rootNodeToInsert);
    if ((tag == 'OL' || tag == 'UL') && roosterjs_editor_dom_1.getTagOfNode(rootNodeToInsert.firstChild) == 'LI') {
        var shouldInsertListAsText = !rootNodeToInsert.firstChild.nextSibling &&
            roosterjs_editor_dom_1.getTagOfNode(rootNodeToInsert.nextSibling) != 'BR';
        if (roosterjs_editor_dom_1.getTagOfNode(rootNodeToInsert.nextSibling) == 'BR' && rootNodeToInsert.parentNode) {
            rootNodeToInsert.parentNode.removeChild(rootNodeToInsert.nextSibling);
        }
        if (shouldInsertListAsText) {
            roosterjs_editor_dom_1.unwrap(rootNodeToInsert.firstChild);
            roosterjs_editor_dom_1.unwrap(rootNodeToInsert);
        }
        else {
            var listNode = currentNode;
            while (roosterjs_editor_dom_1.getTagOfNode(listNode.parentNode) != tag &&
                roosterjs_editor_dom_1.contains(core.contentDiv, listNode)) {
                listNode = listNode.parentNode;
            }
            if (roosterjs_editor_dom_1.getTagOfNode(listNode.parentNode) == tag) {
                if (roosterjs_editor_dom_1.isNodeEmpty(listNode) || isSelectionAtBeginningOf(range, listNode)) {
                    range.setEndBefore(listNode);
                }
                else {
                    range.setEndAfter(listNode);
                }
                range.collapse(false /*toStart*/);
                roosterjs_editor_dom_1.unwrap(rootNodeToInsert);
            }
        }
    }
    if (roosterjs_editor_dom_1.getTagOfNode(currentNode) == 'P') {
        // Insert into a P tag may cause issues when the inserted content contains any block element.
        // Change P tag to DIV to make sure it works well
        roosterjs_editor_dom_1.changeElementTag(currentNode, 'div', range);
    }
    if (isVoidHtmlElement_1.default(range.endContainer)) {
        range.setEndBefore(range.endContainer);
    }
}
function isSelectionAtBeginningOf(range, node) {
    if (range) {
        if (range.startOffset > 0 &&
            range.startContainer.nodeType == 1 /* Element */ &&
            range.startContainer.childNodes[range.startOffset] == node) {
            return true;
        }
        else if (range.startOffset == 0) {
            var container = range.startContainer;
            while (container != node &&
                roosterjs_editor_dom_1.contains(node, container) &&
                (!container.previousSibling || roosterjs_editor_dom_1.isNodeEmpty(container.previousSibling))) {
                container = container.parentNode;
            }
            if (container == node) {
                return true;
            }
        }
    }
    return false;
}


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var triggerEvent = function (core, pluginEvent, broadcast) {
    if (broadcast || !core.plugins.some(function (plugin) { return handledExclusively(pluginEvent, plugin); })) {
        core.plugins.forEach(function (plugin) {
            if (plugin.onPluginEvent) {
                plugin.onPluginEvent(pluginEvent);
            }
        });
    }
};
function handledExclusively(event, plugin) {
    if (plugin.onPluginEvent &&
        plugin.willHandleEventExclusively &&
        plugin.willHandleEventExclusively(event)) {
        plugin.onPluginEvent(event);
        return true;
    }
    return false;
}
exports.default = triggerEvent;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isRangeInContainer_1 = __webpack_require__(36);
var updateSelection = function (core, range) {
    var selectionUpdated = false;
    if (isRangeInContainer_1.default(range, core.contentDiv)) {
        var selection = core.document.defaultView.getSelection();
        if (selection) {
            // Workaround IE exception 800a025e
            try {
                selection.removeAllRanges();
            }
            catch (e) { }
            selection.addRange(range);
            if (!core.api.hasFocus(core)) {
                core.cachedSelectionRange = range;
            }
            selectionUpdated = true;
        }
    }
    return selectionUpdated;
};
exports.default = updateSelection;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Clear a specifc cached data (as specified by a key) in a plugin event
function clearEventDataCache(event, key) {
    if (event && event.eventDataCache && event.eventDataCache.hasOwnProperty(key)) {
        delete event.eventDataCache[key];
    }
}
exports.clearEventDataCache = clearEventDataCache;
// Return the cached event data per cache key if there is already one.
// If not, create one and put it in event data cache
function cacheGetEventData(event, key, getter) {
    var result = event && event.eventDataCache && event.eventDataCache.hasOwnProperty(key)
        ? event.eventDataCache[key]
        : getter();
    if (event) {
        event.eventDataCache = event.eventDataCache || {};
        event.eventDataCache[key] = result;
    }
    return result;
}
exports.cacheGetEventData = cacheGetEventData;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CursorData_1 = __webpack_require__(23);
var roosterjs_editor_core_1 = __webpack_require__(2);
var EVENTDATACACHE_CURSORDATA = 'CURSORDATA';
/**
 * Read CursorData from plugin event cache. If not, create one
 * @param event The plugin event, it stores the event cached data for looking up.
 * If passed as null, we will create a new cursor data
 * @param editor The editor instance
 * @returns The cursor data
 */
function cacheGetCursorEventData(event, editor) {
    return roosterjs_editor_core_1.cacheGetEventData(event, EVENTDATACACHE_CURSORDATA, function () {
        return new CursorData_1.default(editor);
    });
}
exports.default = cacheGetCursorEventData;
/**
 * Clear the cursor data in a plugin event.
 * This is called when the cursor data is changed, e.g, the text is replace with HyperLink
 * @param event The plugin event
 */
function clearCursorEventDataCache(event) {
    roosterjs_editor_core_1.clearEventDataCache(event, EVENTDATACACHE_CURSORDATA);
}
exports.clearCursorEventDataCache = clearCursorEventDataCache;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CursorData_1 = __webpack_require__(23);
var replaceRangeWithNode_1 = __webpack_require__(37);
/**
 * Validate the text matches what's before the cursor, and return the range for it
 * @param editor The editor instance
 * @param text The text to match against
 * @param exactMatch Whether it is an exact match
 * @param cursorData The cursor data
 * @returns The range for the matched text, null if unable to find a match
 */
function validateAndGetRangeForTextBeforeCursor(editor, text, exactMatch, cursorData) {
    if (!text || text.length == 0) {
        return;
    }
    // This function works backwards to do match as text node is found. We used two set of "text" and "index"
    // text, textIndex is for the whole text to be matched
    // nodeContent, nodeIndex is for current text node found before cursor
    // Every time a new node is found, nodeContent and nodeIndex will be reset, while text remains, and textIndex
    // keep decreasing till it reaches -1 (on a match case) or mismatch half way
    var matchComplete = false;
    // The range for the matched text
    var range = editor.getDocument().createRange();
    // This is the start index, which points to last char from text. We match from end to begin
    var textIndex = text.length - 1;
    // endMatched to indicate if the end of text is matched
    // For exactMatch, since we need to match from last char, endMatched should just be true right away
    // For exactMatch == false, endMatched is set when first same char is seen from the text node that
    // can match last char from text as we walk backwards
    var endMatched = exactMatch;
    // The end of range is set or not
    var endOfRangeSet = false;
    // The cursor data, create a new one from editor when not supplied
    var cursor = cursorData || new CursorData_1.default(editor);
    cursor.getTextSectionBeforeCursorTill(function (textInline) {
        var nodeContent = textInline.getTextContent();
        var nodeIndex = nodeContent ? nodeContent.length - 1 : -1;
        while (nodeIndex >= 0 && textIndex >= 0) {
            if (text.charCodeAt(textIndex) == nodeContent.charCodeAt(nodeIndex)) {
                if (!endMatched) {
                    endMatched = true;
                }
                // on first time when end is matched, set the end of range
                if (endMatched && !endOfRangeSet) {
                    range.setEnd(textInline.getContainerNode(), textInline.getStartPoint().offset + nodeIndex + 1);
                    endOfRangeSet = true;
                }
                // Move both index one char backward
                nodeIndex--;
                textIndex--;
            }
            else {
                // We have a mis-match here
                // if exactMatch is desired or endMatched is already matched,
                // we should just call it an unsuccessful match and return
                if (exactMatch || endMatched) {
                    matchComplete = true;
                    break;
                }
                else {
                    // This is the case where exactMatch == false, and end is not matched yet
                    // minus just nodeIndex, since we're still trying to match the end char
                    nodeIndex--;
                }
            }
        }
        // when textIndex == -1, we have a successful complete match
        if (textIndex == -1) {
            matchComplete = true;
            range.setStart(textInline.getContainerNode(), textInline.getStartPoint().offset + nodeIndex + 1);
        }
        return matchComplete;
    });
    // textIndex == -1 means a successful complete match
    return textIndex == -1 ? range : null;
}
exports.validateAndGetRangeForTextBeforeCursor = validateAndGetRangeForTextBeforeCursor;
/**
 * Replace text before cursor with a node
 * @param editor The editor instance
 * @param text The text for matching. We will try to match the text with the text before cursor
 * @param node The node to replace the text with
 * @param exactMatch exactMatch is to match exactly, i.e.
 * In auto linkification, users could type URL followed by some punctuation and hit space. The auto link will kick in on space,
 * at the moment, what is before cursor could be "<URL>,", however, only "<URL>" makes the link. by setting exactMatch = false, it does not match
 * from right before cursor, but can scan through till first same char is seen. On the other hand if set exactMatch = true, it starts the match right
 * before cursor.
 * @param cursorData
 */
function replaceTextBeforeCursorWithNode(editor, text, node, exactMatch, cursorData) {
    // Make sure the text and node is valid
    if (!text || text.length == 0 || !node) {
        return false;
    }
    var replaced = false;
    var range = validateAndGetRangeForTextBeforeCursor(editor, text, exactMatch, cursorData);
    if (range) {
        replaced = replaceRangeWithNode_1.default(editor, range, node, exactMatch);
    }
    return replaced;
}
exports.default = replaceTextBeforeCursorWithNode;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var setBackgroundColor_1 = __webpack_require__(39);
var setFontName_1 = __webpack_require__(40);
var setFontSize_1 = __webpack_require__(41);
var setTextColor_1 = __webpack_require__(42);
var queryNodesWithSelection_1 = __webpack_require__(3);
var STYLES_TO_REMOVE = ['font', 'text-decoration', 'color', 'background'];
/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/align left/align right/align center/superscript/subscript
 * @param editor The editor instance
 */
function clearFormat(editor) {
    editor.focus();
    // We have no way if this clear format will really result in any DOM change
    // Let's just do it with undo
    execFormatWithUndo_1.default(editor, function () {
        editor.runWithoutAddingUndoSnapshot(function () {
            editor.getDocument().execCommand('removeFormat', false, null);
            var nodes = queryNodesWithSelection_1.default(editor, '[class]');
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                node.removeAttribute('class');
            }
            nodes = queryNodesWithSelection_1.default(editor, '[style]', true /*nodeContainedByRangeOnly*/);
            var _loop_1 = function (node) {
                STYLES_TO_REMOVE.forEach(function (style) { return node.style.removeProperty(style); });
            };
            for (var _a = 0, nodes_2 = nodes; _a < nodes_2.length; _a++) {
                var node = nodes_2[_a];
                _loop_1(node);
            }
            var defaultFormat = editor.getDefaultFormat();
            setFontName_1.default(editor, defaultFormat.fontFamily);
            setFontSize_1.default(editor, defaultFormat.fontSize);
            setTextColor_1.default(editor, defaultFormat.textColor);
            setBackgroundColor_1.default(editor, defaultFormat.backgroundColor);
        });
    });
}
exports.default = clearFormat;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var isSelectionCollapsed_1 = __webpack_require__(5);
var matchLink_1 = __webpack_require__(43);
var queryNodesWithSelection_1 = __webpack_require__(3);
// Regex matching Uri scheme
var URI_REGEX = /^[a-zA-Z]+:/i;
// Regex matching begin of email address
var MAILTO_REGEX = /^[\w.%+-]+@/i;
// Regex matching begin of ftp, i.e. ftp.microsoft.com
var FTP_REGEX = /^ftp\./i;
var TEMP_TITLE = 'istemptitle';
function applyLinkPrefix(url) {
    if (!url) {
        return url;
    }
    // Add link prefix per rule:
    // (a) if the url always starts with a URI scheme, leave it as it is
    // (b) if the url is an email address, xxx@... add mailto: prefix
    // (c) if the url starts with ftp., add ftp:// prefix
    // (d) rest, add http:// prefix
    var prefix = '';
    if (url.search(URI_REGEX) < 0) {
        if (url.search(MAILTO_REGEX) == 0) {
            prefix = 'mailto:';
        }
        else if (url.search(FTP_REGEX) == 0) {
            prefix = 'ftp://';
        }
        else {
            // fallback to http://
            prefix = 'http://';
        }
    }
    return prefix + url;
}
/**
 * Insert a hyperlink at cursor.
 * When there is a selection, hyperlink will be applied to the selection,
 * otherwise a hyperlink will be inserted to the cursor position.
 * @param editor Editor object
 * @param link Link address, can be http(s), mailto, notes, file, unc, ftp, news, telnet, gopher, wais.
 * When protocol is not specified, a best matched protocol will be predicted.
 * @param altText Optional alt text of the link, will be shown when hover on the link
 * @param displayText Optional display text for the link.
 * If specified, the display text of link will be replaced with this text.
 * If not specified and there wasn't a link, the link url will be used as display text.
 */
function createLink(editor, link, altText, displayText) {
    editor.focus();
    var url = link ? link.trim() : '';
    if (url) {
        var linkData = matchLink_1.default(url);
        // matchLink can match most links, but not all, i.e. if you pass link a link as "abc", it won't match
        // we know in that case, users will want to insert a link like http://abc
        // so we have separate logic in applyLinkPrefix to add link prefix depending on the format of the link
        // i.e. if the link starts with something like abc@xxx, we will add mailto: prefix
        // if the link starts with ftp.xxx, we will add ftp:// link. For more, see applyLinkPrefix
        var normalizedUrl_1 = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        var originalUrl_1 = linkData ? linkData.originalUrl : url;
        var anchor_1 = null;
        execFormatWithUndo_1.default(editor, function () {
            if (isSelectionCollapsed_1.default(editor)) {
                anchor_1 = getAnchorNodeAtCursor(editor);
                // If there is already a link, just change its href
                if (anchor_1) {
                    anchor_1.href = normalizedUrl_1;
                    // Change text content if it is specified
                    updateAnchorDisplayText(anchor_1, displayText);
                }
                else {
                    anchor_1 = editor.getDocument().createElement('A');
                    anchor_1.textContent = displayText || originalUrl_1;
                    anchor_1.href = normalizedUrl_1;
                    editor.insertNode(anchor_1);
                }
            }
            else {
                /* the selection is not collapsed, use browser execCommand */
                editor.getDocument().execCommand('createLink', false, normalizedUrl_1);
                anchor_1 = getAnchorNodeAtCursor(editor);
                updateAnchorDisplayText(anchor_1, displayText);
            }
            if (altText && anchor_1) {
                // Hack: Ideally this should be done by HyperLink plugin.
                // We make a hack here since we don't have an event to notify HyperLink plugin
                // before we apply the link.
                anchor_1.removeAttribute(TEMP_TITLE);
                anchor_1.title = altText;
            }
        });
        editor.triggerContentChangedEvent("CreateLink" /* CreateLink */, anchor_1);
    }
}
exports.default = createLink;
function getAnchorNodeAtCursor(editor) {
    return queryNodesWithSelection_1.default(editor, 'a[href]')[0];
}
function updateAnchorDisplayText(anchor, displayText) {
    if (displayText && anchor.textContent != displayText) {
        anchor.textContent = displayText;
    }
}


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queryNodesWithSelection_1 = __webpack_require__(3);
var roosterjs_editor_core_1 = __webpack_require__(2);
var EVENTDATACACHE_HEADER_LEVEL = 'HeaderLevel';
/**
 * Get the header level in current selection. The header level refers to the HTML <H1> to <H6> elements,
 * level 1 indicates <H1>, level 2 indicates <H2>, etc
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will query the node within selection
 * @returns The header level, 0 if there is no HTML heading elements
 */
function cacheGetHeaderLevel(editor, event) {
    return roosterjs_editor_core_1.cacheGetEventData(event, EVENTDATACACHE_HEADER_LEVEL, function () {
        for (var i = 1; i <= 6; i++) {
            if (queryNodesWithSelection_1.default(editor, 'H' + i).length > 0) {
                return i;
            }
        }
        return 0;
    });
}
exports.default = cacheGetHeaderLevel;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Insert an image to editor at current selection
 * @param editor The editor instance
 * @param imageFile The image file. There are at least 3 ways to obtain the file object:
 * From local file, from clipboard data, from drag-and-drop
 */
function insertImage(editor, imageFile) {
    editor.addUndoSnapshot();
    var reader = new FileReader();
    reader.onload = function (event) {
        if (!editor.isDisposed()) {
            var image = editor.getDocument().createElement('img');
            image.src = event.target.result;
            image.style.maxWidth = '100%';
            editor.insertNode(image);
            editor.addUndoSnapshot();
            editor.triggerContentChangedEvent("Format" /* Format */);
        }
    };
    reader.readAsDataURL(imageFile);
}
exports.default = insertImage;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var formatTable_1 = __webpack_require__(45);
/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns <= 4, width = 120px; if columns <= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 * @param format (Optional) The table format. If not passed, the default format will be applied:
 * background color: #FFF; border color: #ABABAB
 */
function insertTable(editor, columns, rows, format) {
    var document = editor.getDocument();
    var fragment = document.createDocumentFragment();
    var table = document.createElement('table');
    fragment.appendChild(table);
    table.cellSpacing = '0';
    table.cellPadding = '1';
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j = 0; j < columns; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);
            td.appendChild(document.createElement('br'));
            td.style.width = getTableCellWidth(columns);
        }
    }
    execFormatWithUndo_1.default(editor, function () {
        editor.runWithoutAddingUndoSnapshot(function () {
            editor.insertNode(fragment);
            formatTable_1.default(editor, format || {
                bgColorEven: '#FFF',
                bgColorOdd: '#FFF',
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
            }, table);
        });
    });
}
exports.default = insertTable;
function getTableCellWidth(columns) {
    if (columns <= 4) {
        return '120px';
    }
    else if (columns <= 6) {
        return '100px';
    }
    else {
        return '70px';
    }
}


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var getNodeAtCursor_1 = __webpack_require__(9);
var roosterjs_editor_dom_1 = __webpack_require__(0);
/**
 * Edit table with given operation. If there is no table at cursor then no op.
 * @param editor The editor instance
 * @param operation Table operation
 */
function editTable(editor, operation) {
    var td = getNodeAtCursor_1.default(editor, ['TD', 'TH']);
    if (td) {
        execFormatWithUndo_1.default(editor, function () {
            var vtable = new roosterjs_editor_dom_1.VTable(td);
            var currentRow = vtable.cells[vtable.row];
            var currentCell = currentRow[vtable.col];
            switch (operation) {
                case 0 /* InsertAbove */:
                case 1 /* InsertBelow */:
                    var newRow = vtable.row + (operation == 0 /* InsertAbove */ ? 0 : 1);
                    vtable.cells.splice(newRow, 0, currentRow.map(function (cell) { return roosterjs_editor_dom_1.VTable.cloneCell(cell); }));
                    break;
                case 2 /* InsertLeft */:
                case 3 /* InsertRight */:
                    var newCol_1 = vtable.col + (operation == 2 /* InsertLeft */ ? 0 : 1);
                    vtable.forEachCellOfCurrentColumn(function (cell, row) {
                        row.splice(newCol_1, 0, roosterjs_editor_dom_1.VTable.cloneCell(cell));
                    });
                    break;
                case 6 /* DeleteRow */:
                    vtable.forEachCellOfCurrentRow(function (cell, i) {
                        var nextCell = vtable.getCell(vtable.row + 1, i);
                        if (cell.td && cell.td.rowSpan > 1 && nextCell.spanAbove) {
                            nextCell.td = cell.td;
                        }
                    });
                    vtable.cells.splice(vtable.row, 1);
                    break;
                case 5 /* DeleteColumn */:
                    vtable.forEachCellOfCurrentColumn(function (cell, row, i) {
                        var nextCell = vtable.getCell(i, vtable.col + 1);
                        if (cell.td && cell.td.colSpan > 1 && nextCell.spanLeft) {
                            nextCell.td = cell.td;
                        }
                        row.splice(vtable.col, 1);
                    });
                    break;
                case 7 /* MergeAbove */:
                case 8 /* MergeBelow */:
                    var rowStep = operation == 7 /* MergeAbove */ ? -1 : 1;
                    for (var rowIndex = vtable.row + rowStep; rowIndex >= 0 && rowIndex < vtable.cells.length; rowIndex += rowStep) {
                        var cell = vtable.getCell(rowIndex, vtable.col);
                        if (cell.td && !cell.spanAbove) {
                            var aboveCell = rowIndex < vtable.row ? cell : currentCell;
                            var belowCell = rowIndex < vtable.row ? currentCell : cell;
                            if (aboveCell.td.colSpan == belowCell.td.colSpan) {
                                roosterjs_editor_dom_1.VTable.moveChildren(belowCell.td, aboveCell.td);
                                belowCell.td = null;
                                belowCell.spanAbove = true;
                            }
                            break;
                        }
                    }
                    break;
                case 9 /* MergeLeft */:
                case 10 /* MergeRight */:
                    var colStep = operation == 9 /* MergeLeft */ ? -1 : 1;
                    for (var colIndex = vtable.col + colStep; colIndex >= 0 && colIndex < vtable.cells[vtable.row].length; colIndex += colStep) {
                        var cell = vtable.getCell(vtable.row, colIndex);
                        if (cell.td && !cell.spanLeft) {
                            var leftCell = colIndex < vtable.col ? cell : currentCell;
                            var rightCell = colIndex < vtable.col ? currentCell : cell;
                            if (leftCell.td.rowSpan == rightCell.td.rowSpan) {
                                roosterjs_editor_dom_1.VTable.moveChildren(rightCell.td, leftCell.td);
                                rightCell.td = null;
                                rightCell.spanLeft = true;
                            }
                            break;
                        }
                    }
                    break;
                case 4 /* DeleteTable */:
                    vtable.cells = null;
                    break;
                case 12 /* SplitVertically */:
                    if (currentCell.td.rowSpan > 1) {
                        vtable.getCell(vtable.row + 1, vtable.col).td = roosterjs_editor_dom_1.VTable.cloneNode(currentCell.td);
                    }
                    else {
                        var splitRow = currentRow.map(function (cell) {
                            return {
                                td: cell == currentCell ? roosterjs_editor_dom_1.VTable.cloneNode(cell.td) : null,
                                spanAbove: cell != currentCell,
                                spanLeft: cell.spanLeft,
                            };
                        });
                        vtable.cells.splice(vtable.row + 1, 0, splitRow);
                    }
                    break;
                case 11 /* SplitHorizontally */:
                    if (currentCell.td.colSpan > 1) {
                        vtable.getCell(vtable.row, vtable.col + 1).td = roosterjs_editor_dom_1.VTable.cloneNode(currentCell.td);
                    }
                    else {
                        vtable.forEachCellOfCurrentColumn(function (cell, row) {
                            row.splice(vtable.col + 1, 0, {
                                td: row == currentRow ? roosterjs_editor_dom_1.VTable.cloneNode(cell.td) : null,
                                spanAbove: cell.spanAbove,
                                spanLeft: row != currentRow,
                            });
                        });
                    }
                    break;
            }
            vtable.writeBack();
            if (!editor.contains(td)) {
                td = vtable.getCurrentTd();
            }
        }, true /*preserveSelection*/);
        var range = editor.getSelectionRange();
        if (!roosterjs_editor_dom_1.contains(td, range.startContainer) && td != range.startContainer) {
            range.setStart(td, 0);
            editor.updateSelection(range);
            editor.focus();
        }
    }
}
exports.default = editTable;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var queryNodesWithSelection_1 = __webpack_require__(3);
var roosterjs_editor_dom_1 = __webpack_require__(0);
/**
 * Remove link at selection. If no links at selection, do nothing.
 * If selection contains multiple links, all of the link styles will be removed.
 * If only part of a link is selected, the whole link style will be removed.
 * @param editor The editor instance
 */
function removeLink(editor) {
    editor.focus();
    var nodes = queryNodesWithSelection_1.default(editor, 'a[href]');
    if (nodes.length) {
        execFormatWithUndo_1.default(editor, function () {
            var range = editor.getSelectionRange();
            var startPoint = range
                ? roosterjs_editor_dom_1.normalizeEditorPoint(range.startContainer, range.startOffset)
                : null;
            var endPoint = range ? roosterjs_editor_dom_1.normalizeEditorPoint(range.endContainer, range.endOffset) : null;
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                roosterjs_editor_dom_1.unwrap(node);
            }
            if (range &&
                editor.contains(startPoint.containerNode) &&
                editor.contains(endPoint.containerNode)) {
                var newRange = editor.getDocument().createRange();
                newRange.setStart(startPoint.containerNode, startPoint.offset);
                newRange.setEnd(endPoint.containerNode, endPoint.offset);
                editor.updateSelection(newRange);
            }
        });
    }
}
exports.default = removeLink;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
function setAlignment(editor, alignment) {
    editor.focus();
    var command = 'justifyLeft';
    if (alignment == 1 /* Center */) {
        command = 'justifyCenter';
    }
    else if (alignment == 2 /* Right */) {
        command = 'justifyRight';
    }
    execFormatWithUndo_1.default(editor, function () {
        editor.getDocument().execCommand(command, false, null);
    });
}
exports.default = setAlignment;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var roosterjs_editor_dom_1 = __webpack_require__(0);
/**
 * Change direction for the blocks/paragraph at selection
 * @param editor The editor instance
 * @param dir The direction option:
 * Direction.LeftToRight refers to 'ltr', Direction.RightToLeft refers to 'rtl'
 */
function setDirection(editor, dir) {
    editor.focus();
    var dirValue = dir == 0 /* LeftToRight */ ? 'ltr' : 'rtl';
    var styleValue = dir == 0 /* LeftToRight */ ? 'left' : 'right';
    // Loop through all blocks in the selection
    // For NodeBlockElement (which normally represents a P or DIV etc.), apply dir & text-align directly on the blocks
    // For StartEndBlockElement (which mostly represents text segment broken down through a <BR> in the middle), if start and end
    // are under same parent, add a DIV wrap and then apply dir and text-align.
    // Otherwise (i.e. <ced><div>abc<span>12<br>34</span><div></ced>, abc<span>12<br> is a block) do nothing since there isn't
    // really a way to change direction for such blocks (some HTML shuffling is needed)
    var blockElements = [];
    var contentTraverser = editor.getContentTraverser(1 /* Selection */);
    var startBlock = contentTraverser.currentBlockElement;
    while (startBlock) {
        blockElements.push(startBlock);
        startBlock = contentTraverser.getNextBlockElement();
    }
    if (blockElements.length > 0) {
        execFormatWithUndo_1.default(editor, function () {
            for (var _i = 0, blockElements_1 = blockElements; _i < blockElements_1.length; _i++) {
                var block = blockElements_1[_i];
                // Any DOM change in the loop might interfere with the traversing so we should try to
                // get the next block first before running any logic that may change DOM
                if (block instanceof roosterjs_editor_dom_1.NodeBlockElement) {
                    // Apply dir and text-align right on the block
                    var containerNode = block.getStartNode();
                    containerNode.setAttribute('dir', dirValue);
                    containerNode.style.textAlign = styleValue;
                }
                else if (block instanceof roosterjs_editor_dom_1.StartEndBlockElement &&
                    block.getStartNode().parentNode == block.getEndNode().parentNode) {
                    // TODO: do this only for balanced start-end block
                    // Add support for un-balanced start-end block later on
                    // example for un-balanced start-end: <div>abc<span>123<br>456</span></div>
                    // in this case, the first block abc<span>123<br> is not a balanced node where
                    // the start node "abc" is not in same level as the end node <br> (the <br> is in a span)
                    // Some html suffling is required to properly wrap the content before applying dir
                    var allNodes = block.getContentNodes();
                    roosterjs_editor_dom_1.wrapAll(allNodes, "<div dir='" + dirValue + "', style='text-align:" + styleValue + ";'></div>");
                }
            }
        });
    }
}
exports.default = setDirection;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var queryNodesWithSelection_1 = __webpack_require__(3);
/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * The alt attribute provides alternative information for an image if a user for some reason
 * cannot view it (because of slow connection, an error in the src attribute, or if the user
 * uses a screen reader). See https://www.w3schools.com/tags/att_img_alt.asp
 * @param editor The editor instance
 * @param altText The image alt text
 */
function setImageAltText(editor, altText) {
    editor.focus();
    var imageNodes = queryNodesWithSelection_1.default(editor, 'img');
    if (imageNodes.length > 0) {
        execFormatWithUndo_1.default(editor, function () {
            for (var _i = 0, imageNodes_1 = imageNodes; _i < imageNodes_1.length; _i++) {
                var node = imageNodes_1[_i];
                node.setAttribute('alt', altText);
            }
        });
    }
}
exports.default = setImageAltText;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var getFormatState_1 = __webpack_require__(44);
var queryNodesWithSelection_1 = __webpack_require__(3);
/**
 * Set indentation at selection
 * If selection contains bullet/numbering list, increase/decrease indentation will
 * increase/decrease the list level by one.
 * @param editor The editor instance
 * @param indentation The indentation option:
 * Indentation.Increase to increase indentation or Indentation.Decrease to decrease indentation
 */
function setIndentation(editor, indentation) {
    editor.focus();
    var command = indentation == 0 /* Increase */ ? 'indent' : 'outdent';
    execFormatWithUndo_1.default(editor, function () {
        var format = getFormatState_1.default(editor);
        editor.getDocument().execCommand(command, false, null);
        if (!format.isBullet && !format.isNumbering) {
            var nodes = queryNodesWithSelection_1.default(editor, 'blockquote');
            nodes.forEach(function (node) {
                node.style.marginTop = '0px';
                node.style.marginBottom = '0px';
            });
        }
    });
}
exports.default = setIndentation;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var isSelectionCollapsed_1 = __webpack_require__(5);
/**
 * Toggle bold at selection
 * If selection is collapsed, it will only affect the following input after caret
 * If selection contains only bold text, the bold style will be removed
 * If selection contains only normal text, bold style will be added to the whole selected text
 * If selection contains both bold and normal text, bold stle will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleBold(editor) {
    editor.focus();
    var formatter = function () { return editor.getDocument().execCommand('bold', false, null); };
    if (isSelectionCollapsed_1.default(editor)) {
        formatter();
    }
    else {
        execFormatWithUndo_1.default(editor, formatter);
    }
}
exports.default = toggleBold;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var isSelectionCollapsed_1 = __webpack_require__(5);
/**
 * Toggle italic at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only italic text, the italic style will be removed
 * If selection contains only normal text, italic style will be added to the whole selected text
 * If selection contains both italic and normal text, italic stlye will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleItalic(editor) {
    editor.focus();
    var formatter = function () { return editor.getDocument().execCommand('italic', false, null); };
    if (isSelectionCollapsed_1.default(editor)) {
        formatter();
    }
    else {
        execFormatWithUndo_1.default(editor, formatter);
    }
}
exports.default = toggleItalic;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggleBullet_1 = __webpack_require__(46);
/**
 * Toggle numbering at selection
 * If selection contains numbering in deep level, toggle numbering will decrease the numbering level by one
 * If selection contains bullet list, toggle numbering will convert the bullet list into number list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * realization of browser execCommand API
 * @param editor The editor instance
 */
function toggleNumbering(editor) {
    toggleBullet_1.toggleList(editor, true /*isNumbering*/);
}
exports.default = toggleNumbering;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var queryNodesWithSelection_1 = __webpack_require__(3);
var getNodeAtCursor_1 = __webpack_require__(9);
var roosterjs_editor_dom_1 = __webpack_require__(0);
var roosterjs_editor_core_1 = __webpack_require__(2);
var ZERO_WIDTH_SPACE = '&#8203;';
var defaultStyler = function (element) {
    element.style.borderLeft = '3px solid';
    element.style.borderColor = '#C8C8C8';
    element.style.paddingLeft = '10px';
    element.style.color = '#666666';
};
/**
 * Toggle blockquote at selection, if selection already contains any blockquoted elements,
 * the blockquoted elements will be unblockquoted and other elements will take no affect
 * @param editor The editor instance
 * @param styler (Optional) The custom styler for setting the style for the
 * blockquote element
 */
function toggleBlockQuote(editor, styler) {
    editor.focus();
    var blockquoteNodes = queryNodesWithSelection_1.default(editor, 'blockquote');
    execFormatWithUndo_1.default(editor, function (startPoint, endPoint) {
        if (blockquoteNodes.length) {
            // There are already blockquote nodes, unwrap them
            blockquoteNodes.forEach(function (node) { return roosterjs_editor_dom_1.unwrap(node); });
        }
        else {
            // Step 1: Find all block elements and their content nodes
            var nodes = getContentNodes(editor);
            // Step 2: Split existing list container if necessary
            nodes = getSplittedListNodes(nodes);
            // Step 3: Handle some special cases
            nodes = getNodesWithSpecialCaseHandled(editor, nodes, startPoint, endPoint);
            var quoteElement = roosterjs_editor_dom_1.wrapAll(nodes, '<blockquote></blockqupte>');
            (styler || defaultStyler)(quoteElement);
            return quoteElement;
        }
    }, true /*preserveSelection*/);
}
exports.default = toggleBlockQuote;
function getContentNodes(editor) {
    var result = [];
    var contentTraverser = editor.getContentTraverser(1 /* Selection */);
    var blockElement = contentTraverser ? contentTraverser.currentBlockElement : null;
    while (blockElement) {
        var nodes = blockElement.getContentNodes();
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var listElement = getNodeAtCursor_1.default(editor, 'LI', node);
            if (!listElement) {
                result.push(node);
            }
            else if (listElement != result[result.length - 1]) {
                result.push(listElement);
            }
        }
        blockElement = contentTraverser.getNextBlockElement();
    }
    return result;
}
function getSplittedListNodes(nodes) {
    for (var changed = true, currentListNode = null; changed;) {
        changed = false;
        for (var i = 0; i < nodes.length; i++) {
            // When we are in list, check if the whole list is in selection.
            // If so, use the list element instead of each item
            var node = nodes[i];
            if (isListElement(node)) {
                var parentNode = node.parentNode;
                var firstIndex = nodes.indexOf(parentNode.firstChild);
                var nodeCount = parentNode.childNodes.length;
                // If all children are in the list, remove these nodes and use parent node instead
                if (firstIndex >= 0 && nodes[firstIndex + nodeCount - 1] == parentNode.lastChild) {
                    nodes.splice(firstIndex, nodeCount, parentNode);
                    i = firstIndex - 1;
                }
            }
        }
        // Use "i <= nodes.length" to do one more round of loop to perform a fianl round of parent node splitting
        for (var i = 0; i <= nodes.length; i++) {
            var node = nodes[i];
            if (isListElement(node)) {
                if (!currentListNode || node.parentNode != currentListNode.parentNode) {
                    changed = !!roosterjs_editor_dom_1.splitParentNode(node, true /*splitBefore*/) || changed;
                }
                currentListNode = node;
            }
            else if (currentListNode) {
                changed = !!roosterjs_editor_dom_1.splitParentNode(currentListNode, false /*splitBefore*/) || changed;
                currentListNode = null;
            }
        }
    }
    return nodes;
}
function getNodesWithSpecialCaseHandled(editor, nodes, startPoint, endPoint) {
    if (nodes.length == 1 && nodes[0].nodeName == 'BR') {
        nodes[0] = roosterjs_editor_dom_1.wrap(nodes[0], '<div></div>');
    }
    else if (nodes.length == 0) {
        var document_1 = editor.getDocument();
        // Selection is collapsed and blockElment is null, we need to create an empty div.
        // In case of IE and Edge, we insert ZWS to put cursor in the div, otherwise insert BR node.
        var div = document_1.createElement('div');
        div.appendChild(roosterjs_editor_core_1.browserData.isEdge || roosterjs_editor_core_1.browserData.isIE
            ? document_1.createTextNode(ZERO_WIDTH_SPACE)
            : document_1.createElement('BR'));
        editor.insertNode(div);
        nodes.push(div);
        if (startPoint && endPoint) {
            startPoint.containerNode = endPoint.containerNode = div;
            startPoint.offset = endPoint.offset = 0 /* Begin */;
        }
    }
    return nodes;
}
function isListElement(node) {
    var parentTag = node ? roosterjs_editor_dom_1.getTagOfNode(node.parentNode) : '';
    return parentTag == 'OL' || parentTag == 'UL';
}


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var isSelectionCollapsed_1 = __webpack_require__(5);
/**
 * Toggle strikethrough at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only strikethrough text, the strikethrough style will be removed
 * If selection contains only normal text, strikethrough style will be added to the whole selected text
 * If selection contains both strikethrough and normal text, strikethrough stlye will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleStrikethrough(editor) {
    editor.focus();
    var formatter = function () { return editor.getDocument().execCommand('strikeThrough', false, null); };
    if (isSelectionCollapsed_1.default(editor)) {
        formatter();
    }
    else {
        execFormatWithUndo_1.default(editor, formatter);
    }
}
exports.default = toggleStrikethrough;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var isSelectionCollapsed_1 = __webpack_require__(5);
/**
 * Toggle subscript at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only subscript text, the subscript style will be removed
 * If selection contains only normal text, subscript style will be added to the whole selected text
 * If selection contains both subscript and normal text, the subscript style will be removed from whole selected text
 * If selection contains any superscript text, the behavior is determined by corresponding realization of browser
 * execCommand API
 * @param editor The editor instance
 */
function toggleSubscript(editor) {
    editor.focus();
    var formatter = function () { return editor.getDocument().execCommand('subscript', false, null); };
    if (isSelectionCollapsed_1.default(editor)) {
        formatter();
    }
    else {
        execFormatWithUndo_1.default(editor, formatter);
    }
}
exports.default = toggleSubscript;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var isSelectionCollapsed_1 = __webpack_require__(5);
/**
 * Toggle superscript at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only superscript text, the superscript style will be removed
 * If selection contains only normal text, superscript style will be added to the whole selected text
 * If selection contains both superscript and normal text, the superscript style will be removed from whole selected text
 * If selection contains any subscript text, the behavior is determined by corresponding realization of browser
 * execCommand API
 * @param editor The editor instance
 */
function toggleSuperscript(editor) {
    editor.focus();
    var formatter = function () { return editor.getDocument().execCommand('superscript', false, null); };
    if (isSelectionCollapsed_1.default(editor)) {
        formatter();
    }
    else {
        execFormatWithUndo_1.default(editor, formatter);
    }
}
exports.default = toggleSuperscript;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var isSelectionCollapsed_1 = __webpack_require__(5);
/**
 * Toggle underline at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only underlined text, the underline style will be removed
 * If selection contains only normal text, underline style will be added to the whole selected text
 * If selection contains both underlined and normal text, the underline style will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleUnderline(editor) {
    editor.focus();
    var formatter = function () { return editor.getDocument().execCommand('underline', false, null); };
    if (isSelectionCollapsed_1.default(editor)) {
        formatter();
    }
    else {
        execFormatWithUndo_1.default(editor, formatter);
    }
}
exports.default = toggleUnderline;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(1);
var queryNodesWithSelection_1 = __webpack_require__(3);
/**
 * Toggle header at selection
 * @param editor The editor instance
 * @param level The header level, can be a number from 0 to 6, in which 1 ~ 6 refers to
 * the HTML header element <H1> to <H6>, 0 means no header
 * if passed in param is outside the range, will be rounded to nearest number in the range
 */
function toggleHeader(editor, level) {
    level = Math.min(Math.max(Math.round(level), 0), 6);
    execFormatWithUndo_1.default(editor, function () {
        editor.focus();
        if (level > 0) {
            var traverser = editor.getContentTraverser(1 /* Selection */);
            var inlineElement = traverser ? traverser.currentInlineElement : null;
            while (inlineElement) {
                var node = inlineElement.getContainerNode();
                if (node.nodeType == 3 /* Text */) {
                    node = node.parentNode;
                }
                if (node.nodeType == 1 /* Element */) {
                    node.style.fontSize = '';
                }
                inlineElement = traverser.getNextInlineElement();
            }
            editor.getDocument().execCommand('formatBlock', false, "<H" + level + ">");
        }
        else {
            editor.getDocument().execCommand('formatBlock', false, '<DIV>');
            for (var i = 1; i <= 6; i++) {
                var headers = queryNodesWithSelection_1.default(editor, 'H' + i);
                headers.forEach(function (header) {
                    var div = editor.getDocument().createElement('div');
                    while (header.firstChild) {
                        div.appendChild(header.firstChild);
                    }
                    editor.replaceNode(header, div);
                });
            }
        }
    });
}
exports.default = toggleHeader;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(4);
var roosterjs_editor_core_1 = __webpack_require__(2);
// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
var TRAILING_PUNCTUATION_REGEX = /[.()+={}\[\]\s:;"',>]+$/i;
var TEMP_TITLE_REGEX = /<a\s+([^>]*\s+)?(title|istemptitle)="[^"]*"\s*([^>]*)\s+(title|istemptitle)="[^"]*"(\s+[^>]*)?>/gm;
var TEMP_TITLE = 'istemptitle';
var MINIMUM_LENGTH = 5;
var KEY_BACKSPACE = 8;
var KEY_SPACE = 32;
var KEY_ENTER = 13;
/**
 * An editor plugin that auto linkify text as users type and show a tooltip for existing link
 */
var HyperLink = /** @class */ (function () {
    /**
     * Create a new instance of HyperLink class
     * @param getTooltipCallback A callback function to get tooltip text for an existing hyperlink.
     * Default value is to return the href itself. If null, there will be no tooltip text.
     * @param target (Optional) Target window name for hyperlink. If null, will use "_blank"
     * @param linkMatchRules (Optional) Rules for matching hyperlink. If null, will use defaultLinkMatchRules
     */
    function HyperLink(getTooltipCallback, target) {
        if (getTooltipCallback === void 0) { getTooltipCallback = function (href) { return href; }; }
        var _this = this;
        this.getTooltipCallback = getTooltipCallback;
        this.target = target;
        this.onClickLink = function (keyboardEvent) {
            var href;
            if (!roosterjs_editor_core_1.browserData.isFirefox &&
                (href = _this.tryGetHref(keyboardEvent.srcElement)) &&
                (roosterjs_editor_core_1.browserData.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey)) {
                var target = _this.target || '_blank';
                _this.editor.getDocument().defaultView.window.open(href, target);
            }
        };
    }
    HyperLink.prototype.initialize = function (editor) {
        this.editor = editor;
        if (roosterjs_editor_core_1.browserData.isIE) {
            this.editor
                .getDocument()
                .execCommand('AutoUrlDetect', false /* shouldDisplayUserInterface */, false /* value */);
        }
    };
    HyperLink.prototype.dispose = function () {
        this.forEachHyperLink(this.resetAnchor.bind(this));
        this.editor = null;
    };
    // Handle the event
    HyperLink.prototype.onPluginEvent = function (event) {
        var keyboardEvent = event.rawEvent;
        if (this.backspaceToUndo &&
            (event.eventType == 0 /* KeyDown */ ||
                event.eventType == 4 /* MouseDown */ ||
                event.eventType == 6 /* ContentChanged */)) {
            this.backspaceToUndo = false;
            if (event.eventType == 0 /* KeyDown */ &&
                keyboardEvent.which == KEY_BACKSPACE) {
                keyboardEvent.preventDefault();
                this.editor.undo();
            }
        }
        switch (event.eventType) {
            case 0 /* KeyDown */:
                if (keyboardEvent.which == KEY_ENTER || keyboardEvent.which == KEY_SPACE) {
                    this.autoLink(event);
                }
                break;
            case 6 /* ContentChanged */:
                var contentChangedEvent = event;
                if (contentChangedEvent.source == "Paste" /* Paste */) {
                    this.autoLink(event);
                }
                else if (contentChangedEvent.source == "CreateLink" /* CreateLink */) {
                    this.resetAnchor(contentChangedEvent.data);
                }
                if (contentChangedEvent.source != "AutoLink" /* AutoLink */) {
                    this.forEachHyperLink(this.processLink.bind(this));
                }
                break;
            case 7 /* ExtractContent */:
                var extractContentEvent = event;
                extractContentEvent.content = this.removeTempTooltip(extractContentEvent.content);
                break;
        }
    };
    HyperLink.prototype.resetAnchor = function (a) {
        try {
            if (a.getAttribute(TEMP_TITLE)) {
                a.removeAttribute(TEMP_TITLE);
                a.removeAttribute('title');
            }
            a.removeEventListener('mouseup', this.onClickLink);
        }
        catch (e) { }
    };
    HyperLink.prototype.autoLink = function (event) {
        var _this = this;
        var cursorData = roosterjs_editor_api_1.cacheGetCursorEventData(event, this.editor);
        var wordBeforeCursor = cursorData ? cursorData.wordBeforeCursor : null;
        if (wordBeforeCursor && wordBeforeCursor.length > MINIMUM_LENGTH) {
            // Check for trailing punctuation
            var trailingPunctuations = wordBeforeCursor.match(TRAILING_PUNCTUATION_REGEX);
            var trailingPunctuation = trailingPunctuations && trailingPunctuations.length > 0
                ? trailingPunctuations[0]
                : null;
            // Compute the link candidate
            var linkCandidate = wordBeforeCursor.substring(0, trailingPunctuation
                ? wordBeforeCursor.length - trailingPunctuation.length
                : wordBeforeCursor.length);
            // Match and replace in editor
            var linkData_1 = roosterjs_editor_api_1.matchLink(linkCandidate);
            if (linkData_1) {
                var anchor_1 = this.editor.getDocument().createElement('A');
                anchor_1.textContent = linkData_1.originalUrl;
                anchor_1.href = linkData_1.normalizedUrl;
                this.editor.runAsync(function () {
                    _this.editor.addUndoSnapshot();
                    var replaced = roosterjs_editor_api_1.replaceTextBeforeCursorWithNode(_this.editor, linkData_1.originalUrl, anchor_1, false /* exactMatch */, cursorData);
                    if (replaced) {
                        // The content at cursor has changed. Should also clear the cursor data cache
                        roosterjs_editor_api_1.clearCursorEventDataCache(event);
                        _this.processLink(anchor_1);
                        _this.editor.addUndoSnapshot();
                        _this.editor.triggerContentChangedEvent("AutoLink" /* AutoLink */, anchor_1);
                        _this.backspaceToUndo = true;
                    }
                });
            }
        }
    };
    HyperLink.prototype.processLink = function (a) {
        if (!a.title && this.getTooltipCallback) {
            a.setAttribute(TEMP_TITLE, 'true');
            a.title = this.getTooltipCallback(this.tryGetHref(a));
        }
        a.addEventListener('mouseup', this.onClickLink);
    };
    HyperLink.prototype.removeTempTooltip = function (content) {
        return content.replace(TEMP_TITLE_REGEX, '<a $1$3$5>');
    };
    // Try get href from an anchor element
    // The reason this is put in a try-catch is that
    // it has been seen that accessing href may throw an exception, in particular on IE/Edge
    HyperLink.prototype.tryGetHref = function (element) {
        var href = null;
        try {
            do {
                if (element.tagName == 'A') {
                    href = element.href;
                    break;
                }
                element = element.parentElement;
            } while (this.editor.contains(element));
        }
        catch (error) {
            // Not do anything for the moment
        }
        return href;
    };
    HyperLink.prototype.forEachHyperLink = function (callback) {
        this.editor.queryElements('a[href]', callback);
    };
    return HyperLink;
}());
exports.default = HyperLink;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(4);
var roosterjs_editor_dom_1 = __webpack_require__(0);
var roosterjs_editor_core_1 = __webpack_require__(2);
var ContentEditFeatures_1 = __webpack_require__(47);
var KEY_TAB = 9;
var KEY_BACKSPACE = 8;
var KEY_ENTER = 13;
var KEY_SPACE = 32;
var BLOCKQUOTE_TAG_NAME = 'BLOCKQUOTE';
/**
 * An editor plugin to handle content edit event.
 * The following cases are included:
 * 1. Auto increase/decrease indentation on Tab, Shift+tab
 * 2. Enter, Backspace on empty list item
 * 3. Enter, Backspace on empty blockquote line
 */
var ContentEdit = /** @class */ (function () {
    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    function ContentEdit(features) {
        this.features = features;
        this.features = this.features || ContentEditFeatures_1.getDefaultContentEditFeatures();
    }
    ContentEdit.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    ContentEdit.prototype.dispose = function () {
        this.editor = null;
    };
    // Handle the event if it is a tab event, and cursor is at begin of a list
    ContentEdit.prototype.willHandleEventExclusively = function (event) {
        return this.isListEvent(event, [KEY_TAB]) || this.isTabInTable(event);
    };
    // Handle the event
    ContentEdit.prototype.onPluginEvent = function (event) {
        var _this = this;
        var keyboardEvent = event.rawEvent;
        var blockQuoteElement = null;
        if (this.backspaceToUndo &&
            (event.eventType == 0 /* KeyDown */ ||
                event.eventType == 4 /* MouseDown */ ||
                event.eventType == 6 /* ContentChanged */)) {
            this.backspaceToUndo = false;
            if (event.eventType == 0 /* KeyDown */ &&
                keyboardEvent.which == KEY_BACKSPACE) {
                keyboardEvent.preventDefault();
                this.editor.undo();
            }
        }
        if (this.isListEvent(event, [KEY_TAB, KEY_BACKSPACE, KEY_ENTER])) {
            // Tab: increase indent
            // Shift+ Tab: decrease indent
            if (keyboardEvent.which == KEY_TAB) {
                if (this.features.indentWhenTab && !keyboardEvent.shiftKey) {
                    roosterjs_editor_api_1.setIndentation(this.editor, 0 /* Increase */);
                    keyboardEvent.preventDefault();
                }
                else if (this.features.outdentWhenShiftTab && keyboardEvent.shiftKey) {
                    roosterjs_editor_api_1.setIndentation(this.editor, 1 /* Decrease */);
                    keyboardEvent.preventDefault();
                }
            }
            else {
                var listElement = roosterjs_editor_api_1.cacheGetNodeAtCursor(this.editor, event, 'LI');
                if (listElement && this.shouldToggleState(event, listElement)) {
                    this.toggleList(event);
                }
                else if (this.features.mergeInNewLineWhenBackspaceOnFirstChar &&
                    keyboardEvent.which == KEY_BACKSPACE &&
                    this.isCursorAtBeginningOf(listElement)) {
                    if (listElement == listElement.parentElement.firstChild) {
                        this.toggleList(event);
                    }
                    else {
                        var document_1 = this.editor.getDocument();
                        document_1.defaultView.requestAnimationFrame(function () {
                            if (_this.editor) {
                                var br = document_1.createElement('br');
                                _this.editor.insertNode(br);
                                var range = document_1.createRange();
                                range.setStartAfter(br);
                                _this.editor.updateSelection(range);
                            }
                        });
                    }
                }
            }
        }
        else if (this.isTabInTable(event)) {
            var range = this.editor.getDocument().createRange();
            for (var td = this.cacheGetTd(event), vtable = new roosterjs_editor_dom_1.VTable(td), step = keyboardEvent.shiftKey ? -1 : 1, row = vtable.row, col = vtable.col + step;; col += step) {
                if (col < 0 || col >= vtable.cells[row].length) {
                    row += step;
                    if (row < 0 || row >= vtable.cells.length) {
                        if (keyboardEvent.shiftKey) {
                            range.setStartBefore(vtable.table);
                        }
                        else {
                            range.setEndAfter(vtable.table);
                            range.collapse(false /*toStart*/);
                        }
                        this.editor.updateSelection(range);
                        break;
                    }
                    col = keyboardEvent.shiftKey ? vtable.cells[row].length - 1 : 0;
                }
                var cell = vtable.getCell(row, col);
                if (cell.td) {
                    range.setStart(cell.td, 0);
                    this.editor.updateSelection(range);
                    break;
                }
            }
            keyboardEvent.preventDefault();
        }
        else if ((blockQuoteElement = this.getBlockQuoteElementFromEvent(event, keyboardEvent))) {
            var node_1 = roosterjs_editor_api_1.getNodeAtCursor(this.editor);
            if (node_1 && node_1 != blockQuoteElement) {
                while (this.editor.contains(node_1) && node_1.parentNode != blockQuoteElement) {
                    node_1 = node_1.parentNode;
                }
                if (node_1.parentNode == blockQuoteElement && this.shouldToggleState(event, node_1)) {
                    keyboardEvent.preventDefault();
                    roosterjs_editor_api_1.execFormatWithUndo(this.editor, function () {
                        roosterjs_editor_dom_1.splitParentNode(node_1, false /*splitBefore*/);
                        blockQuoteElement.parentNode.insertBefore(node_1, blockQuoteElement.nextSibling);
                        if (!blockQuoteElement.firstChild) {
                            blockQuoteElement.parentNode.removeChild(blockQuoteElement);
                        }
                        var range = _this.editor.getSelectionRange();
                        range.selectNode(node_1);
                        range.collapse(true /*toStart*/);
                        _this.editor.updateSelection(range);
                    });
                }
            }
        }
        else if (this.features.autoBullet &&
            event.eventType == 0 /* KeyDown */ &&
            keyboardEvent.which == KEY_SPACE &&
            roosterjs_editor_api_1.cacheGetListState(this.editor, event) == 0 /* None */ &&
            !keyboardEvent.ctrlKey &&
            !keyboardEvent.altKey &&
            !keyboardEvent.metaKey) {
            this.handleAutoBullet(event);
        }
    };
    ContentEdit.prototype.handleAutoBullet = function (event) {
        var _this = this;
        var cursorData = roosterjs_editor_api_1.cacheGetCursorEventData(event, this.editor);
        // We pick 3 characters before cursor so that if any characters exist before "1." or "*",
        // we do not fire auto list.
        var textBeforeCursor = cursorData.getXCharsBeforeCursor(3);
        // Auto list is triggered if:
        // 1. Text before cursor exactly mathces '*', '-' or '1.'
        // 2. There's no non-text inline entities before cursor
        if (['*', '-', '1.'].indexOf(textBeforeCursor) >= 0 &&
            !cursorData.getFirstNonTextInlineBeforeCursor()) {
            this.editor.runAsync(function () {
                var listNode;
                // editor.insertContent(NBSP);
                _this.editor.addUndoSnapshot();
                _this.editor.runWithoutAddingUndoSnapshot(function () {
                    // Remove the user input '*', '-' or '1.'
                    var rangeToDelete = roosterjs_editor_api_1.validateAndGetRangeForTextBeforeCursor(_this.editor, textBeforeCursor + '\u00A0', // Add the &nbsp; we just inputted
                    true /*exactMatch*/, cursorData) ||
                        roosterjs_editor_api_1.validateAndGetRangeForTextBeforeCursor(_this.editor, textBeforeCursor + ' ', // Add the &nbsp; we just inputted
                        true /*exactMatch*/, cursorData);
                    if (rangeToDelete) {
                        rangeToDelete.deleteContents();
                    }
                    // If not explicitly insert br, Chrome will operate on the previous line
                    if (roosterjs_editor_core_1.browserData.isChrome || roosterjs_editor_core_1.browserData.isSafari) {
                        _this.editor.insertContent('<BR>');
                    }
                    if (textBeforeCursor == '1.') {
                        roosterjs_editor_api_1.toggleNumbering(_this.editor);
                        listNode = roosterjs_editor_api_1.getNodeAtCursor(_this.editor, 'OL');
                    }
                    else {
                        roosterjs_editor_api_1.toggleBullet(_this.editor);
                        listNode = roosterjs_editor_api_1.getNodeAtCursor(_this.editor, 'UL');
                    }
                });
                _this.editor.addUndoSnapshot();
                if (listNode) {
                    _this.editor.triggerContentChangedEvent("AutoBullet" /* AutoBullet */, listNode);
                    _this.backspaceToUndo = true;
                }
            });
        }
    };
    // Check if it is a tab or shift+tab / Enter / Backspace event
    // This tests following:
    // 1) is keydown
    // 2) is Tab / Enter / Backspace
    // 3) any of ctrl/meta/alt is not pressed
    ContentEdit.prototype.isListEvent = function (event, interestedKeyCodes) {
        if (event.eventType == 0 /* KeyDown */) {
            var keyboardEvent = event.rawEvent;
            if (interestedKeyCodes.indexOf(keyboardEvent.which) >= 0 &&
                !keyboardEvent.ctrlKey &&
                !keyboardEvent.altKey &&
                !keyboardEvent.metaKey) {
                // Checks if cursor on a list
                var listState = roosterjs_editor_api_1.cacheGetListState(this.editor, event);
                if (listState &&
                    (listState == 1 /* Bullets */ || listState == 2 /* Numbering */)) {
                    return true;
                }
            }
        }
        return false;
    };
    ContentEdit.prototype.isTabInTable = function (event) {
        var keyboardEvent = event.rawEvent;
        return (this.features.tabInTable &&
            event.eventType == 0 /* KeyDown */ &&
            keyboardEvent.which == KEY_TAB &&
            !!this.cacheGetTd(event));
    };
    ContentEdit.prototype.cacheGetTd = function (event) {
        return roosterjs_editor_api_1.cacheGetNodeAtCursor(this.editor, event, ['TD', 'TH']);
    };
    // Check if it is a blockquote event, if it is true, return the blockquote element where the cursor resides
    // To qualify a blockquote event:
    // 1. Cursor is in blockquote element
    // 2. Current block has no content
    // 3. is keyDown
    // 4. is Enter or Backspace
    // 5. Any of ctrl/meta/alt is not pressed
    ContentEdit.prototype.getBlockQuoteElementFromEvent = function (event, keyboardEvent) {
        if (event.eventType == 0 /* KeyDown */) {
            if ((keyboardEvent.which == KEY_BACKSPACE || keyboardEvent.which == KEY_ENTER) &&
                !keyboardEvent.ctrlKey &&
                !keyboardEvent.altKey &&
                !keyboardEvent.metaKey) {
                return roosterjs_editor_api_1.queryNodesWithSelection(this.editor, BLOCKQUOTE_TAG_NAME)[0];
            }
        }
        return null;
    };
    ContentEdit.prototype.shouldToggleState = function (event, node) {
        var isEmpty = roosterjs_editor_dom_1.isNodeEmpty(node);
        var keyboardEvent = event.rawEvent;
        var isList = roosterjs_editor_dom_1.getTagOfNode(node) == 'LI';
        if (((isList && this.features.outdentWhenBackspaceOnEmptyFirstLine) ||
            (!isList && this.features.unquoteWhenBackspaceOnEmptyFirstLine)) &&
            isEmpty &&
            keyboardEvent.which == KEY_BACKSPACE &&
            node == node.parentNode.firstChild) {
            return true;
        }
        if (((isList && this.features.outdentWhenEnterOnEmptyLine) ||
            (!isList && this.features.unquoteWhenEnterOnEmptyLine)) &&
            isEmpty &&
            keyboardEvent.which == KEY_ENTER) {
            return true;
        }
        return false;
    };
    ContentEdit.prototype.toggleList = function (event) {
        var keyboardEvent = event.rawEvent;
        var listState = roosterjs_editor_api_1.cacheGetListState(this.editor, event);
        keyboardEvent.preventDefault();
        if (listState == 1 /* Bullets */) {
            roosterjs_editor_api_1.toggleBullet(this.editor);
        }
        else if (listState == 2 /* Numbering */) {
            roosterjs_editor_api_1.toggleNumbering(this.editor);
        }
    };
    ContentEdit.prototype.isCursorAtBeginningOf = function (node) {
        var range = this.editor.getSelectionRange();
        if (range && range.startOffset == 0 /* Begin */) {
            var container = range.startContainer;
            while (container != node && roosterjs_editor_dom_1.contains(node, container) && !container.previousSibling) {
                container = container.parentNode;
            }
            return container == node;
        }
        return false;
    };
    return ContentEdit;
}());
exports.default = ContentEdit;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_api_1 = __webpack_require__(4);
var buildClipboardData_1 = __webpack_require__(108);
var convertPastedContentFromWord_1 = __webpack_require__(109);
var textToHtml_1 = __webpack_require__(113);
var getInheritableStyles_1 = __webpack_require__(114);
/**
 * Paste plugin, handles onPaste event and paste content into editor
 */
var Paste = /** @class */ (function () {
    /**
     * Create an instance of Paste
     * @param deprecated Deprecated parameter only used for compatibility with old code
     * @param htmlPropertyCallbacks A callback to help handle html sanitization
     */
    function Paste(deprecated, htmlPropertyCallbacks) {
        var _this = this;
        this.htmlPropertyCallbacks = htmlPropertyCallbacks;
        this.onPaste = function (event) {
            _this.editor.addUndoSnapshot();
            buildClipboardData_1.default(event, _this.editor, function (clipboardData) {
                if (!clipboardData.html && clipboardData.text) {
                    clipboardData.html = textToHtml_1.default(clipboardData.text);
                }
                var currentStyles = getInheritableStyles_1.default(_this.editor);
                if (!clipboardData.isHtmlFromTempDiv) {
                    clipboardData.html = roosterjs_editor_dom_1.sanitizeHtml(clipboardData.html, null /*additionalStyleNodes*/, false /*convertInlineCssOnly*/, _this.htmlPropertyCallbacks, true /*preserveFragmentOnly*/, currentStyles);
                }
                _this.pasteOriginal(clipboardData);
            });
        };
    }
    Paste.prototype.initialize = function (editor) {
        this.editor = editor;
        this.pasteDisposer = editor.addDomEventHandler('paste', this.onPaste);
    };
    Paste.prototype.dispose = function () {
        this.pasteDisposer();
        this.pasteDisposer = null;
        this.editor = null;
    };
    Paste.prototype.onPluginEvent = function (event) {
        if (event.eventType == 8 /* BeforePaste */) {
            var beforePasteEvent = event;
            if (beforePasteEvent.pasteOption == 0 /* PasteHtml */) {
                convertPastedContentFromWord_1.default(beforePasteEvent.fragment);
            }
        }
    };
    /**
     * Paste into editor using passed in clipboardData with original format
     * @param clipboardData The clipboardData to paste
     */
    Paste.prototype.pasteOriginal = function (clipboardData) {
        this.paste(clipboardData, this.detectPasteOption(clipboardData));
    };
    /**
     * Paste plain text into editor using passed in clipboardData
     * @param clipboardData The clipboardData to paste
     */
    Paste.prototype.pasteText = function (clipboardData) {
        this.paste(clipboardData, 1 /* PasteText */);
    };
    /**
     * Paste into editor using passed in clipboardData with curent format
     * @param clipboardData The clipboardData to paste
     */
    Paste.prototype.pasteAndMergeFormat = function (clipboardData) {
        this.paste(clipboardData, this.detectPasteOption(clipboardData), true /*mergeFormat*/);
    };
    Paste.prototype.detectPasteOption = function (clipboardData) {
        return clipboardData.text || !clipboardData.image
            ? 0 /* PasteHtml */
            : 2 /* PasteImage */;
    };
    Paste.prototype.paste = function (clipboardData, pasteOption, mergeCurrentFormat) {
        var document = this.editor.getDocument();
        var fragment = document.createDocumentFragment();
        if (pasteOption == 0 /* PasteHtml */) {
            var html = clipboardData.html;
            var nodes = roosterjs_editor_dom_1.fromHtml(html, document);
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                if (mergeCurrentFormat) {
                    this.applyTextFormat(node, clipboardData.originalFormat);
                }
                fragment.appendChild(node);
            }
        }
        var event = {
            eventType: 8 /* BeforePaste */,
            clipboardData: clipboardData,
            fragment: fragment,
            pasteOption: pasteOption,
        };
        this.editor.triggerEvent(event, true /*broadcast*/);
        this.internalPaste(event);
    };
    Paste.prototype.internalPaste = function (event) {
        var clipboardData = event.clipboardData, fragment = event.fragment, pasteOption = event.pasteOption;
        this.editor.focus();
        if (clipboardData.snapshotBeforePaste == null) {
            clipboardData.snapshotBeforePaste = roosterjs_editor_core_1.buildSnapshot(this.editor);
        }
        else {
            roosterjs_editor_core_1.restoreSnapshot(this.editor, clipboardData.snapshotBeforePaste);
        }
        switch (pasteOption) {
            case 0 /* PasteHtml */:
                this.editor.insertNode(fragment);
                break;
            case 1 /* PasteText */:
                var html = textToHtml_1.default(clipboardData.text);
                this.editor.insertContent(html);
                break;
            case 2 /* PasteImage */:
                roosterjs_editor_api_1.insertImage(this.editor, clipboardData.image);
                break;
        }
        this.editor.addUndoSnapshot();
        this.editor.triggerContentChangedEvent("Paste" /* Paste */, clipboardData);
    };
    Paste.prototype.applyTextFormat = function (node, format) {
        var leaf = roosterjs_editor_dom_1.getFirstLeafNode(node);
        var parents = [];
        while (leaf) {
            if (leaf.nodeType == 3 /* Text */ &&
                leaf.parentNode &&
                parents.indexOf(leaf.parentNode) < 0) {
                parents.push(leaf.parentNode);
            }
            leaf = roosterjs_editor_dom_1.getNextLeafSibling(node, leaf);
        }
        for (var _i = 0, parents_1 = parents; _i < parents_1.length; _i++) {
            var parent_1 = parents_1[_i];
            roosterjs_editor_dom_1.applyFormat(parent_1, format);
        }
    };
    return Paste;
}());
exports.default = Paste;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var roosterjs_editor_api_1 = __webpack_require__(4);
var CONTAINER_HTML = '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';
/**
 * Build ClipboardData from a paste event
 * @param event The paste event
 * @param editor The editor
 * @param callback Callback function when data is ready
 */
function buildClipboardData(event, editor, callback) {
    var dataTransfer = event.clipboardData || editor.getDocument().defaultView.clipboardData;
    var types = dataTransfer.types ? [].slice.call(dataTransfer.types) : [];
    var clipboardData = {
        snapshotBeforePaste: null,
        originalFormat: getCurrentFormat(editor),
        types: types,
        image: getImage(dataTransfer),
        text: dataTransfer.getData('text'),
        html: null,
    };
    if (event.clipboardData && event.clipboardData.items) {
        directRetrieveHtml(event, function (html) {
            clipboardData.html = html;
            callback(clipboardData);
        });
    }
    else {
        retrieveHtmlViaTempDiv(editor, function (html) {
            clipboardData.html = html;
            clipboardData.isHtmlFromTempDiv = true;
            callback(clipboardData);
        });
    }
}
exports.default = buildClipboardData;
function getCurrentFormat(editor) {
    var format = roosterjs_editor_api_1.getFormatState(editor);
    return format
        ? {
            fontFamily: format.fontName,
            fontSize: format.fontSize,
            textColor: format.textColor,
            backgroundColor: format.backgroundColor,
            bold: format.isBold,
            italic: format.isItalic,
            underline: format.isUnderline,
        }
        : {};
}
function getImage(dataTransfer) {
    // Chrome, Firefox, Edge support dataTransfer.items
    var fileCount = dataTransfer.items ? dataTransfer.items.length : 0;
    for (var i = 0; i < fileCount; i++) {
        var item = dataTransfer.items[i];
        if (item.type && item.type.indexOf('image/') == 0) {
            return item.getAsFile();
        }
    }
    // IE, Safari support dataTransfer.files
    fileCount = dataTransfer.files ? dataTransfer.files.length : 0;
    for (var i = 0; i < fileCount; i++) {
        var file = dataTransfer.files.item(i);
        if (file.type && file.type.indexOf('image/') == 0) {
            return file;
        }
    }
    return null;
}
function directRetrieveHtml(event, callback) {
    event.preventDefault();
    var items = event.clipboardData.items;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.type && item.type.indexOf('text/html') == 0) {
            item.getAsString(callback);
            return;
        }
    }
    callback(null);
}
function retrieveHtmlViaTempDiv(editor, callback) {
    // cache original selection range in editor
    var originalSelectionRange = editor.getSelectionRange();
    var tempDiv = getTempDivForPaste(editor);
    tempDiv.focus();
    window.requestAnimationFrame(function () {
        if (editor) {
            // restore original selection range in editor
            editor.updateSelection(originalSelectionRange);
            callback(tempDiv.innerHTML);
            tempDiv.style.display = 'none';
            tempDiv.innerHTML = '';
        }
    });
}
function getTempDivForPaste(editor) {
    var tempDiv = editor.getCustomData('PasteDiv', function () {
        var pasteDiv = roosterjs_editor_dom_1.fromHtml(CONTAINER_HTML, editor.getDocument())[0];
        editor.insertNode(pasteDiv, {
            position: 3 /* Outside */,
            updateCursor: false,
            replaceSelection: false,
            insertOnNewLine: false,
        });
        return pasteDiv;
    }, function (pasteDiv) {
        pasteDiv.parentNode.removeChild(pasteDiv);
    });
    tempDiv.style.display = '';
    return tempDiv;
}


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wordConverter_1 = __webpack_require__(110);
var WordConverterArguments_1 = __webpack_require__(111);
var converterUtils_1 = __webpack_require__(112);
/** Converts all the Word generated list items in the specified node into standard HTML UL and OL tags */
function convertPastedContentFromWord(root) {
    var wordConverter = wordConverter_1.createWordConverter();
    // First find all the nodes that we need to check for list item information
    // This call will return all the p and header elements under the root node.. These are the elements that
    // Word uses a list items, so we'll only process them and avoid walking the whole tree.
    var elements = root.querySelectorAll('p');
    if (elements.length > 0) {
        wordConverter.wordConverterArgs = WordConverterArguments_1.createWordConverterArguments(elements);
        if (converterUtils_1.processNodesDiscovery(wordConverter)) {
            converterUtils_1.processNodeConvert(wordConverter);
        }
    }
}
exports.default = convertPastedContentFromWord;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CustomData_1 = __webpack_require__(48);
;
/** create an empty WordConverter */
function createWordConverter() {
    return {
        nextUniqueId: 1,
        numBulletsConverted: 0,
        numNumberedConverted: 0,
        wordConverterArgs: null,
        customData: CustomData_1.createCustomData(),
    };
}
exports.createWordConverter = createWordConverter;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LevelLists_1 = __webpack_require__(49);
;
/** create an empty WordConverterArguments */
function createWordConverterArguments(nodes) {
    return {
        nodes: nodes,
        currentIndex: 0,
        lists: {},
        listItems: [],
        currentListIdsByLevels: [LevelLists_1.createLevelLists()],
        lastProcessedItem: null,
    };
}
exports.createWordConverterArguments = createWordConverterArguments;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LevelLists_1 = __webpack_require__(49);
var CustomData_1 = __webpack_require__(48);
var roosterjs_editor_dom_1 = __webpack_require__(0);
/** Word list metadata style name */
var LOOKUP_DEPTH = 5;
/** Name for the word list id property in the custom data */
var UNIQUE_LIST_ID_CUSTOM_DATA = 'UniqueListId';
/** Word list metadata style name */
var MSO_LIST_STYLE_NAME = 'mso-list';
/** Regular expression to match line breaks */
var LINE_BREAKS = /[\n|\r]/gi;
/**
 * Handles the pass 1: Discovery
 * During discovery, we'll parse the metadata out of the elements and store it in the list items dictionary.
 * We'll detect cases where the list items for a particular ordered list are not next to each other. Word does these
 * for numbered headers, and we don't want to convert those, because the numbering would be completely wrong.
 */
function processNodesDiscovery(wordConverter) {
    var args = wordConverter.wordConverterArgs;
    while (args.currentIndex < args.nodes.length) {
        var node = args.nodes.item(args.currentIndex);
        // Try to get the list metadata for the specified node
        var itemMetadata = getListItemMetadata(node);
        if (itemMetadata) {
            var levelInfo = args.currentListIdsByLevels[itemMetadata.level - 1] || LevelLists_1.createLevelLists();
            args.currentListIdsByLevels[itemMetadata.level - 1] = levelInfo;
            // We need to drop some list information if this is not an item next to another
            if (args.lastProcessedItem && getRealPreviousSibling(node) != args.lastProcessedItem) {
                // This list item is not next to the previous one. This means that there is some content in between them
                // so we need to reset our list of list ids per level
                resetCurrentLists(args);
            }
            // Get the list metadata for the list that will hold this item
            var listMetadata = levelInfo.listsMetadata[itemMetadata.wordListId];
            if (!listMetadata) {
                // Get the first item fake bullet.. This will be used later to check what is the right type of list
                var firstFakeBullet = getFakeBulletText(node, LOOKUP_DEPTH);
                // This is a the first item of a list.. We'll create the list metadata using the information
                // we already have from this first item
                listMetadata = {
                    numberOfItems: 0,
                    uniqueListId: wordConverter.nextUniqueId++,
                    firstFakeBullet: firstFakeBullet,
                    // If the bullet we got is emtpy or not found, we ignore the list out.. this means
                    // that this is not an item we need to convert of that the format doesn't match what
                    // we are expecting
                    ignore: !firstFakeBullet || firstFakeBullet.length == 0,
                    // We'll use the first fake bullet to try to figure out which type of list we create. If this list has a second
                    // item, we'll perform a better comparasion, but for one item lists, this will be check that will determine the list type
                    tagName: getFakeBulletTagName(firstFakeBullet),
                };
                levelInfo.listsMetadata[itemMetadata.wordListId] = listMetadata;
                args.lists[listMetadata.uniqueListId.toString()] = listMetadata;
            }
            else if (!listMetadata.ignore && listMetadata.numberOfItems == 1) {
                // This is the second item we've seen for this list.. we'll compare the 2 fake bullet
                // items we have an decide if we create ordered or unordered lists based on this.
                // This is the best way we can do this since we cannot read the metadata that Word
                // puts in the head of the HTML...
                var secondFakeBullet = getFakeBulletText(node, LOOKUP_DEPTH);
                listMetadata.tagName =
                    listMetadata.firstFakeBullet == secondFakeBullet ? 'UL' : 'OL';
            }
            // Set the unique id to the list
            itemMetadata.uniqueListId = listMetadata.uniqueListId;
            // Check if we need to ignore this list... we'll either know already that we need to ignore
            // it, or we'll know it because the previous list items are not next to this one
            if (listMetadata.ignore ||
                (listMetadata.tagName == 'OL' &&
                    listMetadata.numberOfItems > 0 &&
                    levelInfo.currentUniqueListId != itemMetadata.uniqueListId)) {
                // We need to ignore this item... and we also need to forget about the lists that
                // are not at the root level
                listMetadata.ignore = true;
                args.currentListIdsByLevels[0].currentUniqueListId = -1;
                args.currentListIdsByLevels = args.currentListIdsByLevels.slice(0, 1);
            }
            else {
                // This is an item we don't need to ignore... If added lists deep under this one before
                // we'll drop their ids from the list of ids per level.. this is because this list item
                // breaks the deeper lists.
                if (args.currentListIdsByLevels.length > itemMetadata.level) {
                    args.currentListIdsByLevels = args.currentListIdsByLevels.slice(0, itemMetadata.level);
                }
                levelInfo.currentUniqueListId = itemMetadata.uniqueListId;
                // Add the list item into the list of items to be processed
                args.listItems.push(itemMetadata);
                listMetadata.numberOfItems++;
            }
            args.lastProcessedItem = node;
        }
        else {
            // Here, we know that this is not a list item, but we'll want to check if it is one "no bullet" list items...
            // these can be created by creating a bullet and hitting delete on it it... The content will continue to be indented, but there will
            // be no bullet and the list will continue correctly after that. Visually, it looks like the previous item has multiple lines, but
            // the HTML generated has multiple paragraphs with the same class. We'll merge these when we find them, so the logic doesn't skips
            // the list conversion thinking that the list items are not together...
            var last = args.lastProcessedItem;
            if (last &&
                getRealPreviousSibling(node) == last &&
                node.tagName == last.tagName &&
                node.className == last.className) {
                // Add 2 line breaks and move all the nodes to the last item
                last.appendChild(last.ownerDocument.createElement('br'));
                last.appendChild(last.ownerDocument.createElement('br'));
                while (node.firstChild != null) {
                    last.appendChild(node.firstChild);
                }
                // Remove the item that we don't need anymore
                node.parentNode.removeChild(node);
            }
        }
        // Move to the next element are return true if more elements need to be processed
        args.currentIndex++;
    }
    return args.listItems.length > 0;
}
exports.processNodesDiscovery = processNodesDiscovery;
/**
 * Handles the pass 2: Conversion
 * During conversion, we'll go over the elements that belong to a list that we've marked as a list to convert, and we'll perform the
 * conversion needed
 */
function processNodeConvert(wordConverter) {
    var args = wordConverter.wordConverterArgs;
    args.currentIndex = 0;
    while (args.currentIndex < args.listItems.length) {
        var metadata = args.listItems[args.currentIndex];
        var node = metadata.originalNode;
        var listMetadata = args.lists[metadata.uniqueListId.toString()];
        if (!listMetadata.ignore) {
            // We have a list item that we need to convert, get or create the list
            // that hold this item out
            var list = getOrCreateListForNode(wordConverter, node, metadata, listMetadata);
            if (list) {
                // Clean the element out.. this call gets rid of the fake bullet and unneeded nodes
                cleanupListIgnore(node, LOOKUP_DEPTH);
                // Create a new list item and transfer the children
                var li = node.ownerDocument.createElement('LI');
                while (node.firstChild) {
                    li.appendChild(node.firstChild);
                }
                // Append the list item into the list
                list.appendChild(li);
                // Remove the node we just converted
                node.parentNode.removeChild(node);
                if (listMetadata.tagName == 'UL') {
                    wordConverter.numBulletsConverted++;
                }
                else {
                    wordConverter.numNumberedConverted++;
                }
            }
        }
        args.currentIndex++;
    }
    return wordConverter.numBulletsConverted > 0 || wordConverter.numNumberedConverted > 0;
}
exports.processNodeConvert = processNodeConvert;
/**
 * Gets or creates the list (UL or OL) that holds this item out based on the
 * items content and the specified metadata
 */
function getOrCreateListForNode(wordConverter, node, metadata, listMetadata) {
    // First get the last list next to this node under the specified level. This code
    // path will return the list or will create lists if needed
    var list = recurringGetOrCreateListAtNode(node, metadata.level, listMetadata);
    // Here use the unique list ID to detect if we have the right list...
    // it is possible to have 2 different lists next to each other with different formats, so
    // we want to detect this an create separate lists for those cases
    var listId = CustomData_1.getObject(wordConverter.customData, list, UNIQUE_LIST_ID_CUSTOM_DATA);
    // If we have a list with and ID, but the ID is different than the ID for this list item, this
    // is a completely new list, so we'll append a new list for that
    if ((listId && listId != metadata.uniqueListId) || (!listId && list.firstChild)) {
        var newList = node.ownerDocument.createElement(listMetadata.tagName);
        list.parentNode.insertBefore(newList, list.nextSibling);
        list = newList;
    }
    // Set the list id into the custom data
    CustomData_1.setObject(wordConverter.customData, list, UNIQUE_LIST_ID_CUSTOM_DATA, metadata.uniqueListId);
    // This call will convert the list if needed to the right type of list required. This can happen
    // on the cases where the first list item for this list is located after a deeper list. for that
    // case, we will have created a UL for it, and we may need to convert it
    return convertListIfNeeded(wordConverter, list, listMetadata);
}
/**
 * Converts the list between UL and OL if needed, by using the fake bullet and
 * information already stored in the list itself
 */
function convertListIfNeeded(wordConverter, list, listMetadata) {
    // Check if we need to convert the list out
    if (listMetadata.tagName != roosterjs_editor_dom_1.getTagOfNode(list)) {
        // We have the wrong list type.. convert it, set the id again and tranfer all the childs
        var newList = list.ownerDocument.createElement(listMetadata.tagName);
        CustomData_1.setObject(wordConverter.customData, newList, UNIQUE_LIST_ID_CUSTOM_DATA, CustomData_1.getObject(wordConverter.customData, list, UNIQUE_LIST_ID_CUSTOM_DATA));
        while (list.firstChild) {
            newList.appendChild(list.firstChild);
        }
        list.parentNode.insertBefore(newList, list);
        list.parentNode.removeChild(list);
        list = newList;
    }
    return list;
}
/**
 * Gets or creates the specified list
 */
function recurringGetOrCreateListAtNode(node, level, listMetadata) {
    var parent = null;
    var possibleList;
    if (level == 1) {
        // Root case, we'll check if the list is the previous sibling of the node
        possibleList = getRealPreviousSibling(node);
    }
    else {
        // If we get here, we are looking for level 2 or deeper... get the upper list
        // and check if the last element is a list
        parent = recurringGetOrCreateListAtNode(node, level - 1, null);
        possibleList = parent.lastChild;
    }
    // Check the element that we got and verify that it is a list
    if (possibleList && possibleList.nodeType == 1 /* Element */) {
        var tag = roosterjs_editor_dom_1.getTagOfNode(possibleList);
        if (tag == 'UL' || tag == 'OL') {
            // We have a list.. use it
            return possibleList;
        }
    }
    // If we get here, it means we don't have a list and we need to create one
    // this code path will always create new lists as UL lists
    var newList = node.ownerDocument.createElement(listMetadata ? listMetadata.tagName : 'UL');
    if (level == 1) {
        // For level 1, we'll insert the list beofre the node
        node.parentNode.insertBefore(newList, node);
    }
    else {
        // Any level 2 or above, we insert the list as the last
        // child of the upper level list
        parent.appendChild(newList);
    }
    return newList;
}
/**
 * Cleans up the node children by removing the childs marked as mso-list: Ignore.
 * This nodes hold the fake bullet information that Word puts in and when
 * conversion is happening, we want to get rid of these elements
 */
function cleanupListIgnore(node, levels) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        // Clean up the item internally first if we need to based on the number of levels
        if (child.nodeType == 1 /* Element */ && levels > 1) {
            cleanupListIgnore(child, levels - 1);
        }
        // Try to convert word comments into ignore elements if we haven't done so for this element
        child = fixWordListComments(child, true /*removeComments*/);
        // Check if we can remove this item out
        if (isEmptySpan(child) || isIgnoreNode(child)) {
            node.removeChild(child);
            i--;
        }
    }
}
/**
 * Reads the word list metadada out of the specified node. If the node
 * is not a Word list item, it returns null.
 */
function getListItemMetadata(node) {
    if (node.nodeType == 1 /* Element */) {
        var listatt = getStyleValue(node, MSO_LIST_STYLE_NAME);
        if (listatt && listatt.length > 0) {
            try {
                // Word mso-list property holds 3 space separated values in the following format: lst1 level1 lfo0
                // Where:
                // (0) List identified for the metadata in the <head> of the document. We cannot read the <head> metada
                // (1) Level of the list. This also maps to the <head> metadata that we cannot read, but
                // for almost all cases, it maps to the list identation (or level). We'll use it as the
                // list indentation value
                // (2) Contains a specific list identifier.
                // Example value: "l0 level1 lfo1"
                var listprops = listatt.split(' ');
                if (listprops.length == 3) {
                    return {
                        level: parseInt(listprops[1].substr('level'.length)),
                        wordListId: listatt,
                        originalNode: node,
                        uniqueListId: 0,
                    };
                }
            }
            catch (e) { }
        }
    }
    return null;
}
function isFakeBullet(fakeBullet) {
    return ['o', '·', '§', '-'].indexOf(fakeBullet) >= 0;
}
/** Given a fake bullet text, returns the type of list that should be used for it */
function getFakeBulletTagName(fakeBullet) {
    return isFakeBullet(fakeBullet) ? 'UL' : 'OL';
}
/**
 * Finds the fake bullet text out of the specified node and returns it. For images, it will return
 * a bullet string. If not found, it returns null...
 */
function getFakeBulletText(node, levels) {
    // Word uses the following format for their bullets:
    // <p style="mso-list:l1 level1 lfo2">
    // <span style="...">
    // <span style="mso-list:Ignore">1.<span style="...">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    // </span>
    // Content here...
    // </p>
    //
    // Basically, we need to locate the mso-list:Ignore SPAN, which holds either one text or image node. That
    // text or image node will be the fake bullet we are looking for
    var result = null;
    var child = node.firstChild;
    while (!result && child) {
        // First, check if we need to convert the Word list comments into real elements
        child = fixWordListComments(child, true /*removeComments*/);
        // Check if this is the node that holds the fake bullets (mso-list: Ignore)
        if (isIgnoreNode(child)) {
            // Yes... this is the node that holds either the text or image data
            result = child.textContent.trim();
            // This is the case for image case
            if (result.length == 0) {
                result = 'o';
            }
        }
        else if (child.nodeType == 1 /* Element */ && levels > 1) {
            // If this is an element and we are not in the last level, try to get the fake bullet
            // out of the child
            result = getFakeBulletText(child, levels - 1);
        }
        child = child.nextSibling;
    }
    return result;
}
/**
 * If the specified element is a Word List comments, this code verifies and fixes
 * the markup when needed to ensure that Chrome bullet conversions work as expected
 * -----
 * We'll convert <!--[if !supportLists]--> and <!--[endif]--> comments into
 * <span style="mso-list:Ignore"></span>... Chrome has a bug where it drops the
 * styles of the span, but we'll use these comments to recreate them out
 */
function fixWordListComments(child, removeComments) {
    if (child.nodeType == 8 /* Comment */) {
        var value = child.data;
        if (value && value.trim().toLowerCase() == '[if !supportlists]') {
            // We have a list ignore start, find the end.. We know is not more than
            // 3 nodes away, so we'll optimize our checks
            var nextElement = child;
            var endComment = null;
            for (var j = 0; j < 4; j++) {
                nextElement = getRealNextSibling(nextElement);
                if (!nextElement) {
                    break;
                }
                if (nextElement.nodeType == 8 /* Comment */) {
                    value = nextElement.data;
                    if (value && value.trim().toLowerCase() == '[endif]') {
                        endComment = nextElement;
                        break;
                    }
                }
            }
            // if we found the end node, wrap everything out
            if (endComment) {
                var newSpan = child.ownerDocument.createElement('span');
                newSpan.setAttribute('style', 'mso-list: ignore');
                nextElement = getRealNextSibling(child);
                while (nextElement != endComment) {
                    nextElement = nextElement.nextSibling;
                    newSpan.appendChild(nextElement.previousSibling);
                }
                // Insert the element out and use that one as the current child
                endComment.parentNode.insertBefore(newSpan, endComment);
                // Remove the comments out if the call specified it out
                if (removeComments) {
                    child.parentNode.removeChild(child);
                    endComment.parentNode.removeChild(endComment);
                }
                // Last, make sure we return the new element out instead of the comment
                child = newSpan;
            }
        }
    }
    return child;
}
/** Finds the real previous sibling, ignoring emtpy text nodes */
function getRealPreviousSibling(node) {
    var prevSibling = node;
    do {
        prevSibling = prevSibling.previousSibling;
    } while (prevSibling && isEmptyTextNode(prevSibling));
    return prevSibling;
}
/** Finds the real next sibling, ignoring empty text nodes */
function getRealNextSibling(node) {
    var nextSibling = node;
    do {
        nextSibling = nextSibling.nextSibling;
    } while (nextSibling && isEmptyTextNode(nextSibling));
    return nextSibling;
}
/**
 * Checks if the specified node is marked as a mso-list: Ignore. These
 * nodes need to be ignored when a list item is converted into standard
 * HTML lists
 */
function isIgnoreNode(node) {
    if (node.nodeType == 1 /* Element */) {
        var listatt = getStyleValue(node, MSO_LIST_STYLE_NAME);
        if (listatt && listatt.length > 0 && listatt.trim().toLowerCase() == 'ignore') {
            return true;
        }
    }
    return false;
}
/** Checks if the specified node is an empty span. */
function isEmptySpan(node) {
    return roosterjs_editor_dom_1.getTagOfNode(node) == 'SPAN' && !node.firstChild;
}
/** Reads the specified style value from the node */
function getStyleValue(node, styleName) {
    // Word uses non-standard names for the metadata that puts in the style of the element...
    // Most browsers will not provide the information for those unstandard values throug the node.style
    // property, so the only reliable way to read them is to get the attribute directly and do
    // the required parsing..
    var textStyle = node.getAttribute('style');
    if (textStyle && textStyle.length > 0 && textStyle.indexOf(styleName) >= 0) {
        // Split all the CSS name: value pairs
        var inStyles = textStyle.split(';');
        for (var i = 0; i < inStyles.length; i++) {
            // Split the name and value
            var nvpair = inStyles[i].split(':');
            if (nvpair.length == 2 && nvpair[0].trim() == styleName) {
                return nvpair[1].trim();
            }
        }
    }
    // As a backup mechanism, we'll still try to get the value from the style object
    // Dictionary styles = (Dictionary)(object)node.Style;
    // return (string)styles[styleName];
    return null;
}
/** Checks if the node is an empty text node that can be ignored */
function isEmptyTextNode(node) {
    // No node is empty
    if (!node) {
        return true;
    }
    // Empty text node is empty
    if (node.nodeType == 3 /* Text */) {
        var value = node.nodeValue;
        value = value.replace(LINE_BREAKS, '');
        return value.trim().length == 0;
    }
    // Span or Font with an empty child node is empty
    var tagName = roosterjs_editor_dom_1.getTagOfNode(node);
    if (node.firstChild == node.lastChild && (tagName == 'SPAN' || tagName == 'FONT')) {
        return isEmptyTextNode(node.firstChild);
    }
    // If not found, then this is not empty
    return false;
}
/** Resets the list */
function resetCurrentLists(args) {
    for (var i = 0; i < args.currentListIdsByLevels.length; i++) {
        var ll = args.currentListIdsByLevels[i];
        if (ll) {
            ll.currentUniqueListId = -1;
        }
    }
}


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_core_1 = __webpack_require__(2);
var ZERO_WIDTH_SPACE = '&#8203;';
/**
 * Convert plain to HTML
 * @param text The plain text to convert
 * @returns HTML string to present the input text
 */
function textToHtml(text) {
    text = (text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/^ /gm, '&nbsp;')
        .replace(/\r/g, '');
    var lines = text.split('\n');
    if (lines.length == 2) {
        text = "<span>" + lines[0] + "<br></span><span>" + lines[1] + "</span>";
    }
    else if (lines.length > 2) {
        text = '';
        var lineEnd_1 = roosterjs_editor_core_1.browserData.isEdge || roosterjs_editor_core_1.browserData.isIE ? ZERO_WIDTH_SPACE : '<br>';
        lines.forEach(function (line, i) {
            if (i == 0) {
                text += "<span>" + line + "<br></span>";
            }
            else if (i == lines.length - 1) {
                text += "<span>" + line + "</span>";
            }
            else {
                text += "<div>" + line + lineEnd_1 + "</div>";
            }
        });
    }
    text = text.replace(/\s\s/g, ' &nbsp;');
    return text;
}
exports.default = textToHtml;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(4);
var roosterjs_editor_dom_1 = __webpack_require__(0);
// Inheritable CSS properties
// Ref: https://www.w3.org/TR/CSS21/propidx.html
var INHERITABLE_PROPERTIES = 'border-collapse,border-spacing,caption-side,color,cursor,direction,empty-cells,font-family,font-size,font-style,font-variant,font-weight,font,letter-spacing,line-height,list-style-image,list-style-position,list-style-type,list-style,orphans,quotes,text-align,text-indent,text-transform,visibility,white-space,widows,word-spacing'.split(',');
function getInheritableStyles(editor) {
    var node = roosterjs_editor_api_1.getNodeAtCursor(editor);
    var styles = node ? roosterjs_editor_dom_1.getComputedStyles(node, INHERITABLE_PROPERTIES) : [];
    var result = {};
    for (var i = 0; i < INHERITABLE_PROPERTIES.length; i++) {
        result[INHERITABLE_PROPERTIES[i]] = styles[i] || '';
    }
    return result;
}
exports.default = getInheritableStyles;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var WATERMARK_SPAN_ID = '_rooster_watermarkSpan';
var WATERMARK_REGEX = new RegExp("<span[^>]*id=['\"]?" + WATERMARK_SPAN_ID + "['\"]?[^>]*>[^<]*</span>", 'ig');
/**
 * A watermark plugin to manage watermark string for roosterjs
 */
var Watermark = /** @class */ (function () {
    /**
     * Create an instance of Watermark plugin
     * @param watermark The watermark string
     */
    function Watermark(watermark, format) {
        var _this = this;
        this.watermark = watermark;
        this.format = format;
        this.handleWatermark = function () {
            _this.showHideWatermark(false /*ignoreCachedState*/);
        };
        this.format = this.format || {
            fontSize: '14px',
            textColor: '#aaa',
        };
    }
    Watermark.prototype.initialize = function (editor) {
        this.editor = editor;
        this.showHideWatermark(false /*ignoreCachedState*/);
        this.focusDisposer = this.editor.addDomEventHandler('focus', this.handleWatermark);
        this.blurDisposer = this.editor.addDomEventHandler('blur', this.handleWatermark);
    };
    Watermark.prototype.dispose = function () {
        this.focusDisposer();
        this.blurDisposer();
        this.focusDisposer = null;
        this.blurDisposer = null;
        this.hideWatermark();
        this.editor = null;
    };
    Watermark.prototype.onPluginEvent = function (event) {
        if (event.eventType == 6 /* ContentChanged */) {
            // When content is changed from setContent() API, current cached state
            // may not be accurate, so we ignore it
            this.showHideWatermark(event.source == "SetContent" /* SetContent */);
        }
        else if (event.eventType == 7 /* ExtractContent */ && this.isWatermarkShowing) {
            this.removeWartermarkFromHtml(event);
        }
    };
    Watermark.prototype.showHideWatermark = function (ignoreCachedState) {
        if (this.editor.hasFocus() && (ignoreCachedState || this.isWatermarkShowing)) {
            this.hideWatermark();
        }
        else if (!this.editor.hasFocus() &&
            (ignoreCachedState || !this.isWatermarkShowing) &&
            this.editor.isEmpty(true /*trim*/)) {
            this.showWatermark();
        }
    };
    Watermark.prototype.showWatermark = function () {
        var document = this.editor.getDocument();
        var watermarkNode = roosterjs_editor_dom_1.wrap(document.createTextNode(this.watermark), "<span id=\"" + WATERMARK_SPAN_ID + "\"></span>");
        roosterjs_editor_dom_1.applyFormat(watermarkNode, this.format);
        this.editor.insertNode(watermarkNode, {
            position: 0 /* Begin */,
            updateCursor: false,
            replaceSelection: false,
            insertOnNewLine: false,
        });
        this.isWatermarkShowing = true;
    };
    Watermark.prototype.hideWatermark = function () {
        var _this = this;
        this.editor.queryElements("span[id=\"" + WATERMARK_SPAN_ID + "\"]", function (span) {
            return _this.editor.deleteNode(span);
        });
        this.isWatermarkShowing = false;
    };
    Watermark.prototype.removeWartermarkFromHtml = function (event) {
        var content = event.content;
        content = content.replace(WATERMARK_REGEX, '');
        event.content = content;
    };
    return Watermark;
}());
exports.default = Watermark;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var roosterjs_editor_api_1 = __webpack_require__(4);
var TABLE_RESIZE_HANDLE_KEY = 'TABLE_RESIZE_HANDLE';
var HANDLE_WIDTH = 6;
var CONTAINER_HTML = "<div style=\"position: absolute; cursor: col-resize; width: " + HANDLE_WIDTH + "px; border: solid 0 #C6C6C6;\"></div>";
var TableResize = /** @class */ (function () {
    function TableResize(isRtl) {
        var _this = this;
        this.pageX = -1;
        this.onMouseOver = function (e) {
            var node = (e.srcElement || e.target);
            if (_this.pageX < 0 &&
                node &&
                (node.tagName == 'TD' || node.tagName == 'TH') &&
                node != _this.td) {
                _this.td = node;
                _this.calcAndShowHandle();
            }
        };
        this.onMouseDown = function (e) {
            _this.pageX = e.pageX;
            _this.initialPageX = e.pageX;
            var document = _this.editor.getDocument();
            document.addEventListener('mousemove', _this.onMouseMove, true);
            document.addEventListener('mouseup', _this.onMouseUp, true);
            var handle = _this.getResizeHandle();
            handle.style.borderWidth = '0 1px';
            _this.cancelEvent(e);
        };
        this.onMouseMove = function (e) {
            _this.adjustHandle(e.pageX);
            _this.cancelEvent(e);
        };
        this.onMouseUp = function (e) {
            var document = _this.editor.getDocument();
            document.removeEventListener('mousemove', _this.onMouseMove, true);
            document.removeEventListener('mouseup', _this.onMouseUp, true);
            var handle = _this.getResizeHandle();
            handle.style.borderWidth = '0';
            var table = roosterjs_editor_api_1.getNodeAtCursor(_this.editor, 'TABLE', _this.td);
            var cellPadding = parseInt(table.cellPadding);
            cellPadding = isNaN(cellPadding) ? 0 : cellPadding;
            if (e.pageX != _this.initialPageX) {
                var newWidth_1 = _this.td.clientWidth -
                    cellPadding * 2 +
                    (e.pageX - _this.initialPageX) * (_this.isRtl(table) ? -1 : 1);
                roosterjs_editor_api_1.execFormatWithUndo(_this.editor, function () { return _this.setTableColumnWidth(newWidth_1 + 'px'); }, true /*preserveSelection*/);
            }
            _this.pageX = -1;
            _this.calcAndShowHandle();
            _this.editor.focus();
            _this.cancelEvent(e);
        };
    }
    TableResize.prototype.initialize = function (editor) {
        this.editor = editor;
        this.onMouseOverDisposer = this.editor.addDomEventHandler('mouseover', this.onMouseOver);
    };
    TableResize.prototype.dispose = function () {
        this.editor = null;
        this.onMouseOverDisposer();
    };
    TableResize.prototype.onPluginEvent = function (event) {
        if (this.td &&
            (event.eventType == 0 /* KeyDown */ ||
                event.eventType == 6 /* ContentChanged */ ||
                (event.eventType == 4 /* MouseDown */ &&
                    !this.clickIntoCurrentTd(event)))) {
            this.td = null;
            this.calcAndShowHandle();
        }
    };
    TableResize.prototype.clickIntoCurrentTd = function (event) {
        var mouseEvent = event.rawEvent;
        var target = mouseEvent.target;
        return target instanceof Node && (this.td == target || roosterjs_editor_dom_1.contains(this.td, target));
    };
    TableResize.prototype.calcAndShowHandle = function () {
        if (this.td) {
            var tr = roosterjs_editor_api_1.getNodeAtCursor(this.editor, 'TR', this.td);
            var table = roosterjs_editor_api_1.getNodeAtCursor(this.editor, 'TABLE', tr);
            if (tr && table) {
                var _a = this.getPosition(table), left = _a[0], top_1 = _a[1];
                var handle = this.getResizeHandle();
                left +=
                    this.td.offsetLeft +
                        (this.isRtl(table) ? 0 : this.td.offsetWidth - HANDLE_WIDTH);
                handle.style.display = '';
                handle.style.top = top_1 + 'px';
                handle.style.height = table.offsetHeight + 'px';
                handle.style.left = left + 'px';
            }
        }
        else {
            this.getResizeHandle().style.display = 'none';
        }
    };
    TableResize.prototype.adjustHandle = function (pageX) {
        var handle = this.getResizeHandle();
        handle.style.left = handle.offsetLeft + pageX - this.pageX + 'px';
        this.pageX = pageX;
    };
    TableResize.prototype.getPosition = function (e) {
        var parent = e.offsetParent;
        var _a = parent ? this.getPosition(parent) : [0, 0], left = _a[0], top = _a[1];
        return [left + e.offsetLeft - e.scrollLeft, top + e.offsetTop - e.scrollTop];
    };
    TableResize.prototype.getResizeHandle = function () {
        var _this = this;
        return this.editor.getCustomData(TABLE_RESIZE_HANDLE_KEY, function () {
            var document = _this.editor.getDocument();
            var handle = roosterjs_editor_dom_1.fromHtml(CONTAINER_HTML, document)[0];
            document.body.appendChild(handle);
            handle.addEventListener('mousedown', _this.onMouseDown);
            return handle;
        }, function (handle) {
            handle.removeEventListener('mousedown', _this.onMouseDown);
            handle.parentNode.removeChild(handle);
        });
    };
    TableResize.prototype.cancelEvent = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    TableResize.prototype.setTableColumnWidth = function (width) {
        var _this = this;
        var vtable = new roosterjs_editor_dom_1.VTable(this.td);
        vtable.table.style.width = '';
        vtable.forEachCellOfCurrentColumn(function (cell) {
            if (cell.td) {
                cell.td.style.width = cell.td == _this.td ? width : '';
            }
        });
        vtable.writeBack();
        return this.editor.contains(this.td) ? this.td : vtable.getCurrentTd();
    };
    TableResize.prototype.isRtl = function (element) {
        return roosterjs_editor_dom_1.getComputedStyle(element, 'direction') == 'rtl';
    };
    return TableResize;
}());
exports.default = TableResize;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageResize_1 = __webpack_require__(119);
exports.ImageResize = ImageResize_1.default;
exports.ImageResizePlugin = ImageResize_1.ImageResizePlugin;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(0);
var roosterjs_editor_api_1 = __webpack_require__(4);
var BEGIN_TAG = 'RoosterJsImageResizingBegin';
var END_TAG = 'RoosterJsImageResizingEnd';
var EXTRACT_HTML_REGEX = new RegExp("<!--" + BEGIN_TAG + "-->[\\s\\S]*(<img\\s[^>]+>)[\\s\\S]*<!--" + END_TAG + "-->", 'gim');
var DELETE_KEYCODE = 46;
var BACKSPACE_KEYCODE = 8;
var SHIFT_KEYCODE = 16;
var CTRL_KEYCODE = 17;
var ALT_KEYCODE = 18;
var ImageResize = /** @class */ (function () {
    /**
     * Create a new instance of ImageResize
     * @param minWidth Minimum width of image when resize in pixel, default value is 10
     * @param minHeight Minimum height of image when resize in pixel, default value is 10
     * @param selectionBorderColor Color of resize border and handles, default value is #DB626C
     * @param forcePreserveRatio Whether always preserve width/height ratio when resize, default value is false
     */
    function ImageResize(minWidth, minHeight, selectionBorderColor, forcePreserveRatio) {
        if (minWidth === void 0) { minWidth = 10; }
        if (minHeight === void 0) { minHeight = 10; }
        if (selectionBorderColor === void 0) { selectionBorderColor = '#DB626C'; }
        if (forcePreserveRatio === void 0) { forcePreserveRatio = false; }
        var _this = this;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.selectionBorderColor = selectionBorderColor;
        this.forcePreserveRatio = forcePreserveRatio;
        this.startResize = function (e) {
            var img = _this.getSelectedImage();
            if (_this.editor && img) {
                _this.startPageX = e.pageX;
                _this.startPageY = e.pageY;
                _this.startWidth = img.clientWidth;
                _this.startHeight = img.clientHeight;
                _this.editor.addUndoSnapshot();
                var document_1 = _this.editor.getDocument();
                document_1.addEventListener('mousemove', _this.doResize, true /*useCapture*/);
                document_1.addEventListener('mouseup', _this.finishResize, true /*useCapture*/);
                _this.direction = (e.srcElement || e.target).style.cursor;
            }
            e.preventDefault();
        };
        this.doResize = function (e) {
            var img = _this.getSelectedImage();
            if (_this.editor && img) {
                var widthChange = e.pageX - _this.startPageX;
                var heightChange = e.pageY - _this.startPageY;
                var newWidth = Math.max(_this.startWidth + (_this.isWest(_this.direction) ? -widthChange : widthChange), _this.minWidth);
                var newHeight = Math.max(_this.startHeight + (_this.isNorth(_this.direction) ? -heightChange : heightChange), _this.minHeight);
                if (_this.forcePreserveRatio || e.shiftKey) {
                    var ratio = _this.startWidth > 0 && _this.startHeight > 0
                        ? _this.startWidth * 1.0 / _this.startHeight
                        : 0;
                    if (ratio > 0) {
                        if (newWidth < newHeight * ratio) {
                            newWidth = newHeight * ratio;
                        }
                        else {
                            newHeight = newWidth / ratio;
                        }
                    }
                }
                img.style.width = newWidth + 'px';
                img.style.height = newHeight + 'px';
            }
            e.preventDefault();
        };
        this.finishResize = function (e) {
            var img = _this.getSelectedImage();
            if (_this.editor && img) {
                var document_2 = _this.editor.getDocument();
                document_2.removeEventListener('mousemove', _this.doResize, true /*useCapture*/);
                document_2.removeEventListener('mouseup', _this.finishResize, true /*useCapture*/);
                var width = img.clientWidth;
                var height = img.clientHeight;
                img.style.width = width + 'px';
                img.style.height = height + 'px';
                img.width = width;
                img.height = height;
                _this.resizeDiv.style.width = '';
                _this.resizeDiv.style.height = '';
            }
            _this.direction = null;
            _this.editor.addUndoSnapshot();
            _this.editor.triggerContentChangedEvent("ImageResize" /* ImageResize */);
            e.preventDefault();
        };
        this.removeResizeDivIfAny = function (img) {
            var div = img && img.parentNode;
            var previous = div && div.previousSibling;
            var next = div && div.nextSibling;
            if (previous &&
                previous.nodeType == 8 /* Comment */ &&
                previous.nodeValue == BEGIN_TAG &&
                next &&
                next.nodeType == 8 /* Comment */ &&
                next.nodeValue == END_TAG) {
                div.parentNode.insertBefore(img, div);
                _this.removeResizeDiv(div);
            }
        };
    }
    ImageResize.prototype.initialize = function (editor) {
        this.editor = editor;
        this.editor.getDocument().execCommand('enableObjectResizing', false, false);
    };
    ImageResize.prototype.dispose = function () {
        if (this.resizeDiv) {
            this.unselect(false /*selectImageAfterUnSelect*/);
        }
        this.editor = null;
    };
    ImageResize.prototype.onPluginEvent = function (e) {
        var _this = this;
        if (e.eventType == 4 /* MouseDown */) {
            var event_1 = e.rawEvent;
            var target = (event_1.srcElement || event_1.target);
            if (roosterjs_editor_dom_1.getTagOfNode(target) == 'IMG') {
                target.contentEditable = 'false';
                var currentImg = this.getSelectedImage();
                if (currentImg && currentImg != target) {
                    this.unselect(false /*selectImageAfterUnSelect*/);
                }
                if (!this.resizeDiv) {
                    this.select(target);
                }
            }
            else if (this.resizeDiv && !roosterjs_editor_dom_1.contains(this.resizeDiv, target)) {
                this.unselect(false /*selectImageAfterUnSelect*/);
            }
        }
        else if (e.eventType == 0 /* KeyDown */ && this.resizeDiv) {
            var event_2 = e.rawEvent;
            if (event_2.which == DELETE_KEYCODE || event_2.which == BACKSPACE_KEYCODE) {
                roosterjs_editor_api_1.execFormatWithUndo(this.editor, function () {
                    _this.removeResizeDiv(_this.resizeDiv);
                    _this.resizeDiv = null;
                });
                event_2.preventDefault();
            }
            else if (event_2.which != SHIFT_KEYCODE &&
                event_2.which != CTRL_KEYCODE &&
                event_2.which != ALT_KEYCODE) {
                this.unselect(true /*selectImageAfterUnSelect*/);
            }
        }
        else if (e.eventType == 6 /* ContentChanged */ &&
            e.source != "ImageResize" /* ImageResize */) {
            this.editor.queryElements('img', this.removeResizeDivIfAny);
            this.resizeDiv = null;
        }
        else if (e.eventType == 7 /* ExtractContent */) {
            var event_3 = e;
            event_3.content = this.extractHtml(event_3.content);
        }
    };
    ImageResize.prototype.select = function (target) {
        this.resizeDiv = this.createResizeDiv(target);
        target.contentEditable = 'false';
        var range = document.createRange();
        range.setEndAfter(this.resizeDiv);
        range.collapse(false /*toStart*/);
        this.editor.updateSelection(range);
    };
    ImageResize.prototype.unselect = function (selectImageAfterUnSelect) {
        var img = this.getSelectedImage();
        var parent = this.resizeDiv.parentNode;
        if (parent) {
            if (img) {
                img.removeAttribute('contentEditable');
                var referenceNode = this.resizeDiv.previousSibling &&
                    this.resizeDiv.previousSibling.nodeType == 8 /* Comment */
                    ? this.resizeDiv.previousSibling
                    : this.resizeDiv;
                parent.insertBefore(img, referenceNode);
                if (selectImageAfterUnSelect) {
                    var range = this.editor.getDocument().createRange();
                    range.selectNode(img);
                    this.editor.updateSelection(range);
                }
            }
            this.removeResizeDiv(this.resizeDiv);
            this.resizeDiv = null;
        }
    };
    ImageResize.prototype.createResizeDiv = function (target) {
        var _this = this;
        var document = this.editor.getDocument();
        var resizeDiv = document.createElement('DIV');
        var parent = target.parentNode;
        parent.insertBefore(resizeDiv, target);
        parent.insertBefore(document.createComment(BEGIN_TAG), resizeDiv);
        parent.insertBefore(document.createComment(END_TAG), resizeDiv.nextSibling);
        resizeDiv.style.position = 'relative';
        resizeDiv.style.display = 'inline-table';
        resizeDiv.contentEditable = 'false';
        resizeDiv.appendChild(target);
        ['nw', 'ne', 'sw', 'se'].forEach(function (pos) {
            var div = document.createElement('DIV');
            resizeDiv.appendChild(div);
            div.style.position = 'absolute';
            div.style.width = '7px';
            div.style.height = '7px';
            div.style.backgroundColor = _this.selectionBorderColor;
            div.style.cursor = pos + '-resize';
            if (_this.isNorth(pos)) {
                div.style.top = '-3px';
            }
            else {
                div.style.bottom = '-3px';
            }
            if (_this.isWest(pos)) {
                div.style.left = '-3px';
            }
            else {
                div.style.right = '-3px';
            }
            div.addEventListener('mousedown', _this.startResize);
        });
        var div = document.createElement('DIV');
        resizeDiv.appendChild(div);
        div.style.position = 'absolute';
        div.style.top = '0';
        div.style.left = '0';
        div.style.right = '0';
        div.style.bottom = '0';
        div.style.border = 'solid 1px ' + this.selectionBorderColor;
        return resizeDiv;
    };
    ImageResize.prototype.removeResizeDiv = function (resizeDiv) {
        var _this = this;
        if (this.editor && this.editor.contains(resizeDiv)) {
            [resizeDiv.previousSibling, resizeDiv.nextSibling].forEach(function (comment) {
                if (comment && comment.nodeType == 8 /* Comment */) {
                    _this.editor.deleteNode(comment);
                }
            });
            this.editor.deleteNode(resizeDiv);
        }
    };
    ImageResize.prototype.extractHtml = function (html) {
        return html.replace(EXTRACT_HTML_REGEX, '$1');
    };
    ImageResize.prototype.getSelectedImage = function () {
        return this.resizeDiv ? this.resizeDiv.getElementsByTagName('IMG')[0] : null;
    };
    ImageResize.prototype.isNorth = function (direction) {
        return direction && direction.substr(0, 1) == 'n';
    };
    ImageResize.prototype.isWest = function (direction) {
        return direction && direction.substr(1, 1) == 'w';
    };
    return ImageResize;
}());
exports.default = ImageResize;
/**
 * @deprecated Use ImageResize instead
 */
var ImageResizePlugin = /** @class */ (function (_super) {
    __extends(ImageResizePlugin, _super);
    /**
     * @deprecated Use ImageResize instead
     */
    function ImageResizePlugin(minWidth, minHeight, selectionBorderColor, forcePreserveRatio) {
        if (minWidth === void 0) { minWidth = 10; }
        if (minHeight === void 0) { minHeight = 10; }
        if (selectionBorderColor === void 0) { selectionBorderColor = '#DB626C'; }
        if (forcePreserveRatio === void 0) { forcePreserveRatio = false; }
        var _this = _super.call(this, minWidth, minHeight, selectionBorderColor, forcePreserveRatio) || this;
        console.warn('ImageResizePlugin class is deprecated. Use ImageResize class instead');
        return _this;
    }
    return ImageResizePlugin;
}(ImageResize));
exports.ImageResizePlugin = ImageResizePlugin;


/***/ })
/******/ ])});;
//# sourceMappingURL=rooster-amd.js.map