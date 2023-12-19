import type {
    ContentMetadata,
    GetContentMode,
    InsertOption,
    StyleBasedFormatState,
    NodePosition,
} from 'roosterjs-editor-types';
import type { ContentModelEditorCore } from './ContentModelEditorCore';
import type { CompatibleGetContentMode } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The StandaloneEditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 */
export type SetContent = (
    core: ContentModelEditorCore,
    content: string,
    triggerContentChangedEvent: boolean,
    metadata?: ContentMetadata
) => void;

/**
 * Insert a DOM node into editor content
 * @param core The StandaloneEditorCore object. No op if null.
 * @param option An insert option object to specify how to insert the node
 */
export type InsertNode = (
    core: ContentModelEditorCore,
    node: Node,
    option: InsertOption | null
) => boolean;

/**
 * Get current editor content as HTML string
 * @param core The StandaloneEditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export type GetContent = (
    core: ContentModelEditorCore,
    mode: GetContentMode | CompatibleGetContentMode
) => string;

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The StandaloneEditorCore objects
 * @param node The node to get style from
 */
export type GetStyleBasedFormatState = (
    core: ContentModelEditorCore,
    node: Node | null
) => StyleBasedFormatState;

/**
 * Ensure user will type into a container element rather than into the editor content DIV directly
 * @param core The StandaloneEditorCore object.
 * @param position The position that user is about to type to
 * @param keyboardEvent Optional keyboard event object
 * @param deprecated Deprecated parameter, not used
 */
export type EnsureTypeInContainer = (
    core: ContentModelEditorCore,
    position: NodePosition,
    keyboardEvent?: KeyboardEvent,
    deprecated?: boolean
) => void;

/**
 * Temp interface
 * TODO: Port these core API
 */
export interface UnportedCoreApiMap {
    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * if triggerContentChangedEvent is set to true
     * @param core The StandaloneEditorCore object
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent: SetContent;

    /**
     * Insert a DOM node into editor content
     * @param core The StandaloneEditorCore object. No op if null.
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;

    /**
     * Get current editor content as HTML string
     * @param core The StandaloneEditorCore object
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent: GetContent;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The StandaloneEditorCore objects
     * @param node The node to get style from
     */
    getStyleBasedFormatState: GetStyleBasedFormatState;

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param core The EditorCore object.
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     * @param deprecated Deprecated parameter, not used
     */
    ensureTypeInContainer: EnsureTypeInContainer;
}
