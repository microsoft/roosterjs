import PresetPane, { PresetPaneProps, PresetPaneState } from './PresetPane';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export class PresetPlugin extends SidePanePluginImpl<PresetPane, PresetPaneProps> {
    constructor() {
        super(PresetPane, 'Preset', 'Presets');
    }

    initialize(editor: IEditor): void {
        this.editor = editor;
    }

    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case 'editorReady':
            case 'contentChanged':
                this.updatePresetPluginState();
                break;
        }
    }

    updatePresetPluginState() {
        this.getComponent(component => component.setState(this.getState()));
    }

    private getState(): PresetPaneState {
        return { editor: this.editor };
    }

    getComponentProps(base: SidePaneElementProps) {
        return {
            ...base,
            editor: this.editor,
        };
    }
}
