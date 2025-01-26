// 轉檔客戶 - 22099408 台灣光罩股份有限公司
function importCustomer22099408(event) {

    // 先清空現有數據
    clearExistingData();
    
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "application/xml");

            // 定義全局變數 appType
            let appType = '';
            
            // 定義唯一的 ExportPermitNo077 集合
            const uniqueExportPermitNos = new Set();
            const uniqueCommodityNos = new Set();

            // 定義 ExportPermitNo077 與對應的稅則、出口管制貨品號碼、貨品名稱
            const exportPermitMappings = {
                'FTSI11W0000079': { //有效期限 Expiration Date: 2025/03/21
                    '1': ['37050000306', '3B001', 'PHOTOMASK'],
                    '2': ['90029090002', '3B001', 'PHOTOMASK']
                },
                // 可擴充更多戰略性高科技貨品輸出許可證的對應內容
            };

            // 解析 DeclarationForm
            const declarationForm = xmlDoc.getElementsByTagName("DeclarationForm")[0];
            if (declarationForm) {
                const headerMapping = {
                    Hawb: 'LOT_NO',
                    AppType: 'DCL_DOC_TYPE',
                    CurrencyCode: 'CURRENCY',
                    FlightFee: 'FRT_AMT',
                    InsuranceFee: 'INS_AMT',
                    AddFee: 'ADD_AMT',
                    SubFee: 'SUBTRACT_AMT',
                    IncoTerm: 'TERMS_SALES',
                    DestCty: 'CNEE_COUNTRY_CODE',
                    TotPce: 'TOT_CTN',
                    TotGrs: 'DCL_GW',
                    Mark: 'DOC_MARKS_DESC',
                    Other: 'DOC_OTR_DESC',
                    ShipperAcct: 'SHPR_BAN_ID',
                    ShipperCtm: 'SHPR_BONDED_ID',
                    ShipperCname: 'SHPR_C_NAME',
                    ShipperEname: 'SHPR_E_NAME',
                    ShipperCaddr: 'SHPR_C_ADDR',
                    ShipperEaddr1: 'SHPR_E_ADDR',
                    ConsigneeName: 'CNEE_E_NAME',
                    ConsigneeAddr1: 'CNEE_E_ADDR',
                    FobFor: 'CAL_IP_TOT_ITEM_AMT',
                    TotalNW076: 'DCL_NW',
                    DOC_CTN_UM: 'DOC_CTN_UM', // 默認設為 'CTN'
                };

                // 解析表頭資料
                Object.keys(headerMapping).forEach(xmlField => {
                    const formField = headerMapping[xmlField];
                    const element = document.getElementById(formField);
                    let value = declarationForm.getElementsByTagName(xmlField)[0]?.textContent || '';

                    // 替換 Mark 中的 || 為換行符
                    if (xmlField === 'Mark') {
                        value = value.replace(/\|\|/g, '\n');
                    }

                    // 將 FlightFee, InsuranceFee, AddFee, SubFee 為 0 時設為空
                    if (['FlightFee', 'InsuranceFee', 'AddFee', 'SubFee'].includes(xmlField) && value === '0') {
                        value = '';
                    }

                    // DOC_CTN_UM，默認設為 'CTN'
                    if (formField === 'DOC_CTN_UM' && !value) {
                        value = 'CTN';
                    }

                    // 獲取 ConsigneeName 值
                    const consigneeNameElement = declarationForm.getElementsByTagName('ConsigneeName')[0];
                    if (consigneeNameElement) {
                        const consigneeName = consigneeNameElement.textContent || '';
                
                        // 判斷 ConsigneeName 是否包含 'Wuxi'
                        if (consigneeName.includes('Wuxi')) {
                            headerMapping['TO_CODE'] = 'CNWUX';
                            headerMapping['TO_DESC'] = 'Wuxi';
                
                            // 更新網頁上的輸入欄位
                            document.getElementById('TO_CODE').value = headerMapping['TO_CODE'];
                            document.getElementById('TO_DESC').value = headerMapping['TO_DESC'];
                            console.log('TO_CODE 和 TO_DESC 已成功載入');
                        } else {
                            console.log('ConsigneeName 不包含 Wuxi');
                        }
                    } else {
                        console.log('ConsigneeName 標籤未找到');
                    }
                    
                    // 在處理項次時，收集唯一的 ExportPermitNo077 和對應的出口管制貨品號碼
                    const newItems = declarationForm.getElementsByTagName("Item");
                    Array.from(newItems).forEach(item => {
                        const exportPermitNo = item.getElementsByTagName("ExportPermitNo077")[0]?.textContent || '';
                        const exPermitNoItem = item.getElementsByTagName("ExPermitNoItem077")[0]?.textContent || '';

                        // 組合 ExportPermitNo077 和 ExPermitNoItem077 作為唯一標識
                        const permitIdentifier = `${exportPermitNo}-${exPermitNoItem}`;

                        if (exportPermitNo && exPermitNoItem && !uniqueExportPermitNos.has(permitIdentifier)) {
                            uniqueExportPermitNos.add(permitIdentifier);  // 添加唯一的許可證號碼和項次
                
                            // 獲取對應的出口管制貨品號碼
                            const exportControlCommodityNo = exportPermitMappings[exportPermitNo] && exportPermitMappings[exportPermitNo][exPermitNoItem] 
                                ? exportPermitMappings[exportPermitNo][exPermitNoItem][1] 
                                : '';  // 確保獲取正確的出口管制貨品號碼
                            
                            if (exportControlCommodityNo) {
                                uniqueCommodityNos.add(exportControlCommodityNo);  // 添加唯一的出口管制貨品號碼
                            }
                        }
                    });
                    
                    // 如果是 Other 欄位，根據唯一的 ExportPermitNo077 和 ExPermitNoItem077 的組合動態添加內容
                    if (xmlField === 'Other') {
                        value += `\n戰略性高科技貨品`;

                        // 添加唯一的輸出許可證號碼
                        uniqueExportPermitNos.forEach(permitNo => {
                            const [exportPermitNo] = permitNo.split('-');
                            value += `\n輸出許可證號碼 Export Permit No.: ${exportPermitNo}`;

                            // 獲取對應的出口管制貨品號碼
                            const exPermitNoItem = permitNo.split('-')[1];  // 獲取項次
                            const exportControlCommodityNo = exportPermitMappings[exportPermitNo] && exportPermitMappings[exportPermitNo][exPermitNoItem]
                                ? exportPermitMappings[exportPermitNo][exPermitNoItem][1]
                                : '';  // 獲取出口管制貨品號碼

                            if (exportControlCommodityNo) {
                                value += `\n出口管制貨品號碼 Export Control Commodity NO.: ${exportControlCommodityNo}`;  // 添加出口管制貨品號碼
                            }
                        });
                    }

                    if (element) {
                        element.value = unescapeXml(value);
                    }
                });

                // 獲取 AppType 的值
                appType = declarationForm.getElementsByTagName("AppType")[0]?.textContent || '';
                if (appType === 'G5' || appType === 'G3') {
                    document.getElementById('SHPR_BONDED_ID').value = '';  // 清空 SHPR_BONDED_ID
                }
            }

            // 合併多個 ShipperEaddr 欄位
            const shipperAddr = [
                declarationForm.getElementsByTagName("ShipperEaddr1")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ShipperEaddr2")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ShipperEaddr3")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ShipperEaddr4")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ShipperEaddr5")[0]?.textContent || ''
            ].filter(Boolean).join('');

            document.getElementById('SHPR_E_ADDR').value = unescapeXml(shipperAddr);

            // 合併多個 ConsigneeAddr 欄位
            const consigneeAddr = [
                declarationForm.getElementsByTagName("ConsigneeAddr1")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ConsigneeAddr2")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ConsigneeAddr3")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ConsigneeAddr4")[0]?.textContent || '',
                declarationForm.getElementsByTagName("ConsigneeAddr5")[0]?.textContent || ''
            ].filter(Boolean).join('');

            document.getElementById('CNEE_E_ADDR').value = unescapeXml(consigneeAddr);

            // 解析項次資料
            const newItems = declarationForm.getElementsByTagName("Item");
            const itemContainer = document.getElementById('item-container');
            itemContainer.innerHTML = ''; // 清空現有項次

            if (newItems) {
                const itemMapping = {
                    ItemNo: 'ITEM_NO',
                    ItemQTY: 'QTY',
                    ItemUnit: 'DOC_UM',
                    ItemUnitPrice: 'DOC_UNIT_P',
                    ItemForAmt: 'DOC_TOT_P',
                    ItemCCCCode: 'CCC_CODE',
                    ItemStcWay: 'ST_MTD',
                    ItemNetWgt: 'NET_WT',
                    ItemOffCD1: 'BOND_NOTE',
                    ExportPermitNo077: 'EXP_NO',
                    ExPermitNoItem077: 'EXP_SEQ_NO',
                    WIDE_UM: 'WIDE_UM',
                    LENGTH_UM: 'LENGTH_UM',
                    ST_UM: 'ST_UM',
                    TRADE_MARK: 'TRADE_MARK', // 默認設為 'NO BRAND'
                };

                Array.from(newItems).forEach((item, index) => {
                    const itemData = {};

                    // 獲取 ItemNo 項次
                    const itemNo = item.getElementsByTagName("ItemNo")[0]?.textContent || (index + 1); // 如果沒有 ItemNo，則使用迭代索引作為項次

                    // 獲取 ItemCCCCode 欄位的值
                    let cccCode = item.getElementsByTagName("ItemCCCCode")[0]?.textContent || '';
                
                    // 去除 cccCode 中的 . 和 - 符號
                    cccCode = cccCode.replace(/[.-]/g, '');

                    // 合併 MainGoodsDesc077, ItemSoNo, ItemName 到 DESCRIPTION 並換行
                    const description = [
                        item.getElementsByTagName("MainGoodsDesc077")[0]?.textContent || '',
                        item.getElementsByTagName("ItemSoNo")[0]?.textContent || '',
                        item.getElementsByTagName("ItemName")[0]?.textContent || ''
                    ].filter(Boolean).join('\n');  // 使用換行符分隔每個值
                
                    // 根據 ExportPermitNo077 和 ExPermitNoItem077 值動態處理 description
                    const exportPermitNo = item.getElementsByTagName("ExportPermitNo077")[0]?.textContent || '';
                    const exPermitNoItem = item.getElementsByTagName("ExPermitNoItem077")[0]?.textContent || '';
                
                    // 檢查 ExportPermitNo 是否存在於 exportPermitMappings 中
                    if (!exportPermitMappings[exportPermitNo]) {
                        
                        // 如果找不到對應的 ExportPermitNo，顯示彈跳框提示
                        alert(`【請留意！】\nNO ${itemNo} - 品名（含出口管制貨品號碼）、稅則、輸出許可號碼、輸出許可項次，請依輸出許可證 ${exportPermitNo} 內容繕打。`);
                        itemData['DESCRIPTION'] = description;  // 保持原來的 description
                    
                    } else if (exportPermitMappings[exportPermitNo] && exportPermitMappings[exportPermitNo][exPermitNoItem]) {
                        
                        // 判斷是否存在對應的出口管制貨品號碼
                        const lines = description.split('\n');  // 拆分為多行
                
                        // 獲取對應的稅則號碼、出口管制貨品號碼和預期的貨品名稱
                        let [taxCode, exportControlCommodityNo, expectedDescription] = exportPermitMappings[exportPermitNo][exPermitNoItem];

                        // 去除 taxCode 中的 . 和 - 符號
                        taxCode = taxCode.replace(/[.-]/g, '');

                        // 檢查 ItemCCCCode 與 exportPermitMappings 中的稅則號碼是否相符
                        if (cccCode !== taxCode) {
                            // 彈跳框顯示錯誤訊息
                            alert(`【請留意！】\nNO ${itemNo} - 稅則，請依輸出許可證 ${exportPermitNo} 內容繕打。`);
                        }
                        
                        // 檢查第一行是否與 expectedDescription 相符
                        if (lines[0] && lines[0].trim() === expectedDescription) {
                            // 如果第一行與 expectedDescription 相符，將出口管制貨品號碼插入到第一行後面並換行
                            lines[0] = lines[0] + '\n' + exportControlCommodityNo;  // 插入到第一行末尾
                        } else {
                            // 如果第一行不相符，先插入預期的品名，再將出口管制貨品號碼插入到第一行後面
                            lines.unshift(expectedDescription + '\n' + exportControlCommodityNo);  // 插入到第一行
                        }
                
                        // 保證最後一行後也有換行
                        itemData['DESCRIPTION'] = lines.join('\n') + '\n';  // 合併回去並保證最後有換行符
                    } else {
                        itemData['DESCRIPTION'] = description;  // 如果不符合條件，保持原來的 description
                    }
                
                    // 解析其他項次資料
                    Object.keys(itemMapping).forEach(xmlField => {
                        const formField = itemMapping[xmlField];
                        itemData[formField] = item.getElementsByTagName(xmlField)[0]?.textContent || '';
                
                        // 如果 AppType 是 'G5' 或 'G3'，則將 BOND_NOTE 強制設為空
                        if ((appType === 'G5' || appType === 'G3') && formField === 'BOND_NOTE') {
                            itemData[formField] = '';  // 將 BOND_NOTE 設為空
                        }

                        // TRADE_MARK，默認設為 'NO BRAND'
                        if (formField === 'TRADE_MARK' && !itemData[formField]) {
                            itemData[formField] = 'NO BRAND';
                        }
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
        reader.readAsText(file);
    }
}
