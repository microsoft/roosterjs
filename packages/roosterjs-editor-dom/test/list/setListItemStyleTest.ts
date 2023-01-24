import { default as setListItemStyle } from '../../lib/list/setListItemStyle';

interface TestChildElement {
    elementTag: string;
    styles: string;
    textContent?: string;
}

describe('setListItemStyle', () => {
    const stylesToInherit = ['font-size', 'font-family', 'color'];

    it('singleElement with fontSize and Color', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;color:blue',
                    textContent: 'test',
                },
            ],
            'font-size: 72pt; color: blue;'
        );
    });

    it('Multiple Elements with same fontSize and Color', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;color:blue',
                    textContent: 'test',
                },
            ],
            'font-size: 72pt; color: blue;'
        );
    });

    it('Multiple Elements with same fontSize, fontName and Color', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                    textContent: 'test',
                },
            ],
            'font-size: 72pt; font-family: Tahoma; color: blue;'
        );
    });

    it('Multiple Elements with different Styles 1', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;',
                    textContent: 'test',
                },
            ],
            'font-size: 72pt;'
        );
    });

    it('Multiple Elements with different Styles 2', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;',
                    textContent: 'test',
                },
            ],
            'font-size: 72pt;'
        );
    });

    it('Multiple Elements with different Styles 3', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:14pt;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;',
                    textContent: 'test',
                },
            ],
            null
        );
    });

    it('Multiple Elements with different Styles 4', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:14pt;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Arial;',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;',
                    textContent: 'test',
                },
            ],
            null
        );
    });

    it('Multiple Elements with same styles', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                    textContent: 'test',
                },
            ],
            'font-size: 72pt; font-family: Tahoma; color: blue;'
        );
    });

    it('Multiple Elements with no styles', () => {
        runTest(
            [
                {
                    elementTag: 'span',
                    styles: '',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: '',
                    textContent: 'test',
                },
                {
                    elementTag: 'span',
                    styles: '',
                    textContent: 'test',
                },
            ],
            null
        );
    });

    it('List Item element, with Block Element and child elements', () => {
        // Arrange
        let listItemElement = document.createElement('li');
        let divElement = document.createElement('div');
        let testChildElements = [
            {
                elementTag: 'span',
                styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                textContent: 'test',
            },
            {
                elementTag: 'span',
                styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                textContent: 'test',
            },
            {
                elementTag: 'span',
                styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                textContent: 'test',
            },
        ];

        testChildElements.forEach(element => {
            divElement.appendChild(createElement(element));
        });

        listItemElement.appendChild(divElement);

        // Act
        setListItemStyle(listItemElement, stylesToInherit, true /*isCssStyle*/);

        // Assert
        expect(listItemElement.getAttribute('style')).toBe(
            'font-size: 72pt; font-family: Tahoma; color: blue;'
        );
    });

    it('List Item element, with Block Element and child elements, #text Node and BR Element', () => {
        // Arrange
        let listItemElement = document.createElement('li');
        let divElement = document.createElement('div');
        let testChildElements = [
            {
                elementTag: 'span',
                styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                textContent: 'test',
            },
            {
                elementTag: 'span',
                styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                textContent: 'test',
            },
            {
                elementTag: 'span',
                styles: 'font-size:72pt;font-family:Tahoma;color:blue',
                textContent: 'test',
            },
        ];
        testChildElements.forEach(element => {
            divElement.appendChild(createElement(element));
        });

        let spanElement = createElement({
            elementTag: 'span',
            styles: 'font-size: 72pt;font-family: Tahoma;color:blue',
            textContent: 'test',
        });
        spanElement.appendChild(document.createTextNode('test'));

        listItemElement.appendChild(divElement);
        listItemElement.appendChild(spanElement);

        // Act
        setListItemStyle(listItemElement, stylesToInherit, true /*isCssStyle*/);

        // Assert
        expect(listItemElement.getAttribute('style')).toBe(
            'font-size: 72pt; font-family: Tahoma; color: blue;'
        );
    });

    it('List Item element, with <ol><li><div><span>aaa</span></div></li><ol>', () => {
        // Arrange;
        let listItemElement = document.createElement('li');
        let divElement = document.createElement('div');

        let spanElement = createElement({
            elementTag: 'span',
            styles: 'font-size: 72pt;font-family: Tahoma;color:blue',
            textContent: 'test',
        });

        divElement.appendChild(spanElement);
        listItemElement.appendChild(divElement);
        listItemElement.appendChild(spanElement);

        // Act;
        setListItemStyle(listItemElement, stylesToInherit, true /*isCssStyle*/);

        // Assert;
        expect(listItemElement.getAttribute('style')).toBe(
            'font-size: 72pt; font-family: Tahoma; color: blue;'
        );
    });

    it('List Item element, with <ol><li><div><b><span>aaa</span></b></div></li><ol>', () => {
        // Arrange;
        const listItemElement = document.createElement('li');
        const divElement = document.createElement('div');

        const spanElement = createElement({
            elementTag: 'span',
            styles: 'font-size: 72pt;font-family: Tahoma;color:blue',
            textContent: 'test',
        });

        const b = document.createElement('b');
        b.appendChild(spanElement);
        divElement.appendChild(b);
        listItemElement.appendChild(divElement);

        // Act;
        setListItemStyle(listItemElement, stylesToInherit, true /*isCssStyle*/);

        // Assert;
        expect(listItemElement.getAttribute('style')).toBe(
            'font-size: 72pt; font-family: Tahoma; color: blue;'
        );
    });

    it('Set HTML attribute', () => {
        // Arrange;
        const listItemElement = document.createElement('li');
        const divElement = document.createElement('div');

        const spanElement = createElement({
            elementTag: 'span',
            styles: '',
            textContent: 'test',
        });

        spanElement.dataset.ogsc = 'red';
        spanElement.dataset.ogsb = 'blue';

        const b = document.createElement('b');
        b.appendChild(spanElement);
        divElement.appendChild(b);
        listItemElement.appendChild(divElement);

        // Act;
        setListItemStyle(listItemElement, ['data-ogsb', 'data-ogsc'], false /*isCssStyle*/);

        // Assert;
        expect(listItemElement.outerHTML).toBe(
            '<li data-ogsb="blue" data-ogsc="red"><div><b><span data-ogsc="red" data-ogsb="blue">test</span></b></div></li>'
        );
    });

    function runTest(childElement: TestChildElement[], result: string) {
        // Arrange
        let listItemElement = document.createElement('li');

        childElement.forEach(element => {
            listItemElement.appendChild(createElement(element));
        });

        // Act
        setListItemStyle(listItemElement, stylesToInherit, true /*isCssStyle*/);

        // Assert
        expect(listItemElement.getAttribute('style')).toBe(result);
    }

    function createElement(input: TestChildElement): HTMLElement {
        const { elementTag, styles, textContent } = input;
        const element = document.createElement(elementTag);

        if (styles) {
            element.setAttribute('style', styles);
        }

        element.textContent = textContent;
        return element;
    }
});
