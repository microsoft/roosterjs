import EditorCore from '../editor/EditorCore';
import getSelection from './getSelection';
import isRangeInContainer from '../utils/isRangeInContainer';
import { SelectionRange } from 'roosterjs-editor-types';

export default function getLiveSelectionRange(core: EditorCore): SelectionRange {
    let selection = getSelection(core);
    if (selection && selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        if (isRangeInContainer(range, core.contentDiv)) {
            return SelectionRange.create(range);
        }
    }

    return null;
}
