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
            }
        });
    });

    // 判斷 WIDE, WIDE_UM, LENGT_, LENGTH_UM 是否應該一起顯示
    let shouldShowSizeFields = false;

    // 當 ST_UM 為 MTK，且 DOC_UM 不是 MTK 且 ST_QTY 為空時，顯示布貨品欄位
    document.querySelectorAll(`#item-container .ST_UM`).forEach(stUmField => {
        if (stUmField.value && stUmField.value.trim() === 'MTK') {
            const row = stUmField.closest('.item-row');
            const docUmField = row.querySelector(`.DOC_UM`);
            const stQtyField = row.querySelector(`.ST_QTY`);
            
            if (
                docUmField && docUmField.value.trim() !== 'MTK' && 
                stQtyField && (!stQtyField.value || stQtyField.value.trim() === '')
            ) {
                shouldShowSizeFields = true;
            }
        }
    });

    // 如果 WIDE, WIDE_UM, LENGT_, LENGTH_UM 任一欄有值，也顯示所有欄位
    ['WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM'].forEach(field => {
        document.querySelectorAll(`#item-container .${field}`).forEach(fieldElement => {
            if (fieldElement.value && fieldElement.value.trim() !== '') {
                shouldShowSizeFields = true;
            }
        });
    });

    // 同步顯示或隱藏 WIDE, WIDE_UM, LENGT_, LENGTH_UM（包含標題和項次欄位）
    ['WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM'].forEach(field => {
        document.querySelectorAll(`.item-header .${field}, #item-container .${field}`).forEach(fieldElement => {
            const formGroup = fieldElement.closest('.form-group');
            if (formGroup) {
                if (shouldShowSizeFields) {
                    formGroup.classList.remove('hidden');
                } else {
                    formGroup.classList.add('hidden');
                }
            }
        });
    });

    // 檢查是否有任何 ST_UM 欄位有值，若有則顯示 ST_QTY（包含標題和項次欄位）
    let hasSTUMValue = false;
    document.querySelectorAll(`#item-container .ST_UM`).forEach(stUmField => {
        if (stUmField.value && stUmField.value.trim() !== '') {
            hasSTUMValue = true;
        }
    });

    if (hasSTUMValue) {
        document.querySelectorAll(`.item-header .ST_QTY, #item-container .ST_QTY`).forEach(stQtyField => {
            const stQtyFormGroup = stQtyField.closest('.form-group');
            if (stQtyFormGroup) {
                stQtyFormGroup.classList.remove('hidden');
            }
        });
    }
}

// 當頁面初始化或更新時，調用 initializeFieldVisibility 以確保同步顯示
document.addEventListener('DOMContentLoaded', () => {
    initializeFieldVisibility();
});

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