import { ContentModelCoreApiMap } from '../publicTypes/coreApi/ContentModelCoreApiMap';
import { createContentModel } from './createContentModel';
import { createEditorContext } from './createEditorContext';
import { getDOMSelection } from './getDOMSelection';
import { setContentModel } from './setContentModel';
import { setDOMSelection } from './setDOMSelection';
import { switchShadowEdit } from './switchShadowEdit';

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
