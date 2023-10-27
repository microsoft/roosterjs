import type { BasePluginEvent } from './BasePluginEvent';
import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * A plugin triggered right after editor has entered Shadow Edit mode
 */
export interface EnteredShadowEditEvent extends BasePluginEvent<'enteredShadowEdit'> {
    /**
     * Cached content model before entering shadow edit
     */
    cachedModel: ContentModelDocument;
}

/**
 * A plugin triggered right before editor leave Shadow Edit mode
 */
export interface LeavingShadowEditEvent extends BasePluginEvent<'leavingShadowEdit'> {}
