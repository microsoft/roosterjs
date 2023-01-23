import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 * Set image border css styles.
 * @param editor The editor instance
 * @param callback the function to set the styles to image borders
 */
export default function formatImageBorderWithContentModel(
    editor: IExperimentalContentModelEditor,
    callback: (segment: ContentModelImage) => void
) {
    formatSegmentWithContentModel(editor, 'formatImageBorderWithContentModel', (_, __, segment) => {
        if (segment?.segmentType == 'Image') {
            segment.format.borderRadius = '5px';
            const { borderWidth, borderStyle } = segment.format;
            if (!borderWidth) {
                segment.format.borderWidth = '1px';
            }
            if (!borderStyle) {
                segment.format.borderStyle = 'solid';
            }
            callback(segment);
        }
    });
}
