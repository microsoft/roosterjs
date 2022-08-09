import * as Color from 'color';
import * as React from 'react';
import { FormatRenderer } from './FormatRenderer';
import { useProperty } from '../../../hooks/useProperty';

const styles = require('../FormatView.scss');

function TextFormatItem<T>(props: {
    name: string;
    format: T;
    getter: (format: T) => string;
    setter?: (format: T, newValue: string) => string;
    type: 'text' | 'number' | 'color' | 'multiline';
}) {
    const { name, getter, setter, format, type } = props;
    const textBox = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
    const colorValueBox = React.useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = React.useState<string>(null);

    let initValue = getter(format);

    if (type == 'color' && initValue) {
        try {
            const color = Color(initValue);
            initValue = color.hex();
        } catch {}
    }

    const [value, setValue] = useProperty(initValue);

    const updateValue = React.useCallback(
        (newValue: string) => {
            setErrorMessage(null);

            if (type == 'color') {
                try {
                    const color = Color(newValue);
                    newValue = color.hex();
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

    const onTextBoxChange = React.useCallback(() => {
        updateValue(textBox.current.value);
    }, [updateValue]);

    const onColorValueChange = React.useCallback(() => {
        updateValue(colorValueBox.current.value);
    }, [updateValue]);

    let content: JSX.Element;

    switch (type) {
        case 'color':
            content = (
                <>
                    <input type="color" ref={textBox} value={value} onChange={onTextBoxChange} />
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
                    ref={textBox}
                    onChange={onTextBoxChange}
                    className={styles.multiLineValue}
                    value={value}
                />
            );
            break;
        case 'number':
            content = (
                <input
                    type="number"
                    className={styles.numberValue}
                    ref={textBox}
                    value={value}
                    onChange={onTextBoxChange}
                />
            );
            break;
        case 'text':
            content = (
                <input
                    type="text"
                    className={styles.textValue}
                    ref={textBox}
                    value={value}
                    onChange={onTextBoxChange}
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
