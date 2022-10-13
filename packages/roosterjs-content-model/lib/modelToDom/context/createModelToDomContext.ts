import { defaultFormatHandlerMap } from '../../formatHandlers/defaultFormatHandlers';
import { EditorContext } from '../../publicTypes/context/EditorContext';
import { FormatAppliers } from '../../publicTypes/context/ModelToDomSettings';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { ModelToDomOption } from '../../publicTypes/IExperimentalContentModelEditor';

const defaultApplierMap = getObjectKeys(defaultFormatHandlerMap).reduce((appliers, key) => {
    appliers[key] = defaultFormatHandlerMap[key].apply;
    return appliers;
}, <FormatAppliers>{});

function getFormatAppliers(option?: Partial<FormatAppliers>): FormatAppliers {
    return getObjectKeys(defaultApplierMap).reduce((appliers, key) => {
        const applier = option?.[key];
        appliers[key] = typeof applier === 'undefined' ? defaultApplierMap[key] : applier;

        return appliers;
    }, <FormatAppliers>{});
}

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
        formatAppliers: getFormatAppliers(options?.formatApplierOverride),
        originalFormatAppliers: defaultApplierMap,
        entityPairs: [],
    };
}
