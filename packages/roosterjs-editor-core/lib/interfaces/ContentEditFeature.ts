import Editor from '../editor/Editor';
import { ChangeSource, PluginEvent, PluginKeyboardEvent } from 'roosterjs-editor-types';

/**
 * Key numbers used for ContentEditFeature
 */
export const enum Keys {
    NULL = 0,
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    SPACE = 32,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
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

/**
 * Generic ContentEditFeature interface
 */
export interface GenericContentEditFeature<TEvent extends PluginEvent> {
    keys: number[];
    shouldHandleEvent: (event: TEvent, editor: Editor, ctrlOrMeta: boolean) => any;
    handleEvent: (event: TEvent, editor: Editor) => ChangeSource | void;
    allowFunctionKeys?: boolean;
}

/**
 * ContentEditFeature interface that handles keyboard event
 */
export type ContentEditFeature = GenericContentEditFeature<PluginKeyboardEvent>;
