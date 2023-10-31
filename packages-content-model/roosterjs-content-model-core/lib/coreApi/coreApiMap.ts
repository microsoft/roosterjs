import { addUndoSnapshot } from './addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent';
import { createContentModel } from './createContentModel';
import { createEditorContext } from './createEditorContext';
import { focus } from './focus';
import { getDOMSelection } from './getDOMSelection';
import { hasFocus } from './hasFocus';
import { restoreUndoSnapshot } from './restoreUndoSnapshot';
import { setContentModel } from './setContentModel';
import { setDOMSelection } from './setDOMSelection';
import { switchShadowEdit } from './switchShadowEdit';
import { transformColor } from './transformColor';
import { triggerEvent } from './triggerEvent';
import type { CoreEditorApiMap } from '../publicTypes/editor/CoreEditorApiMap';

/**
 * @internal
 */
export const coreApiMap: CoreEditorApiMap = {
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    getDOMSelection: getDOMSelection,
    setContentModel: setContentModel,
    setDOMSelection: setDOMSelection,
    switchShadowEdit: switchShadowEdit,
    triggerEvent: triggerEvent,
    addUndoSnapshot: addUndoSnapshot,
    attachDomEvent: attachDomEvent,
    focus: focus,
    hasFocus: hasFocus,
    restoreUndoSnapshot: restoreUndoSnapshot,
    transformColor: transformColor,
};
