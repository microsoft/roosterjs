import type { EditorOptions } from 'roosterjs-content-model-types';
import type { EditorPlugin } from 'roosterjs-editor-types';

/**
 * Options for editor adapter
 */
export interface EditorAdapterOptions extends EditorOptions {
    /**
     * Initial HTML content
     * Default value is whatever already inside the editor content DIV
     */
    initialContent?: string;

    /**
     * Specify the enabled experimental features
     */
    experimentalFeatures?: string[];

    /**
     * Legacy plugins using IEditor interface
     */
    legacyPlugins?: EditorPlugin[];
}
