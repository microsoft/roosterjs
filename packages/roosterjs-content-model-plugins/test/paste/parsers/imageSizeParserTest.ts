import { ContentModelImageFormat } from 'roosterjs-content-model-types';
import { imageSizeParser } from '../../../lib/paste/parsers/imageSizeParser';

describe('imageSizeParser', () => {
    let format: ContentModelImageFormat;
    let element: HTMLElement;
    let context: any;
    const originalEditorViewWidth = 800;

    beforeEach(() => {
        format = {};
        element = document.createElement('img');
        context = {
            editorViewWidth: originalEditorViewWidth,
        };
    });

    it('No width in format', () => {
        imageSizeParser(format, element, context, {});
        expect(format).toEqual({});
    });

    it('Width less than editor view width', () => {
        format.width = '400px';
        imageSizeParser(format, element, context, {});
        expect(format).toEqual({ width: '400px' });
    });

    it('Width equal to editor view width', () => {
        format.width = '800px';
        imageSizeParser(format, element, context, {});
        expect(format).toEqual({ width: '800px' });
    });

    it('Width greater than editor view width', () => {
        format.width = '1200px';
        format.height = '600px';
        imageSizeParser(format, element, context, {});
        expect(format).toEqual({});
    });
});
