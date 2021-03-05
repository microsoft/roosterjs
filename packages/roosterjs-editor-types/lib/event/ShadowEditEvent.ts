import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';
import { SelectionPath } from '..';

/**
 * A plugin triggered right after editor has entered Shadow Edit mode
 */
export interface EnterShadowEditEvent extends BasePluginEvent<PluginEventType.EnteredShadowEdit> {
    /**
     * The document fragment of original editor content
     */
    fragment: DocumentFragment;

    /**
     * The selection path of original editor content
     */
    selectionPath: SelectionPath;
}

/**
 * A plugin triggered right before editor leave Shadow Edit mode
 */
export interface LeaveShadowEditEvent extends BasePluginEvent<PluginEventType.LeavingShadowEdit> {}
