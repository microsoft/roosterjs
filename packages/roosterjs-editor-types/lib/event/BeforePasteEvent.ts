import PluginEvent from './PluginEvent';
import ClipboardData from '../interface/ClipboardData';
import PasteOption from '../enum/PasteOption';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
interface BeforePasteEvent extends PluginEvent {
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
