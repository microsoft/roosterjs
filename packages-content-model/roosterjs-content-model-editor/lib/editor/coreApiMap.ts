import { ContentModelCoreApiMap } from '../publicTypes/ContentModelEditorCore';
import { createContentModel } from './coreApi/createContentModel';
import { createEditorContext } from './coreApi/createEditorContext';
import { getDOMSelection } from './coreApi/getDOMSelection';
import { setContentModel } from './coreApi/setContentModel';
import { setDOMSelection } from './coreApi/setDOMSelection';
import { switchShadowEdit } from './coreApi/switchShadowEdit';

/**
 * @internal
 */
export const coreApiMap: ContentModelCoreApiMap = {
    addUndoSnapshot: null!,
    attachDomEvent: null!,
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    focus: null!,
    getDOMSelection: getDOMSelection,
    hasFocus: null!,
    restoreUndoSnapshot: null!,
    setContentModel: setContentModel,
    setDOMSelection: setDOMSelection,
    switchShadowEdit: switchShadowEdit,
    triggerEvent: null!,
};
