import * as Color from 'color';
import * as React from 'react';
import { FormatRenderer } from './FormatRenderer';

const styles = require('../FormatView.scss');

function TextFormatItem<T>(props: {
    name: string;
    format: T;
    getter: (format: T) => string;
    setter?: (format: T, newValue: string) => string;
    type: 'text' | 'number' | 'color' | 'multiline';
}) {
    const { name, getter, setter, format, type } = props;
    const singleLineBox = React.useRef<HTMLInputElement>(null);
    const multiLineBox = React.useRef<HTMLTextAreaElement>(null);
    const colorValueBox = React.useRef<HTMLInputElement>(null);

    const [value, setValue] = React.useState(getter(format));
    const [errorMessage, setErrorMessage] = React.useState<string>(null);

    const updateValue = React.useCallback(
        (newValue: string) => {
            if (type == 'color') {
                try {
                    const color = Color(newValue);
                    newValue = color.hex();
                    setErrorMessage(null);
                } catch {
                    setErrorMessage('Invalid color value');
                }
            }

            setValue(newValue);

            const errOverride = setter?.(format, newValue) || null;

            if (errOverride) {
                setErrorMessage(errOverride);
            }
        },
        [setter, format, setErrorMessage]
    );

    const onSingleLineChange = React.useCallback(() => {
        updateValue(singleLineBox.current.value);
    }, [updateValue]);

    const onMultiLineChange = React.useCallback(() => {
        updateValue(multiLineBox.current.value);
    }, [updateValue]);

    const onColorValueChange = React.useCallback(() => {
        updateValue(colorValueBox.current.value);
    }, [updateValue]);

    let content: JSX.Element;

    switch (type) {
        case 'color':
            content = (
                <>
                    <input
                        type="color"
                        ref={singleLineBox}
                        value={value}
                        onChange={onSingleLineChange}
                    />
                    Value:
                    <input
                        type="text"
                        className={styles.colorValue}
                        ref={colorValueBox}
                        value={value}
                        onChange={onColorValueChange}
                    />
                </>
            );
            break;
        case 'multiline':
            content = (
                <textarea
                    ref={multiLineBox}
                    onChange={onMultiLineChange}
                    className={styles.multiLineValue}>
                    {value}
                </textarea>
            );
            break;
        case 'number':
            content = (
                <input
                    type="number"
                    className={styles.numberValue}
                    ref={singleLineBox}
                    value={value}
                    onChange={onSingleLineChange}
                />
            );
            break;
        case 'text':
            content = (
                <input
                    type="text"
                    className={styles.textValue}
                    ref={singleLineBox}
                    value={value}
                    onChange={onSingleLineChange}
                />
            );
            break;
    }

    return (
        <div className={styles.formatRow}>
            <div className={styles.formatName}>{name}</div>
            <div className={styles.formatValue}>
                {content}
                <br /> <span className={styles.errorMessage}>{errorMessage}</span>
            </div>
        </div>
    );
}

export function createTextFormatRenderer<T>(
    name: string,
    getter: (format: T) => string,
    setter?: (format: T, newValue: string) => string | undefined,
    type: 'text' | 'number' | 'color' | 'multiline' = 'text'
): FormatRenderer<T> {
    return (format: T) => (
        <TextFormatItem
            name={name}
            getter={getter}
            setter={setter}
            format={format}
            type={type}
            key={name}
        />
    );
}
