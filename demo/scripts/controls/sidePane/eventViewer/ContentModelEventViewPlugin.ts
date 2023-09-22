import ContentModelEventViewPane from './ContentModelEventViewPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { PluginEvent } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

export default class ContentModelEventViewPlugin extends SidePanePluginImpl<
    ContentModelEventViewPane,
    SidePaneElementProps
> {
    constructor() {
        super(ContentModelEventViewPane, 'event', 'Event Viewer');
    }

    onPluginEvent(e: PluginEvent) {
        this.getComponent(component => component.addEvent(e));
    }

    getComponentProps(base: SidePaneElementProps) {
        return base;
    }
}
