import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { LegacyTableBorderFormat } from 'roosterjs-content-model-types';

export const LegacyTableBorderFormatRenderers: FormatRenderer<LegacyTableBorderFormat>[] = [
    createTextFormatRenderer<LegacyTableBorderFormat>(
        'LegacyTableBorder',
        format => format.legacyTableBorder,
        (format, value) => (format.legacyTableBorder = value)
    ),
    createTextFormatRenderer<LegacyTableBorderFormat>(
        'CellSpacing',
        format => format.cellSpacing,
        (format, value) => (format.cellSpacing = value)
    ),
    createTextFormatRenderer<LegacyTableBorderFormat>(
        'CellPadding',
        format => format.cellPadding,
        (format, value) => (format.cellPadding = value)
    ),
];
