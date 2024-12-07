import EventViewPane from './EventViewPane';
import { PluginEvent } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export class EventViewPlugin extends SidePanePluginImpl<EventViewPane, SidePaneElementProps> {
    constructor() {
        super(EventViewPane, 'event', 'Event Viewer');
    }

    onPluginEvent(e: PluginEvent) {
        this.getComponent(component => component.addEvent(e));

        if (e.eventType == 'rewriteFromModel') {
            console.log('-----Removed-----');
            e.removedBlockElements.map(console.log);
            console.log('-----Added-----');
            e.addedBlockElements.map(console.log);
        }
    }

    getComponentProps(base: SidePaneElementProps) {
        return base;
    }
}
