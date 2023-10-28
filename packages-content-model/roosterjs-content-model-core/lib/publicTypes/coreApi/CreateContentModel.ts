import type { CoreEditorCore } from '../editor/CoreEditorCore';
import type {
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param core The CoreEditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export type CreateContentModel = (
    core: CoreEditorCore,
    option?: DomToModelOption,
    selectionOverride?: DOMSelection
) => ContentModelDocument;
