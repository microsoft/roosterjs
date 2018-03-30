import EditorCore from '../editor/EditorCore';
import getLiveRange from '../coreAPI/getLiveRange';
import select from '../coreAPI/select';
import { SelectionRange } from 'roosterjs-editor-dom/lib';

export default function formatWithUndo(
    core: EditorCore,
    callback: () => void | Node,
    preserveSelection: boolean,
    skipAddingUndoAfterFormat: boolean
) {
    let isNested = core.suspendAddingUndoSnapshot;

    if (!isNested) {
        core.undo.addUndoSnapshot();
        core.suspendAddingUndoSnapshot = true;
    }

    try {
        if (callback) {
            if (preserveSelection) {
                let range = getLiveRange(core) || core.cachedRange;
                let selectionRange = range && new SelectionRange(range).normalize();
                let fallbackNode = callback();
                if (!select(core, selectionRange) && fallbackNode instanceof Node) {
                    select(core, fallbackNode);
                }
            } else {
                callback();
            }
            if (!isNested && !skipAddingUndoAfterFormat) {
                core.undo.addUndoSnapshot();
            }
        }
    } finally {
        if (!isNested) {
            core.suspendAddingUndoSnapshot = false;
        }
    }
}
