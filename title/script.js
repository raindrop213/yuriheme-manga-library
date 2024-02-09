let num_pages = -1;
let pc = document.getElementById('pagesContainer');
let r = document.querySelector(':root');
let pz;
let showAboutOnStart = false;

let storageKey = "mokuro_" + window.location.pathname;

let defaultState = {
    page_idx: 0,
    page2_idx: -1,
    hasCover: true,
    r2l: true,
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

}, false);

function disablePanzoomOnElement(element) {
    return document.getElementById('topMenu').contains(element);
}

// 翻译器
const supportedLanguages = [
    ["auto", "auto"],
    ["de", "DE"],
    ["en", "EN"],
    ["es", "ES"],
    ["fr", "FR"],
    ["it", "IT"],
    ["ja", "JA"],
    ["ko", "KO"],
    ["nl", "NL"],
    ["pl", "PL"],
    ["pt", "PT"],
    ["ru", "RU"],
    ["zh", "ZH"],
    ["zh", "ZH"],
    ["bg", "BG"],
    ["cs", "CS"],
    ["da", "DA"],
    ["el", "EL"],
    ["et", "ET"],
    ["fi", "FI"],
    ["hu", "HU"],
    ["lt", "LT"],
    ["lv", "LV"],
    ["ro", "RO"],
    ["sk", "SK"],
    ["sl", "SL"],
    ["sv", "SV"],
  ];
  const langMap = new Map(supportedLanguages);
  
function getTimeStamp(iCount) {
const ts = Date.now();
if (iCount !== 0) {
    iCount = iCount + 1;
    return ts - (ts % iCount) + iCount;
} else {
    return ts;
}
}
  
// from可以填ja，to可填zh
function deeplTranslate(text, from, to) {
  return new Promise((resolve, reject) => {
    const sourceLanguage = langMap.get(from);
    const targetLanguage = langMap.get(to);
    if (!targetLanguage) {
      reject("不支持该语种");
      return;
    }

    const source_lang = sourceLanguage || "ja";
    const target_lang = targetLanguage || "zh";
    const translate_text = text || "";

    if (translate_text !== "") {
      const url = "https://www2.deepl.com/jsonrpc";
      let id = (Math.floor(Math.random() * 99999) + 100000) * 1000;
      const post_data = {
        jsonrpc: "2.0",
        method: "LMT_handle_texts",
        params: {
          splitting: "newlines",
          lang: {
            source_lang_user_selected: source_lang,
            target_lang: target_lang,
          },
          texts: [{ text: translate_text, requestAlternatives: 3 }],
          timestamp: getTimeStamp(translate_text.split("i").length - 1),
        },
        id: id,
      };
      let post_str = JSON.stringify(post_data);
      if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
        post_str = post_str.replace('"method":"', '"method" : "');
      } else {
        post_str = post_str.replace('"method":"', '"method": "');
      }

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: post_str,
      })
        .then((response) => response.json())
        .then((data) => resolve(data.result.texts[0].text))
        .catch((error) => {
          reject("接口请求错误 - " + JSON.stringify(error));
        });
    } else {
      reject("没有提供翻译文本");
    }
  });
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
    // document.getElementById('topMenu').style.display = "none";
    document.getElementById('showMenuA').style.display = "inline-block";
    document.getElementById('topMenu').classList.add("hidden");
}, false);

document.getElementById('showMenuA').addEventListener('click', function () {
    // document.getElementById('topMenu').style.display = "initial";
    document.getElementById('showMenuA').style.display = "none";
    document.getElementById('topMenu').classList.remove("hidden");
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

    getPage(state.page_idx).style.display = "none";

    if (state.page2_idx >= 0) {
        getPage(state.page2_idx).style.display = "none";
    }

    if (isPageFirstOfPair(new_page_idx)) {
        state.page_idx = new_page_idx;
    } else {
        state.page_idx = new_page_idx - 1;
    }

    getPage(state.page_idx).style.display = "inline-block";
    getPage(state.page_idx).style.order = 2;

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



// 翻译部分
let url = 'http://127.0.0.1:8777'

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(event) {
        const target = event.target;
        const textBox = target.closest('.textBox');
        
        if (textBox) {
            const analysisModal = document.getElementById('analysisModal');
            // 获取textBox的位置和尺寸
            const rect = textBox.getBoundingClientRect();
            // 计算弹窗的最佳位置
            let top = rect.top + window.scrollY;
            let left = rect.left + window.scrollX + rect.width + 20; // 弹窗位于textBox的右侧
            // 确保弹窗不会超出浏览器窗口
            if (left + analysisModal.offsetWidth > window.innerWidth) {
                left = rect.left + window.scrollX - analysisModal.offsetWidth; // 如果右侧放不下，则尝试放到左侧
            }
            if (top + analysisModal.offsetHeight > window.innerHeight) {
                top = window.innerHeight - analysisModal.offsetHeight; // 如果底部放不下，则上移
            }
            // 更新弹窗位置
            analysisModal.style.top = `${top}px`;
            analysisModal.style.left = `${left}px`;
            analysisModal.style.display = 'block';

            document.getElementById('analysisModal').style.display = 'block';
            
            // 假定获取的文本就是textBox内的文本
            let text = textBox.textContent;
            fetch(`${url}/parse?text=${encodeURIComponent(text)}`)
                .then(response => response.json())
                .then(data => {
                    // 将分词结果显示在句子框中
                    displayMecabResult(data.output, document.getElementById('sentence'));
                    // 使用翻译API翻译文本并显示结果
                    googleTranslation(text);
                    chatgptTranslation(text);
                });
        } else if (!event.target.closest('#analysisModal')) {
            document.getElementById('analysisModal').style.display = 'none';
        }
    
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const analysisModal = document.getElementById('analysisModal');
    const resizeHandle = document.getElementById('resizeHandle');

    let isResizing = false;

    resizeHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isResizing = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResize);
    });

    function handleMouseMove(e) {
        if (isResizing) {
            const width = e.clientX - analysisModal.offsetLeft;
            const height = e.clientY - analysisModal.offsetTop;
            analysisModal.style.width = `${width}px`;
            analysisModal.style.height = `${height}px`;
        }
    }

    function stopResize(e) {
        if (isResizing) {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            // 存储新的尺寸
            localStorage.setItem('modalWidth', analysisModal.style.width);
            localStorage.setItem('modalHeight', analysisModal.style.height);
        }
    }

    // 页面加载时应用存储的尺寸
    const storedWidth = localStorage.getItem('modalWidth');
    const storedHeight = localStorage.getItem('modalHeight');
    if (storedWidth && storedHeight) {
        analysisModal.style.width = storedWidth;
        analysisModal.style.height = storedHeight;
    }
});

function displayMecabResult(parseResult, sentenceBox) {
    // 清空句子框以显示新的结果
    sentenceBox.innerHTML = '';

    // 解析结果并为每个词添加注音（如果需要）
    parseResult.split('\n').forEach(line => {
        if (line && !line.startsWith('EOS')) {
            const parts = line.split('\t');
            if (parts.length > 1) {
                const word = parts[0];
                const details = parts[1].split(',');
                const pos = details[0]; // 词性
                const kana = details[6]; // 正确获取假名注音
                const furigana = convertToHiragana(kana);

                const span = document.createElement('span');
                span.className = 'mecabSpan ' + pos;
                
                if (word !== furigana) {
                    const rubyElement = document.createElement('ruby');
                    rubyElement.id = `ruby-sentence`;
                    rubyElement.appendChild(document.createTextNode(word));
                    const rtElement = document.createElement('rt');
                    rtElement.textContent = furigana;
                    rubyElement.appendChild(rtElement);
                    span.appendChild(rubyElement);
                } else {
                    span.textContent = word + ' ';
                }
                sentenceBox.appendChild(span);
            }
        }
    });
}

// Google翻译器
function googleTranslation(text) {
    const container = document.getElementById('google-translation-container');
    container.innerHTML = ''; // 清空旧的翻译结果

    fetch(`${url}/google?text=${encodeURIComponent(text)}`)
        .then(response => response.json())
        .then(data => {
            if (data.output) {
                displayTranslation(data.output, 'google', 'google-translation-container');
            }
        })
        .catch(error => {
            console.error('Error fetching traditional translation:', error);
            displayTranslation('Google翻译失败', 'google', 'google-translation-container');
        });
}

// ChatGPT翻译器的翻译和显示逻辑
function chatgptTranslation(text) {
    const container = document.getElementById('chatgpt-translation-container');
    container.innerHTML = ''; // 清空旧的翻译结果

    fetch(`${url}/chatgpt?text=${encodeURIComponent(text)}`)
        .then(response => response.json())
        .then(data => {
            if (data.output) {
                displayTranslation(data.output, 'chatgpt', 'chatgpt-translation-container');
            }
        })
        .catch(error => {
            console.error('Error fetching ChatGPT translation:', error);
            displayTranslation('ChatGPT翻译失败', 'chatgpt', 'chatgpt-translation-container');
        });
}

// 显示翻译结果的函数
function displayTranslation(translation, source, containerId) {
    const container = document.getElementById(containerId);
    const p = document.createElement('p');
    p.textContent = `${translation}`;
    p.className = `translation translation-${source}`;
    container.appendChild(p);
}

function convertToHiragana(katakana) {
    const katakanaToHiraganaMap = {
        'ァ': 'ぁ', 'ア': 'あ', 'ィ': 'ぃ', 'イ': 'い', 'ゥ': 'ぅ', 'ウ': 'う', 'ェ': 'ぇ', 'エ': 'え', 'ォ': 'ぉ', 'オ': 'お',
        'カ': 'か', 'ガ': 'が', 'キ': 'き', 'ギ': 'ぎ', 'ク': 'く', 'グ': 'ぐ', 'ケ': 'け', 'ゲ': 'げ', 'コ': 'こ', 'ゴ': 'ご',
        'サ': 'さ', 'ザ': 'ざ', 'シ': 'し', 'ジ': 'じ', 'ス': 'す', 'ズ': 'ず', 'セ': 'せ', 'ゼ': 'ぜ', 'ソ': 'そ', 'ゾ': 'ぞ',
        'タ': 'た', 'ダ': 'だ', 'チ': 'ち', 'ヂ': 'ぢ', 'ッ': 'っ', 'ツ': 'つ', 'ヅ': 'づ', 'テ': 'て', 'デ': 'で', 'ト': 'と', 'ド': 'ど',
        'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の', 'ハ': 'は', 'バ': 'ば', 'パ': 'ぱ', 'ヒ': 'ひ', 'ビ': 'び', 'ピ': 'ぴ',
        'フ': 'ふ', 'ブ': 'ぶ', 'プ': 'ぷ', 'ヘ': 'へ', 'ベ': 'べ', 'ペ': 'ぺ', 'ホ': 'ほ', 'ボ': 'ぼ', 'ポ': 'ぽ',
        'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も', 'ャ': 'ゃ', 'ヤ': 'や', 'ュ': 'ゅ', 'ユ': 'ゆ', 'ョ': 'ょ', 'ヨ': 'よ',
        'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ', 'ヮ': 'ゎ', 'ワ': 'わ', 'ヰ': 'ゐ', 'ヱ': 'ゑ', 'ヲ': 'を', 'ン': 'ん',
        'ヴ': 'ゔ', 'ヵ': 'ゕ', 'ヶ': 'ゖ', 'ヽ': 'ゝ', 'ヾ': 'ゞ'
    };

    let hiragana = '';

    for (let char of katakana) {
        hiragana += katakanaToHiraganaMap[char] || char;
    }
    return hiragana;
}

document.body.addEventListener('click', function(event) {
    let target = event.target.closest('.mecabSpan'); // 尝试找到最近的包含`mecabSpan`类的祖先元素

    // 不再移除所有mecabSpan元素的.active-span类
    

    // 如果找到包含`mecabSpan`类的元素
    if (target) {
        document.querySelectorAll('.mecabSpan').forEach(el => el.classList.remove('active-span')); // 先移除其他的.active-span类
        target.classList.add('active-span'); // 然后为当前点击的元素添加.active-span类

        document.querySelectorAll('.dictionary-tab').forEach(tab => {tab.classList.remove('active-tab');}); // 刷新按钮 移除.active-tap类

        const ruby = target.querySelector('ruby');
        if (ruby) {
            console.log('点击了含有ruby的mecabSpan元素');
            const word = Array.from(ruby.childNodes).filter(node => node.nodeType === Node.TEXT_NODE || node.nodeName.toLowerCase() !== 'rt').map(node => node.textContent).join('').trim();
            console.log('查询的单词：', word);
            fetchDictionaryResults(word);
        } else {
            console.log('点击了不含ruby的mecabSpan元素');
            const wordWithoutFurigana = target.textContent.trim();
            console.log('查询的单词：', wordWithoutFurigana);
            fetchDictionaryResults(wordWithoutFurigana);
        }
    }
});

function fetchDictionaryResults(word) {
    // 按顺序查询所有词典
    fetchDictionaryResult(word, 'moji', 'moji-container');
    fetchDictionaryResult(word, 'youdao', 'youdao-container');
    fetchDictionaryResult(word, 'weblio', 'weblio-container');
}

function fetchDictionaryResult(word, dictionary, containerId) {
    fetch(`${url}/${dictionary}?text=${encodeURIComponent(word)}`)
        .then(response => response.json())
        .then(data => {
            displayDictionaryResult(data.output, containerId);
        })
        .catch(error => {
            console.error(`Error fetching ${dictionary} dictionary:`, error);
            displayDictionaryResult(`${dictionary}查询失败`, containerId);
        });
}       

function displayDictionaryResult(result, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = result;
    container.style.display = 'block'; // 总是显示容器
}

// 为每个词典切换标签添加点击事件监听器
document.querySelectorAll('.dictionary-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const dictionary = this.getAttribute('data-dictionary');
        
        // 移除其他标签的激活状态，并隐藏所有词典结果，但是不在点击非词典区域时执行
        document.querySelectorAll('.dictionary-content').forEach(container => {
            container.style.display = 'none';
        });
        
        // 激活点击的标签，并显示对应的词典结果
        document.querySelectorAll('.dictionary-tab').forEach(tab => {
            tab.classList.remove('active-tab');
        });
        this.classList.add('active-tab');
        document.getElementById(`${dictionary}-container`).style.display = 'block';
    });
});

document.getElementById('scrollToTopButton').addEventListener('click', function() {
    document.getElementById('textBox').scrollTop = 0; // 滚动到顶部
});

document.addEventListener("DOMContentLoaded", function() {
    // 获取滚动容器和返回顶部按钮的元素
    var textBox = document.getElementById('textBox');
    var scrollToTopButton = document.getElementById('scrollToTopButton');

    // 默认隐藏返回顶部按钮
    scrollToTopButton.style.display = 'none';

    // 为滚动容器添加滚动事件监听器
    textBox.addEventListener('scroll', function() {
        // 检查滚动位置
        if (textBox.scrollTop > 0) {
            // 如果已经滚动，显示返回顶部按钮
            scrollToTopButton.style.display = 'block';
        } else {
            // 如果在顶部，隐藏返回顶部按钮
            scrollToTopButton.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const analysisModal = document.getElementById('analysisModal');
    const header = analysisModal.querySelector('.modal-header'); // 假设你的标题栏有这个类名
    let isDragging = false;
    let dragStartX, dragStartY;

    // 监听关闭按钮的点击事件来隐藏弹窗
    closeBtn.addEventListener('click', function() {
        analysisModal.style.display = 'none';
    });

    header.addEventListener('mousedown', function(e) {
        isDragging = true;
        dragStartX = e.clientX - analysisModal.offsetLeft;
        dragStartY = e.clientY - analysisModal.offsetTop;
        document.addEventListener('mousemove', handleDragging);
        document.addEventListener('mouseup', stopDragging);
        e.preventDefault(); // 防止拖动时选中文本
    });

    function handleDragging(e) {
        if (isDragging) {
            const newX = e.clientX - dragStartX;
            const newY = e.clientY - dragStartY;
            analysisModal.style.left = `${newX}px`;
            analysisModal.style.top = `${newY}px`;
        }
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', handleDragging);
    }
});

