import { shouldOutdent } from '../../../lib/edit/keyboardIndentationUtils/shouldOutdent';

describe('shouldOutdent', () => {
    function runTest(rawEvent: KeyboardEvent, expected: any) {
        // Act
        const result = shouldOutdent(rawEvent);
        // Assert
        expect(result).toBe(expected);
    }

    it('should outdent - Tab + shift', () => {
        const rawEvent = { key: 'Tab', shiftKey: true } as KeyboardEvent;
        runTest(rawEvent, true);
    });

    it('should not outdent - Tab', () => {
        const rawEvent = { key: 'Tab', shiftKey: false } as KeyboardEvent;
        runTest(rawEvent, false);
    });

    it('should outdent - Arrow Left + Alt + Shift', () => {
        const rawEvent = { key: 'ArrowLeft', shiftKey: true, altKey: true } as KeyboardEvent;
        runTest(rawEvent, true);
    });

    it('should not outdent - Arrow Right + Alt + Shift', () => {
        const rawEvent = { key: 'ArrowRight', shiftKey: true, altKey: true } as KeyboardEvent;
        runTest(rawEvent, false);
    });
});
