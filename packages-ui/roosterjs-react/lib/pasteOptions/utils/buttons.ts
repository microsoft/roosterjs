import { PasteOptionButtonKeys } from '../type/PasteOptionStringKeys';

/**
 * @internal
 */
export interface PasteOptionButtonType {
    unlocalizedText: string;
    shortcut: string;
    icon: string;
}

/**
 * @internal
 */
export const Buttons: Record<PasteOptionButtonKeys, PasteOptionButtonType> = {
    pasteOptionPasteAsIs: {
        unlocalizedText: 'Paste as is',
        shortcut: 'P',
        icon: 'Paste',
    },
    pasteOptionPasteText: {
        unlocalizedText: 'Paste text',
        shortcut: 'T',
        icon: 'PasteAsText',
    },
    pasteOptionMergeFormat: {
        unlocalizedText: 'Paste text and merge format',
        shortcut: 'M',
        icon: 'ClipboardList',
    },
};

/**
 * @internal
 */
export const ButtonKeys: PasteOptionButtonKeys[] = Object.keys(Buttons) as PasteOptionButtonKeys[];
