import type { IEditor, AnnounceData, PluginKeyboardEvent } from 'roosterjs-editor-types';

/**
 * @internal
 */
export interface AnnounceFeatureParam {
    /**
     * Last focused element in editor
     */
    lastFocusedElement: HTMLElement | undefined | null;
    /**
     * Keyboard event
     */
    event: PluginKeyboardEvent;
    /**
     * Editor Instance
     */
    editor: IEditor;
}

/**
 * @internal
 */
export interface AnnounceFeature {
    /**
     * Whether to handle this feature, if returns Announce Data, will be announced, otherwise will do nothing.
     * @returns
     */
    shouldHandle: (params: AnnounceFeatureParam) => AnnounceData | false;
    /**
     * Keys handled in the current event
     */
    keys: number[];
}
