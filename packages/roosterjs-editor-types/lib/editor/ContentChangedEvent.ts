import PluginEvent from './PluginEvent';

// Possible change sources. Here are the predefined sources.
// It can also be other string if the change source can't fall into these sources.
export const enum ChangeSource {
    AutoBullet = 'AutoBullet',
    AutoLink = 'AutoLink',
    CreateLink = 'CreateLink',
    Format = 'Format',
    ImageResize = 'ImageResize',
    Paste = 'Paste',
    SetContent = 'SetContent',
    Undo = 'Undo',
}

// Represents a custom PluginEvent for content change
interface ContentChangedEvent extends PluginEvent {
    // Source of the change
    source: ChangeSource | string;

    // Optional related data
    data?: any;
}

export default ContentChangedEvent;
