import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';

export interface ExperimentalFeaturesProps {
    state: ExperimentalFeatures[];
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

const FeatureNames: Partial<Record<ExperimentalFeatures, string>> = {
    [ExperimentalFeatures.TabKeyTextFeatures]: 'Additional functionality to Tab Key',
    [ExperimentalFeatures.ReuseAllAncestorListElements]:
        "Reuse ancestor list elements even if they don't match the types from the list item.",
    [ExperimentalFeatures.DeleteTableWithBackspace]:
        'Delete a table selected with the table selector pressing Backspace key',
    [ExperimentalFeatures.DisableListChain]: 'Disable list chain functionality',
    [ExperimentalFeatures.ReusableContentModelV2]:
        'Reuse existing DOM structure if possible, and update the model when content or selection is changed',
};

export default class ContentModelExperimentalFeaturesPane extends React.Component<
    ExperimentalFeaturesProps,
    {}
> {
    render() {
        return <>{getObjectKeys(FeatureNames).map(name => this.renderFeature(name))}</>;
    }

    private renderFeature(name: keyof typeof FeatureNames): JSX.Element {
        let checked = this.props.state.indexOf(name) >= 0;
        return (
            <div key={name}>
                <input
                    type="checkbox"
                    checked={checked}
                    id={name}
                    onChange={() => this.onClick(name)}
                />
                <label htmlFor={name}>{name + ': ' + FeatureNames[name]}</label>
            </div>
        );
    }

    private onClick = (name: keyof typeof FeatureNames) => {
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
