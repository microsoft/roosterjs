import { mergeStyles } from '@fluentui/react/lib/Styling';
import {
    getColorPickerContainerClassName,
    getColorPickerItemClassName,
} from '../../../lib/colorPicker/utils/getClassNamesForColorPicker';

describe('getColorPickerContainerClassName', () => {
    it('returns the CSS className for the color picker container', () => {
        const colorPickerContainer = mergeStyles({
            width: '192px',
            padding: '8px',
            overflow: 'hidden',
        });

        const invokedClassName = getColorPickerContainerClassName();
        expect(invokedClassName).toEqual(colorPickerContainer);
    });

    it('returns the CSS className for the color picker item', () => {
        const colorMenuItem = mergeStyles({
            display: 'inline-block',
            width: '32px',
            height: '32px',
        });

        const invokedClassName = getColorPickerItemClassName();
        expect(invokedClassName).toEqual(colorMenuItem);
    });
});
