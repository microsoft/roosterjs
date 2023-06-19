import { CreateEditorContext } from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create a EditorContext object used by ContentModel API
 */
export const createEditorContext: CreateEditorContext = core => {
    return {
        defaultFormat: core.defaultFormat,
        darkColorHandler: core.darkColorHandler,
        addDelimiterForEntity: core.addDelimiterForEntity,
    };
};
