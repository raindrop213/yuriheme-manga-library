let num_pages = -1;
let pc = document.getElementById('pagesContainer');
let r = document.querySelector(':root');
let pz;
let showAboutOnStart = false;

// 添加返回按钮
let backButton = document.createElement('button');
backButton.id = 'backButton';
backButton.innerHTML = '×';
document.body.appendChild(backButton);
backButton.addEventListener('click', function() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/'; // 跳转到上一层级
    }
});

let storageKey = "mokuro_" + window.location.pathname;

let defaultState = {
    page_idx: 0,
    page2_idx: -1,
    hasCover: true,
    r2l: false,
    singlePageView: false,
    ctrlToPan: false,
    textBoxBorders: false,
    editableText: false,
    displayOCR: true,
    fontSize: "auto",
    eInkMode: false,
    defaultZoomMode: "fit to screen",
    toggleOCRTextBoxes: false,
    backgroundColor: '#C4C3D0',
};

let state = JSON.parse(JSON.stringify(defaultState));

function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
    let newState = localStorage.getItem(storageKey)

    if (newState !== null) {
        state = JSON.parse(newState);
    }

    updateUI();
    updateProperties();
}

function updateUI() {
    document.getElementById("menuR2l").checked = state.r2l;
    document.getElementById("menuCtrlToPan").checked = state.ctrlToPan;
    document.getElementById("menuDoublePageView").checked = !state.singlePageView;
    document.getElementById("menuHasCover").checked = state.hasCover;
    document.getElementById("menuTextBoxBorders").checked = state.textBoxBorders;
    document.getElementById("menuEditableText").checked = state.editableText;
    document.getElementById("menuDisplayOCR").checked = state.displayOCR;
    document.getElementById('menuFontSize').value = state.fontSize;
    document.getElementById('menuEInkMode').checked = state.eInkMode;
    document.getElementById('menuDefaultZoom').value = state.defaultZoomMode;
    document.getElementById('menuToggleOCRTextBoxes').checked = state.toggleOCRTextBoxes;
    document.getElementById('menuBackgroundColor').value = state.backgroundColor;
}

document.addEventListener('DOMContentLoaded', function () {
    loadState();
    num_pages = document.getElementsByClassName("page").length;

    pz = panzoom(pc, {
        bounds: true,
        boundsPadding: 0.05,
        maxZoom: 10,
        minZoom: 0.1,
        zoomDoubleClickSpeed: 1,
        enableTextSelection: true,

        beforeMouseDown: function (e) {
            // 检查事件是否发生在<div id="analysisModal">内
            if (e.target.closest('#analysisModal') !== null) {
                // 在这个元素内部禁用panzoom的鼠标按下事件
                return true;
            }
            let shouldIgnore = disablePanzoomOnElement(e.target) ||
                (e.target.closest('.textBox') !== null) ||
                (state.ctrlToPan && !e.ctrlKey);
            return shouldIgnore;
        },

        beforeWheel: function (e) {
            if (e.target.closest('#analysisModal') !== null) {
                // 在<div id="analysisModal">内部禁用滚轮事件
                return true;
            }
            let shouldIgnore = disablePanzoomOnElement(e.target);
            return shouldIgnore;
        },
        

        onTouch: function (e) {
            if (e.target.closest('#analysisModal') !== null) {
                // 在这个元素内部也禁用触摸事件
                e.stopPropagation();
                return false;
            }
            if (disablePanzoomOnElement(e.target)) {
                e.stopPropagation();
                return false;
            }

            if (e.touches.length > 1) {
                return true;
            } else {
                return false;
            }
        }

    });

    updatePage(state.page_idx);
    initTextBoxes();

    if (showAboutOnStart) {
        document.getElementById('popupAbout').style.display = 'block';
        document.getElementById('dimOverlay').style.display = 'initial';
        pz.pause();
    }

    recordReadingStatus()

}, false);

// 记录阅读状态
function recordReadingStatus() {
    const currentPath = window.location.pathname;
    
    // 格式化时间
    const now = new Date();
    const weekDayJP = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];
    const formattedDate = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日(${weekDayJP}) ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // 处理标题
    const titleMatch = currentPath.match(/([^\/]+)\.html$/);
    let title = titleMatch ? decodeURIComponent(titleMatch[1]) : "？？？";
    title = title.replace(/\[[^\]]+\]\s*/g, ''); // 去掉方括号中的作者名
    
    // 存储处理好的数据
    localStorage.setItem('lastReadPath', currentPath);
    localStorage.setItem('lastReadTime', formattedDate);
    localStorage.setItem('lastReadTitle', title);
  }

function disablePanzoomOnElement(element) {
    return document.getElementById('topMenu').contains(element);
}


// function fetchAndPlayAudio(text) {
//     // 假设的函数，用于根据文本调用API获取音频并播放
//     // 注意：实际实现时需要考虑跨域请求问题(CORS)和音频播放的具体实现方式
//     const url = `http://192.168.1.3:23456/voice/vits?text=${encodeURIComponent(text)}&id=0&format=wav&lang=ja&max=200`;
//     fetch(url)
//         .then(response => response.blob())
//         .then(blob => {
//             const audioUrl = URL.createObjectURL(blob);
//             const audio = new Audio(audioUrl);
//             audio.play();
//         })
//         .catch(error => console.error('Error fetching or playing audio:', error));
// }

function copyToClipboard(text) {
    // 创建一个隐藏的input元素
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    let success = false;

    try {
        // 尝试复制文本
        success = document.execCommand('copy');
    } catch (err) {
        console.error('复制失败', err);
    }

    document.body.removeChild(input);
    return success;
}


function initTextBoxes() {
    let textBoxes = document.querySelectorAll('.textBox');
    for (let i = 0; i < textBoxes.length; i++) {
        textBoxes[i].addEventListener('click', function (e) {
            if (state.toggleOCRTextBoxes) {
                this.classList.add('hovered');
                for (let j = 0; j < textBoxes.length; j++) {
                    if (i !== j) {
                        textBoxes[j].classList.remove('hovered');
                    }
                }
            }
            let textWithoutNewLines = this.innerText;
            // 这里调用修改后的复制函数和音频播放函数
            copyToClipboard(textWithoutNewLines);
            // fetchAndPlayAudio(textWithoutNewLines); // 添加的代码行，用于播放文本对应的音频
        });
    }
    document.addEventListener('click', function (e) {
        if (state.toggleOCRTextBoxes) {
            if (e.target.closest('.textBox') === null) {
                let textBoxes = document.querySelectorAll('.textBox');
                for (let i = 0; i < textBoxes.length; i++) {
                    textBoxes[i].classList.remove('hovered');
                }
            }
        }
    });
}

function updateProperties() {
    if (state.textBoxBorders) {
        r.style.setProperty('--textBoxBorderHoverColor', 'rgba(237, 28, 36, 0.3)');
    } else {
        r.style.setProperty('--textBoxBorderHoverColor', 'rgba(0, 0, 0, 0)');
    }

    pc.contentEditable = state.editableText;

    if (state.displayOCR) {
        r.style.setProperty('--textBoxDisplay', 'initial');
    } else {
        r.style.setProperty('--textBoxDisplay', 'none');
    }


    if (state.fontSize === 'auto') {
        pc.classList.remove('textBoxFontSizeOverride');
    } else {
        r.style.setProperty('--textBoxFontSize', state.fontSize + 'pt');
        pc.classList.add('textBoxFontSizeOverride');
    }

    if (state.eInkMode) {
        document.getElementById('topMenu').classList.add("notransition");
    } else {
        document.getElementById('topMenu').classList.remove("notransition");
    }

    if (state.backgroundColor) {
        r.style.setProperty('--colorBackground', state.backgroundColor)
    }
}

document.getElementById('menuR2l').addEventListener('click', function () {
    state.r2l = document.getElementById("menuR2l").checked;
    saveState();
    updatePage(state.page_idx);
}, false);

document.getElementById('menuCtrlToPan').addEventListener('click', function () {
    state.ctrlToPan = document.getElementById("menuCtrlToPan").checked;
    saveState();
}, false);

document.getElementById('menuDoublePageView').addEventListener('click', function () {
    state.singlePageView = !document.getElementById("menuDoublePageView").checked;
    saveState();
    updatePage(state.page_idx);
}, false);

document.getElementById('menuHasCover').addEventListener('click', function () {
    state.hasCover = document.getElementById("menuHasCover").checked;
    saveState();
    updatePage(state.page_idx);
}, false);

document.getElementById('menuTextBoxBorders').addEventListener('click', function () {
    state.textBoxBorders = document.getElementById("menuTextBoxBorders").checked;
    saveState();
    updateProperties();
}, false);

document.getElementById('menuEditableText').addEventListener('click', function () {
    state.editableText = document.getElementById("menuEditableText").checked;
    saveState();
    updateProperties();
}, false);

document.getElementById('menuDisplayOCR').addEventListener('click', function () {
    state.displayOCR = document.getElementById("menuDisplayOCR").checked;
    saveState();
    updateProperties();
}, false);

document.getElementById('menuEInkMode').addEventListener('click', function () {
    state.eInkMode = document.getElementById("menuEInkMode").checked;
    saveState();
    updateProperties();
    if (state.eInkMode) {
        eInkRefresh();
    }
}, false);

document.getElementById('menuToggleOCRTextBoxes').addEventListener('click', function () {
    state.toggleOCRTextBoxes = document.getElementById("menuToggleOCRTextBoxes").checked;
    saveState();
    updateProperties();
}, false);

document.getElementById('menuBackgroundColor').addEventListener(
    'input',
    function (event) {
      state.backgroundColor = event.target.value;
      saveState();
      updateProperties();
    },
    false
  );

document.getElementById('menuOriginalSize').addEventListener('click', zoomOriginal, false);
document.getElementById('menuFitToWidth').addEventListener('click', zoomFitToWidth, false);
document.getElementById('menuFitToScreen').addEventListener('click', zoomFitToScreen, false);
document.getElementById('menuFullScreen').addEventListener('click', toggleFullScreen, false);

document.getElementById('menuAbout').addEventListener('click', function () {
    document.getElementById('popupAbout').style.display = 'block';
    document.getElementById('dimOverlay').style.display = 'initial';
    pz.pause();
}, false);

document.getElementById('menuReset').addEventListener('click', function () {
    let page_idx = state.page_idx;
    state = JSON.parse(JSON.stringify(defaultState));
    updateUI();
    updatePage(page_idx);
    updateProperties();
}, false);

document.getElementById('dimOverlay').addEventListener('click', function () {
    document.getElementById('popupAbout').style.display = 'none';
    document.getElementById('dimOverlay').style.display = 'none';
    pz.resume();
}, false);

document.getElementById('menuFontSize').addEventListener('change', (e) => {
    state.fontSize = e.target.value;
    saveState();
    updateProperties();
});

document.getElementById('menuDefaultZoom').addEventListener('change', (e) => {
    state.defaultZoomMode = e.target.value;
    saveState();
});


document.getElementById('pageIdxInput').addEventListener('change', (e) => {
    updatePage(e.target.value - 1);
})

document.getElementById('buttonHideMenu').addEventListener('click', function () {
    document.getElementById('showMenuA').style.display = "inline-block";
    document.getElementById('topMenu').classList.add("hidden");
    document.getElementById('backButton').classList.add("hidden");
}, false);

document.getElementById('showMenuA').addEventListener('click', function () {
    document.getElementById('showMenuA').style.display = "none";
    document.getElementById('topMenu').classList.remove("hidden");
    document.getElementById('backButton').classList.remove("hidden");
}, false);

document.getElementById('buttonLeftLeft').addEventListener('click', inputLeftLeft, false);
document.getElementById('buttonLeft').addEventListener('click', inputLeft, false);
document.getElementById('buttonRight').addEventListener('click', inputRight, false);
document.getElementById('buttonRightRight').addEventListener('click', inputRightRight, false);
document.getElementById('leftAPage').addEventListener('click', inputLeft, false);
document.getElementById('leftAScreen').addEventListener('click', inputLeft, false);
document.getElementById('rightAPage').addEventListener('click', inputRight, false);
document.getElementById('rightAScreen').addEventListener('click', inputRight, false);

document.addEventListener("keydown", function onEvent(e) {
    switch (e.key) {
        case "ArrowLeft":
        case "a":
            if (state.r2l) {
                nextPage();
            } else {
                prevPage();
            }
            break;

        case "ArrowRight":
        case "d":
            if (state.r2l) {
                prevPage();
            } else {
                nextPage();
            }
            break;

        case "ArrowUp":
        case "PageUp":
        case "w":
            prevPage();
            break;

        case "ArrowDown":
        case "PageDown":
        case "s":
            nextPage();
            break;

        case "Enter":
            toggleFullScreen();
            setTimeout(function() {
                zoomDefault();
            }, 80);
            break;

        case "Home":
            firstPage();
            break;

        case "End":
            lastPage();
            break;

        case " ":
            nextPage();
            break;

        case "0":
            zoomDefault();
            break;
    }
});

function isPageFirstOfPair(page_idx) {
    if (state.singlePageView) {
        return true;
    } else {
        if (state.hasCover) {
            return (page_idx === 0 || (page_idx % 2 === 1));
        } else {
            return page_idx % 2 === 0;
        }
    }
}

function getPage(page_idx) {
    return document.getElementById("page" + page_idx);
}

function getOffsetLeft() {
    return 0;
}

function getOffsetTop() {
    let offset = 0;
    let menu = document.getElementById('topMenu');
    if (!menu.classList.contains("hidden")) {
        offset += menu.getBoundingClientRect().bottom + 10;
    }
    return offset;
}

function getOffsetRight() {
    return 0;
}

function getOffsetBottom() {
    return 0;
}

function getScreenWidth() {
    return window.innerWidth - getOffsetLeft() - getOffsetRight();
}

function getScreenHeight() {
    return window.innerHeight - getOffsetTop() - getOffsetBottom();
}

function panAlign(align_x, align_y) {
    let scale = pz.getTransform().scale;
    let x;
    let y;

    switch (align_x) {
        case "left":
            x = getOffsetLeft();
            break;
        case "center":
            x = getOffsetLeft() + (getScreenWidth() - pc.offsetWidth * scale) / 2;
            break;
        case "right":
            x = getOffsetLeft() + (getScreenWidth() - pc.offsetWidth * scale);
            break;
    }

    switch (align_y) {
        case "top":
            y = getOffsetTop();
            break;
        case "center":
            y = getOffsetTop() + (getScreenHeight() - pc.offsetHeight * scale) / 2;
            break;
        case "bottom":
            y = getOffsetTop() + (getScreenHeight() - pc.offsetHeight * scale);
            break;
    }

    pz.moveTo(x, y);
}


function zoomOriginal() {
    pz.moveTo(0, 0);
    pz.zoomTo(0, 0, 1 / pz.getTransform().scale);
    panAlign("center", "center");
}

function zoomFitToWidth() {
    let scale = (1 / pz.getTransform().scale) * (getScreenWidth() / pc.offsetWidth);
    pz.moveTo(0, 0);
    pz.zoomTo(0, 0, scale);
    panAlign("center", "top");
}

function zoomFitToScreen() {
    let scale_x = getScreenWidth() / pc.offsetWidth;
    let scale_y = getScreenHeight() / pc.offsetHeight;
    let scale = (1 / pz.getTransform().scale) * Math.min(scale_x, scale_y);
    pz.moveTo(0, 0);
    pz.zoomTo(0, 0, scale);
    panAlign("center", "center");
}

function zoomDefault() {
    switch (state.defaultZoomMode) {
        case "fit to screen":
            zoomFitToScreen();
            break;
        case "fit to width":
            zoomFitToWidth();
            break;
        case "original size":
            zoomOriginal();
            break;
    }
}

function updatePage(new_page_idx) {
    new_page_idx = Math.min(Math.max(new_page_idx, 0), num_pages - 1);

    // 隐藏当前页
    getPage(state.page_idx).style.display = "none";
    if (state.page2_idx >= 0) {
        getPage(state.page2_idx).style.display = "none";
    }

    // 更新state.page_idx
    if (isPageFirstOfPair(new_page_idx)) {
        state.page_idx = new_page_idx;
    } else {
        state.page_idx = new_page_idx - 1;
    }

    // 显示新的页面
    getPage(state.page_idx).style.display = "inline-block";
    getPage(state.page_idx).style.order = 2;

    // 预加载后续页
    preloadNextPages(state.page_idx, 6);

    if (!state.singlePageView && state.page_idx < num_pages - 1 && !isPageFirstOfPair(state.page_idx + 1)) {
        state.page2_idx = state.page_idx + 1;
        getPage(state.page2_idx).style.display = "inline-block";

        if (state.r2l) {
            getPage(state.page2_idx).style.order = 1;
        } else {
            getPage(state.page2_idx).style.order = 3;
        }

    } else {
        state.page2_idx = -1;
    }

    document.getElementById("pageIdxInput").value = state.page_idx + 1;

    page2_txt = (state.page2_idx >= 0) ? ',' + (state.page2_idx + 1) : "";
    document.getElementById("pageIdxDisplay").innerHTML = (state.page_idx + 1) + page2_txt + '/' + num_pages;

    saveState();
    zoomDefault();
    if (state.eInkMode) {
        eInkRefresh();
    }
}

// 图片预加载
function preloadNextPages(currentPageIndex, numPages) {
    for (let i = currentPageIndex + 1; i <= currentPageIndex + numPages && i < num_pages; i++) {
        let pageContainer = getPage(i).querySelector('.pageContainer');
        if (pageContainer) {
            let bgImageUrl = pageContainer.style.backgroundImage.slice(5, -2); // 提取背景图像URL
            let img = new Image(); // 创建一个新的Image对象
            img.src = bgImageUrl; // 设置Image对象的源地址为背景图像地址
        }
    }
}

function firstPage() {
    updatePage(0);
}

function lastPage() {
    updatePage(num_pages - 1);
}

function prevPage() {
    updatePage(state.page_idx - (state.singlePageView ? 1 : 2));
}

function nextPage() {
    updatePage(state.page_idx + (state.singlePageView ? 1 : 2));
}

function inputLeftLeft() {
    if (state.r2l) {
        lastPage();
    } else {
        firstPage();
    }
}

function inputLeft() {
    if (state.r2l) {
        nextPage();
    } else {
        prevPage();
    }
}

function inputRight() {
    if (state.r2l) {
        prevPage();
    } else {
        nextPage();
    }
}

function inputRightRight() {
    if (state.r2l) {
        firstPage();
    } else {
        lastPage();
    }
}

function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}

function eInkRefresh() {
    pc.classList.add("inverted");
    document.body.style.backgroundColor = "black";
    setTimeout(function () {
        pc.classList.remove("inverted");
        document.body.style.backgroundColor = r.style.getPropertyValue("--colorBackground");
    }, 300);
}


let currentAudio = null; // 用于跟踪当前播放的音频
function fetchAndPlayAudio(text) {
    // 停止当前播放的音频（如果有的话）
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // 将音频播放重置到开始位置
    }

    // 发起fetch请求获取音频
    fetch(`${vitsurl}/voice/vits?text=${encodeURIComponent(text)}&id=342&format=wav&lang=ja&max=200`)
        .then(response => response.blob())
        .then(blob => {
            const audioUrl = URL.createObjectURL(blob);
            currentAudio = new Audio(audioUrl); // 创建新的Audio对象
            currentAudio.play().catch(error => console.error('Error playing audio:', error)); // 尝试播放音频
        })
        .catch(error => console.error('Error fetching audio:', error));
}

