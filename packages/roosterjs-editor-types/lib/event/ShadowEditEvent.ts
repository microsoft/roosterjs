import BasePluginEvent from './BasePluginEvent';
import SelectionPath from '../interface/SelectionPath';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of EnterShadowEditEvent
 */
export interface EnterShadowEditEventData {
    /**
     * The document fragment of original editor content
     */
    fragment: DocumentFragment;

    /**
     * The selection path of original editor content
     */
    selectionPath: SelectionPath | null;
}

/**
 * A plugin triggered right after editor has entered Shadow Edit mode
 */
export interface EnterShadowEditEvent
    extends EnterShadowEditEventData,
        BasePluginEvent<PluginEventType.EnteredShadowEdit> {}

/**
 * A plugin triggered right before editor leave Shadow Edit mode
 */
export interface LeaveShadowEditEvent extends BasePluginEvent<PluginEventType.LeavingShadowEdit> {}

/**
 * A plugin triggered right after editor has entered Shadow Edit mode
 */
export interface CompatibleEnterShadowEditEvent
    extends EnterShadowEditEventData,
        BasePluginEvent<CompatiblePluginEventType.EnteredShadowEdit> {}

/**
 * A plugin triggered right before editor leave Shadow Edit mode
 */
export interface CompatibleLeaveShadowEditEvent
    extends BasePluginEvent<CompatiblePluginEventType.LeavingShadowEdit> {}
