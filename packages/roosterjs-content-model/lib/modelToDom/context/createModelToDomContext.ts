import { defaultContentModelHandlers } from './defaultContentModelHandlers';
import { defaultImplicitFormatMap } from '../../formatHandlers/utils/defaultStyles';
import { EditorContext } from '../../publicTypes/context/EditorContext';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { ModelToDomOption } from '../../publicTypes/IContentModelEditor';
import {
    defaultFormatAppliers,
    getFormatAppliers,
} from '../../formatHandlers/defaultFormatHandlers';

/**
 * @internal
 * @param editorContext
 * @returns
 */
export function createModelToDomContext(
    editorContext?: EditorContext,
    options?: ModelToDomOption
): ModelToDomContext {
    options = options || {};

    return {
        ...(editorContext || {
            isDarkMode: false,
        }),
        regularSelection: {
            current: {
                block: null,
                segment: null,
            },
        },
        listFormat: {
            threadItemCounts: [],
            nodeStack: [],
        },
        implicitFormat: {},
        formatAppliers: getFormatAppliers(
            options.formatApplierOverride,
            options.additionalFormatAppliers
        ),
        modelHandlers: {
            ...defaultContentModelHandlers,
            ...(options.modelHandlerOverride || {}),
        },
        defaultImplicitFormatMap: {
            ...defaultImplicitFormatMap,
            ...(options.defaultImplicitFormatOverride || {}),
        },

        defaultModelHandlers: defaultContentModelHandlers,
        defaultFormatAppliers: defaultFormatAppliers,
        onNodeCreated: options.onNodeCreated,
    };
}
