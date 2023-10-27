import type { CoreApiMap } from '../coreApi/CoreApiMap';
import type { EditorPlugin } from '../plugin/EditorPlugin';
import type { PluginState } from '../plugin/PluginState';
import type { EditorEnvironment } from './EditorEnvironment';
import type {
    ColorManager,
    DomToModelOption,
    DomToModelSettings,
    ModelToDomOption,
    ModelToDomSettings,
} from 'roosterjs-content-model-types';

/**
 * Represents the core data structure of a Content Model editor
 */
export interface EditorCore extends PluginState {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: EditorPlugin[];

    /**
     * Core API map of this editor
     */
    readonly api: CoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: CoreApiMap;

    /**
     * Dark color manager
     */
    readonly colorManager: ColorManager;

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
}
