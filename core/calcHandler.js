// 數量核算
function calculateQuantities() {
    // 在執行計算前先更新所有稅則
    updateAllTariffs();

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        return;
    }

    let unitQuantities = {};
    let stUnitQuantities = {};
    let quantityAlerts = new Set();
    const quantityRegex = /\b(\d+)\s*(PCE|PCS)\b/i;

    items.forEach(row => {
        const itemNo = row.querySelector(".item-number label")?.textContent.trim();
        if (itemNo === "*") return; // 忽略 ITEM_NO 為 "*" 的項次

        const description = row.querySelector(".DESCRIPTION")?.value.trim().toUpperCase();
        const unit = row.querySelector('.DOC_UM').value;
        const quantityElement = row.querySelector('.QTY');
        const stUnit = row.querySelector('.ST_UM').value;
        const stQuantityElement = row.querySelector('.ST_QTY');

        // **檢查品名是否含有 PCE 或 PCS 且需符合條件才提示**
        const quantityMatch = description.match(quantityRegex);
        if (quantityMatch) {
            const matchedQty = parseFloat(quantityMatch[1]);
            if (!((unit === "PCE" && parseFloat(quantityElement.value) === matchedQty) || 
                  (stUnit === "PCE" && parseFloat(stQuantityElement.value) === matchedQty))) {
                quantityAlerts.add("➤ 品名內含 PCE 或 PCS，請確認『數量單位』或『統計數量單位』是否合理");
            }
        }

        // 計算 DOC_UM 和 QTY
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

    let message = unitQuantitiesString;

    // 若統計用數量單位有數據，則加入顯示
    if (Object.keys(stUnitQuantities).length > 0) {
        let stUnitQuantitiesString = '統計用數量單位加總為：';
        for (const [unit, stTotalQuantity] of Object.entries(stUnitQuantities)) {
            stUnitQuantitiesString += `\n(${parseFloat(stTotalQuantity.toFixed(6))} ${unit})`;
        }
        message += `\n\n${stUnitQuantitiesString}`;
    }

    // 顯示品名內含 PCE 或 PCS 的提醒
    if (quantityAlerts.size > 0) {
        message += `\n\n${Array.from(quantityAlerts).join('\n')}`;
    }

    alert(message);
}

// 金額核算
function calculateAmounts() {
    const decimalPlacesInput = document.getElementById('decimal-places');
    let decimalPlaces = parseInt(decimalPlacesInput.value);

    // 確保小數點位數最小為0，並預設為2
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
        decimalPlaces = 2;
    }

    const exchangeRate = parseFloat(document.getElementById('exchange-rate').value) || 0;
    const exchangeThreshold = exchangeRate > 0 ? Math.round((0.5 / exchangeRate) * 100) / 100 : 0;
    const lowTotalPriceAlerts = []; // 存放低於門檻的提示

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        return;
    }

    // 遍歷每個項次，先計算 DOC_TOT_P = QTY * DOC_UNIT_P
    items.forEach((row, index) => {
        // 使用 Decimal 取得數值
        const qty = new Decimal(row.querySelector('.QTY').value || 0); // 數量
        const unitPrice = new Decimal(row.querySelector('.DOC_UNIT_P').value || 0); // 單價
        const totalPriceField = row.querySelector('.DOC_TOT_P'); // 總金額欄位
    
        // 計算總金額，使用 Decimal 避免浮點數精度問題
        const totalPrice = qty.mul(unitPrice);
    
        // 更新欄位值，保留指定小數位數
        totalPriceField.value = totalPrice.toFixed(decimalPlaces);

        const itemNumber = row.querySelector('.item-number label')?.innerText.trim();

        // 判斷 DOC_TOT_P 是否不足台幣 1 元
        if (exchangeRate > 0 && totalPrice.lessThan(exchangeThreshold) && itemNumber !== '*') {
            totalPriceField.style.backgroundColor = '#ffeb3b';
            lowTotalPriceAlerts.push(`➤ No. ${index + 1} 項次金額 ${totalPrice.toFixed(decimalPlaces)} 不足台幣 1 元，請確認。`);
        } else {
            totalPriceField.style.backgroundColor = ''; // 清除背景色
        }
    });
    
    // 計算各項次金額的加總
    let totalItemsAmount = Array.from(items).reduce((sum, item) => {
        const amount = parseFloat(item.querySelector('.DOC_TOT_P').value);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const termsSales = document.getElementById('TERMS_SALES').value;
    const totalDocumentAmount = parseFloat(document.getElementById('CAL_IP_TOT_ITEM_AMT').value) || 0;
    const currency = document.getElementById('CURRENCY').value || '';

    // 獲取額外費用
    const freight = parseFloat(document.getElementById('FRT_AMT').value) || 0; // 運費
    const insurance = parseFloat(document.getElementById('INS_AMT').value) || 0; // 保險費
    const additionalCost = parseFloat(document.getElementById('ADD_AMT').value) || 0; // 應加費用
    const deductibleCost = parseFloat(document.getElementById('SUBTRACT_AMT').value) || 0; // 應減費用

    // 根據貿易條件計算總金額
    let calculatedTotalAmount = totalItemsAmount;
    let calculationFormula = '';
    let explanation = '';
    let isEXWValid = true;

    switch (termsSales) {
        case 'EXW':
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)}`;
            explanation = '項次金額加總';
            
            // 檢查 EXW 條件下運費、保險費、應減費用是否為零，且 ADD_AMT 需大於 0
            if (freight !== 0 || insurance !== 0 || deductibleCost !== 0 || additionalCost <= 0) {
                isEXWValid = false;
            }
            break;
        case 'FOB':
            calculatedTotalAmount += freight + insurance + additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${freight.toFixed(decimalPlaces)} (運費) + ${insurance.toFixed(decimalPlaces)} (保險費) + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+運費+保險費+應加費用-應減費用';
            break;
        case 'CFR':
            calculatedTotalAmount += insurance + additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${insurance.toFixed(decimalPlaces)} (保險費) + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+保險費+應加費用-應減費用';
            break;
        case 'C&I':
            calculatedTotalAmount += freight + additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${freight.toFixed(decimalPlaces)} (運費) + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+運費+應加費用-應減費用';
            break;
        case 'CIF':
            calculatedTotalAmount += additionalCost - deductibleCost;
            calculationFormula = `${totalItemsAmount.toFixed(decimalPlaces)} + ${additionalCost.toFixed(decimalPlaces)} (應加費用) - ${deductibleCost.toFixed(decimalPlaces)} (應減費用)`;
            explanation = '項次金額加總+應加費用-應減費用';
            break;
        default:
            alert('無效的貿易條件，請檢查輸入。');
            return;
    }

    // 檢查計算結果是否與表頭金額相同
    let calculationAlerts = "";
    if (calculatedTotalAmount.toFixed(2) === totalDocumentAmount.toFixed(2)) {
        if (termsSales === 'EXW' && !isEXWValid) {
            calculationAlerts = `【${termsSales} 計算公式：${explanation}】\n系統計算的總金額為：${currency} ${calculatedTotalAmount.toFixed(decimalPlaces)}\n----------------------------------------------------\n報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(decimalPlaces)}\n【錯誤！運費、保險費或應減費用不應有值，應加費用需有值】\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(decimalPlaces)}\n`;
        } else {
            calculationAlerts = `【${termsSales} 計算公式：${explanation}】\n系統計算的總金額為：${currency} ${calculatedTotalAmount.toFixed(decimalPlaces)}\n----------------------------------------------------\n報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(decimalPlaces)}【正確】\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(decimalPlaces)}\n`;
        }
    } else {
        calculationAlerts = `【${termsSales} 計算公式：${explanation}】\n系統計算的總金額為：${currency} ${calculatedTotalAmount.toFixed(decimalPlaces)}\n----------------------------------------------------\n報單表頭的總金額為：${currency} ${totalDocumentAmount.toFixed(decimalPlaces)}【錯誤！】\n各項次金額的加總為：${currency} ${totalItemsAmount.toFixed(decimalPlaces)}\n`;
    }

    // 定義關鍵字分類及對應的提示訊息
    const keywordMessages = {
        additionalCosts: ["COST", "FEE", "CHARGE", "FREIGHT", "INSURANCE", "DISCOUNT", "SHIPPING", "POSTAGE"], // 其他費用
    };

    // 事先轉換關鍵字為正則表達式，確保大寫比對，並且使用 `\b` 限制完整單詞
    const keywordRegex = {};
    Object.keys(keywordMessages).forEach(category => {
        keywordRegex[category] = new RegExp(`\\b(${keywordMessages[category].join('|')})\\b`, 'gi');
    });

    // 定義提示訊息對應表
    const categoryMessages = {
        additionalCosts: "請確認是否為其他費用。",
    };

    // 檢查項次內的描述欄位是否包含指定的關鍵字
    let keywordAlerts = [];
    items.forEach((row, index) => {
        const description = row.querySelector('.DESCRIPTION').value; // 保持原始大小寫
        let matchedKeywords = [];

        Object.keys(keywordMessages).forEach(category => {
            const matches = description.match(keywordRegex[category]); // 找出所有匹配的關鍵字
            if (matches) {
                matchedKeywords.push(...matches);
                keywordAlerts.push(`➤ No. ${index + 1} 內含關鍵字 "${matches.join(', ')}"，${categoryMessages[category]}`);
            }
        });

        if (matchedKeywords.length === 0) {
            calculateAmountsForRow(row, decimalPlaces);
        }
    });

    // 合併顯示計算結果提示與關鍵字提示
    const combinedAlerts = [calculationAlerts, ...keywordAlerts, ...lowTotalPriceAlerts].join('\n');
    if (combinedAlerts) {
        alert(combinedAlerts);
    }
}

// 重量核算
function calculateWeight() {
    const totalNetWeight = parseFloat(document.getElementById('DCL_NW').value);
    if (isNaN(totalNetWeight) || totalNetWeight <= 0) {
        return;
    }

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
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
    if (totalNetWeight === totalCalculatedWeight) {
        alert(`報單表頭的總淨重為：${totalNetWeight}【正確】\n各項次的淨重加總為：${totalCalculatedWeight}`);
    } else if (totalNetWeight !== totalCalculatedWeight) {
        alert(`報單表頭的總淨重為：${totalNetWeight}【錯誤！】\n各項次的淨重加總為：${totalCalculatedWeight}`);
    }
}

// 核算
function calculate() {
    let messages = []; // 用來儲存所有提示訊息

    // 數量核算
    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        messages.push('請先新增至少一個項次。');
    }

    // 總淨重檢查
    const totalNetWeight = parseFloat(document.getElementById('DCL_NW').value);
    if (isNaN(totalNetWeight) || totalNetWeight <= 0) {
        messages.push('請先填寫有效的總淨重。');
    }

    // 如果有訊息，合併顯示
    if (messages.length > 0) {
        alert(messages.join('\n'));
        return;
    }

    calculateQuantities(); //數量核算
    calculateAmounts(); // 金額核算
    calculateWeight(); // 重量核算
    initializeFieldVisibility(); // 更新欄位顯示狀態

    // 更新核算狀態
    document.getElementById("calculation-status").value = "已執行";
}
