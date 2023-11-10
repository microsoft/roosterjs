import type {
    ContentModelFormatMap,
    DomToModelOption,
    FormatParser,
    FormatParsersPerCategory,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export default function addParser<TKey extends keyof FormatParsersPerCategory>(
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
