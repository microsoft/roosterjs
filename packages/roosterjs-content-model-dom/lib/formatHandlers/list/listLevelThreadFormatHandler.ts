import { isElementOfType } from '../../domUtils/isElementOfType';
import type { FormatHandler } from '../FormatHandler';
import type { ListThreadFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const listLevelThreadFormatHandler: FormatHandler<ListThreadFormat> = {
    parse: (format, element, context) => {
        if (isElementOfType(element, 'ol')) {
            const { listFormat } = context;
            const { threadItemCounts, levels } = listFormat;
            const depth = levels.length;

            if (
                threadItemCounts[depth] === undefined ||
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

        // The first one is always the parent of list, and minus another one to convert length to index
        // This format applier needs to be executed after new list level is pushed into node stack
        const depth = nodeStack.length - 2;

        if (depth >= 0 && isElementOfType(element, 'ol')) {
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
