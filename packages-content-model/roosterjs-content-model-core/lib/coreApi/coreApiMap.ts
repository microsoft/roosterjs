import { createContentModel } from './createContentModel';
import { createEditorContext } from './createEditorContext';
import { getDOMSelection } from './getDOMSelection';
import { setContentModel } from './setContentModel';
import { setDOMSelection } from './setDOMSelection';
import { switchShadowEdit } from './switchShadowEdit';
import type { ContentModelCoreApiMap } from '../publicTypes/coreApi/ContentModelCoreApiMap';

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
