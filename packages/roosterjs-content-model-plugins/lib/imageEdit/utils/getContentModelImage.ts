import { getSelectedSegments } from 'roosterjs-content-model-dom';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getContentModelImage(editor: IEditor): ContentModelImage | null {
    const model = editor.getContentModelCopy('disconnected');
    const selectedSegments = getSelectedSegments(model, false /*includeFormatHolder*/);
    if (selectedSegments.length == 1 && selectedSegments[0].segmentType == 'Image') {
        return selectedSegments[0] as ContentModelImage;
    }
    return null;
}
