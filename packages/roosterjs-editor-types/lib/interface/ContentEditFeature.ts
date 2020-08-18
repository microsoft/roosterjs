import IEditor from './IEditor';
import { ChangeSource } from '../enum/ChangeSource';
import { PluginEvent } from '../event/PluginEvent';
import { PluginKeyboardEvent } from '../event/PluginDomEvent';

/**
 * Generic ContentEditFeature interface
 */
export interface GenericContentEditFeature<TEvent extends PluginEvent> {
    keys: number[];
    shouldHandleEvent: (event: TEvent, editor: IEditor, ctrlOrMeta: boolean) => any;
    handleEvent: (event: TEvent, editor: IEditor) => ChangeSource | void;
    allowFunctionKeys?: boolean;
    defaultDisabled?: boolean;
}

/**
 * ContentEditFeature interface that handles keyboard event
 */
export type ContentEditFeature = GenericContentEditFeature<PluginKeyboardEvent>;
