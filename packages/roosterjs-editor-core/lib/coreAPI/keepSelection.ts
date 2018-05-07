import EditorCore, { KeepSelection } from '../editor/EditorCore';
import { SelectionRange } from 'roosterjs-editor-dom';

const keepSelection: KeepSelection = (
    core: EditorCore,
    callback: () => SelectionRange | Node | void
) => {
    let oldSelection = core.api.getLiveRange(core) || core.cachedRange;
    oldSelection = oldSelection && new SelectionRange(oldSelection).normalize().getRange();
    let newSelection = callback();
    newSelection = newSelection instanceof Node ? new SelectionRange(newSelection) : newSelection;
    if (!core.api.select(core, oldSelection) && newSelection) {
        core.api.select(core, newSelection);
    }
};

export default keepSelection;
