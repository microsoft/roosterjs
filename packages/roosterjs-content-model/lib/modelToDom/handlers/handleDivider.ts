import { applyFormat } from '../utils/applyFormat';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleDivider: ContentModelHandler<ContentModelDivider> = (
    doc: Document,
    parent: Node,
    divider: ContentModelDivider,
    context: ModelToDomContext
) => {
    const element = doc.createElement(divider.tagName);

    applyFormat(element, context.formatAppliers.block, divider.format, context);

    parent.appendChild(element);
};
