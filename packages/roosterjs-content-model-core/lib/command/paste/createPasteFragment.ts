import { moveChildNodes, wrap } from 'roosterjs-content-model-dom';
import type { ClipboardData, PasteType } from 'roosterjs-content-model-types';

const NBSP_HTML = '\u00A0';
const ENSP_HTML = '\u2002';
const TAB_SPACES = 6;

/**
 * @internal
 */
export function createPasteFragment(
    document: Document,
    clipboardData: ClipboardData,
    pasteType: PasteType,
    root: HTMLElement | undefined
): DocumentFragment {
    if (!clipboardData.text && pasteType == 'asPlainText' && root) {
        clipboardData.text = root.textContent || clipboardData.text;
    }

    const { imageDataUri, text } = clipboardData;
    const fragment = document.createDocumentFragment();

    if (
        (pasteType == 'asImage' && imageDataUri) ||
        (pasteType != 'asPlainText' && !text && imageDataUri)
    ) {
        // Paste image
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = imageDataUri;
        fragment.appendChild(img);
    } else if (pasteType != 'asPlainText' && root) {
        moveChildNodes(fragment, root);
    } else if (text) {
        text.split('\n').forEach((line, index, lines) => {
            line = line
                .replace(/^ /g, NBSP_HTML)
                .replace(/ $/g, NBSP_HTML)
                .replace(/\r/g, '')
                .replace(/ {2}/g, ' ' + NBSP_HTML);

            if (line.includes('\t')) {
                line = transformTabCharacters(line);
            }

            const textNode = document.createTextNode(line);

            // There are 3 scenarios:
            // 1. Single line: Paste as it is
            // 2. Two lines: Add <br> between the lines
            // 3. 3 or More lines, For first and last line, paste as it is. For middle lines, wrap with DIV, and add BR if it is empty line
            if (lines.length == 2 && index == 0) {
                // 1 of 2 lines scenario, add BR
                fragment.appendChild(textNode);
                fragment.appendChild(document.createElement('br'));
            } else if (index > 0 && index < lines.length - 1) {
                // Middle line of >=3 lines scenario, wrap with DIV
                fragment.appendChild(
                    wrap(document, line == '' ? document.createElement('br') : textNode, 'div')
                );
            } else {
                // All others, paste as it is
                fragment.appendChild(textNode);
            }
        });
    }

    return fragment;
}

/**
 * Transform \t characters into EN SPACE characters
 * @param input string NOT containing \n characters
 * @example t("\thello", 2) => "&ensp;&ensp;&ensp;&ensp;hello"
 */
function transformTabCharacters(input: string, initialOffset: number = 0) {
    let line = input;
    let tIndex: number;
    while ((tIndex = line.indexOf('\t')) != -1) {
        const lineBefore = line.slice(0, tIndex);
        const lineAfter = line.slice(tIndex + 1);
        const tabCount = TAB_SPACES - ((lineBefore.length + initialOffset) % TAB_SPACES);
        const tabStr = Array(tabCount).fill(ENSP_HTML).join('');
        line = lineBefore + tabStr + lineAfter;
    }
    return line;
}
