import { markdownProcessor } from '../../../lib/markdownToModel/processor/markdownProcessor';
import { convertMarkdownToContentModel } from '../../../lib/markdownToModel/convertMarkdownToContentModel';
import type { ContentModelDocument, ContentModelEntity } from 'roosterjs-content-model-types';

describe('markdownProcessor: math', () => {
    function getEntities(model: ContentModelDocument): ContentModelEntity[] {
        return model.blocks.filter(b => b.blockType == 'Entity') as ContentModelEntity[];
    }

    it('should NOT create math when math option is off', () => {
        const model = markdownProcessor('$$x+y$$', { emptyLine: 'remove' });
        expect(getEntities(model).length).toBe(0);
    });

    it('should create block math entity for single-line $$...$$', () => {
        const model = markdownProcessor('$$x+y$$', { emptyLine: 'remove', math: true });
        const entities = getEntities(model);

        expect(entities.length).toBe(1);
        expect(entities[0].wrapper.tagName).toBe('DIV');
        expect(entities[0].wrapper.getAttribute('data-latex')).toBe('x+y');
        expect(entities[0].entityFormat.entityType).toBe('Math');
        expect(entities[0].entityFormat.isReadonly).toBe(true);
    });

    it('should create block math entity for single-line \\[...\\]', () => {
        const model = markdownProcessor('\\[a=b\\]', { emptyLine: 'remove', math: true });
        const entities = getEntities(model);

        expect(entities.length).toBe(1);
        expect(entities[0].wrapper.getAttribute('data-latex')).toBe('a=b');
    });

    it('should create block math entity for multi-line $$ delimiters', () => {
        const md = ['$$', 'a', 'b', '$$'].join('\n');
        const model = markdownProcessor(md, { emptyLine: 'remove', math: true });
        const entities = getEntities(model);

        expect(entities.length).toBe(1);
        expect(entities[0].wrapper.getAttribute('data-latex')).toBe('a\nb');
    });

    it('should handle ChatGPT-style bare bracket block math', () => {
        const md = [
            '整个过程就是量子力学中的相干演化：',
            '',
            '[',
            '|\\psi(t)\\rangle',
            '===============',
            '',
            'e^{-iHt}',
            '|\\psi(0)\\rangle.',
            ']',
            '',
            '其中',
            '',
            '[',
            'H',
            ']',
            '',
            '就是哈密顿量。',
        ].join('\n');
        const model = markdownProcessor(md, { emptyLine: 'remove', math: true });
        const entities = getEntities(model);

        expect(entities.length).toBe(2);
        expect(entities[0].wrapper.getAttribute('data-latex')).toBe(
            '|\\psi(t)\\rangle\n===============\n\ne^{-iHt}\n|\\psi(0)\\rangle.'
        );
        expect(entities[1].wrapper.getAttribute('data-latex')).toBe('H');
    });

    it('should flush an unterminated block math region', () => {
        const md = ['[', 'x', 'y'].join('\n');
        const model = markdownProcessor(md, { emptyLine: 'remove', math: true });
        const entities = getEntities(model);

        expect(entities.length).toBe(1);
        expect(entities[0].wrapper.getAttribute('data-latex')).toBe('x\ny\n');
    });

    it('should create inline math entity for $...$', () => {
        const model = markdownProcessor('text $a+b$ more', { emptyLine: 'remove', math: true });
        const paragraph = model.blocks[0];

        expect(paragraph.blockType).toBe('Paragraph');
        if (paragraph.blockType == 'Paragraph') {
            const mathSegments = paragraph.segments.filter(s => s.segmentType == 'Entity');
            expect(mathSegments.length).toBe(1);
            const entity = mathSegments[0] as ContentModelEntity;
            expect(entity.wrapper.tagName).toBe('SPAN');
            expect(entity.wrapper.getAttribute('data-latex')).toBe('a+b');
        }
    });

    it('should not treat currency as inline math', () => {
        const model = markdownProcessor('I have $5 and $10 dollars', {
            emptyLine: 'remove',
            math: true,
        });
        const paragraph = model.blocks[0];

        if (paragraph.blockType == 'Paragraph') {
            const mathSegments = paragraph.segments.filter(s => s.segmentType == 'Entity');
            expect(mathSegments.length).toBe(0);
        }
    });

    it('should collect created entities into the provided array', () => {
        const md = ['$$a+b$$', 'text $c$ end'].join('\n');
        const entities: ContentModelEntity[] = [];
        markdownProcessor(md, { emptyLine: 'remove', math: true, entities });

        expect(entities.length).toBe(2);
        expect(entities[0].wrapper.getAttribute('data-latex')).toBe('a+b');
        expect(entities[0].wrapper.tagName).toBe('DIV');
        expect(entities[1].wrapper.getAttribute('data-latex')).toBe('c');
        expect(entities[1].wrapper.tagName).toBe('SPAN');
    });

    it('convertMarkdownToContentModel populates the entities out-param', () => {
        const entities: ContentModelEntity[] = [];
        convertMarkdownToContentModel('$$x+y$$', { emptyLine: 'remove', math: true }, entities);

        expect(entities.length).toBe(1);
        expect(entities[0].wrapper.getAttribute('data-latex')).toBe('x+y');
    });
});
