import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelCode } from '../../publicTypes/group/ContentModelCode';

/**
 * @internal
 */
export function createCode(format?: ContentModelBlockFormat): ContentModelCode {
    return {
        blockGroupType: 'Code',
        blockType: 'BlockGroup',
        format: format ? { ...format } : {},
        blocks: [],
    };
}
