import * as React from 'react';
import { Code } from './Code';
import { DefaultFormatPane } from './DefaultFormatPane';
import { EditorCode } from './codes/EditorCode';
import { LegacyPlugins, Plugins } from './Plugins';
import { MainPane } from '../../mainPane/MainPane';
import { OptionPaneProps, OptionState } from './OptionState';

const htmlStart =
    '<html>\n' +
    '<body>\n' +
    '<div id="contentDiv" style="width: 800px; height: 400px; border: solid 1px black; overflow: auto"></div>\n';
const htmlButtons =
    '<button id=buttonB><b>B</b></button>\n' +
    '<button id=buttonI><i>I</i></button>\n' +
    '<button id=buttonU><u>U</u></button>\n' +
    '<button id=buttonBullet>Bullet</button>\n' +
    '<button id=buttonNumbering>Numbering</button>\n' +
    '<button id=buttonUndo>Undo</button>\n' +
    '<button id=buttonRedo>Redo</button>\n' +
    '<button id=buttonTable>Insert Table</button>\n' +
    '<button id=buttonDark>Dark mode</button>\n';
'<button id=buttonDark>Dark Mode</button>\n';
const jsCode = '<script src="https://microsoft.github.io/roosterjs/rooster-min.js"></script>\n';
const legacyJsCode =
    '<script src="https://microsoft.github.io/roosterjs/rooster-legacy-min.js"></script>\n<script src="https://microsoft.github.io/roosterjs/rooster-adapter-min.js"></script>\n';
const htmlEnd = '</body>\n' + '</html>';

export class OptionsPane extends React.Component<OptionPaneProps, OptionState> {
    private exportForm = React.createRef<HTMLFormElement>();
    private exportData = React.createRef<HTMLInputElement>();
    private rtl = React.createRef<HTMLInputElement>();
    private disableCache = React.createRef<HTMLInputElement>();

    constructor(props: OptionPaneProps) {
        super(props);
        this.state = { ...props };
    }
    render() {
        const editorCode = new EditorCode(this.state);
        const html = this.getHtml(editorCode.requireLegacyCode());

        return (
            <div>
                <details>
                    <summary>
                        <b>Default Format</b>
                    </summary>
                    <DefaultFormatPane
                        state={this.state.defaultFormat}
                        resetState={this.resetState}
                    />
                </details>
                <details>
                    <summary>
                        <b>Plugins</b>
                    </summary>
                    <Plugins state={this.state} resetState={this.resetState} />
                </details>
                <details>
                    <summary>
                        <b>Legacy Plugins</b>
                    </summary>
                    <LegacyPlugins state={this.state} resetState={this.resetState} />
                </details>
                <div>
                    <br />
                </div>
                <div>
                    <input
                        id="pageRtl"
                        type="checkbox"
                        checked={this.state.isRtl}
                        onChange={this.onToggleDirection}
                        ref={this.rtl}
                    />
                    <label htmlFor="pageRtl">Show controls from right to left</label>
                </div>
                <div>
                    <input
                        id="disableCache"
                        type="checkbox"
                        checked={this.state.disableCache}
                        onChange={this.onToggleCacheModel}
                        ref={this.disableCache}
                    />
                    <label htmlFor="disableCache">Disable Content Model Cache</label>
                </div>
                <hr />
                <div>
                    <button onClick={this.onExportRoosterContentModel}>
                        Try roosterjs in CodePen
                    </button>
                </div>
                <div>
                    <br />
                </div>
                <details>
                    <summary>
                        <b>HTML Code:</b>
                    </summary>
                    <Code code={html} />
                </details>
                <details>
                    <summary>
                        <b>Typescript Code:</b>
                    </summary>
                    <Code code={editorCode.getCode()} />
                </details>
                <form
                    ref={this.exportForm}
                    method="POST"
                    action="https://codepen.io/pen/define"
                    target="_blank">
                    <input name="data" type="hidden" ref={this.exportData} />
                </form>
            </div>
        );
    }

    getState(): OptionState {
        return { ...this.state };
    }

    private resetState = (callback: (state: OptionState) => void, resetEditor: boolean) => {
        let state: OptionState = {
            linkTitle: this.state.linkTitle,
            watermarkText: this.state.watermarkText,
            pluginList: { ...this.state.pluginList },
            defaultFormat: { ...this.state.defaultFormat },
            forcePreserveRatio: this.state.forcePreserveRatio,
            applyChangesOnMouseUp: this.state.applyChangesOnMouseUp,
            isRtl: this.state.isRtl,
            disableCache: this.state.disableCache,
            tableFeaturesContainerSelector: this.state.tableFeaturesContainerSelector,
            allowExcelNoBorderTable: this.state.allowExcelNoBorderTable,
            listMenu: this.state.listMenu,
            tableMenu: this.state.tableMenu,
            imageMenu: this.state.imageMenu,
            autoFormatOptions: { ...this.state.autoFormatOptions },
            markdownOptions: { ...this.state.markdownOptions },
        };

        if (callback) {
            callback(state);
            this.setState(state);
        }

        if (resetEditor) {
            MainPane.getInstance().resetEditorPlugin(state);
        }
    };

    private onExportRoosterContentModel = () => {
        let editor = new EditorCode(this.state);
        let code = editor.getCode();
        let json = {
            title: 'RoosterJs',
            html: this.getHtml(editor.requireLegacyCode()),
            head: '',
            js: code,
            js_pre_processor: 'typescript',
        };
        this.exportData.current.value = JSON.stringify(json);
        this.exportForm.current.submit();
    };

    private onToggleDirection = () => {
        let isRtl = this.rtl.current.checked;
        this.setState({
            isRtl: isRtl,
        });
        MainPane.getInstance().setPageDirection(isRtl);
    };

    private onToggleCacheModel = () => {
        this.resetState(state => {
            state.disableCache = this.disableCache.current.checked;
        }, true);
    };

    private getHtml(requireLegacyCode: boolean) {
        return `${htmlStart}${htmlButtons}${jsCode}${
            requireLegacyCode ? legacyJsCode : ''
        }${htmlEnd}`;
    }
}
