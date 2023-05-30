import { Entity } from 'roosterjs-editor-types';
import {
    createEntityPlaceholder,
    moveContentWithEntityPlaceholders,
    restoreContentWithEntityPlaceholder,
} from '../../lib/entity/entityPlaceholderUtils';

describe('createEntityPlaceholder', () => {
    it('', () => {
        const div = document.createElement('div');
        const entity: Entity = {
            type: 'a',
            id: 'b',
            wrapper: div,
            isReadonly: false,
        };
        const placeholder = createEntityPlaceholder(entity);

        expect(placeholder.outerHTML).toBe('<entity-placeholder id="b"></entity-placeholder>');
    });
});

describe('moveContentWithEntityPlaceholders', () => {
    it('empty dom', () => {
        const div = document.createElement('div');
        const entities: Record<string, HTMLElement> = {};

        const fragment = moveContentWithEntityPlaceholders(div, entities);

        const resultDiv = document.createElement('div');
        resultDiv.appendChild(fragment);

        expect(div.innerHTML).toBe('');
        expect(resultDiv.innerHTML).toBe('');
        expect(entities).toEqual({});
    });

    it('no entity', () => {
        const div = document.createElement('div');
        const entities: Record<string, HTMLElement> = {};

        div.innerHTML = 'test1<span>test2</span>test3';

        const fragment = moveContentWithEntityPlaceholders(div, entities);

        const resultDiv = document.createElement('div');
        resultDiv.appendChild(fragment);

        expect(div.innerHTML).toBe('');
        expect(resultDiv.innerHTML).toBe('test1<span>test2</span>test3');
        expect(entities).toEqual({});
    });

    it('single entity', () => {
        const div = document.createElement('div');
        const entities: Record<string, HTMLElement> = {};

        div.innerHTML = '<div class="_Entity _EType_a _EId_a"></div>';

        const fragment = moveContentWithEntityPlaceholders(div, entities);

        const resultDiv = document.createElement('div');
        resultDiv.appendChild(fragment);

        expect(div.innerHTML).toBe('<div class="_Entity _EType_a _EId_a"></div>');
        expect(resultDiv.innerHTML).toBe('<div class="_Entity _EType_a _EId_a"></div>');
        expect(entities).toEqual({
            a: div.firstChild as HTMLElement,
        });
    });

    it('two entities with other nodes', () => {
        const div = document.createElement('div');
        const entities: Record<string, HTMLElement> = {};

        const node1 = document.createTextNode('test1');
        const node2 = document.createElement('div');
        const node3 = document.createElement('div');
        const node4 = document.createElement('div');
        const node5 = document.createElement('div');

        node2.className = '_Entity _EType_a _EId_a';
        node3.id = 'node3';
        node4.className = '_Entity _EType_b _EId_b';
        node5.textContent = 'test5';

        div.appendChild(node1);
        div.appendChild(node2);
        div.appendChild(node3);
        div.appendChild(node4);
        div.appendChild(node5);

        const fragment = moveContentWithEntityPlaceholders(div, entities);

        const resultDiv = document.createElement('div');
        resultDiv.appendChild(fragment);

        expect(div.innerHTML).toBe(
            '<div class="_Entity _EType_a _EId_a"></div><div class="_Entity _EType_b _EId_b"></div>'
        );
        expect(resultDiv.innerHTML).toBe(
            'test1<div class="_Entity _EType_a _EId_a"></div><div id="node3"></div><div class="_Entity _EType_b _EId_b"></div><div>test5</div>'
        );
        expect(entities).toEqual({
            a: node2,
            b: node4,
        });
    });

    it('with inner entities', () => {
        const div = document.createElement('div');
        const entities: Record<string, HTMLElement> = {};

        const node1 = document.createTextNode('test1');
        const node2 = document.createElement('div');
        const node3 = document.createElement('div');
        const node4 = document.createElement('div');
        const node5 = document.createElement('div');

        node2.className = '_Entity _EType_a _EId_a';
        node3.id = 'node3';
        node4.className = '_Entity _EType_b _EId_b';
        node5.textContent = 'test5';

        node3.appendChild(node4);

        div.appendChild(node1);
        div.appendChild(node2);
        div.appendChild(node3);
        div.appendChild(node5);

        const fragment = moveContentWithEntityPlaceholders(div, entities);

        const resultDiv = document.createElement('div');
        resultDiv.appendChild(fragment);

        expect(div.innerHTML).toBe('<div class="_Entity _EType_a _EId_a"></div>');
        expect(resultDiv.innerHTML).toBe(
            'test1<div class="_Entity _EType_a _EId_a"></div><div id="node3"><div class="_Entity _EType_b _EId_b"></div></div><div>test5</div>'
        );
        expect(entities).toEqual({
            a: node2,
            b: node4,
        });
    });
});

describe('restoreContentWithEntityPlaceholder', () => {
    it('empty fragment', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        target.innerHTML = '<b>test</b>';

        restoreContentWithEntityPlaceholder(source, target, {});

        expect(target.innerHTML).toBe('');
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
    });

    it('fragment without entity', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        div1.id = 'id1';
        div2.id = 'id2';

        source.appendChild(div1);
        source.appendChild(div2);

        target.innerHTML = '<b>test</b>';

        restoreContentWithEntityPlaceholder(source, target, {});

        expect(target.innerHTML).toBe('<div id="id1"></div><div id="id2"></div>');
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
    });

    it('fragment with entity, no reuse', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const placeholder = document.createElement('span');

        placeholder.className = '_Entity _EType_Test _EId_entity1';

        div1.id = 'id1';
        div2.id = 'id2';
        div1.appendChild(placeholder);

        source.appendChild(div1);
        source.appendChild(div2);

        const wrapper = document.createElement('div');
        wrapper.id = 'entity1';

        target.innerHTML = '<b>test</b>';

        restoreContentWithEntityPlaceholder(source, target, {
            entity1: wrapper,
        });

        expect(target.innerHTML).toBe(
            '<div id="id1"><div id="entity1"></div></div><div id="id2"></div>'
        );
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
    });

    it('1 reusable entity', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const placeholder = document.createElement('span');

        placeholder.className = '_Entity _EType_Test _EId_entity1';

        div1.id = 'id1';
        div2.id = 'id2';
        div3.id = 'id3';
        div4.id = 'id4';

        source.appendChild(div1);
        source.appendChild(placeholder);
        source.appendChild(div2);

        const wrapper = document.createElement('div');
        wrapper.id = 'entity1';

        target.appendChild(div3);
        target.appendChild(wrapper);
        target.appendChild(div4);

        restoreContentWithEntityPlaceholder(source, target, {
            entity1: wrapper,
        });

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity1"></div><div id="id2"></div>'
        );
    });

    it('2 reusable entity side by side in source', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div5 = document.createElement('div');
        const div6 = document.createElement('div');
        const placeholder1 = document.createElement('span');
        const placeholder2 = document.createElement('span');

        placeholder1.className = '_Entity _EType_Test _EId_entity1';
        placeholder2.className = '_Entity _EType_Test _EId_entity2';

        div1.id = 'id1';
        div3.id = 'id3';
        div4.id = 'id4';
        div5.id = 'id5';
        div6.id = 'id6';

        source.appendChild(div1);
        source.appendChild(placeholder1);
        source.appendChild(placeholder2);
        source.appendChild(div3);

        const wrapper1 = document.createElement('div');
        const wrapper2 = document.createElement('div');
        wrapper1.id = 'entity1';
        wrapper2.id = 'entity2';

        target.appendChild(div4);
        target.appendChild(wrapper1);
        target.appendChild(div5);
        target.appendChild(wrapper2);
        target.appendChild(div6);

        restoreContentWithEntityPlaceholder(source, target, {
            entity1: wrapper1,
            entity2: wrapper2,
        });

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity1"></div><div id="entity2"></div><div id="id3"></div>'
        );
    });

    it('2 reusable entity side by side in target', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div6 = document.createElement('div');
        const placeholder1 = document.createElement('span');
        const placeholder2 = document.createElement('span');

        placeholder1.className = '_Entity _EType_Test _EId_entity1';
        placeholder2.className = '_Entity _EType_Test _EId_entity2';

        div1.id = 'id1';
        div2.id = 'id2';
        div3.id = 'id3';
        div4.id = 'id4';
        div6.id = 'id6';

        source.appendChild(div1);
        source.appendChild(placeholder1);
        source.appendChild(div2);
        source.appendChild(placeholder2);
        source.appendChild(div3);

        const wrapper1 = document.createElement('div');
        const wrapper2 = document.createElement('div');
        wrapper1.id = 'entity1';
        wrapper2.id = 'entity2';

        target.appendChild(div4);
        target.appendChild(wrapper1);
        target.appendChild(wrapper2);
        target.appendChild(div6);

        restoreContentWithEntityPlaceholder(source, target, {
            entity1: wrapper1,
            entity2: wrapper2,
        });

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity1"></div><div id="id2"></div><div id="entity2"></div><div id="id3"></div>'
        );
    });

    it('2 reusable entity in right order', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div5 = document.createElement('div');
        const div6 = document.createElement('div');
        const placeholder1 = document.createElement('span');
        const placeholder2 = document.createElement('span');

        placeholder1.className = '_Entity _EType_Test _EId_entity1';
        placeholder2.className = '_Entity _EType_Test _EId_entity2';

        div1.id = 'id1';
        div2.id = 'id2';
        div3.id = 'id3';
        div4.id = 'id4';
        div5.id = 'id5';
        div6.id = 'id6';

        source.appendChild(div1);
        source.appendChild(placeholder1);
        source.appendChild(div2);
        source.appendChild(placeholder2);
        source.appendChild(div3);

        const wrapper1 = document.createElement('div');
        const wrapper2 = document.createElement('div');
        wrapper1.id = 'entity1';
        wrapper2.id = 'entity2';

        target.appendChild(div4);
        target.appendChild(wrapper1);
        target.appendChild(div5);
        target.appendChild(wrapper2);
        target.appendChild(div6);

        restoreContentWithEntityPlaceholder(source, target, {
            entity1: wrapper1,
            entity2: wrapper2,
        });

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity1"></div><div id="id2"></div><div id="entity2"></div><div id="id3"></div>'
        );
    });

    it('2 reusable entity in wrong order', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div5 = document.createElement('div');
        const div6 = document.createElement('div');
        const placeholder1 = document.createElement('span');
        const placeholder2 = document.createElement('span');

        placeholder1.className = '_Entity _EType_Test _EId_entity1';
        placeholder2.className = '_Entity _EType_Test _EId_entity2';

        div1.id = 'id1';
        div2.id = 'id2';
        div3.id = 'id3';
        div4.id = 'id4';
        div5.id = 'id5';
        div6.id = 'id6';

        source.appendChild(div1);
        source.appendChild(placeholder2);
        source.appendChild(div2);
        source.appendChild(placeholder1);
        source.appendChild(div3);

        const wrapper1 = document.createElement('div');
        const wrapper2 = document.createElement('div');
        wrapper1.id = 'entity1';
        wrapper2.id = 'entity2';

        target.appendChild(div4);
        target.appendChild(wrapper1);
        target.appendChild(div5);
        target.appendChild(wrapper2);
        target.appendChild(div6);

        restoreContentWithEntityPlaceholder(source, target, {
            entity1: wrapper1,
            entity2: wrapper2,
        });

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity2"></div><div id="id2"></div><div id="entity1"></div><div id="id3"></div>'
        );
    });

    it('restoreContentWithEntityPlaceholder and entity map', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div5 = document.createElement('div');
        const div6 = document.createElement('div');
        const placeholder1 = document.createElement('span');
        const placeholder2 = document.createElement('span');

        placeholder1.className = '_Entity _EType_Test _EId_entity1';
        placeholder2.className = '_Entity _EType_Test _EId_entity2';

        div1.id = 'id1';
        div2.id = 'id2';
        div3.id = 'id3';
        div4.id = 'id4';
        div5.id = 'id5';
        div6.id = 'id6';

        source.appendChild(div1);
        source.appendChild(placeholder2);
        source.appendChild(div2);
        source.appendChild(placeholder1);
        source.appendChild(div3);

        const wrapper1 = document.createElement('div');
        const wrapper2 = document.createElement('div');
        wrapper1.id = 'entity1';
        wrapper2.id = 'entity2';

        target.appendChild(div4);
        target.appendChild(wrapper1);
        target.appendChild(div5);
        target.appendChild(wrapper2);
        target.appendChild(div6);

        restoreContentWithEntityPlaceholder(source, target, {
            entity1: { element: wrapper1 },
            entity2: { element: wrapper2, canPersist: true },
        });

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity2"></div><div id="id2"></div><span class="_Entity _EType_Test _EId_entity1"></span><div id="id3"></div>'
        );
        expect(target.childNodes[0]).toBe(div1);
        expect(target.childNodes[1]).toBe(wrapper2);
        expect(target.childNodes[2]).toBe(div2);
        expect(target.childNodes[3]).toBe(placeholder1);
        expect(target.childNodes[4]).toBe(div3);
    });
});
