import * as React from "react";
import RibbonButton from "./RibbonButton";
import ribbonButtons from "./ribbonButtons";
import RibbonPlugin from "./RibbonPlugin";

let styles = require("./Ribbon.scss");

export interface RibbonProps {
    plugin: RibbonPlugin;
    className?: string;
}

export default class Ribbon extends React.Component<RibbonProps, {}> {
    render() {
        let plugin = this.props.plugin;
        return (
            <div className={styles.ribbon + " " + (this.props.className || "")}>
                {Object.keys(ribbonButtons).map(key => (
                    <RibbonButton
                        key={key}
                        plugin={plugin}
                        button={ribbonButtons[key]}
                    />
                ))}
                <button onClick={this.onSave} className={styles.textButton}>
                    Export
                </button>
                <button onClick={this.onClear} className={styles.textButton}>
                    Clear
                </button>
            </div>
        );
    }

    private onSave = () => {
        let editor = this.props.plugin.getEditor();
        let w = window.open();
        w.document.write(editor.getContent());
    };

    private onClear = () => {
        let editor = this.props.plugin.getEditor();
        editor.addUndoSnapshot(() => {
            editor.setContent("");
        });
    };
}
