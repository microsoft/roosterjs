import EditorPlugin from '../editor/EditorPlugin';
import {
    ContentScope,
    ContentPosition,
    DefaultFormat,
    InsertOption,
    PluginEvent,
    PluginEventType,
    Rect,
} from 'roosterjs-editor-types';
import { ContentTraverser } from 'roosterjs-editor-dom';

interface EditorCore {
    document: Document;
    contentDiv: HTMLDivElement;
    plugins: EditorPlugin[];
    defaultFormat: DefaultFormat;
    customData: {
        [Key: string]: {
            value: any;
            disposer: (value: any) => void;
        };
    };
    cachedSelectionRange: Range;
    idleLoopHandle: number;
    ignoreIdleEvent: boolean;
    api: CoreApiMap;
}

export default EditorCore;

export type ApplyInlineStyle = (core: EditorCore, styler: (element: HTMLElement) => void) => void;
export type AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => () => void;
export type Focus = (core: EditorCore) => void;
export type GetContentTraverser = (
    core: EditorCore,
    scope: ContentScope,
    position?: ContentPosition
) => ContentTraverser;
export type GetCursorRect = (core: EditorCore) => Rect;
export type GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
) => T;
export type GetSelectionRange = (core: EditorCore, tryGetFromCache: boolean) => Range;
export type HasFocus = (core: EditorCore) => boolean;
export type InsertNode = (core: EditorCore, node: Node, option: InsertOption) => boolean;
export type TriggerEvent = (core: EditorCore, pluginEvent: PluginEvent, broadcast: boolean) => void;
export type UpdateSelection = (core: EditorCore, range: Range) => boolean;

export interface CoreApiMap {
    applyInlineStyle: ApplyInlineStyle;
    attachDomEvent: AttachDomEvent;
    focus: Focus;
    getContentTraverser: GetContentTraverser;
    getCustomData: GetCustomData;
    getCursorRect: GetCursorRect;
    getSelectionRange: GetSelectionRange;
    hasFocus: HasFocus;
    insertNode: InsertNode;
    triggerEvent: TriggerEvent;
    updateSelection: UpdateSelection;
}
