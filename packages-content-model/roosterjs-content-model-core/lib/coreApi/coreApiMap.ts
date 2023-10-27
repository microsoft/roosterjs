import { createContentModel } from './createContentModel';
import { createEditorContext } from './createEditorContext';
import { getDOMSelection } from './getDOMSelection';
import { setContentModel } from './setContentModel';
import { setDOMSelection } from './setDOMSelection';
import { switchShadowEdit } from './switchShadowEdit';
import { triggerEvent } from './triggerEvent';
import type { CoreApiMap } from '../publicTypes/coreApi/CoreApiMap';

/**
 * @internal
 */
export const coreApiMap: CoreApiMap = {
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    getDOMSelection: getDOMSelection,
    setContentModel: setContentModel,
    setDOMSelection: setDOMSelection,
    switchShadowEdit: switchShadowEdit,
    triggerEvent: triggerEvent,
};
