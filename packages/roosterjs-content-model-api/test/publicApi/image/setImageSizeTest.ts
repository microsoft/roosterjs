import { segmentTestCommon } from '../segment/segmentTestCommon';
import { setImageSize } from '../../../lib/publicApi/image/setImageSize';
import {
    addSegment,
    createContentModelDocument,
    createImage,
    createText,
} from 'roosterjs-content-model-dom';
import type { ContentModelDocument } from 'roosterjs-content-model-types';

describe('setImageSize', () => {
    function runTest(
        model: ContentModelDocument,
        expected: ContentModelDocument,
        calledTimes: number,
        width: string = '200px',
        height: string = '100px'
    ) {
        segmentTestCommon(
            'setImageSize',
            editor => {
                setImageSize(editor, width, height);
                expect(editor.focus).toHaveBeenCalledTimes(1);
            },
            model,
            expected,
            calledTimes
        );
    }

    it('Empty document', () => {
        runTest(createContentModelDocument(), createContentModelDocument(), 0);
    });

    it('Leaves unselected images unchanged', () => {
        const model = createContentModelDocument();
        const expected = createContentModelDocument();
        addSegment(model, createImage('test', { width: '50px', height: '25px' }));
        addSegment(expected, createImage('test', { width: '50px', height: '25px' }));

        runTest(model, expected, 0);
    });

    it('Leaves selected text unchanged', () => {
        const model = createContentModelDocument();
        const text = createText('test', { fontSize: '12px' });
        text.isSelected = true;
        addSegment(model, text);
        const expected = createContentModelDocument();
        const expectedText = createText('test', { fontSize: '12px' });
        expectedText.isSelected = true;
        addSegment(expected, expectedText);

        runTest(model, expected, 1);
    });

    it('Sets both dimensions and preserves other image properties', () => {
        const model = createContentModelDocument();
        const image = createImage('test', {
            width: '50px',
            height: '25px',
            borderTop: '1px solid red',
        });
        image.isSelected = true;
        image.alt = 'Image description';
        addSegment(model, image);

        const expectedImage = createImage('test', {
            width: '200px',
            height: '100px',
            borderTop: '1px solid red',
        });
        expectedImage.isSelected = true;
        expectedImage.alt = 'Image description';
        const expectedModel = createContentModelDocument();
        addSegment(expectedModel, expectedImage);

        runTest(model, expectedModel, 1);
    });

    it('Applies CSS dimensions to all selected images only', () => {
        const model = createContentModelDocument();
        const expected = createContentModelDocument();

        [true, false, true].forEach(isSelected => {
            const image = createImage('test', { width: '50px', height: '25px' });
            image.isSelected = isSelected;
            addSegment(model, image);

            const expectedImage = createImage('test', {
                width: isSelected ? '50%' : '50px',
                height: isSelected ? 'auto' : '25px',
            });
            expectedImage.isSelected = isSelected;
            addSegment(expected, expectedImage);
        });

        runTest(model, expected, 1, '50%', 'auto');
    });

    it('Clears explicit dimensions with empty strings', () => {
        const model = createContentModelDocument();
        const image = createImage('test', { width: '50px', height: '25px' });
        image.isSelected = true;
        addSegment(model, image);

        const expected = createContentModelDocument();
        const expectedImage = createImage('test', { width: '', height: '' });
        expectedImage.isSelected = true;
        addSegment(expected, expectedImage);

        runTest(model, expected, 1, '', '');
    });
});
