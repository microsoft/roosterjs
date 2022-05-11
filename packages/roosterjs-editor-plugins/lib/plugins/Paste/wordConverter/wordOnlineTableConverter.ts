import { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 * Fix styles of table copied from word online
 * @param editor
 * @param table copied from word online
 */
export default function wordOnlineTableConverter(editor: IEditor, tables: NodeListOf<Element>) {
    tables.forEach(table => {
        const paragraph = table.querySelectorAll('p');
        paragraph.forEach(p => {
            if (editor.isDarkMode()) {
                if (p.style.color === 'windowtext') {
                    p.style.removeProperty('color');
                }
            }
        });
    });
}
