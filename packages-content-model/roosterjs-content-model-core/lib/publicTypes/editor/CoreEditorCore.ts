import type { CoreEditorPluginState } from './CoreEditorPluginState';
import type { CoreEditorApiMap } from './CoreEditorApiMap';
import type { CoreEditorPlugin } from './CoreEditorPlugin';
import type {
    ColorManager,
    DomToModelOption,
    DomToModelSettings,
    EditorEnvironment,
    ModelToDomOption,
    ModelToDomSettings,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Represents the core data structure of a CoreEditor
 */
export interface CoreEditorCore extends CoreEditorPluginState {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: CoreEditorPlugin[];

    /**
     * Core API map of this editor
     */
    readonly api: CoreEditorApiMap;

    /**
     * Default DOM to Content Model options
     */
    readonly defaultDomToModelOptions: (DomToModelOption | undefined)[];

    /**
     * Default Content Model to DOM options
     */
    readonly defaultModelToDomOptions: (ModelToDomOption | undefined)[];

    /**
     * Default DOM to Content Model config, calculated from defaultDomToModelOptions,
     * will be used for creating content model if there is no other customized options
     */
    readonly defaultDomToModelConfig: DomToModelSettings;

    /**
     * Default Content Model to DOM config, calculated from defaultModelToDomOptions,
     * will be used for setting content model if there is no other customized options
     */
    readonly defaultModelToDomConfig: ModelToDomSettings;

    /**
     * Editor running environment
     */
    readonly environment: EditorEnvironment;

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    readonly colorManager: ColorManager;
}
