import { addUndoSnapshot } from './addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent';
import { ensureTypeInContainer } from './ensureTypeInContainer';
import { focus } from './focus';
import { getContent } from './getContent';
import { getSelectionRange } from './getSelectionRange';
import { getSelectionRangeEx } from './getSelectionRangeEx';
import { getStyleBasedFormatState } from './getStyleBasedFormatState';
import { hasFocus } from './hasFocus';
import { insertNode } from './insertNode';
import { restoreUndoSnapshot } from './restoreUndoSnapshot';
import { select } from './select';
import { selectImage } from './selectImage';
import { selectRange } from './selectRange';
import { selectTable } from './selectTable';
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
    focus,
    getContent,
    getSelectionRange,
    getSelectionRangeEx,
    getStyleBasedFormatState,
    hasFocus,
    insertNode,
    restoreUndoSnapshot,
    select,
    selectRange,
    setContent,
    transformColor,
    triggerEvent,
    selectTable,
    selectImage,
};
