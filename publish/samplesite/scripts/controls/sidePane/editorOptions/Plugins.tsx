import * as React from 'react';
import BuildInPluginState, { BuildInPluginList, UrlPlaceholder } from '../../BuildInPluginState';
import { ContentEditFeatureSettings } from 'roosterjs-editor-plugins/lib/EditFeatures';

type PluginItemId = keyof BuildInPluginList;
type ContentEditItemId = keyof ContentEditFeatureSettings;

const styles = require('./OptionsPane.scss');

export interface PluginsProps {
    state: BuildInPluginState;
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

export default class Plugins extends React.Component<PluginsProps, {}> {
    private linkTitle = React.createRef<HTMLInputElement>();
    private watermarkText = React.createRef<HTMLInputElement>();

    render() {
        return (
            <table>
                <tbody>
                    {this.renderPluginItem(
                        'hyperlink',
                        'Hyperlink Plugin',
                        this.renderInputBox(
                            'Label title: ',
                            this.linkTitle,
                            this.props.state.linkTitle,
                            'Use "' + UrlPlaceholder + '" for the url string',
                            (state, value) => (state.linkTitle = value)
                        )
                    )}
                    {this.renderPluginItem('paste', 'Paste Plugin')}
                    {this.renderPluginItem(
                        'watermark',
                        'Watermark Plugin',
                        this.renderInputBox(
                            'Watermark text: ',
                            this.watermarkText,
                            this.props.state.watermarkText,
                            '',
                            (state, value) => (state.watermarkText = value)
                        )
                    )}
                    {this.renderPluginItem('imageResize', 'Image Resize Plugin')}
                    {this.renderPluginItem('tableResize', 'Table Resize Plugin')}
                    {this.renderPluginItem('pickerPlugin', 'Sample Picker Plugin')}
                    {this.renderPluginItem('customReplace', 'Custom Replace Plugin (autocomplete)')}
                    {this.renderPluginItem('entityPlugin', 'Entity Plugin')}
                </tbody>
            </table>
        );
    }

    private renderPluginItem(
        id: PluginItemId,
        text: string,
        moreOptions?: JSX.Element
    ): JSX.Element {
        return this.renderItem(
            id,
            this.props.state.pluginList[id],
            text,
            moreOptions,
            this.onPluginClick
        );
    }

    private renderItem<T extends PluginItemId | ContentEditItemId>(
        id: T,
        checked: boolean,
        text: string,
        moreOptions: JSX.Element,
        onChange: (id: T) => void
    ): JSX.Element {
        return (
            <tr>
                <td className={styles.checkboxColumn}>
                    <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        onChange={() => onChange(id)}
                    />
                </td>
                <td>
                    <div>
                        <label htmlFor={id}>{text}</label>
                    </div>
                    {checked && moreOptions}
                </td>
            </tr>
        );
    }

    private renderInputBox(
        label: string,
        ref: React.RefObject<HTMLInputElement>,
        value: string,
        placeholder: string,
        onChange: (state: BuildInPluginState, value: string) => void
    ): JSX.Element {
        return (
            <div>
                {label}
                <input
                    type="text"
                    ref={ref}
                    value={value}
                    placeholder={placeholder}
                    onChange={() =>
                        this.props.resetState(state => onChange(state, ref.current.value), false)
                    }
                    onBlur={() => this.props.resetState(null, true)}
                />
            </div>
        );
    }

    private onPluginClick = (id: PluginItemId) => {
        this.props.resetState(state => {
            let checkbox = document.getElementById(id) as HTMLInputElement;
            state.pluginList[id] = checkbox.checked;
        }, true);
    };
}
