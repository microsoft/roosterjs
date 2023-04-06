import { addUndoSnapshot } from './addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent';
import { CoreApiMap } from 'roosterjs-editor-types';
import { createPasteFragment } from './createPasteFragment';
import { ensureTypeInContainer } from './ensureTypeInContainer';
import { focus } from './focus';
import { getContent } from './getContent';
import { getPendableFormatState } from './getPendableFormatState';
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
    getSelectionRangeEx,
    getStyleBasedFormatState,
    getPendableFormatState,
    hasFocus,
    insertNode,
    restoreUndoSnapshot,
    select,
    selectRange,
    setContent,
    switchShadowEdit,
    transformColor,
    triggerEvent,
    selectTable,
    selectImage,
};
