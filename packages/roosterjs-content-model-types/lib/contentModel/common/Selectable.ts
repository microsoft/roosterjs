import type { MutableMark, ReadonlyMark, ShallowMutableMark } from '../common/MutableMark';

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

/**
 * Represents a selectable Content Model object (Shallow mutable)
 */
export interface ShallowMutableSelectable extends ShallowMutableMark {
    /**
     * Whether this model object is selected
     */
    isSelected?: boolean;
}
