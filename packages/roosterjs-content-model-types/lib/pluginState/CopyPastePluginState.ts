import type { DomToModelOptionForSanitizing } from '../context/DomToModelOption';
import type { PasteTypeOrGetter } from '../parameter/PasteTypeOrGetter';

/**
 * The state object for CopyPastePlugin
 */
export interface CopyPastePluginState {
    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType: string[];

    /**
     * A temporary DIV element used for cut/copy content
     */
    tempDiv: HTMLDivElement | null;

    /**
     * Default paste type. By default will use the normal (as-is) paste type.
     */
    defaultPasteType?: PasteTypeOrGetter;

    /**
     * Paste options for sanitizing HTML before paste
     */
    pasteOptionDomToModel?: Partial<DomToModelOptionForSanitizing>;
}
