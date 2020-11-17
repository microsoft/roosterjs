import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import { ExperimentalFeatures } from 'roosterjs-editor-types';

export interface ExperimentalFeaturesProps {
    state: ExperimentalFeatures[];
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

const FeatureName = {
    [ExperimentalFeatures.ListChain]: 'Enable List Chain for numbering list',
    [ExperimentalFeatures.MergePastedLine]:
        'When paste, try merge pasted content to the same line with existing content',
    [ExperimentalFeatures.NewBullet]: 'Toggle bullet using VList',
    [ExperimentalFeatures.NewIndentation]: 'Toggle indentation using VList',
    [ExperimentalFeatures.NewNumbering]: 'Toggle numbering using VList',
};

export default class ExperimentalFeaturesPane extends React.Component<
    ExperimentalFeaturesProps,
    {}
> {
    render() {
        return (
            <>
                {[
                    ExperimentalFeatures.ListChain,
                    ExperimentalFeatures.MergePastedLine,
                    ExperimentalFeatures.NewBullet,
                    ExperimentalFeatures.NewIndentation,
                    ExperimentalFeatures.NewNumbering,
                ].map(name => this.renderFeature(name))}
            </>
        );
    }

    private renderFeature(name: ExperimentalFeatures): JSX.Element {
        let checked = this.props.state.indexOf(name) >= 0;
        return (
            <div>
                <input
                    type="checkbox"
                    checked={checked}
                    id={name}
                    onChange={() => this.onClick(name)}
                />
                <label htmlFor={name}>{FeatureName[name]}</label>
            </div>
        );
    }

    private onClick = (name: ExperimentalFeatures) => {
        this.props.resetState(state => {
            let checkbox = document.getElementById(name) as HTMLInputElement;
            let index = state.experimentalFeatures.indexOf(name);

            if (checkbox.checked && index < 0) {
                state.experimentalFeatures.push(name);
            } else if (!checkbox.checked && index >= 0) {
                state.experimentalFeatures.splice(index, 1);
            }
        }, true);
    };
}
