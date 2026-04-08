import { cleanForbiddenElements } from '../../lib/utils/cleanForbiddenElements';

describe('cleanForbiddenElements', () => {
    it('should do nothing when forbiddenElements is empty', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '<div><iframe src="test.com"></iframe><script>alert(1)</script></div>';

        cleanForbiddenElements(doc, []);

        expect(doc.body.innerHTML).toBe(
            '<div><iframe src="test.com"></iframe><script>alert(1)</script></div>'
        );
    });

    it('should remove iframe elements when iframe is in forbiddenElements', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '<div><iframe src="test.com"></iframe><p>content</p></div>';

        cleanForbiddenElements(doc, ['iframe']);

        expect(doc.body.innerHTML).toBe('<div><p>content</p></div>');
    });

    it('should remove script elements when script is in forbiddenElements', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '<div><script>alert(1)</script><p>content</p></div>';

        cleanForbiddenElements(doc, ['script']);

        expect(doc.body.innerHTML).toBe('<div><p>content</p></div>');
    });

    it('should remove multiple forbidden element types', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML =
            '<div><iframe src="test.com"></iframe><script>alert(1)</script><p>content</p></div>';

        cleanForbiddenElements(doc, ['iframe', 'script']);

        expect(doc.body.innerHTML).toBe('<div><p>content</p></div>');
    });

    it('should remove all instances of forbidden elements', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML =
            '<div><iframe></iframe></div><p><iframe></iframe></p><span>text</span>';

        cleanForbiddenElements(doc, ['iframe']);

        expect(doc.body.innerHTML).toBe('<div></div><p></p><span>text</span>');
    });

    it('should remove nested forbidden elements', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '<div><div><div><iframe></iframe></div></div></div>';

        cleanForbiddenElements(doc, ['iframe']);

        expect(doc.body.innerHTML).toBe('<div><div><div></div></div></div>');
    });

    it('should handle custom forbidden elements', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML =
            '<div><object data="test"></object><embed src="test"><p>safe</p></div>';

        cleanForbiddenElements(doc, ['object', 'embed']);

        expect(doc.body.innerHTML).toBe('<div><p>safe</p></div>');
    });

    it('should not remove elements not in forbiddenElements list', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '<div><iframe src="test.com"></iframe><p>content</p></div>';

        cleanForbiddenElements(doc, ['script']);

        expect(doc.body.innerHTML).toBe(
            '<div><iframe src="test.com"></iframe><p>content</p></div>'
        );
    });

    it('should handle empty body', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '';

        cleanForbiddenElements(doc, ['iframe', 'script']);

        expect(doc.body.innerHTML).toBe('');
    });

    it('should handle body with no forbidden elements', () => {
        const doc = document.implementation.createHTMLDocument();
        doc.body.innerHTML = '<div><p>safe content</p><span>more content</span></div>';

        cleanForbiddenElements(doc, ['iframe', 'script']);

        expect(doc.body.innerHTML).toBe('<div><p>safe content</p><span>more content</span></div>');
    });
});
