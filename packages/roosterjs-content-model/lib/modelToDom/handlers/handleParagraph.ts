import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { handleSegment } from './handleSegment';
import { ModelToDomContext } from '../context/ModelToDomContext';

/**
 * @internal
 */
export function handleParagraph(
    doc: Document,
    parent: Node,
    paragraph: ContentModelParagraph,
    context: ModelToDomContext
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
