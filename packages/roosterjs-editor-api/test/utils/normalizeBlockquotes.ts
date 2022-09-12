import normalizeBlockquote from '../../lib/utils/normalizeBlockquote';
import { createElement } from 'roosterjs-editor-dom';
import { CreateElementData } from 'roosterjs-editor-types';

const ID = 'test_id_';

describe('Normalize Blockquote |', () => {
    function runTest(input: CreateElementData, marginInlineEnd: string, marginInlineStart: string) {
        const blockquote = createElement(input, document) as HTMLElement;

        const quotesHandled: HTMLElement[] = [];
        blockquote.querySelectorAll('#' + ID).forEach(n => normalizeBlockquote(n, quotesHandled));

        expect(blockquote.style.marginInlineEnd).toEqual(marginInlineEnd);
        expect(blockquote.style.marginInlineStart).toEqual(marginInlineStart);
        expect(quotesHandled.length).toEqual(1);
        expect(quotesHandled[0]).toEqual(blockquote);
    }
    it('Normalize centered blockquote', () => {
        runTest(
            {
                tag: 'blockquote',
                children: [
                    {
                        tag: 'div',
                        style: 'text-align: center;',
                        attributes: {
                            id: ID,
                        },
                    },
                ],
            },
            'auto',
            ''
        );
    });

    it('Normalize centered blockquote, RTL', () => {
        runTest(
            {
                tag: 'blockquote',
                children: [
                    {
                        tag: 'div',
                        style: 'text-align: center;',
                        attributes: {
                            dir: 'rtl',
                            id: ID,
                        },
                    },
                ],
            },
            '',
            'auto'
        );
    });

    it('Normalize centered blockquote with no text align center', () => {
        runTest(
            {
                tag: 'blockquote',
                children: [
                    {
                        tag: 'div',
                        attributes: {
                            dir: 'rtl',
                            id: ID,
                        },
                    },
                    {
                        tag: 'div',
                        attributes: {
                            dir: 'rtl',
                            id: ID,
                        },
                    },
                ],
            },
            '',
            ''
        );
    });

    it('Normalize centered blockquote, RTL', () => {
        runTest(
            {
                tag: 'blockquote',
                children: [
                    {
                        tag: 'div',
                        style: 'text-align: left;',
                        attributes: {
                            id: ID,
                        },
                    },
                ],
            },
            '',
            ''
        );
    });
});
