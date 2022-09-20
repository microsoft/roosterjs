import * as React from 'react';
import { FormatRenderer } from './FormatRenderer';
import { useProperty } from '../../../hooks/useProperty';

const styles = require('../FormatView.scss');

function DropDownFormatItem<TFormat, TOption extends string>(props: {
    name: string;
    format: TFormat;
    options: TOption[];
    getter: (format: TFormat) => TOption | undefined;
    setter?: (format: TFormat, newValue: TOption | undefined) => void;
    onUpdate?: () => void;
}) {
    const { name, getter, setter, format, options, onUpdate } = props;
    const dropDown = React.useRef<HTMLSelectElement>(null);
    const [value, setValue] = useProperty(getter(format));

    const onChange = React.useCallback(() => {
        const newValue =
            dropDown.current.value == '' ? undefined : (dropDown.current.value as TOption);
        setValue(newValue);
        setter?.(format, newValue);
        onUpdate?.();
    }, [format, setter]);

    return (
        <div className={styles.formatRow}>
            <div className={styles.formatName}>{name}</div>
            <div className={styles.formatValue}>
                <select ref={dropDown} value={value === undefined ? '' : value} onChange={onChange}>
                    <option value=""></option>
                    {options.map(o => (
                        <option value={o} key={o}>
                            {o}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export function createDropDownFormatRenderer<T, O extends string>(
    name: string,
    options: O[],
    getter: (format: T) => O,
    setter?: (format: T, newValue: O) => void
): FormatRenderer<T> {
    return (format: T, onUpdate?: () => void) => (
        <DropDownFormatItem
            name={name}
            getter={getter}
            setter={setter}
            format={format}
            options={options}
            onUpdate={onUpdate}
            key={name}
        />
    );
}

export function createDropDownFormatRendererGroup<T, O extends string, V extends string>(
    names: V[],
    options: O[],
    getter: (format: T) => O[],
    setter?: (format: T, name: V, newValue: O) => void
): FormatRenderer<T> {
    return (format: T, onUpdate?: () => void) => {
        const initValues = getter(format);
        return (
            <>
                {names.map((name, index) => (
                    <DropDownFormatItem
                        name={name}
                        getter={() => initValues[index]}
                        setter={(format, newValue) => setter?.(format, name, newValue)}
                        format={format}
                        options={options}
                        onUpdate={onUpdate}
                        key={name}
                    />
                ))}
            </>
        );
    };
}
