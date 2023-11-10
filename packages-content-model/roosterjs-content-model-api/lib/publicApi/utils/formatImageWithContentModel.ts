import { formatSegmentWithContentModel } from './formatSegmentWithContentModel';
import type { ContentModelImage, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export default function formatImageWithContentModel(
    editor: IStandaloneEditor,
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
