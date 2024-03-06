import { ApiPlaygroundPane } from './ApiPlaygroundPane';
import { SidePanePluginImpl } from '../SidePanePluginImpl';
import type { ApiPaneProps } from './ApiPaneProps';
import type { PluginEvent } from 'roosterjs-content-model-types';
import type { SidePaneElementProps } from '../SidePaneElement';

export class ApiPlaygroundPlugin extends SidePanePluginImpl<ApiPlaygroundPane, ApiPaneProps> {
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
