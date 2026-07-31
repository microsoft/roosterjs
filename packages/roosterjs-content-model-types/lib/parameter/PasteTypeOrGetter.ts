import type { ClipboardData } from './ClipboardData';
import type { EditorEnvironment } from './EditorEnvironment';
import type { PasteType } from '../enum/PasteType';

/**
 * A function that returns the Paste Type to use based on the pasted content and clipboard data.
 * @param document The document parsed from the clipboard raw HTML, or null when there is no HTML
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param environment The editor environment information
 * @param htmlAttributes The metadata (HTML attributes) retrieved from the pasted content
 * @returns The Paste Type to use
 */
export type PasteTypeGetter = (
    document: Document | null,
    clipboardData: ClipboardData,
    environment: EditorEnvironment,
    htmlAttributes: Record<string, string>
) => PasteType;

/**
 * Represents the PasteType parameter used to set the paste type to use.
 * It can be either the Paste Type value or a callback that returns the Paste Type to use.
 */
export type PasteTypeOrGetter = PasteType | PasteTypeGetter;
