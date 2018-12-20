import * as React from 'react';
import MainPaneBase from '../MainPaneBase';
import RibbonButtonType, { DropDownRenderer } from './RibbonButtonType';
import RibbonPlugin from './RibbonPlugin';

const styles = require('./RibbonButton.scss');

export interface RibbonButtonProps {
    plugin: RibbonPlugin;
    button: RibbonButtonType;
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
        return (
            <span className={styles.dropDownButton}>
                <button
                    onClick={() => (button.dropDownItems ? this.onShowDropDown() : this.onClick())}
                    className={styles.button}
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
        renderer: DropDownRenderer,
    ): JSX.Element {
        return (
            <div ref={ref => (this.dropDown = ref)} className={styles.dropDown}>
                {Object.keys(items).map(
                    key =>
                        renderer ? (
                            <div key={key}>
                                {renderer(
                                    this.props.plugin.getEditor(),
                                    this.onHideDropDown,
                                    key,
                                    items[key],
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
                        ),
                )}
            </div>
        );
    }
}
