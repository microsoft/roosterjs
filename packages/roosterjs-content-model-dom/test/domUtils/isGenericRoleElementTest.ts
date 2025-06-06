import { isGenericRoleElement } from '../../lib/domUtils/isGenericRoleElement';

// packages/roosterjs-content-model-dom/lib/domUtils/isGenericRoleElement.test.ts

describe('isGenericRoleElement', () => {
    // Helper function to create element with specified tag name
    function createElementWithTag(tagName: string): Element {
        return {
            tagName,
            // Minimal implementation of Element interface for testing
        } as Element;
    }

    describe('with falsy inputs', () => {
        it('returns false for null input', () => {
            expect(isGenericRoleElement(null)).toBe(false);
        });
    });

    describe('with generic role elements', () => {
        const genericElements = [
            'div',
            'span',
            'p',
            'section',
            'article',
            'aside',
            'header',
            'footer',
            'main',
            'nav',
            'address',
            'blockquote',
            'pre',
            'figure',
            'figcaption',
            'hgroup',
        ];

        genericElements.forEach(tagName => {
            it(`returns true for ${tagName} element`, () => {
                const element = createElementWithTag(tagName.toUpperCase());
                expect(isGenericRoleElement(element)).toBe(true);
            });
        });
    });

    describe('with non-generic role elements', () => {
        const nonGenericElements = ['a', 'button', 'input', 'img', 'table', 'ul', 'h1'];

        nonGenericElements.forEach(tagName => {
            it(`returns false for ${tagName} element`, () => {
                const element = createElementWithTag(tagName.toUpperCase());
                expect(isGenericRoleElement(element)).toBe(false);
            });
        });
    });

    describe('with custom elements', () => {
        it('returns false for custom element', () => {
            const element = createElementWithTag('CUSTOM-ELEMENT');
            expect(isGenericRoleElement(element)).toBe(false);
        });
    });
});
