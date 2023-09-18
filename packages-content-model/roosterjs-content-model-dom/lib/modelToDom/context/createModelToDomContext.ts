import { defaultContentModelHandlers } from './defaultContentModelHandlers';
import { getObjectKeys } from 'roosterjs-editor-dom';
import {
    defaultFormatAppliers,
    defaultFormatKeysPerCategory,
} from '../../formatHandlers/defaultFormatHandlers';
import {
    EditorContext,
    FormatApplier,
    FormatAppliers,
    FormatAppliersPerCategory,
    ModelToDomContext,
    ModelToDomFormatContext,
    ModelToDomOption,
    ModelToDomSelectionContext,
    ModelToDomSettings,
} from 'roosterjs-content-model-types';

/**
 * Create context object fro Content Model to DOM conversion
 * @param editorContext Context of editor
 * @param options Option array to customize the Model to DOM conversion behavior
 */
export function createModelToDomContext(
    editorContext?: EditorContext,
    ...options: (ModelToDomOption | undefined)[]
): ModelToDomContext {
    return Object.assign(
        {},
        editorContext,
        createModelToDomSelectionContext(),
        createModelToDomFormatContext(),
        createModelToDomSettings(options)
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

function createModelToDomSettings(options: (ModelToDomOption | undefined)[]): ModelToDomSettings {
    return {
        modelHandlers: Object.assign(
            {},
            defaultContentModelHandlers,
            ...options.map(x => x?.modelHandlerOverride)
        ),
        formatAppliers: buildFormatAppliers(
            options.map(x => x?.formatApplierOverride),
            options.map(x => x?.additionalFormatAppliers)
        ),
        defaultModelHandlers: defaultContentModelHandlers,
        defaultFormatAppliers,
    };
}

/**
 * @internal Export for test only
 * Build format appliers used by Content Model to DOM conversion
 */
export function buildFormatAppliers(
    overrides: (Partial<FormatAppliers> | undefined)[] = [],
    additionalAppliersArray: (Partial<FormatAppliersPerCategory> | undefined)[] = []
): FormatAppliersPerCategory {
    const combinedOverrides = Object.assign({}, ...overrides);

    return getObjectKeys(defaultFormatKeysPerCategory).reduce((result, key) => {
        const value = defaultFormatKeysPerCategory[key]
            .map(
                formatKey =>
                    (combinedOverrides[formatKey] === undefined
                        ? defaultFormatAppliers[formatKey]
                        : combinedOverrides[formatKey]) as FormatApplier<any>
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
