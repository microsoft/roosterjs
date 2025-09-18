import { ParagraphMapBase } from 'roosterjs-content-model-dom';
import { queryContentModelBlocks } from 'roosterjs-content-model-api';
import type {
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export class ParagraphMapForAgent extends ParagraphMapBase {
    constructor(model: ReadonlyContentModelBlockGroup) {
        super();

        queryContentModelBlocks<ReadonlyContentModelParagraph>(model, 'Paragraph').forEach(
            paragraph => {
                const marker = this.getMarkerFromParagraph(paragraph);

                if (marker) {
                    this.paragraphMap[marker] = paragraph;
                }
            }
        );
    }
}
