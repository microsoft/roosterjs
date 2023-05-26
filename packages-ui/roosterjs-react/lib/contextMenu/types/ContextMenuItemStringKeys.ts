import { BackgroundColorKeys } from '../../colorPicker/index';
import {
    CancelButtonStringKey,
    MenuItemSplitterKey0,
    OkButtonStringKey,
} from '../../common/type/LocalizedStrings';

/**
 * Key of localized strings of List Number menu items and its dialog.
 * Including:
 * - Menu item "Set numbering value"
 * - Menu item "Restart at 1"
 * - Dialog text "Set value to"
 * - Ok button
 * - Cancel button
 */
export type ListNumberMenuItemStringKey =
    | 'menuNameListNumberEdit'
    | 'menuNameListNumberReset'
    | 'dialogTextSetListNumber'
    | OkButtonStringKey
    | CancelButtonStringKey;

/**
 * Key of localized strings of Image Alt Text menu item.
 * Including:
 * - Menu item "Add alternate text"
 * - Menu item "Size" and sub menus"
 * - Menu item "Crop image"
 * - Menu item "Remove image"
 * - Ok button
 * - Cancel button
 */
export type ImageEditMenuItemStringKey =
    | 'menuNameImageAltText'
    | 'menuNameImageResize'
    | 'menuNameImageCrop'
    | 'menuNameImageRotate'
    | 'menuNameImageRemove'
    | 'menuNameImageFlip'
    | 'menuNameImageSizeBestFit'
    | 'menuNameImageSizeSmall'
    | 'menuNameImageSizeMedium'
    | 'menuNameImageSizeOriginal'
    | 'menuNameImageRotateLeft'
    | 'menuNameImageRotateRight'
    | 'menuNameImageRotateFlipHorizontally'
    | 'menuNameImageRotateFlipVertically'
    | 'menuNameImageCopy'
    | 'menuNameImageCut'
    | OkButtonStringKey
    | CancelButtonStringKey;

/**
 * Key of localized strings of Table Edit Insert menu item.
 */
export type TableEditInsertMenuItemStringKey =
    | 'menuNameTableInsert'
    | 'menuNameTableInsertAbove'
    | 'menuNameTableInsertBelow'
    | 'menuNameTableInsertLeft'
    | 'menuNameTableInsertRight';

/**
 * Key of localized strings of Table Edit Delete menu item.
 */
export type TableEditDeleteMenuItemStringKey =
    | 'menuNameTableDelete'
    | 'menuNameTableDeleteTable'
    | 'menuNameTableDeleteColumn'
    | 'menuNameTableDeleteRow';

/**
 * Key of localized strings of Table Edit Merge menu item.
 */
export type TableEditMergeMenuItemStringKey =
    | 'menuNameTableMerge'
    | 'menuNameTableMergeAbove'
    | 'menuNameTableMergeBelow'
    | 'menuNameTableMergeLeft'
    | 'menuNameTableMergeRight'
    | 'menuNameTableMergeCells'
    | MenuItemSplitterKey0;

/**
 * Key of localized strings of Table Edit Split menu item.
 */
export type TableEditSplitMenuItemStringKey =
    | 'menuNameTableSplit'
    | 'menuNameTableSplitHorizontally'
    | 'menuNameTableSplitVertically';

/**
 * Key of localized strings of Table Edit Align menu item.
 */
export type TableEditAlignMenuItemStringKey =
    | 'menuNameTableAlign'
    | 'menuNameTableAlignLeft'
    | 'menuNameTableAlignCenter'
    | 'menuNameTableAlignRight'
    | 'menuNameTableAlignTop'
    | 'menuNameTableAlignMiddle'
    | 'menuNameTableAlignBottom'
    | MenuItemSplitterKey0;

/**
 * Key of localized strings of Table Edit Align table menu item.
 */
export type TableEditAlignTableMenuItemStringKey =
    | 'menuNameTableAlignTable'
    | 'menuNameTableAlignTableLeft'
    | 'menuNameTableAlignTableCenter'
    | 'menuNameTableAlignTableRight';

/**
 * Key of localized strings of Table Edit Cell Shade menu item.
 */
export type TableEditShadeMenuItemStringKey = 'menuNameTableCellShade' | BackgroundColorKeys;

/**
 * Key of localized strings of Table Edit menu item.
 * Including:
 * - Menu item "Insert"
 * - Menu item "Delete"
 * - Menu item "Merge"
 * - Menu item "Split"
 * - Menu item "Align cell"
 */
export type TableEditMenuItemStringKey =
    | TableEditInsertMenuItemStringKey
    | TableEditDeleteMenuItemStringKey
    | TableEditMergeMenuItemStringKey
    | TableEditSplitMenuItemStringKey
    | TableEditAlignMenuItemStringKey
    | TableEditShadeMenuItemStringKey
    | TableEditAlignTableMenuItemStringKey;
