import { createMarkdownImageFromSelection } from '../../../lib/editorSelectionToMarkdown/creators/createMarkdownImageFromSelection';

describe('createMarkdownImageFromSelection', () => {
    it('Empty image', () => {
        const image = document.createElement('img');
        expect(createMarkdownImageFromSelection(image)).toBe('![image]()');
    });

    it('Image with alt text', () => {
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        image.alt = 'Example Image';
        expect(createMarkdownImageFromSelection(image)).toBe(
            '![Example Image](https://example.com/image.png)'
        );
    });

    it('Image with title', () => {
        const image = document.createElement('img');
        image.src = 'https://example.com/image.png';
        image.title = 'Example Image Title';
        expect(createMarkdownImageFromSelection(image)).toBe(
            '![Example Image Title](https://example.com/image.png)'
        );
    });
});
