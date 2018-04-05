/*
    VERSION: 7.0.0

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
var roosterjs =
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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/roosterjs/lib/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./packages/roosterjs-editor-api/lib/cursor/CursorData.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/CursorData.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
// White space matching regex. It matches following chars:
// \s: white space
// \u00A0: no-breaking white space
// \u200B: zero width space
// \u3000: full width space (which can come from JPN IME)
var WHITESPACE_REGEX = /[\s\u00A0\u200B\u3000]+([^\s\u00A0\u200B\u3000]*)$/i;
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
            if (previousInline && isTextualInlineElement(previousInline)) {
                var textContent = previousInline.getTextContent();
                if (!this.inlineBeforeCursor) {
                    // Make sure the inline before cursor is a non-empty text inline
                    this.inlineBeforeCursor = previousInline;
                }
                // build the word before cursor if it is not built yet
                if (!this.cachedWordBeforeCursor) {
                    // Match on the white space, the portion after space is on the index of 1 of the matched result
                    // (index at 0 is whole match result, index at 1 is the word)
                    var matches = WHITESPACE_REGEX.exec(textContent);
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
                break;
            }
            previousInline = this.backwardTraverser.getPreviousInlineElement();
        }
    };
    return CursorData;
}());
exports.default = CursorData;
function isTextualInlineElement(inlineElement) {
    return (inlineElement &&
        (inlineElement.getContainerNode().nodeType == 3 /* Text */ ||
            (inlineElement instanceof roosterjs_editor_dom_1.PartialInlineElement &&
                inlineElement.getDecoratedInline().getContainerNode().nodeType == 3 /* Text */)));
}


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/cursor/cacheGetCursorEventData.ts":
/*!*****************************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/cacheGetCursorEventData.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CursorData_1 = __webpack_require__(/*! ./CursorData */ "./packages/roosterjs-editor-api/lib/cursor/CursorData.ts");
var roosterjs_editor_core_1 = __webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts");
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

/***/ "./packages/roosterjs-editor-api/lib/cursor/cacheGetListTag.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/cacheGetListTag.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getNodeAtCursor_1 = __webpack_require__(/*! ../cursor/getNodeAtCursor */ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
/**
 * Get the list state at selection
 * The list state refers to the HTML elements <OL> or <UL>
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * @param editor The editor instance
 * If not passed, we will query the first <LI> node in selection and return the list state of its direct parent
 * @returns The list tag, OL, UL or empty when cursor is not inside a list
 */
function cacheGetListTag(event, editor) {
    var li = getNodeAtCursor_1.cacheGetNodeAtCursor(editor, event, 'LI');
    var tag = li && roosterjs_editor_dom_1.getTagOfNode(li.parentNode);
    return tag == 'OL' || tag == 'UL' ? tag : null;
}
exports.default = cacheGetListTag;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/cursor/getCursorRect.ts":
/*!*******************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/getCursorRect.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
/**
 * Returns a rect representing the location of the cursor.
 * In case there is a uncollapsed selection witin editor, this returns
 * the position for focus node.
 * The returned rect structure has a left and right and they should be same
 * here since it is for cursor, not for a range.
 */
function getCursorRect(editor) {
    var range = editor.getSelectionRange().getRange();
    var document = editor.getDocument();
    // 1) obtain a collapsed range pointing to cursor
    if (!range.collapsed) {
        var selection = document.defaultView.getSelection();
        if (!selection || !selection.focusNode) {
            return null;
        }
        var forwardSelection = range.endContainer == selection.focusNode && range.endOffset == selection.focusOffset;
        range = range.cloneRange();
        range.collapse(!forwardSelection /*toStart*/);
    }
    // 2) try to get rect using range.getBoundingClientRect()
    var rect = getRectFromClientRect(range.getBoundingClientRect());
    if (!rect) {
        var position = new roosterjs_editor_dom_1.Position(range.startContainer, range.startOffset).normalize();
        var node = position.node, element = position.element;
        // 3) if current cursor is inside text node, use range.getClientRects() for safari or insert a SPAN and get the rect of SPAN for others
        if (roosterjs_editor_dom_1.Browser.isSafari) {
            var rects = range.getClientRects();
            if (rects && rects.length == 1) {
                rect = getRectFromClientRect(rects[0]);
            }
        }
        else {
            if (node.nodeType == 3 /* Text */) {
                var document_1 = editor.getDocument();
                var span = document_1.createElement('SPAN');
                var range_1 = document_1.createRange();
                range_1.setStart(node, position.offset);
                range_1.collapse(true /*toStart*/);
                range_1.insertNode(span);
                rect = getRectFromClientRect(span.getBoundingClientRect());
                span.parentNode.removeChild(span);
            }
        }
        // 4) fallback to element.getBoundingClientRect()
        if (!rect && element) {
            rect = getRectFromClientRect(element.getBoundingClientRect());
        }
    }
    return rect;
}
exports.default = getCursorRect;
function getRectFromClientRect(clientRect) {
    // A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
    // We validate that and only return a rect when the passed in ClientRect is valid
    var _a = clientRect || {}, left = _a.left, right = _a.right, top = _a.top, bottom = _a.bottom;
    return left + right + top + bottom > 0
        ? {
            left: Math.round(left),
            right: Math.round(right),
            top: Math.round(top),
            bottom: Math.round(bottom),
        }
        : null;
}


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/cursor/getFormatState.ts":
/*!********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/getFormatState.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cacheGetListTag_1 = __webpack_require__(/*! ../cursor/cacheGetListTag */ "./packages/roosterjs-editor-api/lib/cursor/cacheGetListTag.ts");
var getNodeAtCursor_1 = __webpack_require__(/*! ../cursor/getNodeAtCursor */ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts");
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
var roosterjs_editor_core_1 = __webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
/**
 * Get the header level in current selection. The header level refers to the HTML <H1> to <H6> elements,
 * level 1 indicates <H1>, level 2 indicates <H2>, etc
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will query the node within selection
 * @returns The header level, 0 if there is no HTML heading elements
 */
function cacheGetHeaderLevel(editor, event) {
    return roosterjs_editor_core_1.cacheGetEventData(event, 'HeaderLevel', function () {
        for (var i = 1; i <= 6; i++) {
            if (queryNodesWithSelection_1.default(editor, 'H' + i).length > 0) {
                return i;
            }
        }
        return 0;
    });
}
/**
 * Query command state, used for query Bold, Italic, Underline state
 * @param editor The editor instance
 * @param command The command to query
 */
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
    var nodeAtCursor = getNodeAtCursor_1.default(editor);
    if (!nodeAtCursor) {
        return null;
    }
    var styles = roosterjs_editor_dom_1.getComputedStyles(nodeAtCursor);
    var tag = cacheGetListTag_1.default(event, editor);
    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: styles[2],
        backgroundColor: styles[3],
        isBullet: tag == 'UL',
        isNumbering: tag == 'OL',
        isBold: queryCommandState(editor, 'bold'),
        isItalic: queryCommandState(editor, 'italic'),
        isUnderline: queryCommandState(editor, 'underline'),
        isStrikeThrough: queryCommandState(editor, 'strikeThrough'),
        isSubscript: queryCommandState(editor, 'subscript'),
        isSuperscript: queryCommandState(editor, 'superscript'),
        canUnlink: queryNodesWithSelection_1.default(editor, 'a[href]').length > 0,
        canAddImageAltText: queryNodesWithSelection_1.default(editor, 'img').length > 0,
        isBlockQuote: queryNodesWithSelection_1.default(editor, 'blockquote').length > 0,
        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
        headerLevel: cacheGetHeaderLevel(editor, event),
    };
}
exports.default = getFormatState;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_core_1 = __webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
/**
 * Get the node at selection. If an expectedTag is specified, return the nearest ancestor of current node
 * which matches the tag name, or null if no match found in editor.
 * @param editor The editor instance
 * @param expectedTag The expected tag name. If null, return the element at cursor
 * @param startNode If specified, use this node as start node to search instead of current node
 * @returns The node at cursor or the nearest ancestor with the tag name is specified
 */
function getNodeAtCursor(editor, expectedTag, startNode) {
    var node = roosterjs_editor_dom_1.getElementOrParentElement(startNode) ||
        editor.getSelectionRange().start.normalize().element;
    if (expectedTag) {
        while (editor.contains(node)) {
            if (roosterjs_editor_dom_1.getTagOfNode(node) == expectedTag.toUpperCase()) {
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
 * @param expectedTag The expected tag name. If null, return the element at cursor
 * @returns The element at cursor or the nearest ancestor with the tag name is specified
 */
function cacheGetNodeAtCursor(editor, event, expectedTag) {
    return roosterjs_editor_core_1.cacheGetEventData(event, 'GET_NODE_AT_CURSOR_' + expectedTag, function () {
        return getNodeAtCursor(editor, expectedTag);
    });
}
exports.cacheGetNodeAtCursor = cacheGetNodeAtCursor;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts":
/*!*****************************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
/**
 * Query nodes intersected with current selection using a selector
 * @param editor The editor
 * @param selector The selector to query
 * @param nodeContainedByRangeOnly When set to true, only return the nodes contained by current selection. Default value is false
 * @param forEachCallback An optional callback to be invoked on each node in query result
 * @returns The nodes intersected with current selection, returns an empty array if no result is found
 */
function queryNodesWithSelection(editor, selector, nodeContainedByRangeOnly, forEachCallback) {
    var nodes = editor.queryNodes(selector);
    var range = editor.getSelectionRange();
    nodes = nodes.filter(function (node) {
        return roosterjs_editor_dom_1.intersectWithNodeRange(node, range.start.node, range.end.node, nodeContainedByRangeOnly);
    });
    if (forEachCallback) {
        nodes.forEach(forEachCallback);
    }
    return nodes;
}
exports.default = queryNodesWithSelection;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/cursor/replaceRangeWithNode.ts":
/*!**************************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/replaceRangeWithNode.ts ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
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
        editor.select(node, roosterjs_editor_dom_1.Position.After);
    }
    else if (backupRange && editor.contains(backupRange)) {
        editor.select(backupRange);
    }
    return true;
}
exports.default = replaceRangeWithNode;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/cursor/replaceTextBeforeCursorWithNode.ts":
/*!*************************************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/cursor/replaceTextBeforeCursorWithNode.ts ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CursorData_1 = __webpack_require__(/*! ./CursorData */ "./packages/roosterjs-editor-api/lib/cursor/CursorData.ts");
var replaceRangeWithNode_1 = __webpack_require__(/*! ./replaceRangeWithNode */ "./packages/roosterjs-editor-api/lib/cursor/replaceRangeWithNode.ts");
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
                    range.setEnd(textInline.getContainerNode(), textInline.getStartPosition().offset + nodeIndex + 1);
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
            range.setStart(textInline.getContainerNode(), textInline.getStartPosition().offset + nodeIndex + 1);
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

/***/ "./packages/roosterjs-editor-api/lib/format/applyInlineStyle.ts":
/*!**********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/applyInlineStyle.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var ZERO_WIDTH_SPACE = '\u200B';
/**
 * Apply inline style to current selection
 * @param editor The editor instance
 * @param styler The callback function to apply style to each element inside selection
 */
function applyInlineStyle(editor, styler) {
    editor.focus();
    var collapsed = editor.getSelectionRange().collapsed;
    editor.formatWithUndo(function () {
        if (collapsed) {
            // Create a new span to hold the style.
            // Some content is needed to position selection into the span
            // for here, we inject ZWS - zero width space
            var element = roosterjs_editor_dom_1.fromHtml("<SPAN>" + ZERO_WIDTH_SPACE + "</SPAN>", editor.getDocument())[0];
            styler(element);
            editor.insertNode(element);
            // reset selection to be after the ZWS (rather than selecting it)
            // This is needed so that the cursor still looks blinking inside editor
            // This also means an extra ZWS will be in editor
            editor.select(element, roosterjs_editor_dom_1.Position.End);
        }
        else {
            // This is start and end node that get the style. The start and end needs to be recorded so that selection
            // can be re-applied post-applying style
            var firstNode_1;
            var lastNode_1;
            var contentTraverser = editor.getContentTraverser(1 /* Selection */);
            // Just loop through all inline elements in the selection and apply style for each
            var inlineElement = contentTraverser.currentInlineElement;
            while (inlineElement) {
                // Need to obtain next inline first. Applying styles changes DOM which may mess up with the navigation
                var nextInline = contentTraverser.getNextInlineElement();
                inlineElement.applyStyle(function (element) {
                    styler(element);
                    firstNode_1 = firstNode_1 || element;
                    lastNode_1 = element;
                });
                inlineElement = nextInline;
            }
            // When selectionStartNode/EndNode is set, it means there is DOM change. Re-create the selection
            if (firstNode_1 && lastNode_1) {
                editor.select(firstNode_1, roosterjs_editor_dom_1.Position.Before, lastNode_1, roosterjs_editor_dom_1.Position.After);
            }
        }
    }, false /*preserveSelection*/, "Format" /* Format */, null /*dataCallback*/, collapsed /*skipAddingUndoAfterFormat*/);
}
exports.default = applyInlineStyle;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/clearFormat.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/clearFormat.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var setBackgroundColor_1 = __webpack_require__(/*! ./setBackgroundColor */ "./packages/roosterjs-editor-api/lib/format/setBackgroundColor.ts");
var setFontName_1 = __webpack_require__(/*! ./setFontName */ "./packages/roosterjs-editor-api/lib/format/setFontName.ts");
var setFontSize_1 = __webpack_require__(/*! ./setFontSize */ "./packages/roosterjs-editor-api/lib/format/setFontSize.ts");
var setTextColor_1 = __webpack_require__(/*! ./setTextColor */ "./packages/roosterjs-editor-api/lib/format/setTextColor.ts");
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
var STYLES_TO_REMOVE = ['font', 'text-decoration', 'color', 'background'];
/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/align left/align right/align center/superscript/subscript
 * @param editor The editor instance
 */
function clearFormat(editor) {
    editor.focus();
    editor.formatWithUndo(function () {
        editor.getDocument().execCommand('removeFormat', false, null);
        queryNodesWithSelection_1.default(editor, '[class]', false /*containsOnly*/, function (node) {
            return node.removeAttribute('class');
        });
        queryNodesWithSelection_1.default(editor, '[style]', true /*nodeContainedByRangeOnly*/, function (node) { return STYLES_TO_REMOVE.forEach(function (style) { return node.style.removeProperty(style); }); });
        var defaultFormat = editor.getDefaultFormat();
        setFontName_1.default(editor, defaultFormat.fontFamily);
        setFontSize_1.default(editor, defaultFormat.fontSize);
        setTextColor_1.default(editor, defaultFormat.textColor);
        setBackgroundColor_1.default(editor, defaultFormat.backgroundColor);
    });
}
exports.default = clearFormat;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/createLink.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/createLink.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
// Regex matching Uri scheme
var URI_REGEX = /^[a-zA-Z]+:/i;
// Regex matching begin of email address
var MAILTO_REGEX = /^[\w.%+-]+@/i;
// Regex matching begin of ftp, i.e. ftp.microsoft.com
var FTP_REGEX = /^ftp\./i;
var TEMP_TITLE = 'istemptitle';
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
        var linkData = roosterjs_editor_dom_1.matchLink(url);
        // matchLink can match most links, but not all, i.e. if you pass link a link as "abc", it won't match
        // we know in that case, users will want to insert a link like http://abc
        // so we have separate logic in applyLinkPrefix to add link prefix depending on the format of the link
        // i.e. if the link starts with something like abc@xxx, we will add mailto: prefix
        // if the link starts with ftp.xxx, we will add ftp:// link. For more, see applyLinkPrefix
        var normalizedUrl_1 = linkData ? linkData.normalizedUrl : applyLinkPrefix(url);
        var originalUrl_1 = linkData ? linkData.originalUrl : url;
        var anchor_1 = null;
        editor.formatWithUndo(function () {
            if (editor.getSelectionRange().collapsed) {
                anchor_1 = getAnchorNodeAtCursor(editor);
                // If there is already a link, just change its href
                if (anchor_1) {
                    anchor_1.href = normalizedUrl_1;
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
            }
            if (altText && anchor_1) {
                // Hack: Ideally this should be done by HyperLink plugin.
                // We make a hack here since we don't have an event to notify HyperLink plugin
                // before we apply the link.
                anchor_1.removeAttribute(TEMP_TITLE);
                anchor_1.title = altText;
            }
        }, false /*preserveSelection*/, "CreateLink" /* CreateLink */, function () { return anchor_1; });
    }
}
exports.default = createLink;
function getAnchorNodeAtCursor(editor) {
    return queryNodesWithSelection_1.default(editor, 'a[href]')[0];
}
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


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/insertImage.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/insertImage.ts ***!
  \*****************************************************************/
/*! no static exports found */
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
    var reader = new FileReader();
    reader.onload = function (event) {
        if (!editor.isDisposed()) {
            editor.formatWithUndo(function () {
                var image = editor.getDocument().createElement('img');
                image.src = event.target.result;
                image.style.maxWidth = '100%';
                editor.insertNode(image);
            });
        }
    };
    reader.readAsDataURL(imageFile);
}
exports.default = insertImage;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/removeLink.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/removeLink.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
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
        editor.formatWithUndo(function () {
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                roosterjs_editor_dom_1.unwrap(node);
            }
        }, true /*preserveSelection*/);
    }
}
exports.default = removeLink;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setAlignment.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setAlignment.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
function setAlignment(editor, alignment) {
    editor.focus();
    editor.formatWithUndo(function () {
        editor
            .getDocument()
            .execCommand(alignment == 1 /* Center */
            ? 'justifyCenter'
            : alignment == 2 /* Right */ ? 'justifyRight' : 'justifyLeft', false, null);
    });
}
exports.default = setAlignment;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setBackgroundColor.ts":
/*!************************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setBackgroundColor.ts ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var applyInlineStyle_1 = __webpack_require__(/*! ./applyInlineStyle */ "./packages/roosterjs-editor-api/lib/format/applyInlineStyle.ts");
/**
 * Set background color at current selection
 * @param editor The editor instance
 * @param color The color string, can be any of the predefined color names (e.g, 'red')
 * or hexadecimal color string (e.g, '#FF0000') or rgb value (e.g, 'rgb(255, 0, 0)') supported by browser.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setBackgroundColor(editor, color) {
    applyInlineStyle_1.default(editor, function (element) { return (element.style.backgroundColor = color); });
}
exports.default = setBackgroundColor;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setDirection.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setDirection.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
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
        editor.formatWithUndo(function () {
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
                    roosterjs_editor_dom_1.wrap(allNodes, "<div dir='" + dirValue + "', style='text-align:" + styleValue + ";'></div>");
                }
            }
        });
    }
}
exports.default = setDirection;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setFontName.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setFontName.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var applyInlineStyle_1 = __webpack_require__(/*! ./applyInlineStyle */ "./packages/roosterjs-editor-api/lib/format/applyInlineStyle.ts");
/**
 * Set font name at selection
 * @param editor The editor instance
 * @param fontName The fontName string, should be a valid CSS font-family style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setFontName(editor, fontName) {
    // The browser provided execCommand creates a HTML <font> tag with face attribute. <font> is not HTML5 standard
    // (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
    // for here, we use CSS font-family style
    applyInlineStyle_1.default(editor, function (element) { return (element.style.fontFamily = fontName); });
}
exports.default = setFontName;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setFontSize.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setFontSize.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var applyInlineStyle_1 = __webpack_require__(/*! ./applyInlineStyle */ "./packages/roosterjs-editor-api/lib/format/applyInlineStyle.ts");
/**
 * Set font size at selection
 * @param editor The editor instance
 * @param fontSize The fontSize string, should be a valid CSS font-size style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setFontSize(editor, fontSize) {
    // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
    // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp). Use editor.applyInlineStyle which gives flexibility on applying inline style
    // for here, we use CSS font-size style
    applyInlineStyle_1.default(editor, function (element) { return (element.style.fontSize = fontSize); });
}
exports.default = setFontSize;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setImageAltText.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setImageAltText.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
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
        editor.formatWithUndo(function () {
            for (var _i = 0, imageNodes_1 = imageNodes; _i < imageNodes_1.length; _i++) {
                var node = imageNodes_1[_i];
                node.setAttribute('alt', altText);
            }
        });
    }
}
exports.default = setImageAltText;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setIndentation.ts":
/*!********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setIndentation.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getFormatState_1 = __webpack_require__(/*! ../cursor/getFormatState */ "./packages/roosterjs-editor-api/lib/cursor/getFormatState.ts");
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
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
    editor.formatWithUndo(function () {
        var format = getFormatState_1.default(editor);
        editor.getDocument().execCommand(command, false, null);
        if (!format.isBullet && !format.isNumbering) {
            queryNodesWithSelection_1.default(editor, 'blockquote', false /*containsOnly*/, function (node) {
                node.style.marginTop = '0px';
                node.style.marginBottom = '0px';
            });
        }
    });
}
exports.default = setIndentation;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/setTextColor.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/setTextColor.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var applyInlineStyle_1 = __webpack_require__(/*! ./applyInlineStyle */ "./packages/roosterjs-editor-api/lib/format/applyInlineStyle.ts");
/**
 * Set text color at selection
 * @param editor The editor instance
 * @param color The color string, can be any of the predefined color names (e.g, 'red')
 * or hexadecimal color string (e.g, '#FF0000') or rgb value (e.g, 'rgb(255, 0, 0)') supported by browser.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setTextColor(editor, color) {
    applyInlineStyle_1.default(editor, function (element) { return (element.style.color = color); });
}
exports.default = setTextColor;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggle.ts":
/*!************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggle.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Toggle state using execCommand function
 * @param editor The editor instance
 * @param command The command to execute
 */
function toggle(editor, command) {
    editor.focus();
    editor.formatWithUndo(function () {
        editor.getDocument().execCommand(command, false, null);
    });
}
exports.default = toggle;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleBlockQuote.ts":
/*!**********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleBlockQuote.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
var getNodeAtCursor_1 = __webpack_require__(/*! ../cursor/getNodeAtCursor */ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var ZERO_WIDTH_SPACE = '\u200b';
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
    editor.formatWithUndo(function () {
        // There are already blockquote nodes, unwrap them
        if (queryNodesWithSelection_1.default(editor, 'blockquote', false /*containsOnly*/, roosterjs_editor_dom_1.unwrap).length ==
            0) {
            // Step 1: Find all block elements and their content nodes
            var nodes = getContentNodes(editor);
            // Step 2: Split existing list container if necessary
            nodes = getSplittedListNodes(nodes);
            // Step 3: Handle some special cases
            nodes = getNodesWithSpecialCaseHandled(editor, nodes);
            var quoteElement = roosterjs_editor_dom_1.wrap(nodes, '<blockquote></blockqupte>');
            (styler || defaultStyler)(quoteElement);
            // Return a fallback to select in case original selection is not valid any more
            return nodes[0];
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
function getNodesWithSpecialCaseHandled(editor, nodes) {
    if (nodes.length == 1 && nodes[0].nodeName == 'BR') {
        nodes[0] = roosterjs_editor_dom_1.wrap(nodes[0], '<div></div>');
    }
    else if (nodes.length == 0) {
        var document_1 = editor.getDocument();
        // Selection is collapsed and blockElement is null, we need to create an empty div.
        // In case of IE and Edge, we insert ZWS to put cursor in the div, otherwise insert BR node.
        var div = document_1.createElement('div');
        div.appendChild(roosterjs_editor_dom_1.Browser.isEdge || roosterjs_editor_dom_1.Browser.isIE
            ? document_1.createTextNode(ZERO_WIDTH_SPACE)
            : document_1.createElement('BR'));
        editor.insertNode(div);
        nodes.push(div);
    }
    return nodes;
}
function isListElement(node) {
    var parentTag = node ? roosterjs_editor_dom_1.getTagOfNode(node.parentNode) : '';
    return parentTag == 'OL' || parentTag == 'UL';
}


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleBold.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleBold.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggle_1 = __webpack_require__(/*! ./toggle */ "./packages/roosterjs-editor-api/lib/format/toggle.ts");
/**
 * Toggle bold at selection
 * If selection is collapsed, it will only affect the following input after caret
 * If selection contains only bold text, the bold style will be removed
 * If selection contains only normal text, bold style will be added to the whole selected text
 * If selection contains both bold and normal text, bold stle will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleBold(editor) {
    toggle_1.default(editor, 'bold');
}
exports.default = toggleBold;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleBullet.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleBullet.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getNodeAtCursor_1 = __webpack_require__(/*! ../cursor/getNodeAtCursor */ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var ZERO_WIDTH_SPACE = '&#8203;';
/**
 * Edge may incorrectly put cursor after toggle bullet, workaround it by adding a space.
 * The space will be removed by Edge after toggle bullet
 * @param editor The editor instance
 * @param callback The real callback function
 */
function workaroundForEdge(editor, callback) {
    var node = roosterjs_editor_dom_1.Browser.isEdge ? getNodeAtCursor_1.default(editor) : null;
    if (node && node.nodeType == 1 /* Element */ && node.textContent == '') {
        var span = editor.getDocument().createElement('span');
        node.insertBefore(span, node.firstChild);
        span.innerHTML = ZERO_WIDTH_SPACE;
        callback();
        if (span.parentNode) {
            span.parentNode.removeChild(span);
        }
    }
    else {
        callback();
    }
}
exports.workaroundForEdge = workaroundForEdge;
/**
 * Toggle bullet at selection
 * If selection contains bullet in deep level, toggle bullet will decrease the bullet level by one
 * If selection contains number list, toggle bullet will convert the number list into bullet list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * browser execCommand API
 * @param editor The editor instance
 */
function toggleBullet(editor) {
    editor.focus();
    editor.formatWithUndo(function () {
        workaroundForEdge(editor, function () {
            editor.getDocument().execCommand('insertUnorderedList', false, null);
        });
    });
}
exports.default = toggleBullet;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleHeader.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleHeader.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queryNodesWithSelection_1 = __webpack_require__(/*! ../cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
/**
 * Toggle header at selection
 * @param editor The editor instance
 * @param level The header level, can be a number from 0 to 6, in which 1 ~ 6 refers to
 * the HTML header element <H1> to <H6>, 0 means no header
 * if passed in param is outside the range, will be rounded to nearest number in the range
 */
function toggleHeader(editor, level) {
    level = Math.min(Math.max(Math.round(level), 0), 6);
    editor.formatWithUndo(function () {
        editor.focus();
        if (level > 0) {
            var traverser = editor.getContentTraverser(1 /* Selection */);
            var inlineElement = traverser ? traverser.currentInlineElement : null;
            while (inlineElement) {
                var node = roosterjs_editor_dom_1.getElementOrParentElement(inlineElement.getContainerNode());
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
                queryNodesWithSelection_1.default(editor, 'H' + i, false /*containsOnly*/, function (header) {
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

/***/ "./packages/roosterjs-editor-api/lib/format/toggleItalic.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleItalic.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggle_1 = __webpack_require__(/*! ./toggle */ "./packages/roosterjs-editor-api/lib/format/toggle.ts");
/**
 * Toggle italic at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only italic text, the italic style will be removed
 * If selection contains only normal text, italic style will be added to the whole selected text
 * If selection contains both italic and normal text, italic stlye will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleItalic(editor) {
    toggle_1.default(editor, 'italic');
}
exports.default = toggleItalic;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleNumbering.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleNumbering.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggleBullet_1 = __webpack_require__(/*! ./toggleBullet */ "./packages/roosterjs-editor-api/lib/format/toggleBullet.ts");
/**
 * Toggle numbering at selection
 * If selection contains numbering in deep level, toggle numbering will decrease the numbering level by one
 * If selection contains bullet list, toggle numbering will convert the bullet list into number list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * realization of browser execCommand API
 * @param editor The editor instance
 */
function toggleNumbering(editor) {
    editor.focus();
    editor.formatWithUndo(function () {
        toggleBullet_1.workaroundForEdge(editor, function () {
            editor.getDocument().execCommand('insertOrderedList', false, null);
        });
    });
}
exports.default = toggleNumbering;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleStrikethrough.ts":
/*!*************************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleStrikethrough.ts ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggle_1 = __webpack_require__(/*! ./toggle */ "./packages/roosterjs-editor-api/lib/format/toggle.ts");
/**
 * Toggle strikethrough at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only strikethrough text, the strikethrough style will be removed
 * If selection contains only normal text, strikethrough style will be added to the whole selected text
 * If selection contains both strikethrough and normal text, strikethrough stlye will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleStrikethrough(editor) {
    toggle_1.default(editor, 'strikeThrough');
}
exports.default = toggleStrikethrough;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleSubscript.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleSubscript.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggle_1 = __webpack_require__(/*! ./toggle */ "./packages/roosterjs-editor-api/lib/format/toggle.ts");
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
    toggle_1.default(editor, 'subscript');
}
exports.default = toggleSubscript;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleSuperscript.ts":
/*!***********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleSuperscript.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggle_1 = __webpack_require__(/*! ./toggle */ "./packages/roosterjs-editor-api/lib/format/toggle.ts");
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
    toggle_1.default(editor, 'superscript');
}
exports.default = toggleSuperscript;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/format/toggleUnderline.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/format/toggleUnderline.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var toggle_1 = __webpack_require__(/*! ./toggle */ "./packages/roosterjs-editor-api/lib/format/toggle.ts");
/**
 * Toggle underline at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only underlined text, the underline style will be removed
 * If selection contains only normal text, underline style will be added to the whole selected text
 * If selection contains both underlined and normal text, the underline style will be added to the whole selected text
 * @param editor The editor instance
 */
function toggleUnderline(editor) {
    toggle_1.default(editor, 'underline');
}
exports.default = toggleUnderline;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/index.ts":
/*!****************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cacheGetCursorEventData_1 = __webpack_require__(/*! ./cursor/cacheGetCursorEventData */ "./packages/roosterjs-editor-api/lib/cursor/cacheGetCursorEventData.ts");
exports.cacheGetCursorEventData = cacheGetCursorEventData_1.default;
exports.clearCursorEventDataCache = cacheGetCursorEventData_1.clearCursorEventDataCache;
var CursorData_1 = __webpack_require__(/*! ./cursor/CursorData */ "./packages/roosterjs-editor-api/lib/cursor/CursorData.ts");
exports.CursorData = CursorData_1.default;
var getCursorRect_1 = __webpack_require__(/*! ./cursor/getCursorRect */ "./packages/roosterjs-editor-api/lib/cursor/getCursorRect.ts");
exports.getCursorRect = getCursorRect_1.default;
var getNodeAtCursor_1 = __webpack_require__(/*! ./cursor/getNodeAtCursor */ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts");
exports.getNodeAtCursor = getNodeAtCursor_1.default;
exports.cacheGetNodeAtCursor = getNodeAtCursor_1.cacheGetNodeAtCursor;
var queryNodesWithSelection_1 = __webpack_require__(/*! ./cursor/queryNodesWithSelection */ "./packages/roosterjs-editor-api/lib/cursor/queryNodesWithSelection.ts");
exports.queryNodesWithSelection = queryNodesWithSelection_1.default;
var replaceRangeWithNode_1 = __webpack_require__(/*! ./cursor/replaceRangeWithNode */ "./packages/roosterjs-editor-api/lib/cursor/replaceRangeWithNode.ts");
exports.replaceRangeWithNode = replaceRangeWithNode_1.default;
var replaceTextBeforeCursorWithNode_1 = __webpack_require__(/*! ./cursor/replaceTextBeforeCursorWithNode */ "./packages/roosterjs-editor-api/lib/cursor/replaceTextBeforeCursorWithNode.ts");
exports.replaceTextBeforeCursorWithNode = replaceTextBeforeCursorWithNode_1.default;
exports.validateAndGetRangeForTextBeforeCursor = replaceTextBeforeCursorWithNode_1.validateAndGetRangeForTextBeforeCursor;
var getFormatState_1 = __webpack_require__(/*! ./cursor/getFormatState */ "./packages/roosterjs-editor-api/lib/cursor/getFormatState.ts");
exports.getFormatState = getFormatState_1.default;
var cacheGetListTag_1 = __webpack_require__(/*! ./cursor/cacheGetListTag */ "./packages/roosterjs-editor-api/lib/cursor/cacheGetListTag.ts");
exports.cacheGetListTag = cacheGetListTag_1.default;
var clearFormat_1 = __webpack_require__(/*! ./format/clearFormat */ "./packages/roosterjs-editor-api/lib/format/clearFormat.ts");
exports.clearFormat = clearFormat_1.default;
var createLink_1 = __webpack_require__(/*! ./format/createLink */ "./packages/roosterjs-editor-api/lib/format/createLink.ts");
exports.createLink = createLink_1.default;
var insertImage_1 = __webpack_require__(/*! ./format/insertImage */ "./packages/roosterjs-editor-api/lib/format/insertImage.ts");
exports.insertImage = insertImage_1.default;
var removeLink_1 = __webpack_require__(/*! ./format/removeLink */ "./packages/roosterjs-editor-api/lib/format/removeLink.ts");
exports.removeLink = removeLink_1.default;
var setAlignment_1 = __webpack_require__(/*! ./format/setAlignment */ "./packages/roosterjs-editor-api/lib/format/setAlignment.ts");
exports.setAlignment = setAlignment_1.default;
var setBackgroundColor_1 = __webpack_require__(/*! ./format/setBackgroundColor */ "./packages/roosterjs-editor-api/lib/format/setBackgroundColor.ts");
exports.setBackgroundColor = setBackgroundColor_1.default;
var setTextColor_1 = __webpack_require__(/*! ./format/setTextColor */ "./packages/roosterjs-editor-api/lib/format/setTextColor.ts");
exports.setTextColor = setTextColor_1.default;
var setDirection_1 = __webpack_require__(/*! ./format/setDirection */ "./packages/roosterjs-editor-api/lib/format/setDirection.ts");
exports.setDirection = setDirection_1.default;
var setFontName_1 = __webpack_require__(/*! ./format/setFontName */ "./packages/roosterjs-editor-api/lib/format/setFontName.ts");
exports.setFontName = setFontName_1.default;
var setFontSize_1 = __webpack_require__(/*! ./format/setFontSize */ "./packages/roosterjs-editor-api/lib/format/setFontSize.ts");
exports.setFontSize = setFontSize_1.default;
var setImageAltText_1 = __webpack_require__(/*! ./format/setImageAltText */ "./packages/roosterjs-editor-api/lib/format/setImageAltText.ts");
exports.setImageAltText = setImageAltText_1.default;
var setIndentation_1 = __webpack_require__(/*! ./format/setIndentation */ "./packages/roosterjs-editor-api/lib/format/setIndentation.ts");
exports.setIndentation = setIndentation_1.default;
var toggleBold_1 = __webpack_require__(/*! ./format/toggleBold */ "./packages/roosterjs-editor-api/lib/format/toggleBold.ts");
exports.toggleBold = toggleBold_1.default;
var toggleBullet_1 = __webpack_require__(/*! ./format/toggleBullet */ "./packages/roosterjs-editor-api/lib/format/toggleBullet.ts");
exports.toggleBullet = toggleBullet_1.default;
var toggleItalic_1 = __webpack_require__(/*! ./format/toggleItalic */ "./packages/roosterjs-editor-api/lib/format/toggleItalic.ts");
exports.toggleItalic = toggleItalic_1.default;
var toggleNumbering_1 = __webpack_require__(/*! ./format/toggleNumbering */ "./packages/roosterjs-editor-api/lib/format/toggleNumbering.ts");
exports.toggleNumbering = toggleNumbering_1.default;
var toggleBlockQuote_1 = __webpack_require__(/*! ./format/toggleBlockQuote */ "./packages/roosterjs-editor-api/lib/format/toggleBlockQuote.ts");
exports.toggleBlockQuote = toggleBlockQuote_1.default;
var toggleStrikethrough_1 = __webpack_require__(/*! ./format/toggleStrikethrough */ "./packages/roosterjs-editor-api/lib/format/toggleStrikethrough.ts");
exports.toggleStrikethrough = toggleStrikethrough_1.default;
var toggleSubscript_1 = __webpack_require__(/*! ./format/toggleSubscript */ "./packages/roosterjs-editor-api/lib/format/toggleSubscript.ts");
exports.toggleSubscript = toggleSubscript_1.default;
var toggleSuperscript_1 = __webpack_require__(/*! ./format/toggleSuperscript */ "./packages/roosterjs-editor-api/lib/format/toggleSuperscript.ts");
exports.toggleSuperscript = toggleSuperscript_1.default;
var toggleUnderline_1 = __webpack_require__(/*! ./format/toggleUnderline */ "./packages/roosterjs-editor-api/lib/format/toggleUnderline.ts");
exports.toggleUnderline = toggleUnderline_1.default;
var toggleHeader_1 = __webpack_require__(/*! ./format/toggleHeader */ "./packages/roosterjs-editor-api/lib/format/toggleHeader.ts");
exports.toggleHeader = toggleHeader_1.default;
var VTable_1 = __webpack_require__(/*! ./table/VTable */ "./packages/roosterjs-editor-api/lib/table/VTable.ts");
exports.VTable = VTable_1.default;
var insertTable_1 = __webpack_require__(/*! ./table/insertTable */ "./packages/roosterjs-editor-api/lib/table/insertTable.ts");
exports.insertTable = insertTable_1.default;
var editTable_1 = __webpack_require__(/*! ./table/editTable */ "./packages/roosterjs-editor-api/lib/table/editTable.ts");
exports.editTable = editTable_1.default;
var formatTable_1 = __webpack_require__(/*! ./table/formatTable */ "./packages/roosterjs-editor-api/lib/table/formatTable.ts");
exports.formatTable = formatTable_1.default;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/table/VTable.ts":
/*!***********************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/table/VTable.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A virtual table class, represent an HTML table, by expand all merged cells to each separated cells
 */
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
    /**
     * Write the virtual table back to DOM tree to represent the change of VTable
     */
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
    /**
     * Apply the given table format to this virtual table
     * @param format Table format to apply
     */
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
    /**
     * Loop each cell of current column and invoke a callback function
     * @param callback The callback function to invoke
     */
    VTable.prototype.forEachCellOfCurrentColumn = function (callback) {
        for (var i = 0; i < this.cells.length; i++) {
            callback(this.getCell(i, this.col), this.cells[i], i);
        }
    };
    /**
     * Loop each cell of current row and invoke a callback function
     * @param callback The callback function to invoke
     */
    VTable.prototype.forEachCellOfCurrentRow = function (callback) {
        for (var i = 0; i < this.cells[this.row].length; i++) {
            callback(this.getCell(this.row, i), i);
        }
    };
    /**
     * Get a table cell using its row and column index. This function will always return an object
     * even if the given indexes don't exist in table.
     * @param row The row index
     * @param col The column index
     */
    VTable.prototype.getCell = function (row, col) {
        return (this.cells && this.cells[row] && this.cells[row][col]) || {};
    };
    /**
     * Get current HTML table cell object. If the current table cell is a virtual expanded cell, return its root cell
     */
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
    /**
     * Move all children from one node to another
     * @param fromNode The source node to move children from
     * @param toNode Target node. If not passed, children nodes of source node will be removed
     */
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
    /**
     * Clone a node without its children.
     * @param node The node to clone
     */
    VTable.cloneNode = function (node) {
        var newNode = node ? node.cloneNode(false /*deep*/) : null;
        if (newNode && newNode instanceof HTMLTableCellElement && !newNode.firstChild) {
            newNode.appendChild(node.ownerDocument.createElement('br'));
        }
        return newNode;
    };
    /**
     * Clone a table cell
     * @param cell The cell to clone
     */
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

/***/ "./packages/roosterjs-editor-api/lib/table/editTable.ts":
/*!**************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/table/editTable.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VTable_1 = __webpack_require__(/*! ./VTable */ "./packages/roosterjs-editor-api/lib/table/VTable.ts");
var getNodeAtCursor_1 = __webpack_require__(/*! ../cursor/getNodeAtCursor */ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts");
/**
 * Edit table with given operation. If there is no table at cursor then no op.
 * @param editor The editor instance
 * @param operation Table operation
 */
function editTable(editor, operation) {
    var td = getNodeAtCursor_1.default(editor, 'TD');
    if (td) {
        editor.formatWithUndo(function () {
            var vtable = new VTable_1.default(td);
            var currentRow = vtable.cells[vtable.row];
            var currentCell = currentRow[vtable.col];
            switch (operation) {
                case 0 /* InsertAbove */:
                case 1 /* InsertBelow */:
                    var newRow = vtable.row + (operation == 0 /* InsertAbove */ ? 0 : 1);
                    vtable.cells.splice(newRow, 0, currentRow.map(function (cell) { return VTable_1.default.cloneCell(cell); }));
                    break;
                case 2 /* InsertLeft */:
                case 3 /* InsertRight */:
                    var newCol_1 = vtable.col + (operation == 2 /* InsertLeft */ ? 0 : 1);
                    vtable.forEachCellOfCurrentColumn(function (cell, row) {
                        row.splice(newCol_1, 0, VTable_1.default.cloneCell(cell));
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
                                VTable_1.default.moveChildren(belowCell.td, aboveCell.td);
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
                                VTable_1.default.moveChildren(rightCell.td, leftCell.td);
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
                        vtable.getCell(vtable.row + 1, vtable.col).td = VTable_1.default.cloneNode(currentCell.td);
                    }
                    else {
                        var splitRow = currentRow.map(function (cell) {
                            return {
                                td: cell == currentCell ? VTable_1.default.cloneNode(cell.td) : null,
                                spanAbove: cell != currentCell,
                                spanLeft: cell.spanLeft,
                            };
                        });
                        vtable.cells.splice(vtable.row + 1, 0, splitRow);
                    }
                    break;
                case 11 /* SplitHorizontally */:
                    if (currentCell.td.colSpan > 1) {
                        vtable.getCell(vtable.row, vtable.col + 1).td = VTable_1.default.cloneNode(currentCell.td);
                    }
                    else {
                        vtable.forEachCellOfCurrentColumn(function (cell, row) {
                            row.splice(vtable.col + 1, 0, {
                                td: row == currentRow ? VTable_1.default.cloneNode(cell.td) : null,
                                spanAbove: cell.spanAbove,
                                spanLeft: row != currentRow,
                            });
                        });
                    }
                    break;
            }
            vtable.writeBack();
            td = editor.contains(td) ? td : vtable.getCurrentTd();
            editor.focus();
            return td;
        }, true /*preserveSelection*/);
    }
}
exports.default = editTable;


/***/ }),

/***/ "./packages/roosterjs-editor-api/lib/table/formatTable.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/table/formatTable.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VTable_1 = __webpack_require__(/*! ./VTable */ "./packages/roosterjs-editor-api/lib/table/VTable.ts");
var getNodeAtCursor_1 = __webpack_require__(/*! ../cursor/getNodeAtCursor */ "./packages/roosterjs-editor-api/lib/cursor/getNodeAtCursor.ts");
/**
 * Format table
 * @param table The table to format
 * @param formatName Name of the format to use
 */
function formatTable(editor, format, table) {
    var td = table
        ? table.rows[0].cells[0]
        : getNodeAtCursor_1.default(editor, 'TD');
    if (td) {
        editor.formatWithUndo(function () {
            var vtable = new VTable_1.default(td);
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

/***/ "./packages/roosterjs-editor-api/lib/table/insertTable.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-api/lib/table/insertTable.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var formatTable_1 = __webpack_require__(/*! ./formatTable */ "./packages/roosterjs-editor-api/lib/table/formatTable.ts");
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
    editor.formatWithUndo(function () {
        editor.insertNode(fragment);
        formatTable_1.default(editor, format || {
            bgColorEven: '#FFF',
            bgColorOdd: '#FFF',
            topBorderColor: '#ABABAB',
            bottomBorderColor: '#ABABAB',
            verticalBorderColor: '#ABABAB',
        }, table);
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

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/attachDomEvent.ts":
/*!**********************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/attachDomEvent.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var triggerEvent_1 = __webpack_require__(/*! ./triggerEvent */ "./packages/roosterjs-editor-core/lib/coreAPI/triggerEvent.ts");
function attachDomEvent(core, eventName, pluginEventType, beforeDispatch) {
    var onEvent = function (event) {
        if (beforeDispatch) {
            beforeDispatch(event);
        }
        if (pluginEventType != null) {
            triggerEvent_1.default(core, {
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
}
exports.default = attachDomEvent;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/focus.ts":
/*!*************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/focus.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getLiveRange_1 = __webpack_require__(/*! ./getLiveRange */ "./packages/roosterjs-editor-core/lib/coreAPI/getLiveRange.ts");
var hasFocus_1 = __webpack_require__(/*! ./hasFocus */ "./packages/roosterjs-editor-core/lib/coreAPI/hasFocus.ts");
var isVoidHtmlElement_1 = __webpack_require__(/*! ../utils/isVoidHtmlElement */ "./packages/roosterjs-editor-core/lib/utils/isVoidHtmlElement.ts");
var select_1 = __webpack_require__(/*! ./select */ "./packages/roosterjs-editor-core/lib/coreAPI/select.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
function focus(core) {
    if (!hasFocus_1.default(core) || !getLiveRange_1.default(core)) {
        // Focus (document.activeElement indicates) and selection are mostly in sync, but could be out of sync in some extreme cases.
        // i.e. if you programmatically change window selection to point to a non-focusable DOM element (i.e. tabindex=-1 etc.).
        // On Chrome/Firefox, it does not change document.activeElement. On Edge/IE, it change document.activeElement to be body
        // Although on Chrome/Firefox, document.activeElement points to editor, you cannot really type which we don't want (no cursor).
        // So here we always do a live selection pull on DOM and make it point in Editor. The pitfall is, the cursor could be reset
        // to very begin to of editor since we don't really have last saved selection (created on blur which does not fire in this case).
        // It should be better than the case you cannot type
        if (!(core.cachedRange && select_1.default(core, core.cachedRange))) {
            setSelectionToBegin(core);
        }
    }
    // remember to clear cachedRange
    core.cachedRange = null;
    // This is more a fallback to ensure editor gets focus if it didn't manage to move focus to editor
    if (!hasFocus_1.default(core)) {
        core.contentDiv.focus();
    }
}
exports.default = focus;
function setSelectionToBegin(core) {
    var firstNode = roosterjs_editor_dom_1.getFirstLeafNode(core.contentDiv);
    var nodeType = firstNode ? firstNode.nodeType : null;
    if (nodeType == 3 /* Text */) {
        // First node is text, move selection to the begin
        select_1.default(core, firstNode, 0);
    }
    else if (nodeType == 1 /* Element */) {
        // If first node is a html void element (void elements cannot have child nodes),
        // move selection before it, otherwise move selection inside it
        select_1.default(core, firstNode, isVoidHtmlElement_1.default(firstNode) ? roosterjs_editor_dom_1.Position.Before : 0);
    }
    else {
        // No first node, likely we have an empty content DIV, move selection inside it
        select_1.default(core, core.contentDiv, 0);
    }
}


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/formatWithUndo.ts":
/*!**********************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/formatWithUndo.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getLiveRange_1 = __webpack_require__(/*! ../coreAPI/getLiveRange */ "./packages/roosterjs-editor-core/lib/coreAPI/getLiveRange.ts");
var select_1 = __webpack_require__(/*! ../coreAPI/select */ "./packages/roosterjs-editor-core/lib/coreAPI/select.ts");
var lib_1 = __webpack_require__(/*! roosterjs-editor-dom/lib */ "./packages/roosterjs-editor-dom/lib/index.ts");
var triggerEvent_1 = __webpack_require__(/*! ./triggerEvent */ "./packages/roosterjs-editor-core/lib/coreAPI/triggerEvent.ts");
function formatWithUndo(core, callback, preserveSelection, changeSource, dataCallback, skipAddingUndoAfterFormat) {
    var isNested = core.suspendAddingUndoSnapshot;
    if (!isNested) {
        core.undo.addUndoSnapshot();
        core.suspendAddingUndoSnapshot = true;
    }
    try {
        if (callback) {
            if (preserveSelection) {
                var range = getLiveRange_1.default(core) || core.cachedRange;
                var selectionRange = range && new lib_1.SelectionRange(range).normalize();
                var fallbackNode = callback();
                if (!select_1.default(core, selectionRange) && fallbackNode instanceof Node) {
                    select_1.default(core, fallbackNode);
                }
            }
            else {
                callback();
            }
            if (!isNested && changeSource) {
                var event_1 = {
                    eventType: 6 /* ContentChanged */,
                    source: changeSource,
                    data: dataCallback ? dataCallback() : null,
                };
                triggerEvent_1.default(core, event_1, true /*broadcast*/);
            }
            if (!isNested && !skipAddingUndoAfterFormat) {
                core.undo.addUndoSnapshot();
            }
        }
    }
    finally {
        if (!isNested) {
            core.suspendAddingUndoSnapshot = false;
        }
    }
}
exports.default = formatWithUndo;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/getLiveRange.ts":
/*!********************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/getLiveRange.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
function getLiveRange(core) {
    var selection = core.document.defaultView.getSelection();
    if (selection && selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        if (roosterjs_editor_dom_1.contains(core.contentDiv, range)) {
            return range;
        }
    }
    return null;
}
exports.default = getLiveRange;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/hasFocus.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/hasFocus.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
function hasFocus(core) {
    return roosterjs_editor_dom_1.contains(core.contentDiv, core.document.activeElement, true /*treatSameNodeAsContain*/);
}
exports.default = hasFocus;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/insertNode.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/insertNode.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var focus_1 = __webpack_require__(/*! ./focus */ "./packages/roosterjs-editor-core/lib/coreAPI/focus.ts");
var getLiveRange_1 = __webpack_require__(/*! ./getLiveRange */ "./packages/roosterjs-editor-core/lib/coreAPI/getLiveRange.ts");
var isVoidHtmlElement_1 = __webpack_require__(/*! ../utils/isVoidHtmlElement */ "./packages/roosterjs-editor-core/lib/utils/isVoidHtmlElement.ts");
var select_1 = __webpack_require__(/*! ./select */ "./packages/roosterjs-editor-core/lib/coreAPI/select.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var HTML_EMPTY_DIV = '<div></div>';
function insertNode(core, node, option) {
    var position = option ? option.position : 2 /* SelectionStart */;
    var updateCursor = option ? option.updateCursor : true;
    var replaceSelection = option ? option.replaceSelection : true;
    var insertOnNewLine = option ? option.insertOnNewLine : false;
    if (updateCursor) {
        focus_1.default(core);
    }
    switch (position) {
        case 0 /* Begin */:
        case 1 /* End */:
            var isBegin = position == 0 /* Begin */;
            var contentDiv = core.contentDiv;
            var block = roosterjs_editor_dom_1.getBlockElementAtNode(contentDiv, roosterjs_editor_dom_1.getLeafNode(contentDiv, isBegin));
            var insertedNode = void 0;
            if (block) {
                var refNode = isBegin ? block.getStartNode() : block.getEndNode();
                var refParentNode = refNode.parentNode;
                if (insertOnNewLine ||
                    refNode.nodeType == 3 /* Text */ ||
                    isVoidHtmlElement_1.default(refNode)) {
                    // For insert on new line, or refNode is text or void html element (HR, BR etc.)
                    // which cannot have children, i.e. <div>hello<br>world</div>. 'hello', 'world' are the
                    // first and last node. Insert before 'hello' or after 'world', but still inside DIV
                    insertedNode = refParentNode.insertBefore(node, isBegin ? refNode : refNode.nextSibling);
                }
                else {
                    // if the refNode can have child, use appendChild (which is like to insert as first/last child)
                    // i.e. <div>hello</div>, the content will be inserted before/after hello
                    insertedNode = refNode.insertBefore(node, isBegin ? refNode.firstChild : null);
                }
            }
            else {
                // No last block, editor is likely empty, use appendChild
                insertedNode = core.contentDiv.appendChild(node);
            }
            // Final check to see if the inserted node is a block. If not block and the ask is to insert on new line,
            // add a DIV wrapping
            if (insertedNode && insertOnNewLine && !roosterjs_editor_dom_1.isBlockElement(insertedNode)) {
                roosterjs_editor_dom_1.wrap(insertedNode, HTML_EMPTY_DIV);
            }
            break;
        case 2 /* SelectionStart */:
            var rawRange = getLiveRange_1.default(core) || core.cachedRange;
            if (rawRange) {
                // if to replace the selection and the selection is not collapsed, remove the the content at selection first
                if (replaceSelection && !rawRange.collapsed) {
                    rawRange.deleteContents();
                }
                // Create a clone (backup) for the selection first as we may need to restore to it later
                var clonedRange = new roosterjs_editor_dom_1.SelectionRange(rawRange);
                var blockElement = roosterjs_editor_dom_1.getBlockElementAtNode(core.contentDiv, rawRange.startContainer);
                if (blockElement) {
                    var endNode = blockElement.getEndNode();
                    if (insertOnNewLine) {
                        // Adjust the insertion point
                        // insertOnNewLine means to insert on a block after the selection, not really right at the selection
                        // This is commonly used when users want to insert signature. They could place cursor somewhere mid of a line
                        // and insert signature, they actually want signature to be inserted the line after the selection
                        rawRange.setEndAfter(endNode);
                        rawRange.collapse(false /*toStart*/);
                    }
                    else {
                        if (roosterjs_editor_dom_1.getTagOfNode(endNode) == 'P') {
                            // Insert into a P tag may cause issues when the inserted content contains any block element.
                            // Change P tag to DIV to make sure it works well
                            var rangeCache = new roosterjs_editor_dom_1.SelectionRange(rawRange).normalize();
                            var div = roosterjs_editor_dom_1.changeElementTag(endNode, 'div');
                            if (rangeCache.start.node != div &&
                                rangeCache.end.node != div &&
                                roosterjs_editor_dom_1.contains(core.contentDiv, rangeCache)) {
                                rawRange = rangeCache.getRange();
                            }
                        }
                        if (isVoidHtmlElement_1.default(rawRange.endContainer)) {
                            rawRange.setEndBefore(rawRange.endContainer);
                        }
                    }
                }
                var nodeForCursor = node.nodeType == 11 /* DocumentFragment */ ? node.lastChild : node;
                rawRange.insertNode(node);
                if (updateCursor && nodeForCursor) {
                    select_1.default(core, nodeForCursor, roosterjs_editor_dom_1.Position.After);
                }
                else {
                    select_1.default(core, clonedRange);
                }
            }
            break;
        case 3 /* Outside */:
            core.contentDiv.parentNode.insertBefore(node, core.contentDiv.nextSibling);
            break;
    }
    return true;
}
exports.default = insertNode;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/select.ts":
/*!**************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/select.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var hasFocus_1 = __webpack_require__(/*! ./hasFocus */ "./packages/roosterjs-editor-core/lib/coreAPI/hasFocus.ts");
var roosterjs_editor_dom_2 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
function select(core, arg1, arg2, arg3, arg4) {
    var rawRange;
    if (!arg1) {
        return false;
    }
    else if (arg1 instanceof Range) {
        rawRange = arg1;
    }
    else {
        var range = void 0;
        if (arg1.start && arg1.end) {
            range = arg1;
        }
        else if (arg1.node) {
            range = new roosterjs_editor_dom_1.SelectionRange(new roosterjs_editor_dom_1.Position(arg1), arg2 && arg2.node ? new roosterjs_editor_dom_1.Position(arg2) : null);
        }
        else if (arg1 instanceof Node) {
            var start = void 0;
            var end = void 0;
            if (arg2 == undefined) {
                start = new roosterjs_editor_dom_1.Position(arg1, roosterjs_editor_dom_1.Position.Before);
                end = new roosterjs_editor_dom_1.Position(arg1, roosterjs_editor_dom_1.Position.After);
            }
            else {
                start = new roosterjs_editor_dom_1.Position(arg1, arg2);
                end =
                    arg3 instanceof Node
                        ? new roosterjs_editor_dom_1.Position(arg3, arg4)
                        : null;
            }
            range = new roosterjs_editor_dom_1.SelectionRange(start, end);
        }
        rawRange = range.getRange();
    }
    if (roosterjs_editor_dom_2.contains(core.contentDiv, rawRange)) {
        var selection = core.document.defaultView.getSelection();
        if (selection) {
            if (selection.rangeCount > 0) {
                selection.removeAllRanges();
            }
            selection.addRange(rawRange);
            if (!hasFocus_1.default(core)) {
                core.cachedRange = rawRange;
            }
            return true;
        }
    }
    return false;
}
exports.default = select;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/startIdleLoop.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/startIdleLoop.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var triggerEvent_1 = __webpack_require__(/*! ./triggerEvent */ "./packages/roosterjs-editor-core/lib/coreAPI/triggerEvent.ts");
/**
 * Start a loop to trigger Idle event
 * @param core EditorCore object
 * @param interval Interval of idle event
 */
function startIdleLoop(core, interval) {
    var win = core.contentDiv.ownerDocument.defaultView || window;
    core.idleLoopHandle = win.setInterval(function () {
        if (core.ignoreIdleEvent) {
            core.ignoreIdleEvent = false;
        }
        else {
            triggerEvent_1.default(core, {
                eventType: 9 /* Idle */,
            }, true /*broadcast*/);
        }
    }, interval);
}
exports.default = startIdleLoop;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/coreAPI/triggerEvent.ts":
/*!********************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/coreAPI/triggerEvent.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function triggerEvent(core, pluginEvent, broadcast) {
    var isHandledExclusively = false;
    if (!broadcast) {
        for (var i = 0; i < core.plugins.length; i++) {
            var plugin = core.plugins[i];
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
        core.plugins.forEach(function (plugin) {
            if (plugin.onPluginEvent) {
                plugin.onPluginEvent(pluginEvent);
            }
        });
    }
}
exports.default = triggerEvent;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/editor/Editor.ts":
/*!*************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/editor/Editor.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditorCore_1 = __webpack_require__(/*! ./EditorCore */ "./packages/roosterjs-editor-core/lib/editor/EditorCore.ts");
var formatWithUndo_1 = __webpack_require__(/*! ../coreAPI/formatWithUndo */ "./packages/roosterjs-editor-core/lib/coreAPI/formatWithUndo.ts");
var attachDomEvent_1 = __webpack_require__(/*! ../coreAPI/attachDomEvent */ "./packages/roosterjs-editor-core/lib/coreAPI/attachDomEvent.ts");
var focus_1 = __webpack_require__(/*! ../coreAPI/focus */ "./packages/roosterjs-editor-core/lib/coreAPI/focus.ts");
var getLiveRange_1 = __webpack_require__(/*! ../coreAPI/getLiveRange */ "./packages/roosterjs-editor-core/lib/coreAPI/getLiveRange.ts");
var hasFocus_1 = __webpack_require__(/*! ../coreAPI/hasFocus */ "./packages/roosterjs-editor-core/lib/coreAPI/hasFocus.ts");
var insertNode_1 = __webpack_require__(/*! ../coreAPI/insertNode */ "./packages/roosterjs-editor-core/lib/coreAPI/insertNode.ts");
var select_1 = __webpack_require__(/*! ../coreAPI/select */ "./packages/roosterjs-editor-core/lib/coreAPI/select.ts");
var startIdleLoop_1 = __webpack_require__(/*! ../coreAPI/startIdleLoop */ "./packages/roosterjs-editor-core/lib/coreAPI/startIdleLoop.ts");
var triggerEvent_1 = __webpack_require__(/*! ../coreAPI/triggerEvent */ "./packages/roosterjs-editor-core/lib/coreAPI/triggerEvent.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var IS_IE_OR_EDGE = roosterjs_editor_dom_1.Browser.isIE || roosterjs_editor_dom_1.Browser.isEdge;
/**
 * RoosterJs core editor class
 */
var Editor = /** @class */ (function () {
    //#region Editor Lifecycle
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    function Editor(contentDiv, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        /**
         * Check if user is typing right under the content div
         * When typing goes directly under content div, many things can go wrong
         * We fix it by wrapping it with a div and reposition cursor within the div
         */
        this.onKeyPress = function () {
            var range = getLiveRange_1.default(_this.core);
            if (range &&
                range.collapsed &&
                roosterjs_editor_dom_1.getElementOrParentElement(range.startContainer) == _this.core.contentDiv &&
                !_this.select(_this.fixContentStructure(range.startContainer), 0)) {
                _this.select(range);
            }
        };
        // 1. Make sure all parameters are valid
        if (roosterjs_editor_dom_1.getTagOfNode(contentDiv) != 'DIV') {
            throw new Error('contentDiv must be an HTML DIV element');
        }
        // 2. Store options values to local variables
        this.core = EditorCore_1.default.create(contentDiv, options);
        this.disableRestoreSelectionOnFocus = options.disableRestoreSelectionOnFocus;
        this.omitContentEditable = options.omitContentEditableAttributeChanges;
        this.defaultRange = this.getDocument().createRange();
        this.defaultRange.setStart(this.core.contentDiv, 0);
        // 3. Initialize plugins
        this.core.plugins.forEach(function (plugin) { return plugin.initialize(_this); });
        // 4. Ensure initial content and its format
        this.setContent(options.initialContent || this.core.contentDiv.innerHTML);
        this.fixContentStructure(roosterjs_editor_dom_1.getFirstLeafNode(contentDiv));
        // 5. Initialize undo service
        this.core.undo.initialize(this);
        this.core.plugins.push(this.core.undo);
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
            var document_1 = this.core.document;
            document_1.execCommand('enableObjectResizing', false, false);
            document_1.execCommand('enableInlineTableEditing', false, false);
        }
        catch (e) { }
        // 9. Start a timer loop if required
        if (options.idleEventTimeSpanInSecond > 0) {
            startIdleLoop_1.default(this.core, options.idleEventTimeSpanInSecond * 1000);
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
    //#endregion
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
        return node ? insertNode_1.default(this.core, node, option) : false;
    };
    /**
     * Delete a node from editor content
     * @param node The node to delete
     * @returns true if node is deleted. Otherwise false
     */
    Editor.prototype.deleteNode = function (node) {
        // Only remove the node when it falls within editor
        if (this.contains(node)) {
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
        if (toNode && this.contains(existingNode)) {
            existingNode.parentNode.replaceChild(toNode, existingNode);
            return true;
        }
        return false;
    };
    /**
     * Get BlockElement at given node
     * @param node The node to create InlineElement
     * @requires The BlockElement result
     */
    Editor.prototype.getBlockElementAtNode = function (node) {
        return this.contains(node) ? roosterjs_editor_dom_1.getBlockElementAtNode(this.core.contentDiv, node) : null;
    };
    Editor.prototype.contains = function (arg) {
        return roosterjs_editor_dom_1.contains(this.core.contentDiv, arg);
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
     * @param callbackBeforeTriggerContentChangedEvent An optional callback function, will be called before ContentChangedEvent is triggered
     */
    Editor.prototype.setContent = function (content, callbackBeforeTriggerContentChangedEvent) {
        this.core.contentDiv.innerHTML = content || '';
        if (callbackBeforeTriggerContentChangedEvent) {
            callbackBeforeTriggerContentChangedEvent();
        }
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
     * @param sanitize True to do sanitizeHtml before insert, otherwise false
     */
    Editor.prototype.insertContent = function (content, option, sanitize) {
        if (content) {
            var allNodes = roosterjs_editor_dom_1.fromHtml(content, this.getDocument(), sanitize);
            // If it is to insert on new line, and there are more than one node in the collection, wrap all nodes with
            // a parent DIV before calling insertNode on each top level sub node. Otherwise, every sub node may get wrapped
            // separately to show up on its own line
            if (option && option.insertOnNewLine && allNodes.length > 0) {
                allNodes = [roosterjs_editor_dom_1.wrap(allNodes)];
            }
            for (var i = 0; i < allNodes.length; i++) {
                this.insertNode(allNodes[i], option);
            }
        }
    };
    /**
     * DOM query nodes in editor
     * @param selector Selector string to query
     * @param forEachCallback An optional callback to be invoked on each node in query result
     * @returns Node list of the query result
     */
    Editor.prototype.queryNodes = function (selector, forEachCallback) {
        var nodes = [].slice.call(this.core.contentDiv.querySelectorAll(selector));
        if (forEachCallback) {
            nodes.forEach(forEachCallback);
        }
        return nodes;
    };
    //#endregion
    //#region Focus and Selection
    Editor.prototype.getSelectionRange = function () {
        return new roosterjs_editor_dom_1.SelectionRange(getLiveRange_1.default(this.core) || this.core.cachedRange || this.defaultRange);
    };
    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    Editor.prototype.hasFocus = function () {
        return hasFocus_1.default(this.core);
    };
    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    Editor.prototype.focus = function () {
        focus_1.default(this.core);
    };
    Editor.prototype.select = function (arg1, arg2, arg3, arg4) {
        return select_1.default(this.core, arg1, arg2, arg3, arg4);
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
        return attachDomEvent_1.default(this.core, eventName, null /*pluginEventType*/, handler);
    };
    /**
     * Trigger an event to be dispatched to all plugins
     * @param pluginEvent The event object to trigger
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     */
    Editor.prototype.triggerEvent = function (pluginEvent, broadcast) {
        if (broadcast === void 0) { broadcast = true; }
        triggerEvent_1.default(this.core, pluginEvent, broadcast);
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
        this.core.undo.undo();
    };
    /**
     * Redo next edit operation
     */
    Editor.prototype.redo = function () {
        this.focus();
        this.core.undo.redo();
    };
    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot if
     * addsnapshotAfterFormat is set to true, finally trigger ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting
     * @param preserveSelection Set to true to try preserve the selection after format
     * @param addsnapshotAfterFormat Whether should add an undo snapshot after format callback is called
     * @param changeSource The change source to use when fire ContentChangedEvent. Default value is 'Format'
     * If pass null, the event will not be fired.
     * @param dataCallback A callback function to retrieve the data for ContentChangedEvent
     * @param skipAddingUndoAfterFormat Set to true to only add undo snapshot before format. Default value is false
     */
    Editor.prototype.formatWithUndo = function (callback, preserveSelection, changeSource, dataCallback, skipAddingUndoAfterFormat) {
        if (preserveSelection === void 0) { preserveSelection = false; }
        if (changeSource === void 0) { changeSource = "Format" /* Format */; }
        if (skipAddingUndoAfterFormat === void 0) { skipAddingUndoAfterFormat = false; }
        formatWithUndo_1.default(this.core, callback, preserveSelection, changeSource, dataCallback, skipAddingUndoAfterFormat);
    };
    /**
     * Whether there is an available undo snapshot
     */
    Editor.prototype.canUndo = function () {
        return this.core.undo.canUndo();
    };
    /**
     * Whether there is an available redo snapshot
     */
    Editor.prototype.canRedo = function () {
        return this.core.undo.canRedo();
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
        var customData = this.core.customData;
        return (customData[key] = customData[key] || {
            value: getter(),
            disposer: disposer,
        }).value;
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
        return new roosterjs_editor_dom_1.ContentTraverser(this.core.contentDiv, scope, this.getSelectionRange(), position);
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
            attachDomEvent_1.default(this.core, 'keypress', 1 /* KeyPress */, this.onKeyPress),
            attachDomEvent_1.default(this.core, 'keydown', 0 /* KeyDown */),
            attachDomEvent_1.default(this.core, 'keyup', 2 /* KeyUp */),
            attachDomEvent_1.default(this.core, 'mousedown', 4 /* MouseDown */),
            attachDomEvent_1.default(this.core, 'mouseup', 5 /* MouseUp */),
            attachDomEvent_1.default(this.core, 'compositionstart', null, function () { return (_this.inIME = true); }),
            attachDomEvent_1.default(this.core, 'compositionend', 3 /* CompositionEnd */, function () {
                _this.inIME = false;
                _this.onKeyPress();
            }),
            attachDomEvent_1.default(this.core, 'focus', null, function () {
                // Restore the last saved selection first
                if (_this.core.cachedRange && !_this.disableRestoreSelectionOnFocus) {
                    _this.select(_this.core.cachedRange);
                }
                _this.core.cachedRange = null;
            }),
            attachDomEvent_1.default(this.core, IS_IE_OR_EDGE ? 'beforedeactivate' : 'blur', null, function () {
                _this.core.cachedRange = getLiveRange_1.default(_this.core);
            }),
            attachDomEvent_1.default(this.core, 'drop', null, function () {
                _this.formatWithUndo(null, false /*preserveSelection*/, "Drop" /* Drop */);
            }),
        ];
    };
    /**
     * Check if user will type right under the content div
     * When typing goes directly under content div, many things can go wrong
     * We fix it by wrapping it with a div and reposition cursor within the div
     */
    Editor.prototype.fixContentStructure = function (node) {
        var block = this.getBlockElementAtNode(node);
        var startNode = block ? block.getStartNode() : null;
        var formatElement;
        var nodeToSelect;
        if (!block) {
            // Only reason we can't get the selection block is that we have an empty content div
            // which can happen when nothing is set to initial content, or user removes everything
            // (i.e. select all and DEL, or backspace from very end to begin).
            // The fix is to add a DIV wrapping, apply default format and move cursor over
            formatElement = roosterjs_editor_dom_1.fromHtml('<div><br></div>', this.getDocument())[0];
            this.core.contentDiv.appendChild(formatElement);
            // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
            nodeToSelect = formatElement.firstChild;
        }
        else if (block instanceof roosterjs_editor_dom_1.NodeBlockElement) {
            // if the block is empty, apply default format
            // Otherwise, leave it as it is as we don't want to change the style for existing data
            formatElement = roosterjs_editor_dom_1.isNodeEmpty(startNode) ? startNode : null;
        }
        else if (startNode.parentNode == block.getEndNode().parentNode) {
            // Only fix the balanced start-end block where start and end node is under same parent
            // The focus node could be pointing to the content div, normalize it to have it point to a child first
            formatElement = roosterjs_editor_dom_1.wrap(block.getContentNodes());
        }
        if (formatElement) {
            roosterjs_editor_dom_1.applyFormat(formatElement, this.core.defaultFormat);
        }
        return nodeToSelect;
    };
    return Editor;
}());
exports.default = Editor;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/editor/EditorCore.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/editor/EditorCore.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Undo_1 = __webpack_require__(/*! ../undo/Undo */ "./packages/roosterjs-editor-core/lib/undo/Undo.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var EditorCore = {
    create: function (contentDiv, options) {
        return {
            contentDiv: contentDiv,
            document: contentDiv.ownerDocument,
            defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat),
            customData: {},
            cachedRange: null,
            undo: options.undo || new Undo_1.default(),
            suspendAddingUndoSnapshot: false,
            plugins: (options.plugins || []).filter(function (plugin) { return !!plugin; }),
            idleLoopHandle: 0,
            ignoreIdleEvent: false,
        };
    },
};
exports.default = EditorCore;
function calcDefaultFormat(node, baseFormat) {
    baseFormat = baseFormat || {};
    var computedStyle = roosterjs_editor_dom_1.getComputedStyles(node);
    return {
        fontFamily: baseFormat.fontFamily || computedStyle[0],
        fontSize: baseFormat.fontSize || computedStyle[1],
        textColor: baseFormat.textColor || computedStyle[2],
        backgroundColor: baseFormat.backgroundColor || computedStyle[3],
        bold: baseFormat.bold,
        italic: baseFormat.italic,
        underline: baseFormat.underline,
    };
}


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/index.ts":
/*!*****************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/index.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Editor_1 = __webpack_require__(/*! ./editor/Editor */ "./packages/roosterjs-editor-core/lib/editor/Editor.ts");
exports.Editor = Editor_1.default;
var Undo_1 = __webpack_require__(/*! ./undo/Undo */ "./packages/roosterjs-editor-core/lib/undo/Undo.ts");
exports.Undo = Undo_1.default;
var eventDataCacheUtils_1 = __webpack_require__(/*! ./utils/eventDataCacheUtils */ "./packages/roosterjs-editor-core/lib/utils/eventDataCacheUtils.ts");
exports.clearEventDataCache = eventDataCacheUtils_1.clearEventDataCache;
exports.cacheGetEventData = eventDataCacheUtils_1.cacheGetEventData;
var snapshotUtils_1 = __webpack_require__(/*! ./undo/snapshotUtils */ "./packages/roosterjs-editor-core/lib/undo/snapshotUtils.ts");
exports.buildSnapshot = snapshotUtils_1.buildSnapshot;
exports.restoreSnapshot = snapshotUtils_1.restoreSnapshot;


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/undo/Undo.ts":
/*!*********************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/undo/Undo.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UndoSnapshots_1 = __webpack_require__(/*! ./UndoSnapshots */ "./packages/roosterjs-editor-core/lib/undo/UndoSnapshots.ts");
var snapshotUtils_1 = __webpack_require__(/*! ./snapshotUtils */ "./packages/roosterjs-editor-core/lib/undo/snapshotUtils.ts");
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
        var _this = this;
        this.editor = editor;
        this.onDropDisposer = this.editor.addDomEventHandler('drop', function () {
            _this.hasNewContent = true;
        });
        // Add an initial snapshot if snapshotsManager isn't created yet
        if (!this.getSnapshotsManager().canMove(0)) {
            this.addUndoSnapshot();
        }
    };
    /**
     * Dispose this plugin
     */
    Undo.prototype.dispose = function () {
        this.onDropDisposer();
        this.onDropDisposer = null;
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
            if (!selectionRange.collapsed ||
                this.lastKeyPress != evt.which ||
                evt.ctrlKey ||
                evt.metaKey) {
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
        if (!this.editor.getSelectionRange().collapsed) {
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


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/undo/UndoSnapshots.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/undo/UndoSnapshots.ts ***!
  \******************************************************************/
/*! no static exports found */
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

/***/ "./packages/roosterjs-editor-core/lib/undo/snapshotUtils.ts":
/*!******************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/undo/snapshotUtils.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
// Undo cursor marker
var CURSOR_START = 'cursor-start';
var CURSOR_END = 'cursor-end';
var CURSOR_MARKER_HTML = "<span id='" + CURSOR_START + "'></span><span id='" + CURSOR_END + "'></span>";
/**
 * Build undo snapshot, remember current cursor position by inserting start and end cursor mark SPANs
 * @param editor The editor instance
 * @returns The snapshot HTML string
 */
function buildSnapshot(editor) {
    // Build the snapshot in-between adding and removing cursor marker
    addCursorMarkersToSelection(editor);
    var htmlContent = editor.getContent(false /*triggerExtractContentEvent*/) || '';
    // This extra update selection to cursor marker post building snapshot is added for Mac safari
    // We temporarily inject a cursor marker to current selection prior to build snapshot and remove it afterwards
    // The insertion of cursor marker for some reasons has caused the selection maintained in browser to be lost.
    // This restores the selection prior to removing the cursor marker.
    // The code may throw error for Firefox and IE, hence keep it only for Mac Safari
    if (roosterjs_editor_dom_1.Browser.isSafari) {
        updateSelectionToCursorMarkers(editor);
    }
    removeCursorMarkers(editor);
    return htmlContent;
}
exports.buildSnapshot = buildSnapshot;
/**
 * Restore a snapshot, set the cursor selection back to the position stored in the snapshot
 * @param editor The editor instance
 */
function restoreSnapshot(editor, snapshot) {
    editor.setContent(snapshot, function () {
        // Restore the selection and delete the cursor marker afterwards
        updateSelectionToCursorMarkers(editor);
        removeCursorMarkers(editor);
    });
}
exports.restoreSnapshot = restoreSnapshot;
// Remove the temporarily added cursor markers
function removeCursorMarkers(editor) {
    [CURSOR_START, CURSOR_END].forEach(function (id) {
        var nodes = getCursorMarkNodes(editor, id);
        if (nodes) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }
    });
}
// Temporarily inject a SPAN marker to the selection which is used to remember where the selection is
// The marker is used on restore selection on undo
function addCursorMarkersToSelection(editor) {
    var range = editor.getSelectionRange();
    var markers = roosterjs_editor_dom_1.fromHtml(CURSOR_MARKER_HTML, editor.getDocument());
    insertCursorMarker(editor, range.start, markers[0]);
    // Then the end marker
    // For collapsed selection, use the start marker as the editor so that
    // the end marker is always placed after the start marker
    var rawRange = range.getRange();
    var endPosition = range.collapsed
        ? new roosterjs_editor_dom_1.Position(markers[0], roosterjs_editor_dom_1.Position.After)
        : new roosterjs_editor_dom_1.Position(rawRange.endContainer, rawRange.endOffset);
    insertCursorMarker(editor, endPosition, markers[1]);
}
// Update selection to where cursor marker is
// This is used in post building snapshot to restore selection
function updateSelectionToCursorMarkers(editor) {
    var startMarker = getCursorMarkerByUniqueId(editor, CURSOR_START);
    var endMarker = getCursorMarkerByUniqueId(editor, CURSOR_END);
    if (startMarker && endMarker) {
        editor.select(startMarker, roosterjs_editor_dom_1.Position.After, endMarker, roosterjs_editor_dom_1.Position.Before);
    }
}
// Insert cursor marker to an editor point
// The original code uses range.insertNode which "damages" some browser node & selection state
// i.e. on chrome, when the cursor is right at begin of a list, range.insertNode will cause some
// extra "empty" text node to be created as cursor marker is inserted. That extra "empty" text node
// will cause indentation to behave really weirdly
// This revised version uses DOM parentNode.insertBefore when it sees the insertion point is in node boundary_begin
// which gives precise control over DOM structure and solves the chrome issue
function insertCursorMarker(editor, position, cursorMaker) {
    position = position.normalize();
    var parentNode = position.node.parentNode;
    if (position.offset == 0) {
        parentNode.insertBefore(cursorMaker, position.node);
    }
    else if (position.isAtEnd) {
        // otherwise, insert after
        parentNode.insertBefore(cursorMaker, position.node.nextSibling);
    }
    else {
        // This is for insertion in-between a text node
        var insertionRange = editor.getDocument().createRange();
        insertionRange.setStart(position.node, position.offset);
        insertionRange.insertNode(cursorMaker);
    }
}
// Get an element by unique id. If there is more than one element by the id, it should return null
function getCursorMarkerByUniqueId(editor, id) {
    var nodes = getCursorMarkNodes(editor, id);
    return nodes && nodes.length == 1 ? nodes[0] : null;
}
function getCursorMarkNodes(editor, id) {
    return editor.queryNodes("span[id=\"" + id + "\"]:empty");
}


/***/ }),

/***/ "./packages/roosterjs-editor-core/lib/utils/eventDataCacheUtils.ts":
/*!*************************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/utils/eventDataCacheUtils.ts ***!
  \*************************************************************************/
/*! no static exports found */
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

/***/ "./packages/roosterjs-editor-core/lib/utils/isVoidHtmlElement.ts":
/*!***********************************************************************!*\
  !*** ./packages/roosterjs-editor-core/lib/utils/isVoidHtmlElement.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
/**
 * HTML void elements
 * Per https://www.w3.org/TR/html/syntax.html#syntax-elements, cannot have child nodes
 * This regex is used when we move focus to very begin of editor. We should avoid putting focus inside
 * void elements so users don't accidently create child nodes in them
 */
var HTML_VOID_ELEMENTS = [
    'AREA',
    'BASE',
    'BR',
    'COL',
    'COMMAND',
    'EMBED',
    'HR',
    'IMG',
    'INPUT',
    'KEYGEN',
    'LINK',
    'META',
    'PARAM',
    'SOURCE',
    'TRACK',
    'WBR',
];
/**
 * check if it is html void element. void element cannot have childen
 */
function isVoidHtmlElement(element) {
    return !!element && HTML_VOID_ELEMENTS.indexOf(roosterjs_editor_dom_1.getTagOfNode(element)) >= 0;
}
exports.default = isVoidHtmlElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/blockElements/NodeBlockElement.ts":
/*!*****************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/blockElements/NodeBlockElement.ts ***!
  \*****************************************************************************/
/*! no static exports found */
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
var StartEndBlockElement_1 = __webpack_require__(/*! ./StartEndBlockElement */ "./packages/roosterjs-editor-dom/lib/blockElements/StartEndBlockElement.ts");
var getFirstLastInlineElement_1 = __webpack_require__(/*! ../inlineElements/getFirstLastInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/getFirstLastInlineElement.ts");
var contains_1 = __webpack_require__(/*! ../utils/contains */ "./packages/roosterjs-editor-dom/lib/utils/contains.ts");
/**
 * This presents a content block that can be reprented by a single html block type element.
 * In most cases, it corresponds to an HTML block level element, i.e. P, DIV, LI, TD etc.
 */
var NodeBlockElement = /** @class */ (function (_super) {
    __extends(NodeBlockElement, _super);
    /**
     * Create a new instance of NodeBlockElement class
     * @param containerNode The container DOM Node of this NodeBlockElement
     */
    function NodeBlockElement(containerNode) {
        return _super.call(this, containerNode, containerNode) || this;
    }
    /**
     * Gets first inline
     */
    NodeBlockElement.prototype.getFirstInlineElement = function () {
        if (!this.firstInline) {
            this.firstInline = getFirstLastInlineElement_1.getFirstInlineElement(this.getStartNode());
        }
        return this.firstInline;
    };
    /**
     * Gets last inline
     */
    NodeBlockElement.prototype.getLastInlineElement = function () {
        if (!this.lastInline) {
            this.lastInline = getFirstLastInlineElement_1.getLastInlineElement(this.getEndNode());
        }
        return this.lastInline;
    };
    NodeBlockElement.prototype.contains = function (arg) {
        var node = arg instanceof Node ? arg : arg.getContainerNode();
        return contains_1.default(this.getStartNode(), node, true /*treatSameNodeAsContain*/);
    };
    return NodeBlockElement;
}(StartEndBlockElement_1.default));
exports.default = NodeBlockElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/blockElements/StartEndBlockElement.ts":
/*!*********************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/blockElements/StartEndBlockElement.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getInlineElementAtNode_1 = __webpack_require__(/*! ../inlineElements/getInlineElementAtNode */ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementAtNode.ts");
var intersectWithNodeRange_1 = __webpack_require__(/*! ../utils/intersectWithNodeRange */ "./packages/roosterjs-editor-dom/lib/utils/intersectWithNodeRange.ts");
var isNodeAfter_1 = __webpack_require__(/*! ../utils/isNodeAfter */ "./packages/roosterjs-editor-dom/lib/utils/isNodeAfter.ts");
/**
 * This reprents a block that is identified by a start and end node
 * This is for cases like <ced>Hello<BR>World</ced>
 * in that case, Hello<BR> is a block, World is another block
 * Such block cannot be represented by a NodeBlockElement since they don't chained up
 * to a single parent node, instead they have a start and end
 * This start and end must be in same sibling level and have same parent in DOM tree
 */
var StartEndBlockElement = /** @class */ (function () {
    /**
     * Create a new instance of StartEndBlockElement class
     * @param rootNode rootNode of current scope
     * @param startNode startNode of this block element
     * @param endNode end nod of this block element
     */
    function StartEndBlockElement(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
    }
    /**
     * Gets the text content
     */
    StartEndBlockElement.prototype.getTextContent = function () {
        var range = this.startNode.ownerDocument.createRange();
        range.setStartBefore(this.startNode);
        range.setEndAfter(this.endNode);
        return range.toString();
    };
    /**
     * Get all nodes represented in a Node array
     * This only works for balanced node -- start and end is at same level
     */
    StartEndBlockElement.prototype.getContentNodes = function () {
        var allNodes = [];
        if (this.startNode.parentNode == this.endNode.parentNode) {
            for (var node = this.startNode; node && node != this.endNode; node = node.nextSibling) {
                allNodes.push(node);
            }
            allNodes.push(this.endNode);
        }
        return allNodes;
    };
    /**
     * Gets the start node
     */
    StartEndBlockElement.prototype.getStartNode = function () {
        return this.startNode;
    };
    /**
     * Gets the end node
     */
    StartEndBlockElement.prototype.getEndNode = function () {
        return this.endNode;
    };
    /**
     * Gets first inline
     */
    StartEndBlockElement.prototype.getFirstInlineElement = function () {
        if (!this.firstInline) {
            this.firstInline = getInlineElementAtNode_1.default(this.startNode);
        }
        return this.firstInline;
    };
    /**
     * Gets last inline
     */
    StartEndBlockElement.prototype.getLastInlineElement = function () {
        if (!this.lastInline) {
            this.lastInline = getInlineElementAtNode_1.default(this.endNode);
        }
        return this.lastInline;
    };
    /**
     * Checks equals of two blocks
     */
    StartEndBlockElement.prototype.equals = function (blockElement) {
        return (this.startNode == blockElement.getStartNode() &&
            this.endNode == blockElement.getEndNode());
    };
    /**
     * Checks if this block element is after another block element
     */
    StartEndBlockElement.prototype.isAfter = function (blockElement) {
        return isNodeAfter_1.default(this.getStartNode(), blockElement.getEndNode());
    };
    StartEndBlockElement.prototype.contains = function (arg) {
        var node = arg instanceof Node ? arg : arg.getContainerNode();
        return intersectWithNodeRange_1.default(node, this.startNode, this.endNode, true /*containOnly*/);
    };
    return StartEndBlockElement;
}());
exports.default = StartEndBlockElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode.ts":
/*!**********************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contains_1 = __webpack_require__(/*! ../utils/contains */ "./packages/roosterjs-editor-dom/lib/utils/contains.ts");
var isBlockElement_1 = __webpack_require__(/*! ../utils/isBlockElement */ "./packages/roosterjs-editor-dom/lib/utils/isBlockElement.ts");
var NodeBlockElement_1 = __webpack_require__(/*! ./NodeBlockElement */ "./packages/roosterjs-editor-dom/lib/blockElements/NodeBlockElement.ts");
var StartEndBlockElement_1 = __webpack_require__(/*! ./StartEndBlockElement */ "./packages/roosterjs-editor-dom/lib/blockElements/StartEndBlockElement.ts");
var getLeafSibling_1 = __webpack_require__(/*! ../domWalker/getLeafSibling */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts");
var getTagOfNode_1 = __webpack_require__(/*! ../utils/getTagOfNode */ "./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts");
/**
 * This produces a block element from a a node
 * It needs to account for various HTML structure. Examples:
 * 1) <ced><div>abc</div></ced>
 *   This is most common the case, user passes in a node pointing to abc, and get back a block representing <div>abc</div>
 * 2) <ced><p><br></p></ced>
 *   Common content for empty block, user passes node pointing to <br>, and get back a block representing <p><br></p>
 * 3) <ced>abc</ced>
 *   Not common, but does happen. It is still a block in user's view. User passes in abc, and get back a start-end block representing abc
 *   NOTE: abc could be just one node. However, since it is not a html block, it is more appropriate to use start-end block although they point to same node
 * 4) <ced><div>abc<br>123</div></ced>
 *   A bit tricky, but can happen when user use Ctrl+Enter which simply inserts a <BR> to create a link break. There're two blocks:
 *   block1: 1) abc<br> block2: 123
 * 5) <ced><div>abc<div>123</div></div></ced>
 *   Nesting div and there is text node in same level as a DIV. Two blocks: 1) abc 2) <div>123</div>
 * 6) <ced><div>abc<span>123<br>456</span></div></ced>
 *   This is really tricky. Essentially there is a <BR> in middle of a span breaking the span into two blocks;
 *   block1: abc<span>123<br> block2: 456
 * In summary, given any arbitary node (leaf), to identify the head and tail of the block, following rules need to be followed:
 * 1) to identify the head, it needs to crawl DOM tre left/up till a block node or BR is encountered
 * 2) same for identifying tail
 * 3) should also apply a block ceiling, meaning as it crawls up, it should stop at a block node
 */
function getBlockElementAtNode(rootNode, node) {
    if (!node || !contains_1.default(rootNode, node)) {
        return null;
    }
    else if (isBlockElement_1.default(node)) {
        return new NodeBlockElement_1.default(node);
    }
    else {
        // Identify the containing block. This serves as ceiling for traversing down below
        // NOTE: this container block could be just the rootNode,
        // which cannot be used to create block element. We will special case handle it later on
        var containerBlockNode = node.parentNode;
        while (contains_1.default(rootNode, containerBlockNode) && !isBlockElement_1.default(containerBlockNode)) {
            containerBlockNode = containerBlockNode.parentNode;
        }
        // Find the head and leaf node in the block
        var headNode = findHeadTailLeafNodeInBlock(node, containerBlockNode, false /*isTail*/);
        var tailNode = findHeadTailLeafNodeInBlock(node, containerBlockNode, true /*isTail*/);
        // At this point, we have the head and tail of a block, here are some examples and where head and tail point to
        // 1) <ced><div>hello<br></div></ced>, head: hello, tail: <br>
        // 2) <ced><div>hello<span style="font-family: Arial">world</span></div></ced>, head: hello, tail: world
        // Both are actually completely and exclusively wrapped in a parent div, and can be represented with a Node block
        // So we shall try to collapse as much as we can to the nearest common ancester
        headNode = getParentNearCommonAncestor(containerBlockNode, headNode, tailNode, true);
        tailNode = getParentNearCommonAncestor(containerBlockNode, tailNode, headNode, false);
        if (headNode.parentNode != tailNode.parentNode) {
            // Un-balanced start and end, create a start-end block
            return new StartEndBlockElement_1.default(headNode, tailNode);
        }
        else {
            // Balanced start and end (point to same parent), need to see if further collapsing can be done
            var parentNode = headNode.parentNode;
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
            return headNode == tailNode && isBlockElement_1.default(headNode)
                ? new NodeBlockElement_1.default(headNode)
                : new StartEndBlockElement_1.default(headNode, tailNode);
        }
    }
}
exports.default = getBlockElementAtNode;
/**
 * Given a node and container block, identify the first leaf (head) node
 * A leaf node is defined as deepest first node in a block
 * i.e. <div><span style="font-family: Arial">abc</span></div>, abc is the head leaf of the block
 * Often <br> or a child <div> is used to create a block. In that case, the leaf after the sibling div or br should be the head leaf
 * i.e. <div>123<br>abc</div>, abc is the head of a block because of a previous sibling <br>
 * i.e. <div><div>123</div>abc</div>, abc is also the head of a block because of a previous sibling <div>
 * To identify the head leaf of a block, we basically start from a node, go all the way towards left till a sibling <div> or <br>
 * in DOM tree traversal, it is three traversal:
 * 1) previous sibling traversal
 * 2) parent traversal looking for a previous sibling from parent
 * 3) last child traversal, repeat from 1-3
 */
function findHeadTailLeafNodeInBlock(node, container, isTail) {
    var sibling = node;
    var isBr = false;
    do {
        node = sibling;
        sibling = getLeafSibling_1.getLeafSibling(container, node, isTail, isBlockElement_1.default);
        isBr = getTagOfNode_1.default(sibling) == 'BR';
    } while (sibling && !isBlockElement_1.default(sibling) && !isBr);
    return isBr && isTail ? sibling : node;
}
function getParentNearCommonAncestor(containerBlockNode, thisNode, otherNode, checkFirstNode) {
    var parentNode = thisNode.parentNode;
    while ((checkFirstNode ? parentNode.firstChild : parentNode.lastChild) == thisNode &&
        parentNode != containerBlockNode &&
        !contains_1.default(parentNode, otherNode)) {
        thisNode = parentNode;
        parentNode = parentNode.parentNode;
    }
    return thisNode;
}


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/blockElements/getNextPreviousBlockElement.ts":
/*!****************************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/blockElements/getNextPreviousBlockElement.ts ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getLeafSibling_1 = __webpack_require__(/*! ../domWalker/getLeafSibling */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts");
var getBlockElementAtNode_1 = __webpack_require__(/*! ./getBlockElementAtNode */ "./packages/roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode.ts");
/**
 * Get next block
 */
function getNextBlockElement(rootNode, blockElement) {
    return getNextPreviousBlockElement(rootNode, blockElement, true /*isNext*/);
}
exports.getNextBlockElement = getNextBlockElement;
/**
 * Get previous block
 */
function getPreviousBlockElement(rootNode, blockElement) {
    return getNextPreviousBlockElement(rootNode, blockElement, false /*isNext*/);
}
exports.getPreviousBlockElement = getPreviousBlockElement;
function getNextPreviousBlockElement(rootNode, blockElement, isNext) {
    if (!blockElement) {
        return null;
    }
    // Get a leaf node after block's end element and use that base to find next block
    // TODO: this code is used to identify block, maybe we shouldn't exclude those empty nodes
    // We can improve this later on
    var leaf = getLeafSibling_1.getLeafSibling(rootNode, isNext ? blockElement.getEndNode() : blockElement.getStartNode(), isNext);
    return getBlockElementAtNode_1.default(rootNode, leaf);
}


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/contentTraverser/BlockScoper.ts":
/*!***************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/contentTraverser/BlockScoper.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getBlockElementAtNode_1 = __webpack_require__(/*! ../blockElements/getBlockElementAtNode */ "./packages/roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode.ts");
var getInlineElementBeforeAfter_1 = __webpack_require__(/*! ../inlineElements/getInlineElementBeforeAfter */ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementBeforeAfter.ts");
/**
 * This provides traversing content in a selection start block
 * This is commonly used for those cursor context sensitive plugin,
 * they want to know text being typed at cursor
 * This provides a scope for parsing from cursor position up to begin of the selection block
 */
var BlockScoper = /** @class */ (function () {
    function BlockScoper(rootNode, position, startPosition) {
        this.rootNode = rootNode;
        this.position = position;
        this.startPosition = startPosition;
        this.position = this.position.normalize();
        this.block = getBlockElementAtNode_1.default(rootNode, this.position.node);
    }
    /**
     * Get the start block element
     */
    BlockScoper.prototype.getStartBlockElement = function () {
        return this.block;
    };
    /**
     * Get the start inline element
     * The start inline refers to inline before the selection start
     *  The reason why we choose the one before rather after is, when cursor is at the end of a paragragh,
     * the one after likely will point to inline in next paragragh which may be null if the cursor is at bottom of editor
     */
    BlockScoper.prototype.getStartInlineElement = function () {
        var startInline;
        if (this.block) {
            switch (this.startPosition) {
                case 0 /* Begin */:
                    startInline = this.block.getFirstInlineElement();
                    break;
                case 1 /* End */:
                    startInline = this.block.getLastInlineElement();
                    break;
                case 2 /* SelectionStart */:
                    // Get the inline before selection start point, and ensure it falls in the selection block
                    startInline = getInlineElementBeforeAfter_1.getInlineElementAfter(this.rootNode, this.position);
                    if (startInline && !this.block.contains(startInline)) {
                        startInline = null;
                    }
                    break;
            }
        }
        return startInline;
    };
    /**
     * This is special case to support when startInlineElement is null
     * startInlineElement being null can happen when cursor is in the end of block. In that case, there
     * isn't anything after the cursor so you get a null startInlineElement. The scoper works together
     * with content traverser. When users ask for a previous inline element and content traverser sees
     * a null startInline element, it will fall back to call this getInlineElementBeforeStart to get a
     * a previous inline element
     */
    BlockScoper.prototype.getInlineElementBeforeStart = function () {
        var inlineBeforeStart;
        if (this.block && this.startPosition == 2 /* SelectionStart */) {
            // Get the inline before selection start point, and ensure it falls in the selection block
            inlineBeforeStart = getInlineElementBeforeAfter_1.getInlineElementBefore(this.rootNode, this.position);
            if (inlineBeforeStart && !this.block.contains(inlineBeforeStart)) {
                inlineBeforeStart = null;
            }
        }
        return inlineBeforeStart;
    };
    /**
     * Check if the given block element is in current scope
     * @param blockElement The block element to check
     */
    BlockScoper.prototype.isBlockInScope = function (blockElement) {
        return this.block && blockElement ? this.block.equals(blockElement) : false;
    };
    /**
     * Trim the incoming inline element, and return an inline element
     * This just tests and return the inline element if it is in block
     * This is a block scoper, which is not like selection scoper where it may cut an inline element in half
     * A block scoper does not cut an inline in half
     */
    BlockScoper.prototype.trimInlineElement = function (inlineElement) {
        return this.block && inlineElement && this.block.contains(inlineElement)
            ? inlineElement
            : null;
    };
    return BlockScoper;
}());
exports.default = BlockScoper;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/contentTraverser/BodyScoper.ts":
/*!**************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/contentTraverser/BodyScoper.ts ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getFirstLastInlineElement_1 = __webpack_require__(/*! ../inlineElements/getFirstLastInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/getFirstLastInlineElement.ts");
var getLeafNode_1 = __webpack_require__(/*! ../domWalker/getLeafNode */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafNode.ts");
var getBlockElementAtNode_1 = __webpack_require__(/*! ../blockElements/getBlockElementAtNode */ "./packages/roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode.ts");
var contains_1 = __webpack_require__(/*! ../utils/contains */ "./packages/roosterjs-editor-dom/lib/utils/contains.ts");
// This provides scoper for traversing the entire editor body starting from the beginning
var BodyScoper = /** @class */ (function () {
    function BodyScoper(rootNode) {
        this.rootNode = rootNode;
    }
    // Get the start block element
    BodyScoper.prototype.getStartBlockElement = function () {
        return getBlockElementAtNode_1.default(this.rootNode, getLeafNode_1.getFirstLeafNode(this.rootNode));
    };
    // Get the first inline element in the editor
    BodyScoper.prototype.getStartInlineElement = function () {
        return getFirstLastInlineElement_1.getFirstInlineElement(this.rootNode);
    };
    // Since the scope is global, all blocks under the root node are in scope
    BodyScoper.prototype.isBlockInScope = function (blockElement) {
        return contains_1.default(this.rootNode, blockElement.getStartNode());
    };
    // Since we're at body scope, inline elements never need to be trimmed
    BodyScoper.prototype.trimInlineElement = function (inlineElement) {
        return inlineElement;
    };
    return BodyScoper;
}());
exports.default = BodyScoper;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/contentTraverser/ContentTraverser.ts":
/*!********************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/contentTraverser/ContentTraverser.ts ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getNextPreviousInlineElement_1 = __webpack_require__(/*! ../inlineElements/getNextPreviousInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/getNextPreviousInlineElement.ts");
var getNextPreviousBlockElement_1 = __webpack_require__(/*! ../blockElements/getNextPreviousBlockElement */ "./packages/roosterjs-editor-dom/lib/blockElements/getNextPreviousBlockElement.ts");
var BlockScoper_1 = __webpack_require__(/*! ./BlockScoper */ "./packages/roosterjs-editor-dom/lib/contentTraverser/BlockScoper.ts");
var SelectionScoper_1 = __webpack_require__(/*! ./SelectionScoper */ "./packages/roosterjs-editor-dom/lib/contentTraverser/SelectionScoper.ts");
var BodyScoper_1 = __webpack_require__(/*! ./BodyScoper */ "./packages/roosterjs-editor-dom/lib/contentTraverser/BodyScoper.ts");
/**
 * The provides traversing of content inside editor.
 * There are two ways to traverse, block by block, or inline element by inline element
 * Block and inline traversing is independent from each other, meanning if you traverse block by block, it does not change
 * the current inline element position
 */
var ContentTraverser = /** @class */ (function () {
    /**
     * Create a new instance of ContentTraverser class
     * @param rootNode Root node of the content
     * @param scope The scope type, can be Body, Block, Selection
     * @param range A range used for scope the content. This can be null when scope set to ContentScope.Body
     * @param position Position type, must be set when scope is set to Block. The value can be Begin, End, SelectionStart
     */
    function ContentTraverser(rootNode, scope, range, position) {
        this.rootNode = rootNode;
        switch (scope) {
            case 0 /* Block */:
                this.scoper = new BlockScoper_1.default(rootNode, range.start, position);
                break;
            case 1 /* Selection */:
                this.scoper = new SelectionScoper_1.default(rootNode, range);
                break;
            case 2 /* Body */:
                this.scoper = new BodyScoper_1.default(rootNode);
                break;
        }
    }
    Object.defineProperty(ContentTraverser.prototype, "currentBlockElement", {
        /**
         * Get current block
         */
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
    /**
     * Get next block element
     */
    ContentTraverser.prototype.getNextBlockElement = function () {
        var thisBlock = this.currentBlockElement;
        var nextBlock = thisBlock ? getNextPreviousBlockElement_1.getNextBlockElement(this.rootNode, thisBlock) : null;
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
    /**
     * Get previous block element
     */
    ContentTraverser.prototype.getPreviousBlockElement = function () {
        var thisBlock = this.currentBlockElement;
        var previousBlock = thisBlock ? getNextPreviousBlockElement_1.getPreviousBlockElement(this.rootNode, thisBlock) : null;
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
        /**
         * Current inline element getter
         */
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
    /**
     * Get next inline element
     */
    ContentTraverser.prototype.getNextInlineElement = function () {
        var nextInline = this.getValidInlineElement(true /*isNext*/);
        this.currentInline = nextInline || this.currentInline;
        return nextInline;
    };
    /**
     * Get previous inline element
     */
    ContentTraverser.prototype.getPreviousInlineElement = function () {
        var previousInline = this.getValidInlineElement(false /*isNext*/);
        this.currentInline = previousInline || this.currentInline;
        return previousInline;
    };
    ContentTraverser.prototype.getValidInlineElement = function (isNext) {
        var _this = this;
        var thisInline = this.currentInlineElement;
        var getPreviousNextFunc = isNext ? getNextPreviousInlineElement_1.getNextInlineElement : getNextPreviousInlineElement_1.getPreviousInlineElement;
        var getBeforeAfterStartFunc = function () {
            return isNext
                ? _this.scoper.getInlineElementAfterStart()
                : _this.scoper.getInlineElementBeforeStart();
        };
        var candidate = thisInline
            ? getPreviousNextFunc(this.rootNode, thisInline)
            : getBeforeAfterStartFunc ? getBeforeAfterStartFunc() : null;
        // For inline, we need to make sure it is really next/previous to current, unless current is null.
        // Then trim it if necessary
        return candidate && (!thisInline || candidate.isAfter(thisInline) == isNext)
            ? this.scoper.trimInlineElement(candidate)
            : null;
    };
    return ContentTraverser;
}());
exports.default = ContentTraverser;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/contentTraverser/SelectionScoper.ts":
/*!*******************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/contentTraverser/SelectionScoper.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(/*! ../inlineElements/PartialInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/PartialInlineElement.ts");
var getBlockElementAtNode_1 = __webpack_require__(/*! ../blockElements/getBlockElementAtNode */ "./packages/roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode.ts");
var getInlineElementBeforeAfter_1 = __webpack_require__(/*! ../inlineElements/getInlineElementBeforeAfter */ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementBeforeAfter.ts");
/**
 * This is selection scoper that provide a start inline as the start of the selection
 * and checks if a block falls in the selection (isBlockInScope)
 * last trimInlineElement to trim any inline element to return a partial that falls in the selection
 */
var SelectionScoper = /** @class */ (function () {
    /**
     * Create a new instance of SelectionScoper class
     * @param rootNode The root node of the content
     * @param range The selection range to scope to
     */
    function SelectionScoper(rootNode, range) {
        this.rootNode = rootNode;
        this.range = range.normalize();
    }
    /**
     * Provide a start block as the first block after the cursor
     */
    SelectionScoper.prototype.getStartBlockElement = function () {
        if (!this.startBlock) {
            this.startBlock = getBlockElementAtNode_1.default(this.rootNode, this.range.start.node);
        }
        return this.startBlock;
    };
    /**
     * Provide a start inline as the first inline after the cursor
     */
    SelectionScoper.prototype.getStartInlineElement = function () {
        if (!this.startInline) {
            this.startInline = this.trimInlineElement(getInlineElementBeforeAfter_1.getInlineElementAfter(this.rootNode, this.range.start));
        }
        return this.startInline;
    };
    /**
     * Checks if a block completely falls in the selection
     */
    SelectionScoper.prototype.isBlockInScope = function (blockElement) {
        if (!blockElement) {
            return false;
        }
        var inScope = false;
        var selStartBlock = this.getStartBlockElement();
        if (this.range.collapsed) {
            inScope = selStartBlock && selStartBlock.equals(blockElement);
        }
        else {
            var selEndBlock = getBlockElementAtNode_1.default(this.rootNode, this.range.end.node);
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
    /**
     * Trim an incoming inline. If it falls completely outside selection, return null
     * otherwise return a partial that represents the portion that falls in the selection
     */
    SelectionScoper.prototype.trimInlineElement = function (inlineElement) {
        var start = inlineElement.getStartPosition();
        var end = inlineElement.getEndPosition();
        if (start.isAfter(this.range.end) || this.range.start.isAfter(end)) {
            return null;
        }
        if (this.range.start.isAfter(start)) {
            start = this.range.start;
        }
        if (end.isAfter(this.range.end)) {
            end = this.range.end;
        }
        return start.equalTo(end)
            ? null
            : start.offset > 0 || !end.isAtEnd
                ? new PartialInlineElement_1.default(inlineElement, start, end)
                : inlineElement;
    };
    return SelectionScoper;
}());
exports.default = SelectionScoper;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafNode.ts":
/*!********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/domWalker/getLeafNode.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shouldSkipNode_1 = __webpack_require__(/*! ./shouldSkipNode */ "./packages/roosterjs-editor-dom/lib/domWalker/shouldSkipNode.ts");
var getLeafSibling_1 = __webpack_require__(/*! ./getLeafSibling */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts");
/**
 * Get the first meaningful leaf node
 * This can return null for empty container or
 * container that does not contain any meaningful node
 * @param rootNode The root node to get leaf node from
 */
function getFirstLeafNode(rootNode) {
    return getLeafNode(rootNode, true /*isFirst*/);
}
exports.getFirstLeafNode = getFirstLeafNode;
/**
 * Get the last meaningful leaf node
 * This can return null for empty container or
 * container that does not contain any meaningful node
 * @param rootNode The root node to get leaf node from
 */
function getLastLeafNode(rootNode) {
    return getLeafNode(rootNode, false /*isFirst*/);
}
exports.getLastLeafNode = getLastLeafNode;
/**
 * Get the first or last meaningful leaf node
 * This can return null for empty container or
 * container that does not contain any meaningful node
 * @param rootNode The root node to get leaf node from
 * @param isFirst True to get first leaf node, false to get last leaf node
 */
function getLeafNode(rootNode, isFirst) {
    var getChild = function (node) { return (isFirst ? node.firstChild : node.lastChild); };
    var result = getChild(rootNode);
    while (result && getChild(result)) {
        result = getChild(result);
    }
    if (result && shouldSkipNode_1.default(result)) {
        result = getLeafSibling_1.getLeafSibling(rootNode, result, isFirst);
    }
    return result;
}
exports.getLeafNode = getLeafNode;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts":
/*!***********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contains_1 = __webpack_require__(/*! ../utils/contains */ "./packages/roosterjs-editor-dom/lib/utils/contains.ts");
var shouldSkipNode_1 = __webpack_require__(/*! ./shouldSkipNode */ "./packages/roosterjs-editor-dom/lib/domWalker/shouldSkipNode.ts");
/**
 * This walks forwards (from left to right) DOM tree to get next meaningful node
 * A null is returned when it reaches the very end - beyond the scope as defined by rootNode
 */
function getNextLeafSibling(rootNode, startNode) {
    return getLeafSibling(rootNode, startNode, true /*isNext*/);
}
exports.getNextLeafSibling = getNextLeafSibling;
/**
 * This walks backwards (from right to left) DOM tree to get previous meaningful node
 * A null is returned when it reaches the very first - beyond the scope as defined by rootNode
 */
function getPreviousLeafSibling(rootNode, startNode) {
    return getLeafSibling(rootNode, startNode, false /*isNext*/);
}
exports.getPreviousLeafSibling = getPreviousLeafSibling;
function getLeafSibling(rootNode, startNode, isNext, stop) {
    var getSibling = function (node) { return (isNext ? node.nextSibling : node.previousSibling); };
    var getChild = function (node) { return (isNext ? node.firstChild : node.lastChild); };
    if (!contains_1.default(rootNode, startNode)) {
        return null;
    }
    var curNode;
    for (curNode = startNode; curNode;) {
        // Find next/previous node, starting from next/previous sibling, then one level up to find next/previous sibling from parent
        // till a non-null nextSibling/previousSibling is found or the ceiling is encountered (rootNode)
        var parentNode = curNode.parentNode;
        curNode = getSibling(curNode);
        while (!curNode && parentNode != rootNode) {
            curNode = getSibling(parentNode);
            parentNode = parentNode.parentNode;
        }
        if (stop && stop(curNode)) {
            return curNode;
        }
        // Now traverse down to get first/last child
        while (curNode && curNode.hasChildNodes()) {
            curNode = getChild(curNode);
            if (stop && stop(curNode)) {
                return curNode;
            }
        }
        if (!curNode || !shouldSkipNode_1.default(curNode)) {
            break;
        }
    }
    return curNode;
}
exports.getLeafSibling = getLeafSibling;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/domWalker/shouldSkipNode.ts":
/*!***********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/domWalker/shouldSkipNode.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getComputedStyles_1 = __webpack_require__(/*! ../utils/getComputedStyles */ "./packages/roosterjs-editor-dom/lib/utils/getComputedStyles.ts");
/**
 * Skip a node when any of following conditions are true
 * - it is neither Element nor Text
 * - it is a text node but is empty
 * - it is a text node but contains just CRLF (noisy text node that often comes in-between elements)
 * - has a display:none
 */
function shouldSkipNode(node) {
    if (node && node.nodeType == 3 /* Text */) {
        return /^[\r\n]+$/.test(node.nodeValue);
    }
    else if (node && node.nodeType == 1 /* Element */) {
        return getComputedStyles_1.default(node, 'display')[0] == 'none';
    }
    else {
        return true;
    }
}
exports.default = shouldSkipNode;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/index.ts":
/*!****************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Selections
var Position_1 = __webpack_require__(/*! ./selection/Position */ "./packages/roosterjs-editor-dom/lib/selection/Position.ts");
exports.Position = Position_1.default;
var SelectionRange_1 = __webpack_require__(/*! ./selection/SelectionRange */ "./packages/roosterjs-editor-dom/lib/selection/SelectionRange.ts");
exports.SelectionRange = SelectionRange_1.default;
// DOM Walker
var getLeafSibling_1 = __webpack_require__(/*! ./domWalker/getLeafSibling */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts");
exports.getNextLeafSibling = getLeafSibling_1.getNextLeafSibling;
exports.getPreviousLeafSibling = getLeafSibling_1.getPreviousLeafSibling;
var getLeafNode_1 = __webpack_require__(/*! ./domWalker/getLeafNode */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafNode.ts");
exports.getFirstLeafNode = getLeafNode_1.getFirstLeafNode;
exports.getLastLeafNode = getLeafNode_1.getLastLeafNode;
exports.getLeafNode = getLeafNode_1.getLeafNode;
var NodeInlineElement_1 = __webpack_require__(/*! ./inlineElements/NodeInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/NodeInlineElement.ts");
exports.NodeInlineElement = NodeInlineElement_1.default;
var PartialInlineElement_1 = __webpack_require__(/*! ./inlineElements/PartialInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/PartialInlineElement.ts");
exports.PartialInlineElement = PartialInlineElement_1.default;
var getInlineElementAtNode_1 = __webpack_require__(/*! ./inlineElements/getInlineElementAtNode */ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementAtNode.ts");
exports.getInlineElementAtNode = getInlineElementAtNode_1.default;
var getFirstLastInlineElement_1 = __webpack_require__(/*! ./inlineElements/getFirstLastInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/getFirstLastInlineElement.ts");
exports.getFirstInlineElement = getFirstLastInlineElement_1.getFirstInlineElement;
exports.getLastInlineElement = getFirstLastInlineElement_1.getLastInlineElement;
var getNextPreviousInlineElement_1 = __webpack_require__(/*! ./inlineElements/getNextPreviousInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/getNextPreviousInlineElement.ts");
exports.getNextInlineElement = getNextPreviousInlineElement_1.getNextInlineElement;
exports.getPreviousInlineElement = getNextPreviousInlineElement_1.getPreviousInlineElement;
var NodeBlockElement_1 = __webpack_require__(/*! ./blockElements/NodeBlockElement */ "./packages/roosterjs-editor-dom/lib/blockElements/NodeBlockElement.ts");
exports.NodeBlockElement = NodeBlockElement_1.default;
var StartEndBlockElement_1 = __webpack_require__(/*! ./blockElements/StartEndBlockElement */ "./packages/roosterjs-editor-dom/lib/blockElements/StartEndBlockElement.ts");
exports.StartEndBlockElement = StartEndBlockElement_1.default;
var getBlockElementAtNode_1 = __webpack_require__(/*! ./blockElements/getBlockElementAtNode */ "./packages/roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode.ts");
exports.getBlockElementAtNode = getBlockElementAtNode_1.default;
var getNextPreviousBlockElement_1 = __webpack_require__(/*! ./blockElements/getNextPreviousBlockElement */ "./packages/roosterjs-editor-dom/lib/blockElements/getNextPreviousBlockElement.ts");
exports.getNextBlockElement = getNextPreviousBlockElement_1.getNextBlockElement;
exports.getPreviousBlockElement = getNextPreviousBlockElement_1.getPreviousBlockElement;
// Content Traverser
var ContentTraverser_1 = __webpack_require__(/*! ./contentTraverser/ContentTraverser */ "./packages/roosterjs-editor-dom/lib/contentTraverser/ContentTraverser.ts");
exports.ContentTraverser = ContentTraverser_1.default;
// Utils
var Browser_1 = __webpack_require__(/*! ./utils/Browser */ "./packages/roosterjs-editor-dom/lib/utils/Browser.ts");
exports.Browser = Browser_1.default;
var applyFormat_1 = __webpack_require__(/*! ./utils/applyFormat */ "./packages/roosterjs-editor-dom/lib/utils/applyFormat.ts");
exports.applyFormat = applyFormat_1.default;
var changeElementTag_1 = __webpack_require__(/*! ./utils/changeElementTag */ "./packages/roosterjs-editor-dom/lib/utils/changeElementTag.ts");
exports.changeElementTag = changeElementTag_1.default;
var contains_1 = __webpack_require__(/*! ./utils/contains */ "./packages/roosterjs-editor-dom/lib/utils/contains.ts");
exports.contains = contains_1.default;
var sanitizeHtml_1 = __webpack_require__(/*! ./utils/sanitizeHtml */ "./packages/roosterjs-editor-dom/lib/utils/sanitizeHtml.ts");
exports.sanitizeHtml = sanitizeHtml_1.default;
var fromHtml_1 = __webpack_require__(/*! ./utils/fromHtml */ "./packages/roosterjs-editor-dom/lib/utils/fromHtml.ts");
exports.fromHtml = fromHtml_1.default;
var getComputedStyles_1 = __webpack_require__(/*! ./utils/getComputedStyles */ "./packages/roosterjs-editor-dom/lib/utils/getComputedStyles.ts");
exports.getComputedStyles = getComputedStyles_1.default;
var getElementOrParentElement_1 = __webpack_require__(/*! ./utils/getElementOrParentElement */ "./packages/roosterjs-editor-dom/lib/utils/getElementOrParentElement.ts");
exports.getElementOrParentElement = getElementOrParentElement_1.default;
var getTagOfNode_1 = __webpack_require__(/*! ./utils/getTagOfNode */ "./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts");
exports.getTagOfNode = getTagOfNode_1.default;
var intersectWithNodeRange_1 = __webpack_require__(/*! ./utils/intersectWithNodeRange */ "./packages/roosterjs-editor-dom/lib/utils/intersectWithNodeRange.ts");
exports.intersectWithNodeRange = intersectWithNodeRange_1.default;
var isBlockElement_1 = __webpack_require__(/*! ./utils/isBlockElement */ "./packages/roosterjs-editor-dom/lib/utils/isBlockElement.ts");
exports.isBlockElement = isBlockElement_1.default;
var isDocumentPosition_1 = __webpack_require__(/*! ./utils/isDocumentPosition */ "./packages/roosterjs-editor-dom/lib/utils/isDocumentPosition.ts");
exports.isDocumentPosition = isDocumentPosition_1.default;
var isNodeEmpty_1 = __webpack_require__(/*! ./utils/isNodeEmpty */ "./packages/roosterjs-editor-dom/lib/utils/isNodeEmpty.ts");
exports.isNodeEmpty = isNodeEmpty_1.default;
var matchLink_1 = __webpack_require__(/*! ./utils/matchLink */ "./packages/roosterjs-editor-dom/lib/utils/matchLink.ts");
exports.matchLink = matchLink_1.default;
var splitParentNode_1 = __webpack_require__(/*! ./utils/splitParentNode */ "./packages/roosterjs-editor-dom/lib/utils/splitParentNode.ts");
exports.splitParentNode = splitParentNode_1.default;
var unwrap_1 = __webpack_require__(/*! ./utils/unwrap */ "./packages/roosterjs-editor-dom/lib/utils/unwrap.ts");
exports.unwrap = unwrap_1.default;
var wrap_1 = __webpack_require__(/*! ./utils/wrap */ "./packages/roosterjs-editor-dom/lib/utils/wrap.ts");
exports.wrap = wrap_1.default;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/inlineElements/NodeInlineElement.ts":
/*!*******************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/inlineElements/NodeInlineElement.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Position_1 = __webpack_require__(/*! ../selection/Position */ "./packages/roosterjs-editor-dom/lib/selection/Position.ts");
var SelectionRange_1 = __webpack_require__(/*! ../selection/SelectionRange */ "./packages/roosterjs-editor-dom/lib/selection/SelectionRange.ts");
var getTagOfNode_1 = __webpack_require__(/*! ../utils/getTagOfNode */ "./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts");
var isNodeAfter_1 = __webpack_require__(/*! ../utils/isNodeAfter */ "./packages/roosterjs-editor-dom/lib/utils/isNodeAfter.ts");
/**
 * This presents an inline element that can be reprented by a single html node.
 * This serves as base for most inline element as it contains most implentation
 * of all operations that can happen on an inline element. Other sub inline elements mostly
 * just identify themself for a certain type
 */
var NodeInlineElement = /** @class */ (function () {
    function NodeInlineElement(containerNode) {
        this.containerNode = containerNode;
    }
    /**
     * The text content for this inline element
     */
    NodeInlineElement.prototype.getTextContent = function () {
        // nodeValue is better way to retrieve content for a text. Others, just use textContent
        return this.containerNode.nodeType == 3 /* Text */
            ? this.containerNode.nodeValue
            : this.containerNode.textContent;
    };
    /**
     * Get the container node
     */
    NodeInlineElement.prototype.getContainerNode = function () {
        return this.containerNode;
    };
    /**
     * Get the start point of the inline element
     */
    NodeInlineElement.prototype.getStartPosition = function () {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        return new Position_1.default(this.containerNode, 0).normalize();
    };
    /**
     * Get the end point of the inline element
     */
    NodeInlineElement.prototype.getEndPosition = function () {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        return new Position_1.default(this.containerNode, Position_1.default.End).normalize();
    };
    /**
     * Checks if an inline element is after the current inline element
     */
    NodeInlineElement.prototype.isAfter = function (inlineElement) {
        return isNodeAfter_1.default(this.containerNode, inlineElement.getContainerNode());
    };
    /**
     * Checks if an editor point is contained in the inline element
     */
    NodeInlineElement.prototype.contains = function (position) {
        var start = this.getStartPosition();
        var end = this.getEndPosition();
        return position.isAfter(start) && end.isAfter(position);
    };
    /**
     * Apply inline style to an inline element
     */
    NodeInlineElement.prototype.applyStyle = function (styler) {
        var node = this.containerNode;
        if (node.nodeType == 3 /* Text */) {
            applyStyleToTextNode(node, 0, node.nodeValue.length, styler);
        }
        else if (node.nodeType == 1 /* Element */) {
            styler(node);
        }
    };
    return NodeInlineElement;
}());
exports.default = NodeInlineElement;
/**
 * Apply style to a text node with start and end offsets
 * @param node Text node
 * @param start Start offset
 * @param end end offset
 * @param styler Style function
 */
function applyStyleToTextNode(textNode, start, end, styler) {
    var parentNode = textNode.parentNode;
    // Ignore text node direct under TR/TABLE or empty range
    var parentTag = getTagOfNode_1.default(parentNode);
    if (parentTag == 'TR' || parentTag == 'TABLE' || end <= start) {
        return;
    }
    if (parentNode.textContent.length == end - start) {
        // If the element is in a span and this element is everything of the parent
        // apply the style on parent span
        styler(parentNode);
    }
    else if (end > start) {
        // It is partial of a text node
        var newNode = textNode.ownerDocument.createElement('SPAN');
        newNode.textContent = textNode.nodeValue.substring(start, end);
        var range = new SelectionRange_1.default(new Position_1.default(textNode, start), new Position_1.default(textNode, end)).getRange();
        range.deleteContents();
        range.insertNode(newNode);
        styler(newNode);
    }
}
exports.applyStyleToTextNode = applyStyleToTextNode;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/inlineElements/PartialInlineElement.ts":
/*!**********************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/inlineElements/PartialInlineElement.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NodeInlineElement_1 = __webpack_require__(/*! ./NodeInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/NodeInlineElement.ts");
var Position_1 = __webpack_require__(/*! ../selection/Position */ "./packages/roosterjs-editor-dom/lib/selection/Position.ts");
var SelectionRange_1 = __webpack_require__(/*! ../selection/SelectionRange */ "./packages/roosterjs-editor-dom/lib/selection/SelectionRange.ts");
var contains_1 = __webpack_require__(/*! ../utils/contains */ "./packages/roosterjs-editor-dom/lib/utils/contains.ts");
var isDocumentPosition_1 = __webpack_require__(/*! ../utils/isDocumentPosition */ "./packages/roosterjs-editor-dom/lib/utils/isDocumentPosition.ts");
var getLeafSibling_1 = __webpack_require__(/*! ../domWalker/getLeafSibling */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts");
/**
 * This is a special version of inline element that identifies a section of an inline element
 * We often have the need to cut an inline element in half and perform some operation only on half of an inline element
 * i.e. users select only some text of a text node and apply format, in that case, format has to happen on partial of an inline element
 * PartialInlineElement is implemented in a way that decorate another full inline element with its own override on methods like isAfter
 * It also offers some special methods that others don't have, i.e. nextInlineElement etc.
 */
var PartialInlineElement = /** @class */ (function () {
    function PartialInlineElement(decoratedInline, start, end) {
        this.decoratedInline =
            decoratedInline instanceof NodeInlineElement_1.default
                ? decoratedInline
                : decoratedInline.getDecoratedInline();
        var node = this.decoratedInline.getContainerNode();
        this.start = (start || new Position_1.default(node, Position_1.default.Begin)).normalize();
        this.end = (end || new Position_1.default(node, Position_1.default.End)).normalize();
    }
    /**
     * Get the full inline element that this partial inline decorates
     */
    PartialInlineElement.prototype.getDecoratedInline = function () {
        return this.decoratedInline;
    };
    /**
     * Gets the container node
     */
    PartialInlineElement.prototype.getContainerNode = function () {
        return this.decoratedInline.getContainerNode();
    };
    /**
     * Gets the text content
     */
    PartialInlineElement.prototype.getTextContent = function () {
        return new SelectionRange_1.default(this.start, this.end).getRange().toString();
    };
    /**
     * Gets the start position
     */
    PartialInlineElement.prototype.getStartPosition = function () {
        return this.start;
    };
    /**
     * Gets the end position
     */
    PartialInlineElement.prototype.getEndPosition = function () {
        return this.end;
    };
    /**
     * Checks if it contains a position
     */
    PartialInlineElement.prototype.contains = function (p) {
        return p.isAfter(this.start) && this.end.isAfter(p);
    };
    /**
     * Check if this inline element is after the other inline element
     */
    PartialInlineElement.prototype.isAfter = function (inlineElement) {
        var end = inlineElement.getEndPosition();
        return this.start.equalTo(end) || this.start.isAfter(end);
    };
    /**
     * apply style
     */
    PartialInlineElement.prototype.applyStyle = function (styler) {
        var containerNode = this.getContainerNode();
        var currentNode = this.start.node;
        var offset = this.start.offset;
        while (contains_1.default(containerNode, currentNode, true /*treatSameNodeAsContain*/) &&
            (currentNode == this.end.node ||
                isDocumentPosition_1.default(currentNode.compareDocumentPosition(this.end.node), 4 /* Following */))) {
            // The code below modifies DOM. Need to get the next sibling first otherwise
            // you won't be able to reliably get a good next sibling node
            var nextLeafNode = getLeafSibling_1.getNextLeafSibling(containerNode, currentNode);
            if (currentNode.nodeType == 3 /* Text */) {
                NodeInlineElement_1.applyStyleToTextNode(currentNode, offset, currentNode == this.end.node ? this.end.offset : currentNode.nodeValue.length, styler);
            }
            currentNode = nextLeafNode;
            offset = 0;
        }
    };
    return PartialInlineElement;
}());
exports.default = PartialInlineElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/inlineElements/getFirstLastInlineElement.ts":
/*!***************************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/inlineElements/getFirstLastInlineElement.ts ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getInlineElementAtNode_1 = __webpack_require__(/*! ./getInlineElementAtNode */ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementAtNode.ts");
var getLeafNode_1 = __webpack_require__(/*! ../domWalker/getLeafNode */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafNode.ts");
/**
 * Get first inline element
 */
function getFirstInlineElement(rootNode) {
    // getFirstLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    var node = getLeafNode_1.getFirstLeafNode(rootNode);
    return getInlineElementAtNode_1.default(node);
}
exports.getFirstInlineElement = getFirstInlineElement;
/**
 * Get last inline element
 */
function getLastInlineElement(rootNode) {
    // getLastLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    var node = getLeafNode_1.getLastLeafNode(rootNode);
    return getInlineElementAtNode_1.default(node);
}
exports.getLastInlineElement = getLastInlineElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementAtNode.ts":
/*!************************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementAtNode.ts ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NodeInlineElement_1 = __webpack_require__(/*! ./NodeInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/NodeInlineElement.ts");
/**
 * Get the inline element at a node
 * @param node The node to get InlineElement froms
 */
function getInlineElementAtNode(node) {
    return node ? new NodeInlineElement_1.default(node) : null;
}
exports.default = getInlineElementAtNode;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementBeforeAfter.ts":
/*!*****************************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementBeforeAfter.ts ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(/*! ./PartialInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/PartialInlineElement.ts");
var getInlineElementAtNode_1 = __webpack_require__(/*! ./getInlineElementAtNode */ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementAtNode.ts");
var shouldSkipNode_1 = __webpack_require__(/*! ../domWalker/shouldSkipNode */ "./packages/roosterjs-editor-dom/lib/domWalker/shouldSkipNode.ts");
var getLeafSibling_1 = __webpack_require__(/*! ../domWalker/getLeafSibling */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts");
/**
 * Get inline element before a position
 * This is mostly used when we want to get the inline element before selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param rootNode Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement before
 */
function getInlineElementBefore(rootNode, position) {
    return getInlineElementBeforeAfterPoint(rootNode, position, false /*isAfter*/);
}
exports.getInlineElementBefore = getInlineElementBefore;
/**
 * Get inline element after a position
 * This is mostly used when we want to get the inline element after selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param rootNode Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement after
 */
function getInlineElementAfter(rootNode, position) {
    return getInlineElementBeforeAfterPoint(rootNode, position, true /*isAfter*/);
}
exports.getInlineElementAfter = getInlineElementAfter;
function getInlineElementBeforeAfterPoint(rootNode, position, isAfter) {
    if (!position || !position.node) {
        return null;
    }
    position = position.normalize();
    var node = position.node;
    var isPartial = false;
    var traverseFunc = isAfter ? getLeafSibling_1.getNextLeafSibling : getLeafSibling_1.getPreviousLeafSibling;
    if ((!isAfter && position.offset == 0 && !position.isAtEnd) || (isAfter && position.isAtEnd)) {
        node = traverseFunc(rootNode, node);
    }
    else if (node.nodeType == 3 /* Text */ &&
        ((!isAfter && !position.isAtEnd) || (isAfter && position.offset > 0))) {
        isPartial = true;
    }
    while (node && shouldSkipNode_1.default(node)) {
        node = traverseFunc(rootNode, node);
    }
    var inlineElement = getInlineElementAtNode_1.default(node);
    if (inlineElement && (inlineElement.contains(position) || isPartial)) {
        inlineElement = isAfter
            ? new PartialInlineElement_1.default(inlineElement, position, null)
            : new PartialInlineElement_1.default(inlineElement, null, position);
    }
    return inlineElement;
}


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/inlineElements/getNextPreviousInlineElement.ts":
/*!******************************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/inlineElements/getNextPreviousInlineElement.ts ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PartialInlineElement_1 = __webpack_require__(/*! ./PartialInlineElement */ "./packages/roosterjs-editor-dom/lib/inlineElements/PartialInlineElement.ts");
var getInlineElementAtNode_1 = __webpack_require__(/*! ./getInlineElementAtNode */ "./packages/roosterjs-editor-dom/lib/inlineElements/getInlineElementAtNode.ts");
var getLeafSibling_1 = __webpack_require__(/*! ../domWalker/getLeafSibling */ "./packages/roosterjs-editor-dom/lib/domWalker/getLeafSibling.ts");
/**
 * Get next inline element
 */
function getNextInlineElement(rootNode, inlineElement) {
    var end = inlineElement.getEndPosition();
    return end.isAtEnd
        ? getInlineElementAtNode_1.default(getLeafSibling_1.getLeafSibling(rootNode, inlineElement.getContainerNode(), true /*isNext*/))
        : new PartialInlineElement_1.default(inlineElement, end, null);
}
exports.getNextInlineElement = getNextInlineElement;
/**
 * Get previous inline element
 */
function getPreviousInlineElement(rootNode, inlineElement) {
    var start = inlineElement.getStartPosition();
    return start.offset == 0
        ? getInlineElementAtNode_1.default(getLeafSibling_1.getLeafSibling(rootNode, inlineElement.getContainerNode(), false /*isNext*/))
        : new PartialInlineElement_1.default(inlineElement, null, start);
}
exports.getPreviousInlineElement = getPreviousInlineElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/selection/Position.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/selection/Position.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getElementOrParentElement_1 = __webpack_require__(/*! ../utils/getElementOrParentElement */ "./packages/roosterjs-editor-dom/lib/utils/getElementOrParentElement.ts");
var isNodeAfter_1 = __webpack_require__(/*! ../utils/isNodeAfter */ "./packages/roosterjs-editor-dom/lib/utils/isNodeAfter.ts");
/**
 * Represent a position in DOM tree by the node and its offset index
 */
var Position = /** @class */ (function () {
    function Position(nodeOrPosition, offsetOrPosType) {
        if (nodeOrPosition.node) {
            this.node = nodeOrPosition.node;
            offsetOrPosType = nodeOrPosition.offset;
        }
        else {
            this.node = nodeOrPosition;
        }
        switch (offsetOrPosType) {
            case "b" /* Before */:
                this.offset = getIndexOfNode(this.node);
                this.node = this.node.parentNode;
                this.isAtEnd = false;
                break;
            case "a" /* After */:
                this.offset = getIndexOfNode(this.node) + 1;
                this.isAtEnd = !this.node.nextSibling;
                this.node = this.node.parentNode;
                break;
            case "e" /* End */:
                this.offset = getEndOffset(this.node);
                this.isAtEnd = true;
                break;
            default:
                var endOffset = getEndOffset(this.node);
                this.offset = Math.max(0, Math.min(offsetOrPosType, endOffset));
                this.isAtEnd =
                    offsetOrPosType == "e" /* End */ ||
                        (this.offset > 0 && this.offset == endOffset);
                break;
        }
        this.element = getElementOrParentElement_1.default(this.node);
    }
    /**
     * Normalize this position the leaf node, return the normalize result.
     * If current position is already using leaf node, return this position object itself
     */
    Position.prototype.normalize = function () {
        if (this.node.nodeType == 3 /* Text */ || !this.node.firstChild) {
            return this;
        }
        var node = this.node;
        var newOffset = this.isAtEnd
            ? "e" /* End */
            : this.offset;
        while (node.nodeType == 1 /* Element */ && node.firstChild) {
            node =
                newOffset == 0 /* Begin */
                    ? node.firstChild
                    : newOffset == "e" /* End */
                        ? node.lastChild
                        : node.childNodes[newOffset];
            newOffset = this.isAtEnd ? "e" /* End */ : 0 /* Begin */;
        }
        return new Position(node, newOffset);
    };
    /**
     * Check if this position is equal to the given position
     * @param p The position to check
     */
    Position.prototype.equalTo = function (p) {
        return (this == p ||
            (this.node == p.node && this.offset == p.offset && this.isAtEnd == p.isAtEnd));
    };
    /**
     * Checks if position 1 is after position 2
     */
    Position.prototype.isAfter = function (p) {
        return this.node == p.node
            ? (this.isAtEnd && !p.isAtEnd) || this.offset > p.offset
            : isNodeAfter_1.default(this.node, p.node);
    };
    Position.Before = "b" /* Before */;
    Position.Begin = 0 /* Begin */;
    Position.End = "e" /* End */;
    Position.After = "a" /* After */;
    return Position;
}());
exports.default = Position;
function getIndexOfNode(node) {
    var i = 0;
    while ((node = node.previousSibling)) {
        i++;
    }
    return i;
}
function getEndOffset(node) {
    if (node.nodeType == 3 /* Text */) {
        return node.nodeValue.length;
    }
    else if (node.nodeType == 1 /* Element */) {
        return node.childNodes.length;
    }
    else {
        return 1;
    }
}


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/selection/SelectionRange.ts":
/*!***********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/selection/SelectionRange.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Position_1 = __webpack_require__(/*! ./Position */ "./packages/roosterjs-editor-dom/lib/selection/Position.ts");
/**
 * Represent a selection range in DOM tree
 */
var SelectionRange = /** @class */ (function () {
    function SelectionRange(startOrRawRange, end) {
        if (startOrRawRange instanceof Range) {
            this.rawRange = startOrRawRange;
            this.start = new Position_1.default(startOrRawRange.startContainer, startOrRawRange.startOffset);
            this.end = new Position_1.default(startOrRawRange.endContainer, startOrRawRange.endOffset);
        }
        else {
            this.start = startOrRawRange;
            this.end = end || this.start;
        }
        this.collapsed = this.start.node == this.end.node && this.start.offset == this.end.offset;
    }
    /**
     * Retrieve the browser range object
     */
    SelectionRange.prototype.getRange = function () {
        if (!this.rawRange) {
            var document_1 = this.start.node.ownerDocument;
            this.rawRange = document_1.createRange();
            this.rawRange.setStart(this.start.node, this.start.offset);
            this.rawRange.setEnd(this.end.node, this.end.offset);
        }
        return this.rawRange;
    };
    /**
     * Normal this selction range by normalizing its start and end position
     */
    SelectionRange.prototype.normalize = function () {
        return new SelectionRange(this.start.normalize(), this.end.normalize());
    };
    return SelectionRange;
}());
exports.default = SelectionRange;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/Browser.ts":
/*!************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/Browser.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get current browser information from user agent string
 * @param userAgent The userAgent string of a browser
 * @param appVersion The appVersion string of a browser
 * @returns The BrowserInfo object calculated from the given userAgent and appVersion
 */
function getBrowserInfo(userAgent, appVersion) {
    // checks whether the browser is running in IE
    // IE11 will use rv in UA instead of MSIE. Unfortunately Firefox also uses this. We should also look for "Trident" to confirm this.
    // There have been cases where companies using older version of IE and custom UserAgents have broken this logic (e.g. IE 10 and KellyServices)
    // therefore we should check that the Trident/rv combo is not just from an older IE browser
    var isIE11OrGreater = userAgent.indexOf('rv:') != -1 && userAgent.indexOf('Trident') != -1;
    var isIE = userAgent.indexOf('MSIE') != -1 || isIE11OrGreater;
    // IE11+ may also have 'Chrome', 'Firefox' and 'Safari' in user agent. But it will have 'trident' as well
    var isChrome = false;
    var isFirefox = false;
    var isSafari = false;
    var isEdge = false;
    if (!isIE) {
        isChrome = userAgent.indexOf('Chrome') != -1;
        isFirefox = userAgent.indexOf('Firefox') != -1;
        if (userAgent.indexOf('Safari') != -1) {
            // Android and Chrome have Safari in the user string
            isSafari = userAgent.indexOf('Chrome') == -1 && userAgent.indexOf('Android') == -1;
        }
        // Sample Edge UA: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10121
        isEdge = userAgent.indexOf('Edge') != -1;
        // When it is edge, it should not be chrome or firefox. and it is also not webkit
        if (isEdge) {
            isChrome = isFirefox = false;
        }
    }
    var isMac = appVersion.indexOf('Mac') != -1;
    var isWin = appVersion.indexOf('Win') != -1 || appVersion.indexOf('NT') != -1;
    return {
        isMac: isMac,
        isWin: isWin,
        isIE: isIE,
        isSafari: isSafari,
        isChrome: isChrome,
        isFirefox: isFirefox,
        isEdge: isEdge,
    };
}
exports.getBrowserInfo = getBrowserInfo;
var Browser = window
    ? getBrowserInfo(window.navigator.userAgent, window.navigator.appVersion)
    : {};
exports.default = Browser;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/applyFormat.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/applyFormat.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Apply format to an HTML element
 * @param element The HTML element to apply format to
 * @param format The format to apply
 */
function applyFormat(element, format) {
    if (format) {
        var elementStyle = element.style;
        var fontFamily = format.fontFamily, fontSize = format.fontSize, textColor = format.textColor, backgroundColor = format.backgroundColor, bold = format.bold, italic = format.italic, underline = format.underline;
        if (fontFamily) {
            elementStyle.fontFamily = fontFamily;
        }
        if (fontSize) {
            elementStyle.fontSize = fontSize;
        }
        if (textColor) {
            elementStyle.color = textColor;
        }
        if (backgroundColor) {
            elementStyle.backgroundColor = backgroundColor;
        }
        if (bold) {
            elementStyle.fontWeight = 'bold';
        }
        if (italic) {
            elementStyle.fontStyle = 'italic';
        }
        if (underline) {
            elementStyle.textDecoration = 'underline';
        }
    }
}
exports.default = applyFormat;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/changeElementTag.ts":
/*!*********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/changeElementTag.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getComputedStyles_1 = __webpack_require__(/*! ./getComputedStyles */ "./packages/roosterjs-editor-dom/lib/utils/getComputedStyles.ts");
var getTagOfNode_1 = __webpack_require__(/*! ./getTagOfNode */ "./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts");
/**
 * Change tag of ab HTML Element to a new one, and replace it from DOM tree
 * @param element The element to change tag
 * @param newTag New tag to change to
 * @returns The new Node with new tag
 */
function changeElementTag(element, newTag) {
    var newElement = element.ownerDocument.createElement(newTag);
    for (var i = 0; i < element.attributes.length; i++) {
        var attr = element.attributes[i];
        newElement.setAttribute(attr.name, attr.value);
    }
    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }
    if (getTagOfNode_1.default(element) == 'P') {
        var styles = getComputedStyles_1.default(element, ['margin-top', 'margin-bottom']);
        newElement.style.marginTop = styles[0];
        newElement.style.marginBottom = styles[1];
    }
    if (element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
    }
    return newElement;
}
exports.default = changeElementTag;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/contains.ts":
/*!*************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/contains.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function contains(container, contained, treatSameNodeAsContain) {
    if (!container || !contained) {
        return false;
    }
    if (!(contained instanceof Node)) {
        var range = contained instanceof Range ? contained : contained.getRange();
        contained = range ? range.commonAncestorContainer : null;
        treatSameNodeAsContain = true;
    }
    if (contained && contained.nodeType == 3 /* Text */) {
        contained = contained.parentNode;
        treatSameNodeAsContain = true;
    }
    if (container.nodeType != 1 /* Element */) {
        return !!treatSameNodeAsContain && container == contained;
    }
    return !!(treatSameNodeAsContain || container != contained) && container.contains(contained);
}
exports.default = contains;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/fromHtml.ts":
/*!*************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/fromHtml.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sanitizeHtml_1 = __webpack_require__(/*! ./sanitizeHtml */ "./packages/roosterjs-editor-dom/lib/utils/sanitizeHtml.ts");
/**
 * Creates an HTML node array from html
 * @param html the html string to create HTML elements from
 * @param ownerDocument Owner document of the result HTML elements
 * @param sanitize Whether do sanitization before create elements to avoid XSS. Default value is false
 * @returns An HTML node array to represent the given html string
 */
function fromHtml(html, ownerDocument, sanitize) {
    var element = ownerDocument.createElement('DIV');
    element.innerHTML = sanitize ? sanitizeHtml_1.default(html) : html;
    return [].slice.call(element.childNodes);
}
exports.default = fromHtml;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/getComputedStyles.ts":
/*!**********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/getComputedStyles.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = getComputedStyles;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/getElementOrParentElement.ts":
/*!******************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/getElementOrParentElement.ts ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get element from node or its parent
 * @param node The node to get element from
 * @returns node itself if the node is an element, or its parent node
 */
function getElementOrParentElement(node) {
    node = !node ? null : node.nodeType == 1 /* Element */ ? node : node.parentNode;
    return node && node.nodeType == 1 /* Element */ ? node : null;
}
exports.default = getElementOrParentElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get the html tag of a node, or empty if it is not an element
 * @param node The node to get tag of
 * @returns Tag name in upper case if the given node is an Element, or empty string otherwise
 */
function getTagOfNode(node) {
    return node && node.nodeType == 1 /* Element */ ? node.tagName.toUpperCase() : '';
}
exports.default = getTagOfNode;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/intersectWithNodeRange.ts":
/*!***************************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/intersectWithNodeRange.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(/*! ./isDocumentPosition */ "./packages/roosterjs-editor-dom/lib/utils/isDocumentPosition.ts");
/**
 * Check if a given node has intersection with the given node range
 * @param node The node to check
 * @param start Start node of the range
 * @param end End node of the range
 * @param nodeContainedByRangeOnly When set to true, will return true only when the node is between
 * start and end nodes or contained by start or end node. When set to false, also return true
 * if the node contains both start and end node
 * @return True if the node has intersection with the range. Otherwise false
 */
function intersectWithNodeRange(node, start, end, nodeContainedByRangeOnly) {
    var startPosition = node.compareDocumentPosition(start);
    var endPosition = node.compareDocumentPosition(end);
    var targetPositions = [0 /* Same */, 8 /* Contains */];
    if (!nodeContainedByRangeOnly) {
        targetPositions.push(16 /* ContainedBy */);
    }
    return (isDocumentPosition_1.default(startPosition, targetPositions) || // intersectStart
        isDocumentPosition_1.default(endPosition, targetPositions) || // intersectEnd
        (isDocumentPosition_1.default(startPosition, 2 /* Preceding */) && // Contains
            isDocumentPosition_1.default(endPosition, 4 /* Following */) &&
            !isDocumentPosition_1.default(endPosition, 16 /* ContainedBy */)));
}
exports.default = intersectWithNodeRange;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/isBlockElement.ts":
/*!*******************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/isBlockElement.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getTagOfNode_1 = __webpack_require__(/*! ./getTagOfNode */ "./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts");
var BLOCK_ELEMENT_TAGS = [
    'ADDRESS',
    'ARTICLE',
    'ASIDE',
    'BLOCKQUOTE',
    'CANVAS',
    'DD',
    'DIV',
    'DL',
    'DT',
    'FIELDSET',
    'FIGCAPTION',
    'FIGURE',
    'FOOTER',
    'FORM',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'HEADER',
    'HR',
    'LI',
    'MAIN',
    'NAV',
    'NOSCRIPT',
    'OL',
    'OUTPUT',
    'P',
    'PRE',
    'SECTION',
    'TABLE',
    'TD',
    'TFOOT',
    'UL',
    'VIDEO',
];
var BLOCK_DISPLAY_STYLES = ['block', 'list-item', 'table-cell'];
/**
 * Checks if the node is a block like element. Block like element are usually those P, DIV, LI, TD etc.
 * @param node The node to check
 * @returns True if the node is a block element, otherwise false
 */
function isBlockElement(node) {
    var tag = getTagOfNode_1.default(node);
    return !!(tag &&
        (BLOCK_DISPLAY_STYLES.indexOf(node.style.display) >= 0 ||
            BLOCK_ELEMENT_TAGS.indexOf(tag) >= 0));
}
exports.default = isBlockElement;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/isDocumentPosition.ts":
/*!***********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/isDocumentPosition.ts ***!
  \***********************************************************************/
/*! no static exports found */
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

/***/ "./packages/roosterjs-editor-dom/lib/utils/isNodeAfter.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/isNodeAfter.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isDocumentPosition_1 = __webpack_require__(/*! ./isDocumentPosition */ "./packages/roosterjs-editor-dom/lib/utils/isDocumentPosition.ts");
/**
 * Checks if node1 is after node2
 * @param node1 The node to check if it is after another node
 * @param node2 The node to check if another node is after this one
 * @returns True if node1 is after node2, otherwise false
 */
function isNodeAfter(node1, node2) {
    return !!(node1 &&
        node2 &&
        isDocumentPosition_1.default(node2.compareDocumentPosition(node1), 4 /* Following */));
}
exports.default = isNodeAfter;


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/isNodeEmpty.ts":
/*!****************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/isNodeEmpty.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VISIBLE_ELEMENT_SELECTOR = ['table', 'img', 'li'].join(',');
var ZERO_WIDTH_SPACE = /\u200b/g;
/**
 * Check if a given node has no visible content
 * @param node The node to check
 * @param trimContent Whether trim the text content so that spaces will be treated as empty.
 * Default value is false
 * @returns True if there isn't any visible element inside node, otherwise false
 */
function isNodeEmpty(node, trimContent) {
    if (node.nodeType == 3 /* Text */) {
        return trim(node.nodeValue, trimContent) != '';
    }
    else if (node.nodeType == 1 /* Element */) {
        var element = node;
        var textContent = trim(element.textContent, trimContent);
        if (textContent != '' || element.querySelectorAll(VISIBLE_ELEMENT_SELECTOR)[0]) {
            return false;
        }
    }
    return true;
}
exports.default = isNodeEmpty;
function trim(s, trim) {
    s = s.replace(ZERO_WIDTH_SPACE, '');
    return trim ? s.trim() : s;
}


/***/ }),

/***/ "./packages/roosterjs-editor-dom/lib/utils/matchLink.ts":
/*!**************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/matchLink.ts ***!
  \**************************************************************/
/*! no static exports found */
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

/***/ "./packages/roosterjs-editor-dom/lib/utils/sanitizeHtml.ts":
/*!*****************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/sanitizeHtml.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getTagOfNode_1 = __webpack_require__(/*! ./getTagOfNode */ "./packages/roosterjs-editor-dom/lib/utils/getTagOfNode.ts");
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
function sanitizeHtml(html, additionalStyleNodes, convertInlineCssOnly, propertyCallbacks, currentStyle, preserveFragmentOnly) {
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
var ALLOWED_HTML_TAGS = [
    'BODY',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'FORM',
    'P',
    'BR',
    'NOBR',
    'HR',
    'ACRONYM',
    'ABBR',
    'ADDRESS',
    'B',
    'BDI',
    'BDO',
    'BIG',
    'BLOCKQUOTE',
    'CENTER',
    'CITE',
    'CODE',
    'DEL',
    'DFN',
    'EM',
    'FONT',
    'I',
    'INS',
    'KBD',
    'MARK',
    'METER',
    'PRE',
    'PROGRESS',
    'Q',
    'RP',
    'RT',
    'RUBY',
    'S',
    'SAMP',
    'SMALL',
    'STRIKE',
    'STRONG',
    'SUB',
    'SUP',
    'TEMPLATE',
    'TIME',
    'TT',
    'U',
    'VAR',
    'WBR',
    'XMP',
    'INPUT',
    'TEXTAREA',
    'BUTTON',
    'SELECT',
    'OPTGROUP',
    'OPTION',
    'LABEL',
    'FIELDSET',
    'LEGEND',
    'DATALIST',
    'OUTPUT',
    'IMG',
    'MAP',
    'AREA',
    'CANVAS',
    'FIGCAPTION',
    'FIGURE',
    'PICTURE',
    'A',
    'NAV',
    'UL',
    'OL',
    'LI',
    'DIR',
    'UL',
    'DL',
    'DT',
    'DD',
    'MENU',
    'MENUITEM',
    'TABLE',
    'CAPTION',
    'TH',
    'TR',
    'TD',
    'THEAD',
    'TBODY',
    'TFOOT',
    'COL',
    'COLGROUP',
    'DIV',
    'SPAN',
    'HEADER',
    'FOOTER',
    'MAIN',
    'SECTION',
    'ARTICLE',
    'ASIDE',
    'DETAILS',
    'DIALOG',
    'SUMMARY',
    'DATA',
];
var ALLOWED_HTML_ATTRIBUTES = [
    'accept',
    'align',
    'alt',
    'checked',
    'cite',
    'cols',
    'colspan',
    'contextmenu',
    'coords',
    'datetime',
    'default',
    'dir',
    'dirname',
    'disabled',
    'download',
    'headers',
    'height',
    'hidden',
    'high',
    'href',
    'hreflang',
    'ismap',
    'kind',
    'label',
    'lang',
    'list',
    'low',
    'max',
    'maxlength',
    'media',
    'min',
    'multiple',
    'open',
    'optimum',
    'pattern',
    'placeholder',
    'readonly',
    'rel',
    'required',
    'reversed',
    'rows',
    'rowspan',
    'scope',
    'selected',
    'shape',
    'size',
    'sizes',
    'span',
    'spellcheck',
    'src',
    'srclang',
    'srcset',
    'start',
    'step',
    'style',
    'tabindex',
    'target',
    'title',
    'translate',
    'type',
    'usemap',
    'value',
    'width',
    'wrap',
];
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
function removeUnusedCssAndDangerousContent(node, callbackPropertyNames, propertyCallbacks, currentStyle) {
    var thisStyle = Object.assign ? Object.assign({}, currentStyle) : {};
    var nodeType = node.nodeType;
    var tag = getTagOfNode_1.default(node) || '';
    var isElement = nodeType == 1 /* Element */;
    var isText = nodeType == 3 /* Text */;
    if ((isElement && ALLOWED_HTML_TAGS.indexOf(tag) < 0 && tag.indexOf(':') < 0) ||
        (isText && /^[\r\n]*$/g.test(node.nodeValue)) ||
        (!isElement && !isText)) {
        node.parentNode.removeChild(node);
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
                !isDangerousCss(name_1, value);
            if (keep && isInheritable) {
                thisStyle[name_1] = value;
            }
            return keep;
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
function isDangerousCss(name, value) {
    if (name == 'position') {
        return true;
    }
    if (value.indexOf('expression') >= 0) {
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

/***/ "./packages/roosterjs-editor-dom/lib/utils/splitParentNode.ts":
/*!********************************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/splitParentNode.ts ***!
  \********************************************************************/
/*! no static exports found */
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

/***/ "./packages/roosterjs-editor-dom/lib/utils/unwrap.ts":
/*!***********************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/unwrap.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Removes the node and keep all children in place, return the parentNode where the children are attached
 * @param node the node to remove
 */
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

/***/ "./packages/roosterjs-editor-dom/lib/utils/wrap.ts":
/*!*********************************************************!*\
  !*** ./packages/roosterjs-editor-dom/lib/utils/wrap.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fromHtml_1 = __webpack_require__(/*! ./fromHtml */ "./packages/roosterjs-editor-dom/lib/utils/fromHtml.ts");
/**
 * Wrap all the node with html and return the wrapped node, and put the wrapper node under the parent of the first node
 * @param nodes The node or node array to wrap
 * @param wrapper The wrapper node or HTML string, default value is <div></div>
 * @param sanitize Whether do sanitization of wrapper string before create node to avoid XSS,
 * default value is false
 * @returns The wrapper element
 */
function wrap(nodes, wrapper, sanitize) {
    nodes = !nodes ? [] : nodes instanceof Node ? [nodes] : nodes;
    if (nodes.length == 0 || !nodes[0]) {
        return null;
    }
    wrapper =
        wrapper instanceof Element
            ? wrapper
            : fromHtml_1.default(wrapper || '<div></div>', nodes[0].ownerDocument, sanitize)[0];
    var parentNode = nodes[0].parentNode;
    if (parentNode) {
        parentNode.insertBefore(wrapper, nodes[0]);
    }
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        wrapper.appendChild(node);
    }
    return wrapper;
}
exports.default = wrap;


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/ContentEdit/ContentEdit.ts":
/*!**************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/ContentEdit/ContentEdit.ts ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ContentEditFeatures_1 = __webpack_require__(/*! ./ContentEditFeatures */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/ContentEditFeatures.ts");
var autoBulletFeatures_1 = __webpack_require__(/*! ./autoBulletFeatures */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/autoBulletFeatures.ts");
var autoLinkFeatures_1 = __webpack_require__(/*! ./autoLinkFeatures */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/autoLinkFeatures.ts");
var ListFeatures_1 = __webpack_require__(/*! ./ListFeatures */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/ListFeatures.ts");
var quoteFeatures_1 = __webpack_require__(/*! ./quoteFeatures */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/quoteFeatures.ts");
var tableFeatures_1 = __webpack_require__(/*! ./tableFeatures */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/tableFeatures.ts");
var KEY_BACKSPACE = 8;
/**
 * An editor plugin to handle content edit event.
 * The following cases are included:
 * 1. Auto increase/decrease indentation on Tab, Shift+tab
 * 2. Enter, Backspace on empty list item
 * 3. Enter, Backspace on empty blockquote line
 * 4. Auto bullet/numbering
 * 5. Auto link
 * 6. Tab in table
 */
var ContentEdit = /** @class */ (function () {
    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    function ContentEdit(featureSet) {
        this.features = [];
        this.keys = [];
        featureSet = featureSet || ContentEditFeatures_1.getDefaultContentEditFeatures();
        this.addFeature(featureSet.indentOutdentWhenTab, ListFeatures_1.IndentOutdentWhenTab);
        this.addFeature(featureSet.outdentWhenBackspaceOnEmptyFirstLine, ListFeatures_1.OutdentBSEmptyLine1);
        this.addFeature(featureSet.outdentWhenEnterOnEmptyLine, ListFeatures_1.OutdentWhenEnterOnEmptyLine);
        this.addFeature(featureSet.mergeInNewLineWhenBackspaceOnFirstChar, ListFeatures_1.MergeInNewLine);
        this.addFeature(featureSet.unquoteWhenBackspaceOnEmptyFirstLine, quoteFeatures_1.UnquoteBSEmptyLine1);
        this.addFeature(featureSet.unquoteWhenEnterOnEmptyLine, quoteFeatures_1.UnquoteWhenEnterOnEmptyLine);
        this.addFeature(featureSet.tabInTable, tableFeatures_1.TabInTable);
        this.addFeature(featureSet.autoBullet, autoBulletFeatures_1.AutoBullet);
        this.addFeature(featureSet.autoLink, autoLinkFeatures_1.AutoLink1);
        this.addFeature(featureSet.autoLink, autoLinkFeatures_1.AutoLink2);
        this.autoLinkEnabled = featureSet.autoLink;
    }
    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    ContentEdit.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    /**
     * Dispose this plugin
     */
    ContentEdit.prototype.dispose = function () {
        this.editor = null;
    };
    /**
     * Check whether the event should be handled exclusively by this plugin
     */
    ContentEdit.prototype.willHandleEventExclusively = function (event) {
        var keyboardEvent = event.rawEvent;
        if (event.eventType == 0 /* KeyDown */ &&
            this.keys.indexOf(keyboardEvent.which) >= 0 &&
            !keyboardEvent.ctrlKey &&
            !keyboardEvent.altKey &&
            !keyboardEvent.metaKey) {
            for (var _i = 0, _a = this.features; _i < _a.length; _i++) {
                var feature = _a[_i];
                if (feature.key == keyboardEvent.which &&
                    feature.shouldHandleEvent(event, this.editor)) {
                    this.currentFeature = feature;
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Handle the event
     */
    ContentEdit.prototype.onPluginEvent = function (event) {
        var keyboardEvent = event.rawEvent;
        if (event.eventType == 0 /* KeyDown */ && this.backspaceUndoEventSource) {
            this.backspaceUndoEventSource = null;
            if (keyboardEvent.which == KEY_BACKSPACE) {
                keyboardEvent.preventDefault();
                this.editor.undo();
            }
        }
        else if (this.currentFeature) {
            var feature = this.currentFeature;
            this.currentFeature = null;
            this.backspaceUndoEventSource = feature.handleEvent(event, this.editor);
        }
        else if (event.eventType == 6 /* ContentChanged */) {
            var contentChangedEvent = event;
            if (this.backspaceUndoEventSource &&
                contentChangedEvent.source != this.backspaceUndoEventSource) {
                this.backspaceUndoEventSource = null;
            }
            if (contentChangedEvent.source == "Paste" /* Paste */ && this.autoLinkEnabled && autoLinkFeatures_1.AutoLink1.shouldHandleEvent(event, this.editor)) {
                autoLinkFeatures_1.AutoLink1.handleEvent(event, this.editor);
            }
        }
    };
    ContentEdit.prototype.addFeature = function (add, feature) {
        if (add) {
            this.features.push(feature);
            if (this.keys.indexOf(feature.key) < 0) {
                this.keys.push(feature.key);
            }
        }
    };
    return ContentEdit;
}());
exports.default = ContentEdit;


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/ContentEdit/ContentEditFeatures.ts":
/*!**********************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/ContentEdit/ContentEditFeatures.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get default feature set of ContentEdit plugin
 */
function getDefaultContentEditFeatures() {
    return {
        indentOutdentWhenTab: true,
        outdentWhenBackspaceOnEmptyFirstLine: true,
        outdentWhenEnterOnEmptyLine: true,
        mergeInNewLineWhenBackspaceOnFirstChar: false,
        unquoteWhenBackspaceOnEmptyFirstLine: true,
        unquoteWhenEnterOnEmptyLine: true,
        autoBullet: true,
        autoLink: true,
        tabInTable: true,
    };
}
exports.getDefaultContentEditFeatures = getDefaultContentEditFeatures;


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/ContentEdit/ListFeatures.ts":
/*!***************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/ContentEdit/ListFeatures.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
var KEY_BACKSPACE = 8;
var KEY_TAB = 9;
var KEY_ENTER = 13;
exports.IndentOutdentWhenTab = {
    key: KEY_TAB,
    shouldHandleEvent: roosterjs_editor_api_1.cacheGetListTag,
    handleEvent: function (event, editor) {
        var shift = event.rawEvent.shiftKey;
        roosterjs_editor_api_1.setIndentation(editor, shift ? 1 /* Decrease */ : 0 /* Increase */);
        event.rawEvent.preventDefault();
    },
};
exports.MergeInNewLine = {
    key: KEY_BACKSPACE,
    shouldHandleEvent: function (event, editor) {
        var range;
        var li = roosterjs_editor_api_1.cacheGetNodeAtCursor(editor, event, 'LI');
        return (li &&
            (range = editor.getSelectionRange()) &&
            range.collapsed &&
            range.start.offset == 0 &&
            new roosterjs_editor_dom_1.Position(li, 0).normalize().equalTo(range.start.normalize()));
    },
    handleEvent: function (event, editor) {
        var li = roosterjs_editor_api_1.cacheGetNodeAtCursor(editor, event, 'LI');
        if (li.previousSibling) {
            editor.runAsync(function () {
                var document = editor.getDocument();
                var br = document.createElement('br');
                editor.insertNode(br);
                editor.select(br, roosterjs_editor_dom_1.Position.After);
            });
        }
        else {
            toggleListAndPreventDefault(event, editor);
        }
    },
};
exports.OutdentBSEmptyLine1 = {
    key: KEY_BACKSPACE,
    shouldHandleEvent: function (event, editor) {
        var li = roosterjs_editor_api_1.cacheGetNodeAtCursor(editor, event, 'LI');
        return li && roosterjs_editor_dom_1.isNodeEmpty(li) && !li.previousSibling;
    },
    handleEvent: toggleListAndPreventDefault,
};
exports.OutdentWhenEnterOnEmptyLine = {
    key: KEY_ENTER,
    shouldHandleEvent: function (event, editor) {
        var li = roosterjs_editor_api_1.cacheGetNodeAtCursor(editor, event, 'LI');
        return li && roosterjs_editor_dom_1.isNodeEmpty(li);
    },
    handleEvent: toggleListAndPreventDefault,
};
function toggleListAndPreventDefault(event, editor) {
    var tag = roosterjs_editor_api_1.cacheGetListTag(event, editor);
    if (tag == 'UL') {
        roosterjs_editor_api_1.toggleBullet(editor);
    }
    else if (tag == 'OL') {
        roosterjs_editor_api_1.toggleNumbering(editor);
    }
    event.rawEvent.preventDefault();
}


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/ContentEdit/autoBulletFeatures.ts":
/*!*********************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/ContentEdit/autoBulletFeatures.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
var KEY_SPACE = 32;
exports.AutoBullet = {
    key: KEY_SPACE,
    shouldHandleEvent: function (event, editor) {
        if (!roosterjs_editor_api_1.cacheGetListTag(event, editor)) {
            var cursorData = roosterjs_editor_api_1.cacheGetCursorEventData(event, editor);
            var textBeforeCursor = cursorData.getXCharsBeforeCursor(3);
            // Auto list is triggered if:
            // 1. Text before cursor exactly mathces '*', '-' or '1.'
            // 2. There's no non-text inline entities before cursor
            return (['*', '-', '1.'].indexOf(textBeforeCursor) >= 0 &&
                !cursorData.getFirstNonTextInlineBeforeCursor());
        }
        return false;
    },
    handleEvent: function (event, editor) {
        editor.runAsync(function () {
            var listNode;
            var cursorData = roosterjs_editor_api_1.cacheGetCursorEventData(event, editor);
            var textBeforeCursor = cursorData.getXCharsBeforeCursor(3);
            // editor.insertContent(NBSP);
            editor.formatWithUndo(function () {
                // Remove the user input '*', '-' or '1.'
                var rangeToDelete = roosterjs_editor_api_1.validateAndGetRangeForTextBeforeCursor(editor, textBeforeCursor + '\u00A0', // Add the &nbsp; we just inputted
                true /*exactMatch*/, cursorData);
                if (rangeToDelete) {
                    rangeToDelete.deleteContents();
                }
                // If not explicitly insert br, Chrome will operate on the previous line
                if (roosterjs_editor_dom_1.Browser.isChrome || roosterjs_editor_dom_1.Browser.isChrome) {
                    editor.insertContent('<BR>');
                }
                if (textBeforeCursor == '1.') {
                    roosterjs_editor_api_1.toggleNumbering(editor);
                    listNode = roosterjs_editor_api_1.getNodeAtCursor(editor, 'OL');
                }
                else {
                    roosterjs_editor_api_1.toggleBullet(editor);
                    listNode = roosterjs_editor_api_1.getNodeAtCursor(editor, 'UL');
                }
            }, false /*preserveSelection*/, "AutoBullet" /* AutoBullet */, function () { return listNode; });
        });
        return "AutoBullet" /* AutoBullet */;
    },
};


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/ContentEdit/autoLinkFeatures.ts":
/*!*******************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/ContentEdit/autoLinkFeatures.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_core_1 = __webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
var TRAILING_PUNCTUATION_REGEX = /[.()+={}\[\]\s:;"',>]+$/i;
var MINIMUM_LENGTH = 5;
var KEY_ENTER = 13;
var KEY_SPACE = 32;
exports.AutoLink1 = {
    key: KEY_ENTER,
    shouldHandleEvent: cacheGetLinkData,
    handleEvent: autoLink,
};
exports.AutoLink2 = {
    key: KEY_SPACE,
    shouldHandleEvent: cacheGetLinkData,
    handleEvent: autoLink,
};
function cacheGetLinkData(event, editor) {
    return roosterjs_editor_core_1.cacheGetEventData(event, 'LINK_DATA', function () {
        var cursorData = roosterjs_editor_api_1.cacheGetCursorEventData(event, editor);
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
            return roosterjs_editor_dom_1.matchLink(linkCandidate);
        }
        return null;
    });
}
function autoLink(event, editor) {
    var anchor = editor.getDocument().createElement('a');
    var linkData = cacheGetLinkData(event, editor);
    anchor.textContent = linkData.originalUrl;
    anchor.href = linkData.normalizedUrl;
    editor.runAsync(function () {
        editor.formatWithUndo(function () {
            if (roosterjs_editor_api_1.replaceTextBeforeCursorWithNode(editor, linkData.originalUrl, anchor, false /* exactMatch */, roosterjs_editor_api_1.cacheGetCursorEventData(event, editor))) {
                // The content at cursor has changed. Should also clear the cursor data cache
                roosterjs_editor_api_1.clearCursorEventDataCache(event);
            }
        }, false /*preserveSelection*/, "AutoLink" /* AutoLink */, function () { return anchor; });
    });
    return "AutoLink" /* AutoLink */;
}


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/ContentEdit/quoteFeatures.ts":
/*!****************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/ContentEdit/quoteFeatures.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_core_1 = __webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
var KEY_BACKSPACE = 8;
var KEY_ENTER = 13;
exports.UnquoteBSEmptyLine1 = {
    key: KEY_BACKSPACE,
    shouldHandleEvent: function (event, editor) {
        var childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && roosterjs_editor_dom_1.isNodeEmpty(childOfQuote) && !childOfQuote.previousSibling;
    },
    handleEvent: splitQuote,
};
exports.UnquoteWhenEnterOnEmptyLine = {
    key: KEY_ENTER,
    shouldHandleEvent: function (event, editor) {
        var childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && roosterjs_editor_dom_1.isNodeEmpty(childOfQuote);
    },
    handleEvent: splitQuote,
};
function cacheGetQuoteChild(event, editor) {
    return roosterjs_editor_core_1.cacheGetEventData(event, 'QUOTE_CHILD', function () {
        var node = roosterjs_editor_api_1.getNodeAtCursor(editor);
        while (editor.contains(node) && roosterjs_editor_dom_1.getTagOfNode(node.parentNode) != 'BLOCKQUOTE') {
            node = node.parentNode;
        }
        return roosterjs_editor_dom_1.getTagOfNode(node.parentNode) == 'BLOCKQUOTE' ? node : null;
    });
}
function splitQuote(event, editor) {
    editor.formatWithUndo(function () {
        var childOfQuote = cacheGetQuoteChild(event, editor);
        var blockQuoteElement = childOfQuote.parentNode;
        roosterjs_editor_dom_1.splitParentNode(childOfQuote, false /*splitBefore*/);
        blockQuoteElement.parentNode.insertBefore(childOfQuote, blockQuoteElement.nextSibling);
        if (!blockQuoteElement.firstChild) {
            blockQuoteElement.parentNode.removeChild(blockQuoteElement);
        }
        editor.select(childOfQuote, roosterjs_editor_dom_1.Position.Begin);
    });
    event.rawEvent.preventDefault();
}


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/ContentEdit/tableFeatures.ts":
/*!****************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/ContentEdit/tableFeatures.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
var KEY_TAB = 9;
exports.TabInTable = {
    key: KEY_TAB,
    shouldHandleEvent: function (event, editor) {
        return roosterjs_editor_api_1.cacheGetNodeAtCursor(editor, event, 'TD');
    },
    handleEvent: function (event, editor) {
        var shift = event.rawEvent.shiftKey;
        var td = roosterjs_editor_api_1.cacheGetNodeAtCursor(editor, event, 'TD');
        for (var vtable = new roosterjs_editor_api_1.VTable(td), step = shift ? -1 : 1, row = vtable.row, col = vtable.col + step;; col += step) {
            if (col < 0 || col >= vtable.cells[row].length) {
                row += step;
                if (row < 0 || row >= vtable.cells.length) {
                    editor.select(vtable.table, shift ? roosterjs_editor_dom_1.Position.Before : roosterjs_editor_dom_1.Position.After);
                    break;
                }
                col = shift ? vtable.cells[row].length - 1 : 0;
            }
            var cell = vtable.getCell(row, col);
            if (cell.td) {
                editor.select(cell.td, roosterjs_editor_dom_1.Position.Begin);
                break;
            }
        }
        event.rawEvent.preventDefault();
    },
};


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/DefaultShortcut/DefaultShortcut.ts":
/*!**********************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/DefaultShortcut/DefaultShortcut.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
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
        var commands = roosterjs_editor_dom_1.Browser.isMac ? macCommands : winCommands;
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
/**
 * An editor plugin to respond to default common keyboard short
 * i.e. Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y
 */
var DefaultShortcut = /** @class */ (function () {
    function DefaultShortcut() {
    }
    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    DefaultShortcut.prototype.initialize = function (editor) {
        this.editor = editor;
    };
    /**
     * Dispose this plugin
     */
    DefaultShortcut.prototype.dispose = function () {
        this.editor = null;
    };
    /**
     * Handle the event if it is a tab event, and cursor is at begin of a list
     */
    DefaultShortcut.prototype.willHandleEventExclusively = function (event) {
        var command = tryGetCommandFromEvent(event);
        return command != 0 /* None */;
    };
    /**
     * Handle the event
     */
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

/***/ "./packages/roosterjs-editor-plugins/lib/HyperLink/HyperLink.ts":
/*!**********************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/HyperLink/HyperLink.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var TEMP_TITLE_REGEX = /<a\s+([^>]*\s+)?(title|istemptitle)="[^"]*"\s*([^>]*)\s+(title|istemptitle)="[^"]*"(\s+[^>]*)?>/gm;
var TEMP_TITLE = 'istemptitle';
/**
 * An editor plugin to show a tooltip for existing link and handle Ctrl+Click on a link
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
        this.resetAnchor = function (a) {
            try {
                if (a.getAttribute(TEMP_TITLE)) {
                    a.removeAttribute(TEMP_TITLE);
                    a.removeAttribute('title');
                }
                a.removeEventListener('mouseup', _this.onClickLink);
            }
            catch (e) { }
        };
        this.processLink = function (a) {
            if (!a.title && _this.getTooltipCallback) {
                a.setAttribute(TEMP_TITLE, 'true');
                a.title = _this.getTooltipCallback(_this.tryGetHref(a));
            }
            a.addEventListener('mouseup', _this.onClickLink);
        };
        this.onClickLink = function (keyboardEvent) {
            var href;
            if (!roosterjs_editor_dom_1.Browser.isFirefox &&
                (href = _this.tryGetHref(keyboardEvent.srcElement)) &&
                (roosterjs_editor_dom_1.Browser.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey)) {
                var target = _this.target || '_blank';
                _this.editor.getDocument().defaultView.window.open(href, target);
            }
        };
    }
    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    HyperLink.prototype.initialize = function (editor) {
        this.editor = editor;
        if (roosterjs_editor_dom_1.Browser.isIE) {
            this.editor
                .getDocument()
                .execCommand('AutoUrlDetect', false /* shouldDisplayUserInterface */, false /* value */);
        }
    };
    /**
     * Dispose this plugin
     */
    HyperLink.prototype.dispose = function () {
        this.editor.queryNodes('a[href]', this.resetAnchor);
        this.editor = null;
    };
    /**
     * Handle plugin events
     * @param event The event object
     */
    HyperLink.prototype.onPluginEvent = function (event) {
        switch (event.eventType) {
            case 6 /* ContentChanged */:
                var contentChangedEvent = event;
                if (contentChangedEvent.source == "CreateLink" /* CreateLink */) {
                    this.resetAnchor(contentChangedEvent.data);
                }
                this.editor.queryNodes('a[href]', this.processLink);
                break;
            case 7 /* ExtractContent */:
                var extractContentEvent = event;
                extractContentEvent.content = this.removeTempTooltip(extractContentEvent.content);
                break;
        }
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
    return HyperLink;
}());
exports.default = HyperLink;


/***/ }),

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/Paste.ts":
/*!**************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/Paste.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_core_1 = __webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
var getInheritableStyles_1 = __webpack_require__(/*! ./getInheritableStyles */ "./packages/roosterjs-editor-plugins/lib/Paste/getInheritableStyles.ts");
var buildClipboardData_1 = __webpack_require__(/*! ./buildClipboardData */ "./packages/roosterjs-editor-plugins/lib/Paste/buildClipboardData.ts");
var convertPastedContentFromWord_1 = __webpack_require__(/*! ./wordConverter/convertPastedContentFromWord */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/convertPastedContentFromWord.ts");
var textToHtml_1 = __webpack_require__(/*! ./textToHtml */ "./packages/roosterjs-editor-plugins/lib/Paste/textToHtml.ts");
/**
 * Paste plugin, handles onPaste event and paste content into editor
 */
var Paste = /** @class */ (function () {
    /**
     * Create an instance of Paste
     */
    function Paste(htmlPropertyCallbacks) {
        var _this = this;
        this.htmlPropertyCallbacks = htmlPropertyCallbacks;
        this.onPaste = function (event) {
            buildClipboardData_1.default(event, _this.editor, function (clipboardData) {
                if (!_this.editor) {
                    return;
                }
                if (!clipboardData.html && clipboardData.text) {
                    clipboardData.html = textToHtml_1.default(clipboardData.text);
                }
                var currentStyles = getInheritableStyles_1.default(_this.editor);
                clipboardData.html = roosterjs_editor_dom_1.sanitizeHtml(clipboardData.html, null /*additionalStyleNodes*/, false /*convertInlineCssOnly*/, _this.htmlPropertyCallbacks, currentStyles, true /*preserveFragmentOnly*/);
                _this.pasteOriginal(clipboardData);
            });
        };
    }
    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    Paste.prototype.initialize = function (editor) {
        this.editor = editor;
        this.pasteDisposer = editor.addDomEventHandler('paste', this.onPaste);
    };
    /**
     * Dispose this plugin
     */
    Paste.prototype.dispose = function () {
        this.pasteDisposer();
        this.pasteDisposer = null;
        this.editor = null;
    };
    /**
     * Handle plugin events
     * @param event The event object
     */
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
        var _this = this;
        var clipboardData = event.clipboardData, fragment = event.fragment, pasteOption = event.pasteOption;
        this.editor.focus();
        if (clipboardData.snapshotBeforePaste == null) {
            clipboardData.snapshotBeforePaste = roosterjs_editor_core_1.buildSnapshot(this.editor);
        }
        else {
            roosterjs_editor_core_1.restoreSnapshot(this.editor, clipboardData.snapshotBeforePaste);
        }
        this.editor.formatWithUndo(function () {
            switch (pasteOption) {
                case 0 /* PasteHtml */:
                    _this.editor.insertNode(fragment);
                    break;
                case 1 /* PasteText */:
                    var html = textToHtml_1.default(clipboardData.text);
                    _this.editor.insertContent(html);
                    break;
                case 2 /* PasteImage */:
                    roosterjs_editor_api_1.insertImage(_this.editor, clipboardData.image);
                    break;
            }
        }, false /*preserveSelection*/, "Paste" /* Paste */, function () { return clipboardData; });
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/buildClipboardData.ts":
/*!***************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/buildClipboardData.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
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
    var htmlCallback = function (html) {
        clipboardData.html = html;
        callback(clipboardData);
    };
    if (event.clipboardData && event.clipboardData.items) {
        directRetrieveHtml(event, htmlCallback);
    }
    else {
        retrieveHtmlViaTempDiv(editor, htmlCallback);
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
    editor.runAsync(function () {
        // restore original selection range in editor
        editor.select(originalSelectionRange);
        callback(tempDiv.innerHTML);
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = '';
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/getInheritableStyles.ts":
/*!*****************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/getInheritableStyles.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
// Inheritable CSS properties
// Ref: https://www.w3.org/TR/CSS21/propidx.html
var INHERITABLE_PROPERTIES = [
    'border-collapse',
    'border-spacing',
    'caption-side',
    'color',
    'cursor',
    'direction',
    'empty-cells',
    'font-family',
    'font-size',
    'font-style',
    'font-variant',
    'font-weight',
    'font',
    'letter-spacing',
    'line-height',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'list-style',
    'orphans',
    'quotes',
    'text-align',
    'text-indent',
    'text-transform',
    'visibility',
    'white-space',
    'widows',
    'word-spacing',
];
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/textToHtml.ts":
/*!*******************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/textToHtml.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
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
        var lineEnd_1 = roosterjs_editor_dom_1.Browser.isEdge || roosterjs_editor_dom_1.Browser.isIE ? ZERO_WIDTH_SPACE : '<br>';
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/CustomData.ts":
/*!*********************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/CustomData.ts ***!
  \*********************************************************************************/
/*! no static exports found */
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/LevelLists.ts":
/*!*********************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/LevelLists.ts ***!
  \*********************************************************************************/
/*! no static exports found */
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/WordConverterArguments.ts":
/*!*********************************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/WordConverterArguments.ts ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LevelLists_1 = __webpack_require__(/*! ./LevelLists */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/LevelLists.ts");
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/convertPastedContentFromWord.ts":
/*!***************************************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/convertPastedContentFromWord.ts ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wordConverter_1 = __webpack_require__(/*! ./wordConverter */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/wordConverter.ts");
var WordConverterArguments_1 = __webpack_require__(/*! ./WordConverterArguments */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/WordConverterArguments.ts");
var converterUtils_1 = __webpack_require__(/*! ./converterUtils */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/converterUtils.ts");
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/converterUtils.ts":
/*!*************************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/converterUtils.ts ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LevelLists_1 = __webpack_require__(/*! ./LevelLists */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/LevelLists.ts");
var CustomData_1 = __webpack_require__(/*! ./CustomData */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/CustomData.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
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

/***/ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/wordConverter.ts":
/*!************************************************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/wordConverter.ts ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CustomData_1 = __webpack_require__(/*! ./CustomData */ "./packages/roosterjs-editor-plugins/lib/Paste/wordConverter/CustomData.ts");
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

/***/ "./packages/roosterjs-editor-plugins/lib/index.ts":
/*!********************************************************!*\
  !*** ./packages/roosterjs-editor-plugins/lib/index.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DefaultShortcut_1 = __webpack_require__(/*! ./DefaultShortcut/DefaultShortcut */ "./packages/roosterjs-editor-plugins/lib/DefaultShortcut/DefaultShortcut.ts");
exports.DefaultShortcut = DefaultShortcut_1.default;
var HyperLink_1 = __webpack_require__(/*! ./HyperLink/HyperLink */ "./packages/roosterjs-editor-plugins/lib/HyperLink/HyperLink.ts");
exports.HyperLink = HyperLink_1.default;
var ContentEdit_1 = __webpack_require__(/*! ./ContentEdit/ContentEdit */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/ContentEdit.ts");
exports.ContentEdit = ContentEdit_1.default;
var Paste_1 = __webpack_require__(/*! ./Paste/Paste */ "./packages/roosterjs-editor-plugins/lib/Paste/Paste.ts");
exports.Paste = Paste_1.default;
var ContentEditFeatures_1 = __webpack_require__(/*! ./ContentEdit/ContentEditFeatures */ "./packages/roosterjs-editor-plugins/lib/ContentEdit/ContentEditFeatures.ts");
exports.getDefaultContentEditFeatures = ContentEditFeatures_1.getDefaultContentEditFeatures;


/***/ }),

/***/ "./packages/roosterjs-editor-types/lib/index.ts":
/*!******************************************************!*\
  !*** ./packages/roosterjs-editor-types/lib/index.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./packages/roosterjs-plugin-image-resize/lib/ImageResize.ts":
/*!*******************************************************************!*\
  !*** ./packages/roosterjs-plugin-image-resize/lib/ImageResize.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var BEGIN_TAG = 'RoosterJsImageResizingBegin';
var END_TAG = 'RoosterJsImageResizingEnd';
var EXTRACT_HTML_REGEX = new RegExp("<!--" + BEGIN_TAG + "-->[\\s\\S]*(<img\\s[^>]+>)[\\s\\S]*<!--" + END_TAG + "-->", 'gim');
var DELETE_KEYCODE = 46;
var BACKSPACE_KEYCODE = 8;
var SHIFT_KEYCODE = 16;
var CTRL_KEYCODE = 17;
var ALT_KEYCODE = 18;
/**
 * A plugin to support the functionality of resizing an inline image inside editor.
 */
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
                _this.editor.formatWithUndo(null, false /*preserveSelection*/, "ImageResize" /* ImageResize */);
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
            _this.editor.formatWithUndo(null, false, "ImageResize" /* ImageResize */);
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
    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    ImageResize.prototype.initialize = function (editor) {
        this.editor = editor;
        this.editor.getDocument().execCommand('enableObjectResizing', false, false);
    };
    /**
     * Dispose this plugin
     */
    ImageResize.prototype.dispose = function () {
        if (this.resizeDiv) {
            this.unselect(false /*selectImageAfterUnselect*/);
        }
        this.editor = null;
    };
    /**
     * Handle plugin events
     * @param event The event object
     */
    ImageResize.prototype.onPluginEvent = function (e) {
        var _this = this;
        if (e.eventType == 4 /* MouseDown */) {
            var event_1 = e.rawEvent;
            var target = (event_1.srcElement || event_1.target);
            if (roosterjs_editor_dom_1.getTagOfNode(target) == 'IMG') {
                target.contentEditable = 'false';
                var currentImg = this.getSelectedImage();
                if (currentImg && currentImg != target) {
                    this.unselect(false /*selectImageAfterUnselect*/);
                }
                if (!this.resizeDiv) {
                    this.select(target);
                }
            }
            else if (this.resizeDiv && !roosterjs_editor_dom_1.contains(this.resizeDiv, target)) {
                this.unselect(false /*selectImageAfterUnselect*/);
            }
        }
        else if (e.eventType == 0 /* KeyDown */ && this.resizeDiv) {
            var event_2 = e.rawEvent;
            if (event_2.which == DELETE_KEYCODE || event_2.which == BACKSPACE_KEYCODE) {
                this.editor.formatWithUndo(function () {
                    _this.removeResizeDiv(_this.resizeDiv);
                    _this.resizeDiv = null;
                }, false /*preserveSelection*/, "ImageResize" /* ImageResize */);
                event_2.preventDefault();
            }
            else if (event_2.which != SHIFT_KEYCODE &&
                event_2.which != CTRL_KEYCODE &&
                event_2.which != ALT_KEYCODE) {
                this.unselect(true /*selectImageAfterUnselect*/);
            }
        }
        else if (e.eventType == 6 /* ContentChanged */ &&
            e.source != "ImageResize" /* ImageResize */) {
            this.editor.queryNodes('img', this.removeResizeDivIfAny);
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
        this.editor.select(this.resizeDiv, roosterjs_editor_dom_1.Position.After);
    };
    ImageResize.prototype.unselect = function (selectImageAfterUnselect) {
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
                if (selectImageAfterUnselect) {
                    this.editor.select(img);
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


/***/ }),

/***/ "./packages/roosterjs-plugin-image-resize/lib/index.ts":
/*!*************************************************************!*\
  !*** ./packages/roosterjs-plugin-image-resize/lib/index.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageResize_1 = __webpack_require__(/*! ./ImageResize */ "./packages/roosterjs-plugin-image-resize/lib/ImageResize.ts");
exports.ImageResize = ImageResize_1.default;


/***/ }),

/***/ "./packages/roosterjs-plugin-table-resize/lib/TableResize.ts":
/*!*******************************************************************!*\
  !*** ./packages/roosterjs-plugin-table-resize/lib/TableResize.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_api_1 = __webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts");
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
var TABLE_RESIZE_HANDLE_KEY = 'TABLE_RESIZE_HANDLE';
var HANDLE_WIDTH = 6;
var CONTAINER_HTML = "<div style=\"position: absolute; cursor: col-resize; width: " + HANDLE_WIDTH + "px; border: solid 0 #C6C6C6;\"></div>";
/**
 * A plugin to support the functionality of resizing a table inside editor.
 */
var TableResize = /** @class */ (function () {
    function TableResize() {
        var _this = this;
        this.pageX = -1;
        this.onMouseOver = function (e) {
            var node = (e.srcElement || e.target);
            if (_this.pageX < 0 && node && node.tagName == 'TD' && node != _this.td) {
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
                _this.editor.formatWithUndo(function () { return _this.setTableColumnWidth(newWidth_1 + 'px'); }, true /*preserveSelection*/);
            }
            _this.pageX = -1;
            _this.calcAndShowHandle();
            _this.editor.focus();
            _this.cancelEvent(e);
        };
    }
    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    TableResize.prototype.initialize = function (editor) {
        this.editor = editor;
        this.onMouseOverDisposer = this.editor.addDomEventHandler('mouseover', this.onMouseOver);
    };
    /**
     * Dispose this plugin
     */
    TableResize.prototype.dispose = function () {
        this.editor = null;
        this.onMouseOverDisposer();
    };
    /**
     * Handle plugin events
     * @param event The event object
     */
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
        var vtable = new roosterjs_editor_api_1.VTable(this.td);
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
        return roosterjs_editor_dom_1.getComputedStyles(element, 'direction')[0] == 'rtl';
    };
    return TableResize;
}());
exports.default = TableResize;


/***/ }),

/***/ "./packages/roosterjs-plugin-table-resize/lib/index.ts":
/*!*************************************************************!*\
  !*** ./packages/roosterjs-plugin-table-resize/lib/index.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TableResize_1 = __webpack_require__(/*! ./TableResize */ "./packages/roosterjs-plugin-table-resize/lib/TableResize.ts");
exports.TableResize = TableResize_1.default;


/***/ }),

/***/ "./packages/roosterjs-plugin-watermark/lib/Watermark.ts":
/*!**************************************************************!*\
  !*** ./packages/roosterjs-plugin-watermark/lib/Watermark.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_dom_1 = __webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts");
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
    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    Watermark.prototype.initialize = function (editor) {
        this.editor = editor;
        this.showHideWatermark(false /*ignoreCachedState*/);
        this.focusDisposer = this.editor.addDomEventHandler('focus', this.handleWatermark);
        this.blurDisposer = this.editor.addDomEventHandler('blur', this.handleWatermark);
    };
    /**
     * Dispose this plugin
     */
    Watermark.prototype.dispose = function () {
        this.focusDisposer();
        this.blurDisposer();
        this.focusDisposer = null;
        this.blurDisposer = null;
        this.hideWatermark();
        this.editor = null;
    };
    /**
     * Handle plugin events
     * @param event The event object
     */
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
        var hasFocus = this.editor.hasFocus();
        if (hasFocus && (ignoreCachedState || this.isWatermarkShowing)) {
            this.hideWatermark();
        }
        else if (!hasFocus &&
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
        this.editor.queryNodes("span[id=\"" + WATERMARK_SPAN_ID + "\"]", function (node) {
            return _this.editor.deleteNode(node);
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

/***/ "./packages/roosterjs-plugin-watermark/lib/index.ts":
/*!**********************************************************!*\
  !*** ./packages/roosterjs-plugin-watermark/lib/index.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Watermark_1 = __webpack_require__(/*! ./Watermark */ "./packages/roosterjs-plugin-watermark/lib/Watermark.ts");
exports.Watermark = Watermark_1.default;


/***/ }),

/***/ "./packages/roosterjs/lib/createEditor.ts":
/*!************************************************!*\
  !*** ./packages/roosterjs/lib/createEditor.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_plugins_1 = __webpack_require__(/*! roosterjs-editor-plugins */ "./packages/roosterjs-editor-plugins/lib/index.ts");
var roosterjs_editor_core_1 = __webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts");
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

/***/ "./packages/roosterjs/lib/index.ts":
/*!*****************************************!*\
  !*** ./packages/roosterjs/lib/index.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var createEditor_1 = __webpack_require__(/*! ./createEditor */ "./packages/roosterjs/lib/createEditor.ts");
exports.createEditor = createEditor_1.default;
__export(__webpack_require__(/*! roosterjs-editor-types */ "./packages/roosterjs-editor-types/lib/index.ts"));
__export(__webpack_require__(/*! roosterjs-editor-dom */ "./packages/roosterjs-editor-dom/lib/index.ts"));
__export(__webpack_require__(/*! roosterjs-editor-core */ "./packages/roosterjs-editor-core/lib/index.ts"));
__export(__webpack_require__(/*! roosterjs-editor-api */ "./packages/roosterjs-editor-api/lib/index.ts"));
__export(__webpack_require__(/*! roosterjs-editor-plugins */ "./packages/roosterjs-editor-plugins/lib/index.ts"));
__export(__webpack_require__(/*! roosterjs-plugin-image-resize */ "./packages/roosterjs-plugin-image-resize/lib/index.ts"));
__export(__webpack_require__(/*! roosterjs-plugin-table-resize */ "./packages/roosterjs-plugin-table-resize/lib/index.ts"));
__export(__webpack_require__(/*! roosterjs-plugin-watermark */ "./packages/roosterjs-plugin-watermark/lib/index.ts"));


/***/ })

/******/ });
//# sourceMappingURL=rooster.js.map