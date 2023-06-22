import { defaultContentModelHandlers } from './defaultContentModelHandlers';
import { defaultImplicitFormatMap } from '../../formatHandlers/utils/defaultStyles';
import { EditorContext, ModelToDomContext, ModelToDomOption } from 'roosterjs-content-model-types';
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
        ...editorContext,
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
