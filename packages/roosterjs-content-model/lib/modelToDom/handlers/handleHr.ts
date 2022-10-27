import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelHR } from '../../publicTypes/block/ContentModelHR';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleHR: ContentModelHandler<ContentModelHR> = (
    doc: Document,
    parent: Node,
    hr: ContentModelHR,
    context: ModelToDomContext
) => {
    const hrElement = doc.createElement('hr');

    applyFormat(hrElement, context.formatAppliers.block, hr.format, context);

    parent.appendChild(hrElement);
};
