import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import type { ContentModelDividerFormat } from 'roosterjs-content-model-types';

interface FormatHorizontalLineDialogProps {
    doc: Document;
    onApply: (format: ContentModelDividerFormat) => void;
    onCancel: () => void;
}

/**
 * @internal
 */
export function FormatHorizontalLineDialog(props: FormatHorizontalLineDialogProps) {
    const { doc, onApply, onCancel } = props;
    const [alignment, setAlignment] = React.useState<'' | 'left' | 'center' | 'right'>('');
    const [color, setColor] = React.useState('');
    const [height, setHeight] = React.useState('');
    const [width, setWidth] = React.useState('');
    const style = doc.createElement('hr').style;
    style.height = height.trim();
    style.width = width.trim();
    const heightError =
        height.trim() && !style.height ? 'Enter a valid CSS height, such as 4px.' : '';
    const widthError =
        width.trim() && !style.width ? 'Enter a valid CSS width, such as 50% or 200px.' : '';
    const canApply =
        !!(alignment || color || height.trim() || width.trim()) && !heightError && !widthError;

    const apply = () => {
        if (canApply) {
            const format: ContentModelDividerFormat = {};

            if (alignment) {
                format.marginLeft = alignment == 'left' ? '0' : 'auto';
                format.marginRight = alignment == 'right' ? '0' : 'auto';
            }
            if (color) {
                const border = '1px solid ' + color;
                format.backgroundColor = color;
                format.borderTop = border;
                format.borderRight = border;
                format.borderBottom = border;
                format.borderLeft = border;
            }
            if (height.trim()) {
                format.height = height.trim();
            }
            if (width.trim()) {
                format.width = width.trim();
            }

            onApply(format);
        }
    };

    return (
        <Dialog
            hidden={false}
            onDismiss={onCancel}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Format horizontal line',
                subText: 'Leave a field blank to keep its current formatting.',
            }}>
            <Dropdown
                label="Alignment"
                selectedKey={alignment}
                options={[
                    { key: '', text: 'Keep current' },
                    { key: 'left', text: 'Left' },
                    { key: 'center', text: 'Center' },
                    { key: 'right', text: 'Right' },
                ]}
                onChange={(_, option) => {
                    switch (option?.key) {
                        case '':
                        case 'left':
                        case 'center':
                        case 'right':
                            setAlignment(option.key);
                            break;
                    }
                }}
            />
            <Dropdown
                label="Color"
                selectedKey={color}
                options={[
                    { key: '', text: 'Keep current' },
                    { key: 'black', text: 'Black' },
                    { key: 'gray', text: 'Gray' },
                    { key: 'white', text: 'White' },
                    { key: 'red', text: 'Red' },
                    { key: 'orange', text: 'Orange' },
                    { key: 'yellow', text: 'Yellow' },
                    { key: 'green', text: 'Green' },
                    { key: 'blue', text: 'Blue' },
                    { key: 'purple', text: 'Purple' },
                ]}
                onChange={(_, option) => {
                    if (option && typeof option.key == 'string') {
                        setColor(option.key);
                    }
                }}
            />
            <TextField
                label="Height"
                placeholder="e.g. 4px"
                value={height}
                errorMessage={heightError}
                onChange={(_, value) => setHeight(value ?? '')}
            />
            <TextField
                label="Width"
                placeholder="e.g. 50% or 200px"
                value={width}
                errorMessage={widthError}
                onChange={(_, value) => setWidth(value ?? '')}
            />
            <DialogFooter>
                <PrimaryButton text="Apply" onClick={apply} disabled={!canApply} />
                <DefaultButton text="Cancel" onClick={onCancel} />
            </DialogFooter>
        </Dialog>
    );
}
