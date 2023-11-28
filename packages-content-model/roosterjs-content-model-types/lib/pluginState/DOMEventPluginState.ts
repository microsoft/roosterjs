import type { DOMSelection } from '../selection/DOMSelection';
import type { ContextMenuProvider } from 'roosterjs-editor-types';

/**
 * The state object for DOMEventPlugin
 */
export interface DOMEventPluginState {
    /**
     * Whether editor is in IME input sequence
     */
    isInIME: boolean;

    /**
     * Scroll container of editor
     */
    scrollContainer: HTMLElement;

    /**
     * Cached selection range
     */
    selection: DOMSelection | null;

    /**
     * Context menu providers, that can provide context menu items
     */
    contextMenuProviders: ContextMenuProvider<any>[];

    /**
     * When set to true, onFocus event will not trigger reselect cached range
     */
    skipReselectOnFocus?: boolean;

    /**
     * Whether mouse up event handler is added
     */
    mouseUpEventListerAdded: boolean;

    /**
     * X-coordinate when mouse down happens
     */
    mouseDownX: number | null;

    /**
     * X-coordinate when mouse down happens
     */
    mouseDownY: number | null;
}
