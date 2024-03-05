import { formatSegmentWithContentModel } from './formatSegmentWithContentModel';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * Invoke a callback to format the selected image using Content Model
 * @param editor The editor object
 * @param apiName Name of API this calling this function. This is mostly for logging.
 * @param callback The callback to format the image. It will be called with current selected table. If no table is selected, it will not be called.
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
