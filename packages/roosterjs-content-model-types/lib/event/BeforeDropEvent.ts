import type { BasePluginDomEvent } from './BasePluginEvent';

/**
 * Data of BeforeDropEvent
 */
export interface BeforeDropEvent extends BasePluginDomEvent<'beforeDrop', DragEvent> {}
