import { FormatKey } from '../publicTypes/format/FormatHandlerTypeMap';

/**
 * @internal
 * Order by frequency, from not common used to common used, for better optimization
 */
export const SegmentFormatHandlers: FormatKey[] = [
    'superOrSubScript',
    'strike',
    'fontFamily',
    'fontSize',
    'underline',
    'italic',
    'bold',
    'textColor',
    'backgroundColor',
];
