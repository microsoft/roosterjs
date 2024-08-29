import { idFormatHandler } from 'roosterjs-content-model-dom/lib/formatHandlers/common/idFormatHandler';
import {
    ContentModelBlockFormat,
    ContentModelDividerFormat,
    ContentModelFormatContainerFormat,
    ContentModelTableCellFormat,
    ContentModelTableFormat,
    DomToModelOption,
    FormatApplier,
    FormatParser,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

export const defaultDomToModelOptions: DomToModelOption = {
    additionalFormatParsers: {
        block: [idFormatHandler.parse as FormatParser<ContentModelBlockFormat>],
        container: [idFormatHandler.parse as FormatParser<ContentModelFormatContainerFormat>],
        divider: [idFormatHandler.parse as FormatParser<ContentModelDividerFormat>],
        tableRow: [idFormatHandler.parse as FormatParser<ContentModelBlockFormat>],
        table: [idFormatHandler.parse as FormatParser<ContentModelTableFormat>],
        tableCell: [idFormatHandler.parse as FormatParser<ContentModelTableCellFormat>],
    },
};

export const defaultModelToDomOptions: ModelToDomOption = {
    additionalFormatAppliers: {
        block: [idFormatHandler.apply as FormatApplier<ContentModelBlockFormat>],
        container: [idFormatHandler.apply as FormatApplier<ContentModelFormatContainerFormat>],
        divider: [idFormatHandler.apply as FormatApplier<ContentModelDividerFormat>],
        tableRow: [idFormatHandler.apply as FormatApplier<ContentModelBlockFormat>],
        table: [idFormatHandler.apply as FormatApplier<ContentModelTableFormat>],
        tableCell: [idFormatHandler.apply as FormatApplier<ContentModelTableCellFormat>],
    },
};
