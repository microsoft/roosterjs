import { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';

/**
 * A plugin triggered right after editor has entered Shadow Edit mode
 */
export interface ContentModelEnterShadowEditEvent
    extends ContentModelBasePluginEvent<'enteredShadowEdit'> {}

/**
 * A plugin triggered right before editor leave Shadow Edit mode
 */
export interface ContentModelLeaveShadowEditEvent
    extends ContentModelBasePluginEvent<'leavingShadowEdit'> {}
