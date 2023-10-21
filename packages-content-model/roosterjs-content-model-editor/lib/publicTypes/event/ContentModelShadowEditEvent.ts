import BasePluginEvent from './BasePluginEvent';
import { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * A plugin triggered right after editor has entered Shadow Edit mode
 */
export interface ContentModelEnteredShadowEditEvent extends BasePluginEvent<'enteredShadowEdit'> {
    /**
     * Cached content model before entering shadow edit
     */
    cachedModel: ContentModelDocument;
}

/**
 * A plugin triggered right before editor leave Shadow Edit mode
 */
export interface ContentModelLeavingShadowEditEvent extends BasePluginEvent<'leavingShadowEdit'> {}
