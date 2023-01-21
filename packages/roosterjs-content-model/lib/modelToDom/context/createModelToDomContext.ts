import { defaultContentModelHandlers } from './defaultContentModelHandlers';
import { defaultImplicitFormatMap } from '../../formatHandlers/utils/defaultStyles';
import { EditorContext } from '../../publicTypes/context/EditorContext';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { ModelToDomOption } from '../../publicTypes/IExperimentalContentModelEditor';
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
    return {
        ...(editorContext || {
            isDarkMode: false,
            isRightToLeft: false,
            zoomScale: 1,
            getDarkColor: undefined,
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
            options?.formatApplierOverride,
            options?.additionalFormatAppliers
        ),
        modelHandlers: {
            ...defaultContentModelHandlers,
            ...(options?.modelHandlerOverride || {}),
        },
        defaultImplicitFormatMap: {
            ...defaultImplicitFormatMap,
            ...(options?.defaultImplicitFormatOverride || {}),
        },
        entities: {},
        newDarkColors: {},

        defaultModelHandlers: defaultContentModelHandlers,
        defaultFormatAppliers: defaultFormatAppliers,
        doNotReuseEntityDom: !!options?.doNotReuseEntityDom,
    };
}
