import blockFormat from '../utils/blockFormat';
import { createVListFromRegion } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default function splitList(editor: IEditor, list: HTMLOListElement): void;

export default function splitList(editor: IEditor, list: HTMLOListElement) {
    blockFormat(editor, (region, start, end, chains) => {
        const vList = createVListFromRegion(region, false /*includeSiblingLists*/);

        if (vList) {
            vList.splitWriteBack(start.element);

            if (list.start > 1) {
                list.start = 1;
            }
        }
    });
}
