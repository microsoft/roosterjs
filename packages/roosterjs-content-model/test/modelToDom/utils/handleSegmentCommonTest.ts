import DarkColorHandlerImpl from '../../../../roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
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
        const context = createModelToDomContext(undefined, {
            onNodeCreated,
        });
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

        handleSegmentCommon(document, txt, container, segment, context);

        expect(context.regularSelection.current.segment).toBe(txt);
        expect(container.outerHTML).toBe(
            '<span style="font-size: 10pt; color: red; line-height: 2;"><b><a href="href"></a></b></span>'
        );
        expect(onNodeCreated).toHaveBeenCalledWith(segment, txt);
    });

    it('element with child', () => {
        const child = document.createTextNode('child');
        const parent = document.createElement('span');

        parent.appendChild(child);

        const container = document.createElement('span');
        const segment = createText('test', {});
        const onNodeCreated = jasmine.createSpy('onNodeCreated');
        const context = createModelToDomContext(undefined, {
            onNodeCreated,
        });

        handleSegmentCommon(document, parent, container, segment, context);

        expect(context.regularSelection.current.segment).toBe(null);
        expect(container.outerHTML).toBe('<span></span>');
        expect(onNodeCreated).toHaveBeenCalledWith(segment, parent);
    });
});
