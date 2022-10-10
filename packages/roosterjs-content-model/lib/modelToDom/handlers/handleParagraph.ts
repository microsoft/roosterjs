import { applyFormat } from '../utils/applyFormat';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { handleSegment } from './handleSegment';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { ParagraphFormatHandlers } from '../../formatHandlers/ParagraphFormatHandlers';

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

        applyFormat(container, ParagraphFormatHandlers, paragraph.format, context);
    }

    context.regularSelection.current = {
        block: container,
        segment: null,
    };

    paragraph.segments.forEach(segment => {
        handleSegment(doc, container, segment, context);
    });
}
