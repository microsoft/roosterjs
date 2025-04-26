import type { FormatParser, ContentModelTableFormat } from 'roosterjs-content-model-types/lib';

export const wordTableParser: FormatParser<ContentModelTableFormat> = (format): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
};
