import { ContentModelEntityFormat } from 'roosterjs-content-model-types';
import { createDOMHelper } from 'roosterjs-content-model-core/lib/editor/core/DOMHelperImpl';
import {
    addDelimiters,
    findClosestBlockEntityContainer,
    findClosestEntityWrapper,
    generateEntityClassNames,
    getAllEntityWrappers,
    isBlockEntityContainer,
    isEntityDelimiter,
    isEntityElement,
    parseEntityFormat,
} from '../../lib/domUtils/entityUtils';

export function setEntityElementClasses(
    wrapper: HTMLElement,
    type: string,
    isReadonly: boolean,
    id?: string
) {
    wrapper.className = `_Entity _EType_${type} ${id ? `_EId_${id} ` : ''}_EReadonly_${
        isReadonly ? '1' : '0'
    }`;

    if (isReadonly) {
        wrapper.contentEditable = 'false';
    }
}

describe('isEntityElement', () => {
    it('Not an entity', () => {
        const div = document.createElement('div');

        const result = isEntityElement(div);

        expect(result).toBeFalse();
    });

    it('Is an entity', () => {
        const div = document.createElement('div');

        div.className = '_Entity';

        const result = isEntityElement(div);

        expect(result).toBeTrue();
    });
});

describe('parseEntityFormat', () => {
    it('No entity class', () => {
        const div = document.createElement('div');

        div.className = 'test';

        const format = parseEntityFormat(div);

        expect(format).toEqual({
            isFakeEntity: true,
            isReadonly: true,
        });
    });

    it('Entity class', () => {
        const div = document.createElement('div');

        div.className = '_Entity _EId_A _EType_B _EReadonly_1';

        const format = parseEntityFormat(div);

        expect(format).toEqual({
            id: 'A',
            entityType: 'B',
            isReadonly: true,
        });
    });

    it('Fake entity', () => {
        const div = document.createElement('div');

        div.contentEditable = 'true';

        div.className = '_EId_A _EType_B _EReadonly_1';

        const format = parseEntityFormat(div);

        expect(format).toEqual({
            isFakeEntity: true,
            isReadonly: false,
            id: 'A',
            entityType: 'B',
        });
    });

    it('Fake entity, readonly', () => {
        const div = document.createElement('div');

        div.contentEditable = 'false';

        const format = parseEntityFormat(div);

        expect(format).toEqual({
            isFakeEntity: true,
            isReadonly: true,
        });
    });
});

describe('generateEntityClassNames', () => {
    it('Empty format', () => {
        const format: ContentModelEntityFormat = {};

        const className = generateEntityClassNames(format);

        expect(className).toBe('_Entity _EType_ _EReadonly_0');
    });

    it('Format with type', () => {
        const format: ContentModelEntityFormat = {
            entityType: 'A',
        };

        const className = generateEntityClassNames(format);

        expect(className).toBe('_Entity _EType_A _EReadonly_0');
    });

    it('Format with type and id and readonly', () => {
        const format: ContentModelEntityFormat = {
            entityType: 'A',
            id: 'B',
            isReadonly: true,
        };

        const className = generateEntityClassNames(format);

        expect(className).toBe('_Entity _EType_A _EId_B _EReadonly_1');
    });

    it('Fake entity format with type and id and readonly', () => {
        const format: ContentModelEntityFormat = {
            entityType: 'A',
            id: 'B',
            isReadonly: true,
            isFakeEntity: true,
        };

        const className = generateEntityClassNames(format);

        expect(className).toBe('');
    });
});

describe('getAllEntityWrappers', () => {
    it('No entity', () => {
        const div = document.createElement('div');
        div.innerHTML = '<div>test</div>';

        const result = getAllEntityWrappers(div);

        expect(result).toEqual([]);
    });

    it('Has entities', () => {
        const div = document.createElement('div');
        const child1 = document.createElement('span');
        const child2 = document.createElement('span');
        const child3 = document.createElement('span');
        const child4 = document.createElement('span');

        child1.className = 'c1';
        child2.className = '_Entity _EType_A';
        child3.className = 'c3';
        child4.className = '_Entity _EType_B';

        div.appendChild(child1);
        div.appendChild(child2);
        div.appendChild(child3);
        div.appendChild(child4);

        const result = getAllEntityWrappers(div);

        expect(result).toEqual([child2, child4]);
    });
});

describe('isEntityDelimiter', () => {
    it('Not a delimiter - empty span', () => {
        const span = document.createElement('span');

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('Not a delimiter - wrong content', () => {
        const span = document.createElement('span');

        span.className = 'entityDelimiterBefore';
        span.textContent = 'aa';

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('Not a delimiter - wrong class name', () => {
        const span = document.createElement('span');

        span.className = 'test';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('Not a delimiter - wrong tag name', () => {
        const span = document.createElement('div');

        span.className = 'entityDelimiterBefore';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('delimiter before', () => {
        const span = document.createElement('span');

        span.className = 'entityDelimiterBefore';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeTrue();
    });

    it('delimiter after', () => {
        const span = document.createElement('span');

        span.className = 'entityDelimiterAfter';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeTrue();
    });
});

describe('addDelimiters', () => {
    it('no delimiter', () => {
        const parent = document.createElement('div');
        const entity = document.createElement('span');

        parent.appendChild(entity);

        const result = addDelimiters(document, entity);

        expect(parent.innerHTML).toBe(
            '<span class="entityDelimiterBefore">\u200B</span><span></span><span class="entityDelimiterAfter">\u200B</span>'
        );
        expect(result[0]).toBe(parent.lastChild as any);
        expect(result[1]).toBe(parent.firstChild as any);
    });

    it('already has delimiter', () => {
        const parent = document.createElement('div');

        parent.innerHTML =
            '<span class="entityDelimiterBefore">\u200B</span><span class="_Entity"></span><span class="entityDelimiterAfter">\u200B</span>';

        const entity = parent.querySelector('._Entity') as HTMLElement;

        const result = addDelimiters(document, entity);

        expect(parent.innerHTML).toBe(
            '<span class="entityDelimiterBefore">\u200B</span><span class="_Entity"></span><span class="entityDelimiterAfter">\u200B</span>'
        );
        expect(result[0]).toBe(parent.lastChild as any);
        expect(result[1]).toBe(parent.firstChild as any);
    });
});

describe('findClosestEntityWrapper', () => {
    it('no wrapper', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');

        div.appendChild(span);

        const result = findClosestEntityWrapper(span, createDOMHelper(div));

        expect(result).toBeNull();
    });

    it('has wrapper', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const wrapper = document.createElement('div');

        wrapper.className = '_Entity';

        div.appendChild(wrapper);
        wrapper.appendChild(span);

        const result = findClosestEntityWrapper(span, createDOMHelper(div));

        expect(result).toBe(wrapper);
    });
});

describe('findClosestBlockEntityContainer', () => {
    it('no container', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');

        div.appendChild(span);

        const result = findClosestBlockEntityContainer(span, createDOMHelper(div));

        expect(result).toBeNull();
    });

    it('has container', () => {
        const div = document.createElement('div');
        const container = document.createElement('div');
        const wrapper = document.createElement('div');

        container.className = '_E_EBlockEntityContainer';

        div.appendChild(container);
        container.appendChild(wrapper);

        const result = findClosestBlockEntityContainer(wrapper, createDOMHelper(div));

        expect(result).toBe(container);
    });
});

describe('isBlockEntityContainer', () => {
    it('DIV without container class', () => {
        const div = document.createElement('div');

        const result = isBlockEntityContainer(div);

        expect(result).toBeFalse();
    });

    it('SPAN with container class', () => {
        const span = document.createElement('span');

        span.className = '_E_EBlockEntityContainer';

        const result = isBlockEntityContainer(span);

        expect(result).toBeFalse();
    });

    it('DIV with container class', () => {
        const div = document.createElement('div');

        div.className = '_E_EBlockEntityContainer';

        const result = isBlockEntityContainer(div);

        expect(result).toBeTrue();
    });
});
