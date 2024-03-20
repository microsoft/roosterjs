import type { CoreApiMap } from 'roosterjs-content-model-types';
import { addUndoSnapshot } from './addUndoSnapshot/addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent/attachDomEvent';
import { createContentModel } from './createContentModel/createContentModel';
import { createEditorContext } from './createEditorContext/createEditorContext';
import { focus } from './focus/focus';
import { formatContentModel } from './formatContentModel/formatContentModel';
import { getDOMSelection } from './getDOMSelection/getDOMSelection';
import { getVisibleViewport } from './getVisibleViewport/getVisibleViewport';
import { restoreUndoSnapshot } from './restoreUndoSnapshot/restoreUndoSnapshot';
import { setContentModel } from './setContentModel/setContentModel';
import { setDOMSelection } from './setDOMSelection/setDOMSelection';
import { setEditorStyle } from './setEditorStyle/setEditorStyle';
import { setLogicalRoot } from './setLogicalRoot/setLogicalRoot';
import { switchShadowEdit } from './switchShadowEdit/switchShadowEdit';
import { triggerEvent } from './triggerEvent/triggerEvent';

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
