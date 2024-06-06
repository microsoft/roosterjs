import { getSelectedSegments } from 'roosterjs-content-model-dom';
import type {
    ReadonlyContentModelImage,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getSelectedContentModelImage(
    model: ShallowMutableContentModelDocument
): ReadonlyContentModelImage | null {
    const selectedSegments = getSelectedSegments(model, false /*includeFormatHolder*/);
    if (selectedSegments.length == 1 && selectedSegments[0].segmentType == 'Image') {
        return selectedSegments[0];
    }

    return null;
}
