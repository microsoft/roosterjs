import { applyFormat } from '../utils/applyFormat';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const handleGeneralModel: ContentModelHandler<ContentModelGeneralBlock> = (
    doc: Document,
    parent: Node,
    group: ContentModelGeneralBlock,
    context: ModelToDomContext
) => {
    const newParent = group.element.cloneNode();

    if (isGeneralSegment(group) && isNodeOfType(newParent, NodeType.Element)) {
        if (!group.element.firstChild) {
            context.regularSelection.current.segment = newParent;
        }

        const implicitSegmentFormat = context.implicitSegmentFormat;
        let segmentElement: HTMLElement;

        try {
            if (group.link) {
                segmentElement = doc.createElement('a');

                parent.appendChild(segmentElement);
                segmentElement.appendChild(newParent);

                context.implicitSegmentFormat = {
                    ...implicitSegmentFormat,
                    ...(context.defaultImplicitSegmentFormatMap.a || {}),
                };

                applyFormat(
                    segmentElement,
                    context.formatAppliers.link,
                    group.link.format,
                    context
                );
                applyFormat(
                    segmentElement,
                    context.formatAppliers.dataset,
                    group.link.dataset,
                    context
                );
            } else {
                segmentElement = newParent;
                parent.appendChild(newParent);
            }

            applyFormat(segmentElement, context.formatAppliers.segment, group.format, context);
        } finally {
            context.implicitSegmentFormat = implicitSegmentFormat;
        }
    } else {
        parent.appendChild(newParent);
    }

    context.modelHandlers.blockGroupChildren(doc, newParent, group, context);
};

function isGeneralSegment(block: ContentModelGeneralBlock): block is ContentModelGeneralSegment {
    return (block as ContentModelGeneralSegment).segmentType == 'General';
}
