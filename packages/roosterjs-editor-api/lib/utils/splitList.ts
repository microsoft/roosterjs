import { createVListFromRegion } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default function splitList(
    editor: IEditor,
    separator: HTMLLIElement,
    startNumber?: number
): void;

export default function splitList(editor: IEditor, separator: HTMLLIElement, startNumber?: number) {
    editor.focus();
    editor.addUndoSnapshot();

    const regions = editor.getSelectedRegions();

    regions.forEach(region => {
        const vList = createVListFromRegion(region, true, separator /*includeSiblingLists*/);
        if (vList) {
            vList.splitWriteBack(separator, startNumber ?? 1);
        }
    });
}
