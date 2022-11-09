import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelHR } from '../../publicTypes/block/ContentModelHR';

/**
 * @internal
 */
export function createHR(format?: ContentModelBlockFormat): ContentModelHR {
    return {
        blockType: 'HR',
        format: format ? { ...format } : {},
    };
}
