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
});
