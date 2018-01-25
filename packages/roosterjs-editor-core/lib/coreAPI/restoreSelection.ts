import EditorCore from '../editor/EditorCore';
import updateSelection from './updateSelection';

export default function restoreSelection(core: EditorCore): boolean {
    let selectionRestored = false;
    if (core.cachedSelectionRange) {
        selectionRestored = updateSelection(core, core.cachedSelectionRange);
    }

    return selectionRestored;
}
