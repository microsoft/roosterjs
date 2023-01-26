import * as React from 'react';
import BuildInPluginState, { BuildInPluginProps } from '../../BuildInPluginState';
import Code from './Code';
import ContentEditFeatures from './ContentEditFeatures';
import DefaultFormatPane from './DefaultFormat';
import EditorCode from './codes/EditorCode';
import ExperimentalFeaturesPane from './ExperimentalFeatures';
import MainPaneBase from '../../MainPaneBase';
import Plugins from './Plugins';
import ReactEditorCode from './codes/ReactEditorCode';

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
    '<button id=buttonRedo>Redo</button>\n';
const darkButton = '<button id=buttonDark>Dark Mode</button>\n';
const htmlEnd =
    '<script src="https://microsoft.github.io/roosterjs/rooster-min.js"></script>\n' +
    '</body>\n' +
    '</html>';

const htmlRoosterReact =
    '<html>\n' +
    '<body>\n' +
    '<div id="root"></div>\n' +
    '<script src="https://unpkg.com/react@16/umd/react.development.js"></script>\n' +
    '<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>\n' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/fluentui-react/8.60.1/fluentui-react.min.js"></script>\n' +
    '<script src="https://microsoft.github.io/roosterjs/rooster-min.js"></script>\n' +
    '<script src="https://microsoft.github.io/roosterjs/rooster-react-min.js"></script>\n' +
    '</body>\n' +
    '</html>';

const cssRoosterReact = '.editor { border: solid 1px black; width: 100%; height: 600px}';
export default class OptionsPane extends React.Component<BuildInPluginProps, BuildInPluginState> {
    private exportForm = React.createRef<HTMLFormElement>();
    private exportData = React.createRef<HTMLInputElement>();
    private rtl = React.createRef<HTMLInputElement>();

    constructor(props: BuildInPluginProps) {
        super(props);
        this.state = { ...props };
    }
    render() {
        return (
            <div>
                <div>
                    <button onClick={this.onExportRooster}>Try roosterjs in CodePen</button>
                </div>
                <div>
                    <button onClick={this.onExportRoosterReact}>
                        Try roosterjs-react in CodePen
                    </button>
                </div>
                <div>
                    <br />
                </div>
                <details>
                    <summary>
                        <b>Plugins:</b>
                    </summary>
                    <Plugins state={this.state} resetState={this.resetState} />
                </details>
                <details>
                    <summary>
                        <b>Content edit features:</b>
                    </summary>
                    <ContentEditFeatures
                        state={this.state.contentEditFeatures}
                        resetState={this.resetState}
                    />
                </details>
                <details>
                    <summary>
                        <b>Default Format:</b>
                    </summary>
                    <DefaultFormatPane
                        state={this.state.defaultFormat}
                        resetState={this.resetState}
                    />
                </details>
                <details>
                    <summary>
                        <b>Experimental features:</b>
                    </summary>
                    <ExperimentalFeaturesPane
                        state={this.state.experimentalFeatures}
                        resetState={this.resetState}
                    />
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
                <hr />
                <details>
                    <summary>
                        <b>HTML Code:</b>
                    </summary>
                    <div>
                        <code>
                            <pre>{this.getHtml()}</pre>
                        </code>
                    </div>
                </details>
                <details>
                    <summary>
                        <b>Typescript Code:</b>
                    </summary>
                    <Code state={this.state} />
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

    getState(): BuildInPluginState {
        return { ...this.state };
    }

    private resetState = (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => {
        let state: BuildInPluginState = {
            linkTitle: this.state.linkTitle,
            watermarkText: this.state.watermarkText,
            pluginList: { ...this.state.pluginList },
            contentEditFeatures: { ...this.state.contentEditFeatures },
            defaultFormat: { ...this.state.defaultFormat },
            experimentalFeatures: this.state.experimentalFeatures,
            forcePreserveRatio: this.state.forcePreserveRatio,
            isRtl: this.state.isRtl,
        };

        if (callback) {
            callback(state);
            this.setState(state);
        }

        if (resetEditor) {
            MainPaneBase.getInstance().resetEditorPlugin(state);
        }
    };

    private onExportRooster = () => {
        let editor = new EditorCode(this.state);
        let code = editor.getCode();
        let json = {
            title: 'RoosterJs',
            html: this.getHtml(),
            head: '',
            js: code,
            js_pre_processor: 'typescript',
        };
        this.exportData.current.value = JSON.stringify(json);
        this.exportForm.current.submit();
    };

    private onExportRoosterReact = () => {
        let editor = new ReactEditorCode(this.state);
        let code = editor.getCode();
        let json = {
            title: 'RoosterJs React',
            html: htmlRoosterReact,
            css: cssRoosterReact,
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
        MainPaneBase.getInstance().setPageDirection(isRtl);
    };

    private getHtml() {
        return `${htmlStart}${htmlButtons}${darkButton}${htmlEnd}`;
    }
}
