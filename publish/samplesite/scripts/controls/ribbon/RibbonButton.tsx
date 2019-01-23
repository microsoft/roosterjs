import * as React from 'react';
import MainPaneBase from '../MainPaneBase';
import RibbonButtonType, { DropDownRenderer } from './RibbonButtonType';
import RibbonPlugin from './RibbonPlugin';
import { Browser } from 'roosterjs-editor-dom';
import { FormatState } from 'roosterjs-editor-types';

const styles = require('./RibbonButton.scss');
let currentPusingButton: RibbonButtonType;

export interface RibbonButtonProps {
    plugin: RibbonPlugin;
    button: RibbonButtonType;
    format: FormatState;
    onClicked: () => void;
}

export interface RibbonButtonState {
    isDropDownShown: boolean;
}

interface MouseEvent extends React.MouseEvent<EventTarget> {
    detail: number;
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
        let className = styles.button;

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
                    onClick={button.dropDownItems ? this.onShowDropDown : this.onMouseClick}
                    className={className}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}>
                    <img src={button.image} width={32} height={32} title={button.title} />
                </button>
                {button.dropDownItems &&
                    this.state.isDropDownShown &&
                    this.renderDropDownItems(button.dropDownItems, button.dropDownRenderer)}
            </span>
        );
    }

    private onMouseDown = (e: React.MouseEvent<EventTarget>) => {
        if (e.button == 0) {
            currentPusingButton = this.props.button;
            e.preventDefault();
        }
    };

    private onMouseUp = (e: React.MouseEvent<EventTarget>) => {
        if (
            e.button == 0 &&
            currentPusingButton == this.props.button &&
            !this.props.button.dropDownItems
        ) {
            this.onExecute();
        }
        currentPusingButton = null;
    };

    private onMouseClick = (e: React.MouseEvent<EventTarget>) => {
        if (
            (Browser.isIE && e.nativeEvent.x < 0) ||
            (!Browser.isIE && (e as MouseEvent).detail == 0)
        ) {
            this.onExecute();
        }
    };

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
            document.addEventListener('click', this.onHideDropDown);
        }
        this.setState({
            isDropDownShown: true,
        });
    };

    private onHideDropDown = () => {
        document.removeEventListener('click', this.onHideDropDown);
        this.setState({
            isDropDownShown: false,
        });
    };

    private renderDropDownItems(
        items: { [key: string]: string },
        renderer: DropDownRenderer
    ): JSX.Element {
        return (
            <div className={styles.dropDown}>
                {Object.keys(items).map(key =>
                    renderer ? (
                        <div key={key}>
                            {renderer(
                                this.props.plugin.getEditor(),
                                this.onHideDropDown,
                                key,
                                items[key]
                            )}
                        </div>
                    ) : (
                            <div
                                key={key}
                                onClick={() => this.onExecute(key)}
                                className={styles.dropDownItem}>
                                {items[key]}
                            </div>
                        )
                )}
            </div>
        );
    }
}
