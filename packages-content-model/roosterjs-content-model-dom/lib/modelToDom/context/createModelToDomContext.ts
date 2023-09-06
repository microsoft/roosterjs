import { defaultContentModelHandlers } from './defaultContentModelHandlers';
import { getObjectKeys } from 'roosterjs-editor-dom';
import {
    defaultFormatHandlerMap,
    defaultFormatKeysPerCategory,
} from '../../formatHandlers/defaultFormatHandlers';
import {
    ContentModelHandlerMap,
    EditorContext,
    FormatApplier,
    FormatAppliers,
    FormatAppliersPerCategory,
    ModelToDomContext,
    ModelToDomFormatContext,
    ModelToDomSelectionContext,
    ModelToDomSettings,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * Create context object fro Content Model to DOM conversion
 * @param onNodeCreated Callback invoked when a DOM node is created
 * @param handlerOverride Overrides default model handlers
 * @param formatApplierOverride Overrides default format appliers
 * @param additionalFormatAppliers Provide additional format appliers for each format type
 * @param baseModelHandlerMap Base model handler map, if not passed, default handler map will be used
 * @param editorContext Context of editor
 */
export function createModelToDomContext(
    onNodeCreated?: OnNodeCreated,
    handlerOverride?: Partial<ContentModelHandlerMap>,
    formatApplierOverride?: Partial<FormatAppliers>,
    additionalFormatAppliers?: (Partial<FormatAppliersPerCategory> | undefined)[],
    baseModelHandlerMap?: Readonly<ContentModelHandlerMap>,
    editorContext?: EditorContext
): ModelToDomContext {
    return Object.assign(
        {},
        editorContext,
        createModelToDomSelectionContext(),
        createModelToDomFormatContext(),
        createModelToDomSettings(
            onNodeCreated,
            handlerOverride,
            formatApplierOverride,
            additionalFormatAppliers,
            baseModelHandlerMap
        )
    );
}

function createModelToDomSelectionContext(): ModelToDomSelectionContext {
    return {
        regularSelection: {
            current: {
                block: null,
                segment: null,
            },
        },
    };
}

function createModelToDomFormatContext(): ModelToDomFormatContext {
    return {
        listFormat: {
            threadItemCounts: [],
            nodeStack: [],
        },
        implicitFormat: {},
    };
}

function createModelToDomSettings(
    onNodeCreated?: OnNodeCreated,
    handlerOverride?: Partial<ContentModelHandlerMap>,
    formatApplierOverride?: Partial<FormatAppliers>,
    additionalFormatAppliers?: (Partial<FormatAppliersPerCategory> | undefined)[],
    baseModelHandlerMap?: Readonly<ContentModelHandlerMap>
): ModelToDomSettings {
    const defaultModelHandlers = baseModelHandlerMap ?? defaultContentModelHandlers;

    return {
        modelHandlers: handlerOverride
            ? { ...defaultModelHandlers, ...handlerOverride }
            : defaultModelHandlers,
        formatAppliers:
            formatApplierOverride || (additionalFormatAppliers?.length ?? 0) > 0
                ? buildFormatAppliers(formatApplierOverride, additionalFormatAppliers)
                : defaultFormatAppliersPerCategory,
        onNodeCreated,
        defaultModelHandlers,
    };
}

const defaultFormatAppliers: Readonly<FormatAppliers> = getObjectKeys(
    defaultFormatHandlerMap
).reduce((result, key) => {
    result[key] = defaultFormatHandlerMap[key].apply as FormatApplier<any>;
    return result;
}, <FormatAppliers>{});

/**
 * @internal Export for test only
 * Build format appliers used by Content Model to DOM conversion
 */
export function buildFormatAppliers(
    override: Partial<FormatAppliers> = {},
    additionalAppliersArray: (Partial<FormatAppliersPerCategory> | undefined)[] = []
): FormatAppliersPerCategory {
    return getObjectKeys(defaultFormatKeysPerCategory).reduce((result, key) => {
        const value = defaultFormatKeysPerCategory[key]
            .map(
                formatKey =>
                    (override[formatKey] === undefined
                        ? defaultFormatAppliers[formatKey]
                        : override[formatKey]) as FormatApplier<any>
            )
            .concat(
                ...additionalAppliersArray.map(
                    appliers => (appliers?.[key] ?? []) as FormatApplier<any>[]
                )
            );

        result[key] = value;

        return result;
    }, {} as FormatAppliersPerCategory);
}

const defaultFormatAppliersPerCategory = buildFormatAppliers();
