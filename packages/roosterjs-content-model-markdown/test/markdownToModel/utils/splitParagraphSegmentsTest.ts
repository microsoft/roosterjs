import { splitParagraphSegments } from '../../../lib/markdownToModel/utils/splitParagraphSegments';

describe('splitLinksAndImages', () => {
    function runTest(
        text: string,
        expected: {
            text: string;
            url: string;
            type: 'text' | 'link' | 'image';
        }[]
    ) {
        // Act
        const result = splitParagraphSegments(text);

        // Assert
        expect(result).toEqual(expected);
    }

    it('should return empty array for empty text', () => {
        runTest('', []);
    });

    it('should return empty array for text without link or image', () => {
        runTest('text without link or image', [
            { text: 'text without link or image', type: 'text', url: '' },
        ]);
    });

    it('should return text with link', () => {
        runTest('[link](https://www.example.com)', [
            { text: 'link', type: 'link', url: 'https://www.example.com' },
        ]);
    });

    it('should return text with image', () => {
        runTest('![image](https://www.example.com)', [
            { text: 'image', type: 'image', url: 'https://www.example.com' },
        ]);
    });

    it('should return text with link and image', () => {
        runTest('[link](https://www.example.com) and ![image](https://www.example.com)', [
            { text: 'link', type: 'link', url: 'https://www.example.com' },
            { text: ' and ', type: 'text', url: '' },
            { text: 'image', type: 'image', url: 'https://www.example.com' },
        ]);
    });

    it('should return text with link and image with space', () => {
        runTest(
            '[link](https://www.example.com) and ![image with space](https://www.example.com)',
            [
                { text: 'link', type: 'link', url: 'https://www.example.com' },
                { text: ' and ', type: 'text', url: '' },
                { text: 'image with space', type: 'image', url: 'https://www.example.com' },
            ]
        );
    });

    it('should return text with link and image with space in link', () => {
        runTest(
            '[link with space](https://www.example.com/withspace) and ![image](https://www.example.com)',
            [
                { text: 'link with space', type: 'link', url: 'https://www.example.com/withspace' },
                { text: ' and ', type: 'text', url: '' },
                { text: 'image', type: 'image', url: 'https://www.example.com' },
            ]
        );
    });

    it('should return only text and when image and link are not valid', () => {
        runTest(
            '[link](ht3tps://www.example.com/with) and ![image](http3s://www.example.com/with)',
            [
                {
                    text:
                        '[link](ht3tps://www.example.com/with) and ![image](http3s://www.example.com/with)',
                    type: 'text',
                    url: '',
                },
            ]
        );
    });

    it('should treat invalid link as text but still render valid image', () => {
        runTest('[link](ht3tps://www.example.com) and ![image](https://www.example.com)', [
            { text: '[link](ht3tps://www.example.com) and ', type: 'text', url: '' },
            { text: 'image', type: 'image', url: 'https://www.example.com' },
        ]);
    });

    it('should render valid link but treat invalid image as text', () => {
        runTest('[link](https://www.example.com) and ![image](http3s://www.example.com)', [
            { text: 'link', type: 'link', url: 'https://www.example.com' },
            { text: ' and ![image](http3s://www.example.com)', type: 'text', url: '' },
        ]);
    });

    it('should accept data: URL for image', () => {
        runTest('![image](data:image/png;base64,abc123)', [
            { text: 'image', type: 'image', url: 'data:image/png;base64,abc123' },
        ]);
    });

    it('should accept blob: URL for image', () => {
        runTest('![image](blob:https://example.com/some-id)', [
            { text: 'image', type: 'image', url: 'blob:https://example.com/some-id' },
        ]);
    });

    it('should accept absolute path for link', () => {
        runTest('[link](/path/to/page)', [{ text: 'link', type: 'link', url: '/path/to/page' }]);
    });

    it('should accept relative path with ./ for link', () => {
        runTest('[link](./relative/path)', [
            { text: 'link', type: 'link', url: './relative/path' },
        ]);
    });

    it('should accept relative path with ../ for link', () => {
        runTest('[link](../parent/path)', [{ text: 'link', type: 'link', url: '../parent/path' }]);
    });

    it('should handle text before and after a link', () => {
        runTest('before [link](https://www.example.com) after', [
            { text: 'before ', type: 'text', url: '' },
            { text: 'link', type: 'link', url: 'https://www.example.com' },
            { text: ' after', type: 'text', url: '' },
        ]);
    });

    it('should accept http: URL', () => {
        runTest('[link](http://www.example.com)', [
            { text: 'link', type: 'link', url: 'http://www.example.com' },
        ]);
    });

    it('should accept URL with query string and fragment', () => {
        runTest('[link](https://www.example.com/page?q=1&r=2#section)', [
            {
                text: 'link',
                type: 'link',
                url: 'https://www.example.com/page?q=1&r=2#section',
            },
        ]);
    });

    it('should handle two adjacent links with no text between', () => {
        runTest('[first](https://www.example.com/1)[second](https://www.example.com/2)', [
            { text: 'first', type: 'link', url: 'https://www.example.com/1' },
            { text: 'second', type: 'link', url: 'https://www.example.com/2' },
        ]);
    });

    it('should treat a single invalid link as plain text', () => {
        runTest('[link](ht3tps://www.example.com)', [
            { text: '[link](ht3tps://www.example.com)', type: 'text', url: '' },
        ]);
    });

    it('should treat a single invalid image as plain text', () => {
        runTest('![image](http3s://www.example.com)', [
            { text: '![image](http3s://www.example.com)', type: 'text', url: '' },
        ]);
    });

    it('should treat partial markdown syntax as plain text', () => {
        runTest('[not a link] and (not a url)', [
            { text: '[not a link] and (not a url)', type: 'text', url: '' },
        ]);
    });

    it('should accept relative path for image', () => {
        runTest('![image](./images/photo.png)', [
            { text: 'image', type: 'image', url: './images/photo.png' },
        ]);
    });

    it('should handle multiple images in a row', () => {
        runTest(
            '![first](https://www.example.com/1.png) ![second](https://www.example.com/2.png)',
            [
                { text: 'first', type: 'image', url: 'https://www.example.com/1.png' },
                { text: ' ', type: 'text', url: '' },
                { text: 'second', type: 'image', url: 'https://www.example.com/2.png' },
            ]
        );
    });
});
