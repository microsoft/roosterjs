import EditorCore from '../editor/EditorCore';
import updateSelection from './deprecated/updateSelection';

export default function restoreSelection(core: EditorCore): boolean {
    let selectionRestored = false;
    if (core.cachedRange) {
        selectionRestored = updateSelection(core, core.cachedRange);
    }

    return selectionRestored;
}
