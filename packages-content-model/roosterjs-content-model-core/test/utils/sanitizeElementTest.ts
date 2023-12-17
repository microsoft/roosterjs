import { AllowedTags, DisallowedTags } from '../../lib/utils/allowedTags';
import { sanitizeElement } from '../../lib/utils/sanitizeElement';

describe('sanitizeElement', () => {
    it('Allowed element, empty', () => {
        const element = document.createElement('div');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<div></div>');
        expect(result!.outerHTML).toBe('<div></div>');
    });

    it('Allowed element, with child', () => {
        const element = document.createElement('div');

        element.id = 'a';
        element.className = 'b c';
        element.innerHTML = 'test1<span>test2</span>test3';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe(
            '<div id="a" class="b c">test1<span>test2</span>test3</div>'
        );
        expect(result!.outerHTML).toBe('<div class="b c">test1<span>test2</span>test3</div>');
    });

    it('Empty element with disallowed tag', () => {
        const element = document.createElement('script');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<script></script>');
        expect(result).toBeNull();
    });

    it('Empty element with additional disallowed tag', () => {
        const element = document.createElement('div');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags.concat(['div']));

        expect(element.outerHTML).toBe('<div></div>');
        expect(result).toBeNull();
    });

    it('Empty element with additional allowed tag', () => {
        const element = document.createElement('test');

        const result = sanitizeElement(element, AllowedTags.concat('test'), DisallowedTags);

        expect(element.outerHTML).toBe('<test></test>');
        expect(result!.outerHTML).toBe('<test></test>');
    });

    it('Empty element with unrecognized tag', () => {
        const element = document.createElement('test');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<test></test>');
        expect(result!.outerHTML).toBe('<span></span>');
    });

    it('Empty element with entity element', () => {
        const element = document.createElement('div');

        element.className = '_Entity _EType_A _EId_B _EReadonly_1';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<div class="_Entity _EType_A _EId_B _EReadonly_1"></div>');
        expect(result!.outerHTML).toBe('<div class="_Entity _EType_A _EId_B _EReadonly_1"></div>');
    });

    it('Empty element with child node', () => {
        const element = document.createElement('div');

        element.id = 'a';
        element.style.color = 'red';

        element.innerHTML = '<span style="font-size: 10pt">test</span>test2<script></script>';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe(
            '<div id="a" style="color: red;"><span style="font-size: 10pt">test</span>test2<script></script></div>'
        );
        expect(result!.outerHTML).toBe(
            '<div style="color:red"><span style="font-size:10pt">test</span>test2</div>'
        );
    });
});
