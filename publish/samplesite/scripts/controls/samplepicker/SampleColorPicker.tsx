import * as React from 'react';
const styles = require('./SampleColorPicker.scss');

export type SampleColorPickerProps = {
    queryString: string;
    selectedIndex: number;
    colors: string[];
    cursorX: number;
    cursorY: number;
    onClick: (color: string) => void;
};

export default class SampleColorPicker<T> extends React.PureComponent<SampleColorPickerProps> {
    render() {
        return (
            <div
                className={`sample-color-picker ${styles.samplePickerContainer}`}
                style={{ top: this.props.cursorY, left: this.props.cursorX }}>
                {this.props.colors.length ? (
                    this.props.colors.map((color, index) => (
                        <div
                            key={color}
                            className={
                                this.props.selectedIndex == index
                                    ? `${styles.samplePickerColorSwatch} ${styles.selected}`
                                    : styles.samplePickerColorSwatch
                            }
                            style={{ backgroundColor: color }}
                            onClick={() => this.props.onClick(color)}
                        />
                    ))
                ) : (
                    <span>🤷️ No Results! </span>
                )}
            </div>
        );
    }
}
