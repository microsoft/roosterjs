import { applyFormat } from '../utils/applyFormat';
import { getObjectKeys } from '../../domUtils/getObjectKeys';
import { handleSegments } from './handleSegments';
import { optimize } from '../optimizers/optimize';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import { stackFormat } from '../utils/stackFormat';
import { unwrap } from '../../domUtils/unwrap';
import type {
    ContentModelBlockHandler,
    ContentModelParagraph,
} from 'roosterjs-content-model-types';

const DefaultParagraphTag = 'div';

/**
 * @internal
 */
export const handleParagraph: ContentModelBlockHandler<ContentModelParagraph> = (
    doc,
    parent,
    paragraph,
    context,
    refNode
) => {
    let cachedElement = context.allowCacheElement ? paragraph.cachedElement : undefined;

    if (
        cachedElement &&
        paragraph.segments.every(x => x.segmentType != 'General' && !x.isSelected)
    ) {
        refNode = reuseCachedElement(parent, cachedElement, refNode);
    } else {
        stackFormat(context, paragraph.decorator?.tagName || null, () => {
            const needParagraphWrapper =
                !paragraph.isImplicit ||
                !!paragraph.decorator ||
                (getObjectKeys(paragraph.format).length > 0 &&
                    paragraph.segments.some(segment => segment.segmentType != 'SelectionMarker'));
            const formatOnWrapper = needParagraphWrapper
                ? {
                      ...(paragraph.decorator?.format || {}),
                      ...paragraph.segmentFormat,
                  }
                : {};
            const container = doc.createElement(
                paragraph.decorator?.tagName || DefaultParagraphTag
            );

            parent.insertBefore(container, refNode);

            context.regularSelection.current = {
                block: needParagraphWrapper ? container : container.parentNode,
                segment: null,
            };

            if (needParagraphWrapper) {
                stackFormat(context, formatOnWrapper, () => {
                    handleSegments(doc, container, paragraph, context);
                });

                applyFormat(container, context.formatAppliers.block, paragraph.format, context);
                applyFormat(container, context.formatAppliers.container, paragraph.format, context);
                applyFormat(
                    container,
                    context.formatAppliers.segmentOnBlock,
                    formatOnWrapper,
                    context
                );
            } else {
                handleSegments(doc, container, paragraph, context);
            }

            // optimize(container);

            // It is possible the next sibling node is changed during processing child segments
            // e.g. When this paragraph is an implicit paragraph and it contains an inline entity segment
            // The segment will be appended to container as child then the container will be removed
            // since this paragraph it is implicit. In that case container.nextSibling will become original
            // inline entity's next sibling. So reset refNode to its real next sibling (after change) here
            // to make sure the value is correct.
            refNode = container.nextSibling;

            if (container) {
                context.onNodeCreated?.(paragraph, container);
                context.domIndexer?.onParagraph(container);
            }

            if (needParagraphWrapper) {
                if (context.allowCacheElement) {
                    paragraph.cachedElement = container;
                }
            } else {
                unwrap(container);
            }
        });
    }

    return refNode;
};
