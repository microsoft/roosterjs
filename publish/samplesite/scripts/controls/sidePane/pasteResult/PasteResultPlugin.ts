import PastePane from './PastePane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default class PasteResultPlugin extends SidePanePluginImpl<PastePane, {}> {
    constructor() {
        super(PastePane, 'paste', 'Paste Event Viewer');
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.BeforePaste) {
            this.getComponent(component => component.setClipboardData(e.clipboardData));
        }
    }

    getComponentProps() {
        return {};
    }
}
