import { ContentModelDocument } from './group/ContentModelDocument';
import { ContentModelSegmentFormat } from './format/ContentModelSegmentFormat';
import { CoreApiMap, EditorCore } from 'roosterjs-editor-types';
import { DomToModelOption, ModelToDomOption } from './IContentModelEditor';
import { EditorContext } from './context/EditorContext';

/**
 * @internal
 * Create a EditorContext object used by ContentModel API
 */
export type CreateEditorContext = (core: ContentModelEditorCore) => EditorContext;

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export type CreateContentModel = (
    core: ContentModelEditorCore,
    option?: DomToModelOption
) => ContentModelDocument;

/**
 * @internal
 * Set content with content model
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 */
export type SetContentModel = (
    core: ContentModelEditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption
) => void;

/**
 * @internal
 */
export interface ContentModelCoreApiMap extends CoreApiMap {
    createEditorContext: CreateEditorContext;
    createContentModel: CreateContentModel;
    setContentModel: SetContentModel;
}

/**
 * @internal
 */
export interface ContentModelEditorCore extends EditorCore {
    readonly api: ContentModelCoreApiMap;
    readonly originalApi: ContentModelCoreApiMap;
    cachedModel?: ContentModelDocument;
    defaultFormat: ContentModelSegmentFormat;
    defaultDomToModelOptions: DomToModelOption;
    defaultModelToDomOptions: ModelToDomOption;

    reuseModel: boolean;
    addDelimiterForEntity: boolean;
}
