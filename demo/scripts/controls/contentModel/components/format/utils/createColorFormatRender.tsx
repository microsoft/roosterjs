import * as Color from 'color';
import * as React from 'react';
import { FormatRenderer } from './FormatRenderer';
import { useProperty } from '../../../hooks/useProperty';

const styles = require('../FormatView.scss');
const Transparent = 'transparent';

function ColorFormatItem<T>(props: {
    name: string;
    format: T;
    getter: (format: T) => string;
    setter?: (format: T, newValue: string) => void;
    onUpdate?: () => void;
}) {
    const { name, getter, setter, format, onUpdate } = props;
    const colorPickerBox = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
    const colorValueBox = React.useRef<HTMLInputElement>(null);
    const transparentCheckBox = React.useRef<HTMLInputElement>(null);

    let initValue = getter(format);

    if (initValue && initValue != Transparent) {
        try {
            const color = Color(initValue);
            initValue = color.hex();
        } catch {}
    }

    const [value, setValue] = useProperty(initValue);

    const updateValue = React.useCallback(
        (newValue: string) => {
            if (newValue != Transparent) {
                try {
                    const color = Color(newValue);
                    newValue = color.hex();
                } catch {}
            }

            setValue(newValue);
            setter?.(format, newValue);
            onUpdate?.();
        },
        [setter, format]
    );

    const onTextBoxChange = React.useCallback(() => {
        updateValue(colorPickerBox.current.value);
    }, [updateValue]);

    const onColorValueChange = React.useCallback(() => {
        updateValue(colorValueBox.current.value);
    }, [updateValue]);

    const onToggleTransparent = React.useCallback(() => {
        updateValue(
            transparentCheckBox.current.checked ? Transparent : colorPickerBox.current.value
        );
    }, [updateValue]);

    let content = (
        <>
            <input type="color" ref={colorPickerBox} value={value} onChange={onTextBoxChange} />
            <input
                type="text"
                className={styles.colorValue}
                ref={colorValueBox}
                value={value}
                onChange={onColorValueChange}
            />
            <input
                type="checkbox"
                ref={transparentCheckBox}
                checked={value == Transparent}
                onChange={onToggleTransparent}
            />
            {Transparent}
        </>
    );

    return (
        <div className={styles.formatRow}>
            <div className={styles.formatName}>{name}</div>
            <div className={styles.formatValue}>{content}</div>
        </div>
    );
}

export function createColorFormatRenderer<T>(
    name: string,
    getter: (format: T) => string,
    setter?: (format: T, newValue: string) => void
): FormatRenderer<T> {
    return (format: T, onUpdate?: () => void) => (
        <ColorFormatItem
            name={name}
            getter={getter}
            setter={setter}
            format={format}
            key={name}
            onUpdate={onUpdate}
        />
    );
}

export function createColorFormatRendererGroup<T, V extends string>(
    names: V[],
    getter: (format: T) => string[],
    setter?: (format: T, name: V, newValue: string) => void
): FormatRenderer<T> {
    return (format: T, onUpdate?: () => void) => {
        const initValues = getter(format);

        return (
            <>
                {names.map((name, index) => (
                    <ColorFormatItem
                        name={name}
                        getter={() => initValues[index]}
                        setter={(format, newValue) => setter?.(format, name, newValue)}
                        format={format}
                        onUpdate={onUpdate}
                        key={name}
                    />
                ))}
            </>
        );
    };
}
