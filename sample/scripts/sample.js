/******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "/sample/scripts/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 49);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Exec format with undo
function execFormatWithUndo(editor, formatter) {
    editor.addUndoSnapshot();
    formatter();
    editor.triggerEvent({
        eventType: 5 /* ContentChanged */,
        source: 'Format',
    });
    editor.addUndoSnapshot();
}
exports.default = execFormatWithUndo;
//# sourceMappingURL=execFormatWithUndo.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NodeBlockElement_1 = __webpack_require__(30);
exports.NodeBlockElement = NodeBlockElement_1.default;
var StartEndBlockElement_1 = __webpack_require__(32);
exports.StartEndBlockElement = StartEndBlockElement_1.default;
var ContentTraverser_1 = __webpack_require__(52);
exports.ContentTraverser = ContentTraverser_1.default;
var getBlockElement_1 = __webpack_require__(7);
exports.getBlockElementAtNode = getBlockElement_1.getBlockElementAtNode;
exports.getFirstBlockElement = getBlockElement_1.getFirstBlockElement;
exports.getLastBlockElement = getBlockElement_1.getLastBlockElement;
exports.getNextBlockElement = getBlockElement_1.getNextBlockElement;
exports.getPreviousBlockElement = getBlockElement_1.getPreviousBlockElement;
var getLeafSibling_1 = __webpack_require__(8);
exports.getNextLeafSibling = getLeafSibling_1.getNextLeafSibling;
exports.getPreviousLeafSibling = getLeafSibling_1.getPreviousLeafSibling;
var getLeafNode_1 = __webpack_require__(34);
exports.getFirstLeafNode = getLeafNode_1.getFirstLeafNode;
exports.getLastLeafNode = getLeafNode_1.getLastLeafNode;
var getInlineElement_1 = __webpack_require__(6);
exports.getFirstInlineElement = getInlineElement_1.getFirstInlineElement;
exports.getLastInlineElement = getInlineElement_1.getLastInlineElement;
exports.getInlineElementAtNode = getInlineElement_1.getInlineElementAtNode;
exports.getNextInlineElement = getInlineElement_1.getNextInlineElement;
exports.getPreviousInlineElement = getInlineElement_1.getPreviousInlineElement;
exports.getInlineElementBeforePoint = getInlineElement_1.getInlineElementBeforePoint;
exports.getInlineElementAfterPoint = getInlineElement_1.getInlineElementAfterPoint;
var DefaultInlineElementResolver_1 = __webpack_require__(35);
exports.DefaultInlineElementResolver = DefaultInlineElementResolver_1.default;
var ImageInlineElement_1 = __webpack_require__(36);
exports.ImageInlineElement = ImageInlineElement_1.default;
var InlineElementFactory_1 = __webpack_require__(53);
exports.InlineElementFactory = InlineElementFactory_1.default;
var LinkInlineElement_1 = __webpack_require__(38);
exports.LinkInlineElement = LinkInlineElement_1.default;
var NodeInlineElement_1 = __webpack_require__(9);
exports.NodeInlineElement = NodeInlineElement_1.default;
var PartialInlineElement_1 = __webpack_require__(13);
exports.PartialInlineElement = PartialInlineElement_1.default;
var TextInlineElement_1 = __webpack_require__(22);
exports.TextInlineElement = TextInlineElement_1.default;
var BodyScoper_1 = __webpack_require__(54);
exports.BodyScoper = BodyScoper_1.default;
var EditorSelection_1 = __webpack_require__(23);
exports.EditorSelection = EditorSelection_1.default;
var SelectionBlockScoper_1 = __webpack_require__(55);
exports.SelectionBlockScoper = SelectionBlockScoper_1.default;
var SelectionScoper_1 = __webpack_require__(56);
exports.SelectionScoper = SelectionScoper_1.default;
var contains_1 = __webpack_require__(14);
exports.contains = contains_1.default;
var convertInlineCss_1 = __webpack_require__(57);
exports.convertInlineCss = convertInlineCss_1.default;
var fromHtml_1 = __webpack_require__(21);
exports.fromHtml = fromHtml_1.default;
var getComputedStyle_1 = __webpack_require__(20);
exports.getComputedStyle = getComputedStyle_1.default;
var getTagOfNode_1 = __webpack_require__(15);
exports.getTagOfNode = getTagOfNode_1.default;
var isBlockElement_1 = __webpack_require__(33);
exports.isBlockElement = isBlockElement_1.default;
var isDocumentPosition_1 = __webpack_require__(4);
exports.isDocumentPosition = isDocumentPosition_1.default;
var isTextualInlineElement_1 = __webpack_require__(58);
exports.isTextualInlineElement = isTextualInlineElement_1.default;
var matchWhiteSpaces_1 = __webpack_require__(59);
exports.matchWhiteSpaces = matchWhiteSpaces_1.default;
var normalizeEditorPoint_1 = __webpack_require__(39);
exports.normalizeEditorPoint = normalizeEditorPoint_1.default;
var unwrap_1 = __webpack_require__(60);
exports.unwrap = unwrap_1.default;
var wrap_1 = __webpack_require__(37);
exports.wrap = wrap_1.default;
var wrapAll_1 = __webpack_require__(61);
exports.wrapAll = wrapAll_1.default;
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Editor_1 = __webpack_require__(62);
exports.Editor = Editor_1.default;
var Undo_1 = __webpack_require__(40);
exports.Undo = Undo_1.default;
var BrowserData_1 = __webpack_require__(24);
exports.browserData = BrowserData_1.default;
exports.getBrowserData = BrowserData_1.getBrowserData;
var eventDataCacheUtils_1 = __webpack_require__(69);
exports.cacheEventData = eventDataCacheUtils_1.cacheEventData;
exports.getEventDataCache = eventDataCacheUtils_1.getEventDataCache;
exports.clearEventDataCache = eventDataCacheUtils_1.clearEventDataCache;
exports.cacheGetEventData = eventDataCacheUtils_1.cacheGetEventData;
//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Check if editor has a collapsed selection
function isSelectionCollapsed(editor) {
    var range = editor.getSelectionRange();
    return range && range.collapsed ? true : false;
}
exports.default = isSelectionCollapsed;
//# sourceMappingURL=isSelectionCollapsed.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Check if completeDocumentPosition is or encompasses documentPosition
function isDocumentPosition(completeDocumentPosition, documentPosition) {
    return documentPosition == 0 /* Same */
        ? completeDocumentPosition == 0 /* Same */
        : (completeDocumentPosition & documentPosition) == documentPosition;
}
exports.default = isDocumentPosition;
//# sourceMappingURL=isDocumentPosition.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cacheGetCursorEventData_1 = __webpack_require__(51);
exports.cacheGetCursorEventData = cacheGetCursorEventData_1.default;
exports.clearCursorEventDataCache = cacheGetCursorEventData_1.clearCursorEventDataCache;
var CursorData_1 = __webpack_require__(11);
exports.CursorData = CursorData_1.default;
var getNodeAtCursor_1 = __webpack_require__(17);
exports.getNodeAtCursor = getNodeAtCursor_1.default;
var isSelectionCollapsed_1 = __webpack_require__(3);
exports.isSelectionCollapsed = isSelectionCollapsed_1.default;
var replaceRangeWithNode_1 = __webpack_require__(42);
exports.replaceRangeWithNode = replaceRangeWithNode_1.default;
var replaceTextBeforeCursorWithNode_1 = __webpack_require__(70);
exports.replaceTextBeforeCursorWithNode = replaceTextBeforeCursorWithNode_1.default;
var cacheGetListElement_1 = __webpack_require__(43);
exports.cacheGetListElement = cacheGetListElement_1.default;
var cacheGetListState_1 = __webpack_require__(44);
exports.cacheGetListState = cacheGetListState_1.default;
exports.getListStateAtNode = cacheGetListState_1.getListStateAtNode;
var clearFormat_1 = __webpack_require__(71);
exports.clearFormat = clearFormat_1.default;
var createLink_1 = __webpack_require__(72);
exports.createLink = createLink_1.default;
var execFormatWithUndo_1 = __webpack_require__(0);
exports.execFormatWithUndo = execFormatWithUndo_1.default;
var getFormatState_1 = __webpack_require__(73);
exports.getFormatState = getFormatState_1.default;
var removeLink_1 = __webpack_require__(74);
exports.removeLink = removeLink_1.default;
var setAlignment_1 = __webpack_require__(75);
exports.setAlignment = setAlignment_1.default;
var setBackgroundColor_1 = __webpack_require__(76);
exports.setBackgroundColor = setBackgroundColor_1.default;
var setTextColor_1 = __webpack_require__(77);
exports.setTextColor = setTextColor_1.default;
var setDirection_1 = __webpack_require__(78);
exports.setDirection = setDirection_1.default;
var setFontName_1 = __webpack_require__(79);
exports.setFontName = setFontName_1.default;
var setFontSize_1 = __webpack_require__(80);
exports.setFontSize = setFontSize_1.default;
var setImageAltText_1 = __webpack_require__(81);
exports.setImageAltText = setImageAltText_1.default;
var setIndentation_1 = __webpack_require__(82);
exports.setIndentation = setIndentation_1.default;
var toggleBold_1 = __webpack_require__(83);
exports.toggleBold = toggleBold_1.default;
var toggleBullet_1 = __webpack_require__(48);
exports.toggleBullet = toggleBullet_1.default;
var toggleItalic_1 = __webpack_require__(84);
exports.toggleItalic = toggleItalic_1.default;
var toggleNumbering_1 = __webpack_require__(85);
exports.toggleNumbering = toggleNumbering_1.default;
var toggleStrikethrough_1 = __webpack_require__(86);
exports.toggleStrikethrough = toggleStrikethrough_1.default;
var toggleSubscript_1 = __webpack_require__(87);
exports.toggleSubscript = toggleSubscript_1.default;
var toggleSuperscript_1 = __webpack_require__(88);
exports.toggleSuperscript = toggleSuperscript_1.default;
var toggleUnderline_1 = __webpack_require__(89);
exports.toggleUnderline = toggleUnderline_1.default;
var defaultLinkMatchRules_1 = __webpack_require__(45);
exports.defaultLinkMatchRules = defaultLinkMatchRules_1.default;
var matchLink_1 = __webpack_require__(47);
exports.matchLink = matchLink_1.default;
var RegExLinkMatchRule_1 = __webpack_require__(46);
exports.RegExLinkMatchRule = RegExLinkMatchRule_1.default;
//# sourceMappingURL=index.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(13);
var shouldSkipNode_1 = __webpack_require__(19);
var getBlockElement_1 = __webpack_require__(7);
var getLeafNode_1 = __webpack_require__(34);
var getLeafSibling_1 = __webpack_require__(8);
// Get the inline element at a node
function getInlineElementAtNode(rootNode, node, inlineElementFactory) {
    // An inline element has to be in a block element, get the block first and then resolve through the factory
    var parentBlock = node ? getBlockElement_1.getBlockElementAtNode(rootNode, node, inlineElementFactory) : null;
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
//# sourceMappingURL=getInlineElement.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NodeBlockElement_1 = __webpack_require__(30);
var StartEndBlockElement_1 = __webpack_require__(32);
var contains_1 = __webpack_require__(14);
var getTagOfNode_1 = __webpack_require__(15);
var isBlockElement_1 = __webpack_require__(33);
var getLeafSibling_1 = __webpack_require__(8);
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
            return new NodeBlockElement_1.default(node, inlineElementFactory);
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
            blockElement = new StartEndBlockElement_1.default(rootNode, headNode, tailNode, inlineElementFactory);
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
                    ? new NodeBlockElement_1.default(headNode, inlineElementFactory)
                    : new StartEndBlockElement_1.default(rootNode, headNode, tailNode, inlineElementFactory);
        }
    }
    return blockElement;
}
exports.getBlockElementAtNode = getBlockElementAtNode;
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
//# sourceMappingURL=getBlockElement.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contains_1 = __webpack_require__(14);
var shouldSkipNode_1 = __webpack_require__(19);
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
//# sourceMappingURL=getLeafSibling.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contains_1 = __webpack_require__(14);
var getTagOfNode_1 = __webpack_require__(15);
var isDocumentPosition_1 = __webpack_require__(4);
var isEditorPointAfter_1 = __webpack_require__(18);
var isNodeAfter_1 = __webpack_require__(12);
var wrap_1 = __webpack_require__(37);
var getLeafSibling_1 = __webpack_require__(8);
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
            if (startNode.nodeType == 3 /* Text */ && startNode.nodeValue) {
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
//# sourceMappingURL=NodeInlineElement.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LOCALFILEREFERENCEREGEX = new RegExp('^file:///[a-zA-Z]:', 'i');
var BASE64IMAGEDATAREGEX = new RegExp('^data:(image\\/\\w+);base64,([A-Za-z0-9+/=]+?)$', 'i');
var SAFARI_IMAGE_BLOB_PREFIX = 'blob:';
var WEBKIT_FAKE_URL_IMAGE_PREFIX = 'webkit-fake-url:';
var PASTED_IMAGE_ATTRIBUTE_NAME = 'data-pastedImageId';
function validateFileType(file) {
    return file instanceof Blob;
}
exports.validateFileType = validateFileType;
function processImages(pasteContainer, clipboardData) {
    var images = pasteContainer.querySelectorAll('img');
    var imageCount = images.length;
    for (var i = 0; i < imageCount; i++) {
        var image = images[i];
        var imageSrc = image.getAttribute('src');
        // Check for images with no src or images pasted from Safari which don't have usable sources
        if (!imageSrc ||
            imageSrc.indexOf(SAFARI_IMAGE_BLOB_PREFIX) === 0 ||
            imageSrc.indexOf(WEBKIT_FAKE_URL_IMAGE_PREFIX) === 0) {
            if (!clipboardData.imageData.noSrcImageIds) {
                clipboardData.imageData.noSrcImageIds = [];
            }
            clipboardData.imageData.noSrcImageIds.push(addUniqueIdToImage(image));
            continue;
        }
        // Check for images with src as local file path (normally comes from pasting images & text from Office)
        var localFileImage = parseLocalFileImageData(image, imageSrc);
        if (localFileImage) {
            if (!clipboardData.imageData.localFileImages) {
                clipboardData.imageData.localFileImages = [];
            }
            clipboardData.imageData.localFileImages.push(localFileImage);
            continue;
        }
        // Check for images with src as base64 data uri
        var base64Image = parseBase64ImageData(image, imageSrc);
        if (base64Image) {
            if (!clipboardData.imageData.base64Images) {
                clipboardData.imageData.base64Images = [];
            }
            clipboardData.imageData.base64Images.push(base64Image);
        }
    }
}
exports.processImages = processImages;
function getPastedElementWithId(editor, uniqueId) {
    var selector = "img[" + PASTED_IMAGE_ATTRIBUTE_NAME + "=\"" + uniqueId + "\"]";
    var nodes = editor.queryContent(selector);
    if (nodes && nodes.length > 0) {
        return nodes.item(0);
    }
    return null;
}
exports.getPastedElementWithId = getPastedElementWithId;
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
function getGuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function addUniqueIdToImage(image) {
    var uniqueId = getGuid();
    image.setAttribute(PASTED_IMAGE_ATTRIBUTE_NAME, uniqueId);
    return uniqueId;
}
function parseLocalFileImageData(imageNode, imageSrc) {
    var localFileImageData = null;
    var matchedValues = imageSrc.match(LOCALFILEREFERENCEREGEX);
    if (matchedValues && matchedValues.length > 0) {
        localFileImageData = {
            path: imageSrc,
            imageId: addUniqueIdToImage(imageNode),
        };
    }
    return localFileImageData;
}
function parseBase64ImageData(imageNode, imageSrc) {
    var base64ImageData = null;
    var matchedValues = imageSrc.match(BASE64IMAGEDATAREGEX);
    if (matchedValues && matchedValues.length === 3) {
        base64ImageData = {
            base64Content: matchedValues[2],
            mimeType: matchedValues[1],
            imageId: addUniqueIdToImage(imageNode),
        };
    }
    return base64ImageData;
}
//# sourceMappingURL=PasteUtility.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(1);
// The class that helps parse content around cursor
var CursorData = /** @class */ (function () {
    function CursorData(editor) {
        this.editor = editor;
    }
    Object.defineProperty(CursorData.prototype, "wordBeforeCursor", {
        // Get the word before cursor
        get: function () {
            var _this = this;
            if (!this.cachedWordBeforeCursor && !this.backwardTraversingComplete) {
                this.continueTraversingBackwardTill(function (textSection) {
                    return _this.cachedWordBeforeCursor != null;
                });
            }
            return this.cachedWordBeforeCursor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorData.prototype, "inlineElementBeforeCursor", {
        // Get the inline element before cursor
        get: function () {
            if (!this.inlineBeforeCursor && !this.backwardTraversingComplete) {
                // Just return after it moves the needle by one step
                this.continueTraversingBackwardTill(function (textSection) {
                    return true;
                });
            }
            return this.inlineBeforeCursor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorData.prototype, "inlineElementAfterCursor", {
        // Get the inline element after cursor
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
    // Get X number of chars before cursor
    // The actual returned chars may be less than what is requested
    CursorData.prototype.getXCharsBeforeCursor = function (numChars) {
        var _this = this;
        if ((!this.cachedTextBeforeCursor || this.cachedTextBeforeCursor.length < numChars) &&
            !this.backwardTraversingComplete) {
            // The cache is not built yet or not to the point the client asked for
            this.continueTraversingBackwardTill(function (textSection) {
                return (_this.cachedTextBeforeCursor != null &&
                    _this.cachedTextBeforeCursor.length >= numChars);
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
    /// Get text section before cursor till
    /// This offers consumers to retrieve text section by section
    /// The section essentially is just an inline element which has Container element
    /// so that the consumer can remember it for anchoring popup or verification purpose
    /// when cursor moves out of context etc.
    CursorData.prototype.getTextSectionBeforeCursorTill = function (stopFunc) {
        // We cache all text sections read so far
        // Every time when you ask for textSection, we start with the cached first
        // and resort to further reading once we exhausted with the cache
        var shouldStop = false;
        if (this.textsBeforeCursor && this.textsBeforeCursor.length > 0) {
            for (var i = 0; i < this.textsBeforeCursor.length; i++) {
                shouldStop = stopFunc(this.textsBeforeCursor[i]);
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
                // We have a new TextSection, remember it by pushing it to this.textsBeforeCursor array
                var newSection = {
                    wholeText: this.cachedTextBeforeCursor,
                    inlineElement: previousInline,
                };
                if (!this.textsBeforeCursor) {
                    this.textsBeforeCursor = [newSection];
                }
                else {
                    this.textsBeforeCursor.push(newSection);
                }
                // Check if stop condition is met
                if (stopFunc && stopFunc(newSection)) {
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
//# sourceMappingURL=CursorData.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(4);
// Checks if node1 is after node2
function isNodeAfter(node1, node2) {
    return !!(node1 &&
        node2 &&
        isDocumentPosition_1.default(node2.compareDocumentPosition(node1), 4 /* Following */));
}
exports.default = isNodeAfter;
//# sourceMappingURL=isNodeAfter.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var editorPointEquals_1 = __webpack_require__(31);
var isDocumentPosition_1 = __webpack_require__(4);
var isEditorPointAfter_1 = __webpack_require__(18);
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
//# sourceMappingURL=PartialInlineElement.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(4);
// Test if a node contains another node
function contains(container, contained) {
    return !!(container &&
        contained &&
        isDocumentPosition_1.default(container.compareDocumentPosition(contained), 16 /* ContainedBy */));
}
exports.default = contains;
//# sourceMappingURL=contains.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Returns the html tag of a node, or empty if it is not an element
function getTagOfNode(node) {
    // TODO: we need to standardize on use of lower or upper case
    return node && node.nodeType == 1 /* Element */ ? node.tagName.toUpperCase() : '';
}
exports.default = getTagOfNode;
//# sourceMappingURL=getTagOfNode.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getWindow(currentDocument) {
    return (currentDocument || document).defaultView || window;
}
// Checks if a range falls within the content Div
function isRangeInContainer(range, container) {
    var ancestorContainer = range ? range.commonAncestorContainer : null;
    // use the parentNode if ancestorContainer is a text node
    if (ancestorContainer && ancestorContainer.nodeType == 3 /* Text */) {
        ancestorContainer = ancestorContainer.parentNode;
    }
    return (ancestorContainer &&
        (container == ancestorContainer || container.contains(ancestorContainer)));
}
exports.isRangeInContainer = isRangeInContainer;
function getSelection(currentDocument) {
    return getWindow(currentDocument).getSelection();
}
exports.getSelection = getSelection;
function tryGetSelectionRange(container) {
    var sel = getSelection(container.ownerDocument);
    var selRange = null;
    if (sel && sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        if (isRangeInContainer(range, container)) {
            selRange = range;
        }
    }
    return selRange;
}
exports.tryGetSelectionRange = tryGetSelectionRange;
function updateSelectionToRange(currentDocument, range) {
    var selectionUpdated = false;
    if (range) {
        var sel = getSelection(currentDocument);
        if (sel) {
            if (sel.rangeCount > 0) {
                sel.removeAllRanges();
            }
            sel.addRange(range);
            selectionUpdated = true;
        }
    }
    return selectionUpdated;
}
exports.updateSelectionToRange = updateSelectionToRange;
//# sourceMappingURL=selection.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getNodeAtCursor(editor) {
    // First get the node at selection
    // if editor has focus, use selection.focusNode
    // if for some reason, the focus node does not get us a good node
    // fallback to this.getSelectionRange() which will return you a cached selection range if there is any
    // and use the start container or commonAncestorContainer
    var node = null;
    if (editor.hasFocus()) {
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
    if (node && node.nodeType == 3 /* Text */) {
        node = node.parentNode;
    }
    return node;
}
exports.default = getNodeAtCursor;
//# sourceMappingURL=getNodeAtCursor.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isNodeAfter_1 = __webpack_require__(12);
// Checks if point1 is after point2
function isEditorPointAfter(point1, point2) {
    return point1.containerNode == point2.containerNode
        ? point1.offset > point2.offset
        : isNodeAfter_1.default(point1.containerNode, point2.containerNode);
}
exports.default = isEditorPointAfter;
//# sourceMappingURL=isEditorPointAfter.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getComputedStyle_1 = __webpack_require__(20);
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
//# sourceMappingURL=shouldSkipNode.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getComputedStyle(node, styleName) {
    var styleValue = '';
    if (node && node.nodeType == 1 /* Element */) {
        var win = node.ownerDocument.defaultView || window;
        var styles = win.getComputedStyle(node);
        styleValue = styles && styles.getPropertyValue(styleName);
        if (styleValue) {
            styleValue = styleValue.toLowerCase();
        }
    }
    return styleValue;
}
exports.default = getComputedStyle;
//# sourceMappingURL=getComputedStyle.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Creates a HTMLElement array from html
function fromHtml(htmlFragment) {
    var element = document.createElement('DIV');
    element.innerHTML = htmlFragment;
    var children = [];
    for (var index = 0; index < element.childNodes.length; index++) {
        children.push(element.childNodes.item(index));
    }
    return children;
}
exports.default = fromHtml;
//# sourceMappingURL=fromHtml.js.map

/***/ }),
/* 22 */
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
var NodeInlineElement_1 = __webpack_require__(9);
// This refers to an inline element that represents a text node
var TextInlineElement = /** @class */ (function (_super) {
    __extends(TextInlineElement, _super);
    function TextInlineElement(containerNode, parentBlock) {
        return _super.call(this, containerNode, parentBlock) || this;
    }
    return TextInlineElement;
}(NodeInlineElement_1.default));
exports.default = TextInlineElement;
//# sourceMappingURL=TextInlineElement.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(13);
var editorPointEquals_1 = __webpack_require__(31);
var isEditorPointAfter_1 = __webpack_require__(18);
var normalizeEditorPoint_1 = __webpack_require__(39);
var getBlockElement_1 = __webpack_require__(7);
var getInlineElement_1 = __webpack_require__(6);
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
            return getInlineElement_1.getInlineElementBeforePoint(this.rootNode, this.startPoint, this.inlineElementFactory);
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
                this.startBlock = getBlockElement_1.getBlockElementAtNode(this.rootNode, this.startPoint.containerNode, this.inlineElementFactory);
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
                this.endBlock = getBlockElement_1.getBlockElementAtNode(this.rootNode, this.endPoint.containerNode, this.inlineElementFactory);
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
        this.startInline = getInlineElement_1.getInlineElementAfterPoint(this.rootNode, this.startPoint, this.inlineElementFactory);
        if (this.collapsed) {
            // For collapsed range, set end to be same as start
            this.endInline = this.startInline;
        }
        else {
            // For non-collapsed range, get same for end point
            this.endInline = getInlineElement_1.getInlineElementBeforePoint(this.rootNode, this.endPoint, this.inlineElementFactory);
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
//# sourceMappingURL=EditorSelection.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getBrowserData(userAgent, appVersion) {
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
//# sourceMappingURL=BrowserData.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var editor;
function getCurrentEditor() {
    return editor;
}
exports.default = getCurrentEditor;
function setCurrentEditor(newEditor) {
    if (editor) {
        editor.dispose();
    }
    editor = newEditor;
}
exports.setCurrentEditor = setCurrentEditor;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DefaultShortcut_1 = __webpack_require__(92);
exports.DefaultShortcut = DefaultShortcut_1.default;
var HtmlSnapshotUndo_1 = __webpack_require__(93);
exports.HtmlSnapshotUndo = HtmlSnapshotUndo_1.default;
var HyperLink_1 = __webpack_require__(94);
exports.HyperLink = HyperLink_1.default;
var TabIndent_1 = __webpack_require__(95);
exports.TabIndent = TabIndent_1.default;
var PasteManager_1 = __webpack_require__(96);
exports.PasteManager = PasteManager_1.default;
var PasteUtility_1 = __webpack_require__(10);
exports.getPastedElementWithId = PasteUtility_1.getPastedElementWithId;
//# sourceMappingURL=index.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PasteUtility_1 = __webpack_require__(10);
var PASTE_NODE_INSERT_OPTION = {
    position: 2 /* SelectionStart */,
    updateCursor: true,
    replaceSelection: true,
    insertOnNewLine: false,
};
var InlinePositionStyle = /(<\w+[^>]*style=['"][^>]*)position:[^>;'"]*/gi;
var pasteInterceptor = function preparePasteAndPickupPostPaste(editor, clipboardData, completeCallback) {
    var _a = preparePasteEnvironment(editor), originalSelectionRange = _a[0], pasteContainer = _a[1];
    setTimeout(function () {
        onPostPaste(editor, originalSelectionRange, pasteContainer, clipboardData, completeCallback);
    }, 0);
};
function preparePasteEnvironment(editor) {
    // cache original selection range in editor
    var originalSelectionRange = editor.getSelectionRange();
    // create paste container, append to body, and set selection to it, so paste content goes inside
    var pasteContainer = editor.getDocument().createElement('div');
    pasteContainer.setAttribute('contenteditable', 'true');
    pasteContainer.style.width = '1px';
    pasteContainer.style.height = '1px';
    pasteContainer.style.overflow = 'hidden';
    pasteContainer.style.position = 'absolute';
    pasteContainer.style.top = '100px'; // just pick 100px to have pasteContainer in viewport
    pasteContainer.style.left = '0px';
    pasteContainer.style.webkitUserSelect = 'text';
    editor.getDocument().body.appendChild(pasteContainer);
    var pasteContainerRange = editor.getDocument().createRange();
    pasteContainerRange.selectNodeContents(pasteContainer);
    var selection = editor.getSelection();
    selection.removeAllRanges();
    selection.addRange(pasteContainerRange);
    pasteContainer.focus();
    return [originalSelectionRange, pasteContainer];
}
function onPostPaste(editor, originalSelectionRange, pasteContainer, clipboardData, completeCallback) {
    var innerText = pasteContainer.innerText;
    // There is visible text copied or there is no image, then we should use the text
    // Add this check because we don't want to run into this code if the copied content has image and no visible text
    // This can happen when copy image from oneNote. Then copied HTML is something like <div><img ...></div>.
    // In that case we paste the image only instead of the HTML.
    if ((innerText && innerText.trim() != '') || !clipboardData.imageData.file) {
        // There is text to paste, so clear any image data if any.
        // Otherwise both text and image will be pasted, this will cause duplicated paste
        clipboardData.imageData = {};
        clipboardData.htmlData = pasteContainer.innerHTML;
        PasteUtility_1.processImages(pasteContainer, clipboardData);
    }
    // restore original selection range in editor
    editor.updateSelection(originalSelectionRange);
    // If the clipboard data contains an image file don't restore the paste container.
    // The image file will be added as an attachment, so if we restore the paste environment and it also
    // contains the image we will get the image twice
    if (!clipboardData.imageData.file) {
        restorePasteEnvironment(editor, originalSelectionRange, pasteContainer);
    }
    completeCallback(clipboardData);
}
function restorePasteEnvironment(editor, originalSelectionRange, pasteContainer) {
    // move all children out of pasteContainer and insert them to selection start
    normalizeContent(pasteContainer);
    while (pasteContainer.firstChild) {
        editor.insertNode(pasteContainer.firstChild, PASTE_NODE_INSERT_OPTION);
    }
    // remove pasteContainer
    pasteContainer.parentNode.removeChild(pasteContainer);
}
function normalizeContent(container) {
    var content = container.innerHTML;
    // Remove 'position' style from source HTML
    content = content.replace(InlinePositionStyle, '$1');
    container.innerHTML = content;
}
exports.default = pasteInterceptor;
//# sourceMappingURL=PasteInterceptor.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// An editor plugin to show cursor position in demo page
var ShowCursorPosition = /** @class */ (function () {
    function ShowCursorPosition(resultContainer) {
        this.resultContainer = resultContainer;
    }
    ShowCursorPosition.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    ShowCursorPosition.prototype.dispose = function () {
        this.editor = null;
    };
    ShowCursorPosition.prototype.onPluginEvent = function (event) {
        if (event.eventType == 7 /* MouseOut */ ||
            event.eventType == 6 /* MouseOver */) {
            return;
        }
        var rect = this.editor.getCursorRect();
        if (rect) {
            var result = 'top=' +
                rect.top +
                '; bottom=' +
                rect.bottom +
                '; left=' +
                rect.left +
                '; right=' +
                rect.right;
            this.resultContainer.innerText = result;
        }
    };
    return ShowCursorPosition;
}());
exports.default = ShowCursorPosition;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(5);
// An editor plugin to show cursor position in demo page
var ShowFormatState = /** @class */ (function () {
    function ShowFormatState(resultContainer) {
        this.resultContainer = resultContainer;
    }
    ShowFormatState.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    ShowFormatState.prototype.dispose = function () {
        this.editor = null;
    };
    ShowFormatState.prototype.onPluginEvent = function (event) {
        var formatState = roosterjs_editor_api_1.getFormatState(this.editor);
        if (formatState) {
            var result = '';
            if (formatState.fontName) {
                result += ' <b>fontName:</b> ' + formatState.fontName;
            }
            if (formatState.fontSize) {
                result += ' <b>fontSize:</b> ' + formatState.fontSize;
            }
            if (formatState.backgroundColor) {
                result += ' <b>backgroundColor:</b> ' + formatState.backgroundColor;
            }
            if (formatState.textColor) {
                result += ' <b>textColor:</b> ' + formatState.textColor;
            }
            if (formatState.isBold) {
                result += ' <b>Bold</b> ';
            }
            if (formatState.isItalic) {
                result += ' <b>Italic</b> ';
            }
            if (formatState.isUnderline) {
                result += ' <b>Underline</b> ';
            }
            if (formatState.isBullet) {
                result += ' <b>Bullet</b> ';
            }
            if (formatState.isNumbering) {
                result += ' <b>Numbering</b> ';
            }
            if (formatState.isStrikeThrough) {
                result += ' <b>StrikeThrough</b> ';
            }
            if (formatState.isSubscript) {
                result += ' <b>Subscript</b> ';
            }
            if (formatState.isSuperscript) {
                result += ' <b>Superscript</b> ';
            }
            if (formatState.canUndo) {
                result += ' <b>CanUndo</b> ';
            }
            if (formatState.canRedo) {
                result += ' <b>CanReDo</b> ';
            }
            this.resultContainer.innerHTML = result;
        }
    };
    return ShowFormatState;
}());
exports.default = ShowFormatState;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(4);
var isNodeAfter_1 = __webpack_require__(12);
var getInlineElement_1 = __webpack_require__(6);
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
            this.firstInline = getInlineElement_1.getFirstInlineElement(this.containerNode, this.inlineElementFactory);
        }
        return this.firstInline;
    };
    // Get the last inline element in the block
    NodeBlockElement.prototype.getLastInlineElement = function () {
        if (!this.lastInline) {
            this.lastInline = getInlineElement_1.getLastInlineElement(this.containerNode, this.inlineElementFactory);
        }
        return this.lastInline;
    };
    // Gets all inline in the block
    NodeBlockElement.prototype.getInlineElements = function () {
        var allInlines = [];
        var startInline = this.getFirstInlineElement();
        while (startInline) {
            allInlines.push(startInline);
            startInline = getInlineElement_1.getNextInlineElement(this.containerNode, startInline, this.inlineElementFactory);
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
exports.default = NodeBlockElement;
//# sourceMappingURL=NodeBlockElement.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Checks if the two EditorPoint points to same location
function editorPointEquals(point1, point2) {
    return point1.containerNode == point2.containerNode && point1.offset == point2.offset;
}
exports.default = editorPointEquals;
//# sourceMappingURL=editorPointEquals.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(4);
var isNodeAfter_1 = __webpack_require__(12);
var getInlineElement_1 = __webpack_require__(6);
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
            this.firstInline = getInlineElement_1.getInlineElementAtNode(this.rootNode, this.startNode, this.inlineElementFactory);
        }
        return this.firstInline;
    };
    // Gets last inline
    StartEndBlockElement.prototype.getLastInlineElement = function () {
        if (!this.lastInline) {
            this.lastInline = getInlineElement_1.getInlineElementAtNode(this.rootNode, this.endNode, this.inlineElementFactory);
        }
        return this.lastInline;
    };
    // Gets all inline in the block
    StartEndBlockElement.prototype.getInlineElements = function () {
        var allInlines = [];
        var startInline = this.getFirstInlineElement();
        while (startInline) {
            allInlines.push(startInline);
            startInline = getInlineElement_1.getNextInlineElement(this.rootNode, startInline, this.inlineElementFactory);
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
exports.default = StartEndBlockElement;
//# sourceMappingURL=StartEndBlockElement.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getComputedStyle_1 = __webpack_require__(20);
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
//# sourceMappingURL=isBlockElement.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shouldSkipNode_1 = __webpack_require__(19);
var getLeafSibling_1 = __webpack_require__(8);
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
//# sourceMappingURL=getLeafNode.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageInlineElement_1 = __webpack_require__(36);
var LinkInlineElement_1 = __webpack_require__(38);
var TextInlineElement_1 = __webpack_require__(22);
var getTagOfNode_1 = __webpack_require__(15);
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
//# sourceMappingURL=DefaultInlineElementResolver.js.map

/***/ }),
/* 36 */
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
var NodeInlineElement_1 = __webpack_require__(9);
// This is an inline element representing an Html image
var ImageInlineElement = /** @class */ (function (_super) {
    __extends(ImageInlineElement, _super);
    function ImageInlineElement(containerNode, parentBlock) {
        return _super.call(this, containerNode, parentBlock) || this;
    }
    return ImageInlineElement;
}(NodeInlineElement_1.default));
exports.default = ImageInlineElement;
//# sourceMappingURL=ImageInlineElement.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fromHtml_1 = __webpack_require__(21);
// Wrap the node with html and return the wrapped node
function wrap(node, htmlFragment) {
    if (!node) {
        return null;
    }
    var wrapper = node;
    if (htmlFragment) {
        wrapper = fromHtml_1.default(htmlFragment)[0];
        if (node.parentNode) {
            node.parentNode.insertBefore(wrapper, node);
            node.parentNode.removeChild(node);
        }
        wrapper.appendChild(node);
    }
    return wrapper;
}
exports.default = wrap;
//# sourceMappingURL=wrap.js.map

/***/ }),
/* 38 */
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
var NodeInlineElement_1 = __webpack_require__(9);
// This is inline element presenting an html hyperlink
var LinkInlineElement = /** @class */ (function (_super) {
    __extends(LinkInlineElement, _super);
    function LinkInlineElement(containerNode, parentBlock) {
        return _super.call(this, containerNode, parentBlock) || this;
    }
    return LinkInlineElement;
}(NodeInlineElement_1.default));
exports.default = LinkInlineElement;
//# sourceMappingURL=LinkInlineElement.js.map

/***/ }),
/* 39 */
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
    var adjustedContainer = container;
    var adjustedOffset = offset;
    if (adjustedContainer.nodeType == 1 /* Element */ && adjustedContainer.hasChildNodes()) {
        if (offset < adjustedContainer.childNodes.length) {
            // offset points to a child node that exists
            adjustedContainer = container.childNodes[offset];
            adjustedOffset = 0 /* Begin */;
        }
        else {
            // offset points to end of container
            adjustedContainer = container.childNodes[offset - 1];
            adjustedOffset =
                adjustedContainer.nodeType == 3 /* Text */
                    ? adjustedContainer.nodeValue.length
                    : 1 /* End */;
        }
    }
    // Even we have an adjusted container, it does not mean it is a leaf
    // Still need to do the check, and adjust a bit further to last or first child
    // depending on what offset says
    if (adjustedContainer.hasChildNodes()) {
        if (adjustedOffset == 0) {
            while (adjustedContainer.firstChild) {
                adjustedContainer = adjustedContainer.firstChild;
            }
        }
        else {
            // adjustedOffset == 1 meaning end of node
            while (adjustedContainer.lastChild) {
                adjustedContainer = adjustedContainer.lastChild;
                adjustedOffset =
                    adjustedContainer.nodeType == 3 /* Text */
                        ? adjustedContainer.nodeValue.length
                        : 1 /* End */;
            }
        }
    }
    return { containerNode: adjustedContainer, offset: adjustedOffset };
}
exports.default = normalizeEditorPoint;
//# sourceMappingURL=normalizeEditorPoint.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UndoSnapshots_1 = __webpack_require__(63);
var containsImage_1 = __webpack_require__(64);
var snapshotUtils_1 = __webpack_require__(65);
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
     */
    function Undo(preserveSnapshots) {
        this.preserveSnapshots = preserveSnapshots;
    }
    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    Undo.prototype.initialize = function (editor) {
        this.editor = editor;
        // Add an initial snapshot if snapshotsManager isn't created yet
        if (!this.undoSnapshots) {
            this.addUndoSnapshot();
        }
    };
    /**
     * Dispose this plugin
     */
    Undo.prototype.dispose = function () {
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
            case 5 /* ContentChanged */:
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
    Undo.prototype.restoreSnapshot = function (delta) {
        var snapshot = this.getSnapshotsManager().move(delta);
        if (snapshot) {
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
        var shouldTakeUndo = false;
        if (evt.which == KEY_BACKSPACE || evt.which == KEY_DELETE) {
            var selectionRange = this.editor.getSelectionRange();
            if (selectionRange &&
                (!selectionRange.collapsed ||
                    // If the selection contains image, we need to add undo snapshots
                    containsImage_1.default(selectionRange.startContainer))) {
                shouldTakeUndo = true;
            }
        }
        else if (this.hasNewContent && evt.which >= KEY_PAGEUP && evt.which <= KEY_DOWN) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            shouldTakeUndo = true;
        }
        if (shouldTakeUndo) {
            this.addUndoSnapshot();
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
    Undo.prototype.getSnapshotsManager = function () {
        if (!this.undoSnapshots) {
            this.undoSnapshots = new UndoSnapshots_1.default();
        }
        return this.undoSnapshots;
    };
    return Undo;
}());
exports.default = Undo;
//# sourceMappingURL=Undo.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(1);
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
//# sourceMappingURL=isVoidHtmlElement.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// exactMatch means we're changing the text right before at cursor, reset the selection to end of range
// ensures that the cursor is in the right place. Otherwise, try to restore to previously stored selection
// to end of the range
function replaceRangeWithNode(editor, range, node, exactMatch) {
    // Make sure the range and node is valid
    if (!range || !node) {
        return false;
    }
    range.deleteContents();
    range.insertNode(node);
    if (exactMatch) {
        range.setEndAfter(node);
        range.collapse(false /*toStart*/);
        editor.updateSelection(range);
    }
    return true;
}
exports.default = replaceRangeWithNode;
//# sourceMappingURL=replaceRangeWithNode.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getNodeAtCursor_1 = __webpack_require__(17);
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_dom_1 = __webpack_require__(1);
var EVENTDATACACHE_LISTELEMENT = 'LISTELEMENT';
function cacheGetListElement(editor, event) {
    return roosterjs_editor_core_1.cacheGetEventData(event, EVENTDATACACHE_LISTELEMENT, function () {
        var node = getNodeAtCursor_1.default(editor);
        var startElement = node && node.nodeType == 3 /* Text */ ? node.parentElement : node;
        while (startElement && editor.contains(startElement)) {
            var tagName = roosterjs_editor_dom_1.getTagOfNode(startElement);
            if (tagName == 'LI') {
                return startElement;
            }
            startElement = startElement.parentElement;
        }
        return null;
    });
}
exports.default = cacheGetListElement;
//# sourceMappingURL=cacheGetListElement.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cacheGetListElement_1 = __webpack_require__(43);
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_dom_1 = __webpack_require__(1);
var EVENTDATACACHE_LISTSTATE = 'LISTSTATE';
// Crawl up the DOM tree from given start node to find if it falls on a list and return the type of list
function getListStateAtNode(editor, node) {
    var listState = 0 /* None */;
    var inList = false;
    var startNode = node && node.nodeType == 3 /* Text */ ? node.parentNode : node;
    while (startNode && editor.contains(startNode)) {
        var tagName = roosterjs_editor_dom_1.getTagOfNode(startNode);
        if (inList) {
            if (tagName == 'OL') {
                listState = 2 /* Numbering */;
                break;
            }
            else if (tagName == 'UL') {
                listState = 1 /* Bullets */;
                break;
            }
        }
        else {
            inList = tagName == 'LI';
        }
        startNode = startNode.parentNode;
    }
    return listState;
}
exports.getListStateAtNode = getListStateAtNode;
// Get the list state
function cacheGetListState(editor, event) {
    return roosterjs_editor_core_1.cacheGetEventData(event, EVENTDATACACHE_LISTSTATE, function () {
        var listState = 0 /* None */;
        var listElement = cacheGetListElement_1.default(editor, event);
        if (listElement) {
            listState = getListStateAtNode(editor, listElement);
        }
        return listState;
    });
}
exports.default = cacheGetListState;
//# sourceMappingURL=cacheGetListState.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegExLinkMatchRule_1 = __webpack_require__(46);
// http exclude matching regex
// invalid URL example (in paricular on IE and Edge):
// - http://www.bing.com%00, %00 before ? (question mark) is considered invalid. IE/Edge throws invalid argument exception
// - http://www.bing.com%1, %1 is invalid
// - http://www.bing.com%g, %g is invalid (IE and Edge expects a two hex value after a %)
// - http://www.bing.com%, % as ending is invalid (IE and Edge expects a two hex value after a %)
// All above % cases if they're after ? (question mark) is then considered valid again
// Similar for @, it needs to be after / (forward slash), or ? (question mark). Otherwise IE/Edge will throw security exception
// - http://www.bing.com@nick, @nick before ? (question mark) is considered invalid
// - http://www.bing.com/@nick, is valid sine it is after / (forward slash)
// - http://www.bing.com?@nick, is also valid sinve it is after ? (question mark)
// The regex below is essentially a break down of:
// ^[^?]+%[^0-9a-f]+ => to exclude URL like www.bing.com%%
// ^[^?]+%[0-9a-f][^0-9a-f]+ => to exclude URL like www.bing.com%1
// ^[^?]+%00 => to exclude URL like www.bing.com%00
// ^[^?]+%$ => to exclude URL like www.bing.com%
// ^https?:\/\/[^?\/]+@ => to exclude URL like http://www.bing.com@nick
// ^www\.[^?\/]+@ => to exclude URL like www.bing.com@nick
var httpExcludeRegEx = /^[^?]+%[^0-9a-f]+|^[^?]+%[0-9a-f][^0-9a-f]+|^[^?]+%00|^[^?]+%$|^https?:\/\/[^?\/]+@|^www\.[^?\/]+@/i;
// http matching regex
var httpMatchingRegEx = /^http:\/\/\S+|www\.\S+/i;
// https matching regex
var httpsMatchingRegEx = /^https:\/\/\S+/i;
// mailto matching regex
var mailtoMatchingRegEx = /^mailto:\S+@\S+\.\S+/i;
// notes matching regex
var notesMatchingRegEx = /^notes:\/\/\S+/i;
// file matching regex
var fileMatchingRegEx = /^file:\/\/\/?\S+/i;
// unc matching regex
var uncMatchingRegEx = /^\\\\\S+/i;
// ftp matching regex
var ftpMatchingRegEx = /^ftp:\/\/\S+|ftp\.\S+/i;
// news matching regex
var newsMatchingRegEx = /^news:(\/\/)?\S+/i;
// telnet matching regEx
var telnetMatchingRegex = /^telnet:\S+/i;
// gopher matching regEx
var gopherMatchingRegEx = /^gopher:\/\/\S+/i;
// wais matching regex
var waisMatchingRegEx = /^wais:\S+/i;
// Default match rules that will be used in matching a link
var defaultLinkMatchRules = [
    new RegExLinkMatchRule_1.default('http', 'http' + '://', httpMatchingRegEx, httpExcludeRegEx),
    new RegExLinkMatchRule_1.default('https', 'https://', httpsMatchingRegEx, httpExcludeRegEx),
    new RegExLinkMatchRule_1.default('mailto', 'mailto:', mailtoMatchingRegEx),
    new RegExLinkMatchRule_1.default('notes', 'notes://', notesMatchingRegEx),
    new RegExLinkMatchRule_1.default('file', 'file://', fileMatchingRegEx),
    new RegExLinkMatchRule_1.default('unc', '\\\\', uncMatchingRegEx),
    new RegExLinkMatchRule_1.default('ftp', 'ftp://', ftpMatchingRegEx),
    new RegExLinkMatchRule_1.default('news', 'news://', newsMatchingRegEx),
    new RegExLinkMatchRule_1.default('telnet', 'telnet://', telnetMatchingRegex),
    new RegExLinkMatchRule_1.default('gopher', 'gopher://', gopherMatchingRegEx),
    new RegExLinkMatchRule_1.default('wais', 'wais://', waisMatchingRegEx),
];
exports.default = defaultLinkMatchRules;
//# sourceMappingURL=defaultLinkMatchRules.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The RegExLinkMatchRule which takes an inclusion regex and an exclusion regex
var RegExLinkMatchRule = /** @class */ (function () {
    function RegExLinkMatchRule(scheme, prefix, includeRegEx, excludeRegEx) {
        this.scheme = scheme;
        this.prefix = prefix;
        this.includeRegEx = includeRegEx;
        this.excludeRegEx = excludeRegEx;
    }
    // The include check
    RegExLinkMatchRule.prototype.include = function (url) {
        // Check if it meets minimum length, and there are some rules
        if (!url || !this.includeRegEx) {
            return null;
        }
        var matchedLinkData;
        var matches;
        if ((matches = url.match(this.includeRegEx)) && matches.length > 0) {
            // We have a match
            var matchedUrl = matches[0];
            var normalizedUrl = matchedUrl.indexOf(this.prefix) == 0 ? matchedUrl : this.prefix + matchedUrl;
            matchedLinkData = {
                scheme: this.scheme,
                prefix: this.prefix,
                originalUrl: matchedUrl,
                normalizedUrl: normalizedUrl,
            };
        }
        return matchedLinkData;
    };
    // The exclude check
    RegExLinkMatchRule.prototype.exclude = function (url) {
        var shouldExclude = false;
        if (url && this.excludeRegEx) {
            shouldExclude = this.excludeRegEx.test(url);
        }
        return shouldExclude;
    };
    return RegExLinkMatchRule;
}());
exports.default = RegExLinkMatchRule;
//# sourceMappingURL=RegExLinkMatchRule.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Match a url against the rules
function matchLink(url, option, rules) {
    if (!url || !rules || rules.length == 0) {
        return null;
    }
    var matchedLink = null;
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        var link = rule.include(url);
        // For exact match, also need to check the length
        if (link && (option != 1 /* Exact */ || url.length == link.originalUrl.length)) {
            // We have a matched link. Now take the matched portion and do an exclude test
            if (rule.exclude && rule.exclude(link.originalUrl)) {
                continue;
            }
            else {
                matchedLink = link;
                break;
            }
        }
    }
    return matchedLink;
}
exports.default = matchLink;
//# sourceMappingURL=matchLink.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var getNodeAtCursor_1 = __webpack_require__(17);
var roosterjs_editor_core_1 = __webpack_require__(2);
// Edge may incorrectly put cursor after toggle bullet, workaround it by adding a space.
// The space will be removed by Edge after toggle bullet
function workaroundForEdge(editor) {
    if (roosterjs_editor_core_1.browserData.isEdge) {
        var node = getNodeAtCursor_1.default(editor);
        if (node.nodeType == 1 /* Element */ && node.textContent == '') {
            var span = editor.getDocument().createElement('span');
            node.insertBefore(span, node.firstChild);
            span.innerHTML = 'a';
            return span;
        }
    }
    return null;
}
exports.workaroundForEdge = workaroundForEdge;
function removeWorkaroundForEdge(workaroundSpan) {
    if (workaroundSpan && workaroundSpan.parentNode) {
        workaroundSpan.parentNode.removeChild(workaroundSpan);
    }
}
exports.removeWorkaroundForEdge = removeWorkaroundForEdge;
function toggleBullet(editor) {
    editor.focus();
    execFormatWithUndo_1.default(editor, function () {
        var workaroundSpan = workaroundForEdge(editor);
        editor.getDocument().execCommand('insertUnorderedList', false, null);
        removeWorkaroundForEdge(workaroundSpan);
    });
}
exports.default = toggleBullet;
//# sourceMappingURL=toggleBullet.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(50);
(function webpackMissingModule() { throw new Error("Cannot find module \"source.js\""); }());
(function webpackMissingModule() { throw new Error("Cannot find module \"editor.js\""); }());


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ShowCursorPosition_1 = __webpack_require__(28);
var ShowFormatState_1 = __webpack_require__(29);
var initFormatBar_1 = __webpack_require__(90);
var initOptions_1 = __webpack_require__(91);
var roosterjs_1 = __webpack_require__(100);
var currentEditor_1 = __webpack_require__(25);
window.onload = function () {
    initTabs();
    initEditor();
    initFormatBar_1.default();
    initOptions_1.default();
    switchTab('quickstart');
};
function initTabs() {
    document.getElementById('quickstartTab').addEventListener('click', function () {
        switchTab('quickstart');
    });
    document.getElementById('optionsTab').addEventListener('click', function () {
        switchTab('options');
    });
    document.getElementById('advanceTab').addEventListener('click', function () {
        switchTab('advance');
    });
}
function switchTab(name) {
    document.getElementById('quickstartTab').className = name == 'quickstart' ? 'selected' : '';
    document.getElementById('optionsTab').className = name == 'options' ? 'selected' : '';
    document.getElementById('advanceTab').className = name == 'advance' ? 'selected' : '';
    document.getElementById('options').className = name == 'options' ? 'tab selected' : 'tab';
    document.getElementById('advance').className = name == 'advance' ? 'tab selected' : 'tab';
}
function initEditor() {
    var editorArea = document.getElementById('editor');
    editorArea.innerHTML = '';
    currentEditor_1.setCurrentEditor(roosterjs_1.createEditor(editorArea, [
        new ShowCursorPosition_1.default(document.getElementById('cursorPosition')),
        new ShowFormatState_1.default(document.getElementById('formatState')),
    ]));
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CursorData_1 = __webpack_require__(11);
var roosterjs_editor_core_1 = __webpack_require__(2);
var EVENTDATACACHE_CURSORDATA = 'CURSORDATA';
// Read CursorData from plugin event cache. If not, create one
function cacheGetCursorEventData(event, editor) {
    return roosterjs_editor_core_1.cacheGetEventData(event, EVENTDATACACHE_CURSORDATA, function () {
        return new CursorData_1.default(editor);
    });
}
exports.default = cacheGetCursorEventData;
// Clear the cursor data in a plugin event
function clearCursorEventDataCache(event) {
    roosterjs_editor_core_1.clearEventDataCache(event, EVENTDATACACHE_CURSORDATA);
}
exports.clearCursorEventDataCache = clearCursorEventDataCache;
//# sourceMappingURL=cacheGetCursorEventData.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getBlockElement_1 = __webpack_require__(7);
var getInlineElement_1 = __webpack_require__(6);
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
            ? getBlockElement_1.getNextBlockElement(this.rootNode, thisBlock, this.inlineElementFactory)
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
            ? getBlockElement_1.getPreviousBlockElement(this.rootNode, thisBlock, this.inlineElementFactory)
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
            nextInline = getInlineElement_1.getNextInlineElement(this.rootNode, thisInline, this.inlineElementFactory);
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
            previousInline = getInlineElement_1.getPreviousInlineElement(this.rootNode, thisInline, this.inlineElementFactory);
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
//# sourceMappingURL=ContentTraverser.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DefaultInlineElementResolver_1 = __webpack_require__(35);
var NodeInlineElement_1 = __webpack_require__(9);
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
//# sourceMappingURL=InlineElementFactory.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getBlockElement_1 = __webpack_require__(7);
var getInlineElement_1 = __webpack_require__(6);
// This provides scoper for traversing the entire editor body starting from the beginning
var BodyScoper = /** @class */ (function () {
    function BodyScoper(rootNode, inlineElementFactory) {
        this.rootNode = rootNode;
        this.inlineElementFactory = inlineElementFactory;
    }
    // Get the start block element
    BodyScoper.prototype.getStartBlockElement = function () {
        return getBlockElement_1.getFirstBlockElement(this.rootNode, this.inlineElementFactory);
    };
    // Get the first inline element in the editor
    BodyScoper.prototype.getStartInlineElement = function () {
        return getInlineElement_1.getFirstInlineElement(this.rootNode, this.inlineElementFactory);
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
//# sourceMappingURL=BodyScoper.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditorSelection_1 = __webpack_require__(23);
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
//# sourceMappingURL=SelectionBlockScoper.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditorSelection_1 = __webpack_require__(23);
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
//# sourceMappingURL=SelectionScoper.js.map

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DOCTYPE_HTML5 = '<!doctype html>';
var STYLE_TAG_FILTER = 'style';
var STYLEORLINK_REGEX = /<style|<link/i;
var DOCTYPE_REGEX = /^\s*<!doctype /i;
// Matches global style and body tag
var STYLE_REGEX = /<style[^>]*>([\s\S]*?)<\/style>/gi;
// Group regex. It should return two matches:
// match 1: the full match (including the body tag)
// match 2: everything inside body
var BODY_REGEX = /<body[^>]*>([\s\S]*)<\/body>/i;
// Pseudo selector, for things like :hover :link
// TODO: Outlook desktop emails used to contain some global P style
var PSEUDOSELECTOR_REGEX = /\w+\s*:\w+\s*/i;
var contentIFrameForInlineCssConverter;
function runWithTempIFrame(callback) {
    if (!contentIFrameForInlineCssConverter) {
        contentIFrameForInlineCssConverter = document.createElement('IFRAME');
        contentIFrameForInlineCssConverter.style.display = 'none';
    }
    document.body.appendChild(contentIFrameForInlineCssConverter);
    var contentDocument = contentIFrameForInlineCssConverter.contentDocument ||
        contentIFrameForInlineCssConverter.contentWindow.document;
    try {
        callback(contentDocument);
        return true;
    }
    catch (exception) {
        // just swallow all exception for the moment
        return false;
    }
    finally {
        contentDocument.body.innerHTML = '';
        contentDocument.head.innerHTML = '';
        document.body.removeChild(contentIFrameForInlineCssConverter);
    }
}
function forEachElementInQueryResult(doc, selector, callback) {
    var elements = doc.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        callback(elements[i]);
    }
}
/**
 * This is a fallback when we failed to convert through iframe
 * It will be a version with global style wiped out
 */
function convertThroughRegEx(sourceHtml) {
    var sourceWithoutStyle = sourceHtml.replace(STYLE_REGEX, '');
    var bodyMatches = BODY_REGEX.exec(sourceWithoutStyle);
    return bodyMatches != null && bodyMatches.length > 1
        ? bodyMatches[1].trim()
        : sourceWithoutStyle;
}
/**
 * Convert CSS from header or external, to inline CSS
 */
function convertInlineCss(sourceHtml) {
    // Skip for empty string
    if (!sourceHtml) {
        return '';
    }
    // If there's no stylesheet, just return
    if (!STYLEORLINK_REGEX.test(sourceHtml)) {
        return convertThroughRegEx(sourceHtml);
    }
    // Always add <!doctype html> if source html doesn't have doctype
    if (!DOCTYPE_REGEX.test(sourceHtml)) {
        sourceHtml = DOCTYPE_HTML5 + sourceHtml;
    }
    var result;
    var succeeded = runWithTempIFrame(function (contentDocument) {
        contentDocument.open();
        contentDocument.write(sourceHtml);
        contentDocument.close();
        for (var i = contentDocument.styleSheets.length - 1; i >= 0; i--) {
            var styleSheet = contentDocument.styleSheets[i];
            for (var j = styleSheet.cssRules.length - 1; j >= 0; j--) {
                // Skip any none-style rule, i.e. @page
                var cssRule = styleSheet.cssRules[j];
                if (cssRule.type != CSSRule.STYLE_RULE) {
                    continue;
                }
                // Make sure the selector is not empty
                var styleRule = cssRule;
                var selectors = styleRule.selectorText ? styleRule.selectorText.split(',') : null;
                if (selectors == null || selectors.length == 0) {
                    continue;
                }
                // Loop through and apply selector one after one
                for (var k = 0; k < selectors.length; k++) {
                    var selector = selectors[k] ? selectors[k].trim() : null;
                    if (selector && !selector.match(PSEUDOSELECTOR_REGEX)) {
                        var elements = contentDocument.body.querySelectorAll(selector);
                        for (var l = 0; l < elements.length; l++) {
                            var element = elements[l];
                            // Always put existing styles after so that they have higher priority
                            // Which means if both global style and inline style apply to the same element,
                            // inline style will have higher priority
                            element.style.cssText = styleRule.style.cssText + element.style.cssText;
                        }
                    }
                }
            }
        }
        // Remove <style> tags in body if any
        forEachElementInQueryResult(contentDocument, STYLE_TAG_FILTER, function (element) {
            element.parentNode.removeChild(element);
        });
        result = contentDocument.body.innerHTML.trim();
    });
    if (!succeeded) {
        result = convertThroughRegEx(sourceHtml);
    }
    return result;
}
exports.default = convertInlineCss;
//# sourceMappingURL=convertInlineCss.js.map

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(13);
var TextInlineElement_1 = __webpack_require__(22);
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
//# sourceMappingURL=isTextualInlineElement.js.map

/***/ }),
/* 59 */
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
//# sourceMappingURL=matchWhiteSpaces.js.map

/***/ }),
/* 60 */
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
//# sourceMappingURL=unwrap.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fromHtml_1 = __webpack_require__(21);
// Wrap all the node with html and return the wrapped node
// All nodes should be under same parent
function wrapAll(nodes, htmlFragment) {
    if (!nodes || nodes.length == 0) {
        return null;
    }
    var parentNode = nodes[0].parentNode;
    var wrapper = parentNode;
    if (htmlFragment) {
        wrapper = fromHtml_1.default(htmlFragment)[0];
        if (parentNode) {
            parentNode.insertBefore(wrapper, nodes[0]);
        }
        for (var i = 0; i < nodes.length; i++) {
            if (parentNode) {
                parentNode.removeChild(nodes[i]);
            }
            wrapper.appendChild(nodes[i]);
        }
    }
    return wrapper;
}
exports.default = wrapAll;
//# sourceMappingURL=wrapAll.js.map

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Undo_1 = __webpack_require__(40);
var applyInlineStyle_1 = __webpack_require__(66);
var BrowserData_1 = __webpack_require__(24);
var getCursorRect_1 = __webpack_require__(67);
var isVoidHtmlElement_1 = __webpack_require__(41);
var selection_1 = __webpack_require__(16);
var roosterjs_editor_dom_1 = __webpack_require__(1);
var insertNode_1 = __webpack_require__(68);
var HTML_EMPTY_DIV = '<div></div>';
var HTML_EMPTY_DIV_BLOCK = '<div><br></div>';
var Editor = /** @class */ (function () {
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    function Editor(contentDiv, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.contentDiv = contentDiv;
        this.inlineElementFactory = new roosterjs_editor_dom_1.InlineElementFactory();
        this.onBlur = function () {
            // For browsers that do not support beforedeactivate, still do the saving selection in onBlur
            // Also check if there's already a selection range cache because in Chrome onBlur can be triggered multiple times when user clicks to other places,
            // in that case the second time when fetching the selection range may result in a wrong selection.
            if (!_this.isBeforeDeactivateEventSupported && !_this.cachedSelectionRange) {
                _this.saveSelectionRange();
            }
        };
        this.onBeforeDeactivate = function () {
            // this should fire up only for edge and IE
            if (!_this.cachedSelectionRange) {
                _this.saveSelectionRange();
            }
        };
        this.onKeyPress = function (event) {
            // Check if user is typing right under the content div
            // When typing goes directly under content div, many things can go wrong
            // We fix it by wrapping it with a div and reposition cursor within the div
            // TODO: we only fix the case when selection is collapsed
            // When selection is not collapsed, i.e. users press ctrl+A, and then type
            // We don't have a good way to fix that for the moment
            var selectionRange = _this.getSelectionRange();
            var focusNode;
            if (selectionRange &&
                selectionRange.collapsed &&
                (focusNode = selectionRange.startContainer) &&
                (focusNode == _this.contentDiv ||
                    (focusNode.nodeType == 3 /* Text */ && focusNode.parentNode == _this.contentDiv))) {
                var editorSelection = new roosterjs_editor_dom_1.EditorSelection(_this.contentDiv, selectionRange, _this.inlineElementFactory);
                var blockElement = editorSelection.startBlockElement;
                if (!blockElement) {
                    // Only reason we don't get the selection block is that we have an empty content div
                    // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
                    // The fix is to add a DIV wrapping, apply default format and move cursor over
                    var nodes = roosterjs_editor_dom_1.fromHtml(HTML_EMPTY_DIV_BLOCK);
                    var element = _this.contentDiv.appendChild(nodes[0]);
                    _this.applyDefaultFormatToElement(element);
                    // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
                    _this.updateSelectionToEditorPoint({
                        containerNode: element.firstChild,
                        offset: 0 /* Begin */,
                    });
                }
                else if (blockElement.getStartNode().parentNode == blockElement.getEndNode().parentNode) {
                    // Only fix the balanced start-end block where start and end node is under same parent
                    // The focus node could be pointing to the content div, normalize it to have it point to a child first
                    var focusOffset = selectionRange.startOffset;
                    var editorPoint = roosterjs_editor_dom_1.normalizeEditorPoint(focusNode, focusOffset);
                    var element = roosterjs_editor_dom_1.wrapAll(blockElement.getContentNodes(), HTML_EMPTY_DIV);
                    if (roosterjs_editor_dom_1.getTagOfNode(blockElement.getStartNode()) == 'BR') {
                        // if the block is just BR, apply default format
                        // Otherwise, leave it as it is as we don't want to change the style for existing data
                        _this.applyDefaultFormatToElement(element);
                    }
                    // Last restore the selection using the normalized editor point
                    _this.updateSelectionToEditorPoint(editorPoint);
                }
            }
            _this.dispatchDomEventToPlugin(1 /* KeyPress */, event);
        };
        this.onKeyDown = function (event) {
            _this.dispatchDomEventToPlugin(0 /* KeyDown */, event);
        };
        this.onKeyUp = function (event) {
            _this.dispatchDomEventToPlugin(2 /* KeyUp */, event);
        };
        this.onCompositionStart = function (event) {
            _this.isInIMESequence = true;
        };
        this.onCompositionEnd = function (event) {
            _this.isInIMESequence = false;
            _this.dispatchDomEventToPlugin(3 /* CompositionEnd */, event);
        };
        this.onMouseUp = function (event) {
            _this.dispatchDomEventToPlugin(4 /* MouseUp */, event);
        };
        this.onMouseOver = function (event) {
            _this.dispatchDomEventToPlugin(6 /* MouseOver */, event);
        };
        this.onMouseOut = function (event) {
            _this.dispatchDomEventToPlugin(7 /* MouseOut */, event);
        };
        this.onPaste = function (event) {
            _this.dispatchDomEventToPlugin(8 /* Paste */, event);
        };
        this.onCopy = function (event) {
            _this.dispatchDomEventToPlugin(9 /* Copy */, event);
        };
        this.onFocus = function () {
            // Restore the last saved selection first
            if (_this.cachedSelectionRange) {
                _this.restoreLastSavedSelection();
            }
            _this.cachedSelectionRange = null;
        };
        // 1. Make sure all parameters are valid
        if (!contentDiv ||
            !(contentDiv instanceof HTMLDivElement) ||
            contentDiv.tagName.toUpperCase() != 'DIV') {
            throw new Error('contentDiv must be an HTML DIV element');
        }
        // 2. Store options values to local variables
        this.defaultFormat = options.defaultFormat;
        this.plugins = options.plugins || [];
        // 3. Initialize plugins
        this.initializePlugins();
        // 4. Ensure initial content and its format
        this.ensureInitialContent(options.initialContent);
        // 5. Initialize undo service
        // This need to be after step 4 so that undo service can pickup initial content
        this.undoService = options.undo || new Undo_1.default();
        this.undoService.initialize(this);
        this.plugins.push(this.undoService);
        // 6. Finally make the container editalbe, set its selection styles and bind events
        this.contentDiv.setAttribute('contenteditable', 'true');
        var styles = this.contentDiv.style;
        styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = 'text';
        this.bindEvents();
    }
    Editor.prototype.dispose = function () {
        this.disposePlugins();
        this.unbindEvents();
    };
    Editor.prototype.getSelectionRange = function () {
        // When we have the focus, we should try to do a live pull on the selection.
        // Otherwise, return whatever we have in cache.
        var selectionRange = this.hasFocus() ? selection_1.tryGetSelectionRange(this.contentDiv) : null;
        return selectionRange || this.cachedSelectionRange;
    };
    Editor.prototype.getDocument = function () {
        return this.contentDiv.ownerDocument;
    };
    Editor.prototype.getSelection = function () {
        return selection_1.getSelection(this.getDocument());
    };
    Editor.prototype.hasFocus = function () {
        var activeElement = this.getDocument().activeElement;
        return activeElement && (this.contentDiv == activeElement || this.contains(activeElement));
    };
    Editor.prototype.focus = function (resetCursor) {
        if (resetCursor === void 0) { resetCursor = false; }
        // This is more than just focus. What we want to achieve here are:
        // - focus is moved to editor
        // - the selection was restored to where it was before
        // - no unexpected scroll
        // The browser HTMLElement.focus() has some unexpected side effects which we cannot directly use, i.e.
        // - it always reset selection to begin
        // - can cause a reposition of cursor to re-align it in view port (unexpected scroll) when editor is not entirely in view port
        // We use the selection API to change selection to point within editor which has same effects of moving focus to editor without
        // those side effects of browser focus().
        if (resetCursor) {
            // If resetCursor is requested, just set selection to beginning of content
            this.setSelectionToBegin();
        }
        else if (!this.hasFocus() || !selection_1.tryGetSelectionRange(this.contentDiv)) {
            // Focus (document.activeElement indicates) and selection are mostly in sync, but could be out of sync in some extreme cases.
            // i.e. if you programmatically change window selection to point to a non-focusable DOM element (i.e. tabindex=-1 etc.).
            // On Chrome/Firefox, it does not change document.activeElement. On Edge/IE, it change document.activeElement to be body
            // Although on Chrome/Firefox, document.activeElement points to editor, you cannot really type which we don't want (no cursor).
            // So here we always does a live selection pull on DOM and make it point in Editor. The pitfall is, the cursor could be reset
            // to very begin to of editor since we don't really have last saved selection (created on blur which does not fire in this case).
            // It should be better than the case you cannot type
            if (!this.restoreLastSavedSelection()) {
                this.setSelectionToBegin();
            }
        }
        // remember to clear cachedSelectionRange
        this.cachedSelectionRange = null;
        // This is more a fallback to ensure editor gets focus if it didn't manage to move focus to editor
        if (!this.hasFocus()) {
            // TODO: should we add a try-catch?
            this.contentDiv.focus();
        }
    };
    // Apply inline style to current selection
    Editor.prototype.applyInlineStyle = function (styler) {
        this.focus();
        applyInlineStyle_1.default(this.contentDiv, this.getContentTraverser(1 /* Selection */), styler);
    };
    Editor.prototype.undo = function () {
        this.focus();
        this.undoService.undo();
    };
    Editor.prototype.redo = function () {
        this.focus();
        this.undoService.redo();
    };
    Editor.prototype.runWithoutAddingUndoSnapshot = function (callback) {
        try {
            this.suspendAddingUndoSnapshot = true;
            callback();
        }
        finally {
            this.suspendAddingUndoSnapshot = false;
        }
    };
    Editor.prototype.addUndoSnapshot = function () {
        if (this.undoService &&
            this.undoService.addUndoSnapshot &&
            !this.suspendAddingUndoSnapshot) {
            this.undoService.addUndoSnapshot();
        }
    };
    Editor.prototype.canUndo = function () {
        return this.undoService
            ? this.undoService.canUndo ? this.undoService.canUndo() : true
            : false;
    };
    Editor.prototype.canRedo = function () {
        return this.undoService
            ? this.undoService.canRedo ? this.undoService.canRedo() : true
            : false;
    };
    Editor.prototype.getContent = function (triggerExtractContentEvent) {
        if (triggerExtractContentEvent === void 0) { triggerExtractContentEvent = true; }
        var content = this.contentDiv.innerHTML;
        if (triggerExtractContentEvent) {
            var extractContentEvent = {
                eventType: 10 /* ExtractContent */,
                content: content,
            };
            this.triggerEvent(extractContentEvent, true /*broadcast*/);
            content = extractContentEvent.content;
        }
        return content;
    };
    Editor.prototype.setContent = function (content) {
        this.contentDiv.innerHTML = content || '';
        this.ensureInitialContent();
        this.triggerEvent({
            eventType: 5 /* ContentChanged */,
            source: 'SetContent',
        }, true /* broadcast */);
    };
    // Insert content into editor
    Editor.prototype.insertContent = function (content, option) {
        if (content) {
            var allNodes = roosterjs_editor_dom_1.fromHtml(content);
            // If it is to insert on new line, and there are more than one node in the collection, wrap all nodes with
            // a parent DIV before calling insertNode on each top level sub node. Otherwise, every sub node may get wrapped
            // separately to show up on its own line
            if (option.insertOnNewLine && allNodes.length > 0) {
                allNodes = [roosterjs_editor_dom_1.wrapAll(allNodes, HTML_EMPTY_DIV)];
            }
            for (var i = 0; i < allNodes.length; i++) {
                this.insertNode(allNodes[i], option);
            }
        }
    };
    // Insert node into editor
    Editor.prototype.insertNode = function (node, option) {
        if (!node) {
            return false;
        }
        // For any change to editor, it's better to first bring focus into editor
        // Editor maintains a cached selection range when focus is not in editor
        // DOM change could change "real" selection which may invalidate the cached selection
        this.focus();
        switch (option.position) {
            case 0 /* Begin */:
                insertNode_1.insertNodeAtBegin(this.contentDiv, this.inlineElementFactory, node, option);
                break;
            case 1 /* End */:
                insertNode_1.insertNodeAtEnd(this.contentDiv, this.inlineElementFactory, node, option);
                break;
            case 2 /* SelectionStart */:
                insertNode_1.insertNodeAtSelection(this.contentDiv, this.inlineElementFactory, this.getSelectionRange(), node, option);
                break;
        }
        return true;
    };
    // Delete a node
    Editor.prototype.deleteNode = function (node) {
        // Only remove the node when it falls within editor
        if (node && this.contains(node)) {
            this.focus();
            node.parentNode.removeChild(node);
            return true;
        }
        return false;
    };
    // Replace a node with another node
    Editor.prototype.replaceNode = function (existingNode, toNode) {
        // Only replace the node when it falls within editor
        if (existingNode && toNode && this.contains(existingNode)) {
            this.focus();
            existingNode.parentNode.replaceChild(toNode, existingNode);
            return true;
        }
        return false;
    };
    Editor.prototype.getInlineElementAtNode = function (node) {
        return roosterjs_editor_dom_1.getInlineElementAtNode(this.contentDiv, node, this.inlineElementFactory);
    };
    // Trigger an event to be dispatched to all plugins
    // broadcast indicates if the event needs to be dispatched to all plugins
    // true means to all, false means to allow exclusive handling from one plugin unless no one wants that
    Editor.prototype.triggerEvent = function (pluginEvent, broadcast) {
        if (broadcast === void 0) { broadcast = true; }
        var isHandledExclusively = false;
        if (!broadcast) {
            for (var i = 0; i < this.plugins.length; i++) {
                var plugin = this.plugins[i];
                if (plugin.willHandleEventExclusively &&
                    plugin.onPluginEvent &&
                    plugin.willHandleEventExclusively(pluginEvent)) {
                    plugin.onPluginEvent(pluginEvent);
                    isHandledExclusively = true;
                    break;
                }
            }
        }
        if (!isHandledExclusively) {
            this.plugins.forEach(function (plugin) {
                if (plugin.onPluginEvent) {
                    plugin.onPluginEvent(pluginEvent);
                }
            });
        }
    };
    // Get a content traverser that can be used to travse content within editor
    Editor.prototype.getContentTraverser = function (scope, position) {
        if (position === void 0) { position = 2 /* SelectionStart */; }
        // TODO: so far we only provides three scopers
        // 1) SelectionBlockScoper is a block based scoper that restrict traversing within the block where the selection is
        //    it allows traversing from start, end or selection start position
        //    this is commonly used to parse content from cursor as user type up to the begin or end of block
        // 2) SelectionScoper restricts traversing within the selection. It is commonly used for applying style to selection
        // 3) BodyScoper will traverse the entire editor body from the beginning (ignoring the passed in position parameter)
        // When more scopers are needed, this needs to be modified
        var selectionRange = this.getSelectionRange();
        if (scope != 2 /* Body */ && !selectionRange) {
            return null;
        }
        var contentTraverser;
        var scoper;
        switch (scope) {
            case 0 /* Block */:
                scoper = new roosterjs_editor_dom_1.SelectionBlockScoper(this.contentDiv, selectionRange, position, this.inlineElementFactory);
                break;
            case 1 /* Selection */:
                scoper = new roosterjs_editor_dom_1.SelectionScoper(this.contentDiv, selectionRange, this.inlineElementFactory);
                break;
            case 2 /* Body */:
                scoper = new roosterjs_editor_dom_1.BodyScoper(this.contentDiv, this.inlineElementFactory);
                break;
        }
        if (scoper) {
            contentTraverser = new roosterjs_editor_dom_1.ContentTraverser(this.contentDiv, scoper, this.inlineElementFactory);
        }
        return contentTraverser;
    };
    // Update selection in editor
    Editor.prototype.updateSelection = function (selectionRange) {
        var selectionUpdated = false;
        if (selection_1.isRangeInContainer(selectionRange, this.contentDiv)) {
            var selectionUpdated_1 = selection_1.updateSelectionToRange(this.getDocument(), selectionRange);
            // When the selection is updated when editor does not have the focus, also update the cached selection range
            if (selectionUpdated_1 && !this.hasFocus()) {
                this.cachedSelectionRange = selectionRange;
            }
            selectionUpdated_1 = true;
        }
        return selectionUpdated;
    };
    // DOM query content in editor
    Editor.prototype.queryContent = function (selector) {
        return this.contentDiv.querySelectorAll(selector);
    };
    // Check if editor is in IME input sequence
    Editor.prototype.isInIME = function () {
        return this.isInIMESequence;
    };
    // Check if the node falls in the contentDiv
    Editor.prototype.contains = function (node) {
        return node && roosterjs_editor_dom_1.contains(this.contentDiv, node);
    };
    // Save the current selection in editor
    Editor.prototype.saveSelectionRange = function () {
        var range = selection_1.tryGetSelectionRange(this.contentDiv);
        if (range) {
            this.cachedSelectionRange = range;
        }
    };
    // Get a rect representing the location of the cursor.
    Editor.prototype.getCursorRect = function () {
        return getCursorRect_1.default(this.contentDiv);
    };
    Editor.prototype.bindEvents = function () {
        this.isBeforeDeactivateEventSupported = BrowserData_1.default.isIE || BrowserData_1.default.isEdge;
        this.contentDiv.addEventListener('keypress', this.onKeyPress);
        this.contentDiv.addEventListener('keydown', this.onKeyDown);
        this.contentDiv.addEventListener('keyup', this.onKeyUp);
        this.contentDiv.addEventListener('mouseup', this.onMouseUp);
        this.contentDiv.addEventListener('compositionstart', this.onCompositionStart);
        this.contentDiv.addEventListener('compositionend', this.onCompositionEnd);
        this.contentDiv.addEventListener('blur', this.onBlur);
        this.contentDiv.addEventListener('focus', this.onFocus);
        this.contentDiv.addEventListener('mouseover', this.onMouseOver);
        this.contentDiv.addEventListener('mouseout', this.onMouseOut);
        this.contentDiv.addEventListener('paste', this.onPaste);
        this.contentDiv.addEventListener('copy', this.onCopy);
        // we do saving selection when editor loses focus, which normally can be done in onBlur event
        // Edge and IE, however attempting to save selection from onBlur is too late
        // There is an Edge and IE only beforedeactivate event where we can save selection
        if (this.isBeforeDeactivateEventSupported) {
            this.contentDiv.addEventListener('beforedeactivate', this.onBeforeDeactivate);
        }
    };
    Editor.prototype.unbindEvents = function () {
        this.contentDiv.removeEventListener('keypress', this.onKeyPress);
        this.contentDiv.removeEventListener('keydown', this.onKeyDown);
        this.contentDiv.removeEventListener('keyup', this.onKeyUp);
        this.contentDiv.removeEventListener('mouseup', this.onMouseUp);
        this.contentDiv.removeEventListener('compositionstart', this.onCompositionStart);
        this.contentDiv.removeEventListener('compositionend', this.onCompositionEnd);
        this.contentDiv.removeEventListener('blur', this.onBlur);
        this.contentDiv.removeEventListener('focus', this.onFocus);
        this.contentDiv.removeEventListener('mouseover', this.onMouseOver);
        this.contentDiv.removeEventListener('mouseout', this.onMouseOut);
        this.contentDiv.removeEventListener('paste', this.onPaste);
        this.contentDiv.removeEventListener('copy', this.onCopy);
        if (this.isBeforeDeactivateEventSupported) {
            this.contentDiv.removeEventListener('beforedeactivate', this.onBeforeDeactivate);
        }
    };
    Editor.prototype.initializePlugins = function () {
        var _this = this;
        this.plugins.forEach(function (plugin) {
            if (!plugin) {
                throw new Error('options.plugins must not contain null plugin');
            }
            plugin.initialize(_this);
        });
    };
    Editor.prototype.disposePlugins = function () {
        this.plugins.forEach(function (plugin) {
            plugin.dispose();
        });
    };
    // Dispatch DOM event to plugin
    Editor.prototype.dispatchDomEventToPlugin = function (eventType, rawEvent) {
        var pluginEvent = {
            eventType: eventType,
            rawEvent: rawEvent,
        };
        this.triggerEvent(pluginEvent, false /*broadcast*/);
    };
    // Ensure initial content exist in editor
    Editor.prototype.ensureInitialContent = function (initialContent) {
        // Use the initial content to overwrite any existing content if specified
        if (initialContent) {
            this.setContent(initialContent);
        }
        var firstBlock = roosterjs_editor_dom_1.getFirstBlockElement(this.contentDiv, this.inlineElementFactory);
        var defaultFormatBlockElement;
        if (!firstBlock) {
            // No first block, let's create one
            var nodes = roosterjs_editor_dom_1.fromHtml(HTML_EMPTY_DIV_BLOCK);
            defaultFormatBlockElement = this.contentDiv.appendChild(nodes[0]);
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
            this.applyDefaultFormatToElement(defaultFormatBlockElement);
        }
    };
    // Apply default format to element
    Editor.prototype.applyDefaultFormatToElement = function (element) {
        if (this.defaultFormat) {
            var elementStyle = element.style;
            if (this.defaultFormat.fontFamily) {
                elementStyle.fontFamily = this.defaultFormat.fontFamily;
            }
            if (this.defaultFormat.fontSize) {
                elementStyle.fontSize = this.defaultFormat.fontSize;
            }
            if (this.defaultFormat.textColor) {
                elementStyle.color = this.defaultFormat.textColor;
            }
            if (this.defaultFormat.bold) {
                elementStyle.fontWeight = 'bold';
            }
            if (this.defaultFormat.italic) {
                elementStyle.fontStyle = 'italic';
            }
            if (this.defaultFormat.underline) {
                elementStyle.textDecoration = 'underline';
            }
        }
    };
    Editor.prototype.setSelectionToBegin = function () {
        var selectionUpdated = false;
        var range;
        var firstNode = roosterjs_editor_dom_1.getFirstLeafNode(this.contentDiv);
        if (firstNode) {
            if (firstNode.nodeType == 3 /* Text */) {
                // First node is text, move range to the begin
                range = this.getDocument().createRange();
                range.setStart(firstNode, 0);
            }
            else if (firstNode.nodeType == 1 /* Element */) {
                if (isVoidHtmlElement_1.default(firstNode)) {
                    // First node is a html void element (void elements cannot have child nodes), move range before it
                    range = this.getDocument().createRange();
                    range.setStartBefore(firstNode);
                }
                else {
                    // Other html element, move range inside it
                    range = this.getDocument().createRange();
                    range.setStart(firstNode, 0);
                }
            }
        }
        else {
            // No first node, likely we have an empty content DIV, move range inside it
            range = this.getDocument().createRange();
            range.setStart(this.contentDiv, 0);
        }
        if (range) {
            selectionUpdated = selection_1.updateSelectionToRange(this.getDocument(), range);
        }
        return selectionUpdated;
    };
    // Update selection to an editor point
    Editor.prototype.updateSelectionToEditorPoint = function (editorPoint) {
        if (!editorPoint.containerNode || !this.contains(editorPoint.containerNode)) {
            return false;
        }
        var range = this.getDocument().createRange();
        if (editorPoint.containerNode.nodeType == 3 /* Text */ &&
            editorPoint.offset < editorPoint.containerNode.nodeValue.length) {
            range.setStart(editorPoint.containerNode, editorPoint.offset);
        }
        else {
            if (editorPoint.offset == 0 /* Begin */) {
                range.setStartBefore(editorPoint.containerNode);
            }
            else {
                range.setStartAfter(editorPoint.containerNode);
            }
        }
        range.collapse(true /* toStart */);
        return selection_1.updateSelectionToRange(this.getDocument(), range);
    };
    Editor.prototype.restoreLastSavedSelection = function () {
        var selectionRestored = false;
        if (this.cachedSelectionRange) {
            selectionRestored = selection_1.updateSelectionToRange(this.getDocument(), this.cachedSelectionRange);
        }
        return selectionRestored;
    };
    return Editor;
}());
exports.default = Editor;
//# sourceMappingURL=Editor.js.map

/***/ }),
/* 63 */
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
//# sourceMappingURL=UndoSnapshots.js.map

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Check if the node contains image
function containsImage(node) {
    if (node) {
        var container = node;
        if (container.querySelector) {
            var image = container.querySelector('img');
            if (image) {
                return true;
            }
        }
    }
    return false;
}
exports.default = containsImage;
//# sourceMappingURL=containsImage.js.map

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BrowserData_1 = __webpack_require__(24);
var roosterjs_editor_dom_1 = __webpack_require__(1);
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
// Remove an element from editor by Id
function removeCursorMarkerById(editor, id) {
    var nodes = getCursorMarkNodes(editor, id);
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }
    }
}
// Get an element by unique id. If there is more than one element by the id, it should return null
function getCursorMarkerByUniqueId(editor, id) {
    var nodes = getCursorMarkNodes(editor, id);
    return nodes && nodes.length == 1 ? nodes[0] : null;
}
function getCursorMarkNodes(editor, id) {
    return editor.queryContent("span[id=\"" + id + "\"]:empty");
}
// Create a cursor marker by id
function createCursorMarker(editor, id) {
    var editorDocument = editor.getDocument();
    var cursorMarker = editorDocument.createElement('SPAN');
    cursorMarker.id = id;
    return cursorMarker;
}
//# sourceMappingURL=snapshotUtils.js.map

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = __webpack_require__(16);
var ZERO_WIDTH_SPACE = '&#8203;';
// Apply inline style to collapsed selection
// Use case is that users do not select anything, and then choose a style first (i.e. a font name), and then type and expect text to have the style
// The problem here is that there isn't a concrete DOM element to apply the style
// The workaround is to create a SPAN and have the style applied on the SPAN, and then re-position cursor within the SPAN where typing can happen
// TODO: what if user position this in an inlne element, i.e. hashtag, creating a span within an existing inline element may not be a good idea
function applyInlineStyleToCollapsedSelection(currentDocument, selectionRange, styler) {
    // let's just be simple to create a new span to hold the style
    // TODO: maybe we should be a bit smarter to see if we're in a span, and apply the style in parent span
    var element = currentDocument.createElement('SPAN');
    // Some content is needed to position selection into the span
    // for here, we inject ZWS - zero width space
    element.innerHTML = ZERO_WIDTH_SPACE;
    styler(element);
    selectionRange.insertNode(element);
    // reset selection to be after the ZWS (rather than selecting it)
    // This is needed so that the cursor still looks blinking inside editor
    // This also means an extra ZWS will be in editor
    // TODO: somewhere in returning content to consumer, we may need to do a cleanup for ZWS
    var updatedRange = currentDocument.createRange();
    updatedRange.selectNodeContents(element);
    updatedRange.collapse(false /* toStart */);
    selection_1.updateSelectionToRange(currentDocument, updatedRange);
}
// Apply style to non collapsed selection
// It does that by looping through all inline element that can be found in the selection
// and apply style on each individual inline element
function applyInlineStyleToNonCollapsedSelection(currentDocument, contentTraverser, selectionRange, styler) {
    // This is start and end node that get the style. The start and end needs to be recorded so that selection
    // can be re-applied post-applying style
    var startNode;
    var endNode;
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
        var updatedRange = currentDocument.createRange();
        updatedRange.setStartBefore(startNode);
        updatedRange.setEndAfter(endNode);
        selection_1.updateSelectionToRange(currentDocument, updatedRange);
    }
}
// Apply inline style to current selection
function applyInlineStyle(container, contentTraverser, styler) {
    var currentDocument = container.ownerDocument;
    var selectionRange = selection_1.tryGetSelectionRange(container);
    if (selectionRange) {
        // TODO: Chrome has a bug that when the selection spans over several empty text nodes,
        // it may incorrectly report range not to be collapsed.
        // We may do a browser check to force it to go collapsed code path when we see an empty range
        // UserAgent.GetInstance().IsBrowserChrome && range.toString() == _String.Empty
        if (selectionRange.collapsed) {
            applyInlineStyleToCollapsedSelection(currentDocument, selectionRange, styler);
        }
        else {
            applyInlineStyleToNonCollapsedSelection(currentDocument, contentTraverser, selectionRange, styler);
        }
    }
}
exports.default = applyInlineStyle;
//# sourceMappingURL=applyInlineStyle.js.map

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(1);
var selection_1 = __webpack_require__(16);
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
// Returns a rect representing the location of the cursor.
// In case there is a uncollapsed selection witin editor, this returns
// the position for focus node.
// The returned rect structure has a left and right and they should be same
// here since it is for cursor, not for a range.
function getCursorRect(container) {
    var document = container.ownerDocument;
    var range = selection_1.tryGetSelectionRange(container);
    if (!range) {
        // Obtaining cursor position requires a selection range.
        // When there is no selection range, we have nothing to do but to return.
        return null;
    }
    // There isn't a browser API that gets you position of cursor.
    // Different browsers emit slightly different behaviours and there is no a single API that
    // can help achieve the goal across all browsers. At high level, we try to achieve the goal
    // by below approach:
    // 1) first, obtain a collapsed range pointing to cursor
    // 2) try to get rect using range.getBoundingClientRect()
    // 3）fallback to a nearby range.getBoundingClientRect()
    // 4) fallback range.getClientRects()
    // 5) lastly fallback range.startContainer.getBoundingClientRect()
    // 1) obtain a collapsed range pointing to cursor
    if (!range.collapsed) {
        // Range is not collapsed, collapse to cursor first
        var selection = selection_1.getSelection(document);
        if (selection && selection.focusNode && selection.anchorNode) {
            var forwardSelection = selection.focusNode == selection.anchorNode
                ? selection.focusOffset > selection.anchorOffset
                : roosterjs_editor_dom_1.isDocumentPosition(selection.anchorNode.compareDocumentPosition(selection.focusNode), 4 /* Following */);
            range = range.cloneRange();
            range.collapse(!forwardSelection /*toStart*/);
        }
    }
    // 2) try to get rect using range.getBoundingClientRect()
    var rect = getRectFromClientRect(range.getBoundingClientRect());
    // 3）fallback to a nearby range.getBoundingClientRect()
    if (!rect) {
        // This is often the case the cursor runs in middle of two nodes.
        // i.e. <p>{cursor}<br></p>, or <p><img ...>{cursor}text</p>.
        // range.getBoundingClientRect mostly return a client rect of all 0
        // Skip this if we're in middle of a text node
        var editorPoint = roosterjs_editor_dom_1.normalizeEditorPoint(range.startContainer, range.startOffset);
        if (editorPoint.containerNode.nodeType != 3 /* Text */ ||
            editorPoint.containerNode.nodeValue.length == editorPoint.offset) {
            var nearbyRange = document.createRange();
            nearbyRange.selectNode(editorPoint.containerNode);
            rect = getRectFromClientRect(nearbyRange.getBoundingClientRect());
            if (rect) {
                // Fix the position to boundary of the nearby range
                rect.left = rect.right =
                    editorPoint.offset == 0 /* Begin */ ? rect.left : rect.right;
            }
        }
    }
    // 4) fallback range.getClientRects()
    if (!rect) {
        // This is often the case Safari when cursor runs in middle of text node
        // range.getBoundingClientRect() returns a all 0 client rect.
        // range.getClientRects() returns a good client rect
        var clientRects = range.getClientRects();
        if (clientRects && clientRects.length == 1) {
            rect = getRectFromClientRect(clientRects[0]);
        }
    }
    // 5) lastly fallback range.startContainer.getBoundingClientRect()
    if (!rect && range.startContainer instanceof Element) {
        rect = getRectFromClientRect(range.startContainer.getBoundingClientRect());
    }
    return rect;
}
exports.default = getCursorRect;
//# sourceMappingURL=getCursorRect.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isVoidHtmlElement_1 = __webpack_require__(41);
var roosterjs_editor_dom_1 = __webpack_require__(1);
var selection_1 = __webpack_require__(16);
var HTML_EMPTY_DIV = '<div></div>';
// Insert a node at begin of the editor
function insertNodeAtBegin(container, inlineElementFactory, node, option) {
    var firstBlock = roosterjs_editor_dom_1.getFirstBlockElement(container, inlineElementFactory);
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
        insertedNode = container.appendChild(node);
    }
    // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
    // add a DIV wrapping
    if (insertedNode && option.insertOnNewLine && !roosterjs_editor_dom_1.isBlockElement(insertedNode)) {
        roosterjs_editor_dom_1.wrap(insertedNode, HTML_EMPTY_DIV);
    }
}
exports.insertNodeAtBegin = insertNodeAtBegin;
// Insert a node at end of the editor
function insertNodeAtEnd(container, inlineElementFactory, node, option) {
    var lastBlock = roosterjs_editor_dom_1.getLastBlockElement(container, inlineElementFactory);
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
        insertedNode = container.appendChild(node);
    }
    // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
    // add a DIV wrapping
    if (insertedNode && option.insertOnNewLine && !roosterjs_editor_dom_1.isBlockElement(insertedNode)) {
        roosterjs_editor_dom_1.wrap(insertedNode, HTML_EMPTY_DIV);
    }
}
exports.insertNodeAtEnd = insertNodeAtEnd;
// Insert node at selection
function insertNodeAtSelection(container, inlineElementFactory, selectionRange, node, option) {
    if (selectionRange) {
        // if to replace the selection and the selection is not collapsed, remove the the content at selection first
        if (option.replaceSelection && !selectionRange.collapsed) {
            selectionRange.deleteContents();
        }
        // Create a clone (backup) for the selection first as we may need to restore to it later
        var originalSelectionRange = selectionRange.cloneRange();
        // Adjust the insertion point
        // option.insertOnNewLine means to insert on a block after the selection, not really right at the selection
        // This is commonly used when users want to insert signature. They could place cursor somewhere mid of a line
        // and insert signature, they actually want signature to be inserted the line after the selection
        if (option.insertOnNewLine) {
            var editorSelection = new roosterjs_editor_dom_1.EditorSelection(container, selectionRange, inlineElementFactory);
            var blockElement = editorSelection.startBlockElement;
            selectionRange.setEndAfter(blockElement.getEndNode());
            selectionRange.collapse(false /*toStart*/);
        }
        selectionRange.insertNode(node);
        if (option.updateCursor) {
            selectionRange.setEndAfter(node);
            selectionRange.collapse(false /*toStart*/);
            selection_1.updateSelectionToRange(container.ownerDocument, selectionRange);
        }
        else {
            selection_1.updateSelectionToRange(container.ownerDocument, originalSelectionRange);
        }
    }
}
exports.insertNodeAtSelection = insertNodeAtSelection;
//# sourceMappingURL=insertNode.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// cache some certain data in event cache by key
function cacheEventData(event, cacheKey, eventData) {
    if (event) {
        if (!event.eventDataCache) {
            event.eventDataCache = {};
        }
        event.eventDataCache[cacheKey] = eventData;
    }
}
exports.cacheEventData = cacheEventData;
// Get cached event data (as specified by key) or null if not found
function getEventDataCache(event, key) {
    var eventData = null;
    if (event && event.eventDataCache && event.eventDataCache[key]) {
        eventData = event.eventDataCache[key];
    }
    return eventData;
}
exports.getEventDataCache = getEventDataCache;
// Clear a specifc cached data (as specified by a key) in a plugin event
function clearEventDataCache(event, key) {
    if (event && event.eventDataCache && event.eventDataCache[key]) {
        event.eventDataCache[key] = null;
    }
}
exports.clearEventDataCache = clearEventDataCache;
// Return the cached event data per cache key if there is already one.
// If not, create one and put it in event data cache
function cacheGetEventData(event, cacheKey, eventDataBuilder) {
    var eventData = getEventDataCache(event, cacheKey);
    if (!eventData) {
        eventData = eventDataBuilder();
        cacheEventData(event, cacheKey, eventData);
    }
    return eventData;
}
exports.cacheGetEventData = cacheGetEventData;
//# sourceMappingURL=eventDataCacheUtils.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CursorData_1 = __webpack_require__(11);
var replaceRangeWithNode_1 = __webpack_require__(42);
/// Validate the text matches what's before the cursor, and return the range for it
function validateAndGetRangeForTextBeforeCursor(editor, text, exactMatch, cursorData) {
    if (cursorData === void 0) { cursorData = null; }
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
    cursor.getTextSectionBeforeCursorTill(function (textSection) {
        var textInline = textSection.inlineElement;
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
// Replace text before cursor with a node
// exactMatch is to match exactly, i.e.
// exactMatch = true case, in Mentions, you type @nick, and then pick a suggestion from picker, we need to replace exactly everything before cursor (@nick)
// with the suggestion from Mentions picker
// exactMatch = false case, in auto linkification, users could type "www.bing.com,<space>". The auto link will kick in on space
// at the moment, what is before cursor is "www.bing.com,", however, only "www.bing.com" makes the link. by setting exactMatch = false, it does not match
// right from the end, but can scan through till first same char is seen.
function replaceTextBeforeCursorWithNode(editor, text, node, exactMatch, cursorData) {
    if (cursorData === void 0) { cursorData = null; }
    // Make sure the text and node is valid
    if (!text || text.length == 0 || !node) {
        return false;
    }
    var replaced = false;
    var range = validateAndGetRangeForTextBeforeCursor(editor, text, exactMatch);
    if (range) {
        replaced = replaceRangeWithNode_1.default(editor, range, node, exactMatch);
    }
    return replaced;
}
exports.default = replaceTextBeforeCursorWithNode;
//# sourceMappingURL=replaceTextBeforeCursorWithNode.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
function clearFormat(editor) {
    editor.focus();
    // We have no way if this clear format will really result in any DOM change
    // Let's just do it with undo
    execFormatWithUndo_1.default(editor, function () {
        editor.getDocument().execCommand('removeFormat', false, null);
    });
}
exports.default = clearFormat;
//# sourceMappingURL=clearFormat.js.map

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CursorData_1 = __webpack_require__(11);
var defaultLinkMatchRules_1 = __webpack_require__(45);
var execFormatWithUndo_1 = __webpack_require__(0);
var isSelectionCollapsed_1 = __webpack_require__(3);
var matchLink_1 = __webpack_require__(47);
var roosterjs_editor_dom_1 = __webpack_require__(1);
// Regex matching Uri scheme
var URI_REGEX = /^[a-zA-Z]+:/i;
// Regex matching begin of email address
var MAILTO_REGEX = /^[\w.%+-]+@/i;
// Regex matching begin of ftp, i.e. ftp.microsoft.com
var FTP_REGEX = /^ftp\./i;
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
            prefix = 'http' + '://';
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
 * If there is a selection, this parameter will be ignored.
 * If not specified, will use link instead
 */
function createLink(editor, link, altText, displayText) {
    editor.focus();
    var url = link ? link.trim() : '';
    if (url) {
        var formatter = null;
        var linkData = matchLink_1.default(url, 1 /* Exact */, defaultLinkMatchRules_1.default);
        // matchLink can match most links, but not all, i.e. if you pass link a link as "abc", it won't match
        // we know in that case, users will want to insert a link like http://abc
        // so we have separate logic in applyLinkPrefix to add link prefix depending on the format of the link
        // i.e. if the link starts with something like abc@xxx, we will add mailto: prefix
        // if the link starts with ftp.xxx, we will add ftp:// link. For more, see applyLinkPrefix
        var normalizedUrl_1 = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        var originalUrl = linkData ? linkData.originalUrl : normalizedUrl_1;
        if (isSelectionCollapsed_1.default(editor)) {
            var anchor_1 = editor.getDocument().createElement('A');
            anchor_1.textContent = displayText || originalUrl;
            anchor_1.href = normalizedUrl_1;
            if (altText) {
                anchor_1.setAttribute('alt', altText);
            }
            formatter = function () {
                return editor.insertNode(anchor_1, {
                    position: 2 /* SelectionStart */,
                    updateCursor: true,
                    replaceSelection: true,
                    insertOnNewLine: false,
                });
            };
        }
        else {
            /* the selection is not collapsed, use browser execCommand */
            formatter = function () {
                editor.getDocument().execCommand('createLink', false, normalizedUrl_1);
                // The link is created first, and then we apply altText if user asks
                if (altText) {
                    var cursorData = new CursorData_1.default(editor);
                    // The link remains selected after it is applied. To get the link, need to read
                    // The inline element after cursor since cursor always points to start of selection
                    // There can also be cases that users select text across multiple lines causing mulitple links
                    // to be created (one per line). This means the alttext will only be applied to first link
                    // This is less a case. For simplicity, we just that case for the moment
                    var inlineBeforeCursor = cursorData.inlineElementAfterCursor;
                    if (inlineBeforeCursor && inlineBeforeCursor instanceof roosterjs_editor_dom_1.LinkInlineElement) {
                        inlineBeforeCursor.getContainerNode().setAttribute('alt', altText);
                    }
                }
            };
        }
        if (formatter) {
            execFormatWithUndo_1.default(editor, formatter);
        }
    }
}
exports.default = createLink;
//# sourceMappingURL=createLink.js.map

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getNodeAtCursor_1 = __webpack_require__(17);
var roosterjs_editor_dom_1 = __webpack_require__(1);
var cacheGetListState_1 = __webpack_require__(44);
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
// Get format state
function getFormatState(editor, event) {
    // TODO: ideally format status, together with its formatter (i.e. addImageAltText) in FormatUtils.ts should be moved out of RoosterJS
    // and implemented as an extension API outside RoosterJS. For the moment, let's let it sit here
    var canUnlink = false;
    var canAddImageAltText = false;
    var range = editor.getSelectionRange();
    if (range) {
        if (range.collapsed) {
            // Check if startContainer points at a link
            // No need to check canAddImageAltText as image alt text can be added for non-collapsed selection
            var node = range.startContainer;
            if (node.nodeType == 3 /* Text */) {
                node = node.parentNode;
            }
            var inline = editor.getInlineElementAtNode(node);
            canUnlink = inline && inline instanceof roosterjs_editor_dom_1.LinkInlineElement ? true : false;
        }
        else {
            // Check if selection contains any link or image and set canUnlink and canAddImageAltText correspondingly
            var contentTraverser = editor.getContentTraverser(1 /* Selection */);
            var startInline = contentTraverser.currentInlineElement;
            while (startInline) {
                if (!canUnlink &&
                    (startInline instanceof roosterjs_editor_dom_1.LinkInlineElement ||
                        (startInline instanceof roosterjs_editor_dom_1.PartialInlineElement &&
                            startInline.getDecoratedInline() instanceof
                                roosterjs_editor_dom_1.LinkInlineElement))) {
                    canUnlink = true;
                }
                else if (!canAddImageAltText && startInline instanceof roosterjs_editor_dom_1.ImageInlineElement) {
                    canAddImageAltText = true;
                }
                if (canUnlink && canAddImageAltText) {
                    break;
                }
                startInline = contentTraverser.getNextInlineElement();
            }
        }
    }
    // TODO: for background and color, shall we also use computed style?
    // TODO: for font size, we're not using computed style since it will size in PX while we want PT
    // We could possibly introduce some convertion from PX to PT so we can also use computed style
    // TODO: for BIU etc., we're using queryCommandState. Reason is users may do a Bold without first selecting anything
    // in that case, the change is not DOM and querying DOM won't give us anything. queryCommandState can read into browser
    // to figure out the state. It can be discussed if there is a better way since it has been seen that queryCommandState may throw error
    var nodeAtCursor = getNodeAtCursor_1.default(editor);
    var listState = nodeAtCursor ? cacheGetListState_1.getListStateAtNode(editor, nodeAtCursor) : null;
    var isBullet = listState && listState == 1 /* Bullets */ ? true : false;
    var isNumbering = listState && listState == 2 /* Numbering */ ? true : false;
    return nodeAtCursor
        ? {
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
            isBullet: isBullet,
            isNumbering: isNumbering,
            canUnlink: canUnlink,
            canAddImageAltText: canAddImageAltText,
            canUndo: editor.canUndo(),
            canRedo: editor.canRedo(),
        }
        : null;
}
exports.default = getFormatState;
//# sourceMappingURL=getFormatState.js.map

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var roosterjs_editor_dom_1 = __webpack_require__(1);
function removeLink(editor) {
    editor.focus();
    var range = editor.getSelectionRange();
    if (!range) {
        return;
    }
    var formatter = null;
    if (range.collapsed) {
        // when range is not collapsed, browser execCommand won't do the 'unlink'
        var node = range.startContainer;
        if (node.nodeType == 3 /* Text */) {
            node = node.parentNode;
        }
        var inlineElement_1 = editor.getInlineElementAtNode(node);
        if (inlineElement_1 instanceof roosterjs_editor_dom_1.LinkInlineElement) {
            formatter = function () {
                // The unwrap may change the selection, record the original selection and do the restore after the unwrap
                var startContainer = range.startContainer;
                var startOffset = range.startOffset;
                // Now do the unwrap and restore selection. As we restore, need to make sure the node still falls in editor
                roosterjs_editor_dom_1.unwrap(inlineElement_1.getContainerNode());
                if (editor.contains(startContainer)) {
                    range.setStart(startContainer, startOffset);
                    range.collapse(true /*toStart*/);
                    editor.updateSelection(range);
                }
            };
        }
    }
    else {
        // Check if selection contains any link
        var contentTraverser = editor.getContentTraverser(1 /* Selection */);
        var startInline = contentTraverser.currentInlineElement;
        var hasLink = false;
        while (startInline) {
            if (startInline instanceof roosterjs_editor_dom_1.LinkInlineElement ||
                (startInline instanceof roosterjs_editor_dom_1.PartialInlineElement &&
                    startInline.getDecoratedInline() instanceof
                        roosterjs_editor_dom_1.LinkInlineElement)) {
                hasLink = true;
                break;
            }
            startInline = contentTraverser.getNextInlineElement();
        }
        if (hasLink) {
            formatter = function () { return editor.getDocument().execCommand('unlink', false, null); };
        }
    }
    if (formatter) {
        execFormatWithUndo_1.default(editor, formatter);
    }
}
exports.default = removeLink;
//# sourceMappingURL=removeLink.js.map

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
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
//# sourceMappingURL=setAlignment.js.map

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
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
//# sourceMappingURL=setBackgroundColor.js.map

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
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
//# sourceMappingURL=setTextColor.js.map

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var roosterjs_editor_dom_1 = __webpack_require__(1);
// Change direction for the blocks/paragraph in the selection
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
//# sourceMappingURL=setDirection.js.map

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
function setFontName(editor, fontName) {
    editor.focus();
    // TODO: Verify font name
    var validatedFontName = fontName.trim();
    if (validatedFontName) {
        execFormatWithUndo_1.default(editor, function () {
            // The browser provided execCommand creates a HTML <font> tag with face attribute. <font> is not HTML5 standard
            // (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
            // for here, we use use CSS font-family style
            editor.applyInlineStyle(function (element) {
                element.style.fontFamily = validatedFontName;
            });
        });
    }
}
exports.default = setFontName;
//# sourceMappingURL=setFontName.js.map

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
function setFontSize(editor, fontSize) {
    editor.focus();
    // TODO: Verify font size
    var validatedFontSize = fontSize.trim();
    if (validatedFontSize) {
        execFormatWithUndo_1.default(editor, function () {
            // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
            // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
            // for here, we use use CSS font-size style
            editor.applyInlineStyle(function (element) {
                element.style.fontSize = fontSize;
            });
        });
    }
}
exports.default = setFontSize;
//# sourceMappingURL=setFontSize.js.map

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var roosterjs_editor_dom_1 = __webpack_require__(1);
function setImageAltText(editor, altText) {
    editor.focus();
    var contentTraverser = editor.getContentTraverser(1 /* Selection */);
    var startInline = contentTraverser.currentInlineElement;
    var imageNodes = [];
    while (startInline) {
        if (startInline instanceof roosterjs_editor_dom_1.ImageInlineElement) {
            imageNodes.push(startInline.getContainerNode());
        }
        startInline = contentTraverser.getNextInlineElement();
    }
    // TODO: what if an image that is embeded deeply in an inline element? Not common, but likely
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
//# sourceMappingURL=setImageAltText.js.map

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
function setIndentation(editor, indentation) {
    editor.focus();
    var command = indentation == 0 /* Increase */ ? 'indent' : 'outdent';
    execFormatWithUndo_1.default(editor, function () {
        editor.getDocument().execCommand(command, false, null);
    });
}
exports.default = setIndentation;
//# sourceMappingURL=setIndentation.js.map

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var isSelectionCollapsed_1 = __webpack_require__(3);
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
//# sourceMappingURL=toggleBold.js.map

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var isSelectionCollapsed_1 = __webpack_require__(3);
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
//# sourceMappingURL=toggleItalic.js.map

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var toggleBullet_1 = __webpack_require__(48);
function toggleNumbering(editor) {
    editor.focus();
    execFormatWithUndo_1.default(editor, function () {
        var workaroundSpan = toggleBullet_1.workaroundForEdge(editor);
        editor.getDocument().execCommand('insertOrderedList', false, null);
        toggleBullet_1.removeWorkaroundForEdge(workaroundSpan);
    });
}
exports.default = toggleNumbering;
//# sourceMappingURL=toggleNumbering.js.map

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var isSelectionCollapsed_1 = __webpack_require__(3);
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
//# sourceMappingURL=toggleStrikethrough.js.map

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var isSelectionCollapsed_1 = __webpack_require__(3);
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
//# sourceMappingURL=toggleSubscript.js.map

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var isSelectionCollapsed_1 = __webpack_require__(3);
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
//# sourceMappingURL=toggleSuperscript.js.map

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var execFormatWithUndo_1 = __webpack_require__(0);
var isSelectionCollapsed_1 = __webpack_require__(3);
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
//# sourceMappingURL=toggleUnderline.js.map

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(5);
var currentEditor_1 = __webpack_require__(25);
function initFormatBar() {
    // Bold
    document.getElementById('boldButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleBold(currentEditor_1.default());
    });
    // Italic
    document.getElementById('italicButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleItalic(currentEditor_1.default());
    });
    // Underline
    document.getElementById('underlineButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleUnderline(currentEditor_1.default());
    });
    // Bullets
    document.getElementById('bulletButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleBullet(currentEditor_1.default());
    });
    // Numbering
    document.getElementById('numberingButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleNumbering(currentEditor_1.default());
    });
    // StrikeThrough
    document.getElementById('strikeThroughButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleStrikethrough(currentEditor_1.default());
    });
    // SuperScript
    document.getElementById('superScriptButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleSuperscript(currentEditor_1.default());
    });
    // SubScript
    document.getElementById('subScriptButton').addEventListener('click', function () {
        roosterjs_editor_api_1.toggleSubscript(currentEditor_1.default());
    });
    // Insert link
    document.getElementById('insertLink').addEventListener('click', function () {
        var editor = currentEditor_1.default();
        var range = editor.getSelectionRange();
        var url = window.prompt('Url', 'http://');
        var text = range.collapsed ? window.prompt('Text of link', url) : null;
        roosterjs_editor_api_1.createLink(editor, url, url, text);
    });
    // ClearFormat
    document.getElementById('clearFormatButton').addEventListener('click', function () {
        roosterjs_editor_api_1.clearFormat(currentEditor_1.default());
    });
    // Indent
    document.getElementById('indentButton').addEventListener('click', function () {
        roosterjs_editor_api_1.setIndentation(currentEditor_1.default(), 0 /* Increase */);
    });
    // Outdent
    document.getElementById('outdentButton').addEventListener('click', function () {
        roosterjs_editor_api_1.setIndentation(currentEditor_1.default(), 1 /* Decrease */);
    });
    // AlignLeft
    document.getElementById('alignLeftButton').addEventListener('click', function () {
        roosterjs_editor_api_1.setAlignment(currentEditor_1.default(), 0 /* Left */);
    });
    // AlignCenter
    document.getElementById('alignCenterButton').addEventListener('click', function () {
        roosterjs_editor_api_1.setAlignment(currentEditor_1.default(), 1 /* Center */);
    });
    // AlignRight
    document.getElementById('alignRightButton').addEventListener('click', function () {
        roosterjs_editor_api_1.setAlignment(currentEditor_1.default(), 2 /* Right */);
    });
    // undo
    document.getElementById('undoButton').addEventListener('click', function () {
        var editor = currentEditor_1.default();
        editor.focus();
        editor.undo();
    });
    // redo
    document.getElementById('redoButton').addEventListener('click', function () {
        var editor = currentEditor_1.default();
        editor.focus();
        editor.redo();
    });
    // font name
    document.getElementById('fontNameButton').addEventListener('change', function () {
        var editor = currentEditor_1.default();
        var select = document.getElementById('fontNameButton');
        var text = select.value;
        if (text) {
            roosterjs_editor_api_1.setFontName(editor, text);
        }
        select.value = '';
    });
    // font size
    document.getElementById('fontSizeButton').addEventListener('change', function () {
        var editor = currentEditor_1.default();
        var select = document.getElementById('fontSizeButton');
        var text = select.value;
        if (text) {
            roosterjs_editor_api_1.setFontSize(editor, text + 'px');
        }
        select.value = '';
    });
    // text color
    document.getElementById('textColorButton').addEventListener('change', function () {
        var editor = currentEditor_1.default();
        var select = document.getElementById('textColorButton');
        var text = select.value;
        if (text) {
            roosterjs_editor_api_1.setTextColor(editor, text);
        }
        select.value = '';
    });
    // back color
    document.getElementById('backColorButton').addEventListener('change', function () {
        var editor = currentEditor_1.default();
        var select = document.getElementById('backColorButton');
        var text = select.value;
        if (text) {
            roosterjs_editor_api_1.setBackgroundColor(editor, text);
        }
        select.value = '';
    });
}
exports.default = initFormatBar;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ShowCursorPosition_1 = __webpack_require__(28);
var ShowFormatState_1 = __webpack_require__(29);
var roosterjs_editor_plugins_1 = __webpack_require__(26);
var roosterjs_editor_core_1 = __webpack_require__(2);
var currentEditor_1 = __webpack_require__(25);
function initOptions() {
    document.getElementById('setEditorOptions').addEventListener('click', initEditorForOptions);
}
function initEditorForOptions() {
    var plugins = [];
    if (document.getElementById('defaultShortcutCheckbox').checked) {
        plugins.push(new roosterjs_editor_plugins_1.DefaultShortcut());
    }
    if (document.getElementById('hyperlinkCheckbox').checked) {
        plugins.push(new roosterjs_editor_plugins_1.HyperLink());
    }
    if (document.getElementById('pasteManagerCheckbox').checked) {
        plugins.push(new roosterjs_editor_plugins_1.PasteManager());
    }
    if (document.getElementById('tabIndentCheckbox').checked) {
        plugins.push(new roosterjs_editor_plugins_1.TabIndent());
    }
    plugins.push(new ShowCursorPosition_1.default(document.getElementById('cursorPosition')));
    plugins.push(new ShowFormatState_1.default(document.getElementById('formatState')));
    var defaultFormat = {};
    if (document.getElementById('boldCheckbox').checked) {
        defaultFormat.bold = true;
    }
    if (document.getElementById('italicCheckbox').checked) {
        defaultFormat.italic = true;
    }
    if (document.getElementById('underlineCheckbox').checked) {
        defaultFormat.underline = true;
    }
    defaultFormat.textColor = document.getElementById('textColorDefaultFormat').value;
    defaultFormat.fontFamily = document.getElementById('fontNameDefaultFormat').value;
    var editorOptions = {
        plugins: plugins,
        defaultFormat: defaultFormat,
    };
    currentEditor_1.setCurrentEditor(new roosterjs_editor_core_1.Editor(document.getElementById('editor'), editorOptions));
}
exports.default = initOptions;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_core_1 = __webpack_require__(2);
var roosterjs_editor_api_1 = __webpack_require__(5);
var KEY_B = 66;
var KEY_I = 73;
var KEY_U = 85;
var KEY_Y = 89;
var KEY_Z = 90;
var KEY_PERIOD = 190;
var KEY_FORWARDSLASH = 191;
var Command;
(function (Command) {
    Command[Command["None"] = 0] = "None";
    Command[Command["Bold"] = 1] = "Bold";
    Command[Command["Italic"] = 2] = "Italic";
    Command[Command["Underline"] = 3] = "Underline";
    Command[Command["Undo"] = 4] = "Undo";
    Command[Command["Redo"] = 5] = "Redo";
    Command[Command["Bullet"] = 6] = "Bullet";
    Command[Command["Numbering"] = 7] = "Numbering";
})(Command || (Command = {}));
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
//# sourceMappingURL=DefaultShortcut.js.map

/***/ }),
/* 93 */
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
var roosterjs_editor_core_1 = __webpack_require__(2);
/**
 * @deprecated Please use Undo class from roosterjs-editor-core instead
 * An editor plugin that manages undo history
 */
var HtmlSnapshotUndo = /** @class */ (function (_super) {
    __extends(HtmlSnapshotUndo, _super);
    function HtmlSnapshotUndo(snapshotOnSpace, snapshotOnEnter) {
        if (snapshotOnSpace === void 0) { snapshotOnSpace = true; }
        if (snapshotOnEnter === void 0) { snapshotOnEnter = true; }
        return _super.call(this) || this;
    }
    return HtmlSnapshotUndo;
}(roosterjs_editor_core_1.Undo));
exports.default = HtmlSnapshotUndo;
//# sourceMappingURL=HtmlSnapshotUndo.js.map

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(5);
var roosterjs_editor_dom_1 = __webpack_require__(1);
var roosterjs_editor_core_1 = __webpack_require__(2);
// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
var trailingPunctuationRegex = /[.()+={}\[\]\s:;"',>]+$/i;
var CUSTOMATTR_NAME = 'data-clickabletitle';
var CUSTOMATTR_VALUE = 'clickable';
var ATTRIBUTE_TITLE = 'title';
var MINIMUM_LENGTH = 5;
var KEY_SPACE = 32;
var KEY_ENTER = 13;
// An editor plugin that auto linkify text as users type
var HyperLink = /** @class */ (function () {
    // Constructor
    // getTooltipCallback: A callback function to get tooltip text for an existing hyperlink. Default value is to return the href itself
    //                     If null, there will be no tooltip text.
    // target:             (Optional) Target window name for hyperlink. If null, will use "_blank"
    // linkMatchRules:     (Optional) Rules for matching hyperlink. If null, will use defaultLinkMatchRules
    function HyperLink(getTooltipCallback, target, linkMatchRules) {
        if (getTooltipCallback === void 0) { getTooltipCallback = function (href) { return href; }; }
        this.getTooltipCallback = getTooltipCallback;
        this.target = target;
        this.linkMatchRules = linkMatchRules;
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
        this.editor = null;
    };
    // Handle the event
    HyperLink.prototype.onPluginEvent = function (event) {
        switch (event.eventType) {
            case 0 /* KeyDown */:
                var keyboardEvt = event.rawEvent;
                if (keyboardEvt.which == KEY_ENTER || keyboardEvt.which == KEY_SPACE) {
                    this.autoLink(event);
                }
                break;
            case 4 /* MouseUp */:
            case 6 /* MouseOver */:
            case 7 /* MouseOut */:
                var domEvent = event;
                var inline = domEvent.rawEvent && domEvent.rawEvent.target
                    ? this.editor.getInlineElementAtNode(domEvent.rawEvent.target)
                    : null;
                if (inline && inline instanceof roosterjs_editor_dom_1.LinkInlineElement) {
                    // The event target is on a link
                    if (event.eventType == 4 /* MouseUp */) {
                        this.onMouseUp(event, inline);
                    }
                    else if (this.getTooltipCallback) {
                        if (event.eventType == 6 /* MouseOver */) {
                            this.onMouseOver(event, inline);
                        }
                        else {
                            /* PluginEventType.MouseOut */
                            this.onMouseOut(event, inline);
                        }
                    }
                }
                break;
        }
    };
    HyperLink.prototype.autoLink = function (event) {
        var cursorData = roosterjs_editor_api_1.cacheGetCursorEventData(event, this.editor);
        var wordBeforeCursor = cursorData ? cursorData.wordBeforeCursor : null;
        if (wordBeforeCursor && wordBeforeCursor.length > MINIMUM_LENGTH) {
            // Check for trailing punctuation
            var trailingPunctuations = wordBeforeCursor.match(trailingPunctuationRegex);
            var trailingPunctuation = trailingPunctuations && trailingPunctuations.length > 0
                ? trailingPunctuations[0]
                : null;
            // Compute the link candidate
            var linkCandidate = wordBeforeCursor.substring(0, trailingPunctuation
                ? wordBeforeCursor.length - trailingPunctuation.length
                : wordBeforeCursor.length);
            var linkMatchRules = this.linkMatchRules || roosterjs_editor_api_1.defaultLinkMatchRules;
            // Match and replace in editor
            var linkData = roosterjs_editor_api_1.matchLink(linkCandidate, 1 /* Exact */, linkMatchRules);
            if (linkData) {
                var anchor = this.editor.getDocument().createElement('A');
                anchor.textContent = linkData.originalUrl;
                anchor.href = linkData.normalizedUrl;
                this.editor.addUndoSnapshot();
                var replaced = roosterjs_editor_api_1.replaceTextBeforeCursorWithNode(this.editor, linkData.originalUrl, anchor, trailingPunctuation ? false : true /* exactMatch */, cursorData);
                if (replaced) {
                    // The content at cursor has changed. Should also clear the cursor data cache
                    roosterjs_editor_api_1.clearCursorEventDataCache(event);
                    this.editor.triggerEvent({
                        eventType: 5 /* ContentChanged */,
                        source: 'AutoLink',
                        data: anchor,
                    }, true /* broadcast */);
                    this.editor.addUndoSnapshot();
                }
            }
        }
    };
    // Handle mouse over to add tooltip (the title attribute on a link)
    HyperLink.prototype.onMouseOver = function (event, linkInline) {
        var anchor = linkInline.getContainerNode();
        var oldTitle = anchor.title;
        // Let's not overwrite the title if there is already one
        if (!oldTitle || anchor.hasAttribute(CUSTOMATTR_NAME)) {
            var tooltip = this.getTooltipCallback(this.tryGetHref(anchor));
            // Add the title and mark it
            anchor.title = tooltip;
            anchor.setAttribute(CUSTOMATTR_NAME, CUSTOMATTR_VALUE);
        }
    };
    // Handle mouse over to remove tooltip (the title attribute on a link)
    HyperLink.prototype.onMouseOut = function (event, linkInline) {
        var anchor = linkInline.getContainerNode();
        if (anchor.hasAttribute(CUSTOMATTR_NAME)) {
            anchor.removeAttribute(ATTRIBUTE_TITLE);
            anchor.removeAttribute(CUSTOMATTR_NAME);
        }
    };
    // Handle mouse up to open link in a separate window
    HyperLink.prototype.onMouseUp = function (event, linkInline) {
        var keyboardEvent = event.rawEvent;
        var shouldOpenLink = roosterjs_editor_core_1.browserData.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey;
        if (shouldOpenLink) {
            var href = this.tryGetHref(linkInline.getContainerNode());
            if (href) {
                var target = this.target || '_blank';
                window.open(href, target);
            }
        }
    };
    // Try get href from an anchor element
    // The reason this is put in a try-catch is that
    // it has been seen that accessing href may throw an exception, in particular on IE/Edge
    HyperLink.prototype.tryGetHref = function (anchor) {
        var href = null;
        try {
            href = anchor.href;
        }
        catch (error) {
            // Not do anything for the moment
        }
        return href;
    };
    return HyperLink;
}());
exports.default = HyperLink;
//# sourceMappingURL=HyperLink.js.map

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(5);
var roosterjs_editor_core_1 = __webpack_require__(2);
var KEY_TAB = 9;
var KEY_BACKSPACE = 8;
var KEY_ENTER = 13;
// An editor plugin to auto increase/decrease indentation on Tab, Shift+tab, Enter, Backspace
var TabIndent = /** @class */ (function () {
    // onlyBegin: To instruct auto indent to happen only when cursor is at begin of a list
    function TabIndent(onlyBegin) {
        if (onlyBegin === void 0) { onlyBegin = false; }
        this.onlyBegin = onlyBegin;
    }
    TabIndent.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    TabIndent.prototype.dispose = function () {
        this.editor = null;
    };
    // Handle the event if it is a tab event, and cursor is at begin of a list
    TabIndent.prototype.willHandleEventExclusively = function (event) {
        var shouldHandleEventExclusively = false;
        if (this.isListEvent(event, [KEY_TAB])) {
            // Checks if cursor at begin of a block
            if (this.onlyBegin) {
                // When CursorData.inlineBeforeCursor == null, there isn't anything before cursor, we consider
                // cursor is at begin of a list
                var cursorData = roosterjs_editor_api_1.cacheGetCursorEventData(event, this.editor);
                shouldHandleEventExclusively = cursorData && !cursorData.inlineElementBeforeCursor;
            }
            else {
                shouldHandleEventExclusively = true;
            }
        }
        return shouldHandleEventExclusively;
    };
    // Handle the event
    TabIndent.prototype.onPluginEvent = function (event) {
        if (this.isListEvent(event, [KEY_TAB, KEY_BACKSPACE, KEY_ENTER])) {
            // Tab: increase indent
            // Shift+ Tab: decrease indent
            var keybordEvent = event.rawEvent;
            if (keybordEvent.which == KEY_TAB) {
                roosterjs_editor_api_1.setIndentation(this.editor, keybordEvent.shiftKey ? 1 /* Decrease */ : 0 /* Increase */);
                keybordEvent.preventDefault();
            }
            else if (roosterjs_editor_core_1.browserData.isEdge || roosterjs_editor_core_1.browserData.isIE || roosterjs_editor_core_1.browserData.isChrome) {
                var listElement = roosterjs_editor_api_1.cacheGetListElement(this.editor, event);
                if (listElement &&
                    listElement.textContent == '' &&
                    (keybordEvent.which == KEY_ENTER ||
                        (keybordEvent.which == KEY_BACKSPACE &&
                            listElement == listElement.parentElement.firstChild))) {
                    keybordEvent.preventDefault();
                    var listState = roosterjs_editor_api_1.cacheGetListState(this.editor, event);
                    if (listState == 1 /* Bullets */) {
                        roosterjs_editor_api_1.toggleBullet(this.editor);
                    }
                    else if (listState == 2 /* Numbering */) {
                        roosterjs_editor_api_1.toggleNumbering(this.editor);
                    }
                }
            }
        }
    };
    // Check if it is a tab or shift+tab / Enter / Backspace event
    // This tests following:
    // 1) is keydown
    // 2) is Tab / Enter / Backspace
    // 3) any of ctrl/meta/alt is not pressed
    TabIndent.prototype.isListEvent = function (event, interestedKeyCodes) {
        if (event.eventType == 0 /* KeyDown */) {
            var keybordEvent = event.rawEvent;
            if (interestedKeyCodes.indexOf(keybordEvent.which) >= 0 &&
                !keybordEvent.ctrlKey &&
                !keybordEvent.altKey &&
                !keybordEvent.metaKey) {
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
    return TabIndent;
}());
exports.default = TabIndent;
//# sourceMappingURL=TabIndent.js.map

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PasteHandler_1 = __webpack_require__(97);
var PasteHandlerIE_1 = __webpack_require__(98);
var PasteHandlerSafari_1 = __webpack_require__(99);
var roosterjs_editor_core_1 = __webpack_require__(2);
// An editor plugin that manages different types of paste.
var PasteManager = /** @class */ (function () {
    function PasteManager(pasteHandler) {
        var _this = this;
        this.pasteHandler = pasteHandler;
        this.onPasteComplete = function (clipboardData) {
            var pasteHandler = _this.pasteHandler || _this.defaultPasteHandler;
            if (clipboardData) {
                // if any clipboard data exists, call into pasteHandler
                pasteHandler(clipboardData);
            }
            // add undo snapshot after paste
            // broadcast contentChangedEvent to ensure the snapshot actually gets added
            var contentChangedEvent = { eventType: 5 /* ContentChanged */ };
            _this.editor.triggerEvent(contentChangedEvent, true /* broadcast */);
            _this.editor.addUndoSnapshot();
        };
        this.defaultPasteHandler = function (clipboardData) {
            var file = clipboardData.imageData ? clipboardData.imageData.file : null;
            if (file) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    if (_this.editor) {
                        var image = _this.editor.getDocument().createElement('img');
                        image.src = event.target.result;
                        _this.editor.insertNode(image, {
                            position: 2 /* SelectionStart */,
                            updateCursor: true,
                            replaceSelection: true,
                            insertOnNewLine: false,
                        });
                        _this.editor.addUndoSnapshot();
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    }
    PasteManager.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    PasteManager.prototype.dispose = function () {
        this.editor = null;
    };
    PasteManager.prototype.willHandleEventExclusively = function (event) {
        return event.eventType == 8 /* Paste */;
    };
    PasteManager.prototype.onPluginEvent = function (event) {
        if (event.eventType != 8 /* Paste */) {
            return;
        }
        // add undo snapshot before paste
        this.editor.addUndoSnapshot();
        var pasteEvent = event.rawEvent;
        var dataTransfer = pasteEvent.clipboardData;
        var onPasteHandler = getOnPasteHandler();
        if (onPasteHandler) {
            var clipboardData = createEmptyClipboardData();
            onPasteHandler(this.editor, pasteEvent, this.onPasteComplete, dataTransfer, clipboardData);
        }
    };
    return PasteManager;
}());
exports.default = PasteManager;
function getOnPasteHandler() {
    if (roosterjs_editor_core_1.browserData.isChrome || roosterjs_editor_core_1.browserData.isFirefox || roosterjs_editor_core_1.browserData.isEdge) {
        return PasteHandler_1.default;
    }
    else if (roosterjs_editor_core_1.browserData.isIE) {
        return PasteHandlerIE_1.default;
    }
    else if (roosterjs_editor_core_1.browserData.isSafari) {
        return PasteHandlerSafari_1.default;
    }
    else {
        // let browser handle paste itself if it's not a known browser
        return null;
    }
}
/**
 * @returns empty clipboard data
 */
function createEmptyClipboardData() {
    return {
        imageData: {},
        htmlData: null,
    };
}
//# sourceMappingURL=PasteManager.js.map

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PasteInterceptor_1 = __webpack_require__(27);
var PasteUtility_1 = __webpack_require__(10);
function getContentByTypeFromDataTransfer(dataTransfer, contentType) {
    var dataTransferItemCount = dataTransfer && dataTransfer.items ? dataTransfer.items.length : 0;
    if (dataTransferItemCount > 0) {
        for (var i = 0; i < dataTransferItemCount; i++) {
            var item = dataTransfer.items[i];
            if (item.type.indexOf(contentType) == 0) {
                return item;
            }
        }
    }
    return null;
}
function onPaste(editor, pasteEvent, completeCallback, dataTransfer, clipboardData) {
    var imageItem = getContentByTypeFromDataTransfer(dataTransfer, 'image/');
    var imageFile = imageItem ? imageItem.getAsFile() : null;
    if (imageFile && imageFile.size > 0 && PasteUtility_1.validateFileType(imageFile)) {
        clipboardData.imageData.file = imageFile;
    }
    PasteInterceptor_1.default(editor, clipboardData, completeCallback);
}
exports.default = onPaste;
//# sourceMappingURL=PasteHandler.js.map

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PasteInterceptor_1 = __webpack_require__(27);
var PasteUtility_1 = __webpack_require__(10);
function getImageFileFromDataTransfer(dataTransfer) {
    var dataTransferFileCount = dataTransfer && dataTransfer.files ? dataTransfer.files.length : 0;
    if (dataTransferFileCount > 0) {
        for (var i = 0; i < dataTransferFileCount; i++) {
            var file = dataTransfer.files.item(i);
            if (file.type.indexOf('image/') == 0 && file.size > 0 && PasteUtility_1.validateFileType(file)) {
                return file;
            }
        }
    }
    return null;
}
function onPasteIE(editor, pasteEvent, completeCallback, dataTransfer, clipboardData) {
    dataTransfer = window.clipboardData;
    var imageFile = null;
    var plaintext = dataTransfer.getData('text');
    if (!plaintext) {
        // the clipboard API for IE provide access to image and text (not html)
        // if any text exists (e.g. copying html containing images from Word/OneNote), call into pasteInterceptor;
        // else, paste as image file
        imageFile = getImageFileFromDataTransfer(dataTransfer);
    }
    if (imageFile) {
        clipboardData.imageData.file = imageFile;
        pasteEvent.preventDefault();
        completeCallback(clipboardData);
    }
    else {
        PasteInterceptor_1.default(editor, clipboardData, completeCallback);
    }
}
exports.default = onPasteIE;
//# sourceMappingURL=PasteHandlerIE.js.map

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PasteInterceptor_1 = __webpack_require__(27);
var PasteUtility_1 = __webpack_require__(10);
function getImageFileFromDataTransfer(dataTransfer) {
    var dataTransferFileCount = dataTransfer && dataTransfer.files ? dataTransfer.files.length : 0;
    if (dataTransferFileCount > 0) {
        for (var i = 0; i < dataTransferFileCount; i++) {
            var file = dataTransfer.files.item(i);
            if (file.type.indexOf('image/') == 0 && file.size > 0 && PasteUtility_1.validateFileType(file)) {
                return file;
            }
        }
    }
    return null;
}
function doesDataTransferContainOnlyImage(dataTransfer) {
    var hasImage = false;
    var hasText = false;
    if (dataTransfer && dataTransfer.types) {
        var dataTranferTypes = dataTransfer.types;
        for (var i = 0; i < dataTranferTypes.length; i++) {
            if (dataTranferTypes[i].indexOf('image/') === 0) {
                hasImage = true;
            }
            else if (dataTranferTypes[i].indexOf('text/') === 0) {
                hasText = true;
            }
        }
    }
    return hasImage && !hasText;
}
function onPasteSafari(editor, pasteEvent, completeCallback, dataTransfer, clipboardData) {
    var imageFile = getImageFileFromDataTransfer(dataTransfer);
    if (imageFile) {
        clipboardData.imageData.file = imageFile;
        pasteEvent.preventDefault();
        completeCallback(clipboardData);
    }
    else if (doesDataTransferContainOnlyImage(dataTransfer)) {
        pasteEvent.preventDefault();
        completeCallback(clipboardData);
    }
    else {
        PasteInterceptor_1.default(editor, clipboardData, completeCallback);
    }
}
exports.default = onPasteSafari;
//# sourceMappingURL=PasteHandlerSafari.js.map

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var createEditor_1 = __webpack_require__(101);
exports.createEditor = createEditor_1.default;
__export(__webpack_require__(102));
__export(__webpack_require__(1));
__export(__webpack_require__(2));
__export(__webpack_require__(5));
__export(__webpack_require__(26));
//# sourceMappingURL=index.js.map

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_plugins_1 = __webpack_require__(26);
var roosterjs_editor_core_1 = __webpack_require__(2);
// Create an editor instance with most common options
function createEditor(contentDiv, additionalPlugins, initialContent) {
    var plugins = [
        new roosterjs_editor_plugins_1.DefaultShortcut(),
        new roosterjs_editor_plugins_1.HyperLink(),
        new roosterjs_editor_plugins_1.PasteManager(),
        new roosterjs_editor_plugins_1.TabIndent(),
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
//# sourceMappingURL=createEditor.js.map

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Alignment_1 = __webpack_require__(103);
exports.Alignment = Alignment_1.default;
var ContentPosition_1 = __webpack_require__(104);
exports.ContentPosition = ContentPosition_1.default;
var ContentScope_1 = __webpack_require__(105);
exports.ContentScope = ContentScope_1.default;
var Direction_1 = __webpack_require__(106);
exports.Direction = Direction_1.default;
var DocumentPosition_1 = __webpack_require__(107);
exports.DocumentPosition = DocumentPosition_1.default;
var EditorPoint_1 = __webpack_require__(108);
exports.NodeBoundary = EditorPoint_1.NodeBoundary;
var Indentation_1 = __webpack_require__(109);
exports.Indentation = Indentation_1.default;
var LinkMatchOption_1 = __webpack_require__(110);
exports.LinkMatchOption = LinkMatchOption_1.default;
var ListState_1 = __webpack_require__(111);
exports.ListState = ListState_1.default;
var NodeType_1 = __webpack_require__(112);
exports.NodeType = NodeType_1.default;
var PluginEventType_1 = __webpack_require__(113);
exports.PluginEventType = PluginEventType_1.default;
//# sourceMappingURL=index.js.map

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// enum for setting block alignment
var Alignment;
(function (Alignment) {
    // Align left
    Alignment[Alignment["Left"] = 0] = "Left";
    // Align center
    Alignment[Alignment["Center"] = 1] = "Center";
    // Align right
    Alignment[Alignment["Right"] = 2] = "Right";
})(Alignment || (Alignment = {}));
exports.default = Alignment;
//# sourceMappingURL=Alignment.js.map

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The position. Mostly used for content insertion and traversing
// On insertion, we will need to specify where we want the content to be placed (begin, end or selection)
// On content traversing, we will need to specify the start position of traversing
var ContentPosition;
(function (ContentPosition) {
    // Begin of the container
    ContentPosition[ContentPosition["Begin"] = 0] = "Begin";
    // End of the container
    ContentPosition[ContentPosition["End"] = 1] = "End";
    // Selection start
    ContentPosition[ContentPosition["SelectionStart"] = 2] = "SelectionStart";
})(ContentPosition || (ContentPosition = {}));
exports.default = ContentPosition;
//# sourceMappingURL=ContentPosition.js.map

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Indicates the scope of a traversing
var ContentScope;
(function (ContentScope) {
    // Scope to a block
    ContentScope[ContentScope["Block"] = 0] = "Block";
    // Scope to current selection
    ContentScope[ContentScope["Selection"] = 1] = "Selection";
    // Scope to the whole body
    ContentScope[ContentScope["Body"] = 2] = "Body";
})(ContentScope || (ContentScope = {}));
exports.default = ContentScope;
//# sourceMappingURL=ContentScope.js.map

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// enum for setting block direction
var Direction;
(function (Direction) {
    // Left to right
    Direction[Direction["LeftToRight"] = 0] = "LeftToRight";
    // Right to left
    Direction[Direction["RightToLeft"] = 1] = "RightToLeft";
})(Direction || (Direction = {}));
exports.default = Direction;
//# sourceMappingURL=Direction.js.map

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The is essentially an enum representing result from browser compareDocumentPosition API
// https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
var DocumentPosition;
(function (DocumentPosition) {
    DocumentPosition[DocumentPosition["Same"] = 0] = "Same";
    DocumentPosition[DocumentPosition["Disconnected"] = 1] = "Disconnected";
    DocumentPosition[DocumentPosition["Preceding"] = 2] = "Preceding";
    DocumentPosition[DocumentPosition["Following"] = 4] = "Following";
    DocumentPosition[DocumentPosition["Contains"] = 8] = "Contains";
    DocumentPosition[DocumentPosition["ContainedBy"] = 16] = "ContainedBy";
    DocumentPosition[DocumentPosition["ImplementationSpecific"] = 32] = "ImplementationSpecific";
})(DocumentPosition || (DocumentPosition = {}));
exports.default = DocumentPosition;
//# sourceMappingURL=DocumentPosition.js.map

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Represent a point in editor DOM. The reason why we come up with this
// is for selection at node boundary, depending on the state of browser, you may
// get different representation of the point from selection.startContainer/startOffset
// i.e. <div>{text1}<sel>{text2}<div>, browser could return you a startContainer/startOffset
// pair of div/1, or text1/0. This is hard to do point to point comparision.
// This EditorPoint is essentially a normalized version of startContainer/startOffset where
// we ensure the container node always points to lowest node in DOM tree. In this case, it will be text0
// In summary:
// containerNode: the lowest node in dom tree
// offset = NodeBoundary.Begin: begin of the node
// offset = NodeBoudnary.End: end of node for non-textual node
// offset = offset into text node for text node
var NodeBoundary;
(function (NodeBoundary) {
    NodeBoundary[NodeBoundary["Begin"] = 0] = "Begin";
    NodeBoundary[NodeBoundary["End"] = 1] = "End";
})(NodeBoundary = exports.NodeBoundary || (exports.NodeBoundary = {}));
//# sourceMappingURL=EditorPoint.js.map

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The enum used for increase or decrease indentation of a block
var Indentation;
(function (Indentation) {
    // Increase indentation
    Indentation[Indentation["Increase"] = 0] = "Increase";
    // Decrease indentation
    Indentation[Indentation["Decrease"] = 1] = "Decrease";
})(Indentation || (Indentation = {}));
exports.default = Indentation;
//# sourceMappingURL=Indentation.js.map

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The link match option
var LinkMatchOption;
(function (LinkMatchOption) {
    // Partial match
    LinkMatchOption[LinkMatchOption["Partial"] = 0] = "Partial";
    // Exact match
    LinkMatchOption[LinkMatchOption["Exact"] = 1] = "Exact";
})(LinkMatchOption || (LinkMatchOption = {}));
exports.default = LinkMatchOption;
//# sourceMappingURL=LinkMatchOption.js.map

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// enum for html list state
var ListState;
(function (ListState) {
    // Not in list state
    ListState[ListState["None"] = 0] = "None";
    // In bullets mode
    ListState[ListState["Bullets"] = 1] = "Bullets";
    // In numbering mode
    ListState[ListState["Numbering"] = 2] = "Numbering";
})(ListState || (ListState = {}));
exports.default = ListState;
//# sourceMappingURL=ListState.js.map

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The is essentially an enum represents the type of the node
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
// Values not listed here are deprecated.
var NodeType;
(function (NodeType) {
    // An Element node such as <p> or <div>.
    NodeType[NodeType["Element"] = 1] = "Element";
    // The actual Text of Element or Attr.
    NodeType[NodeType["Text"] = 3] = "Text";
    // A ProcessingInstruction of an XML document such as <?xml-stylesheet ... ?> declaration.
    NodeType[NodeType["ProcessingInstruction"] = 7] = "ProcessingInstruction";
    // A Comment node.
    NodeType[NodeType["Comment"] = 8] = "Comment";
    // A Document node.
    NodeType[NodeType["Document"] = 9] = "Document";
    // A DocumentType node e.g. <!DOCTYPE html> for HTML5 documents.
    NodeType[NodeType["DocumentType"] = 10] = "DocumentType";
    // A DocumentFragment node.
    NodeType[NodeType["DocumentFragment"] = 11] = "DocumentFragment";
})(NodeType || (NodeType = {}));
exports.default = NodeType;
//# sourceMappingURL=NodeType.js.map

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Editor plugin event type
var PluginEventType;
(function (PluginEventType) {
    // HTML KeyDown event
    PluginEventType[PluginEventType["KeyDown"] = 0] = "KeyDown";
    // HTML KeyPress event
    PluginEventType[PluginEventType["KeyPress"] = 1] = "KeyPress";
    // HTML KeyUp event
    PluginEventType[PluginEventType["KeyUp"] = 2] = "KeyUp";
    // HTML CompositionEnd event
    PluginEventType[PluginEventType["CompositionEnd"] = 3] = "CompositionEnd";
    // HTML MouseUp event
    PluginEventType[PluginEventType["MouseUp"] = 4] = "MouseUp";
    // Content changed event
    PluginEventType[PluginEventType["ContentChanged"] = 5] = "ContentChanged";
    // HTML MouseOver event
    PluginEventType[PluginEventType["MouseOver"] = 6] = "MouseOver";
    // HTML MouseOut event
    PluginEventType[PluginEventType["MouseOut"] = 7] = "MouseOut";
    // HTML Paste event
    PluginEventType[PluginEventType["Paste"] = 8] = "Paste";
    // HTML Copy event
    PluginEventType[PluginEventType["Copy"] = 9] = "Copy";
    // Extract Content event
    // This event is triggered when getContent() is called with triggerExtractContentEvent = true
    // Plugin can handle this event to remove the UI only markups to return clean HTML
    PluginEventType[PluginEventType["ExtractContent"] = 10] = "ExtractContent";
})(PluginEventType || (PluginEventType = {}));
exports.default = PluginEventType;
//# sourceMappingURL=PluginEventType.js.map

/***/ })
/******/ ]);