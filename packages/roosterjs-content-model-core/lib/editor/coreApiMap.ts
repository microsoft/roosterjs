import type { CoreApiMap } from 'roosterjs-content-model-types';
import { addUndoSnapshot } from '../coreApi/addUndoSnapshot';
import { attachDomEvent } from '../coreApi/attachDomEvent';
import { createContentModel } from '../coreApi/createContentModel';
import { createEditorContext } from '../coreApi/createEditorContext';
import { focus } from '../coreApi/focus';
import { formatContentModel } from '../coreApi/formatContentModel';
import { getDOMSelection } from '../coreApi/getDOMSelection';
import { getVisibleViewport } from '../coreApi/getVisibleViewport';
import { restoreUndoSnapshot } from '../coreApi/restoreUndoSnapshot';
import { setContentModel } from '../coreApi/setContentModel';
import { setDOMSelection } from '../coreApi/setDOMSelection';
import { setEditorStyle } from '../coreApi/setEditorStyle/setEditorStyle';
import { setLogicalRoot } from '../coreApi/setLogicalRoot';
import { switchShadowEdit } from '../coreApi/switchShadowEdit';
import { triggerEvent } from '../coreApi/triggerEvent';

/**
 * @internal
 * Core API map for Editor
 */
export const coreApiMap: CoreApiMap = {
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    formatContentModel: formatContentModel,
    setContentModel: setContentModel,
    setLogicalRoot: setLogicalRoot,

    getDOMSelection: getDOMSelection,
    setDOMSelection: setDOMSelection,
    focus: focus,

    addUndoSnapshot: addUndoSnapshot,
    restoreUndoSnapshot: restoreUndoSnapshot,

    attachDomEvent: attachDomEvent,
    triggerEvent: triggerEvent,

    switchShadowEdit: switchShadowEdit,
    getVisibleViewport: getVisibleViewport,
    setEditorStyle: setEditorStyle,
};
