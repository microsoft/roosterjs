import BasePluginEvent from './BasePluginEvent';
import ContentChangedData from '../interface/ContentChangedData';
import { ChangeSource } from '../enum/ChangeSource';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatibleChangeSource } from '../compatibleEnum/ChangeSource';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of ContentChangedEvent
 */
export interface ContentChangedEventData {
    /**
     * Source of the change
     */
    source: ChangeSource | CompatibleChangeSource | string;

    /**
     * Optional related data
     */
    data?: any;

    /*
     * Additional Data Related to the ContentChanged Event
     */
    additionalData?: ContentChangedData;
}

/**
 * Represents a change to the editor made by another plugin
 */
export default interface ContentChangedEvent
    extends ContentChangedEventData,
        BasePluginEvent<PluginEventType.ContentChanged> {}

/**
 * Represents a change to the editor made by another plugin
 */
export interface CompatibleContentChangedEvent
    extends ContentChangedEventData,
        BasePluginEvent<CompatiblePluginEventType.ContentChanged> {}
