import type { IEditor, AnnounceData } from 'roosterjs-editor-types';

/**
 * Represents a Announce feature used in Announce Plugin.
 * If the Should Handle Callback returns announce data, it will be announced by using a aria-live region.
 */
export interface AnnounceFeature {
    /**
     * Whether to handle this feature, if returns Announce Data, will be announced, otherwise will do nothing.
     * @returns
     */
    shouldHandle: (editor: IEditor, lastFocusedElement: HTMLElement | null) => AnnounceData | false;
    /**
     * Keys handled in the current event
     */
    keys: number[];
}
