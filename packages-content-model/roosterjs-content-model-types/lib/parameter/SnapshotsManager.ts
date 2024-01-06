import type { ColorPair, Snapshot } from './Snapshot';

/**
 * A util function type to transform light mode color to dark mode color
 * Default value is to return the original light color
 * @param lightColor Source color string in light mode
 * @param baseLValue Base value of light used for dark value calculation
 * @param colorType @optional Type of color, can be text, background, or border
 * @param element @optional Source HTML element of the color
 */
export type ColorTransformFunction = (
    lightColor: string,
    baseLValue?: number,
    colorType?: 'text' | 'background' | 'border',
    element?: HTMLElement
) => string;

/**
 * Represent an interface to provide functionalities to manager undo snapshots
 */
export interface SnapshotsManager {
    /**
     * Whether there is now content changed after last snapshot was taken
     */
    hasNewContent: boolean;

    /**
     * Check whether can move current undo snapshot with the given step
     * @param step The step to check, can be positive, negative or 0
     * @returns True if can move current snapshot with the given step, otherwise false
     */
    canMove(step: number): boolean;

    /**
     * Move current snapshot with the given step if can move this step. Otherwise no action and return null
     * @param step The step to move
     * @returns If can move with the given step, returns the snapshot after move, otherwise null
     */
    move(step: number): Snapshot | null;

    /**
     * Add a new undo snapshot
     * @param snapshot The snapshot to add
     */
    addSnapshot(snapshot: Snapshot, isAutoCompleteSnapshot: boolean): void;

    /**
     * Clear all undo snapshots after the current one
     */
    clearRedo(): void;

    /**
     * Whether there is a snapshot added before auto complete and it can be undone now
     */
    canUndoAutoComplete(): boolean;

    /**
     * Get the map of known colors
     */
    getKnownColors(): Record<string, ColorPair>;

    /**
     * Update all known colors to root container.
     * @param isDarkMode Whether container is in dark mode. When in dark mode, we add CSS color variables for all known colors.
     * When in light mode, we will remove all those CSS color variables
     */
    updateKnownColor(isDarkMode: boolean): void;

    /**
     * Register a known color, and update it to root container via CSS color variable when in dark mode
     * @param isDarkMode Whether container is in dark mode.
     * @param key The key of color, normally it is the name of color variable
     * @param colorPair A pair value of light color and dark color
     */
    updateKnownColor(isDarkMode: boolean, key: string, colorPair: ColorPair): void;

    /**
     * A util function to transform light mode color to dark mode color
     */
    getDarkColor: ColorTransformFunction;
}
