import * as React from 'react';
import { ExperimentalFeature } from 'roosterjs-content-model-types';
import { OptionState } from './OptionState';

export interface DefaultFormatProps {
    state: OptionState;
    resetState: (callback: (state: OptionState) => void, resetEditor: boolean) => void;
}

export class ExperimentalFeatures extends React.Component<DefaultFormatProps, {}> {
    render() {
        return (
            <>
                {this.renderFeature('PersistCache')}
                {this.renderFeature('HandleEnterKey')}
                {this.renderFeature('LegacyImageSelection')}
            </>
        );
    }

    private renderFeature(featureName: ExperimentalFeature): JSX.Element {
        let checked = this.props.state.experimentalFeatures.has(featureName);

        return (
            <div>
                <input
                    type="checkbox"
                    id={featureName}
                    checked={checked}
                    onChange={() => this.onFeatureClick(featureName)}
                />
                <label htmlFor={featureName}>{featureName}</label>
            </div>
        );
    }

    private onFeatureClick = (featureName: ExperimentalFeature) => {
        this.props.resetState(state => {
            let checkbox = document.getElementById(featureName) as HTMLInputElement;

            if (checkbox.checked) {
                state.experimentalFeatures.add(featureName);
            } else {
                state.experimentalFeatures.delete(featureName);
            }
        }, true);
    };
}
