import { applyFormat } from '../utils/applyFormat';
import { getObjectKeys } from '../../domUtils/getObjectKeys';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import { wrap } from '../../domUtils/wrap';
import type {
    ContentModelBlockHandler,
    ContentModelEntity,
    ContentModelSegmentHandler,
} from 'roosterjs-content-model-types';

const DelimiterClassName = '_EntityDelimiter';
const ZERO_WIDTH_SPACE = '\u200B';

/**
 * @internal
 */
export const handleEntityBlock: ContentModelBlockHandler<ContentModelEntity> = (
    doc,
    parent,
    entityModel,
    context,
    refNode
) => {
    const { entityFormat, wrapper } = entityModel;

    applyFormat(wrapper, context.formatAppliers.entity, entityFormat, context);

    const needDelimiter =
        context.addDelimiterForEntity &&
        wrapper.style.display == 'inline-block' &&
        wrapper.style.width == '100%';
    const isContained = wrapper.parentElement?.classList.contains(DelimiterClassName);
    const elementToReuse =
        isContained && needDelimiter && wrapper.parentElement ? wrapper.parentElement : wrapper;

    refNode = reuseCachedElement(parent, elementToReuse, refNode);

    if (needDelimiter && !isContained) {
        const containerElement = wrap(doc, wrapper, 'div');

        addDelimiter(doc, containerElement, wrapper);
    }

    context.onNodeCreated?.(entityModel, wrapper);

    return refNode;
};

/**
 * @internal
 */
export const handleEntitySegment: ContentModelSegmentHandler<ContentModelEntity> = (
    doc,
    parent,
    entityModel,
    context,
    newSegments
) => {
    const { entityFormat, wrapper, format } = entityModel;

    parent.appendChild(wrapper);
    newSegments?.push(wrapper);

    applyFormat(wrapper, context.formatAppliers.entity, entityFormat, context);

    const hasFormat = getObjectKeys(format).length > 0;
    const needDelimiter = context.addDelimiterForEntity && entityFormat.isReadonly;
    const containerElement = hasFormat || needDelimiter ? wrap(doc, wrapper, 'span') : wrapper;

    if (hasFormat) {
        applyFormat(containerElement, context.formatAppliers.segment, format, context);
    }

    if (needDelimiter) {
        addDelimiter(doc, containerElement, wrapper);
    }

    context.regularSelection.current.segment = containerElement;

    context.onNodeCreated?.(entityModel, wrapper);
};

function addDelimiter(doc: Document, containerElement: HTMLElement, entityWrapper: HTMLElement) {
    containerElement.className = DelimiterClassName;
    containerElement.insertBefore(doc.createTextNode(ZERO_WIDTH_SPACE), entityWrapper);
    containerElement.appendChild(doc.createTextNode(ZERO_WIDTH_SPACE));
}
