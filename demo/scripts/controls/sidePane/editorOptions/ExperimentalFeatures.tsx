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
    [ExperimentalFeatures.ListItemAlignment]:
        'Align list elements elements to left, center and right using setAlignment API',
    [ExperimentalFeatures.AutoFormatList]:
        'Trigger formatting by a especial characters. Ex: (A), 1. i).',
    [ExperimentalFeatures.ReuseAllAncestorListElements]:
        "Reuse ancestor list elements even if they don't match the types from the list item.",
    [ExperimentalFeatures.DefaultFormatInSpan]:
        'When apply default format when initialize or user type, apply the format on a SPAN element.',
    [ExperimentalFeatures.VariableBasedDarkColor]: 'Use variable-based color for dark mode',
    [ExperimentalFeatures.ReusableContentModel]:
        'Reuse existing DOM structure if possible when convert Content Model back to DOM tree',
    [ExperimentalFeatures.DeleteTableWithBackspace]:
        'Delete a table selected with the table selector pressing Backspace key',
    [ExperimentalFeatures.InlineEntityReadOnlyDelimiters]:
        'Add read entities around read only entities to handle browser edge cases.',
    [ExperimentalFeatures.DefaultFormatOnContainer]: 'Apply default format on editor container',
};

export default class ExperimentalFeaturesPane extends React.Component<
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
                <label htmlFor={name}>{FeatureNames[name]}</label>
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
