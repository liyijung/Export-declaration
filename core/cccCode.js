// 處理 CCC_CODE 欄位按 Enter 鍵的功能
function handleCCCCodeEnter(event, inputElement) {
    if (!inputElement || !inputElement.value.trim()) return; // 確保 inputElement 存在且有值
    if (event.key === 'Enter') {
        event.preventDefault();
        openTaxModal(inputElement); // 打開彈跳框
        searchTariff(inputElement, true); // 查詢稅則數據

        let keyword = inputElement.value.toLowerCase().replace(/[.\-\s]/g, ''); // 移除 '.'、'-' 以及所有的空格
        if (keyword.length === 11) { // 確保輸入完整
            // 延遲檢查 `highlight-ccc` 是否已套用
            setTimeout(() => {
                if (inputElement.classList.contains("highlight-ccc") && !isWarningToastVisible) {
                    isWarningToastVisible = true; // 避免重複觸發

                    iziToast.warning({
                        title: "注意",
                        message: "請查看稅則輸出規定",
                        position: "topRight",
                        timeout: 3000,
                        backgroundColor: '#ffeb3b',
                        onClosing: function() {
                            isWarningToastVisible = false; // 當 `iziToast` 關閉時，允許新的 `iziToast`
                        }
                    });
                }
            }, 100); // 延遲確保 `highlight-ccc` 樣式已經套用
        }
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

let importRegData = {};
let exportRegData = {};
let taxRegData = {};

// 讀取輸入規定對應表
fetch('./Reg/IReg.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        importRegData = parseCSVToObject(data);
        console.log('輸入規定數據已加載:', importRegData);
    })
    .catch(error => console.error('載入 IReg.csv 錯誤:', error));

// 讀取輸出規定對應表
fetch('./Reg/EReg.csv')
    .then(response => response.text())
    .then(data => {
        exportRegData = parseCSVToObject(data);
        console.log('輸出規定數據已加載', exportRegData);
    })
    .catch(error => console.error('載入 EReg.csv 錯誤:', error));

// 讀取稽徵規定對應表
fetch('./Reg/TaxReg.csv')
    .then(response => response.text())
    .then(data => {
        taxRegData = parseCSVToObject(data);
        console.log('稽徵規定數據已加載:', taxRegData);
    })
    .catch(error => console.error('載入 TaxReg.csv 錯誤:', error));

// 解析 CSV 轉換為物件
function parseCSVToObject(csvData) {
    const lines = csvData.split(/\r?\n/);
    const result = {};

    lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return; // 跳過表頭或空行

        // 使用正則表達式來解析包含逗號與雙引號的值
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);

        if (values && values.length >= 3) {
            let code = values[0].trim();
            let zhDesc = values[1].trim().replace(/^"|"$/g, '').replace(/""/g, '"');  // 去除頭尾引號並處理內部雙引號

            result[code] = {
                '規定中文說明': zhDesc || '',
            };
        }
    });

    return result;
}
    
function searchTariff(inputElement, isModal = false) {
    let keyword = inputElement.value.toLowerCase();
    keyword = keyword.replace(/[.\-\s]/g, ''); // 移除 '.'、'-' 以及所有的空格
    const resultsDiv = isModal ? document.getElementById('modal-results') : document.getElementById('results');
    resultsDiv.innerHTML = '';

    // 加入提示訊息
    const hint = document.createElement('p');
    hint.textContent = '【可使用上下鍵移動並按Enter選取或點選稅則，按Esc取消】';
    hint.style.fontWeight = 'bold';
    hint.style.color = '#0000b7'; // 自定義提示訊息顏色
    resultsDiv.appendChild(hint);

    const results = window.taxData.filter(item => {
        const cleanedItemCode = item['貨品分類號列'].toString().toLowerCase().replace(/[.\-\s]/g, '');
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

                        // 將 item['統計數量單位'] 和 QTY 的值填入同一項次的 ST_QTY 和 ST_UM 欄位
                        const itemRow = inputElement.closest('.item-row');
                        
                        let qty, docum, stqty, stum, netwt, wide, wideum, lengt, lengthum, wideV = 0, lengtV = 0;

                        // 根據是否有 itemRow 來選擇欄位來源
                        if (itemRow) {
                            // 選取項次內的欄位
                            qty = itemRow.querySelector('.QTY');
                            docum = itemRow.querySelector('.DOC_UM');
                            stqty = itemRow.querySelector('.ST_QTY');
                            stum = itemRow.querySelector('.ST_UM');
                            netwt = itemRow.querySelector('.NET_WT');
                            wide = itemRow.querySelector('.WIDE');
                            wideum = itemRow.querySelector('.WIDE_UM');
                            lengt = itemRow.querySelector('.LENGT_');
                            lengthum = itemRow.querySelector('.LENGTH_UM');
                            cccCode = itemRow.querySelector('.CCC_CODE');
                        } else {
                            // 選取彈跳框中的欄位
                            qty = document.getElementById('QTY');
                            docum = document.getElementById('DOC_UM');
                            stqty = document.getElementById('ST_QTY');
                            stum = document.getElementById('ST_UM');
                            netwt = document.getElementById('NET_WT');
                            wide = document.getElementById('WIDE');
                            wideum = document.getElementById('WIDE_UM');
                            lengt = document.getElementById('LENGT_');
                            lengthum = document.getElementById('LENGTH_UM');
                            cccCode = document.getElementById('CCC_CODE');
                        }

                        // 填入數據
                        if (item['統計數量單位']) {
                            if (stqty && qty && docum && stqty.value === '') {
                                if (docum.value === item['統計數量單位']) {
                                    stqty.value = qty.value;
                                } else if (docum.value === 'SET' && item['統計數量單位'] === 'PCE') {
                                    stqty.value = qty.value;
                                } else if (docum.value === 'PCE' && item['統計數量單位'] === 'SET') {
                                    stqty.value = qty.value;
                                } else if (docum.value === 'EAC' && item['統計數量單位'] === 'PCE') {
                                    // 獲取 SHPR_BAN_ID 欄位值
                                    const shprBanIdElement = document.getElementById('SHPR_BAN_ID');
                                    const shprBanId = shprBanIdElement ? shprBanIdElement.value : '';

                                    // 判斷 SHPR_BAN_ID 是否為指定的例外值
                                    const exceptionIds = [
                                        '22099174', // 元隆電子股份有限公司
                                        '27890054', // 碩呈科技股份有限公司
                                    ];
                                    if (exceptionIds.includes(shprBanId)) {
                                        stqty.value = ''; // 不執行計算，清空 ST_QTY
                                    } else {
                                        stqty.value = qty.value; // 正常計算
                                    }
                                } else if (docum.value === 'SHE' && item['統計數量單位'] === 'PCE') {
                                    stqty.value = qty.value;
                                } else if (docum.value === 'NPR' && item['統計數量單位'] === 'PCE') {
                                    stqty.value = new Decimal(qty.value).times(2).toDecimalPlaces(2).toString();
                                } else if (docum.value === 'KPC' && item['統計數量單位'] === 'PCE') {
                                    stqty.value = new Decimal(qty.value).times(1000).toDecimalPlaces(2).toString();
                                } else if (docum.value === 'PCE' && item['統計數量單位'] === 'DZN') {
                                    stqty.value = new Decimal(qty.value).div(12).toDecimalPlaces(2).toString();
                                } else if (docum.value === 'KPC' && item['統計數量單位'] === 'DZN') {
                                    stqty.value = new Decimal(qty.value).times(1000).div(12).toDecimalPlaces(2).toString();
                                } else if (item['統計數量單位'] === 'KGM') {
                                    stqty.value = netwt.value;
                                } else if (item['統計數量單位'] === 'MTK') {
                                    // 轉換寬度單位
                                    if (wideum.value === 'MTR') wideV = wide.value * 1
                                    if (wideum.value === 'YRD') wideV = wide.value * 0.9144
                                    if (wideum.value === 'INC') wideV = wide.value * 0.0254

                                    // 轉換長度單位
                                    if (lengthum.value === 'MTR') lengtV = lengt.value * 1
                                    if (lengthum.value === 'YRD') lengtV = lengt.value * 0.9144
                                    if (lengthum.value === 'INC') lengtV = lengt.value * 0.0254

                                    // 計算面積並四捨五入到小數點第 2 位
                                    if (wideV > 0 && lengtV > 0) {
                                        stqty.value = (wideV * lengtV).toFixed(2);
                                    }
                                }
                            }
                            if (stum) stum.value = item['統計數量單位'];
                        } else {
                            // 如果 '統計數量單位' 為空，將 ST_QTY 和 ST_UM 設置為空
                            if (stqty) stqty.value = '';
                            if (stum) stum.value = '';
                        }

                        if (cccCode) {
                            let exportReg = item['輸出規定'] ? item['輸出規定'].trim() : '';
                            let exportRegList = exportReg.split(/\s+/).filter(reg => reg); // 過濾掉空白項目
                    
                            // 取得目的地代碼（TO_CODE）
                            const toCodeElement = document.getElementById("TO_CODE");
                            const toCode = toCodeElement ? toCodeElement.value.trim().toUpperCase() : '';
                            const toCodePrefix = toCode.slice(0, 2); // 取得前兩碼
                    
                            // 是否符合條件
                            const conditionS01 = exportRegList.includes("S01") && toCodePrefix === "KP";
                            const conditionS03 = exportRegList.includes("S03") && toCodePrefix === "IR";
                            const conditionS04 = exportRegList.includes("S04") && toCodePrefix === "IR";
                            const condition445 = exportRegList.includes("445") && toCodePrefix === "JP";
                            const condition446 = exportRegList.includes("446") && toCodePrefix === "JP";
                            const condition447 = exportRegList.includes("447") && toCodePrefix === "JP";
                    
                            // 若包含其他輸出規定 (不只是 S01、S03、S04、445、446、447)，也要高亮
                            const hasOtherReg = exportRegList.some(reg => !["S01", "S03", "S04", "445", "446", "447"].includes(reg));
                    
                            // 最終判斷是否高亮
                            const shouldHighlight = exportRegList.length > 0 && 
                            (conditionS01 || conditionS03 || conditionS04 || condition445 || condition446 || condition447 || hasOtherReg);
                    
                            if (shouldHighlight) {
                                cccCode.classList.add("highlight-ccc");
                            } else {
                                cccCode.classList.remove("highlight-ccc");
                            }
                        }

                        // 更新欄位顯示狀態
                        closeTaxModal();
                        inputElement.focus(); // 選中項目後焦點返回輸入框
                        searchTariff(inputElement);
                    });
                }

                if (header === '輸入規定') {
                    const regCode = item['輸入規定'] ? item['輸入規定'].trim() : '';
                    td.textContent = regCode || '';
                
                    td.addEventListener('mouseover', function(event) {
                        const regInfo = getRegInfo(regCode, importRegData, '輸入規定');
                        if (regInfo) {
                            showTooltip(event, regInfo);
                        }
                    });
                
                    td.addEventListener('mouseout', hideTooltip);
                }
                
                if (header === '輸出規定') {
                    const regCode = item['輸出規定'] ? item['輸出規定'].trim() : '';
                    td.textContent = regCode || '';
                
                    td.addEventListener('mouseover', function(event) {
                        const regInfo = getRegInfo(regCode, exportRegData, '輸出規定');
                        if (regInfo) {
                            showTooltip(event, regInfo);
                        }
                    });
                
                    td.addEventListener('mouseout', hideTooltip);
                }
                
                if (header === '稽徵規定') {
                    const regCode = item['稽徵規定'] ? item['稽徵規定'].trim() : '';
                    td.textContent = regCode || '';

                    td.addEventListener('mouseover', function(event) {
                        const regInfo = getRegInfo(regCode, taxRegData, '稽徵規定');
                        if (regInfo) {
                            showTooltip(event, regInfo);
                        }
                    });

                    td.addEventListener('mouseout', hideTooltip);
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

// 處理 CCC_CODE 欄位輸入事件，即時查詢稅則數據
let isWarningToastVisible = false; // 控制 `iziToast.warning` 是否已經顯示
function handleCCCCodeInput(event, inputElement) {
    let keyword = inputElement.value.toLowerCase().replace(/[.\-\s]/g, ''); // 移除 '.'、'-' 以及所有的空格
    if (keyword) {
        updateTariff(inputElement, keyword); // 查詢稅則數據並即時更新

        if (keyword.length === 11) { // 確保輸入完整
            // 檢查輸出規定，決定是否顯示警告
            setTimeout(() => {
                if (inputElement.classList.contains("highlight-ccc") && !isWarningToastVisible) {
                    isWarningToastVisible = true; // 標記為正在顯示

                    iziToast.warning({
                        title: "注意",
                        message: "請查看稅則輸出規定",
                        position: "topRight",
                        timeout: 3000,
                        backgroundColor: '#ffeb3b',
                        onClosing: function() {
                            isWarningToastVisible = false; // 當 `iziToast` 關閉時，允許新的 `iziToast`
                        }
                    });
                }
            }, 100); // 延遲確保 `highlight-ccc` 樣式已經套用
        }
    } else {
        clearFields(inputElement); // 當輸入為空時清空欄位
    }
}

function updateTariff(inputElement, keyword = '') {
    // 確認 keyword 是否為 11 位數字
    if (keyword.length !== 11) {
        clearFields(inputElement); // 如果 keyword 不是 11 位，清空相關欄位
        return;
    }

    const results = window.taxData.filter(item => {
        const cleanedItemCode = item['貨品分類號列'].toString().toLowerCase().replace(/[.\-\s]/g, '');
        return cleanedItemCode.startsWith(keyword);
    });

    if (results.length > 0) {
        const item = results[0]; // 取首個匹配結果
        updateFields(inputElement, item); // 更新欄位
    } else {
        clearFields(inputElement); // 若無匹配結果，清空相關欄位
    }
}

// 更新 QTY、DOC_UM、ST_QTY 和 ST_UM 欄位
function updateFields(inputElement, item) {
    const formattedCode = formatCode(item['貨品分類號列'].toString());
    inputElement.value = formattedCode; // 填入關鍵字欄位

    // 將 item['統計數量單位'] 和 QTY 的值填入同一項次的 ST_QTY 和 ST_UM 欄位
    const itemRow = inputElement.closest('.item-row');

    let qty, docum, stqty, stum, netwt, wide, wideum, lengt, lengthum, wideV = 0, lengtV = 0;;

    // 根據是否有 itemRow 來選擇欄位來源
    if (itemRow) {
        // 選取項次內的欄位
        qty = itemRow.querySelector('.QTY');
        docum = itemRow.querySelector('.DOC_UM');
        stqty = itemRow.querySelector('.ST_QTY');
        stum = itemRow.querySelector('.ST_UM');
        netwt = itemRow.querySelector('.NET_WT');
        wide = itemRow.querySelector('.WIDE');
        wideum = itemRow.querySelector('.WIDE_UM');
        lengt = itemRow.querySelector('.LENGT_');
        lengthum = itemRow.querySelector('.LENGTH_UM');
        cccCode = itemRow.querySelector('.CCC_CODE');
    } else {
        // 選取彈跳框中的欄位
        qty = document.getElementById('QTY');
        docum = document.getElementById('DOC_UM');
        stqty = document.getElementById('ST_QTY');
        stum = document.getElementById('ST_UM');
        netwt = document.getElementById('NET_WT');
        wide = document.getElementById('WIDE');
        wideum = document.getElementById('WIDE_UM');
        lengt = document.getElementById('LENGT_');
        lengthum = document.getElementById('LENGTH_UM');
        cccCode = document.getElementById('CCC_CODE');
    }

    // 填入數據
    if (item['統計數量單位']) {
        if (stqty && qty && docum && stqty.value === '') {
            if (docum.value === item['統計數量單位']) {
                stqty.value = qty.value;
            } else if (docum.value === 'SET' && item['統計數量單位'] === 'PCE') {
                stqty.value = qty.value;
            } else if (docum.value === 'PCE' && item['統計數量單位'] === 'SET') {
                stqty.value = qty.value;
            } else if (docum.value === 'EAC' && item['統計數量單位'] === 'PCE') {
                // 獲取 SHPR_BAN_ID 欄位值
                const shprBanIdElement = document.getElementById('SHPR_BAN_ID');
                const shprBanId = shprBanIdElement ? shprBanIdElement.value : '';

                // 判斷 SHPR_BAN_ID 是否為指定的例外值
                const exceptionIds = [
                    '22099174', // 元隆電子股份有限公司
                    '27890054', // 碩呈科技股份有限公司
                ];
                if (exceptionIds.includes(shprBanId)) {
                    stqty.value = ''; // 不執行計算，清空 ST_QTY
                } else {
                    stqty.value = qty.value; // 正常計算
                }                
            } else if (docum.value === 'SHE' && item['統計數量單位'] === 'PCE') {
                stqty.value = qty.value;
            } else if (docum.value === 'NPR' && item['統計數量單位'] === 'PCE') {
                stqty.value = new Decimal(qty.value).times(2).toDecimalPlaces(2).toString();
            } else if (docum.value === 'KPC' && item['統計數量單位'] === 'PCE') {
                stqty.value = new Decimal(qty.value).times(1000).toDecimalPlaces(2).toString();
            } else if (docum.value === 'PCE' && item['統計數量單位'] === 'DZN') {
                stqty.value = new Decimal(qty.value).div(12).toDecimalPlaces(2).toString();
            } else if (docum.value === 'KPC' && item['統計數量單位'] === 'DZN') {
                stqty.value = new Decimal(qty.value).times(1000).div(12).toDecimalPlaces(2).toString();
            } else if (item['統計數量單位'] === 'KGM') {
                stqty.value = netwt.value;
            } else if (item['統計數量單位'] === 'MTK') {
                // 轉換寬度單位
                if (wideum.value === 'MTR') wideV = wide.value * 1
                if (wideum.value === 'YRD') wideV = wide.value * 0.9144
                if (wideum.value === 'INC') wideV = wide.value * 0.0254

                // 轉換長度單位
                if (lengthum.value === 'MTR') lengtV = lengt.value * 1
                if (lengthum.value === 'YRD') lengtV = lengt.value * 0.9144
                if (lengthum.value === 'INC') lengtV = lengt.value * 0.0254

                // 計算面積並四捨五入到小數點第 2 位
                if (wideV > 0 && lengtV > 0) {
                    stqty.value = (wideV * lengtV).toFixed(2);
                }
            }
        }
        if (stum) stum.value = item['統計數量單位'];

        // 加入新的條件檢查並計算面積
        if (wide && wideum && lengt && lengthum && stum && stum.value === 'MTK') {
            updateArea(stqty, stum, wide, wideum, lengt, lengthum);
        }
    } else {
        // 如果 '統計數量單位' 為空，將 ST_QTY 和 ST_UM 設置為空
        if (stqty) stqty.value = '';
        if (stum) stum.value = '';
    }

    if (cccCode) {
        let exportReg = item['輸出規定'] ? item['輸出規定'].trim() : '';
        let exportRegList = exportReg.split(/\s+/).filter(reg => reg); // 過濾掉空白項目

        // 取得目的地代碼（TO_CODE）
        const toCodeElement = document.getElementById("TO_CODE");
        const toCode = toCodeElement ? toCodeElement.value.trim().toUpperCase() : '';
        const toCodePrefix = toCode.slice(0, 2); // 取得前兩碼

        // 是否符合條件
        const conditionS01 = exportRegList.includes("S01") && toCodePrefix === "KP";
        const conditionS03 = exportRegList.includes("S03") && toCodePrefix === "IR";
        const conditionS04 = exportRegList.includes("S04") && toCodePrefix === "IR";
        const condition445 = exportRegList.includes("445") && toCodePrefix === "JP";
        const condition446 = exportRegList.includes("446") && toCodePrefix === "JP";
        const condition447 = exportRegList.includes("447") && toCodePrefix === "JP";

        // 若包含其他輸出規定 (不只是 S01、S03、S04、445、446、447)，也要高亮
        const hasOtherReg = exportRegList.some(reg => !["S01", "S03", "S04", "445", "446", "447"].includes(reg));

        // 最終判斷是否高亮
        const shouldHighlight = exportRegList.length > 0 && 
        (conditionS01 || conditionS03 || conditionS04 || condition445 || condition446 || condition447 || hasOtherReg);

        if (shouldHighlight) {
            cccCode.classList.add("highlight-ccc");
        } else {
            cccCode.classList.remove("highlight-ccc");
        }
    }

    initializeDimensionListeners(itemRow);
}

// 清空 QTY、DOC_UM、ST_QTY 和 ST_UM 欄位
function clearFields(inputElement) {
    const itemRow = inputElement.closest('.item-row');

    let stqty, stum;
    if (itemRow) {
        stqty = itemRow.querySelector('.ST_QTY');
        stum = itemRow.querySelector('.ST_UM');
    } else {
        stqty = document.getElementById('ST_QTY');
        stum = document.getElementById('ST_UM');
    }

    if (stqty) stqty.value = '';
    if (stum) stum.value = '';

    // 移除 '.'、'-' 以及所有的空格
    inputElement.value = inputElement.value.replace(/[.\-\s]/g, '');
}

// 初始化 CCC_CODE 輸入框
function initializeCCCCodeInputs() {
    const inputs = document.querySelectorAll('.CCC_CODE, .tax-code-input');
    inputs.forEach(input => {
        input.addEventListener('input', (event) => handleCCCCodeInput(event, input));
        input.addEventListener('change', (event) => handleCCCCodeInput(event, input));
    });
}

document.addEventListener('DOMContentLoaded', initializeCCCCodeInputs);

// 自動計算 ST_QTY 的函數
function calculateSTQTYForMTK() {
    const wide = document.getElementById('WIDE').value;
    const wideUM = document.getElementById('WIDE_UM').value;
    const lengt = document.getElementById('LENGT_').value;
    const lengthUM = document.getElementById('LENGTH_UM').value;
    const stum = document.getElementById('ST_UM').value;
    const stqty = document.getElementById('ST_QTY');

    let wideV = 0, lengtV = 0;

    // 確認四個欄位有值且 ST_UM 為 'MTK'
    if (stum === 'MTK' && wide && wideUM && lengt && lengthUM) {
        // 轉換寬度
        if (wideUM === 'MTR') wideV = parseFloat(wide) * 1;
        if (wideUM === 'YRD') wideV = parseFloat(wide) * 0.9144;
        if (wideUM === 'INC') wideV = parseFloat(wide) * 0.0254;

        // 轉換長度
        if (lengthUM === 'MTR') lengtV = parseFloat(lengt) * 1;
        if (lengthUM === 'YRD') lengtV = parseFloat(lengt) * 0.9144;
        if (lengthUM === 'INC') lengtV = parseFloat(lengt) * 0.0254;

        // 計算並更新 ST_QTY
        if (wideV > 0 && lengtV > 0) {
            stqty.value = (wideV * lengtV).toFixed(2);
        }
    } else {
        stqty.value = ''; // 若條件不符則清空 ST_QTY
    }
}

// 初始化寬度和長度欄位的監聽器
function initializeDimensionListeners(itemRow) {
    const wide = itemRow.querySelector('.WIDE');
    const wideum = itemRow.querySelector('.WIDE_UM');
    const lengt = itemRow.querySelector('.LENGT_');
    const lengthum = itemRow.querySelector('.LENGTH_UM');

    if (wide && wideum && lengt && lengthum) {
        const updateAreaCallback = () => updateArea(itemRow.querySelector('.ST_QTY'), itemRow.querySelector('.ST_UM'), wide, wideum, lengt, lengthum);
        
        // 監聽四個欄位的輸入變化，即時更新面積
        wide.addEventListener('input', updateAreaCallback);
        wideum.addEventListener('change', updateAreaCallback);
        lengt.addEventListener('input', updateAreaCallback);
        lengthum.addEventListener('change', updateAreaCallback);
    }
}

// 計算面積並更新 ST_QTY
function updateArea(stqty, stum, wide, wideum, lengt, lengthum) {
    if (stum && stum.value === 'MTK') {
        let wideV = 0, lengtV = 0;
        if (wide.value && wideum.value && lengt.value && lengthum.value) {
            // 轉換寬度單位
            if (wideum.value === 'MTR') wideV = parseFloat(wide.value) || 0;
            if (wideum.value === 'YRD') wideV = (parseFloat(wide.value) || 0) * 0.9144;
            if (wideum.value === 'INC') wideV = (parseFloat(wide.value) || 0) * 0.0254;
    
            // 轉換長度單位
            if (lengthum.value === 'MTR') lengtV = parseFloat(lengt.value) || 0;
            if (lengthum.value === 'YRD') lengtV = (parseFloat(lengt.value) || 0) * 0.9144;
            if (lengthum.value === 'INC') lengtV = (parseFloat(lengt.value) || 0) * 0.0254;
    
            // 計算面積並四捨五入到小數點第 2 位
            if (wideV > 0 && lengtV > 0) {
                stqty.value = (wideV * lengtV).toFixed(2);
            }
        }
    }
}

// 在頁面載入完成後初始化 CCC_CODE 和欄位監聽
document.addEventListener('DOMContentLoaded', () => {
    initializeCCCCodeInputs();
});

function getRegInfo(regCode, regData, type) {
    if (!regCode) {
        return '';  // 若無規定則返回空白
    }

    // 以空格分隔多個代號
    const codes = regCode.split(/\s+/);
    let descriptions = [];

    codes.forEach(code => {
        if (regData[code]) {
            descriptions.push(
                `代號: ${code}<br>
                 說明: ${regData[code]['規定中文說明']}`
            );
        }
    });

    return descriptions.length > 0 ? descriptions.join('<hr>') : ''; // 無結果則返回空
}

function showTooltip(event, content) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'fixed'; // 固定位置
        tooltip.style.top = '10px'; // 固定於畫面頂端
        tooltip.style.left = '50%'; // 水平置中
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '15px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '14px';
        tooltip.style.maxWidth = '80%';
        tooltip.style.wordWrap = 'break-word';
        tooltip.style.textAlign = 'left';
        tooltip.style.zIndex = '9999';
        tooltip.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        document.body.appendChild(tooltip);
    }

    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
}

// 隱藏彈跳框
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}