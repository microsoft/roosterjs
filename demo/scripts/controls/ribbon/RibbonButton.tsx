import * as React from 'react';
import MainPaneBase from '../MainPaneBase';
import RibbonButtonType from './RibbonButtonType';
import RibbonPlugin from './RibbonPlugin';
import { FormatState, IEditor } from 'roosterjs-editor-types';

const styles = require('./RibbonButton.scss');

export interface RibbonButtonProps {
    plugin: RibbonPlugin;
    button: RibbonButtonType;
    format: FormatState;
    onClicked: () => void;
}

export interface RibbonButtonState {
    isDropDownShown: boolean;
}

export default class RibbonButton extends React.Component<RibbonButtonProps, RibbonButtonState> {
    constructor(props: RibbonButtonProps) {
        super(props);
        this.state = {
            isDropDownShown: false,
        };
    }

    render() {
        let button = this.props.button;
        let editor = this.props.plugin.getEditor();
        let isImageButton = !!button.image;
        let className = isImageButton ? styles.button : styles.textButton;

        if (
            editor &&
            this.props.format &&
            button.checked &&
            button.checked(this.props.format, editor)
        ) {
            className += ' ' + styles.checked;
        }
        return (
            <span className={styles.dropDownButton}>
                <button
                    disabled={!!button.isDisabled && button.isDisabled(editor)}
                    onClick={button.dropDownItems ? this.onShowDropDown : () => this.onExecute()}
                    className={className}>
                    {isImageButton ? (
                        <img src={button.image} width={32} height={32} title={button.title} />
                    ) : (
                        button.title
                    )}
                </button>
                {button.dropDownItems && this.state.isDropDownShown && (
                    <DropDown
                        editor={editor}
                        button={button}
                        onHideDropDown={this.onHideDropDown}
                    />
                )}
            </span>
        );
    }

    private onExecute = (value?: string) => {
        const { button, plugin } = this.props;
        const editor = plugin.getEditor();
        this.onHideDropDown();
        if (button.onClick) {
            button.onClick(editor, value);
            MainPaneBase.getInstance().updateFormatState();
        }

        this.props.onClicked();
    };

    private onShowDropDown = () => {
        if (!this.props.button.preserveOnClickAway) {
            this.getDocument().addEventListener('click', this.onHideDropDown);
        }
        this.setState({
            isDropDownShown: true,
        });
    };

    private onHideDropDown = () => {
        this.props.plugin.getEditor().stopShadowEdit();

        this.getDocument().removeEventListener('click', this.onHideDropDown);
        this.setState({
            isDropDownShown: false,
        });
    };

    private getDocument() {
        return this.props.plugin.getEditor().getDocument();
    }
}

function DropDown(props: {
    editor: IEditor;
    button: RibbonButtonType;
    onHideDropDown: () => void;
}) {
    const { editor, button, onHideDropDown } = props;
    return (
        <div className={styles.dropDown}>
            {Object.keys(button.dropDownItems).map(key =>
                button.dropDownRenderer ? (
                    <div key={key}>
                        {button.dropDownRenderer(
                            editor,
                            onHideDropDown,
                            key,
                            button.dropDownItems[key]
                        )}
                    </div>
                ) : (
                    <DropDownItem
                        editor={editor}
                        itemName={key}
                        displayName={button.dropDownItems[key]}
                        buttonOnClick={button.onClick}
                    />
                )
            )}
        </div>
    );
}

function DropDownItem(props: {
    editor: IEditor;
    itemName: string;
    displayName: string;
    buttonOnClick: (editor: IEditor, key: string) => void;
}) {
    const { editor, displayName, buttonOnClick, itemName } = props;
    const onClick = React.useCallback(() => {
        // editor.stopShadowEdit();
        buttonOnClick?.(editor, itemName);
    }, [editor]);
    const onMouseOver = React.useCallback(() => {
        // editor.startShadowEdit();
        // buttonOnClick?.(editor, itemName);
    }, [editor]);

    return (
        <div
            key={props.itemName}
            onClick={onClick}
            onMouseOver={onMouseOver}
            className={styles.dropDownItem}>
            {displayName}
        </div>
    );
}
