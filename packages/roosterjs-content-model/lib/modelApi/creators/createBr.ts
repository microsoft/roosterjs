import { ContentModelBr, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createBr(format?: ContentModelSegmentFormat): ContentModelBr {
    return {
        segmentType: 'Br',
        format: format ? { ...format } : {},
    };
}
