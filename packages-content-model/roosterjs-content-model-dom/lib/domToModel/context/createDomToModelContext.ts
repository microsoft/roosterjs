import { defaultProcessorMap } from './defaultProcessors';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { SelectionRangeEx } from 'roosterjs-editor-types';
import {
    defaultFormatHandlerMap,
    defaultFormatKeysPerCategory,
} from '../../formatHandlers/defaultFormatHandlers';
import {
    ContentModelBlockFormat,
    DomToModelContext,
    DomToModelDecoratorContext,
    DomToModelFormatContext,
    DomToModelSelectionContext,
    DomToModelSettings,
    EditorContext,
    ElementProcessorMap,
    FormatParser,
    FormatParsers,
    FormatParsersPerCategory,
} from 'roosterjs-content-model-types';

/**
 * Create context object for DOM to Content Model conversion
 * @param processorOverride Overrides default element processors
 * @param formatParserOverride Overrides default format handlers
 * @param additionalFormatParsers: Provide additional format parsers for each format type
 * @param baseProcessorMap Base DOM processor map, if not passed, default processor map will be used
 * @param editorContext Context of editor
 * @param selection Selection that already exists in content
 */
export function createDomToModelContext(
    processorOverride?: Partial<ElementProcessorMap>,
    formatParserOverride?: Partial<FormatParsers>,
    additionalFormatParsers?: (Partial<FormatParsersPerCategory> | undefined)[],
    baseProcessorMap?: Readonly<ElementProcessorMap>,
    selection?: SelectionRangeEx,
    editorContext?: EditorContext
): DomToModelContext {
    return Object.assign(
        {},
        editorContext,
        createDomToModelSelectionContext(selection),
        createDomToModelFormatContext(editorContext?.isRootRtl),
        createDomToModelDecoratorContext(),
        createDomToModelSettings(
            processorOverride,
            formatParserOverride,
            additionalFormatParsers,
            baseProcessorMap
        )
    );
}

function createDomToModelSelectionContext(rangeEx?: SelectionRangeEx): DomToModelSelectionContext {
    const result: DomToModelSelectionContext = { isInSelection: false };

    if (rangeEx) {
        result.rangeEx = rangeEx;
    }

    return result;
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

function createDomToModelSettings(
    processorOverride?: Partial<ElementProcessorMap>,
    formatParserOverride?: Partial<FormatParsers>,
    additionalFormatParsers?: (Partial<FormatParsersPerCategory> | undefined)[],
    baseProcessorMap?: Readonly<ElementProcessorMap>
): DomToModelSettings {
    const defaultElementProcessors = baseProcessorMap ?? defaultProcessorMap;

    return {
        elementProcessors: processorOverride
            ? { ...defaultElementProcessors, ...processorOverride }
            : defaultElementProcessors,
        formatParsers:
            formatParserOverride || (additionalFormatParsers?.length ?? 0) > 0
                ? buildFormatParsers(formatParserOverride, additionalFormatParsers)
                : defaultFormatParsersPerCategory,
        defaultElementProcessors,
    };
}

const defaultFormatParsers: Readonly<FormatParsers> = getObjectKeys(defaultFormatHandlerMap).reduce(
    (result, key) => {
        result[key] = defaultFormatHandlerMap[key].parse as FormatParser<any>;
        return result;
    },
    <FormatParsers>{}
);

/**
 * @internal Export for test only
 * Build format parsers used by DOM to Content Model conversion
 * @param override
 * @param additionalParsersArray
 * @returns
 */
export function buildFormatParsers(
    override: Partial<FormatParsers> = {},
    additionalParsersArray: (Partial<FormatParsersPerCategory> | undefined)[] = []
): FormatParsersPerCategory {
    return getObjectKeys(defaultFormatKeysPerCategory).reduce((result, key) => {
        const value = defaultFormatKeysPerCategory[key]
            .map(
                formatKey =>
                    (override[formatKey] === undefined
                        ? defaultFormatParsers[formatKey]
                        : override[formatKey]) as FormatParser<any>
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

const defaultFormatParsersPerCategory = buildFormatParsers();
