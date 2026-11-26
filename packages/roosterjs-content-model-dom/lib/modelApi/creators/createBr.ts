import type { ContentModelBr, ContentModelBrFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelBr model
 * @param format @optional The format of this model
 */
export function createBr(format?: Readonly<ContentModelBrFormat>): ContentModelBr {
    return {
        segmentType: 'Br',
        format: { ...format },
    };
}
