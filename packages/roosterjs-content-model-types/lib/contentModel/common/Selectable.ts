import type { MutableMark } from './MutableMark';
import type { ReadonlyMark } from './ReadonlyMark';

/**
 * Represents a selectable Content Model object
 */
export interface Selectable extends MutableMark {
    /**
     * Whether this model object is selected
     */
    isSelected?: boolean;
}

/**
 * Represents a selectable Content Model object (Readonly)
 */
export interface ReadonlySelectable extends ReadonlyMark {
    /**
     * Whether this model object is selected
     */
    readonly isSelected?: boolean;
}
