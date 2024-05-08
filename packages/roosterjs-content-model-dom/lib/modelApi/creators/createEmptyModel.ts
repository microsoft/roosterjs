import { createBr } from './createBr';
import { createContentModelDocument } from './createContentModelDocument';
import { createParagraph } from './createParagraph';
import { createSelectionMarker } from './createSelectionMarker';
import type {
    ContentModelDocument,
    ReadonlyContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create an empty Content Model Document with initial empty line and insert point with default format
 * @param format @optional The default format to be applied to this Content Model
 */
export function createEmptyModel(format?: ReadonlyContentModelSegmentFormat): ContentModelDocument {
    const model = createContentModelDocument(format);
    const paragraph = createParagraph(false /*isImplicit*/, undefined /*blockFormat*/, format);

    paragraph.segments.push(createSelectionMarker(format), createBr(format));
    model.blocks.push(paragraph);

    return model;
}
