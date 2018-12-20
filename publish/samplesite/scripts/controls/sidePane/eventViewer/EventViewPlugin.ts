import EventViewPane from './EventViewPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { PluginEvent } from 'roosterjs-editor-types';

export default class EventViewPlugin extends SidePanePluginImpl<EventViewPane, {}> {
    name: 'EventViewer';

    constructor() {
        super(EventViewPane, 'Event Viewer');
    }

    onPluginEvent(e: PluginEvent) {
        this.getComponent(component => component.addEvent(e));
    }

    getComponentProps() {
        return {};
    }
}
