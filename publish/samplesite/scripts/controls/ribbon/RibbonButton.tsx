import * as React from 'react';
import MainPaneBase from '../MainPaneBase';
import RibbonButtonType, { DropDownRenderer } from './RibbonButtonType';
import RibbonPlugin from './RibbonPlugin';
import { FormatState } from 'roosterjs-editor-types';

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
    private dropDown: HTMLDivElement;

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
                    onClick={() => (button.dropDownItems ? this.onShowDropDown() : this.onClick())}
                    className={className}
                >
                    <img src={button.image} width={32} height={32} title={button.title} />
                </button>
                {button.dropDownItems &&
                    this.state.isDropDownShown &&
                    this.renderDropDownItems(button.dropDownItems, button.dropDownRenderer)}
            </span>
        );
    }

    private onClick = (value?: string) => {
        const { button, plugin } = this.props;
        const editor = plugin.getEditor();
        this.onHideDropDown();
        if (button.onClick) {
            button.onClick(editor, value);
            MainPaneBase.getInstance().updateForamtState();
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
            <div ref={ref => (this.dropDown = ref)} className={styles.dropDown}>
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
                            onClick={() => this.onClick(key)}
                            className={styles.dropDownItem}
                        >
                            {items[key]}
                        </div>
                    )
                )}
            </div>
        );
    }
}
