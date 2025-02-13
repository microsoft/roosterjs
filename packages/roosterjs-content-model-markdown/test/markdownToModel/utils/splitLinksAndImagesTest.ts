import { splitLinkAndImages } from '../../../lib/markdownToModel/utils/splitLinksAndImages';

describe('splitLinksAndImages', () => {
    function runTest(text: string, expected: string[]) {
        // Act
        const result = splitLinkAndImages(text);

        // Assert
        expect(result).toEqual(expected);
    }

    it('should return empty array for empty text', () => {
        runTest('', []);
    });

    it('should return empty array for text without link or image', () => {
        runTest('text without link or image', ['text without link or image']);
    });

    it('should return text with link', () => {
        runTest('[link](https://www.example.com)', ['[link](https://www.example.com)']);
    });

    it('should return text with image', () => {
        runTest('![image](https://www.example.com)', ['![image](https://www.example.com)']);
    });

    it('should return text with link and image', () => {
        runTest('[link](https://www.example.com) and ![image](https://www.example.com)', [
            '[link](https://www.example.com)',
            ' and ',
            '![image](https://www.example.com)',
        ]);
    });

    it('should return text with link and image with space', () => {
        runTest(
            '[link](https://www.example.com) and ![image with space](https://www.example.com)',
            [
                '[link](https://www.example.com)',
                ' and ',
                '![image with space](https://www.example.com)',
            ]
        );
    });

    it('should return text with link and image with space in link', () => {
        runTest(
            '[link with space](https://www.example.com/with space) and ![image](https://www.example.com)',
            [
                '[link with space](https://www.example.com/with space)',
                ' and ',
                '![image](https://www.example.com)',
            ]
        );
    });
});
