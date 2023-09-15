import DarkColorHandlerImpl from 'roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createText } from '../../../lib/modelApi/creators/createText';
import { handleSegmentCommon } from '../../../lib/modelToDom/utils/handleSegmentCommon';

describe('handleSegmentCommon', () => {
    it('txt', () => {
        const txt = document.createTextNode('test');
        const container = document.createElement('span');
        const segment = createText('test', {
            textColor: 'red',
            fontSize: '10pt',
            lineHeight: '2',
            fontWeight: 'bold',
        });
        const newNodes: Node[] = [];
        const context = createModelToDomContext();

        context.darkColorHandler = new DarkColorHandlerImpl(
            document.createElement('div'),
            s => 'darkMock: ' + s
        );

        segment.link = {
            dataset: {},
            format: {
                href: 'href',
            },
        };

        handleSegmentCommon(document, txt, container, segment, context, {} as any, newNodes);

        expect(context.regularSelection.current.segment).toBe(txt);
        expect(container.outerHTML).toBe(
            '<span style="font-size: 10pt; color: red; line-height: 2;"><b><a href="href"></a></b></span>'
        );
        expect(newNodes.length).toBe(1);
        expect(newNodes[0]).toBe(txt);
    });

    it('element with child', () => {
        const child = document.createTextNode('child');
        const parent = document.createElement('span');

        parent.appendChild(child);

        const container = document.createElement('span');
        const segment = createText('test', {});
        const context = createModelToDomContext();

        handleSegmentCommon(document, parent, container, segment, context, {} as any);

        expect(context.regularSelection.current.segment).toBe(null);
        expect(container.outerHTML).toBe('<span></span>');
    });
});
