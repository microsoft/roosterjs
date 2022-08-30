import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { boldFormatHandler } from './segment/boldFormatHandler';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { fontFamilyFormatHandler } from './segment/fontFamilyFormatHandler';
import { fontSizeFormatHandler } from './segment/fontSizeFormatHandler';
import { FormatHandler } from './FormatHandler';
import { italicFormatHandler } from './segment/italicFormatHandler';
import { strikeFormatHandler } from './segment/strikeFormatHandler';
import { textColorFormatHandler } from './segment/textColorFormatHandler';
import { underlineFormatHandler } from './segment/underlineFormatHandler';

/**
 * @internal
 * Order by frequency, from not common used to common used, for better optimization
 */
export const SegmentFormatHandlers: FormatHandler<ContentModelSegmentFormat>[] = [
    strikeFormatHandler,
    fontFamilyFormatHandler,
    fontSizeFormatHandler,
    underlineFormatHandler,
    italicFormatHandler,
    boldFormatHandler,
    textColorFormatHandler,
    backgroundColorFormatHandler,
];
