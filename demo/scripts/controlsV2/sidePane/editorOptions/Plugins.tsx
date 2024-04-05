import * as React from 'react';
import { UrlPlaceholder } from './OptionState';
import type {
    BuildInPluginList,
    LegacyPluginList,
    NewPluginList,
    OptionState,
} from './OptionState';

const styles = require('./OptionsPane.scss');

export interface PluginsProps {
    state: OptionState;
    resetState: (callback: (state: OptionState) => void, resetEditor: boolean) => void;
}

abstract class PluginsBase<PluginKey extends keyof BuildInPluginList> extends React.Component<
    PluginsProps,
    {}
> {
    abstract render(): JSX.Element;

    protected renderPluginItem(
        id: PluginKey,
        text: string,
        moreOptions?: JSX.Element
    ): JSX.Element {
        const checked = this.props.state.pluginList[id];

        return (
            <tr>
                <td className={styles.checkboxColumn}>
                    <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        onChange={() => this.onPluginClick(id)}
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

    protected renderInputBox(
        label: string,
        ref: React.RefObject<HTMLInputElement>,
        value: string,
        placeholder: string,
        onChange: (state: OptionState, value: string) => void
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

    protected renderCheckBox(
        label: string,
        ref: React.RefObject<HTMLInputElement>,
        value: boolean,
        onChange: (state: OptionState, value: boolean) => void
    ): JSX.Element {
        return (
            <div>
                <input
                    type="checkbox"
                    ref={ref}
                    checked={value}
                    onChange={() =>
                        this.props.resetState(state => onChange(state, ref.current.checked), true)
                    }
                    onBlur={() => this.props.resetState(null, true)}
                />
                {label}
            </div>
        );
    }

    private onPluginClick = (id: PluginKey) => {
        this.props.resetState(state => {
            let checkbox = document.getElementById(id) as HTMLInputElement;
            state.pluginList[id] = checkbox.checked;
        }, true);
    };
}

export class LegacyPlugins extends PluginsBase<keyof LegacyPluginList> {
    private forcePreserveRatio = React.createRef<HTMLInputElement>();

    render() {
        return (
            <table>
                <tbody>
                    {this.renderPluginItem(
                        'imageEdit',
                        'Image Edit Plugin',
                        this.renderCheckBox(
                            'Force preserve ratio',
                            this.forcePreserveRatio,
                            this.props.state.forcePreserveRatio,
                            (state, value) => (state.forcePreserveRatio = value)
                        )
                    )}
                    {this.renderPluginItem('customReplace', 'Custom Replace Plugin (autocomplete)')}
                    {this.renderPluginItem('announce', 'Announce')}
                </tbody>
            </table>
        );
    }
}

export class Plugins extends PluginsBase<keyof NewPluginList> {
    private allowExcelNoBorderTable = React.createRef<HTMLInputElement>();
    private listMenu = React.createRef<HTMLInputElement>();
    private tableMenu = React.createRef<HTMLInputElement>();
    private imageMenu = React.createRef<HTMLInputElement>();
    private watermarkText = React.createRef<HTMLInputElement>();
    private linkTitle = React.createRef<HTMLInputElement>();

    render(): JSX.Element {
        return (
            <table>
                <tbody>
                    {this.renderPluginItem('autoFormat', 'AutoFormat')}
                    {this.renderPluginItem('edit', 'Edit')}
                    {this.renderPluginItem(
                        'paste',
                        'Paste',
                        this.renderCheckBox(
                            'Do not add border for Excel table',
                            this.allowExcelNoBorderTable,
                            this.props.state.allowExcelNoBorderTable,
                            (state, value) => (state.allowExcelNoBorderTable = value)
                        )
                    )}
                    {this.renderPluginItem('shortcut', 'Shortcut')}
                    {this.renderPluginItem('tableEdit', 'TableEdit')}
                    {this.renderPluginItem(
                        'contextMenu',
                        'ContextMenu',
                        <>
                            {this.renderCheckBox(
                                'List menu',
                                this.listMenu,
                                this.props.state.listMenu,
                                (state, value) => (state.listMenu = value)
                            )}
                            {this.renderCheckBox(
                                'Table menu',
                                this.tableMenu,
                                this.props.state.tableMenu,
                                (state, value) => (state.tableMenu = value)
                            )}
                            {this.renderCheckBox(
                                'Image menu',
                                this.imageMenu,
                                this.props.state.imageMenu,
                                (state, value) => (state.imageMenu = value)
                            )}
                        </>
                    )}
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
                    {this.renderPluginItem('emoji', 'Emoji')}
                    {this.renderPluginItem('pasteOption', 'PasteOptions')}
                    {this.renderPluginItem('sampleEntity', 'SampleEntity')}
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
                </tbody>
            </table>
        );
    }
}
