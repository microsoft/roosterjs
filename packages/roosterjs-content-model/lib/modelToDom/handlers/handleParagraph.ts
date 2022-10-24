import { applyFormat } from '../utils/applyFormat';
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

    if (shouldCreateElement(paragraph)) {
        container = doc.createElement(
            typeof paragraph.headerLevel == 'number' ? 'h' + paragraph.headerLevel : 'div'
        );
        parent.appendChild(container);

        applyFormat(container, context.formatAppliers.block, paragraph.format, context);
    } else {
        container = parent as HTMLElement;
    }

    context.regularSelection.current = {
        block: container,
        segment: null,
    };

    paragraph.segments.forEach(segment => {
        context.modelHandlers.segment(doc, container, segment, context);
    });
};

function shouldCreateElement(paragraph: ContentModelParagraph) {
    return (
        !paragraph.isImplicit ||
        (typeof paragraph.headerLevel == 'number' && paragraph.headerLevel > 0)
    );
}
