import type { ClipboardData } from './ClipboardData';
import type { PasteType } from '../enum/PasteType';

/**
 * Represents the PasteType parameter used to set the paste type to use.
 * It can be either the Paste Type value or a callback that retuns the Paste Type to use.
 */
export type PasteTypeOrGetter =
    | PasteType
    | ((document: Document | null, clipboardData: ClipboardData) => PasteType);
