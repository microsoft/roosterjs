import type { ContentModelBr, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelBr model
 * @param format @optional The format of this model
 */
export function createBr(format?: ContentModelSegmentFormat): ContentModelBr {
    return {
        segmentType: 'Br',
        format: format ? { ...format } : {},
    };
}
