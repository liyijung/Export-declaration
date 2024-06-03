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

// 打開新增項次的彈跳框
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

    // 顯示彈跳框
    document.getElementById('item-modal').style.display = 'flex';

    // 滾動到最上方
    document.querySelector('#item-modal .modal-content').scrollTop = 0;
}

// 關閉新增項次的彈跳框
function closeItemModal() {
    document.getElementById('item-modal').style.display = 'none';
}

// 儲存新增的項次
function saveItem() {
    itemCount++;
    const itemContainer = document.getElementById('item-container');
    const item = createItemRow({
        ITEM_NO: document.getElementById('ITEM_NO').checked ? '*' : '',
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
        ORG_IMP_DCL_NO_ITEM: document.getElementById('ORG_IMP_DCL_NO_ITEM').value
    });
    itemContainer.appendChild(item);

    closeItemModal();
    renumberItems();
}

// 刪除項次
function removeItem(element) {
    const item = element.parentElement.parentElement;
    item.parentElement.removeChild(item);
    renumberItems();
}

// 重新編號所有項次
function renumberItems() {
    itemCount = 0;
    document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
        itemCount++;
        item.querySelector('label').textContent = `${itemCount}`; // 項次
    });
}

// 處理文件上傳事件
document.getElementById('file-input').addEventListener('change', handleFile, false);

function handleFile(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const headerSheet = workbook.Sheets["報單表頭"];
        const itemsSheet = workbook.Sheets["報單項次"];

        if (headerSheet) {
            const headerJson = XLSX.utils.sheet_to_json(headerSheet, { header: 1 });

            // 清空表頭輸入框
            document.getElementById('LOT_NO').value = headerJson[0][1] || '';
            document.getElementById('SHPR_BAN_ID').value = headerJson[1][1] || '';
            document.getElementById('SHPR_C_NAME').value = headerJson[2][1] || '';
            document.getElementById('CNEE_E_NAME').value = headerJson[3][1] || '';
            document.getElementById('CNEE_E_ADDR').value = headerJson[4][1] || '';
            document.getElementById('TO_DESC').value = headerJson[5][1] || '';
            document.getElementById('TOT_CTN').value = headerJson[6][1] || '';
            document.getElementById('DOC_CTN_UM').value = headerJson[7][1] || '';
            document.getElementById('DCL_GW').value = headerJson[8][1] || '';
            document.getElementById('DCL_NW').value = headerJson[9][1] || '';
            document.getElementById('DCL_DOC_TYPE').value = headerJson[10][1] || '';
            document.getElementById('TERMS_SALES').value = headerJson[11][1] || '';
            document.getElementById('CURRENCY').value = headerJson[12][1] || '';
            document.getElementById('CAL_IP_TOT_ITEM_AMT').value = headerJson[13][1] || '';
            document.getElementById('FRT_AMT').value = headerJson[14][1] || '';
            document.getElementById('INS_AMT').value = headerJson[15][1] || '';
            document.getElementById('ADD_AMT').value = headerJson[16][1] || '';
            document.getElementById('SUBTRACT_AMT').value = headerJson[17][1] || '';
            document.getElementById('DOC_MARKS_DESC').value = headerJson[18][1] || '';
            document.getElementById('DOC_OTR_DESC').value = headerJson[19][1] || '';
        }

        if (itemsSheet) {
            const itemsJson = XLSX.utils.sheet_to_json(itemsSheet, { header: 1 });
            fileContent = itemsJson.slice(1); // 暫存項次數據，跳過表頭
        } else {
            fileContent = null;
        }
    };

    reader.readAsArrayBuffer(file);
}

// 批量上傳項次
function uploadFile() {
    if (!fileContent) {
        alert('請先選擇文件');
        return;
    }

    // 清除原有的項次內容
    document.getElementById('item-container').innerHTML = '';

    const mergedItems = mergeItems(fileContent);
    mergedItems.forEach((row, index) => {
        addItemFromExcel(row);
    });

    fileContent = null;
    document.getElementById('file-input').value = '';
}

// 合併項次的數據
function mergeItems(data) {
    const mergedItems = [];
    let currentItem = null;

    data.forEach((row) => {
        const itemNo = row[0];
        const description = row[2];

        if (itemNo) {
            // 如果是新項次，保存當前項次並創建新項次
            if (currentItem !== null) {
                mergedItems.push(currentItem);
            }
            currentItem = {
                ITEM_NO: itemNo,
                DESCRIPTION: description || '',
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
                HAS_MAJOR_NAME: row[1] ? true : false // 根據B欄判斷是否有大品名註記
            };
        } else if (currentItem) {
            // 如果是內容行，合併到當前項次
            currentItem.DESCRIPTION += '\n' + description;
            currentItem.QTY += '\n' + (row[3] || '');
            currentItem.DOC_UM += '\n' + (row[4] || '');
            currentItem.DOC_UNIT_P += '\n' + (row[5] || '');
            currentItem.DOC_TOT_P += '\n' + (row[6] || '');
            currentItem.TRADE_MARK += '\n' + (row[7] || '');
            currentItem.CCC_CODE += '\n' + (row[8] || '');
            currentItem.ST_MTD += '\n' + (row[9] || '');
            currentItem.NET_WT += '\n' + (row[10] || '');
            currentItem.ORG_COUNTRY += '\n' + (row[11] || '');
            currentItem.ORG_IMP_DCL_NO += '\n' + (row[12] || '');
            currentItem.ORG_IMP_DCL_NO_ITEM += '\n' + (row[13] || '');
        }
    });

    // 添加最後一個項次
    if (currentItem !== null) {
        mergedItems.push(currentItem);
    }

    return mergedItems;
}

// 從 Excel 文件中新增項次
function addItemFromExcel(row) {
    itemCount++;
    const itemContainer = document.getElementById('item-container');
    const item = createItemRow({
        ITEM_NO: row.ITEM_NO ? '*' : '',
        DESCRIPTION: row.DESCRIPTION || '',
        QTY: row.QTY || '',
        DOC_UM: row.DOC_UM || '',
        DOC_UNIT_P: row.DOC_UNIT_P || '',
        DOC_TOT_P: row.DOC_TOT_P || '',
        TRADE_MARK: row.TRADE_MARK || '',
        CCC_CODE: row.CCC_CODE || '',
        ST_MTD: row.ST_MTD || '',
        NET_WT: row.NET_WT || '',
        ORG_COUNTRY: row.ORG_COUNTRY || '',
        ORG_IMP_DCL_NO: row.ORG_IMP_DCL_NO || '',
        ORG_IMP_DCL_NO_ITEM: row.ORG_IMP_DCL_NO_ITEM || '',
        HAS_MAJOR_NAME: row.HAS_MAJOR_NAME // 根據B欄決定是否勾選
    });
    itemContainer.appendChild(item);

    renumberItems();
}

// 創建項次的HTML結構
function createItemRow(data) {
    const item = document.createElement('div');
    item.className = 'item-row';
    item.innerHTML = `
        <div class="form-group fix">
            <label>${itemCount}</label>
        </div>
        <div class="form-group fix">
            <input type="checkbox" class="ITEM_NO" ${data.HAS_MAJOR_NAME ? 'checked' : ''}>
        </div>
        ${createTextareaField('DESCRIPTION', data.DESCRIPTION)}
        ${createInputField('QTY', data.QTY)}
        ${createInputField('DOC_UM', data.DOC_UM)}
        ${createInputField('DOC_UNIT_P', data.DOC_UNIT_P)}
        ${createInputField('DOC_TOT_P', data.DOC_TOT_P)}
        ${createInputField('TRADE_MARK', data.TRADE_MARK)}
        ${createInputField('CCC_CODE', data.CCC_CODE)}
        ${createInputField('ST_MTD', data.ST_MTD)}
        ${createInputField('NET_WT', data.NET_WT)}
        ${createInputField('ORG_COUNTRY', data.ORG_COUNTRY)}
        ${createInputField('ORG_IMP_DCL_NO', data.ORG_IMP_DCL_NO)}
        ${createInputField('ORG_IMP_DCL_NO_ITEM', data.ORG_IMP_DCL_NO_ITEM)}
        <div class="form-group">
            <span class="remove-item" onclick="removeItem(this)">刪除</span>
        </div>
    `;
    return item;
}

// 創建輸入框的HTML結構
function createInputField(className, value) {
    return `
        <div class="form-group">
            <input type="text" class="${className}" value="${value}">
        </div>
    `;
}

// 創建品名區域的HTML結構
function createTextareaField(className, value) {
    return `
        <div class="form-group">
            <textarea class="${className}" rows="3">${value}</textarea>
        </div>
    `;
}

// 匯出 Excel 文件
function exportToExcel() {
    const workbook = XLSX.utils.book_new();

    // 表頭數據，由上至下排列
    const headerData = [
        ["運單號", document.getElementById('LOT_NO').value],
        ["出口人統一編號", document.getElementById('SHPR_BAN_ID').value],
        ["出口人名稱", document.getElementById('SHPR_C_NAME').value],
        ["買方名稱", document.getElementById('CNEE_E_NAME').value],
        ["買方地址", document.getElementById('CNEE_E_ADDR').value],
        ["目的地(名稱)", document.getElementById('TO_DESC').value],
        ["總件數", document.getElementById('TOT_CTN').value],
        ["總件數單位", document.getElementById('DOC_CTN_UM').value],
        ["總毛重", document.getElementById('DCL_GW').value],
        ["總淨重", document.getElementById('DCL_NW').value],
        ["報單類別", document.getElementById('DCL_DOC_TYPE').value],
        ["貿易條件", document.getElementById('TERMS_SALES').value],
        ["幣別", document.getElementById('CURRENCY').value],
        ["總金額", document.getElementById('CAL_IP_TOT_ITEM_AMT').value],
        ["運費", document.getElementById('FRT_AMT').value],
        ["保險費", document.getElementById('INS_AMT').value],
        ["應加費用", document.getElementById('ADD_AMT').value],
        ["應減費用", document.getElementById('SUBTRACT_AMT').value],
        ["標記及貨櫃號碼", document.getElementById('DOC_MARKS_DESC').value],
        ["其它申報事項", document.getElementById('DOC_OTR_DESC').value]
    ];

    // 項次數據
    const itemHeaderData = [
        ["項次", "大品名註記", "品名", "數量", "單位", "單價", "金額", "商標", "稅則", "統計方式", "淨重", "生產國別", "原進口報單號碼", "原進口報單項次"]
    ];
    const itemData = [];

    document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
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
            item.querySelector('.ORG_IMP_DCL_NO_ITEM').value
        ];
        itemData.push(rowData);
    });

    // 建立表頭工作表
    const headerSheet = XLSX.utils.aoa_to_sheet(headerData);
    XLSX.utils.book_append_sheet(workbook, headerSheet, "報單表頭");

    // 建立項次工作表
    const itemsSheet = XLSX.utils.aoa_to_sheet(itemHeaderData.concat(itemData));
    XLSX.utils.book_append_sheet(workbook, itemsSheet, "報單項次");

    // 匯出Excel文件
    XLSX.writeFile(workbook, 'report.xlsx');
}

// 添加匯出 Excel 文件的按鍵事件
document.getElementById('export-to-excel').addEventListener('click', exportToExcel);

// 匯出 XML 文件
function exportToXML() {
    const headerFields = [
        'LOT_NO', 'SHPR_BAN_ID', 'SHPR_C_NAME', 'CNEE_E_NAME', 'CNEE_E_ADDR', 
        'TO_DESC', 'TOT_CTN', 'DOC_CTN_UM', 'DCL_GW', 'DCL_NW', 
        'DCL_DOC_TYPE', 'TERMS_SALES', 'CURRENCY', 'CAL_IP_TOT_ITEM_AMT', 'FRT_AMT', 
        'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT', 'DOC_MARKS_DESC', 'DOC_OTR_DESC'
    ];
    const itemFields = [
        'ITEM_NO', 'DESCRIPTION', 'QTY', 'DOC_UM', 
        'DOC_UNIT_P', 'DOC_TOT_P', 'TRADE_MARK', 'CCC_CODE', 'ST_MTD', 
        'NET_WT', 'ORG_COUNTRY', 'ORG_IMP_DCL_NO', 'ORG_IMP_DCL_NO_ITEM'
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

    let sequenceNumber = 1;

    document.querySelectorAll("#item-container .item-row").forEach(item => {
        xmlContent += '  <items>\n';
        itemFields.forEach(className => {
            let value = item.querySelector(`.${className}`);
            if (className === 'ITEM_NO') {
                value = value.checked ? '*' : '';
            } else {
                value = value.value;
            }
            if (className === 'ITEM_NO' && !value) {
                value = sequenceNumber++;
            }
            xmlContent += `    <fields>\n      <field_name>${className}</field_name>\n      <field_value>${value}</field_value>\n    </fields>\n`;
        });
        xmlContent += '  </items>\n';
    });

    xmlContent += '</detail>\n</Root>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 添加匯出 XML 文件的按鍵事件
document.getElementById('export-to-xml').addEventListener('click', exportToXML);

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
                ["運單號", document.getElementById('LOT_NO').value],
                ["出口人統一編號", document.getElementById('SHPR_BAN_ID').value],
                ["出口人名稱", document.getElementById('SHPR_C_NAME').value],
                ["買方名稱", document.getElementById('CNEE_E_NAME').value],
                ["買方地址", document.getElementById('CNEE_E_ADDR').value],
                ["目的地(名稱)", document.getElementById('TO_DESC').value],
                ["總件數", document.getElementById('TOT_CTN').value],
                ["總件數單位", document.getElementById('DOC_CTN_UM').value],
                ["總毛重", document.getElementById('DCL_GW').value],
                ["總淨重", document.getElementById('DCL_NW').value],
                ["報單類別", document.getElementById('DCL_DOC_TYPE').value],
                ["貿易條件", document.getElementById('TERMS_SALES').value],
                ["幣別", document.getElementById('CURRENCY').value],
                ["總金額", document.getElementById('CAL_IP_TOT_ITEM_AMT').value],
                ["運費", document.getElementById('FRT_AMT').value],
                ["保險費", document.getElementById('INS_AMT').value],
                ["應加費用", document.getElementById('ADD_AMT').value],
                ["應減費用", document.getElementById('SUBTRACT_AMT').value],
                ["標記及貨櫃號碼", document.getElementById('DOC_MARKS_DESC').value],
                ["其它申報事項", document.getElementById('DOC_OTR_DESC').value]
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

            const itemHeader = ["項次", "大品名註記", "品名", "數量", "單位", "單價", "金額", "商標", "稅則", "統計方式", "淨重", "生產國別", "原進口報單號碼", "原進口報單項次"];
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
                    item.querySelector('.ORG_IMP_DCL_NO_ITEM').value
                ];
                rowData.forEach((field, i) => {
                    const x = i % 2 === 0 ? 10 : 110; // 根據索引偶數放左邊，奇數放右邊
                    doc.text(`${itemHeader[i]}: ${field}`, x, y);
                    if (i % 2 === 1) { // 每次奇數索引增加 y
                        y += 10;
                        if (y > 270) { // 判斷是否需要換頁
                            doc.addPage();
                            y = 10; // 重置 y 座標
                        }
                    }
                });
                y += 10; // 每個項次結束後增加 y
            });

            // 保存 PDF
            doc.save('report.pdf');
        })
        .catch(error => console.error('讀取字體文件失敗:', error));
}

// 添加出口報單預覽的按鍵事件
document.getElementById('export-to-pdf').addEventListener('click', exportToPDF);
