import { applyFormat } from '../utils/applyFormat';
import { BlockFormatHandlers } from '../../formatHandlers/BlockFormatHandlers';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { handleSegment } from './handleSegment';
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

            container = doc.createElement(tagName);

            parent.appendChild(container);

            applyFormat(container, context.formatAppliers.block, paragraph.format, context);
            applyFormat(container, context.formatAppliers.segmentOnBlock, format, context);
        } else if (
            !paragraph.isImplicit ||
            (getObjectKeys(paragraph.format).length > 0 &&
                paragraph.segments.some(segment => segment.segmentType != 'SelectionMarker'))
        ) {
            container = doc.createElement('div');
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
    });
};
