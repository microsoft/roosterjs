import * as React from 'react';
import { allPresets, Preset } from './allPresets/allPresets';
import { IEditor } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./PresetPane.scss');

export interface PresetPaneState {
    editor?: IEditor;
}
export interface PresetPaneProps extends PresetPaneState, SidePaneElementProps {}

export default class PresetPane extends React.Component<PresetPaneProps, PresetPaneState> {
    constructor(props: PresetPaneProps) {
        super(props);
        this.state = {
            editor: props.editor,
        };
    }

    render() {
        const editor = this.state.editor;
        const presetButtons: any[] = [];
        const url = new URL(window.location.href);
        const currentPreset = url.searchParams.get('preset');
        allPresets.forEach(preset => {
            presetButtons.push(
                <button
                    className={preset.id == currentPreset ? styles.selected : ''}
                    key={preset.id}
                    onClick={() => this.setPreset(editor, preset)}>
                    {preset.buttonName}
                </button>
            );
        });

        return presetButtons;
    }

    setPreset(editor: IEditor, preset: Preset) {
        editor?.formatContentModel(model => {
            model.blocks = preset.content.blocks;
            return true;
        });

        const url = new URL(window.location.href);
        url.searchParams.set('preset', preset.id);
        window.history.pushState({ path: url.href }, '', url.href);
    }
}
