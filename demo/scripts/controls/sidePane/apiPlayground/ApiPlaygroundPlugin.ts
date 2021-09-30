import ApiPaneProps from './ApiPaneProps';
import ApiPlaygroundPane from './ApiPlaygroundPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { PluginEvent } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

export default class ApiPlaygroundPlugin extends SidePanePluginImpl<
    ApiPlaygroundPane,
    ApiPaneProps
> {
    constructor() {
        super(ApiPlaygroundPane, 'api', 'API Playground');
    }

    getComponentProps(base: SidePaneElementProps) {
        return {
            ...base,
            getEditor: () => {
                return this.editor;
            },
        };
    }

    onPluginEvent(e: PluginEvent) {
        this.getComponent(component => component.onPluginEvent(e));
    }
}
