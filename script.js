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
    document.getElementById('import-excel').addEventListener('change', () => {
        handleFile();
    });

    // 添加事件監聽器到匯出Excel按鈕
    document.getElementById('export-excel').addEventListener('click', exportToExcel);

    // 添加事件監聽器到匯入XML按鈕
    document.getElementById('import-xml').addEventListener('change', importXML, false);
    document.getElementById('import-xml').addEventListener('change', () => {
        importXML();
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
    
    // 初始化時更新REMARK1的值
    updateRemark1();
});

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
        'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'NET_WT', 'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 
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
                    fieldElement.value = fieldValue;
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
        const headerFields = ['LOT_NO', 'SHPR_BAN_ID', 'SHPR_BONDED_ID',
            'SHPR_C_NAME', 'SHPR_E_NAME', 'SHPR_E_ADDR', 
            'CNEE_C_NAME', 'CNEE_E_NAME', 'CNEE_E_ADDR', 
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

        // 將報單項次數據填充到表單中
        const itemContainer = document.getElementById('item-container');
        itemContainer.innerHTML = ''; // 清空現有項次
        itemsData.slice(1).forEach((row, index) => {
            const itemRow = createItemRow({
                ITEM_NO: row[1], // 直接傳遞 B 欄數據
                DESCRIPTION: row[2] || '',
                QTY: row[3] || '',
                DOC_UM: row[4] || '',
                DOC_UNIT_P: row[5] || '',
                DOC_TOT_P: row[6] || '',
                TRADE_MARK: row[7] || '',
                CCC_CODE: row[8] || '',
                ST_MTD: row[9] || '',
                NET_WT: row[10] || '',
                ORG_COUNTRY: row[11] || '',
                ORG_IMP_DCL_NO: row[12] || '',
                ORG_IMP_DCL_NO_ITEM: row[13] || '',
                SELLER_ITEM_CODE: row[14] || '',
                BOND_NOTE: row[15] || '',                
                GOODS_MODEL: row[16] || '',
                GOODS_SPEC: row[17] || '',
                CERT_NO: row[18] || '',
                CERT_NO_ITEM: row[19] || '',
                ORG_DCL_NO: row[20] || '',
                ORG_DCL_NO_ITEM: row[21] || '',
                EXP_NO: row[22] || '',
                EXP_SEQ_NO: row[23] || '',
                WIDE: row[24] || '',
                WIDE_UM: row[25] || '',
                LENGT_: row[26] || '',
                LENGTH_UM: row[27] || '',
                ST_QTY: row[28] || '',
                ST_UM: row[29] || '',
            });
            itemContainer.appendChild(itemRow);
        });
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
        ['運單號', document.getElementById('LOT_NO').value],
        ['出口人統一編號', document.getElementById('SHPR_BAN_ID').value],
        ['海關監管編號', document.getElementById('SHPR_BONDED_ID').value],
        ['出口人中文名稱', document.getElementById('SHPR_C_NAME').value],
        ['出口人英文名稱', document.getElementById('SHPR_E_NAME').value],
        ['出口人中/英地址', document.getElementById('SHPR_E_ADDR').value],
        ['買方中文名稱', document.getElementById('CNEE_C_NAME').value],
        ['買方英文名稱', document.getElementById('CNEE_E_NAME').value],
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

    // 下載 Excel 文件
    XLSX.writeFile(workbook, 'export.xlsx');
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
        ${createInputField('TRADE_MARK', data.TRADE_MARK, false)}
        ${createInputField('CCC_CODE', data.CCC_CODE, false)}
        ${createInputField('ST_MTD', data.ST_MTD, false)}
        ${createInputField('NET_WT', data.NET_WT, false)}
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
        <div class="form-group">
            <button class="delete-button" onclick="removeItem(this)">Ｘ</button>
        </div>
    `;
    itemCount++;
    return row;
}

// 創建文本域
function createTextareaField(name, value) {
    return `
        <div class="form-group">
            <textarea class="${name}">${value || ''}</textarea>
        </div>
    `;
}

// 創建輸入域
function createInputField(name, value, isVisible) {
    const visibilityClass = isVisible ? '' : 'hidden';
    const inputType = (name === 'QTY' || name === 'DOC_UNIT_P') ? 'number' : 'text';
    const onInputAttribute = (name === 'QTY' || name === 'DOC_UNIT_P') ? 'oninput="calculateAmount(event)"' : '';
    const minAttribute = (name === 'QTY' || name === 'DOC_UNIT_P' || name === 'DOC_TOT_P') ? 'min="0"' : '';
    const readonlyAttribute = (name === 'DOC_TOT_P') ? 'readonly' : '';

    return `
        <div class="form-group ${visibilityClass}">
            <input type="${inputType}" class="${name}" value="${value || ''}" ${onInputAttribute} ${minAttribute} ${readonlyAttribute}>
        </div>
    `;
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
        row.querySelector('.DOC_TOT_P').value = (qty === 0 || unitPrice === 0) ? '' : amount.toFixed(2);
    } else {
        // 處理整個表單中的數量和單價
        const qty = parseFloat(document.querySelector('#QTY').value) || 0;
        const unitPrice = parseFloat(document.querySelector('#DOC_UNIT_P').value) || 0;
        const amount = qty * unitPrice;

        // 如果數量或單價為0，顯示空值，否則顯示計算結果
        document.querySelector('#DOC_TOT_P').value = (qty === 0 || unitPrice === 0) ? '' : amount.toFixed(2);
    }
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
    document.querySelectorAll('.QTY, .DOC_UNIT_P').forEach(function (element) {
        element.addEventListener('input', calculateAmount);
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateVariables);
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
            'SHPR_C_NAME', 'SHPR_E_NAME', 'SHPR_E_ADDR', 
            'CNEE_C_NAME', 'CNEE_E_NAME', 'CNEE_E_ADDR', 
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
        const itemFields = [
            'DESCRIPTION', 'QTY', 'DOC_UM', 'DOC_UNIT_P', 'DOC_TOT_P', 
            'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 'NET_WT', 'ORG_COUNTRY', 
            'ORG_IMP_DCL_NO', 'ORG_IMP_DCL_NO_ITEM', 'SELLER_ITEM_CODE', 'BOND_NOTE',
            'GOODS_MODEL', 'GOODS_SPEC', 'CERT_NO', 'CERT_NO_ITEM', 
            'ORG_DCL_NO', 'ORG_DCL_NO_ITEM', 'EXP_NO', 'EXP_SEQ_NO', 
            'WIDE', 'WIDE_UM', 'LENGT_', 'LENGTH_UM', 'ST_QTY' ,'ST_UM',
        ];
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<Root>\n  <sys_code>GICCDS</sys_code>\n<head>\n  <head_table_name>DOC_HEAD</head_table_name>\n';
        
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
                let value = item.querySelector(`.${className}`).value;
                xmlContent += `    <fields>\n      <field_name>${className}</field_name>\n      <field_value>${value}</field_value>\n    </fields>\n`;
            });
            xmlContent += '  </items>\n';
        });
        xmlContent += '</detail>\n</Root>';

        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'export.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.getElementById('export-to-xml').addEventListener('click', exportToXML);
});

// 出口報單預覽
function exportToPDF() {
    fetch('NotoSansTC-Regular.ttf')
        .then(response => response.arrayBuffer())
        .then(fontBuffer => {
            const fontBase64 = btoa(
                new Uint8Array(fontBuffer)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const { jsPDF } = window.jspdf;

            // 創建新的 jsPDF 實例
            const doc = new jsPDF();

            // 加載字體
            doc.addFileToVFS("NotoSansTC-Regular.ttf", fontBase64);
            doc.addFont("NotoSansTC-Regular.ttf", "NotoSansTC", "normal");
            doc.setFont("NotoSansTC");

            // 添加標題
            doc.setFontSize(20);
            doc.text('出口報單', 10, 10);

            // 添加表頭
            const headerData = [
                ['運單號', document.getElementById('LOT_NO').value],
                ['出口人統一編號', document.getElementById('SHPR_BAN_ID').value],
                ['海關監管編號', document.getElementById('SHPR_BONDED_ID').value],
                ['出口人中文名稱', document.getElementById('SHPR_C_NAME').value],
                ['出口人英文名稱', document.getElementById('SHPR_E_NAME').value],
                ['出口人中/英地址', document.getElementById('SHPR_E_ADDR').value],
                ['買方中文名稱', document.getElementById('CNEE_C_NAME').value],
                ['買方英文名稱', document.getElementById('CNEE_E_NAME').value],
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
                ['REMARKS', document.getElementById('REMARK1').value]
            ];

            let y = 30; // 更新初始 y 座標
            doc.setFontSize(12);
            headerData.forEach((row, index) => {
                const x = index % 2 === 0 ? 10 : 110; // 根據索引偶數放左邊，奇數放右邊
                doc.text(`${row[0]}: ${row[1]}`, x, y);
                if (index % 2 === 1) { // 每次奇數索引增加 y
                    y += 10;
                }
            });

            // 添加項次數據
            y += 10;
            doc.setFontSize(14);
            doc.text('---------------------------------------------------------------------------------------------------------------', 10, y);
            y += 10;

            const itemHeader = 
            ['項次', '大品名註記', '品名', '數量', '單位', '單價', '金額', 
                '商標', '稅則', '統計方式', '淨重', '生產國別', '原進口報單號碼', '原進口報單項次', 
                '賣方料號', '保稅貨物註記', '型號', '規格', '產證號碼', '產證項次', 
                '原進倉報單號碼', '原進倉報單項次', '輸出許可號碼', '輸出許可項次', 
                '寬度(幅寬)', '寬度單位', '長度(幅長)', '長度單位' ,'統計數量' ,'統計單位'];

            const items = document.querySelectorAll("#item-container .item-row");

            items.forEach((item, index) => {
                const rowData = [
                    index + 1,
                    item.querySelector('.ITEM_NO').checked ? '*' : '',
                    item.querySelector('.DESCRIPTION').value,
                    item.querySelector('.QTY').value,
                    item.querySelector('.DOC_UM').value,
                    item.querySelector('.DOC_UNIT_P').value,
                    item.querySelector('.DOC_TOT_P').value,
                    item.querySelector('.TRADE_MARK').value,
                    item.querySelector('.CCC_CODE').value,
                    item.querySelector('.ST_MTD').value,
                    item.querySelector('.NET_WT').value,                    
                    item.querySelector('.ORG_COUNTRY').value,
                    item.querySelector('.ORG_IMP_DCL_NO').value,
                    item.querySelector('.ORG_IMP_DCL_NO_ITEM').value,
                    item.querySelector('.SELLER_ITEM_CODE').value,
                    item.querySelector('.BOND_NOTE').value,
                    item.querySelector('.GOODS_MODEL').value,
                    item.querySelector('.GOODS_SPEC').value,
                    item.querySelector('.CERT_NO').value,
                    item.querySelector('.CERT_NO_ITEM').value,
                    item.querySelector('.ORG_DCL_NO').value,
                    item.querySelector('.ORG_DCL_NO_ITEM').value,
                    item.querySelector('.EXP_NO').value,
                    item.querySelector('.EXP_SEQ_NO').value,
                    item.querySelector('.WIDE').value,
                    item.querySelector('.WIDE_UM').value,
                    item.querySelector('.LENGT_').value,
                    item.querySelector('.LENGTH_UM').value,
                    item.querySelector('.ST_QTY').value,
                    item.querySelector('.ST_UM').value,
                ];

                rowData.forEach((field, i) => {
                    const x = i % 2 === 0 ? 10 : 110; // 根據索引偶數放左邊，奇數放右邊
                    let lines = doc.splitTextToSize(`${itemHeader[i]}: ${field}`, 90); // 將文本分行
                    lines.forEach((line) => {
                        doc.text(line, x, y);
                        y += 10; // 每行文本增加 y
                        if (y > 270) { // 判斷是否需要換頁
                            doc.addPage();
                            y = 10; // 重置 y 座標
                        }
                    });
                });
                y += 10; // 每個項次結束後增加 y
            });

            // 保存 PDF
            doc.save('report.pdf');
        })
        .catch(error => console.error('讀取字體文件失敗:', error));
}

document.getElementById('export-to-pdf').addEventListener('click', exportToPDF);
