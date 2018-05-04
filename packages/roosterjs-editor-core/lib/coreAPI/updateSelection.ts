import EditorCore, { UpdateSelection } from '../editor/EditorCore';
import isRangeInContainer from '../utils/isRangeInContainer';

const updateSelection: UpdateSelection = (core: EditorCore, range: Range) => {
    let selectionUpdated = false;
    if (isRangeInContainer(range, core.contentDiv)) {
        let selection = core.document.defaultView.getSelection();
        if (selection) {
            // Workaround IE exception 800a025e
            try {
                selection.removeAllRanges();
            } catch (e) {}

            selection.addRange(range);
            if (!core.api.hasFocus(core)) {
                core.cachedSelectionRange = range;
            }

            selectionUpdated = true;
        }
    }

    return selectionUpdated;
};

export default updateSelection;
