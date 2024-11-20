import type { DomModification } from '../context/DomModification';
import type { BasePluginEvent } from './BasePluginEvent';

/**
 * The event triggered when Content Model modifies editor DOM tree, provides added and removed block level elements
 */
export interface DomModificationEvent extends DomModification, BasePluginEvent<'domModification'> {}
