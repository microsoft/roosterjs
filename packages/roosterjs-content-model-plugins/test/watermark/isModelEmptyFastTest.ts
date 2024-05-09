import { isModelEmptyFast } from '../../lib/watermark/isModelEmptyFast';
import {
    createBr,
    createContentModelDocument,
    createDivider,
    createEntity,
    createFormatContainer,
    createImage,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('isModelEmptyFast', () => {
    it('Empty model', () => {
        const model = createContentModelDocument();

        const result = isModelEmptyFast(model);

        expect(result).toBeTrue();
    });

    it('Single Divider block', () => {
        const model = createContentModelDocument();

        model.blocks.push(createDivider('div'));

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single FormatContainer block', () => {
        const model = createContentModelDocument();

        model.blocks.push(createFormatContainer('div'));

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single Entity block', () => {
        const model = createContentModelDocument();

        model.blocks.push(createEntity({} as any));

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single Paragraph block - no segment', () => {
        const model = createContentModelDocument();

        model.blocks.push(createParagraph());

        const result = isModelEmptyFast(model);

        expect(result).toBeTrue();
    });

    it('Single Paragraph block - one selection marker segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createSelectionMarker());

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeTrue();
    });

    it('Single Paragraph block - one BR segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createBr());

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeTrue();
    });

    it('Single Paragraph block - one selection marker and one BR segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createSelectionMarker(), createBr());

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeTrue();
    });

    it('Single Paragraph block - right margin 10px', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        para.format.marginRight = '10px';

        para.segments.push(createBr());
        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single Paragraph block - left margin 0.25rem', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        para.format.marginLeft = '0.25rem';

        para.segments.push(createBr());
        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single Paragraph block - two BR segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createBr(), createBr());

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single Paragraph block - one empty text segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText(''));

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeTrue();
    });

    it('Single Paragraph block - two empty text segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText(''), createText(''));

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeTrue();
    });

    it('Single Paragraph block - one text segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText('test'));

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single Paragraph block - one image segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createImage(''));

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Single Paragraph block - one entity segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createEntity({} as any));

        model.blocks.push(para);

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });

    it('Multiple blocks', () => {
        const model = createContentModelDocument();

        model.blocks.push({} as any, {} as any);

        const result = isModelEmptyFast(model);

        expect(result).toBeFalse();
    });
});
