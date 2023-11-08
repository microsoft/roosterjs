import type { CoreApiMap, EditorCore } from 'roosterjs-editor-types';
import type { StandaloneCoreApiMap, StandaloneEditorCore } from 'roosterjs-content-model-types';

/**
 * The interface for the map of core API for Content Model editor.
 * Editor can call call API from this map under ContentModelEditorCore object
 */
export interface ContentModelCoreApiMap extends CoreApiMap, StandaloneCoreApiMap {}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore extends EditorCore, StandaloneEditorCore {
    /**
     * Core API map of this editor
     */
    readonly api: ContentModelCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: ContentModelCoreApiMap;
}
