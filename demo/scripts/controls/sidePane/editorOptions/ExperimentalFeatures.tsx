import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import { ExperimentalFeatures } from 'roosterjs-editor-types';

export interface ExperimentalFeaturesProps {
    state: ExperimentalFeatures[];
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

const FeatureNames: { [key in ExperimentalFeatures]?: string } = {
    [ExperimentalFeatures.SingleDirectionResize]: 'Resize an image horizontally or vertically',
    [ExperimentalFeatures.PasteWithLinkPreview]: 'Try retrieve link preview information when paste',
    [ExperimentalFeatures.ImageRotate]: 'Rotate an inline image',
    [ExperimentalFeatures.ImageCrop]: 'Crop an inline image',
    [ExperimentalFeatures.AlwaysApplyDefaultFormat]: 'Apply the default format to all elements',
    [ExperimentalFeatures.ConvertSingleImageBody]:
        'Paste Html instead of image when Html have one Img Children (Animated Image Paste)',
    [ExperimentalFeatures.TableAlignment]:
        'Align table elements to left, center and right using setAlignment API',
    [ExperimentalFeatures.TabKeyTextFeatures]: 'Additional functionality to Tab Key',
};

export default class ExperimentalFeaturesPane extends React.Component<
    ExperimentalFeaturesProps,
    {}
> {
    render() {
        return (
            <>
                {Object.keys(FeatureNames).map((name: keyof typeof FeatureNames) =>
                    this.renderFeature(name)
                )}
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
                <label htmlFor={name}>{FeatureNames[name]}</label>
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
