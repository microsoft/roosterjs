import { FormatHandler } from '../FormatHandler';
import { ListThreadFormat } from '../../publicTypes/format/formatParts/ListThreadFormat';
import { safeInstanceOf } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const listLevelThreadFormatHandler: FormatHandler<ListThreadFormat> = {
    parse: (format, element, context) => {
        if (safeInstanceOf(element, 'HTMLOListElement')) {
            const { listFormat } = context;
            const { threadItemCounts, levels } = listFormat;
            const depth = levels.length;

            if (
                typeof threadItemCounts[depth] === 'number' &&
                element.start != threadItemCounts[depth] + 1
            ) {
                format.startNumberOverride = element.start;
            }

            threadItemCounts[depth] = element.start - 1;
        }
    },
    apply: (format, element, context) => {
        const {
            listFormat: { threadItemCounts, nodeStack },
        } = context;
        const depth = nodeStack.length - 1; // The first one is always the parent of list

        if (depth >= 0 && safeInstanceOf(element, 'HTMLOListElement')) {
            const startNumber = format.startNumberOverride;

            if (typeof startNumber === 'number') {
                threadItemCounts[depth] = startNumber - 1;
            } else if (typeof threadItemCounts[depth] != 'number') {
                threadItemCounts[depth] = 0;
            }

            threadItemCounts.splice(depth + 1);
            element.start = threadItemCounts[depth] + 1;
        }
    },
};
