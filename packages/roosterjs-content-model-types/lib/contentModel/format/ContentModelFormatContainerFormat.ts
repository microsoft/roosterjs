import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { ContentModelBlockFormatCommon } from './ContentModelBlockFormat';
import type { ContentModelSegmentFormatCommon } from './ContentModelSegmentFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * Common part of type for FormatContainer
 */
export type ContentModelFormatContainerFormatCommon = SizeFormat &
    DisplayFormat &
    ContentModelSegmentFormatCommon &
    ContentModelBlockFormatCommon;

/**
 * Type for FormatContainer
 */
export type ContentModelFormatContainerFormat = MutableMark &
    ContentModelFormatContainerFormatCommon;

/**
 * Type for FormatContainer (Readonly)
 */
export type ReadonlyContentModelFormatContainerFormat = ReadonlyMark &
    Readonly<ContentModelFormatContainerFormatCommon>;
