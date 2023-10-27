import type { EditorCore } from '../editor/EditorCore';
import type {
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
} from 'roosterjs-content-model-types';

/**
 * Create Content Model from DOM tree in this editor
 * @param core The EditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export type CreateContentModel = (
    core: EditorCore,
    option?: DomToModelOption,
    selectionOverride?: DOMSelection
) => ContentModelDocument;
