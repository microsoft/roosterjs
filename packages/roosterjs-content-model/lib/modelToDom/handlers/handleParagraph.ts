import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { handleSegment } from './handleSegment';

/**
 * @internal
 */
export function handleParagraph(doc: Document, parent: Node, paragraph: ContentModelParagraph) {
    let container: HTMLElement;

    if (paragraph.isImplicit) {
        container = parent as HTMLElement;
    } else {
        container = doc.createElement('div');
        parent.appendChild(container);
    }

    paragraph.segments.forEach(segment => {
        handleSegment(doc, container, segment);
    });
}
