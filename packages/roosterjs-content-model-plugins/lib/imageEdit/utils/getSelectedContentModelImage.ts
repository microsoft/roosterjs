import { getSelectedSegments } from 'roosterjs-content-model-dom';
import type {
    ContentModelImage,
    ReadonlyContentModelDocument,
    ReadonlyContentModelImage,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getSelectedContentModelImage(
    model: ReadonlyContentModelDocument,
    mutate: true
): ContentModelImage | null;

/**
 * @internal
 */
export function getSelectedContentModelImage(
    model: ReadonlyContentModelDocument
): ReadonlyContentModelImage | null;

/**
 * @internal
 */
export function getSelectedContentModelImage(
    model: ReadonlyContentModelDocument,
    mutate?: boolean
): ReadonlyContentModelImage | null {
    const selectedSegments = mutate
        ? getSelectedSegments(model, false, true)
        : getSelectedSegments(model, false /*includeFormatHolder*/);

    if (selectedSegments.length == 1 && selectedSegments[0].segmentType == 'Image') {
        return selectedSegments[0];
    }

    return null;
}
