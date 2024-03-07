import { addUndoSnapshot } from './addUndoSnapshot/addUndoSnapshot';
import { attachDomEvent } from './attachDomEvent';
import { createContentModel } from './createContentModel';
import { createEditorContext } from './createEditorContext';
import { focus } from './focus';
import { formatContentModel } from './formatContentModel';
import { getDOMSelection } from './getDOMSelection';
import { getVisibleViewport } from './getVisibleViewport';
import { restoreUndoSnapshot } from './restoreUndoSnapshot';
import { setContentModel } from './setContentModel';
import { setDOMSelection } from './setDOMSelection';
import { switchShadowEdit } from './switchShadowEdit';
import { triggerEvent } from './triggerEvent';
import type { CoreApiMap } from 'roosterjs-content-model-types';

/**
 * @internal
 * Core API map for Editor
 */
export const coreApiMap: CoreApiMap = {
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    formatContentModel: formatContentModel,
    setContentModel: setContentModel,

    getDOMSelection: getDOMSelection,
    setDOMSelection: setDOMSelection,
    focus: focus,

    addUndoSnapshot: addUndoSnapshot,
    restoreUndoSnapshot: restoreUndoSnapshot,

    attachDomEvent: attachDomEvent,
    triggerEvent: triggerEvent,

    switchShadowEdit: switchShadowEdit,
    getVisibleViewport: getVisibleViewport,
};
