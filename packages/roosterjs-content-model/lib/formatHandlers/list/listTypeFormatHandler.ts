import { FormatHandler } from '../FormatHandler';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { ListTypeFormat } from '../../publicTypes/format/formatParts/ListTypeFormat';

/**
 * @internal
 */
export const listTypeFormatHandler: FormatHandler<ListTypeFormat> = {
    parse: (format, element) => {
        const tag = getTagOfNode(element);

        if (tag == 'OL' || tag == 'UL') {
            format.listType = tag;
        }
    },
    apply: () => {},
};
