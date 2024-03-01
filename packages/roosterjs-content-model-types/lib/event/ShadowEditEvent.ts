import type { BasePluginEvent } from './BasePluginEvent';

/**
 * A plugin triggered right after editor has entered Shadow Edit mode
 */
export interface EnterShadowEditEvent extends BasePluginEvent<'enteredShadowEdit'> {}

/**
 * A plugin triggered right before editor leave Shadow Edit mode
 */
export interface LeaveShadowEditEvent extends BasePluginEvent<'leavingShadowEdit'> {}
