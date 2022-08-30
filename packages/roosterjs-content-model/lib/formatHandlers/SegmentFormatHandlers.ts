import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { FormatHandler } from './FormatHandler';

/**
 * @internal
 * Order by frequency, from not common used to common used, for better optimization
 */
export const SegmentFormatHandlers: FormatHandler<ContentModelSegmentFormat>[] = [];
