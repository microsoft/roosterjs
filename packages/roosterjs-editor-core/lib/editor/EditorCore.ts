import EditorPlugin from '../editor/EditorPlugin';
import UndoService from './UndoService';
import {
    ChangeSource,
    DefaultFormat,
    InsertOption,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';

interface EditorCore {
    document: Document;
    contentDiv: HTMLDivElement;
    plugins: EditorPlugin[];
    defaultFormat: DefaultFormat;
    cachedRange: Range;
    undo: UndoService;
    suspendAddingUndoSnapshot: boolean;
    customData: {
        [Key: string]: {
            value: any;
            disposer: (value: any) => void;
        };
    };
    idleLoopHandle: number;
    ignoreIdleEvent: boolean;
    api: CoreApiMap;
}

export default EditorCore;

export type AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => () => void;
export type Focus = (core: EditorCore) => void;
export type FormatWithUndo = (
    core: EditorCore,
    callback: () => void | Node,
    preserveSelection: boolean,
    changeSource: ChangeSource | string,
    dataCallback: () => any,
    skipAddingUndoAfterFormat: boolean
) => void;
export type GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
) => T;
export type GetFocusPosition = (core: EditorCore) => Position;
export type GetLiveRange =  (core: EditorCore) => Range;
export type HasFocus = (core: EditorCore) => boolean;
export type InsertNode = (core: EditorCore, node: Node, option: InsertOption) => boolean;
export type Select = (
    core: EditorCore,
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any
) => boolean;
export type TriggerEvent = (core: EditorCore, pluginEvent: PluginEvent, broadcast: boolean) => void;

export interface CoreApiMap {
    attachDomEvent: AttachDomEvent;
    focus: Focus;
    formatWithUndo: FormatWithUndo;
    getCustomData: GetCustomData;
    getFocusPosition: GetFocusPosition;
    getLiveRange: GetLiveRange;
    hasFocus: HasFocus;
    insertNode: InsertNode;
    select: Select;
    triggerEvent: TriggerEvent;
}
