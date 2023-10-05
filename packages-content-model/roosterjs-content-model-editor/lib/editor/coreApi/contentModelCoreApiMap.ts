import { ContentModelCoreApiMap } from 'roosterjs-content-model/lib';
import { createContentModel } from './createContentModel';
import { createEditorContext } from './createEditorContext';
import { getDOMSelection } from './getDOMSelection';
import { setContentModel } from './setContentModel';
import { setDOMSelection } from './setDOMSelection';
import { switchShadowEdit } from './switchShadowEdit';

/**
 * @internal
 */
export const contentModelCoreApiMap: ContentModelCoreApiMap = {
    createEditorContext,
    createContentModel,
    getDOMSelection,
    setContentModel,
    setDOMSelection,
    addUndoSnapshot,
    attachDomEvent,
    restoreUndoSnapshot,
    switchShadowEdit,
    triggerEvent,
};
