import ApiPaneProps from './ApiPaneProps';
import ApiPlaygroundPane from './ApiPlaygroundPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { PluginEvent } from 'roosterjs-editor-types';

export default class ApiPlaygroundPlugin extends SidePanePluginImpl<
    ApiPlaygroundPane,
    ApiPaneProps
> {
    constructor() {
        super(ApiPlaygroundPane, 'api', 'API Playground');
    }

    getComponentProps() {
        return {
            getEditor: () => {
                return this.editor;
            },
        };
    }

    onPluginEvent(e: PluginEvent) {
        this.getComponent(component => component.onPluginEvent(e));
    }
}
