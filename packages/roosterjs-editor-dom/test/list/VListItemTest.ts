import VListItem from '../../lib/list/VListItem';
import { ListType } from 'roosterjs-editor-types';

describe('VListItem.getListType', () => {
    it('set ListType to None', () => {
        const item = new VListItem(document.createTextNode('test'));
        expect(item.getListType()).toBe(ListType.None);
    });

    it('set ListType to OL', () => {
        const item = new VListItem(document.createTextNode('test'), ListType.Ordered);
        expect(item.getListType()).toBe(ListType.Ordered);
    });

    it('set ListType to OL=>UL', () => {
        const item = new VListItem(
            document.createTextNode('test'),
            ListType.Ordered,
            ListType.Unordered
        );
        expect(item.getListType()).toBe(ListType.Unordered);
    });
});

describe('VListItem.getNode', () => {
    it('set node to a valid node', () => {
        const node = document.createTextNode('test');
        const item = new VListItem(node);
        expect(item.getNode().firstChild).toBe(node);
        expect(item.isDummy()).toBe(true);
    });

    it('set ListType to null', () => {
        expect(() => new VListItem(null)).toThrow();
    });
});

describe('VListItem.isDummy', () => {
    it('set node to a valid node', () => {
        const node = document.createTextNode('test');
        const li = document.createElement('li');
        li.appendChild(node);
        const item = new VListItem(li);
        expect(item.getNode()).toBe(li);
        expect(item.isDummy()).toBe(false);
    });

    it('set node to a valid node', () => {
        const node = document.createTextNode('test');
        const li = document.createElement('li');
        li.appendChild(node);
        li.style.display = 'block';
        const item = new VListItem(li);
        expect(item.getNode()).toBe(li);
        expect(item.isDummy()).toBe(true);
    });
});

describe('VListItem.contains', () => {
    it('check for same node', () => {
        const node = document.createTextNode('test');
        const item = new VListItem(node);
        expect(item.contains(node)).toBeTruthy();
    });

    it('check for a contained node', () => {
        const node = document.createTextNode('test');
        const div = document.createElement('div');
        div.appendChild(node);
        const item = new VListItem(div);
        expect(item.contains(node)).toBeTruthy();
    });

    it('check for a not contained node', () => {
        const node = document.createTextNode('test');
        const div = document.createElement('div');
        const item = new VListItem(div);
        expect(item.contains(node)).toBeFalsy();
    });
});

describe('VListItem.indent', () => {
    function runTest(
        sourceListTypes: (ListType.Ordered | ListType.Unordered)[],
        expectedListTypes: ListType[]
    ) {
        const thisItem = new VListItem(document.createElement('li'), ...sourceListTypes);
        thisItem.indent();
        const listTypes = (<any>thisItem).listTypes;
        expect(listTypes).toEqual(expectedListTypes);
    }

    it('Not a list, indent is no-op', () => {
        runTest([], [ListType.None]);
    });

    it('OL', () => {
        runTest([ListType.Ordered], [ListType.None, ListType.Ordered, ListType.Ordered]);
    });

    it('UL', () => {
        runTest([ListType.Unordered], [ListType.None, ListType.Unordered, ListType.Unordered]);
    });

    it('OL=>UL', () => {
        runTest(
            [ListType.Ordered, ListType.Unordered],
            [ListType.None, ListType.Ordered, ListType.Unordered, ListType.Unordered]
        );
    });
});

describe('VListItem.outdent', () => {
    function runTest(
        sourceListTypes: (ListType.Ordered | ListType.Unordered)[],
        expectedListTypes: ListType[]
    ) {
        const thisItem = new VListItem(document.createElement('li'), ...sourceListTypes);
        thisItem.outdent();
        const listTypes = (<any>thisItem).listTypes;
        expect(listTypes).toEqual(expectedListTypes);
    }

    it('Not a list, indent is no-op', () => {
        runTest([], [ListType.None]);
    });

    it('OL', () => {
        runTest([ListType.Ordered], [ListType.None]);
    });

    it('UL', () => {
        runTest([ListType.Unordered], [ListType.None]);
    });

    it('OL=>UL', () => {
        runTest([ListType.Ordered, ListType.Unordered], [ListType.None, ListType.Ordered]);
    });
});

describe('VList.changeListType', () => {
    function runTest(
        sourceListTypes: (ListType.Ordered | ListType.Unordered)[],
        targetType: ListType,
        expectedListTypes: ListType[]
    ) {
        const thisItem = new VListItem(document.createElement('li'), ...sourceListTypes);
        thisItem.changeListType(targetType);
        const listTypes = (<any>thisItem).listTypes;
        expect(listTypes).toEqual(expectedListTypes);
    }

    it('Not a list, change to not a list', () => {
        runTest([], ListType.None, [ListType.None]);
    });

    it('Not a list, change to OL', () => {
        runTest([], ListType.Ordered, [ListType.None, ListType.Ordered]);
    });

    it('Not a list, change to UL', () => {
        runTest([], ListType.Unordered, [ListType.None, ListType.Unordered]);
    });

    it('OL, change to not list', () => {
        runTest([ListType.Ordered], ListType.None, [ListType.None]);
    });

    it('OL, change to OL', () => {
        runTest([ListType.Ordered], ListType.Ordered, [ListType.None, ListType.Ordered]);
    });

    it('OL, change to UL', () => {
        runTest([ListType.Ordered], ListType.Unordered, [ListType.None, ListType.Unordered]);
    });

    it('UL, change to not list', () => {
        runTest([ListType.Unordered], ListType.None, [ListType.None]);
    });

    it('UL, change to OL', () => {
        runTest([ListType.Unordered], ListType.Ordered, [ListType.None, ListType.Ordered]);
    });

    it('UL, change to UL', () => {
        runTest([ListType.Unordered], ListType.Unordered, [ListType.None, ListType.Unordered]);
    });

    it('OL=>UL, change to None', () => {
        runTest([ListType.Ordered, ListType.Unordered], ListType.None, [ListType.None]);
    });

    it('OL=>UL, change to OL', () => {
        runTest([ListType.Ordered, ListType.Unordered], ListType.Ordered, [
            ListType.None,
            ListType.Ordered,
            ListType.Ordered,
        ]);
    });

    it('OL=>UL, change to UL', () => {
        runTest([ListType.Ordered, ListType.Unordered], ListType.Unordered, [
            ListType.None,
            ListType.Ordered,
            ListType.Unordered,
        ]);
    });
});

describe('VListItem.writeBack', () => {
    function runTest(
        listStackTags: (string | HTMLElement)[],
        listTypes: (ListType.Ordered | ListType.Unordered)[],
        expectedHtml: string,
        originalRoot?: HTMLOListElement | HTMLUListElement
    ) {
        // Arrange
        const listStack = listStackTags.map(tag =>
            tag instanceof HTMLElement ? tag : document.createElement(tag)
        );
        for (let i = 1; i < listStack.length; i++) {
            listStack[i - 1].appendChild(listStack[i]);
        }

        const li = document.createElement('li');
        li.appendChild(document.createElement('div'));
        const thisItem = new VListItem(li, ...listTypes);

        // Act
        thisItem.writeBack(listStack, originalRoot);

        // Assert
        expect(listStack.length).toBe(listTypes.length + 1);
        expect(listStack[0].innerHTML).toBe(expectedHtml);
    }

    it('not a list, no LI', () => {
        runTest(['div'], [], '<div></div>');
    });

    it('not a list, has LI', () => {
        runTest(['div'], [], '<div></div>');
    });

    it('pass in no list, this item is OL, has LI', () => {
        runTest(['div'], [ListType.Ordered], '<ol><li><div></div></li></ol>');
    });

    it('pass in no list, this item is UL, has LI', () => {
        runTest(['div'], [ListType.Unordered], '<ul><li><div></div></li></ul>');
    });

    it('pass in no list, this item is OL=>OL, has LI', () => {
        runTest(
            ['div'],
            [ListType.Ordered, ListType.Ordered],
            '<ol><ol style="list-style-type: lower-alpha;"><li><div></div></li></ol></ol>'
        );
    });

    it('pass in no list, this item is OL=>OL=>OL=>OL, has LI', () => {
        runTest(
            ['div'],
            [ListType.Ordered, ListType.Ordered, ListType.Ordered, ListType.Ordered],
            '<ol><ol style="list-style-type: lower-alpha;"><ol style="list-style-type: lower-roman;"><ol><li><div></div></li></ol></ol></ol></ol>'
        );
    });

    it('pass in OL, this item is OL, has LI', () => {
        runTest(['div', 'ol'], [ListType.Ordered], '<ol><li><div></div></li></ol>');
    });

    it('pass in OL, this item is UL, has LI', () => {
        runTest(['div', 'ol'], [ListType.Unordered], '<ol></ol><ul><li><div></div></li></ul>');
    });

    it('pass in OL, this item is OL=>UL, has LI', () => {
        runTest(
            ['div', 'ol'],
            [ListType.Ordered, ListType.Unordered],
            '<ol><ul><li><div></div></li></ul></ol>'
        );
    });

    it('pass in OL=>OL, this item is OL=>UL, has LI', () => {
        runTest(
            ['div', 'ol', 'ol'],
            [ListType.Ordered, ListType.Unordered],
            '<ol><ol></ol><ul><li><div></div></li></ul></ol>'
        );
    });

    it('pass in OL=>UL, this item is UL=>OL, has LI', () => {
        runTest(
            ['div', 'ol', 'ul'],
            [ListType.Unordered, ListType.Ordered],
            '<ol><ul></ul></ol><ul><ol style="list-style-type: lower-alpha;"><li><div></div></li></ol></ul>'
        );
    });

    it('pass in OL=>OL, this item is OL, has LI', () => {
        runTest(['div', 'ol', 'ol'], [ListType.Ordered], '<ol><ol></ol><li><div></div></li></ol>');
    });

    it('pass in OL=>OL, this item is not list, has LI', () => {
        runTest(['div', 'ol', 'ol'], [], '<ol><ol></ol></ol><div></div>');
    });

    it('use original root', () => {
        const ol = document.createElement('ol');
        ol.dataset.test = 'test';
        runTest(['div'], [ListType.Ordered], '<ol data-test="test"><li><div></div></li></ol>', ol);
    });

    it('use existing original root', () => {
        const ol = document.createElement('ol');
        ol.id = 'id1';
        ol.dataset.test = 'test';
        runTest(
            ['div', ol],
            [ListType.Ordered],
            '<ol id="id1" data-test="test"><li><div></div></li></ol>',
            ol
        );
    });

    it('use existing original root which is not in list stack, and there is already matched root', () => {
        const ol = document.createElement('ol');
        ol.id = 'id1';
        ol.dataset.test = 'test';
        runTest(['div', 'ol'], [ListType.Ordered], '<ol><li><div></div></li></ol>', ol);
    });

    it('use existing original root which is not in list stack, and there is no matched root', () => {
        const ol = document.createElement('ol');
        ol.id = 'id1';
        ol.dataset.test = 'test';
        runTest(
            ['div', 'ul'],
            [ListType.Ordered],
            '<ul></ul><ol id="id1" data-test="test"><li><div></div></li></ol>',
            ol
        );
    });

    it('use existing original root which is already appended to root and cannot be reused', () => {
        const div = document.createElement('div');
        const ol = document.createElement('ol');
        ol.id = 'id1';
        ol.dataset.test = 'test';
        div.appendChild(ol);
        runTest(
            [div, 'ul'],
            [ListType.Ordered],
            '<ol id="id1" data-test="test"></ol><ul></ul><ol data-test="test"><li><div></div></li></ol>',
            ol
        );
    });

    it('level > 1, do not use existing original root', () => {
        const ol = document.createElement('ol');
        ol.id = 'id1';
        ol.dataset.test = 'test';
        runTest(
            ['div', ol],
            [ListType.Ordered, ListType.Ordered],
            '<ol id="id1" data-test="test"><ol style="list-style-type: lower-alpha;"><li><div></div></li></ol></ol>',
            ol
        );
    });

    it('use existing original root in multiple levels scenario', () => {
        const ol = document.createElement('ol');
        ol.id = 'id1';
        ol.dataset.test = 'test';
        runTest(
            ['div'],
            [ListType.Ordered, ListType.Unordered],
            '<ol id="id1" data-test="test"><ul><li><div></div></li></ul></ol>',
            ol
        );
    });
});
