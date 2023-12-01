import type { ContentModelCorePlugins } from './ContentModelCorePlugins';
import type {
    EditorPlugin,
    ExperimentalFeatures,
    IEditor,
    Snapshot,
    UndoSnapshotsService,
} from 'roosterjs-editor-types';
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
     * Undo snapshot service based on content metadata. Use this parameter to customize the undo snapshot service.
     * When this property is set, value of undoSnapshotService will be ignored.
     */
    undoMetadataSnapshotService?: UndoSnapshotsService<Snapshot>;

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
     * Specify the enabled experimental features
     */
    experimentalFeatures?: ExperimentalFeatures[];

    /**
     * Current zoom scale, @default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale?: number;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void;
}
