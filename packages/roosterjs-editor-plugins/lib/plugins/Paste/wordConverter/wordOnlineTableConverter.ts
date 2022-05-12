import { BeforePasteEvent } from 'roosterjs-editor-types';

/**
 * @internal
 * Fix styles of table copied from word online
 * @param editor
 * @param table copied from word online
 */
export default function wordOnlineTableConverter(event: BeforePasteEvent) {
    const { fragment } = event;
    const tables = fragment.querySelectorAll('td,th');
    tables.forEach(table => {
        const paragraph = table.querySelectorAll('p');
        paragraph.forEach(p => {
            if (p.style.color === 'windowtext') {
                p.style.removeProperty('color');
            }
        });
    });
}
