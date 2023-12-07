import { addUndoSnapshot } from './addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent';
import { ensureTypeInContainer } from './ensureTypeInContainer';
import { getContent } from './getContent';
import { getStyleBasedFormatState } from './getStyleBasedFormatState';
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
    ensureTypeInContainer,
    getContent,
    getStyleBasedFormatState,
    insertNode,
    restoreUndoSnapshot,
    setContent,
    transformColor,
    triggerEvent,
};
