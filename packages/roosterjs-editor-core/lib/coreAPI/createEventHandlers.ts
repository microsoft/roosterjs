import EditorCore from '../editor/EditorCore';
import browserData from '../utils/BrowserData';
import {
    NodeBoundary,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginDomEvent,
} from 'roosterjs-editor-types';
import {
    EditorSelection,
    applyFormat,
    contains,
    fromHtml,
    getTagOfNode,
    normalizeEditorPoint,
    wrapAll,
} from 'roosterjs-editor-dom';
import {
    getSelectionRange,
    restoreSelection,
    saveSelectionRange,
    updateSelection,
} from './selection';

export class DOMEventHandler {
    constructor(
        private core: EditorCore,
        private eventName: string,
        private eventType?: PluginEventType | null,
        private beforeDispatch?: (event: Event) => void
    ) {
        this.core.contentDiv.addEventListener(this.eventName, this.onEvent);
    }

    dispose() {
        this.core.contentDiv.removeEventListener(this.eventName, this.onEvent);
        this.core = null;
        this.beforeDispatch = null;
    }

    private onEvent = (event: Event) => {
        if (this.beforeDispatch) {
            this.beforeDispatch(event);
        }
        if (this.eventType != null) {
            let pluginEvent: PluginDomEvent = {
                eventType: this.eventType,
                rawEvent: event,
            };

            triggerEvent(this.core, pluginEvent, false /*broadcast*/);
        }
    };
}

export function triggerEvent(core: EditorCore, pluginEvent: PluginEvent, broadcast: boolean) {
    let isHandledExclusively = false;
    if (!broadcast) {
        for (let i = 0; i < core.plugins.length; i++) {
            let plugin = core.plugins[i];
            if (
                plugin.willHandleEventExclusively &&
                plugin.onPluginEvent &&
                plugin.willHandleEventExclusively(pluginEvent)
            ) {
                plugin.onPluginEvent(pluginEvent);
                isHandledExclusively = true;
                break;
            }
        }
    }

    if (!isHandledExclusively) {
        core.plugins.forEach(plugin => {
            if (plugin.onPluginEvent) {
                plugin.onPluginEvent(pluginEvent);
            }
        });
    }
}

export function createEventHandlers(core: EditorCore): DOMEventHandler[] {
    let isIEorEdge = browserData.isIE || browserData.isEdge;
    let handlers: DOMEventHandler[] = [
        new DOMEventHandler(
            core,
            'blur',
            PluginEventType.Blur,
            isIEorEdge
                ? null
                : () => {
                      // For browsers that do not support beforedeactivate, still do the saving selection in onBlur
                      // Also check if there's already a selection range cache because in Chrome onBlur can be triggered multiple times when user clicks to other places,
                      // in that case the second time when fetching the selection range may result in a wrong selection.
                      if (!core.cachedSelectionRange) {
                          saveSelectionRange(core);
                      }
                  }
        ),
        new DOMEventHandler(core, 'keypress', PluginEventType.KeyPress, event => onKeyPress(core, event as KeyboardEvent)),
        new DOMEventHandler(core, 'keydown', PluginEventType.KeyDown),
        new DOMEventHandler(core, 'keyup', PluginEventType.KeyUp),
        new DOMEventHandler(core, 'compositionstart', null, () => (core.isInIME = true)),
        new DOMEventHandler(
            core,
            'compositionend',
            PluginEventType.CompositionEnd,
            () => (core.isInIME = false)
        ),
        new DOMEventHandler(core, 'mousedown', PluginEventType.MouseDown),
        new DOMEventHandler(core, 'mouseup', PluginEventType.MouseUp),
        new DOMEventHandler(core, 'mouseover', PluginEventType.MouseOver),
        new DOMEventHandler(core, 'mouseout', PluginEventType.MouseOut),
        new DOMEventHandler(core, 'paste', PluginEventType.Paste),
        new DOMEventHandler(core, 'copy', PluginEventType.Copy, () => {}),
        new DOMEventHandler(core, 'focus', PluginEventType.Focus, () => {
            // Restore the last saved selection first
            if (core.cachedSelectionRange && !core.disableRestoreSelectionOnFocus) {
                restoreSelection(core);
            }

            core.cachedSelectionRange = null;
        }),
    ];

    if (isIEorEdge) {
        // we do saving selection when editor loses focus, which normally can be done in onBlur event
        // Edge and IE, however attempting to save selection from onBlur is too late
        // There is an Edge and IE only beforedeactivate event where we can save selection
        handlers.push(
            new DOMEventHandler(core, 'beforedeactivate', null, () => {
                // this should fire up only for edge and IE
                if (!core.cachedSelectionRange) {
                    saveSelectionRange(core);
                }
            })
        );
    }

    return handlers;
}

// Check if user is typing right under the content div
// When typing goes directly under content div, many things can go wrong
// We fix it by wrapping it with a div and reposition cursor within the div
// TODO: we only fix the case when selection is collapsed
// When selection is not collapsed, i.e. users press ctrl+A, and then type
// We don't have a good way to fix that for the moment
function onKeyPress(core: EditorCore, event: KeyboardEvent) {
    let selectionRange = getSelectionRange(core, true /*tryGetFromCache*/);
    let focusNode: Node;
    if (
        selectionRange &&
        selectionRange.collapsed &&
        (focusNode = selectionRange.startContainer) &&
        (focusNode == core.contentDiv ||
            (focusNode.nodeType == NodeType.Text && focusNode.parentNode == core.contentDiv))
    ) {
        let editorSelection = new EditorSelection(
            core.contentDiv,
            selectionRange,
            core.inlineElementFactory
        );
        let blockElement = editorSelection.startBlockElement;
        if (!blockElement) {
            // Only reason we don't get the selection block is that we have an empty content div
            // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
            // The fix is to add a DIV wrapping, apply default format and move cursor over
            let nodes = fromHtml('<div><br></div>', core.document);
            let element = core.contentDiv.appendChild(nodes[0]) as HTMLElement;
            applyFormat(element, core.defaultFormat);
            // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
            selectEditorPoint(core, element.firstChild, NodeBoundary.Begin);
        } else if (blockElement.getStartNode().parentNode == blockElement.getEndNode().parentNode) {
            // Only fix the balanced start-end block where start and end node is under same parent
            // The focus node could be pointing to the content div, normalize it to have it point to a child first
            let focusOffset = selectionRange.startOffset;
            let editorPoint = normalizeEditorPoint(focusNode, focusOffset);
            let element = wrapAll(blockElement.getContentNodes()) as HTMLElement;
            if (getTagOfNode(blockElement.getStartNode()) == 'BR') {
                // if the block is just BR, apply default format
                // Otherwise, leave it as it is as we don't want to change the style for existing data
                applyFormat(element, core.defaultFormat);
            }
            // Last restore the selection using the normalized editor point
            selectEditorPoint(core, editorPoint.containerNode, editorPoint.offset);
        }
    }
}

function selectEditorPoint(core: EditorCore, container: Node, offset: number): boolean {
    if (!container || !contains(core.contentDiv, container)) {
        return false;
    }

    let range = core.document.createRange();
    if (container.nodeType == NodeType.Text && offset <= container.nodeValue.length) {
        range.setStart(container, offset);
    } else if (offset == NodeBoundary.Begin) {
        range.setStartBefore(container);
    } else {
        range.setStartAfter(container);
    }

    range.collapse(true /* toStart */);

    return updateSelection(core, range);
}
