import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { handleSelectionMarker } from '../../../lib/modelToDom/handlers/handleSelectionMarker';

describe('handleSelectionMarker', () => {
    it('Handle marker', () => {
        const marker = createSelectionMarker({
            fontFamily: 'Arial',
            fontSize: '20px',
        });
        const parent = document.createElement('div');
        const context = createModelToDomContext();

        handleSelectionMarker(document, parent, marker, context);

        expect(parent.outerHTML).toBe(
            '<div><span style="font-family: Arial; font-size: 20px;"></span></div>'
        );
        expect(context.regularSelection).toEqual({
            current: {
                block: null,
                segment: parent.firstChild!.firstChild,
            },
        });
        expect(parent.firstChild!.firstChild).toEqual(document.createTextNode(''));
    });
});
