import { createParagraph } from 'roosterjs-content-model-dom';
import { preserveParagraphFormat } from '../../../lib/edit/utils/preserveParagraphFormat';

describe('preserveParagraphFormat', () => {
    it('should preserve specified format properties', () => {
        const sourceParagraph = createParagraph();
        const targetParagraph = createParagraph();

        // Set up source paragraph with various formats (using type assertion for custom properties)
        (sourceParagraph.format as any) = {
            fontFamily: 'Arial',
            fontSize: '12pt',
            textAlign: 'center',
            backgroundColor: 'red',
            lineHeight: '1.5',
        };

        // Set up target paragraph with different formats
        (targetParagraph.format as any) = {
            fontFamily: 'Times',
            fontSize: '10pt',
            textAlign: 'start',
            color: 'blue',
        };

        // Preserve only fontFamily and textAlign
        const formatsToPreserve = ['fontFamily', 'textAlign'];

        preserveParagraphFormat(formatsToPreserve, sourceParagraph, targetParagraph);

        // Verify that only specified formats were preserved
        expect((targetParagraph.format as any).fontFamily).toBe('Arial');
        expect((targetParagraph.format as any).textAlign).toBe('center');

        // Verify other formats remain unchanged or are not copied
        expect((targetParagraph.format as any).fontSize).toBe('10pt'); // unchanged
        expect((targetParagraph.format as any).color).toBe('blue'); // unchanged
        expect((targetParagraph.format as any).backgroundColor).toBeUndefined(); // not copied
        expect((targetParagraph.format as any).lineHeight).toBeUndefined(); // not copied
    });

    it('should preserve className format property', () => {
        const sourceParagraph = createParagraph();
        const targetParagraph = createParagraph();

        // Set up source paragraph with className
        (sourceParagraph.format as any).className = 'highlight important';
        (sourceParagraph.format as any).fontFamily = 'Arial';

        // Preserve only className
        const formatsToPreserve = ['className'];

        preserveParagraphFormat(formatsToPreserve, sourceParagraph, targetParagraph);

        // Verify className was preserved
        expect((targetParagraph.format as any).className).toBe('highlight important');
        expect((targetParagraph.format as any).fontFamily).toBeUndefined();
    });

    it('should handle undefined formats gracefully', () => {
        const sourceParagraph = createParagraph();
        const targetParagraph = createParagraph();

        (sourceParagraph.format as any) = {
            fontFamily: 'Arial',
        };

        // Try to preserve a format that doesn't exist
        const formatsToPreserve = ['fontSize', 'nonExistentProperty'];

        preserveParagraphFormat(formatsToPreserve, sourceParagraph, targetParagraph);

        // Verify no undefined values are set
        expect((targetParagraph.format as any).fontSize).toBeUndefined();
        expect((targetParagraph.format as any).nonExistentProperty).toBeUndefined();
        expect(Object.keys(targetParagraph.format)).toEqual([]);
    });

    it('should handle empty formatsToPreserve array', () => {
        const sourceParagraph = createParagraph();
        const targetParagraph = createParagraph();

        (sourceParagraph.format as any) = {
            fontFamily: 'Arial',
            fontSize: '12pt',
        };

        (targetParagraph.format as any) = {
            backgroundColor: 'blue',
        };

        const formatsToPreserve: string[] = [];

        preserveParagraphFormat(formatsToPreserve, sourceParagraph, targetParagraph);

        // Verify target paragraph remains unchanged
        expect(targetParagraph.format).toEqual({
            backgroundColor: 'blue',
        } as any);
    });

    it('should handle undefined formatsToPreserve', () => {
        const sourceParagraph = createParagraph();
        const targetParagraph = createParagraph();

        (sourceParagraph.format as any) = {
            fontFamily: 'Arial',
            fontSize: '12pt',
        };

        (targetParagraph.format as any) = {
            backgroundColor: 'blue',
        };

        preserveParagraphFormat(undefined, sourceParagraph, targetParagraph);

        // Verify target paragraph remains unchanged
        expect(targetParagraph.format).toEqual({
            backgroundColor: 'blue',
        } as any);
    });

    it('should preserve multiple format properties correctly', () => {
        const sourceParagraph = createParagraph();
        const targetParagraph = createParagraph();

        (sourceParagraph.format as any) = {
            fontFamily: 'Arial',
            fontSize: '12pt',
            textAlign: 'center',
            lineHeight: '1.5',
            marginTop: '10px',
            paddingLeft: '20px',
        };

        const formatsToPreserve = ['fontFamily', 'textAlign', 'lineHeight', 'paddingLeft'];

        preserveParagraphFormat(formatsToPreserve, sourceParagraph, targetParagraph);

        expect((targetParagraph.format as any).fontFamily).toBe('Arial');
        expect((targetParagraph.format as any).textAlign).toBe('center');
        expect((targetParagraph.format as any).lineHeight).toBe('1.5');
        expect((targetParagraph.format as any).paddingLeft).toBe('20px');
        expect((targetParagraph.format as any).fontSize).toBeUndefined();
        expect((targetParagraph.format as any).marginTop).toBeUndefined();
    });

    it('should handle mixed existing and new format properties', () => {
        const sourceParagraph = createParagraph();
        const targetParagraph = createParagraph();

        (sourceParagraph.format as any) = {
            fontFamily: 'Arial',
            fontSize: '12pt',
            color: 'red',
        };

        (targetParagraph.format as any) = {
            fontFamily: 'Times', // will be overwritten
            backgroundColor: 'yellow', // will remain
        };

        const formatsToPreserve = ['fontFamily', 'fontSize'];

        preserveParagraphFormat(formatsToPreserve, sourceParagraph, targetParagraph);

        expect((targetParagraph.format as any).fontFamily).toBe('Arial'); // overwritten
        expect((targetParagraph.format as any).fontSize).toBe('12pt'); // added
        expect((targetParagraph.format as any).backgroundColor).toBe('yellow'); // preserved
        expect((targetParagraph.format as any).color).toBeUndefined(); // not copied
    });
});
