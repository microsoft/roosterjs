import * as insertEntityApi from 'roosterjs-content-model-api/lib/publicApi/entity/insertEntity';
import { MathEntityType, MathPlugin } from '../../lib/math/MathPlugin';
import type { ContentModelEntity, IEditor, PluginEvent } from 'roosterjs-content-model-types';

describe('MathPlugin', () => {
    let editor: IEditor;
    let insertEntitySpy: jasmine.Spy;

    beforeEach(() => {
        insertEntitySpy = spyOn(insertEntityApi, 'insertEntity');
        editor = {} as any;
    });

    function createEntityWithWrapper(isBlock: boolean): ContentModelEntity {
        const wrapper = document.createElement(isBlock ? 'div' : 'span');
        return {
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            entityFormat: { entityType: MathEntityType, isReadonly: true },
            wrapper,
        };
    }

    it('getName', () => {
        const plugin = new MathPlugin();
        expect(plugin.getName()).toBe('Math');
    });

    it('insertMath uses default renderer (raw latex text)', () => {
        const entity = createEntityWithWrapper(false);
        insertEntitySpy.and.returnValue(entity);

        const plugin = new MathPlugin();
        plugin.initialize(editor);

        const result = plugin.insertMath('a^2 + b^2', false);

        expect(insertEntitySpy).toHaveBeenCalledWith(editor, MathEntityType, false, 'focus');
        expect(result).toBe(entity);
        expect(entity.wrapper.getAttribute('data-latex')).toBe('a^2 + b^2');
        expect(entity.wrapper.textContent).toBe('a^2 + b^2');
    });

    it('insertMath uses custom renderer with correct isBlock', () => {
        const entity = createEntityWithWrapper(true);
        insertEntitySpy.and.returnValue(entity);

        const renderer = jasmine
            .createSpy('renderer')
            .and.callFake((latex: string, isBlock: boolean, doc: Document) => {
                const el = doc.createElement('span');
                el.textContent = `${isBlock ? 'block' : 'inline'}:${latex}`;
                return el;
            });

        const plugin = new MathPlugin({ renderer });
        plugin.initialize(editor);

        plugin.insertMath('\\frac{1}{2}', true);

        expect(renderer).toHaveBeenCalledWith('\\frac{1}{2}', true, entity.wrapper.ownerDocument);
        expect(entity.wrapper.textContent).toBe('block:\\frac{1}{2}');
    });

    it('insertMath returns null when editor is not initialized', () => {
        const plugin = new MathPlugin();
        expect(plugin.insertMath('x', false)).toBeNull();
        expect(insertEntitySpy).not.toHaveBeenCalled();
    });

    it('renders on newEntity event for a Math entity from saved content', () => {
        const renderer = jasmine
            .createSpy('renderer')
            .and.callFake((latex: string, _isBlock: boolean, doc: Document) =>
                doc.createTextNode('rendered:' + latex)
            );
        const plugin = new MathPlugin({ renderer });
        plugin.initialize(editor);

        const wrapper = document.createElement('span');
        wrapper.setAttribute('data-latex', 'x_1');
        wrapper.textContent = 'stale';

        const event: PluginEvent = {
            eventType: 'entityOperation',
            operation: 'newEntity',
            entity: { type: MathEntityType, id: '1', wrapper, isReadonly: true },
        } as any;

        plugin.onPluginEvent(event);

        expect(renderer).toHaveBeenCalledWith('x_1', false, wrapper.ownerDocument);
        expect(wrapper.textContent).toBe('rendered:x_1');
    });

    it('collapses runs of "=" in latex before rendering', () => {
        const renderer = jasmine
            .createSpy('renderer')
            .and.callFake((latex: string, _isBlock: boolean, doc: Document) =>
                doc.createTextNode(latex)
            );
        const plugin = new MathPlugin({ renderer });
        plugin.initialize(editor);

        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-latex', '|\\psi\\rangle\n===============\ne^{-iHt}');

        const event: PluginEvent = {
            eventType: 'entityOperation',
            operation: 'newEntity',
            entity: { type: MathEntityType, id: '1', wrapper, isReadonly: true },
        } as any;

        plugin.onPluginEvent(event);

        expect(renderer).toHaveBeenCalledWith(
            '|\\psi\\rangle\n=\ne^{-iHt}',
            true,
            wrapper.ownerDocument
        );
    });

    it('ignores newEntity event for non-Math entity', () => {
        const renderer = jasmine.createSpy('renderer');
        const plugin = new MathPlugin({ renderer });
        plugin.initialize(editor);

        const wrapper = document.createElement('span');
        wrapper.setAttribute('data-latex', 'x_1');

        const event: PluginEvent = {
            eventType: 'entityOperation',
            operation: 'newEntity',
            entity: { type: 'NotMath', id: '1', wrapper, isReadonly: true },
        } as any;

        plugin.onPluginEvent(event);

        expect(renderer).not.toHaveBeenCalled();
    });

    it('skips rendering when data-latex attribute is missing', () => {
        const renderer = jasmine.createSpy('renderer');
        const plugin = new MathPlugin({ renderer });
        plugin.initialize(editor);

        const wrapper = document.createElement('span');
        wrapper.textContent = 'unchanged';

        const event: PluginEvent = {
            eventType: 'entityOperation',
            operation: 'newEntity',
            entity: { type: MathEntityType, id: '1', wrapper, isReadonly: true },
        } as any;

        plugin.onPluginEvent(event);

        expect(renderer).not.toHaveBeenCalled();
        expect(wrapper.textContent).toBe('unchanged');
    });
});
