import Editor from './Editor';
import { ChangeSource, PluginEvent, PluginKeyboardEvent } from 'roosterjs-editor-types';

export const enum ContentEditFeatureKeys {
    NULL = 0,
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    SPACE = 32,
    UP = 38,
    DOWN = 40,
    B = 66,
    I = 73,
    U = 85,
    Y = 89,
    Z = 90,
    COMMA = 188,
    PERIOD = 190,
    FORWARDSLASH = 191,
    Ctrl = 0x100,
    Meta = 0x200,
    Shift = 0x400,
    CONTENTCHANGED = 0x800,
    MOUSEDOWN = 0x1000,
}

export interface GenericContentEditFeature<TEvent extends PluginEvent> {
    keys: number[];
    initialize?: (editor: Editor) => any;
    shouldHandleEvent: (event: TEvent, editor: Editor) => any;
    handleEvent: (event: TEvent, editor: Editor) => ChangeSource | void;
    allowFunctionKeys?: boolean;
}

type ContentEditFeature = GenericContentEditFeature<PluginKeyboardEvent>;

export default ContentEditFeature;
