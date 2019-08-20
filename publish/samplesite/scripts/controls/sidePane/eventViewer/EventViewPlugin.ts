import EventViewPane from './EventViewPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { PluginEvent } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

export default class EventViewPlugin extends SidePanePluginImpl<
    EventViewPane,
    SidePaneElementProps
> {
    constructor() {
        super(EventViewPane, 'event', 'Event Viewer');
    }

    onPluginEvent(e: PluginEvent) {
        this.getComponent(component => component.addEvent(e));
    }

    getComponentProps(base: SidePaneElementProps) {
        return base;
    }
}
