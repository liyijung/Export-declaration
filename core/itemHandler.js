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
        const docUmValue = docUmInput.value.trim().toUpperCase();
        const qtyValue = parseFloat(qtyInput.value) || 0;

        if (docUmValue === "KGM") {
            netWtInput.value = qtyValue;
        } else if (docUmValue === "GRM") {
            netWtInput.value = (qtyValue / 1000)
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

// 彈跳框品名 展開/收合
function toggleDescriptionRows() {
    const textarea = document.getElementById("DESCRIPTION");
    const button = event.target; // 取得觸發此事件的按鈕

    if (textarea.rows === 5) {
        textarea.rows = 10;
        button.textContent = "收合";
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

    // 還原 CCC_CODE 背景
    const cccCodeInput = document.getElementById('CCC_CODE');
    cccCodeInput.classList.remove('highlight-ccc');
    
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