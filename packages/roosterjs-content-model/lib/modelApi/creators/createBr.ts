import { ContentModelBr } from '../../publicTypes/segment/ContentModelBr';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createBr(format?: ContentModelSegmentFormat): ContentModelBr {
    return {
        segmentType: 'Br',
        format: format ? { ...format } : {},
    };
}
