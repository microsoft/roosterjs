import { FormatHandler } from '../FormatHandler';
import { ListThreadFormat } from '../../publicTypes/format/formatParts/ListThreadFormat';
import { safeInstanceOf } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const listItemThreadFormatHandler: FormatHandler<ListThreadFormat> = {
    parse: (format, element, context, defaultStyles) => {
        const { listFormat } = context;
        const depth = listFormat.levels.length;
        const display = element.style.display || defaultStyles.display;

        if (display && display != 'list-item') {
            format.displayForDummyItem = display;
        } else if (isLiUnderOl(element) && depth > 0) {
            listFormat.threadItemCounts[depth - 1]++;
            listFormat.threadItemCounts.splice(depth);
            listFormat.levels.forEach(level => {
                // Delete restart number so next list item doesn't need to have this value.
                // Then it will be treated as a continuous list item to the previous one
                delete level.startNumberOverride;
            });
        }
    },
    apply: (format, element, context) => {
        if (format.displayForDummyItem) {
            element.style.display = format.displayForDummyItem;
        } else if (isLiUnderOl(element)) {
            const { listFormat } = context;
            const { threadItemCounts } = listFormat;
            const index = listFormat.nodeStack.length - 2; // The first one is always the parent of list, then minus another 1 to convert length to index

            if (index >= 0) {
                threadItemCounts.splice(index + 1);
                threadItemCounts[index] = (threadItemCounts[index] ?? 0) + 1;
            }
        }
    },
};

function isLiUnderOl(element: HTMLElement) {
    return (
        safeInstanceOf(element, 'HTMLLIElement') &&
        safeInstanceOf(element.parentNode, 'HTMLOListElement')
    );
}
