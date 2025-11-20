import { getPasteSource } from '../../../lib/paste/getPasteSource';
import type {
    BeforePasteEvent,
    EditorEnvironment,
    ClipboardData,
} from 'roosterjs-content-model-types';

describe('getPasteSourceTest | ', () => {
    let mockEnvironment: EditorEnvironment;

    beforeEach(() => {
        mockEnvironment = <any>{
            isMac: false,
            isAndroid: false,
            isSafari: false,
        };
    });

    function createMockEvent(
        htmlAttributes: Record<string, string> = {},
        clipboardData: Partial<ClipboardData> = {},
        fragment?: DocumentFragment
    ): BeforePasteEvent {
        return {
            eventType: 'beforePaste',
            htmlAttributes,
            fragment: fragment || document.createDocumentFragment(),
            clipboardData: {
                types: ['text/html'],
                htmlFirstLevelChildTags: ['DIV'],
                rawHtml: '<div>test</div>',
                ...clipboardData,
            } as ClipboardData,
        } as BeforePasteEvent;
    }

    it('should return default for unknown content', () => {
        const mockEvent = createMockEvent();
        const result = getPasteSource(mockEvent, false, mockEnvironment);
        expect(result).toBe('default');
    });

    it('should detect Word Desktop content', () => {
        const mockEvent = createMockEvent({
            ProgId: 'Word.Document',
            'xmlns:w': 'urn:schemas-microsoft-com:office:word',
        });
        const result = getPasteSource(mockEvent, false, mockEnvironment);
        expect(result).toBe('wordDesktop');
    });

    it('should detect Excel Desktop content', () => {
        const mockEvent = createMockEvent({
            ProgId: 'Excel.Sheet',
            'xmlns:x': 'urn:schemas-microsoft-com:office:excel',
        });
        const result = getPasteSource(mockEvent, false, mockEnvironment);
        expect(result).toBe('excelDesktop');
    });

    it('should detect PowerPoint Desktop content', () => {
        const mockEvent = createMockEvent({
            ProgId: 'PowerPoint.Slide',
        });
        const result = getPasteSource(mockEvent, false, mockEnvironment);
        expect(result).toBe('powerPointDesktop');
    });

    it('should handle single image detection when enabled', () => {
        const fragment = document.createDocumentFragment();
        const img = document.createElement('img');
        img.src = 'data:image/png;base64,test';
        fragment.appendChild(img);

        const mockEvent = createMockEvent(
            {},
            {
                types: ['Files'],
                htmlFirstLevelChildTags: ['IMG'],
            },
            fragment
        );

        const result = getPasteSource(mockEvent, true, mockEnvironment);
        expect(result).toBe('singleImage');
    });

    it('should handle different environment configurations', () => {
        const safariEnvironment = { ...mockEnvironment, isSafari: true };
        const mockEvent = createMockEvent(
            {},
            {
                rawHtml: `<html xmlns:w="urn:schemas-microsoft-com:office:word">
                <head><meta charset="UTF-8"></head><body>test</body></html>`,
            }
        );

        const result = getPasteSource(mockEvent, false, safariEnvironment);
        // In Safari, Word Desktop detection uses rawHtml
        expect(result).toBe('wordDesktop');
    });
});
