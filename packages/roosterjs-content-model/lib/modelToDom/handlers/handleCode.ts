import { applyFormat } from '../utils/applyFormat';
import { ContentModelCode } from '../../publicTypes/group/ContentModelCode';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleCode: ContentModelHandler<ContentModelCode> = (
    doc: Document,
    parent: Node,
    codeModel: ContentModelCode,
    context: ModelToDomContext
) => {
    if (!isBlockGroupEmpty(codeModel)) {
        const code = doc.createElement('code');
        parent.appendChild(code);

        applyFormat(code, context.formatAppliers.block, codeModel.format, context);

        context.modelHandlers.blockGroupChildren(doc, code, codeModel, context);
    }
};
