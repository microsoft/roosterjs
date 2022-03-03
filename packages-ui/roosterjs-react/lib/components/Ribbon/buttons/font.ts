import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { setFontName } from 'roosterjs-editor-api';

const FontName = {
    'Arial,Helvetica,sans-serif': 'Arial',
    "'Arial Black',Arial,sans-serif": 'Arial Black',
    'Calibri,Helvetica,sans-serif': 'Calibri',
    "'Calibri Light','Helvetica Light',sans-serif": 'Calibri Light',
    'Cambria,Georgia,serif': 'Cambria',
    'Candara,Optima,sans-serif': 'Candara',
    "'Century Gothic',sans-serif": 'Century Gothic',
    "'Comic Sans MS',Chalkboard,cursive": 'Comic Sans MS',
    'Consolas,Courier,monospace': 'Consolas',
    "Constantia,'Hoefler Text',serif": 'Constantia',
    'Corbel,Skia,sans-serif': 'Corbel',
    "'Courier New',monospace": 'Courier New',
    "'Franklin Gothic Book','Avenir Next Condensed',sans-serif": 'Franklin Gothic Book',
    "'Franklin Gothic Demi','Avenir Next Condensed Demi Bold',sans-serif": 'Franklin Gothic Demi',
    "'Franklin Gothic Medium','Avenir Next Condensed Medium',sans-serif": 'Franklin Gothic Medium',
    'Garamond,Georgia,serif': 'Garamond',
    'Georgia,serif': 'Georgia',
    'Impact,Charcoal,sans-serif': 'Impact',
    "'Lucida Console',Monaco,monospace": 'Lucida Console',
    "'Lucida Handwriting','Apple Chancery',cursive": 'Lucida Handwriting',
    "'Lucida Sans Unicode','Lucida Grande',sans-serif": 'Lucida Sans Unicode',
    "'Palatino Linotype','Book Antiqua',Palatino,serif": 'Palatino Linotype',
    "'Segoe UI', 'Segoe UI Web (West European)', 'Helvetica Neue', sans-serif": 'Segoe UI',
    "'Sitka Heading',Cochin,serif": 'Sitka Heading',
    "'Sitka Text',Cochin,serif": 'Sitka Text',
    'Tahoma,Geneva,sans-serif': 'Tahoma',
    "Times,'Times New Roman',serif": 'Times',
    "'Times New Roman',Times,serif": 'Times New Roman',
    "'Trebuchet MS',Trebuchet,sans-serif": 'Trebuchet MS',
    "'TW Cen MT','Century Gothic',sans-serif": 'TW Cen MT',
    'Verdana,Geneva,sans-serif': 'Verdana',
    Divider0: '-', //divider between fonts for different scripts (order is by style)
    "'Microsoft YaHei','微软雅黑',STHeiti,sans-serif": '微软雅黑',
    "SimHei,'黑体',STHeiti,sans-serif": '黑体',
    "NSimSun,'新宋体',SimSun,'宋体',SimSun-ExtB,'宋体-ExtB',STSong,serif": '新宋体',
    "FangSong,'仿宋',STFangsong,serif": '仿宋',
    "SimLi,'隶书','Baoli SC',serif": '隶书',
    "KaiTi,'楷体',STKaiti,serif": '楷体',
    Divider1: '-', //divider between fonts for different scripts (order is by style)
    "'Microsoft JhengHei','微軟正黑體','Apple LiGothic',sans-serif": '微軟正黑體',
    "PMingLiU,'新細明體',PMingLiU-ExtB,'新細明體-ExtB','Apple LiSung',serif": '新細明體',
    "DFKai-SB,'標楷體','BiauKai',serif": '標楷體',
    Divider2: '-', //divider between fonts for different scripts (order is alphabetical by foundry)
    "Meiryo,'メイリオ','Hiragino Sans',sans-serif": 'メイリオ',
    "'MS PGothic','ＭＳ Ｐゴシック','MS Gothic','ＭＳ ゴシック','Hiragino Kaku Gothic ProN',sans-serif":
        'ＭＳ Ｐゴシック',
    "'MS PMincho','ＭＳ Ｐ明朝','MS Mincho','ＭＳ 明朝','Hiragino Mincho ProN',serif":
        'ＭＳ Ｐ明朝',
    "'Yu Gothic','游ゴシック','YuGothic',sans-serif": '游ゴシック',
    "'Yu Mincho','游明朝','YuMincho',serif": '游明朝',
    'Divider3-': '-', //divider between fonts for different scripts (order is for legacy reasons)
    "'Malgun Gothic','맑은 고딕',AppleGothic,sans-serif": '맑은 고딕',
    "Gulim,'굴림','Nanum Gothic',sans-serif": '굴림',
    "Dotum,'돋움',AppleGothic,sans-serif": '돋움',
    "Batang,'바탕',AppleMyungjo,serif": '바탕',
    "BatangChe,'바탕체',AppleMyungjo,serif": '바탕체',
    "Gungsuh,'궁서',GungSeo,serif": '궁서',
    Divider4: '-', //divider between fonts for different scripts (order is alphabetical)
    "'Leelawadee UI',Thonburi,sans-serif": 'Leelawadee UI', //thai Microsoft recommended font
    "'Angsana New','Leelawadee UI',Sathu,serif": 'Angsana New', //thai
    "'Cordia New','Leelawadee UI',Silom,sans-serif": 'Cordia New', //thai
    "DaunPenh,'Leelawadee UI','Khmer MN',sans-serif": 'DaunPenh', //khmer
    Divider5: '-', //divider between fonts for different scripts (order is alphabetical)
    "'Nirmala UI',sans-serif": 'Nirmala UI', //indic Microsoft recommended font
    "Gautami,'Nirmala UI','Telugu MN',sans-serif": 'Gautami', //indic
    "'Iskoola Pota','Nirmala UI','Sinhala MN',sans-serif": 'Iskoola Pota', //indic
    "Kalinga,'Nirmala UI','Oriya MN',sans-serif": 'Kalinga', //indic
    "Kartika,'Nirmala UI','Malayalam MN',sans-serif": 'Kartika', //indic
    "Latha,'Nirmala UI','Tamil MN',sans-serif": 'Latha', //indic
    "Mangal,'Nirmala UI','Devanagari Sangam MN',sans-serif": 'Mangal', //indic
    "Raavi,'Nirmala UI','Gurmukhi MN',sans-serif": 'Raavi', //indic
    "Shruti,'Nirmala UI','Gujarati Sangam MN',sans-serif": 'Shruti', //indic
    "Tunga,'Nirmala UI','Kannada MN',sans-serif": 'Tunga', //indic
    "Vrinda,'Nirmala UI','Bangla MN',sans-serif": 'Vrinda', //indic
    Divider6: '-', //divider between fonts for different scripts
    'Nyala,Kefa,sans-serif': 'Nyala', //other-ethiopic
    'Sylfaen,Mshtakan,Menlo,serif': 'Sylfaen', //other-armenian-georgian
};

/**
 * "Font" button on the format ribbon
 */
export const font: RibbonButton = {
    key: 'font',
    unlocalizedText: 'Font',
    iconName: 'Font',
    dropDownItems: FontName,
    onClick: (editor, font) => {
        setFontName(editor, font);
    },
    allowLivePreview: true,
};
