import WordCustomData, {
    createCustomData,
    getObject,
    setObject,
} from '../../../lib/plugins/Paste/wordConverter/WordCustomData';

const TEST_KEY = 'Test';
const TEST_VALUE = 'VALUE';
const NODE_ID_ATTRIBUTE_NAME = 'NodeId';

describe('Word Custom Data | ', () => {
    let customData: WordCustomData;
    beforeEach(() => {
        customData = createCustomData();
    });

    it('set And get Object', () => {
        const el = document.createElement('div');

        setObject(customData, el, TEST_KEY, TEST_VALUE);
        const val = getObject(customData, el, TEST_KEY);

        expect(customData.nextNodeId).toEqual(2);
        expect(el.getAttribute(NODE_ID_ATTRIBUTE_NAME)).toEqual('1');
        expect(val).toEqual(TEST_VALUE);
    });

    it('getObject === undefined', () => {
        const el = document.createElement('div');
        const val = getObject(customData, el, TEST_KEY);

        expect(val).toBeUndefined();
    });

    it('getObject === null', () => {
        const el = document.createTextNode('div');
        const val = getObject(customData, el, TEST_KEY);

        expect(val).toBeNull();
    });
});
