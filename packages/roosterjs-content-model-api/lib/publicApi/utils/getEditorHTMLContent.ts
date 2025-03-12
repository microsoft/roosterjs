import { transformColor } from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Return the inner HTML content of the editor
 * @param editor The editor object
 * @returns
 */
export function getEditorHTMLContent(editor: IEditor): string {
    const clonedRoot = editor.getDOMHelper().getClonedRoot();

    if (editor.isDarkMode()) {
        transformColor(clonedRoot, false /*includeSelf*/, 'darkToLight', editor.getColorManager());
    }

    editor.triggerEvent(
        'extractContentWithDom',
        {
            clonedRoot,
        },
        true /*broadcast*/
    );

    return clonedRoot.innerHTML;
}
