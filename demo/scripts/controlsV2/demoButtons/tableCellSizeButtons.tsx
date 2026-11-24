import * as React from 'react';
import { setTableCellSize } from 'roosterjs-content-model-api';
import {
    MIN_ALLOWED_TABLE_CELL_HEIGHT,
    MIN_ALLOWED_TABLE_CELL_WIDTH,
} from 'roosterjs-content-model-dom';
import { TextField } from '@fluentui/react/lib/TextField';
import { showInputDialog } from 'roosterjs-react';
import type { RibbonButton, RibbonPlugin } from 'roosterjs-react';

interface TableCellSizeInputProps {
    label: string;
    minimum: number;
    disabled: boolean;
    onApply: (value: number) => void;
}

function TableCellSizeInput(props: TableCellSizeInputProps) {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState('');
    const lastApplied = React.useRef('');

    const apply = (newValue: string) => {
        if (!newValue || newValue == lastApplied.current || props.disabled) {
            return;
        }

        const size = Number(newValue);

        if (!Number.isFinite(size) || size < props.minimum) {
            setError(`Enter a size of at least ${props.minimum} px.`);
        } else {
            lastApplied.current = newValue;
            setError('');
            props.onApply(size);
        }
    };

    return (
        <TextField
            ariaLabel={props.label}
            prefix={props.label}
            suffix="px"
            type="number"
            min={props.minimum}
            step="1"
            value={value}
            disabled={props.disabled}
            errorMessage={error}
            styles={{ root: { width: 190, margin: '4px' } }}
            onChange={(event, newValue) => {
                const input = event.currentTarget;
                const nextValue = newValue || '';
                setValue(nextValue);
                setError('');
                apply(nextValue);
                input.focus();
            }}
            onKeyDown={event => {
                if (event.key == 'Enter') {
                    event.preventDefault();
                    apply(value);
                }
            }}
        />
    );
}

export function createTableCellSizeButtons(plugin: RibbonPlugin): RibbonButton<string>[] {
    return ['height', 'width'].map(dimension => {
        const isHeight = dimension == 'height';
        const label = isHeight ? 'Cell height' : 'Cell width';
        const minimum = isHeight ? MIN_ALLOWED_TABLE_CELL_HEIGHT : MIN_ALLOWED_TABLE_CELL_WIDTH;
        const button: RibbonButton<string> = {
            key: isHeight ? 'buttonNameTableCellHeight' : 'buttonNameTableCellWidth',
            unlocalizedText: label,
            iconName: '',
            isDisabled: formatState => !formatState.isInTable,
            onClick: (editor, _, strings, uiUtilities) => {
                showInputDialog(
                    uiUtilities,
                    button.key,
                    label,
                    {
                        size: {
                            labelKey: button.key,
                            unlocalizedLabel: `${label} (px)`,
                            initValue: '',
                            autoFocus: true,
                        },
                    },
                    strings,
                    (_, newValue, values) => {
                        const size = Number(newValue);
                        return Number.isFinite(size) && size >= minimum
                            ? { ...values, size: newValue }
                            : null;
                    }
                ).then(result => {
                    if (result) {
                        setTableCellSize(
                            editor,
                            isHeight ? Number(result.size) : undefined,
                            isHeight ? undefined : Number(result.size)
                        );
                    }
                });
            },
            commandBarProperties: {
                onRender: item => (
                    <TableCellSizeInput
                        label={label}
                        minimum={minimum}
                        disabled={!!item.disabled}
                        onApply={size =>
                            plugin.onButtonClick(
                                {
                                    ...button,
                                    onClick: editor =>
                                        setTableCellSize(
                                            editor,
                                            isHeight ? size : undefined,
                                            isHeight ? undefined : size
                                        ),
                                },
                                button.key
                            )
                        }
                    />
                ),
            },
        };

        return button;
    });
}
