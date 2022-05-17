import { CancelButtonStringKey, OkButtonStringKey } from '../../common/type/LocalizedStrings';

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
 * - Menu item "Size"
 * - Menu item "Crop image"
 * - Menu item "Remove image"
 */
export type ImageEditMenuItemStringKey =
    | 'menuNameImageAltText'
    | 'menuNameImageResize'
    | 'menuNameImageCrop'
    | 'menuNameImageRemove';
