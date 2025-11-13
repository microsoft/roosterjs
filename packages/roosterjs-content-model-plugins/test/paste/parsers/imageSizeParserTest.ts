import { ContentModelImageFormat, DomToModelContext } from 'roosterjs-content-model-types';
import { imageSizeParser } from '../../../lib/paste/parsers/imageSizeParser';

describe('imageSizeParser', () => {
    let format: ContentModelImageFormat;
    let element: HTMLElement;
    let context: DomToModelContext;
    const originalEditorViewWidth = 800;

    beforeEach(() => {
        format = {};
        element = document.createElement('img');
        context = {
            editorViewWidth: originalEditorViewWidth,
        } as any;
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

    it('Width in percentage', () => {
        format.width = '150%';
        format.height = '600px';
        imageSizeParser(format, element, context, {});
        expect(format).toEqual({ width: '150%', height: '600px' });
    });

    it('No editor view width in context', () => {
        delete context.editorViewWidth;
        format.width = '1200px';
        format.height = '600px';
        imageSizeParser(format, element, context, {});
        expect(format).toEqual({ width: '1200px', height: '600px' });
    });
});
