import EditorCore from '../../editor/EditorCore';
import getSelection from '../getSelection';
import hasFocus from '../hasFocus';
import isRangeInContainer from '../../utils/isRangeInContainer';
import { SelectionRange } from 'roosterjs-editor-types';

export default function updateSelection(core: EditorCore, range: Range): boolean {
    let selectionUpdated = false;
    if (isRangeInContainer(range, core.contentDiv)) {
        let selection = getSelection(core);
        if (selection) {
            if (selection.rangeCount > 0) {
                selection.removeAllRanges();
            }

            selection.addRange(range);
            if (!hasFocus(core)) {
                core.cachedRange = range;
                core.cachedSelectionRange = SelectionRange.create(range);
            }

            selectionUpdated = true;
        }
    }

    return selectionUpdated;
}
