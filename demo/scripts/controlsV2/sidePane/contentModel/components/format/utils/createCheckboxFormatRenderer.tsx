import * as React from 'react';
import { FormatRenderer } from './FormatRenderer';
import { useProperty } from '../../../hooks/useProperty';

const styles = require('../FormatView.scss');

function CheckboxFormatItem<TFormat>(props: {
    name: string;
    format: TFormat;
    getter: (format: TFormat) => boolean;
    setter?: (format: TFormat, newValue: boolean) => void;
    onUpdate?: () => void;
}) {
    const { name, getter, setter, format, onUpdate } = props;
    const checkbox = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = useProperty<boolean>(getter(format));

    const onChange = React.useCallback(() => {
        const newValue = checkbox.current.checked;
        setValue(newValue);
        setter?.(format, newValue);
        onUpdate?.();
    }, [format, setter, setValue]);

    return (
        <div className={styles.formatRow}>
            <div className={styles.formatName}>{name}</div>
            <div className={styles.formatValue}>
                <input type="checkbox" ref={checkbox} checked={value} onChange={onChange} />
            </div>
        </div>
    );
}

export function createCheckboxFormatRenderer<T>(
    name: string,
    getter: (format: T) => boolean,
    setter?: (format: T, newValue: boolean) => void
): FormatRenderer<T> {
    return (format: T, onUpdate?: () => void) => (
        <CheckboxFormatItem
            name={name}
            getter={getter}
            setter={setter}
            format={format}
            onUpdate={onUpdate}
            key={name}
        />
    );
}
