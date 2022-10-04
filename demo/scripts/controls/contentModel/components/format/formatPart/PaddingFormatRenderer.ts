import { createTextFormatRendererGroup } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { PaddingFormat } from 'roosterjs-content-model';

type PaddingName = keyof PaddingFormat;
const PaddingNames: PaddingName[] = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];

export const PaddingFormatRenderer: FormatRenderer<PaddingFormat> = createTextFormatRendererGroup<
    PaddingFormat,
    PaddingName
>(
    PaddingNames,
    format => PaddingNames.map(name => format[name]),
    (format, name, value) => {
        format[name] = value;
    }
);
