import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { FormatContext } from '../../formatHandlers/FormatContext';
import { handleSegment } from './handleSegment';

/**
 * @internal
 */
export function handleParagraph(
    doc: Document,
    parent: Node,
    paragraph: ContentModelParagraph,
    context: FormatContext
) {
    let container: HTMLElement;

    if (paragraph.isImplicit) {
        container = parent as HTMLElement;
    } else {
        container = doc.createElement('div');
        parent.appendChild(container);
    }

    paragraph.segments.forEach(segment => {
        handleSegment(doc, container, segment, context);
    });
}
