// 切換報單表頭與報單項次的tab
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        const tabLinks = Array.from(document.querySelectorAll('.tab-links'));

        let currentIndex = tabLinks.findIndex(link => link.classList.contains('active'));
        let newIndex;

        if (event.key === 'ArrowLeft') {
            newIndex = (currentIndex > 0) ? currentIndex - 1 : tabLinks.length - 1;
        } else if (event.key === 'ArrowRight') {
            newIndex = (currentIndex < tabLinks.length - 1) ? currentIndex + 1 : 0;
        }

        // 從 onclick 中取得新的 tab 名稱
        const newTabName = tabLinks[newIndex].getAttribute('onclick').match(/'([^']+)'/)[1];
        openTab(newTabName);
        tabLinks[newIndex].focus(); // 將焦點移至新選中的 tab
    }
});

function openTab(tabName) {
    const tabs = document.querySelectorAll(".tab");
    const tabLinks = document.querySelectorAll(".tab-links");

    // 移除所有 active 狀態
    tabs.forEach(tab => tab.classList.remove("active"));
    tabLinks.forEach(link => link.classList.remove("active"));

    // 顯示選中的 tab，並設定為 active
    document.getElementById(tabName).classList.add("active");
    document.querySelector(`.tab-links[onclick="openTab('${tabName}')"]`).classList.add("active");
}

// 調整 margin 以確保標籤正確對齊
function adjustMargin() {
    var tabsHeight = document.querySelector('.tabs-wrapper').offsetHeight;
    document.querySelector('p').style.marginTop = tabsHeight + 'px';
}

// 初次加載時執行
adjustMargin();

// 如果窗口大小改變，重新計算高度
window.onresize = function() {
    adjustMargin();
};

// 游標在頁面載入後自動聚焦到 文件編號 欄位
window.onload = function() {
    document.getElementById("FILE_NO").focus();
};

document.addEventListener('DOMContentLoaded', () => {
    // 選取所有的 label 元素
    const labels = document.querySelectorAll('label');

    labels.forEach(label => {
        // 當滑鼠移到 label 上時改變顏色
        label.addEventListener('mouseover', () => {
            label.style.color = 'black';
            label.style.fontWeight = 'bold'; // 可選：文字加粗
        });

        // 當滑鼠移開時恢復原來樣式
        label.addEventListener('mouseout', () => {
            label.style.color = ''; // 恢復默認顏色
            label.style.fontWeight = ''; // 恢復默認粗細
        });
    });
});

// 【影片說明】
function updateVideoLink() {
    var selector = document.getElementById("videoSelector");
    var videoLink = document.getElementById("videoLink");
    videoLink.href = selector.value;
}

// 滾動到頂部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 滾動到底部
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function dragElement(element, header) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// 切換固定欄位標題
function toggleFixTop() {
    var headerContainer = document.getElementById('header-container');
    var checkbox = document.getElementById('toggle-fix-top');
    if (checkbox.checked) {
        headerContainer.classList.add('fixed-top');
    } else {
        headerContainer.classList.remove('fixed-top');
    }
}

// 初始化固定欄位標題
function initFixTop() {
    var headerContainer = document.getElementById('header-container');
    var checkbox = document.getElementById('toggle-fix-top');
    
    if (headerContainer && checkbox && checkbox.checked) {
        headerContainer.classList.add('fixed-top');
    }
}

// 確保初始化在頁面加載後執行
window.addEventListener('DOMContentLoaded', initFixTop);

// 切換固定頁面寬度
function toggleWidth() {
    var itemsTab = document.getElementById("items");
    if (document.getElementById("toggle-width").checked) {
        itemsTab.classList.add("fixed-width");
    } else {
        itemsTab.classList.remove("fixed-width");
    }
}

// 自定義平滑捲動函數
function smoothScrollBy(deltaX, deltaY, duration = 200) {
    const startX = window.scrollX;
    const startY = window.scrollY;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 計算進度（0 到 1）
        const easeInOut = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress; // 緩入緩出效果
        const scrollX = easeInOut * deltaX;
        const scrollY = easeInOut * deltaY;

        window.scrollTo(startX + scrollX, startY + scrollY);

        if (elapsed < duration) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// 處理 Alt+ArrowLeft、Alt+ArrowRight、PageUp 和 PageDown 的捲動
function handlePageScroll(event) {
    const scrollHorizontalAmount = window.innerWidth * 0.85; // 水平捲動距離
    const scrollVerticalAmount = window.innerHeight * 0.75; // 垂直捲動距離
    const duration = 150; // 設定更快的捲動速度（時間以毫秒為單位）

    if (event.altKey && event.key === 'ArrowLeft') {
        // Alt+ArrowLeft 向左捲動
        smoothScrollBy(-scrollHorizontalAmount, 0, duration);
        event.preventDefault(); // 防止預設行為
    } else if (event.altKey && event.key === 'ArrowRight') {
        // Alt+ArrowRight 向右捲動
        smoothScrollBy(scrollHorizontalAmount, 0, duration);
        event.preventDefault(); // 防止預設行為
    } else if (!event.altKey && event.key === 'PageUp') {
        // PageUp 向上捲動
        smoothScrollBy(0, -scrollVerticalAmount, duration);
        event.preventDefault(); // 防止預設行為
    } else if (!event.altKey && event.key === 'PageDown') {
        // PageDown 向下捲動
        smoothScrollBy(0, scrollVerticalAmount, duration);
        event.preventDefault(); // 防止預設行為
    }
}

// 全域監聽鍵盤事件
document.addEventListener('keydown', handlePageScroll);

// 限制 Alt+左箭頭、Alt+右箭頭 和 Alt+Home 的功能
function restrictAltKeyCombos(event) {
    if (
        event.altKey && 
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Home')
    ) {
        event.preventDefault(); // 阻止預設行為
    }
}

// 監聽鍵盤按下事件
document.addEventListener('keydown', restrictAltKeyCombos);

document.addEventListener("scroll", function () {
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    let maxScroll = document.documentElement.scrollWidth - window.innerWidth; // 最大可滾動範圍
    let viewportWidth = window.innerWidth; // 可視範圍寬度
    let buttonWidth = document.querySelector(".add-buttons").offsetWidth; // 取得按鍵區塊寬度

    if (buttonWidth <= viewportWidth) {
        // 如果按鍵區塊可完全容納在視窗內，保持靠左
        document.querySelector(".add-buttons").style.left = "0px";
    } else {
        // 如果按鍵區塊超出可視範圍，按比例移動
        let maxLeft = viewportWidth - buttonWidth; // 最大可移動範圍
        let moveRatio = scrollLeft / maxScroll; // 計算滾動比例
        let newLeft = moveRatio * maxLeft; // 按比例計算 `left` 值

        document.querySelector(".add-buttons").style.left = `${newLeft}px`;
    }
});

// 獲取文字區塊與彈跳框元素
const shortcutHelpBlock = document.getElementById('shortcut-help-block');
const shortcutHelpModal = document.getElementById('shortcut-help-modal');

// 滑鼠移入時顯示快捷鍵說明
shortcutHelpBlock.addEventListener('mouseenter', () => {
    shortcutHelpModal.style.display = 'block';
});

// 滑鼠移出時隱藏快捷鍵說明
shortcutHelpBlock.addEventListener('mouseleave', () => {
    shortcutHelpModal.style.display = 'none';
});

// 切換所有項次編號的反色
document.addEventListener('DOMContentLoaded', function() {
    // 切換所有項次編號的反色
    const header = document.querySelector('.item-no-header');
    header.addEventListener('click', toggleAllItems);

    function toggleAllItems() {
        const itemNos = document.querySelectorAll('.item-no');
        const isAnySelected = Array.from(itemNos).some(item => item.classList.contains('selected'));

        if (isAnySelected) {
            // 如果有任何項次被選中，則取消所有選中狀態
            itemNos.forEach(item => item.classList.remove('selected'));
        } else {
            // 如果沒有任何項次被選中，則選中所有項次
            itemNos.forEach(item => item.classList.add('selected'));
        }
    }
});

// 切換選中狀態-項次左側編號
function toggleSelect(element) {
    element.classList.toggle('selected');
}

// 運單號過濾，僅允許 'SF' 和數字
function filterSFAndNumbers(input) {
    const originalValue = input.value;
    input.value = input.value.replace(/[^SF0-9]/gi, '');

    if (/[^\dSF]/gi.test(originalValue)) {
        showHint(input, '僅允許輸入 SF 和半形數字');
    }
}

// 僅允許數字 0-9
function filterNumbers(input) {
    const originalValue = input.value;
    input.value = input.value.replace(/[^0-9]/g, '');

    if (/[^0-9]/.test(originalValue)) {
        showHint(input, '僅允許輸入半形數字');
    }
}

// 僅允許英文 A-Z
function filterAlphabets(input) {
    const originalValue = input.value;
    input.value = input.value.replace(/[^A-Z]/gi, '');

    if (/[^A-Za-z]/.test(originalValue)) {
        showHint(input, '僅允許輸入半形英文');
    }
}

// 僅允許數字 0-9 和英文 A-Z
function filterAlphanumeric(input) {
    const originalValue = input.value;
    input.value = input.value.replace(/[^0-9A-Z]/gi, '');

    if (/[^0-9A-Za-z]/.test(originalValue)) {
        showHint(input, '僅允許輸入半形數字和英文');
    }
}

// 提示函式
function showHint(input, message) {
    const hint = document.createElement('div');
    hint.className = 'input-hint';
    hint.textContent = message;

    if (!input.nextElementSibling || input.nextElementSibling.className !== 'input-hint') {
        input.insertAdjacentElement('afterend', hint);

        setTimeout(() => {
            if (hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
        }, 2000);
    }
}

// 依據統一編號的不同範圍對應相應的CSV檔案
let csvFiles = [
    { range: ['0'], file: 'companyData0.csv' },
    { range: ['1'], file: 'companyData1.csv' },
    { range: ['2'], file: 'companyData2.csv' },
    { range: ['3'], file: 'companyData3.csv' },
    { range: ['4'], file: 'companyData4.csv' },
    { range: ['5'], file: 'companyData5.csv' },
    { range: ['6'], file: 'companyData6.csv' },
    { range: ['7'], file: 'companyData7.csv' },
    { range: ['8'], file: 'companyData8.csv' },
    { range: ['9'], file: 'companyData9.csv' },
];

// 根據統一編號匹配應該加載的CSV檔案
function getMatchingFile(searchCode) {
    const prefix1 = searchCode.substring(0, 1); // 取統一編號的第 1 碼

    let matchingFile = csvFiles.find(item => {
        // 使用前 1 碼進行匹配
        return prefix1 === item.range[0];
    });

    // 檢查是否找到相應檔案，並回傳包含路徑的檔名
    return matchingFile ? `companyData/${matchingFile.file}` : null;
}

const noDataMessage = document.getElementById('noDataMessage'); // 錯誤訊息元素

let hasNoData = false; // 預設有資料

// 查找資料並自動帶入表單
function searchData(showErrorMessage = false) {
    hasNoData = false; // 每次查詢前重置
    let searchCode = document.getElementById('SHPR_BAN_ID').value.trim();

    // 如果輸入不滿 8 碼，清空資料並隱藏錯誤訊息，不進行匹配操作
    if (searchCode.length < 8) {
        clearSHPRFields();
        noDataMessage.style.display = 'none'; // 隱藏錯誤訊息
        return;
    }

    //賣方驗證號碼
    const dclDocExamInput = document.getElementById('DCL_DOC_EXAM');

    if (/^\d{8}$/.test(searchCode)) {
        // 8碼數字
        dclDocExamInput.value = '58';
    } else if (/^[A-Za-z]\d{9}$/.test(searchCode)) {
        // 1碼英文+9碼數字
        dclDocExamInput.value = '174';
        hasNoData = true;
    } else {
        dclDocExamInput.value = ''; // 格式不符則清空
    }

    const fileToSearch = getMatchingFile(searchCode);

    if (fileToSearch) {
        Papa.parse(fileToSearch, {
            download: true,
            header: true,
            complete: function(results) {
                const record = results.data.find(row => row['統一編號'] === searchCode);

                if (record) {
                    hasNoData = false; // 有資料

                    // 填入資料並隱藏錯誤訊息
                    document.getElementById('SHPR_C_NAME').value = record['廠商中文名稱'] || '';
                    document.getElementById('SHPR_E_NAME').value = record['廠商英文名稱'] || '';
                    document.getElementById('SHPR_C_ADDR').value = record['中文營業地址'] || '';
                    document.getElementById('SHPR_E_ADDR').value = record['英文營業地址'] || '';
                    document.getElementById('SHPR_TEL').value = record['電話號碼'] || '';
                    document.getElementById('IMP_QUAL').value = record['進口資格'] || '';
                    document.getElementById('EXP_QUAL').value = record['出口資格'] || '';
                    noDataMessage.style.display = 'none'; // 隱藏"查無資料"訊息

                    // 檢查是否為非營業中
                    if (record['進口資格'] === '無' && record['出口資格'] === '無') {
                        alert('該公司無進出口資格，請確認是否為非營業中。');
                    }
                } else {
                    hasNoData = true; // 查無資料
                    clearSHPRFields(); // 清空欄位
                    noDataMessage.style.display = 'inline'; // 顯示"查無資料"訊息
                    
                    // 查找出口備註是否有 "未向國際貿易署登記出進口廠商資料者"
                    checkUnregisteredCompany(searchCode);
                }
            }
        });
    }
    thingsToNote(); // 出口備註
}

// 清空 SHPR 欄位
function clearSHPRFields() {
    document.getElementById('SHPR_C_NAME').value = '';
    document.getElementById('SHPR_E_NAME').value = '';
    document.getElementById('SHPR_C_ADDR').value = '';
    document.getElementById('SHPR_E_ADDR').value = '';
    document.getElementById('SHPR_TEL').value = '';
}

// 查找未登記公司
function checkUnregisteredCompany(SHPR_BAN_ID) {
    fetch('./thingsToNote.xlsx')
        .then(response => {
            if (!response.ok) throw new Error('無法讀取出口備註');
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            let matchedData = null;

            // 遍歷 rows，查找 `SHPR_BAN_ID`
            rows.forEach(row => {
                if (row[1] && row[1].toString().trim() === SHPR_BAN_ID) {
                    matchedData = row[2]; // 找到與 SHPR_BAN_ID 匹配的 `row[2]`
                }
            });

            // 若有找到 `SHPR_BAN_ID`，進一步檢查 `row[2]` 是否包含 "未向國際貿易署登記出進口廠商資料者"
            if (matchedData && matchedData.includes('未向國際貿易署登記出進口廠商資料者')) {
                const extractedData = matchedData.split('\n').map(line => line.trim()).filter(line => line.length > 0);

                // 尋找包含 `SHPR_BAN_ID` 的行
                const companyLine = extractedData.find(line => line.includes(SHPR_BAN_ID));

                if (companyLine) {
                    // 確保 `companyLine` 可以分割
                    let companyInfo = companyLine.split(SHPR_BAN_ID);
                    let companyName = companyInfo.length > 1 ? companyInfo[1].trim() : '';

                    if (companyName) {
                        document.getElementById('SHPR_C_NAME').value = companyName;
                        document.getElementById('SHPR_E_NAME').value = companyName;
                    }

                    if (extractedData.length >= 2) {
                        document.getElementById('SHPR_C_ADDR').value = extractedData[1] || '';
                        document.getElementById('SHPR_E_ADDR').value = extractedData[1] || '';
                    }

                    // 隱藏 "查無資料" 訊息
                    const noDataMessage = document.getElementById('noDataMessage');
                    if (noDataMessage) {
                        noDataMessage.style.display = 'none';
                    }
                }
            }
        })
        .catch(error => {
            console.error('讀取出口備註時發生錯誤:', error);
            alert('讀取出口備註失敗');
        });
}

// 出口人統一編號搜尋
document.getElementById('SHPR_BAN_ID').addEventListener('input', function() {
    searchData(false);
});

// 收貨人統一編號
function generateBuyerBan() {
    const buyerENameInput = document.getElementById('BUYER_E_NAME');
    if (!buyerENameInput) return ''; // 若欄位不存在則回傳空字串

    let buyerEName = buyerENameInput.value.trim();
    const words = buyerEName.match(/[a-zA-Z]+/g) || [];
    let result = '';

    if (words.length >= 3) {
        for (let i = 0; i < 3; i++) {
            const word = words[i];
            if (word.length === 1) {
                result += word[0].toUpperCase(); // 單字只有1碼，取一次
            } else {
                result += word[0].toUpperCase() + word[word.length - 1].toUpperCase();
            }
        }
    } else if (words.length > 0) {
        words.forEach(word => {
            if (word.length === 1) {
                result += word[0].toUpperCase(); // 單字只有1碼，取一次
            } else {
                result += word[0].toUpperCase() + word[word.length - 1].toUpperCase();
            }
        });
    } else {
        result = buyerEName.slice(0, 6).toUpperCase();
    }

    return result;
}

document.getElementById('BUYER_E_NAME')?.addEventListener('input', function() {
    const buyerBanInput = document.getElementById('BUYER_BAN');
    if (buyerBanInput) {
        buyerBanInput.value = generateBuyerBan();
    }
});

// 儲存目的地數據
let destinations = {};

// 讀取 CSV 文件並解析
fetch('destinations.csv')
    .then(response => response.text())
    .then(data => {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                results.data.forEach(item => {
                    destinations[item["目的地代碼"]] = {
                        name: item["目的地名稱"],
                        chinese: item["中文"]
                    };
                });
            }
        });
    });

let activeIndex = -1; // 記錄當前選中的索引

// 動態篩選並顯示結果
document.getElementById('TO_DESC').addEventListener('input', function () {
    const input = this.value.toLowerCase();
    const resultsDiv = document.getElementById('search-results');
    const toCodeInput = document.getElementById('TO_CODE');

    resultsDiv.innerHTML = ''; // 清空現有結果

    // 如果輸入為空，不執行篩選，直接隱藏結果框
    if (!input) {
        toCodeInput.value = '';  // 清空 TO_CODE
        resultsDiv.style.display = 'none';
        return;
    }

    // 篩選匹配的目的地名稱、代碼或中文
    const matches = Object.entries(destinations).filter(([code, { name, chinese }]) =>
        (name && name.toLowerCase().includes(input)) || 
        (code && code.toLowerCase().includes(input)) || 
        (chinese && chinese.includes(input))
    );

    // 如果有匹配結果，顯示下拉選單
    if (matches.length > 0) {
        resultsDiv.style.display = 'block';
        matches.forEach(([code, { name, chinese }], index) => {
            const optionDiv = document.createElement('div');
            optionDiv.innerHTML = `
                <strong>${code}</strong> - ${name || ''} ${chinese || ''}
            `.trim(); // 結果框中顯示代碼、名稱和中文
            optionDiv.dataset.code = code;

            // 點擊選項時填入對應值並將焦點移至 TO_CODE
            optionDiv.addEventListener('click', function () {
                const code = this.dataset.code;
                const toCodeInput = document.getElementById('TO_CODE');

                toCodeInput.value = code; // 填入代碼
                toCodeInput.dispatchEvent(new Event('input')); // 觸發 TO_CODE 的輸入事件
                toCodeInput.focus(); // 將焦點移至 TO_CODE

                setTimeout(() => {
                    resultsDiv.style.display = 'none'; // 隱藏下拉框
                }, 100); // 確保操作完成後隱藏
            });
            
            resultsDiv.appendChild(optionDiv);
        });
    } else {
        resultsDiv.style.display = 'none'; // 沒有匹配時隱藏
    }
});

// 監聽 Enter 鍵按下的邏輯
document.getElementById('TO_DESC').addEventListener('keydown', function (e) {
    const resultsDiv = document.getElementById('search-results');

    if (e.key === 'Enter') {
        e.preventDefault(); // 防止預設行為
        const input = this.value.toLowerCase();

        // 如果輸入框為空，不執行任何操作
        if (!input) {
            resultsDiv.style.display = 'none';
            return;
        }

        // 手動觸發輸入事件，強制篩選和顯示下拉框
        this.dispatchEvent(new Event('input'));
        resultsDiv.style.display = 'block'; // 顯示結果框
    }
});

// 當用戶輸入目的地代碼時，自動填入名稱和中文
document.getElementById('TO_CODE').addEventListener('input', function () {
    let code = this.value.toUpperCase();
    if (destinations[code]) {
        document.getElementById('TO_DESC').value = destinations[code].name || ''; // 填入名稱
    } else {
        document.getElementById('TO_DESC').value = ''; // 清空名稱欄位
    }
});

// 當輸入框失去焦點時隱藏篩選結果框
document.getElementById('TO_DESC').addEventListener('blur', function () {
    setTimeout(() => { // 延遲隱藏，確保點擊選項有效
        document.getElementById('search-results').style.display = 'none';
    }, 300); // 延遲 300 毫秒
});

// 更新當前選中項的樣式
function updateActiveOption(options) {
    options.forEach((option, index) => {
        if (index === activeIndex) {
            option.style.backgroundColor = '#f0f0f0'; // 高亮當前選中項
        } else {
            option.style.backgroundColor = ''; // 恢復其他項
        }
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    // 初始化拖動功能
    dragElement(document.getElementById("item-modal"), document.getElementById("item-modal-header"));
    dragElement(document.getElementById("adjust-order-modal"), document.getElementById("adjust-order-modal-header"));
    dragElement(document.getElementById("specify-field-modal"), document.getElementById("specify-field-modal-header"));

    // 初始化源項次下拉選單
    populateSourceItemDropdown();

    // 添加事件監聽器到匯入Excel按鈕
    document.getElementById('import-excel').addEventListener('change', importToExcel, false);

    // 添加事件監聽器到匯出Excel按鈕
    document.getElementById('export-excel').addEventListener('click', exportToExcel);

    // 添加事件監聽器到匯入XML按鈕
    document.getElementById('import-xml').addEventListener('change', importXML, false);

    // 添加事件監聽器到報單副本選項
    document.querySelectorAll('input[type="checkbox"][name="copy_option"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateDocOtrDesc);
    });

    // 添加事件監聽器到報單副本選項
    document.querySelectorAll('input[type="checkbox"][name="copy_option"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateRemark1);
    });

    // 添加事件監聽器到所有checkbox以更新相關變量
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateVariables);
    });

    // 添加鍵盤事件監聽器
    document.addEventListener('keydown', handleKeyNavigation);
    
    // 初始化時更新DOC_OTR_DESC的值
    updateDocOtrDesc();

    // 初始化時更新REMARK1的值
    updateRemark1();

    // 初次調用以填充下拉選單
    addTextarea();
});

// 當按下計算運費按鈕時，觸發 calculateFreight 函數
document.getElementById('calculate-freight-button').addEventListener('click', calculateFreight);

// 當按下計算保險費按鈕時，觸發 calculateInsurance 函數
document.getElementById('calculate-insurance-button').addEventListener('click', calculateInsurance);

// 當按下計算應加費用按鈕時，觸發 calculateAdditional 函數
document.getElementById('calculate-additional-button').addEventListener('click', calculateAdditional);

function setupUpperCaseConversion(id) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    }
}

// 需要轉換大寫的所有欄位 ID
const fieldIds = [
    "LOT_NO", "SHPR_BAN_ID", "SHPR_BONDED_ID", "CNEE_COUNTRY_CODE", "TO_CODE", "DOC_CTN_UM",
    "DCL_DOC_TYPE", "TERMS_SALES", "CURRENCY", "DOC_UM", "ST_MTD", "ORG_COUNTRY",
    "ORG_IMP_DCL_NO", "BOND_NOTE", "CERT_NO", "ORG_DCL_NO", "EXP_NO", 
    "WIDE_UM", "LENGTH_UM", "ST_UM"
];

// 對每個欄位設置自動轉換為大寫的功能
fieldIds.forEach(setupUpperCaseConversion);

// 貨幣代碼驗證邏輯
const currencyField = document.getElementById("CURRENCY");
if (currencyField) {
    currencyField.addEventListener("blur", function () {
        const validCurrencies = [
            "ARS", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "DKK", "EUR", "GBP", 
            "HKD", "IDR", "ILS", "INR", "JPY", "KRW", "MYR", "NOK", "NZD", "PEN", 
            "PHP", "PLN", "SEK", "SGD", "THB", "TWD", "USD", "ZAR", "",
        ];
        const input = this.value.toUpperCase();
        const errorElement = document.getElementById("currency-error");

        if (errorElement) {
            if (!validCurrencies.includes(input)) {
                errorElement.style.display = "inline";
            } else {
                errorElement.style.display = "none";
            }
        }
    });
}

// 計算運費並顯示結果
function calculateFreight() {
    const currency = document.getElementById('CURRENCY').value.toUpperCase();
    const weight = parseFloat(document.getElementById('DCL_GW').value);

    fetchExchangeRates().then(exchangeRates => {
        if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
            document.getElementById('FRT_AMT').value = "無法獲取匯率數據";
            return;
        }

        const usdRate = exchangeRates["USD"]?.buyValue;
        const currencyRate = exchangeRates[currency]?.buyValue;

        if (!usdRate) {
            console.error("無法找到 USD 匯率", exchangeRates);
            document.getElementById('FRT_AMT').value = "無法獲取 USD 匯率";
            return;
        }

        if (!currencyRate) {
            console.error(`無法找到 ${currency} 匯率`, exchangeRates);
            document.getElementById('FRT_AMT').value = "無法獲取該幣別匯率";
            return;
        }

        if (!isNaN(weight)) {
            const freight = (weight * 3 * usdRate) / currencyRate;
            const decimalPlaces = currency === "TWD" ? 0 : 2;
            document.getElementById('FRT_AMT').value = new Decimal(freight).toFixed(decimalPlaces);
            adjustFreightAndInsurance();
        } else {
            document.getElementById('FRT_AMT').value = "輸入無效";
        }
    });
}

// 計算保險費並顯示結果
function calculateInsurance() {
    const totalAmount = parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value);
    const currency = document.getElementById('CURRENCY').value.toUpperCase();

    fetchExchangeRates().then(exchangeRates => {
        if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
            document.getElementById('INS_AMT').value = "無法獲取匯率數據";
            return;
        }

        const currencyRate = exchangeRates[currency]?.buyValue;

        if (!currencyRate) {
            console.error(`無法找到 ${currency} 匯率`, exchangeRates);
            document.getElementById('INS_AMT').value = "無法獲取該幣別匯率";
            return;
        }

        if (!isNaN(totalAmount)) {
            let insurance = totalAmount * 0.0011;
            const minimumInsurance = 450 / currencyRate;
            if (insurance < minimumInsurance) {
                insurance = minimumInsurance;
            }
            const decimalPlaces = currency === "TWD" ? 0 : 2;
            document.getElementById('INS_AMT').value = new Decimal(insurance).toFixed(decimalPlaces);
            adjustFreightAndInsurance();
        } else {
            document.getElementById('INS_AMT').value = "輸入無效";
        }
    });
}

// 根據 TERMS_SALES 進一步判斷並調整運費和保險費
function adjustFreightAndInsurance() {
    const termsSales = document.getElementById('TERMS_SALES').value.toUpperCase();
    const totalAmount = parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value);

    let freight = parseFloat(document.getElementById('FRT_AMT').value);
    let insurance = parseFloat(document.getElementById('INS_AMT').value);

    if (termsSales === "EXW" || termsSales === "FOB") {
        freight = '';
        insurance = '';
    } else if (termsSales === "CFR" && freight > totalAmount) {
        freight = totalAmount / 2;
    } else if (termsSales === "C&I" && insurance > totalAmount) {
        insurance = totalAmount / 2;
    } else if (termsSales === "CIF" && (freight + insurance) > totalAmount) {
        freight = totalAmount / 4;
        insurance = totalAmount / 4;
    }

    document.getElementById('FRT_AMT').value = freight === '' ? '' : freight.toFixed(2);
    document.getElementById('INS_AMT').value = insurance === '' ? '' : insurance.toFixed(2);
}

// 計算應加費用並顯示結果
function calculateAdditional() {
    const currency = document.getElementById('CURRENCY').value.toUpperCase();

    fetchExchangeRates().then(exchangeRates => {
        if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
            document.getElementById('ADD_AMT').value = "無法獲取匯率數據";
            return;
        }

        const currencyRate = exchangeRates[currency]?.buyValue;

        if (!currencyRate) {
            console.error(`無法找到 ${currency} 匯率`, exchangeRates);
            document.getElementById('ADD_AMT').value = "無法獲取該幣別匯率";
            return;
        }

        const additionalFee = 500 / currencyRate;
        const decimalPlaces = currency === "TWD" ? 0 : 2;
        document.getElementById('ADD_AMT').value = new Decimal(additionalFee).toFixed(decimalPlaces);
    });
}

// 幣別異動 => 清空 運費、保險費、應加費用
document.getElementById('CURRENCY').addEventListener('input', function () {
    clearFreightInsuranceAdditional();
});

// 總毛重異動 => 清空 運費
document.getElementById('DCL_GW').addEventListener('input', function () {
    clearFreight();
});

// 總金額異動 => 清空 保險費
document.getElementById('CAL_IP_TOT_ITEM_AMT').addEventListener('input', function () {
    clearInsurance();
});

// 清空運費、保險費、應加費用
function clearFreightInsuranceAdditional() {
    document.getElementById('FRT_AMT').value = '';
    document.getElementById('INS_AMT').value = '';
    document.getElementById('ADD_AMT').value = '';
}

// 清空運費
function clearFreight() {
    document.getElementById('FRT_AMT').value = '';
}

// 清空保險費
function clearInsurance() {
    document.getElementById('INS_AMT').value = '';
}

// 標記及貨櫃號碼 MADE IN
function fillText(text) {
    const textarea = document.getElementById('DOC_MARKS_DESC');
    textarea.value = textarea.value.trim() + '\n' + text;
    textarea.focus(); // 將焦點設回欄位
}

// 標記及貨櫃號碼及其它申報事項展開/收合
function toggleRows(textareaId, button) {
    const textarea = document.getElementById(textareaId);
    const currentRows = textarea.rows;

    if (currentRows === 5) {
        textarea.rows = 10;
        button.textContent = "展開";
    } else if (currentRows === 10) {
        textarea.rows = 15;
        button.textContent = "收合";
    } else {
        textarea.rows = 5;
        button.textContent = "展開";
    }
}

// 其它申報事項備註選單
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('doc_otr_desc_dropdown');
    const textarea = document.getElementById('DOC_OTR_DESC');

    dropdown.addEventListener('change', () => {
        if (dropdown.value) {
            if (textarea.value) {
                textarea.value = textarea.value.trim() + '\n' + dropdown.value; // 在已有內容後添加新內容
                textarea.focus(); // 將焦點設回欄位
            } else {
                textarea.value = dropdown.value; // 如果textarea是空的，直接添加內容
                textarea.focus(); // 將焦點設回欄位
            }
            dropdown.value = ''; // 重置下拉選單
        }
    });
});

// 計算單行金額的函數
function calculateAmountsForRow(row, decimalPlaces) {
    const qty = row.querySelector('.QTY').value || 0;
    const unitPrice = row.querySelector('.DOC_UNIT_P').value || 0;
    const totalPrice = qty * unitPrice;
    const totalPriceField = row.querySelector('.DOC_TOT_P');
    
    if (totalPrice === 0) {
        totalPriceField.value = '';
    } else {
        totalPriceField.value = (new Decimal(totalPrice).toDecimalPlaces(10, Decimal.ROUND_UP).toFixed(decimalPlaces));
    }
}

// 即時更新 ST_QTY
function updateST_QTY(itemRow) {
    const qty = new Decimal(itemRow.querySelector('.QTY').value || 0);
    const docum = itemRow.querySelector('.DOC_UM').value;
    const stqty = itemRow.querySelector('.ST_QTY');
    const stum = itemRow.querySelector('.ST_UM').value;

    if (qty.isZero() && stum !== 'MTK') {
        stqty.value = '';  // 如果數量為空，則清空 ST_QTY
    } else if (stum === docum && stum !== '') {
        stqty.value = qty.toString();
    } else if (docum === 'KPC' && stum === 'PCE') {
        stqty.value = qty.times(1000).toDecimalPlaces(2).toString();
    } else if (docum === 'NPR' && stum === 'PCE') {
        stqty.value = qty.times(2).toDecimalPlaces(2).toString();
    } else if (docum === 'PCE' && stum === 'DZN') {
        stqty.value = qty.div(12).toDecimalPlaces(2).toString();
    } else if (docum === 'KPC' && stum === 'DZN') {
        stqty.value = qty.times(1000).div(12).toDecimalPlaces(2).toString();
    }
}

// 即時更新 NET_WT
function updateNET_WT(itemRow) {
    const qty = itemRow.querySelector('.QTY');
    const docum = itemRow.querySelector('.DOC_UM');
    const netwt = itemRow.querySelector('.NET_WT');

    const qtyValue = parseFloat(qty.value) || '';
    const documValue = docum.value.trim().toUpperCase();

    if (documValue === 'KGM') {
        netwt.value = qtyValue;  // 當 DOC_UM 為 KGM，則 NET_WT = QTY
    } else if (documValue === 'GRM') {
        netwt.value = (qtyValue / 1000);  // 當 DOC_UM 為 GRM，則 NET_WT = QTY / 1000
    }
}

// 監聽所有 QTY 和 DOC_UM 欄位變更
document.addEventListener('input', (event) => {
    if (event.target.matches('.QTY, .DOC_UM')) {
        const itemRow = event.target.closest('.item-row');
        if (itemRow) {
            updateST_QTY(itemRow);
            updateNET_WT(itemRow);
        }
    }
});

// 刪除項次
function removeItem(element) {
    const item = element.parentElement.parentElement;
    item.parentElement.removeChild(item);
    renumberItems(); // 重新計算項次編號
}

function clearField() {
    const cneeCNameInput = document.getElementById('CNEE_C_NAME');
    if (cneeCNameInput) {
        cneeCNameInput.value = ''; // 清空輸入框內容
    }

    const buyerBanInput = document.getElementById('BUYER_BAN');
    if (buyerBanInput) {
        buyerBanInput.value = ''; // 清空輸入框內容
    }
}

// 創建項次的HTML結構
function createItemRow(data) {
    const row = document.createElement('div');
    row.className = 'item-row';
    const isChecked = data.ITEM_NO === '*'; // 根據 ITEM_NO 判斷是否勾選

    // 檢查並更新需要顯示的欄位
    checkFieldValues(data);

    // 計算 ITEM 編號，只為未勾選的項目進行編號
    let itemNumber = '*';
    if (!isChecked) {
        itemNumber = getNextItemNumber(); // 獲取當前的編號
    }

    let itemCount = 0; // 初始化項次計數
    
    row.innerHTML = `
        <div class="form-group fix item-no item-no-header" onclick="toggleSelect(this)">
            <label>${itemCount + 1}</label>
        </div>
        <div class="form-group fix">
            <input type="checkbox" class="ITEM_NO" tabindex="-1" ${isChecked ? 'checked' : ''}>
        </div>
        <div class="form-group fix item-number">
            <label>${itemNumber}</label>
        </div>
        ${createTextareaField('DESCRIPTION', data.DESCRIPTION.trim())}
        ${createInputField('QTY', data.QTY, true)}
        ${createInputField('DOC_UM', replaceValue('DOC_UM', data.DOC_UM), true)}
        ${createInputField('DOC_UNIT_P', data.DOC_UNIT_P, true)}
        ${createInputField('DOC_TOT_P', data.DOC_TOT_P, true)}
        ${createInputField('TRADE_MARK', data.TRADE_MARK, true)}
        ${createInputField('CCC_CODE', replaceValue('CCC_CODE', data.CCC_CODE), true)}
        ${createInputField('ST_MTD', data.ST_MTD, true)}
        ${createInputField('NET_WT', data.NET_WT, fieldsToShow.NET_WT, data.ISCALC_WT)}
        ${createInputField('ORG_COUNTRY', data.ORG_COUNTRY, fieldsToShow.ORG_COUNTRY)}
        ${createInputField('ORG_IMP_DCL_NO', data.ORG_IMP_DCL_NO, fieldsToShow.ORG_IMP_DCL_NO)}
        ${createInputField('ORG_IMP_DCL_NO_ITEM', data.ORG_IMP_DCL_NO_ITEM, fieldsToShow.ORG_IMP_DCL_NO_ITEM)}
        ${createInputField('SELLER_ITEM_CODE', data.SELLER_ITEM_CODE, fieldsToShow.SELLER_ITEM_CODE)}
        ${createInputField('BOND_NOTE', data.BOND_NOTE, fieldsToShow.BOND_NOTE)}        
        ${createInputField('GOODS_MODEL', data.GOODS_MODEL, fieldsToShow.GOODS_MODEL)}
        ${createInputField('GOODS_SPEC', data.GOODS_SPEC, fieldsToShow.GOODS_SPEC)}
        ${createInputField('CERT_NO', data.CERT_NO, fieldsToShow.CERT_NO)}
        ${createInputField('CERT_NO_ITEM', data.CERT_NO_ITEM, fieldsToShow.CERT_NO_ITEM)}
        ${createInputField('ORG_DCL_NO', data.ORG_DCL_NO, fieldsToShow.ORG_DCL_NO)}
        ${createInputField('ORG_DCL_NO_ITEM', data.ORG_DCL_NO_ITEM, fieldsToShow.ORG_DCL_NO_ITEM)}
        ${createInputField('EXP_NO', data.EXP_NO, fieldsToShow.EXP_NO)}
        ${createInputField('EXP_SEQ_NO', data.EXP_SEQ_NO, fieldsToShow.EXP_SEQ_NO)}
        ${createInputField('WIDE', data.WIDE, fieldsToShow.WIDE)}
        ${createInputField('WIDE_UM', replaceValue('WIDE_UM', data.WIDE_UM), fieldsToShow.WIDE_UM)}
        ${createInputField('LENGT_', data.LENGT_, fieldsToShow.LENGT_)}
        ${createInputField('LENGTH_UM', replaceValue('LENGTH_UM', data.LENGTH_UM), fieldsToShow.LENGTH_UM)}
        ${createInputField('ST_QTY', data.ST_QTY, fieldsToShow.ST_QTY)}
        ${createInputField('ST_UM', replaceValue('ST_UM', data.ST_UM), fieldsToShow.ST_UM)}
        <div class="form-group fix">
            <button class="delete-button" onclick="removeItem(this)" tabindex="-1">Ｘ</button>
        </div>
    `;
    itemCount++;

    // 將行添加到 DOM 後添加事件監聽器
    const cccCodeInput = row.querySelector('.CCC_CODE');
    if (cccCodeInput) {
        cccCodeInput.addEventListener('input', (event) => handleCCCCodeInput(event, cccCodeInput));
        cccCodeInput.addEventListener('change', (event) => handleCCCCodeInput(event, cccCodeInput));

        // 呼叫 handleCCCCodeInput 函式進行初始化
        handleCCCCodeInput(null, cccCodeInput);
    }

    // 延遲執行 initializeFieldVisibility 以確保欄位已處理完畢
    setTimeout(() => {
        initializeFieldVisibility();
    }, 0); // 可以將延遲時間設為 0，這樣會等當前的執行堆疊清空後再執行
    
    return row;
}

// 用於獲取下一個 ITEM 編號的函數
let currentItemNumber = 1;

function getNextItemNumber() {
    return currentItemNumber++;
}

let textareaCounter = 0;
let allExpanded = false; // 用於跟蹤所有文本域的展開/收合狀態

// 創建文本域
function createTextareaField(name, value) {
    const id = `textarea-${name}-${textareaCounter++}`;
    return `
        <div class="form-group declaration-item" style="width: 200%;">
            <textarea id="${id}" class="${name}" rows="1" onkeydown="handleTextareaArrowKeyNavigation(event)" onfocus="highlightRow(this)" onblur="removeHighlight(this)">${value || ''}</textarea>
        </div>
    `;
}

// 設置行數選項
let currentRowSetting = 0; // 用來追蹤當前行數狀態
const rowOptions = [1, 5, 10]; // 定義三種行數選項

function toggleAllTextareas() {
    // 更新行數設定，循環切換至下一個行數
    currentRowSetting = (currentRowSetting + 1) % rowOptions.length;
    const newRows = rowOptions[currentRowSetting];

    // 設置所有文本域的行數
    document.querySelectorAll('.declaration-item textarea').forEach(textarea => {
        textarea.rows = newRows;
    });

    // 更新按鈕文本根據行數
    const buttonText = newRows === 1 ? '展開全部品名' : (newRows === 5 ? '展開全部至 10 行' : '收合全部至 1 行');
    document.getElementById('toggle-all-btn').textContent = buttonText;
}

// 處理 Alt+w 鍵的函數
function handleAltWKey(event) {
    if (event.altKey && (event.key === 'w' || event.key === 'W')) {
        toggleAllTextareas();
    }
}

// 全域監聽 Alt+w 鍵，表示切換所有文本域顯示和隱藏
document.addEventListener('keydown', handleAltWKey);

// 函數實現文本域上下導航
function handleTextareaArrowKeyNavigation(event) {
    const currentTextarea = event.target;
    const start = currentTextarea.selectionStart;
    const value = currentTextarea.value;
    
    // 獲取光標位置的行號
    const lines = value.substr(0, start).split("\n");
    const currentLine = lines.length;
    const totalLines = value.split("\n").length;
    
    if (event.altKey) {
        // 當按住 Alt 鍵時，實現文本域上下導航
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateTextarea(currentTextarea, -1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateTextarea(currentTextarea, 1);
        }
    } else {
        // 當未按住 Alt 鍵時，檢查光標位置以決定是否進行導航
        if (event.key === 'ArrowUp' && currentLine === 1) {
            event.preventDefault();
            navigateTextarea(currentTextarea, -1);
        } else if (event.key === 'ArrowDown' && currentLine === totalLines) {
            event.preventDefault();
            navigateTextarea(currentTextarea, 1);
        }
    }
}

function navigateTextarea(currentTextarea, direction) {
    const allTextareas = Array.from(document.querySelectorAll(`.${currentTextarea.className.split(' ')[0]}`));
    const currentIndex = allTextareas.indexOf(currentTextarea);

    if (direction === -1 && currentIndex > 0) {
        allTextareas[currentIndex - 1].focus();
    } else if (direction === 1 && currentIndex < allTextareas.length - 1) {
        allTextareas[currentIndex + 1].focus();
    }
}

// 添加文本域的示例函數
function addTextarea() {
    const container = document.getElementById('textarea-container');
    const textareaHTML = createTextareaField('example-textarea', '這是初始值');
    container.innerHTML += textareaHTML;
}

// 創建輸入域
function createInputField(name, value, isVisible, iscalcWtValue) {
    let originalValue = value; // 儲存原始值，確保在錯誤時可讀取
    try {
        const visibilityClass = isVisible ? '' : 'hidden';
        const numberFields = ['QTY', 'DOC_UNIT_P', 'DOC_TOT_P', 'NET_WT', 'ORG_IMP_DCL_NO_ITEM', 'CERT_NO_ITEM', 'ORG_DCL_NO_ITEM', 'EXP_SEQ_NO', 'WIDE', 'LENGT_', 'ST_QTY'];
        const upperCaseFields = ['LOT_NO', 'SHPR_BONDED_ID', 'CNEE_COUNTRY_CODE', 'TO_CODE', 'DOC_CTN_UM', 'DCL_DOC_TYPE', 'TERMS_SALES', 'CURRENCY', 'DOC_UM', 'ST_MTD', 'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 'BOND_NOTE', 'CERT_NO', 'ORG_DCL_NO', 'EXP_NO', 'WIDE_UM', 'LENGTH_UM', 'ST_UM'];
        const inputType = numberFields.includes(name) ? 'number' : 'text';
        const onInputAttribute = numberFields.includes(name) ? 'oninput="calculateAmount(event); validateNumberInput(event)"' : '';
        const minAttribute = numberFields.includes(name) ? 'min="0"' : '';
        const readonlyAttribute = (name === 'DOC_TOT_P') ? 'readonly' : '';
        const onFocusAttribute = 'onfocus="highlightRow(this)"';
        const onBlurAttribute = 'onblur="removeHighlight(this)"';
        const onKeyDownAttribute = 'onkeydown="handleInputKeyDown(event, this)"';
        const onInputUpperCaseAttribute = upperCaseFields.includes(name) ? 'oninput="this.value = this.value.toUpperCase()"' : '';
    
        // 如果欄位是 `number`，移除非數字及小數點的字符
        if (numberFields.includes(name) && value !== undefined && value !== null) {
            value = String(value).replace(/[^\d.]/g, ''); // 移除非數字及小數點的字符
            value = parseFloat(value); // 轉換為數字
        }

        // 格式化 ORG_IMP_DCL_NO 和 ORG_DCL_NO 的值
        if (['ORG_IMP_DCL_NO', 'ORG_DCL_NO'].includes(name) && value) {
            // 先移除所有空格和斜線
            const trimmedValue = value.replace(/[\s/]+/g, '');
            
            if (trimmedValue.length === 12) {
                // 在第3碼之後插入兩個空格
                value = `${trimmedValue.slice(0, 2)}  ${trimmedValue.slice(2)}`;
            } else if (trimmedValue.length === 14) {
                // 直接使用去除空格和斜線後的值
                value = trimmedValue;
            }
        }
    
        const escapedValue = value ? escapeXml(value).trim() : ''; // 確保只有在必要時才轉義值並去除前後空格
    
        // 處理最大四捨五入至小數6位，並移除後面的多餘零
        const roundedValue = (['QTY', 'DOC_UNIT_P', 'NET_WT', 'WIDE', 'LENGT_', 'ST_QTY'].includes(name) && value) ? new Decimal(value).toFixed(6).replace(/\.?0+$/, '') : escapedValue;
        const inputField = `<input type="${inputType}" class="${name} ${name === 'CCC_CODE' ? 'CCC_CODE' : 'tax-code-input'}" value="${roundedValue}" ${onInputAttribute} ${minAttribute} ${readonlyAttribute} ${onFocusAttribute} ${onBlurAttribute} ${onKeyDownAttribute} ${onInputUpperCaseAttribute} style="flex: 1; margin-right: 0;">`;
    
        if (name === 'NET_WT') {
            const isCalcChecked = iscalcWtValue === 'Y' ? 'checked' : ''; // 根據 ISCALC_WT 判斷是否勾選
            return `
                <div class="form-group ${visibilityClass}" style="width: 24px; text-align: center; margin-left: 5px;">
                    <input type="checkbox" class="ISCALC_WT" ${isCalcChecked} tabindex="-1">
                </div>
                <div class="form-group ${visibilityClass}" style="width: 60%;">
                    ${inputField}
                </div>
            `;
        } else if (['DOC_TOT_P', 'TRADE_MARK'].includes(name)) {
            return `
                <div class="form-group ${visibilityClass}" style="width: 80%;">
                    ${inputField}
                </div>
            `;
        } else if (['QTY', 'DOC_UNIT_P', 'ST_QTY', 'GOODS_MODEL', 'GOODS_SPEC', 'WIDE', 'LENGT_'].includes(name)) {
            return `
                <div class="form-group ${visibilityClass}" style="width: 60%;">
                    ${inputField}
                </div>
            `;
        } else if (['DOC_UM', 'WIDE_UM', 'LENGTH_UM', 'ST_UM'].includes(name)) {
            return `
                <div class="form-group ${visibilityClass}" style="width: 40%;">
                    ${inputField}
                </div>
            `;
        } else if (['ST_MTD', 'ORG_COUNTRY', 'ORG_IMP_DCL_NO_ITEM', 'BOND_NOTE', 'CERT_NO_ITEM', 'ORG_DCL_NO_ITEM', 'EXP_SEQ_NO'].includes(name)) {
            return `
                <div class="form-group ${visibilityClass}" style="width: 30%;">
                    ${inputField}
                </div>
            `;
        } else if (['CCC_CODE'].includes(name)) {
            return `
                <div class="form-group ${visibilityClass}" style="width: 105%;">
                    ${inputField}
                </div>
            `;
        } else if (['SELLER_ITEM_CODE'].includes(name)) {
            return `
                <div class="form-group ${visibilityClass}" style="width: 130%;">
                    ${inputField}
                </div>
            `;
        } else {
            return `
                <div class="form-group ${visibilityClass}">
                    ${inputField}
                </div>
            `;
        }
    } catch (error) {
        const fieldLabels = {
            DESCRIPTION: "品名",
            QTY: "數量",
            DOC_UM: "單位",
            DOC_UNIT_P: "單價",
            DOC_TOT_P: "金額",
            TRADE_MARK: "商標",
            CCC_CODE: "稅則",
            ST_MTD: "統計方式",
            NET_WT: "淨重",
            ORG_COUNTRY: "生產國別",
            ORG_IMP_DCL_NO: "原進口報單號碼",
            ORG_IMP_DCL_NO_ITEM: "原進口報單項次",
            SELLER_ITEM_CODE: "賣方料號",
            BOND_NOTE: "保稅貨物註記",
            GOODS_MODEL: "型號",
            GOODS_SPEC: "規格",
            CERT_NO: "產證號碼",
            CERT_NO_ITEM: "產證項次",
            ORG_DCL_NO: "原進倉報單號碼",
            ORG_DCL_NO_ITEM: "原進倉報單項次",
            EXP_NO: "輸出許可號碼",
            EXP_SEQ_NO: "輸出許可項次",
            WIDE: "寬度(幅寬)",
            WIDE_UM: "寬度單位",
            LENGT_: "長度(幅長)",
            LENGTH_UM: "長度單位",
            ST_QTY: "統計數量",
            ST_UM: "統計單位"
        };

        const fieldLabel = fieldLabels[name] || name; // 若無對應中文名稱，顯示原始名稱
        alert(`[ ${fieldLabel} ] 欄位錯誤，值: ${originalValue || '無值'}，請檢查檔案後再重新匯入。`);
        throw error; // 中斷執行
    }
}

// 監聽鎖定全選/取消全選的功能
document.getElementById('selectAllWT').addEventListener('change', function() {
    const isChecked = this.checked;
    // 找到所有的 ISC_WT 多選框
    const checkboxes = document.querySelectorAll('.ISCALC_WT');
    
    // 將每個 ISC_WT 的狀態設定為與全選/取消全選多選框一致
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
});

function highlightRow(element) {
    const row = element.closest('.item-row');
    if (row) {
        row.classList.add('highlight-row');
    }
}

function removeHighlight(element) {
    const row = element.closest('.item-row');
    if (row) {
        row.classList.remove('highlight-row');
    }
}

function validateNumberInput(event) {
    const input = event.target;
    const value = input.value;
    const numberValue = value.replace(/[^0-9.]/g, ''); // 移除非數字字符（允許小數點）
    if (value !== numberValue) {
        input.value = numberValue;
    }
}

// 處理所有輸入框的鍵盤事件
function handleInputKeyDown(event, inputElement) {
    if (event.key === 'Enter' && inputElement.classList.contains('CCC_CODE')) {
        handleCCCCodeEnter(event, inputElement);
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        handleArrowKeyNavigation(event);
    }
}

// 函數禁止方向鍵調整數字並實現上下導航
function handleArrowKeyNavigation(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const currentInput = event.target;
        const allInputs = Array.from(document.querySelectorAll(`.${currentInput.className.split(' ')[0]}`));
        const currentIndex = allInputs.indexOf(currentInput);

        if (event.key === 'ArrowUp' && currentIndex > 0) {
            allInputs[currentIndex - 1].focus();
        } else if (event.key === 'ArrowDown' && currentIndex < allInputs.length - 1) {
            allInputs[currentIndex + 1].focus();
        }
    }
}

function initializeListeners() {
    // 監聽所有「大品名註記」checkbox 的變化事件
    document.querySelectorAll('.ITEM_NO').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            renumberItems(); // 在變化時即時重新編號
        });
    });
}

// 綁定刪除按鈕事件，為刪除按鈕新增點擊事件
document.querySelector(".delete-item-btn").addEventListener("click", () => {
    const input = prompt("請輸入要刪除的 No. (例如: 3,5-7)");
    if (input) {
        deleteItemsByNo(input);
    }
});

// 刪除 No. 對應的項目，支援單一或範圍
function deleteItemsByNo(input) {
    const ranges = input.split(',').map(item => item.trim());
    const numbersToDelete = new Set();

    ranges.forEach(range => {
        if (range.includes('-')) {
            // 處理範圍，例如 5-7
            const [start, end] = range.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    numbersToDelete.add(i);
                }
            } else {
                alert(`無效範圍: ${range}`);
                return;
            }
        } else {
            // 處理單一數值，例如 3
            const num = Number(range);
            if (!isNaN(num)) {
                numbersToDelete.add(num);
            } else {
                alert(`無效數值: ${range}`);
                return;
            }
        }
    });

    deleteItems(numbersToDelete);
}

// 根據 No. 值刪除對應的項目
function deleteItems(numbersToDelete) {
    const items = document.querySelectorAll("#item-container .item-row");
    let found = false;

    items.forEach(item => {
        const noLabel = item.querySelector('.item-no label');
        const noValue = Number(noLabel.textContent);

        if (numbersToDelete.has(noValue)) {
            item.remove();
            found = true;
        }
    });

    if (found) {
        renumberItems();
    } else {
        alert("未找到指定的 No.");
    }
}

// 重新編號所有項次
function renumberItems() {
    let itemCount = 0; // 用於 NO 編號
    let currentItemNumber = 1; // 用於 ITEM 編號

    // 確保遍歷的是包含在 .item-row 中的所有項次
    document.querySelectorAll("#item-container .item-row").forEach((item) => {
        itemCount++;
        
        // 更新 NO 編號
        item.querySelector('.item-no label').textContent = `${itemCount}`;

        // 更新 ITEM 編號，只為未勾選的項目分配編號
        const checkbox = item.querySelector('.ITEM_NO');
        const itemNumberLabel = item.querySelector('.item-number label');
        if (!checkbox.checked) {
            itemNumberLabel.textContent = `${currentItemNumber++}`;
        } else {
            itemNumberLabel.textContent = '*'; // 已勾選的項目顯示 '*'
        }
    });
}

// 在頁面載入或項次更新後初始化監聽器
initializeListeners();

// 監聽數量和單價輸入框的變化事件，進行自動計算
document.querySelectorAll('.QTY, .DOC_UNIT_P').forEach(input => {
    input.addEventListener('input', calculateAmount);
});

// 定義 calculateAmount 函數
function calculateAmount(event) {
    const row = event.target.closest('.item-row');
    if (!row) return; // 防止無效的行操作

    // 使用 Decimal.js 進行高精度運算
    const qty = new Decimal(row.querySelector('.QTY').value || 0); // 數量
    const unitPrice = new Decimal(row.querySelector('.DOC_UNIT_P').value || 0); // 單價
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput?.value, 10); // 使用安全解析

    // 確保小數點位數最小為 0，並預設為 2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    // 計算總金額
    const totalPrice = qty.mul(unitPrice);
    const totalPriceField = row.querySelector('.DOC_TOT_P');

    // 根據總金額設定輸出值
    if (totalPrice.isZero()) {
        totalPriceField.value = ''; // 總金額為 0 時清空欄位
    } else {
        // 使用 Decimal.js 確保精準處理
        totalPriceField.value = totalPrice
            .toDecimalPlaces(10, Decimal.ROUND_UP) // 保留 10 位精度，四捨五入
            .toFixed(decimalPlaces); // 最終輸出指定小數位數
    }
}

function updateAllTariffs() {
    const items = document.querySelectorAll('#item-container .item-row');
    items.forEach(row => {
        const cccCodeElement = row.querySelector('.CCC_CODE');
        if (cccCodeElement && cccCodeElement.value.trim() !== '') {
            const keyword = cccCodeElement.value.trim().replace(/[.\-\s]/g, ''); // 清理代碼格式
            updateTariff(cccCodeElement, keyword); // 執行更新
        }
    });
}

// 即時更新金額
document.getElementById('decimal-places').addEventListener('input', () => {
    updateItemAmounts();
});

function updateItemAmounts() {
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    const items = document.querySelectorAll('#item-container .item-row');
    items.forEach((item) => {
        // 更新金額
        calculateAmountsForRow(item, decimalPlaces);
    });
}

// 定義快捷鍵監聽
document.addEventListener("keydown", function(event) {
    // 檢查是否按下 Alt + Q 或 Alt + q
    if (event.altKey && (event.key === 'Q' || event.key === 'q')) {
        event.preventDefault(); // 防止預設行為
        calculate(); // 呼叫計算函數
    }
});

// 更新DOC_OTR_DESC的值，勾選時加入描述，取消勾選時移除描述
function updateDocOtrDesc() {
    let copyDescMap = {
        'copy_3_e': '申請沖退原料稅（E化退稅）',
        'copy_3': '申請報單副本第三聯（沖退原料稅用聯）\n附外銷品使用原料及其供應商資料清表',
        'copy_4': '申請報單副本第四聯（退內地稅用聯）\n稅照號碼：',
        'copy_5': '申請報單副本第五聯（出口證明用聯）'
    };

    const docOtrDescElement = document.getElementById('DOC_OTR_DESC');
    let currentDesc = docOtrDescElement.value;

    // 先移除所有與申請相關的描述
    for (let key in copyDescMap) {
        const regex = new RegExp(copyDescMap[key].replace(/\n/g, '\\n'), 'g'); // 用正則表達式匹配換行符號
        currentDesc = currentDesc.replace(regex, '').trim();  // 移除相關的描述並修整空白
    }

    let copyDesc = '';  // 儲存新的描述

    // 檢查每個選項是否被勾選，如果勾選，加入新的描述
    for (let key in copyDescMap) {
        if (document.getElementById(key).checked) {
            copyDesc += (copyDesc ? '\n' : '') + copyDescMap[key];
        }
    }

    // 如果現有內容存在，則在最後加上換行符號
    if (currentDesc) {
        currentDesc += '\n';
    }

    // 更新文本框的值，將現有描述和新的描述結合
    docOtrDescElement.value = currentDesc + copyDesc;
}

// 更新REMARK1的值
function updateRemark1() {
    let additionalDesc = '';
    if (document.getElementById('copy_3_e').checked) {
        additionalDesc = '申請沖退原料稅（E化退稅）';
    }
    if (document.getElementById('copy_3').checked) {
        additionalDesc += (additionalDesc ? '\n' : '') + '申請報單副本第三聯（沖退原料稅用聯）';
    }
    if (document.getElementById('copy_4').checked) {
        additionalDesc += (additionalDesc ? '\n' : '') + '申請報單副本第四聯（退內地稅用聯）';
    }
    if (document.getElementById('copy_5').checked) {
        additionalDesc += (additionalDesc ? '\n' : '') + '申請報單副本第五聯（出口證明用聯）';
    }

    const remark1Element = document.getElementById('REMARK1');
    const currentRemark = remark1Element.value.split('\n').filter(line => !line.startsWith('申請')).join('\n');
    remark1Element.value = currentRemark.trim() + (currentRemark ? '\n' : '') + additionalDesc;
}

// 根據REMARK1欄位更新checkbox的狀態
function updateRemark1FromImport() {
    const remark1Element = document.getElementById('REMARK1');
    const remark1Value = remark1Element.value;

    document.getElementById('copy_3_e').checked = remark1Value.includes('申請沖退原料稅（E化退稅）');
    document.getElementById('copy_3').checked = remark1Value.includes('申請報單副本第三聯（沖退原料稅用聯）');
    document.getElementById('copy_4').checked = remark1Value.includes('申請報單副本第四聯（退內地稅用聯）');
    document.getElementById('copy_5').checked = remark1Value.includes('申請報單副本第五聯（出口證明用聯）');

    updateRemark1(); // 確保REMARK1欄位值與checkbox狀態同步
}

// 讀取替換檔(單位及稅則匹配)
const csvUrl = 'replacements.csv';
let replacements = {};
Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(row => {
            replacements[row.key] = row.value;
        });
        console.log('Replacements loaded:', replacements);
    }
});

function replaceValue(className, value) {
    if (className === 'DOC_UM' || className === 'WIDE_UM' || className === 'LENGTH_UM' || className === 'ST_UM' || className === 'CCC_CODE') {
        // 確保值是字串
        if (typeof value !== 'string') {
            value = String(value);
        }

        // 將值轉為大寫
        value = value.toUpperCase();

        // 去除值中的符號 '.' 、 '-' 和空格
        value = value.replace(/[.\- ]/g, '');

        // 取稅則前10碼至6碼查找替換，不改變原來的值，如果找到才替換
        if (className === 'CCC_CODE') {
            if (value.length >= 10 && replacements[value.substring(0, 10)]) {
                value = replacements[value.substring(0, 10)];
            } else if (value.length >= 9 && replacements[value.substring(0, 9)]) {
                value = replacements[value.substring(0, 9)];
            } else if (value.length >= 8 && replacements[value.substring(0, 8)]) {
                value = replacements[value.substring(0, 8)];
            } else if (value.length >= 7 && replacements[value.substring(0, 7)]) {
                value = replacements[value.substring(0, 7)];
            } else if (value.length >= 6 && replacements[value.substring(0, 6)]) {
                value = replacements[value.substring(0, 6)];
            } else if (value.length >= 10) {
                // 如果都沒有找到，直接取前10碼
                value = value.substring(0, 10);
            }
        } else { 
            if (replacements[value]) {
                value = replacements[value];
            }
        }

        // 檢查 CCC_CODE 是否為 11 碼數字並重新分配符號
        if (className === 'CCC_CODE' && /^\d{11}$/.test(value)) {
            value = `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}.${value.slice(8, 10)}-${value.slice(10)}`;
        }
    }
    return value;
}

// 清空現有數據的函數
function clearExistingData() {

    // 清空出口報單表頭欄位
    document.getElementById('FILE_NO').value = '';
    document.getElementById('LOT_NO').value = '';
    document.getElementById('SHPR_BAN_ID').value = '';
    document.getElementById('SHPR_BONDED_ID').value = '';
    document.getElementById('SHPR_C_NAME').value = '';
    document.getElementById('SHPR_E_NAME').value = '';
    document.getElementById('SHPR_C_ADDR').value = '';
    document.getElementById('SHPR_E_ADDR').value = '';
    document.getElementById('SHPR_TEL').value = '';
    document.getElementById('CNEE_C_NAME').value = '';
    document.getElementById('CNEE_E_NAME').value = '';
    document.getElementById('CNEE_E_ADDR').value = '';
    document.getElementById('CNEE_COUNTRY_CODE').value = '';
    document.getElementById('CNEE_BAN_ID').value = '';
    document.getElementById('BUYER_E_NAME').value = '';
    document.getElementById('BUYER_E_ADDR').value = '';
    document.getElementById('TO_CODE').value = '';
    document.getElementById('TO_DESC').value = '';
    document.getElementById('TOT_CTN').value = '';
    document.getElementById('DOC_CTN_UM').value = '';
    document.getElementById('CTN_DESC').value = '';
    document.getElementById('DCL_GW').value = '';
    document.getElementById('DCL_NW').value = '';
    document.getElementById('DCL_DOC_TYPE').value = '';
    document.getElementById('TERMS_SALES').value = '';
    document.getElementById('CURRENCY').value = '';
    document.getElementById('CAL_IP_TOT_ITEM_AMT').value = '';
    document.getElementById('FRT_AMT').value = '';
    document.getElementById('INS_AMT').value = '';
    document.getElementById('ADD_AMT').value = '';
    document.getElementById('SUBTRACT_AMT').value = '';
    document.getElementById('DOC_MARKS_DESC').value = '';
    document.getElementById('DOC_OTR_DESC').value = '';
    document.getElementById('REMARK1').value = '';
    document.getElementById('FAC_BAN_ID_EX').value = '';
    document.getElementById('FAC_BONDED_ID_EX').value = '';
    document.getElementById('FAC_BAN_ID').value = '';
    document.getElementById('FAC_BONDED_ID').value = '';
    document.getElementById('IN_BONDED_BAN').value = '';
    document.getElementById('IN_BONDED_CODE').value = '';

    // 清空出口報單項次欄位
    var itemContainer = document.getElementById('item-container');
    if (itemContainer) {
        itemContainer.innerHTML = ''; // 清空項次
    }

    // 清空申請報單副本欄位
    document.getElementById('copy_3_e').checked = false;
    document.getElementById('copy_3').checked = false;
    document.getElementById('copy_4').checked = false;
    document.getElementById('copy_5').checked = false;
}

// 監聽 copy_3_e 和 copy_3 的勾選事件
document.getElementById('copy_3_e').addEventListener('change', function () {
    if (this.checked) {
        document.getElementById('copy_3').checked = false; // 取消 copy_3 的勾選
    }
});

document.getElementById('copy_3').addEventListener('change', function () {
    if (this.checked) {
        document.getElementById('copy_3_e').checked = false; // 取消 copy_3_e 的勾選
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const dclDocTypeElement = document.getElementById("DCL_DOC_TYPE");
    const generalWarehouseCheckbox = document.getElementById("general-warehouse");

    if (dclDocTypeElement && generalWarehouseCheckbox) {
        // 監聽 DCL_DOC_TYPE 變更，當為 F5 時自動勾選一般倉
        dclDocTypeElement.addEventListener("input", function () {
            if (dclDocTypeElement.value.trim().toUpperCase() === "F5") {
                generalWarehouseCheckbox.checked = true;
            }
        });

        // 監聽一般倉勾選框變更，若取消勾選且 DCL_DOC_TYPE 為 F5，則清空 DCL_DOC_TYPE
        generalWarehouseCheckbox.addEventListener("change", function () {
            if (!generalWarehouseCheckbox.checked && dclDocTypeElement.value.trim().toUpperCase() === "F5") {
                dclDocTypeElement.value = "";
            }
        });
    }
});
