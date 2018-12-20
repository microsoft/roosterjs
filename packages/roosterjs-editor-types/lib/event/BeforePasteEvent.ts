import BasePluginEvent from './BasePluginEvent';
import ClipboardData from '../interface/ClipboardData';
import PasteOption from '../enum/PasteOption';
import PluginEventType from './PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
interface BeforePasteEvent extends BasePluginEvent<PluginEventType.BeforePaste> {
    /**
     * An object contains all related data for pasting
     */
    clipboardData: ClipboardData;

    /**
     * HTML Document Fragment which will be inserted into content if pasteOption is set to PasteHtml
     */
    fragment: DocumentFragment;

    /**
     * Paste option: html, text or image
     */
    pasteOption: PasteOption;
}

export default BeforePasteEvent;
