import type { DomToModelOption } from '../context/DomToModelOption';

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
     * Options used for convert DOM tree to Content Model when paste
     */
    pasteDomToModelOptions?: DomToModelOption;
}
