import type { EditorCore } from 'roosterjs-content-model-types';

const CARET_CSS_RULE = 'caret-color: transparent';
const HIDE_CURSOR_CSS_KEY = '_DOMSelectionHideCursor';

/**
 * @internal Show/Hide caret in editor
 * @param core The editor core
 * @param isHiding True to hide caret, false to show caret
 */
export function toggleCaret(core: EditorCore, isHiding: boolean) {
    core.api.setEditorStyle(core, HIDE_CURSOR_CSS_KEY, isHiding ? CARET_CSS_RULE : null);
}
