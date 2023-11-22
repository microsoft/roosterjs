import { createContentModel } from '../coreApi/createContentModel';
import { createEditorContext } from '../coreApi/createEditorContext';
import { formatContentModel } from '../coreApi/formatContentModel';
import { getDOMSelection } from '../coreApi/getDOMSelection';
import { getVisibleViewport } from '../coreApi/getVisibleViewport';
import { setContentModel } from '../coreApi/setContentModel';
import { setDOMSelection } from '../coreApi/setDOMSelection';
import { switchShadowEdit } from '../coreApi/switchShadowEdit';
import type { PortedCoreApiMap } from 'roosterjs-content-model-types';

/**
 * @internal
 * Core API map for Standalone Content Model Editor
 */
export const standaloneCoreApiMap: PortedCoreApiMap = {
    createContentModel: createContentModel,
    createEditorContext: createEditorContext,
    formatContentModel: formatContentModel,
    getDOMSelection: getDOMSelection,
    setContentModel: setContentModel,
    setDOMSelection: setDOMSelection,
    switchShadowEdit: switchShadowEdit,
    getVisibleViewport: getVisibleViewport,
};
