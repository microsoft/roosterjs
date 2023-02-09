import { adjustSegmentSelection } from '../../modelApi/selection/adjustSegmentSelection';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Adjust selection to make sure select an image if any
 * @return Content Model Image object if an image is select, or null
 */
export default function adjustImageSelection(
    editor: IContentModelEditor
): ContentModelImage | null {
    let image: ContentModelImage | null = null;

    formatWithContentModel(editor, 'adjustImageSelection', model =>
        adjustSegmentSelection(
            model,
            target => {
                if (target.isSelected && target.segmentType == 'Image') {
                    image = target;
                    return true;
                } else {
                    return false;
                }
            },
            (target, ref) => target == ref
        )
    );

    return image;
}
