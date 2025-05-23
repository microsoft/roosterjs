import type { BasePluginEvent } from './BasePluginEvent';
import type { EntityOperation } from '../enum/EntityOperation';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { ModelToDomOption } from '../context/ModelToDomOption';

/**
 * Represents an entity in editor.
 */
export interface Entity {
    /**
     * Type of this entity. Specified when insert an entity, can be an valid CSS class-like string.
     */
    type: string;
    /**
     * Id of this entity, generated by editor code and will be unique within an editor
     */
    id: string;
    /**
     * The wrapper DOM node of this entity which holds the info CSS classes of this entity
     */
    wrapper: HTMLElement;
    /**
     * Whether this is a readonly entity
     */
    isReadonly: boolean;
}

/**
 * Represent a combination of a root element under an entity and options to do DOM and content model conversion
 */
export interface FormattableRoot {
    /**
     * The root element to apply format under an entity
     */
    element: HTMLElement;

    /**
     * @optional DOM to Content Model option
     */
    domToModelOptions?: DomToModelOption;

    /**
     * @optional Content Model to DOM option
     */
    modelToDomOptions?: ModelToDomOption;
}

/**
 * Provide a chance for plugins to handle entity related events.
 * See type EntityOperation for more details about each operation
 */
export interface EntityOperationEvent extends BasePluginEvent<'entityOperation'> {
    /**
     * Operation to this entity
     */
    operation: EntityOperation;

    /**
     * The entity that editor is operating on
     */
    entity: Entity;

    /**
     * Optional raw event. Need to do null check before use its value
     */
    rawEvent?: Event;

    /**
     * For entity operation "updateEntityState", we use this object to pass the new entity state to plugin.
     * For other operation types, it is not used.
     */
    state?: string;

    /**
     * For entity operation "newEntity", plugin can set this property to true then the entity will be persisted.
     * A persisted entity won't be touched during undo/redo, unless it does not exist after undo/redo.
     * For other operation types, this value will be ignored.
     */
    shouldPersist?: boolean;

    /**
     * For entity operation "beforeFormat" (happens when user wants to do format change), we will set this array
     * in event and plugins can check if there is any elements inside the entity that should also apply the format
     */
    formattableRoots?: FormattableRoot[];
}
