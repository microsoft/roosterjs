import type { Mutable } from '../common/Mutable';
import type {
    ContentModelBlockFormat,
    ReadonlyContentModelBlockFormat,
} from './ContentModelBlockFormat';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegmentFormat,
} from './ContentModelSegmentFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * Common part of type for FormatContainer
 */
export type ContentModelFormatContainerFormatCommon = SizeFormat & DisplayFormat;

/**
 * Type for FormatContainer
 */
export type ContentModelFormatContainerFormat = Mutable &
    ContentModelSegmentFormat &
    ContentModelBlockFormat &
    ContentModelFormatContainerFormatCommon;

/**
 * Type for FormatContainer (Readonly)
 */
export type ReadonlyContentModelFormatContainerFormat = ReadonlyContentModelBlockFormat &
    ReadonlyContentModelSegmentFormat &
    Readonly<ContentModelFormatContainerFormatCommon>;
