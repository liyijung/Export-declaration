// 轉檔客戶 - 27951609 群聯電子股份有限公司竹南分公司
function importCustomer27951609(event) {

    // 先清空現有數據
    clearExistingData();
    
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 使用 TextDecoder 指定 Big5 編碼來解碼 ArrayBuffer
            const decoder = new TextDecoder('big5'); // 如果是 Big5 編碼，使用 'big5'
            const decodedResult = decoder.decode(e.target.result);

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(decodedResult, "application/xml");

            // 解析 DeclarationForm
            const declarationForm = xmlDoc.getElementsByTagName("Invoice")[0];

            if (declarationForm) {
                const headerMapping = {
                    SHIPPER_COMPANY_NAME: 'SHPR_E_NAME',
                    SHIPPER_ADDR: 'SHPR_E_ADDR',
                    SHIPPER_CNAME: 'SHPR_C_NAME',
                    SHIPPER_CADDR: 'SHPR_C_ADDR',
                    SHIPPER_UNINO: 'SHPR_BAN_ID',
                    SOLD_TO_NAME: 'CNEE_E_NAME',
                    SOLD_TO_ADDR: 'CNEE_E_ADDR',
                    SOLD_TO_COUNTRY_ID: 'CNEE_COUNTRY_CODE',
                    SHIP_TO_NAME: 'BUYER_E_NAME',
                    SHIP_TO_ADDR: 'BUYER_E_ADDR',
                    INV_ID: 'DOC_OTR_DESC',
                    CURRENCY_ID: 'CURRENCY',
                    TOT_GROSS_WEIGHT: 'DCL_GW',
                    TOT_NET_WEIGHT: 'DCL_NW',
                    DLY_TERM1: 'TERMS_SALES',
                    AWB_ID: 'LOT_NO',                    
                    SHIPMARK: 'DOC_MARKS_DESC',
                };

                // 解析表頭資料
                Object.keys(headerMapping).forEach(xmlField => {
                    const formField = headerMapping[xmlField];
                    const element = document.getElementById(formField);
                    let value = declarationForm.getElementsByTagName(xmlField)[0]?.textContent || '';

                    // 將 TOT_GROSS_WEIGHT, TOT_NET_WEIGHT 為 0 時設為空
                    if (['TOT_GROSS_WEIGHT', 'TOT_NET_WEIGHT'].includes(xmlField) && value === '0.000') {
                        value = '';
                    }

                    // 替換貿易條件
                    if (['DLY_TERM1'].includes(xmlField) && value === 'DAP') {
                        value = 'CFR';
                    }

                    if (element) {
                        element.value = unescapeXml(value);
                    }
                });
            }

            // 解析 DeclarationForm
            const CLEARANCE_TYPE = xmlDoc.getElementsByTagName("Item")[0];

            if (CLEARANCE_TYPE) {
                const headerMapping = {
                    CLEARANCE_TYPE: 'DCL_DOC_TYPE',
                };

                // 報單類別
                Object.keys(headerMapping).forEach(xmlField => {
                    const formField = headerMapping[xmlField];
                    const element = document.getElementById(formField);
                    let value = declarationForm.getElementsByTagName(xmlField)[0]?.textContent || '';

                    if (element) {
                        element.value = unescapeXml(value);
                    }
                });
            }

            // 解析項次資料
            const newItems = declarationForm.getElementsByTagName("Item");
            const itemContainer = document.getElementById('item-container');
            itemContainer.innerHTML = ''; // 清空現有項次

            if (newItems) {
                const itemMapping = {
                    DUTY_QTY: 'QTY',
                    DUTY_QTYU: 'DOC_UM',
                    UNIT_AMT: 'DOC_UNIT_P',
                    FOB_OVS: 'DOC_TOT_P',
                    BRAND: 'TRADE_MARK',
                    CCC_CODE: 'CCC_CODE',
                    STATISTIC_TYPE: 'ST_MTD',
                    WIDE_UM: 'WIDE_UM',
                    LENGTH_UM: 'LENGTH_UM',
                    ST_UM: 'ST_UM',
                };

                Array.from(newItems).forEach((item) => {

                    const itemData = {};

                    // 合併 BY_COMMNO, CUST_PN, DESCP 到 DESCRIPTION 並換行
                    const description = [
                        item.getElementsByTagName("BY_COMMNO")[0]?.textContent || '',
                        item.getElementsByTagName("CUST_PN")[0]?.textContent || '',
                        item.getElementsByTagName("DESCP")[0]?.textContent || ''
                    ].filter(Boolean).join('\n');  // 使用換行符分隔每個值
                
                    itemData['DESCRIPTION'] = description;

                    // 解析其他項次資料
                    Object.keys(itemMapping).forEach(xmlField => {
                        const formField = itemMapping[xmlField];
                        let value = item.getElementsByTagName(xmlField)[0]?.textContent || '';
                            
                        // 替換商標
                        if (xmlField === 'BRAND' && value === 'N/B') {
                            value = 'NO BRAND';
                        }

                        itemData[formField] = value;
                    });
                
                    const itemRow = createItemRow(itemData);
                    itemContainer.appendChild(itemRow);
                });
            }
            
            initializeListeners();
            renumberItems(); // 重新編號所有項次
            updateFieldVisibility(); // 更新欄位顯示
            handleCheck(); // 長期委任字號
        };

        // 使用 readAsArrayBuffer 讀取檔案以便 TextDecoder 使用
        reader.readAsArrayBuffer(file);
    }
}
