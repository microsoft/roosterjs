import type { StandaloneEditorOptions } from 'roosterjs-content-model-types';
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
     * Specify the enabled experimental features
     */
    experimentalFeatures?: ExperimentalFeatures[];

    /**
     * Legacy plugins using IEditor interface
     */
    legacyPlugins?: EditorPlugin[];
}
