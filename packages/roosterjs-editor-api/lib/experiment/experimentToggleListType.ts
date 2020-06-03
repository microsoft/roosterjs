import blockFormat from '../utils/blockFormat';
import { createVListFromRegion } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import { ListType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default function experimentToggleListType(editor: Editor, listType: ListType) {
    blockFormat(editor, (region, start, end) => {
        const vList = createVListFromRegion(region, true /*includeSiblingLists*/);
        if (vList) {
            vList.changeListType(start, end, listType);
            vList.writeBack();
        }
    });
}
