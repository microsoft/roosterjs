import { cleanHtmlComments } from '../../../lib/command/paste/cleanHtmlComments';

describe('cleanHtmlComments', () => {
    it('removes HTML comments within style tags', () => {
        const input = `<head><style>/* Some CSS */<!-- This is a comment -->body { color: red; }<!-- Another comment --></style></head>`;
        const expected =
            '<head><style>/* Some CSS */ This is a comment body { color: red; } Another comment </style></head>';

        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('removes HTML comments within style tags  \x3C!--', () => {
        const input = `<head><style>/* Some CSS */\x3C!-- This is a comment -->body { color: red; }<!-- Another comment --></style></head>`;
        const expected =
            '<head><style>/* Some CSS */ This is a comment body { color: red; } Another comment </style></head>';

        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('does not remove comments outside style tags', () => {
        const input = `<head><!-- This is a comment --><style>body { color: red; }</style><!-- Another comment --></head>`;
        const expected =
            '<head><!-- This is a comment --><style>body { color: red; }</style><!-- Another comment --></head>';
        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('handles multiple style tags', () => {
        const input = `<head><style><!-- Comment 1 -->body { color: red; }</style><style><!-- Comment 2 -->p { font-size: 16px; }</style></head>`;
        const expected =
            '<head><style> Comment 1 body { color: red; }</style><style> Comment 2 p { font-size: 16px; }</style></head>';

        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('handles no style tags gracefully', () => {
        const input = `
            <head>
                <!-- This is a comment -->
            </head>
        `;
        const expected = `
            <head>
                <!-- This is a comment -->
            </head>
        `;
        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('handles style tags', () => {
        const input = '<head><style><!-- This is a comment --></style></head>';
        const expected = '<head><style> This is a comment </style></head>';
        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('handles style tags', () => {
        const input = '<head><style>\x3C!-- This is a comment --></style></head>';
        const expected = '<head><style> This is a comment </style></head>';
        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('handle different style tags', () => {
        const input =
            '<head><style111><!--some text--></style111>some other text<style><!--... --></style></head>';
        const expected =
            '<head><style111><!--some text--></style111>some other text<style>... </style></head>';
        expect(cleanHtmlComments(input)).toBe(expected);
    });

    it('handles empty input', () => {
        const input = '';
        const expected = '';
        expect(cleanHtmlComments(input)).toBe(expected);
    });
});
