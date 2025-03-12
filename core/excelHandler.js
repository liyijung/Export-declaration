// 匯入Excel的功能
function importToExcel(event) {
    clearField(); // 清空輸入框內容
    
    // 清空 calculation-status
    document.getElementById('calculation-status').value = "";
    
    const file = event.target.files[0];
    
    // 提取檔名中【】內的文字
    const matchRemark = file.name.match(/【(.*?)】/);
    let fileRemark = matchRemark ? matchRemark[1] : ''; // 若無則回傳空字串
    
    const generalWarehouseCheckbox = document.getElementById('general-warehouse');
    
    // 如果含 "一般倉，" 則去除，並勾選一般倉
    if (fileRemark.includes("一般倉，")) {
        fileRemark = fileRemark.replace("一般倉，", "").trim(); // 移除 "一般倉，"
        generalWarehouseCheckbox.checked = true; // 勾選一般倉
    } else if (fileRemark.includes("一般倉")) {
        fileRemark = fileRemark.replace("一般倉", "").trim(); // 移除 "一般倉"
        generalWarehouseCheckbox.checked = true;
    } else {
        generalWarehouseCheckbox.checked = false; // 取消勾選
    }
    
    // 設定到 REMARK 欄位
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

                    // 當 DCL_DOC_TYPE 為 'F5' 時，自動勾選一般倉
                    if (id === 'DCL_DOC_TYPE' && value === 'F5') {
                        const generalWarehouseCheckbox = document.getElementById('general-warehouse');
                        if (generalWarehouseCheckbox) {
                            generalWarehouseCheckbox.checked = true;
                        }
                    }
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
        updateCneeCNameVisibility();
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

// 匯出Excel的功能
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
    const generalWarehouseChecked = document.getElementById('general-warehouse').checked;

    // 處理 remarkElement，若勾選一般倉，則加在前面
    let remarkText = remarkElement;
    if (generalWarehouseChecked) {
        remarkText = remarkText ? `一般倉，${remarkText}` : '一般倉';
    }
    
    // 根據不同情境組合檔名
    let exportFileName = '';
    
    if (fileName && exporterName && remarkText) {
        exportFileName = `${fileName}-${exporterName}【${remarkText}】.xlsx`;
    } else if (fileName && exporterName) {
        exportFileName = `${fileName}-${exporterName}.xlsx`;
    } else if (fileName && remarkText) {
        exportFileName = `${fileName}【${remarkText}】.xlsx`;
    } else if (exporterName && remarkText) {
        exportFileName = `${exporterName}【${remarkText}】.xlsx`;
    } else if (fileName) {
        exportFileName = `${fileName}.xlsx`;
    } else if (exporterName) {
        exportFileName = `${exporterName}.xlsx`;
    } else if (remarkText) {
        exportFileName = `【${remarkText}】.xlsx`;
    } else {
        exportFileName = 'export.xlsx';
    }

    // 下載 Excel 文件
    XLSX.writeFile(workbook, exportFileName);
}
