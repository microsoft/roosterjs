import * as addSegment from 'roosterjs-content-model-dom/lib/modelApi/common/addSegment';
import * as createText from 'roosterjs-content-model-dom/lib/modelApi/creators/createText';
import { ContentModelBlockGroup } from 'roosterjs-content-model-types';
import { pasteButtonProcessor } from '../../lib/paste/PastePlugin';

describe('pasteButtonProcessor', () => {
    let mockGroup: ContentModelBlockGroup;
    let mockElement: HTMLButtonElement;
    let mockContext: any;
    let createTextSpy: jasmine.Spy;
    let addSegmentSpy: jasmine.Spy;
    let mockSegment: any;

    beforeEach(() => {
        // Set up mocks
        mockGroup = {} as ContentModelBlockGroup;
        mockElement = document.createElement('button');
        mockContext = {
            segmentFormat: {
                fontFamily: 'Arial',
            },
        };
        mockSegment = { test: 'segment' } as any;

        // Spy on the imported functions
        createTextSpy = spyOn(createText, 'createText').and.returnValue(mockSegment);
        addSegmentSpy = spyOn(addSegment, 'addSegment').and.callFake(() => <any>{});
    });

    it('extracts text content from button and adds it as segment', () => {
        // Arrange
        const buttonText = 'Click me';
        mockElement.textContent = buttonText;

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(createTextSpy).toHaveBeenCalledWith(buttonText, mockContext.segmentFormat);
        expect(addSegmentSpy).toHaveBeenCalledWith(mockGroup, mockSegment);
    });

    it('handles empty button content by using empty string', () => {
        // Arrange
        mockElement.textContent = '';

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(createTextSpy).toHaveBeenCalledWith('', mockContext.segmentFormat);
        expect(addSegmentSpy).toHaveBeenCalledWith(mockGroup, mockSegment);
    });

    it('handles null button content by using empty string', () => {
        // Arrange
        mockElement.textContent = null;

        // Act
        pasteButtonProcessor(mockGroup, mockElement, mockContext);

        // Assert
        expect(createTextSpy).toHaveBeenCalledWith('', mockContext.segmentFormat);
        expect(addSegmentSpy).toHaveBeenCalledWith(mockGroup, mockSegment);
    });
});
