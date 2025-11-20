import * as getStylesModule from '../../../../lib/paste/utils/getStyles';
import * as processWordCommentsModule from '../../../../lib/paste/WordDesktop/processWordComments';
import * as processWordListModule from '../../../../lib/paste/WordDesktop/processWordLists';
import { wordDesktopElementProcessor } from '../../../../lib/paste/WordDesktop/processors/wordDesktopElementProcessor';
import type { WordMetadata } from '../../../../lib/paste/WordDesktop/WordMetadata';
import type {
    ContentModelBlockGroup,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

describe('wordDesktopElementProcessor', () => {
    let metadataMap: Map<string, WordMetadata>;
    let processor: ElementProcessor<HTMLElement>;
    let group: ContentModelBlockGroup;
    let element: HTMLElement;
    let context: DomToModelContext;
    let mockDefaultElementProcessor: jasmine.Spy;
    let getStylesSpy: jasmine.Spy;
    let processWordCommentsSpy: jasmine.Spy;
    let processWordListSpy: jasmine.Spy;

    beforeEach(() => {
        metadataMap = new Map();
        processor = wordDesktopElementProcessor(metadataMap);

        group = {
            blockGroupType: 'Document',
            blocks: [],
        };

        element = document.createElement('div');

        mockDefaultElementProcessor = jasmine.createSpy('defaultElementProcessor');
        context = {
            defaultElementProcessors: {
                element: mockDefaultElementProcessor,
            },
        } as any;

        // Create spies
        getStylesSpy = spyOn(getStylesModule, 'getStyles');
        processWordCommentsSpy = spyOn(processWordCommentsModule, 'processWordComments');
        processWordListSpy = spyOn(processWordListModule, 'processWordList');
    });

    it('should call processWordList and not call default processor when processWordList returns true', () => {
        const mockStyles = { color: 'red' };
        getStylesSpy.and.returnValue(mockStyles);
        processWordListSpy.and.returnValue(true);
        processWordCommentsSpy.and.returnValue(false);

        processor(group, element, context);

        expect(getStylesSpy).toHaveBeenCalledWith(element);
        expect(processWordListSpy).toHaveBeenCalledWith(
            mockStyles,
            group,
            element,
            context,
            metadataMap
        );
        // processWordComments should not be called due to short-circuit evaluation
        expect(processWordCommentsSpy).not.toHaveBeenCalled();
        expect(mockDefaultElementProcessor).not.toHaveBeenCalled();
    });

    it('should call processWordComments and not call default processor when processWordComments returns true', () => {
        const mockStyles = { fontSize: '12px' };
        getStylesSpy.and.returnValue(mockStyles);
        processWordListSpy.and.returnValue(false);
        processWordCommentsSpy.and.returnValue(true);

        processor(group, element, context);

        expect(getStylesSpy).toHaveBeenCalledWith(element);
        expect(processWordListSpy).toHaveBeenCalledWith(
            mockStyles,
            group,
            element,
            context,
            metadataMap
        );
        expect(processWordCommentsSpy).toHaveBeenCalledWith(mockStyles, element);
        expect(mockDefaultElementProcessor).not.toHaveBeenCalled();
    });

    it('should call default processor when both processWordList and processWordComments return false', () => {
        const mockStyles = { margin: '10px' };
        getStylesSpy.and.returnValue(mockStyles);
        processWordListSpy.and.returnValue(false);
        processWordCommentsSpy.and.returnValue(false);

        processor(group, element, context);

        expect(getStylesSpy).toHaveBeenCalledWith(element);
        expect(processWordListSpy).toHaveBeenCalledWith(
            mockStyles,
            group,
            element,
            context,
            metadataMap
        );
        expect(processWordCommentsSpy).toHaveBeenCalledWith(mockStyles, element);
        expect(mockDefaultElementProcessor).toHaveBeenCalledWith(group, element, context);
    });

    it('should not call default processor when processWordList returns true (short-circuit evaluation)', () => {
        const mockStyles = { padding: '5px' };
        getStylesSpy.and.returnValue(mockStyles);
        processWordListSpy.and.returnValue(true);
        processWordCommentsSpy.and.returnValue(true);

        processor(group, element, context);

        expect(getStylesSpy).toHaveBeenCalledWith(element);
        expect(processWordListSpy).toHaveBeenCalledWith(
            mockStyles,
            group,
            element,
            context,
            metadataMap
        );
        // processWordComments should not be called due to short-circuit evaluation
        expect(processWordCommentsSpy).not.toHaveBeenCalled();
        expect(mockDefaultElementProcessor).not.toHaveBeenCalled();
    });

    it('should pass the correct metadata map to processWordList', () => {
        const mockMetadata: WordMetadata = {
            marginTop: '10px',
            marginBottom: '20px',
        } as any;
        metadataMap.set('style1', mockMetadata);

        const mockStyles = { color: 'blue' };
        getStylesSpy.and.returnValue(mockStyles);
        processWordListSpy.and.returnValue(false);
        processWordCommentsSpy.and.returnValue(false);

        processor(group, element, context);

        expect(processWordListSpy).toHaveBeenCalledWith(
            mockStyles,
            group,
            element,
            context,
            metadataMap
        );
    });

    it('should handle different element types', () => {
        const spanElement = document.createElement('span');
        const mockStyles = { fontWeight: 'bold' };
        getStylesSpy.and.returnValue(mockStyles);
        processWordListSpy.and.returnValue(false);
        processWordCommentsSpy.and.returnValue(false);

        processor(group, spanElement, context);

        expect(getStylesSpy).toHaveBeenCalledWith(spanElement);
        expect(mockDefaultElementProcessor).toHaveBeenCalledWith(group, spanElement, context);
    });

    it('should work with empty metadata map', () => {
        const emptyMetadataMap = new Map<string, WordMetadata>();
        const emptyProcessor = wordDesktopElementProcessor(emptyMetadataMap);

        const mockStyles = { textAlign: 'center' };
        getStylesSpy.and.returnValue(mockStyles);
        processWordListSpy.and.returnValue(false);
        processWordCommentsSpy.and.returnValue(false);

        emptyProcessor(group, element, context);

        expect(processWordListSpy).toHaveBeenCalledWith(
            mockStyles,
            group,
            element,
            context,
            emptyMetadataMap
        );
        expect(mockDefaultElementProcessor).toHaveBeenCalledWith(group, element, context);
    });
});
