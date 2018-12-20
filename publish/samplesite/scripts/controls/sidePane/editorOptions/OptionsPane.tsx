import * as React from "react";
import BuildInPluginState from "../../BuildInPluginState";
import Code from "./Code";
import DefaultFormatPane from "./DefaultFormat";
import MainPaneBase from "../../MainPaneBase";
import Plugins from "./Plugins";

const html =
  "<html>\n" +
  "<body>\n" +
  '<div id="contentDiv" style="width: 800px; height: 600px; border: solid 1px black; overflow: auto"></div>\n' +
  '<script src="editor.js"></script>\n' +
  "</body>\n" +
  "</html>";

export default class OptionsPane extends React.Component<
  BuildInPluginState,
  BuildInPluginState
> {
  constructor(props: BuildInPluginState) {
    super(props);
    this.state = { ...props };
  }
  render() {
    return (
      <div>
        <details>
          <summary>
            <b>Plugins:</b>
          </summary>
          <Plugins state={this.state} resetState={this.resetState} />
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

        <hr />

        <details>
          <summary>
            <b>HTML Code:</b>
          </summary>
          <div>
            <code>
              <pre>{html}</pre>
            </code>
          </div>
        </details>

        <details>
          <summary>
            <b>Typescript Code:</b>
          </summary>
          <Code state={this.state} />
        </details>
      </div>
    );
  }

  getState(): BuildInPluginState {
    return { ...this.state };
  }

  private resetState = (
    callback: (state: BuildInPluginState) => void,
    resetEditor: boolean
  ) => {
    let state: BuildInPluginState = {
      linkTitle: this.state.linkTitle,
      watermarkText: this.state.watermarkText,
      pluginList: { ...this.state.pluginList },
      contentEditFeatures: { ...this.state.contentEditFeatures },
      defaultFormat: { ...this.state.defaultFormat }
    };

    if (callback) {
      callback(state);
      this.setState(state);
    }

    if (resetEditor) {
      MainPaneBase.getInstance().resetEditorPlugin(state);
    }
  };
}
