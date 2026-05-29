import { EmptySegmentFormat } from '../../constants/EmptySegmentFormat';
import { getObjectKeys } from '../../domUtils/getObjectKeys';
import type {
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelSelectionMarker model
 * @param format @optional The format of this model
 */
export function createSelectionMarker(
    format?: Readonly<ContentModelSegmentFormat>
): ContentModelSelectionMarker {
    const filteredFormat: ContentModelSegmentFormat = {};

    if (format) {
        getObjectKeys(EmptySegmentFormat).forEach(key => {
            if (key in format) {
                (filteredFormat[key] as any) = format[key];
            }
        });
    }

    return {
        segmentType: 'SelectionMarker',
        isSelected: true,
        format: filteredFormat,
    };
}
