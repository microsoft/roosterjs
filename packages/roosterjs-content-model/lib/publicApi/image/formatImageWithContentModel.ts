import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 */
export default function formatImageWithContentModel(
    editor: IExperimentalContentModelEditor,
    apiName: string,
    callback: (segment: ContentModelImage) => void
) {
    formatSegmentWithContentModel(editor, apiName, (_, __, segment) => {
        if (segment?.segmentType == 'Image') {
            callback(segment);
        }
    });
}
