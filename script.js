let itemCount = 0; // 初始化項次計數
let fileContent = null; // 儲存上傳文件的內容

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

// 處理 Alt+PageUp、Alt+PageDown、PageUp 和 PageDown 的捲動
function handlePageScroll(event) {
    const scrollHorizontalAmount = window.innerWidth * 0.85; // 水平捲動距離
    const scrollVerticalAmount = window.innerHeight * 0.75; // 垂直捲動距離
    const duration = 150; // 設定更快的捲動速度（時間以毫秒為單位）

    if (event.altKey && event.key === 'PageUp') {
        // Alt+PageUp 向左捲動
        smoothScrollBy(-scrollHorizontalAmount, 0, duration);
        event.preventDefault(); // 防止預設行為
    } else if (event.altKey && event.key === 'PageDown') {
        // Alt+PageDown 向右捲動
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
        document.getElementById('SHPR_C_NAME').value = '';
        document.getElementById('SHPR_E_NAME').value = '';
        document.getElementById('SHPR_C_ADDR').value = '';
        document.getElementById('SHPR_E_ADDR').value = '';
        noDataMessage.style.display = 'none'; // 隱藏錯誤訊息
        return;
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
                    noDataMessage.style.display = 'none'; // 隱藏"查無資料"訊息
                } else {
                    // 清空欄位
                    document.getElementById('SHPR_C_NAME').value = '';
                    document.getElementById('SHPR_E_NAME').value = '';
                    document.getElementById('SHPR_C_ADDR').value = '';
                    document.getElementById('SHPR_E_ADDR').value = '';
                    noDataMessage.style.display = 'inline'; // 顯示"查無資料"訊息
                }
            }
        });
    }
    thingsToNote(); // 注意事項
}

// 即時帶入資料，不顯示錯誤訊息
document.getElementById('SHPR_BAN_ID').addEventListener('input', function() {
    searchData(false); // 不顯示錯誤訊息，只帶入資料
});

// 儲存目的地數據
let destinations = {};

// 讀取CSV文件並解析
fetch('destinations.csv')
    .then(response => response.text())
    .then(data => {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                results.data.forEach(item => {
                    destinations[item["目的地代碼"]] = item["目的地名稱"];
                });
            }
        });
    });

// 當用戶填入目的地代碼時，自動填入相應的名稱
document.getElementById('TO_CODE').addEventListener('input', function() {
    let code = this.value.toUpperCase();
    if (destinations[code]) {
        document.getElementById('TO_DESC').value = destinations[code];
    } else {
        document.getElementById('TO_DESC').value = '';
    }
});

// 初始化拖動功能
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

// 從 gc331_current.json 檔案中獲取匯率數據
function fetchExchangeRates() {
    return fetch('gc331_current.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('獲取匯率數據時出錯:', error);
            return null;
        });
}

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
    // 獲取使用者輸入的幣別和總毛重
    const currency = document.getElementById('CURRENCY').value.toUpperCase();
    const weight = parseFloat(document.getElementById('DCL_GW').value);

    // 從JSON檔案中獲取匯率數據
    fetchExchangeRates().then(exchangeRates => {
        if (!exchangeRates) {
            document.getElementById('FRT_AMT').value = "無法獲取匯率數據";
            return;
        }

        // 找到 USD 和指定幣別的匯率
        const usdRate = exchangeRates.items.find(item => item.code === "USD").buyValue;
        const currencyRate = exchangeRates.items.find(item => item.code === currency)?.buyValue;

        // 如果匯率和總毛重有效，計算運費並顯示
        if (currencyRate && !isNaN(weight)) {
            // 基礎運費計算
            const freight = (weight * 3 * usdRate) / currencyRate;
            const decimalPlaces = currency === "TWD" ? 0 : 2;
            document.getElementById('FRT_AMT').value = new Decimal(freight).toFixed(decimalPlaces);

            // 計算後調用調整函數
            adjustFreightAndInsurance();
        } else {
            // 如果輸入無效，顯示錯誤訊息
            document.getElementById('FRT_AMT').value = "輸入無效";
        }
    });
}

// 計算保險費並顯示結果
function calculateInsurance() {
    const totalAmount = parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value);
    const currency = document.getElementById('CURRENCY').value.toUpperCase();

    // 從JSON檔案中獲取匯率數據
    fetchExchangeRates().then(exchangeRates => {
        if (!exchangeRates) {
            document.getElementById('INS_AMT').value = "無法獲取匯率數據";
            return;
        }

        // 找到指定幣別的匯率
        const currencyRate = exchangeRates.items.find(item => item.code === currency)?.buyValue;

        // 如果匯率和總金額有效，計算保險費並顯示
        if (currencyRate && !isNaN(totalAmount)) {
            // 基礎保險費計算
            let insurance = totalAmount * 0.0011;
            const minimumInsurance = 450 / currencyRate;
            if (insurance < minimumInsurance) {
                insurance = minimumInsurance;
            }
            const decimalPlaces = currency === "TWD" ? 0 : 2;
            document.getElementById('INS_AMT').value = new Decimal(insurance).toFixed(decimalPlaces);

            // 計算後調用調整函數
            adjustFreightAndInsurance();
        } else {
            // 如果輸入無效，顯示錯誤訊息
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

    // EXW 和 FOB 條件判斷
    if (termsSales === "EXW" || termsSales === "FOB") {
        freight = '';
        insurance = '';
    }
    // CFR 條件判斷
    else if (termsSales === "CFR" && freight > totalAmount) {
        freight = totalAmount / 2;
    }
    // C&I 條件判斷
    else if (termsSales === "C&I" && insurance > totalAmount) {
        insurance = totalAmount / 2;
    }
    // CIF 條件判斷
    else if (termsSales === "CIF" && (freight + insurance) > totalAmount) {
        freight = totalAmount / 4;
        insurance = totalAmount / 4;
    }

    // 更新 FRT_AMT 和 INS_AMT 顯示
    document.getElementById('FRT_AMT').value = freight === '' ? '' : freight.toFixed(2);
    document.getElementById('INS_AMT').value = insurance === '' ? '' : insurance.toFixed(2);
}

// 計算應加費用並顯示結果
function calculateAdditional() {
    const currency = document.getElementById('CURRENCY').value.toUpperCase();

    // 從JSON檔案中獲取匯率數據
    fetchExchangeRates().then(exchangeRates => {
        if (!exchangeRates) {
            document.getElementById('ADD_AMT').value = "無法獲取匯率數據";
            return;
        }

        // 找到指定幣別的匯率
        const currencyRate = exchangeRates.items.find(item => item.code === currency)?.buyValue;

        // 如果匯率有效，計算應加費用並顯示
        if (currencyRate) {
            const additionalFee = 500 / currencyRate;
            const decimalPlaces = currency === "TWD" ? 0 : 2;
            document.getElementById('ADD_AMT').value = new Decimal(additionalFee).toFixed(decimalPlaces);
        } else {
            // 如果輸入無效，顯示錯誤訊息
            document.getElementById('ADD_AMT').value = "輸入無效";
        }
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

    // 監聽數量和單價輸入框的鍵盤事件，禁止方向鍵調整數字
    document.getElementById('QTY').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('DOC_UNIT_P').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('NET_WT').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('ORG_IMP_DCL_NO_ITEM').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('CERT_NO_ITEM').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('ORG_DCL_NO_ITEM').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('EXP_SEQ_NO').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('WIDE').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('LENGT_').addEventListener('keydown', preventArrowKeyAdjustment);
    document.getElementById('ST_QTY').addEventListener('keydown', preventArrowKeyAdjustment);
    
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

// 函數禁止方向鍵調整數字
function preventArrowKeyAdjustment(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
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
        ST_QTY: document.getElementById('ST_QTY').value,
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

// 刪除項次
function removeItem(element) {
    const item = element.parentElement.parentElement;
    item.parentElement.removeChild(item);
    renumberItems(); // 重新計算項次編號
}

// 開啟顯示隱藏欄位彈跳框
function openToggleFieldsModal() {
    const toggleFieldsModal = document.getElementById('toggle-fields-modal');
    toggleFieldsModal.style.display = 'flex';

    // 監聽 ESC 鍵，表示取消
    document.addEventListener('keydown', handleEscKeyForToggleFieldsCancel);
}

function handleEscKeyForToggleFieldsCancel(event) {
    if (event.key === 'Escape') {
        closeToggleFieldsModal();
    }
}

function closeToggleFieldsModal() {
    const toggleFieldsModal = document.getElementById('toggle-fields-modal');
    toggleFieldsModal.style.display = 'none';
    document.removeEventListener('keydown', handleEscKeyForToggleFieldsCancel);
}

function applyToggleFields() {
    const selectedOptions = Array.from(document.getElementById('field-select').selectedOptions).map(option => option.value);
    
    const allFields = [
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

// 引入 Sortable.js 庫
document.write('<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js"><\/script>');

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
    
    // 允許點擊背後的頁面欄位
    specifyFieldModal.style.pointerEvents = 'none';
    specifyFieldModal.children[0].style.pointerEvents = 'auto'; // 只允許彈跳框內部的第一個子元素接收點擊

    // 監聽 ESC 鍵，表示取消
    document.addEventListener('keydown', handleEscKeyForSpecifyFieldCancel);
}

function handleEscKeyForSpecifyFieldCancel(event) {
    if (event.key === 'Escape') {
        closeSpecifyFieldModal();
    }
}

// 關閉指定填列欄位資料的彈跳框
function closeSpecifyFieldModal() {
    const specifyFieldModal = document.getElementById('specify-field-modal');
    specifyFieldModal.style.display = 'none';
    document.removeEventListener('keydown', handleEscKeyForSpecifyFieldCancel);
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
    
    if (specifyMode === 'copy') {
        customContent.style.display = 'none';
        copyContent.style.display = 'block';
        populateSourceItemDropdown();
    } else {
        customContent.style.display = 'block';
        copyContent.style.display = 'none';
    }
}

// 當指定的欄位變更時檢查是否顯示起始編號輸入框和填列內容
document.getElementById('specify-field-name').addEventListener('change', function () {
    const fieldName = document.getElementById('specify-field-name').value;
    const startNumberContainer = document.getElementById('start-number-container');
    const customContent = document.getElementById('custom-content');
    const specifyFieldValue = document.getElementById('specify-field-value');

    if (fieldName === 'CERT_NO_ITEM') {
        startNumberContainer.style.display = 'inline-block';
        specifyFieldValue.value = '';  // 清除填列內容的文字
        specifyFieldValue.style.display = 'none';  // 隱藏填列內容
    } else {
        startNumberContainer.style.display = 'none';
        specifyFieldValue.style.display = 'block';  // 顯示填列內容
    }
});

// 應用填列資料的函數
function applyFieldData() {
    const mode = document.getElementById('specify-mode').value;
    const overwriteOption = document.getElementById('overwrite-option').value;
    const itemContainer = document.getElementById('item-container');
    const items = itemContainer.querySelectorAll('.item-row');
    let hasUpdatedCCCCode = false; // 紀錄是否有更新CCC_CODE欄位
    let hasUpdatedQtyOrUnitPrice = false; // 紀錄是否有更新QTY或DOC_UNIT_P欄位

    if (mode === 'custom') {
        const itemNumbers = document.getElementById('specify-item-numbers').value;
        const fieldName = document.getElementById('specify-field-name').value;
        const fieldValue = document.getElementById('specify-field-value').value;
        const startNumber = parseInt(document.getElementById('start-number').value, 10); // 起始編號
        let currentNumber = startNumber; // 當前編號

        const ranges = itemNumbers.split(',').map(range => range.trim());
        let indices = [];

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

        indices.forEach(index => {
            if (index >= 0 && index < items.length) {
                const item = items[index];
                const fieldElement = item.querySelector(`.${fieldName}`);
                if (overwriteOption === 'all' || (overwriteOption === 'empty' && !fieldElement.value) || (overwriteOption === 'specified' && fieldElement.value)) {
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

                    // 紀錄是否更新了QTY或DOC_UNIT_P
                    if (fieldName === 'QTY' || fieldName === 'DOC_UNIT_P') {
                        hasUpdatedQtyOrUnitPrice = true;
                    }
                }
            }
        });
    } else if (mode === 'copy') {
        const sourceItemNumber = document.getElementById('source-item-number').value;
        const fieldNames = Array.from(document.getElementById('specify-field-names-copy').selectedOptions).map(option => option.value);
        const targetItemNumbers = document.getElementById('target-item-numbers').value;
        const sourceIndex = parseInt(sourceItemNumber, 10) - 1;

        const ranges = targetItemNumbers.split(',').map(range => range.trim());
        let targetIndices = [];

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

        if (sourceIndex >= 0 && sourceIndex < items.length) {
            const sourceItem = items[sourceIndex];

            targetIndices.forEach(index => {
                if (index >= 0 && index < items.length) {
                    const targetItem = items[index];
                    fieldNames.forEach(fieldName => {
                        const sourceFieldElement = sourceItem.querySelector(`.${fieldName}`);
                        const targetFieldElement = targetItem.querySelector(`.${fieldName}`);

                        if (overwriteOption === 'all' || (overwriteOption === 'empty' && !targetFieldElement.value) || (overwriteOption === 'specified' && targetFieldElement.value)) {
                            targetFieldElement.value = sourceFieldElement.value;
                        }
                        // 紀錄是否更新了CCC_CODE
                        if (fieldName === 'CCC_CODE') {
                            hasUpdatedCCCCode = true;
                        }
                        // 紀錄是否更新了QTY或DOC_UNIT_P
                        if (fieldName === 'QTY' || fieldName === 'DOC_UNIT_P') {
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

    // 檢查是否有更新QTY或DOC_UNIT_P欄位，若有則對所有更新的欄位執行金額計算
    if (hasUpdatedQtyOrUnitPrice) {
        items.forEach(item => {
            calculateAmountsForRow(item, decimalPlaces);
        });
    }

    closeSpecifyFieldModal();
}

function clearField() {
    const cneeCNameInput = document.getElementById('CNEE_C_NAME');
    if (cneeCNameInput) {
        cneeCNameInput.value = ''; // 清空輸入框內容
    }
}

// 匯入Excel文件的功能
function handleFile(event) {
    clearField(); // 清空輸入框內容
    
    const file = event.target.files[0];
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
                    const fieldsToRemoveSeparators = ['TOT_CTN', 'DCL_GW', 'DCL_NW', 'CAL_IP_TOT_ITEM_AMT', 'FRT_AMT', 'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT'];
                    if (fieldsToRemoveSeparators.includes(id)) {
                        value = removeThousandsSeparator(value);
                    }

                    element.value = value;
                }
            }
        });

        handleCheck(); // 長期委任字號
        thingsToNote(); // 注意事項
        
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
        };

        itemsData.slice(1).forEach((row, index) => {
            const hasItemNo = row[0]; // 判斷項次是否有數據
            const hasDescription = descriptionIndices.some(i => row[i]);

            if (hasItemNo) {
                if (currentItem) {
                    currentItem.querySelector('.DESCRIPTION').value = currentDescription.trim();
                    itemContainer.appendChild(currentItem);
                }
                const description = descriptionIndices.map(i => String(row[i] || '')).filter(Boolean).join('\n');
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
                    ST_MTD: String(row[descriptionIndices[descriptionIndices.length - 1] + 7] || ''),
                    NET_WT: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 8] || '')),
                    ORG_COUNTRY: String(row[descriptionIndices[descriptionIndices.length - 1] + 9] || ''),
                    ORG_IMP_DCL_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 10] || ''),
                    ORG_IMP_DCL_NO_ITEM: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 11] || '')),
                    SELLER_ITEM_CODE: String(row[descriptionIndices[descriptionIndices.length - 1] + 12] || ''),
                    BOND_NOTE: String(row[descriptionIndices[descriptionIndices.length - 1] + 13] || ''),
                    GOODS_MODEL: String(row[descriptionIndices[descriptionIndices.length - 1] + 14] || ''),
                    GOODS_SPEC: String(row[descriptionIndices[descriptionIndices.length - 1] + 15] || ''),
                    CERT_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 16] || ''),
                    CERT_NO_ITEM: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 17] || '')),
                    ORG_DCL_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 18] || ''),
                    ORG_DCL_NO_ITEM: removeThousandsSeparator(String(row[descriptionIndices[descriptionIndices.length - 1] + 19] || '')),
                    EXP_NO: String(row[descriptionIndices[descriptionIndices.length - 1] + 20] || ''),
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
        ['No.(必填)', '項次(非必填，大品名註記以"*"表示，可無編號)', '數量', '單位', '單價', '金額', 
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
    document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
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
                headerWorksheet[cellRef].z = '@'; // 文字格式
            }
        }
    }

    // 設置報單項次 A 欄至 AD 欄為文字格式，並針對 D, F, G, K 欄設置為通用格式
    const generalCols = [3, 5, 6, 10]; // D(3), F(5), G(6), K(10)

    // 取得工作表範圍
    const range = XLSX.utils.decode_range(itemsWorksheet['!ref']);

    // 更新範圍以涵蓋 A 到 AD 欄
    range.e.c = Math.max(range.e.c, 29);

    // 更新工作表範圍
    itemsWorksheet['!ref'] = XLSX.utils.encode_range(range);

    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = 0; col <= 29; col++) { // A 欄 (0) 到 AD 欄 (29)
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            
            // 如果單元格不存在，創建一個空單元格
            if (!itemsWorksheet[cellRef]) {
                itemsWorksheet[cellRef] = { t: 's', v: '' }; // 設置為空的文字單元格
            }

            // 如果欄位是 D, F, G, K 則設置為通用格式，否則設置為文字格式
            if (generalCols.includes(col)) {
                itemsWorksheet[cellRef].z = 'General'; // 通用格式
            } else {
                itemsWorksheet[cellRef].z = '@'; // 文字格式
            }
        }
    }
    
    // 創建工作簿並添加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, headerWorksheet, '報單表頭');
    XLSX.utils.book_append_sheet(workbook, itemsWorksheet, '報單項次');

    // 文件名
    const fileName = document.getElementById('FILE_NO').value.trim() || '';
    const exporterName = document.getElementById('SHPR_C_NAME').value.trim() || '';

    // 下載 Excel 文件
    let exportFileName = '';
    if (fileName && exporterName) {
        exportFileName = `${fileName}-${exporterName}.xlsx`;
    } else if (fileName) {
        exportFileName = `${fileName}.xlsx`;
    } else if (exporterName) {
        exportFileName = `${exporterName}.xlsx`;
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

            handleCheck(); // 長期委任字號
            thingsToNote(); // 注意事項
            
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

    row.innerHTML = `
        <div class="form-group fix item-no item-no-header" onclick="toggleSelect(this)">
            <label>${itemCount + 1}</label>
        </div>
        <div class="form-group fix">
            <input type="checkbox" class="ITEM_NO" tabindex="-1" ${isChecked ? 'checked' : ''}>
        </div>
        <div class="form-group fix item-number" style="width: 2%;">
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

                // 如果 ST_UM 欄位的值為 "MTK"，且 DOC_UM 的值不是 "MTK" 時，自動顯示 WIDE, WIDE_UM, LENGT_, LENGTH_UM 欄位
                if (field === 'ST_UM' && fieldElement.value && fieldElement.value.trim() === 'MTK') {
                    const docUmField = document.querySelector(`#item-container .DOC_UM`);
                    if (docUmField && docUmField.value.trim() !== 'MTK') {
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
    const buttonText = newRows === 1 ? '展開全部至 5 行' : (newRows === 5 ? '展開全部至 10 行' : '折疊全部至 1 行');
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
    try {
        const visibilityClass = isVisible ? '' : 'hidden';
        const numberFields = ['QTY', 'DOC_UNIT_P', 'NET_WT', 'ORG_IMP_DCL_NO_ITEM', 'CERT_NO_ITEM', 'ORG_DCL_NO_ITEM', 'EXP_SEQ_NO', 'WIDE', 'LENGT_', 'ST_QTY'];
        const upperCaseFields = ['LOT_NO', 'SHPR_BONDED_ID', 'CNEE_COUNTRY_CODE', 'TO_CODE', 'DOC_CTN_UM', 'DCL_DOC_TYPE', 'TERMS_SALES', 'CURRENCY', 'DOC_UM', 'ST_MTD', 'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 'BOND_NOTE', 'CERT_NO', 'ORG_DCL_NO', 'EXP_NO', 'WIDE_UM', 'LENGTH_UM', 'ST_UM'];
        const inputType = numberFields.includes(name) ? 'number' : 'text';
        const onInputAttribute = numberFields.includes(name) ? 'oninput="calculateAmount(event); validateNumberInput(event)"' : '';
        const minAttribute = numberFields.includes(name) ? 'min="0"' : '';
        const readonlyAttribute = (name === 'DOC_TOT_P') ? 'readonly' : '';
        const onFocusAttribute = 'onfocus="highlightRow(this)"';
        const onBlurAttribute = 'onblur="removeHighlight(this)"';
        const onKeyDownAttribute = 'onkeydown="handleInputKeyDown(event, this)"';
        const onInputUpperCaseAttribute = upperCaseFields.includes(name) ? 'oninput="this.value = this.value.toUpperCase()"' : '';
    
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
                <div class="form-group ${visibilityClass}" style="width: 20%; display: flex; align-items: center;">
                    <input type="checkbox" class="ISCALC_WT" style="margin-left: 5px;" ${isCalcChecked} tabindex="-1">
                </div>
                <div class="form-group ${visibilityClass}" style="width: 60%; display: flex; align-items: center;">
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
        alert(`[ ${fieldLabel} ] 欄位錯誤，請檢查檔案後再重新匯入。`);
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
    const qty = row.querySelector('.QTY').value || 0;
    const unitPrice = row.querySelector('.DOC_UNIT_P').value || 0;
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    const totalPrice = qty * unitPrice;
    const totalPriceField = row.querySelector('.DOC_TOT_P');
    
    if (totalPrice === 0) {
        totalPriceField.value = '';
    } else {
        totalPriceField.value = new Decimal(totalPrice).toDecimalPlaces(10, Decimal.ROUND_UP).toFixed(decimalPlaces);
    }
}

// 數量核算
function calculateQuantities() {
    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        alert('請先新增至少一個項次');
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
        stUnitQuantitiesString += `\n${parseFloat(stTotalQuantity.toFixed(6))} ${unit}`;
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
        // 呼叫 calculateAmountsForRow 函式進行金額計算
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
        alert('請先新增至少一個項次');
        return;
    }

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
                keywordAlerts.push(`➤ NO ${index + 1} 內含關鍵字 "${keyword}"，請確認是否為其他費用。`);
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
        alert('請先填寫有效的總淨重');
        return;
    }

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        alert('請先新增至少一個項次');
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

// 攤重
function spreadWeight() {
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

    const decimalPlacesInput = document.getElementById('decimal-places-weight');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    let fixedWeights = [];
    let remainingNetWeight = totalNetWeight;
    let totalQuantity = 0;

    // 確定哪些項次是固定的
    items.forEach((item, index) => {
        const checkbox = item.querySelector('.ISCALC_WT');
        let netWeight = parseFloat(item.querySelector('.NET_WT').value);
    
        // 如果 .NET_WT 欄位為空或為零，則取消 checkbox 選中
        if (!netWeight || isNaN(netWeight)) {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false; // 取消勾選
            }
            netWeight = 0; // 設為零以避免NaN
        }
    
        if (checkbox && checkbox.checked) {
            fixedWeights.push({ index, netWeight });
            remainingNetWeight -= netWeight;
        } else {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            if (!isNaN(quantity)) {
                totalQuantity += quantity;
            }
        }
    });

    if (totalQuantity <= 0) {
        alert('未鎖定的數量總和必須大於零');
        return;
    }

    // 確認是否進行分配
    if (!confirm('確定要分配淨重嗎？')) {
        return;
    }

    // 將剩餘淨重按比例分配到未固定的項次
    let distributedWeights = [];
    const minWeight = Math.pow(10, -decimalPlaces); // 確保最小值不為0
    items.forEach((item, index) => {
        if (!fixedWeights.some(fixed => fixed.index === index)) {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            if (!isNaN(quantity) && quantity > 0) {
                let netWeight = parseFloat(((quantity / totalQuantity) * remainingNetWeight).toFixed(decimalPlaces));
                if (netWeight <= 0) {
                    netWeight = minWeight; // 確保最小值不為0
                }
                distributedWeights.push({ index, netWeight });
            }
        }
    });

    // 將分配的重量應用到每個項次
    distributedWeights.forEach(item => {
        const netWtElement = items[item.index].querySelector('.NET_WT');
        netWtElement.value = item.netWeight.toFixed(decimalPlaces);
    });

    // 確保固定重量項次的值不變
    fixedWeights.forEach(fixed => {
        const netWtElement = items[fixed.index].querySelector('.NET_WT');
        netWtElement.value = fixed.netWeight;
    });

    // 最後調整確保分配重量總和等於總淨重
    let finalTotalWeight = Array.from(items).reduce((sum, item) => {
        const netWeight = parseFloat(item.querySelector('.NET_WT').value);
        return sum + (isNaN(netWeight) ? 0 : netWeight);
    }, 0);

    let finalDiscrepancy = totalNetWeight - finalTotalWeight;

    if (finalDiscrepancy !== 0) {
        // 找到數量值最大的未鎖定項次
        let maxQuantityItems = [];
        let maxQuantity = -Infinity;

        items.forEach((item, index) => {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            const checkbox = item.querySelector('.ISCALC_WT');
            if (quantity >= maxQuantity && (!checkbox || !checkbox.checked)) {
                if (quantity > maxQuantity) {
                    maxQuantityItems = [{ item, quantity }];
                    maxQuantity = quantity;
                } else {
                    maxQuantityItems.push({ item, quantity });
                }
            }
        });

        if (maxQuantityItems.length > 0) {
            let totalMaxQuantity = maxQuantityItems.reduce((sum, item) => sum + item.quantity, 0);
            maxQuantityItems.forEach(itemData => {
                const netWtElement = itemData.item.querySelector('.NET_WT');
                const adjustment = (itemData.quantity / totalMaxQuantity) * finalDiscrepancy;
                const adjustedWeight = parseFloat(netWtElement.value) + adjustment;
                netWtElement.value = adjustedWeight.toFixed(decimalPlaces);
            });
        }

        // 再次計算總重量，確保最終總和正確
        finalTotalWeight = Array.from(items).reduce((sum, item) => {
            const netWeight = parseFloat(item.querySelector('.NET_WT').value);
            return sum + (isNaN(netWeight) ? 0 : netWeight);
        }, 0);

        finalDiscrepancy = totalNetWeight - finalTotalWeight;

        if (finalDiscrepancy !== 0) {
            const largestItem = maxQuantityItems.reduce((prev, current) => (prev.quantity > current.quantity ? prev : current));
            const netWtElement = largestItem.item.querySelector('.NET_WT');
            const adjustedWeight = parseFloat(netWtElement.value) + finalDiscrepancy;
            netWtElement.value = adjustedWeight.toFixed(decimalPlaces);
        }
    }

    // 顯示最終加總的重量
    const adjustedTotalWeight = parseFloat(
        Array.from(items).reduce((sum, item) => {
            const netWeight = parseFloat(item.querySelector('.NET_WT').value);
            return sum + (isNaN(netWeight) ? 0 : netWeight);
        }, 0).toFixed(6)
    );
    alert(`報單表頭的總淨重為：${totalNetWeight}\n各項次的淨重加總為：${adjustedTotalWeight}`);
}

function calculate() {
    calculateQuantities(); //數量核算
    calculateAmounts(); // 金額核算
    calculateWeight(); // 重量核算
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
    remark1Element.value = additionalDesc + (additionalDesc ? '\n' : '') + currentRemark;
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
    
    function exportToXML() {
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

        // 若 validateDclDocType 發現錯誤，則直接返回，中止後續程式碼
        if (!validateDclDocType()) {
            return;
        }
        
        const headerFields = [
            'LOT_NO', 'SHPR_BAN_ID', 'SHPR_BONDED_ID', 
            'SHPR_C_NAME', 'SHPR_E_NAME', 'SHPR_C_ADDR', 'SHPR_E_ADDR', 
            'CNEE_C_NAME', 'CNEE_E_NAME', 'CNEE_E_ADDR', 
            'CNEE_COUNTRY_CODE', 'CNEE_BAN_ID',
            'BUYER_E_NAME', 'BUYER_E_ADDR', 'TO_CODE', 'TO_DESC', 
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

        // 取得 SHPR_BAN_ID 欄位的值
        const shprBanIdElement = document.getElementById('SHPR_BAN_ID');
        const shprBanId = shprBanIdElement ? shprBanIdElement.value.trim() : '';

        // 將 PROC_NO 的值設置為 'X8CS'
        let procNo = 'X8CS';
        const excludedProcNoIds = ['23570158']; // 排除的 SHPR_BAN_ID 值清單
        if (excludedProcNoIds.includes(shprBanId)) {
            procNo = ''; // 如果在排除列表中，清空 PROC_NO
        }
        xmlContent += `  <fields>\n    <field_name>PROC_NO</field_name>\n    <field_value>${procNo}</field_value>\n  </fields>\n`;

        // AEO 編號對照表
        const aeoMapping = {
            "23218022": "TWAEO-103000025", // 矽格股份有限公司
            "84149456": "TWAEO-104000026", // 矽格聯測股份有限公司
            "27951609": "TWAEO-108000019", // 群聯電子股份有限公司竹南分公司
            "11384708": "TWAEO-105000007", // 長春人造樹脂廠股份有限公司
            "70848839": "TWAEO-104000014", // 日月光半導體製造股份有限公司中壢分公司
            "22327466": "TWAEO-104000036", // 立端科技股份有限公司
            "70647919": "TWAEO-100000038", // 台灣精銳科技股份有限公司
            "86436593": "TWAEO-109000011", // 翔名科技股份有限公司
            "89549184": "TWAEO-112000006", // 榮昌科技股份有限公司
            "16130599": "TWAEO-99000007", // 友達光電股份有限公司桃園分公司
            "84149786": "TWAEO-104000028", // 晶元光電股份有限公司
            "97331723": "TWAEO-102000060", // 啟碁科技股份有限公司
            "84149738": "TWAEO-100000006", // 友達光電股份有限公司
        };
        
        // 查找對應的 AEO 編號
        const shprAeo = aeoMapping[shprBanId] || ''; // 若未找到，則設為空字串

        // 添加 SHPR_AEO 欄位
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

        const fileName = document.getElementById('FILE_NO').value.trim() || '';
        const exporterName = document.getElementById('SHPR_C_NAME').value.trim() || '';

        let fullFileName = '';
        if (fileName && exporterName) {
            fullFileName = `${fileName}-${exporterName}.xml`;
        } else if (fileName) {
            fullFileName = `${fileName}.xml`;
        } else if (exporterName) {
            fullFileName = `${exporterName}.xml`;
        } else {
            fullFileName = 'export.xml';
        }

        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fullFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        calculate();
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

// 檢查統計方式、生產國別、原進口報單、報單類別
function validateDclDocType() {
    const dclDocType = document.getElementById('DCL_DOC_TYPE').value.trim().toUpperCase();
    const stMtdCondition1 = ["02", "04", "05", "06", "2L", "2R", "7M", "1A", "94", "95"];
    const stMtdCondition2 = ["81", "82", "8B", "8C", "9N", "8A", "8D", "92", "99", "9M"];
    let validationErrors = new Set(); // 使用 Set 儲存錯誤訊息，避免重複

    // 檢查 G5 或 G3 的條件
    if (["G5", "G3"].includes(dclDocType)) {
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
                if (orgCountryValue && orgCountryValue.toUpperCase() !== "TW") {
                    validationErrors.add(
                        `國貨出口統計方式，生產國別應為空或 TW`
                    );
                }
                if (orgImpDclNo) {
                    validationErrors.add(
                        `國貨出口統計方式，原進口報單號碼不應有值`
                    );
                }
            }
    
            // 檢查條件 2：ST_MTD 為 外貨復出口統計方式 時
            if (stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                totalCondition2 += docTotPValue; // 加總條件 2 的金額
                containsMandatoryOrgCountry = true; // 標記需要檢查所有項次的 ORG_COUNTRY
                if (!orgCountryValue || orgCountryValue.trim() === "") {
                    validationErrors.add(
                        `外貨復出口統計方式，生產國別不可為空`
                    );
                } else if (orgCountryValue.toUpperCase() === "TW") {
                    if (!orgImpDclNo || orgImpDclNo.trim() === "") {
                        validationErrors.add(
                            `外貨復出口統計方式且生產國別為 TW\n` +
                            `原進口報單號碼 及 原進口報單項次 不可為空`
                        );
                    }
                }
            }
    
            // 標記是否存在空的 ORG_COUNTRY
            if ((!orgCountryValue || orgCountryValue.trim() === "") && !isItemChecked) {
                hasEmptyOrgCountry = true;
            }
        });
    
        // 檢查條件 3：若有 ST_MTD 為 外貨復出口統計方式，則所有項次的 ORG_COUNTRY 不可為空
        if (containsMandatoryOrgCountry && hasEmptyOrgCountry) {
            validationErrors.add("國洋貨合併申報，生產國別必填（國貨請填 TW ）");
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
        let missingOrgImpDclNo = false;

        rows.forEach(item => {
            const stMtdValue = item.querySelector(".ST_MTD")?.value.trim();
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
            const orgImpDclNo = item.querySelector(".ORG_IMP_DCL_NO")?.value.trim();

            if (!orgImpDclNo && !isItemChecked) {
                missingOrgImpDclNo = true; // 檢查是否有空的 ORG_IMP_DCL_NO
            }
            if (stMtdCondition1.includes(stMtdValue) && !isItemChecked) {
                allCondition1 = true; // 有符合條件1的項目且未勾選
            }
            if (stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                allCondition2 = true; // 有符合條件2的項目且未勾選
            }
        });

        if (missingOrgImpDclNo) {
            validationErrors.add("B8 需核銷，原進口報單號碼 及 原進口報單項次 不可為空");
        }
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
                        if (stMtdValue !== "53") {
                            validationErrors.add("B9 報單第一個項次，須為國貨統計方式");
                        }
                    }
                    firstValueChecked = true; // 標記已檢查第一個有值的項次
                }
            }

            // 檢查其他項次中是否有統計方式為 53，但保稅貨物註記不為 NB
            if (stMtdValue === "53") {
                const bondNoteValue = item.querySelector(".BOND_NOTE")?.value.trim();
                if (bondNoteValue !== "NB") {
                    validationErrors.add(`統計方式為 53，保稅貨物註記須為 NB`);
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
            if (!response.ok) throw new Error('無法讀取 Excel 檔案');
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            callback(rows);
        })
        .catch(error => {
            console.error('讀取 Excel 檔案時發生錯誤:', error);
            alert('讀取 Excel 檔案失敗');
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

// 注意事項：
const thingsToNoteExcelFilePath = './thingsToNote.xlsx';

function thingsToNoteExcel(callback) {
    fetch(thingsToNoteExcelFilePath)
        .then(response => {
            if (!response.ok) throw new Error('無法讀取 Excel 檔案');
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            callback(rows);
        })
        .catch(error => {
            console.error('讀取 Excel 檔案時發生錯誤:', error);
            alert('讀取 Excel 檔案失敗');
        });
}

function thingsToNote() {
    const SHPR_BAN_ID = document.getElementById('SHPR_BAN_ID').value.trim();

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
            closeExistingPopup();
            showPopup(finalContent);
        }
    });
};

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
    header.textContent = '【注意事項！】';
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
    });
    popup.appendChild(closeButton);

    // 添加到頁面
    document.body.appendChild(popup);

    // 顯示彈跳框
    popup.style.display = 'block';
}

// 綁定輸入框事件
document.getElementById('SHPR_BAN_ID').addEventListener('input', thingsToNote);
