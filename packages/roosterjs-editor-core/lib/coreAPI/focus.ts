import EditorCore, { Focus } from '../editor/EditorCore';
import isVoidHtmlElement from '../utils/isVoidHtmlElement';
import { NodeType } from 'roosterjs-editor-types';
import { getFirstLeafNode } from 'roosterjs-editor-dom';

const focus: Focus = (core: EditorCore) => {
    if (!core.api.hasFocus(core) || !core.api.getSelectionRange(core, false /*tryGetFromCache*/)) {
        // Focus (document.activeElement indicates) and selection are mostly in sync, but could be out of sync in some extreme cases.
        // i.e. if you programmatically change window selection to point to a non-focusable DOM element (i.e. tabindex=-1 etc.).
        // On Chrome/Firefox, it does not change document.activeElement. On Edge/IE, it change document.activeElement to be body
        // Although on Chrome/Firefox, document.activeElement points to editor, you cannot really type which we don't want (no cursor).
        // So here we always do a live selection pull on DOM and make it point in Editor. The pitfall is, the cursor could be reset
        // to very begin to of editor since we don't really have last saved selection (created on blur which does not fire in this case).
        // It should be better than the case you cannot type
        if (
            !core.cachedSelectionRange ||
            !core.api.updateSelection(core, core.cachedSelectionRange)
        ) {
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

function setSelectionToBegin(core: EditorCore) {
    let range: Range;
    let firstNode = getFirstLeafNode(core.contentDiv);
    if (firstNode) {
        if (firstNode.nodeType == NodeType.Text) {
            // First node is text, move range to the begin
            range = core.document.createRange();
            range.setStart(firstNode, 0);
        } else if (firstNode.nodeType == NodeType.Element) {
            if (isVoidHtmlElement(firstNode as HTMLElement)) {
                // First node is a html void element (void elements cannot have child nodes), move range before it
                range = core.document.createRange();
                range.setStartBefore(firstNode);
            } else {
                // Other html element, move range inside it
                range = core.document.createRange();
                range.setStart(firstNode, 0);
            }
        }
    } else {
        // No first node, likely we have an empty content DIV, move range inside it
        range = core.document.createRange();
        range.setStart(core.contentDiv, 0);
    }

    if (range) {
        core.api.updateSelection(core, range);
    }
}

export default focus;
