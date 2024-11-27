import { pasteWhiteSpaceFormatParser } from '../../lib/override/pasteWhiteSpaceFormatParser';
import { WhiteSpaceFormat } from 'roosterjs-content-model-types/lib';

describe('pasteWhiteSpaceFormatParser', () => {
    let format: WhiteSpaceFormat;
    let element: HTMLElement;
    let context: any;
    let defaultStyle: any;
    let defaultParserSpy: jasmine.Spy;

    beforeEach(() => {
        format = {};
        element = document.createElement('div');
        defaultParserSpy = jasmine.createSpy();
        context = {
            defaultFormatParsers: {
                whiteSpace: defaultParserSpy,
            },
        };
        defaultStyle = {};
    });

    it('should call default whiteSpace parser when element.style.whiteSpace is not "pre"', () => {
        element.style.whiteSpace = 'normal';
        pasteWhiteSpaceFormatParser(format, element, context, defaultStyle);
        expect(context.defaultFormatParsers.whiteSpace).toHaveBeenCalledWith(
            format,
            element,
            context,
            defaultStyle
        );
    });

    it('should not call default whiteSpace parser when element.style.whiteSpace is "pre"', () => {
        element.style.whiteSpace = 'pre';
        pasteWhiteSpaceFormatParser(format, element, context, defaultStyle);
        expect(context.defaultFormatParsers.whiteSpace).not.toHaveBeenCalled();
    });
});
