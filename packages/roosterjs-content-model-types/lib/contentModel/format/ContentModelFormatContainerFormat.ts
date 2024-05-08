import type { Mutable } from '../common/Mutable';
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
export type ContentModelFormatContainerFormat = Mutable & ContentModelFormatContainerFormatCommon;

/**
 * Type for FormatContainer (Readonly)
 */
export type ReadonlyContentModelFormatContainerFormat = Readonly<
    ContentModelFormatContainerFormatCommon
>;
