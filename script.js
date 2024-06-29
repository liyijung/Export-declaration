let itemCount = 0; // 初始化項次計數
let fileContent = null; // 儲存上傳文件的內容

// 切換報單表頭與報單項次的tab
function openTab(tabName) {
    const tabs = document.querySelectorAll(".tab");
    const tabLinks = document.querySelectorAll(".tab-links");

    tabs.forEach(tab => tab.classList.remove("active"));
    tabLinks.forEach(link => link.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
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
        alert('未找到匹配的資料');
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

// 開啟新增項次的彈跳框
function openItemModal() {
    // 清空所有輸入框
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

    // 填充下拉選單
    const copyItemSelect = document.getElementById('COPY_ITEM');
    copyItemSelect.innerHTML = '<option value="">選擇項次</option>';
    document.querySelectorAll('#item-container .item-row').forEach((item, index) => {
        const description = item.querySelector('.DESCRIPTION').value;
        copyItemSelect.innerHTML += `<option value="${index}">項次 ${index + 1} - ${description}</option>`;
    });

    // 顯示彈跳框
    document.getElementById('item-modal').style.display = 'flex';

    // 滾動到最上方
    document.querySelector('#item-modal .modal-content').scrollTop = 0;
}

// 複製選定的項次內容
function copyItem() {
    const copyItemSelect = document.getElementById('COPY_ITEM');
    const selectedItemIndex = copyItemSelect.value;

    if (selectedItemIndex !== "") {
        const item = document.querySelectorAll('#item-container .item-row')[selectedItemIndex];
        document.getElementById('ITEM_NO').checked = item.querySelector('.ITEM_NO').checked;
        document.getElementById('DESCRIPTION').value = item.querySelector('.DESCRIPTION').value;
        document.getElementById('QTY').value = item.querySelector('.QTY').value;
        document.getElementById('DOC_UM').value = item.querySelector('.DOC_UM').value;
        document.getElementById('DOC_UNIT_P').value = item.querySelector('.DOC_UNIT_P').value;
        document.getElementById('DOC_TOT_P').value = item.querySelector('.DOC_TOT_P').value;
        document.getElementById('TRADE_MARK').value = item.querySelector('.TRADE_MARK').value;
        document.getElementById('CCC_CODE').value = item.querySelector('.CCC_CODE').value;
        document.getElementById('ST_MTD').value = item.querySelector('.ST_MTD').value;
        document.getElementById('NET_WT').value = item.querySelector('.NET_WT').value;
        document.getElementById('ORG_COUNTRY').value = item.querySelector('.ORG_COUNTRY').value;
        document.getElementById('ORG_IMP_DCL_NO').value = item.querySelector('.ORG_IMP_DCL_NO').value;
        document.getElementById('ORG_IMP_DCL_NO_ITEM').value = item.querySelector('.ORG_IMP_DCL_NO_ITEM').value;
        document.getElementById('SELLER_ITEM_CODE').value = item.querySelector('.SELLER_ITEM_CODE').value;
        document.getElementById('BOND_NOTE').value = item.querySelector('.BOND_NOTE').value;        
        document.getElementById('GOODS_MODEL').value = item.querySelector('.GOODS_MODEL').value;
        document.getElementById('GOODS_SPEC').value = item.querySelector('.GOODS_SPEC').value;
        document.getElementById('CERT_NO').value = item.querySelector('.CERT_NO').value;
        document.getElementById('CERT_NO_ITEM').value = item.querySelector('.CERT_NO_ITEM').value;
        document.getElementById('ORG_DCL_NO').value = item.querySelector('.ORG_DCL_NO').value;
        document.getElementById('ORG_DCL_NO_ITEM').value = item.querySelector('.ORG_DCL_NO_ITEM').value;
        document.getElementById('EXP_NO').value = item.querySelector('.EXP_NO').value;
        document.getElementById('EXP_SEQ_NO').value = item.querySelector('.EXP_SEQ_NO').value;
        document.getElementById('WIDE').value = item.querySelector('.WIDE').value;
        document.getElementById('WIDE_UM').value = item.querySelector('.WIDE_UM').value;
        document.getElementById('LENGT_').value = item.querySelector('.LENGT_').value;
        document.getElementById('LENGTH_UM').value = item.querySelector('.LENGTH_UM').value;
        document.getElementById('ST_QTY').value = item.querySelector('.ST_QTY').value;
        document.getElementById('ST_UM').value = item.querySelector('.ST_UM').value;
    }
}

// 關閉新增項次的彈跳框
function closeItemModal() {
    document.getElementById('item-modal').style.display = 'none';
}

// 儲存新增的項次
function saveItem() {
    const itemContainer = document.getElementById('item-container');
    const item = createItemRow({
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
    });
    itemContainer.appendChild(item);

    closeItemModal();
    renumberItems();
    applyToggleFields();
}

// 刪除項次
function removeItem(element) {
    const item = element.parentElement.parentElement;
    item.parentElement.removeChild(item);
    renumberItems();
}

function openToggleFieldsModal() {
    document.getElementById('toggle-fields-modal').style.display = 'flex';
}

function closeToggleFieldsModal() {
    document.getElementById('toggle-fields-modal').style.display = 'none';
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

    document.getElementById('adjust-order-modal').style.display = 'flex';
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
    document.getElementById('specify-field-modal').style.display = 'flex';
}

// 關閉指定填列欄位資料的彈跳框
function closeSpecifyFieldModal() {
    document.getElementById('specify-field-modal').style.display = 'none';
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
                element.value = headerData[index] ? headerData[index][1] || '' : '';
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
            item.querySelector('.DOC_UM').value || '',
            item.querySelector('.DOC_UNIT_P').value || '',
            item.querySelector('.DOC_TOT_P').value || '',
            item.querySelector('.TRADE_MARK').value || '',
            item.querySelector('.CCC_CODE').value || '',
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
            item.querySelector('.WIDE_UM').value || '',
            item.querySelector('.LENGT_').value || '',
            item.querySelector('.LENGTH_UM').value || '',
            item.querySelector('.ST_QTY').value || '',
            item.querySelector('.ST_UM').value || '',
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
    const fileName = document.getElementById('FILE_NO').value || '';
    const exporterName = document.getElementById('SHPR_C_NAME').value || '';

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
        const reader = new FileReader();
        reader.onload = function(e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "application/xml");

            // 解析表頭資料
            const headerFields = xmlDoc.getElementsByTagName("head")[0].getElementsByTagName("fields");
            Array.from(headerFields).forEach(field => {
                const fieldName = field.getElementsByTagName("field_name")[0].textContent;
                const fieldValue = field.getElementsByTagName("field_value")[0].textContent;
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
                    const fieldValue = field.getElementsByTagName("field_value")[0].textContent;
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

// 創建項次的HTML結構
function createItemRow(data) {
    const row = document.createElement('div');
    row.className = 'item-row';
    const isChecked = data.ITEM_NO === '*'; // 根據 ITEM_NO 判斷是否勾選
    row.innerHTML = `
        <div class="form-group fix">
            <label>${itemCount + 1}</label>
        </div>
        <div class="form-group fix">
            <input type="checkbox" class="ITEM_NO" ${isChecked ? 'checked' : ''}>
        </div>
        ${createTextareaField('DESCRIPTION', data.DESCRIPTION)}
        ${createInputField('QTY', data.QTY, true)}
        ${createInputField('DOC_UM', data.DOC_UM, true)}
        ${createInputField('DOC_UNIT_P', data.DOC_UNIT_P, true)}
        ${createInputField('DOC_TOT_P', data.DOC_TOT_P, true)}
        ${createInputField('TRADE_MARK', data.TRADE_MARK, true)}
        ${createInputField('CCC_CODE', data.CCC_CODE, true)}
        ${createInputField('ST_MTD', data.ST_MTD, true)}
        ${createInputField('NET_WT', data.NET_WT, true)}
        ${createInputField('ORG_COUNTRY', data.ORG_COUNTRY, false)}
        ${createInputField('ORG_IMP_DCL_NO', data.ORG_IMP_DCL_NO, false)}
        ${createInputField('ORG_IMP_DCL_NO_ITEM', data.ORG_IMP_DCL_NO_ITEM, false)}
        ${createInputField('SELLER_ITEM_CODE', data.SELLER_ITEM_CODE, false)}
        ${createInputField('BOND_NOTE', data.BOND_NOTE, false)}        
        ${createInputField('GOODS_MODEL', data.GOODS_MODEL, false)}
        ${createInputField('GOODS_SPEC', data.GOODS_SPEC, false)}
        ${createInputField('CERT_NO', data.CERT_NO, false)}
        ${createInputField('CERT_NO_ITEM', data.CERT_NO_ITEM, false)}
        ${createInputField('ORG_DCL_NO', data.ORG_DCL_NO, false)}
        ${createInputField('ORG_DCL_NO_ITEM', data.ORG_DCL_NO_ITEM, false)}
        ${createInputField('EXP_NO', data.EXP_NO, false)}
        ${createInputField('EXP_SEQ_NO', data.EXP_SEQ_NO, false)}
        ${createInputField('WIDE', data.WIDE, false)}
        ${createInputField('WIDE_UM', data.WIDE_UM, false)}
        ${createInputField('LENGT_', data.LENGT_, false)}
        ${createInputField('LENGTH_UM', data.LENGTH_UM, false)}
        ${createInputField('ST_QTY', data.ST_QTY, false)}
        ${createInputField('ST_UM', data.ST_UM, false)}
        <div class="form-group fix">
            <button class="delete-button" onclick="removeItem(this)">Ｘ</button>
        </div>
    `;
    itemCount++;
    return row;
}

let textareaCounter = 0;
let allExpanded = false; // 用於跟蹤所有文本域的展開/折疊狀態

// 創建文本域
function createTextareaField(name, value) {
    const id = `textarea-${name}-${textareaCounter++}`;
    return `
        <div class="form-group declaration-item" style="width: 200%;">
            <textarea id="${id}" class="${name}" rows="1">${value || ''}</textarea>
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

// 添加文本域的示例函數
function addTextarea() {
    const container = document.getElementById('textarea-container');
    const textareaHTML = createTextareaField('example-textarea', '這是初始值');
    container.innerHTML += textareaHTML;
}

// 初次調用以填充下拉選單
document.addEventListener('DOMContentLoaded', (event) => {
    addTextarea();
});

// 創建輸入域
function createInputField(name, value, isVisible) {
    const visibilityClass = isVisible ? '' : 'hidden';
    const inputType = (name === 'QTY' || name === 'DOC_UNIT_P') ? 'number' : 'text';
    const onInputAttribute = (name === 'QTY' || name === 'DOC_UNIT_P') ? 'oninput="calculateAmount(event)"' : '';
    const minAttribute = (name === 'QTY' || name === 'DOC_UNIT_P' || name === 'DOC_TOT_P') ? 'min="0"' : '';
    const readonlyAttribute = (name === 'DOC_TOT_P') ? 'readonly' : '';

    if (name === 'NET_WT') {
        return `
            <div class="form-group ${visibilityClass}" style="width: 20%; display: flex; align-items: center;">
                <input type="checkbox" class="ISCALC_WT" style="margin-left: 5px;">
            </div>
            <div class="form-group ${visibilityClass}" style="width: 60%; display: flex; align-items: center;">
                <input type="${inputType}" class="${name}" value="${value || ''}" ${onInputAttribute} ${minAttribute} ${readonlyAttribute} style="flex: 1; margin-right: 0;">
            </div>
        `;
    } else if (name === 'DOC_UM' || name === 'WIDE_UM' || name === 'LENGTH_UM' || name === 'ST_UM') {
        return `
            <div class="form-group ${visibilityClass}" style="width: 40%;">
                <input type="${inputType}" class="${name}" value="${value || ''}" ${onInputAttribute} ${minAttribute} ${readonlyAttribute}>
            </div>
        `;
    } else if (name === 'DOC_UM' || name === 'ST_MTD' || name === 'ORG_COUNTRY' || name === 'ORG_IMP_DCL_NO_ITEM' || name === 'BOND_NOTE' || name === 'CERT_NO_ITEM' || name === 'ORG_DCL_NO_ITEM' || name === 'EXP_SEQ_NO') {
        return `
            <div class="form-group ${visibilityClass}" style="width: 30%;">
                <input type="${inputType}" class="${name}" value="${value || ''}" ${onInputAttribute} ${minAttribute} ${readonlyAttribute}>
            </div>
        `;
    } else {
        return `
            <div class="form-group ${visibilityClass}">
                <input type="${inputType}" class="${name}" value="${value || ''}" ${onInputAttribute} ${minAttribute} ${readonlyAttribute}>
            </div>
        `;
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

// 計算金額的函數
function calculateAmount(event) {
    if (event) {
        // 處理特定行中的數量和單價
        const row = event.target.closest('.item-row') || event.target.closest('.modal-content'); // 找到當前輸入域所在的行或彈跳框
        const qty = parseFloat(row.querySelector('.QTY').value) || 0;
        const unitPrice = parseFloat(row.querySelector('.DOC_UNIT_P').value) || 0;
        const amount = qty * unitPrice;
        
        // 如果數量或單價為0，顯示空值，否則顯示計算結果
        row.querySelector('.DOC_TOT_P').value = (qty === 0 || unitPrice === 0) ? '' : amount.toFixed(2); // 小數點2位
    } else {
        // 處理整個表單中的數量和單價
        const qty = parseFloat(document.querySelector('#QTY').value) || 0;
        const unitPrice = parseFloat(document.querySelector('#DOC_UNIT_P').value) || 0;
        const amount = qty * unitPrice;

        // 如果數量或單價為0，顯示空值，否則顯示計算結果
        document.querySelector('#DOC_TOT_P').value = (qty === 0 || unitPrice === 0) ? '' : amount.toFixed(2); // 小數點2位
    }
}

function calculateAmounts() {
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

    const totalDocumentAmount = parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value) || 0;
    const currency = document.getElementById('CURRENCY').value || '';

    // 顯示金額
    alert(`報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(2)}\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(2)}`);
}

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

    const decimalPlaces = parseInt(prompt('請輸入小數位數（預設值：4）', '4'), 10);
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        alert('請輸入有效的小數位數');
        return;
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

    // 將剩餘淨重按比例分配到未固定的項次
    let distributedWeights = [];
    items.forEach((item, index) => {
        if (!fixedWeights.some(fixed => fixed.index === index)) {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            if (!isNaN(quantity) && quantity > 0) {
                const netWeight = parseFloat(((quantity / totalQuantity) * remainingNetWeight).toFixed(decimalPlaces));
                distributedWeights.push({ index, netWeight });
            }
        }
    });

    // 計算分配的總重量和差異
    let totalDistributedWeight = distributedWeights.reduce((sum, item) => sum + item.netWeight, 0);
    let discrepancy = remainingNetWeight - totalDistributedWeight;

    // 將餘數重新分配給未固定的項次
    if (distributedWeights.length > 0 && Math.abs(discrepancy) >= Math.pow(10, -decimalPlaces)) {
        const sign = discrepancy > 0 ? 1 : -1;

        for (let i = 0; Math.abs(discrepancy) >= Math.pow(10, -decimalPlaces) && i < distributedWeights.length; i++) {
            distributedWeights[i].netWeight += sign * Math.pow(10, -decimalPlaces);
            distributedWeights[i].netWeight = parseFloat(distributedWeights[i].netWeight.toFixed(decimalPlaces));
            discrepancy -= sign * Math.pow(10, -decimalPlaces);
        }
    }

    // 將分配的重量應用到每個項次
    distributedWeights.forEach(item => {
        const netWtElement = items[item.index].querySelector('.NET_WT');
        netWtElement.value = item.netWeight.toFixed(decimalPlaces);
    });

    // 顯示各項次的攤重
    items.forEach(item => {
        const netWeight = item.querySelector('.NET_WT').value;
        console.log(`項次 ${item.dataset.index} 的淨重: ${netWeight}`);
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
    if (Math.abs(finalDiscrepancy) >= Math.pow(10, -decimalPlaces)) {
        const lastItem = items[distributedWeights[distributedWeights.length - 1].index];
        const lastItemWeight = parseFloat(lastItem.querySelector('.NET_WT').value);
        lastItem.querySelector('.NET_WT').value = (lastItemWeight + finalDiscrepancy).toFixed(decimalPlaces);
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
        if (copy3_e.checked && copy3.checked) {
            alert("申請沖退原料稅（E化退稅）\n申請報單副本第三聯（沖退原料稅用聯)\n\n請擇一選擇");
            copy3_e.checked = false;
            copy3.checked = false;
            // 清空 REMARK1 欄位的值
            remark1.value = '';
            return; // 退出函数以确保不進行後續處理
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
                let value = element.value;
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
                    value = item.querySelector(`.${className}`).value;
                }
                xmlContent += `    <fields>\n      <field_name>${className}</field_name>\n      <field_value>${value}</field_value>\n    </fields>\n`;
            });
            xmlContent += '  </items>\n';
        });
        xmlContent += '</detail>\n</Root>';

        const fileName = document.getElementById('FILE_NO').value || '';
        const exporterName = document.getElementById('SHPR_C_NAME').value || '';

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

// 出口報單預覽
async function exportToPDF() {
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
    // doc.setTextColor(255, 0, 0); // 紅色
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
    const dclDocTypeText = dclDocTypeElement.list.querySelector(`option[value="${dclDocTypeValue}"]`).text;

    // 獲取並格式化數字值
    const calIpTotItemAmt = document.getElementById('CAL_IP_TOT_ITEM_AMT').value ? parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value).toFixed(2).toLocaleString() : 'NIL';
    const frtAmt = document.getElementById('FRT_AMT').value ? parseFloat(document.getElementById('FRT_AMT').value).toFixed(2).toLocaleString() : 'NIL';
    const insAmt = document.getElementById('INS_AMT').value ? parseFloat(document.getElementById('INS_AMT').value).toFixed(2).toLocaleString() : 'NIL';
    const addAmt = document.getElementById('ADD_AMT').value ? parseFloat(document.getElementById('ADD_AMT').value).toFixed(2).toLocaleString() : 'NIL';
    const subtractAmt = document.getElementById('SUBTRACT_AMT').value ? parseFloat(document.getElementById('SUBTRACT_AMT').value).toFixed(2).toLocaleString() : 'NIL';

    const pageWidth = 210; // A4 尺寸的寬度
    const rightMargin = 1; // 右邊距
    // 計算右對齊的 x 位置
    const calculateRightAlignedX = (value) => {
        const textWidth = doc.getTextWidth(value);
        return pageWidth - rightMargin - textWidth;
    };

    // 添加二維條碼
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, 'CX  13696', { format: 'CODE128' });
    const barcodeImgData = barcodeCanvas.toDataURL('image/png');
    doc.addImage(barcodeImgData, 'PNG', 118, 12, 20, 10); // 調整位置和大小

    // 表頭欄位與位置
    const headerData = [
        { value: `空運`, x: 75, y: 10 },
        { value: `CX/  /13/696/`, x: 75, y: 18.5 },
        { value: `113/06/`, x: 62, y: 35 },
        { value: `TWTPE`, x: 30, y: 40.5 },
        { value: `TAOYUAN`, x: 24, y: 44 },
        { value: `AIRPORT`, x: 24, y: 48 },
        { value: `42`, x: 136, y: 44 },
        { value: `${dclDocTypeValue}${dclDocTypeText}`, x: 103, y: 10 },
        { value: document.getElementById('CURRENCY').value, x: 171, y: 29 },
        { value: document.getElementById('CURRENCY').value, x: 171, y: 36 },
        { value: document.getElementById('CURRENCY').value, x: 171, y: 43 },
        { value: calIpTotItemAmt, x: calculateRightAlignedX(calIpTotItemAmt), y: 29 },
        { value: frtAmt, x: calculateRightAlignedX(frtAmt), y: 36 },
        { value: insAmt, x: calculateRightAlignedX(insAmt), y: 43 },
        { value: addAmt, x: calculateRightAlignedX(addAmt), y: 49 },
        { value: subtractAmt, x: calculateRightAlignedX(subtractAmt), y: 54 },
        { value: document.getElementById('TO_CODE').value, x: 70, y: 40.5 },
        { value: document.getElementById('TO_DESC').value, x: 61, y: 45 },
        { value: document.getElementById('SHPR_BAN_ID').value, x: 30, y: 60 },
        { value: document.getElementById('SHPR_BONDED_ID').value, x: 90, y: 60 },
        { value: document.getElementById('SHPR_C_NAME').value, x: 30, y: 66.5 },
        { value: document.getElementById('SHPR_E_NAME').value, x: 30, y: 71.5 },
        { value: document.getElementById('SHPR_C_ADDR').value, x: 30, y: 76.5 },
        { value: document.getElementById('CNEE_E_NAME').value, x: 30, y: 88 },
        { value: document.getElementById('CNEE_E_ADDR').value, x: 30, y: 94 },
        { value: document.getElementById('CNEE_COUNTRY_CODE').value, x: 30, y: 100.5 },
        { value: document.getElementById('CNEE_BAN_ID').value, x: 63, y: 100.5 },
        { value: document.getElementById('TERMS_SALES').value, x: 165, y: 100.5 },
        { value: document.getElementById('TOT_CTN').value, x: 43, y: 201.5 },
        { value: document.getElementById('DOC_CTN_UM').value, x: 50, y: 201.5 },
        { value: document.getElementById('CTN_DESC').value, x: 85, y: 201.5 },
        { value: document.getElementById('DCL_GW').value, x: 190, y: 201.5 },
        { value: document.getElementById('DOC_MARKS_DESC').value, x: 8, y: 211 },
        { value: document.getElementById('DOC_OTR_DESC').value, x: 7, y: 260 },
    ];

    // 設置表頭字體大小並添加文本
    doc.setFontSize(9);
    headerData.forEach(row => {
        const value = row.value;
        doc.text(value, row.x, row.y);
    });

    // 添加項次資料
    const itemsData = [];
    document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
        itemsData.push({
            index: item.querySelector('.ITEM_NO').checked ? '*' : index + 1,  // 如果選中則顯示'*'，否則顯示編號
            tradeMark: item.querySelector('.TRADE_MARK').value || '', // 商標
            description: item.querySelector('.DESCRIPTION').value || '', // 品名
            values: [
                { value: item.querySelector('.CCC_CODE').value || '', x: 90 },
                { value: item.querySelector('.DOC_UNIT_P').value || '', x: 135 },
                { value: (item.querySelector('.QTY').value || '') + ' ' + (item.querySelector('.DOC_UM').value || ''), x: 160 },
                { value: item.querySelector('.ST_MTD').value || '', x: 200 },
            ]
        });
    });

    // 添加項次資料到 PDF
    let startY = 134;  // 設置初始的 Y 坐標
    const maxYHome = 190;  // 首頁的頁面底部的 Y 坐標
    const maxYContinuation = 270;  // 續頁的頁面底部的 Y 坐標
    const lineHeight = 5;  // 每行的高度
    const tradeMarkLineSpacing = 5; // 商標換行時的間距

    let itemCounter = 1; // 用於標記項次編號

    for (const item of itemsData) {
        let currentMaxY = doc.internal.getCurrentPageInfo().pageNumber === 1 ? maxYHome : maxYContinuation;

        // 檢查空間是否足夠
        const itemDescriptionLines = doc.splitTextToSize(item.description, 150).length;
        const itemLinesNeeded = item.index === '*' ? itemDescriptionLines + 2 : itemDescriptionLines + 1;

        if (startY + lineHeight * itemLinesNeeded > currentMaxY) {
            doc.addPage();  // 換頁
            await renderTemplate(doc, templateContinuation, 1); // 渲染新頁面的模板
            startY = 63;  // 新頁面的起始 Y 坐標
            currentMaxY = maxYContinuation; // 更新續頁的頁面底部 Y 坐標
        }

        // 顯示項次編號和商標在同一行
        doc.text(`${item.index === '*' ? '*' : itemCounter}`, 8, startY); // 顯示項次編號

        const tradeMarkLines = doc.splitTextToSize(item.tradeMark, 20); // 將商標文本拆分為多行，每行最多寬度20
        let tradeMarkY = startY;
        tradeMarkLines.forEach(line => {
            doc.text(line, 60, tradeMarkY); // 顯示商標，每行都從 x 軸 60 開始
            tradeMarkY += tradeMarkLineSpacing;
        });
        startY = tradeMarkY;

        // 顯示品名
        const descriptionLines = doc.splitTextToSize(item.description, 150);
        descriptionLines.forEach(line => {
            doc.text(line, 15, startY);
            startY += lineHeight;
        });

        // 顯示稅則、單價、數量
        item.values.forEach(field => {
            doc.text(field.value, field.x, startY - (descriptionLines.length * lineHeight)); // 顯示在商標行
        });

        // 如果是 '*' 項次，添加 '*' 行
        if (item.index === '*') {
            const stars = '*'.repeat(descriptionLines.join('').length);
            doc.text(stars, 15, startY);
            startY += lineHeight;  // 增加 Y 坐標以顯示下一行
        } else {
            itemCounter++; // 增加項次計數器
        }
    }

    // 添加底部固定欄位
    const footerData = [
        { value: document.getElementById('FILE_NO').value, x: 10, y: 380 },
        { value: document.getElementById('LOT_NO').value, x: 30, y: 380 }
    ];

    footerData.forEach(row => {
        doc.text(row.value, row.x, row.y);
    });

    // 保存 PDF，文件名為 FILE_NO 的值
    const fileName = document.getElementById('FILE_NO').value || 'export';
    const exporterName = document.getElementById('SHPR_C_NAME').value || 'exporter';
    doc.save(`${fileName}-${exporterName}.pdf`);
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
