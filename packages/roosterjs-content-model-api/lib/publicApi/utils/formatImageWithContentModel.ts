import { formatSegmentWithContentModel } from './formatSegmentWithContentModel';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function formatImageWithContentModel(
    editor: IEditor,
    apiName: string,
    callback: (segment: ContentModelImage) => void
) {
    formatSegmentWithContentModel(
        editor,
        apiName,
        (_, __, segment) => {
            if (segment?.segmentType == 'Image') {
                callback(segment);
            }
        },
        undefined /** segmentHasStyleCallback **/,
        undefined /** includingFormatHolder */
    );
}
