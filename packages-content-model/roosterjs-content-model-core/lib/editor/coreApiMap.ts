import { ContentModelCoreApiMap } from '../publicTypes/coreApi/ContentModelCoreApiMap';
import { createContentModel } from '../coreApi/createContentModel';
import { createEditorContext } from '../coreApi/createEditorContext';
import { getDOMSelection } from '../coreApi/getDOMSelection';
import { setContentModel } from '../coreApi/setContentModel';
import { setDOMSelection } from '../coreApi/setDOMSelection';
import { switchShadowEdit } from '../coreApi/switchShadowEdit';

/**
 * @internal
 */
export const coreApiMap: ContentModelCoreApiMap = {
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    getDOMSelection: getDOMSelection,
    setContentModel: setContentModel,
    setDOMSelection: setDOMSelection,
    switchShadowEdit: switchShadowEdit,
};
