import { ContentModelFormatMap } from '../../../../publicTypes/format/ContentModelFormatMap';
import { DomToModelOption } from '../../../../publicTypes/IContentModelEditor';
import {
    FormatParser,
    FormatParsersPerCategory,
} from '../../../../publicTypes/context/DomToModelSettings';

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
