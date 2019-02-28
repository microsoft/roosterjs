import EditorCore, { Focus } from '../interfaces/EditorCore';
import { createRange, getFirstLeafNode } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';

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
            !core.api.selectRange(core, core.cachedSelectionRange, true /*skipSameRange*/)
        ) {
            let node = getFirstLeafNode(core.contentDiv) || core.contentDiv;
            core.api.selectRange(
                core,
                createRange(node, PositionType.Begin),
                true /*skipSameRange*/
            );
        }
    }

    // remember to clear cachedSelectionRange
    core.cachedSelectionRange = null;

    // This is more a fallback to ensure editor gets focus if it didn't manage to move focus to editor
    if (!core.api.hasFocus(core)) {
        core.contentDiv.focus();
    }
};

export default focus;
