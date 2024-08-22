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

        const newTabName = tabLinks[newIndex].getAttribute('onclick').match(/'([^']+)'/)[1];
        openTab(newTabName);
        tabLinks[newIndex].focus(); // 將焦點移至新選中的 tab
    }
});

function openTab(tabName) {
    const tabs = document.querySelectorAll(".tab");
    const tabLinks = document.querySelectorAll(".tab-links");

    tabs.forEach(tab => tab.classList.remove("active"));
    tabLinks.forEach(link => link.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    document.querySelector(`.tab-links[onclick="openTab('${tabName}')"]`).classList.add("active");
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

// 切換固定頁面寬度
function toggleWidth() {
    var itemsTab = document.getElementById("items");
    if (document.getElementById("toggle-width").checked) {
        itemsTab.classList.add("fixed-width");
    } else {
        itemsTab.classList.remove("fixed-width");
    }
}

// 切換固定項次標題
function toggleFixTop() {
    var headerContainer = document.getElementById('header-container');
    var checkbox = document.getElementById('toggle-fix-top');
    if (checkbox.checked) {
        headerContainer.classList.add('fixed-top');
    } else {
        headerContainer.classList.remove('fixed-top');
    }
}

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

// 輸入統一編號以查找資料
let csvFiles = [
    'companyData1.csv',
    'companyData2.csv',
    'companyData3.csv'
];

function fillForm(record) {
    if (record) {
        document.getElementById('SHPR_BAN_ID').value = record['統一編號'] || '';
        document.getElementById('SHPR_C_NAME').value = record['廠商中文名稱'] || '';
        document.getElementById('SHPR_E_NAME').value = record['廠商英文名稱'] || '';
        document.getElementById('SHPR_C_ADDR').value = record['中文營業地址'] || '';
        document.getElementById('SHPR_E_ADDR').value = record['英文營業地址'] || '';
    } else {
        console.log('Record not found');
        alert('未找到匹配的資料\n（未向貿易署辦理登記出進口廠商者，若輸出貨品之離岸價格超過美金2萬元，應向貿易署申請輸出許可證）');
    }
}

function searchInFile(file, searchCode, callback) {
    Papa.parse(file, {
        download: true,
        header: true,
        complete: function(results) {
            const record = results.data.find(row => row['統一編號'] === searchCode);
            callback(record);
        }
    });
}

function searchData() {
    const searchCode = document.getElementById('SHPR_BAN_ID').value.trim(); // 確保去除前後空格
    console.log('Searching for:', searchCode);
    let found = false;

    function searchNextFile(index) {
        if (index >= csvFiles.length) {
            if (!found) {
                fillForm(null);
            }
            return;
        }
        searchInFile(csvFiles[index], searchCode, record => {
            if (record) {
                found = true;
                fillForm(record);
            } else {
                searchNextFile(index + 1);
            }
        });
    }

    searchNextFile(0);
}

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
        checkbox.addEventListener('change', updateRemark1);
    });

    // 添加事件監聽器到所有checkbox以更新相關變量
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateVariables);
    });

    // 添加鍵盤事件監聽器
    document.addEventListener('keydown', handleKeyNavigation);
    
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
    document.getElementById(id).addEventListener("input", function() {
        this.value = this.value.toUpperCase();
    });
}

// 需要轉換大寫的所有欄位 ID
const fieldIds = ["LOT_NO", "SHPR_BONDED_ID", "CNEE_COUNTRY_CODE", "TO_CODE", "DOC_CTN_UM", "DCL_DOC_TYPE", "TERMS_SALES", "CURRENCY", "DOC_UM", "ST_MTD", "ORG_COUNTRY", "ORG_IMP_DCL_NO", "BOND_NOTE", "CERT_NO", "ORG_DCL_NO", "EXP_NO", "WIDE_UM", "LENGTH_UM", "ST_UM"];

// 對每個欄位設置自動轉換為大寫的功能
fieldIds.forEach(setupUpperCaseConversion);

document.getElementById("CURRENCY").addEventListener("blur", function() {
    const validCurrencies = ["ARS", "AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "DKK", "EUR", "GBP", "HKD", "IDR", "ILS", "INR", "JPY", "KRW", "MYR", "NOK", "NZD", "PEN", "PHP", "PLN", "SEK", "SGD", "THB", "TWD", "USD", "ZAR"];
    const input = this.value.toUpperCase();
    const errorElement = document.getElementById("currency-error");

    if (!validCurrencies.includes(input)) {
        errorElement.style.display = "inline";
    } else {
        errorElement.style.display = "none";
    }
});

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
            const freight = (weight * 3 * usdRate) / currencyRate;
            const decimalPlaces = currency === "TWD" ? 0 : 2;
            document.getElementById('FRT_AMT').value = freight.toFixed(decimalPlaces);
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
            let insurance = totalAmount * 0.0011;
            const minimumInsurance = 450 / currencyRate;
            if (insurance < minimumInsurance) {
                insurance = minimumInsurance;
            }
            const decimalPlaces = currency === "TWD" ? 0 : 2;
            document.getElementById('INS_AMT').value = insurance.toFixed(decimalPlaces);
        } else {
            // 如果輸入無效，顯示錯誤訊息
            document.getElementById('INS_AMT').value = "輸入無效";
        }
    });
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
            document.getElementById('ADD_AMT').value = additionalFee.toFixed(decimalPlaces);
        } else {
            // 如果輸入無效，顯示錯誤訊息
            document.getElementById('ADD_AMT').value = "輸入無效";
        }
    });
}

// 其它申報事項備註選單
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('doc_otr_desc_dropdown');
    const textarea = document.getElementById('DOC_OTR_DESC');

    dropdown.addEventListener('change', () => {
        if (dropdown.value) {
            if (textarea.value) {
                textarea.value += '\n' + dropdown.value; // 在已有內容後添加新內容
            } else {
                textarea.value = dropdown.value; // 如果textarea是空的，直接添加內容
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
    copyItemSelect.innerHTML = '<option value="">選擇項次</option>';
    document.querySelectorAll('#item-container .item-row').forEach((item, index) => {
        const description = item.querySelector('.DESCRIPTION').value;
        copyItemSelect.innerHTML += `<option value="${index}">項次 ${index + 1} - ${description}</option>`;
    });

    // 顯示彈跳框
    const itemModal = document.getElementById('item-modal');
    itemModal.style.display = 'flex';

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
    const qty = parseFloat(document.getElementById('QTY').value) || 0;
    const unitPrice = parseFloat(document.getElementById('DOC_UNIT_P').value) || 0;
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    const amount = qty * unitPrice;
    document.getElementById('DOC_TOT_P').value = (amount === 0) ? '' : (Math.round(amount * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)).toFixed(decimalPlaces);
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
            'EXP_NO', 'EXP_SEQ_NO', 'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_QTY', 'ST_UM'
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
    const newItemData = {
        ITEM_NO: document.getElementById('ITEM_NO').checked ? '*' : '', // 根據勾選狀態設置 ITEM_NO
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
        ST_UM: document.getElementById('ST_UM').value,
    };

    // 在儲存前檢查並更新 fieldsToShow 的狀態
    checkFieldValues(newItemData);

    const item = createItemRow(newItemData);

    // 判斷輸入域目前是展開全部品名還是折疊全部品名
    const textareas = item.querySelectorAll('.DESCRIPTION');
    textareas.forEach(textarea => {
        textarea.rows = allExpanded ? 5 : 1; // 根據 allExpanded 狀態設置行數
    });

    // 應用顯示的欄位
    applyToggleFieldsToRow(item);

    itemContainer.appendChild(item);

    closeItemModal();
    renumberItems();
    applyToggleFields();

    // 自動計算新項次的金額
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    calculateAmountsForRow(item, decimalPlaces);

    // 確保在新增項次後即時更新顯示狀態
    initializeFieldVisibility(); // 這行應該保證在所有操作結束後執行
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
    const qty = parseFloat(row.querySelector('.QTY').value) || 0;
    const unitPrice = parseFloat(row.querySelector('.DOC_UNIT_P').value) || 0;
    const totalPrice = qty * unitPrice;
    const totalPriceField = row.querySelector('.DOC_TOT_P');
    
    if (totalPrice === 0) {
        totalPriceField.value = '';
    } else {
        totalPriceField.value = (Math.round(totalPrice * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)).toFixed(decimalPlaces);
    }
}

// 刪除項次
function removeItem(element) {
    const item = element.parentElement.parentElement;
    item.parentElement.removeChild(item);
    renumberItems();
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
            <span>項次 ${index + 1} - 品名: ${description}</span>
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
    sourceItemSelect.innerHTML = '<option value="">選擇項次</option>';
    document.querySelectorAll('#item-container .item-row').forEach((item, index) => {
        const description = item.querySelector('.DESCRIPTION').value;
        sourceItemSelect.innerHTML += `<option value="${index + 1}">項次 ${index + 1} - ${description}</option>`;
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

    if (mode === 'custom') {
        const itemNumbers = document.getElementById('specify-item-numbers').value;
        const fieldName = document.getElementById('specify-field-name').value;
        const fieldValue = document.getElementById('specify-field-value').value;
        const startNumber = parseInt(document.getElementById('start-number').value, 10); // 新增：起始編號
        let currentNumber = startNumber; // 新增：當前編號

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
                        fieldElement.value = `${currentNumber}`; // 新增：填入指定的編號
                        currentNumber++; // 新增：編號遞增
                    } else {
                        fieldElement.value = fieldValue;
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
                    });
                }
            });
        }
    }
    closeSpecifyFieldModal();
}

// 匯入Excel文件的功能
function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // 讀取報單表頭工作表
        const headerSheet = workbook.Sheets[workbook.SheetNames[0]];
        const headerData = XLSX.utils.sheet_to_json(headerSheet, { header: 1 });

        // 將報單表頭數據填充到表單中
        const headerFields = ['FILE_NO', 'LOT_NO', 'SHPR_BAN_ID', 'SHPR_BONDED_ID',
            'SHPR_C_NAME', 'SHPR_E_NAME', 'SHPR_C_ADDR', 'SHPR_E_ADDR', 
            'CNEE_E_NAME', 'CNEE_E_ADDR', 
            'CNEE_COUNTRY_CODE', 'CNEE_BAN_ID',
            'BUYER_E_NAME', 'BUYER_E_ADDR', 'TO_CODE', 'TO_DESC', 
            'TOT_CTN', 'DOC_CTN_UM', 'CTN_DESC', 'DCL_GW', 'DCL_NW', 
            'DCL_DOC_TYPE', 'TERMS_SALES', 'CURRENCY', 'CAL_IP_TOT_ITEM_AMT', 
            'FRT_AMT', 'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT', 
            'DOC_MARKS_DESC', 'DOC_OTR_DESC', 'REMARK1', 
            'FAC_BAN_ID_EX', 'FAC_BONDED_ID_EX', 'RESERVED_STR_1', 'RESERVED_STR_2',
            'FAC_BAN_ID', 'FAC_BONDED_ID', 'IN_BONDED_BAN', 'IN_BONDED_CODE'];
        headerFields.forEach((id, index) => {
            const element = document.getElementById(id);
            if (element) {
                let value = headerData[index] ? (headerData[index][1] || '').trim() : '';
                
                // 判斷是否為 CURRENCY 欄位
                if (id === 'CURRENCY') {
                    value = value.toUpperCase(); // 將值轉為大寫
                    if (value === 'NTD') {
                        value = 'TWD'; // 如果是 NTD，則改為 TWD
                    }
                }
        
                element.value = value;
            }
        });

        // 檢查REMARKS欄位來勾選對應選項
        headerData.forEach(row => {
            const remarksIndex = row.indexOf('REMARKS');
            if (remarksIndex !== -1) {
                const remarks = row[remarksIndex + 1];
                checkRemarkOptions(remarks);
            }
        });

        // 讀取報單項次工作表
        const itemsSheet = workbook.Sheets[workbook.SheetNames[1]];
        const itemsData = XLSX.utils.sheet_to_json(itemsSheet, { header: 1 });

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

        itemsData.slice(1).forEach((row, index) => {
            const hasItemNo = row[0]; // 判斷項次是否有數據
            const hasDescription = descriptionIndices.some(i => row[i]);

            if (hasItemNo) {
                if (currentItem) {
                    currentItem.querySelector('.DESCRIPTION').value = currentDescription.trim();
                    itemContainer.appendChild(currentItem);
                }
                const description = descriptionIndices.map(i => row[i]).filter(Boolean).join('\n');
                currentDescription = description;
                currentItem = createItemRow({
                    ITEM_NO: row[0] || '',
                    DESCRIPTION: currentDescription || '',
                    QTY: row[descriptionIndices[descriptionIndices.length - 1] + 1] || '',
                    DOC_UM: row[descriptionIndices[descriptionIndices.length - 1] + 2] || '',
                    DOC_UNIT_P: row[descriptionIndices[descriptionIndices.length - 1] + 3] || '',
                    DOC_TOT_P: row[descriptionIndices[descriptionIndices.length - 1] + 4] || '',
                    TRADE_MARK: row[descriptionIndices[descriptionIndices.length - 1] + 5] || '',
                    CCC_CODE: row[descriptionIndices[descriptionIndices.length - 1] + 6] || '',
                    ST_MTD: row[descriptionIndices[descriptionIndices.length - 1] + 7] || '',
                    NET_WT: row[descriptionIndices[descriptionIndices.length - 1] + 8] || '',
                    ORG_COUNTRY: row[descriptionIndices[descriptionIndices.length - 1] + 9] || '',
                    ORG_IMP_DCL_NO: row[descriptionIndices[descriptionIndices.length - 1] + 10] || '',
                    ORG_IMP_DCL_NO_ITEM: row[descriptionIndices[descriptionIndices.length - 1] + 11] || '',
                    SELLER_ITEM_CODE: row[descriptionIndices[descriptionIndices.length - 1] + 12] || '',
                    BOND_NOTE: row[descriptionIndices[descriptionIndices.length - 1] + 13] || '',                
                    GOODS_MODEL: row[descriptionIndices[descriptionIndices.length - 1] + 14] || '',
                    GOODS_SPEC: row[descriptionIndices[descriptionIndices.length - 1] + 15] || '',
                    CERT_NO: row[descriptionIndices[descriptionIndices.length - 1] + 16] || '',
                    CERT_NO_ITEM: row[descriptionIndices[descriptionIndices.length - 1] + 17] || '',
                    ORG_DCL_NO: row[descriptionIndices[descriptionIndices.length - 1] + 18] || '',
                    ORG_DCL_NO_ITEM: row[descriptionIndices[descriptionIndices.length - 1] + 19] || '',
                    EXP_NO: row[descriptionIndices[descriptionIndices.length - 1] + 20] || '',
                    EXP_SEQ_NO: row[descriptionIndices[descriptionIndices.length - 1] + 21] || '',
                    WIDE: row[descriptionIndices[descriptionIndices.length - 1] + 22] || '',
                    WIDE_UM: row[descriptionIndices[descriptionIndices.length - 1] + 23] || '',
                    LENGT_: row[descriptionIndices[descriptionIndices.length - 1] + 24] || '',
                    LENGTH_UM: row[descriptionIndices[descriptionIndices.length - 1] + 25] || '',
                    ST_QTY: row[descriptionIndices[descriptionIndices.length - 1] + 26] || '',
                    ST_UM: row[descriptionIndices[descriptionIndices.length - 1] + 27] || '',
                });
                if (row[1] === '*') {
                    currentItem.querySelector('.ITEM_NO').checked = true;
                }
            } else if (currentItem) {
                const element = currentItem.querySelector('.DESCRIPTION');
                if (element) {
                    descriptionIndices.forEach(i => {
                        if (row[i]) {
                            currentDescription += `\n${row[i]}`;
                        }
                    });
                }
            }
        });

        if (currentItem) {
            currentItem.querySelector('.DESCRIPTION').value = currentDescription.trim();
            itemContainer.appendChild(currentItem);
        }
        renumberItems();
    };
    reader.readAsArrayBuffer(file);
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
        ['用料清表文號', document.getElementById('RESERVED_STR_1').value],
        ['保出字號', document.getElementById('RESERVED_STR_2').value],
        ['出倉保稅倉庫統一編號', document.getElementById('FAC_BAN_ID').value],
        ['出倉保稅倉庫代碼', document.getElementById('FAC_BONDED_ID').value],
        ['進倉保稅倉庫統一編號', document.getElementById('IN_BONDED_BAN').value],
        ['進倉保稅倉庫代碼', document.getElementById('IN_BONDED_CODE').value],
    ];

    // 收集報單項次數據
    const itemsData = [
    ['項次', '大品名註記', '品名', '數量', '單位', '單價', '金額', 
    '商標', '稅則', '統計方式', '淨重', '生產國別', '原進口報單號碼', '原進口報單項次', 
    '賣方料號', '保稅貨物註記', '型號', '規格', '產證號碼', '產證項次', 
    '原進倉報單號碼', '原進倉報單項次', '輸出許可號碼', '輸出許可項次', 
    '寬度(幅寬)', '寬度單位', '長度(幅長)', '長度單位' ,'統計數量' ,'統計單位']
    ];
    document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
        itemsData.push([
            index + 1,
            item.querySelector('.ITEM_NO').checked ? '*' : '',
            item.querySelector('.DESCRIPTION').value || '',
            item.querySelector('.QTY').value || '',
            replaceValue('DOC_UM', item.querySelector('.DOC_UM').value || ''),
            item.querySelector('.DOC_UNIT_P').value || '',
            item.querySelector('.DOC_TOT_P').value || '',
            item.querySelector('.TRADE_MARK').value || '',
            replaceValue('CCC_CODE', item.querySelector('.CCC_CODE').value || ''),
            item.querySelector('.ST_MTD').value || '',
            item.querySelector('.NET_WT').value || '',
            item.querySelector('.ORG_COUNTRY').value || '',
            item.querySelector('.ORG_IMP_DCL_NO').value || '',
            item.querySelector('.ORG_IMP_DCL_NO_ITEM').value || '',
            item.querySelector('.SELLER_ITEM_CODE').value || '',
            item.querySelector('.BOND_NOTE').value || '',            
            item.querySelector('.GOODS_MODEL').value || '',
            item.querySelector('.GOODS_SPEC').value || '',
            item.querySelector('.CERT_NO').value || '',
            item.querySelector('.CERT_NO_ITEM').value || '',
            item.querySelector('.ORG_DCL_NO').value || '',
            item.querySelector('.ORG_DCL_NO_ITEM').value || '',
            item.querySelector('.EXP_NO').value || '',
            item.querySelector('.EXP_SEQ_NO').value || '',
            item.querySelector('.WIDE').value || '',
            replaceValue('WIDE_UM', item.querySelector('.WIDE_UM').value || ''),
            item.querySelector('.LENGT_').value || '',
            replaceValue('LENGTH_UM', item.querySelector('.LENGTH_UM').value || ''),
            item.querySelector('.ST_QTY').value || '',
            replaceValue('ST_UM', item.querySelector('.ST_UM').value || ''),
        ]);
    });

    // 創建工作表
    const headerWorksheet = XLSX.utils.aoa_to_sheet(headerData);
    const itemsWorksheet = XLSX.utils.aoa_to_sheet(itemsData);

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

            renumberItems(); // 重新編號所有項次
            updateRemark1FromImport(); // 更新REMARK1欄位並勾選對應的checkbox
        };
        reader.readAsText(file);
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

// 創建項次的HTML結構
function createItemRow(data) {
    const row = document.createElement('div');
    row.className = 'item-row';
    const isChecked = data.ITEM_NO === '*'; // 根據 ITEM_NO 判斷是否勾選

    // 檢查並更新需要顯示的欄位
    checkFieldValues(data);

    row.innerHTML = `
        <div class="form-group fix item-no item-no-header" onclick="toggleSelect(this)">
            <label>${itemCount + 1}</label>
        </div>
        <div class="form-group fix">
            <input type="checkbox" class="ITEM_NO" ${isChecked ? 'checked' : ''}>
        </div>
        ${createTextareaField('DESCRIPTION', data.DESCRIPTION)}
        ${createInputField('QTY', data.QTY, true)}
        ${createInputField('DOC_UM', replaceValue('DOC_UM', data.DOC_UM), true)}
        ${createInputField('DOC_UNIT_P', data.DOC_UNIT_P, true)}
        ${createInputField('DOC_TOT_P', data.DOC_TOT_P, true)}
        ${createInputField('TRADE_MARK', data.TRADE_MARK, true)}
        ${createInputField('CCC_CODE', replaceValue('CCC_CODE', data.CCC_CODE), true)}
        ${createInputField('ST_MTD', data.ST_MTD, true)}
        ${createInputField('NET_WT', data.NET_WT, true)}
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
            <button class="delete-button" onclick="removeItem(this)">Ｘ</button>
        </div>
    `;
    itemCount++;

    // 檢查
    initializeFieldVisibility();
    
    return row;
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
        
        // 判斷該欄位在所有項次中是否有值
        let hasValue = fieldsToShow[field] || false;
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
            }
        });
    });
}

// 當頁面初始化或更新時，調用 updateFieldVisibility 以確保同步顯示
document.addEventListener('DOMContentLoaded', () => {
    updateFieldVisibility();
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

// 切換所有報單項次頁面的文本域的顯示和隱藏
function toggleAllTextareas() {
    allExpanded = !allExpanded;
    const newRows = allExpanded ? 5 : 1;
    document.querySelectorAll('.declaration-item textarea').forEach(textarea => {
        textarea.rows = newRows;
    });
    // 更新按鈕文本
    document.getElementById('toggle-all-btn').textContent = allExpanded ? '折疊全部品名' : '展開全部品名';
}

// 處理 Alt+w 鍵的函數
function handleAltOKey(event) {
    if (event.altKey && (event.key === 'w' || event.key === 'W')) {
        toggleAllTextareas();
    }
}

// 全域監聽 Alt+w 鍵，表示切換所有文本域顯示和隱藏
document.addEventListener('keydown', handleAltOKey);

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
function createInputField(name, value, isVisible) {
    const visibilityClass = isVisible ? '' : 'hidden';
    const numberFields = ['QTY', 'DOC_UNIT_P', 'NET_WT', 'ORG_IMP_DCL_NO_ITEM', 'CERT_NO_ITEM', 'ORG_DCL_NO_ITEM', 'EXP_SEQ_NO', 'WIDE', 'LENGT_', 'ST_QTY'];
    const inputType = numberFields.includes(name) ? 'number' : 'text';
    const onInputAttribute = numberFields.includes(name) ? 'oninput="calculateAmount(event); validateNumberInput(event)"' : '';
    const minAttribute = numberFields.includes(name) ? 'min="0"' : '';
    const readonlyAttribute = (name === 'DOC_TOT_P') ? 'readonly' : '';
    const onFocusAttribute = 'onfocus="highlightRow(this)"';
    const onBlurAttribute = 'onblur="removeHighlight(this)"';
    const onKeyDownAttribute = 'onkeydown="handleInputKeyDown(event, this)"';

    // 格式化 ORG_IMP_DCL_NO 和 ORG_DCL_NO 的值
    if (['ORG_IMP_DCL_NO', 'ORG_DCL_NO'].includes(name) && value) {
        const trimmedValue = value.replace(/\s+/g, ''); // 移除所有空格
        if (trimmedValue.length === 12) {
            // 在第3碼之後插入兩個空格
            value = `${trimmedValue.slice(0, 2)}  ${trimmedValue.slice(2)}`;
        } else if (trimmedValue.length === 14) {
            // 直接使用去除空格後的值
            value = trimmedValue;
        }
    }

    const escapedValue = value ? escapeXml(value).trim() : ''; // 確保只有在必要時才轉義值並去除前後空格

    // 處理最大四捨五入至小數6位，並移除後面的多餘零
    const roundedValue = (['QTY', 'DOC_UNIT_P', 'NET_WT', 'WIDE', 'LENGT_', 'ST_QTY'].includes(name) && value) ? parseFloat(value).toFixed(6).replace(/\.?0+$/, '') : escapedValue;
    const inputField = `<input type="${inputType}" class="${name} ${name === 'CCC_CODE' ? 'CCC_CODE' : 'tax-code-input'}" value="${roundedValue}" ${onInputAttribute} ${minAttribute} ${readonlyAttribute} ${onFocusAttribute} ${onBlurAttribute} ${onKeyDownAttribute} style="flex: 1; margin-right: 0;">`;

    if (name === 'NET_WT') {
        return `
            <div class="form-group ${visibilityClass}" style="width: 20%; display: flex; align-items: center;">
                <input type="checkbox" class="ISCALC_WT" style="margin-left: 5px;">
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
            <div class="form-group ${visibilityClass}" style="width: 100%;">
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
}

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

// 重新編號所有項次
function renumberItems() {
    itemCount = 0;
    document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
        itemCount++;
        item.querySelector('label').textContent = `${itemCount}`; // 項次
    });
}

// 監聽數量和單價輸入框的變化事件，進行自動計算
document.querySelectorAll('.QTY, .DOC_UNIT_P').forEach(input => {
    input.addEventListener('input', calculateAmount);
});

// 定義 calculateAmount 函數
function calculateAmount(event) {
    const row = event.target.closest('.item-row');
    const qty = parseFloat(row.querySelector('.QTY').value) || 0;
    const unitPrice = parseFloat(row.querySelector('.DOC_UNIT_P').value) || 0;
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
        totalPriceField.value = (Math.round(totalPrice * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)).toFixed(decimalPlaces);
    }
}

// 計算各單位的數量總計
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

// 計算所有行的金額
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

    items.forEach(row => {
        calculateAmountsForRow(row, decimalPlaces);
    });

    // 計算各項次金額的加總
    let totalItemsAmount = Array.from(items).reduce((sum, item) => {
        const amount = parseFloat(item.querySelector('.DOC_TOT_P').value);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalDocumentAmount = parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value) || 0;
    const currency = document.getElementById('CURRENCY').value || '';

    // 顯示金額
    alert(`報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(2)}\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(2)}`);
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
    alert(`報單表頭的總淨重為：${totalNetWeight}\n各項次的淨重加總為：${totalCalculatedWeight}`);
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
        const netWeight = parseFloat(item.querySelector('.NET_WT').value);
        if (checkbox && checkbox.checked && !isNaN(netWeight)) {
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
        alert('所有項次的數量總和必須大於零');
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
        netWtElement.value = fixed.netWeight.toFixed(decimalPlaces);
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
    const adjustedTotalWeight = Array.from(items).reduce((sum, item) => {
        const netWeight = parseFloat(item.querySelector('.NET_WT').value);
        return sum + (isNaN(netWeight) ? 0 : netWeight);
    }, 0).toFixed(decimalPlaces);
    alert(`報單表頭的總淨重為：${totalNetWeight}\n各項次的淨重加總為：${adjustedTotalWeight}`);
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

// REMARK1欄位值與RESERVED_STR_1及RESERVED_STR_2同步
document.addEventListener('DOMContentLoaded', function() {
    var reservedStr1 = document.getElementById('RESERVED_STR_1');
    var reservedStr2 = document.getElementById('RESERVED_STR_2');
    var remarks = document.getElementById('REMARK1');

    function updateRemarks() {
        // 保存原有內容
        var originalContent = remarks.value.split(/用料清表文號: .*\n保出字號: .*/)[0].trim();
        var newContent = originalContent + (originalContent ? '\n' : '') + '用料清表文號: ' + reservedStr1.value + '\n保出字號: ' + reservedStr2.value;
        remarks.value = newContent;
    }

    reservedStr1.addEventListener('input', updateRemarks);
    reservedStr2.addEventListener('input', updateRemarks);
});

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
                return; // 退出函数以确保不進行後續處理
            }
        } else if (copy3.checked) {
            if (copy3_e.checked) {
                alert("申請沖退原料稅（E化退稅）\n申請報單副本第三聯（沖退原料稅用聯)\n\n請擇一選擇");
                copy3_e.checked = false;
                copy3.checked = false;
                // 清空 REMARK1 欄位的值
                remark1.value = '';
                return; // 退出函数以确保不進行後續處理
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
            const expNoValue = item.querySelector('.EXP_NO')?.value || '';
    
            // 判斷 ST_MTD 是否為 '1A', '8A', '8D'，或 EXP_NO 是否為 14 碼，或 EXP_NO 與 EXP_SEQ_NO 皆有值
            if (['1A', '8A', '8D'].includes(stMtdValue) || expNoValue.length === 14 || (expNoValue && expSeqNoValue)) {
                shouldSetExamType = true;
            }
        });
    
        if (shouldSetExamType) {
            examType.value = '8';
        }
        
        // 用於顯示變數值的控制台日誌
        console.log("APP_DUTY_REFUND: " + appDutyRefund.value);
        console.log("MARK_TOT_LINES: " + markTotLines.value);
        console.log("EXAM_TYPE: " + examType.value);
        console.log("COPY_QTY: " + copyQty.value);
    }
    
    function exportToXML() {
        updateVariables(); // 在匯出XML之前更新變數

        const headerFields = [
            'LOT_NO', 'SHPR_BAN_ID', 'SHPR_BONDED_ID', 
            'SHPR_C_NAME', 'SHPR_E_NAME', 'SHPR_C_ADDR', 'SHPR_E_ADDR', 
            'CNEE_E_NAME', 'CNEE_E_ADDR', 
            'CNEE_COUNTRY_CODE', 'CNEE_BAN_ID',
            'BUYER_E_NAME', 'BUYER_E_ADDR', 'TO_CODE', 'TO_DESC', 
            'TOT_CTN', 'DOC_CTN_UM', 'CTN_DESC', 'DCL_GW', 'DCL_NW', 
            'DCL_DOC_TYPE', 'TERMS_SALES', 'CURRENCY', 'CAL_IP_TOT_ITEM_AMT', 
            'FRT_AMT', 'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT', 
            'DOC_MARKS_DESC', 'DOC_OTR_DESC', 'REMARK1', 
            'FAC_BAN_ID_EX', 'FAC_BONDED_ID_EX', 'RESERVED_STR_1', 'RESERVED_STR_2',
            'FAC_BAN_ID', 'FAC_BONDED_ID', 'IN_BONDED_BAN', 'IN_BONDED_CODE',
            'APP_DUTY_REFUND', 'MARK_TOT_LINES', 'EXAM_TYPE', 'COPY_QTY',
        ];

        // 將 PROC_NO 的值固定設置為 'X8CS'
        let procNo = 'X8CS';

        const itemFields = [
            'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P',
            'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'ISCALC_WT', 'NET_WT', 'ORG_COUNTRY', 
            'ORG_IMP_DCL_NO', 'ORG_IMP_DCL_NO_ITEM', 'SELLER_ITEM_CODE', 'BOND_NOTE',
            'GOODS_MODEL', 'GOODS_SPEC', 'CERT_NO', 'CERT_NO_ITEM', 
            'ORG_DCL_NO', 'ORG_DCL_NO_ITEM', 'EXP_NO', 'EXP_SEQ_NO', 
            'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_QTY' ,'ST_UM',
        ];
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<Root>\n  <sys_code>GICCDS</sys_code>\n<head>\n  <head_table_name>DOC_HEAD</head_table_name>\n';
        
        // 添加 PROC_NO
        xmlContent += `  <fields>\n    <field_name>PROC_NO</field_name>\n    <field_value>${procNo}</field_value>\n  </fields>\n`;

        headerFields.forEach(id => {
            let element = document.getElementById(id);
            if (element) {
                let value = escapeXml(element.value);

                // 過濾非可見字符
                value = value.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF\uFFF9-\uFFFB]/g, '').trim();

                // 對 CURRENCY 欄位進行特殊處理
                if (id === 'CURRENCY') {
                    value = value.toUpperCase(); // 將值轉為大寫
                    if (value === 'NTD') {
                        value = 'TWD'; // 如果是 NTD，則改為 TWD
                    }
                }
                
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
                    value = item.querySelector(`.${className}`).checked ? 'V' : '';
                } else {
                    value = escapeXml(item.querySelector(`.${className}`).value);
                    
                    // 替換單位及稅則
                    value = replaceValue(className, value);
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

// 出口報單預覽
async function exportToPDF() {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block'; // 顯示提示訊息

    try {
        const { jsPDF } = window.jspdf;

        // 創建新的 jsPDF 實例
        const doc = new jsPDF();

        // 加載字體
        const fontBytes = await fetch('NotoSansTC-Regular.ttf').then(res => res.arrayBuffer());
        const fontBase64 = arrayBufferToBase64(fontBytes);
        doc.addFileToVFS("NotoSansTC-Regular.ttf", fontBase64);
        doc.addFont("NotoSansTC-Regular.ttf", "NotoSansTC", "normal");
        doc.setFont("NotoSansTC");

        // 設置字體顏色
        doc.setTextColor(0, 0, 0); // 黑色

        // 加載模板 PDF
        const templateHomeBytes = await fetch('Template_Home.pdf').then(res => res.arrayBuffer());
        const templateContinuationBytes = await fetch('Template_Continuation.pdf').then(res => res.arrayBuffer());

        const templateHome = await pdfjsLib.getDocument({ data: templateHomeBytes }).promise;
        const templateContinuation = await pdfjsLib.getDocument({ data: templateContinuationBytes }).promise;

        // 獲取並渲染模板頁面
        async function renderTemplate(doc, templatePdf, pageNum, scale = 4.0) {
            const page = await templatePdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;

            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = doc.internal.pageSize.getHeight();
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        // 渲染第一頁模板
        await renderTemplate(doc, templateHome, 1);

        // 獲取報單類別的值和文本
        const dclDocTypeElement = document.getElementById('DCL_DOC_TYPE');
        const dclDocTypeValue = dclDocTypeElement.value;
        const optionElement = dclDocTypeElement.list.querySelector(`option[value="${dclDocTypeValue}"]`);
        const dclDocTypeText = optionElement ? optionElement.text : '';

        // 獲取並格式化數字值
        const calIpTotItemAmt = formatNumberValue('CAL_IP_TOT_ITEM_AMT');
        const frtAmt = formatNumberValue('FRT_AMT');
        const insAmt = formatNumberValue('INS_AMT');
        const addAmt = formatNumberValue('ADD_AMT');
        const subtractAmt = formatNumberValue('SUBTRACT_AMT');

        function formatNumberValue(elementId) {
            const value = document.getElementById(elementId).value;
            return value ? parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'NIL';
        }

        // 獲取匯率數據
        const exchangeRates = await fetchExchangeRates();
        if (!exchangeRates) {
            throw new Error('無法獲取匯率數據');
        }

        // 獲取 CURRENCY 的值並查找對應的匯率
        const currency = document.getElementById('CURRENCY').value;
        const exchangeRateItem = exchangeRates.items.find(item => item.code === currency);
        const exchangeRate = exchangeRateItem ? exchangeRateItem.buyValue : 'NIL';

        // 檢查數值是否為 NIL
        const formattedFrtAmt = frtAmt !== 'NIL' ? frtAmt : 'NIL';
        const formattedInsAmt = insAmt !== 'NIL' ? insAmt : 'NIL';
        const formattedAddAmt = addAmt !== 'NIL' ? addAmt : 'NIL';
        const formattedSubtractAmt = subtractAmt !== 'NIL' ? subtractAmt : 'NIL';

        // 計算右對齊的 x 位置，考慮到文本內容的寬度
        const calculateRightAlignedX = (value, minWidth, maxWidth) => {
            const textWidth = doc.getTextWidth(value);
            const calculatedWidth = Math.max(textWidth, minWidth);
            if (value === 'NIL') {
                return maxWidth - calculatedWidth - 2; // 如果是NIL，返回 maxWidh - calculatedWidth - 2
            } else if (value === calIpTotItemAmt) {
                return maxWidth - calculatedWidth + 3; // 如果是 calIpTotItemAmt，返回 maxWidh - calculatedWidth + 3
            } else {
                return maxWidth - calculatedWidth;
            }
        };

        // 添加二維條碼
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, 'CX  13696', { format: 'CODE128' });
        const barcodeImgData = barcodeCanvas.toDataURL('image/png');
        doc.addImage(barcodeImgData, 'PNG', 118, 12, 20, 10); // 調整位置和大小

        // 獲取今天的日期
        var today = new Date();
        var day = String(today.getDate()).padStart(2, '0');
        var month = String(today.getMonth() + 1).padStart(2, '0'); // 因為 getMonth() 返回的月份是從 0 開始的
        var year = today.getFullYear();

        // 報單號碼格式
        var yearPart = year - 2011;
        var OrderNumber = 'CX/  /' + yearPart + '/696/';

        // 報關日期為 "YYY/MM/DD"
        var CustomsDeclarationDate = year - 1911 + '/' + month + '/' + day;

        // 拆分 TO_DESC 為多行，每行最多寬度40
        const toDescElement = document.getElementById('TO_DESC');
        const toDescText = toDescElement.value;
        const toDescLines = doc.splitTextToSize(toDescText, 40)
        
        // 設置表頭欄位與位置
        const headerData = [
            { value: `空運`, x: 75, y: 10 },
            { value: OrderNumber, x: 75, y: 18.5 },
            { value: CustomsDeclarationDate, x: 62, y: 35 }, // 將日期設置為當天日期
            { value: `TWTPE`, x: 30, y: 40.5 },
            { value: `TAOYUAN`, x: 24, y: 44 },
            { value: `AIRPORT`, x: 24, y: 48 },
            { value: `42`, x: 136, y: 44 },
            { value: `台灣順豐速運`, x: 148, y: 271 },
            { value: `股份有限公司`, x: 148, y: 276 },
            { value: `696`, x: 148, y: 281 },
            { value: `紀書琴`, x: 188, y: 271 },
            { value: `00718`, x: 188, y: 276 },
            { value: `C2051 遠雄第四快遞貨棧`, x: 30, y: 53.5 },
            { value: `${dclDocTypeValue}${dclDocTypeText}`, x: 103, y: 10 },
            { value: currency, x: 171, y: 29 },
            { value: calIpTotItemAmt, x: calculateRightAlignedX(calIpTotItemAmt, 0, 210), y: 29 },
            { value: formattedFrtAmt, x: calculateRightAlignedX(formattedFrtAmt, 0, 210), y: 36 },
            { value: formattedInsAmt, x: calculateRightAlignedX(formattedInsAmt, 0, 210), y: 43 },
            { value: formattedAddAmt, x: calculateRightAlignedX(formattedAddAmt, 0, 210), y: 49 },
            { value: formattedSubtractAmt, x: calculateRightAlignedX(formattedSubtractAmt, 0, 210), y: 54 },
            { value: formattedFrtAmt !== 'NIL' ? currency : '', x: 171, y: 36 },
            { value: formattedInsAmt !== 'NIL' ? currency : '', x: 171, y: 43 },
            { value: formattedAddAmt !== 'NIL' ? currency : '', x: 171, y: 49 },
            { value: formattedSubtractAmt !== 'NIL' ? currency : '', x: 171, y: 54 },
            { value: document.getElementById('TO_CODE').value, x: 69.5, y: 40.5 },
            { value: toDescLines.join('\n'), x: 61, y: 44 },
            { value: document.getElementById('SHPR_BAN_ID').value, x: 30, y: 60 },
            { value: document.getElementById('SHPR_BONDED_ID').value, x: 94, y: 60 },
            { value: document.getElementById('SHPR_C_NAME').value, x: 30, y: 66.5 },
            { value: document.getElementById('SHPR_E_NAME').value, x: 30, y: 71.5 },
            { value: document.getElementById('SHPR_C_ADDR').value, x: 30, y: 76.5 },
            { value: document.getElementById('CNEE_E_NAME').value, x: 30, y: 87 },
            { value: document.getElementById('CNEE_COUNTRY_CODE').value, x: 30, y: 100.5 },
            { value: document.getElementById('CNEE_BAN_ID').value, x: 63, y: 100.5 },
            { value: document.getElementById('TERMS_SALES').value, x: 165, y: 100.5 },
            { value: document.getElementById('TOT_CTN').value, x: 43, y: 201.5 },
            { value: document.getElementById('DOC_CTN_UM').value, x: 50, y: 201.5 },
            { value: document.getElementById('CTN_DESC').value, x: 85, y: 201.5 },
            { value: document.getElementById('DCL_GW').value, x: 190, y: 201.5 },
            { value: document.getElementById('DOC_MARKS_DESC').value, x: 8, y: 211 },
            { value: document.getElementById('DOC_OTR_DESC').value, x: 7, y: 260 },
            { value: exchangeRate, x: 192, y: 100.5 } // 添加匯率
        ];

        // 自動換行的收件人地址處理
        const cneeEAddrElement = document.getElementById('CNEE_E_ADDR');
        const cneeEAddrText = cneeEAddrElement.value;

        // 將地址限制在特定寬度內並自動換行
        const maxWidth = 280; // 最大寬度
        const cneeEAddrLines = doc.splitTextToSize(cneeEAddrText, maxWidth);

        // 使用現有的 startY 和 lineHeight 變數
        let cneeAddressY = 91; // 使用不同名稱的變數來避免衝突
        const cneeLineHeight = 4; // 使用不同名稱的變數來避免衝突

        // 確保字體大小與前面一致
        doc.setFontSize(10); // 設置與其他部分相同的字體大小

        // 繪製地址，每行一段
        cneeEAddrLines.forEach(line => {
            doc.text(line, 30, cneeAddressY);
            cneeAddressY += cneeLineHeight;
        });
        
        // 設置表頭字體大小並添加文本
        doc.setFontSize(10);
        headerData.forEach(row => {
            const value = row.value;
            doc.text(value, row.x, row.y);
        });
        
        // 在 PDF 上指定位置顯示 "Y" 或 "N"，根據 copy_3_e 和 copy_3 checkbox 狀態
        if (document.getElementById('copy_3_e').checked || document.getElementById('copy_3').checked) {
            doc.text('Y', 106, 44);
        } else {
            doc.text('N', 106, 44);
        }

        // 檢查統計方式及輸出許可號碼欄位，決定是否更新 EXAM_TYPE 為 '8'
        let shouldSetExamType = false;
        document.querySelectorAll("#item-container .item-row").forEach((item) => {
            const stMtdValue = item.querySelector('.ST_MTD')?.value.toUpperCase() || '';
            const expNoValue = item.querySelector('.EXP_NO')?.value || '';
            const expSeqNoValue = item.querySelector('.EXP_SEQ_NO')?.value || '';

            // 判斷 ST_MTD 是否為 '1A', '8A', '8D'，或 EXP_NO 是否為 14 碼，或 EXP_NO 與 EXP_SEQ_NO 皆有值
            if (['1A', '8A', '8D'].includes(stMtdValue) || expNoValue.length === 14 || (expNoValue && expSeqNoValue)) {
                shouldSetExamType = true;
            }
        });

        // 檢查 copy_3, copy_4, copy_5 的 checkbox 狀態，決定是否更新 EXAM_TYPE 為 '8'
        if (document.getElementById('copy_3').checked || document.getElementById('copy_4').checked || document.getElementById('copy_5').checked) {
            shouldSetExamType = true;
        }

        // 如果需要顯示 "8"，顯示在指定位置
        if (shouldSetExamType) {
            document.getElementById('EXAM_TYPE').value = '8';
            doc.text('8', 199, 248); // 這裡設置顯示 "8" 的 X 和 Y 坐標
        }

        // 添加項次資料
        const itemsData = [];
        document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
            itemsData.push({
                index: item.querySelector('.ITEM_NO')?.checked ? '*' : index + 1,  // 如果選中則顯示'*'，否則顯示編號
                tradeMark: item.querySelector('.TRADE_MARK')?.value || '', // 商標
                expNo: item.querySelector('.EXP_NO')?.value || '', // 輸出許可號碼
                expSeqNo: item.querySelector('.EXP_SEQ_NO')?.value || '', // 輸出許可項次
                currency: document.getElementById('CURRENCY')?.value || '', // 確保獲取正確的幣別值
                netWt: parseFloat(item.querySelector('.NET_WT')?.value) || 0, // 淨重
                description: item.querySelector('.DESCRIPTION')?.value || '', // 品名
                statQty: parseFloat(item.querySelector('.ST_QTY')?.value) || 0, // 統計數量
                statUnit: item.querySelector('.ST_UM')?.value || '', // 統計單位
                origImpDclNo: item.querySelector('.ORG_IMP_DCL_NO')?.value || '', // 原進口報單號碼
                origImpDclNoItem: item.querySelector('.ORG_IMP_DCL_NO_ITEM')?.value || '', // 原進口報單項次
                certNo: item.querySelector('.CERT_NO')?.value || '', // 產證號碼
                certNoItem: item.querySelector('.CERT_NO_ITEM')?.value || '', // 產證項次
                origDclNo: item.querySelector('.ORG_DCL_NO')?.value || '', // 原進倉報單號碼
                origDclNoItem: item.querySelector('.ORG_DCL_NO_ITEM')?.value || '', // 原進倉報單項次
                sellerItemCode: item.querySelector('.SELLER_ITEM_CODE')?.value || '', // 賣方料號
                goodsModel: item.querySelector('.GOODS_MODEL')?.value || '', // 型號
                goodsSpec: item.querySelector('.GOODS_SPEC')?.value || '', // 規格
                bondNote: item.querySelector('.BOND_NOTE')?.value || '', // 保稅貨物註記
                values: [
                    { value: item.querySelector('.CCC_CODE')?.value || '', x: 89 },
                    { value: item.querySelector('.DOC_UNIT_P')?.value || '', x: 130 },
                    { value: (item.querySelector('.QTY')?.value || '') + ' ' + (item.querySelector('.DOC_UM')?.value || ''), x: 160 },
                    { value: item.querySelector('.ST_MTD')?.value || '', x: 200 },
                ],
                qty: parseFloat(item.querySelector('.QTY')?.value) || 0, // 數量
                unit: item.querySelector('.DOC_UM')?.value || '', // 單位
                itemAmt: parseFloat(item.querySelector('.ITEM_AMT')?.value) || 0 // 金額
            });
        });


        // 計算加總值，根據單位分組
        const totalNetWt = itemsData.reduce((sum, item) => sum + item.netWt, 0);
        const totalAmt = itemsData.reduce((sum, item) => sum + item.itemAmt, 0);

        const totalQtyMap = itemsData.reduce((acc, item) => {
            if (item.unit) {
                if (!acc[item.unit]) {
                    acc[item.unit] = 0;
                }
                acc[item.unit] += item.qty;
            }
            return acc;
        }, {});

        const totalStatQtyMap = itemsData.reduce((acc, item) => {
            if (item.statUnit) {
                if (!acc[item.statUnit]) {
                    acc[item.statUnit] = 0;
                }
                acc[item.statUnit] += item.statQty;
            }
            return acc;
        }, {});

        // 添加項次資料到 PDF
        let startY = 130;  // 設置初始的 Y 坐標
        const maxYHome = 190;  // 首頁的頁面底部的 Y 坐標
        const maxYContinuation = 280;  // 續頁的頁面底部的 Y 坐標
        const lineHeight = 4;  // 每行的高度
        const tradeMarkLineSpacing = 4; // 商標換行時的間距

        let itemCounter = 1; // 用於標記項次編號
        let lastY = startY; // 用於保存最後一個項次的位置

        function addUnderlinedText(doc, text, x, y, lineHeight) {
            doc.text(text, x, y);
            const textWidth = doc.getTextWidth(text);
            doc.line(x, y + 1, x + textWidth, y + 1); // 添加底線，+1 是為了讓底線在文字下方
        }

        // 計算總頁數
        let totalPages = 1;
        let currentMaxY = maxYHome;
        for (const item of itemsData) {
            const itemDescriptionLines = doc.splitTextToSize(item.description, 150).length;
            const itemLinesNeeded = item.index === '*' ? itemDescriptionLines + 2 : itemDescriptionLines + 1;
            if (startY + lineHeight * itemLinesNeeded > currentMaxY) {
                totalPages++;
                currentMaxY = maxYContinuation;
                startY = 63;
            }
            startY += lineHeight * itemLinesNeeded;
        }

        startY = 130;  // 重置初始的 Y 坐標
        currentMaxY = maxYHome;

        function addPageNumber(doc, currentPage, totalPages, isHomePage) {
            doc.setFontSize(10);
            if (isHomePage) {
                doc.text(`${currentPage}`, 186, 10); // 首頁頁碼位置
                doc.text(`${totalPages}`, 198, 10); // 首頁總頁數位置
            } else {
                doc.text(`${currentPage}`, 184, 12); // 續頁頁碼位置
                doc.text(`${totalPages}`, 198, 12); // 續頁總頁數位置
            }
        }

        for (const item of itemsData) {
            const itemDescriptionLines = doc.splitTextToSize(item.description, 150).length;
            const itemLinesNeeded = item.index === '*' ? itemDescriptionLines + 2 : itemDescriptionLines + 1;

            if (startY + lineHeight * itemLinesNeeded > currentMaxY) {
                doc.addPage();  // 換頁
                await renderTemplate(doc, templateContinuation, 1); // 渲染新頁面的模板
                startY = 63;  // 新頁面的起始 Y 坐標
                currentMaxY = maxYContinuation; // 更新續頁的頁面底部 Y 坐標

                // 在新頁面右上角添加頁碼
                const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
                addPageNumber(doc, currentPage, totalPages);
            }

            // 在首頁右上角添加頁碼
            if (doc.internal.getCurrentPageInfo().pageNumber === 1) {
                const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
                addPageNumber(doc, currentPage, totalPages);
            }

            // 顯示項次編號
            doc.text(`${item.index === '*' ? '*' : itemCounter}`, 7, startY); // 顯示項次編號

            // 顯示商標
            const tradeMarkLines = doc.splitTextToSize(item.tradeMark, 30); // 將商標文本拆分為多行，每行最多寬度30
            let tradeMarkY = startY;
            const tradeMarkX = 61;
            tradeMarkLines.forEach(line => {
                const textWidth = doc.getTextWidth(line); // 取得文本寬度
                const x = tradeMarkX + (20 - textWidth); // 計算右對齊的 x 位置
                doc.text(line, x, tradeMarkY);
                tradeMarkY += tradeMarkLineSpacing;
            });

            if (item.index !== '*') {
                // 顯示輸出許可號碼和輸出許可項次，居中對齊
                const expNoX = 102;
                const combinedText = item.expNo ? `${item.expNo}-${item.expSeqNo}` : 'NIL';
                const combinedTextWidth = doc.getTextWidth(combinedText);
                const startX = expNoX - combinedTextWidth / 2;
                doc.text(combinedText, startX, startY);
        
                // 顯示幣別
                const currencyX = 131;
                doc.text(item.currency, currencyX, startY);
        
                // 顯示淨重，靠右對齊
                const netWtX = 172.5;
                const netWtWidth = doc.getTextWidth(`${item.netWt} KGM`);
                doc.text(`${item.netWt} KGM`, netWtX - netWtWidth, startY);
            }

            startY = tradeMarkY;

            // 顯示稅則、單價、數量、統計方式
            const taxX = 102;
            const unitPriceX = 134;
            const qtyX = 172.5;
            const statMethodX = 200;

            // 稅則居中對齊
            const taxWidth = doc.getTextWidth(item.values[0].value);
            const taxStartX = taxX - taxWidth / 2;
            doc.text(item.values[0].value, taxStartX, startY);
            
            // 單價居中對齊
            const unitPriceWidth = doc.getTextWidth(item.values[1].value);
            const unitPriceStartX = unitPriceX - unitPriceWidth / 2;
            doc.text(item.values[1].value, unitPriceStartX, startY);

            // 數量靠右對齊
            const qtyWidth = doc.getTextWidth(item.values[2].value);
            doc.text(item.values[2].value, qtyX - qtyWidth, startY);

            // 統計方式顯示
            doc.text(item.values[3].value, statMethodX, startY);

            // 顯示統計數量及統計單位在數量的下方
            const statQtyX = 172.5;
            const statQty = item.statQty || ''; // 統計數量
            const statUnit = item.statUnit || ''; // 統計單位
            const combinedStatText = statQty ? `(${statQty} ${statUnit})` : '' ;
            const combinedStatTextWidth = doc.getTextWidth(combinedStatText);

            // 統計數量和統計單位一起顯示，靠右對齊
            doc.text(combinedStatText, statQtyX - combinedStatTextWidth, startY + lineHeight);

            // 顯示保稅貨物註記
            const bondNoteText = item.bondNote ? item.bondNote : '';
            const bondNoteWidth = doc.getTextWidth(bondNoteText);
            const bondNoteX = 102 - bondNoteWidth / 2;
            doc.text(bondNoteText, bondNoteX, startY + lineHeight);
            
            // 顯示前置描述和品名
            const descriptionText = [];
            if (item.sellerItemCode) descriptionText.push(`S/N:${item.sellerItemCode}`);
            if (item.goodsModel) descriptionText.push(`MODEL:${item.goodsModel}`);
            if (item.goodsSpec) descriptionText.push(`SPEC:${item.goodsSpec}`);
            descriptionText.push(item.description); // 添加品名描述

            if (item.index === '*') {
                const combinedDescription = descriptionText.join('\n');
                const descriptionLines = doc.splitTextToSize(combinedDescription, 68);
                descriptionLines.forEach(line => {
                    addUnderlinedText(doc, line, 14, startY, lineHeight);
                    startY += lineHeight;
                });
            } else {
                const combinedDescription = descriptionText.join('\n');
                const descriptionLines = doc.splitTextToSize(combinedDescription, 68);
                descriptionLines.forEach(line => {
                    doc.text(line, 14, startY);
                    startY += lineHeight;
                });
                itemCounter++; // 增加項次計數器
            }

            // 顯示原進口報單號碼、原進口報單項次、產證號碼、產證項次、原進倉報單號碼、原進倉報單項次
            const fieldsToShow = [
                { name: '原進口報單號碼', value: item.origImpDclNo, itemValue: item.origImpDclNoItem },
                { name: '產證號碼', value: item.certNo, itemValue: item.certNoItem },
                { name: '原進倉報單號碼', value: item.origDclNo, itemValue: item.origDclNoItem }
            ];

            fieldsToShow.forEach(field => {
                if (field.value) {
                    const fieldText = field.itemValue ? `${field.name}: ${field.value} 項次 ${field.itemValue}` : `${field.name}${field.value}`;
                    doc.text(fieldText, 14, startY);
                    startY += lineHeight;
                }
            });
            
            startY += lineHeight;
            lastY = startY; // 更新最後一個項次的位置
        }

        // 在最後一頁的最後一行位置顯示加總，靠右對齊距離右邊38px
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginRight = 38;
        let yPosition = lastY + 4;

        // 檢查加總部分是否會超過首頁的頁面底部的 Y 坐標
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        if (currentPage === 1 && yPosition > maxYHome) {
            doc.addPage();
            await renderTemplate(doc, templateContinuation, 1);
            yPosition = 63; // 續頁的起始 Y 坐標
        } else if (yPosition > maxYContinuation) {
            doc.addPage();
            await renderTemplate(doc, templateContinuation, 1);
            yPosition = 63; // 續頁的起始 Y 坐標
        }

        // 添加分隔線
        const separator = '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -';
        const separatorWidth = doc.getTextWidth(separator);
        doc.text(separator, pageWidth - separatorWidth - 6, yPosition);

        const totalData = [
            { label: '', value: totalNetWt > 0 ? totalNetWt.toFixed(2) + ' KGM' : '', y: yPosition },
        ];

        Object.entries(totalQtyMap).forEach(([unit, qty], index) => {
            if (qty > 0) {
                totalData.push({
                    label: '',
                    value: qty.toFixed(2) + ' ' + unit,
                    y: yPosition
                });
                yPosition += 4;
            }
        });

        Object.entries(totalStatQtyMap).forEach(([unit, qty], index) => {
            if (qty > 0) {
                totalData.push({
                    label: '',
                    value: `(${qty.toFixed(2)} ${unit})`,
                    y: yPosition
                });
                yPosition += 4;
            }
        });

        if (totalAmt > 0) {
            totalData.push({
                label: '',
                value: totalAmt.toFixed(2),
                y: yPosition
            });
            yPosition += 4;
        }

        // 更新 yPosition 為新頁面的起始座標
        totalData.forEach(row => {
            if (row.value) {
                const text = row.label + row.value;
                const textWidth = doc.getTextWidth(text);
                doc.text(text, pageWidth - textWidth - marginRight, yPosition);
                yPosition += 4;
            }
        });

        // 根據 totalStatQtyMap 顯示情況動態調整 'VVVVVVVVVVVVVVVVVVVVV' 的位置
        const vvvY = yPosition;
        const vvvText = 'VVVVVVVVVVVVVVVVVVVVV';
        const vvvTextWidth = doc.getTextWidth(vvvText);
        doc.text(vvvText, pageWidth - vvvTextWidth - marginRight, vvvY);

        // 保存 PDF，文件名為 FILE_NO 的值
        const fileName = document.getElementById('FILE_NO').value || 'export';
        const exporterName = document.getElementById('SHPR_C_NAME').value || 'exporter';
        doc.save(`${fileName}-${exporterName}.pdf`);
    } catch (error) {
        console.error("生成PDF時出現錯誤：", error);
    } finally {
        loadingMessage.style.display = 'none'; // 隱藏提示訊息
    }
}

// 將 ArrayBuffer 轉換為 Base64 編碼的函數
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// 為輸出PDF按鈕添加事件監聽器
document.getElementById('export-to-pdf').addEventListener('click', exportToPDF);

// 處理 CCC_CODE 欄位按 Enter 鍵的功能
function handleCCCCodeEnter(event, inputElement) {
    if (event.key === 'Enter') {
        event.preventDefault();
        openTaxModal(inputElement); // 打開彈跳框
        searchTariff(inputElement, true); // 查詢稅則數據
    }
}

// 讀取稅則數據
fetch('./tax_data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Tax data loaded successfully:", data); // 調試代碼
        window.taxData = data;
    })
    .catch(error => console.error('Error loading tax data:', error));

function searchTariff(inputElement, isModal = false) {
    let keyword = inputElement.value.toLowerCase();
    keyword = keyword.replace(/[.\-]/g, ''); // 移除 '.' 和 '-' 符號
    const resultsDiv = isModal ? document.getElementById('modal-results') : document.getElementById('results');
    resultsDiv.innerHTML = '';

    // 加入提示訊息
    const hint = document.createElement('p');
    hint.textContent = '【可使用上下鍵移動並按Enter選取或點選稅則，按Esc取消】';
    hint.style.fontWeight = 'bold';
    hint.style.color = '#0000b7'; // 自定義提示訊息顏色
    resultsDiv.appendChild(hint);

    const results = window.taxData.filter(item => {
        const cleanedItemCode = item['貨品分類號列'].toString().toLowerCase().replace(/[.\-]/g, '');
        return cleanedItemCode.startsWith(keyword) ||
            (item['中文貨名'] && item['中文貨名'].toLowerCase().includes(keyword)) ||
            (item['英文貨名'] && item['英文貨名'].toLowerCase().includes(keyword)) ||
            (item['統計數量單位'] && item['統計數量單位'].toLowerCase().includes(keyword)) ||
            (item['稽徵規定'] && item['稽徵規定'].toLowerCase().includes(keyword)) ||
            (item['輸入規定'] && item['輸入規定'].toLowerCase().includes(keyword)) ||
            (item['輸出規定'] && item['輸出規定'].toLowerCase().includes(keyword));
    });

    if (results.length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // 設置表格樣式
        table.style.width = '100%';
        table.style.tableLayout = 'fixed'; // 固定表格布局，讓列寬平均分配
        
        // 建立表頭
        const headerRow = document.createElement('tr');
        const headers = [
            '貨品分類號列', '中文貨名', '英文貨名',
            '統計數量單位', '稽徵規定', '輸入規定', '輸出規定'
        ];
        headers.forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.whiteSpace = 'normal'; // 允許換行
            th.style.wordWrap = 'break-word'; // 在單詞內部換行
            th.style.wordBreak = 'break-all'; // 強制換行

            if (header === '貨品分類號列') {
                th.style.width = '30%';
            } else if (header === '中文貨名' || header === '英文貨名') {
                th.style.width = '45%'; // 平均分配 "中文貨名" 和 "英文貨名" 的寬度
            } else if (header === '統計數量單位' || header === '稽徵規定' || header === '輸入規定' || header === '輸出規定') {
                th.style.width = '10%'; // 將這些列設置為較小的寬度
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 填充表格數據
        results.forEach((item, index) => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header] ? item[header] : '';
                td.style.whiteSpace = 'normal'; // 允許換行
                td.style.wordWrap = 'break-word'; // 在單詞內部換行
                td.style.wordBreak = 'break-all'; // 強制換行

                if (header === '貨品分類號列') {
                    td.classList.add('clickable'); // 添加可點擊的 class
                    td.addEventListener('click', function() {
                        const formattedCode = formatCode(item['貨品分類號列'].toString());
                        inputElement.value = formattedCode; // 填入關鍵字欄位
                        closeTaxModal();
                        inputElement.focus(); // 選中項目後焦點返回輸入框
                        searchTariff(inputElement);
                    });
                }
                row.appendChild(td);
            });
            row.dataset.index = index;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        resultsDiv.appendChild(table);

        // 滾動到彈跳框內的最上方
        resultsDiv.scrollTop = 0;

        // 預設選中第一個結果項
        let selectedIndex = 0;
        updateSelection(tbody, selectedIndex);

        // 讓稅則列表獲得焦點並監聽鍵盤事件
        tbody.setAttribute('tabindex', '0'); // 使 tbody 可被聚焦
        tbody.focus(); // 自動聚焦到稅則列表

        tbody.addEventListener('keydown', function(event) {
            const rows = tbody.querySelectorAll('tr');
            if (event.key === 'ArrowDown') {
                selectedIndex = (selectedIndex + 1) % rows.length;
                updateSelection(tbody, selectedIndex);
                rows[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); // 滾動到選中項目
                event.preventDefault();
            } else if (event.key === 'ArrowUp') {
                selectedIndex = (selectedIndex - 1 + rows.length) % rows.length;
                updateSelection(tbody, selectedIndex);
                rows[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); // 滾動到選中項目
                event.preventDefault();
            } else if (event.key === 'Enter') {
                rows[selectedIndex].querySelector('.clickable').click();
                event.preventDefault();
                closeTaxModal();
                inputElement.focus(); // 當按下 Enter 後焦點返回輸入框
            }
        });

    } else {
        resultsDiv.innerHTML = '<br><p>未找到相關稅則。</p>'; // 添加空行
    }
}

function updateSelection(tbody, index) {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => row.classList.remove('selected')); // 移除所有高亮
    if (rows[index]) {
        rows[index].classList.add('selected'); // 高亮當前選中的行
    }
}

function formatCode(code) {
    // 格式化
    return `${code.slice(0, 4)}.${code.slice(4, 6)}.${code.slice(6, 8)}.${code.slice(8, 10)}-${code.slice(10)}`;
}

function openTaxModal(inputElement) {
    const modal = document.getElementById('taxmodal');
    modal.style.display = 'block';

    // 監聽 ESC 鍵來關閉彈跳框
    const handleEscKey = function(event) {
        if (event.key === 'Escape') {
            closeTaxModal();
            inputElement.focus(); // 在關閉彈跳框後將焦點返回輸入框
        }
    };

    document.addEventListener('keydown', handleEscKey);

    // 保存 handleEscKey 引用，以便稍後移除事件監聽器
    modal.handleEscKey = handleEscKey;

    // 保存當前的輸入框元素
    modal.currentInputElement = inputElement;

    // 自動聚焦到搜尋結果列表
    setTimeout(() => {
        const tbody = document.querySelector('#modal-results table tbody');
        if (tbody) tbody.focus();
    }, 100); // 延遲一小段時間確保結果列表生成後再聚焦
}

function closeTaxModal() {
    const modal = document.getElementById('taxmodal');
    modal.style.display = 'none';

    // 移除 ESC 鍵的監聽
    if (modal.handleEscKey) {
        document.removeEventListener('keydown', modal.handleEscKey);
        delete modal.handleEscKey;
    }

    // 在關閉彈跳框後，將焦點返回到原輸入框
    if (modal.currentInputElement) {
        modal.currentInputElement.focus();
    }
}

function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeTaxModal();
    }
}

document.querySelector('.close').addEventListener('click', closeTaxModal);

window.addEventListener('click', function(event) {
    const modal = document.getElementById('taxmodal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// 初始化 CCC_CODE 輸入框
function initializeCCCCodeInputs() {
    const inputs = document.querySelectorAll('.CCC_CODE, .tax-code-input');
    inputs.forEach(input => {
        input.addEventListener('keydown', (event) => handleCCCCodeEnter(event, input));
    });
}

document.addEventListener('DOMContentLoaded', initializeCCCCodeInputs);
