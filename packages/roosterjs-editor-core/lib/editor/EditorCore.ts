import EditorPlugin from '../editor/EditorPlugin';
import {
    ContentScope,
    ContentPosition,
    DefaultFormat,
    InsertOption,
    PluginEvent,
    PluginEventType,
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
export type GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
) => T;
export type GetSelectionRange = (core: EditorCore, tryGetFromCache: boolean) => Range;
export type HasFocus = (core: EditorCore) => boolean;
export type InsertNode = (core: EditorCore, node: Node, option: InsertOption) => boolean;
export type Select = (core: EditorCore, arg1: any, arg2?: any, arg3?: any, arg4?: any) => boolean;
export type TriggerEvent = (core: EditorCore, pluginEvent: PluginEvent, broadcast: boolean) => void;

export interface CoreApiMap {
    applyInlineStyle: ApplyInlineStyle;
    attachDomEvent: AttachDomEvent;
    focus: Focus;
    getContentTraverser: GetContentTraverser;
    getCustomData: GetCustomData;
    getSelectionRange: GetSelectionRange;
    hasFocus: HasFocus;
    insertNode: InsertNode;
    select: Select;
    triggerEvent: TriggerEvent;
}
