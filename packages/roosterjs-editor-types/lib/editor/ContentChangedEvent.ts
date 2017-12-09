import PluginEvent from './PluginEvent';

// Possible change sources. Here are the predefined sources.
// It can also be other string if the change source can't fall into these sources.
export type ChangeSource =
    | 'Undo'
    | 'Format'
    | 'AutoLink'
    | 'CreateLink'
    | 'SetContent'
    | 'Paste'
    | string;

// Represents a custom PluginEvent for content change
interface ContentChangedEvent extends PluginEvent {
    // Source of the change
    source: ChangeSource;

    // Optional related data
    data?: any;
}

export default ContentChangedEvent;
