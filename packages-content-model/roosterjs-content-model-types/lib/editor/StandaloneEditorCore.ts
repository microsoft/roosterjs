import type { EditorCore, SwitchShadowEdit } from 'roosterjs-editor-types';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { ContentModelPluginState } from '../pluginState/ContentModelPluginState';
import type { DOMSelection } from '../selection/DOMSelection';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { DomToModelSettings } from '../context/DomToModelSettings';
import type { EditorContext } from '../context/EditorContext';
import type { EditorEnvironment } from '../parameter/EditorEnvironment';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type { ModelToDomSettings, OnNodeCreated } from '../context/ModelToDomSettings';
import type {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../parameter/FormatWithContentModelOptions';

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The StandaloneEditorCore object
 */
export type CreateEditorContext = (core: StandaloneEditorCore & EditorCore) => EditorContext;

/**
 * Create Content Model from DOM tree in this editor
 * @param core The StandaloneEditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export type CreateContentModel = (
    core: StandaloneEditorCore & EditorCore,
    option?: DomToModelOption,
    selectionOverride?: DOMSelection
) => ContentModelDocument;

/**
 * Get current DOM selection from editor
 * @param core The StandaloneEditorCore object
 */
export type GetDOMSelection = (core: StandaloneEditorCore & EditorCore) => DOMSelection | null;

/**
 * Set content with content model. This is the replacement of core API getSelectionRangeEx
 * @param core The StandaloneEditorCore object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
 */
export type SetContentModel = (
    core: StandaloneEditorCore & EditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption,
    onNodeCreated?: OnNodeCreated
) => DOMSelection | null;

/**
 * Set current DOM selection from editor. This is the replacement of core API select
 * @param core The StandaloneEditorCore object
 * @param selection The selection to set
 */
export type SetDOMSelection = (
    core: StandaloneEditorCore & EditorCore,
    selection: DOMSelection
) => void;

/**
 * The general API to do format change with Content Model
 * It will grab a Content Model for current editor content, and invoke a callback function
 * to do format change. Then according to the return value, write back the modified content model into editor.
 * If there is cached model, it will be used and updated.
 * @param core The StandaloneEditorCore object
 * @param formatter Formatter function, see ContentModelFormatter
 * @param options More options, see FormatWithContentModelOptions
 */
export type FormatContentModel = (
    core: StandaloneEditorCore & EditorCore,
    formatter: ContentModelFormatter,
    options?: FormatWithContentModelOptions
) => void;

/**
 * The interface for the map of core API for Content Model editor.
 * Editor can call call API from this map under StandaloneEditorCore object
 */
export interface StandaloneCoreApiMap {
    /**
     * Create a EditorContext object used by ContentModel API
     * @param core The StandaloneEditorCore object
     */
    createEditorContext: CreateEditorContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param core The StandaloneEditorCore object
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel: CreateContentModel;

    /**
     * Get current DOM selection from editor
     * @param core The StandaloneEditorCore object
     */
    getDOMSelection: GetDOMSelection;

    /**
     * Set content with content model
     * @param core The StandaloneEditorCore object
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel: SetContentModel;

    /**
     * Set current DOM selection from editor. This is the replacement of core API select
     * @param core The StandaloneEditorCore object
     * @param selection The selection to set
     */
    setDOMSelection: SetDOMSelection;

    /**
     * The general API to do format change with Content Model
     * It will grab a Content Model for current editor content, and invoke a callback function
     * to do format change. Then according to the return value, write back the modified content model into editor.
     * If there is cached model, it will be used and updated.
     * @param core The StandaloneEditorCore object
     * @param formatter Formatter function, see ContentModelFormatter
     * @param options More options, see FormatWithContentModelOptions
     */
    formatContentModel: FormatContentModel;

    // TODO: This is copied from legacy editor core, will be ported to use new types later
    switchShadowEdit: SwitchShadowEdit;
}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface StandaloneEditorCore
    extends ContentModelPluginState,
        StandaloneEditorDefaultSettings {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * Core API map of this editor
     */
    readonly api: StandaloneCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: StandaloneCoreApiMap;

    /**
     * Editor running environment
     */
    environment: EditorEnvironment;
}

/**
 * Default DOM and Content Model conversion settings for an editor
 */
export interface StandaloneEditorDefaultSettings {
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
}
