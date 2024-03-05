import * as React from 'react';
import { FormatRenderer } from './FormatRenderer';
import { useProperty } from '../../../hooks/useProperty';

const styles = require('../FormatView.scss');

function TextFormatItem<T>(props: {
    name: string;
    format: T;
    getter: (format: T) => string;
    setter?: (format: T, newValue: string) => void;
    onUpdate?: () => void;
    type: 'text' | 'number' | 'multiline';
}) {
    const { name, getter, setter, format, type, onUpdate } = props;
    const textBox = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
    const [value, setValue] = useProperty(getter(format));

    const updateValue = React.useCallback(
        (newValue: string) => {
            setValue(newValue);
            setter?.(format, newValue);
            onUpdate();
        },
        [setter, format]
    );

    const onTextBoxChange = React.useCallback(() => {
        updateValue(textBox.current.value);
    }, [updateValue]);

    let content: JSX.Element;

    switch (type) {
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
            <div className={styles.formatValue}>{content}</div>
        </div>
    );
}

export function createTextFormatRenderer<T>(
    name: string,
    getter: (format: T) => string,
    setter?: (format: T, newValue: string) => void,
    type: 'text' | 'number' | 'multiline' = 'text'
): FormatRenderer<T> {
    return (format: T, onUpdate?: () => void) => (
        <TextFormatItem
            name={name}
            getter={getter}
            setter={setter}
            format={format}
            type={type}
            onUpdate={onUpdate}
            key={name}
        />
    );
}

export function createTextFormatRendererGroup<T, V extends string>(
    names: V[],
    getter: (format: T) => string[],
    setter?: (format: T, name: V, newValue: string) => void,
    type: 'text' | 'number' | 'multiline' = 'text'
): FormatRenderer<T> {
    return (format: T, onUpdate?: () => void) => {
        const initValues = getter(format);

        return (
            <>
                {names.map((name, index) => (
                    <TextFormatItem
                        name={name}
                        getter={() => initValues[index]}
                        setter={(format, newValue) => setter?.(format, name, newValue)}
                        format={format}
                        type={type}
                        onUpdate={onUpdate}
                        key={name}
                    />
                ))}
            </>
        );
    };
}
