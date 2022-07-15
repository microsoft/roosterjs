import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { createSegmentFromContent } from './createSegmentFromContent';

/**
 * @internal
 */
export function createParagraph(doc: Document, parent: Node, paragraph: ContentModelParagraph) {
    let container: HTMLElement;

    if (paragraph.isDummy) {
        container = parent as HTMLElement;
    } else {
        container = doc.createElement('div');
        parent.appendChild(container);
    }

    paragraph.segments.forEach(segment => {
        createSegmentFromContent(doc, container, segment);
    });
}
