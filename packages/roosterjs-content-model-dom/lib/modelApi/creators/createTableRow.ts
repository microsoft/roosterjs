import type { ContentModelBlockFormat, ContentModelTableRow } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelTableRow model
 * @param format @optional The format of this model
 */
export function createTableRow(
    format?: Readonly<ContentModelBlockFormat>,
    height: number = 0
): ContentModelTableRow {
    return {
        height: height,
        format: { ...format },
        cells: [],
    };
}
