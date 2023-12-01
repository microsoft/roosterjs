import type { CompatibleExperimentalFeatures } from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    CustomData,
    EditorPlugin,
    ExperimentalFeatures,
    SizeTransformer,
} from 'roosterjs-editor-types';
import type { StandaloneCoreApiMap, StandaloneEditorCore } from 'roosterjs-content-model-types';

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore extends StandaloneEditorCore {
    /**
     * Core API map of this editor
     */
    readonly api: StandaloneCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: StandaloneCoreApiMap;

    /*
     * Current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale: number;

    /**
     * @deprecated Use zoomScale instead
     */
    sizeTransformer: SizeTransformer;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void;

    /**
     * Custom data of this editor
     */
    customData: Record<string, CustomData>;

    /**
     * Enabled experimental features
     */
    experimentalFeatures: (ExperimentalFeatures | CompatibleExperimentalFeatures)[];
}
