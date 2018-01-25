import EditorCore from '../editor/EditorCore';
import getSelection from './getSelection';
import hasFocus from './hasFocus';
import isRangeInContainer from '../utils/isRangeInContainer';

export default function getSelectionRange(core: EditorCore, tryGetFromCache: boolean): Range {
    let result: Range = null;

    if (!tryGetFromCache || hasFocus(core)) {
        let selection = getSelection(core);
        if (selection && selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);
            if (isRangeInContainer(range, core.contentDiv)) {
                result = range;
            }
        }
    }

    if (!result && tryGetFromCache) {
        result = core.cachedSelectionRange;
    }

    return result;
}
