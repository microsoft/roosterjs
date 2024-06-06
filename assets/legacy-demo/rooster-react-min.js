var roosterjsReact;
(() => {
    'use strict';
    var e = {
            7821: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.renderColorPicker = void 0);
                var n = o(7363),
                    a = (0, o(3538).mergeStyleSets)({
                        colorSquare: {
                            width: '20px',
                            height: '20px',
                            margin: '4px',
                            borderStyle: 'solid',
                            borderWidth: '2px',
                            '&:hover': { borderColor: 'red' },
                        },
                        colorSquareBorder: { borderColor: 'transparent' },
                        colorSquareBorderWhite: { borderColor: '#bebebe' },
                    });
                t.renderColorPicker = function (e, t, o) {
                    var i = e.key,
                        r = t[i].lightModeColor;
                    return n.createElement(
                        'button',
                        {
                            onClick: function (t) {
                                return o(t, e);
                            },
                            title: e.text,
                        },
                        n.createElement('div', {
                            className:
                                a.colorSquare +
                                ' ' +
                                ('textColorWhite' == i || 'backgroundColorWhite' == i
                                    ? a.colorSquareBorderWhite
                                    : a.colorSquareBorder),
                            style: { backgroundColor: r },
                        })
                    );
                };
            },
            2501: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.getTextColorValue = t.getBackgroundColorValue = void 0);
                var n = o(8952);
                Object.defineProperty(t, 'getBackgroundColorValue', {
                    enumerable: !0,
                    get: function () {
                        return n.getBackgroundColorValue;
                    },
                });
                var a = o(8288);
                Object.defineProperty(t, 'getTextColorValue', {
                    enumerable: !0,
                    get: function () {
                        return a.getTextColorValue;
                    },
                });
            },
            8952: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.getBackgroundColorValue = t.BackgroundColorDropDownItems = t.BackgroundColors = void 0);
                var o = {
                    backgroundColorCyan: { lightModeColor: '#00ffff', darkModeColor: '#005357' },
                    backgroundColorGreen: { lightModeColor: '#00ff00', darkModeColor: '#005e00' },
                    backgroundColorYellow: { lightModeColor: '#ffff00', darkModeColor: '#383e00' },
                    backgroundColorOrange: { lightModeColor: '#ff8000', darkModeColor: '#bf4c00' },
                    backgroundColorRed: { lightModeColor: '#ff0000', darkModeColor: '#ff2711' },
                    backgroundColorMagenta: { lightModeColor: '#ff00ff', darkModeColor: '#e700e8' },
                    backgroundColorLightCyan: {
                        lightModeColor: '#80ffff',
                        darkModeColor: '#004c4f',
                    },
                    backgroundColorLightGreen: {
                        lightModeColor: '#80ff80',
                        darkModeColor: '#005400',
                    },
                    backgroundColorLightYellow: {
                        lightModeColor: '#ffff80',
                        darkModeColor: '#343c00',
                    },
                    backgroundColorLightOrange: {
                        lightModeColor: '#ffc080',
                        darkModeColor: '#77480b',
                    },
                    backgroundColorLightRed: {
                        lightModeColor: '#ff8080',
                        darkModeColor: '#bc454a',
                    },
                    backgroundColorLightMagenta: {
                        lightModeColor: '#ff80ff',
                        darkModeColor: '#aa2bad',
                    },
                    backgroundColorWhite: { lightModeColor: '#ffffff', darkModeColor: '#333333' },
                    backgroundColorLightGray: {
                        lightModeColor: '#cccccc',
                        darkModeColor: '#535353',
                    },
                    backgroundColorGray: { lightModeColor: '#999999', darkModeColor: '#777777' },
                    backgroundColorDarkGray: {
                        lightModeColor: '#666666',
                        darkModeColor: '#a0a0a0',
                    },
                    backgroundColorDarkerGray: {
                        lightModeColor: '#333333',
                        darkModeColor: '#cfcfcf',
                    },
                    backgroundColorBlack: { lightModeColor: '#000000', darkModeColor: '#ffffff' },
                };
                (t.BackgroundColors = o),
                    (t.BackgroundColorDropDownItems = {
                        backgroundColorCyan: 'Cyan',
                        backgroundColorGreen: 'Green',
                        backgroundColorYellow: 'Yellow',
                        backgroundColorOrange: 'Orange',
                        backgroundColorRed: 'Red',
                        backgroundColorMagenta: 'Magenta',
                        backgroundColorLightCyan: 'Light cyan',
                        backgroundColorLightGreen: 'Light green',
                        backgroundColorLightYellow: 'Light yellow',
                        backgroundColorLightOrange: 'Light orange',
                        backgroundColorLightRed: 'Light red',
                        backgroundColorLightMagenta: 'Light magenta',
                        backgroundColorWhite: 'White',
                        backgroundColorLightGray: 'Light gray',
                        backgroundColorGray: 'Gray',
                        backgroundColorDarkGray: 'Dark gray',
                        backgroundColorDarkerGray: 'Darker gray',
                        backgroundColorBlack: 'Black',
                    }),
                    (t.getBackgroundColorValue = function (e) {
                        return o[e];
                    });
            },
            1391: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.getColorPickerItemClassName = t.getColorPickerContainerClassName = void 0);
                var n = (0, o(3538).mergeStyleSets)({
                    colorPickerContainer: {
                        width: '192px',
                        padding: '8px',
                        overflow: 'hidden',
                        '& ul': { width: '192px', overflow: 'hidden' },
                    },
                    colorMenuItem: {
                        display: 'inline-block',
                        width: '32px',
                        height: '32px',
                        '& button': {
                            padding: '0px',
                            minWidth: '0px',
                            background: 'transparent',
                            border: 'none',
                        },
                    },
                });
                (t.getColorPickerContainerClassName = function () {
                    return n.colorPickerContainer;
                }),
                    (t.getColorPickerItemClassName = function () {
                        return n.colorMenuItem;
                    });
            },
            8288: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.getTextColorValue = t.TextColorDropDownItems = t.TextColors = void 0);
                var o = {
                    textColorLightBlue: { lightModeColor: '#51a7f9', darkModeColor: '#0075c2' },
                    textColorLightGreen: { lightModeColor: '#6fc040', darkModeColor: '#207a00' },
                    textColorLightYellow: { lightModeColor: '#f5d427', darkModeColor: '#5d4d00' },
                    textColorLightOrange: { lightModeColor: '#f3901d', darkModeColor: '#ab5500' },
                    textColorLightRed: { lightModeColor: '#ed5c57', darkModeColor: '#df504d' },
                    textColorLightPurple: { lightModeColor: '#b36ae2', darkModeColor: '#ab63da' },
                    textColorBlue: { lightModeColor: '#0c64c0', darkModeColor: '#6da0ff' },
                    textColorGreen: { lightModeColor: '#0c882a', darkModeColor: '#3da848' },
                    textColorYellow: { lightModeColor: '#dcbe22', darkModeColor: '#6d5c00' },
                    textColorOrange: { lightModeColor: '#de6a19', darkModeColor: '#d3610c' },
                    textColorRed: { lightModeColor: '#c82613', darkModeColor: '#ff6847' },
                    textColorPurple: { lightModeColor: '#763e9b', darkModeColor: '#d394f9' },
                    textColorDarkBlue: { lightModeColor: '#174e86', darkModeColor: '#93b8f9' },
                    textColorDarkGreen: { lightModeColor: '#0f5c1a', darkModeColor: '#7fc57b' },
                    textColorDarkYellow: { lightModeColor: '#c3971d', darkModeColor: '#946f00' },
                    textColorDarkOrange: { lightModeColor: '#be5b17', darkModeColor: '#de7633' },
                    textColorDarkRed: { lightModeColor: '#861106', darkModeColor: '#ff9b7c' },
                    textColorDarkPurple: { lightModeColor: '#5e327c', darkModeColor: '#dea9fd' },
                    textColorDarkerBlue: { lightModeColor: '#002451', darkModeColor: '#cedbff' },
                    textColorDarkerGreen: { lightModeColor: '#06400c', darkModeColor: '#a3da9b' },
                    textColorDarkerYellow: { lightModeColor: '#a37519', darkModeColor: '#b5852a' },
                    textColorDarkerOrange: { lightModeColor: '#934511', darkModeColor: '#ef935c' },
                    textColorDarkerRed: { lightModeColor: '#570606', darkModeColor: '#ffc0b1' },
                    textColorDarkerPurple: { lightModeColor: '#3b204d', darkModeColor: '#eecaff' },
                    textColorWhite: { lightModeColor: '#ffffff', darkModeColor: '#333333' },
                    textColorLightGray: { lightModeColor: '#cccccc', darkModeColor: '#535353' },
                    textColorGray: { lightModeColor: '#999999', darkModeColor: '#777777' },
                    textColorDarkGray: { lightModeColor: '#666666', darkModeColor: '#a0a0a0' },
                    textColorDarkerGray: { lightModeColor: '#333333', darkModeColor: '#cfcfcf' },
                    textColorBlack: { lightModeColor: '#000000', darkModeColor: '#ffffff' },
                };
                (t.TextColors = o),
                    (t.TextColorDropDownItems = {
                        textColorLightBlue: 'Light blue',
                        textColorLightGreen: 'Light green',
                        textColorLightYellow: 'Light yellow',
                        textColorLightOrange: 'Light orange',
                        textColorLightRed: 'Light red',
                        textColorLightPurple: 'Light purple',
                        textColorBlue: 'Blue',
                        textColorGreen: 'Green',
                        textColorYellow: 'Yellow',
                        textColorOrange: 'Orange',
                        textColorRed: 'Red',
                        textColorPurple: 'Purple',
                        textColorDarkBlue: 'Dark blue',
                        textColorDarkGreen: 'Dark green',
                        textColorDarkYellow: 'Dark yellow',
                        textColorDarkOrange: 'Dark orange',
                        textColorDarkRed: 'Dark red',
                        textColorDarkPurple: 'Dark purple',
                        textColorDarkerBlue: 'Darker blue',
                        textColorDarkerGreen: 'Darker green',
                        textColorDarkerYellow: 'Darker yellow',
                        textColorDarkerOrange: 'Darker orange',
                        textColorDarkerRed: 'Darker red',
                        textColorDarkerPurple: 'Darker purple',
                        textColorWhite: 'White',
                        textColorLightGray: 'Light gray',
                        textColorGray: 'Gray',
                        textColorDarkGray: 'Dark gray',
                        textColorDarkerGray: 'Darker gray',
                        textColorBlack: 'Black',
                    }),
                    (t.getTextColorValue = function (e) {
                        return o[e];
                    });
            },
            6933: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.getLocalizedString = t.createUIUtilities = void 0);
                var n = o(8791);
                Object.defineProperty(t, 'createUIUtilities', {
                    enumerable: !0,
                    get: function () {
                        return n.default;
                    },
                });
                var a = o(5014);
                Object.defineProperty(t, 'getLocalizedString', {
                    enumerable: !0,
                    get: function () {
                        return a.default;
                    },
                });
            },
            8791: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7363),
                    a = o(1533),
                    i = o(1905),
                    r = o(3538),
                    l = o(3538);
                t.default = function (e, t) {
                    return {
                        renderComponent: function (o) {
                            var i = e.ownerDocument,
                                f = i.createElement('div');
                            return (
                                i.body.appendChild(f),
                                a.render(
                                    n.createElement(
                                        l.WindowProvider,
                                        { window: i.defaultView },
                                        n.createElement(r.ThemeProvider, { theme: t }, o)
                                    ),
                                    f
                                ),
                                function () {
                                    a.unmountComponentAtNode(f), i.body.removeChild(f);
                                }
                            );
                        },
                        isRightToLeft: function () {
                            return 'rtl' == (e && (0, i.getComputedStyles)(e, 'direction')[0]);
                        },
                    };
                };
            },
            5014: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.default = function (e, t, o) {
                        var n = null == e ? void 0 : e[t];
                        return 'function' == typeof n ? n() : 'string' == typeof n ? n : o;
                    });
            },
            1672: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.renderReactComponent = void 0),
                    (t.renderReactComponent = function (e, t) {
                        if (e) return e.renderComponent(t);
                        throw new Error(
                            'UIUtilities is required but not provided. Please call ReactEditorPlugin.setUIUtilities() to set a valid uiUtilities object'
                        );
                    });
            },
            2157: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.createTableEditMenuProvider = t.createImageEditMenuProvider = t.createListEditMenuProvider = t.createContextMenuProvider = t.createContextMenuPlugin = void 0);
                var n = o(9402);
                Object.defineProperty(t, 'createContextMenuPlugin', {
                    enumerable: !0,
                    get: function () {
                        return n.default;
                    },
                });
                var a = o(8217);
                Object.defineProperty(t, 'createContextMenuProvider', {
                    enumerable: !0,
                    get: function () {
                        return a.default;
                    },
                });
                var i = o(879);
                Object.defineProperty(t, 'createListEditMenuProvider', {
                    enumerable: !0,
                    get: function () {
                        return i.default;
                    },
                });
                var r = o(9882);
                Object.defineProperty(t, 'createImageEditMenuProvider', {
                    enumerable: !0,
                    get: function () {
                        return r.default;
                    },
                });
                var l = o(3072);
                Object.defineProperty(t, 'createTableEditMenuProvider', {
                    enumerable: !0,
                    get: function () {
                        return l.default;
                    },
                });
            },
            9882: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(8217),
                    a = o(1863),
                    i = o(1905),
                    r = o(1905),
                    l = o(1905),
                    f = {
                        key: 'menuNameImageAltText',
                        unlocalizedText: 'Add alternate text',
                        onClick: function (e, t, o, n, i) {
                            var r = o,
                                f = r.alt;
                            (0, a.default)(
                                i,
                                'menuNameImageAltText',
                                'Add alternate text',
                                {
                                    altText: {
                                        labelKey: null,
                                        unlocalizedLabel: null,
                                        initValue: f,
                                    },
                                },
                                n
                            ).then(function (e) {
                                t.focus(), t.select(r), e && (0, l.setImageAltText)(t, e.altText);
                            });
                        },
                    },
                    s = {
                        menuNameImageSizeBestFit: 0,
                        menuNameImageSizeSmall: 0.25,
                        menuNameImageSizeMedium: 0.5,
                        menuNameImageSizeOriginal: 1,
                    },
                    m = {
                        key: 'menuNameImageResize',
                        unlocalizedText: 'Size',
                        subItems: {
                            menuNameImageSizeBestFit: 'Best fit',
                            menuNameImageSizeSmall: 'Small',
                            menuNameImageSizeMedium: 'Medium',
                            menuNameImageSizeOriginal: 'Original',
                        },
                        onClick: function (e, t, o) {
                            var n = t.getSelectionRangeEx();
                            2 === n.type &&
                                t.addUndoSnapshot(function () {
                                    var o = s[e];
                                    null != o && o > 0
                                        ? (0, i.resizeByPercentage)(t, n.image, o, 10, 10)
                                        : (0, i.resetImage)(t, n.image);
                                });
                        },
                        getSelectedId: function (e, t) {
                            var o = e.getSelectionRangeEx();
                            return (
                                (2 === o.type &&
                                    (0, r.getObjectKeys)(s).find(function (e) {
                                        return 'menuNameImageSizeBestFit' == e
                                            ? !o.image.hasAttribute('width') &&
                                                  !o.image.hasAttribute('height')
                                            : (0, i.isResizedTo)(o.image, s[e]);
                                    })) ||
                                null
                            );
                        },
                    },
                    c = {
                        key: 'menuNameImageRotate',
                        unlocalizedText: 'Rotate image',
                        subItems: {
                            menuNameImageRotateLeft: 'Left',
                            menuNameImageRotateRight: 'Right',
                        },
                        shouldShow: function (e, t, o) {
                            return (
                                !!(null == o ? void 0 : o.isOperationAllowed(4)) &&
                                (0, i.canRegenerateImage)(t)
                            );
                        },
                        onClick: function (e, t, o, n, a, i) {
                            t.addUndoSnapshot(function () {
                                switch (e) {
                                    case 'menuNameImageRotateLeft':
                                        null == i || i.rotateImage(o, -Math.PI / 2);
                                        break;
                                    case 'menuNameImageRotateRight':
                                        null == i || i.rotateImage(o, Math.PI / 2);
                                }
                            });
                        },
                    },
                    u = {
                        key: 'menuNameImageFlip',
                        unlocalizedText: 'Flip image',
                        subItems: {
                            menuNameImageRotateFlipHorizontally: 'Flip Horizontally',
                            menuNameImageRotateFlipVertically: 'Flip Vertically',
                        },
                        shouldShow: function (e, t, o) {
                            return (
                                !!(null == o ? void 0 : o.isOperationAllowed(4)) &&
                                (0, i.canRegenerateImage)(t)
                            );
                        },
                        onClick: function (e, t, o, n, a, i) {
                            t.addUndoSnapshot(function () {
                                switch (e) {
                                    case 'menuNameImageRotateFlipHorizontally':
                                        null == i || i.flipImage(o, 'horizontal');
                                        break;
                                    case 'menuNameImageRotateFlipVertically':
                                        null == i || i.flipImage(o, 'vertical');
                                }
                            });
                        },
                    },
                    d = {
                        key: 'menuNameImageCrop',
                        unlocalizedText: 'Crop image',
                        shouldShow: function (e, t, o) {
                            return (
                                !!(null == o ? void 0 : o.isOperationAllowed(8)) &&
                                (0, i.canRegenerateImage)(t)
                            );
                        },
                        onClick: function (e, t, o, n, a, i) {
                            null == i || i.setEditingImage(o, 8);
                        },
                    },
                    g = {
                        key: 'menuNameImageRemove',
                        unlocalizedText: 'Remove image',
                        onClick: function (e, t, o, n, a, i) {
                            t.contains(o) &&
                                t.addUndoSnapshot(function () {
                                    t.deleteNode(o), null == i || i.setEditingImage(null);
                                }, 'DeleteImage');
                        },
                    },
                    h = {
                        key: 'menuNameImageCopy',
                        unlocalizedText: 'Copy image',
                        onClick: function (e, t, o, n, a, i) {
                            t.contains(o) &&
                                t.addUndoSnapshot(function () {
                                    var e;
                                    null === (e = t.getDocument()) ||
                                        void 0 === e ||
                                        e.execCommand('copy');
                                }, 'CopyImage');
                        },
                    },
                    j = {
                        key: 'menuNameImageCut',
                        unlocalizedText: 'Cut image',
                        onClick: function (e, t, o, n, a, i) {
                            t.contains(o) &&
                                t.addUndoSnapshot(function () {
                                    var e;
                                    null === (e = t.getDocument()) ||
                                        void 0 === e ||
                                        e.execCommand('cut');
                                }, 'CutImage');
                        },
                    };
                function p(e, t) {
                    var o = e.getSelectionRangeEx();
                    return 2 === o.type && !!o.image;
                }
                t.default = function (e, t) {
                    return (0, n.default)('imageEdit', [f, m, d, g, c, u, h, j], t, p, e);
                };
            },
            879: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(8217),
                    a = o(1863),
                    i = o(1905),
                    r = o(1905),
                    l = {
                        key: 'menuNameListNumberReset',
                        unlocalizedText: 'Restart at 1',
                        onClick: function (e, t, o) {
                            var n = t.getElementAtCursor('LI', o);
                            (0, r.setOrderedListNumbering)(t, n, 1);
                        },
                    },
                    f = {
                        key: 'menuNameListNumberEdit',
                        unlocalizedText: 'Set numbering value',
                        onClick: function (e, t, o, n, l) {
                            var f = s(t, o);
                            if (f) {
                                for (
                                    var m = f.list, c = f.li, u = m.start, d = m.firstChild;
                                    d && d !== c;
                                    d = d.nextSibling
                                )
                                    (0, i.safeInstanceOf)(d, 'HTMLLIElement') && (u += 1);
                                (0, a.default)(
                                    l,
                                    'menuNameListNumberEdit',
                                    'Set numbering value',
                                    {
                                        value: {
                                            labelKey: 'dialogTextSetListNumber',
                                            unlocalizedLabel: 'Set value to',
                                            initValue: u.toString(),
                                        },
                                    },
                                    n
                                ).then(function (e) {
                                    if ((t.focus(), e)) {
                                        var o = parseInt(e.value);
                                        o > 0 &&
                                            o != u &&
                                            (0, r.setOrderedListNumbering)(t, c, Math.floor(o));
                                    }
                                });
                            }
                        },
                    };
                function s(e, t) {
                    var o = e.getElementAtCursor('LI', t),
                        n = o && e.getElementAtCursor('ol', o);
                    return (null == n ? void 0 : n.isContentEditable) ? { list: n, li: o } : null;
                }
                t.default = function (e) {
                    return (0, n.default)('listEdit', [l, f], e, function (e, t) {
                        return !!s(e, t);
                    });
                };
            },
            3072: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(8217),
                    i = o(1905),
                    r = o(7821),
                    l = o(1391),
                    f = o(8952),
                    s = {
                        menuNameTableInsertAbove: 0,
                        menuNameTableInsertBelow: 1,
                        menuNameTableInsertLeft: 2,
                        menuNameTableInsertRight: 3,
                        menuNameTableDeleteTable: 4,
                        menuNameTableDeleteColumn: 5,
                        menuNameTableDeleteRow: 6,
                        menuNameTableMergeAbove: 7,
                        menuNameTableMergeBelow: 8,
                        menuNameTableMergeLeft: 9,
                        menuNameTableMergeRight: 10,
                        menuNameTableMergeCells: 11,
                        menuNameTableSplitHorizontally: 12,
                        menuNameTableSplitVertically: 13,
                        menuNameTableAlignLeft: 17,
                        menuNameTableAlignCenter: 18,
                        menuNameTableAlignRight: 19,
                        menuNameTableAlignTop: 20,
                        menuNameTableAlignMiddle: 21,
                        menuNameTableAlignBottom: 22,
                        menuNameTableAlignTableLeft: 15,
                        menuNameTableAlignTableCenter: 14,
                        menuNameTableAlignTableRight: 16,
                    },
                    m = (0, n.__assign)((0, n.__assign)({}, f.BackgroundColors), {
                        menuNameTableCellShade: null,
                    });
                function c(e, t) {
                    t.focus();
                    var o = s[e];
                    'number' == typeof o && (0, i.editTable)(t, o);
                }
                var u = {
                        key: 'menuNameTableInsert',
                        unlocalizedText: 'Insert',
                        subItems: {
                            menuNameTableInsertAbove: 'Insert above',
                            menuNameTableInsertBelow: 'Insert below',
                            menuNameTableInsertLeft: 'Insert left',
                            menuNameTableInsertRight: 'Insert right',
                        },
                        onClick: c,
                    },
                    d = {
                        key: 'menuNameTableDelete',
                        unlocalizedText: 'Delete',
                        subItems: {
                            menuNameTableDeleteColumn: 'Delete column',
                            menuNameTableDeleteRow: 'Delete row',
                            menuNameTableDeleteTable: 'Delete table',
                        },
                        onClick: c,
                    },
                    g = {
                        key: 'menuNameTableMerge',
                        unlocalizedText: 'Merge',
                        subItems: {
                            menuNameTableMergeAbove: 'Merge above',
                            menuNameTableMergeBelow: 'Merge below',
                            menuNameTableMergeLeft: 'Merge left',
                            menuNameTableMergeRight: 'Merge right',
                            '-': '-',
                            menuNameTableMergeCells: 'Merge selected cells',
                        },
                        onClick: c,
                    },
                    h = {
                        key: 'menuNameTableSplit',
                        unlocalizedText: 'Split',
                        subItems: {
                            menuNameTableSplitHorizontally: 'Split horizontally',
                            menuNameTableSplitVertically: 'Split vertically',
                        },
                        onClick: c,
                    },
                    j = {
                        key: 'menuNameTableAlign',
                        unlocalizedText: 'Align cell',
                        subItems: {
                            menuNameTableAlignLeft: 'Align left',
                            menuNameTableAlignCenter: 'Align center',
                            menuNameTableAlignRight: 'Align right',
                            '-': '-',
                            menuNameTableAlignTop: 'Align top',
                            menuNameTableAlignMiddle: 'Align middle',
                            menuNameTableAlignBottom: 'Align bottom',
                        },
                        onClick: c,
                    },
                    p = {
                        key: 'menuNameTableAlignTable',
                        unlocalizedText: 'Align table',
                        subItems: {
                            menuNameTableAlignTableLeft: 'Align left',
                            menuNameTableAlignTableCenter: 'Align center',
                            menuNameTableAlignTableRight: 'Align right',
                        },
                        onClick: c,
                    },
                    b = {
                        key: 'menuNameTableCellShade',
                        unlocalizedText: 'Shading',
                        subItems: f.BackgroundColorDropDownItems,
                        onClick: function (e, t) {
                            (0, i.applyCellShading)(t, m[e]);
                        },
                        itemRender: function (e, t) {
                            return (0, r.renderColorPicker)(e, m, t);
                        },
                        itemClassName: (0, l.getColorPickerItemClassName)(),
                        commandBarSubMenuProperties: {
                            className: (0, l.getColorPickerContainerClassName)(),
                        },
                    };
                t.default = function (e) {
                    return (0, a.default)('tableEdit', [u, d, g, h, j, p, b], e, function (e, t) {
                        return !!(function (e, t) {
                            var o = e.getElementAtCursor('TD,TH', t),
                                n = o && e.getElementAtCursor('table', o);
                            return (null == n ? void 0 : n.isContentEditable)
                                ? { table: n, td: o }
                                : null;
                        })(e, t);
                    });
                };
            },
            9402: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(1905),
                    r = o(3538),
                    l = o(1672),
                    f = (function (e) {
                        function t() {
                            var t =
                                e.call(this, {
                                    render: function (e, o, n) {
                                        var i = (function (e) {
                                            var t = 0;
                                            return e.map(function (e) {
                                                return (
                                                    e || {
                                                        name: '-',
                                                        key: 'divider_' + (t++).toString(),
                                                    }
                                                );
                                            });
                                        })(o);
                                        i.length > 0 &&
                                            (t.disposer = (0, l.renderReactComponent)(
                                                t.uiUtilities,
                                                a.createElement(r.ContextualMenu, {
                                                    target: e,
                                                    onDismiss: n,
                                                    items: i,
                                                })
                                            ));
                                    },
                                    dismiss: function (e) {
                                        var o;
                                        null === (o = t.disposer) || void 0 === o || o.call(t),
                                            (t.disposer = null);
                                    },
                                }) || this;
                            return (t.uiUtilities = null), (t.disposer = null), t;
                        }
                        return (
                            (0, n.__extends)(t, e),
                            (t.prototype.setUIUtilities = function (e) {
                                this.uiUtilities = e;
                            }),
                            t
                        );
                    })(i.ContextMenu);
                t.default = function () {
                    return new f();
                };
            },
            8217: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(5014),
                    i = o(1905),
                    r = (function () {
                        function e(e, t, o, n, a) {
                            (this.menuName = e),
                                (this.items = t),
                                (this.strings = o),
                                (this.shouldAddMenuItems = n),
                                (this.context = a),
                                (this.editor = null),
                                (this.targetNode = null),
                                (this.uiUtilities = null);
                        }
                        return (
                            (e.prototype.getName = function () {
                                return this.menuName;
                            }),
                            (e.prototype.initialize = function (e) {
                                this.editor = e;
                            }),
                            (e.prototype.dispose = function () {
                                this.editor = null;
                            }),
                            (e.prototype.getContextMenuItems = function (e) {
                                var t,
                                    o = this;
                                return (
                                    (this.targetNode = e),
                                    this.editor &&
                                    (null === (t = this.shouldAddMenuItems) || void 0 === t
                                        ? void 0
                                        : t.call(this, this.editor, e))
                                        ? this.items
                                              .filter(function (t) {
                                                  return (
                                                      !t.shouldShow ||
                                                      t.shouldShow(o.editor, e, o.context)
                                                  );
                                              })
                                              .map(function (t) {
                                                  return o.convertMenuItems(t, e);
                                              })
                                        : []
                                );
                            }),
                            (e.prototype.setUIUtilities = function (e) {
                                this.uiUtilities = e;
                            }),
                            (e.prototype.convertMenuItems = function (e, t) {
                                var o,
                                    r = this,
                                    l =
                                        null === (o = e.getSelectedId) || void 0 === o
                                            ? void 0
                                            : o.call(e, this.editor, t);
                                return {
                                    key: e.key,
                                    data: e,
                                    text: (0, a.default)(this.strings, e.key, e.unlocalizedText),
                                    ariaLabel: (0, a.default)(
                                        this.strings,
                                        e.key,
                                        e.unlocalizedText
                                    ),
                                    onClick: function () {
                                        return r.onClick(e, e.key);
                                    },
                                    iconProps: e.iconProps,
                                    subMenuProps: e.subItems
                                        ? (0, n.__assign)(
                                              {
                                                  onItemClick: function (t, o) {
                                                      return o && r.onClick(e, o.data);
                                                  },
                                                  items: (0, i.getObjectKeys)(e.subItems).map(
                                                      function (t) {
                                                          var o;
                                                          return {
                                                              key: t,
                                                              data: t,
                                                              text: (0, a.default)(
                                                                  r.strings,
                                                                  t,
                                                                  null === (o = e.subItems) ||
                                                                      void 0 === o
                                                                      ? void 0
                                                                      : o[t]
                                                              ),
                                                              className: e.itemClassName,
                                                              onRender: e.itemRender
                                                                  ? function (o) {
                                                                        var n;
                                                                        return null ===
                                                                            (n = e.itemRender) ||
                                                                            void 0 === n
                                                                            ? void 0
                                                                            : n.call(
                                                                                  e,
                                                                                  o,
                                                                                  function () {
                                                                                      return r.onClick(
                                                                                          e,
                                                                                          t
                                                                                      );
                                                                                  }
                                                                              );
                                                                    }
                                                                  : void 0,
                                                              iconProps:
                                                                  t == l
                                                                      ? { iconName: 'Checkmark' }
                                                                      : void 0,
                                                          };
                                                      }
                                                  ),
                                              },
                                              e.commandBarSubMenuProperties || {}
                                          )
                                        : void 0,
                                };
                            }),
                            (e.prototype.onClick = function (e, t) {
                                this.editor &&
                                    this.targetNode &&
                                    this.uiUtilities &&
                                    e.onClick(
                                        t,
                                        this.editor,
                                        this.targetNode,
                                        this.strings,
                                        this.uiUtilities,
                                        this.context
                                    );
                            }),
                            e
                        );
                    })();
                t.default = function (e, t, o, n, a) {
                    return new r(e, t, o, n, a);
                };
            },
            3598: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(3538);
                t.default = function (e) {
                    var t,
                        o = e.emoji,
                        r = e.onClick,
                        l = e.isSelected,
                        f = e.onMouseOver,
                        s = e.onFocus,
                        m = e.strings,
                        c = e.id,
                        u = e.classNames,
                        d = o.description && m[o.description];
                    return a.createElement(
                        'button',
                        (0, n.__assign)(
                            {
                                id: c,
                                role: 'option',
                                className: (0, i.css)(
                                    u.emoji,
                                    ((t = {}), (t[u.emojiSelected] = l), t)
                                ),
                                onClick: r,
                                onMouseOver: f,
                                onFocus: s,
                                'data-is-focusable': !0,
                                'aria-label': d,
                                'aria-selected': l,
                            },
                            (function (e) {
                                return (t = e || {})
                                    ? Object.keys(t).reduce(function (e, o) {
                                          return (
                                              (0 === (n = o).indexOf('data-') ||
                                                  0 === n.indexOf('aria-')) &&
                                                  (e[o] = t[o]),
                                              e
                                          );
                                          var n;
                                      }, {})
                                    : t;
                                var t;
                            })(e)
                        ),
                        o.codePoint || '…'
                    );
                };
            },
            9980: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7363),
                    a = o(3538),
                    i = o(3801),
                    r = o(3538),
                    l = o(1905),
                    f = o(3538),
                    s = o(3538);
                t.default = function (e) {
                    var t = e.currentSelected,
                        o = e.getTabId,
                        m = e.strings,
                        c = void 0 === m ? {} : m,
                        u = e.classNames,
                        d = (0, l.getObjectKeys)(i.EmojiList),
                        g = function (t) {
                            e.onClick && e.onClick(t);
                        };
                    return n.createElement(
                        'div',
                        { className: u.navBar, role: 'tablist' },
                        n.createElement(
                            r.FocusZone,
                            { direction: r.FocusZoneDirection.horizontal },
                            d.map(function (e, r) {
                                var l,
                                    m = e === t,
                                    h = c[e];
                                return n.createElement(
                                    s.TooltipHost,
                                    { hostClassName: u.navBarTooltip, content: h, key: e },
                                    n.createElement(
                                        'button',
                                        {
                                            className: (0, a.css)(
                                                u.navBarButton,
                                                ((l = {}), (l[u.selected] = m), l)
                                            ),
                                            key: e,
                                            onClick: g.bind(onclick, e),
                                            id: null == o ? void 0 : o(e),
                                            role: 'tab',
                                            'aria-selected': m,
                                            'aria-label': h,
                                            'data-is-focusable': 'true',
                                            'aria-posinset': r + 1,
                                            tabIndex: 0,
                                            'aria-setsize': d.length,
                                        },
                                        n.createElement(f.Icon, {
                                            iconName: i.EmojiFabricIconCharacterMap[e],
                                        })
                                    )
                                );
                            })
                        )
                    );
                };
            },
            940: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.showEmojiPane = t.EmojiPaneNavigateDirection = t.EmojiPaneMode = void 0);
                var n,
                    a,
                    i = o(7582),
                    r = o(7363),
                    l = o(3598),
                    f = o(9980),
                    s = o(1517),
                    m = o(3538),
                    c = o(3801),
                    u = o(3538),
                    d = o(3538),
                    g = o(6933),
                    h = o(3538),
                    j = o(4607),
                    p = o(3538),
                    b = o(3538),
                    y = [u.KeyCodes.up, u.KeyCodes.down],
                    D = [
                        u.KeyCodes.left,
                        u.KeyCodes.right,
                        u.KeyCodes.up,
                        u.KeyCodes.down,
                        u.KeyCodes.home,
                        u.KeyCodes.end,
                    ],
                    v = {
                        isBeakVisible: !0,
                        beakWidth: 16,
                        gapSpace: 0,
                        setInitialFocus: !0,
                        doNotLayer: !1,
                        directionalHint: m.DirectionalHint.bottomCenter,
                    };
                ((a = t.EmojiPaneMode || (t.EmojiPaneMode = {}))[(a.Quick = 0)] = 'Quick'),
                    (a[(a.Partial = 1)] = 'Partial'),
                    (a[(a.Full = 2)] = 'Full'),
                    ((n = t.EmojiPaneNavigateDirection || (t.EmojiPaneNavigateDirection = {}))[
                        (n.Horizontal = 0)
                    ] = 'Horizontal'),
                    (n[(n.Vertical = 1)] = 'Vertical');
                var k = 'aria-activedescendant',
                    K = r.forwardRef(function (e, t) {
                        var o,
                            n,
                            a,
                            h = (0, i.__read)(r.useState(0), 2),
                            K = h[0],
                            C = h[1],
                            S = (0, i.__read)(r.useState(0), 2),
                            x = S[0],
                            M = S[1],
                            P = (0, i.__read)(r.useState(c.CommonEmojis), 2),
                            _ = P[0],
                            N = P[1],
                            B = (0, i.__read)(r.useState('People'), 2),
                            I = B[0],
                            T = B[1],
                            O = (0, i.__read)(r.useState(':'), 2),
                            R = O[0],
                            E = O[1],
                            L = (0, i.__read)(r.useState(''), 2),
                            F = L[0],
                            z = L[1],
                            A = (0, b.useTheme)(),
                            U = w(A),
                            H = 'EmojiPane' + e.baseId,
                            G = r.useCallback(
                                function (e, t) {
                                    t || (t = 0), 1 === t && -1 !== K && (e *= 7);
                                    var o = K + e,
                                        n = _.length;
                                    return o >= 0 && o < n ? (C(o), o) : -1;
                                },
                                [K]
                            ),
                            W = r.useCallback(function (e, t) {
                                return null == e ? '' : (t && (e = e.substr(1)), e.trim());
                            }, []),
                            q = r.useCallback(
                                function (e) {
                                    var t = _[e];
                                    return t ? Z(t) : null;
                                },
                                [_]
                            ),
                            V = r.useCallback(
                                function () {
                                    return _[K];
                                },
                                [_, K]
                            ),
                            Y = r.useCallback(
                                function (e) {
                                    var t = W(e, !0),
                                        o = 0 === t.length ? 2 : 1;
                                    C(2 === o ? -1 : 0), M(o), N(Q(t, o)), E(e), z(t);
                                },
                                [x]
                            ),
                            J = r.useCallback(
                                function (e) {
                                    var t = W(e, !1);
                                    C(0), N(Q(t, x)), E(e);
                                },
                                [K, R, _]
                            ),
                            Q = r.useCallback(
                                function (t, o) {
                                    var n = 0 === o;
                                    if (!t) return n ? _ : c.EmojiList[I];
                                    var a = (0, j.searchEmojis)(t, e.strings);
                                    return n ? a.slice(0, 5).concat([c.MoreEmoji]) : a;
                                },
                                [x, I, _]
                            ),
                            Z = r.useCallback(
                                function (e) {
                                    return e ? H + '-' + e.key : '';
                                },
                                [H]
                            );
                        r.useImperativeHandle(
                            t,
                            function () {
                                return {
                                    navigate: G,
                                    getEmojiElementIdByIndex: q,
                                    showFullPicker: Y,
                                    getSearchResult: Q,
                                    setSearch: J,
                                    getSelectedEmoji: V,
                                    normalizeSearchText: W,
                                    getEmojiIconId: Z,
                                };
                            },
                            [G, q, Y, Q, J, Z, V, W]
                        );
                        var X = function (e) {
                                a = e.target;
                            },
                            $ = function (e) {
                                e &&
                                    e.which === u.KeyCodes.enter &&
                                    K >= 0 &&
                                    _ &&
                                    _.length > 0 &&
                                    le(e, _[K]);
                            },
                            ee = function (e) {
                                if (e && !(D.indexOf(e.which) < 0)) {
                                    if (
                                        (e.preventDefault(),
                                        e.stopPropagation(),
                                        e.which === u.KeyCodes.home)
                                    )
                                        return C(0), void (n.scrollTop = 0);
                                    if (e.which === u.KeyCodes.end)
                                        return C(_.length - 1), void (n.scrollTop = n.scrollHeight);
                                    var t = y.indexOf(e.which) < 0 ? 0 : 1,
                                        o = G(
                                            e.which === u.KeyCodes.left || e.which === u.KeyCodes.up
                                                ? -1
                                                : 1,
                                            t
                                        );
                                    if (o > -1) {
                                        var a = 2 === x ? 5 : 6,
                                            i = Math.floor(o / 7),
                                            r = n.scrollTop,
                                            l = 40 * i;
                                        if (r <= l && r + 40 * a >= l + 40) return;
                                        n.scrollTop = 40 * i;
                                    }
                                }
                            },
                            te = function (t, o) {
                                var n = e.strings;
                                return o.map(function (e, a) {
                                    return r.createElement(l.default, {
                                        strings: n,
                                        id: Z(e),
                                        key: e.key,
                                        onMouseOver: function () {
                                            return C(a);
                                        },
                                        onFocus: function () {
                                            return C(a);
                                        },
                                        emoji: e,
                                        classNames: U,
                                        isSelected: t === a,
                                        onClick: function (t) {
                                            return le(t, e);
                                        },
                                        'aria-posinset': t + 1,
                                        'aria-setsize': o.length,
                                    });
                                });
                            },
                            oe = function (e) {
                                n = e;
                            },
                            ne = function (e) {
                                var t = e;
                                N(c.EmojiList[t]), T(t);
                            },
                            ae = function (t) {
                                return 'family_' + t + '_' + e.baseId;
                            },
                            ie = function (t) {
                                if ((e.searchDisabled && t && t.focus(), a)) {
                                    a.removeAttribute(k);
                                    var o = Z(V());
                                    o &&
                                        setTimeout(function () {
                                            return a.setAttribute(k, o);
                                        }, 0);
                                }
                            },
                            re = function (e, t) {
                                if ('string' == typeof t) {
                                    var o = W(t, !1),
                                        n = 0 === o.length ? 2 : 1;
                                    C(2 === n ? -1 : 0), N(Q(o, x)), z(t), M(n);
                                }
                            },
                            le = function (t, o) {
                                t.stopPropagation(),
                                    t.preventDefault(),
                                    e.onSelect && e.onSelect(o, R);
                            };
                        return r.createElement(
                            r.Fragment,
                            null,
                            (function (e, t, n, a, l) {
                                return 0 === x
                                    ? (function (e, t, o) {
                                          var n = e.strings,
                                              a = V(),
                                              l = a ? '#' + Z(a) : void 0,
                                              f = (null == a ? void 0 : a.description)
                                                  ? n[a.description]
                                                  : void 0,
                                              s = te(t, o);
                                          return r.createElement(
                                              'div',
                                              { id: H, role: 'listbox' },
                                              s,
                                              r.createElement(
                                                  'div',
                                                  {
                                                      id: H,
                                                      role: 'listbox',
                                                      className: (0, u.css)(
                                                          U.quickPicker,
                                                          U.roosterEmojiPane
                                                      ),
                                                  },
                                                  r.createElement(
                                                      m.Callout,
                                                      (0, i.__assign)({}, v, {
                                                          role: 'tooltip',
                                                          target: l,
                                                          hidden: !f || !s,
                                                          className: U.tooltip,
                                                      }),
                                                      f
                                                  )
                                              )
                                          );
                                      })(e, t, l)
                                    : (function (e, t, n, a, l) {
                                          var m,
                                              c = e.searchDisabled,
                                              u = e.searchBoxString,
                                              h = Z(V()),
                                              j =
                                                  (((m = {})['aria-autocomplete'] = 'list'),
                                                  (m['aria-expanded'] = 'true'),
                                                  (m['aria-haspopup'] = 'listbox'),
                                                  (m['aria-owns'] = H),
                                                  m);
                                          return (
                                              h && (j[k] = h),
                                              r.createElement(
                                                  'div',
                                                  { className: U.roosterEmojiPane },
                                                  !c &&
                                                      r.createElement(
                                                          p.TextField,
                                                          (0, i.__assign)(
                                                              {
                                                                  role: 'combobox',
                                                                  componentRef: function (e) {
                                                                      return (function (e) {
                                                                          e &&
                                                                              (null == (o = e)
                                                                                  ? void 0
                                                                                  : o.value) &&
                                                                              (o.focus(),
                                                                              o.setSelectionStart(
                                                                                  o.value.length
                                                                              ));
                                                                      })(e);
                                                                  },
                                                                  value: n,
                                                                  onChange: re,
                                                                  inputClassName: U.emojiTextInput,
                                                                  onKeyPress: $,
                                                                  onKeyDown: ee,
                                                                  onFocus: X,
                                                                  placeholder: (0,
                                                                  g.getLocalizedString)(
                                                                      u,
                                                                      'emojiSearchPlaceholder',
                                                                      'Search...'
                                                                  ),
                                                                  ariaLabel: (0,
                                                                  g.getLocalizedString)(
                                                                      u,
                                                                      'emojiSearchInputAriaLabel',
                                                                      'Search...'
                                                                  ),
                                                              },
                                                              j
                                                          )
                                                      ),
                                                  2 === x
                                                      ? (function (e, t, o, n) {
                                                            var a = e.strings,
                                                                l = e.hideStatusBar,
                                                                m = e.navBarProps,
                                                                c = e.statusBarProps,
                                                                u = n && n.length > 0;
                                                            return r.createElement(
                                                                'div',
                                                                { className: U.fullList },
                                                                r.createElement(
                                                                    'div',
                                                                    {
                                                                        className: U.fullListBody,
                                                                        'data-is-scrollable': !0,
                                                                        tabIndex: -1,
                                                                        ref: oe,
                                                                    },
                                                                    r.createElement(
                                                                        f.default,
                                                                        (0, i.__assign)(
                                                                            { strings: a },
                                                                            m,
                                                                            {
                                                                                onClick: ne,
                                                                                currentSelected: o,
                                                                                getTabId: ae,
                                                                                classNames: U,
                                                                            }
                                                                        )
                                                                    ),
                                                                    r.createElement(
                                                                        'div',
                                                                        {
                                                                            role: 'tabpanel',
                                                                            'aria-labelledby': ae(
                                                                                o
                                                                            ),
                                                                        },
                                                                        r.createElement(
                                                                            'div',
                                                                            null,
                                                                            r.createElement(
                                                                                d.FocusZone,
                                                                                {
                                                                                    id: H,
                                                                                    role: 'listbox',
                                                                                    className:
                                                                                        U.fullListContent,
                                                                                    ref: ie,
                                                                                },
                                                                                te(t, n)
                                                                            )
                                                                        )
                                                                    )
                                                                ),
                                                                !l &&
                                                                    r.createElement(
                                                                        s.default,
                                                                        (0, i.__assign)(
                                                                            {
                                                                                classNames: U,
                                                                                strings: a,
                                                                            },
                                                                            c,
                                                                            {
                                                                                hasResult: u,
                                                                                emoji: V(),
                                                                            }
                                                                        )
                                                                    )
                                                            );
                                                        })(e, t, a, l)
                                                      : (function (e, t, o) {
                                                            var n = e.strings,
                                                                a = e.hideStatusBar,
                                                                l = e.statusBarProps,
                                                                f = o && o.length > 0;
                                                            return r.createElement(
                                                                'div',
                                                                null,
                                                                r.createElement(
                                                                    'div',
                                                                    {
                                                                        className: U.partialList,
                                                                        'data-is-scrollable': !0,
                                                                        tabIndex: -1,
                                                                        ref: oe,
                                                                    },
                                                                    r.createElement(
                                                                        d.FocusZone,
                                                                        {
                                                                            id: H,
                                                                            role: 'listbox',
                                                                            className:
                                                                                U.fullListContent,
                                                                            ref: ie,
                                                                        },
                                                                        te(t, o)
                                                                    )
                                                                ),
                                                                !a &&
                                                                    r.createElement(
                                                                        s.default,
                                                                        (0, i.__assign)(
                                                                            {
                                                                                classNames: U,
                                                                                strings: n,
                                                                            },
                                                                            l,
                                                                            {
                                                                                hasResult: f,
                                                                                emoji: V(),
                                                                            }
                                                                        )
                                                                    )
                                                            );
                                                        })(e, t, l)
                                              )
                                          );
                                      })(e, t, n, a, l);
                            })(e, K, F, I, _)
                        );
                    });
                t.showEmojiPane = function (e, t, o, n, a) {
                    return r.createElement(K, {
                        ref: o,
                        baseId: n,
                        searchBoxString: a,
                        strings: t,
                        onSelect: e,
                    });
                };
                var C = function () {
                        return (245).toString() + 'px';
                    },
                    w = (0, u.memoizeFunction)(function (e) {
                        var t = e.palette;
                        return (0,
                        h.mergeStyleSets)({ quickPicker: { overflowY: 'hidden', ':after': { content: '', position: 'absolute', left: '0px', top: '0px', bottom: '0px', right: '0px', zIndex: 1, borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgb(255, 255, 255)', borderImage: 'initial', outline: 'rgb(102, 102, 102) solid 1px' } }, tooltip: { padding: '8px' }, emojiTextInput: { padding: '6px' }, partialList: { maxHeight: C(), overflow: 'hidden', overflowY: 'scroll' }, fullListContent: { width: (282).toString() + 'px' }, fullListBody: { maxHeight: C(), overflow: 'hidden', overflowY: 'scroll', height: C() }, fullList: { position: 'relative' }, roosterEmojiPane: { padding: '1px', background: t.white }, emoji: { fontSize: '18px', width: '40px', height: '40px', border: '0', position: 'relative', background: t.white, transition: 'backgorund 0.5s ease-in-out' }, emojiSelected: { background: t.neutralLight }, navBar: { top: '-1px', zIndex: 10, position: 'sticky' }, navBarTooltip: { display: 'inline-block' }, navBarButton: { height: '40px', width: '40px', border: '0', borderBottom: 'solid 1px', padding: 0, marginBottom: 0, display: 'inline-block', color: t.themeDark, background: t.white, '&:hover': { cursor: 'default' } }, selected: { borderBottom: '2px solid', borderBottomColor: t.themeDark }, statusBar: { borderTop: 'solid 1px', height: '50px', overflow: 'hidden', position: 'relative', background: t.white }, statusBarIcon: { padding: '4px', fontSize: '25px', display: 'inline-block', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '40px' }, statusBarDetailsContainer: { padding: '0 4px', lineHeight: '50px', position: 'absolute', display: 'inline-block', left: '40px', right: '0', top: '0' }, statusBarDetails: { fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, statusBarNoResultDetailsContainer: { lineHeight: '50px', position: 'absolute', display: 'inline-block', top: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', left: '0', padding: '0 8px' } });
                    });
            },
            1517: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7363),
                    a = o(3538);
                t.default = function (e) {
                    var t = e.emoji,
                        o = e.strings,
                        i = e.hasResult,
                        r = e.classNames;
                    if (!i) {
                        var l = o.emjDNoSuggetions;
                        return n.createElement(
                            'div',
                            { className: r.statusBar },
                            n.createElement(
                                'div',
                                { style: { display: 'none' }, 'aria-live': 'polite' },
                                l
                            ),
                            n.createElement(
                                'div',
                                { className: r.statusBarNoResultDetailsContainer },
                                n.createElement(
                                    a.TooltipHost,
                                    { content: l, overflowMode: a.TooltipOverflowMode.Parent },
                                    n.createElement('span', { role: 'alert' }, l)
                                )
                            )
                        );
                    }
                    var f = t ? t.codePoint : '',
                        s = (null == t ? void 0 : t.description) ? o[t.description] : '';
                    return n.createElement(
                        'div',
                        { className: r.statusBar },
                        n.createElement(
                            'i',
                            {
                                className: r.statusBarIcon,
                                role: 'presentation',
                                'aria-hidden': 'true',
                            },
                            f
                        ),
                        n.createElement(
                            'div',
                            { className: r.statusBarDetailsContainer },
                            n.createElement(
                                'div',
                                { className: r.statusBarDetails },
                                n.createElement(
                                    a.TooltipHost,
                                    { content: s, overflowMode: a.TooltipOverflowMode.Parent },
                                    s
                                )
                            )
                        )
                    );
                };
            },
            2967: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(3538),
                    r = o(1672),
                    l = o(940),
                    f = a.forwardRef(function (e, t) {
                        var o = e.cursorRect,
                            r = e.strings,
                            f = e.onSelectFromPane,
                            s = e.onHideCallout,
                            m = e.searchBoxString,
                            c = e.dismiss,
                            u = e.paneRef,
                            d = e.baseId,
                            g = (0, n.__read)(a.useState(!0), 2),
                            h = g[0],
                            j = g[1];
                        a.useImperativeHandle(
                            t,
                            function () {
                                return { dismiss: c };
                            },
                            [c]
                        );
                        var p = { x: o.left, y: (o.top + o.bottom) / 2 },
                            b = (o.bottom - o.top) / 2 + 5;
                        h || s();
                        var y = a.useCallback(
                            function () {
                                j(!1), c();
                            },
                            [c]
                        );
                        return a.createElement(
                            a.Fragment,
                            null,
                            h &&
                                a.createElement(
                                    i.Callout,
                                    {
                                        target: p,
                                        directionalHint: i.DirectionalHint.bottomAutoEdge,
                                        isBeakVisible: !1,
                                        gapSpace: b,
                                        onDismiss: y,
                                    },
                                    (0, l.showEmojiPane)(f, r, u, d, m)
                                )
                        );
                    });
                t.default = function (e, t, o, n, i, l, s, m, c) {
                    var u = null;
                    u = (0, r.renderReactComponent)(
                        e,
                        a.createElement(f, {
                            ref: l,
                            cursorRect: t,
                            strings: o,
                            onSelectFromPane: n,
                            paneRef: i,
                            onHideCallout: s,
                            searchBoxString: c,
                            baseId: m,
                            dismiss: function () {
                                null == u || u(), (u = null);
                            },
                        })
                    );
                };
            },
            9916: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.createEmojiPlugin = void 0);
                var n = o(7259);
                Object.defineProperty(t, 'createEmojiPlugin', {
                    enumerable: !0,
                    get: function () {
                        return n.default;
                    },
                });
            },
            7259: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(2967),
                    r = o(1905),
                    l = o(3538),
                    f = o(3801),
                    s = o(1905),
                    m = o(2110),
                    c = /([\u0023-\u0039][\u20e3]|[\ud800-\udbff][\udc00-\udfff]|[\u00a9-\u00ae]|[\u2122-\u3299])*([:;][^:]*)/,
                    u = (function () {
                        function e(e) {
                            var t = this;
                            (this.searchBoxStrings = e),
                                (this.editor = null),
                                (this.eventHandledOnKeyDown = !1),
                                (this.canUndoEmoji = !1),
                                (this.isSuggesting = !1),
                                (this.paneRef = a.createRef()),
                                (this.timer = null),
                                (this.uiUtilities = null),
                                (this.emojiCalloutRef = a.createRef()),
                                (this.baseId = 0),
                                (this.onHideCallout = function () {
                                    return t.setIsSuggesting(!1);
                                }),
                                (this.onSelectFromPane = function (e, o) {
                                    var n;
                                    e !== f.MoreEmoji
                                        ? t.insertEmoji(e, o)
                                        : null === (n = t.paneRef.current) ||
                                          void 0 === n ||
                                          n.showFullPicker(o);
                                }),
                                (this.strings = (0, n.__assign)(
                                    (0, n.__assign)(
                                        (0, n.__assign)({}, m.EmojiDescriptionStrings),
                                        m.EmojiKeywordStrings
                                    ),
                                    m.EmojiFamilyStrings
                                ));
                        }
                        return (
                            (e.prototype.setUIUtilities = function (e) {
                                this.uiUtilities = e;
                            }),
                            (e.prototype.getName = function () {
                                return 'Emoji';
                            }),
                            (e.prototype.dispose = function () {
                                var e;
                                this.setIsSuggesting(!1),
                                    null === (e = this.emojiCalloutRef.current) ||
                                        void 0 === e ||
                                        e.dismiss(),
                                    (this.editor = null),
                                    (this.baseId = 0);
                            }),
                            (e.prototype.initialize = function (e) {
                                this.editor = e;
                            }),
                            (e.prototype.onPluginEvent = function (e) {
                                0 === e.eventType
                                    ? ((this.eventHandledOnKeyDown = !1),
                                      this.isSuggesting
                                          ? this.onKeyDownSuggestingDomEvent(e)
                                          : e.rawEvent.which === l.KeyCodes.backspace &&
                                            this.canUndoEmoji &&
                                            (this.editor.undo(),
                                            this.handleEventOnKeyDown(e),
                                            (this.canUndoEmoji = !1)))
                                    : 2 !== e.eventType || (0, r.isModifierKey)(e.rawEvent)
                                    ? 6 === e.eventType &&
                                      ((this.canUndoEmoji = !1), this.setIsSuggesting(!1))
                                    : this.isSuggesting
                                    ? this.onKeyUpSuggestingDomEvent(e)
                                    : this.onKeyUpDomEvent(e);
                            }),
                            (e.prototype.onKeyDownSuggestingDomEvent = function (e) {
                                var t,
                                    o,
                                    n = this.getWordBeforeCursor(e);
                                switch (e.rawEvent.which) {
                                    case l.KeyCodes.enter:
                                        var a =
                                            null === (t = this.paneRef.current) || void 0 === t
                                                ? void 0
                                                : t.getSelectedEmoji();
                                        if (!a || !n || this.tryShowFullPicker(e, a, n)) break;
                                        this.insertEmoji(a, n), this.handleEventOnKeyDown(e);
                                        break;
                                    case l.KeyCodes.left:
                                    case l.KeyCodes.right:
                                        null === (o = this.paneRef.current) ||
                                            void 0 === o ||
                                            o.navigate(
                                                e.rawEvent.which === l.KeyCodes.left ? -1 : 1
                                            ),
                                            this.handleEventOnKeyDown(e);
                                        break;
                                    case l.KeyCodes.escape:
                                        this.setIsSuggesting(!1), this.handleEventOnKeyDown(e);
                                }
                            }),
                            (e.prototype.tryShowFullPicker = function (e, t, o) {
                                var n;
                                return (
                                    t === f.MoreEmoji &&
                                    (this.handleEventOnKeyDown(e),
                                    null === (n = this.paneRef.current) ||
                                        void 0 === n ||
                                        n.showFullPicker(o),
                                    !0)
                                );
                            }),
                            (e.prototype.onKeyUpSuggestingDomEvent = function (e) {
                                var t, o, n, a;
                                if (!this.eventHandledOnKeyDown) {
                                    this.timer &&
                                        ((1 === e.rawEvent.key.length &&
                                            e.rawEvent.which !== l.KeyCodes.space) ||
                                            e.rawEvent.which === l.KeyCodes.backspace) &&
                                        (null ===
                                            (o =
                                                null === (t = this.editor) || void 0 === t
                                                    ? void 0
                                                    : t.getDocument().defaultView) ||
                                            void 0 === o ||
                                            o.clearTimeout(this.timer),
                                        (this.timer = null),
                                        null === (n = this.emojiCalloutRef.current) ||
                                            void 0 === n ||
                                            n.dismiss());
                                    var i = this.getWordBeforeCursor(e);
                                    i && this.paneRef
                                        ? null === (a = this.paneRef.current) ||
                                          void 0 === a ||
                                          a.setSearch(i)
                                        : this.setIsSuggesting(!1);
                                }
                            }),
                            (e.prototype.onKeyUpDomEvent = function (e) {
                                if (!this.eventHandledOnKeyDown) {
                                    var t = this.getWordBeforeCursor(e);
                                    (186 !== e.rawEvent.which && 59 !== e.rawEvent.which) ||
                                        ':' !== t ||
                                        this.setIsSuggesting(!0);
                                }
                            }),
                            (e.prototype.getCallout = function () {
                                var e,
                                    t =
                                        null === (e = this.editor) || void 0 === e
                                            ? void 0
                                            : e.getElementAtCursor(),
                                    o = null == t ? void 0 : t.getBoundingClientRect();
                                this.uiUtilities &&
                                    o &&
                                    (this.baseId++,
                                    (0, i.default)(
                                        this.uiUtilities,
                                        o,
                                        this.strings,
                                        this.onSelectFromPane,
                                        this.paneRef,
                                        this.emojiCalloutRef,
                                        this.onHideCallout,
                                        this.baseId,
                                        this.searchBoxStrings
                                    ));
                            }),
                            (e.prototype.setIsSuggesting = function (e) {
                                var t;
                                this.isSuggesting !== e &&
                                    ((this.isSuggesting = e),
                                    this.isSuggesting
                                        ? this.getCallout()
                                        : this.emojiCalloutRef &&
                                          (null === (t = this.emojiCalloutRef.current) ||
                                              void 0 === t ||
                                              t.dismiss()));
                            }),
                            (e.prototype.insertEmoji = function (e, t) {
                                var o,
                                    n = this;
                                if (t && this.editor && e.codePoint) {
                                    var a = this.editor.getDocument().createElement('span');
                                    (a.innerText = e.codePoint),
                                        this.editor.addUndoSnapshot(
                                            function () {
                                                n.editor &&
                                                    ((0, s.replaceWithNode)(n.editor, t, a, !0),
                                                    n.editor.select(a, -3));
                                            },
                                            void 0,
                                            !0
                                        ),
                                        null === (o = this.emojiCalloutRef.current) ||
                                            void 0 === o ||
                                            o.dismiss();
                                }
                            }),
                            (e.prototype.getWordBeforeCursor = function (e) {
                                var t,
                                    o =
                                        null === (t = this.editor) || void 0 === t
                                            ? void 0
                                            : t.getContentSearcherOfCursor(e),
                                    n = o ? o.getWordBefore() : null,
                                    a = n ? c.exec(n) : null;
                                return a && a.length > 2 && a[0] === n ? a[2] : null;
                            }),
                            (e.prototype.handleEventOnKeyDown = function (e) {
                                (this.eventHandledOnKeyDown = !0),
                                    e.rawEvent.preventDefault(),
                                    e.rawEvent.stopImmediatePropagation();
                            }),
                            e
                        );
                    })();
                t.default = function (e) {
                    return new u(e);
                };
            },
            2110: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.EmojiFamilyStrings = t.EmojiKeywordStrings = t.EmojiDescriptionStrings = void 0),
                    (t.EmojiDescriptionStrings = {
                        emjDMore: 'More',
                        emjDNoSuggetions: 'No suggestions found',
                        emjD0270a: 'Raised fist',
                        emjD0270b: 'Raised hand',
                        emjD0270c: 'Victory hand',
                        emjD02764: 'Red heart',
                        emjD1f440: 'Eyes',
                        emjD1f442: 'Ear',
                        emjD1f443: 'Nose',
                        emjD1f444: 'Mouth',
                        emjD1f445: 'Tongue',
                        emjD1f446: 'Up-pointing backhand index finger',
                        emjD1f447: 'Down-pointing backhand index finger',
                        emjD1f448: 'Left-pointing backhand index finger',
                        emjD1f449: 'Right-pointing backhand index finger',
                        emjD1f44a: 'Fist bump',
                        emjD1f44b: 'Waving hand',
                        emjD1f44c: 'OK hand',
                        emjD1f44d: 'Thumbs up',
                        emjD1f44e: 'Thumbs down',
                        emjD1f44f: 'Clapping hands',
                        emjD1f450: 'Open hands',
                        emjD1f590: 'Raised hand with fingers splayed',
                        emjD1f595: 'Middle finger',
                        emjD1f596: 'Raised hand with part between middle and ring fingers',
                        emjD1f464: 'Bust in silhouette',
                        emjD1f466: 'Boy',
                        emjD1f467: 'Girl',
                        emjD1f468: 'Man',
                        emjD1f469: 'Woman',
                        emjD1f46a: 'Family',
                        emjD1f46b: 'Man and woman holding hands',
                        emjD1f46e: 'Police officer',
                        emjD1f46f: 'Woman with bunny ears',
                        emjD1f470: 'Bride with veil',
                        emjD1f471: 'Person with blond hair',
                        emjD1f472: 'Man with gua pi mao',
                        emjD1f473: 'Man with turban',
                        emjD1f474: 'Older man',
                        emjD1f475: 'Older woman',
                        emjD1f476: 'Baby',
                        emjD1f477: 'Construction worker',
                        emjD1f481: 'Information desk person',
                        emjD1f482: 'Guardsman',
                        emjD1f48b: 'Kiss mark',
                        emjD1f493: 'Beating heart',
                        emjD1f494: 'Broken heart',
                        emjD1f495: 'Two hearts',
                        emjD1f496: 'Sparkling heart',
                        emjD1f497: 'Growing heart',
                        emjD1f498: 'Heart with arrow',
                        emjD1f499: 'Blue heart',
                        emjD1f49a: 'Green heart',
                        emjD1f49b: 'Yellow heart',
                        emjD1f49c: 'Purple heart',
                        emjD1f49d: 'Heart with ribbon',
                        emjD1f49e: 'Revolving hearts',
                        emjD1f49f: 'Heart decoration',
                        emjD1f601: 'Grinning face with smiling eyes',
                        emjD1f602: 'Face with tears of joy',
                        emjD1f603: 'Smiling face with open mouth',
                        emjD1f604: 'Smiling face with open mouth and smiling eyes',
                        emjD1f605: 'Smiling face with open mouth and cold sweat',
                        emjD1f606: 'Smiling face with open mouth and tightly closed eyes',
                        emjD1f607: 'Smiling face with halo',
                        emjD1f608: 'Smiling face with horns',
                        emjD1f609: 'Winking face',
                        emjD1f60a: 'Smiling face with smiling eyes',
                        emjD1f60b: 'Face savoring delicious food',
                        emjD1f60c: 'Relieved face',
                        emjD1f60d: 'Smiling face with heart-shaped eyes',
                        emjD1f60e: 'Smiling face with sunglasses',
                        emjD1f60f: 'Smirking face',
                        emjD1f610: 'Neutral face',
                        emjD1f612: 'Unamused face',
                        emjD1f613: 'Face with cold sweat',
                        emjD1f614: 'Pensive face',
                        emjD1f616: 'Confounded face',
                        emjD1f618: 'Face throwing a kiss',
                        emjD1f61a: 'Kissing face with closed eyes',
                        emjD1f61c: 'Face with stuck-out tongue and winking eye',
                        emjD1f61d: 'Face with stuck-out tongue and tightly closed eyes',
                        emjD1f61e: 'Disappointed face',
                        emjD1f620: 'Angry face',
                        emjD1f621: 'Pouting face',
                        emjD1f622: 'Crying face',
                        emjD1f623: 'Persevering face',
                        emjD1f624: 'Face with look of triumph',
                        emjD1f625: 'Disappointed but relieved face',
                        emjD1f628: 'Fearful face',
                        emjD1f629: 'Weary face',
                        emjD1f62a: 'Sleepy face',
                        emjD1f62b: 'Tired face',
                        emjD1f62d: 'Loudly crying face',
                        emjD1f630: 'Face with open mouth and cold sweat',
                        emjD1f631: 'Face screaming in fear',
                        emjD1f632: 'Astonished face',
                        emjD1f633: 'Flushed face',
                        emjD1f635: 'Dizzy face',
                        emjD1f636: 'Face without mouth',
                        emjD1f637: 'Face with medical mask',
                        emjD1f645: 'Face with No Good gesture',
                        emjD1f646: 'Face with OK gesture',
                        emjD1f647: 'Person bowing deeply',
                        emjD1f648: 'See-no-evil monkey',
                        emjD1f649: 'Hear-no-evil monkey',
                        emjD1f641: 'Slightly frowning face',
                        emjD1f642: 'Slightly smiling face',
                        emjD1f64a: 'Speak-no-evil monkey',
                        emjD1f64b: 'Happy person raising one hand',
                        emjD1f64c: 'Person raising both hands in celebration',
                        emjD1f64d: 'Person frowning',
                        emjD1f64e: 'Person with pouting face',
                        emjD1f64f: 'Person with folded hands',
                        emjD02600: 'Sun with rays',
                        emjD02601: 'Cloud',
                        emjD02614: 'Umbrella with rain drops',
                        emjD0267b: 'Recycling symbol',
                        emjD026c4: 'Snowman without snow',
                        emjD026c5: 'Sun behind cloud',
                        emjD02728: 'Sparkles',
                        emjD02733: 'Eight-spoked asterisk',
                        emjD02734: 'Eight-pointed star',
                        emjD02744: 'Snowflake',
                        emjD02747: 'Sparkle',
                        emjD02b50: 'White medium star',
                        emjD1f300: 'Cyclone',
                        emjD1f301: 'Foggy',
                        emjD1f302: 'Closed umbrella',
                        emjD1f303: 'Night with stars',
                        emjD1f304: 'Sunrise over mountains',
                        emjD1f305: 'Sunrise',
                        emjD1f306: 'Cityscape at dusk',
                        emjD1f307: 'Sunset over buildings',
                        emjD1f308: 'Rainbow',
                        emjD1f309: 'Bridge at night',
                        emjD1f30a: 'Water wave',
                        emjD1f30b: 'Volcano',
                        emjD1f30c: 'Milky Way',
                        emjD1f311: 'New moon',
                        emjD1f313: 'First quarter moon',
                        emjD1f314: 'Waxing gibbous moon',
                        emjD1f315: 'Full moon',
                        emjD1f319: 'Crescent moon',
                        emjD1f31b: 'First quarter moon with face',
                        emjD1f31f: 'Glowing star',
                        emjD1f320: 'Shooting star',
                        emjD1f330: 'Chestnut',
                        emjD1f331: 'Seedling',
                        emjD1f334: 'Palm tree',
                        emjD1f335: 'Cactus',
                        emjD1f337: 'Tulip',
                        emjD1f338: 'Cherry blossom',
                        emjD1f339: 'Rose',
                        emjD1f33a: 'Hibiscus',
                        emjD1f33b: 'Sunflower',
                        emjD1f33c: 'Blossom',
                        emjD1f33d: 'Ear of corn',
                        emjD1f33e: 'Ear of rice',
                        emjD1f33f: 'Herb',
                        emjD1f340: 'Four leaf clover',
                        emjD1f341: 'Maple leaf',
                        emjD1f342: 'Fallen leaf',
                        emjD1f343: 'Leaf fluttering in wind',
                        emjD1f344: 'Mushroom',
                        emjD1f40c: 'Snail',
                        emjD1f40d: 'Snake',
                        emjD1f40e: 'Horse',
                        emjD1f411: 'Sheep',
                        emjD1f412: 'Monkey',
                        emjD1f414: 'Chicken',
                        emjD1f417: 'Boar',
                        emjD1f418: 'Elephant',
                        emjD1f419: 'Octopus',
                        emjD1f41a: 'Spiral shell',
                        emjD1f41b: 'Bug',
                        emjD1f41c: 'Ant',
                        emjD1f41d: 'Honeybee',
                        emjD1f41e: 'Ladybug',
                        emjD1f41f: 'Fish',
                        emjD1f420: 'Tropical fish',
                        emjD1f421: 'Blowfish',
                        emjD1f422: 'Turtle',
                        emjD1f423: 'Hatching chick',
                        emjD1f424: 'Baby chick',
                        emjD1f425: 'Front-facing baby chick',
                        emjD1f426: 'Bird',
                        emjD1f427: 'Penguin',
                        emjD1f428: 'Koala',
                        emjD1f429: 'Poodle',
                        emjD1f42b: 'Bactrian camel',
                        emjD1f42c: 'Dolphin',
                        emjD1f42d: 'Mouse face',
                        emjD1f42e: 'Cow face',
                        emjD1f42f: 'Tiger face',
                        emjD1f430: 'Rabbit face',
                        emjD1f431: 'Cat face',
                        emjD1f432: 'Dragon face',
                        emjD1f433: 'Spouting whale',
                        emjD1f434: 'Horse face',
                        emjD1f435: 'Monkey face',
                        emjD1f436: 'Dog face',
                        emjD1f437: 'Pig face',
                        emjD1f438: 'Frog face',
                        emjD1f439: 'Hamster face',
                        emjD1f43a: 'Wolf face',
                        emjD1f43b: 'Bear face',
                        emjD1f43c: 'Panda face',
                        emjD1f43d: 'Pig nose',
                        emjD1f43e: 'Paw prints',
                        emjD1f638: 'Grinning cat face with smiling eyes',
                        emjD1f639: 'Cat face with tears of joy',
                        emjD1f63a: 'Smiling cat face with open mouth',
                        emjD1f63b: 'Smiling cat face with heart-shaped eyes',
                        emjD1f63c: 'Cat face with wry smile',
                        emjD1f63d: 'Kissing cat face with closed eyes',
                        emjD1f63e: 'Pouting cat face',
                        emjD1f63f: 'Crying cat face',
                        emjD1f640: 'Weary cat face',
                        emjD0260e: 'Telephone',
                        emjD026bd: 'Soccer ball',
                        emjD026be: 'Baseball',
                        emjD1f004: 'Mahjong tile red dragon',
                        emjD1f380: 'Ribbon',
                        emjD1f381: 'Wrapped present',
                        emjD1f382: 'Birthday cake',
                        emjD1f383: 'Jack-o-lantern',
                        emjD1f384: 'Christmas tree',
                        emjD1f385: 'Father Christmas',
                        emjD1f386: 'Fireworks',
                        emjD1f387: 'Firework sparkler',
                        emjD1f388: 'Balloon',
                        emjD1f389: 'Party popper',
                        emjD1f38a: 'Confetti ball',
                        emjD1f38b: 'Tanabata tree',
                        emjD1f38c: 'Crossed flags',
                        emjD1f38d: 'Pine decoration',
                        emjD1f38e: 'Japanese dolls',
                        emjD1f38f: 'Carp streamer',
                        emjD1f390: 'Wind chime',
                        emjD1f391: 'Moon-viewing ceremony',
                        emjD1f392: 'School backpack',
                        emjD1f393: 'Graduation cap',
                        emjD1f3a0: 'Carousel horse',
                        emjD1f3a1: 'Ferris wheel',
                        emjD1f3a2: 'Roller coaster',
                        emjD1f3a3: 'Fishing pole and fish',
                        emjD1f3a4: 'Microphone',
                        emjD1f3a5: 'Movie camera',
                        emjD1f3a6: 'Cinema',
                        emjD1f3a7: 'Headphones',
                        emjD1f3a8: 'Artist palette',
                        emjD1f3a9: 'Top hat',
                        emjD1f3aa: 'Circus tent',
                        emjD1f3ab: 'Ticket',
                        emjD1f3ac: 'Clapper board',
                        emjD1f3ad: 'Performing arts',
                        emjD1f3ae: 'Video game',
                        emjD1f3af: 'Direct hit',
                        emjD1f3b0: 'Slot machine',
                        emjD1f3b1: 'Billiards',
                        emjD1f3b2: 'Game die',
                        emjD1f3b3: 'Bowling',
                        emjD1f3b4: 'Flower playing cards',
                        emjD1f3b5: 'Musical note',
                        emjD1f3b6: 'Multiple musical notes',
                        emjD1f3b7: 'Saxophone',
                        emjD1f3b8: 'Guitar',
                        emjD1f3b9: 'Musical keyboard',
                        emjD1f3ba: 'Trumpet',
                        emjD1f3bb: 'Violin',
                        emjD1f3bc: 'Musical score',
                        emjD1f3bd: 'Running shirt with sash',
                        emjD1f3be: 'Tennis racquet and ball',
                        emjD1f3bf: 'Ski and ski boot',
                        emjD1f3c0: 'Basketball and hoop',
                        emjD1f3c1: 'Checkered flag',
                        emjD1f3c2: 'Snowboarder',
                        emjD1f3c3: 'Runner',
                        emjD1f3c4: 'Surfer',
                        emjD1f3c6: 'Trophy',
                        emjD1f3c8: 'American football',
                        emjD1f3ca: 'Swimmer',
                        emjD1f478: 'Princess',
                        emjD1f479: 'Japanese ogre',
                        emjD1f47a: 'Japanese goblin',
                        emjD1f47b: 'Ghost',
                        emjD1f47c: 'Baby angel',
                        emjD1f47d: 'Extraterrestrial alien',
                        emjD1f47e: 'Alien monster',
                        emjD1f47f: 'Imp',
                        emjD1f480: 'Skull',
                        emjD1f483: 'Dancer',
                        emjD1f484: 'Lipstick',
                        emjD1f485: 'Nail polish',
                        emjD1f486: 'Face massage',
                        emjD1f487: 'Haircut',
                        emjD1f488: 'Barber pole',
                        emjD1f489: 'Syringe',
                        emjD1f48a: 'Pill',
                        emjD1f48c: 'Love letter',
                        emjD1f48d: 'Ring',
                        emjD1f48e: 'Gemstone',
                        emjD1f48f: 'Kiss',
                        emjD1f490: 'Bouquet',
                        emjD1f491: 'Couple with heart',
                        emjD1f492: 'Wedding',
                        emjD1f4f7: 'Camera',
                        emjD1f4f9: 'Video camera',
                        emjD1f4fa: 'Television',
                        emjD1f4fb: 'Radio',
                        emjD1f4fc: 'Videocassette',
                        emjD02615: 'Hot beverage',
                        emjD02702: 'Scissors',
                        emjD02709: 'Envelope',
                        emjD0270f: 'Pencil',
                        emjD02712: 'Nib',
                        emjD1f345: 'Tomato',
                        emjD1f346: 'Eggplant',
                        emjD1f347: 'Grapes',
                        emjD1f348: 'Melon',
                        emjD1f349: 'Watermelon',
                        emjD1f34a: 'Tangerine',
                        emjD1f34c: 'Banana',
                        emjD1f34d: 'Pineapple',
                        emjD1f34e: 'Red apple',
                        emjD1f34f: 'Green apple',
                        emjD1f351: 'Peach',
                        emjD1f352: 'Cherries',
                        emjD1f353: 'Strawberry',
                        emjD1f354: 'Hamburger',
                        emjD1f355: 'Slice of pizza',
                        emjD1f356: 'Meat on bone',
                        emjD1f357: 'Poultry leg',
                        emjD1f358: 'Rice cracker',
                        emjD1f359: 'Rice ball',
                        emjD1f35a: 'Cooked rice',
                        emjD1f35b: 'Curry and rice',
                        emjD1f35c: 'Steaming bowl',
                        emjD1f35d: 'Spaghetti',
                        emjD1f35e: 'Bread',
                        emjD1f35f: 'French fries',
                        emjD1f360: 'Roasted sweet potato',
                        emjD1f361: 'Dango',
                        emjD1f362: 'Oden',
                        emjD1f363: 'Sushi',
                        emjD1f364: 'Fried shrimp',
                        emjD1f365: 'Fish cake with swirl design',
                        emjD1f366: 'Soft ice cream',
                        emjD1f367: 'Shaved ice',
                        emjD1f368: 'Ice cream',
                        emjD1f369: 'Doughnut',
                        emjD1f36a: 'Cookie',
                        emjD1f36b: 'Chocolate bar',
                        emjD1f36c: 'Candy',
                        emjD1f36d: 'Lollipop',
                        emjD1f36e: 'Custard',
                        emjD1f36f: 'Honey pot',
                        emjD1f370: 'Shortcake',
                        emjD1f371: 'Bento box',
                        emjD1f372: 'Pot of food',
                        emjD1f373: 'Cooking',
                        emjD1f374: 'Fork and knife',
                        emjD1f375: 'Teacup without handle',
                        emjD1f376: 'Sake bottle and cup',
                        emjD1f377: 'Wine glass',
                        emjD1f378: 'Cocktail glass',
                        emjD1f379: 'Tropical drink',
                        emjD1f37a: 'Beer mug',
                        emjD1f37b: 'Clinking beer mugs',
                        emjD1f451: 'Crown',
                        emjD1f452: "Woman's hat",
                        emjD1f453: 'Eyeglasses',
                        emjD1f454: 'Necktie',
                        emjD1f455: 'T-shirt',
                        emjD1f456: 'Jeans',
                        emjD1f457: 'Dress',
                        emjD1f458: 'Kimono',
                        emjD1f459: 'Bikini',
                        emjD1f45a: "Woman's clothes",
                        emjD1f45b: 'Purse',
                        emjD1f45c: 'Handbag',
                        emjD1f45d: 'Pouch',
                        emjD1f45e: "Man's shoe",
                        emjD1f45f: 'Athletic shoe',
                        emjD1f460: 'High-heeled shoe',
                        emjD1f461: "Woman's sandal",
                        emjD1f462: "Woman's boots",
                        emjD1f463: 'Footprints',
                        emjD1f4ba: 'Seat',
                        emjD1f4bb: 'Personal computer',
                        emjD1f4bc: 'Briefcase',
                        emjD1f4bd: 'Minidisc',
                        emjD1f4be: 'Floppy disk',
                        emjD1f4bf: 'Optical disc',
                        emjD1f4c0: 'DVD',
                        emjD1f4c1: 'File folder',
                        emjD1f4c2: 'Open file folder',
                        emjD1f4c3: 'Page with curl',
                        emjD1f4c4: 'Page facing up',
                        emjD1f4c5: 'Calendar',
                        emjD1f4c6: 'Tear-off calendar',
                        emjD1f4c7: 'Card index',
                        emjD1f4c8: 'Chart with upward trend',
                        emjD1f4c9: 'Chart with downward trend',
                        emjD1f4ca: 'Bar chart',
                        emjD1f4cb: 'Clipboard',
                        emjD1f4cc: 'Pushpin',
                        emjD1f4cd: 'Round pushpin',
                        emjD1f4ce: 'Paper clip',
                        emjD1f4cf: 'Straight ruler',
                        emjD1f4d0: 'Triangular ruler',
                        emjD1f4d1: 'Bookmark tabs',
                        emjD1f4d2: 'Ledger',
                        emjD1f4d3: 'Notebook',
                        emjD1f4d4: 'Notebook with decorative cover',
                        emjD1f4d5: 'Closed book',
                        emjD1f4d6: 'Open book',
                        emjD1f4d7: 'Green book',
                        emjD1f4d8: 'Blue book',
                        emjD1f4d9: 'Orange book',
                        emjD1f4da: 'Books',
                        emjD1f4db: 'Name badge',
                        emjD1f4dc: 'Scroll',
                        emjD1f4dd: 'Memo',
                        emjD1f4de: 'Telephone receiver',
                        emjD1f4df: 'Pager',
                        emjD1f4e0: 'Fax machine',
                        emjD1f4e1: 'Satellite antenna',
                        emjD1f4e2: 'Public address loudspeaker',
                        emjD1f4e3: 'Cheering megaphone',
                        emjD1f4e4: 'Outbox tray',
                        emjD1f4e5: 'Inbox tray',
                        emjD1f4e6: 'Package',
                        emjD1f4e7: 'Email',
                        emjD1f4e8: 'Incoming envelope',
                        emjD1f4e9: 'Envelope with downward-facing arrow above',
                        emjD1f4ea: 'Closed mailbox with lowered flag',
                        emjD1f4eb: 'Closed mailbox with raised flag',
                        emjD1f4ee: 'Postbox',
                        emjD1f4f0: 'Newspaper',
                        emjD1f4f1: 'Mobile phone',
                        emjD1f4f2: 'Mobile phone with right-facing arrow at left',
                        emjD1f4f3: 'Vibration mode',
                        emjD1f4f4: 'Mobile phone off',
                        emjD1f4f6: 'Antenna with bars',
                        emjD1f525: 'Fire',
                        emjD1f526: 'Flashlight',
                        emjD1f527: 'Wrench',
                        emjD1f528: 'Hammer',
                        emjD1f529: 'Nut and bolt',
                        emjD1f52a: 'Hocho',
                        emjD1f52b: 'Pistol',
                        emjD1f52e: 'Crystal ball',
                        emjD1f52f: 'Six-pointed star with middle dot',
                        emjD1f531: 'Trident emblem',
                        emjD1f550: "Clock face one o'clock",
                        emjD1f551: "Clock face two o'clock",
                        emjD1f552: "Clock face three o'clock",
                        emjD1f553: "Clock face four o'clock",
                        emjD1f554: "Clock face five o'clock",
                        emjD1f555: "Clock face six o'clock",
                        emjD1f556: "Clock face seven o'clock",
                        emjD1f557: "Clock face eight o'clock",
                        emjD1f558: "Clock face nine o'clock",
                        emjD1f559: "Clock face ten o'clock",
                        emjD1f55a: "Clock face eleven o'clock",
                        emjD1f55b: "Clock face twelve o'clock",
                        emjD02668: 'Hot springs',
                        emjD0267f: 'Wheelchair',
                        emjD02693: 'Anchor',
                        emjD026a0: 'Warning',
                        emjD026a1: 'High Voltage',
                        emjD026d4: 'No Entry',
                        emjD026ea: 'Church',
                        emjD026f2: 'Fountain',
                        emjD026f3: 'Flag in hole',
                        emjD026f5: 'Sailboat',
                        emjD026fa: 'Tent',
                        emjD026fd: 'Fuel pump',
                        emjD02708: 'Airplane',
                        emjD1f17f: 'Squared Latin capital letter P',
                        emjD1f3e0: 'House building',
                        emjD1f3e1: 'House with garden',
                        emjD1f3e2: 'Office building',
                        emjD1f3e3: 'Japanese post office',
                        emjD1f3e5: 'Hospital',
                        emjD1f3e6: 'Bank',
                        emjD1f3e7: 'Automated teller machine',
                        emjD1f3e8: 'Hotel',
                        emjD1f3e9: 'Love hotel',
                        emjD1f3ea: 'Convenience store',
                        emjD1f3eb: 'School',
                        emjD1f3ec: 'Department store',
                        emjD1f3ed: 'Factory',
                        emjD1f3ee: 'Izakaya lantern',
                        emjD1f3ef: 'Japanese castle',
                        emjD1f3f0: 'European castle',
                        emjD1f530: 'Japanese symbol for beginner',
                        emjD1f680: 'Rocket',
                        emjD1f683: 'Railway car',
                        emjD1f684: 'High-speed train',
                        emjD1f685: 'High-speed train with bullet nose',
                        emjD1f687: 'Metro',
                        emjD1f689: 'Station',
                        emjD1f68c: 'Bus',
                        emjD1f68f: 'Bus stop',
                        emjD1f691: 'Ambulance',
                        emjD1f692: 'Fire engine',
                        emjD1f693: 'Police car',
                        emjD1f695: 'Taxi',
                        emjD1f697: 'Automobile',
                        emjD1f699: 'Recreational vehicle',
                        emjD1f69a: 'Delivery truck',
                        emjD1f6a2: 'Ship',
                        emjD1f6a4: 'Speedboat',
                        emjD1f6a5: 'Horizontal traffic light',
                        emjD1f6a7: 'Construction',
                        emjD1f6a8: "Police car's revolving light",
                        emjD1f6a9: 'Triangular flag on post',
                        emjD1f6aa: 'Door',
                        emjD1f6ab: 'No entry',
                        emjD1f6ac: 'Smoking symbol',
                        emjD1f6ad: 'No smoking symbol',
                        emjD1f6b2: 'Bicycle',
                        emjD1f6b6: 'Pedestrian',
                        emjD1f6b9: "Men's symbol",
                        emjD1f6ba: "Women's symbol",
                        emjD1f6bb: 'Restroom',
                        emjD1f6bc: 'Baby symbol',
                        emjD1f6bd: 'Toilet',
                        emjD1f6be: 'Water closet',
                        emjD1f6c0: 'Bath',
                        emjD02049: 'Exclamation question mark',
                        emjD02139: 'Information source',
                        emjD021a9: 'Left-facing arrow with hook',
                        emjD021aa: 'Right-facing arrow with hook',
                        emjD0231a: 'Watch',
                        emjD0231b: 'Hourglass',
                        emjD023e9: 'Right-pointing double triangle',
                        emjD023ea: 'Left-pointing double triangle',
                        emjD023eb: 'Up-pointing double triangle',
                        emjD023ec: 'Down-pointing double triangle',
                        emjD023f0: 'Alarm clock',
                        emjD023f3: 'Hourglass with flowing sand',
                        emjD024c2: 'Circled Latin capital letter M',
                        emjD025b6: 'Black right-pointing triangle',
                        emjD025c0: 'Black left-pointing triangle',
                        emjD025fb: 'White medium square',
                        emjD025fc: 'Black medium square',
                        emjD026ce: 'Ophiuchus',
                        emjD02611: 'Ballot box with check',
                        emjD0261d: 'White up-pointing index',
                        emjD02648: 'Aries',
                        emjD02649: 'Taurus',
                        emjD0264a: 'Gemini',
                        emjD0264b: 'Cancer',
                        emjD0264c: 'Leo',
                        emjD0264d: 'Virgo',
                        emjD0264e: 'Libra',
                        emjD0264f: 'Scorpio',
                        emjD02650: 'Sagittarius',
                        emjD02651: 'Capricorn',
                        emjD02652: 'Aquarius',
                        emjD02653: 'Pisces',
                        emjD026aa: 'Medium white circle',
                        emjD026ab: 'Medium black circle',
                        emjD02705: 'White heavy check mark',
                        emjD02714: 'Heavy check mark',
                        emjD02716: 'Heavy multiplication x',
                        emjD0274c: 'Cross mark',
                        emjD0274e: 'Squared cross mark',
                        emjD02753: 'question mark ornament',
                        emjD02754: 'White question mark ornament',
                        emjD02755: 'White exclamation mark ornament',
                        emjD02757: 'Heavy exclamation mark',
                        emjD02795: 'Heavy plus sign',
                        emjD02796: 'Heavy minus sign',
                        emjD02797: 'Heavy division sign',
                        emjD027a1: 'Black right-facing arrow',
                        emjD027b0: 'Curly loop',
                        emjD027bf: 'Double curly loop',
                        emjD02934: 'Arrow pointing right then curving upward',
                        emjD02935: 'Arrow pointing right then curving downward',
                        emjD02b05: 'Black arrow pointing left',
                        emjD02b06: 'Black arrow pointing right',
                        emjD02b07: 'Downwards black arrow',
                        emjD02b1b: 'Black large square',
                        emjD02b1c: 'White large square',
                        emjD02b55: 'Heavy large circle',
                        emjD03030: 'Wavy dash',
                        emjD0303d: 'Part alternation mark',
                        emjD03297: 'Circled Ideograph congratulation',
                        emjD03299: 'Circled Ideograph secret',
                        emjD1f0cf: 'Playing card Joker',
                        emjD1f170: 'Squared Latin capital letter A',
                        emjD1f171: 'Squared Latin capital letter B',
                        emjD1f17e: 'Squared Latin capital letter O',
                        emjD1f18e: 'Squared AB',
                        emjD1f191: 'Squared CL',
                        emjD1f192: 'Squared COOL',
                        emjD1f193: 'Squared FREE',
                        emjD1f194: 'Squared ID',
                        emjD1f195: 'Squared NEW',
                        emjD1f196: 'Squared NG',
                        emjD1f197: 'Squared OK',
                        emjD1f198: 'Squared SOS',
                        emjD1f199: 'Squared UP!',
                        emjD1f19a: 'Squared VS',
                        emjD1f201: 'Squared Katakana Koko',
                        emjD1f202: 'Squared Katakana Sa',
                        emjD1f21a: 'Squared CJK Unified Ideograph-7121',
                        emjD1f22f: 'Squared CJK Unified Ideograph-6307',
                        emjD1f232: 'Squared CJK Unified Ideograph-7981',
                        emjD1f233: 'Squared CJK Unified Ideograph-7a7a',
                        emjD1f234: 'Squared CJK Unified Ideograph-5408',
                        emjD1f235: 'Squared CJK Unified Ideograph-6e80',
                        emjD1f236: 'Squared CJK Unified Ideograph-6709',
                        emjD1f237: 'Squared CJK Unified Ideograph-6708',
                        emjD1f238: 'Squared CJK Unified Ideograph-7533',
                        emjD1f239: 'Squared CJK Unified Ideograph-5272',
                        emjD1f23a: 'Squared CJK Unified Ideograph-55b6',
                        emjD1f250: 'Circled Ideograph advantage',
                        emjD1f251: 'Circled Ideograph accept',
                        emjD1f30f: 'Earth globe Asia-Australia',
                        emjD1f4a0: 'Diamond shape with a dot inside',
                        emjD1f4a1: 'Electric light bulb',
                        emjD1f4a2: 'Anger',
                        emjD1f4a3: 'Bomb',
                        emjD1f4a4: 'Sleeping',
                        emjD1f4a5: 'Collision',
                        emjD1f4a6: 'Splashing sweat',
                        emjD1f4a7: 'Droplet',
                        emjD1f4a8: 'Dash',
                        emjD1f4a9: 'Pile of poo',
                        emjD1f4aa: 'Flexed biceps',
                        emjD1f4ab: 'Dizzy',
                        emjD1f4ac: 'Speech balloon',
                        emjD1f4ae: 'White flower',
                        emjD1f4af: 'Hundred points',
                        emjD1f4b0: 'Money bag',
                        emjD1f4b1: 'Currency exchange',
                        emjD1f4b2: 'Heavy dollar sign',
                        emjD1f4b3: 'Credit card',
                        emjD1f4b4: 'Banknote with yen sign',
                        emjD1f4b5: 'Banknote with dollar sign',
                        emjD1f4b8: 'Money with wings',
                        emjD1f4b9: 'Chart with upwards trend and yen sign',
                        emjD1f503: 'Clockwise downward and upward open circle arrows',
                        emjD1f50a: 'Speaker with three sound waves',
                        emjD1f50b: 'Battery',
                        emjD1f50c: 'Electric plug',
                        emjD1f50d: 'Left-leaning magnifying glass',
                        emjD1f50e: 'Right-leaning magnifying glass',
                        emjD1f50f: 'Lock with ink pen',
                        emjD1f510: 'Closed lock with key',
                        emjD1f511: 'Key',
                        emjD1f512: 'Lock',
                        emjD1f513: 'Open lock',
                        emjD1f514: 'Bell',
                        emjD1f516: 'Bookmark',
                        emjD1f517: 'Link',
                        emjD1f518: 'Radio button',
                        emjD1f519: 'Back with left-facing arrow above',
                        emjD1f51a: 'End with left-facing arrow above',
                        emjD1f51b: 'On with exclamation mark with left right arrow above',
                        emjD1f51c: 'Soon with right-facing arrow above',
                        emjD1f51d: 'Top with upward arrow above',
                        emjD1f51e: 'No one under eighteen',
                        emjD1f51f: 'Keycap ten',
                        emjD1f520: 'Input Latin uppercase',
                        emjD1f521: 'Input Latin lowercase',
                        emjD1f522: 'Input numbers',
                        emjD1f523: 'Input symbols',
                        emjD1f524: 'Input Latin letters',
                        emjD1f532: 'Black square button',
                        emjD1f533: 'White square button',
                        emjD1f534: 'Large red circle',
                        emjD1f535: 'Large blue circle',
                        emjD1f536: 'Large orange diamond',
                        emjD1f537: 'Large blue diamond',
                        emjD1f538: 'Small orange diamond',
                        emjD1f539: 'Small blue diamond',
                        emjD1f53a: 'Up-pointing red triangle',
                        emjD1f53b: 'Down-pointing red triangle',
                        emjD1f53c: 'Up-pointing small red triangle',
                        emjD1f53d: 'Down-pointing small red triangle',
                        emjD1f5fb: 'Mount Fuji',
                        emjD1f5fc: 'Tokyo Tower',
                        emjD1f5fd: 'Statue of Liberty',
                        emjD1f5fe: 'Silhouette of Japan',
                        emjD1f5ff: 'Moyai',
                    }),
                    (t.EmojiKeywordStrings = {
                        emjK1f607: 'saint angel innocent',
                        emjK1f47c: 'cherub angel',
                        emjK1f34e: 'apple',
                        emjK1f34f: 'apple',
                        emjK1f477: 'construction',
                        emjK1f6a7: 'construction detour',
                        emjK1f491: 'couple engaged married marry marriage',
                        emjK1f46b: 'couple engaged',
                        emjK1f622: 'crying sad',
                        emjK1f62d: 'crying sad',
                        emjK1f525: 'fire',
                        emjK1f692: 'fire truck fire engine',
                        emjK1f386: 'fireworks sparkler july 4th',
                        emjK1f387: 'fireworks sparkler july 4th',
                        emjK1f44a: 'punch fist pump chuck norris bam',
                        emjK0270a: 'fist pump punch',
                        emjK1f498: 'heart love cupid',
                        emjK1f496: 'heart love',
                        emjK1f497: 'love heart',
                        emjK1f493: 'heart love heartbeat',
                        emjK1f368: 'ice cream dessert treat sundae sweets',
                        emjK1f366: 'ice cream dessert treat sweets',
                        emjK1f48b: 'kiss xoxo love kisses kissing mwah',
                        emjK1f444: 'kiss mouth',
                        emjK1f618: 'kiss love kisses kissing',
                        emjK1f61a: 'kiss love kisses kissing smooch',
                        emjK1f48f: 'kiss love',
                        emjK1f435: 'monkey',
                        emjK1f64a: 'monkey speak no evil',
                        emjK1f649: 'monkey hear no evil',
                        emjK1f648: 'monkey see no evil',
                        emjK1f3b6: 'music melody song singing tune jingle',
                        emjK1f3b5: 'music musical note melody musical',
                        emjK1f44c: 'ok okay perfect',
                        emjK1f646: 'ok awesome',
                        emjK1f621: 'pouting sad pout',
                        emjK1f64e: 'pouting sad depressed',
                        emjK1f60c: 'relieved phew whew relief',
                        emjK1f630: 'relieved phew whew',
                        emjK1f605: 'relieved phew whew sheesh',
                        emjK1f380: 'ribbon',
                        emjK1f381: 'gift present presents ribbon',
                        emjK1f613: 'scared yikes scary uh oh',
                        emjK1f631: 'scared yikes fear whoa',
                        emjK1f629: 'scared anxious uncertain unsure',
                        emjK1f628: 'scared fearful',
                        emjK1f45e: 'shoe shoes',
                        emjK1f45f: 'shoe shoes',
                        emjK1f60a: 'smile happy smiling yay',
                        emjK1f642: 'smile happy smiling',
                        emjK1f603: 'smiling happy excited woo woohoo woot',
                        emjK1f604: 'smiling happy grin excited',
                        emjK1f6bd: 'toilet bathroom potty restroom washroom',
                        emjK1f6ba: 'toilet bathroom',
                        emjK1f6b9: 'toilet bathroom',
                        emjK1f684: 'train light rail monorail',
                        emjK1f683: 'train caboose',
                        emjK1f446: 'up click',
                        emjK0261d: 'up',
                        emjK1f64b: 'wave hi bye hey aloha',
                        emjK1f44b: 'wave hi bye waving high five',
                        emjK1f601: 'happy grin lol funny grinning hehe',
                        emjK1f602: 'happy lol funny joy lmao rofl',
                        emjK1f606: 'lol haha laughing lmao',
                        emjK1f609: 'haha winking wink winky',
                        emjK1f60f: 'haha winking wink smirking smirk heh',
                        emjK1f645: 'bad',
                        emjK1f44e: 'bad thumbs down wrong boo',
                        emjK1f60d: 'love love you loving love u',
                        emjK1f495: 'love hearts',
                        emjK1f44d: 'ok thumbs up',
                        emjK1f610: 'ok umm',
                        emjK1f620: 'mad angry grrr',
                        emjK1f612: 'mad angry unamused not funny amused bleh blah',
                        emjK1f47b: 'scared halloween ghost boo',
                        emjK1f480: 'scared skull danger die death poison',
                        emjK1f47e: 'scared monster',
                        emjK1f365: 'rice ball fish cake',
                        emjK1f61e: 'disappointed sad',
                        emjK1f64d: 'disappointed sad frown',
                        emjK1f494: 'heartbroken sorrow sad broken heart brokenhearted',
                        emjK1f625: 'relieved phew',
                        emjK1f62b: 'sleepy tired yawn',
                        emjK1f4a4: 'sleepy tired sleep zzz',
                        emjK1f62a: 'sleepy tired',
                        emjK1f632: 'wow astonished',
                        emjK1f633: 'wow flushed',
                        emjK1f3c4: 'wave surf surfer surfers surfs surfing',
                        emjK1f44f: 'yay clapping applause clap',
                        emjK1f64c: 'yay celebrate',
                        emjK1f48d:
                            'ring marry fiance engaged engage engagement ring engagement diamond ring bling',
                        emjK1f483: 'party dancer dance dancing',
                        emjK1f389: 'party fun congratulations celebrate congrats',
                        emjK1f388: 'party fun balloon',
                        emjK1f38a: 'party confetti surprise',
                        emjK1f383: 'happy halloween trick treat halloween pumpkin',
                        emjK1f385: 'merry christmas santa claus father xmas',
                        emjK1f384: 'merry christmas tree happy holidays',
                        emjK1f3eb: 'school college study teacher learn studying',
                        emjK1f392: 'backpack school bag back pack',
                        emjK1f41f: 'fish goldfish',
                        emjK1f3a3: 'fish fishing fishing pole',
                        emjK1f3a5: 'video camera film movie movie camera',
                        emjK1f4f9: 'video camera',
                        emjK1f3a6: 'theatre theater cinema',
                        emjK1f3ad:
                            'performing arts drama shakespeare theatre theater play actor actress',
                        emjK1f3bc: 'treble clef sheet music music musical score',
                        emjK1f3b9: 'music piano',
                        emjK1f3a7: 'music headphones headphone',
                        emjK1f3b7: 'music saxophone sax',
                        emjK1f3ba: 'music trumpet',
                        emjK1f3b8: 'music guitar',
                        emjK1f3bb: 'music violin',
                        emjK1f3ac: 'film action movie',
                        emjK1f48e: 'diamond stone gem',
                        emjK1f3be: 'wimbledon tennis raquet tennis sports racquet',
                        emjK1f3c8: 'football superbowl sports nfl',
                        emjK1f3bf: 'sports winter ski skiing skis',
                        emjK1f3c2: 'sports winter snowboard snowboarder snowboarding snowboards',
                        emjK026c4: 'winter snow snowman',
                        emjK02744: 'winter snow snowflake snowing snowed christmas xmas blizzard',
                        emjK1f3c1: 'race finish nascar',
                        emjK1f3c3: 'race run marathon runner sprinting running late',
                        emjK1f375: 'tea coffee',
                        emjK02615: 'coffee tea',
                        emjK1f377: 'alcohol wine',
                        emjK1f378: 'alcohol cocktail drinks martini happy hour',
                        emjK1f379: 'alcohol tropical drink',
                        emjK1f68c: 'bus transit',
                        emjK1f687: 'bus transit metro',
                        emjK1f43b: 'bear teddy',
                        emjK1f43c: 'bear panda',
                        emjK1f340: "luck lucky st. patrick's day shamrock",
                        emjK1f320: 'luck shooting star wish comet asteroid meteor meteroid',
                        emjK1f303: 'skyline starry stars night',
                        emjK1f307: 'skyline sunset',
                        emjK1f31f: 'star twinkle',
                        emjK02747: 'star sparkle glitter',
                        emjK1f4b0: 'cash loot',
                        emjK1f4b5: 'cash money dollar',
                        emjK1f4b4: 'yen money',
                        emjK1f4b3: 'money credit debt debit credit card',
                        emjK1f60b: 'dinner hungry lunch food yummy yum delicious tasty mmmmm',
                        emjK1f60e: 'cool',
                        emjK1f614: 'alas thinking sigh',
                        emjK1f616: 'confused confounded huh',
                        emjK1f61c: 'goofy wassup nyah kidding',
                        emjK1f61d: 'gross yuck eww blech',
                        emjK1f623: 'persevering',
                        emjK1f624: 'triumph congratulations grats congrats yahoo ftw woot wahoo',
                        emjK1f635: 'dizzy drunk confused',
                        emjK1f636: 'unsure',
                        emjK1f637: 'sick flu',
                        emjK1f440: 'eyes snoop',
                        emjK1f442: 'ear listen',
                        emjK1f443: 'nose smell',
                        emjK1f445: 'tongue lick taste drool',
                        emjK1f447: 'down',
                        emjK1f448: 'left',
                        emjK1f449: 'right',
                        emjK1f64f: 'pray praying prayer',
                        emjK0270b: 'hand',
                        emjK0270c: 'peace victory',
                        emjK1f466: 'boy',
                        emjK1f467: 'girl',
                        emjK1f468: 'man',
                        emjK1f469: 'woman',
                        emjK1f46a: 'family',
                        emjK1f46e: 'police officer cop',
                        emjK1f46f: 'bunny ears costume',
                        emjK1f470: 'bride marriage bridezilla',
                        emjK1f471: 'blond',
                        emjK1f474: 'grandpa old man gramps grandfather',
                        emjK1f475: 'grandma old lady old woman grandmother',
                        emjK1f476: 'baby kid toddler newborn infant',
                        emjK1f382: 'birthday cake happy cake',
                        emjK1f390: 'chime',
                        emjK1f393:
                            'graduation college high school graduated graduating graduate grad',
                        emjK1f0cf: 'cards card joker blackjack poker',
                        emjK1f3a0: 'carousel carnival',
                        emjK1f3a1: 'ferris wheel amusement park',
                        emjK1f3a2: 'roller coaster',
                        emjK1f3a4: 'microphone sing karaoke singing',
                        emjK1f3a8: 'paint artist palette artist',
                        emjK1f3a9: 'top hat black tie',
                        emjK1f3aa: 'circus',
                        emjK1f3ab: 'ticket stub ticket stub admission',
                        emjK1f3ae: 'xbox video game video games controller',
                        emjK1f3af: 'bullseye archery darts arrow',
                        emjK1f3b0: 'slot slots machine casino gamble gambling',
                        emjK1f3b1: 'pool billiards',
                        emjK1f3b2: 'die dice game craps gambling casino gamble',
                        emjK1f3b3: 'bowling bowl',
                        emjK1f4f7: 'camera picture photo',
                        emjK1f4fa: 'tv television',
                        emjK1f4fb: 'radio',
                        emjK1f4fc: 'videotape videocassette cassette vcr',
                        emjK1f478: 'princess',
                        emjK1f47d: 'alien ufo',
                        emjK1f47f: 'imp pixie loki leprechaun',
                        emjK1f484: 'lipstick makeup',
                        emjK1f485: 'nail polish manicure',
                        emjK1f486: 'massage',
                        emjK1f487: 'haircut',
                        emjK1f488: 'barber barbershop',
                        emjK1f489: 'syringe shot needle',
                        emjK1f48a: 'pill pills drug drugs',
                        emjK1f48c: 'love letter',
                        emjK1f490: 'flowers bouquet love',
                        emjK1f492: 'wedding marry church',
                        emjK1f3c0: 'basketball bball hoops',
                        emjK1f3c6: 'win trophy champions champion',
                        emjK1f3ca: 'swim swimmer swimming swims',
                        emjK026bd: 'soccer ball',
                        emjK026be: 'baseball',
                        emjK1f451: 'crown king queen',
                        emjK1f453: 'glasses hipster',
                        emjK1f454: 'tie',
                        emjK1f455: 'tshirt tshirts',
                        emjK1f456: 'jeans pants',
                        emjK1f457: 'dress',
                        emjK1f459: 'bikini bathing suit swimsuit swim',
                        emjK1f45b: 'purse',
                        emjK1f45c: 'handbag purse',
                        emjK1f45d: 'pouch clutch',
                        emjK1f461: 'sandal heels heel shoe shoes sandals pumps',
                        emjK1f462: 'boots boot',
                        emjK1f463: 'footprints barefoot',
                        emjK1f4dd: 'memo note',
                        emjK1f4de: 'telephone call phone',
                        emjK1f4df: 'pager',
                        emjK1f4e0: 'fax machine',
                        emjK1f4e1: 'satellite antenna',
                        emjK1f4e3: 'megaphone cheering',
                        emjK1f4e6: 'present package parcel',
                        emjK1f4e7: 'email mail',
                        emjK1f4ee: 'mail post',
                        emjK1f4f0: 'newspaper news',
                        emjK1f4f1: 'phone cell call',
                        emjK1f4f6: 'wifi signal',
                        emjK1f526: 'flashlight',
                        emjK1f527: 'wrench',
                        emjK1f528: 'hammer hammers',
                        emjK1f529: 'nuts bolts',
                        emjK1f52a: 'knife',
                        emjK1f52e: 'crystal ball clairvoyance clairvoyant psychic mystic',
                        emjK1f531: 'trident',
                        emjK1f354: 'hamburger fast burger hamburgers burgers food hungry',
                        emjK1f355: 'pizza fast food hungry dinner lunch',
                        emjK1f356: 'meat dinner lunch hungry food',
                        emjK1f357:
                            'chicken leg turkey leg meat chicken turkey hungry dinner lunch food drumstick',
                        emjK1f35a: 'rice dinner hungry lunch food',
                        emjK1f35c: 'noodles ramen food dinner lunch',
                        emjK1f35d: 'spaghetti dinner noodles food hungry',
                        emjK1f35e: 'bread food',
                        emjK1f35f: 'fries fast food french fries food',
                        emjK1f360: 'potato potatoes vegetable food',
                        emjK1f363: 'sushi food maki',
                        emjK1f364: 'fried shrimp shrimp seafood food tempura',
                        emjK1f369: 'doughnut doughnuts donut donuts food sweets',
                        emjK1f36a: 'cookie cookies food sweets',
                        emjK1f36b: 'chocolate chocolates candy bar chocolate bar sweets',
                        emjK1f36c: 'candy sweet sweets treat',
                        emjK1f36d: 'lollipop candy treat sucker',
                        emjK1f36e: 'custard',
                        emjK1f36f: 'honey pot',
                        emjK1f370: 'pie food hungry cake dessert cheesecake shortcake sweets',
                        emjK1f371: 'bento box',
                        emjK1f372: 'soup pot of food stew',
                        emjK1f374: 'food dinner fork knife eat hungry meal restaurant',
                        emjK1f376: 'sake alcohol',
                        emjK1f37a: 'beer alcohol',
                        emjK1f37b: 'cheers beers alcohol',
                        emjK1f345: 'food vegetable fruit tomato',
                        emjK1f346: 'eggplant food vegetable',
                        emjK1f347: 'grapes fruit food',
                        emjK1f348: 'melon honeydew food fruit',
                        emjK1f349: 'watermelon melon food fruit',
                        emjK1f34a: 'tangerine fruit food orange mandarin clementine slice slices',
                        emjK1f34c: 'banana fruit food',
                        emjK1f34d: 'pineapple fruit food',
                        emjK1f351: 'peach peaches fruit food',
                        emjK1f352: 'cherry cherries fruit food',
                        emjK1f353: 'strawberries stawberry fruit food berry berries',
                        emjK1f4ba: 'seat',
                        emjK1f4bb: 'pc computer laptop tablet',
                        emjK1f4bc: 'briefcase brief case',
                        emjK1f4be: 'floppy disk diskette',
                        emjK1f4bf: 'cd compact disc',
                        emjK1f4c0: 'dvd',
                        emjK1f4c1: 'file folder',
                        emjK1f4c5: 'calendar',
                        emjK1f4cb: 'clipboard',
                        emjK1f4cc: 'pushpin',
                        emjK1f4cd: 'drawing pin',
                        emjK1f4ce: 'paperclip clippy',
                        emjK1f4cf: 'ruler measure',
                        emjK1f4d2: 'ledger',
                        emjK1f4d3: 'notebook',
                        emjK1f4da: 'book books',
                        emjK1f4db: 'name badge',
                        emjK02702: 'scissors cut',
                        emjK02709: 'envelope mail',
                        emjK0270f: 'pencil',
                        emjK1f3e0: 'house home',
                        emjK1f3e1: 'garden greenhouse',
                        emjK1f3e2: 'office work',
                        emjK1f3e6: 'bank',
                        emjK1f3e7: 'atm',
                        emjK1f3e8: 'hotel motel bed sleep',
                        emjK1f3ea: 'convenience store',
                        emjK1f3ec: 'department store shopping',
                        emjK1f3ed: 'factory',
                        emjK1f3f0: 'castle',
                        emjK02668: 'hot springs',
                        emjK02693: 'anchor',
                        emjK026ea: 'church temple',
                        emjK026f2: 'fountain',
                        emjK026f3: 'golf',
                        emjK026f5: 'sailboat sailing sail',
                        emjK026fd: 'gas fuel gasoline pump',
                        emjK1f6aa: 'door',
                        emjK1f6ac: 'smoke smoking',
                        emjK1f6ad: 'no smoking',
                        emjK1f6b2: 'bike bicycle biking',
                        emjK1f6b6: 'walking pedestrian',
                        emjK1f6c0: 'bath bathing bathtub tub',
                        emjK0267f: 'accessible accessibility wheelchair',
                        emjK026a0: 'warning attention caution hazzard',
                        emjK026a1: 'high voltage zap lightning',
                        emjK1f680: 'rocket spaceship space',
                        emjK1f68f: 'bus stop',
                        emjK1f693: 'cop police',
                        emjK1f695: 'taxi cab',
                        emjK1f697: 'car vehicle automobile',
                        emjK1f6a2: 'ship cruise ferry yacht cruise travel vacation',
                        emjK02708: 'airplane flight airline plane travel vacation',
                        emjK1f42d: 'mouse eek mice squeak',
                        emjK1f42e: 'cow moo',
                        emjK1f42f: 'tiger roar rawr',
                        emjK1f430: 'rabbit bunny easter',
                        emjK1f431: 'cat kitty kitten meow',
                        emjK1f432: 'dragon roar smaug',
                        emjK1f433: 'whale moby dick',
                        emjK1f434: 'horse',
                        emjK1f436: 'dog woof puppy bark doggy',
                        emjK1f437: 'pig oink piggy piglet',
                        emjK1f438: 'frog croak ribbit',
                        emjK1f439: 'hamster guinea pig',
                        emjK1f43a: 'wolf howl',
                        emjK1f341: 'maple leaf',
                        emjK1f344: 'mushroom shroom',
                        emjK1f308: 'rainbow love',
                        emjK02601: 'cloud gloomy cloudy',
                        emjK02614: 'drops raining rain rainy raindrops umbrella',
                        emjK02728: 'sparkles twinkle twinkling glitter shiny sparkly glittery',
                        emjK1f4a9: 'poop turd shit',
                        emjK1f4aa: 'strong work out muscles biceps',
                        emjK02648: 'aries zodiac',
                        emjK02649: 'taurus zodiac',
                        emjK0264a: 'gemini zodiac',
                        emjK0264b: 'cancer zodiac',
                        emjK0264c: 'leo zodiac',
                        emjK0264d: 'virgo zodiac',
                        emjK0264e: 'libra zodiac',
                        emjK0264f: 'scorpio zodiac',
                        emjK02650: 'sagittarius zodiac',
                        emjK02651: 'capricorn zodiac',
                        emjK02652: 'aquarius zodiac',
                        emjK02653: 'pisces zodiac',
                        emjK1f411: 'bah sheep',
                        emjK1f300: 'cyclone typhoon hurricane',
                        emjK1f301: 'foggy',
                        emjK1f302: 'umbrella',
                        emjK1f304: 'sunrise',
                        emjK1f305: 'sunrise',
                        emjK1f306: 'dusk',
                        emjK1f309: 'bridge night',
                        emjK1f30a: 'wave tsunami',
                        emjK1f30c: 'milky way night sky galaxy universe',
                        emjK1f311: 'moon',
                        emjK1f313: 'moon',
                        emjK1f314: 'moon',
                        emjK1f315: 'moon full',
                        emjK1f319: 'moon crescent',
                        emjK1f31b: 'moon',
                        emjK1f330: 'chestnut',
                        emjK1f331: 'seed seedling planting',
                        emjK1f334: 'palm tree vacation',
                        emjK1f335: 'cactus hot desert',
                        emjK1f337: 'tulip flower',
                        emjK1f338: 'cherry blossom sakura flower',
                        emjK1f339: 'rose love romance flower',
                        emjK1f33a: 'hibiscus flower',
                        emjK1f33b: 'sunflower',
                        emjK1f33c: 'blossom daisy flower',
                        emjK1f33d: 'maize corn',
                        emjK1f33e: 'rice',
                        emjK1f33f: 'herb herbs',
                        emjK1f342: 'leaf autumn',
                        emjK1f343: 'leaf windy',
                        emjK1f358: 'onigiri',
                        emjK1f359: 'onigiri',
                        emjK1f35b: 'curry katsu',
                        emjK1f361: 'dango',
                        emjK1f362: 'oden',
                        emjK1f373: 'frying cooking',
                        emjK1f3bd: 'exercise exercising',
                        emjK1f417: 'boar',
                        emjK1f418: 'elephant',
                        emjK1f419: 'octopus',
                        emjK1f41a: 'seashell shell',
                        emjK1f41b: 'bug insect centipede millipede',
                        emjK1f41c: 'ant ants insect bug',
                        emjK1f41d: 'bee bees honeybee honeybees',
                        emjK1f41e: 'ladybug ladybugs',
                        emjK1f420: 'fish',
                        emjK1f421: 'blowfish fish',
                        emjK1f422: 'turtle',
                        emjK1f423: 'chick easter',
                        emjK1f425: 'chick easter',
                        emjK1f40c: 'snail slow',
                        emjK1f40d: 'snake',
                        emjK1f40e: 'horse horsey pony',
                        emjK1f412: 'monkey',
                        emjK1f414: 'chicken bawk rooster',
                        emjK1f429: 'poodle dog',
                        emjK1f42b: 'camel desert',
                        emjK1f426: 'bird',
                        emjK1f427: 'penguin',
                        emjK1f42c: 'dolphin',
                        emjK1f43d: 'pig pig noise smelly',
                        emjK1f43e: 'paw prints paws',
                        emjK1f452: 'hat sunday best',
                        emjK1f458: 'kimono',
                        emjK1f45a: 'clothes',
                        emjK1f481: 'information desk support desk',
                        emjK1f482: 'guardsman',
                        emjK1f499: 'heart',
                        emjK1f49a: 'heart',
                        emjK1f49b: 'heart',
                        emjK1f49c: 'heart',
                        emjK1f49d: 'heart love',
                        emjK1f49e: 'heart',
                        emjK1f49f: 'heart',
                        emjK1f4a5: 'collision bang traffic accident crash',
                        emjK1f4a3: 'bomb',
                        emjK1f4a1: 'light bulb idea',
                        emjK1f4a8: 'dash gotta go gotta run',
                        emjK1f503: 'reload refresh loading',
                        emjK1f50c: 'plug plugged in',
                        emjK1f50b: 'battery charged',
                        emjK1f50d: 'search searching',
                        emjK1f510: 'secure secret',
                        emjK1f50f: 'privacy',
                        emjK1f511: 'key',
                        emjK1f512: 'lock locked',
                        emjK1f513: 'unlock unlocked',
                        emjK1f516: 'bookmark',
                        emjK1f514: 'bell alarm',
                        emjK1f550: '1pm 1am early afternoon',
                        emjK1f551: '2pm 2am afternoon',
                        emjK1f552: '3pm 3am',
                        emjK1f553: '4pm 4am',
                        emjK1f554: '5pm 5am late afternoon',
                        emjK1f555: '6pm 6am',
                        emjK1f556: '7pm 7am dinnertime',
                        emjK1f557: '8pm 8am morning',
                        emjK1f558: '9pm 9am',
                        emjK1f559: '10pm 10am bedtime',
                        emjK1f55a: '11pm 11am nighttime',
                        emjK1f55b: '12pm 12am midnight noon lunchtime',
                        emjK1f5fd: 'statue liberty nyc new york city',
                        emjK1f638: 'cat grin happy',
                        emjK1f639: 'cat rofl lol tears laughter tears joy funny',
                        emjK1f63a: 'cat smile',
                        emjK1f63b: 'cat love',
                        emjK1f63c: 'cat heh',
                        emjK1f63d: 'cat kiss kisses',
                        emjK1f63e: 'cat pout pouting sad',
                        emjK1f63f: 'cat cry cries sad',
                        emjK1f4e8: 'incoming message mail email letter',
                        emjK1f4e9: 'mail email letter sending send',
                        emjK1f4eb: 'mail',
                        emjK1f4ea: 'empty mailbox',
                        emjK1f6bb: 'restroom toilet washroom bathroom',
                        emjK1f6a5: 'traffic traffic light',
                        emjK1f6ab: 'no entry no admittance',
                        emjK1f689: 'station',
                        emjK1f69a: 'delivery truck',
                        emjK026fa: 'tent camp camping',
                        emjK1f6a8: 'police siren emergency',
                        emjK1f17f: 'parking parking spot',
                        emjK02733: 'star asterisk',
                        emjK02734: 'star',
                        emjK02b50: 'star',
                        emjK1f4c8: 'chart graph record profits trending up upwards skyrocketed',
                        emjK1f4c9: 'chart graph record losses trending down downwards',
                        emjK1f4ca: 'chart graph',
                        emjK02764: 'love heart',
                    }),
                    (t.EmojiFamilyStrings = {
                        People: 'People',
                        Nature: 'Nature',
                        Activities: 'Activities',
                        Food: 'Food',
                        Travel: 'Travel',
                        Symbols: 'Symbols',
                        Objects: 'Objects',
                    });
            },
            3801: (e, t, o) => {
                var n, a;
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.forEachEmoji = t.forEachEmojiFamily = t.EmojiFabricIconCharacterMap = t.EmojiList = t.EmojiFamilyKeys = t.CommonEmojis = t.MoreEmoji = void 0);
                var i,
                    r = o(7582),
                    l = o(1905),
                    f = h('1f60a', ':) :-)'),
                    s = h('1f609', ';) ;-)'),
                    m = h('02764', '<3'),
                    c = h('1f61e', ':( :-('),
                    u = h('1f603', ':D :-D');
                function d(e) {
                    var o,
                        n,
                        a = (0, l.getObjectKeys)(t.EmojiList);
                    try {
                        for (var i = (0, r.__values)(a), f = i.next(); !f.done; f = i.next()) {
                            var s = f.value;
                            if (!e(t.EmojiList[s], s)) break;
                        }
                    } catch (e) {
                        o = { error: e };
                    } finally {
                        try {
                            f && !f.done && (n = i.return) && n.call(i);
                        } finally {
                            if (o) throw o.error;
                        }
                    }
                }
                function g(e) {
                    var t,
                        o = parseInt(e, 16);
                    return isNaN(o)
                        ? null
                        : (o >= 126976 && o <= 128768
                              ? (t = [
                                    Math.floor((o - 65536) / 1024) + 55296,
                                    ((o - 65536) % 1024) + 56320,
                                ])
                              : o >= 35 && o <= 16384 && (t = [o]),
                          String.fromCharCode.apply(
                              String,
                              (0, r.__spreadArray)([], (0, r.__read)(t), !1)
                          ));
                }
                function h(e, t) {
                    var o;
                    return {
                        key: e,
                        description: 'emjD' + e,
                        keywords: 'emjK' + e,
                        shortcut: t,
                        codePoint: null !== (o = g(e)) && void 0 !== o ? o : void 0,
                    };
                }
                function j(e) {
                    var t;
                    return {
                        key: e,
                        description: 'emjD' + e,
                        codePoint: null !== (t = g(e)) && void 0 !== t ? t : void 0,
                    };
                }
                (t.MoreEmoji = { key: 'more', description: 'emjDMore', codePoint: '' }),
                    (t.CommonEmojis = [f, s, m, c, u, t.MoreEmoji]),
                    ((i = t.EmojiFamilyKeys || (t.EmojiFamilyKeys = {})).People = 'People'),
                    (i.Nature = 'Nature'),
                    (i.Activities = 'Activities'),
                    (i.Food = 'Food'),
                    (i.Travel = 'Travel'),
                    (i.Symbols = 'Symbols'),
                    (i.Objects = 'Objects'),
                    (t.EmojiList =
                        (((n = {}).People = [
                            h('1f601'),
                            h('1f602'),
                            u,
                            h('1f604'),
                            h('1f605'),
                            h('1f606'),
                            h('1f607'),
                            s,
                            f,
                            h('1f642'),
                            h('1f60b'),
                            h('1f60c'),
                            h('1f60d'),
                            h('1f618'),
                            h('1f61a'),
                            h('1f61c'),
                            h('1f61d', ':p :P :-p :-P'),
                            h('1f60e', 'B) B-)'),
                            h('1f60f'),
                            h('1f636'),
                            h('1f610', ':| :-|'),
                            h('1f612'),
                            h('1f633'),
                            c,
                            h('1f620'),
                            h('1f621'),
                            h('1f614'),
                            h('1f623'),
                            h('1f616'),
                            h('1f62b'),
                            h('1f629'),
                            h('1f624'),
                            h('1f631'),
                            h('1f628'),
                            h('1f630'),
                            h('1f625'),
                            h('1f622'),
                            h('1f62a'),
                            h('1f613'),
                            h('1f62d'),
                            h('1f635'),
                            h('1f632', ':o :O :-o :-O'),
                            h('1f637'),
                            h('1f4a4'),
                            j('1f608'),
                            h('1f47f'),
                            j('1f479'),
                            j('1f47a'),
                            h('1f480'),
                            h('1f47b'),
                            h('1f47d'),
                            h('1f63a'),
                            h('1f638'),
                            h('1f639'),
                            h('1f63b'),
                            h('1f63c'),
                            h('1f63d'),
                            j('1f640'),
                            h('1f63f'),
                            h('1f63e'),
                            h('1f64c'),
                            h('1f44f'),
                            h('1f44b'),
                            h('1f44d'),
                            h('1f44e'),
                            h('1f44a'),
                            h('0270a'),
                            h('0270b'),
                            h('0270c'),
                            h('1f44c'),
                            j('1f450'),
                            j('1f596'),
                            h('1f4aa'),
                            h('1f64f'),
                            h('1f446'),
                            h('1f447'),
                            h('1f448'),
                            h('1f449'),
                            h('1f485'),
                            h('1f444'),
                            h('1f445'),
                            h('1f442'),
                            h('1f443'),
                            h('1f440'),
                            j('1f464'),
                            h('1f476'),
                            h('1f466'),
                            h('1f467'),
                            h('1f468'),
                            h('1f469'),
                            h('1f471'),
                            h('1f474'),
                            h('1f475'),
                            j('1f472'),
                            j('1f473'),
                            h('1f46e'),
                            h('1f477'),
                            h('1f482'),
                            h('1f385'),
                            h('1f47c'),
                            h('1f478'),
                            h('1f470'),
                            h('1f6b6'),
                            h('1f3c3'),
                            h('1f483'),
                            h('1f46f'),
                            h('1f46b'),
                            j('1f647'),
                            h('1f481'),
                            h('1f645'),
                            h('1f646'),
                            h('1f64b'),
                            h('1f64e'),
                            h('1f64d'),
                            h('1f487'),
                            h('1f486'),
                            h('1f491'),
                            h('1f48f'),
                            h('1f46a'),
                            h('1f45a'),
                            h('1f455'),
                            h('1f456'),
                            h('1f454'),
                            h('1f457'),
                            h('1f459'),
                            h('1f458'),
                            h('1f484'),
                            h('1f48b'),
                            h('1f463'),
                            j('1f460'),
                            h('1f461'),
                            h('1f462'),
                            h('1f45e'),
                            h('1f45f'),
                            h('1f452'),
                            h('1f3a9'),
                            h('1f393'),
                            h('1f451'),
                            h('1f392'),
                            h('1f45d'),
                            h('1f45b'),
                            h('1f45c'),
                            h('1f4bc'),
                            h('1f453'),
                            h('1f48d'),
                            h('1f302'),
                        ]),
                        (n.Nature = [
                            h('1f436'),
                            h('1f431'),
                            h('1f42d'),
                            h('1f439'),
                            h('1f430'),
                            h('1f43b'),
                            h('1f43c'),
                            j('1f428'),
                            h('1f42f'),
                            h('1f42e'),
                            h('1f437'),
                            h('1f43d'),
                            h('1f438'),
                            h('1f419'),
                            h('1f435'),
                            h('1f648'),
                            h('1f649'),
                            h('1f64a'),
                            h('1f412'),
                            h('1f427'),
                            h('1f426'),
                            j('1f424'),
                            h('1f423'),
                            h('1f425'),
                            h('1f43a'),
                            h('1f417'),
                            h('1f434'),
                            h('1f41d'),
                            h('1f41b'),
                            h('1f40c'),
                            h('1f41e'),
                            h('1f41c'),
                            h('1f40d'),
                            h('1f422'),
                            h('1f420'),
                            h('1f41f'),
                            h('1f421'),
                            h('1f42c'),
                            h('1f433'),
                            h('1f414'),
                            h('1f42b'),
                            h('1f418'),
                            h('1f411'),
                            h('1f40e'),
                            h('1f429'),
                            h('1f43e'),
                            h('1f432'),
                            h('1f335'),
                            h('1f384'),
                            h('1f334'),
                            h('1f331'),
                            h('1f33f'),
                            h('1f340'),
                            j('1f38d'),
                            j('1f38b'),
                            h('1f343'),
                            h('1f342'),
                            h('1f341'),
                            h('1f33e'),
                            h('1f33a'),
                            h('1f33b'),
                            h('1f339'),
                            h('1f33c'),
                            h('1f337'),
                            h('1f338'),
                            h('1f344'),
                            h('1f490'),
                            h('1f330'),
                            h('1f383'),
                            h('1f41a'),
                            j('1f30f'),
                            h('1f315'),
                            h('1f311'),
                            h('1f313'),
                            h('1f314'),
                            h('1f31b'),
                            h('1f319'),
                            h('02b50'),
                            h('1f31f'),
                            j('1f4ab'),
                            h('02728'),
                            j('02600'),
                            j('026c5'),
                            h('02601'),
                            h('026a1'),
                            h('1f525'),
                            h('1f4a5'),
                            h('02744'),
                            h('026c4'),
                            h('1f4a8'),
                            h('02614'),
                            j('1f4a7'),
                            j('1f4a6'),
                            h('1f30a'),
                        ]),
                        (n.Activities = [
                            h('026bd'),
                            h('1f3c0'),
                            h('1f3c8'),
                            h('026be'),
                            h('1f3be'),
                            h('1f3b1'),
                            h('026f3'),
                            h('1f3bf'),
                            h('1f3c2'),
                            h('1f3a3'),
                            h('1f3ca'),
                            h('1f3c4'),
                            h('1f3c6'),
                            h('1f3bd'),
                            h('1f3ab'),
                            h('1f3ad'),
                            h('1f3a8'),
                            h('1f3aa'),
                            h('1f3a4'),
                            h('1f3a7'),
                            h('1f3bc'),
                            h('1f3b9'),
                            h('1f3b7'),
                            h('1f3ba'),
                            h('1f3b8'),
                            h('1f3bb'),
                            h('1f3ac'),
                            h('1f3ae'),
                            h('1f47e'),
                            h('1f3af'),
                            h('1f3b2'),
                            h('1f3b0'),
                            h('1f3b3'),
                        ]),
                        (n.Food = [
                            h('1f34f'),
                            h('1f34e'),
                            h('1f34a'),
                            h('1f34c'),
                            h('1f349'),
                            h('1f347'),
                            h('1f353'),
                            h('1f348'),
                            h('1f352'),
                            h('1f351'),
                            h('1f34d'),
                            h('1f345'),
                            h('1f346'),
                            h('1f33d'),
                            h('1f360'),
                            h('1f35e'),
                            h('1f357'),
                            h('1f356'),
                            h('1f364'),
                            h('1f373'),
                            h('1f354'),
                            h('1f35f'),
                            h('1f355'),
                            h('1f35d'),
                            h('1f35c'),
                            h('1f372'),
                            h('1f365'),
                            h('1f363'),
                            h('1f371'),
                            h('1f35b'),
                            h('1f359'),
                            h('1f35a'),
                            h('1f358'),
                            h('1f362'),
                            h('1f361'),
                            j('1f367'),
                            h('1f368'),
                            h('1f366'),
                            h('1f370'),
                            h('1f36f'),
                            h('1f382'),
                            h('1f36e'),
                            h('1f36c'),
                            h('1f36d'),
                            h('1f36b'),
                            h('1f369'),
                            h('1f36a'),
                            h('1f37a'),
                            h('1f37b'),
                            h('1f377'),
                            h('1f378'),
                            h('1f379'),
                            h('1f376'),
                            h('1f375'),
                            h('02615'),
                            h('1f374'),
                        ]),
                        (n.Travel = [
                            h('1f697'),
                            h('1f695'),
                            h('1f687'),
                            j('1f699'),
                            h('1f68c'),
                            h('1f693'),
                            h('1f69a'),
                            j('1f691'),
                            h('1f692'),
                            h('1f6b2'),
                            h('1f6a8'),
                            h('1f683'),
                            h('1f684'),
                            j('1f685'),
                            h('1f689'),
                            h('02708'),
                            h('026f5'),
                            j('1f6a4'),
                            h('1f680'),
                            h('1f4ba'),
                            h('02693'),
                            h('1f6a7'),
                            h('026fd'),
                            h('1f68f'),
                            h('1f6a5'),
                            h('1f3c1'),
                            h('1f6a2'),
                            h('1f3a1'),
                            h('1f3a2'),
                            h('1f3a0'),
                            h('1f301'),
                            j('1f5fc'),
                            h('1f3ed'),
                            h('026f2'),
                            j('1f391'),
                            j('1f5fb'),
                            j('1f30b'),
                            j('1f5fe'),
                            h('1f305'),
                            h('1f304'),
                            h('1f307'),
                            h('1f306'),
                            h('1f303'),
                            h('1f309'),
                            h('1f30c'),
                            h('1f387'),
                            h('1f386'),
                            h('1f308'),
                            h('1f3f0'),
                            j('1f3ef'),
                            h('1f5fd'),
                            h('1f3e0'),
                            h('1f3e1'),
                            h('1f3e2'),
                            h('1f3ec'),
                            h('026fa'),
                            j('1f3e3'),
                            j('1f3e5'),
                            h('1f3e6'),
                            h('1f3e8'),
                            h('1f3ea'),
                            h('1f3eb'),
                            j('1f3e9'),
                            h('1f492'),
                            h('026ea'),
                            h('1f320'),
                        ]),
                        (n.Symbols = [
                            m,
                            h('1f49b'),
                            h('1f49a'),
                            h('1f499'),
                            h('1f494'),
                            h('1f49c'),
                            h('1f495'),
                            h('1f493'),
                            h('1f49e'),
                            h('1f497'),
                            h('1f498'),
                            h('1f496'),
                            h('1f49d'),
                            h('1f49f'),
                            j('1f52f'),
                            j('026ce'),
                            h('02648'),
                            h('02649'),
                            h('0264a'),
                            h('0264b'),
                            h('0264c'),
                            h('0264d'),
                            h('0264e'),
                            h('0264f'),
                            h('02650'),
                            h('02651'),
                            h('02652'),
                            h('02653'),
                            j('1f194'),
                            j('1f4f4'),
                            j('1f4f3'),
                            j('1f19a'),
                            j('1f4ae'),
                            j('1f18e'),
                            j('1f191'),
                            j('1f198'),
                            j('026d4'),
                            h('1f4db'),
                            h('1f6ab'),
                            j('0274c'),
                            j('02b55'),
                            j('1f4a2'),
                            h('02668'),
                            j('1f51e'),
                            j('02757'),
                            j('02755'),
                            j('02753'),
                            j('02754'),
                            j('02049'),
                            j('1f4af'),
                            h('1f531'),
                            j('0303d'),
                            h('026a0'),
                            j('1f530'),
                            j('1f22f'),
                            j('1f4b9'),
                            h('02733'),
                            j('0274e'),
                            j('02705'),
                            j('1f4a0'),
                            h('1f300'),
                            h('1f3e7'),
                            h('0267f'),
                            h('1f6ad'),
                            j('1f6be'),
                            h('02734'),
                            h('1f17f'),
                            h('1f6b9'),
                            h('1f6ba'),
                            j('1f6bc'),
                            h('1f6bb'),
                            h('1f3a6'),
                            h('1f4f6'),
                            j('1f201'),
                            j('1f196'),
                            j('0267b'),
                            j('1f197'),
                            j('1f192'),
                            h('02747'),
                            j('1f195'),
                            j('1f193'),
                            j('1f51f'),
                            j('1f522'),
                            j('023ea'),
                            j('023e9'),
                            j('1f53c'),
                            j('1f53d'),
                            j('023eb'),
                            j('023ec'),
                            j('1f199'),
                            j('02139'),
                            j('1f524'),
                            j('1f521'),
                            j('1f520'),
                            j('1f523'),
                            h('1f3b5'),
                            h('1f3b6'),
                            j('03030'),
                            j('027bf'),
                            j('02714'),
                            h('1f503'),
                            j('02795'),
                            j('02796'),
                            j('02797'),
                            j('02716'),
                            j('027b0'),
                            j('1f4b2'),
                            j('1f4b1'),
                            j('1f51a'),
                            j('1f519'),
                            j('1f51b'),
                            j('1f51d'),
                            j('1f51c'),
                            j('02611'),
                            j('1f518'),
                            j('026ab'),
                            j('1f534'),
                            j('1f535'),
                            j('1f539'),
                            j('1f538'),
                            j('1f536'),
                            j('1f537'),
                            j('1f53a'),
                            j('1f53b'),
                            j('02b1b'),
                            j('02b1c'),
                            j('1f532'),
                            j('1f533'),
                            j('1f50a'),
                            h('1f4e3'),
                            j('1f4e2'),
                            h('1f514'),
                            j('1f004'),
                            h('1f0cf'),
                            j('1f3b4'),
                            j('1f4ac'),
                            h('1f550'),
                            h('1f551'),
                            h('1f552'),
                            h('1f553'),
                            h('1f554'),
                            h('1f555'),
                            h('1f556'),
                            h('1f557'),
                            h('1f558'),
                            h('1f559'),
                            h('1f55a'),
                            h('1f55b'),
                            j('1f236'),
                            j('1f250'),
                            j('1f239'),
                            j('1f21a'),
                            j('1f232'),
                            j('1f251'),
                            j('1f234'),
                            j('1f233'),
                            j('1f23a'),
                            j('1f235'),
                        ]),
                        (n.Objects = [
                            j('0231a'),
                            h('1f4f1'),
                            j('1f4f2'),
                            h('1f4bb'),
                            j('1f4bd'),
                            h('1f4be'),
                            h('1f4bf'),
                            h('1f4c0'),
                            h('1f4fc'),
                            h('1f4f7'),
                            h('1f4f9'),
                            h('1f3a5'),
                            h('1f4de'),
                            j('0260e'),
                            h('1f4df'),
                            h('1f4e0'),
                            h('1f4fa'),
                            h('1f4fb'),
                            j('023f0'),
                            j('0231b'),
                            j('023f3'),
                            h('1f4e1'),
                            h('1f50b'),
                            h('1f50c'),
                            h('1f4a1'),
                            h('1f526'),
                            j('1f4b8'),
                            h('1f4b5'),
                            h('1f4b4'),
                            h('1f4b0'),
                            h('1f4b3'),
                            h('1f48e'),
                            h('1f527'),
                            h('1f528'),
                            h('1f529'),
                            j('1f52b'),
                            h('1f4a3'),
                            h('1f52a'),
                            h('1f6ac'),
                            h('1f52e'),
                            h('1f488'),
                            h('1f48a'),
                            h('1f489'),
                            h('1f516'),
                            h('1f6bd'),
                            h('1f6c0'),
                            h('1f511'),
                            h('1f6aa'),
                            j('1f5ff'),
                            h('1f388'),
                            j('1f38f'),
                            h('1f380'),
                            h('1f381'),
                            h('1f38a'),
                            h('1f389'),
                            j('1f38e'),
                            h('1f390'),
                            j('1f38c'),
                            j('1f3ee'),
                            h('02709'),
                            h('1f4e9'),
                            h('1f4e8'),
                            h('1f48c'),
                            h('1f4e7'),
                            h('1f4ee'),
                            h('1f4ea'),
                            h('1f4eb'),
                            h('1f4e6'),
                            j('1f4e5'),
                            j('1f4e4'),
                            j('1f4dc'),
                            j('1f4c3'),
                            j('1f4d1'),
                            h('1f4ca'),
                            h('1f4c8'),
                            h('1f4c9'),
                            j('1f4c4'),
                            h('1f4c5'),
                            j('1f4c6'),
                            j('1f4c7'),
                            h('1f4cb'),
                            h('1f4c1'),
                            j('1f4c2'),
                            h('1f4f0'),
                            h('1f4d3'),
                            j('1f4d5'),
                            j('1f4d7'),
                            j('1f4d8'),
                            j('1f4d9'),
                            j('1f4d4'),
                            h('1f4d2'),
                            h('1f4da'),
                            j('1f4d6'),
                            j('1f517'),
                            h('1f4ce'),
                            h('02702'),
                            j('1f4d0'),
                            h('1f4cf'),
                            h('1f4cc'),
                            h('1f4cd'),
                            j('1f6a9'),
                            h('1f510'),
                            h('1f512'),
                            h('1f513'),
                            h('1f50f'),
                            j('02712'),
                            h('1f4dd'),
                            h('0270f'),
                            h('1f50d'),
                            j('1f50e'),
                        ]),
                        n)),
                    (t.EmojiFabricIconCharacterMap =
                        (((a = {}).Activities = 'Soccer'),
                        (a.Food = 'EatDrink'),
                        (a.Nature = 'FangBody'),
                        (a.Objects = 'Lightbulb'),
                        (a.People = 'Emoji2'),
                        (a.Symbols = 'Heart'),
                        (a.Travel = 'Car'),
                        a)),
                    (t.forEachEmojiFamily = d),
                    (t.forEachEmoji = function (e) {
                        d(function (t) {
                            var o, n;
                            try {
                                for (
                                    var a = (0, r.__values)(t), i = a.next();
                                    !i.done;
                                    i = a.next()
                                ) {
                                    var l = i.value;
                                    if (!e(l)) return !1;
                                }
                            } catch (e) {
                                o = { error: e };
                            } finally {
                                try {
                                    i && !i.done && (n = a.return) && n.call(a);
                                } finally {
                                    if (o) throw o.error;
                                }
                            }
                            return !0;
                        });
                    });
            },
            4607: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.searchEmojis = void 0);
                var n = o(3801);
                t.searchEmojis = function (e, t) {
                    var o = (function (e) {
                        var t = null;
                        return (
                            (e = ' ' + e + ' '),
                            (0, n.forEachEmoji)(function (o) {
                                return !(
                                    o.shortcut &&
                                    (' ' + o.shortcut + ' ').indexOf(e) >= 0 &&
                                    ((t = o), 1)
                                );
                            }),
                            t
                        );
                    })(e);
                    e = e.toLowerCase();
                    var a = o ? [o] : [],
                        i = [],
                        r = ' ' + (':' == e[0] ? e.substr(1) : e);
                    return (
                        (0, n.forEachEmoji)(function (e) {
                            var o = (e.keywords && t[e.keywords]) || '',
                                n = e.keywords ? ' ' + o.toLowerCase() + ' ' : '',
                                l = n.indexOf(r);
                            return l >= 0 && (' ' == n[l + r.length] ? a : i).push(e), !0;
                        }),
                        a.concat(i)
                    );
                };
            },
            9245: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582);
                (0, n.__exportStar)(o(6933), t),
                    (0, n.__exportStar)(o(5265), t),
                    (0, n.__exportStar)(o(8586), t),
                    (0, n.__exportStar)(o(2157), t),
                    (0, n.__exportStar)(o(8280), t),
                    (0, n.__exportStar)(o(2501), t),
                    (0, n.__exportStar)(o(9916), t),
                    (0, n.__exportStar)(o(1891), t);
            },
            5070: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(3537),
                    r = o(3538),
                    l = o(3538),
                    f = o(6933),
                    s = o(1905);
                t.default = function (e) {
                    var t = e.items,
                        o = e.strings,
                        m = e.dialogTitleKey,
                        c = e.unlocalizedTitle,
                        u = e.onOk,
                        d = e.onCancel,
                        g = e.onChange,
                        h = a.useMemo(
                            function () {
                                return {
                                    type: l.DialogType.normal,
                                    title: (0, f.getLocalizedString)(o, m, c),
                                };
                            },
                            [o, m, c]
                        ),
                        j = (0, n.__read)(
                            a.useState(
                                (0, s.getObjectKeys)(t).reduce(function (e, o) {
                                    return (e[o] = t[o].initValue), e;
                                }, {})
                            ),
                            2
                        ),
                        p = j[0],
                        b = j[1],
                        y = a.useCallback(
                            function () {
                                null == u || u(p);
                            },
                            [u, p]
                        ),
                        D = a.useCallback(
                            function (e, o) {
                                var a;
                                if (e in t) {
                                    var i =
                                        (null == g ? void 0 : g(e, o, (0, n.__assign)({}, p))) ||
                                        (0, n.__assign)(
                                            (0, n.__assign)({}, p),
                                            (((a = {})[e] = o), a)
                                        );
                                    b(i);
                                }
                            },
                            [b, p, t]
                        );
                    return a.createElement(
                        l.Dialog,
                        { dialogContentProps: h, hidden: !1, onDismiss: d },
                        a.createElement(
                            'div',
                            null,
                            (0, s.getObjectKeys)(t).map(function (e) {
                                return a.createElement(i.default, {
                                    key: e,
                                    itemName: e,
                                    items: t,
                                    strings: o,
                                    currentValues: p,
                                    onEnterKey: y,
                                    onChanged: D,
                                });
                            })
                        ),
                        a.createElement(
                            l.DialogFooter,
                            null,
                            a.createElement(r.PrimaryButton, {
                                text: (0, f.getLocalizedString)(o, 'buttonNameOK', 'OK'),
                                onClick: y,
                            }),
                            a.createElement(r.DefaultButton, {
                                text: (0, f.getLocalizedString)(o, 'buttonNameCancel', 'Cancel'),
                                onClick: d,
                            })
                        )
                    );
                };
            },
            3537: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7363),
                    a = o(6933),
                    i = o(3538),
                    r = o(3538),
                    l = (0, i.mergeStyleSets)({
                        inputBox: {
                            width: '100%',
                            minWidth: '250px',
                            height: '32px',
                            margin: '5px 0 16px',
                            borderRadius: '2px',
                        },
                    });
                t.default = function (e) {
                    var t = e.itemName,
                        o = e.strings,
                        i = e.items,
                        f = e.currentValues,
                        s = e.onChanged,
                        m = e.onEnterKey,
                        c = i[t],
                        u = c.labelKey,
                        d = c.unlocalizedLabel,
                        g = c.autoFocus,
                        h = f[t],
                        j = n.useCallback(
                            function (e, o) {
                                s(t, o);
                            },
                            [t, s]
                        ),
                        p = n.useCallback(
                            function (e) {
                                13 == e.which && m();
                            },
                            [m]
                        );
                    return n.createElement(
                        'div',
                        null,
                        u ? n.createElement('div', null, (0, a.getLocalizedString)(o, u, d)) : null,
                        n.createElement(
                            'div',
                            null,
                            n.createElement(r.TextField, {
                                role: 'textbox',
                                type: 'text',
                                className: l.inputBox,
                                value: h,
                                onChange: j,
                                onKeyPress: p,
                                autoFocus: g,
                            })
                        )
                    );
                };
            },
            1891: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.showInputDialog = void 0);
                var n = o(1863);
                Object.defineProperty(t, 'showInputDialog', {
                    enumerable: !0,
                    get: function () {
                        return n.default;
                    },
                });
            },
            1863: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7363),
                    a = o(5070),
                    i = o(1672);
                t.default = function (e, t, o, r, l, f) {
                    return new Promise(function (s) {
                        var m = null,
                            c = n.createElement(a.default, {
                                dialogTitleKey: t,
                                unlocalizedTitle: o,
                                items: r,
                                strings: l,
                                onOk: function (e) {
                                    null == m || m(), s(e);
                                },
                                onCancel: function () {
                                    null == m || m(), s(null);
                                },
                                onChange: f,
                            });
                        m = (0, i.renderReactComponent)(e, c);
                    });
                };
            },
            5637: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(6436),
                    r = o(3538),
                    l = o(6933),
                    f = o(1905),
                    s = o(3538),
                    m = o(3538),
                    c = o(3538),
                    u = o(3538),
                    d = o(1672),
                    g = o(3538),
                    h = (0, c.memoizeFunction)(function (e) {
                        var t = e.palette;
                        return (0,
                        u.mergeStyleSets)({ pastePane: { paddingLeft: '4px', minWidth: '72px' }, optionPane: { textAlign: 'center', padding: '4px' }, icon: { fontSize: '14px' }, buttonsContainer: { justifyContent: 'center', display: 'flex' }, button: { width: '32px', height: '32px', margin: '0 4px 4px 0', borderRadius: '2px', flex: '0 0 auto', '&:hover': { backgroundColor: t.themeLighter } }, isChecked: { backgroundColor: t.themeLight, '&:hover': { backgroundColor: t.themeLighter } } });
                    });
                function j(e) {
                    var t = e.buttonName,
                        o = e.paste,
                        n = e.strings,
                        r = e.className,
                        f = i.Buttons[t],
                        s = a.useCallback(
                            function () {
                                o(t);
                            },
                            [o, t]
                        );
                    return a.createElement(m.IconButton, {
                        className: r,
                        onClick: s,
                        title:
                            (0, l.getLocalizedString)(n, t, f.unlocalizedText) +
                            (f.shortcut ? ' (' + f.shortcut + ')' : ''),
                        iconProps: { iconName: f.icon },
                    });
                }
                var p = a.forwardRef(function (e, t) {
                    var o = e.strings,
                        m = e.position,
                        c = e.paste,
                        u = e.dismiss,
                        d = e.isRtl,
                        p = (0, g.useTheme)(),
                        b = h(p),
                        y = (0, n.__read)(a.useState(null), 2),
                        D = y[0],
                        v = y[1],
                        k = m && (0, f.getPositionRect)(m),
                        K = k && { x: e.isRtl ? k.left : k.right, y: k.bottom };
                    a.useImperativeHandle(
                        t,
                        function () {
                            return {
                                dismiss: u,
                                setSelectedKey: v,
                                getSelectedKey: function () {
                                    return D;
                                },
                            };
                        },
                        [u, c, d, D, v]
                    );
                    var C = a.useRef(null),
                        w = a.useCallback(
                            function (e) {
                                var t =
                                    e instanceof FocusEvent && e.relatedTarget instanceof Node
                                        ? e.relatedTarget
                                        : null;
                                (t && C.current && (C.current == t || C.current.contains(t))) ||
                                    u();
                            },
                            [u]
                        ),
                        S = a.useCallback(
                            function (e) {
                                v(i.ButtonKeys[0]), e.preventDefault(), e.stopPropagation();
                            },
                            [v]
                        );
                    return a.createElement(
                        r.Callout,
                        {
                            gapSpace: 10,
                            isBeakVisible: !1,
                            target: K,
                            directionalHint: d
                                ? r.DirectionalHint.bottomRightEdge
                                : r.DirectionalHint.bottomLeftEdge,
                            directionalHintForRTL: r.DirectionalHint.bottomRightEdge,
                            preventDismissOnScroll: !0,
                            onDismiss: w,
                        },
                        a.createElement(
                            'div',
                            { ref: C, className: b.pastePane },
                            a.createElement(
                                'div',
                                { onClick: S, className: b.optionPane },
                                a.createElement(s.Icon, { iconName: 'Paste', className: b.icon }),
                                (0, l.getLocalizedString)(o, 'pasteOptionPaneText', '(Ctrl)')
                            ),
                            D &&
                                a.createElement(
                                    'div',
                                    { className: b.buttonsContainer },
                                    (0, f.getObjectKeys)(i.Buttons).map(function (e) {
                                        return a.createElement(j, {
                                            key: e,
                                            strings: o,
                                            paste: c,
                                            buttonName: e,
                                            className: b.button + ' ' + (D == e ? b.isChecked : ''),
                                        });
                                    })
                                )
                        )
                    );
                });
                t.default = function (e, t, o, n, i) {
                    var r = null;
                    r = (0, d.renderReactComponent)(
                        e,
                        a.createElement(p, {
                            ref: n,
                            position: t,
                            strings: i,
                            isRtl: e.isRightToLeft(),
                            dismiss: function () {
                                null == r || r(), (r = null);
                            },
                            paste: o,
                        })
                    );
                };
            },
            8280: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.createPasteOptionPlugin = void 0);
                var n = o(6224);
                Object.defineProperty(t, 'createPasteOptionPlugin', {
                    enumerable: !0,
                    get: function () {
                        return n.default;
                    },
                });
            },
            6224: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7363),
                    a = o(5637),
                    i = o(6436),
                    r = (function () {
                        function e(e) {
                            var t = this;
                            (this.strings = e),
                                (this.clipboardData = null),
                                (this.editor = null),
                                (this.uiUtilities = null),
                                (this.pasteOptionRef = n.createRef()),
                                (this.onPaste = function (e) {
                                    var o;
                                    if (t.clipboardData && t.editor) {
                                        switch ((t.editor.focus(), e)) {
                                            case 'pasteOptionPasteAsIs':
                                                t.editor.paste(t.clipboardData);
                                                break;
                                            case 'pasteOptionPasteText':
                                                t.editor.paste(t.clipboardData, !0);
                                                break;
                                            case 'pasteOptionMergeFormat':
                                                t.editor.paste(t.clipboardData, !1, !0);
                                                break;
                                            case 'pasteOptionPasteAsImage':
                                                t.editor.paste(t.clipboardData, !1, !1, !0);
                                        }
                                        null === (o = t.pasteOptionRef.current) ||
                                            void 0 === o ||
                                            o.setSelectedKey(e);
                                    }
                                });
                        }
                        return (
                            (e.prototype.getName = function () {
                                return 'PasteOption';
                            }),
                            (e.prototype.initialize = function (e) {
                                this.editor = e;
                            }),
                            (e.prototype.dispose = function () {
                                var e;
                                null === (e = this.pasteOptionRef.current) ||
                                    void 0 === e ||
                                    e.dismiss(),
                                    (this.editor = null);
                            }),
                            (e.prototype.onPluginEvent = function (e) {
                                var t;
                                if (14 == e.eventType)
                                    this.pasteOptionRef.current && this.showPasteOptionPane();
                                else if (this.pasteOptionRef.current)
                                    this.handlePasteOptionPaneEvent(e);
                                else if (7 == e.eventType && 'Paste' == e.source) {
                                    var o = e.data;
                                    (null == o ? void 0 : o.text) &&
                                        (null === (t = o.types) || void 0 === t
                                            ? void 0
                                            : t.indexOf('text/html')) >= 0 &&
                                        ((this.clipboardData = o), this.showPasteOptionPane());
                                }
                            }),
                            (e.prototype.setUIUtilities = function (e) {
                                this.uiUtilities = e;
                            }),
                            (e.prototype.handlePasteOptionPaneEvent = function (e) {
                                var t;
                                if (0 == e.eventType && this.pasteOptionRef.current) {
                                    var o = this.pasteOptionRef.current.getSelectedKey();
                                    if (o) {
                                        var n = e.rawEvent;
                                        if (17 != n.which && n.ctrlKey)
                                            return void this.pasteOptionRef.current.dismiss();
                                        for (var a = 0; a < i.ButtonKeys.length; a++) {
                                            var r = i.ButtonKeys[a];
                                            if (
                                                i.Buttons[r].shortcut ==
                                                String.fromCharCode(n.which)
                                            )
                                                return this.onPaste(r), void l(n);
                                        }
                                        switch (n.which) {
                                            case 27:
                                                this.pasteOptionRef.current.dismiss();
                                                break;
                                            case 37:
                                            case 39:
                                                var f = i.ButtonKeys.length,
                                                    s =
                                                        (39 == n.which) ==
                                                        (null === (t = this.uiUtilities) ||
                                                        void 0 === t
                                                            ? void 0
                                                            : t.isRightToLeft())
                                                            ? -1
                                                            : 1;
                                                this.pasteOptionRef.current.setSelectedKey(
                                                    i.ButtonKeys[
                                                        (i.ButtonKeys.indexOf(o) + s + f) % f
                                                    ]
                                                );
                                                break;
                                            case 13:
                                                this.onPaste(o);
                                                break;
                                            case 17:
                                                break;
                                            default:
                                                return void this.pasteOptionRef.current.dismiss();
                                        }
                                        l(n);
                                    } else
                                        switch (e.rawEvent.which) {
                                            case 17:
                                                this.pasteOptionRef.current.setSelectedKey(
                                                    i.ButtonKeys[0]
                                                ),
                                                    l(e.rawEvent);
                                                break;
                                            case 27:
                                                this.pasteOptionRef.current.dismiss(),
                                                    l(e.rawEvent);
                                                break;
                                            default:
                                                this.pasteOptionRef.current.dismiss();
                                        }
                                }
                            }),
                            (e.prototype.showPasteOptionPane = function () {
                                var e, t;
                                null === (e = this.pasteOptionRef.current) ||
                                    void 0 === e ||
                                    e.dismiss();
                                var o =
                                    null === (t = this.editor) || void 0 === t
                                        ? void 0
                                        : t.getFocusedPosition();
                                o &&
                                    this.uiUtilities &&
                                    (0, a.default)(
                                        this.uiUtilities,
                                        o,
                                        this.onPaste,
                                        this.pasteOptionRef,
                                        this.strings
                                    );
                            }),
                            e
                        );
                    })();
                function l(e) {
                    e.preventDefault(), e.stopPropagation();
                }
                t.default = function (e) {
                    return new r(e);
                };
            },
            6436: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.ButtonKeys = t.Buttons = void 0),
                    (t.Buttons = {
                        pasteOptionPasteAsIs: {
                            unlocalizedText: 'Paste as is',
                            shortcut: 'P',
                            icon: 'Paste',
                        },
                        pasteOptionPasteText: {
                            unlocalizedText: 'Paste text',
                            shortcut: 'T',
                            icon: 'PasteAsText',
                        },
                        pasteOptionMergeFormat: {
                            unlocalizedText: 'Paste text and merge format',
                            shortcut: 'M',
                            icon: 'ClipboardList',
                        },
                        pasteOptionPasteAsImage: {
                            unlocalizedText: 'Paste as image',
                            shortcut: 'I',
                            icon: 'PictureFill',
                        },
                    }),
                    (t.ButtonKeys = Object.keys(t.Buttons));
            },
            6362: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(5014),
                    r = o(3538),
                    l = o(3538),
                    f = o(1905),
                    s = o(3538),
                    m = o(785),
                    c = (0, s.mergeStyles)({ '& .ms-CommandBar': { padding: '0px' } }),
                    u = (0, s.mergeStyles)({ transform: 'scaleX(-1)' });
                t.default = function (e) {
                    var t = e.plugin,
                        o = e.buttons,
                        s = e.strings,
                        d = e.dir,
                        g = (0, n.__read)(a.useState(null), 2),
                        h = g[0],
                        j = g[1],
                        p = 'rtl' == d,
                        b = a.useCallback(
                            function (e, o) {
                                o && (null == t || t.onButtonClick(o.data, o.key, s));
                            },
                            [t, s]
                        ),
                        y = a.useCallback(
                            function (e, o) {
                                t.startLivePreview(e, o, s);
                            },
                            [t, s]
                        ),
                        D = a.useCallback(
                            function () {
                                t.stopLivePreview();
                            },
                            [t]
                        ),
                        v = a.useCallback(function (e, t) {
                            return t ? a.createElement('span', { className: u }, t(e)) : null;
                        }, []),
                        k = a.useMemo(
                            function () {
                                return o.map(function (e) {
                                    var t,
                                        o,
                                        r,
                                        m,
                                        c =
                                            h &&
                                            (null ===
                                                (o =
                                                    null === (t = e.dropDownMenu) || void 0 === t
                                                        ? void 0
                                                        : t.getSelectedItemKey) || void 0 === o
                                                ? void 0
                                                : o.call(t, h)),
                                        u = e.dropDownMenu,
                                        d = (0, n.__assign)(
                                            {
                                                key: e.key,
                                                data: e,
                                                iconProps: { iconName: e.iconName },
                                                onRenderIcon: p && e.flipWhenRtl ? v : void 0,
                                                iconOnly: !0,
                                                text: (0, i.default)(s, e.key, e.unlocalizedText),
                                                ariaLabel: (0, i.default)(
                                                    s,
                                                    e.key,
                                                    e.unlocalizedText
                                                ),
                                                canCheck: !0,
                                                checked:
                                                    (h &&
                                                        (null === (r = e.isChecked) || void 0 === r
                                                            ? void 0
                                                            : r.call(e, h))) ||
                                                    !1,
                                                disabled:
                                                    (h &&
                                                        (null === (m = e.isDisabled) || void 0 === m
                                                            ? void 0
                                                            : m.call(e, h))) ||
                                                    !1,
                                            },
                                            e.commandBarProperties || {}
                                        );
                                    return (
                                        u
                                            ? (d.subMenuProps = (0, n.__assign)(
                                                  {
                                                      shouldFocusOnMount: !0,
                                                      focusZoneProps: {
                                                          direction:
                                                              l.FocusZoneDirection.bidirectional,
                                                      },
                                                      onMenuDismissed: D,
                                                      onItemClick: b,
                                                      onRenderContextualMenuItem: u.allowLivePreview
                                                          ? function (t, o) {
                                                                return t && o
                                                                    ? a.createElement(
                                                                          'div',
                                                                          {
                                                                              onMouseOver: function (
                                                                                  o
                                                                              ) {
                                                                                  return y(
                                                                                      e,
                                                                                      t.key
                                                                                  );
                                                                              },
                                                                          },
                                                                          o(t)
                                                                      )
                                                                    : null;
                                                            }
                                                          : void 0,
                                                      items: (0, f.getObjectKeys)(u.items).map(
                                                          function (t) {
                                                              return {
                                                                  key: t,
                                                                  text: (0, i.default)(
                                                                      s,
                                                                      t,
                                                                      u.items[t]
                                                                  ),
                                                                  data: e,
                                                                  canCheck: !!u.getSelectedItemKey,
                                                                  checked: c == t || !1,
                                                                  className: u.itemClassName,
                                                                  onRender: u.itemRender
                                                                      ? function (e) {
                                                                            return u.itemRender(
                                                                                e,
                                                                                b
                                                                            );
                                                                        }
                                                                      : void 0,
                                                              };
                                                          }
                                                      ),
                                                  },
                                                  u.commandBarSubMenuProperties || {}
                                              ))
                                            : (d.onClick = b),
                                        d
                                    );
                                });
                            },
                            [o, h, p, s, b, D, y]
                        );
                    a.useEffect(
                        function () {
                            var e = null == t ? void 0 : t.registerFormatChangedCallback(j);
                            return function () {
                                null == e || e();
                            };
                        },
                        [t]
                    );
                    var K = m.moreCommands;
                    return a.createElement(
                        r.CommandBar,
                        (0, n.__assign)({ items: k }, e, {
                            className: c + ' ' + ((null == e ? void 0 : e.className) || ''),
                            overflowButtonProps: (0, n.__assign)(
                                { ariaLabel: (0, i.default)(s, K.key, K.unlocalizedText) },
                                null == e ? void 0 : e.overflowButtonProps
                            ),
                        })
                    );
                };
            },
            7179: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.alignCenter = void 0);
                var n = o(1905);
                t.alignCenter = {
                    key: 'buttonNameAlignCenter',
                    unlocalizedText: 'Align center',
                    iconName: 'AlignCenter',
                    onClick: function (e) {
                        (0, n.setAlignment)(e, 1);
                    },
                };
            },
            4755: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.alignLeft = void 0);
                var n = o(1905);
                t.alignLeft = {
                    key: 'buttonNameAlignLeft',
                    unlocalizedText: 'Align left',
                    iconName: 'AlignLeft',
                    onClick: function (e) {
                        (0, n.setAlignment)(e, 0);
                    },
                };
            },
            6075: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.alignRight = void 0);
                var n = o(1905);
                t.alignRight = {
                    key: 'buttonNameAlignRight',
                    unlocalizedText: 'Align right',
                    iconName: 'AlignRight',
                    onClick: function (e) {
                        (0, n.setAlignment)(e, 2);
                    },
                };
            },
            1106: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.backgroundColor = void 0);
                var n = o(7821),
                    a = o(1905),
                    i = o(1391),
                    r = o(8952),
                    l = 'buttonNameBackgroundColor';
                t.backgroundColor = {
                    dropDownMenu: {
                        items: r.BackgroundColorDropDownItems,
                        itemClassName: (0, i.getColorPickerItemClassName)(),
                        allowLivePreview: !0,
                        itemRender: function (e, t) {
                            return (0, n.renderColorPicker)(e, r.BackgroundColors, t);
                        },
                        commandBarSubMenuProperties: {
                            className: (0, i.getColorPickerContainerClassName)(),
                        },
                    },
                    key: l,
                    unlocalizedText: 'Background color',
                    iconName: 'FabricTextHighlight',
                    onClick: function (e, t) {
                        t != l && (0, a.setBackgroundColor)(e, (0, r.getBackgroundColorValue)(t));
                    },
                };
            },
            2904: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.bold = void 0);
                var n = o(1905);
                t.bold = {
                    key: 'buttonNameBold',
                    unlocalizedText: 'Bold',
                    iconName: 'Bold',
                    isChecked: function (e) {
                        return !!e.isBold;
                    },
                    onClick: function (e) {
                        return (0, n.toggleBold)(e), !0;
                    },
                };
            },
            5001: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.bulletedList = void 0);
                var n = o(1905);
                t.bulletedList = {
                    key: 'buttonNameBulletedList',
                    unlocalizedText: 'Bulleted list',
                    iconName: 'BulletedList',
                    isChecked: function (e) {
                        return !!e.isBullet;
                    },
                    onClick: function (e) {
                        return (0, n.toggleBullet)(e), !0;
                    },
                };
            },
            2309: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.clearFormat = void 0);
                var n = o(1905);
                t.clearFormat = {
                    key: 'buttonNameClearFormat',
                    unlocalizedText: 'Clear format',
                    iconName: 'ClearFormatting',
                    onClick: function (e) {
                        (0, n.clearFormat)(e, 2);
                    },
                };
            },
            1892: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.code = void 0);
                var n = o(1905);
                t.code = {
                    key: 'buttonNameCode',
                    unlocalizedText: 'Code',
                    iconName: 'Code',
                    isChecked: function (e) {
                        return !!e.isCodeBlock;
                    },
                    onClick: function (e) {
                        (0, n.toggleCodeBlock)(e);
                    },
                };
            },
            2480: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.decreaseFontSize = void 0);
                var n = o(1905);
                t.decreaseFontSize = {
                    key: 'buttonNameDecreaseFontSize',
                    unlocalizedText: 'Decrease font size',
                    iconName: 'FontDecrease',
                    onClick: function (e) {
                        (0, n.changeFontSize)(e, 1);
                    },
                };
            },
            7035: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.decreaseIndent = void 0);
                var n = o(1905);
                t.decreaseIndent = {
                    key: 'buttonNameDecreaseIndent',
                    unlocalizedText: 'Decrease indent',
                    iconName: 'DecreaseIndentLegacy',
                    flipWhenRtl: !0,
                    onClick: function (e) {
                        (0, n.setIndentation)(e, 1);
                    },
                };
            },
            4986: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.font = void 0);
                var n = o(1905),
                    a = [
                        { name: 'Arial', family: 'Arial,Helvetica,sans-serif' },
                        { name: 'Arial Black', family: "'Arial Black',Arial,sans-serif" },
                        { name: 'Calibri', family: 'Calibri,Helvetica,sans-serif' },
                        {
                            name: 'Calibri Light',
                            family: "'Calibri Light','Helvetica Light',sans-serif",
                        },
                        { name: 'Cambria', family: 'Cambria,Georgia,serif' },
                        { name: 'Candara', family: 'Candara,Optima,sans-serif' },
                        { name: 'Century Gothic', family: "'Century Gothic',sans-serif" },
                        { name: 'Comic Sans MS', family: "'Comic Sans MS',Chalkboard,cursive" },
                        { name: 'Consolas', family: 'Consolas,Courier,monospace' },
                        { name: 'Constantia', family: "Constantia,'Hoefler Text',serif" },
                        { name: 'Corbel', family: 'Corbel,Skia,sans-serif' },
                        { name: 'Courier New', family: "'Courier New',monospace" },
                        {
                            name: 'Franklin Gothic Book',
                            family: "'Franklin Gothic Book','Avenir Next Condensed',sans-serif",
                        },
                        {
                            name: 'Franklin Gothic Demi',
                            family:
                                "'Franklin Gothic Demi','Avenir Next Condensed Demi Bold',sans-serif",
                        },
                        {
                            name: 'Franklin Gothic Medium',
                            family:
                                "'Franklin Gothic Medium','Avenir Next Condensed Medium',sans-serif",
                        },
                        { name: 'Garamond', family: 'Garamond,Georgia,serif' },
                        { name: 'Georgia', family: 'Georgia,serif' },
                        { name: 'Impact', family: 'Impact,Charcoal,sans-serif' },
                        { name: 'Lucida Console', family: "'Lucida Console',Monaco,monospace" },
                        {
                            name: 'Lucida Handwriting',
                            family: "'Lucida Handwriting','Apple Chancery',cursive",
                        },
                        {
                            name: 'Lucida Sans Unicode',
                            family: "'Lucida Sans Unicode','Lucida Grande',sans-serif",
                        },
                        {
                            name: 'Palatino Linotype',
                            family: "'Palatino Linotype','Book Antiqua',Palatino,serif",
                        },
                        {
                            name: 'Segoe UI',
                            family:
                                "'Segoe UI', 'Segoe UI Web (West European)', 'Helvetica Neue', sans-serif",
                        },
                        { name: 'Sitka Heading', family: "'Sitka Heading',Cochin,serif" },
                        { name: 'Sitka Text', family: "'Sitka Text',Cochin,serif" },
                        { name: 'Tahoma', family: 'Tahoma,Geneva,sans-serif' },
                        { name: 'Times', family: "Times,'Times New Roman',serif" },
                        { name: 'Times New Roman', family: "'Times New Roman',Times,serif" },
                        { name: 'Trebuchet MS', family: "'Trebuchet MS',Trebuchet,sans-serif" },
                        { name: 'TW Cen MT', family: "'TW Cen MT','Century Gothic',sans-serif" },
                        { name: 'Verdana', family: 'Verdana,Geneva,sans-serif' },
                        { name: '-', family: 'FontDivider0' },
                        {
                            name: 'Microsoft YaHei',
                            family: "'Microsoft YaHei','微软雅黑',STHeiti,sans-serif",
                            localizedName: '微软雅黑',
                        },
                        {
                            name: 'SimHei',
                            family: "SimHei,'黑体',STHeiti,sans-serif",
                            localizedName: '黑体',
                        },
                        {
                            name: 'NSimSun',
                            family:
                                "NSimSun,'新宋体',SimSun,'宋体',SimSun-ExtB,'宋体-ExtB',STSong,serif",
                            localizedName: '新宋体',
                        },
                        {
                            name: 'FangSong',
                            family: "FangSong,'仿宋',STFangsong,serif",
                            localizedName: '仿宋',
                        },
                        {
                            name: 'SimLi',
                            family: "SimLi,'隶书','Baoli SC',serif",
                            localizedName: '隶书',
                        },
                        {
                            name: 'KaiTi',
                            family: "KaiTi,'楷体',STKaiti,serif",
                            localizedName: '楷体',
                        },
                        { name: '-', family: 'FontDivider1' },
                        {
                            name: 'Microsoft JhengHei',
                            family: "'Microsoft JhengHei','微軟正黑體','Apple LiGothic',sans-serif",
                            localizedName: '微軟正黑體',
                        },
                        {
                            name: 'PMingLiU',
                            family:
                                "PMingLiU,'新細明體',PMingLiU-ExtB,'新細明體-ExtB','Apple LiSung',serif",
                            localizedName: '新細明體',
                        },
                        {
                            name: 'DFKai-SB',
                            family: "DFKai-SB,'標楷體','BiauKai',serif",
                            localizedName: '標楷體',
                        },
                        { name: '-', family: 'FontDivider2' },
                        {
                            name: 'Meiryo',
                            family: "Meiryo,'メイリオ','Hiragino Sans',sans-serif",
                            localizedName: 'メイリオ',
                        },
                        {
                            name: 'MS PGothic',
                            family:
                                "'MS PGothic','ＭＳ Ｐゴシック','MS Gothic','ＭＳ ゴシック','Hiragino Kaku Gothic ProN',sans-serif",
                            localizedName: 'ＭＳ Ｐゴシック',
                        },
                        {
                            name: 'MS PMincho',
                            family:
                                "'MS PMincho','ＭＳ Ｐ明朝','MS Mincho','ＭＳ 明朝','Hiragino Mincho ProN',serif",
                            localizedName: 'ＭＳ Ｐ明朝',
                        },
                        {
                            name: 'Yu Gothic',
                            family: "'Yu Gothic','游ゴシック','YuGothic',sans-serif",
                            localizedName: '游ゴシック',
                        },
                        {
                            name: 'Yu Mincho',
                            family: "'Yu Mincho','游明朝','YuMincho',serif",
                            localizedName: '游明朝',
                        },
                        { name: '-', family: 'FontDivider3' },
                        {
                            name: 'Malgun Gothic',
                            family: "'Malgun Gothic','맑은 고딕',AppleGothic,sans-serif",
                            localizedName: '맑은 고딕',
                        },
                        {
                            name: 'Gulim',
                            family: "Gulim,'굴림','Nanum Gothic',sans-serif",
                            localizedName: '굴림',
                        },
                        {
                            name: 'Dotum',
                            family: "Dotum,'돋움',AppleGothic,sans-serif",
                            localizedName: '돋움',
                        },
                        {
                            name: 'Batang',
                            family: "Batang,'바탕',AppleMyungjo,serif",
                            localizedName: '바탕',
                        },
                        {
                            name: 'BatangChe',
                            family: "BatangChe,'바탕체',AppleMyungjo,serif",
                            localizedName: '바탕체',
                        },
                        {
                            name: 'Gungsuh',
                            family: "Gungsuh,'궁서',GungSeo,serif",
                            localizedName: '궁서',
                        },
                        { name: '-', family: 'FontDivider4' },
                        { name: 'Leelawadee UI', family: "'Leelawadee UI',Thonburi,sans-serif" },
                        {
                            name: 'Angsana New',
                            family: "'Angsana New','Leelawadee UI',Sathu,serif",
                        },
                        {
                            name: 'Cordia New',
                            family: "'Cordia New','Leelawadee UI',Silom,sans-serif",
                        },
                        {
                            name: 'DaunPenh',
                            family: "DaunPenh,'Leelawadee UI','Khmer MN',sans-serif",
                        },
                        { name: '-', family: 'FontDivider5' },
                        { name: 'Nirmala UI', family: "'Nirmala UI',sans-serif" },
                        { name: 'Gautami', family: "Gautami,'Nirmala UI','Telugu MN',sans-serif" },
                        {
                            name: 'Iskoola Pota',
                            family: "'Iskoola Pota','Nirmala UI','Sinhala MN',sans-serif",
                        },
                        { name: 'Kalinga', family: "Kalinga,'Nirmala UI','Oriya MN',sans-serif" },
                        {
                            name: 'Kartika',
                            family: "Kartika,'Nirmala UI','Malayalam MN',sans-serif",
                        },
                        { name: 'Latha', family: "Latha,'Nirmala UI','Tamil MN',sans-serif" },
                        {
                            name: 'Mangal',
                            family: "Mangal,'Nirmala UI','Devanagari Sangam MN',sans-serif",
                        },
                        { name: 'Raavi', family: "Raavi,'Nirmala UI','Gurmukhi MN',sans-serif" },
                        {
                            name: 'Shruti',
                            family: "Shruti,'Nirmala UI','Gujarati Sangam MN',sans-serif",
                        },
                        { name: 'Tunga', family: "Tunga,'Nirmala UI','Kannada MN',sans-serif" },
                        { name: 'Vrinda', family: "Vrinda,'Nirmala UI','Bangla MN',sans-serif" },
                        { name: '-', family: 'FontDivider6' },
                        { name: 'Nyala', family: 'Nyala,Kefa,sans-serif' },
                        { name: 'Sylfaen', family: 'Sylfaen,Mshtakan,Menlo,serif' },
                    ],
                    i = a.reduce(function (e, t) {
                        return (e[t.family] = t.localizedName || t.name), e;
                    }, {}),
                    r = a.reduce(function (e, t) {
                        return (e[t.name.toLowerCase()] = t.family), e;
                    }, {}),
                    l = /^['"]?([^'",]+)/i;
                t.font = {
                    key: 'buttonNameFont',
                    unlocalizedText: 'Font',
                    iconName: 'Font',
                    dropDownMenu: {
                        items: i,
                        getSelectedItemKey: function (e) {
                            var t,
                                o,
                                n = null === (t = e.fontName) || void 0 === t ? void 0 : t.match(l),
                                a =
                                    null === (o = null == n ? void 0 : n[1]) || void 0 === o
                                        ? void 0
                                        : o.toLowerCase();
                            return (a && r[a]) || '';
                        },
                        allowLivePreview: !0,
                    },
                    onClick: function (e, t) {
                        (0, n.setFontName)(e, t);
                    },
                };
            },
            767: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.fontSize = void 0);
                var n = o(1905);
                t.fontSize = {
                    key: 'buttonNameFontSize',
                    unlocalizedText: 'Font size',
                    iconName: 'FontSize',
                    dropDownMenu: {
                        items: n.FONT_SIZES.reduce(function (e, t) {
                            return (e[t + 'pt'] = t.toString()), e;
                        }, {}),
                        getSelectedItemKey: function (e) {
                            var t;
                            return null !== (t = e.fontSize) && void 0 !== t ? t : null;
                        },
                        allowLivePreview: !0,
                    },
                    onClick: function (e, t) {
                        (0, n.setFontSize)(e, t);
                    },
                };
            },
            9840: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.heading = void 0);
                var n = o(1905),
                    a = o(1905),
                    i = {
                        buttonNameHeading1: 'Heading 1',
                        buttonNameHeading2: 'Heading 2',
                        buttonNameHeading3: 'Heading 3',
                        buttonNameHeading4: 'Heading 4',
                        buttonNameHeading5: 'Heading 5',
                        buttonNameHeading6: 'Heading 6',
                        '-': '-',
                        buttonNameNoHeading: 'No heading',
                    };
                t.heading = {
                    key: 'buttonNameHeading',
                    unlocalizedText: 'Heading',
                    iconName: 'Header1',
                    dropDownMenu: {
                        items: i,
                        getSelectedItemKey: function (e) {
                            var t;
                            return (null !== (t = e.headingLevel) && void 0 !== t ? t : 0) > 0
                                ? 'heading' + e.headingLevel
                                : 'noHeading';
                        },
                    },
                    onClick: function (e, t) {
                        var o = (0, n.getObjectKeys)(i).indexOf(t) + 1;
                        o > 6
                            ? (0, a.setHeadingLevel)(e, 0)
                            : o > 0 && (0, a.setHeadingLevel)(e, o);
                    },
                };
            },
            9367: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.increaseFontSize = void 0);
                var n = o(1905);
                t.increaseFontSize = {
                    key: 'buttonNameIncreaseFontSize',
                    unlocalizedText: 'Increase font size',
                    iconName: 'FontIncrease',
                    onClick: function (e) {
                        (0, n.changeFontSize)(e, 0);
                    },
                };
            },
            2568: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.increaseIndent = void 0);
                var n = o(1905);
                t.increaseIndent = {
                    key: 'buttonNameIncreaseIndent',
                    unlocalizedText: 'Increase indent',
                    iconName: 'IncreaseIndentLegacy',
                    flipWhenRtl: !0,
                    onClick: function (e) {
                        (0, n.setIndentation)(e, 0);
                    },
                };
            },
            8003: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.insertImage = void 0);
                var n = o(1905),
                    a = o(1905),
                    i = {
                        tag: 'input',
                        attributes: { type: 'file', accept: 'image/*', display: 'none' },
                    };
                t.insertImage = {
                    key: 'buttonNameInsertImage',
                    unlocalizedText: 'Insert image',
                    iconName: 'Photo2',
                    onClick: function (e) {
                        var t = e.getDocument(),
                            o = (0, n.createElement)(i, t);
                        t.body.appendChild(o),
                            o.addEventListener('change', function () {
                                if (o.files)
                                    for (var t = 0; t < o.files.length; t++)
                                        (0, a.insertImage)(e, o.files[t]);
                            });
                        try {
                            o.click();
                        } finally {
                            t.body.removeChild(o);
                        }
                    },
                };
            },
            1957: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.insertLink = void 0);
                var n = o(1863),
                    a = o(1905);
                t.insertLink = {
                    key: 'buttonNameInsertLink',
                    unlocalizedText: 'Insert link',
                    iconName: 'Link',
                    isDisabled: function (e) {
                        return !!e.isMultilineSelection;
                    },
                    onClick: function (e, t, o, i) {
                        var r,
                            l = e.queryElements('a[href]', 1)[0],
                            f = (null == l ? void 0 : l.href) || '',
                            s =
                                (null == l ? void 0 : l.textContent) ||
                                (null === (r = e.getSelectionRange()) || void 0 === r
                                    ? void 0
                                    : r.toString()) ||
                                '',
                            m = {
                                url: {
                                    autoFocus: !0,
                                    labelKey: 'insertLinkDialogUrl',
                                    unlocalizedLabel: 'Web address (URL)',
                                    initValue: f,
                                },
                                displayText: {
                                    labelKey: 'insertLinkDialogDisplayAs',
                                    unlocalizedLabel: 'Display as',
                                    initValue: s,
                                },
                            };
                        (0, n.default)(i, 'insertLinkTitle', 'Insert link', m, o, function (
                            e,
                            t,
                            o
                        ) {
                            return 'url' == e && o.displayText == o.url
                                ? ((o.displayText = t), (o.url = t), o)
                                : null;
                        }).then(function (t) {
                            e.focus(),
                                t &&
                                    t.displayText &&
                                    t.url &&
                                    (t.displayText != s || t.url != f) &&
                                    (0, a.createLink)(e, t.url, t.url, t.displayText);
                        });
                    },
                };
            },
            1510: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.insertTable = void 0);
                var n = o(7582),
                    a = o(7363),
                    i = o(3538),
                    r = o(1905),
                    l = o(3538),
                    f = o(1905),
                    s = (0, l.mergeStyleSets)({
                        tableButton: {
                            width: '15px',
                            height: '15px',
                            margin: '1px 1px 0 0',
                            border: 'solid 1px #a19f9d',
                            display: 'inline-block',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                        },
                        hovered: { border: 'solid 1px #DB626C' },
                        tablePane: {
                            width: '160px',
                            minWidth: 'auto',
                            padding: '4px',
                            boxSizing: 'content-box',
                        },
                        tablePaneInner: { lineHeight: '12px' },
                        title: { margin: '5px 0' },
                    });
                function m(e) {
                    var t,
                        o = e.item,
                        r = e.onClick,
                        l = (0, n.__read)(a.useState(1), 2),
                        m = l[0],
                        d = l[1],
                        g = (0, n.__read)(a.useState(1), 2),
                        h = g[0],
                        j = g[1],
                        p = a.useCallback(
                            function (e) {
                                var t, o;
                                if ((0, f.safeInstanceOf)(e, 'HTMLElement')) {
                                    var n = parseInt(
                                            null !== (t = e.dataset.col) && void 0 !== t ? t : '-1'
                                        ),
                                        a = parseInt(
                                            null !== (o = e.dataset.row) && void 0 !== o ? o : '-1'
                                        );
                                    n > 0 && n <= 10 && a > 0 && a <= 10 && (d(n), j(a));
                                }
                            },
                            [d, j]
                        ),
                        b = a.useCallback(
                            function (e) {
                                p(e.target);
                            },
                            [p]
                        ),
                        y = a.useCallback(
                            function (e) {
                                r(e, (0, n.__assign)((0, n.__assign)({}, o), { key: u(h, m) }));
                            },
                            [h, m, r]
                        ),
                        D = a.useMemo(
                            function () {
                                for (var e, t = [], n = 1; n <= 10; n++) {
                                    for (var a = [], i = 1; i <= 10; i++)
                                        a[i] = c(
                                            null !== (e = o.text) && void 0 !== e ? e : '',
                                            n,
                                            i
                                        );
                                    t[n] = a;
                                }
                                return t;
                            },
                            [o.text]
                        ),
                        v = a.useMemo(
                            function () {
                                for (var e = [], t = 1; t <= 10; t++)
                                    for (var o = 1; o <= 10; o++) {
                                        var n = 'cell_' + t + '_' + o,
                                            i = o <= m && t <= h;
                                        e.push(
                                            a.createElement('button', {
                                                className:
                                                    s.tableButton + ' ' + (i ? s.hovered : ''),
                                                onClick: y,
                                                key: n,
                                                id: n,
                                                'data-col': o,
                                                'data-row': t,
                                                'data-is-focusable': !0,
                                                onMouseEnter: b,
                                                'aria-label': D[t][o],
                                            })
                                        );
                                    }
                                return e;
                            },
                            [m, h]
                        ),
                        k = c(null !== (t = o.text) && void 0 !== t ? t : '', h, m);
                    return a.createElement(
                        'div',
                        { className: s.tablePaneInner },
                        a.createElement('div', { className: s.title }, k),
                        a.createElement(
                            i.FocusZone,
                            {
                                defaultActiveElement: 'cell_1_1',
                                direction: i.FocusZoneDirection.bidirectional,
                                onActiveElementChanged: p,
                            },
                            v
                        )
                    );
                }
                function c(e, t, o) {
                    return e.replace('{0}', o.toString()).replace('{1}', t.toString());
                }
                function u(e, t) {
                    return e + ',' + t;
                }
                t.insertTable = {
                    key: 'buttonNameInsertTable',
                    unlocalizedText: 'Insert table',
                    iconName: 'Table',
                    onClick: function (e, t) {
                        var o = (function (e) {
                                var t = (0, n.__read)(e.split(','), 2),
                                    o = t[0],
                                    a = t[1];
                                return { row: parseInt(o), col: parseInt(a) };
                            })(t),
                            a = o.row,
                            i = o.col;
                        (0, r.insertTable)(e, i, a);
                    },
                    dropDownMenu: {
                        items: { insertTablePane: '{0} x {1} table' },
                        itemRender: function (e, t) {
                            return a.createElement(m, { item: e, onClick: t });
                        },
                        commandBarSubMenuProperties: { className: s.tablePane },
                    },
                };
            },
            6787: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.italic = void 0);
                var n = o(1905);
                t.italic = {
                    key: 'buttonNameItalic',
                    unlocalizedText: 'Italic',
                    iconName: 'Italic',
                    isChecked: function (e) {
                        return !!e.isItalic;
                    },
                    onClick: function (e) {
                        return (0, n.toggleItalic)(e), !0;
                    },
                };
            },
            1675: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.ltr = void 0);
                var n = o(1905);
                t.ltr = {
                    key: 'buttonNameLtr',
                    unlocalizedText: 'Left to right',
                    iconName: 'BidiLtr',
                    onClick: function (e) {
                        (0, n.setDirection)(e, 0);
                    },
                };
            },
            785: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.moreCommands = void 0),
                    (t.moreCommands = {
                        key: 'buttonNameMoreCommands',
                        unlocalizedText: 'More commands',
                        iconName: 'MoreCommands',
                        onClick: function (e) {
                            return !0;
                        },
                    });
            },
            6486: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.numberedList = void 0);
                var n = o(1905);
                t.numberedList = {
                    key: 'buttonNameNumberedList',
                    unlocalizedText: 'Numbered list',
                    iconName: 'NumberedList',
                    isChecked: function (e) {
                        return !!e.isNumbering;
                    },
                    onClick: function (e) {
                        return (0, n.toggleNumbering)(e), !0;
                    },
                };
            },
            341: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.quote = void 0);
                var n = o(1905);
                t.quote = {
                    key: 'buttonNameQuote',
                    unlocalizedText: 'Quote',
                    iconName: 'RightDoubleQuote',
                    isChecked: function (e) {
                        return !!e.isBlockQuote;
                    },
                    onClick: function (e) {
                        return (0, n.toggleBlockQuote)(e), !0;
                    },
                };
            },
            2729: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.redo = void 0),
                    (t.redo = {
                        key: 'buttonNameRedo',
                        unlocalizedText: 'Redo',
                        iconName: 'Redo',
                        isDisabled: function (e) {
                            return !e.canRedo;
                        },
                        onClick: function (e) {
                            return e.redo(), !0;
                        },
                    });
            },
            8014: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.removeLink = void 0);
                var n = o(1905);
                t.removeLink = {
                    key: 'buttonNameRemoveLink',
                    unlocalizedText: 'Remove link',
                    iconName: 'RemoveLink',
                    isDisabled: function (e) {
                        return !e.canUnlink;
                    },
                    onClick: function (e) {
                        (0, n.removeLink)(e);
                    },
                };
            },
            2291: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.rtl = void 0);
                var n = o(1905);
                t.rtl = {
                    key: 'buttonNameRtl',
                    unlocalizedText: 'Right to left',
                    iconName: 'BidiRtl',
                    onClick: function (e) {
                        (0, n.setDirection)(e, 1);
                    },
                };
            },
            3558: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.strikethrough = void 0);
                var n = o(1905);
                t.strikethrough = {
                    key: 'buttonNameStrikethrough',
                    unlocalizedText: 'Strikethrough',
                    iconName: 'Strikethrough',
                    isChecked: function (e) {
                        return !!e.isStrikeThrough;
                    },
                    onClick: function (e) {
                        return (0, n.toggleStrikethrough)(e), !0;
                    },
                };
            },
            3249: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.subscript = void 0);
                var n = o(1905);
                t.subscript = {
                    key: 'buttonNameSubscript',
                    unlocalizedText: 'Subscript',
                    iconName: 'Subscript',
                    isChecked: function (e) {
                        return !!e.isSubscript;
                    },
                    onClick: function (e) {
                        return (0, n.toggleSubscript)(e), !0;
                    },
                };
            },
            1434: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.superscript = void 0);
                var n = o(1905);
                t.superscript = {
                    key: 'buttonNameSuperscript',
                    unlocalizedText: 'Superscript',
                    iconName: 'Superscript',
                    isChecked: function (e) {
                        return !!e.isSuperscript;
                    },
                    onClick: function (e) {
                        return (0, n.toggleSuperscript)(e), !0;
                    },
                };
            },
            3367: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.textColor = void 0);
                var n = o(7821),
                    a = o(1905),
                    i = o(8288),
                    r = o(1391),
                    l = 'buttonNameTextColor';
                t.textColor = {
                    dropDownMenu: {
                        items: i.TextColorDropDownItems,
                        itemClassName: (0, r.getColorPickerItemClassName)(),
                        allowLivePreview: !0,
                        itemRender: function (e, t) {
                            return (0, n.renderColorPicker)(e, i.TextColors, t);
                        },
                        commandBarSubMenuProperties: {
                            className: (0, r.getColorPickerContainerClassName)(),
                        },
                    },
                    key: l,
                    unlocalizedText: 'Text color',
                    iconName: 'FontColor',
                    onClick: function (e, t) {
                        t != l && (0, a.setTextColor)(e, (0, i.getTextColorValue)(t));
                    },
                };
            },
            8049: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.underline = void 0);
                var n = o(1905);
                t.underline = {
                    key: 'buttonNameUnderline',
                    unlocalizedText: 'Underline',
                    iconName: 'Underline',
                    isChecked: function (e) {
                        return !!e.isUnderline;
                    },
                    onClick: function (e) {
                        return (0, n.toggleUnderline)(e), !0;
                    },
                };
            },
            57: (e, t) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.undo = void 0),
                    (t.undo = {
                        key: 'buttonNameUndo',
                        unlocalizedText: 'Undo',
                        iconName: 'undo',
                        isDisabled: function (e) {
                            return !e.canUndo;
                        },
                        onClick: function (e) {
                            return e.undo(), !0;
                        },
                    });
            },
            5850: (e, t, o) => {
                var n;
                Object.defineProperty(t, '__esModule', { value: !0 }), (t.AllButtonKeys = void 0);
                var a = o(7179),
                    i = o(4755),
                    r = o(6075),
                    l = o(1106),
                    f = o(2904),
                    s = o(5001),
                    m = o(2309),
                    c = o(1892),
                    u = o(2480),
                    d = o(7035),
                    g = o(4986),
                    h = o(767),
                    j = o(9840),
                    p = o(9367),
                    b = o(2568),
                    y = o(8003),
                    D = o(1957),
                    v = o(1510),
                    k = o(6787),
                    K = o(5545),
                    C = o(1675),
                    w = o(6486),
                    S = o(341),
                    x = o(2729),
                    M = o(8014),
                    P = o(2291),
                    _ = o(3558),
                    N = o(3249),
                    B = o(1434),
                    I = o(3367),
                    T = o(8049),
                    O = o(57),
                    R =
                        (((n = {})[K.KnownRibbonButtonKey.Bold] = f.bold),
                        (n[K.KnownRibbonButtonKey.Italic] = k.italic),
                        (n[K.KnownRibbonButtonKey.Underline] = T.underline),
                        (n[K.KnownRibbonButtonKey.Font] = g.font),
                        (n[K.KnownRibbonButtonKey.FontSize] = h.fontSize),
                        (n[K.KnownRibbonButtonKey.IncreaseFontSize] = p.increaseFontSize),
                        (n[K.KnownRibbonButtonKey.DecreaseFontSize] = u.decreaseFontSize),
                        (n[K.KnownRibbonButtonKey.TextColor] = I.textColor),
                        (n[K.KnownRibbonButtonKey.BackgroundColor] = l.backgroundColor),
                        (n[K.KnownRibbonButtonKey.BulletedList] = s.bulletedList),
                        (n[K.KnownRibbonButtonKey.NumberedList] = w.numberedList),
                        (n[K.KnownRibbonButtonKey.DecreaseIndent] = d.decreaseIndent),
                        (n[K.KnownRibbonButtonKey.IncreaseIndent] = b.increaseIndent),
                        (n[K.KnownRibbonButtonKey.Quote] = S.quote),
                        (n[K.KnownRibbonButtonKey.AlignLeft] = i.alignLeft),
                        (n[K.KnownRibbonButtonKey.AlignCenter] = a.alignCenter),
                        (n[K.KnownRibbonButtonKey.AlignRight] = r.alignRight),
                        (n[K.KnownRibbonButtonKey.InsertLink] = D.insertLink),
                        (n[K.KnownRibbonButtonKey.RemoveLink] = M.removeLink),
                        (n[K.KnownRibbonButtonKey.InsertTable] = v.insertTable),
                        (n[K.KnownRibbonButtonKey.InsertImage] = y.insertImage),
                        (n[K.KnownRibbonButtonKey.Superscript] = B.superscript),
                        (n[K.KnownRibbonButtonKey.Subscript] = N.subscript),
                        (n[K.KnownRibbonButtonKey.Strikethrough] = _.strikethrough),
                        (n[K.KnownRibbonButtonKey.Header] = j.heading),
                        (n[K.KnownRibbonButtonKey.Heading] = j.heading),
                        (n[K.KnownRibbonButtonKey.Code] = c.code),
                        (n[K.KnownRibbonButtonKey.Ltr] = C.ltr),
                        (n[K.KnownRibbonButtonKey.Rtl] = P.rtl),
                        (n[K.KnownRibbonButtonKey.Undo] = O.undo),
                        (n[K.KnownRibbonButtonKey.Redo] = x.redo),
                        (n[K.KnownRibbonButtonKey.ClearFormat] = m.clearFormat),
                        n);
                (t.AllButtonKeys = [
                    K.KnownRibbonButtonKey.Bold,
                    K.KnownRibbonButtonKey.Italic,
                    K.KnownRibbonButtonKey.Underline,
                    K.KnownRibbonButtonKey.Font,
                    K.KnownRibbonButtonKey.FontSize,
                    K.KnownRibbonButtonKey.IncreaseFontSize,
                    K.KnownRibbonButtonKey.DecreaseFontSize,
                    K.KnownRibbonButtonKey.TextColor,
                    K.KnownRibbonButtonKey.BackgroundColor,
                    K.KnownRibbonButtonKey.BulletedList,
                    K.KnownRibbonButtonKey.NumberedList,
                    K.KnownRibbonButtonKey.DecreaseIndent,
                    K.KnownRibbonButtonKey.IncreaseIndent,
                    K.KnownRibbonButtonKey.Quote,
                    K.KnownRibbonButtonKey.AlignLeft,
                    K.KnownRibbonButtonKey.AlignCenter,
                    K.KnownRibbonButtonKey.AlignRight,
                    K.KnownRibbonButtonKey.InsertLink,
                    K.KnownRibbonButtonKey.RemoveLink,
                    K.KnownRibbonButtonKey.InsertTable,
                    K.KnownRibbonButtonKey.InsertImage,
                    K.KnownRibbonButtonKey.Superscript,
                    K.KnownRibbonButtonKey.Subscript,
                    K.KnownRibbonButtonKey.Strikethrough,
                    K.KnownRibbonButtonKey.Heading,
                    K.KnownRibbonButtonKey.Code,
                    K.KnownRibbonButtonKey.Ltr,
                    K.KnownRibbonButtonKey.Rtl,
                    K.KnownRibbonButtonKey.Undo,
                    K.KnownRibbonButtonKey.Redo,
                    K.KnownRibbonButtonKey.ClearFormat,
                ]),
                    (t.default = function (e) {
                        return (
                            void 0 === e && (e = t.AllButtonKeys),
                            e.map(function (e) {
                                return 'number' == typeof e ? R[e] : e;
                            })
                        );
                    });
            },
            8586: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.createRibbonPlugin = t.AllButtonKeys = t.getButtons = t.Ribbon = t.KnownRibbonButtonKey = void 0);
                var n = o(5545);
                Object.defineProperty(t, 'KnownRibbonButtonKey', {
                    enumerable: !0,
                    get: function () {
                        return n.KnownRibbonButtonKey;
                    },
                });
                var a = o(6362);
                Object.defineProperty(t, 'Ribbon', {
                    enumerable: !0,
                    get: function () {
                        return a.default;
                    },
                });
                var i = o(5850);
                Object.defineProperty(t, 'getButtons', {
                    enumerable: !0,
                    get: function () {
                        return i.default;
                    },
                }),
                    Object.defineProperty(t, 'AllButtonKeys', {
                        enumerable: !0,
                        get: function () {
                            return i.AllButtonKeys;
                        },
                    });
                var r = o(4900);
                Object.defineProperty(t, 'createRibbonPlugin', {
                    enumerable: !0,
                    get: function () {
                        return r.default;
                    },
                });
            },
            4900: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(1905),
                    a = o(1957),
                    i = o(1905),
                    r = (function () {
                        function e(e, t) {
                            void 0 === e && (e = 200),
                                (this.delayUpdateTime = e),
                                (this.editor = null),
                                (this.onFormatChanged = null),
                                (this.timer = 0),
                                (this.formatState = null),
                                (this.uiUtilities = null),
                                (this.options = t);
                        }
                        return (
                            (e.prototype.getName = function () {
                                return 'Ribbon';
                            }),
                            (e.prototype.initialize = function (e) {
                                this.editor = e;
                            }),
                            (e.prototype.dispose = function () {
                                this.editor = null;
                            }),
                            (e.prototype.onPluginEvent = function (e) {
                                var t;
                                switch (e.eventType) {
                                    case 11:
                                    case 7:
                                    case 21:
                                        this.updateFormat();
                                        break;
                                    case 0:
                                        'k' == e.rawEvent.key &&
                                            (0, i.isCtrlOrMetaPressed)(e.rawEvent) &&
                                            !e.rawEvent.altKey &&
                                            (null === (t = this.options) || void 0 === t
                                                ? void 0
                                                : t.allowInsertLinkHotKey) &&
                                            (this.handleButtonClick(
                                                a.insertLink,
                                                'insertLinkTitle',
                                                void 0
                                            ),
                                            e.rawEvent.preventDefault());
                                        break;
                                    case 6:
                                        this.delayUpdate();
                                }
                            }),
                            (e.prototype.setUIUtilities = function (e) {
                                this.uiUtilities = e;
                            }),
                            (e.prototype.registerFormatChangedCallback = function (e) {
                                var t = this;
                                return (
                                    (this.onFormatChanged = e),
                                    function () {
                                        t.onFormatChanged = null;
                                    }
                                );
                            }),
                            (e.prototype.onButtonClick = function (e, t, o) {
                                this.handleButtonClick(e, t, o);
                            }),
                            (e.prototype.handleButtonClick = function (e, t, o) {
                                var n;
                                this.editor &&
                                    this.uiUtilities &&
                                    (this.editor.stopShadowEdit(),
                                    e.onClick(this.editor, t, o, this.uiUtilities),
                                    (e.isChecked ||
                                        e.isDisabled ||
                                        (null === (n = e.dropDownMenu) || void 0 === n
                                            ? void 0
                                            : n.getSelectedItemKey)) &&
                                        this.updateFormat());
                            }),
                            (e.prototype.startLivePreview = function (e, t, o) {
                                if (this.editor && this.uiUtilities) {
                                    var n = this.editor.isInShadowEdit(),
                                        a = !n && this.editor.getSelectionRangeEx();
                                    (n || (a && !a.areAllCollapsed)) &&
                                        (this.editor.startShadowEdit(),
                                        e.onClick(this.editor, t, o, this.uiUtilities));
                                }
                            }),
                            (e.prototype.stopLivePreview = function () {
                                var e;
                                null === (e = this.editor) || void 0 === e || e.stopShadowEdit();
                            }),
                            (e.prototype.delayUpdate = function () {
                                var e,
                                    t = this,
                                    o =
                                        null === (e = this.editor) || void 0 === e
                                            ? void 0
                                            : e.getDocument().defaultView;
                                o &&
                                    (this.timer && o.clearTimeout(this.timer),
                                    (this.timer = o.setTimeout(function () {
                                        var e;
                                        (t.timer = 0),
                                            null === (e = t.updateFormat) ||
                                                void 0 === e ||
                                                e.call(t);
                                    }, this.delayUpdateTime)));
                            }),
                            (e.prototype.updateFormat = function () {
                                var e = this;
                                if (this.editor && this.onFormatChanged) {
                                    var t = (0, n.getFormatState)(this.editor);
                                    (this.formatState &&
                                        !(0, i.getObjectKeys)(t).some(function (o) {
                                            var n;
                                            return (
                                                t[o] !=
                                                (null === (n = e.formatState) || void 0 === n
                                                    ? void 0
                                                    : n[o])
                                            );
                                        })) ||
                                        ((this.formatState = t), this.onFormatChanged(t));
                                }
                            }),
                            e
                        );
                    })();
                t.default = function (e, t) {
                    return new r(e, t);
                };
            },
            5545: (e, t) => {
                var o;
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.KnownRibbonButtonKey = void 0),
                    ((o = t.KnownRibbonButtonKey || (t.KnownRibbonButtonKey = {}))[(o.Bold = 0)] =
                        'Bold'),
                    (o[(o.Italic = 1)] = 'Italic'),
                    (o[(o.Underline = 2)] = 'Underline'),
                    (o[(o.Font = 3)] = 'Font'),
                    (o[(o.FontSize = 4)] = 'FontSize'),
                    (o[(o.IncreaseFontSize = 5)] = 'IncreaseFontSize'),
                    (o[(o.DecreaseFontSize = 6)] = 'DecreaseFontSize'),
                    (o[(o.TextColor = 7)] = 'TextColor'),
                    (o[(o.BackgroundColor = 8)] = 'BackgroundColor'),
                    (o[(o.BulletedList = 9)] = 'BulletedList'),
                    (o[(o.NumberedList = 10)] = 'NumberedList'),
                    (o[(o.DecreaseIndent = 11)] = 'DecreaseIndent'),
                    (o[(o.IncreaseIndent = 12)] = 'IncreaseIndent'),
                    (o[(o.Quote = 13)] = 'Quote'),
                    (o[(o.AlignLeft = 14)] = 'AlignLeft'),
                    (o[(o.AlignCenter = 15)] = 'AlignCenter'),
                    (o[(o.AlignRight = 16)] = 'AlignRight'),
                    (o[(o.InsertLink = 17)] = 'InsertLink'),
                    (o[(o.RemoveLink = 18)] = 'RemoveLink'),
                    (o[(o.InsertTable = 19)] = 'InsertTable'),
                    (o[(o.InsertImage = 20)] = 'InsertImage'),
                    (o[(o.Superscript = 21)] = 'Superscript'),
                    (o[(o.Subscript = 22)] = 'Subscript'),
                    (o[(o.Strikethrough = 23)] = 'Strikethrough'),
                    (o[(o.Heading = 24)] = 'Heading'),
                    (o[(o.Code = 25)] = 'Code'),
                    (o[(o.Ltr = 26)] = 'Ltr'),
                    (o[(o.Rtl = 27)] = 'Rtl'),
                    (o[(o.Undo = 28)] = 'Undo'),
                    (o[(o.Redo = 29)] = 'Redo'),
                    (o[(o.ClearFormat = 30)] = 'ClearFormat'),
                    (o[(o.Header = 31)] = 'Header');
            },
            8266: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(7582),
                    a = o(7363),
                    i = o(6933),
                    r = o(3538),
                    l = o(1905),
                    f = o(3538);
                function s(e, t) {
                    return new l.Editor(e, t);
                }
                t.default = function (e) {
                    var t = a.useRef(null),
                        o = a.useRef(null),
                        l = (0, f.useTheme)(),
                        m = e.focusOnInit,
                        c = e.editorCreator,
                        u = e.zoomScale,
                        d = e.inDarkMode,
                        g = e.plugins;
                    a.useEffect(
                        function () {
                            if (g && t.current) {
                                var e = (0, i.createUIUtilities)(t.current, l);
                                g.forEach(function (t) {
                                    (function (e) {
                                        var t;
                                        return !!(null === (t = e) || void 0 === t
                                            ? void 0
                                            : t.setUIUtilities);
                                    })(t) && t.setUIUtilities(e);
                                });
                            }
                        },
                        [l, c]
                    ),
                        a.useEffect(
                            function () {
                                var n;
                                return (
                                    t.current && (o.current = (c || s)(t.current, e)),
                                    m && (null === (n = o.current) || void 0 === n || n.focus()),
                                    function () {
                                        o.current && (o.current.dispose(), (o.current = null));
                                    }
                                );
                            },
                            [c]
                        ),
                        a.useEffect(
                            function () {
                                var e;
                                null === (e = o.current) || void 0 === e || e.setDarkModeState(!!d);
                            },
                            [d]
                        ),
                        a.useEffect(
                            function () {
                                var e;
                                u &&
                                    (null === (e = o.current) || void 0 === e || e.setZoomScale(u));
                            },
                            [u]
                        );
                    var h = (0, r.getNativeProps)(e, r.divProperties);
                    return a.createElement(
                        'div',
                        (0, n.__assign)({ ref: t, tabIndex: 0 }, h || {})
                    );
                };
            },
            5265: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.createUpdateContentPlugin = t.Rooster = t.UpdateMode = void 0);
                var n = o(1378);
                Object.defineProperty(t, 'UpdateMode', {
                    enumerable: !0,
                    get: function () {
                        return n.UpdateMode;
                    },
                });
                var a = o(8266);
                Object.defineProperty(t, 'Rooster', {
                    enumerable: !0,
                    get: function () {
                        return a.default;
                    },
                });
                var i = o(4764);
                Object.defineProperty(t, 'createUpdateContentPlugin', {
                    enumerable: !0,
                    get: function () {
                        return i.default;
                    },
                });
            },
            4764: (e, t, o) => {
                Object.defineProperty(t, '__esModule', { value: !0 });
                var n = o(1378),
                    a = (function () {
                        function e(e, t) {
                            var o = this;
                            (this.updateMode = e),
                                (this.onUpdate = t),
                                (this.editor = null),
                                (this.disposer = null),
                                (this.onBlur = function () {
                                    o.update(n.UpdateMode.OnBlur);
                                });
                        }
                        return (
                            (e.prototype.getName = function () {
                                return 'UpdateContent';
                            }),
                            (e.prototype.initialize = function (e) {
                                (this.editor = e),
                                    (this.disposer = this.editor.addDomEventHandler(
                                        'blur',
                                        this.onBlur
                                    ));
                            }),
                            (e.prototype.dispose = function () {
                                var e;
                                null === (e = this.disposer) || void 0 === e || e.call(this),
                                    (this.disposer = null),
                                    (this.editor = null);
                            }),
                            (e.prototype.onPluginEvent = function (e) {
                                switch (e.eventType) {
                                    case 11:
                                        this.update(n.UpdateMode.OnInitialize);
                                        break;
                                    case 12:
                                        this.update(n.UpdateMode.OnDispose);
                                        break;
                                    case 7:
                                        this.update(n.UpdateMode.OnContentChangedEvent);
                                        break;
                                    case 3:
                                        this.update(n.UpdateMode.OnUserInput);
                                }
                            }),
                            (e.prototype.forceUpdate = function () {
                                this.update(n.UpdateMode.Force);
                            }),
                            (e.prototype.update = function (e) {
                                if (
                                    this.editor &&
                                    (e == n.UpdateMode.Force ||
                                        ((this.updateMode || 0) & e) == e) &&
                                    this.onUpdate
                                ) {
                                    var t = this.editor.getContent();
                                    this.onUpdate(t, e);
                                }
                            }),
                            e
                        );
                    })();
                t.default = function (e, t) {
                    return new a(e, t);
                };
            },
            1378: (e, t) => {
                var o;
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.UpdateMode = void 0),
                    ((o = t.UpdateMode || (t.UpdateMode = {}))[(o.Force = 0)] = 'Force'),
                    (o[(o.OnInitialize = 1)] = 'OnInitialize'),
                    (o[(o.OnDispose = 2)] = 'OnDispose'),
                    (o[(o.OnUserInput = 4)] = 'OnUserInput'),
                    (o[(o.OnContentChangedEvent = 8)] = 'OnContentChangedEvent'),
                    (o[(o.OnBlur = 16)] = 'OnBlur');
            },
            3538: e => {
                e.exports = FluentUIReact;
            },
            7363: e => {
                e.exports = React;
            },
            1533: e => {
                e.exports = ReactDOM;
            },
            1905: e => {
                e.exports = roosterjsLegacy;
            },
            7582: (e, t, o) => {
                o.r(t),
                    o.d(t, {
                        __assign: () => i,
                        __asyncDelegator: () => w,
                        __asyncGenerator: () => C,
                        __asyncValues: () => S,
                        __await: () => K,
                        __awaiter: () => g,
                        __classPrivateFieldGet: () => N,
                        __classPrivateFieldIn: () => I,
                        __classPrivateFieldSet: () => B,
                        __createBinding: () => j,
                        __decorate: () => l,
                        __esDecorate: () => s,
                        __exportStar: () => p,
                        __extends: () => a,
                        __generator: () => h,
                        __importDefault: () => _,
                        __importStar: () => P,
                        __makeTemplateObject: () => x,
                        __metadata: () => d,
                        __param: () => f,
                        __propKey: () => c,
                        __read: () => y,
                        __rest: () => r,
                        __runInitializers: () => m,
                        __setFunctionName: () => u,
                        __spread: () => D,
                        __spreadArray: () => k,
                        __spreadArrays: () => v,
                        __values: () => b,
                        default: () => T,
                    });
                var n = function (e, t) {
                    return (
                        (n =
                            Object.setPrototypeOf ||
                            ({ __proto__: [] } instanceof Array &&
                                function (e, t) {
                                    e.__proto__ = t;
                                }) ||
                            function (e, t) {
                                for (var o in t)
                                    Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
                            }),
                        n(e, t)
                    );
                };
                function a(e, t) {
                    if ('function' != typeof t && null !== t)
                        throw new TypeError(
                            'Class extends value ' + String(t) + ' is not a constructor or null'
                        );
                    function o() {
                        this.constructor = e;
                    }
                    n(e, t),
                        (e.prototype =
                            null === t ? Object.create(t) : ((o.prototype = t.prototype), new o()));
                }
                var i = function () {
                    return (
                        (i =
                            Object.assign ||
                            function (e) {
                                for (var t, o = 1, n = arguments.length; o < n; o++)
                                    for (var a in (t = arguments[o]))
                                        Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
                                return e;
                            }),
                        i.apply(this, arguments)
                    );
                };
                function r(e, t) {
                    var o = {};
                    for (var n in e)
                        Object.prototype.hasOwnProperty.call(e, n) &&
                            t.indexOf(n) < 0 &&
                            (o[n] = e[n]);
                    if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
                        var a = 0;
                        for (n = Object.getOwnPropertySymbols(e); a < n.length; a++)
                            t.indexOf(n[a]) < 0 &&
                                Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
                                (o[n[a]] = e[n[a]]);
                    }
                    return o;
                }
                function l(e, t, o, n) {
                    var a,
                        i = arguments.length,
                        r =
                            i < 3
                                ? t
                                : null === n
                                ? (n = Object.getOwnPropertyDescriptor(t, o))
                                : n;
                    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
                        r = Reflect.decorate(e, t, o, n);
                    else
                        for (var l = e.length - 1; l >= 0; l--)
                            (a = e[l]) && (r = (i < 3 ? a(r) : i > 3 ? a(t, o, r) : a(t, o)) || r);
                    return i > 3 && r && Object.defineProperty(t, o, r), r;
                }
                function f(e, t) {
                    return function (o, n) {
                        t(o, n, e);
                    };
                }
                function s(e, t, o, n, a, i) {
                    function r(e) {
                        if (void 0 !== e && 'function' != typeof e)
                            throw new TypeError('Function expected');
                        return e;
                    }
                    for (
                        var l,
                            f = n.kind,
                            s = 'getter' === f ? 'get' : 'setter' === f ? 'set' : 'value',
                            m = !t && e ? (n.static ? e : e.prototype) : null,
                            c = t || (m ? Object.getOwnPropertyDescriptor(m, n.name) : {}),
                            u = !1,
                            d = o.length - 1;
                        d >= 0;
                        d--
                    ) {
                        var g = {};
                        for (var h in n) g[h] = 'access' === h ? {} : n[h];
                        for (var h in n.access) g.access[h] = n.access[h];
                        g.addInitializer = function (e) {
                            if (u)
                                throw new TypeError(
                                    'Cannot add initializers after decoration has completed'
                                );
                            i.push(r(e || null));
                        };
                        var j = (0, o[d])('accessor' === f ? { get: c.get, set: c.set } : c[s], g);
                        if ('accessor' === f) {
                            if (void 0 === j) continue;
                            if (null === j || 'object' != typeof j)
                                throw new TypeError('Object expected');
                            (l = r(j.get)) && (c.get = l),
                                (l = r(j.set)) && (c.set = l),
                                (l = r(j.init)) && a.unshift(l);
                        } else (l = r(j)) && ('field' === f ? a.unshift(l) : (c[s] = l));
                    }
                    m && Object.defineProperty(m, n.name, c), (u = !0);
                }
                function m(e, t, o) {
                    for (var n = arguments.length > 2, a = 0; a < t.length; a++)
                        o = n ? t[a].call(e, o) : t[a].call(e);
                    return n ? o : void 0;
                }
                function c(e) {
                    return 'symbol' == typeof e ? e : ''.concat(e);
                }
                function u(e, t, o) {
                    return (
                        'symbol' == typeof t &&
                            (t = t.description ? '['.concat(t.description, ']') : ''),
                        Object.defineProperty(e, 'name', {
                            configurable: !0,
                            value: o ? ''.concat(o, ' ', t) : t,
                        })
                    );
                }
                function d(e, t) {
                    if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
                        return Reflect.metadata(e, t);
                }
                function g(e, t, o, n) {
                    return new (o || (o = Promise))(function (a, i) {
                        function r(e) {
                            try {
                                f(n.next(e));
                            } catch (e) {
                                i(e);
                            }
                        }
                        function l(e) {
                            try {
                                f(n.throw(e));
                            } catch (e) {
                                i(e);
                            }
                        }
                        function f(e) {
                            var t;
                            e.done
                                ? a(e.value)
                                : ((t = e.value),
                                  t instanceof o
                                      ? t
                                      : new o(function (e) {
                                            e(t);
                                        })).then(r, l);
                        }
                        f((n = n.apply(e, t || [])).next());
                    });
                }
                function h(e, t) {
                    var o,
                        n,
                        a,
                        i,
                        r = {
                            label: 0,
                            sent: function () {
                                if (1 & a[0]) throw a[1];
                                return a[1];
                            },
                            trys: [],
                            ops: [],
                        };
                    return (
                        (i = { next: l(0), throw: l(1), return: l(2) }),
                        'function' == typeof Symbol &&
                            (i[Symbol.iterator] = function () {
                                return this;
                            }),
                        i
                    );
                    function l(l) {
                        return function (f) {
                            return (function (l) {
                                if (o) throw new TypeError('Generator is already executing.');
                                for (; i && ((i = 0), l[0] && (r = 0)), r; )
                                    try {
                                        if (
                                            ((o = 1),
                                            n &&
                                                (a =
                                                    2 & l[0]
                                                        ? n.return
                                                        : l[0]
                                                        ? n.throw ||
                                                          ((a = n.return) && a.call(n), 0)
                                                        : n.next) &&
                                                !(a = a.call(n, l[1])).done)
                                        )
                                            return a;
                                        switch (((n = 0), a && (l = [2 & l[0], a.value]), l[0])) {
                                            case 0:
                                            case 1:
                                                a = l;
                                                break;
                                            case 4:
                                                return r.label++, { value: l[1], done: !1 };
                                            case 5:
                                                r.label++, (n = l[1]), (l = [0]);
                                                continue;
                                            case 7:
                                                (l = r.ops.pop()), r.trys.pop();
                                                continue;
                                            default:
                                                if (
                                                    !(
                                                        (a =
                                                            (a = r.trys).length > 0 &&
                                                            a[a.length - 1]) ||
                                                        (6 !== l[0] && 2 !== l[0])
                                                    )
                                                ) {
                                                    r = 0;
                                                    continue;
                                                }
                                                if (
                                                    3 === l[0] &&
                                                    (!a || (l[1] > a[0] && l[1] < a[3]))
                                                ) {
                                                    r.label = l[1];
                                                    break;
                                                }
                                                if (6 === l[0] && r.label < a[1]) {
                                                    (r.label = a[1]), (a = l);
                                                    break;
                                                }
                                                if (a && r.label < a[2]) {
                                                    (r.label = a[2]), r.ops.push(l);
                                                    break;
                                                }
                                                a[2] && r.ops.pop(), r.trys.pop();
                                                continue;
                                        }
                                        l = t.call(e, r);
                                    } catch (e) {
                                        (l = [6, e]), (n = 0);
                                    } finally {
                                        o = a = 0;
                                    }
                                if (5 & l[0]) throw l[1];
                                return { value: l[0] ? l[1] : void 0, done: !0 };
                            })([l, f]);
                        };
                    }
                }
                var j = Object.create
                    ? function (e, t, o, n) {
                          void 0 === n && (n = o);
                          var a = Object.getOwnPropertyDescriptor(t, o);
                          (a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                              (a = {
                                  enumerable: !0,
                                  get: function () {
                                      return t[o];
                                  },
                              }),
                              Object.defineProperty(e, n, a);
                      }
                    : function (e, t, o, n) {
                          void 0 === n && (n = o), (e[n] = t[o]);
                      };
                function p(e, t) {
                    for (var o in e)
                        'default' === o || Object.prototype.hasOwnProperty.call(t, o) || j(t, e, o);
                }
                function b(e) {
                    var t = 'function' == typeof Symbol && Symbol.iterator,
                        o = t && e[t],
                        n = 0;
                    if (o) return o.call(e);
                    if (e && 'number' == typeof e.length)
                        return {
                            next: function () {
                                return (
                                    e && n >= e.length && (e = void 0),
                                    { value: e && e[n++], done: !e }
                                );
                            },
                        };
                    throw new TypeError(
                        t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
                    );
                }
                function y(e, t) {
                    var o = 'function' == typeof Symbol && e[Symbol.iterator];
                    if (!o) return e;
                    var n,
                        a,
                        i = o.call(e),
                        r = [];
                    try {
                        for (; (void 0 === t || t-- > 0) && !(n = i.next()).done; ) r.push(n.value);
                    } catch (e) {
                        a = { error: e };
                    } finally {
                        try {
                            n && !n.done && (o = i.return) && o.call(i);
                        } finally {
                            if (a) throw a.error;
                        }
                    }
                    return r;
                }
                function D() {
                    for (var e = [], t = 0; t < arguments.length; t++)
                        e = e.concat(y(arguments[t]));
                    return e;
                }
                function v() {
                    for (var e = 0, t = 0, o = arguments.length; t < o; t++)
                        e += arguments[t].length;
                    var n = Array(e),
                        a = 0;
                    for (t = 0; t < o; t++)
                        for (var i = arguments[t], r = 0, l = i.length; r < l; r++, a++)
                            n[a] = i[r];
                    return n;
                }
                function k(e, t, o) {
                    if (o || 2 === arguments.length)
                        for (var n, a = 0, i = t.length; a < i; a++)
                            (!n && a in t) ||
                                (n || (n = Array.prototype.slice.call(t, 0, a)), (n[a] = t[a]));
                    return e.concat(n || Array.prototype.slice.call(t));
                }
                function K(e) {
                    return this instanceof K ? ((this.v = e), this) : new K(e);
                }
                function C(e, t, o) {
                    if (!Symbol.asyncIterator)
                        throw new TypeError('Symbol.asyncIterator is not defined.');
                    var n,
                        a = o.apply(e, t || []),
                        i = [];
                    return (
                        (n = {}),
                        r('next'),
                        r('throw'),
                        r('return'),
                        (n[Symbol.asyncIterator] = function () {
                            return this;
                        }),
                        n
                    );
                    function r(e) {
                        a[e] &&
                            (n[e] = function (t) {
                                return new Promise(function (o, n) {
                                    i.push([e, t, o, n]) > 1 || l(e, t);
                                });
                            });
                    }
                    function l(e, t) {
                        try {
                            (o = a[e](t)).value instanceof K
                                ? Promise.resolve(o.value.v).then(f, s)
                                : m(i[0][2], o);
                        } catch (e) {
                            m(i[0][3], e);
                        }
                        var o;
                    }
                    function f(e) {
                        l('next', e);
                    }
                    function s(e) {
                        l('throw', e);
                    }
                    function m(e, t) {
                        e(t), i.shift(), i.length && l(i[0][0], i[0][1]);
                    }
                }
                function w(e) {
                    var t, o;
                    return (
                        (t = {}),
                        n('next'),
                        n('throw', function (e) {
                            throw e;
                        }),
                        n('return'),
                        (t[Symbol.iterator] = function () {
                            return this;
                        }),
                        t
                    );
                    function n(n, a) {
                        t[n] = e[n]
                            ? function (t) {
                                  return (o = !o) ? { value: K(e[n](t)), done: !1 } : a ? a(t) : t;
                              }
                            : a;
                    }
                }
                function S(e) {
                    if (!Symbol.asyncIterator)
                        throw new TypeError('Symbol.asyncIterator is not defined.');
                    var t,
                        o = e[Symbol.asyncIterator];
                    return o
                        ? o.call(e)
                        : ((e = b(e)),
                          (t = {}),
                          n('next'),
                          n('throw'),
                          n('return'),
                          (t[Symbol.asyncIterator] = function () {
                              return this;
                          }),
                          t);
                    function n(o) {
                        t[o] =
                            e[o] &&
                            function (t) {
                                return new Promise(function (n, a) {
                                    !(function (e, t, o, n) {
                                        Promise.resolve(n).then(function (t) {
                                            e({ value: t, done: o });
                                        }, t);
                                    })(n, a, (t = e[o](t)).done, t.value);
                                });
                            };
                    }
                }
                function x(e, t) {
                    return (
                        Object.defineProperty
                            ? Object.defineProperty(e, 'raw', { value: t })
                            : (e.raw = t),
                        e
                    );
                }
                var M = Object.create
                    ? function (e, t) {
                          Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                      }
                    : function (e, t) {
                          e.default = t;
                      };
                function P(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e)
                        for (var o in e)
                            'default' !== o &&
                                Object.prototype.hasOwnProperty.call(e, o) &&
                                j(t, e, o);
                    return M(t, e), t;
                }
                function _(e) {
                    return e && e.__esModule ? e : { default: e };
                }
                function N(e, t, o, n) {
                    if ('a' === o && !n)
                        throw new TypeError('Private accessor was defined without a getter');
                    if ('function' == typeof t ? e !== t || !n : !t.has(e))
                        throw new TypeError(
                            'Cannot read private member from an object whose class did not declare it'
                        );
                    return 'm' === o ? n : 'a' === o ? n.call(e) : n ? n.value : t.get(e);
                }
                function B(e, t, o, n, a) {
                    if ('m' === n) throw new TypeError('Private method is not writable');
                    if ('a' === n && !a)
                        throw new TypeError('Private accessor was defined without a setter');
                    if ('function' == typeof t ? e !== t || !a : !t.has(e))
                        throw new TypeError(
                            'Cannot write private member to an object whose class did not declare it'
                        );
                    return 'a' === n ? a.call(e, o) : a ? (a.value = o) : t.set(e, o), o;
                }
                function I(e, t) {
                    if (null === t || ('object' != typeof t && 'function' != typeof t))
                        throw new TypeError("Cannot use 'in' operator on non-object");
                    return 'function' == typeof e ? t === e : e.has(t);
                }
                const T = {
                    __extends: a,
                    __assign: i,
                    __rest: r,
                    __decorate: l,
                    __param: f,
                    __metadata: d,
                    __awaiter: g,
                    __generator: h,
                    __createBinding: j,
                    __exportStar: p,
                    __values: b,
                    __read: y,
                    __spread: D,
                    __spreadArrays: v,
                    __spreadArray: k,
                    __await: K,
                    __asyncGenerator: C,
                    __asyncDelegator: w,
                    __asyncValues: S,
                    __makeTemplateObject: x,
                    __importStar: P,
                    __importDefault: _,
                    __classPrivateFieldGet: N,
                    __classPrivateFieldSet: B,
                    __classPrivateFieldIn: I,
                };
            },
        },
        t = {};
    function o(n) {
        var a = t[n];
        if (void 0 !== a) return a.exports;
        var i = (t[n] = { exports: {} });
        return e[n](i, i.exports, o), i.exports;
    }
    (o.d = (e, t) => {
        for (var n in t)
            o.o(t, n) && !o.o(e, n) && Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
        (o.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
        (o.r = e => {
            'undefined' != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
                Object.defineProperty(e, '__esModule', { value: !0 });
        });
    var n = o(9245);
    roosterjsReact = n;
})();
//# sourceMappingURL=rooster-react-min.js.map
