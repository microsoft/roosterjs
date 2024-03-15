import type {
    ContentModelFormatMap,
    DomToModelOption,
    FormatParser,
    ElementFormatParserPerCategory,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function addParser<TKey extends keyof ElementFormatParserPerCategory>(
    domToModelOption: DomToModelOption,
    entry: TKey,
    additionalFormatParsers: FormatParser<ContentModelFormatMap[TKey]>
) {
    if (!domToModelOption.additionalFormatParsers) {
        domToModelOption.additionalFormatParsers = {};
    }
    if (!domToModelOption.additionalFormatParsers[entry]) {
        domToModelOption.additionalFormatParsers[entry] = [];
    }

    domToModelOption.additionalFormatParsers[entry]?.push(additionalFormatParsers);
}
