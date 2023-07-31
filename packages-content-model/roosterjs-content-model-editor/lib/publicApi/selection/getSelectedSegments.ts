import { ContentModelDocument, ContentModelSegment } from 'roosterjs-content-model-types';
import { getSelectedSegmentsAndParagraphs } from '../../modelApi/selection/collectSelections';

/**
 * Get selected segments from a content model
 */
export default function getSelectedSegments(
    model: ContentModelDocument,
    includingFormatHolder: boolean
): ContentModelSegment[] {
    return getSelectedSegmentsAndParagraphs(model, includingFormatHolder).map(x => x[0]);
}
