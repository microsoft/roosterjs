import type { CoreEditorCore } from '../editor/CoreEditorCore';
import type {
    ContentModelDocument,
    DOMSelection,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Set content with content model. This is the replacement of core API getSelectionRangeEx
 * @param core The CoreEditorCore object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
 */
export type SetContentModel = (
    core: CoreEditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption,
    onNodeCreated?: OnNodeCreated
) => DOMSelection | null;
