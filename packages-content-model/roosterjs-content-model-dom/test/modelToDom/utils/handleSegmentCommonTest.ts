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
        const onNodeCreated = jasmine.createSpy('onNodeCreated');
        const context = createModelToDomContext();

        context.onNodeCreated = onNodeCreated;
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
        container.appendChild(txt);
        const segmentNodes: Node[] = [];

        handleSegmentCommon(document, txt, container, segment, context, segmentNodes);

        expect(context.regularSelection.current.segment).toBe(txt);
        expect(container.outerHTML).toBe(
            '<span style="font-size: 10pt; color: red; line-height: 2;"><b><a href="href">test</a></b></span>'
        );
        expect(onNodeCreated).toHaveBeenCalledWith(segment, txt);
        expect(segmentNodes.length).toBe(2);
        expect(segmentNodes[0]).toBe(txt);
        expect(segmentNodes[1]).toBe(txt.parentNode!);
    });

    it('element with child', () => {
        const child = document.createTextNode('child');
        const parent = document.createElement('span');

        parent.appendChild(child);

        const container = document.createElement('span');
        const segment = createText('test', {});
        const onNodeCreated = jasmine.createSpy('onNodeCreated');
        const context = createModelToDomContext();
        const segmentNodes: Node[] = [];

        context.onNodeCreated = onNodeCreated;
        container.appendChild(parent);
        handleSegmentCommon(document, parent, container, segment, context, segmentNodes);

        expect(context.regularSelection.current.segment).toBe(null);
        expect(container.outerHTML).toBe('<span><span>child</span></span>');
        expect(onNodeCreated).toHaveBeenCalledWith(segment, parent);
        expect(segmentNodes.length).toBe(1);
        expect(segmentNodes[0]).toBe(parent);
    });
});
