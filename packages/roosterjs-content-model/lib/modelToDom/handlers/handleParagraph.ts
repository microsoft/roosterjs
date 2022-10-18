import { applyFormat } from '../utils/applyFormat';
import { BlockFormatHandlers } from '../../formatHandlers/BlockFormatHandlers';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleParagraph: ContentModelHandler<ContentModelParagraph> = (
    doc: Document,
    parent: Node,
    paragraph: ContentModelParagraph,
    context: ModelToDomContext
) => {
    let container: HTMLElement;

    if (paragraph.isImplicit) {
        container = parent as HTMLElement;
    } else {
        container = doc.createElement('div');
        parent.appendChild(container);

        applyFormat(container, BlockFormatHandlers, paragraph.format, context);
    }

    context.regularSelection.current = {
        block: container,
        segment: null,
    };

    paragraph.segments.forEach(segment => {
        context.modelHandlers.segment(doc, container, segment, context);
    });
};
