import {
    default as mergeFragmentWithEntity,
    preprocessEntitiesFromContentModel,
} from '../../lib/publicApi/mergeFragmentWithEntity';

describe('preprocessEntitiesFromContentModel', () => {
    it('empty array', () => {
        const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel([]);

        expect(reusableWrappers).toEqual([]);
        expect(placeholders).toEqual([]);
    });

    it('single entry without parent', () => {
        const wrapper = document.createElement('div');
        const placeholder = document.createComment('test');

        const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel([
            {
                entityWrapper: wrapper,
                placeholder: placeholder,
            },
        ]);

        expect(reusableWrappers).toEqual([]);
        expect(placeholders).toEqual([]);
        expect(wrapper.parentNode).toBeNull();
        expect(placeholder.parentNode).toBeNull();
    });

    it('single entry with parent, no reuse', () => {
        const target = document.createElement('div');
        const wrapper = document.createElement('div');
        target.appendChild(wrapper);

        const source = document.createDocumentFragment();
        const placeholder = document.createComment('test');
        source.appendChild(placeholder);

        const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel([
            {
                entityWrapper: wrapper,
                placeholder: placeholder,
            },
        ]);

        expect(reusableWrappers).toEqual([]);
        expect(placeholders).toEqual([]);
        expect(wrapper.parentNode).toBe(source);
        expect(placeholder.parentNode).toBeNull();
        expect(target.outerHTML).toBe('<div></div>');
    });

    it('two entry with parent, reuse one', () => {
        const target = document.createElement('div');

        const wrapper1 = document.createElement('div');
        wrapper1.id = 'id1';
        target.appendChild(wrapper1);

        const entityParent = document.createElement('div');
        const wrapper2 = document.createElement('div');
        wrapper2.id = 'id2';
        entityParent.appendChild(wrapper2);
        target.appendChild(entityParent);

        const source = document.createDocumentFragment();
        const placeholder1 = document.createComment('test1');
        const placeholder2 = document.createComment('test2');
        source.appendChild(placeholder1);
        source.appendChild(placeholder2);

        const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel(
            [
                {
                    entityWrapper: wrapper1,
                    placeholder: placeholder1,
                },
                {
                    entityWrapper: wrapper2,
                    placeholder: placeholder2,
                },
            ],
            source,
            target
        );

        expect(reusableWrappers).toEqual([wrapper1]);
        expect(placeholders).toEqual([placeholder1]);
        expect(wrapper1.parentNode).toBe(target);
        expect(wrapper2.parentNode).toBe(source);
        expect(placeholder1.parentNode).toBe(source);
        expect(placeholder2.parentNode).toBeNull();
        expect(target.outerHTML).toBe('<div><div id="id1"></div><div></div></div>');
        expect(source.firstChild).toBe(placeholder1);
        expect(source.lastChild).toBe(wrapper2);
    });

    it('two entry, reuse both', () => {
        const target = document.createElement('div');

        const wrapper1 = document.createElement('div');
        wrapper1.id = 'id1';
        target.appendChild(wrapper1);

        const wrapper2 = document.createElement('div');
        wrapper2.id = 'id2';
        target.appendChild(wrapper2);

        const source = document.createDocumentFragment();
        const placeholder1 = document.createComment('test1');
        const placeholder2 = document.createComment('test2');
        source.appendChild(placeholder1);
        source.appendChild(placeholder2);

        const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel(
            [
                {
                    entityWrapper: wrapper1,
                    placeholder: placeholder1,
                },
                {
                    entityWrapper: wrapper2,
                    placeholder: placeholder2,
                },
            ],
            source,
            target
        );

        expect(reusableWrappers).toEqual([wrapper1, wrapper2]);
        expect(placeholders).toEqual([placeholder1, placeholder2]);
        expect(wrapper1.parentNode).toBe(target);
        expect(wrapper2.parentNode).toBe(target);
        expect(placeholder1.parentNode).toBe(source);
        expect(placeholder2.parentNode).toBe(source);
        expect(target.outerHTML).toBe('<div><div id="id1"></div><div id="id2"></div></div>');
        expect(source.firstChild).toBe(placeholder1);
        expect(source.lastChild).toBe(placeholder2);
    });

    it('two entry in wrong order', () => {
        const target = document.createElement('div');

        const wrapper1 = document.createElement('div');
        wrapper1.id = 'id1';
        target.appendChild(wrapper1);

        const wrapper2 = document.createElement('div');
        wrapper2.id = 'id2';
        target.appendChild(wrapper2);

        const source = document.createDocumentFragment();
        const placeholder1 = document.createComment('test1');
        const placeholder2 = document.createComment('test2');
        source.appendChild(placeholder2);
        source.appendChild(placeholder1);

        const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel(
            [
                {
                    entityWrapper: wrapper1,
                    placeholder: placeholder1,
                },
                {
                    entityWrapper: wrapper2,
                    placeholder: placeholder2,
                },
            ],
            source,
            target
        );

        expect(reusableWrappers).toEqual([wrapper1]);
        expect(placeholders).toEqual([placeholder1]);
        expect(wrapper1.parentNode).toBe(target);
        expect(wrapper2.parentNode).toBe(source);
        expect(placeholder1.parentNode).toBe(source);
        expect(placeholder2.parentNode).toBeNull();
        expect(target.outerHTML).toBe('<div><div id="id1"></div></div>');
        expect(source.firstChild).toBe(wrapper2);
        expect(source.lastChild).toBe(placeholder1);
    });
});

describe('mergeFragmentWithEntity', () => {
    it('empty fragment', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        target.innerHTML = '<b>test</b>';

        mergeFragmentWithEntity(source, target, []);

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

        mergeFragmentWithEntity(source, target, []);

        expect(target.innerHTML).toBe('<div id="id1"></div><div id="id2"></div>');
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
    });

    it('fragment with entity, no reuse', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const placeholder = document.createComment('test');

        div1.id = 'id1';
        div2.id = 'id2';
        div1.appendChild(placeholder);

        source.appendChild(div1);
        source.appendChild(div2);

        const wrapper = document.createElement('div');
        wrapper.id = 'entity1';

        target.innerHTML = '<b>test</b>';

        mergeFragmentWithEntity(source, target, [
            {
                entityWrapper: wrapper,
                placeholder: placeholder,
            },
        ]);

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
        const placeholder = document.createComment('test');

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

        mergeFragmentWithEntity(source, target, [
            {
                entityWrapper: wrapper,
                placeholder: placeholder,
            },
        ]);

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity1"></div><div id="id2"></div>'
        );
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
    });

    it('2 reusable entity side by side in source', () => {
        const target = document.createElement('div');
        const source = document.createDocumentFragment();

        const div1 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div5 = document.createElement('div');
        const div6 = document.createElement('div');
        const placeholder1 = document.createComment('test1');
        const placeholder2 = document.createComment('test2');

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

        mergeFragmentWithEntity(source, target, [
            {
                entityWrapper: wrapper1,
                placeholder: placeholder1,
            },
            {
                entityWrapper: wrapper2,
                placeholder: placeholder2,
            },
        ]);

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
        const placeholder1 = document.createComment('test1');
        const placeholder2 = document.createComment('test2');

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

        mergeFragmentWithEntity(source, target, [
            {
                entityWrapper: wrapper1,
                placeholder: placeholder1,
            },
            {
                entityWrapper: wrapper2,
                placeholder: placeholder2,
            },
        ]);

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity1"></div><div id="id2"></div><div id="entity2"></div><div id="id3"></div>'
        );
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
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
        const placeholder1 = document.createComment('test1');
        const placeholder2 = document.createComment('test2');

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

        mergeFragmentWithEntity(source, target, [
            {
                entityWrapper: wrapper1,
                placeholder: placeholder1,
            },
            {
                entityWrapper: wrapper2,
                placeholder: placeholder2,
            },
        ]);

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity1"></div><div id="id2"></div><div id="entity2"></div><div id="id3"></div>'
        );
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
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
        const placeholder1 = document.createComment('test1');
        const placeholder2 = document.createComment('test2');

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

        mergeFragmentWithEntity(source, target, [
            {
                entityWrapper: wrapper1,
                placeholder: placeholder1,
            },
            {
                entityWrapper: wrapper2,
                placeholder: placeholder2,
            },
        ]);

        expect(target.innerHTML).toBe(
            '<div id="id1"></div><div id="entity2"></div><div id="id2"></div><div id="entity1"></div><div id="id3"></div>'
        );
        expect(source.firstChild).toBeNull();
        expect(source.lastChild).toBeNull();
    });
});
