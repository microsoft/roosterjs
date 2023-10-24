import { ContentModelCoreApiMap } from '../coreApi/ContentModelCoreApiMap';
import { ContentModelEditorPlugin } from '../plugin/ContentModelEditorPlugin';
import { ContentModelPluginState } from '../plugin/ContentModelPluginState';
import { EditorEnvironment } from './EditorEnvironment';
import type {
    DomToModelOption,
    DomToModelSettings,
    ModelToDomOption,
    ModelToDomSettings,
} from 'roosterjs-content-model-types';

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: ContentModelEditorPlugin[];

    /**
     * Core API map of this editor
     */
    readonly api: ContentModelCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: ContentModelCoreApiMap;

    /**
     * State of core plugins
     */
    readonly pluginState: ContentModelPluginState;

    /**
     * Default DOM to Content Model options
     */
    defaultDomToModelOptions: (DomToModelOption | undefined)[];

    /**
     * Default Content Model to DOM options
     */
    defaultModelToDomOptions: (ModelToDomOption | undefined)[];

    /**
     * Default DOM to Content Model config, calculated from defaultDomToModelOptions,
     * will be used for creating content model if there is no other customized options
     */
    defaultDomToModelConfig: DomToModelSettings;

    /**
     * Default Content Model to DOM config, calculated from defaultModelToDomOptions,
     * will be used for setting content model if there is no other customized options
     */
    defaultModelToDomConfig: ModelToDomSettings;

    /**
     * Editor running environment
     */
    environment: EditorEnvironment;
}
