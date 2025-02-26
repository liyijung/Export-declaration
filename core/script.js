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

// 查找資料並自動帶入表單
function searchData(showErrorMessage = false) {
    let searchCode = document.getElementById('SHPR_BAN_ID').value.trim();

    // 如果輸入不滿 8 碼，清空資料並隱藏錯誤訊息，不進行匹配操作
    if (searchCode.length < 8) {
        document.getElementById('DCL_DOC_EXAM').value = '';
        document.getElementById('SHPR_C_NAME').value = '';
        document.getElementById('SHPR_E_NAME').value = '';
        document.getElementById('SHPR_C_ADDR').value = '';
        document.getElementById('SHPR_E_ADDR').value = '';
        document.getElementById('SHPR_TEL').value = '';
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
                    // 清空欄位
                    document.getElementById('SHPR_C_NAME').value = '';
                    document.getElementById('SHPR_E_NAME').value = '';
                    document.getElementById('SHPR_C_ADDR').value = '';
                    document.getElementById('SHPR_E_ADDR').value = '';
                    document.getElementById('SHPR_TEL').value = '';
                    noDataMessage.style.display = 'inline'; // 顯示"查無資料"訊息
                }
            }
        });
    }
    thingsToNote(); // 出口備註
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
    document.getElementById('import-excel').addEventListener('change', handleFile, false);

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

// 標記及貨櫃號碼 MADE IN
function fillText(text) {
    const textarea = document.getElementById('DOC_MARKS_DESC');
    textarea.value = textarea.value.trim() + '\n' + text;
    textarea.focus(); // 將焦點設回欄位
}

// 標記及貨櫃號碼及其它申報事項展開/折疊
function toggleRows(textareaId, button) {
    const textarea = document.getElementById(textareaId);
    const currentRows = textarea.rows;

    if (currentRows === 5) {
        textarea.rows = 10;
        button.textContent = "展開";
    } else if (currentRows === 10) {
        textarea.rows = 15;
        button.textContent = "折疊";
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

// 開啟新增項次的彈跳框
function openItemModal() {
    // 從 localStorage 讀取記憶的內容
    const savedItemData = JSON.parse(localStorage.getItem('itemModalData')) || {};

    // 設定輸入框值
    document.getElementById('ITEM_NO').checked = savedItemData.ITEM_NO || false;
    document.getElementById('DESCRIPTION').value = savedItemData.DESCRIPTION || '';
    document.getElementById('QTY').value = savedItemData.QTY || '';
    document.getElementById('DOC_UM').value = savedItemData.DOC_UM || '';
    document.getElementById('DOC_UNIT_P').value = savedItemData.DOC_UNIT_P || '';
    document.getElementById('DOC_TOT_P').value = savedItemData.DOC_TOT_P || '';
    document.getElementById('TRADE_MARK').value = savedItemData.TRADE_MARK || '';
    document.getElementById('CCC_CODE').value = savedItemData.CCC_CODE || '';
    document.getElementById('ST_MTD').value = savedItemData.ST_MTD || '';
    document.getElementById('NET_WT').value = savedItemData.NET_WT || '';        
    document.getElementById('ORG_COUNTRY').value = savedItemData.ORG_COUNTRY || '';
    document.getElementById('ORG_IMP_DCL_NO').value = savedItemData.ORG_IMP_DCL_NO || '';
    document.getElementById('ORG_IMP_DCL_NO_ITEM').value = savedItemData.ORG_IMP_DCL_NO_ITEM || '';
    document.getElementById('SELLER_ITEM_CODE').value = savedItemData.SELLER_ITEM_CODE || '';
    document.getElementById('BOND_NOTE').value = savedItemData.BOND_NOTE || '';    
    document.getElementById('GOODS_MODEL').value = savedItemData.GOODS_MODEL || '';
    document.getElementById('GOODS_SPEC').value = savedItemData.GOODS_SPEC || '';
    document.getElementById('CERT_NO').value = savedItemData.CERT_NO || '';
    document.getElementById('CERT_NO_ITEM').value = savedItemData.CERT_NO_ITEM || '';
    document.getElementById('ORG_DCL_NO').value = savedItemData.ORG_DCL_NO || '';
    document.getElementById('ORG_DCL_NO_ITEM').value = savedItemData.ORG_DCL_NO_ITEM || '';
    document.getElementById('EXP_NO').value = savedItemData.EXP_NO || '';
    document.getElementById('EXP_SEQ_NO').value = savedItemData.EXP_SEQ_NO || '';
    document.getElementById('WIDE').value = savedItemData.WIDE || '';
    document.getElementById('WIDE_UM').value = savedItemData.WIDE_UM || '';
    document.getElementById('LENGT_').value = savedItemData.LENGT_ || '';
    document.getElementById('LENGTH_UM').value = savedItemData.LENGTH_UM || '';
    document.getElementById('ST_QTY').value = savedItemData.ST_QTY || '';
    document.getElementById('ST_UM').value = savedItemData.ST_UM || '';

    // 填充下拉選單
    const copyItemSelect = document.getElementById('COPY_ITEM');
    copyItemSelect.innerHTML = '<option value="">選擇項次 No.</option>';
    document.querySelectorAll('#item-container .item-row').forEach((item, index) => {
        const description = item.querySelector('.DESCRIPTION').value;
        copyItemSelect.innerHTML += `<option value="${index}">${index + 1} - 品名: ${description}</option>`;
    });

    // 顯示彈跳框
    const itemModal = document.getElementById('item-modal');
    itemModal.style.display = 'flex';

    // 允許點擊背後的頁面欄位
    itemModal.style.pointerEvents = 'none';
    itemModal.children[0].style.pointerEvents = 'auto'; // 只允許模態框內部的第一個子元素接收點擊

    // 滾動到最上方
    document.querySelector('#item-modal .modal-content').scrollTop = 0;

    // 監聽數量和單價輸入框的變化事件，進行自動計算
    document.getElementById('QTY').addEventListener('input', calculateModalAmount);
    document.getElementById('DOC_UNIT_P').addEventListener('input', calculateModalAmount);

    // 設定光標到特定的輸入欄位
    const firstInputField = document.getElementById('DESCRIPTION');
    if (firstInputField) {
        firstInputField.focus();
    }

    // 加入即時監聽事件
    document.getElementById('WIDE').addEventListener('input', calculateSTQTYForMTK);
    document.getElementById('WIDE_UM').addEventListener('change', calculateSTQTYForMTK);
    document.getElementById('LENGT_').addEventListener('input', calculateSTQTYForMTK);
    document.getElementById('LENGTH_UM').addEventListener('change', calculateSTQTYForMTK);
    document.getElementById('ST_UM').addEventListener('change', calculateSTQTYForMTK);
}

// 新增監聽 Alt+a 鍵，表示開啟新增項次彈跳框
document.addEventListener('keydown', function(event) {
    if (event.altKey && (event.key === 'a' || event.key === 'A')) {
        openItemModal();
    }
});

// 新增監聽 Alt+s 鍵，表示儲存新增項次
document.addEventListener('keydown', function(event) {
    if (event.altKey && (event.key === 's' || event.key === 'S')) {
        saveItem();
    }
});

// 添加鍵盤事件監聽
document.addEventListener('keydown', function escHandler(event) {
    if (event.key === 'Escape') { // 檢查是否按下ESC鍵
        const cancelButton = document.querySelector('.floating-buttons button[onclick="closeItemModal()"]'); // 選取取消按鈕
        if (cancelButton) {
            cancelButton.focus(); // 將焦點移至取消按鈕
        }
    }
});

// 計算彈跳框中的金額
function calculateModalAmount() {
    const qty = document.getElementById('QTY').value || 0;
    const unitPrice = document.getElementById('DOC_UNIT_P').value || 0;
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    const amount = qty * unitPrice;
    document.getElementById('DOC_TOT_P').value = (amount === 0) ? '' : new Decimal(amount).toDecimalPlaces(10, Decimal.ROUND_UP).toFixed(decimalPlaces);
}

// 複製選定的項次內容
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('COPY_ITEM').addEventListener('change', copyItem);

    function copyItem() {
        const copyItemSelect = document.getElementById('COPY_ITEM');
        const selectedItemIndex = copyItemSelect.value;

        const itemFields = [
            'ITEM_NO', 'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P', 'TRADE_MARK', 'CCC_CODE', 
            'ST_MTD', 'NET_WT', 'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 'ORG_IMP_DCL_NO_ITEM', 'SELLER_ITEM_CODE', 
            'BOND_NOTE', 'GOODS_MODEL', 'GOODS_SPEC', 'CERT_NO', 'CERT_NO_ITEM', 'ORG_DCL_NO', 'ORG_DCL_NO_ITEM', 
            'EXP_NO', 'EXP_SEQ_NO', 'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_UM' // 'ST_QTY'不複製
        ];

        if (selectedItemIndex !== "") {
            const item = document.querySelectorAll('#item-container .item-row')[selectedItemIndex];
            itemFields.forEach(field => {
                const fieldElement = document.getElementById(field);
                if (fieldElement.type === 'checkbox') {
                    fieldElement.checked = item.querySelector(`.${field}`).checked;
                } else {
                    fieldElement.value = item.querySelector(`.${field}`).value;
                }
            });
        } else {
            itemFields.forEach(field => {
                const fieldElement = document.getElementById(field);
                if (fieldElement.type === 'checkbox') {
                    fieldElement.checked = false;
                } else {
                    fieldElement.value = '';
                }
            });
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const qtyInput = document.getElementById("QTY");
    const docUmInput = document.getElementById("DOC_UM");
    const netWtInput = document.getElementById("NET_WT");

    function syncNetWeight() {
        if (docUmInput.value.trim().toUpperCase() === "KGM") {
            netWtInput.value = qtyInput.value;
        }
    }

    // 監聽 QTY 變化，當單位為 KGM 時同步更新 NET_WT
    qtyInput.addEventListener("input", syncNetWeight);

    // 監聽 DOC_UM 變化，當變更為 KGM 時立即同步 NET_WT
    docUmInput.addEventListener("input", syncNetWeight);
});

// 記憶按鍵的功能
function rememberItemModalData() {
    // 儲存當前彈跳框的內容到 localStorage
    const itemData = {
        ITEM_NO: document.getElementById('ITEM_NO').checked,
        DESCRIPTION: document.getElementById('DESCRIPTION').value,
        QTY: document.getElementById('QTY').value,
        DOC_UM: document.getElementById('DOC_UM').value,
        DOC_UNIT_P: document.getElementById('DOC_UNIT_P').value,
        DOC_TOT_P: document.getElementById('DOC_TOT_P').value,
        TRADE_MARK: document.getElementById('TRADE_MARK').value,
        CCC_CODE: document.getElementById('CCC_CODE').value,
        ST_MTD: document.getElementById('ST_MTD').value,
        NET_WT: document.getElementById('NET_WT').value,        
        ORG_COUNTRY: document.getElementById('ORG_COUNTRY').value,
        ORG_IMP_DCL_NO: document.getElementById('ORG_IMP_DCL_NO').value,
        ORG_IMP_DCL_NO_ITEM: document.getElementById('ORG_IMP_DCL_NO_ITEM').value,
        SELLER_ITEM_CODE: document.getElementById('SELLER_ITEM_CODE').value,
        BOND_NOTE: document.getElementById('BOND_NOTE').value,    
        GOODS_MODEL: document.getElementById('GOODS_MODEL').value,
        GOODS_SPEC: document.getElementById('GOODS_SPEC').value,
        CERT_NO: document.getElementById('CERT_NO').value,
        CERT_NO_ITEM: document.getElementById('CERT_NO_ITEM').value,
        ORG_DCL_NO: document.getElementById('ORG_DCL_NO').value,
        ORG_DCL_NO_ITEM: document.getElementById('ORG_DCL_NO_ITEM').value,
        EXP_NO: document.getElementById('EXP_NO').value,
        EXP_SEQ_NO: document.getElementById('EXP_SEQ_NO').value,
        WIDE: document.getElementById('WIDE').value,
        WIDE_UM: document.getElementById('WIDE_UM').value,
        LENGT_: document.getElementById('LENGT_').value,
        LENGTH_UM: document.getElementById('LENGTH_UM').value,
        ST_UM: document.getElementById('ST_UM').value
    };

    localStorage.setItem('itemModalData', JSON.stringify(itemData));
    alert("彈跳框內容已記憶");
}

// 清空彈跳框的內容
function clearAllFields() {
    document.getElementById('ITEM_NO').checked = false;
    document.getElementById('DESCRIPTION').value = '';
    document.getElementById('QTY').value = '';
    document.getElementById('DOC_UM').value = '';
    document.getElementById('DOC_UNIT_P').value = '';
    document.getElementById('DOC_TOT_P').value = '';
    document.getElementById('TRADE_MARK').value = '';
    document.getElementById('CCC_CODE').value = '';
    document.getElementById('ST_MTD').value = '';
    document.getElementById('NET_WT').value = '';
    document.getElementById('ORG_COUNTRY').value = '';
    document.getElementById('ORG_IMP_DCL_NO').value = '';
    document.getElementById('ORG_IMP_DCL_NO_ITEM').value = '';
    document.getElementById('SELLER_ITEM_CODE').value = '';
    document.getElementById('BOND_NOTE').value = '';
    document.getElementById('GOODS_MODEL').value = '';
    document.getElementById('GOODS_SPEC').value = '';
    document.getElementById('CERT_NO').value = '';
    document.getElementById('CERT_NO_ITEM').value = '';
    document.getElementById('ORG_DCL_NO').value = '';
    document.getElementById('ORG_DCL_NO_ITEM').value = '';
    document.getElementById('EXP_NO').value = '';
    document.getElementById('EXP_SEQ_NO').value = '';
    document.getElementById('WIDE').value = '';
    document.getElementById('WIDE_UM').value = '';
    document.getElementById('LENGT_').value = '';
    document.getElementById('LENGTH_UM').value = '';
    document.getElementById('ST_QTY').value = '';
    document.getElementById('ST_UM').value = '';

    // 清空下拉選單的選擇
    document.getElementById('COPY_ITEM').selectedIndex = 0;
}

// 彈跳框品名 展開/折疊
function toggleDescriptionRows() {
    const textarea = document.getElementById("DESCRIPTION");
    const button = event.target; // 取得觸發此事件的按鈕

    if (textarea.rows === 5) {
        textarea.rows = 10;
        button.textContent = "折疊";
    } else {
        textarea.rows = 5;
        button.textContent = "展開";
    }
}

// 關閉新增項次的彈跳框
function closeItemModal() {
    // 隱藏彈跳框
    const itemModal = document.getElementById('item-modal');
    itemModal.style.display = 'none';

    // 移除事件監聽器
    document.removeEventListener('keydown', handleEscKeyForCancel);
    document.removeEventListener('keydown', handleAltSForSave);
}

// 儲存新增的項次
function saveItem() {
    const itemContainer = document.getElementById('item-container');
    let descriptionText = document.getElementById('DESCRIPTION').value.trim();

    // 若空格超過 10 個，則替換為換行符號 "\n" 及 移除多個連續的空行
    descriptionText = descriptionText.replace(/ {10,}/g, '\n').replace(/\n\s*\n/g, '\n');
    
    const newItemData = {
        ITEM_NO: document.getElementById('ITEM_NO').checked ? '*' : '', // 根據勾選狀態設置 ITEM_NO
        DESCRIPTION: descriptionText, // 使用替換後的 DESCRIPTION
        QTY: document.getElementById('QTY').value.trim(),
        DOC_UM: document.getElementById('DOC_UM').value.trim(),
        DOC_UNIT_P: document.getElementById('DOC_UNIT_P').value.trim(),
        DOC_TOT_P: document.getElementById('DOC_TOT_P').value.trim(),
        TRADE_MARK: document.getElementById('TRADE_MARK').value.trim(),
        CCC_CODE: document.getElementById('CCC_CODE').value.trim(),
        ST_MTD: document.getElementById('ST_MTD').value.trim(),
        NET_WT: document.getElementById('NET_WT').value.trim(),        
        ORG_COUNTRY: document.getElementById('ORG_COUNTRY').value.trim(),
        ORG_IMP_DCL_NO: document.getElementById('ORG_IMP_DCL_NO').value.trim(),
        ORG_IMP_DCL_NO_ITEM: document.getElementById('ORG_IMP_DCL_NO_ITEM').value.trim(),
        SELLER_ITEM_CODE: document.getElementById('SELLER_ITEM_CODE').value.trim(),
        BOND_NOTE: document.getElementById('BOND_NOTE').value.trim(),        
        GOODS_MODEL: document.getElementById('GOODS_MODEL').value.trim(),
        GOODS_SPEC: document.getElementById('GOODS_SPEC').value.trim(),
        CERT_NO: document.getElementById('CERT_NO').value.trim(),
        CERT_NO_ITEM: document.getElementById('CERT_NO_ITEM').value.trim(),
        ORG_DCL_NO: document.getElementById('ORG_DCL_NO').value.trim(),
        ORG_DCL_NO_ITEM: document.getElementById('ORG_DCL_NO_ITEM').value.trim(),
        EXP_NO: document.getElementById('EXP_NO').value.trim(),
        EXP_SEQ_NO: document.getElementById('EXP_SEQ_NO').value.trim(),
        WIDE: document.getElementById('WIDE').value.trim(),
        WIDE_UM: document.getElementById('WIDE_UM').value.trim(),
        LENGT_: document.getElementById('LENGT_').value.trim(),
        LENGTH_UM: document.getElementById('LENGTH_UM').value.trim(),
        ST_QTY: document.getElementById('ST_QTY').value.trim(),
        ST_UM: document.getElementById('ST_UM').value.trim(),
    };

    // 在儲存前檢查並更新 fieldsToShow 的狀態
    checkFieldValues(newItemData);

    const item = createItemRow(newItemData);

    // 設置行數選項根據 currentRowSetting
    const textareas = item.querySelectorAll('.DESCRIPTION');
    const newRows = rowOptions[currentRowSetting];
    textareas.forEach(textarea => {
        textarea.rows = newRows; // 根據 currentRowSetting 設置行數
    });

    // 應用顯示的欄位
    applyToggleFieldsToRow(item);

    itemContainer.appendChild(item);

    // 新增項次後重新初始化監聽器
    initializeListeners();
    
    // 重新編號所有項次
    renumberItems();

    // 自動計算新項次的金額
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    calculateAmountsForRow(item, decimalPlaces);

    // 先應用選擇的欄位顯示，再檢查更新欄位可見性
    applyToggleFields();
    initializeFieldVisibility(); // 最後確保所有操作完成後調用

    closeItemModal();
}

// 函數：應用顯示的欄位到新項次
function applyToggleFieldsToRow(row) {
    // 從使用者選擇的欄位中取得目前顯示的欄位選項
    const selectedOptions = Array.from(document.getElementById('field-select').selectedOptions).map(option => option.value);

    // 所有可能的欄位
    const allFields = [
        'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P', 'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'ISCALC_WT', 'NET_WT',
        'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 
        'ORG_IMP_DCL_NO_ITEM', 'SELLER_ITEM_CODE', 'BOND_NOTE', 'GOODS_MODEL', 'GOODS_SPEC', 
        'CERT_NO', 'CERT_NO_ITEM', 'ORG_DCL_NO', 'ORG_DCL_NO_ITEM', 'EXP_NO', 'EXP_SEQ_NO', 
        'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_QTY', 'ST_UM'
    ];

    allFields.forEach(field => {
        const fieldElement = row.querySelector(`.${field}`);
        const formGroup = fieldElement.closest('.form-group');
        if (formGroup) {
            // 如果該欄位在 fieldsToShow 中已經被標記為 true，則始終顯示它
            if (fieldsToShow[field] || selectedOptions.includes(field)) {
                formGroup.classList.remove('hidden');
            } else {
                formGroup.classList.add('hidden');
            }
        }
    });
}

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
    const qty = itemRow.querySelector('.QTY');
    const docum = itemRow.querySelector('.DOC_UM');
    const stqty = itemRow.querySelector('.ST_QTY');
    const stum = itemRow.querySelector('.ST_UM');

    if (qty.value === '' && stum.value !== 'MTK') {
        stqty.value = '';  // 如果數量為空，則清空 ST_QTY
    } else if (stum.value === docum.value && stum.value !== '') {
        stqty.value = qty.value;
    } else if (docum.value === 'KPC' && stum.value === 'PCE') {
        stqty.value = qty.value * 1000;
    }
}

// 即時更新 NET_WT
function updateNET_WT(itemRow) {
    const qty = itemRow.querySelector('.QTY');
    const docum = itemRow.querySelector('.DOC_UM');
    const netwt = itemRow.querySelector('.NET_WT');

    const qtyValue = parseFloat(qty.value) || '';
    const documValue = docum.value.trim();

    if (documValue === 'KGM') {
        netwt.value = qtyValue;  // 當 DOC_UM 為 KGM，則 NET_WT = QTY
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

// 開啟顯示隱藏欄位彈跳框
function openToggleFieldsModal() {
    const toggleFieldsModal = document.getElementById('toggle-fields-modal');
    
    // 顯示彈跳框，並確保使用 flex 顯示
    toggleFieldsModal.style.display = 'flex';

    // 設置焦點至欄位選擇框
    const fieldSelect = document.getElementById("field-select");
    if (fieldSelect) {
        fieldSelect.focus();
    }

    // 監聽 ESC 鍵取消事件，避免多次綁定
    document.addEventListener('keydown', handleEscKeyForToggleFieldsCancel, { once: true });
}

// 處理 ESC 鍵盤事件
function handleEscKeyForToggleFieldsCancel(event) {
    if (event.key === 'Escape') {
        closeToggleFieldsModal();
    }
}

// 關閉顯示隱藏欄位彈跳框
function closeToggleFieldsModal() {
    const toggleFieldsModal = document.getElementById('toggle-fields-modal');
    toggleFieldsModal.style.display = 'none';

    // 解除 ESC 鍵的事件監聽，防止記憶體洩漏
    document.removeEventListener('keydown', handleEscKeyForToggleFieldsCancel);
}

// 顯示或隱藏欄位邏輯
function applyToggleFields() {
    const selectedOptions = Array.from(document.getElementById('field-select').selectedOptions).map(option => option.value);
    
    const allFields = [
        'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P', 'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'ISCALC_WT', 'NET_WT',
        'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 
        'ORG_IMP_DCL_NO_ITEM', 'SELLER_ITEM_CODE', 'BOND_NOTE', 'GOODS_MODEL', 'GOODS_SPEC', 
        'CERT_NO', 'CERT_NO_ITEM', 'ORG_DCL_NO', 'ORG_DCL_NO_ITEM', 'EXP_NO', 'EXP_SEQ_NO', 
        'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_QTY', 'ST_UM'
    ];

    allFields.forEach(field => {
        const fieldElements = document.querySelectorAll(`.item-header .${field}, #item-container .${field}`);
        fieldElements.forEach(fieldElement => {
            const formGroup = fieldElement.closest('.form-group');
            if (formGroup) {
                if (selectedOptions.includes(field)) {
                    formGroup.classList.remove('hidden');
                } else {
                    formGroup.classList.add('hidden');
                }
            }
        });
    });

    closeToggleFieldsModal();
}

document.addEventListener('DOMContentLoaded', () => {
    const fieldSelect = document.getElementById('field-select');

    // 預設選中必填欄位
    const defaultRequiredFields = [
        'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P', 'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'ISCALC_WT', 'NET_WT',
    ];

    // 預設選中這些欄位
    defaultRequiredFields.forEach(fieldValue => {
        const option = fieldSelect.querySelector(`option[value="${fieldValue}"]`);
        if (option) {
            option.selected = true;
        }
    });
});

// 開啟調整順序的彈跳框
function openAdjustOrderModal() {
    const itemContainer = document.getElementById('item-container');
    const items = itemContainer.querySelectorAll('.item-row');

    const orderList = document.getElementById('order-list');
    orderList.innerHTML = ''; // 清空列表

    items.forEach((item, index) => {
        const description = item.querySelector('.DESCRIPTION').value; // 獲取品名
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${index + 1} - 品名: ${description}</span>
            <input type="hidden" class="original-order" value="${index}">
        `;
        orderList.appendChild(orderItem);

        // 添加觸摸事件處理
        orderItem.addEventListener('touchstart', handleTouchStart, { passive: true });
        orderItem.addEventListener('touchmove', handleTouchMove, { passive: false });
        orderItem.addEventListener('touchend', handleTouchEnd);
    });

    // 初始化 Sortable.js
    Sortable.create(orderList, {
        animation: 150
    });

    const adjustOrderModal = document.getElementById('adjust-order-modal');
    adjustOrderModal.style.display = 'flex';

    // 監聽 ESC 鍵，表示取消
    document.addEventListener('keydown', handleEscKeyForAdjustOrderCancel);
}

function handleEscKeyForAdjustOrderCancel(event) {
    if (event.key === 'Escape') {
        closeAdjustOrderModal();
    }
}

function closeAdjustOrderModal() {
    const adjustOrderModal = document.getElementById('adjust-order-modal');
    adjustOrderModal.style.display = 'none';
    document.removeEventListener('keydown', handleEscKeyForAdjustOrderCancel);
}

// 關閉調整順序的彈跳框
function closeOrderModal() {
    document.getElementById('adjust-order-modal').style.display = 'none';
}

// 儲存新的順序
function saveNewOrder() {
    const orderList = document.getElementById('order-list');
    const orderItems = orderList.querySelectorAll('.order-item');
    const newOrder = Array.from(orderItems).map(item => parseInt(item.querySelector('.original-order').value));

    const itemContainer = document.getElementById('item-container');
    const items = Array.from(itemContainer.querySelectorAll('.item-row'));
    itemContainer.innerHTML = '';
    newOrder.forEach(index => {
        itemContainer.appendChild(items[index]);
    });

    renumberItems();
    closeOrderModal();
}

let draggedItem = null;

function handleTouchStart(event) {
    draggedItem = event.target.closest('.order-item');
    draggedItem.classList.add('dragging');
    event.preventDefault();
}

function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementUnderTouch && elementUnderTouch.classList.contains('order-item') && elementUnderTouch !== draggedItem) {
        const target = elementUnderTouch;
        const parent = target.parentNode;
        parent.insertBefore(draggedItem, target.nextSibling || target);
    }
}

function handleTouchEnd(event) {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
}

// 開啟指定填列欄位資料的彈跳框
function openSpecifyFieldModal() {
    // 顯示彈跳框
    const specifyFieldModal = document.getElementById('specify-field-modal');
    specifyFieldModal.style.display = 'flex';

    // 設置焦點 source-item-number (從源項次複製內容-源項次)
    const itemNumbersInput = document.getElementById('source-item-number');
    itemNumbersInput.focus();
    
    // 允許點擊背後的頁面欄位
    specifyFieldModal.style.pointerEvents = 'none';
    specifyFieldModal.children[0].style.pointerEvents = 'auto'; // 只允許彈跳框內部的第一個子元素接收點擊

    // 檢查是否顯示 "起始編號" 或 "填列內容"
    checkFieldDisplay();

    // 監聽 ESC 鍵，表示取消
    document.addEventListener('keydown', handleEscKeyForSpecifyFieldCancel);
}

// 處理 ESC 鍵關閉彈跳框
function handleEscKeyForSpecifyFieldCancel(event) {
    if (event.key === 'Escape') {
        closeSpecifyFieldModal();
    }
}

// 關閉指定填列欄位資料的彈跳框
function closeSpecifyFieldModal() {
    const specifyFieldModal = document.getElementById('specify-field-modal');
    specifyFieldModal.style.display = 'none'; // 隱藏彈跳框

    // 清除原欄位輸入框的文字
    const originalFieldInput = document.getElementById('original-field-input');
    if (originalFieldInput) {
        originalFieldInput.value = '';
    }

    // 移除 ESC 事件監聽
    document.removeEventListener('keydown', handleEscKeyForSpecifyFieldCancel);

    // 重置模式為 'copy'
    document.getElementById('specify-mode').value = 'copy';
    toggleSpecifyMode(); // 確保 UI 恢復成 copy-content
}

// 動態生成源項次下拉選單的選項
function populateSourceItemDropdown() {
    const sourceItemSelect = document.getElementById('source-item-number');
    sourceItemSelect.innerHTML = '<option value="">選擇項次 No.</option>';
    document.querySelectorAll('#item-container .item-row').forEach((item, index) => {
        const description = item.querySelector('.DESCRIPTION').value;
        sourceItemSelect.innerHTML += `<option value="${index + 1}">${index + 1} - 品名: ${description}</option>`;
    });
}

// 切換模式
function toggleSpecifyMode() {
    const specifyMode = document.getElementById('specify-mode').value;
    const customContent = document.getElementById('custom-content');
    const copyContent = document.getElementById('copy-content');
    const overwriteOption = document.getElementById('overwrite-option');
    const fieldName = document.getElementById('specify-field-name').value;

    const optionsToHide = overwriteOption.querySelectorAll('option[value="matchCondition"], option[value="notMatchCondition"]');

    if (specifyMode === 'copy') {
        customContent.style.display = 'none';
        copyContent.style.display = 'block';
        populateSourceItemDropdown();

        // 隱藏「符合條件」及「不符合條件」選項
        optionsToHide.forEach(option => option.style.display = 'none');
    } else {
        customContent.style.display = 'block';
        copyContent.style.display = 'none';

        if (fieldName === 'DESCRIPTION') {
            optionsToHide.forEach(option => option.style.display = 'none');
        } else {
            // 顯示「符合條件」及「不符合條件」選項
            optionsToHide.forEach(option => option.style.display = 'block');
        }

        // 設置焦點 specify-field-value (自定義填列內容-填列內容)
        setTimeout(() => {
            const itemNumbersInput = document.getElementById('specify-field-value');
            if (itemNumbersInput) {
                itemNumbersInput.focus();
            }
        }, 0);
    }
}

// 當指定的欄位變更時檢查是否顯示起始編號輸入框和填列內容
function checkFieldDisplay() {
    const fieldName = document.getElementById('specify-field-name').value;
    const startNumberContainer = document.getElementById('start-number-container');
    const specifyFieldValue = document.getElementById('specify-field-value');
    specifyFieldValue.value = '';  // 清除填列內容的文字

    if (fieldName === 'CERT_NO_ITEM') {
        startNumberContainer.style.display = 'inline-block';
        specifyFieldValue.style.display = 'none';  // 隱藏填列內容

        // 設置焦點 specify-item-number (自定義填列內容-No.)
        setTimeout(() => {
            const itemNumbersInput = document.getElementById('specify-item-numbers');
            if (itemNumbersInput) {
                itemNumbersInput.focus();
            }
        }, 0);
    } else {
        startNumberContainer.style.display = 'none';
        specifyFieldValue.style.display = 'block';  // 顯示填列內容
    }

    // 動態調整 rows 屬性
    if (fieldName === 'DESCRIPTION') {
        specifyFieldValue.rows = 5;
        specifyFieldValue.removeEventListener('keydown', preventEnterKey); // 允許換行
    } else {
        specifyFieldValue.rows = 1;
        specifyFieldValue.addEventListener('keydown', preventEnterKey); // 阻止換行
    }
}

// 阻止 textarea 按 Enter 鍵換行
function preventEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // 設定一般預設模式為 'copy'
    document.getElementById('specify-mode').value = 'copy';
    toggleSpecifyMode(); // 觸發切換模式，確保預設顯示 copy-content
    
    document.querySelectorAll('.item-header .form-group').forEach(header => {
        header.addEventListener('click', function () {
            // 取得 `specify-field-name` 下拉選單
            const specifyFieldName = document.getElementById('specify-field-name');
            if (!specifyFieldName) return;

            // 取得當前表頭的所有 class
            let selectedField = null;
            this.classList.forEach(className => {
                // 檢查 `specify-field-name` 下拉選單是否包含該 class
                for (let i = 0; i < specifyFieldName.options.length; i++) {
                    if (specifyFieldName.options[i].value === className.toUpperCase()) {
                        selectedField = className.toUpperCase();
                        break;
                    }
                }
                if (selectedField) return;
            });

            // 如果沒有對應欄位，不開啟彈跳框
            if (!selectedField) return;

            // 設定彈跳框的欄位名稱
            specifyFieldName.value = selectedField;

            // 點擊表頭時，將模式切換為 'custom'
            document.getElementById('specify-mode').value = 'custom';
            toggleSpecifyMode(); // 觸發模式切換

            // 開啟彈跳框
            openSpecifyFieldModal();
        });
    });
});

// 是否顯示「條件：原欄位」輸入框
document.getElementById('overwrite-option').addEventListener('change', function() {
    const originalFieldContainer = document.getElementById('original-field-container');
    const label = document.getElementById('original-field-label');
    
    if (this.value === 'matchCondition' || this.value === 'notMatchCondition') {
        originalFieldContainer.style.display = 'block';
        
        if (this.value === 'matchCondition') {
            // 選符合條件時，label 顯示「條件：原欄位 =」
            label.textContent = '條件：原欄位 = ';
        } else if (this.value === 'notMatchCondition') {
            // 選不符合條件時，label 顯示「條件：原欄位 <>」
            label.textContent = '條件：原欄位 ≠ ';
        }
    } else {
        originalFieldContainer.style.display = 'none';
    }
});

document.getElementById('specify-field-name').addEventListener('change', toggleSpecifyMode);
document.getElementById('specify-field-name').addEventListener('change', checkFieldDisplay);

// 應用填列資料的函數
function applyFieldData() {
    const mode = document.getElementById('specify-mode').value;
    const overwriteOption = document.getElementById('overwrite-option').value;
    
    // 當覆蓋選項為「符合條件」或「不符合條件」時，檢查原欄位輸入框是否有值
    if (overwriteOption === 'matchCondition' || overwriteOption === 'notMatchCondition') {
        const originalField = document.getElementById('original-field-input').value.trim();
        if (originalField === '') {
            alert('請輸入「條件：原欄位」的值');
            return; // 中止執行
        }
    }

    const itemContainer = document.getElementById('item-container');
    const items = itemContainer.querySelectorAll('.item-row');
    let hasUpdatedCCCCode = false; // 紀錄是否有更新CCC_CODE欄位
    let hasUpdatedQtyOrUnitPrice = false; // 紀錄是否有更新QTY、DOC_UM、DOC_UNIT_P欄位

    // 需要強制轉為大寫的欄位
    const upperCaseFields = [
        "DOC_UM", "ST_MTD", "ORG_COUNTRY", "ORG_IMP_DCL_NO", "BOND_NOTE", 
        "CERT_NO", "ORG_DCL_NO", "EXP_NO", "WIDE_UM", "LENGTH_UM"
    ];

    // 讀取原欄位內容（僅在符合條件、不符合條件時使用）
    let originalField = '';
    if (overwriteOption === 'matchCondition' || overwriteOption === 'notMatchCondition') {
        originalField = document.getElementById('original-field-input').value;
    }

    if (mode === 'custom') {
        const itemNumbers = document.getElementById('specify-item-numbers').value.trim();
        const fieldName = document.getElementById('specify-field-name').value;
        let fieldValue = document.getElementById('specify-field-value').value;

        // 如果 specify-field-value 以 "=" 開頭，則複製指定欄位的值
        let copyFieldName = null;
        if (fieldValue.startsWith("=")) {
            const labelText = fieldValue.substring(1).trim(); // 取得中文欄位名稱
            copyFieldName = getOptionValueByLabel(labelText); // 轉換為對應的英文 value

            if (!copyFieldName) {
                console.warn("無法找到對應的欄位名稱:", labelText);
            }
        }

        // 透過中文名稱查找對應的 option value
        function getOptionValueByLabel(labelText) {
            const selectElement = document.getElementById('specify-field-name');
            if (!selectElement) {
                console.error("找不到指定的下拉選單元素: #specify-field-name");
                return null;
            }

            const options = selectElement.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].textContent.trim() === labelText.trim()) {
                    return options[i].value; // 找到對應的 value
                }
            }
            console.warn(`無法找到對應的欄位名稱: ${labelText}`);
            return null; // 找不到對應的值時回傳 null
        }

        // 排除 DESCRIPTION 欄位的 trim
        if (fieldName !== 'DESCRIPTION') {
            fieldValue = fieldValue.trim();
        }

        // 如果欄位在指定的 upperCaseFields 清單內，則轉換為大寫
        if (upperCaseFields.includes(fieldName)) {
            fieldValue = fieldValue.toUpperCase();
        }

        const startNumber = parseInt(document.getElementById('start-number').value, 10); // 起始編號
        let currentNumber = startNumber; // 當前編號

        let indices = [];

        // 如果 specify-item-numbers 為空，則表示全部項次
        if (itemNumbers.trim() === "") {
            for (let i = 0; i < items.length; i++) {
                indices.push(i);
            }
        } else {
            const ranges = itemNumbers.split(',').map(range => range.trim());
            ranges.forEach(range => {
                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(Number);
                    for (let i = start; i <= end; i++) {
                        indices.push(i - 1);
                    }
                } else {
                    indices.push(Number(range) - 1);
                }
            });
        }

        indices.forEach(index => {
            if (index >= 0 && index < items.length) {
                const item = items[index];

                // 檢查此列的 item-number 欄位
                const itemNumberElem = item.querySelector('.item-number label');
                if (itemNumberElem && itemNumberElem.textContent.trim() === "*") {
                    // 若 item-number 為 "*"，則清空該列指定欄位的值，並略過更新
                    const fieldElement = item.querySelector(`.${fieldName}`);
                    if (fieldElement && fieldName !== 'DESCRIPTION') {
                        fieldElement.value = "";
                    }
                    return; // 跳過此列後續更新
                }

                const fieldElement = item.querySelector(`.${fieldName}`);

                // 若指定了複製欄位，則從該列對應欄位獲取值
                if (copyFieldName) {
                    const copyFieldElement = item.querySelector(`.${copyFieldName}`);
                    if (copyFieldElement) {
                        fieldValue = copyFieldElement.value; // 複製對應欄位的值
                    }
                }

                // 判斷覆蓋條件
                if (
                    overwriteOption === 'all' ||
                    (overwriteOption === 'empty' && !fieldElement.value) ||
                    (overwriteOption === 'specified' && fieldElement.value) ||
                    (overwriteOption === 'matchCondition' && fieldElement.value.includes(originalField)) ||
                    (overwriteOption === 'notMatchCondition' && !fieldElement.value.includes(originalField))
                ) {
                    // 如果選擇的是產證序號，則填入指定的編號
                    if (fieldName === 'CERT_NO_ITEM') {
                        fieldElement.value = `${currentNumber}`; // 填入指定的編號
                        currentNumber++; // 編號遞增
                    } else {
                        fieldElement.value = fieldValue;
                    }
                    // 紀錄是否更新了CCC_CODE
                    if (fieldName === 'CCC_CODE') {
                        hasUpdatedCCCCode = true;
                    }

                    // 紀錄是否更新了QTY、DOC_UM、DOC_UNIT_P
                    if (["QTY", "DOC_UM", "DOC_UNIT_P"].includes(fieldName)) {
                        hasUpdatedQtyOrUnitPrice = true;
                    }
                }
            }
        });
    } else if (mode === 'copy') {
        const sourceItemNumber = document.getElementById('source-item-number').value;
        const fieldNames = Array.from(document.getElementById('specify-field-names-copy').selectedOptions).map(option => option.value);
        const targetItemNumbers = document.getElementById('target-item-numbers').value.trim();
        const sourceIndex = parseInt(sourceItemNumber, 10) - 1;

        let targetIndices = [];

        // 如果 target-item-numbers 為空，表示全部項次
        if (targetItemNumbers === "") {
            for (let i = 0; i < items.length; i++) {
                targetIndices.push(i);
            }
        } else {
            const ranges = targetItemNumbers.split(',').map(range => range.trim());
            ranges.forEach(range => {
                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(Number);
                    for (let i = start; i <= end; i++) {
                        targetIndices.push(i - 1);
                    }
                } else {
                    targetIndices.push(Number(range) - 1);
                }
            });
        }
        
        if (sourceIndex >= 0 && sourceIndex < items.length) {
            const sourceItem = items[sourceIndex];

            targetIndices.forEach(index => {
                if (index >= 0 && index < items.length) {
                    const targetItem = items[index];
                    // 檢查此列的 item-number 欄位
                    const itemNumberElem = targetItem.querySelector('.item-number label');
                    if (itemNumberElem && itemNumberElem.textContent.trim() === "*") {
                        // 若 item-number 為 "*"，則清空該列所有相關欄位，並略過更新此列
                        fieldNames.forEach(fieldName => {
                            const targetFieldElement = targetItem.querySelector(`.${fieldName}`);
                            if (targetFieldElement && fieldName !== 'DESCRIPTION') {
                                targetFieldElement.value = "";
                            }
                        });
                        return; // 跳過此列後續更新
                    }

                    fieldNames.forEach(fieldName => {
                        const sourceFieldElement = sourceItem.querySelector(`.${fieldName}`);
                        const targetFieldElement = targetItem.querySelector(`.${fieldName}`);

                        // 判斷覆蓋條件
                        if (
                            overwriteOption === 'all' ||
                            (overwriteOption === 'empty' && !targetFieldElement.value) ||
                            (overwriteOption === 'specified' && targetFieldElement.value) ||
                            (overwriteOption === 'matchCondition' && targetFieldElement.value.includes(originalField)) ||
                            (overwriteOption === 'notMatchCondition' && !targetFieldElement.value.includes(originalField))
                        ) {
                            targetFieldElement.value = sourceFieldElement.value;
                        }
                        // 紀錄是否更新了CCC_CODE
                        if (fieldName === 'CCC_CODE') {
                            hasUpdatedCCCCode = true;
                        }
                        // 紀錄是否更新了QTY、DOC_UM、DOC_UNIT_P
                        if (["QTY", "DOC_UM", "DOC_UNIT_P"].includes(fieldName)) {
                            hasUpdatedQtyOrUnitPrice = true;
                        }
                    });
                }
            });
        }
    }
    
    // 檢查是否有更新CCC_CODE欄位，若有則對所有更新的CCC_CODE欄位執行handleCCCCodeInput
    if (hasUpdatedCCCCode) {
        items.forEach(item => {
            const cccCodeInput = item.querySelector('.CCC_CODE');
            if (cccCodeInput) {
                handleCCCCodeInput(null, cccCodeInput); // 最後執行處理CCC_CODE欄位的邏輯
            }
        });
    }

    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);
    
    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }
    
    // 檢查是否有更新QTY、DOC_UM、DOC_UNIT_P欄位，若有則對所有更新的欄位執行金額計算及更新ST_QTY、NET_WT
    if (hasUpdatedQtyOrUnitPrice) {
        items.forEach(item => {
            calculateAmountsForRow(item, decimalPlaces);
            updateST_QTY(item);
            updateNET_WT(item);
        });
    }

    closeSpecifyFieldModal();
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

// 彈跳框內循環 Tab
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("specify-field-modal");
    
    modal.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            let focusableElements = modal.querySelectorAll('input, select, textarea, button');
            focusableElements = Array.prototype.slice.call(focusableElements);
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    });
});

// 匯入Excel文件的功能
function handleFile(event) {
    clearField(); // 清空輸入框內容
    
    const file = event.target.files[0];
    
    // 提取檔名中【】內的文字
    const matchRemark = file.name.match(/【(.*?)】/);
    const fileRemark = matchRemark ? matchRemark[1] : ''; // 若無則回傳空字串
    document.getElementById('REMARK').value = fileRemark;

    // 讀取 Excel 檔案
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // 讀取報單表頭工作表
        const headerSheet = workbook.Sheets[workbook.SheetNames[0]];
        const headerData = XLSX.utils.sheet_to_json(headerSheet, { header: 1, raw: false });

        // 定義中文名稱與欄位 ID 的對應關係
        const headerMapping = {
            '文件編號': 'FILE_NO',
            '運單號': 'LOT_NO',
            '出口人統一編號': 'SHPR_BAN_ID',
            '海關監管編號': 'SHPR_BONDED_ID',
            '出口人中文名稱': 'SHPR_C_NAME',
            '出口人英文名稱': 'SHPR_E_NAME',
            '出口人中文地址': 'SHPR_C_ADDR',
            '出口人英文地址': 'SHPR_E_ADDR',
            '出口人電話號碼': 'SHPR_TEL',
            '買方中文名稱': 'CNEE_C_NAME',
            '買方中/英名稱': 'CNEE_E_NAME',
            '買方中/英地址': 'CNEE_E_ADDR',
            '買方國家代碼': 'CNEE_COUNTRY_CODE',
            '買方統一編號': 'CNEE_BAN_ID',
            '收方名稱': 'BUYER_E_NAME',
            '收方地址': 'BUYER_E_ADDR',
            '目的地(代碼)': 'TO_CODE',
            '目的地(名稱)': 'TO_DESC',
            '總件數': 'TOT_CTN',
            '總件數單位': 'DOC_CTN_UM',
            '包裝說明': 'CTN_DESC',
            '總毛重': 'DCL_GW',
            '總淨重': 'DCL_NW',
            '報單類別': 'DCL_DOC_TYPE',
            '貿易條件': 'TERMS_SALES',
            '幣別': 'CURRENCY',
            '總金額': 'CAL_IP_TOT_ITEM_AMT',
            '運費': 'FRT_AMT',
            '保險費': 'INS_AMT',
            '應加費用': 'ADD_AMT',
            '應減費用': 'SUBTRACT_AMT',
            '標記及貨櫃號碼': 'DOC_MARKS_DESC',
            '其它申報事項': 'DOC_OTR_DESC',
            'REMARKS': 'REMARK1',
            '保稅廠統一編號': 'FAC_BAN_ID_EX',
            '保稅廠監管編號': 'FAC_BONDED_ID_EX',
            '出倉保稅倉庫統一編號': 'FAC_BAN_ID',
            '出倉保稅倉庫代碼': 'FAC_BONDED_ID',
            '進倉保稅倉庫統一編號': 'IN_BONDED_BAN',
            '進倉保稅倉庫代碼': 'IN_BONDED_CODE'
        };

        headerData.forEach((row) => {
            const fieldName = row[0] ? String(row[0]).trim() : ''; // 取 Excel 的中文名稱
            const fieldValue = row[1] ? String(row[1]).trim() : ''; // 對應值

            const id = headerMapping[fieldName]; // 對應到欄位 ID
            if (id) {
                const element = document.getElementById(id);
                if (element) {
                    let value = fieldValue;

                    // CURRENCY 欄位轉換處理
                    if (id === 'CURRENCY') {
                        value = value.toUpperCase() === 'NTD' ? 'TWD' : value.toUpperCase();
                    }

                    // 去除千分號的欄位處理
                    const fieldsToRemoveSeparators = [
                        'TOT_CTN', 'DCL_GW', 'DCL_NW', 'CAL_IP_TOT_ITEM_AMT', 'FRT_AMT', 'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT'
                    ];
                    if (fieldsToRemoveSeparators.includes(id)) {
                        value = removeThousandsSeparator(value);
                    }

                    // 需要轉換大寫的所有欄位 ID
                    const fieldIds = [
                        "LOT_NO", "SHPR_BAN_ID", "SHPR_BONDED_ID", "CNEE_COUNTRY_CODE", "TO_CODE", "DOC_CTN_UM","DCL_DOC_TYPE", "TERMS_SALES", "CURRENCY"
                    ];
                    if (fieldIds.includes(id)) {
                        value = value.toUpperCase();
                    }

                    element.value = value;
                }
            }
        });

        searchData(false); // 出口人統一編號搜尋
        lookupExchangeRate(); // 當旬匯率
        handleCheck(); // 長期委任字號
        thingsToNote(); // 出口備註

        // 執行必填與不得填列欄位的檢查邏輯
        document.getElementById('CNEE_COUNTRY_CODE').dispatchEvent(new Event('input'));
        document.getElementById('TERMS_SALES').dispatchEvent(new Event('input'));
        
        // 檢查REMARKS欄位來勾選對應選項
        headerData.forEach(row => {
            const remarksIndex = row.indexOf('REMARKS');
            if (remarksIndex !== -1) {
                const remarks = row[remarksIndex + 1];
                checkRemarkOptions(String(remarks)); // 將值轉為字串
            }
        });

        // 讀取報單項次工作表
        const itemsSheet = workbook.Sheets[workbook.SheetNames[1]];
        const itemsData = XLSX.utils.sheet_to_json(itemsSheet, { header: 1, raw: false });

        // 讀取標題行，並動態定義品名欄位的索引
        const headers = itemsData[0];
        const descriptionIndices = [];
        headers.forEach((header, index) => {
            if (header && header === '品名') {
                descriptionIndices.push(index);
            }
        });

        // 將報單項次數據按品名分組並填充到表單中
        const itemContainer = document.getElementById('item-container');
        itemContainer.innerHTML = ''; // 清空現有項次

        let currentItem = null;
        let currentDescription = '';

        const tariffCodeMapping = {
            "IC": "8542390022",
            "PFC IC": "8542390022",
            "PWM IC": "8542390022",
            "PFC+LLC IC": "8542390022",
            "PROTECT IC": "8542390022",
            "2ND PROTECTION IC": "8542390022",
            "VOLTAGE DETECTOR IC": "8542390022",
            "LED": "8541410090",
            "BAT CONN.": "8536902000",
            "N MOS DIP": "8541299000",
            "N MOS SMD": "8541299000",
            "P MOS SMD": "8541299000",
            "POWER MOSFET": "8541299000",
            "TRANSISTOR": "8541299000",
            "SWITCHING TRANSISTOR": "8541299000",
            "NPN TRANSISTOR": "8541299000",
            "PNP TRANSISTOR": "8541299000",
            "THERMISTOR": "8533400000",
            "RESISTOR": "8533400000",
            "CURRENT SENSOR RESISTOR": "8533400000",
            "CHIP RESISTOR": "8533400000",
            "VARIABLE RESISTOR": "8533400000",
            "NTC RESISTOR": "8533400000",
            "CAPACITOR": "8532300000",
            "CHIP CAP.": "8532300000",
            "KO CAP.": "8532300000",
            "X1 CAP.": "8532300000",
            "X2 CAP.": "8532300000",
            "Y1 CAP.": "8532300000",
            "Y2 CAP.": "8532300000",
            "TVS DIP": "8541101000",
            "TVS SMD": "8541101000", 
            "ULTRAFAST DIODE": "8541109000",
            "TVS DIODE": "8541109000",
            "ZENER DIODE": "8541109000",
            "SWITCHING DIODE": "8541109000",
            "RECTIFIER DIODE": "8541109000",
            "DIODE SMD": "8541109000",
            "DIODE DIP": "8541109000",
            "FAST DIODE": "8541109000",
            "SCHOTTKY DIODE": "8541109000",
            "SUPERFAST DIODE": "8541109000",
            "WAFER SMT": "8542390021",
            "WAFER DIP AC-DC": "8542390021",
            "INDUCTOR": "8504509000",
            "POWER INDUCTOR": "8504509000",
            "INDUCTOR SMD": "8504509000",
            "PLANAR E CORE": "8504900000",
            "PLANAR EQ CORE": "8504900000",
            "PLANAR EEW CORE": "8504900000",
            "BEAD CORE": "8504900000",
            "FERRITE CORE": "8504900000",
            "TOROIDAL CORE": "8504900000",
            "CINCON LOGO": "8504900000",
            "BASE OF DC-DC": "8504900000",
            "CASE OF DC-DC": "8504900000",
            "CLIPS DC-DC": "8504900000",
            "CRIMP TERMINAL AC-DC": "8504900000",
            "VOLTAGE DETECTOR SMD": "8504900000",
            "BRIDGE RECTIFIER": "8504900000",
            "ALUMINUM POLYMER CAP.": "8532220000",
            "ALUMINUM CAP.": "8532220000",
            "PF CAP.": "8532220000",
            "CURRENT SHUNT": "8542390022",
            "HV START UP IC SMD": "8542390022",
            "CURRENT TRANSFORMER": "8504310000",
            "DC-DC CONVERTERS": "8504409990",
            "FEMALE CONNECTOR": "8536909000",
            "FUSE SMD": "8536100000",
            "FUSE DIP": "8536100000",
            "CURRENT FUSE": "8536100000",
            "HIGH POWER THICK FILM CHIP RESISTORS": "8533210090",
            "HIGH VOLTAGE THICK FILM RESISTOR SMD": "8533210090",
            "METAL STRIP RESISTOR SMD": "8533210090",
            "PCB": "8534000090",
            "PHOTO COUPLER": "8541490020",
            "REGULATOR": "9032899000",
            "TANTALUM": "8532210000",
            "PIN": "8533900000",
            "排PIN": "8533900000",
            "圓PIN": "8533900000",
            "THERMOSTAT": "9032100000",
        };

        const allItemsEmpty = itemsData.slice(1).every(row => !row[0]); // 檢查項次是否完全空
        itemsData.slice(1).forEach((row, index) => {
            const hasItemNo = row[0]; // 判斷項次是否有數據

            if (hasItemNo || allItemsEmpty || index === 0) {
                if (currentItem) {
                    currentItem.querySelector('.DESCRIPTION').value = currentDescription.trim();
                    itemContainer.appendChild(currentItem);
                }
                const description = descriptionIndices
                    .map(i => String(row[i] || '').trim()) // 去除前後空格
                    .filter(Boolean)
                    .join('\n');

                currentDescription = description;

                let cccCode = String(row[descriptionIndices[descriptionIndices.length - 1] + 6] || '').trim();

                // 檢查CCC_CODE為空並匹配稅則
                if (!cccCode) {
                    // 將描述內容轉為大寫
                    const upperCaseDescription = currentDescription.toUpperCase();
                    
                    const matchedCode = Object.keys(tariffCodeMapping).find(key =>
                        upperCaseDescription.split('\n').some(line => line.trim().startsWith(key.toUpperCase()))
                    );
                    if (matchedCode) {
                        cccCode = tariffCodeMapping[matchedCode];
                    }
                }
                
                currentItem = createItemRow({
                    ITEM_NO: String(row[0] || ''), // 將數據轉為字串
                    DESCRIPTION: currentDescription || '',
                    QTY: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 1] || '')),
                    DOC_UM: String(row[descriptionIndices[descriptionIndices.length - 1] + 2] || ''),
                    DOC_UNIT_P: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 3] || '')),
                    DOC_TOT_P: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 4] || '')),
                    TRADE_MARK: String(row[descriptionIndices[descriptionIndices.length - 1] + 5] || ''),
                    CCC_CODE: cccCode, // 使用匹配稅則或原始值
                    ST_MTD: String(row[descriptionIndices[descriptionIndices.length - 1] + 7] || '').toUpperCase(),
                    NET_WT: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 8] || '')),
                    ORG_COUNTRY: String(row[descriptionIndices[descriptionIndices.length - 1] + 9] || '').toUpperCase(),
                    ORG_IMP_DCL_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 10] || '').toUpperCase(),
                    ORG_IMP_DCL_NO_ITEM: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 11] || '')),
                    SELLER_ITEM_CODE: String(row[descriptionIndices[descriptionIndices.length - 1] + 12] || ''),
                    BOND_NOTE: String(row[descriptionIndices[descriptionIndices.length - 1] + 13] || '').toUpperCase(),
                    GOODS_MODEL: String(row[descriptionIndices[descriptionIndices.length - 1] + 14] || ''),
                    GOODS_SPEC: String(row[descriptionIndices[descriptionIndices.length - 1] + 15] || ''),
                    CERT_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 16] || '').toUpperCase(),
                    CERT_NO_ITEM: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 17] || '')),
                    ORG_DCL_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 18] || '').toUpperCase(),
                    ORG_DCL_NO_ITEM: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 19] || '')),
                    EXP_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 20] || '').toUpperCase(),
                    EXP_SEQ_NO: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 21] || '')),
                    WIDE: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 22] || '')),
                    WIDE_UM: String(row[descriptionIndices[descriptionIndices.length - 1] + 23] || ''),
                    LENGT_: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 24] || '')),
                    LENGTH_UM: String(row[descriptionIndices[descriptionIndices.length - 1] + 25] || ''),
                    ST_QTY: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 26] || '')),
                    ST_UM: String(row[descriptionIndices[descriptionIndices.length - 1] + 27] || ''),
                });
                
                if (row[1] === '*') {
                    currentItem.querySelector('.ITEM_NO').checked = true;
                }
            } else if (currentItem) {
                const element = currentItem.querySelector('.DESCRIPTION');
                if (element) {
                    descriptionIndices.forEach(i => {
                        if (row[i]) {
                            currentDescription += `\n${String(row[i])}`;
                        }
                    });
                }
            }
        });

        if (currentItem) {
            currentItem.querySelector('.DESCRIPTION').value = currentDescription.trim();
            itemContainer.appendChild(currentItem);
        }
        initializeListeners();
        renumberItems();
    };
    reader.readAsArrayBuffer(file);
}

// 去除千分號的輔助函數
function removeThousandsSeparator(value) {
    return value.replace(/,/g, '');
}

// 根據REMARKS欄位的值來勾選對應選項
function checkRemarkOptions(remarks) {
    const options = {
        '申請沖退原料稅（E化退稅）': 'copy_3_e',
        '申請報單副本第三聯（沖退原料稅用聯）': 'copy_3',
        '申請報單副本第四聯（退內地稅用聯）': 'copy_4',
        '申請報單副本第五聯（出口證明用聯）': 'copy_5'
    };

    Object.keys(options).forEach(key => {
        const checkbox = document.getElementById(options[key]);
        if (remarks.includes(key)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}

function exportToExcel() {
    // 收集報單表頭數據
    const headerData = [
        ['文件編號', document.getElementById('FILE_NO').value],
        ['運單號', document.getElementById('LOT_NO').value],
        ['出口人統一編號', document.getElementById('SHPR_BAN_ID').value],
        ['海關監管編號', document.getElementById('SHPR_BONDED_ID').value],
        ['出口人中文名稱', document.getElementById('SHPR_C_NAME').value],
        ['出口人英文名稱', document.getElementById('SHPR_E_NAME').value],
        ['出口人中文地址', document.getElementById('SHPR_C_ADDR').value],
        ['出口人英文地址', document.getElementById('SHPR_E_ADDR').value],
        ['出口人電話號碼', document.getElementById('SHPR_TEL').value],
        ['買方中文名稱', document.getElementById('CNEE_C_NAME').value],
        ['買方中/英名稱', document.getElementById('CNEE_E_NAME').value],
        ['買方中/英地址', document.getElementById('CNEE_E_ADDR').value],
        ['買方國家代碼', document.getElementById('CNEE_COUNTRY_CODE').value],
        ['買方統一編號', document.getElementById('CNEE_BAN_ID').value],
        ['收方名稱', document.getElementById('BUYER_E_NAME').value],
        ['收方地址', document.getElementById('BUYER_E_ADDR').value],
        ['目的地(代碼)', document.getElementById('TO_CODE').value],
        ['目的地(名稱)', document.getElementById('TO_DESC').value],
        ['總件數', document.getElementById('TOT_CTN').value],
        ['總件數單位', document.getElementById('DOC_CTN_UM').value],
        ['包裝說明', document.getElementById('CTN_DESC').value],
        ['總毛重', document.getElementById('DCL_GW').value],
        ['總淨重', document.getElementById('DCL_NW').value],
        ['報單類別', document.getElementById('DCL_DOC_TYPE').value],
        ['貿易條件', document.getElementById('TERMS_SALES').value],
        ['幣別', document.getElementById('CURRENCY').value],
        ['總金額', document.getElementById('CAL_IP_TOT_ITEM_AMT').value],
        ['運費', document.getElementById('FRT_AMT').value],
        ['保險費', document.getElementById('INS_AMT').value],
        ['應加費用', document.getElementById('ADD_AMT').value],
        ['應減費用', document.getElementById('SUBTRACT_AMT').value],
        ['標記及貨櫃號碼', document.getElementById('DOC_MARKS_DESC').value],
        ['其它申報事項', document.getElementById('DOC_OTR_DESC').value],
        ['REMARKS', document.getElementById('REMARK1').value],
        ['保稅廠統一編號', document.getElementById('FAC_BAN_ID_EX').value],
        ['保稅廠監管編號', document.getElementById('FAC_BONDED_ID_EX').value],
        ['出倉保稅倉庫統一編號', document.getElementById('FAC_BAN_ID').value],
        ['出倉保稅倉庫代碼', document.getElementById('FAC_BONDED_ID').value],
        ['進倉保稅倉庫統一編號', document.getElementById('IN_BONDED_BAN').value],
        ['進倉保稅倉庫代碼', document.getElementById('IN_BONDED_CODE').value],
    ];

    // 收集報單項次數據
    const itemsData = [
        ['No.', '項次(非必填，大品名註記以"*"表示，可無編號)', '數量', '單位', '單價', '金額', 
        '商標', '稅則', '統計方式', '淨重', '生產國別', '原進口報單號碼', '原進口報單項次', 
        '賣方料號', '保稅貨物註記', '型號', '規格', '產證號碼', '產證項次', 
        '原進倉報單號碼', '原進倉報單項次', '輸出許可號碼', '輸出許可項次', 
        '寬度(幅寬)', '寬度單位', '長度(幅長)', '長度單位', '統計數量', '統計單位']
    ];

    let itemNoCounter = 0; // 計算有效的 ITEM_NO
    let maxDescLines = 1; // 品名最大分行數，至少為1

    // 計算品名的最大行數
    document.querySelectorAll("#item-container .item-row").forEach((item) => {
        const description = item.querySelector('.DESCRIPTION').value || '';
        const lines = description.split('\n'); // 按行分割品名
        if (lines.length > maxDescLines) {
            maxDescLines = lines.length; // 更新最大行數
        }
    });

    // 動態增加品名欄位至表頭
    const fixedColumns = itemsData[0].slice(0, 2); // 保留前兩個固定欄位（No. 和 項次）
    const dynamicColumns = Array(maxDescLines).fill('品名'); // 動態生成品名欄位，至少包含1欄
    const remainingColumns = itemsData[0].slice(2); // 剩餘固定欄位
    itemsData[0] = [...fixedColumns, ...dynamicColumns, ...remainingColumns]; // 合併所有欄位

    // 處理每一項的數據
    const itemRows = document.querySelectorAll("#item-container .item-row");
    itemRows.forEach((item, index) => {
        const isChecked = item.querySelector('.ITEM_NO').checked;
    
        // 根據條件決定是否增加計數器
        if (!isChecked) {
            itemNoCounter++;
        }
    
        const description = item.querySelector('.DESCRIPTION').value || '';
        const descriptionLines = description.split('\n'); // 按行分割品名
    
        // 填充品名到多個欄位，未滿的部分補空，至少保留一個品名欄位
        const descriptionCols = Array.from({ length: maxDescLines }, (_, i) => descriptionLines[i] || '');
    
        // 添加固定數據
        itemsData.push([
            index + 1, // No.
            isChecked ? '*' : itemNoCounter, // 項次
            ...descriptionCols, // 動態品名欄位
            item.querySelector('.QTY').value || '', // 數量
            replaceValue('DOC_UM', item.querySelector('.DOC_UM').value || ''), // 單位
            item.querySelector('.DOC_UNIT_P').value || '', // 單價
            item.querySelector('.DOC_TOT_P').value || '', // 金額
            item.querySelector('.TRADE_MARK').value || '', // 商標
            replaceValue('CCC_CODE', item.querySelector('.CCC_CODE').value || ''), // 稅則
            item.querySelector('.ST_MTD').value || '', // 統計方式
            item.querySelector('.NET_WT').value || '', // 淨重
            item.querySelector('.ORG_COUNTRY').value || '', // 生產國別
            item.querySelector('.ORG_IMP_DCL_NO').value || '', // 原進口報單號碼
            item.querySelector('.ORG_IMP_DCL_NO_ITEM').value || '', // 原進口報單項次
            item.querySelector('.SELLER_ITEM_CODE').value || '', // 賣方料號
            item.querySelector('.BOND_NOTE').value || '', // 保稅貨物註記
            item.querySelector('.GOODS_MODEL').value || '', // 型號
            item.querySelector('.GOODS_SPEC').value || '', // 規格
            item.querySelector('.CERT_NO').value || '', // 產證號碼
            item.querySelector('.CERT_NO_ITEM').value || '', // 產證項次
            item.querySelector('.ORG_DCL_NO').value || '', // 原進倉報單號碼
            item.querySelector('.ORG_DCL_NO_ITEM').value || '', // 原進倉報單項次
            item.querySelector('.EXP_NO').value || '', // 輸出許可號碼
            item.querySelector('.EXP_SEQ_NO').value || '', // 輸出許可項次
            item.querySelector('.WIDE').value || '', // 寬度
            replaceValue('WIDE_UM', item.querySelector('.WIDE_UM').value || ''), // 寬度單位
            item.querySelector('.LENGT_').value || '', // 長度
            replaceValue('LENGTH_UM', item.querySelector('.LENGTH_UM').value || ''), // 長度單位
            item.querySelector('.ST_QTY').value || '', // 統計數量
            replaceValue('ST_UM', item.querySelector('.ST_UM').value || ''), // 統計單位
        ]);
    });

    // 創建工作表
    const headerWorksheet = XLSX.utils.aoa_to_sheet(headerData);
    const itemsWorksheet = XLSX.utils.aoa_to_sheet(itemsData);

    // 設置報單表頭工作表 A 欄及 B 欄的欄寬
    headerWorksheet['!cols'] = [{ wpx: 150 }, { wpx: 250 }];
    
    // 設置 itemsWorksheet 每欄的欄寬
    const colWidth = 10; // 設定字符寬度
    const itemsCols = new Array(itemsData[0].length).fill({ wch: colWidth });
    itemsWorksheet['!cols'] = itemsCols;

    // 設置報單表頭 A 欄至 B 欄為文字格式
    for (let row = 0; row < headerData.length; row++) {
        for (let col = 0; col <= 1; col++) { // A 欄 (0) 到 B 欄 (1)
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (headerWorksheet[cellRef]) {
                headerWorksheet[cellRef].t = 's'; // 設定文字格式
                headerWorksheet[cellRef].z = '@'; // 確保顯示為文字
            }
        }
    }

    // 取得工作表範圍
    const range = XLSX.utils.decode_range(itemsWorksheet['!ref']);

    // 更新工作表範圍
    itemsWorksheet['!ref'] = XLSX.utils.encode_range(range);

    let cellRefs = [];
    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            cellRefs.push(XLSX.utils.encode_cell({ r: row, c: col }));
        }
    }
    cellRefs.forEach(cellRef => {
        itemsWorksheet[cellRef] = itemsWorksheet[cellRef] || { t: 's', v: '' };
        itemsWorksheet[cellRef].t = 's';
        itemsWorksheet[cellRef].z = '@';
    });
    
    // 創建工作簿並添加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, headerWorksheet, '報單表頭');
    XLSX.utils.book_append_sheet(workbook, itemsWorksheet, '報單項次');

    // 文件名
    const fileName = document.getElementById('FILE_NO').value.trim() || '';
    const exporterName = document.getElementById('SHPR_C_NAME').value.trim() || '';
    const remarkElement = document.getElementById('REMARK').value.trim() || '';

    // 下載 Excel 文件
    let exportFileName = '';

    if (fileName && exporterName && remarkElement) {
        exportFileName = `${fileName}-${exporterName}【${remarkElement}】.xlsx`;
    } else if (fileName && exporterName) {
        exportFileName = `${fileName}-${exporterName}.xlsx`;
    } else if (fileName && remarkElement) {
        exportFileName = `${fileName}【${remarkElement}】.xlsx`;
    } else if (exporterName && remarkElement) {
        exportFileName = `${exporterName}【${remarkElement}】.xlsx`;
    } else if (fileName) {
        exportFileName = `${fileName}.xlsx`;
    } else if (exporterName) {
        exportFileName = `${exporterName}.xlsx`;
    } else if (remarkElement) {
        exportFileName = `【${remarkElement}】.xlsx`;
    } else {
        exportFileName = 'export.xlsx';
    }

    XLSX.writeFile(workbook, exportFileName);
}

// 匯入XML文件的功能
function importXML(event) {
    clearField(); // 清空輸入框內容
    
    const file = event.target.files[0];
    if (file) {
        
        // 匹配檔名前面的數字部分
        const match = file.name.match(/^\d+/);
        const fileNumber = match ? match[0] : ''; // 如果沒有匹配到，設為空字符串
        document.getElementById('FILE_NO').value = fileNumber;

        // 提取【】內的文字
        const matchRemark = file.name.match(/【(.*?)】/);
        const fileRemark = matchRemark ? matchRemark[1] : ''; // 若無則回傳空字串
        document.getElementById('REMARK').value = fileRemark;

        const reader = new FileReader();
        reader.onload = function(e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "application/xml");

            // 解析表頭資料
            const headerFields = xmlDoc.getElementsByTagName("head")[0].getElementsByTagName("fields");
            Array.from(headerFields).forEach(field => {
                const fieldName = field.getElementsByTagName("field_name")[0].textContent;
                const fieldValue = unescapeXml(field.getElementsByTagName("field_value")[0].textContent);
                const element = document.getElementById(fieldName);
                if (element) {
                    element.value = fieldValue;
                }
            });

            searchData(false); // 出口人統一編號搜尋
            lookupExchangeRate(); // 當旬匯率
            handleCheck(); // 長期委任字號
            thingsToNote(); // 出口備註

            // 執行必填與不得填列欄位的檢查邏輯
            document.getElementById('CNEE_COUNTRY_CODE').dispatchEvent(new Event('input'));
            document.getElementById('TERMS_SALES').dispatchEvent(new Event('input'));

            // 解析項次資料
            const items = xmlDoc.getElementsByTagName("detail")[0].getElementsByTagName("items");
            const itemContainer = document.getElementById('item-container');
            itemContainer.innerHTML = ''; // 清空現有項次
            itemCount = 0; // 重置項次計數

            Array.from(items).forEach(item => {
                const itemData = {};
                const fields = item.getElementsByTagName("fields");
                Array.from(fields).forEach(field => {
                    const fieldName = field.getElementsByTagName("field_name")[0].textContent;
                    const fieldValue = unescapeXml(field.getElementsByTagName("field_value")[0].textContent);
                    itemData[fieldName] = fieldValue;
                });
                const itemRow = createItemRow(itemData);
                itemContainer.appendChild(itemRow);
            });

            initializeListeners();
            renumberItems(); // 重新編號所有項次
            updateRemark1FromImport(); // 更新REMARK1欄位並勾選對應的checkbox
        };
        reader.readAsText(file, "UTF-8");
    }
}

// 全域變數，追蹤哪些欄位需要顯示
const fieldsToShow = {
    ORG_COUNTRY: false,
    ORG_IMP_DCL_NO: false,
    ORG_IMP_DCL_NO_ITEM: false,
    SELLER_ITEM_CODE: false,
    BOND_NOTE: false,
    GOODS_MODEL: false,
    GOODS_SPEC: false,
    CERT_NO: false,
    CERT_NO_ITEM: false,
    ORG_DCL_NO: false,
    ORG_DCL_NO_ITEM: false,
    EXP_NO: false,
    EXP_SEQ_NO: false,
    WIDE: false,
    WIDE_UM: false,
    LENGT_: false,
    LENGTH_UM: false,
    ST_QTY: false,
    ST_UM: false
};

// 檢查所有項次中的欄位，並根據有值的情況同步顯示
function updateModalFieldVisibility() {
    for (let field in fieldsToShow) {
        if (fieldsToShow[field]) {
            document.getElementById(field).parentElement.classList.remove('hidden');
        }
    }
}

// 檢查所有項次中的欄位，並根據有值的情況同步顯示
function updateFieldVisibility() {
    for (let field in fieldsToShow) {
        if (fieldsToShow[field]) {
            document.querySelectorAll(`.form-group.${field}`).forEach(element => {
                element.classList.remove('hidden');
            });
        }
    }
}

// 當新增或更新項次時，判斷欄位是否有值並同步更新
function checkFieldValues(data) {
    for (let field in fieldsToShow) {
        if (data[field]) {
            fieldsToShow[field] = true;
        }
    }
    // 立即更新欄位顯示
    updateFieldVisibility();
}

// 當頁面初始化或更新時，調用 updateFieldVisibility 以確保同步顯示
document.addEventListener('DOMContentLoaded', () => {
    updateFieldVisibility();
});

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

function initializeFieldVisibility() {
    // 獲取目前選中的欄位
    const selectedOptions = Array.from(document.getElementById('field-select').selectedOptions).map(option => option.value);

    const allFields = [
        'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P', 'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'ISCALC_WT', 'NET_WT',
        'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 
        'ORG_IMP_DCL_NO_ITEM', 'SELLER_ITEM_CODE', 'BOND_NOTE', 'GOODS_MODEL', 'GOODS_SPEC', 
        'CERT_NO', 'CERT_NO_ITEM', 'ORG_DCL_NO', 'ORG_DCL_NO_ITEM', 'EXP_NO', 'EXP_SEQ_NO', 
        'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_QTY', 'ST_UM'
    ];

    allFields.forEach(field => {
        const fieldElements = document.querySelectorAll(`.item-header .${field}, #item-container .${field}`);
        
        // 設置 ST_UM 欄位為只讀
        if (field === 'ST_UM') {
            fieldElements.forEach(fieldElement => {
                fieldElement.setAttribute('readonly', true);
            });
        }
        
        // 判斷該欄位在所有項次中是否有值
        let hasValue = false;
        document.querySelectorAll(`#item-container .${field}`).forEach(itemField => {
            if (itemField.value && itemField.value.trim() !== '') {
                hasValue = true;
            }
        });

        fieldElements.forEach(fieldElement => {
            const formGroup = fieldElement.closest('.form-group');
            if (formGroup) {
                // 根據選擇的欄位和是否有值的條件決定是否顯示
                if (selectedOptions.includes(field) || hasValue) {
                    formGroup.classList.remove('hidden');
                } else {
                    formGroup.classList.add('hidden');
                }

                // 如果 ST_UM 欄位的值為 "MTK"，且 DOC_UM 的值不是 "MTK"，並且 ST_QTY 為空時，自動顯示 WIDE, WIDE_UM, LENGT_, LENGTH_UM 欄位
                if (field === 'ST_UM' && fieldElement.value && fieldElement.value.trim() === 'MTK') {
                    const docUmField = document.querySelector(`#item-container .DOC_UM`);
                    const stQtyField = document.querySelector(`#item-container .ST_QTY`);
                    if (
                        docUmField && docUmField.value.trim() !== 'MTK' && 
                        stQtyField && (!stQtyField.value || stQtyField.value.trim() === '')
                    ) {
                        ['WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM'].forEach(relatedField => {
                            document.querySelectorAll(`.${relatedField}`).forEach(relatedFieldElement => {
                                const relatedFormGroup = relatedFieldElement.closest('.form-group');
                                if (relatedFormGroup) {
                                    relatedFormGroup.classList.remove('hidden');
                                }
                            });
                        });
                    }
                }
                
                // 如果 ST_UM 欄位有值時，自動顯示 ST_QTY，不論 ST_QTY 是否有值
                if (field === 'ST_UM' && fieldElement.value && fieldElement.value.trim() !== '') {
                    document.querySelectorAll('.ST_QTY').forEach(stQtyField => {
                        const stQtyFormGroup = stQtyField.closest('.form-group');
                        if (stQtyFormGroup) {
                            stQtyFormGroup.classList.remove('hidden');
                        }
                    });
                }
            }
        });
    });
}

// 當頁面初始化或更新時，調用 initializeFieldVisibility 以確保同步顯示
document.addEventListener('DOMContentLoaded', () => {
    initializeFieldVisibility();
});

let textareaCounter = 0;
let allExpanded = false; // 用於跟蹤所有文本域的展開/折疊狀態

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
    const buttonText = newRows === 1 ? '展開全部品名' : (newRows === 5 ? '展開全部至 10 行' : '折疊全部至 1 行');
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

// 數量核算
function calculateQuantities() {
    // 在執行計算前先更新所有稅則
    updateAllTariffs();

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        return;
    }

    let unitQuantities = {};
    let stUnitQuantities = {};

    items.forEach(row => {
        // 計算 DOC_UM 和 QTY
        const unit = row.querySelector('.DOC_UM').value;
        const quantityElement = row.querySelector('.QTY');
        if (quantityElement && quantityElement.value.trim() !== '') {
            const quantity = parseFloat(quantityElement.value);
            if (!isNaN(quantity)) {
                if (!unitQuantities[unit]) {
                    unitQuantities[unit] = 0;
                }
                unitQuantities[unit] += quantity;
            }
        }

        // 計算 ST_UM 和 ST_QTY
        const stUnit = row.querySelector('.ST_UM').value;
        const stQuantityElement = row.querySelector('.ST_QTY');
        if (stQuantityElement && stQuantityElement.value.trim() !== '') {
            const stQuantity = parseFloat(stQuantityElement.value);
            if (!isNaN(stQuantity)) {
                if (!stUnitQuantities[stUnit]) {
                    stUnitQuantities[stUnit] = 0;
                }
                stUnitQuantities[stUnit] += stQuantity;
            }
        }
    });

    // 構建數量總計字符串
    let unitQuantitiesString = '數量單位加總為：';
    for (const [unit, totalQuantity] of Object.entries(unitQuantities)) {
        unitQuantitiesString += `\n${parseFloat(totalQuantity.toFixed(6))} ${unit}`;
    }

    let stUnitQuantitiesString = '統計用數量單位加總為：';
    let hasStUnitQuantities = false;
    for (const [unit, stTotalQuantity] of Object.entries(stUnitQuantities)) {
        if (stTotalQuantity > 0) {
            hasStUnitQuantities = true;
        }
        stUnitQuantitiesString += `\n(${parseFloat(stTotalQuantity.toFixed(6))} ${unit})`;
    }

    // 顯示數量總計
    if (hasStUnitQuantities) {
        alert(`${unitQuantitiesString}\n\n${stUnitQuantitiesString}`);
    } else {
        alert(unitQuantitiesString);
    }
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

// 金額核算
function calculateAmounts() {
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        return;
    }

    // 遍歷每個項次，先計算 DOC_TOT_P = QTY * DOC_UNIT_P
    items.forEach((row) => {
        // 使用 Decimal 取得數值
        const qty = new Decimal(row.querySelector('.QTY').value || 0); // 數量
        const unitPrice = new Decimal(row.querySelector('.DOC_UNIT_P').value || 0); // 單價
        const totalPriceField = row.querySelector('.DOC_TOT_P'); // 總金額欄位
    
        // 計算總金額，使用 Decimal 避免浮點數精度問題
        const totalPrice = qty.mul(unitPrice);
    
        // 更新欄位值，保留指定小數位數
        totalPriceField.value = totalPrice.toFixed(decimalPlaces);
    });
    
    // 計算各項次金額的加總
    let totalItemsAmount = Array.from(items).reduce((sum, item) => {
        const amount = parseFloat(item.querySelector('.DOC_TOT_P').value);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const termsSales = document.getElementById('TERMS_SALES').value;
    const totalDocumentAmount = parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value) || 0;
    const currency = document.getElementById('CURRENCY').value || '';

    // 獲取額外費用
    const freight = parseFloat(document.getElementById('FRT_AMT').value) || 0; // 運費
    const insurance = parseFloat(document.getElementById('INS_AMT').value) || 0; // 保險費
    const additionalCost = parseFloat(document.getElementById('ADD_AMT').value) || 0; // 應加費用
    const deductibleCost = parseFloat(document.getElementById('SUBTRACT_AMT').value) || 0; // 應減費用

    // 根據貿易條件計算總金額
    let calculatedTotalAmount = totalItemsAmount;
    let calculationFormula = '';
    let explanation = '';
    let isEXWValid = true;

    switch (termsSales) {
        case 'EXW':
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)}`;
            explanation = '項次金額加總';
            
            // 檢查 EXW 條件下運費、保險費、應減費用是否為零，且 ADD_AMT 需大於 0
            if (freight !== 0 || insurance !== 0 || deductibleCost !== 0 || additionalCost <= 0) {
                isEXWValid = false;
            }
            break;
        case 'FOB':
            calculatedTotalAmount += freight + insurance + additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${freight.toFixed(decimalPlaces)} (運費) + ${insurance.toFixed(decimalPlaces)} (保險費) + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+運費+保險費+應加費用-應減費用';
            break;
        case 'CFR':
            calculatedTotalAmount += insurance + additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${insurance.toFixed(decimalPlaces)} (保險費) + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+保險費+應加費用-應減費用';
            break;
        case 'C&I':
            calculatedTotalAmount += freight + additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${freight.toFixed(decimalPlaces)} (運費) + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+運費+應加費用-應減費用';
            break;
        case 'CIF':
            calculatedTotalAmount += additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+應加費用-應減費用';
            break;
        default:
            alert('無效的貿易條件，請檢查輸入。');
            return;
    }

    // 檢查 DESCRIPTION 欄位是否包含指定的關鍵字
    const keywords = ["COST", "FEE", "CHARGE", "FREIGHT", "INSURANCE", "DISCOUNT", "SHIPPING", "POSTAGE"];
    let keywordAlerts = [];
    let calculationAlerts = "";

    // 檢查計算結果是否與表頭金額相同
    if (calculatedTotalAmount.toFixed(2) === totalDocumentAmount.toFixed(2)) {
        if (termsSales === 'EXW' && !isEXWValid) {
            calculationAlerts = `【${termsSales} 計算公式：${explanation}】\n系統計算的總金額為：${currency} ${calculatedTotalAmount.toFixed(decimalPlaces)}\n----------------------------------------------------\n報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(decimalPlaces)}\n【錯誤！運費、保險費或應減費用不應有值，應加費用需有值】\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(decimalPlaces)}`;
        } else {
            calculationAlerts = `【${termsSales} 計算公式：${explanation}】\n系統計算的總金額為：${currency} ${calculatedTotalAmount.toFixed(decimalPlaces)}\n----------------------------------------------------\n報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(decimalPlaces)}【正確】\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(decimalPlaces)}`;
        }
    } else {
        calculationAlerts = `【${termsSales} 計算公式：${explanation}】\n系統計算的總金額為：${currency} ${calculatedTotalAmount.toFixed(decimalPlaces)}\n----------------------------------------------------\n報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(decimalPlaces)}【錯誤！】\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(decimalPlaces)}`;
    }

    // 檢查項次內的描述欄位是否包含指定的關鍵字
    items.forEach((row, index) => {
        const description = row.querySelector('.DESCRIPTION').value.toUpperCase(); // 將描述轉為大寫
        keywords.forEach(keyword => {
            if (description.includes(keyword)) {
                keywordAlerts.push(`\n➤ No. ${index + 1} 內含關鍵字 "${keyword}"，請確認是否為其他費用。`);
            }
        });
        calculateAmountsForRow(row, decimalPlaces);
    });

    // 合併顯示計算結果提示與關鍵字提示
    const combinedAlerts = [calculationAlerts, ...keywordAlerts].join('\n');
    if (combinedAlerts) {
        alert(combinedAlerts);
    }
}

// 重量核算
function calculateWeight() {
    const totalNetWeight = parseFloat(document.getElementById('DCL_NW').value);
    if (isNaN(totalNetWeight) || totalNetWeight <= 0) {
        return;
    }

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        return;
    }

    let totalCalculatedWeight = 0;

    items.forEach((item) => {
        const netWeight = parseFloat(item.querySelector('.NET_WT').value);
        if (!isNaN(netWeight)) {
            totalCalculatedWeight += netWeight;
        }
    });

    // 確保結果最多顯示六位小數
    totalCalculatedWeight = parseFloat(totalCalculatedWeight.toFixed(6));

    // 顯示最終加總的重量
    if (totalNetWeight === totalCalculatedWeight) {
        alert(`報單表頭的總淨重為：${totalNetWeight}【正確】\n各項次的淨重加總為：${totalCalculatedWeight}`);
    } else if (totalNetWeight !== totalCalculatedWeight) {
        alert(`報單表頭的總淨重為：${totalNetWeight}【錯誤！】\n各項次的淨重加總為：${totalCalculatedWeight}`);
    }
}

// 開啟彈跳框
function openSpreadWeightModal(mode = "1") {
    const modal = document.getElementById("spread-weight-modal");
    const confirmButton = document.getElementById("confirm-button");
    const spreadMode = document.getElementById("spread-mode");
    const specificRange = document.getElementById("specific-range");
    const specificWeight = document.getElementById("specific-weight");

    // 設定模式
    spreadMode.value = mode;

    // 初始化 specific-range 和 specific-weight
    specificRange.value = ""; // 清空指定範圍
    specificWeight.value = ""; // 清空指定總重量
    
    const specificOptions = document.getElementById("specific-options");
    specificOptions.style.display = mode === "2" ? "block" : "none";

    // 顯示彈跳框
    modal.style.display = "block";

    // 焦點設置根據模式
    if (mode === "1") {
        confirmButton.focus(); // 焦點設置到確定按鈕
    } else if (mode === "2") {
        specificRange.focus(); // 焦點設置到指定範圍的輸入框
    }

    // 啟用焦點循環
    trapFocus(modal);
}

// 關閉彈跳框
function closeSpreadWeightModal() {
    const modal = document.getElementById("spread-weight-modal");

    // 隱藏彈跳框
    modal.style.display = "none";

    // 停止焦點循環
    document.removeEventListener("keydown", focusHandler);
}

// 初始化事件（只執行一次）
document.addEventListener("DOMContentLoaded", function () {
    const spreadMode = document.getElementById("spread-mode");

    // 模式切換事件
    spreadMode.addEventListener("change", function () {
        const specificOptions = document.getElementById("specific-options");
        if (this.value === "2") {
            specificOptions.style.display = "block";
        } else {
            specificOptions.style.display = "none";
        }
    });

    // 啟用拖動功能
    enableModalDrag();

    // 快捷鍵事件
    document.addEventListener("keydown", function (event) {
        if (event.altKey && event.key === "1") {
            // Alt+1 開啟全部項次模式
            openSpreadWeightModal("1");
            event.preventDefault();
        } else if (event.altKey && event.key === "2") {
            // Alt+2 開啟指定項次模式
            openSpreadWeightModal("2");
            event.preventDefault();
        } else if (event.altKey && event.key === "Enter") {
            // Alt+Enter 確定
            const modal = document.getElementById("spread-weight-modal");
            if (modal && modal.style.display === "block") {
                applySpreadWeight(); // 觸發確定邏輯
                event.preventDefault(); // 防止預設行為
            }
        } else if (event.key === "Escape") {
            // Esc 取消
            const modal = document.getElementById("spread-weight-modal");
            if (modal && modal.style.display === "block") {
                closeSpreadWeightModal(); // 關閉模態框
                event.preventDefault(); // 防止預設行為
            }
        }
    });
});

// 啟用焦點循環
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const focusHandler = (event) => {
        if (event.key === "Tab") {
            if (event.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    };

    document.addEventListener("keydown", focusHandler);
}

// 啟用彈跳框拖動功能
function enableModalDrag() {
    const modal = document.getElementById("spread-weight-modal");
    const header = modal.querySelector("#modal-header");

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    header.addEventListener("mousedown", (event) => {
        isDragging = true;
        offsetX = event.clientX - modal.offsetLeft;
        offsetY = event.clientY - modal.offsetTop;

        // 禁用文字選取
        document.body.style.userSelect = "none";

        document.addEventListener("mousemove", moveModal);
        document.addEventListener("mouseup", stopDrag);
    });

    function moveModal(event) {
        if (isDragging) {
            modal.style.left = `${event.clientX - offsetX}px`;
            modal.style.top = `${event.clientY - offsetY}px`;
        }
    }

    function stopDrag() {
        isDragging = false;

        // 恢復文字選取
        document.body.style.userSelect = "";
        
        document.removeEventListener("mousemove", moveModal);
        document.removeEventListener("mouseup", stopDrag);
    }
}

// 套用攤重
function applySpreadWeight() {
    const mode = document.getElementById("spread-mode").value; // 獲取模式
    const weightDecimalPlaces = parseInt(document.getElementById("weight-decimal-places").value, 10); // 獲取小數位數

    if (isNaN(weightDecimalPlaces) || weightDecimalPlaces < 0 || weightDecimalPlaces > 6) {
        alert("請輸入有效的小數位數 (0-6)");
        return;
    }

    if (mode === "2") {
        // 指定項次攤重模式
        const specificWeight = parseFloat(document.getElementById("specific-weight").value); // 獲取指定總重量
        const rangeInput = document.getElementById("specific-range").value; // 獲取指定範圍

        // 獲取「攤重後是否鎖定」選項
        const lockAfterDistribution = document.querySelector('input[name="lock-after-distribution"]:checked').value === "yes";

        if (isNaN(specificWeight) || specificWeight <= 0) {
            alert("請輸入有效的攤重總重量");
            return;
        }

        if (!rangeInput) {
            alert("請輸入有效的項次範圍");
            return;
        }

        // 使用 parseRanges 函數解析範圍
        const ranges = parseRanges(rangeInput);
        if (!ranges || ranges.length === 0) {
            alert("請輸入有效的項次範圍");
            return;
        }

        spreadWeightSpecific(ranges, specificWeight, weightDecimalPlaces, lockAfterDistribution);
    } else {
        // 默認全部項次攤重
        spreadWeightDefault(weightDecimalPlaces); // 執行全部項次攤重
    }

    closeSpreadWeightModal(); // 關閉彈跳框
}

// 計算總重量的輔助函數
function calculateTotalWeight(items) {
    return items.reduce((sum, item) => {
        const netWeight = parseFloat(item.querySelector('.NET_WT').value);
        return sum + (isNaN(netWeight) ? 0 : netWeight);
    }, 0);
}

// 默認全部項次攤重
function spreadWeightDefault(weightDecimalPlaces) {
    const totalNetWeight = parseFloat(document.getElementById('DCL_NW').value);
    if (isNaN(totalNetWeight) || totalNetWeight <= 0) {
        alert('請先填寫有效的總淨重');
        return;
    }

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        alert('請先新增至少一個項次');
        return;
    }

    let fixedWeights = [];
    let lockedWeightTotal = 0; // 已鎖定項次的總重量
    let remainingNetWeight = totalNetWeight;
    let totalQuantity = 0;

    // 確認哪些項次是固定的
    items.forEach((item, index) => {
        const checkbox = item.querySelector('.ISCALC_WT');
        let netWeight = parseFloat(item.querySelector('.NET_WT').value);

        // 如果值無效或為零，重置為零並取消選中
        if (!netWeight || isNaN(netWeight)) {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
            netWeight = 0;
        }

        if (checkbox && checkbox.checked) {
            fixedWeights.push({ index, netWeight });
            lockedWeightTotal += netWeight; // 累加已鎖定項次的重量
        } else {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            if (!isNaN(quantity)) {
                totalQuantity += quantity;
            }
        }
    });

    // 檢查已鎖定的總重量是否超過總淨重
    if (lockedWeightTotal > totalNetWeight) {
        alert(`攤重失敗！\n已鎖定項次的重量加總 (${parseFloat(lockedWeightTotal.toFixed(6))}) 超過總淨重 (${parseFloat(totalNetWeight.toFixed(6))})`);
        return;
    }

    remainingNetWeight -= lockedWeightTotal;

    if (totalQuantity <= 0) {
        alert('未鎖定的數量總和必須大於零');
        return;
    }

    // 分配剩餘重量
    const distributedWeights = [];
    const minWeight = Math.pow(10, -weightDecimalPlaces);
    items.forEach((item, index) => {
        if (!fixedWeights.some(fixed => fixed.index === index)) {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            if (!isNaN(quantity) && quantity > 0) {
                let netWeight = parseFloat(((quantity / totalQuantity) * remainingNetWeight).toFixed(weightDecimalPlaces));
                if (netWeight <= 0) netWeight = minWeight;
                distributedWeights.push({ index, netWeight });
            }
        }
    });

    // 應用分配的重量
    distributedWeights.forEach(item => {
        const netWtElement = items[item.index].querySelector('.NET_WT');
        netWtElement.value = item.netWeight.toFixed(weightDecimalPlaces);
    });

    // 確保固定項次的值不變
    fixedWeights.forEach(fixed => {
        const netWtElement = items[fixed.index].querySelector('.NET_WT');
        netWtElement.value = fixed.netWeight;
    });

    // 確保重量總和等於總淨重
    let finalTotalWeight = calculateTotalWeight(Array.from(items));
    let discrepancy = totalNetWeight - finalTotalWeight;

    if (Math.abs(discrepancy) > 0) {
        const largestItem = distributedWeights.reduce((prev, current) => {
            return (prev.netWeight > current.netWeight) ? prev : current;
        });

        const netWtElement = items[largestItem.index].querySelector('.NET_WT');
        netWtElement.value = (parseFloat(netWtElement.value) + discrepancy).toFixed(weightDecimalPlaces);
    }

    // 最終結果
    finalTotalWeight = calculateTotalWeight(Array.from(items));
    alert(`報單表頭的總淨重為：${totalNetWeight}\n各項次的淨重加總為：${parseFloat(finalTotalWeight.toFixed(weightDecimalPlaces))}`);
}

// 指定項次攤重
function spreadWeightSpecific(ranges, specificWeight, weightDecimalPlaces, lockAfterDistribution) {
    const items = document.querySelectorAll('#item-container .item-row');
    let totalQuantity = 0; // 未鎖定項次的總數量
    let validItems = []; // 可分配重量的項次
    let lockedWeight = 0; // 已鎖定的總重量
    const minWeight = Math.pow(10, -weightDecimalPlaces); // 最小分配重量

    // 檢查範圍內的項次
    items.forEach((item, index) => {
        const checkbox = item.querySelector('.ISCALC_WT');
        let netWeight = parseFloat(item.querySelector('.NET_WT').value);

        // 如果值無效或為零，重置為零並取消選中
        if (!netWeight || isNaN(netWeight)) {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
            netWeight = 0;
        }
                
        const itemNo = index + 1; // 假設項次從1開始
        if (ranges.includes(itemNo)) {
            const checkbox = item.querySelector('.ISCALC_WT');
            const netWeight = parseFloat(item.querySelector('.NET_WT').value);
            const quantity = parseFloat(item.querySelector('.QTY').value);

            if (!isNaN(netWeight) && checkbox && checkbox.checked) {
                // 已鎖定項次的重量加總
                lockedWeight += netWeight;
            } else if (!isNaN(quantity) && quantity > 0) {
                // 未鎖定項次，加入到可分配列表
                validItems.push({ index, quantity });
                totalQuantity += quantity;
            }
        }
    });

    // 計算剩餘重量
    let remainingWeight = specificWeight - lockedWeight;

    if (remainingWeight <= 0) {
        alert(`攤重失敗！\n已鎖定項次的重量加總 (${lockedWeight.toFixed(weightDecimalPlaces)}) 超過指定項次總重量 (${specificWeight})`);
        return;
    }

    if (totalQuantity <= 0) {
        alert("指定的範圍內無有效的未鎖定項次。");
        return;
    }

    // 計算每個單位的重量
    const weightPerUnit = remainingWeight / totalQuantity;

    // 分配重量到未鎖定的項次
    let distributedWeights = [];
    validItems.forEach(item => {
        let weight = parseFloat((item.quantity * weightPerUnit).toFixed(weightDecimalPlaces));
        weight = Math.max(weight, minWeight); // 確保重量不小於最小分配值
        distributedWeights.push({ index: item.index, netWeight: weight });
    });

    // 計算分配後的實際加總重量
    const allocatedTotalWeight = distributedWeights.reduce((sum, item) => sum + item.netWeight, 0);

    // 調整誤差值
    let discrepancy = specificWeight - lockedWeight - allocatedTotalWeight;
    if (Math.abs(discrepancy) > 0) {
        const largestItem = distributedWeights.reduce((prev, current) => {
            return (prev.netWeight > current.netWeight) ? prev : current;
        });

        const netWtElement = items[largestItem.index].querySelector('.NET_WT');
        netWtElement.value = (parseFloat(netWtElement.value) + discrepancy).toFixed(weightDecimalPlaces);
    }

    // 更新 DOM
    distributedWeights.forEach(item => {
        const netWtElement = items[item.index].querySelector('.NET_WT');
        netWtElement.value = item.netWeight.toFixed(weightDecimalPlaces);
    });

    // 是否鎖定攤重後的項次
    if (lockAfterDistribution) {
        validItems.forEach(item => {
            const lockCheckbox = items[item.index].querySelector('.ISCALC_WT');
            if (lockCheckbox) lockCheckbox.checked = true;
        });
    }

    // 確保最終加總等於指定重量（僅限指定範圍）
    let finalTotalWeight = validItems.reduce((sum, item) => {
        const netWeight = parseFloat(items[item.index].querySelector('.NET_WT').value);
        return sum + (isNaN(netWeight) ? 0 : netWeight);
    }, lockedWeight);

    discrepancy = specificWeight - finalTotalWeight;

    if (Math.abs(discrepancy) > 0) {
        // 找出指定範圍內未鎖定的最大重量項次
        const largestItem = distributedWeights.reduce((prev, current) => {
            return (prev.netWeight > current.netWeight) ? prev : current;
        });

        const netWtElement = items[largestItem.index].querySelector('.NET_WT');
        netWtElement.value = (parseFloat(netWtElement.value) + discrepancy).toFixed(weightDecimalPlaces);
    }
}

// 將範圍字串轉換為數字陣列
function parseRanges(rangeInput) {
    try {
        let ranges = [];
        const parts = rangeInput.split(",");
        parts.forEach(part => {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(num => parseInt(num.trim(), 10));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        ranges.push(i);
                    }
                }
            } else {
                const num = parseInt(part.trim(), 10);
                if (!isNaN(num)) {
                    ranges.push(num);
                }
            }
        });
        return ranges;
    } catch (error) {
        return null;
    }
}

// 定義快捷鍵監聽
document.addEventListener("keydown", function(event) {
    // 檢查是否按下 Alt + Q 或 Alt + q
    if (event.altKey && (event.key === 'Q' || event.key === 'q')) {
        event.preventDefault(); // 防止預設行為
        calculate(); // 呼叫計算函數
    }
});

function calculate() {
    let messages = []; // 用來儲存所有提示訊息

    // 數量核算
    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        messages.push('請先新增至少一個項次。');
    }

    // 總淨重檢查
    const totalNetWeight = parseFloat(document.getElementById('DCL_NW').value);
    if (isNaN(totalNetWeight) || totalNetWeight <= 0) {
        messages.push('請先填寫有效的總淨重。');
    }

    // 如果有訊息，合併顯示
    if (messages.length > 0) {
        alert(messages.join('\n'));
        return;
    }

    calculateQuantities(); //數量核算
    calculateAmounts(); // 金額核算
    calculateWeight(); // 重量核算
    initializeFieldVisibility(); // 更新欄位顯示狀態

    // 更新核算狀態
    document.getElementById("calculation-status").value = "已執行";
}

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

// 添加事件監聽器
document.addEventListener('DOMContentLoaded', function () {
    // 為 QTY 和 DOC_UNIT_P 輸入框添加事件監聽器
    document.querySelectorAll('.QTY, .DOC_UNIT_P').forEach(function (element) {
        element.addEventListener('input', calculateAmount);
    });

    function updateVariables() {
        const appDutyRefund = document.getElementById('APP_DUTY_REFUND');
        const markTotLines = document.getElementById('MARK_TOT_LINES');
        const examType = document.getElementById('EXAM_TYPE');
        const copyQty = document.getElementById('COPY_QTY');

        const copy3_e = document.getElementById('copy_3_e');
        const copy3 = document.getElementById('copy_3');
        const copy4 = document.getElementById('copy_4');
        const copy5 = document.getElementById('copy_5');

        const remark1 = document.getElementById('REMARK1');

        // 確保 申請沖退原料稅（E化退稅）和 申請報單副本第三聯（沖退原料稅用聯) 只能擇一
        if (copy3_e.checked) {
            if (copy3.checked) {
                alert("申請沖退原料稅（E化退稅）\n申請報單副本第三聯（沖退原料稅用聯)\n\n請擇一選擇");
                copy3_e.checked = false;
                copy3.checked = false;
                // 清空 REMARK1 欄位的值
                remark1.value = '';
                return; // 退出函數以确保不進行後續處理
            }
        } else if (copy3.checked) {
            if (copy3_e.checked) {
                alert("申請沖退原料稅（E化退稅）\n申請報單副本第三聯（沖退原料稅用聯)\n\n請擇一選擇");
                copy3_e.checked = false;
                copy3.checked = false;
                // 清空 REMARK1 欄位的值
                remark1.value = '';
                return; // 退出函數以确保不進行後續處理
            }
        }

        // 更新 APP_DUTY_REFUND 和 MARK_TOT_LINES
        appDutyRefund.value = (copy3_e.checked || copy3.checked) ? 'Y' : 'N';
        markTotLines.value = (copy3_e.checked || copy3.checked) ? 'Y' : 'N';

        // 更新 EXAM_TYPE 和 COPY_QTY
        if (copy3.checked || copy4.checked || copy5.checked) {
            examType.value = '8';
            copyQty.value = '1';
        } else {
            examType.value = '';
            copyQty.value = '0';
        }

        // 檢查統計方式及輸出許可號碼欄位，決定是否更新 EXAM_TYPE 為 '8'
        let shouldSetExamType = false;
        document.querySelectorAll("#item-container .item-row").forEach((item) => {
            const stMtdValue = item.querySelector('.ST_MTD')?.value.toUpperCase() || '';
            const expNoValue = item.querySelector('.EXP_NO')?.value.trim() || '';
            const expSeqNoValue = item.querySelector('.EXP_SEQ_NO')?.value.trim() || ''; // 確保這裡正確初始化 expSeqNoValue
        
            // 判斷 ST_MTD 是否為 '1A', '8A', '8D'，或 EXP_NO 是否為 14 碼，或 EXP_NO 與 EXP_SEQ_NO 皆有值
            if (['1A', '8A', '8D'].includes(stMtdValue) || expNoValue.length === 14 || (expNoValue && expSeqNoValue)) {
                shouldSetExamType = true;
            }
        });
    
        if (shouldSetExamType) {
            // examType.value = '8'; 暫取消查驗
        }
        
        // 用於顯示變數值的控制台日誌
        console.log("APP_DUTY_REFUND: " + appDutyRefund.value);
        console.log("MARK_TOT_LINES: " + markTotLines.value);
        console.log("EXAM_TYPE: " + examType.value);
        console.log("COPY_QTY: " + copyQty.value);
    }
    
    async function exportToXML() {
        updateVariables(); // 在匯出XML之前更新變數

        const requiredFields = [
            { id: 'FILE_NO', name: '文件編號' },
            { id: 'SHPR_BAN_ID', name: '出口人統一編號' },
            { id: 'SHPR_C_NAME', name: '出口人中文名稱' },
            { id: 'SHPR_C_ADDR', name: '出口人中文地址' },
            { id: 'CNEE_COUNTRY_CODE', name: '買方國家代碼' },
            { id: 'TO_CODE', name: '目的地(代碼)' },
            { id: 'TO_DESC', name: '目的地(名稱)' },
            { id: 'TOT_CTN', name: '總件數' },
            { id: 'DOC_CTN_UM', name: '總件數單位' },
            { id: 'DCL_GW', name: '總毛重' },
            { id: 'DCL_NW', name: '總淨重' },
            { id: 'DCL_DOC_TYPE', name: '報單類別' },
            { id: 'TERMS_SALES', name: '貿易條件' },
            { id: 'CURRENCY', name: '幣別' },
            { id: 'CAL_IP_TOT_ITEM_AMT', name: '總金額' }
        ];

        // 檢查是否有未填寫的必要欄位
        let missingFields = [];
        requiredFields.forEach(field => {
            let element = document.getElementById(field.id);
            if (element && !element.value.trim()) {
                missingFields.push(field.name);
            }
        });

        // 統一處理 SHPR_E_NAME 和 SHPR_E_ADDR
        function updateFieldIfEmpty(targetId, sourceId) {
            let sourceElement = document.getElementById(sourceId);
            let targetElement = document.getElementById(targetId);

            if (sourceElement && targetElement) {
                targetElement.value = targetElement.value?.trim() || sourceElement.value.trim();
            }
        }

        // 更新 SHPR_E_NAME (若無值則使用 SHPR_C_NAME)
        updateFieldIfEmpty('SHPR_E_NAME', 'SHPR_C_NAME');

        // 更新 SHPR_E_ADDR (若無值則使用 SHPR_C_ADDR)
        updateFieldIfEmpty('SHPR_E_ADDR', 'SHPR_C_ADDR');
        
        // 單獨檢查 CNEE_C_NAME 和 CNEE_E_NAME
        let cneeCName = document.getElementById('CNEE_C_NAME');
        let cneeEName = document.getElementById('CNEE_E_NAME');

        if (
            (!cneeCName || !cneeCName.value.trim()) &&
            (!cneeEName || !cneeEName.value.trim())
        ) {
            missingFields.push('買方中/英名稱');
        }        

        // 單獨檢查 CNEE_COUNTRY_CODE
        let countryCodeElement = document.getElementById('CNEE_COUNTRY_CODE');
        if (countryCodeElement && countryCodeElement.value.trim() === 'TW') {
            // 檢查 CNEE_BAN_ID、BUYER_E_NAME、BUYER_E_ADDR 是否填寫
            const additionalFields = [
                { id: 'CNEE_BAN_ID', name: '買方統一編號' },
                { id: 'BUYER_E_NAME', name: '收方名稱' },
                { id: 'BUYER_E_ADDR', name: '收方地址' }
            ];

            additionalFields.forEach(field => {
                let element = document.getElementById(field.id);
                if (element && !element.value.trim()) {
                    missingFields.push(field.name);
                }
            });
        }
        
        // 如果有未填寫的欄位，提示使用者
        if (missingFields.length > 0) {
            alert(`以下欄位為空，請填寫後再匯出：\n${missingFields.join('、')}`);
            return; // 中止匯出過程
        }

        // 檢查CNEE_COUNTRY_CODE是否為TW，並確認BUYER_E_NAME, BUYER_E_ADDR是否有值
        let cneeCountryCode = document.getElementById('CNEE_COUNTRY_CODE')?.value.trim().toUpperCase();
        if (cneeCountryCode === 'TW') {
            let buyerEName = document.getElementById('BUYER_E_NAME')?.value.trim();
            let buyerEAddr = document.getElementById('BUYER_E_ADDR')?.value.trim();

            if (!buyerEName || !buyerEAddr) {
                alert('買方為台灣營業公司需填列：收方名稱、收方地址');
                return; // 中止匯出過程
            }
        }
        
        // 檢查總毛重是否大於總淨重
        let dclGw = parseFloat(document.getElementById('DCL_GW')?.value.trim());
        let dclNw = parseFloat(document.getElementById('DCL_NW')?.value.trim());

        if (!isNaN(dclGw) && !isNaN(dclNw) && dclGw <= dclNw) {
            alert('總毛重必須大於總淨重，請確認後再匯出');
            return; // 中止匯出過程
        }

        // 檢查貿易條件
        let termsSalesValue = document.getElementById('TERMS_SALES')?.value.trim().toUpperCase();

        if (termsSalesValue === 'EXW') {
            // EXW: FRT_AMT, INS_AMT, SUBTRACT_AMT 不得填列，ADD_AMT 不可為空
            let invalidFields = [];
            ['FRT_AMT', 'INS_AMT', 'SUBTRACT_AMT'].forEach(className => {
                let element = document.getElementById(className);
                if (element && element.value.trim()) {
                    invalidFields.push(className === 'FRT_AMT' ? '運費' : className === 'INS_AMT' ? '保險費' : '應減費用');
                }
            });
            if (invalidFields.length > 0) {
                alert(`當貿易條件為 EXW 時，下列欄位不得填列：\n${invalidFields.join('、')}`);
                return; // 中止匯出過程
            }

            let addAmtElement = document.getElementById('ADD_AMT');
            if (!addAmtElement || !addAmtElement.value.trim()) {
                alert('當貿易條件為 EXW 時，應加費用 不可為空');
                return; // 中止匯出過程
            }
        }

        if (termsSalesValue === 'CFR') {
            // CFR: FRT_AMT 不可為空
            let frtAmtElement = document.getElementById('FRT_AMT');
            if (!frtAmtElement || !frtAmtElement.value.trim()) {
                alert('當貿易條件為 CFR 時，運費 不可為空');
                return; // 中止匯出過程
            }
        }

        if (termsSalesValue === 'C&I') {
            // C&I: INS_AMT 不可為空
            let insAmtElement = document.getElementById('INS_AMT');
            if (!insAmtElement || !insAmtElement.value.trim()) {
                alert('當貿易條件為 C&I 時，保險費 不可為空');
                return; // 中止匯出過程
            }
        }

        if (termsSalesValue === 'CIF') {
            // CIF: FRT_AMT, INS_AMT 不可為空
            let missingFields = [];
            ['FRT_AMT', 'INS_AMT'].forEach(className => {
                let element = document.getElementById(className);
                if (!element || !element.value.trim()) {
                    missingFields.push(className === 'FRT_AMT' ? '運費' : '保險費');
                }
            });
            if (missingFields.length > 0) {
                alert(`當貿易條件為 CIF 時，下列欄位不可為空：\n${missingFields.join('、')}`);
                return; // 中止匯出過程
            }
        }
    
        const dclDocType = document.getElementById('DCL_DOC_TYPE').value.trim().toUpperCase();
        const itemRequiredFields = [
            { className: 'DESCRIPTION', name: '品名' },
            { className: 'QTY', name: '數量' },
            { className: 'DOC_UM', name: '單位' },
            { className: 'DOC_UNIT_P', name: '單價' },
            { className: 'DOC_TOT_P', name: '金額' },
            { className: 'TRADE_MARK', name: '商標' },
            { className: 'CCC_CODE', name: '稅則' },
            { className: 'ST_MTD', name: '統計方法' },
            { className: 'NET_WT', name: '淨重' }
        ];

        // 檢查 DCL_DOC_TYPE 是否為 B8 或 B9，並確保 SHPR_BONDED_ID 或 FAC_BONDED_ID_EX 其中一欄需有值
        if (['B8', 'B9'].includes(dclDocType)) {
            let shprBondedId = document.getElementById('SHPR_BONDED_ID')?.value.trim();
            let facBondedIdEx = document.getElementById('FAC_BONDED_ID_EX')?.value.trim();
            let facBanIdEx = document.getElementById('FAC_BAN_ID_EX')?.value.trim();

            // 如果 SHPR_BONDED_ID 和 FAC_BONDED_ID_EX 都為空，則顯示錯誤訊息並中止匯出
            if (!shprBondedId && !facBondedIdEx) {
                alert('當報單類別為 B8 或 B9 時，海關監管編號需填列\n(若為合作外銷案件，則改填保稅相關信息—保稅廠欄位)');
                return; // 中止匯出過程
            }
        }
        
        // 如果 DCL_DOC_TYPE 是 B8、B9、D5 或 F5，還需要檢查 SELLER_ITEM_CODE 和 BOND_NOTE
        if (['B8', 'B9', 'D5', 'F5'].includes(dclDocType)) {
            itemRequiredFields.push(
                { className: 'SELLER_ITEM_CODE', name: '賣方料號' },
                { className: 'BOND_NOTE', name: '保稅貨物註記' }
            );
        } else {
            // 如果 DCL_DOC_TYPE 不是 B8、B9、D5 或 F5，則 SHPR_BONDED_ID、SELLER_ITEM_CODE 和 BOND_NOTE 不得填列
            let invalidFields = [];

            // 檢查 SHPR_BONDED_ID 是否有值
            let shprBondedIdElement = document.getElementById('SHPR_BONDED_ID');
            if (shprBondedIdElement && shprBondedIdElement.value.trim()) {
                invalidFields.push('海關監管編號');
            }

            // 遍歷每個項次，檢查 SELLER_ITEM_CODE 和 BOND_NOTE 是否有值
            document.querySelectorAll('.item-row').forEach(item => {
                ['SELLER_ITEM_CODE', 'BOND_NOTE'].forEach(className => {
                    let element = item.querySelector(`.${className}`);
                    if (element && element.value && element.value.trim()) { // 確保 element 存在且 value 有值
                        invalidFields.push(className === 'SELLER_ITEM_CODE' ? '賣方料號' : '保稅貨物註記');
                    }
                });
            });

            if (invalidFields.length > 0) {
                alert(`報單類別不是 B8、B9、D5、F5 ，下列欄位不得填列：\n${invalidFields.join('、')}`);
                return; // 中止匯出過程
            }
        }
    
        let itemContainer = document.querySelectorAll("#item-container .item-row");
        let itemNoCheckedCount = 0; // 用來計算連續勾選大品名註記的次數
        
        for (let item of itemContainer) {
            let itemNoChecked = item.querySelector('.ITEM_NO').checked;
            
            if (itemNoChecked) { // 若 ITEM_NO 已勾選
                itemNoCheckedCount++; // 計算連續勾選次數

                // 檢查 DESCRIPTION 是否有值
                let descriptionElement = item.querySelector('.DESCRIPTION');
                if (!descriptionElement || !descriptionElement.value.trim()) {
                    alert('已勾選大品名註記，品名必須有值');
                    return; // 中止匯出過程
                }
                
                // 檢查除了 DESCRIPTION 外，其他欄位是否有值
                let invalidFields = [];
                itemRequiredFields.forEach(field => {
                    if (field.className !== 'DESCRIPTION') {
                        let element = item.querySelector(`.${field.className}`);
                        if (element && element.value.trim()) {
                            invalidFields.push(field.name);
                        }
                    }
                });

                if (invalidFields.length > 0) {
                    alert(`已勾選大品名註記，以下欄位不應有值：\n${invalidFields.join('、')}`);
                    return; // 中止匯出過程
                }

            } else { // 若 ITEM_NO 未勾選，進行其他檢查

                // 若未勾選大品名註記，將計數重置
                itemNoCheckedCount = 0;

                let itemMissingFields = [];

                itemRequiredFields.forEach(field => {
                    let element = item.querySelector(`.${field.className}`);
                    if (element && !element.value.trim()) {
                        itemMissingFields.push(field.name);
                    }
                });

                // 成對欄位檢查
                let expNoAlreadyChecked = false;
                const pairedFields = [
                    { fields: ['ORG_IMP_DCL_NO', 'ORG_IMP_DCL_NO_ITEM'], names: ['原進口報單號碼', '原進口報單項次'] },
                    { fields: ['CERT_NO', 'CERT_NO_ITEM'], names: ['產證號碼', '產證項次'] },
                    { fields: ['ORG_DCL_NO', 'ORG_DCL_NO_ITEM'], names: ['原進倉報單號碼', '原進倉報單項次'] },
                    { fields: ['WIDE', 'WIDE_UM'], names: ['寬度(幅寬)', '寬度單位'] },
                    { fields: ['LENGT_', 'LENGTH_UM'], names: ['長度(幅長)', '長度單位'] },
                    { fields: ['ST_QTY', 'ST_UM'], names: ['統計數量', '統計單位'] },
                    { fields: ['EXP_NO', 'EXP_SEQ_NO'], names: ['輸出許可號碼', '輸出許可項次'] }
                ];

                // 檢查成對欄位是否同時有值
                pairedFields.forEach(pair => {
                    let firstElement = item.querySelector(`.${pair.fields[0]}`);
                    let secondElement = item.querySelector(`.${pair.fields[1]}`);
                
                    // 檢查成對欄位是否同時有值或同時為空
                    if ((firstElement && firstElement.value.trim() && !secondElement.value.trim()) || 
                        (secondElement && secondElement.value.trim() && !firstElement.value.trim())) {
                        itemMissingFields.push(`${pair.names[0]} 和 ${pair.names[1]} 必須同時有值`);
                        
                        // 如果是 'EXP_NO' 和 'EXP_SEQ_NO'，設置旗標變數
                        if (pair.fields.includes('EXP_NO') && pair.fields.includes('EXP_SEQ_NO')) {
                            expNoAlreadyChecked = true;
                        }
                    }
                });

                // 檢查當 'CERT_NO' 和 'CERT_NO_ITEM' 有值時，'GOODS_MODEL' 和 'GOODS_SPEC' 也需要有值
                let certNo = item.querySelector('.CERT_NO');
                let certNoItem = item.querySelector('.CERT_NO_ITEM');
                if (certNo && certNo.value.trim() && certNoItem && certNoItem.value.trim()) {
                    let goodsModel = item.querySelector('.GOODS_MODEL');
                    let goodsSpec = item.querySelector('.GOODS_SPEC');
                    if (!goodsModel || !goodsModel.value.trim() || !goodsSpec || !goodsSpec.value.trim()) {
                        itemMissingFields.push(`產證號碼 和 產證項次 有值時，型號 及 規格 也必須有值`);
                    }
                }

                // 如果 ST_MTD 包含 1A, 8A 或 8D，EXP_NO 和 EXP_SEQ_NO 不可為空
                if (!expNoAlreadyChecked) { // 只有在成對欄位檢查中未提示過的情況下才進行此檢查
                    const stMtdValue = item.querySelector('.ST_MTD')?.value.trim();
                    if (['1A', '8A', '8D'].includes(stMtdValue) && 
                        (!item.querySelector('.EXP_NO')?.value.trim() || !item.querySelector('.EXP_SEQ_NO')?.value.trim())) {
                        itemMissingFields.push('統計方式包含 1A、8A、8D，輸出許可號碼 和 輸出許可項次 不可為空');
                    }
                }

                // 檢查淨重是否為零
                let netWtElement = item.querySelector('.NET_WT');
                if (netWtElement && parseFloat(netWtElement.value.trim()) === 0) {
                    itemMissingFields.push('淨重不得為零');
                }

                if (itemMissingFields.length > 0) {
                    alert(`以下欄位不可為空或為零：\n${itemMissingFields.join('、')}`);
                    return; // 中止匯出過程
                }
            }

            // 檢查是否有連續兩個以上的「大品名註記」勾選
            if (itemNoCheckedCount > 1) {
                alert('大品名註記不可連續勾選兩個以上');
                return; // 中止匯出過程
            }
        }
        
        // 欄位碼數檢查設定
        const fieldLengthChecks = [
            { id: 'FILE_NO', name: '文件編號', validLengths: [10, 11] },
            { id: 'SHPR_BONDED_ID', name: '海關監管編號', validLengths: [5] },
            { id: 'CNEE_COUNTRY_CODE', name: '買方國家代碼', validLengths: [2] },
            { id: 'TO_CODE', name: '目的地(代碼)', validLengths: [5] },
            { id: 'DOC_CTN_UM', name: '總件數單位', validLengths: [3] },
            { id: 'DCL_DOC_TYPE', name: '報單類別', validLengths: [2] },
            { id: 'TERMS_SALES', name: '貿易條件', validLengths: [3] },
            { id: 'CURRENCY', name: '幣別', validLengths: [3] },
        ];

        // 執行碼數檢查
        let invalidLengthFields = [];

        fieldLengthChecks.forEach(field => {
            let element = document.getElementById(field.id);
            if (element && element.value.trim()) { // 如果欄位有值則進行檢查
                let length = element.value.trim().length;
                if (!field.validLengths.includes(length)) {
                    invalidLengthFields.push(`${field.name} (應為 ${field.validLengths.join(' 或 ')} 碼)`);
                }
            }
        });

        if (invalidLengthFields.length > 0) {
            alert(`以下欄位的碼數不正確：\n${invalidLengthFields.join('、')}`);
            return; // 中止匯出過程
        }

        // 欄位碼數檢查設定 (每個項次都需檢查的欄位)
        const itemFieldLengthChecks = [
            { className: 'DOC_UM', name: '單位', validLengths: [3] },
            { className: 'CCC_CODE', name: '稅則', validLengths: [11] },
            { className: 'ST_MTD', name: '統計方式', validLengths: [2] },
            { className: 'ORG_COUNTRY', name: '生產國別', validLengths: [2] },
            { className: 'ORG_IMP_DCL_NO', name: '原進口報單號碼', validLengths: [14] },
            { className: 'BOND_NOTE', name: '保稅貨物註記', validLengths: [2] },
            { className: 'CERT_NO', name: '產證號碼', validLengths: [11] },
            { className: 'ORG_DCL_NO', name: '原進倉報單號碼', validLengths: [14] },
            { className: 'EXP_NO', name: '輸出許可號碼', validLengths: [14] },
            { className: 'WIDE_UM', name: '寬度單位', validLengths: [3] },
            { className: 'LENGTH_UM', name: '長度單位', validLengths: [3] },
            { className: 'ST_UM', name: '統計單位', validLengths: [3] }
        ];

        // 檢查每個項次的欄位碼數
        for (let item of document.querySelectorAll("#item-container .item-row")) {
            let invalidItemFields = [];

            for (let field of itemFieldLengthChecks) {
                let element = item.querySelector(`.${field.className}`);
                if (element && element.value.trim()) { // 如果欄位有值則進行檢查
                    let value = element.value.trim();

                    // 特別處理 CCC_CODE，移除符號 '.' 和 '-'
                    if (field.className === 'CCC_CODE') {
                        // 檢查是否包含符號 '.' 或 '-'
                        if (!value.includes('.') && !value.includes('-')) {
                            alert(`稅則錯誤！`);
                            return; // 中止匯出過程
                        }
                        // 移除符號進行長度檢查
                        value = value.replace(/[.\-]/g, '');
                    }
        
                    let length = value.length;
                    if (!field.validLengths.includes(length)) {
                        invalidItemFields.push(`${field.name} (應為 ${field.validLengths.join(' 或 ')} 碼)`);
                    }
                }
            }

            if (invalidItemFields.length > 0) {
                alert(`以下欄位的碼數不正確：\n${invalidItemFields.join('、')}`);
                return; // 中止匯出過程
            }
        }

        // 用於驗證是否為整數
        function isInteger(value) {
            return /^\d+$/.test(value);
        }

        // 檢查 ORG_IMP_DCL_NO_ITEM、CERT_NO_ITEM、ORG_DCL_NO_ITEM、EXP_SEQ_NO 是否為整數
        for (let item of document.querySelectorAll("#item-container .item-row")) {
            let invalidItemFields = [];

            // 檢查這四個欄位並顯示對應的中文名稱
            [
                { className: 'ORG_IMP_DCL_NO_ITEM', name: '原進口報單項次' },
                { className: 'CERT_NO_ITEM', name: '產證項次' },
                { className: 'ORG_DCL_NO_ITEM', name: '原進倉報單項次' },
                { className: 'EXP_SEQ_NO', name: '輸出許可項次' }
            ].forEach(field => {
                let element = item.querySelector(`.${field.className}`);
                if (element && element.value.trim() && !isInteger(element.value.trim())) {
                    invalidItemFields.push(`${field.name} (僅限輸入整數)`);
                }
            });

            if (invalidItemFields.length > 0) {
                alert(`以下欄位的格式錯誤：\n${invalidItemFields.join('、')}`);
                return; // 中止匯出過程
            }
        }

        // 若單位為 PCE、PCS 或 EAC，檢查數量是否為整數
        for (let item of document.querySelectorAll("#item-container .item-row")) {
            let invalidItemFields = [];

            // 獲取數量和單位欄位
            let qtyElement = item.querySelector('.QTY');
            let docUmElement = item.querySelector('.DOC_UM');

            if (qtyElement && docUmElement) {
                let rawQtyValue = qtyElement.value.trim(); // 原始數量值
                let parsedQtyValue = parseFloat(rawQtyValue); // 將數量值轉換為浮點數
                let docUmValue = docUmElement.value.trim().toUpperCase();

                // 若單位為 PCE、PCS 或 EAC，檢查數量是否為整數
                if (['PCE', 'PCS', 'EAC'].includes(docUmValue)) {
                    // 檢查數值是否為整數
                    if (!Number.isInteger(parsedQtyValue)) {
                        invalidItemFields.push(`數量 " ${rawQtyValue} " (單位為 ${docUmValue} 時，數量必須為整數)`);
                    }
                }
            }

            if (invalidItemFields.length > 0) {
                alert(`以下欄位的格式錯誤：\n${invalidItemFields.join('、')}`);
                return; // 中止匯出過程
            }
        }
        
        // 若 validateDclDocType 發現錯誤，則直接返回，中止後續程式碼
        if (!validateDclDocType()) {
            return;
        }

        // 買方及收方名稱及地址欄位不可全數字
        const nonNumericFields = [
            { id: 'CNEE_C_NAME', name: '買方中文名稱' },
            { id: 'CNEE_E_NAME', name: '買方中/英名稱' },
            { id: 'CNEE_E_ADDR', name: '買方中/英地址' },
            { id: 'BUYER_E_NAME', name: '收方名稱' },
            { id: 'BUYER_E_ADDR', name: '收方地址' }
        ];

        let allDigitsErrors = [];
        nonNumericFields.forEach(field => {
            let element = document.getElementById(field.id);
            if (element) {
                let value = element.value.trim();
                // 如果欄位有值且全部都是數字，則加入錯誤訊息
                if (value && /^\d+$/.test(value)) {
                    allDigitsErrors.push(field.name);
                }
            }
        });

        if (allDigitsErrors.length > 0) {
            alert(`以下欄位不可全數字：\n${allDigitsErrors.join('、')}`);
            return; // 中止匯出過程
        }

        // 取得核算狀態
        if (document.getElementById('calculation-status')?.value.trim() !== "已執行") {
            alert("請先執行核算後再匯出 XML！");
            return;
        }

        const headerFields = [
            'LOT_NO', 'SHPR_BAN_ID', 'DCL_DOC_EXAM', 'SHPR_BONDED_ID', 
            'SHPR_C_NAME', 'SHPR_E_NAME', 'SHPR_C_ADDR', 'SHPR_E_ADDR', 'SHPR_TEL', 
            'CNEE_C_NAME', 'CNEE_E_NAME', 'CNEE_E_ADDR', 
            'CNEE_COUNTRY_CODE', 'CNEE_BAN_ID',
            'BUYER_BAN', 'BUYER_E_NAME', 'BUYER_E_ADDR', 'TO_CODE', 'TO_DESC', 
            'TOT_CTN', 'DOC_CTN_UM', 'CTN_DESC', 'DCL_GW', 'DCL_NW', 
            'DCL_DOC_TYPE', 'TERMS_SALES', 'CURRENCY', 'CAL_IP_TOT_ITEM_AMT', 
            'FRT_AMT', 'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT', 
            'DOC_MARKS_DESC', 'DOC_OTR_DESC', 'REMARK1', 
            'FAC_BAN_ID_EX', 'FAC_BONDED_ID_EX',
            'FAC_BAN_ID', 'FAC_BONDED_ID', 'IN_BONDED_BAN', 'IN_BONDED_CODE',
            'APP_DUTY_REFUND', 'MARK_TOT_LINES', 'EXAM_TYPE', 'COPY_QTY',
        ];

        const itemFields = [
            'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P',
            'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'ISCALC_WT', 'NET_WT', 'ORG_COUNTRY', 
            'ORG_IMP_DCL_NO', 'ORG_IMP_DCL_NO_ITEM', 'SELLER_ITEM_CODE', 'BOND_NOTE',
            'GOODS_MODEL', 'GOODS_SPEC', 'CERT_NO', 'CERT_NO_ITEM', 
            'ORG_DCL_NO', 'ORG_DCL_NO_ITEM', 'EXP_NO', 'EXP_SEQ_NO', 
            'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_QTY' ,'ST_UM',
        ];
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<Root>\n  <sys_code>GICCDS</sys_code>\n<head>\n  <head_table_name>DOC_HEAD</head_table_name>\n';

        // 取得製單人員輸入值，若為空則預設為 ''
        let maker = document.getElementById('Maker') ? document.getElementById('Maker').value : '';

        // 添加 PROC_NO 欄位
        xmlContent += `  <fields>\n    <field_name>PROC_NO</field_name>\n    <field_value>${maker}</field_value>\n  </fields>\n`;

        // 取得 SHPR_BAN_ID 欄位的值
        const shprBanIdElement = document.getElementById('SHPR_BAN_ID');
        const shprBanId = shprBanIdElement ? shprBanIdElement.value.trim() : '';

        // 添加 SHPR_AEO 欄位
        const shprAeo = await getAeoNumber(shprBanId);  // 呼叫共用函數
        xmlContent += `  <fields>\n    <field_name>SHPR_AEO</field_name>\n    <field_value>${shprAeo}</field_value>\n  </fields>\n`;

        headerFields.forEach(id => {
            let element = document.getElementById(id);
            if (element) {
                let value = escapeXml(element.value);

                // 過濾非可見字符、控制代碼及無效字符
                value = value.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF\uFFF9-\uFFFB\uFFFE\uFFFF]/g, '').trim();

                // 對 CURRENCY 欄位進行特殊處理
                if (id === 'CURRENCY') {
                    value = value.toUpperCase(); // 將值轉為大寫
                    if (value === 'NTD') {
                        value = 'TWD'; // 如果是 NTD，則改為 TWD
                    }
                }

                // 對 LOT_NO 欄位進行處理
                if (id === 'LOT_NO') {
                    // 全形轉半形
                    value = value.replace(/[\uff01-\uff5e]/g, function(ch) { 
                        return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); 
                    }); 

                    // 只允許 S, F 和數字
                    value = value.replace(/[^SF0-9]/gi, '');
                }

                // 特殊處理 CNEE_C_NAME 和 CNEE_E_NAME
                if (id === 'CNEE_C_NAME') {
                    let cneeENameElement = document.getElementById('CNEE_E_NAME');
                    let cneeENameValue = cneeENameElement ? escapeXml(cneeENameElement.value).trim() : '';

                    if (cneeENameValue) {
                        // 如果 CNEE_E_NAME 有值，則分別創建兩個節點
                        xmlContent += `  <fields>\n    <field_name>${id}</field_name>\n    <field_value>${value}</field_value>\n  </fields>\n`;
                    } else {
                        // 如果 CNEE_E_NAME 無值，用 CNEE_C_NAME 的值創建 CNEE_E_NAME
                        xmlContent += `  <fields>\n    <field_name>CNEE_E_NAME</field_name>\n    <field_value>${value}</field_value>\n  </fields>\n`;
                    }
                    return; // 不再生成 CNEE_C_NAME 的節點
                }

                if (id === 'CNEE_E_NAME') {
                    let cneeCNameElement = document.getElementById('CNEE_C_NAME');
                    let cneeCNameValue = cneeCNameElement ? escapeXml(cneeCNameElement.value).trim() : '';

                    if (!value && cneeCNameValue) {
                        // 如果 CNEE_E_NAME 無值且 CNEE_C_NAME 有值，已由 CNEE_C_NAME 處理，不再創建
                        return;
                    }
                }

                // 處理 REMARK1，將 REMARK 加入最前面，然後加入 XML
                if (id === 'REMARK1') {
                    let remark1Element = document.getElementById('REMARK1');
                    let remarkElement = document.getElementById('REMARK');

                    // 如果 REMARK1 不存在，則動態創建
                    if (!remark1Element) {
                        console.warn("REMARK1 不存在，正在創建...");
                        remark1Element = document.createElement("textarea");
                        remark1Element.id = "REMARK1";
                        remark1Element.style.display = "none"; // 不影響畫面
                        document.body.appendChild(remark1Element);
                    }

                    if (remark1Element) {
                        let remark1Value = remark1Element.value.trim();
                        let remarkValue = remarkElement ? remarkElement.value.trim() : '';

                        // 先移除 `REMARK1` 內的 `【客服備註】xxx`
                        remark1Value = remark1Value.replace(/【客服備註】[^\n]+(\n\n)?/, '').trim();

                        // 如果 `REMARK` 有值，則加到 `REMARK1` 最前面
                        if (remarkValue) {
                            remark1Element.value = `【客服備註】${remarkValue}\n\n${remark1Value}`.trim();
                        } else {
                            // 如果 `REMARK` 為空，則 `REMARK1` 只保留原本內容
                            remark1Element.value = remark1Value;
                        }
                    }

                    // 將 `REMARK1` 加入 XML
                    let finalRemark1Value = escapeXml(remark1Element.value.trim());
                    xmlContent += `  <fields>\n    <field_name>${id}</field_name>\n    <field_value>${finalRemark1Value}</field_value>\n  </fields>\n`;

                    return; // 避免 `headerFields.forEach` 繼續處理 `REMARK1`
                }
                
                // 將當前欄位加入 XML
                xmlContent += `  <fields>\n    <field_name>${id}</field_name>\n    <field_value>${value}</field_value>\n  </fields>\n`;
            }
        });

        xmlContent += '  </head>\n<detail>\n  <detail_table_name>DOCINVBD</detail_table_name>\n';

        let itemCounter = 1; // 初始化計數參數
        document.querySelectorAll("#item-container .item-row").forEach((item) => {
            xmlContent += '  <items>\n';
            let itemNo = item.querySelector('.ITEM_NO').checked ? '*' : (itemCounter++).toString();
        
            xmlContent += `    <fields>\n      <field_name>ITEM_NO</field_name>\n      <field_value>${itemNo}</field_value>\n    </fields>\n`;
        
            itemFields.forEach(className => {
                let value;
                if (className === 'ISCALC_WT') {
                    value = item.querySelector(`.${className}`).checked ? 'Y' : '';
                } else {
                    value = escapeXml(item.querySelector(`.${className}`).value);
                    
                    // 替換單位及稅則
                    value = replaceValue(className, value);

                    // 對 DESCRIPTION 欄位進行處理
                    if (className === 'DESCRIPTION') {
                        value = value.trim(); // 去除前後空格
                        value = value.replace(/ {10,}/g, '\n'); // 十個以上空格替換為換行
                        value = value.replace(/\n\s*\n/g, '\n'); // 移除多個連續的空行
                    }
                }
                xmlContent += `    <fields>\n      <field_name>${className}</field_name>\n      <field_value>${value}</field_value>\n    </fields>\n`;
            });

            // 設定 PER_ST 的值
            let perStValue = (item.querySelector('.ITEM_NO').checked) ? '' : '1';
            xmlContent += `    <fields>\n      <field_name>PER_ST</field_name>\n      <field_value>${perStValue}</field_value>\n    </fields>\n`;
            
            xmlContent += '  </items>\n';
        });
        xmlContent += '</detail>\n</Root>';

        const fileName = document.getElementById('FILE_NO').value.trim();
        const exporterName = document.getElementById('SHPR_C_NAME').value.trim();
        const remarkElement = document.getElementById('REMARK').value.trim() || '';

        let fullFileName = '';

        if (remarkElement) {
            fullFileName = `${fileName}-${exporterName}【${remarkElement}】.xml`;
        } else {
            fullFileName = `${fileName}-${exporterName}.xml`;
        }

        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fullFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 為輸出XML按鈕添加事件監聽器
    document.getElementById('export-to-xml').addEventListener('click', exportToXML);
});

// 讀取替換檔
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

// 轉義 XML 保留字符的函數
function escapeXml(unsafe) {
    if (typeof unsafe !== 'string') {
        unsafe = String(unsafe);
    }
    return unsafe.replace(/[<>&'"]/g, function (match) {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case "'": return '&apos;';
        }
    });
}

// 取消轉義 XML 保留字符的函數
function unescapeXml(escaped) {
    return escaped.replace(/&lt;|&gt;|&amp;|&quot;|&apos;/g, function (match) {
        switch (match) {
            case '&lt;': return '<';
            case '&gt;': return '>';
            case '&amp;': return '&';
            case '&quot;': return '"';
            case '&apos;': return "'";
        }
    });
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

// 匯整產地及備註
function summarizeOrgCountry() {

    // 若 validateDclDocType 發現錯誤，則直接返回，中止後續程式碼
    if (!validateDclDocType()) {
        return;
    }

    // 標記及貨櫃號碼
    const orgCountryMap = {}; // 用於儲存 ORG_COUNTRY 與對應項次
    let countryMapping = {}; // 從 CSV 加載的國家代碼

    // 讀取 countryMapping.csv 文件並解析
    const loadCountryMapping = async () => {
        try {
            const response = await fetch('./countryMapping.csv');
            const csvText = await response.text();

            // 解析 CSV 文件
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(','); // 解析標題列
            const dataLines = lines.slice(1);

            dataLines.forEach((line) => {
                const values = line.split(',');
                const code = values[0].trim();
                const value = values[1].trim();
                const valueChinese = values[2].trim();
                const region = values[3].trim();

                countryMapping[code] = { value, valueChinese, region };
            });
        } catch (error) {
            console.error('Error loading countryMapping.csv:', error);
        }
    };
    
    // 初始化函數
    const init = async () => {
        await loadCountryMapping(); // 加載 CSV 文件

        document.querySelectorAll('.ORG_COUNTRY').forEach((input, index) => {
            if (!input || typeof input.value !== 'string') {
                console.warn(`無法獲取第 ${index} 項的 ORG_COUNTRY 值，跳過。`);
                return; // 跳過無效元素
            }
            
            const value = input.value.trim(); // 獲取 ORG_COUNTRY 的值
        
            // 找到當前項次的行
            const itemRow = input.closest('.item-row');
            if (!itemRow) {
                console.warn(`無法找到第 ${index} 項的 .item-row，跳過。`);
                return;
            }
        
            // 獲取 itemNumber，根據行內的 .item-number 標籤
            const itemNumberLabel = itemRow.querySelector('.item-number label');
            const itemNumber = itemNumberLabel ? parseInt(itemNumberLabel.textContent.trim(), 10) : NaN;
        
            if (isNaN(itemNumber)) {
                console.warn(`第 ${index} 項的 itemNumber 為 NaN，跳過。`);
                return; // 跳過無效的項次
            }
        
            if (!orgCountryMap[value]) {
                orgCountryMap[value] = []; // 初始化為空陣列
            }
            orgCountryMap[value].push(itemNumber); // 將當前項次加入對應的值
        });

        // 將項次轉換為範圍格式
        const formatRangesORG_COUNTRY = (numbers) => {
            const ranges = [];
            let start = numbers[0];
            let prev = numbers[0];

            for (let i = 1; i < numbers.length; i++) {
                const current = numbers[i];
                if (current !== prev + 1) {
                    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
                    start = current;
                }
                prev = current;
            }
            ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
            return ranges.join(', ');
        };

        // 匯整結果，按項次排序
        const resultORG_COUNTRY = Object.entries(orgCountryMap)
            .filter(([key]) => key) // 過濾空值
            .map(([key, items]) => {
                const countryData = countryMapping[key] || { value: key }; // 找不到則顯示預設值
                const countryName = `${countryData.value}`;
                const sortedItems = items.sort((a, b) => a - b); // 排序項次
                const ranges = formatRangesORG_COUNTRY(sortedItems); // 將項次轉為範圍
                return { ranges, countryName }; // 返回範圍與國名
            })
            .sort((a, b) => {
                // 依照範圍的第一個數字排序
                const firstA = parseInt(a.ranges.split(',')[0], 10);
                const firstB = parseInt(b.ranges.split(',')[0], 10);
                return firstA - firstB;
            })
            .map(({ ranges, countryName }) => {
                return `ITEM ${ranges}: MADE IN ${countryName.toUpperCase()}`; // 組合描述
            })
            .join('\n');

        // 顯示結果在 DOC_MARKS_DESC
        const docMarksDesc = document.getElementById('DOC_MARKS_DESC');
        if (docMarksDesc) {
            docMarksDesc.value = docMarksDesc.value.trim() + '\n' + resultORG_COUNTRY; // 顯示匯整結果
        } else {
            console.error("找不到 DOC_MARKS_DESC 元素，無法顯示結果。");
        }
    };

    // 啟動初始化
    init();

    // 其它申報事項
    const stMtdMap = {}; // 用於儲存 ST_MTD 與對應的項次與條件

    // ST_MTD 對應表
    const stMtdMapping = {
        '02': { value: "國貨銷售" },
        '04': { value: "國貨樣品/贈送不再進口" },
        '05': { value: "委外加工不再進口" },
        '06': { value: "國外提供原料委託加工出口(僅收取加工費)" },
        '53': { value: "此為貨樣出口，後續將依規定限期內復運進口" },
        '91': { value: "本批貨物為國貨修理後復出口" },
        '95': { value: "委外加工再復運進口" },
        '9M': { value: "洋貨復出口，復出口原因：退回修理，修理完畢後會再復運進口" },
        '81': { value: "洋貨轉售" },
        '82': { value: "洋貨復出口不再進口" },
    };

    // 條件判斷函數
    const addAdditionalInfo = (itemRow, stMtdValue) => {
        if (!itemRow) {
            console.warn("itemRow 無效，跳過條件判斷。");
            return stMtdValue;
        }

        const descriptionField = itemRow.querySelector('.DESCRIPTION');
        const descriptionValue = descriptionField ? descriptionField.value.trim() : '';
        const orgImpDclNo = itemRow.querySelector('.ORG_IMP_DCL_NO')?.value.trim() || '';
        const orgDclNo = itemRow.querySelector('.ORG_DCL_NO')?.value.trim() || '';

        if ((orgImpDclNo || orgDclNo) && descriptionValue.includes('發票號碼')) {
            return `${stMtdValue}，附原進口報單及國內購買憑證以茲證明`;
        } else if (orgImpDclNo || orgDclNo) {
            return `${stMtdValue}，附原進口報單`;
        } else if (descriptionValue.includes('發票號碼')) {
            return `${stMtdValue}，因無法提供原進口報單號碼，特附國內購買憑證以茲證明`;
        } else {
            return `${stMtdValue}，因無法取得原進口報單及購買憑證，願繳納推廣貿易服務費`;
        }
    };

    // 格式化項次範圍
    const formatRanges = (numbers) => {
        const ranges = [];
        let start = numbers[0];
        let prev = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
            const current = numbers[i];
            if (current !== prev + 1) {
                ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
                start = current;
            }
            prev = current;
        }
        ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
        return ranges;
    };

    // 合併具有相同備註的範圍
    const mergeSameRemarks = (data) => {
        const merged = {};

        data.forEach(({ ranges, remark }) => {
            if (!merged[remark]) {
                merged[remark] = [];
            }
            merged[remark] = merged[remark].concat(ranges);
        });

        return Object.entries(merged).map(([remark, rangeList]) => {
            const sortedRanges = [...new Set(rangeList)].sort((a, b) => a - b);
            return `ITEM ${formatRanges(sortedRanges).join(', ')}: ${remark}`;
        });
    };

    // 處理每一行
    document.querySelectorAll('.item-row').forEach((itemRow, index) => {
        // 查找 .ST_MTD 元素
        const stMtdInput = itemRow.querySelector('.ST_MTD');
        const itemNumberLabel = itemRow.querySelector('.item-number label');

        // 檢查元素是否存在
        if (!stMtdInput) {
            console.warn(`第 ${index} 行找不到 .ST_MTD 元素，跳過處理。`);
            return;
        }
        if (!itemNumberLabel) {
            console.warn(`第 ${index} 行找不到 .item-number label 元素，跳過處理。`);
            return;
        }

        // 確保 .value 存在
        const stMtdValue = stMtdInput.value?.trim();
        if (!stMtdValue) {
            console.warn(`第 ${index} 行的 ST_MTD 值為空，跳過處理。`);
            return;
        }

        const itemNumber = parseInt(itemNumberLabel.textContent.trim(), 10);
        if (isNaN(itemNumber)) {
            console.warn(`第 ${index} 行的項次無效，跳過處理。`);
            return;
        }

        // 處理邏輯...
        let stMtdName = stMtdMapping[stMtdValue]?.value || stMtdValue;
        if (['9M', '81', '82'].includes(stMtdValue)) {
            stMtdName = addAdditionalInfo(itemRow, stMtdName);
        }

        const groupKey = `${stMtdValue}|${stMtdName}`;
        if (!stMtdMap[groupKey]) {
            stMtdMap[groupKey] = [];
        }
        stMtdMap[groupKey].push(itemNumber);
    });

    // 匯整結果
    const resultData = Object.entries(stMtdMap)
        .flatMap(([key, items]) => {
            const [stMtdValue, stMtdName] = key.split('|');
            const sortedItems = items.sort((a, b) => a - b);
            const ranges = formatRanges(sortedItems);
            return ranges.map(range => ({ ranges: [range], remark: stMtdName }));
        });

    const finalResult = mergeSameRemarks(resultData).join('\n');

    // 更新到 DOC_OTR_DESC
    const docOtrDesc = document.getElementById('DOC_OTR_DESC');
    if (docOtrDesc) {
        docOtrDesc.value = docOtrDesc.value.trim() + '\n' + finalResult;
    } else {
        console.error("找不到 DOC_OTR_DESC 元素，無法顯示結果。");
    }

}

// 添加錯誤樣式
function setError(element, message) {
    element.classList.add('error');
    element.title = message; // 顯示提示訊息
}

// 清除錯誤樣式
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('title');
    });
}

// 檢查統計方式、生產國別、原進口報單、報單類別
function validateDclDocType() {
    clearErrors(); // 清除之前的錯誤標記
    const dclDocType = document.getElementById('DCL_DOC_TYPE').value.trim().toUpperCase();
    const stMtdCondition1 = ["02", "04", "06", "2L", "2R", "7M", "1A", "94", "95"];
    const stMtdCondition2 = ["81", "82", "8B", "8C", "9N", "8A", "8D", "92", "99", "9M"];
    let validationErrors = new Set(); // 使用 Set 儲存錯誤訊息，避免重複

    // 檢查 G5 或 G3 的條件
    if (["G5", "G3"].includes(dclDocType)) {
        let containsMandatoryOrgCountryTW = false; // 標記是否包含 ST_MTD 為 國貨出口統計方式 的項次
        let containsMandatoryOrgCountry = false; // 標記是否包含 ST_MTD 為 外貨復出口統計方式 的項次
        let hasEmptyOrgCountry = false; // 標記是否存在空的 ORG_COUNTRY
        let allCondition1 = true; // 是否所有統計方式都屬於條件 1
        let allCondition2 = true; // 是否所有統計方式都屬於條件 2
        let totalCondition1 = 0; // 條件 1 的加總金額
        let totalCondition2 = 0; // 條件 2 的加總金額
    
        const rows = document.querySelectorAll("#item-container .item-row");
        rows.forEach(item => {
            const stMtdValue = item.querySelector(".ST_MTD")?.value.trim();
            const orgCountryValue = item.querySelector(".ORG_COUNTRY")?.value.trim();
            const orgImpDclNo = item.querySelector(".ORG_IMP_DCL_NO")?.value.trim();
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
            const docTotPValue = parseFloat(item.querySelector(".DOC_TOT_P")?.value.trim() || "0");
    
            // 判斷是否全部屬於條件 1 或條件 2
            if (!stMtdCondition1.includes(stMtdValue) && !isItemChecked) {
                allCondition1 = false;
            }
            if (!stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                allCondition2 = false;
            }
    
            // 檢查條件 1：ST_MTD 為指定值且 ORG_COUNTRY 不為空或不為 TW，且 ORG_IMP_DCL_NO 不應有值
            if (stMtdCondition1.includes(stMtdValue) && !isItemChecked) {
                totalCondition1 += docTotPValue; // 加總條件 1 的金額
                containsMandatoryOrgCountryTW = true;
                if (orgCountryValue && orgCountryValue.toUpperCase() !== "TW") {
                    validationErrors.add(
                        `國貨出口統計方式，生產國別應為空或 TW`
                    );
                    setError(item.querySelector(".ST_MTD"), "國貨出口統計方式");
                    setError(item.querySelector(".ORG_COUNTRY"), "生產國別應為空或 TW");
                }
                if (orgImpDclNo) {
                    validationErrors.add(
                        `國貨出口統計方式，原進口報單號碼及項次不應有值`
                    );
                    setError(item.querySelector(".ST_MTD"), "國貨出口統計方式");
                    setError(item.querySelector(".ORG_IMP_DCL_NO"), "原進口報單號碼及項次不應有值");
                    setError(item.querySelector(".ORG_IMP_DCL_NO_ITEM"), "原進口報單號碼及項次不應有值");
                }
            }
    
            // 檢查條件 2：ST_MTD 為 外貨復出口統計方式 時
            if (stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                totalCondition2 += docTotPValue; // 加總條件 2 的金額
                containsMandatoryOrgCountry = true;
                if (!orgCountryValue || orgCountryValue.trim() === "") {
                    setError(item.querySelector(".ST_MTD"), "外貨復出口統計方式");
                    setError(item.querySelector(".ORG_COUNTRY"), "生產國別不可為空");
                } else if (orgCountryValue.toUpperCase() === "TW") {
                    if (!orgImpDclNo || orgImpDclNo.trim() === "") {
                        validationErrors.add(
                            `外貨復出口統計方式且生產國別為 TW，\n` +
                            `原進口報單號碼及項次不可為空`
                        );
                        setError(item.querySelector(".ST_MTD"), "外貨復出口統計方式");
                        setError(item.querySelector(".ORG_COUNTRY"), "且生產國別為 TW");
                        setError(item.querySelector(".ORG_IMP_DCL_NO"), "原進口報單號碼及項次不可為空");
                        setError(item.querySelector(".ORG_IMP_DCL_NO_ITEM"), "原進口報單號碼及項次不可為空");
                    }
                }
            }
            // 標記是否存在空的 ORG_COUNTRY
            if ((!orgCountryValue || orgCountryValue.trim() === "") && !isItemChecked) {
                hasEmptyOrgCountry = true;
            }
        });
    
        // 檢查條件 3：若有 ST_MTD 為 外貨復出口統計方式，則所有項次的 ORG_COUNTRY 不可為空
        if (containsMandatoryOrgCountry && containsMandatoryOrgCountryTW && hasEmptyOrgCountry) {
            rows.forEach(item => {
                const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
                if (!isItemChecked) {
                    const orgCountryValue = item.querySelector(".ORG_COUNTRY")?.value.trim();
                    if (!orgCountryValue || orgCountryValue.trim() === "") {
                        setError(item.querySelector(".ORG_COUNTRY"), "生產國別不可為空");
                    }
                }
            });
            validationErrors.add("國洋貨合併申報，生產國別不可為空（國貨請填 TW ）");
        } else if (containsMandatoryOrgCountry && hasEmptyOrgCountry) {
            validationErrors.add(`外貨復出口統計方式，生產國別不可為空`);
        }
    
        // 檢查條件 4：報單類別與統計方式是否相符
        if (allCondition1 && dclDocType !== "G5") {
            validationErrors.add("統計方式屬於國貨出口，報單類別應為 G5");
        }
        if (allCondition2 && dclDocType !== "G3") {
            validationErrors.add("統計方式屬於外貨復出口，報單類別應為 G3");
        }
    
        // 檢查條件 5：根據 totalCondition1 和 totalCondition2 判斷 dclDocType
        if (totalCondition1 > 0 && totalCondition2 > 0) {
            if (totalCondition1 > totalCondition2 && dclDocType !== "G5") {
                validationErrors.add("國貨的加總金額大於外貨，報單類別應為 G5");
            } else if (totalCondition1 < totalCondition2 && dclDocType !== "G3") {
                validationErrors.add("外貨的加總金額大於國貨，報單類別應為 G3");
            }
        }

        // 顯示條件 1 和條件 2 的加總金額
        console.log(`條件 1 的加總金額: ${totalCondition1}`);
        console.log(`條件 2 的加總金額: ${totalCondition2}`);
    }
    
    // 檢查 B8 的條件
    if (dclDocType === "B8") {
        const rows = document.querySelectorAll("#item-container .item-row");
        let allCondition1 = false;
        let allCondition2 = false;

        rows.forEach(item => {
            const stMtdValue = item.querySelector(".ST_MTD")?.value.trim();
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
            const orgImpDclNo = item.querySelector(".ORG_IMP_DCL_NO")?.value.trim();

            if (stMtdCondition1.includes(stMtdValue) && !isItemChecked) {
                allCondition1 = true; // 有符合條件1的項目且未勾選
            }
            if (stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                allCondition2 = true; // 有符合條件2的項目且未勾選
            }
        });

        if (allCondition1 && allCondition2) {
            validationErrors.add("B8 及 G5 不得合併申報，必須拆分或以 B9 申報（B9 項次在前）");
        } else if (allCondition1 && !allCondition2) {
            validationErrors.add("所有項次為國貨統計方式，報單類別應為 B9");
        }
    }

    // 檢查 B9 的條件
    if (dclDocType === "B9") {
        const rows = document.querySelectorAll("#item-container .item-row");
        let firstValueChecked = false; // 標記是否已檢查第一個有值的項次

        rows.forEach(item => {
            const stMtdValue = item.querySelector(".ST_MTD")?.value.trim();
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;

            // 找到第一個有值的項次且未檢查過
            if (!firstValueChecked) {
                if (!isItemChecked) {
                    if (!stMtdCondition1.includes(stMtdValue)) {
                        if (stMtdValue !== "53" && stMtdValue !== "9E") {
                            validationErrors.add("B9 報單第一個項次，應為國貨統計方式");
                        }
                    }
                    firstValueChecked = true; // 標記已檢查第一個有值的項次
                }
            }

            // 檢查其他項次中是否有統計方式為 53，但保稅貨物註記不為 NB
            if (stMtdValue === "53") {
                const bondNoteValue = item.querySelector(".BOND_NOTE")?.value.trim();
                if (bondNoteValue !== "NB") {
                    validationErrors.add(`統計方式為 53，保稅貨物註記應為 NB`);
                }
            }

            // 檢查其他項次中是否有統計方式為 9E，但保稅貨物註記不為 YB 或 CN
            if (stMtdValue === "9E") {
                const bondNoteValue = item.querySelector(".BOND_NOTE")?.value.trim();
                if (bondNoteValue !== "YB" && bondNoteValue !== "CN") {
                    validationErrors.add(`統計方式為 9E，保稅貨物註記應為 YB 或 CN`);
                }
            }
        });
    }

    // 檢查 D5 或 F5 的條件
    if (["D5", "F5"].includes(dclDocType)) {
        const rows = document.querySelectorAll("#item-container .item-row");
        let missingOrgDclNo = false;

        // 欄位檢查
        const facBanId = document.querySelector("#FAC_BAN_ID")?.value.trim();
        const facBondedId = document.querySelector("#FAC_BONDED_ID")?.value.trim();
        const inBondedBan = document.querySelector("#IN_BONDED_BAN")?.value.trim();
        const inBondedCode = document.querySelector("#IN_BONDED_CODE")?.value.trim();
        
        // 檢查是否有空的欄位，分兩組檢查
        const missingGroup1Fields = !facBanId || !facBondedId;
        const missingGroup2Fields = !inBondedBan || !inBondedCode;

        rows.forEach(item => {
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
            const orgDclNo = item.querySelector(".ORG_DCL_NO")?.value.trim();

            if (!orgDclNo && !isItemChecked) {
                missingOrgDclNo = true; // 檢查是否有空的 ORG_DCL_NO
            }
        });

        if (missingOrgDclNo) {
            validationErrors.add("D5 及 F5 需核銷，原進倉報單號碼 及 原進倉報單項次 不可為空");
        }
        if (missingGroup1Fields) {
            validationErrors.add("出倉保稅倉庫統一編號 及 出倉保稅倉庫代碼 不可為空");
        }
        if (missingGroup2Fields) {
            validationErrors.add("進倉保稅倉庫統一編號 及 進倉保稅倉庫代碼 不可為空");
        }
    }

    // 若有任何錯誤，集中提示
    if (validationErrors.size > 0) {
        alert(Array.from(validationErrors).join("\n"));
        return false; // 返回 false，表示有錯誤
    }

    return true; // 返回 true，表示檢查通過
}

// 長期委任字號：
const excelFilePath = './出口長委登記表.xlsx';

function fetchAndParseExcel(callback) {
    fetch(excelFilePath)
        .then(response => {
            if (!response.ok) throw new Error('無法讀取出口長委登記表');
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            callback(rows);
        })
        .catch(error => {
            console.error('讀取出口長委登記表時發生錯誤:', error);
            alert('讀取出口長委登記表失敗');
        });
}

function parseCustomDate(dateString) {
    // 將日期格式 "118.01.30" 轉換為標準日期格式
    const [year, month, day] = dateString.split('.');
    if (!year || !month || !day) return null;

    // 將 "民國" 年份轉換為西元年份
    const fullYear = parseInt(year, 10) + 1911;
    return new Date(`${fullYear}-${month}-${day}`);
}

function handleCheck() {
    const SHPR_BAN_ID = document.getElementById('SHPR_BAN_ID').value.trim();
    const docOtrDesc = document.getElementById('DOC_OTR_DESC');

    // 僅移除以 "長期委任字號" 開頭的行，保留其他內容
    docOtrDesc.value = docOtrDesc.value.replace(/^長期委任字號：.*$/gm, '').trim();

    fetchAndParseExcel(rows => {
        const today = new Date();
        const validEntries = [];

        // 遍歷 rows，收集所有未逾期且符合條件的資料
        rows.forEach(row => {
            const id = row[1] ? row[1].toString() : null;
            const expiryDate = row[3] ? parseCustomDate(row[3]) : null;

            // 確保 ID 符合且到期日不早於今天
            if (id === SHPR_BAN_ID && expiryDate && expiryDate >= today) {
                validEntries.push(`長期委任字號：${row[2]}至${row[3]}`);
            }
        });

        if (validEntries.length > 0) {
            // 合併所有未逾期的項目，保留其他原內容
            const newContent = validEntries.join('\n');
            docOtrDesc.value = docOtrDesc.value
                ? `${docOtrDesc.value}\n${newContent}`
                : newContent;
        }
    });
};

// 綁定輸入框事件
document.getElementById('SHPR_BAN_ID').addEventListener('input', handleCheck);

// 綁定按鍵事件
document.getElementById('checkBtn').addEventListener('click', handleCheck);

// 出口備註
const thingsToNoteExcelFilePath = './thingsToNote.xlsx';

function thingsToNoteExcel(callback) {
    fetch(thingsToNoteExcelFilePath)
        .then(response => {
            if (!response.ok) throw new Error('無法讀取出口備註');
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            callback(rows);
        })
        .catch(error => {
            console.error('讀取出口備註時發生錯誤:', error);
            alert('讀取出口備註失敗');
        });
}

function thingsToNote() {
    const SHPR_BAN_ID = document.getElementById('SHPR_BAN_ID').value.trim();
    const remark1Element = document.getElementById('REMARK1');

    if (remark1Element) {
        try {
            // 取得目前的內容，按行分割
            const lines = remark1Element.value.split('\n');
            
            // 指定允許的字串
            const allowedPrefixes = [
                '申請沖退原料稅（E化退稅）',
                '申請報單副本第三聯（沖退原料稅用聯）',
                '申請報單副本第四聯（退內地稅用聯）',
                '申請報單副本第五聯（出口證明用聯）'
            ];
            
            // 過濾每行內容，只保留符合允許的行
            const filteredLines = lines.filter(line => 
                allowedPrefixes.some(prefix => line.trim().startsWith(prefix))
            );
            
            // 將過濾後的內容重新組合回文字框
            remark1Element.value = filteredLines.join('\n');
        } catch (error) {
            console.error('處理REMARKS內容時發生錯誤：', error);
        }
    }
    
    thingsToNoteExcel(rows => {
        const validEntries = [];

        // 遍歷 rows，收集所有未逾期且符合條件的資料
        rows.forEach(row => {
            const id = row[1] ? row[1].toString() : null;

            if (id === SHPR_BAN_ID) {
                validEntries.push(`${row[2]}`);
            }
        });

        if (validEntries.length > 0) {
            // 合併所有內容
            const newContent = validEntries.join('\n');
            const finalContent = `${newContent}`;

            // 將出口備註內容加到 REMARK1 欄位最前面，避免重複
            if (remark1Element) {
                // 取得目前 REMARK1 的內容
                const currentContent = remark1Element.value.trim();

                // 標準化行內容以避免因格式問題產生重複
                const normalizeContent = (content) => {
                    return content
                        .split('\n') // 按行分割
                        .map(line => line.trim()) // 去除每行的多餘空白
                        .join('\n'); // 重新合併為字串
                };

                const normalizedFinalContent = normalizeContent(finalContent);
                const normalizedCurrentContent = normalizeContent(currentContent);

                // 檢查內容是否已包含欲加入的備註
                const newEntry = `【出口備註】\n${normalizedFinalContent}`;
                if (!normalizedCurrentContent.includes(normalizedFinalContent)) {
                    // 若 REMARK1 未包含相同內容，才進行追加
                    remark1Element.value = `${newEntry}\n${currentContent}`;
                }
            }

            // 顯示彈跳框
            closeExistingPopup();
            showPopup(finalContent);
        }
    });
};

document.addEventListener('keydown', function (event) {
    if (event.altKey && event.key.toLowerCase() === 'r') { //忽略大小寫
        event.preventDefault(); // 防止預設行為
        thingsToNote();
    }
});

function closeExistingPopup() {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }
}

function showPopup(content) {
    // 創建彈跳框元素
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '10px';
    popup.style.backgroundColor = '#fef5f5'; // 背景色設置
    popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';
    popup.style.whiteSpace = 'pre-line'; // 保留換行
    popup.style.border = '5px solid #f5c2c2'; // 添加邊框
    popup.style.borderRadius = '5px'; // 邊角圓滑
    popup.style.fontSize = '16px'; // 字體大小
    popup.style.lineHeight = '1.6'; // 調整行距
    popup.style.minWidth = '400px'; // 設定最小寬度

    let isDragging = false;
    let offsetX, offsetY;

    const header = document.createElement('div');
    header.style.cursor = 'move'; // 設置可拖動光標
    header.textContent = '【出口備註】';
    popup.appendChild(header);

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
        popup.style.transition = 'none';
        document.body.style.userSelect = 'none'; // 禁止選取文字
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            popup.style.left = `${e.clientX - offsetX}px`;
            popup.style.top = `${e.clientY - offsetY}px`;
            popup.style.transform = 'none';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = ''; // 恢復文字選取
    });
    
    // 添加內容
    const contentElem = document.createElement('p');
    contentElem.textContent = content;
    contentElem.style.marginTop = '0'; // 上移文字
    popup.appendChild(contentElem);

    // 添加關閉按鈕
    const closeButton = document.createElement('button');
    closeButton.textContent = '關閉';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.addEventListener('click', () => {
        popup.remove();

        // 在關閉彈跳框後將焦點移回 SHPR_BAN_ID 欄位
        document.getElementById('SHPR_BAN_ID').focus();
    });
    popup.appendChild(closeButton);

    // 添加鍵盤事件監聽
    document.addEventListener('keydown', function escHandler(event) {
        // 檢查新增項次彈跳框是否未開啟
        const itemModal = document.getElementById('item-modal');
        if (itemModal && itemModal.style.display !== 'flex') {
            if (event.key === 'Escape') { // 檢查是否按下ESC鍵
                closeButton.focus(); // 將焦點移至關閉按鈕
            }
        }
    });
    
    // 添加到頁面
    document.body.appendChild(popup);
    
    // 顯示彈跳框
    popup.style.display = 'block';
}

function updateFieldStyle(fieldId, removeStyle) {
    // 根據條件，新增或移除指定欄位的背景樣式
    let label = document.querySelector(`label[for="${fieldId}"]`);
    if (label) {
        removeStyle ? label.removeAttribute('style') : label.setAttribute('style', 'background: #ffffff00;');
    }
}

function handleCountryCodeInput(inputId, relatedFields, requiredCountry) {
    // 當輸入特定國家代碼時，調整相關欄位的樣式
    document.getElementById(inputId).addEventListener('input', function () {
        let countryCode = this.value.toUpperCase().trim(); // 轉換為大寫並去除空白
        relatedFields.forEach(field => {
            updateFieldStyle(field, countryCode === requiredCountry);
        });
    });
}

function handleTradeTerms(inputId) {
    // 根據輸入的貿易條件，動態調整運費、保險費、應加費用及應減費用欄位的樣式
    document.getElementById(inputId).addEventListener('input', function () {
        let tradeTerm = this.value.toUpperCase().trim(); // 轉換為大寫並去除空白
        let fieldActions = {
            'EXW': { freight: false, insurance: false, add: true, subtract: false },
            'FOB': { freight: false, insurance: false, add: false, subtract: false },
            'CFR': { freight: true, insurance: false, add: false, subtract: false },
            'C&I': { freight: false, insurance: true, add: false, subtract: false },
            'CIF': { freight: true, insurance: true, add: false, subtract: false },
            'default': { freight: true, insurance: true, add: true, subtract: true }
        };
        
        let config = fieldActions[tradeTerm] || fieldActions['default'];
        updateFieldStyle('FRT_AMT', config.freight);  // 運費
        updateFieldStyle('INS_AMT', config.insurance); // 保險費
        updateFieldStyle('ADD_AMT', config.add); // 應加費用
        updateFieldStyle('SUBTRACT_AMT', config.subtract); // 應減費用
    });
}

// 啟用事件監聽，處理國家代碼的樣式變更
handleCountryCodeInput('CNEE_COUNTRY_CODE', ['CNEE_BAN_ID', 'BUYER_E_NAME', 'BUYER_E_ADDR'], 'TW');

// 啟用事件監聽，處理貿易條件的樣式變更
handleTradeTerms('TERMS_SALES');

// 使用事件代理處理所有 type="number" 的輸入框
document.addEventListener('keydown', function(event) {
    const target = event.target;

    // 當目標是 type="number" 的輸入框，禁止調整數值
    if (target.tagName === 'INPUT' && target.type === 'number') {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
        }
    }
});

// 防止數字輸入框的滾輪調整，但允許頁面滾動
document.addEventListener('wheel', function(event) {
    const target = event.target;

    // 當目標是 type="number" 的輸入框且輸入框處於聚焦狀態時，禁止滾輪調整數值
    if (target.tagName === 'INPUT' && target.type === 'number' && target === document.activeElement) {
        event.preventDefault(); // 禁止滾輪調整數值
    }
}, { passive: false }); // 使用 { passive: false } 以便可以調用 preventDefault

window.addEventListener('beforeunload', function (event) {
    event.preventDefault();
    event.returnValue = ''; // 必須設置，才能顯示提示框
});

let lastFocusedElement = null;

// 事件委派，監聽所有輸入框、按鈕的 focus 和 blur 事件
document.addEventListener('focusin', function (event) {
    if (event.target.matches('input, textarea, select, button')) {
        // 移除先前的反色效果
        if (lastFocusedElement && lastFocusedElement !== event.target) {
            lastFocusedElement.classList.remove('highlighted-element');
        }
        
        // 為新獲得焦點的元素添加反色
        event.target.classList.add('highlighted-element');
        lastFocusedElement = event.target;
    }
});

document.addEventListener('focusout', function (event) {
    if (event.target.matches('input, textarea, select, button')) {
        // 當元素失去焦點後，保持反色，直到新的元素獲得焦點時才移除
        event.target.classList.add('highlighted-element');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
        // 排除特定輸入框不顯示清除按鈕
        if (input.id === 'decimal-places' || 
            input.id === 'weight-decimal-places' || 
            input.id === 'specific-range' || 
            input.id === 'specific-weight' ||
            input.id === 'exchange-rate' ||
            input.id === 'start-number' ||
            input.id === 'Maker') {
            return;
        }
        
        input.style.position = 'relative';

        // 建立清除按鈕
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = 'X';
        clearBtn.setAttribute('type', 'button');  // 防止觸發表單提交
        clearBtn.setAttribute('tabindex', '-1');  // 避免 TAB 鍵聚焦
        clearBtn.style.position = 'absolute';
        clearBtn.style.width = '20px';
        clearBtn.style.height = '20px';
        clearBtn.style.fontSize = '12px';
        clearBtn.style.color = 'gray';
        clearBtn.style.backgroundColor = '#e6e6e6';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '50%';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.display = 'none';
        clearBtn.style.padding = '0';

        // 插入清除按鈕到輸入框的父容器內
        input.parentNode.insertBefore(clearBtn, input.nextSibling);

        // 設定按鈕位置（在輸入框內右側）
        const positionButton = () => {
            const inputStyle = window.getComputedStyle(input);
            const paddingRight = parseInt(inputStyle.paddingRight) || 0;
            const borderRight = parseInt(inputStyle.borderRightWidth) || 0;
            clearBtn.style.right = `${paddingRight + borderRight + 5}px`;
            clearBtn.style.top = `${input.offsetTop + (input.offsetHeight / 2) - (clearBtn.offsetHeight / 2)}px`;
            clearBtn.style.left = `${input.offsetLeft + input.offsetWidth - clearBtn.offsetWidth - paddingRight - borderRight - 20}px`;
        };

        positionButton();
        window.addEventListener('resize', positionButton);
        window.addEventListener('scroll', positionButton);

        clearBtn.addEventListener('mousedown', (event) => {
            event.preventDefault();  // 防止輸入框失去焦點
        });
        
        // 事件處理：點擊清除按鈕
        clearBtn.addEventListener('click', (event) => {
            event.preventDefault();  // 阻止預設表單提交行為
            input.value = '';
            input.focus();
            clearBtn.style.display = 'none';

            switch (input.id) {
                case 'SHPR_BAN_ID':
                    searchData();
                    break;
                case 'BUYER_E_NAME':
                    document.getElementById('BUYER_BAN').value = '';
                    break;
                case 'TO_CODE':
                    document.getElementById('TO_DESC').value = '';
                    break;
                case 'TO_DESC':
                    document.getElementById('TO_CODE').value = '';
                    break;
                case 'CNEE_COUNTRY_CODE':
                    let cneeFields = ['CNEE_BAN_ID', 'BUYER_E_NAME', 'BUYER_E_ADDR'];
                    cneeFields.forEach(fieldId => {
                        let label = document.querySelector(`label[for="${fieldId}"]`);
                        if (label) {
                            label.style.background = 'transparent'; // 恢復背景透明
                        }
                    });
                    document.getElementById('CNEE_COUNTRY_CODE').value = '';
                    break;
                case 'TERMS_SALES':
                    let termsFields = ['FRT_AMT', 'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT'];
                    termsFields.forEach(fieldId => {
                        let label = document.querySelector(`label[for="${fieldId}"]`);
                        if (label) {
                            label.style.background = ''; // 恢復預設背景
                        }
                    });
                    break;
                case 'CURRENCY':
                    document.getElementById('exchange-rate').value = '';
                    let currencyError = document.getElementById("currency-error");
                    if (currencyError) {
                        currencyError.style.display = "none";
                    }
                    break;
            }
        });

        // 事件處理：輸入框獲取焦點時顯示按鈕（無論是否有內容）
        input.addEventListener('focus', () => {
            clearBtn.style.display = 'block';
            positionButton();
        });

        // 事件處理：輸入框內容改變時顯示或隱藏按鈕
        input.addEventListener('input', () => {
            clearBtn.style.display = input.value ? 'block' : 'none';
        });

        // 事件處理：輸入框失去焦點時隱藏按鈕
        input.addEventListener('blur', () => {
            clearBtn.style.display = 'none';
        });

        // 設定滑鼠移入與移出時的背景顏色變化
        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.color = 'white';
            clearBtn.style.backgroundColor = '#f37380';
        });

        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.color = 'gray';
            clearBtn.style.backgroundColor = '#e6e6e6';
        });
    });
});

// 當頁面載入時，檢查 localStorage 是否有儲存的製單人員資料
window.addEventListener('DOMContentLoaded', () => {
    const savedMaker = localStorage.getItem('Maker');
    if (savedMaker !== null) {
        document.getElementById('Maker').value = savedMaker;
    }
});

// 按下儲存按鈕時，將製單人員名稱儲存到 localStorage
document.getElementById('saveMaker').addEventListener('click', () => {
    const maker = document.getElementById('Maker').value;
    localStorage.setItem('Maker', maker);
    alert('製單人員已儲存！');
});
