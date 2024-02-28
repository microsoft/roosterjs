import * as React from 'react';
import { Code } from './Code';
import { DefaultFormatPane } from './DefaultFormatPane';
import { EditorCode } from './codes/EditorCode';
import { MainPane } from '../../mainPane/MainPane';
import { OptionPaneProps, OptionState } from './OptionState';
import { Plugins } from './Plugins';

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
// const darkButton = '<button id=buttonDark>Dark Mode</button>\n';
const htmlEnd =
    //    '<script src="https://microsoft.github.io/roosterjs/rooster-min.js"></script>\n' +
    '<script src="https://microsoft.github.io/roosterjs/rooster-content-model-min.js"></script>\n' +
    '</body>\n' +
    '</html>';

export class OptionsPane extends React.Component<OptionPaneProps, OptionState> {
    private exportForm = React.createRef<HTMLFormElement>();
    private exportData = React.createRef<HTMLInputElement>();
    private rtl = React.createRef<HTMLInputElement>();
    private cacheModel = React.createRef<HTMLInputElement>();

    constructor(props: OptionPaneProps) {
        super(props);
        this.state = { ...props };
    }
    render() {
        return (
            <div>
                <details>
                    <summary>
                        <b>Default Format:</b>
                    </summary>
                    <DefaultFormatPane
                        state={this.state.defaultFormat}
                        resetState={this.resetState}
                    />
                </details>
                <div>
                    <br />
                </div>
                <details>
                    <summary>
                        <b>Legacy Plugins</b>
                    </summary>
                    <Plugins state={this.state} resetState={this.resetState} />
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
                        id="cacheModel"
                        type="checkbox"
                        checked={this.state.cacheModel}
                        onChange={this.onToggleCacheModel}
                        ref={this.cacheModel}
                    />
                    <label htmlFor="cacheModel">Use Content Model Cache</label>
                </div>
                <hr />
                <div>
                    <button onClick={this.onExportRoosterContentModel}>
                        Try roosterjs Content Model Editor in CodePen
                    </button>
                </div>
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

    getState(): OptionState {
        return { ...this.state };
    }

    private resetState = (callback: (state: OptionState) => void, resetEditor: boolean) => {
        let state: OptionState = {
            linkTitle: this.state.linkTitle,
            watermarkText: this.state.watermarkText,
            pluginList: { ...this.state.pluginList },
            contentEditFeatures: { ...this.state.contentEditFeatures },
            defaultFormat: { ...this.state.defaultFormat },
            forcePreserveRatio: this.state.forcePreserveRatio,
            applyChangesOnMouseUp: this.state.applyChangesOnMouseUp,
            isRtl: this.state.isRtl,
            cacheModel: this.state.cacheModel,
            tableFeaturesContainerSelector: this.state.tableFeaturesContainerSelector,
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
            html: this.getHtml(),
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
            state.cacheModel = this.cacheModel.current.checked;
        }, true);
    };

    private getHtml() {
        return `${htmlStart}${htmlButtons}${htmlEnd}`;
    }
}
