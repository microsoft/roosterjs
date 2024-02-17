import * as React from 'react';

export function useProperty<V>(currentValue: V): [V, (value: V) => void] {
    const [value, setValue] = React.useState(currentValue);

    React.useEffect(() => {
        setValue(currentValue);
    }, [currentValue]);

    return [value, setValue];
}
