import { defaultProcessorMap } from './defaultProcessors';
import { getObjectKeys } from 'roosterjs-editor-dom';
import {
    defaultFormatKeysPerCategory,
    defaultFormatParsers,
} from '../../formatHandlers/defaultFormatHandlers';
import type {
    ContentModelBlockFormat,
    DomToModelContext,
    DomToModelDecoratorContext,
    DomToModelFormatContext,
    DomToModelOption,
    DomToModelSelectionContext,
    DomToModelSettings,
    EditorContext,
    FormatParser,
    FormatParsers,
    FormatParsersPerCategory,
} from 'roosterjs-content-model-types';

/**
 * Create context object for DOM to Content Model conversion
 * @param editorContext Context of editor
 * @param options Option array to customize the DOM to Model conversion behavior
 */
export function createDomToModelContext(
    editorContext?: EditorContext,
    ...options: (DomToModelOption | undefined)[]
): DomToModelContext {
    return createDomToModelContextWithConfig(createDomToModelConfig(options), editorContext);
}

/**
 * Create context object for DOM to Content Model conversion with an existing configure
 * @param config A full config object to define how to convert DOM tree to Content Model
 * @param editorContext Context of editor
 */
export function createDomToModelContextWithConfig(
    config: DomToModelSettings,
    editorContext?: EditorContext
) {
    return Object.assign(
        {},
        editorContext,
        createDomToModelSelectionContext(),
        createDomToModelFormatContext(editorContext?.isRootRtl),
        createDomToModelDecoratorContext(),
        config
    );
}

function createDomToModelSelectionContext(): DomToModelSelectionContext {
    return { isInSelection: false };
}

function createDomToModelFormatContext(isRootRtl?: boolean): DomToModelFormatContext {
    const blockFormat: ContentModelBlockFormat = isRootRtl ? { direction: 'rtl' } : {};

    return {
        blockFormat,
        segmentFormat: {},

        listFormat: {
            levels: [],
            threadItemCounts: [],
        },
    };
}

function createDomToModelDecoratorContext(): DomToModelDecoratorContext {
    return {
        link: {
            format: {},
            dataset: {},
        },
        code: {
            format: {},
        },
        blockDecorator: {
            format: {},
            tagName: '',
        },
    };
}

/**
 * Create Dom to Content Model Config object
 * @param options All customizations of content model creation
 */
export function createDomToModelConfig(
    options: (DomToModelOption | undefined)[]
): DomToModelSettings {
    return {
        elementProcessors: Object.assign(
            {},
            defaultProcessorMap,
            ...options.map(x => x?.processorOverride)
        ),
        formatParsers: buildFormatParsers(
            options.map(x => x?.formatParserOverride),
            options.map(x => x?.additionalFormatParsers)
        ),
        defaultElementProcessors: defaultProcessorMap,
        defaultFormatParsers,
    };
}

/**
 * @internal Export for test only
 * Build format parsers used by DOM to Content Model conversion
 * @param override
 * @param additionalParsersArray
 * @returns
 */
export function buildFormatParsers(
    overrides: (Partial<FormatParsers> | undefined)[] = [],
    additionalParsersArray: (Partial<FormatParsersPerCategory> | undefined)[] = []
): FormatParsersPerCategory {
    const combinedOverrides = Object.assign({}, ...overrides);

    return getObjectKeys(defaultFormatKeysPerCategory).reduce((result, key) => {
        const value = defaultFormatKeysPerCategory[key]
            .map(
                formatKey =>
                    (combinedOverrides[formatKey] === undefined
                        ? defaultFormatParsers[formatKey]
                        : combinedOverrides[formatKey]) as FormatParser<any>
            )
            .concat(
                ...additionalParsersArray.map(
                    parsers => (parsers?.[key] ?? []) as FormatParser<any>[]
                )
            );

        result[key] = value;

        return result;
    }, {} as FormatParsersPerCategory);
}
