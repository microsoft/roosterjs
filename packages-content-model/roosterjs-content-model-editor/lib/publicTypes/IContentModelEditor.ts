import type { ContentModelCorePlugins } from './ContentModelCorePlugins';
import type { ContentModelCoreApiMap } from './ContentModelEditorCore';
import type { EditorPlugin, ExperimentalFeatures, IEditor } from 'roosterjs-editor-types';
import type { StandaloneEditorOptions, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * An interface of editor with Content Model support.
 * (This interface is still under development, and may still be changed in the future with some breaking changes)
 */
export interface IContentModelEditor extends IEditor, IStandaloneEditor {}

/**
 * Options for Content Model editor
 */
export interface ContentModelEditorOptions extends StandaloneEditorOptions {
    /**
     * Initial HTML content
     * Default value is whatever already inside the editor content DIV
     */
    initialContent?: string;

    /**
     * A plugin map to override default core Plugin implementation
     * Default value is null
     */
    corePluginOverride?: Partial<ContentModelCorePlugins>;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    legacyCoreApiOverride?: Partial<ContentModelCoreApiMap>;

    /**
     * Specify the enabled experimental features
     */
    experimentalFeatures?: ExperimentalFeatures[];
    /**
     * Legacy plugins using IEditor interface
     */
    legacyPlugins?: EditorPlugin[];
}
