import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import {
    ContentEditFeatureSettings,
    getAllContentEditFeatures,
} from 'roosterjs-editor-plugins/lib/EditFeatures';

type ContentEditItemId = keyof ContentEditFeatureSettings;

const styles = require('./OptionsPane.scss');

export interface ContentEditFeaturessProps {
    state: ContentEditFeatureSettings;
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

export default class ContentEditFeatures extends React.Component<ContentEditFeaturessProps, {}> {
    render() {
        const features = getAllContentEditFeatures();
        return (
            <table>
                <tbody>
                    {Object.keys(features).map((key: ContentEditItemId) =>
                        this.renderContentEditItem(key, features[key].description)
                    )}
                </tbody>
            </table>
        );
    }

    private renderContentEditItem(
        id: ContentEditItemId,
        text: string,
        moreOptions?: JSX.Element
    ): JSX.Element {
        const checked = this.props.state[id];

        return (
            <tr>
                <td className={styles.checkboxColumn}>
                    <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        title={id}
                        onChange={() => this.onContentEditClick(id)}
                    />
                </td>
                <td>
                    <div>
                        <label htmlFor={id} title={id}>
                            {text}
                        </label>
                    </div>
                    {checked && moreOptions}
                </td>
            </tr>
        );
    }

    private onContentEditClick = (id: ContentEditItemId) => {
        this.props.resetState(state => {
            let checkbox = document.getElementById(id) as HTMLInputElement;
            state.contentEditFeatures[id] = checkbox.checked;
        }, true);
    };
}
