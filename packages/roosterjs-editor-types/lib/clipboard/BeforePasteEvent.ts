import PluginEvent from '../editor/PluginEvent';
import ClipboardData from './ClipboardData';
import PasteOption from './PasteOption';

interface BeforePasteEvent extends PluginEvent {
    clipboardData: ClipboardData;
    fragment: DocumentFragment;
    pasteOption: PasteOption;
}

export default BeforePasteEvent;
