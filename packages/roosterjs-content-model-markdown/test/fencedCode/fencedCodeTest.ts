import {
    convertMarkdownToContentModel,
    convertContentModelToMarkdown,
    isContentMarkdown,
    serializeFencedCodeBlock,
} from '../../lib/index';
import {
    cloneModel,
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    createText,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { ContentModelFormatContainer } from 'roosterjs-content-model-types';
import type { FencedCodeBlock } from '../../lib/index';

describe('fenced code blocks', () => {
    function parse(text: string) {
        const blocks: FencedCodeBlock[] = [];
        const model = convertMarkdownToContentModel(text, {
            onFencedCodeBlock: block => {
                blocks.push(block);
                return undefined;
            },
        });
        return { blocks, model };
    }

    it('detects standalone fences as Markdown', () => {
        expect(isContentMarkdown('```mermaid\nflowchart LR\nA-->B\n```')).toBe(true);
        expect(isContentMarkdown('~~~unknown\nx\n~~~')).toBe(true);
    });

    it('keeps punctuation, escapes, blank lines, and frontmatter literal', () => {
        const source =
            '---\ntitle: Example\n---\nflowchart LR\n  A["**bold**\\n[link](x)"]-->B\n\n';
        const { blocks, model } = parse('```mermaid\n' + source + '```');
        expect(blocks).toEqual([{ source, info: 'mermaid', fence: '```', closed: true }]);
        const code = model.blocks[0] as ContentModelFormatContainer;
        expect(code.blocks[0]).toEqual({
            blockType: 'Paragraph',
            isImplicit: true,
            format: {},
            segments: [createText(source)],
        });
        expect(convertContentModelToMarkdown(model)).toContain('```mermaid\n' + source + '```');
    });

    it('recognizes tilde fences, indentation, info strings and longer closers', () => {
        expect(parse('  ~~~ mermaid title\r\n  A\r\n B\r\n  ~~~~~').blocks).toEqual([
            { info: 'mermaid title', fence: '~~~', source: 'A\nB\n', closed: true },
        ]);
    });

    it('does not close on shorter fences or different delimiter characters', () => {
        expect(parse('````mermaid\n```\n~~~\n````').blocks[0].source).toBe('```\n~~~\n');
    });

    it('does not accept four-space indentation or backticks in backtick info', () => {
        expect(parse('    ```mermaid\nA').blocks.length).toBe(0);
        expect(parse('```mer`maid\nA').blocks.length).toBe(0);
    });

    it('preserves unclosed source up to EOF and normalizes physical newlines', () => {
        expect(parse('```mermaid\r\nA\r\n\r\n').blocks[0]).toEqual({
            info: 'mermaid',
            fence: '```',
            source: 'A\n\n',
            closed: false,
        });
        expect(parse('```mermaid\nA').blocks[0].source).toBe('A');
    });

    it('keeps an empty block', () => {
        const { blocks, model } = parse('```mermaid\n```');
        expect(blocks[0].source).toBe('');
        expect(convertContentModelToMarkdown(model)).toContain('```mermaid\n```');
        const root = document.createElement('div');
        contentModelToDom(document, root, model, createModelToDomContext());
        expect(root.querySelector('pre')).not.toBeNull();
    });

    it('preserves the legacy escaped newline convention outside fences', () => {
        const model = parse('a\\nb\n```\nc\\nd\n```').model;
        expect(model.blocks.length).toBe(3);
        expect(convertContentModelToMarkdown(model)).toContain('c\\nd');
    });

    it('handles quoted fences and stops an unclosed fence at the quote boundary', () => {
        const { blocks, model } = parse('> ```mermaid\n> A\noutside');
        expect(blocks[0].source).toBe('A\n');
        expect(model.blocks.length).toBe(2);
        expect(convertContentModelToMarkdown(model)).toContain('> ```mermaid\n> A\n> ```');
    });

    it('handles nested quotes', () => {
        const { blocks, model } = parse('> > ```mermaid\n> > A\n> > ```');
        expect(blocks[0].source).toBe('A\n');
        expect(convertContentModelToMarkdown(model)).toContain('> > ```mermaid');
    });

    it('handles fences in list items and continuation blocks', () => {
        for (const text of ['- ```mermaid\n  A\n  ```', '- item\n  ```mermaid\n  A\n  ```']) {
            const { blocks, model } = parse(text);
            expect(blocks[0].source).toBe('A\n');
            expect(model.blocks[0].blockType).toBe('BlockGroup');
            expect(convertContentModelToMarkdown(model)).toContain('\n  A\n  ```');
        }
    });

    it('flushes preceding table content before a code block', () => {
        const { model } = parse('|a|\n|-|\n|b|\n```\nx\n```');
        expect(model.blocks[0].blockType).toBe('Table');
        expect(model.blocks[1].blockType).toBe('BlockGroup');
    });

    it('supports application-owned blocks and recursive serializers', () => {
        const entity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            entityFormat: {},
        } as any;
        const model = convertMarkdownToContentModel('> ```mermaid\n> A\n> ```', {
            onFencedCodeBlock: () => entity,
        });
        const markdown = convertContentModelToMarkdown(model, undefined, {
            onBlock: block => (block === entity ? 'custom\nsource' : undefined),
        });
        expect(markdown).toContain('> custom\n> source');
    });

    it('protects source containing a closing delimiter', () => {
        expect(serializeFencedCodeBlock('```\n', 'mermaid')).toBe('````mermaid\n```\n````');
        expect(serializeFencedCodeBlock('x', 'has`tick')).toBe('~~~has`tick\nx\n~~~');
        expect(serializeFencedCodeBlock('x', 'bad\ninfo')).toBe('```bad info\nx\n```');
    });

    it('round trips fence metadata through HTML and model cloning', () => {
        const model = parse('~~~~mermaid\nflowchart LR\nA-->B\n~~~~').model;
        const root = document.createElement('div');
        contentModelToDom(document, root, cloneModel(model), createModelToDomContext());
        expect(root.querySelector('pre')?.dataset.roosterCodeInfo).toBe('mermaid');
        const reloaded = domToContentModel(root, createDomToModelContext());
        const code = reloaded.blocks[0] as ContentModelFormatContainer;
        expect(code.codeBlock).toEqual({ info: 'mermaid', fence: '~~~~' });
        expect(convertContentModelToMarkdown(reloaded)).toContain(
            '~~~~mermaid\nflowchart LR\nA-->B\n~~~~'
        );
    });
});
