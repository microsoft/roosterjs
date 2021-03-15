import { addUndoSnapshot } from './addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent';
import { CoreApiMap } from 'roosterjs-editor-types';
import { createPasteFragment } from './createPasteFragment';
import { ensureTypeInContainer } from './ensureTypeInContainer';
import { focus } from './focus';
import { getContent } from './getContent';
import { getSelectionRange } from './getSelectionRange';
import { getStyleBasedFormatState } from './getStyleBasedFormatState';
import { hasFocus } from './hasFocus';
import { insertNode } from './insertNode';
import { restoreUndoSnapshot } from './restoreUndoSnapshot';
import { selectRange } from './selectRange';
import { setContent } from './setContent';
import { switchShadowEdit } from './switchShadowEdit';
import { transformColor } from './transformColor';
import { triggerEvent } from './triggerEvent';

/**
 * @internal
 */
export const coreApiMap: CoreApiMap = {
    attachDomEvent,
    addUndoSnapshot,
    createPasteFragment,
    ensureTypeInContainer,
    focus,
    getContent,
    getSelectionRange,
    getStyleBasedFormatState,
    hasFocus,
    insertNode,
    restoreUndoSnapshot,
    selectRange,
    setContent,
    switchShadowEdit,
    transformColor,
    triggerEvent,
};
