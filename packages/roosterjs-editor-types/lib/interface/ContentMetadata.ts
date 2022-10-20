import SelectionPath from './SelectionPath';
import TableSelection from './TableSelection';
import { SelectionRangeTypes } from '../enum/SelectionRangeTypes';

/**
 * Common part of NormalContentMetadata and TableContentMetadata
 */
export interface ContentMetadataBase<T extends SelectionRangeTypes> {
    isDarkMode: boolean;
    type: T;
}

/**
 * A content metadata is a data structure storing information other than HTML content,
 * such as dark mode info, selection info, ...
 *
 * NormalContentMetadata is content metadata for normal selection with a start and end selection path.
 *
 * When do any change to this type, also need to fix function isUndoMetadata to make sure
 * the check is correct
 */
export interface NormalContentMetadata
    extends SelectionPath,
        ContentMetadataBase<SelectionRangeTypes.Normal> {}

/**
 * A content metadata is a data structure storing information other than HTML content,
 * such as dark mode info, selection info, ...
 *
 * TableContentMetadata is content metadata for table selection with table id and start and end coordinates
 *
 * When do any change to this type, also need to fix function isUndoMetadata to make sure
 * the check is correct
 */
export interface TableContentMetadata
    extends TableSelection,
        ContentMetadataBase<SelectionRangeTypes.TableSelection> {
    tableId: string;
}

/**
 * A content metadata is a data structure storing information other than HTML content,
 * such as dark mode info, selection info, ...
 *
 * ImageContentMetadata is content metadata for image selection with image id
 *
 * When do any change to this type, also need to fix function isUndoMetadata to make sure
 * the check is correct
 */
export interface ImageContentMetadata
    extends ContentMetadataBase<SelectionRangeTypes.ImageSelection> {
    imageId: string;
}

/**
 * A content metadata is a data structure storing information other than HTML content,
 * such as dark mode info, selection info, ...
 */
export type ContentMetadata = NormalContentMetadata | TableContentMetadata | ImageContentMetadata;
