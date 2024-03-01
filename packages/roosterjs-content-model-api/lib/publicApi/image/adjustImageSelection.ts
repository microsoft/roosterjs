import { adjustSegmentSelection } from '../../modelApi/selection/adjustSegmentSelection';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * Adjust selection to make sure select an image if any
 * @return Content Model Image object if an image is select, or null
 */
export default function adjustImageSelection(editor: IEditor): ContentModelImage | null {
    let image: ContentModelImage | null = null;

    editor.formatContentModel(
        model =>
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
            ),
        {
            apiName: 'adjustImageSelection',
        }
    );

    return image;
}
