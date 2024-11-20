import type { DomModification } from '../context/DomModification';
import type { KnownAnnounceStrings } from '../parameter/AnnounceData';

/**
 * The state object for LifecyclePlugin
 */
export interface LifecyclePluginState {
    /**
     * Whether editor is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Cached document fragment for original content
     */
    shadowEditFragment: DocumentFragment | null;

    /**
     * The HTML container for announced string
     */
    announceContainer?: HTMLElement;

    /**
     * added and removed block elements when initialize
     */
    domModification?: DomModification;

    /**
     * A callback to help get string template to announce, used for accessibility
     * @param key The key of known announce data
     * @returns A template string to announce, use placeholder such as "{0}" for variables if necessary
     */
    readonly announcerStringGetter?: (key: KnownAnnounceStrings) => string;

    /**
     * Style elements used for adding CSS rules for editor
     */
    readonly styleElements: Record<string, HTMLStyleElement>;
}
