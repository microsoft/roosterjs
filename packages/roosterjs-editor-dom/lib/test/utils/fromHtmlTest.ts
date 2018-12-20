import fromHtml from '../../utils/fromHtml';
import { NodeType } from 'roosterjs-editor-types';

describe('EditorUitls fromHtml()', () => {
    it('htmlFragment = null', () => {
        let result = fromHtml(null, document);
        expect(result.length).toBe(0);
    });

    it('htmlFragment = text', () => {
        let result = fromHtml('text', document);
        expect(result.length).toBe(1);
        expect(result[0].nodeType).toBe(NodeType.Text);
        expect(result[0].nodeValue).toBe('text');
    });

    it('htmlFragment = <div>text</div>', () => {
        let result = fromHtml('<div>text</div>', document);
        expect(result.length).toBe(1);
        expect(result[0].nodeType).toBe(NodeType.Element);
        expect((result[0] as HTMLElement).tagName).toBe('DIV');
        expect((result[0] as HTMLElement).innerHTML).toBe('text');
    });

    it('htmlFragment = <div>text</div><br/>', () => {
        let result = fromHtml('<div>text</div><br/>', document);
        expect(result.length).toBe(2);
        expect(result[0].nodeType).toBe(NodeType.Element);
        expect((result[0] as HTMLElement).tagName).toBe('DIV');
        expect((result[0] as HTMLElement).innerHTML).toBe('text');
        expect(result[1].nodeType).toBe(NodeType.Element);
        expect((result[1] as HTMLElement).tagName).toBe('BR');
    });
});
