import { FontButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model';
import { setFontName } from 'roosterjs-content-model';

interface FontName {
    name: string;
    family: string;
    localizedName?: string;
}
const FontNames: FontName[] = [
    { name: 'Arial', family: 'Arial,Helvetica,sans-serif' },
    { name: 'Arial Black', family: "'Arial Black',Arial,sans-serif" },
    { name: 'Calibri', family: 'Calibri,Helvetica,sans-serif' },
    { name: 'Calibri Light', family: "'Calibri Light','Helvetica Light',sans-serif" },
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
        family: "'Franklin Gothic Demi','Avenir Next Condensed Demi Bold',sans-serif",
    },
    {
        name: 'Franklin Gothic Medium',
        family: "'Franklin Gothic Medium','Avenir Next Condensed Medium',sans-serif",
    },
    { name: 'Garamond', family: 'Garamond,Georgia,serif' },
    { name: 'Georgia', family: 'Georgia,serif' },
    { name: 'Impact', family: 'Impact,Charcoal,sans-serif' },
    { name: 'Lucida Console', family: "'Lucida Console',Monaco,monospace" },
    { name: 'Lucida Handwriting', family: "'Lucida Handwriting','Apple Chancery',cursive" },
    { name: 'Lucida Sans Unicode', family: "'Lucida Sans Unicode','Lucida Grande',sans-serif" },
    { name: 'Palatino Linotype', family: "'Palatino Linotype','Book Antiqua',Palatino,serif" },
    {
        name: 'Segoe UI',
        family: "'Segoe UI', 'Segoe UI Web (West European)', 'Helvetica Neue', sans-serif",
    },
    { name: 'Sitka Heading', family: "'Sitka Heading',Cochin,serif" },
    { name: 'Sitka Text', family: "'Sitka Text',Cochin,serif" },
    { name: 'Tahoma', family: 'Tahoma,Geneva,sans-serif' },
    { name: 'Times', family: "Times,'Times New Roman',serif" },
    { name: 'Times New Roman', family: "'Times New Roman',Times,serif" },
    { name: 'Trebuchet MS', family: "'Trebuchet MS',Trebuchet,sans-serif" },
    { name: 'TW Cen MT', family: "'TW Cen MT','Century Gothic',sans-serif" },
    { name: 'Verdana', family: 'Verdana,Geneva,sans-serif' },
    { name: '-', family: 'FontDivider0' }, //divider between fonts for different scripts (order is by style)
    {
        name: 'Microsoft YaHei',
        family: "'Microsoft YaHei','微软雅黑',STHeiti,sans-serif",
        localizedName: '微软雅黑',
    }, //chineseS Microsoft recommended font
    { name: 'SimHei', family: "SimHei,'黑体',STHeiti,sans-serif", localizedName: '黑体' }, //chineseS
    {
        name: 'NSimSun',
        family: "NSimSun,'新宋体',SimSun,'宋体',SimSun-ExtB,'宋体-ExtB',STSong,serif",
        localizedName: '新宋体',
    }, //chineseS
    { name: 'FangSong', family: "FangSong,'仿宋',STFangsong,serif", localizedName: '仿宋' }, //chineseS
    { name: 'SimLi', family: "SimLi,'隶书','Baoli SC',serif", localizedName: '隶书' }, //chineseS
    { name: 'KaiTi', family: "KaiTi,'楷体',STKaiti,serif", localizedName: '楷体' }, //chineseS
    { name: '-', family: 'FontDivider1' }, //divider between fonts for different scripts (order is by style)
    {
        name: 'Microsoft JhengHei',
        family: "'Microsoft JhengHei','微軟正黑體','Apple LiGothic',sans-serif",
        localizedName: '微軟正黑體',
    }, //chineseT Microsoft recommended font
    {
        name: 'PMingLiU',
        family: "PMingLiU,'新細明體',PMingLiU-ExtB,'新細明體-ExtB','Apple LiSung',serif",
        localizedName: '新細明體',
    }, //chineseT
    { name: 'DFKai-SB', family: "DFKai-SB,'標楷體','BiauKai',serif", localizedName: '標楷體' }, //chineseT
    { name: '-', family: 'FontDivider2' }, //divider between fonts for different scripts (order is alphabetical by foundry)
    {
        name: 'Meiryo',
        family: "Meiryo,'メイリオ','Hiragino Sans',sans-serif",
        localizedName: 'メイリオ',
    }, //japanese
    {
        name: 'MS PGothic',
        family:
            "'MS PGothic','ＭＳ Ｐゴシック','MS Gothic','ＭＳ ゴシック','Hiragino Kaku Gothic ProN',sans-serif",
        localizedName: 'ＭＳ Ｐゴシック',
    }, //japanese
    {
        name: 'MS PMincho',
        family: "'MS PMincho','ＭＳ Ｐ明朝','MS Mincho','ＭＳ 明朝','Hiragino Mincho ProN',serif",
        localizedName: 'ＭＳ Ｐ明朝',
    }, //japanese
    {
        name: 'Yu Gothic',
        family: "'Yu Gothic','游ゴシック','YuGothic',sans-serif",
        localizedName: '游ゴシック',
    }, //japanese
    { name: 'Yu Mincho', family: "'Yu Mincho','游明朝','YuMincho',serif", localizedName: '游明朝' }, //japanese
    { name: '-', family: 'FontDivider3' }, //divider between fonts for different scripts (order is for legacy reasons)
    {
        name: 'Malgun Gothic',
        family: "'Malgun Gothic','맑은 고딕',AppleGothic,sans-serif",
        localizedName: '맑은 고딕',
    }, //korean Microsoft recommended font
    { name: 'Gulim', family: "Gulim,'굴림','Nanum Gothic',sans-serif", localizedName: '굴림' }, //korean
    { name: 'Dotum', family: "Dotum,'돋움',AppleGothic,sans-serif", localizedName: '돋움' }, //korean
    { name: 'Batang', family: "Batang,'바탕',AppleMyungjo,serif", localizedName: '바탕' }, //korean
    { name: 'BatangChe', family: "BatangChe,'바탕체',AppleMyungjo,serif", localizedName: '바탕체' }, //korean
    { name: 'Gungsuh', family: "Gungsuh,'궁서',GungSeo,serif", localizedName: '궁서' }, //korean
    { name: '-', family: 'FontDivider4' }, //divider between fonts for different scripts (order is alphabetical)
    { name: 'Leelawadee UI', family: "'Leelawadee UI',Thonburi,sans-serif" }, //thai Microsoft recommended font
    { name: 'Angsana New', family: "'Angsana New','Leelawadee UI',Sathu,serif" }, //thai
    { name: 'Cordia New', family: "'Cordia New','Leelawadee UI',Silom,sans-serif" }, //thai
    { name: 'DaunPenh', family: "DaunPenh,'Leelawadee UI','Khmer MN',sans-serif" }, //khmer
    { name: '-', family: 'FontDivider5' }, //divider between fonts for different scripts (order is alphabetical)
    { name: 'Nirmala UI', family: "'Nirmala UI',sans-serif" }, //indic Microsoft recommended font
    { name: 'Gautami', family: "Gautami,'Nirmala UI','Telugu MN',sans-serif" }, //indic
    { name: 'Iskoola Pota', family: "'Iskoola Pota','Nirmala UI','Sinhala MN',sans-serif" }, //indic
    { name: 'Kalinga', family: "Kalinga,'Nirmala UI','Oriya MN',sans-serif" }, //indic
    { name: 'Kartika', family: "Kartika,'Nirmala UI','Malayalam MN',sans-serif" }, //indic
    { name: 'Latha', family: "Latha,'Nirmala UI','Tamil MN',sans-serif" }, //indic
    { name: 'Mangal', family: "Mangal,'Nirmala UI','Devanagari Sangam MN',sans-serif" }, //indic
    { name: 'Raavi', family: "Raavi,'Nirmala UI','Gurmukhi MN',sans-serif" }, //indic
    { name: 'Shruti', family: "Shruti,'Nirmala UI','Gujarati Sangam MN',sans-serif" }, //indic
    { name: 'Tunga', family: "Tunga,'Nirmala UI','Kannada MN',sans-serif" }, //indic
    { name: 'Vrinda', family: "Vrinda,'Nirmala UI','Bangla MN',sans-serif" }, //indic
    { name: '-', family: 'FontDivider6' }, //divider between fonts for different scripts
    { name: 'Nyala', family: 'Nyala,Kefa,sans-serif' }, //other-ethiopic
    { name: 'Sylfaen', family: 'Sylfaen,Mshtakan,Menlo,serif' }, //other-armenian-georgian
];

const DropDownItems = FontNames.reduce((items, font) => {
    items[font.family] = font.localizedName || font.name;
    return items;
}, <Record<string, string>>{});

const LowerCaseFontMap = FontNames.reduce((items, font) => {
    items[font.name.toLowerCase()] = font.family;
    return items;
}, <Record<string, string>>{});

const FirstFontRegex = /^['"]?([^'",]+)/i;

/**
 * @internal
 * "Font" button on the format ribbon
 */
export const fontButton: RibbonButton<FontButtonStringKey> = {
    key: 'buttonNameFont',
    unlocalizedText: 'Font',
    iconName: 'Font',
    dropDownMenu: {
        items: DropDownItems,
        getSelectedItemKey: formatState => {
            const matches = formatState.fontName?.match(FirstFontRegex);
            const firstName = matches?.[1]?.toLowerCase();
            const selectedKey = (firstName && LowerCaseFontMap[firstName]) || '';

            return selectedKey;
        },
        allowLivePreview: true,
    },
    onClick: (editor, font) => {
        if (isContentModelEditor(editor)) {
            setFontName(editor, font);
        }
    },
};
