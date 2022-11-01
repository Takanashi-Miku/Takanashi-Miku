var adaptive = {};
(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    // 璁惧鍍忕礌姣�
    var devicePixelRatio = win.devicePixelRatio;
    // 鎴戜滑璁剧疆鐨勫竷灞€瑙嗗彛涓庣悊鎯宠鍙ｇ殑鍍忕礌姣�
    var dpr = 1; 
    // viewport缂╂斁鍊�
    var scale = 1; 
    // 璁剧疆viewport
    function setViewport() {
        // 鍒ゆ柇IOS
        var isIPhone = /iphone/gi.test(win.navigator.appVersion);
        if (lib.scaleType === 2 && isIPhone || lib.scaleType === 3) {
            dpr = devicePixelRatio;
        }
        // window瀵硅薄涓婂鍔犱竴涓睘鎬э紝鎻愪緵瀵瑰鐨勫竷灞€瑙嗗彛涓庣悊鎯宠鍙ｇ殑鍊�
        win.devicePixelRatioValue = dpr;
        // viewport缂╂斁鍊硷紝甯冨眬瑙嗗彛缂╂斁鍚庡垰濂芥樉绀烘垚鐞嗘兂瑙嗗彛鐨勫搴︼紝椤甸潰灏变笉浼氳繃闀挎垨杩囩煭浜�
        scale = 1 / dpr;
        // 鑾峰彇宸叉湁鐨剉iewport
        var hasMetaEl = doc.querySelector('meta[name="viewport"]');
        var metaStr = 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no';
        if (dpr === 1) {
            metaStr = 'width=device-width, '.concat(metaStr);
        }
        if (!isIPhone && dpr !== 1) {
            metaStr = metaStr.concat(', target-densitydpi=device-dpi');
        }
        // 濡傛灉鏈夛紝鏀瑰彉涔�
        if (hasMetaEl) {
            hasMetaEl.setAttribute('content', metaStr);
        }
        // 濡傛灉娌℃湁锛屾坊鍔犱箣
        else {
            var metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            metaEl.setAttribute('content', metaStr);
            
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            }
            else {
                var containDiv = doc.createElement('div');
                containDiv.appendChild(metaEl);
                docEl.appendChild(containDiv);
            }
        }
    }
    
    var newBase = 100;
    lib.errDpr = 1;

    function setRem() {
        // 甯冨眬瑙嗗彛
        // var layoutView = docEl.clientWidth; 涔熷彲浠� 鑾峰彇甯冨眬瑙嗗彛鐨勫搴�
        var layoutView;
        if (lib.maxWidth) {
            layoutView = Math.min(docEl.getBoundingClientRect().width, lib.maxWidth * dpr);
        }
        else {
            layoutView = docEl.getBoundingClientRect().width;
        }
        // 涓轰簡璁＄畻鏂逛究锛屾垜浠瀹� 1rem === 100px璁捐鍥惧儚绱狅紝鎴戜滑鍒囧浘鐨勬椂鍊欏氨鑳藉揩閫熻浆鎹�
        // 鏈変汉闂紝涓轰粈涔堜笉璁�1rem === 1px璁捐鍍忕礌鍛紵
        // 璁捐鍥句竴鑸槸640鎴栬€�750px
        // 甯冨眬瑙嗗彛涓€鑸槸320鍒�1440
        // 璁＄畻涓€涓€硷紝浣縧ayout鐨勬€诲搴︿负 (desinWidth/100) rem
        // 閭ｄ箞鏈夎绠楀叕寮忥細layoutView / newBase = desinWidth / 100
        // newBase = 100 * layoutView / desinWidth
        // newBase = 浠嬩簬50鍒�200涔嬮棿
        // 濡傛灉 1rem === 1px 璁捐鍍忕礌锛宯ewBase灏变粙浜�0.5鍒�2涔嬮棿锛岀敱浜庡緢澶氭祻瑙堝櫒鏈夋渶灏�12px闄愬埗锛岃繖涓椂鍊欏氨涓嶈兘鑷€傚簲浜�
        newBase = 100 * layoutView / lib.desinWidth * (lib.errDpr || 1);
        docEl.style.fontSize = newBase + 'px';
        // rem鍩哄噯鍊兼敼鍙樺悗锛屾墜鍔╮eflow涓€涓嬶紝閬垮厤鏃嬭浆鎵嬫満鍚庨〉闈㈣嚜閫傚簲闂
        doc.body&&(doc.body.style.fontSize = lib.baseFont / 100 + 'rem');
        // 閲嶆柊璁剧疆rem鍚庣殑鍥炶皟鏂规硶
        lib.setRemCallback&&lib.setRemCallback();
        lib.newBase = newBase;
    }
    var tid;
    lib.desinWidth = 750;
    lib.baseFont = 28;
    // 灞€閮ㄥ埛鏂扮殑鏃跺€欓儴鍒哻hrome鐗堟湰瀛椾綋杩囧ぇ鐨勯棶棰�
    lib.reflow = function() {
        docEl.clientWidth;
    };
    // 妫€鏌ュ畨鍗撲笅rem鍊兼槸鍚︽樉绀烘纭�
    function checkRem() {
        if (/android/ig.test(window.navigator.appVersion)) {
            var hideDiv = document.createElement('p');
            hideDiv.style.height = '1px';
            hideDiv.style.width = '2.5rem';
            hideDiv.style.visibility = 'hidden';
            document.body.appendChild(hideDiv);
            var now = hideDiv.offsetWidth;
            var right = window.adaptive.newBase * 2.5; 
            if (Math.abs(right / now - 1) > 0.05) {
                lib.errDpr = right / now;
                setRem();
            }
            document.body.removeChild(hideDiv);
        }
    }
    lib.init = function () {
        // resize鐨勬椂鍊欓噸鏂拌缃畆em鍩哄噯鍊�
        // 瑙﹀彂orientationchange 浜嬩欢鏃朵篃浼氳Е鍙憆esize锛屾晠涓嶉渶瑕佸啀娣诲姞姝や簨浠朵簡
        win.addEventListener('resize', function () {
            clearTimeout(tid);
            tid = setTimeout(setRem, 300);
        }, false);
        // 娴忚鍣ㄧ紦瀛樹腑璇诲彇鏃朵篃闇€瑕侀噸鏂拌缃畆em鍩哄噯鍊�
        win.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(setRem, 300);
            }
        }, false);
        // 璁剧疆body涓婄殑瀛椾綋澶у皬
        if (doc.readyState === 'complete') {
            doc.body.style.fontSize = lib.baseFont / 100 + 'rem';
            checkRem();
        }
        else {
            doc.addEventListener('DOMContentLoaded', function (e) {
                doc.body.style.fontSize = lib.baseFont / 100 + 'rem';
                checkRem();
            }, false);
        }
        setViewport();
        // 璁剧疆rem鍊�
        setRem();
        // html鑺傜偣璁剧疆甯冨眬瑙嗗彛涓庣悊鎯宠鍙ｇ殑鍍忕礌姣�
        docEl.setAttribute('data-dpr', dpr);
    };
    // 鏈変簺html鍏冪礌鍙兘浠x涓哄崟浣嶏紝鎵€浠ラ渶瑕佹彁渚涗竴涓帴鍙ｏ紝鎶妑em鍗曚綅鎹㈢畻鎴恜x
    lib.remToPx = function (remValue) {
        return remValue * newBase;
    };
})(window, adaptive);
if (typeof module != 'undefined' && module.exports) {
    module.exports = adaptive;
} else if (typeof define == 'function' && define.amd) {
    define(function() {
        return adaptive;
    });
} else {
    window.adaptive = adaptive;
}