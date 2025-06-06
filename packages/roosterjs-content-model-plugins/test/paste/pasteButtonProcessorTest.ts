import { createContentModelDocument, createDomToModelContext } from 'roosterjs';
import { pasteButtonProcessor } from '../../lib/paste/processors/pasteButtonProcessor';

describe('pasteButtonProcessor', () => {
    it('extracts text content from button with multiple formatted spans', () => {
        // Arrange
        const mockGroup = createContentModelDocument();
        const mockContext = createDomToModelContext();

        const mockElement = document.createElement('button');
        const span = document.createElement('span');
        span.style.fontSize = '12px';
        span.style.color = 'red';
        span.appendChild(document.createTextNode('Click'));
        const span2 = document.createElement('span');
        span2.style.fontSize = '14px';
        span2.style.color = 'blue';
        span2.appendChild(document.createTextNode('Me'));

        mockElement.appendChild(span);
        mockElement.appendChild(span2);

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(mockGroup).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Click',
                            format: { fontSize: '12px', textColor: 'red' },
                        },
                        {
                            segmentType: 'Text',
                            text: 'Me',
                            format: { fontSize: '14px', textColor: 'blue' },
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('preserves paragraph formatting when extracting from spans inside paragraph', () => {
        // Arrange
        const mockGroup = createContentModelDocument();
        const mockContext = createDomToModelContext();

        const mockElement = document.createElement('button');
        const span = document.createElement('span');
        span.style.fontSize = '12px';
        span.style.color = 'red';
        span.appendChild(document.createTextNode('Click'));
        const span2 = document.createElement('span');
        span2.style.fontSize = '14px';
        span2.style.color = 'blue';
        span2.appendChild(document.createTextNode('Me'));

        const paraWrapper = document.createElement('p');
        paraWrapper.style.backgroundColor = 'yellow';
        paraWrapper.appendChild(span);
        paraWrapper.appendChild(span2);

        mockElement.appendChild(paraWrapper);

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(mockGroup).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Click',
                            format: {
                                fontSize: '12px',
                                textColor: 'red',
                                backgroundColor: 'yellow',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'Me',
                            format: {
                                fontSize: '14px',
                                textColor: 'blue',
                                backgroundColor: 'yellow',
                            },
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles complex hierarchy with multiple spans and inherited formatting', () => {
        // Arrange
        const mockGroup = createContentModelDocument();
        const mockContext = createDomToModelContext();

        const mockElement = document.createElement('button');
        const span = document.createElement('span');
        span.style.fontSize = '12px';
        span.style.color = 'red';
        span.appendChild(document.createTextNode('Click'));
        const span2 = document.createElement('span');
        span2.style.fontSize = '14px';
        span2.style.color = 'blue';
        span2.appendChild(document.createTextNode('Me'));

        const span3 = document.createElement('span');
        span3.appendChild(document.createTextNode('!'));

        const paraWrapper = document.createElement('p');
        paraWrapper.style.backgroundColor = 'yellow';
        paraWrapper.style.fontSize = '72px';

        paraWrapper.appendChild(span);
        paraWrapper.appendChild(span2);
        paraWrapper.appendChild(span3);

        mockElement.appendChild(paraWrapper);

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(mockGroup).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Click',
                            format: {
                                fontSize: '12px',
                                textColor: 'red',
                                backgroundColor: 'yellow',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'Me',
                            format: {
                                fontSize: '14px',
                                textColor: 'blue',
                                backgroundColor: 'yellow',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '!',
                            format: { fontSize: '72px', backgroundColor: 'yellow' },
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles direct text content in a button with inline styles', () => {
        // Arrange
        const mockGroup = createContentModelDocument();
        const mockContext = createDomToModelContext();
        const mockElement = document.createElement('button');

        mockElement.style.fontSize = '12px';
        mockElement.appendChild(document.createTextNode('Click Me !'));

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(mockGroup).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Click Me !',
                            format: { fontSize: '12px' },
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('handles empty button with no content', () => {
        // Arrange
        const mockGroup = createContentModelDocument();
        const mockContext = createDomToModelContext();
        const mockElement = document.createElement('button');

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(mockGroup).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });
});
