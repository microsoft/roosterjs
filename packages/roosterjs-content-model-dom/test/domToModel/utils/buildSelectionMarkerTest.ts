import * as addDecorator from '../../../lib/modelApi/common/addDecorators';
import { buildSelectionMarker } from '../../../lib/domToModel/utils/buildSelectionMarker';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';

describe('buildSelectionMarker', () => {
    it('no exiting para, no pending format, no default format, no segment format', () => {
        spyOn(addDecorator, 'addDecorators');

        const group = createContentModelDocument();
        const context = createDomToModelContext();

        const marker = buildSelectionMarker(group, context);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        });
        expect(addDecorator.addDecorators).toHaveBeenCalledWith(marker, context);
    });

    it('no exiting para, no pending format, has default format, has segment format', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        context.defaultFormat = {
            fontFamily: 'Arial',
            fontSize: '9pt',
        };

        context.segmentFormat = {
            fontSize: '10pt',
            textColor: 'red',
        };

        const marker = buildSelectionMarker(group, context);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            format: {
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'red',
            },
            isSelected: true,
        });
    });

    it('no exiting para, has pending format, has default format, has segment format', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const mockedContainer = 'CONTAINER' as any;
        const mockedOffset = 'OFFSET' as any;

        context.pendingFormat = {
            insertPoint: {
                node: mockedContainer,
                offset: mockedOffset,
            },
            format: {
                textColor: 'blue',
                backgroundColor: 'green',
            },
        };

        context.defaultFormat = {
            fontFamily: 'Arial',
            fontSize: '9pt',
        };

        context.segmentFormat = {
            fontSize: '10pt',
            textColor: 'red',
        };

        const marker = buildSelectionMarker(group, context, mockedContainer, mockedOffset);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            format: {
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'blue',
                backgroundColor: 'green',
            },
            isSelected: true,
        });
    });

    it('no exiting para, has pending format but not match, has default format, has segment format', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const mockedContainer = 'CONTAINER' as any;
        const mockedOffset1 = 'OFFSET1' as any;
        const mockedOffset2 = 'OFFSET2' as any;

        context.pendingFormat = {
            insertPoint: {
                node: mockedContainer,
                offset: mockedOffset1,
            },
            format: {
                textColor: 'blue',
                backgroundColor: 'green',
            },
        };

        context.defaultFormat = {
            fontFamily: 'Arial',
            fontSize: '9pt',
        };

        context.segmentFormat = {
            fontSize: '10pt',
            textColor: 'red',
        };

        const marker = buildSelectionMarker(group, context, mockedContainer, mockedOffset2);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            format: {
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'red',
            },
            isSelected: true,
        });
    });

    it('has exiting para and format', () => {
        spyOn(addDecorator, 'addDecorators');

        const group = createContentModelDocument();
        const para = createParagraph(false, undefined, { fontFamily: 'Arial' });

        group.blocks.push(para);

        const context = createDomToModelContext();

        const marker = buildSelectionMarker(group, context);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            format: { fontFamily: 'Arial', fontSize: undefined },
            isSelected: true,
        });
        expect(addDecorator.addDecorators).toHaveBeenCalledWith(marker, context);
    });

    it('has exiting para and format, has decorator', () => {
        spyOn(addDecorator, 'addDecorators');

        const group = createContentModelDocument();
        const para = createParagraph(false, undefined, { fontFamily: 'Arial' });

        para.decorator = {
            tagName: 'div',
            format: {
                fontFamily: 'Tahoma',
            },
        };

        group.blocks.push(para);

        const context = createDomToModelContext();

        const marker = buildSelectionMarker(group, context);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            format: { fontFamily: 'Tahoma', fontSize: undefined },
            isSelected: true,
        });
        expect(addDecorator.addDecorators).toHaveBeenCalledWith(marker, context);
    });

    it('has everything', () => {
        spyOn(addDecorator, 'addDecorators');

        const group = createContentModelDocument();
        const para = createParagraph(false, undefined, { fontFamily: 'Arial' });

        para.decorator = {
            tagName: 'div',
            format: {
                fontFamily: 'Tahoma',
            },
        };

        group.blocks.push(para);

        const context = createDomToModelContext();
        const mockedContainer = 'CONTAINER' as any;
        const mockedOffset = 'OFFSET' as any;

        context.pendingFormat = {
            insertPoint: {
                node: mockedContainer,
                offset: mockedOffset,
            },
            format: {
                textColor: 'blue',
                backgroundColor: 'green',
            },
        };

        context.defaultFormat = {
            fontFamily: 'Arial',
            fontSize: '9pt',
        };

        context.segmentFormat = {
            fontSize: '10pt',
            textColor: 'red',
        };

        const marker = buildSelectionMarker(group, context, mockedContainer, mockedOffset);

        expect(marker).toEqual({
            segmentType: 'SelectionMarker',
            format: {
                fontFamily: 'Tahoma',
                fontSize: '10pt',
                textColor: 'blue',
                backgroundColor: 'green',
            },
            isSelected: true,
        });
        expect(addDecorator.addDecorators).toHaveBeenCalledWith(marker, context);
    });
});
