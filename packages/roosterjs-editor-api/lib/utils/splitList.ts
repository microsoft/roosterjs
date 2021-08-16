import blockFormat from '../utils/blockFormat';
import { createVListFromRegion } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default function splitList(
    editor: IEditor,
    list: HTMLOListElement,
    startNumber?: number
): void;

export default function splitList(editor: IEditor, list: HTMLOListElement, startNumber?: number) {
    blockFormat(editor, (region, start) => {
        const vList = createVListFromRegion(region, false /*includeSiblingLists*/);

        if (vList) {
            vList.splitWriteBack(start.element, startNumber ?? 1);
        }
    });
}
