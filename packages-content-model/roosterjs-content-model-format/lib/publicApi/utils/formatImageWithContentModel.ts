import { formatSegmentWithContentModel } from './formatSegmentWithContentModel';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';
import type { ContentModelImage } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export default function formatImageWithContentModel(
    editor: IContentModelEditor,
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
