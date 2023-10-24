import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';
import type { ContentModelDocument, DOMSelection } from 'roosterjs-content-model-types';

/**
 * Possible change sources. Here are the predefined sources.
 * It can also be other string if the change source can't fall into these sources.
 */
export enum ChangeSource {
    /**
     * Content changed by auto link
     */
    AutoLink = 'AutoLink',
    /**
     * Content changed by create link
     */
    CreateLink = 'CreateLink',
    /**
     * Content changed by format
     */
    Format = 'Format',
    /**
     * Content changed by image resize
     */
    ImageResize = 'ImageResize',
    /**
     * Content changed by paste
     */
    Paste = 'Paste',
    /**
     * Content changed by setContent API
     */
    SetContent = 'SetContent',
    /**
     * Content changed by cut operation
     */
    Cut = 'Cut',
    /**
     * Content changed by drag & drop operation
     */
    Drop = 'Drop',
    /**
     * Insert a new entity into editor
     */
    InsertEntity = 'InsertEntity',
    /**
     * Editor is switched to dark mode, content color is changed
     */
    SwitchToDarkMode = 'SwitchToDarkMode',
    /**
     * Editor is switched to light mode, content color is changed
     */
    SwitchToLightMode = 'SwitchToLightMode',
    /**
     * List chain reorganized numbers of lists
     */
    ListChain = 'ListChain',
    /**
     * Keyboard event, used by Content Model.
     * Data of this event will be the key code number
     */
    Keyboard = 'Keyboard',
}

/**
 * State for an entity. This is used for storing entity undo snapshot
 */
export interface EntityState {
    /**
     * Type of the entity
     */
    type: string;

    /**
     * Id of the entity
     */
    id: string;

    /**
     * The state of this entity to store into undo snapshot.
     * The state can be any string, or a serialized JSON object.
     * We are using string here instead of a JSON object to make sure the whole state is serializable.
     */
    state: string;
}

/**
 * Known announce strings
 */
export type KnownAnnounceStrings =
    /**
     * String announced for a list item in a OL List
     * @example
     * Auto corrected, &lcub;0&rcub;
     * Where &lcub0&rcub is the new list item bullet
     */
    | 'announceListItemNumbering'
    /**
     * String announced for a list item in a UL List
     * @example
     * Auto corrected bullet
     */
    | 'announceListItemBullet'
    /**
     * String announced when cursor is moved to the last cell in a table
     */
    | 'announceOnFocusLastCell';

/**
 * Represents data, that can be used to announce text to screen reader.
 */
export interface AnnounceData {
    /**
     * @optional Default announce strings built in Rooster
     */
    defaultStrings?: KnownAnnounceStrings;

    /**
     * @optional string to announce from this Content Changed event, will be the fallback value if default string
     * is not provided or if it is not found in the strings map.
     */
    text?: string;

    /**
     * @optional if provided, will attempt to replace {n} with each of the values inside of the array.
     */
    formatStrings?: string[];
}

/**
 * Property that is going to store additional data related to the Content Changed Event
 */
export interface ContentChangedData {
    /**
     * Optional property to store the format api name when using ChangeSource.Format
     */
    formatApiName?: string;

    /**
     * @optional Get entity states related to the snapshot. If it returns entity states, each state will cause
     * an EntityOperation event with operation = EntityOperation.UpdateEntityState when undo/redo to this snapshot
     * @returns Related entity state array
     */
    getEntityState?: () => EntityState[];

    /**
     * @optional
     * Get Announce data from this content changed event.
     * @returns
     */
    getAnnounceData?: () => AnnounceData | undefined;

    /**
     * Optional related data
     */
    additionalData?: any;
}

/**
 * Represents a change to the editor made by another plugin with content model inside
 */
export interface ContentModelContentChangedEvent
    extends ContentModelBasePluginEvent<'contentChanged'> {
    /**
     * Source of the change
     */
    source: ChangeSource | string;

    /*
     * Additional Data Related to the ContentChanged Event
     */
    changeData: ContentChangedData;

    /**
     * The content model that is applied which causes this content changed event
     */
    contentModel: ContentModelDocument;

    /**
     * Selection range applied to the document
     */
    selection?: DOMSelection;
}
