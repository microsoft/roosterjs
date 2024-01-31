import { formatSegment } from './formatSegment';
import type { ContentModelImage, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export default function formatImage(
    editor: IStandaloneEditor,
    apiName: string,
    callback: (segment: ContentModelImage) => void
) {
    formatSegment(
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
