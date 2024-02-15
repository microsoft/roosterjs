import type { StandaloneEditorOptions } from 'roosterjs-content-model-types';
import type { EditorAdapterCoreApiMap } from './EditorAdapterCore';
import type { EditorPlugin, ExperimentalFeatures } from 'roosterjs-editor-types';

/**
 * Options for editor adapter
 */
export interface EditorAdapterOptions extends StandaloneEditorOptions {
    /**
     * Initial HTML content
     * Default value is whatever already inside the editor content DIV
     */
    initialContent?: string;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    legacyCoreApiOverride?: Partial<EditorAdapterCoreApiMap>;

    /**
     * Specify the enabled experimental features
     */
    experimentalFeatures?: ExperimentalFeatures[];

    /**
     * Legacy plugins using IEditor interface
     */
    legacyPlugins?: EditorPlugin[];
}
