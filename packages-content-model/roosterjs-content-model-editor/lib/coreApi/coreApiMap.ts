import { addUndoSnapshot } from './addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent';
import { focus } from './focus';
import { getContent } from './getContent';
import { getStyleBasedFormatState } from './getStyleBasedFormatState';
import { hasFocus } from './hasFocus';
import { insertNode } from './insertNode';
import { restoreUndoSnapshot } from './restoreUndoSnapshot';
import { setContent } from './setContent';
import { transformColor } from './transformColor';
import { triggerEvent } from './triggerEvent';
import type { UnportedCoreApiMap } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const coreApiMap: UnportedCoreApiMap = {
    attachDomEvent,
    addUndoSnapshot,
    focus,
    getContent,
    getStyleBasedFormatState,
    hasFocus,
    insertNode,
    restoreUndoSnapshot,
    setContent,
    transformColor,
    triggerEvent,
};
