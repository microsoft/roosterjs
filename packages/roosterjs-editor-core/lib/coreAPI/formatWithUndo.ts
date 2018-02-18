import EditorCore from '../editor/EditorCore';
import getLiveRange from '../coreAPI/getLiveRange';
import select from '../coreAPI/select';

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
            let range = getLiveRange(core) || core.cachedRange;
            let fallbackNode = callback();
            if (preserveSelection && !select(core, range) && fallbackNode instanceof Node) {
                select(core, fallbackNode);
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
