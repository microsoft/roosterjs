import type { Mutable } from './Mutable';

/**
 * Represents a selectable Content Model object
 */
export interface Selectable extends Mutable {
    /**
     * Whether this model object is selected
     */
    isSelected?: boolean;
}

/**
 * Represents a selectable Content Model object (Readonly)
 */
export interface ReadonlySelectable {
    /**
     * Whether this model object is selected
     */
    readonly isSelected?: boolean;
}
