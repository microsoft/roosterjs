import type { IEditor, AnnounceData, PluginKeyboardEvent } from 'roosterjs-editor-types';

/**
 * @internal
 */
export interface AnnounceFeatureParam {
    /**
     * Callback to announce a message to screen reader.
     */
    announceCallback: (announceData: AnnounceData) => void;
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
     * Whether to handle this feature
     * @returns
     */
    shouldHandle: (params: Omit<AnnounceFeatureParam, 'announceCallback'>) => boolean;
    /**
     * Handle the current feature
     * @returns
     */
    handle: (param: AnnounceFeatureParam) => void;
    /**
     * Keys handled in the current event
     */
    keys: number[];
}
