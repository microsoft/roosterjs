import * as React from 'react';
import ContentEditFeatures from './ContentEditFeatures';
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
    private linkTitle = React.createRef<HTMLInputElement>();
    private forcePreserveRatio = React.createRef<HTMLInputElement>();

    render() {
        return (
            <table>
                <tbody>
                    {this.renderPluginItem(
                        'contentEdit',
                        'Content Edit',
                        <ContentEditFeatures
                            state={this.props.state.contentEditFeatures}
                            resetState={this.props.resetState}
                        />
                    )}
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
    private autoBullet = React.createRef<HTMLInputElement>();
    private autoNumbering = React.createRef<HTMLInputElement>();
    private autoLink = React.createRef<HTMLInputElement>();
    private autoUnlink = React.createRef<HTMLInputElement>();
    private autoHyphen = React.createRef<HTMLInputElement>();
    private markdownBold = React.createRef<HTMLInputElement>();
    private markdownItalic = React.createRef<HTMLInputElement>();
    private markdownStrikethrough = React.createRef<HTMLInputElement>();
    private markdownCode = React.createRef<HTMLInputElement>();

    render(): JSX.Element {
        return (
            <table>
                <tbody>
                    {this.renderPluginItem(
                        'autoFormat',
                        'AutoFormat',
                        <>
                            {this.renderCheckBox(
                                'Bullet',
                                this.autoBullet,
                                this.props.state.autoFormatOptions.autoBullet,
                                (state, value) => (state.autoFormatOptions.autoBullet = value)
                            )}
                            {this.renderCheckBox(
                                'Numbering',
                                this.autoNumbering,
                                this.props.state.autoFormatOptions.autoNumbering,
                                (state, value) => (state.autoFormatOptions.autoNumbering = value)
                            )}
                            {this.renderCheckBox(
                                'Link',
                                this.autoLink,
                                this.props.state.autoFormatOptions.autoLink,
                                (state, value) => (state.autoFormatOptions.autoLink = value)
                            )}
                            {this.renderCheckBox(
                                'Unlink',
                                this.autoUnlink,
                                this.props.state.autoFormatOptions.autoUnlink,
                                (state, value) => (state.autoFormatOptions.autoUnlink = value)
                            )}
                            {this.renderCheckBox(
                                'Hyphen',
                                this.autoHyphen,
                                this.props.state.autoFormatOptions.autoHyphen,
                                (state, value) => (state.autoFormatOptions.autoHyphen = value)
                            )}
                        </>
                    )}
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
                        'markdown',
                        'Markdown',
                        <>
                            {this.renderCheckBox(
                                'Bold',
                                this.markdownBold,
                                this.props.state.markdownOptions.bold,
                                (state, value) => (state.markdownOptions.bold = value)
                            )}
                            {this.renderCheckBox(
                                'Italic',
                                this.markdownItalic,
                                this.props.state.markdownOptions.italic,
                                (state, value) => (state.markdownOptions.italic = value)
                            )}
                            {this.renderCheckBox(
                                'Strikethrough',
                                this.markdownStrikethrough,
                                this.props.state.markdownOptions.strikethrough,
                                (state, value) => (state.markdownOptions.strikethrough = value)
                            )}

                            {this.renderCheckBox(
                                'Code',
                                this.markdownCode,
                                this.props.state.markdownOptions.codeFormat !== undefined,
                                (state, value) =>
                                    value
                                        ? (state.markdownOptions.codeFormat = {})
                                        : (state.markdownOptions.codeFormat = undefined)
                            )}
                        </>
                    )}
                </tbody>
            </table>
        );
    }
}
