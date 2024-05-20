import { adjustSegmentSelection } from '../../modelApi/selection/adjustSegmentSelection';
import { mutateSegment } from 'roosterjs-content-model-dom/lib';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * Adjust selection to make sure select an image if any
 * @return Content Model Image object if an image is select, or null
 */
export function adjustImageSelection(editor: IEditor): ContentModelImage | null {
    let image: ContentModelImage | null = null;

    editor.formatContentModel(
        model =>
            adjustSegmentSelection(
                model,
                (target, paragraph) => {
                    if (target.isSelected && target.segmentType == 'Image') {
                        mutateSegment(paragraph, target, segment => {
                            image = segment;
                        });
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
