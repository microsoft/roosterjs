import { addUndoSnapshot } from '../coreApi/addUndoSnapshot';
import { attachDomEvent } from '../coreApi/attachDomEvent';
import { createContentModel } from '../coreApi/createContentModel';
import { createEditorContext } from '../coreApi/createEditorContext';
import { focus } from '../coreApi/focus';
import { formatContentModel } from '../coreApi/formatContentModel';
import { getDOMSelection } from '../coreApi/getDOMSelection';
import { getVisibleViewport } from '../coreApi/getVisibleViewport';
import { hasFocus } from '../coreApi/hasFocus';
import { paste } from '../coreApi/paste';
import { restoreUndoSnapshot } from '../coreApi/restoreUndoSnapshot';
import { setContentModel } from '../coreApi/setContentModel';
import { setDOMSelection } from '../coreApi/setDOMSelection';
import { setLogicalRoot } from '../coreApi/setLogicalRoot';
import { switchShadowEdit } from '../coreApi/switchShadowEdit';
import { triggerEvent } from '../coreApi/triggerEvent';
import type { CoreApiMap } from 'roosterjs-content-model-types';

/**
 * @internal
 * Core API map for Editor
 */
export const coreApiMap: CoreApiMap = {
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    formatContentModel: formatContentModel,
    getDOMSelection: getDOMSelection,
    setContentModel: setContentModel,
    setDOMSelection: setDOMSelection,
    setLogicalRoot: setLogicalRoot,
    switchShadowEdit: switchShadowEdit,
    getVisibleViewport: getVisibleViewport,
    focus: focus,
    hasFocus: hasFocus,
    addUndoSnapshot: addUndoSnapshot,
    restoreUndoSnapshot: restoreUndoSnapshot,
    attachDomEvent: attachDomEvent,
    triggerEvent: triggerEvent,
    paste: paste,
};
