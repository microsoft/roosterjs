import type { RewriteFromModel } from '../context/RewriteFromModel';
import type { BasePluginEvent } from './BasePluginEvent';

/**
 * The event triggered when Content Model modifies editor DOM tree, provides added and removed block level elements
 */
export interface RewriteFromModelEvent
    extends RewriteFromModel,
        BasePluginEvent<'rewriteFromModel'> {}
