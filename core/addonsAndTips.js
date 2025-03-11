// 匯整產地及備註
function summarizeOrgCountry() {

    // 若 validateDclDocType 發現錯誤，則直接返回，中止後續程式碼
    if (!validateDclDocType()) {
        return;
    }

    // 標記及貨櫃號碼
    const orgCountryMap = {}; // 用於儲存 ORG_COUNTRY 與對應項次
    let countryMapping = {}; // 從 CSV 加載的國家代碼

    // 讀取 countryMapping.csv 文件並解析
    const loadCountryMapping = async () => {
        try {
            const response = await fetch('./countryMapping.csv');
            const csvText = await response.text();

            // 解析 CSV 文件
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(','); // 解析標題列
            const dataLines = lines.slice(1);

            dataLines.forEach((line) => {
                const values = line.split(',');
                const code = values[0].trim();
                const value = values[1].trim();
                const valueChinese = values[2].trim();
                const region = values[3].trim();

                countryMapping[code] = { value, valueChinese, region };
            });
        } catch (error) {
            console.error('Error loading countryMapping.csv:', error);
        }
    };
    
    // 初始化函數
    const init = async () => {
        await loadCountryMapping(); // 加載 CSV 文件

        document.querySelectorAll('.ORG_COUNTRY').forEach((input, index) => {
            if (!input || typeof input.value !== 'string') {
                console.warn(`無法獲取第 ${index} 項的 ORG_COUNTRY 值，跳過。`);
                return; // 跳過無效元素
            }
            
            const value = input.value.trim(); // 獲取 ORG_COUNTRY 的值
        
            // 找到當前項次的行
            const itemRow = input.closest('.item-row');
            if (!itemRow) {
                console.warn(`無法找到第 ${index} 項的 .item-row，跳過。`);
                return;
            }
        
            // 獲取 itemNumber，根據行內的 .item-number 標籤
            const itemNumberLabel = itemRow.querySelector('.item-number label');
            const itemNumber = itemNumberLabel ? parseInt(itemNumberLabel.textContent.trim(), 10) : NaN;
        
            if (isNaN(itemNumber)) {
                console.warn(`第 ${index} 項的 itemNumber 為 NaN，跳過。`);
                return; // 跳過無效的項次
            }
        
            if (!orgCountryMap[value]) {
                orgCountryMap[value] = []; // 初始化為空陣列
            }
            orgCountryMap[value].push(itemNumber); // 將當前項次加入對應的值
        });

        // 將項次轉換為範圍格式
        const formatRangesORG_COUNTRY = (numbers) => {
            const ranges = [];
            let start = numbers[0];
            let prev = numbers[0];

            for (let i = 1; i < numbers.length; i++) {
                const current = numbers[i];
                if (current !== prev + 1) {
                    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
                    start = current;
                }
                prev = current;
            }
            ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
            return ranges.join(', ');
        };

        // 匯整結果，按項次排序
        const resultORG_COUNTRY = Object.entries(orgCountryMap)
            .filter(([key]) => key) // 過濾空值
            .map(([key, items]) => {
                const countryData = countryMapping[key] || { value: key }; // 找不到則顯示預設值
                const countryName = `${countryData.value}`;
                const sortedItems = items.sort((a, b) => a - b); // 排序項次
                const ranges = formatRangesORG_COUNTRY(sortedItems); // 將項次轉為範圍
                return { ranges, countryName }; // 返回範圍與國名
            })
            .sort((a, b) => {
                // 依照範圍的第一個數字排序
                const firstA = parseInt(a.ranges.split(',')[0], 10);
                const firstB = parseInt(b.ranges.split(',')[0], 10);
                return firstA - firstB;
            })
            .map(({ ranges, countryName }) => {
                return `ITEM ${ranges}: MADE IN ${countryName.toUpperCase()}`; // 組合描述
            })
            .join('\n');

        // 顯示結果在 DOC_MARKS_DESC
        const docMarksDesc = document.getElementById('DOC_MARKS_DESC');
        if (docMarksDesc) {
            docMarksDesc.value = docMarksDesc.value.trim() + '\n' + resultORG_COUNTRY; // 顯示匯整結果
        } else {
            console.error("找不到 DOC_MARKS_DESC 元素，無法顯示結果。");
        }
    };

    // 啟動初始化
    init();

    // 其它申報事項
    const stMtdMap = {}; // 用於儲存 ST_MTD 與對應的項次與條件

    // ST_MTD 對應表
    const stMtdMapping = {
        '02': { value: "國貨銷售" },
        '04': { value: "國貨樣品/贈送不再進口" },
        '05': { value: "委外加工不再進口" },
        '06': { value: "國外提供原料委託加工出口(僅收取加工費)" },
        '53': { value: "此為貨樣出口，後續將依規定限期內復運進口" },
        '91': { value: "本批貨物為國貨修理後復出口" },
        '95': { value: "委外加工再復運進口" },
        '9M': { value: "洋貨復出口，復出口原因：退回修理，修理完畢後會再復運進口" },
        '81': { value: "洋貨轉售" },
        '82': { value: "洋貨復出口不再進口" },
    };

    // 條件判斷函數
    const addAdditionalInfo = (itemRow, stMtdValue) => {
        if (!itemRow) {
            console.warn("itemRow 無效，跳過條件判斷。");
            return stMtdValue;
        }

        const descriptionField = itemRow.querySelector('.DESCRIPTION');
        const descriptionValue = descriptionField ? descriptionField.value.trim() : '';
        const orgImpDclNo = itemRow.querySelector('.ORG_IMP_DCL_NO')?.value.trim() || '';
        const orgDclNo = itemRow.querySelector('.ORG_DCL_NO')?.value.trim() || '';

        if ((orgImpDclNo || orgDclNo) && descriptionValue.includes('發票號碼')) {
            return `${stMtdValue}，附原進口報單及國內購買憑證以茲證明`;
        } else if (orgImpDclNo || orgDclNo) {
            return `${stMtdValue}，附原進口報單`;
        } else if (descriptionValue.includes('發票號碼')) {
            return `${stMtdValue}，因無法提供原進口報單號碼，特附國內購買憑證以茲證明`;
        } else {
            return `${stMtdValue}，因無法取得原進口報單及購買憑證，願繳納推廣貿易服務費`;
        }
    };

    // 格式化項次範圍
    const formatRanges = (numbers) => {
        const ranges = [];
        let start = numbers[0];
        let prev = numbers[0];

        for (let i = 1; i < numbers.length; i++) {
            const current = numbers[i];
            if (current !== prev + 1) {
                ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
                start = current;
            }
            prev = current;
        }
        ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
        return ranges;
    };

    // 合併具有相同備註的範圍
    const mergeSameRemarks = (data) => {
        const merged = {};

        data.forEach(({ ranges, remark }) => {
            if (!merged[remark]) {
                merged[remark] = [];
            }
            merged[remark] = merged[remark].concat(ranges);
        });

        return Object.entries(merged).map(([remark, rangeList]) => {
            const sortedRanges = [...new Set(rangeList)].sort((a, b) => a - b);
            return `ITEM ${formatRanges(sortedRanges).join(', ')}: ${remark}`;
        });
    };

    // 處理每一行
    document.querySelectorAll('.item-row').forEach((itemRow, index) => {
        // 查找 .ST_MTD 元素
        const stMtdInput = itemRow.querySelector('.ST_MTD');
        const itemNumberLabel = itemRow.querySelector('.item-number label');

        // 檢查元素是否存在
        if (!stMtdInput) {
            console.warn(`第 ${index} 行找不到 .ST_MTD 元素，跳過處理。`);
            return;
        }
        if (!itemNumberLabel) {
            console.warn(`第 ${index} 行找不到 .item-number label 元素，跳過處理。`);
            return;
        }

        // 確保 .value 存在
        const stMtdValue = stMtdInput.value?.trim();
        if (!stMtdValue) {
            console.warn(`第 ${index} 行的 ST_MTD 值為空，跳過處理。`);
            return;
        }

        const itemNumber = parseInt(itemNumberLabel.textContent.trim(), 10);
        if (isNaN(itemNumber)) {
            console.warn(`第 ${index} 行的項次無效，跳過處理。`);
            return;
        }

        // 處理邏輯...
        let stMtdName = stMtdMapping[stMtdValue]?.value || stMtdValue;
        if (['9M', '81', '82'].includes(stMtdValue)) {
            stMtdName = addAdditionalInfo(itemRow, stMtdName);
        }

        const groupKey = `${stMtdValue}|${stMtdName}`;
        if (!stMtdMap[groupKey]) {
            stMtdMap[groupKey] = [];
        }
        stMtdMap[groupKey].push(itemNumber);
    });

    // 匯整結果
    const resultData = Object.entries(stMtdMap)
        .flatMap(([key, items]) => {
            const [stMtdValue, stMtdName] = key.split('|');
            const sortedItems = items.sort((a, b) => a - b);
            const ranges = formatRanges(sortedItems);
            return ranges.map(range => ({ ranges: [range], remark: stMtdName }));
        });

    const finalResult = mergeSameRemarks(resultData).join('\n');

    // 更新到 DOC_OTR_DESC
    const docOtrDesc = document.getElementById('DOC_OTR_DESC');
    if (docOtrDesc) {
        docOtrDesc.value = docOtrDesc.value.trim() + '\n' + finalResult;
    } else {
        console.error("找不到 DOC_OTR_DESC 元素，無法顯示結果。");
    }

}

// 添加錯誤樣式
function setError(element, message) {
    element.classList.add('error');
    element.title = message; // 顯示提示訊息
}

// 清除錯誤樣式
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('title');
    });
}

// 檢查統計方式、生產國別、原進口報單、報單類別
function validateDclDocType() {
    clearErrors(); // 清除之前的錯誤標記
    const dclDocType = document.getElementById('DCL_DOC_TYPE').value.trim().toUpperCase();
    const stMtdCondition1 = ["02", "04", "06", "2L", "2R", "7M", "1A", "94", "95"];
    const stMtdCondition2 = ["81", "82", "8B", "8C", "9N", "8A", "8D", "92", "99", "9M"];
    let validationErrors = new Set(); // 錯誤訊息，使用 Set 儲存錯誤訊息，避免重複
    let validationWarnings = new Set(); // 提示訊息（不影響匯出）

    const sampleRegex = /(?:\b|\d+PCE|\d+PCS)(SAMPLE|F\.?O\.?C\.?|FREE\s+OF\s+CHARGE|樣品|样品)/i;
    let sampleMatches = new Set(); // 用來存儲實際匹配到的樣品關鍵字
    let hasSampleKeyword = false; // 樣品提醒標記
    const stMtdGroups = {}; // 用來儲存統計方式的連號分組

    const rows = document.querySelectorAll("#item-container .item-row");
    rows.forEach(item => {
        const itemNo = item.querySelector(".item-number label")?.textContent.trim();
        if (itemNo === "*") return; // 忽略 ITEM_NO 為 "*" 的項次

        const description = item.querySelector(".DESCRIPTION")?.value.trim().toUpperCase();
        const stMtdValue = item.querySelector(".ST_MTD")?.value.trim().toUpperCase();

        // 檢查 `DESCRIPTION` 是否包含樣品關鍵字
        if (description && sampleRegex.test(description)) {
            if (stMtdValue !== "04" && stMtdValue !== "82") {
                hasSampleKeyword = true; // 只有 ST_MTD 不是 04 或 82 才提醒
                const match = description.match(sampleRegex);
                if (match) {
                    sampleMatches.add(match[1]); // 只加入匹配到的關鍵字
                }
            }
        }

        // 統計方式連號檢查（最後才處理）
        if (stMtdValue) {
            const match = stMtdValue.match(/^(\d+)([A-Z]?)$/);
            if (match) {
                const numPart = parseInt(match[1], 10);
                const letterPart = match[2] || "";
                if (!stMtdGroups[letterPart]) {
                    stMtdGroups[letterPart] = [];
                }
                stMtdGroups[letterPart].push(numPart);
            }
        }
    });

    // 先執行樣品
    if (hasSampleKeyword) {
        validationWarnings.add(`※ 品名中包含 "${Array.from(sampleMatches).join(", ")}"，請確認統計方式是否正確`);
    }

    // 最後執行統計方式連號檢查
    Object.entries(stMtdGroups).forEach(([letter, numbers]) => {
        if (numbers.length > 1) {
            let tempSequence = [numbers[0]];
            let resultSequences = [];

            numbers.sort((a, b) => a - b); // 先排序

            for (let i = 1; i < numbers.length; i++) {
                const current = numbers[i];
                const prev = tempSequence[tempSequence.length - 1];

                if (current === prev || current === prev + 1) {
                    if (current !== prev) {
                        tempSequence.push(current);
                    }
                } else {
                    if (tempSequence.length >= 2) {
                        resultSequences.push([...tempSequence]);
                    }
                    tempSequence = [current];
                }
            }

            if (tempSequence.length >= 2) {
                resultSequences.push([...tempSequence]);
            }

            resultSequences.forEach(seq => {
                const combinedValues = seq
                    .map(n => (letter === "" ? n.toString().padStart(2, '0') : n.toString()) + letter)
                    .join(", ");
                validationWarnings.add(`※ 統計方式連號：${combinedValues}`);
            });
        }
    });

    // 檢查 G5 或 G3 的條件
    if (["G5", "G3"].includes(dclDocType)) {
        let containsMandatoryOrgCountryTW = false; // 標記是否包含 ST_MTD 為 國貨出口統計方式 的項次
        let containsMandatoryOrgCountry = false; // 標記是否包含 ST_MTD 為 外貨復出口統計方式 的項次
        let hasEmptyOrgCountry = false; // 標記是否存在空的 ORG_COUNTRY
        let allCondition1 = true; // 是否所有統計方式都屬於條件 1
        let allCondition2 = true; // 是否所有統計方式都屬於條件 2
        let totalCondition1 = 0; // 條件 1 的加總金額
        let totalCondition2 = 0; // 條件 2 的加總金額
    
        const rows = document.querySelectorAll("#item-container .item-row");
        rows.forEach(item => {
            const stMtdValue = item.querySelector(".ST_MTD")?.value.trim();
            const orgCountryValue = item.querySelector(".ORG_COUNTRY")?.value.trim();
            const orgImpDclNo = item.querySelector(".ORG_IMP_DCL_NO")?.value.trim();
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
            const docTotPValue = parseFloat(item.querySelector(".DOC_TOT_P")?.value.trim() || "0");
    
            // 判斷是否全部屬於條件 1 或條件 2
            if (!stMtdCondition1.includes(stMtdValue) && !isItemChecked) {
                allCondition1 = false;
            }
            if (!stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                allCondition2 = false;
            }
    
            // 檢查條件 1：ST_MTD 為指定值且 ORG_COUNTRY 不為空或不為 TW，且 ORG_IMP_DCL_NO 不應有值
            if (stMtdCondition1.includes(stMtdValue) && !isItemChecked) {
                totalCondition1 += docTotPValue; // 加總條件 1 的金額
                containsMandatoryOrgCountryTW = true;
                if (orgCountryValue && orgCountryValue.toUpperCase() !== "TW") {
                    validationErrors.add(
                        `國貨出口統計方式，生產國別應為空或 TW`
                    );
                    setError(item.querySelector(".ST_MTD"), "國貨出口統計方式");
                    setError(item.querySelector(".ORG_COUNTRY"), "生產國別應為空或 TW");
                }
                if (orgImpDclNo) {
                    validationErrors.add(
                        `國貨出口統計方式，原進口報單號碼及項次不應有值`
                    );
                    setError(item.querySelector(".ST_MTD"), "國貨出口統計方式");
                    setError(item.querySelector(".ORG_IMP_DCL_NO"), "原進口報單號碼及項次不應有值");
                    setError(item.querySelector(".ORG_IMP_DCL_NO_ITEM"), "原進口報單號碼及項次不應有值");
                }
            }
    
            // 檢查條件 2：ST_MTD 為 外貨復出口統計方式 時
            if (stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                totalCondition2 += docTotPValue; // 加總條件 2 的金額
                containsMandatoryOrgCountry = true;
                if (!orgCountryValue || orgCountryValue.trim() === "") {
                    setError(item.querySelector(".ST_MTD"), "外貨復出口統計方式");
                    setError(item.querySelector(".ORG_COUNTRY"), "生產國別不可為空");
                } else if (orgCountryValue.toUpperCase() === "TW") {
                    if (!orgImpDclNo || orgImpDclNo.trim() === "") {
                        validationErrors.add(
                            `外貨復出口統計方式且生產國別為 TW，\n` +
                            `原進口報單號碼及項次不可為空`
                        );
                        setError(item.querySelector(".ST_MTD"), "外貨復出口統計方式");
                        setError(item.querySelector(".ORG_COUNTRY"), "且生產國別為 TW");
                        setError(item.querySelector(".ORG_IMP_DCL_NO"), "原進口報單號碼及項次不可為空");
                        setError(item.querySelector(".ORG_IMP_DCL_NO_ITEM"), "原進口報單號碼及項次不可為空");
                    }
                }
            }
            // 標記是否存在空的 ORG_COUNTRY
            if ((!orgCountryValue || orgCountryValue.trim() === "") && !isItemChecked) {
                hasEmptyOrgCountry = true;
            }
        });
    
        // 檢查條件 3：若有 ST_MTD 為 外貨復出口統計方式，則所有項次的 ORG_COUNTRY 不可為空
        if (containsMandatoryOrgCountry && containsMandatoryOrgCountryTW && hasEmptyOrgCountry) {
            rows.forEach(item => {
                const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
                if (!isItemChecked) {
                    const orgCountryValue = item.querySelector(".ORG_COUNTRY")?.value.trim();
                    if (!orgCountryValue || orgCountryValue.trim() === "") {
                        setError(item.querySelector(".ORG_COUNTRY"), "生產國別不可為空");
                    }
                }
            });
            validationErrors.add("國洋貨合併申報，生產國別不可為空（國貨請填 TW ）");
        } else if (containsMandatoryOrgCountry && hasEmptyOrgCountry) {
            validationErrors.add(`外貨復出口統計方式，生產國別不可為空`);
        }
    
        // 檢查條件 4：報單類別與統計方式是否相符
        if (allCondition1 && dclDocType !== "G5") {
            validationErrors.add("統計方式屬於國貨出口，報單類別應為 G5");
        }
        if (allCondition2 && dclDocType !== "G3") {
            validationErrors.add("統計方式屬於外貨復出口，報單類別應為 G3");
        }
    
        // 檢查條件 5：根據 totalCondition1 和 totalCondition2 判斷 dclDocType
        if (totalCondition1 > 0 && totalCondition2 > 0) {
            if (totalCondition1 > totalCondition2 && dclDocType !== "G5") {
                validationErrors.add("國貨的加總金額大於外貨，報單類別應為 G5");
            } else if (totalCondition1 < totalCondition2 && dclDocType !== "G3") {
                validationErrors.add("外貨的加總金額大於國貨，報單類別應為 G3");
            }
        }

        // 顯示條件 1 和條件 2 的加總金額
        console.log(`條件 1 的加總金額: ${totalCondition1}`);
        console.log(`條件 2 的加總金額: ${totalCondition2}`);
    }
    
    // 檢查 B8 的條件
    if (dclDocType === "B8") {
        const rows = document.querySelectorAll("#item-container .item-row");
        let allCondition1 = false;
        let allCondition2 = false;

        rows.forEach(item => {
            const stMtdValue = item.querySelector(".ST_MTD")?.value.trim();
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
            const orgImpDclNo = item.querySelector(".ORG_IMP_DCL_NO")?.value.trim();

            if (stMtdCondition1.includes(stMtdValue) && !isItemChecked) {
                allCondition1 = true; // 有符合條件1的項目且未勾選
            }
            if (stMtdCondition2.includes(stMtdValue) && !isItemChecked) {
                allCondition2 = true; // 有符合條件2的項目且未勾選
            }
        });

        if (allCondition1 && allCondition2) {
            validationErrors.add("B8 及 G5 不得合併申報，必須拆分或以 B9 申報（B9 項次在前）");
        } else if (allCondition1 && !allCondition2) {
            validationErrors.add("所有項次為國貨統計方式，報單類別應為 B9");
        }
    }

    // 檢查 B9 的條件
    if (dclDocType === "B9") {
        const rows = document.querySelectorAll("#item-container .item-row");
        let firstValueChecked = false; // 標記是否已檢查第一個有值的項次

        rows.forEach(item => {
            const stMtdValue = item.querySelector(".ST_MTD")?.value.trim();
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;

            // 找到第一個有值的項次且未檢查過
            if (!firstValueChecked) {
                if (!isItemChecked) {
                    if (!stMtdCondition1.includes(stMtdValue)) {
                        if (stMtdValue !== "53" && stMtdValue !== "9E") {
                            validationErrors.add("B9 報單第一個項次，應為國貨統計方式");
                        }
                    }
                    firstValueChecked = true; // 標記已檢查第一個有值的項次
                }
            }

            // 檢查其他項次中是否有統計方式為 53，但保稅貨物註記不為 NB
            if (stMtdValue === "53") {
                const bondNoteValue = item.querySelector(".BOND_NOTE")?.value.trim();
                if (bondNoteValue !== "NB") {
                    validationErrors.add(`統計方式為 53，保稅貨物註記應為 NB`);
                }
            }

            // 檢查其他項次中是否有統計方式為 9E，但保稅貨物註記不為 YB 或 CN
            if (stMtdValue === "9E") {
                const bondNoteValue = item.querySelector(".BOND_NOTE")?.value.trim();
                if (bondNoteValue !== "YB" && bondNoteValue !== "CN") {
                    validationErrors.add(`統計方式為 9E，保稅貨物註記應為 YB 或 CN`);
                }
            }
        });
    }

    // 檢查 D5 或 F5 的條件
    if (["D5", "F5"].includes(dclDocType)) {
        const rows = document.querySelectorAll("#item-container .item-row");
        let missingOrgDclNo = false;

        // 欄位檢查
        const facBanId = document.querySelector("#FAC_BAN_ID")?.value.trim();
        const facBondedId = document.querySelector("#FAC_BONDED_ID")?.value.trim();
        const inBondedBan = document.querySelector("#IN_BONDED_BAN")?.value.trim();
        const inBondedCode = document.querySelector("#IN_BONDED_CODE")?.value.trim();
        
        // 檢查是否有空的欄位，分兩組檢查
        const missingGroup1Fields = !facBanId || !facBondedId;
        const missingGroup2Fields = !inBondedBan || !inBondedCode;

        rows.forEach(item => {
            const isItemChecked = item.querySelector(".ITEM_NO")?.checked;
            const orgDclNo = item.querySelector(".ORG_DCL_NO")?.value.trim();

            if (!orgDclNo && !isItemChecked) {
                missingOrgDclNo = true; // 檢查是否有空的 ORG_DCL_NO
            }
        });

        if (missingOrgDclNo) {
            validationErrors.add("D5 及 F5 需核銷，原進倉報單號碼 及 原進倉報單項次 不可為空");
        }
        if (missingGroup1Fields) {
            validationErrors.add("出倉保稅倉庫統一編號 及 出倉保稅倉庫代碼 不可為空");
        }
        if (missingGroup2Fields) {
            validationErrors.add("進倉保稅倉庫統一編號 及 進倉保稅倉庫代碼 不可為空");
        }
    }

    // 提示與警告
    if (validationErrors.size > 0 || validationWarnings.size > 0) {
        const messages = [];
        if (validationErrors.size > 0) {
            messages.push("❌ 錯誤：\n" + Array.from(validationErrors).join("\n"));
        }
        if (validationWarnings.size > 0) {
            messages.push("⚠️ 提示（不中止匯出）：\n" + Array.from(validationWarnings).join("\n"));
        }
        alert(messages.join("\n\n"));
        return validationErrors.size === 0;
    }

    return true; // 無錯誤，允許繼續處理
}

// 長期委任字號：
const excelFilePath = './出口長委登記表.xlsx';

function fetchAndParseExcel(callback) {
    fetch(excelFilePath)
        .then(response => {
            if (!response.ok) throw new Error('無法讀取出口長委登記表');
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            callback(rows);
        })
        .catch(error => {
            console.error('讀取出口長委登記表時發生錯誤:', error);
            alert('讀取出口長委登記表失敗');
        });
}

function parseCustomDate(dateString) {
    // 將日期格式 "118.01.30" 轉換為標準日期格式
    const [year, month, day] = dateString.split('.');
    if (!year || !month || !day) return null;

    // 將 "民國" 年份轉換為西元年份
    const fullYear = parseInt(year, 10) + 1911;
    return new Date(`${fullYear}-${month}-${day}`);
}

function handleCheck() {
    const SHPR_BAN_ID = document.getElementById('SHPR_BAN_ID').value.trim();
    const docOtrDesc = document.getElementById('DOC_OTR_DESC');

    // 僅移除以 "長期委任字號" 開頭的行，保留其他內容
    docOtrDesc.value = docOtrDesc.value.replace(/^長期委任字號：.*$/gm, '').trim();

    fetchAndParseExcel(rows => {
        const today = new Date();
        const validEntries = [];

        // 遍歷 rows，收集所有未逾期且符合條件的資料
        rows.forEach(row => {
            const id = row[1] ? row[1].toString() : null;
            const expiryDate = row[3] ? parseCustomDate(row[3]) : null;

            // 確保 ID 符合且到期日不早於今天
            if (id === SHPR_BAN_ID && expiryDate && expiryDate >= today) {
                validEntries.push(`長期委任字號：${row[2]}至${row[3]}`);
            }
        });

        if (validEntries.length > 0) {
            // 合併所有未逾期的項目，保留其他原內容
            const newContent = validEntries.join('\n');
            docOtrDesc.value = docOtrDesc.value
                ? `${docOtrDesc.value}\n${newContent}`
                : newContent;
        }
    });
};

// 綁定輸入框事件
document.getElementById('SHPR_BAN_ID').addEventListener('input', handleCheck);

// 綁定按鍵事件
document.getElementById('checkBtn').addEventListener('click', handleCheck);

// 出口備註
const thingsToNoteExcelFilePath = './thingsToNote.xlsx';

function thingsToNoteExcel(callback) {
    fetch(thingsToNoteExcelFilePath)
        .then(response => {
            if (!response.ok) throw new Error('無法讀取出口備註');
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            callback(rows);
        })
        .catch(error => {
            console.error('讀取出口備註時發生錯誤:', error);
            alert('讀取出口備註失敗');
        });
}

function thingsToNote() {
    const SHPR_BAN_ID = document.getElementById('SHPR_BAN_ID').value.trim();
    const remark1Element = document.getElementById('REMARK1');

    if (remark1Element) {
        try {
            // 取得目前的內容，按行分割
            const lines = remark1Element.value.split('\n');
            
            // 指定允許的字串
            const allowedPrefixes = [
                '申請沖退原料稅（E化退稅）',
                '申請報單副本第三聯（沖退原料稅用聯）',
                '申請報單副本第四聯（退內地稅用聯）',
                '申請報單副本第五聯（出口證明用聯）'
            ];
            
            // 過濾每行內容，只保留符合允許的行
            const filteredLines = lines.filter(line => 
                allowedPrefixes.some(prefix => line.trim().startsWith(prefix))
            );
            
            // 將過濾後的內容重新組合回文字框
            remark1Element.value = filteredLines.join('\n');
        } catch (error) {
            console.error('處理REMARKS內容時發生錯誤：', error);
        }
    }
    
    thingsToNoteExcel(rows => {
        const validEntries = [];

        // 遍歷 rows，收集所有未逾期且符合條件的資料
        rows.forEach(row => {
            const id = row[1] ? row[1].toString() : null;

            if (id === SHPR_BAN_ID) {
                validEntries.push(`${row[2]}`);
            }
        });

        if (validEntries.length > 0) {
            // 合併所有內容
            const newContent = validEntries.join('\n');
            const finalContent = `${newContent}`;

            // 將出口備註內容加到 REMARK1 欄位最前面，避免重複
            if (remark1Element) {
                // 取得目前 REMARK1 的內容
                const currentContent = remark1Element.value.trim();

                // 標準化行內容以避免因格式問題產生重複
                const normalizeContent = (content) => {
                    return content
                        .split('\n') // 按行分割
                        .map(line => line.trim()) // 去除每行的多餘空白
                        .join('\n'); // 重新合併為字串
                };

                const normalizedFinalContent = normalizeContent(finalContent);
                const normalizedCurrentContent = normalizeContent(currentContent);

                // 檢查內容是否已包含欲加入的備註
                const newEntry = `【出口備註】\n${normalizedFinalContent}`;
                if (!normalizedCurrentContent.includes(normalizedFinalContent)) {
                    // 若 REMARK1 未包含相同內容，才進行追加
                    remark1Element.value = `${newEntry}\n${currentContent}`;
                }
            }

            // 顯示彈跳框
            closeExistingPopup();
            showPopup(finalContent);
        } else {
            // 如果沒有符合條件的備註，則關閉彈跳框
            closeExistingPopup();
        }
    });
};

document.addEventListener('keydown', function (event) {
    if (event.altKey && event.key.toLowerCase() === 'r') { //忽略大小寫
        event.preventDefault(); // 防止預設行為
        thingsToNote();
    }
});

function closeExistingPopup() {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }
}

function showPopup(content) {
    // 創建彈跳框元素
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '10px';
    popup.style.backgroundColor = '#fef5f5'; // 背景色設置
    popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';
    popup.style.whiteSpace = 'pre-line'; // 保留換行
    popup.style.border = '5px solid #f5c2c2'; // 添加邊框
    popup.style.borderRadius = '5px'; // 邊角圓滑
    popup.style.fontSize = '16px'; // 字體大小
    popup.style.lineHeight = '1.6'; // 調整行距
    popup.style.minWidth = '400px'; // 設定最小寬度

    let isDragging = false;
    let offsetX, offsetY;

    const header = document.createElement('div');
    header.style.cursor = 'move'; // 設置可拖動光標
    header.textContent = '【出口備註】';
    popup.appendChild(header);

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
        popup.style.transition = 'none';
        document.body.style.userSelect = 'none'; // 禁止選取文字
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            popup.style.left = `${e.clientX - offsetX}px`;
            popup.style.top = `${e.clientY - offsetY}px`;
            popup.style.transform = 'none';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = ''; // 恢復文字選取
    });
    
    // 添加內容
    const contentElem = document.createElement('p');
    contentElem.textContent = content;
    contentElem.style.marginTop = '0'; // 上移文字
    popup.appendChild(contentElem);

    // 添加關閉按鈕
    const closeButton = document.createElement('button');
    closeButton.textContent = '關閉';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.addEventListener('click', () => {
        popup.remove();

        // 在關閉彈跳框後將焦點移回 SHPR_BAN_ID 欄位
        document.getElementById('SHPR_BAN_ID').focus();
    });
    popup.appendChild(closeButton);

    // 添加鍵盤事件監聽
    document.addEventListener('keydown', function escHandler(event) {
        // 檢查新增項次彈跳框是否未開啟
        const itemModal = document.getElementById('item-modal');
        if (itemModal && itemModal.style.display !== 'flex') {
            if (event.key === 'Escape') { // 檢查是否按下ESC鍵
                closeButton.focus(); // 將焦點移至關閉按鈕
            }
        }
    });
    
    // 添加到頁面
    document.body.appendChild(popup);
    
    // 顯示彈跳框
    popup.style.display = 'block';
}

function updateFieldStyle(fieldId, removeStyle) {
    // 根據條件，新增或移除指定欄位的背景樣式
    let label = document.querySelector(`label[for="${fieldId}"]`);
    if (label) {
        removeStyle ? label.removeAttribute('style') : label.setAttribute('style', 'background: #ffffff00;');
    }
}

function handleCountryCodeInput(inputId, relatedFields, requiredCountry) {
    // 當輸入特定國家代碼時，調整相關欄位的樣式
    document.getElementById(inputId).addEventListener('input', function () {
        let countryCode = this.value.toUpperCase().trim(); // 轉換為大寫並去除空白
        relatedFields.forEach(field => {
            updateFieldStyle(field, countryCode === requiredCountry);
        });
    });
}

function handleTradeTerms(inputId) {
    // 根據輸入的貿易條件，動態調整運費、保險費、應加費用及應減費用欄位的樣式
    document.getElementById(inputId).addEventListener('input', function () {
        let tradeTerm = this.value.toUpperCase().trim(); // 轉換為大寫並去除空白
        let fieldActions = {
            'EXW': { freight: false, insurance: false, add: true, subtract: false },
            'FOB': { freight: false, insurance: false, add: false, subtract: false },
            'CFR': { freight: true, insurance: false, add: false, subtract: false },
            'C&I': { freight: false, insurance: true, add: false, subtract: false },
            'CIF': { freight: true, insurance: true, add: false, subtract: false },
            'default': { freight: true, insurance: true, add: true, subtract: true }
        };
        
        let config = fieldActions[tradeTerm] || fieldActions['default'];
        updateFieldStyle('FRT_AMT', config.freight);  // 運費
        updateFieldStyle('INS_AMT', config.insurance); // 保險費
        updateFieldStyle('ADD_AMT', config.add); // 應加費用
        updateFieldStyle('SUBTRACT_AMT', config.subtract); // 應減費用
    });
}

function monitorCountryCodeChange() {
    const countryCodeInput = document.getElementById("CNEE_COUNTRY_CODE");
    const cneeBanIdInput = document.getElementById("CNEE_BAN_ID");
    const buyerENameInput = document.getElementById("BUYER_E_NAME");
    const buyerEAddrInput = document.getElementById("BUYER_E_ADDR");

    function updateFieldsVisibility() {
        const isTW = countryCodeInput.value.trim().toUpperCase() === "TW";
        const action = isTW ? "remove" : "add";

        cneeBanIdInput.closest(".header-group").classList[action]("hidden");
        buyerENameInput.closest(".header-group").classList[action]("hidden");
        buyerEAddrInput.closest(".header-group").classList[action]("hidden");
    }

    countryCodeInput.addEventListener("input", updateFieldsVisibility);

    // 初始化執行一次，以確保正確顯示/隱藏欄位
    updateFieldsVisibility();
}

// 監聽 DOM 加載後執行
document.addEventListener("DOMContentLoaded", monitorCountryCodeChange);

// 啟用事件監聽，處理國家代碼的樣式變更
handleCountryCodeInput('CNEE_COUNTRY_CODE', ['CNEE_BAN_ID', 'BUYER_E_NAME', 'BUYER_E_ADDR'], 'TW');

// 啟用事件監聽，處理貿易條件的樣式變更
handleTradeTerms('TERMS_SALES');

// 使用事件代理處理所有 type="number" 的輸入框
document.addEventListener('keydown', function(event) {
    const target = event.target;

    // 當目標是 type="number" 的輸入框，禁止調整數值
    if (target.tagName === 'INPUT' && target.type === 'number') {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
        }
    }
});

// 防止數字輸入框的滾輪調整，但允許頁面滾動
document.addEventListener('wheel', function(event) {
    const target = event.target;

    // 當目標是 type="number" 的輸入框且輸入框處於聚焦狀態時，禁止滾輪調整數值
    if (target.tagName === 'INPUT' && target.type === 'number' && target === document.activeElement) {
        event.preventDefault(); // 禁止滾輪調整數值
    }
}, { passive: false }); // 使用 { passive: false } 以便可以調用 preventDefault

window.addEventListener('beforeunload', function (event) {
    event.preventDefault();
    event.returnValue = ''; // 必須設置，才能顯示提示框
});

let lastFocusedElement = null;

// 事件委派，監聽所有輸入框、按鈕的 focus 和 blur 事件
document.addEventListener('focusin', function (event) {
    if (event.target.matches('input, textarea, select, button')) {
        // 移除先前的反色效果
        if (lastFocusedElement && lastFocusedElement !== event.target) {
            lastFocusedElement.classList.remove('highlighted-element');
        }
        
        // 為新獲得焦點的元素添加反色
        event.target.classList.add('highlighted-element');
        lastFocusedElement = event.target;
    }
});

document.addEventListener('focusout', function (event) {
    if (event.target.matches('input, textarea, select, button')) {
        // 當元素失去焦點後，保持反色，直到新的元素獲得焦點時才移除
        event.target.classList.add('highlighted-element');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
        // 排除特定輸入框不顯示清除按鈕
        if (input.id === 'decimal-places' || 
            input.id === 'weight-decimal-places' || 
            input.id === 'specific-range' || 
            input.id === 'specific-weight' ||
            input.id === 'exchange-rate' ||
            input.id === 'start-number' ||
            input.id === 'Maker') {
            return;
        }

        input.dataset.prevValue = ""; // 初始化記錄原始值
        input.style.position = 'relative';
        input.parentNode.style.position = 'relative';

        // 建立清除按鈕
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = 'X';
        clearBtn.setAttribute('type', 'button');  // 防止觸發表單提交
        clearBtn.setAttribute('tabindex', '-1');  // 避免 TAB 鍵聚焦
        clearBtn.style.position = 'absolute';
        clearBtn.style.width = '20px';
        clearBtn.style.height = '20px';
        clearBtn.style.fontSize = '12px';
        clearBtn.style.color = 'gray';
        clearBtn.style.backgroundColor = '#e6e6e6';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '50%';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.display = 'none';
        clearBtn.style.padding = '0';

        // 插入清除按鈕到輸入框的父容器內
        input.parentNode.insertBefore(clearBtn, input.nextSibling);

        // 設定按鈕位置（在輸入框內右側）
        const positionButton = () => {
            const inputStyle = window.getComputedStyle(input);
            const paddingRight = parseInt(inputStyle.paddingRight) || 0;
            const borderRight = parseInt(inputStyle.borderRightWidth) || 0;
            clearBtn.style.right = `${paddingRight + borderRight + 5}px`;
            clearBtn.style.top = `${input.offsetTop + (input.offsetHeight / 2) - (clearBtn.offsetHeight / 2)}px`;

            const hasDropdown = ['DCL_DOC_TYPE', 'TERMS_SALES', 'TRADE_MARK', 'ST_MTD'].includes(input.id);

            if (hasDropdown) {
                clearBtn.style.left = `${input.offsetLeft + input.offsetWidth - clearBtn.offsetWidth - paddingRight - borderRight - 20}px`;
            } else {
                clearBtn.style.left = `${input.offsetLeft + input.offsetWidth - clearBtn.offsetWidth - paddingRight - borderRight}px`;
            }
        };

        positionButton();
        window.addEventListener('resize', positionButton);
        window.addEventListener('scroll', positionButton);

        clearBtn.addEventListener('mousedown', (event) => {
            event.preventDefault();  // 防止輸入框失去焦點
        });
        
        // 事件處理：點擊清除按鈕
        clearBtn.addEventListener('click', (event) => {
            event.preventDefault();  // 阻止預設表單提交行為
            input.dataset.prevValue = input.value; // **記錄清除前的值**
            input.value = '';
            input.focus();
            clearBtn.style.display = 'none';

            switch (input.id) {
                case 'SHPR_BAN_ID':
                    searchData();
                    break;
                case 'BUYER_E_NAME':
                    document.getElementById('BUYER_BAN').value = '';
                    break;
                case 'TO_CODE':
                    document.getElementById('TO_DESC').value = '';
                    break;
                case 'TO_DESC':
                    document.getElementById('TO_CODE').value = '';
                    break;
                case 'CNEE_COUNTRY_CODE':
                    monitorCountryCodeChange();
                    let cneeFields = ['CNEE_BAN_ID', 'BUYER_E_NAME', 'BUYER_E_ADDR'];
                    cneeFields.forEach(fieldId => {
                        let label = document.querySelector(`label[for="${fieldId}"]`);
                        if (label) {
                            label.style.background = 'transparent'; // 恢復背景透明
                        }
                    });
                    document.getElementById('CNEE_COUNTRY_CODE').value = '';
                    break;
                case 'TERMS_SALES':
                    let termsFields = ['FRT_AMT', 'INS_AMT', 'ADD_AMT', 'SUBTRACT_AMT'];
                    termsFields.forEach(fieldId => {
                        let label = document.querySelector(`label[for="${fieldId}"]`);
                        if (label) {
                            label.style.background = ''; // 恢復預設背景
                        }
                    });
                    break;
                case 'CURRENCY':
                    document.getElementById('exchange-rate').value = '';
                    let currencyError = document.getElementById("currency-error");
                    if (currencyError) {
                        currencyError.style.display = "none";
                    }
                    break;
            }
        });

        // 監聽 `Alt + Backspace`，復原內容並手動觸發 `oninput` 和 `onblur`
        input.addEventListener('keydown', (event) => {
            if (event.altKey && event.key === 'Backspace') {
                event.preventDefault();
                if (input.dataset.prevValue !== "") {
                    input.value = input.dataset.prevValue;
                    input.dataset.prevValue = ""; // **清除記錄，避免多次撤銷**
                    
                    // **手動觸發 `input` 和 `blur` 事件**
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));

                    // **顯示清除按鈕**
                    clearBtn.style.display = 'block';
                    positionButton(); // 確保按鈕位置正確
                }
            }
        });

        // 事件處理：輸入框獲取焦點時顯示按鈕（無論是否有內容）
        input.addEventListener('focus', () => {
            clearBtn.style.display = 'block';
            positionButton();
        });

        // 事件處理：輸入框內容改變時顯示或隱藏按鈕
        input.addEventListener('input', () => {
            clearBtn.style.display = input.value ? 'block' : 'none';
        });

        // 事件處理：輸入框失去焦點時隱藏按鈕
        input.addEventListener('blur', () => {
            clearBtn.style.display = 'none';
        });

        // 設定滑鼠移入與移出時的背景顏色變化
        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.color = 'white';
            clearBtn.style.backgroundColor = '#f37380';
        });

        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.color = 'gray';
            clearBtn.style.backgroundColor = '#e6e6e6';
        });
    });
});

// 當頁面載入時，檢查 localStorage 是否有儲存的製單人員資料
window.addEventListener('DOMContentLoaded', () => {
    const savedMaker = localStorage.getItem('Maker');
    if (savedMaker !== null) {
        document.getElementById('Maker').value = savedMaker;
    }
});

// 按下儲存按鈕時，將製單人員名稱儲存到 localStorage
document.getElementById('saveMaker').addEventListener('click', () => {
    const maker = document.getElementById('Maker').value;
    localStorage.setItem('Maker', maker);
    alert('製單人員已儲存！');
});

document.addEventListener("DOMContentLoaded", function () {
    const totCtnInput = document.getElementById("TOT_CTN");
    const dclGwInput = document.getElementById("DCL_GW");

    function checkWeightLimit() {
        const totCtn = parseInt(totCtnInput.value, 10);
        const dclGw = parseFloat(dclGwInput.value);

        if (!isNaN(totCtn) && totCtn > 0 && !isNaN(dclGw)) {
            const avgWeight = dclGw / totCtn;
            if (avgWeight > 70) {
                iziToast.warning({
                    title: "注意",
                    message: "單件超過70公斤，需一般倉通關",
                    position: "center",
                    timeout: 4000,
                    backgroundColor: '#ffeb3b',
                });
            }
        }
    }

    totCtnInput.addEventListener("input", checkWeightLimit);
    dclGwInput.addEventListener("input", checkWeightLimit);
});

let isWarningShown = false; // 在全域範圍宣告變數

function checkTotalAmount() {
    const totalAmountInput = document.getElementById('CAL_IP_TOT_ITEM_AMT');
    const totalAmount = parseFloat(totalAmountInput.value) || 0;
    const exchangeRate = parseFloat(document.getElementById('exchange-rate').value) || 0;
    const usdExchangeRate = parseFloat(document.getElementById('usd-exchange-rate').value) || 0;

    if (totalAmount > 0 && exchangeRate > 0 && usdExchangeRate > 0) {
        const totalAmountInUSD = (totalAmount * exchangeRate) / usdExchangeRate;

        if (hasNoData && totalAmountInUSD > 20000) {
            if (!isWarningShown) {
                isWarningShown = true; // 設定旗標避免重複顯示
                iziToast.warning({
                    title: '注意',
                    message: `（個人或未向國際貿易署登記出進口廠商資料者，<br>
                    出口金額限制美金兩萬以下，且通關必驗，<br>
                    若金額超過美金兩萬需檢附輸出許可證才可出口）`,
                    position: 'center',
                    timeout: 5000,
                    backgroundColor: '#ffeb3b',
                    onClosed: function() {
                        isWarningShown = false; // 當提示關閉後重置旗標
                    }
                });
            }
        } else {
            isWarningShown = false; // 若金額沒超過兩萬或其他情況重置旗標
        }
    } else {
        isWarningShown = false; // 若條件不符合重置旗標
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setupCneeCNameWatcher();
});

// 初始化監聽 CNEE_C_NAME 欄位變化
function setupCneeCNameWatcher() {
    const toggleLabel = document.getElementById("toggleCneeName");
    const cneeCNameGroup = document.getElementById("cnee_c_name_group");
    const cneeCNameInput = document.getElementById("CNEE_C_NAME");

    if (!toggleLabel || !cneeCNameGroup || !cneeCNameInput) return;

    function updateVisibility() {
        if (cneeCNameInput.value.trim() !== "") {
            cneeCNameGroup.classList.remove("hidden");
        } else {
            cneeCNameGroup.classList.add("hidden");
        }
        updateCneeLabelText(); // **確保標題同步變更**
    }

    function updateCneeLabelText() {
        if (cneeCNameGroup.classList.contains("hidden")) {
            toggleLabel.textContent = "買方中/英名稱";
        } else {
            toggleLabel.textContent = "買方英文名稱";
        }
    }

    // 監聽手動輸入變化
    cneeCNameInput.addEventListener("input", updateVisibility);
    cneeCNameInput.addEventListener("change", updateVisibility);

    // **監聽 `value` 變更，即使是程式設定**
    const observer = new MutationObserver(() => {
        updateVisibility();
        cneeCNameInput.dispatchEvent(new Event("input")); // 觸發 UI 更新
    });

    observer.observe(cneeCNameInput, { attributes: true, attributeFilter: ["value"] });

    // **點擊切換按鈕**
    toggleLabel.addEventListener("click", function () {
        if (cneeCNameGroup.classList.contains("hidden")) {
            cneeCNameGroup.classList.remove("hidden");
        } else {
            if (cneeCNameInput.value.trim() === "") {
                cneeCNameGroup.classList.add("hidden");
            }
        }
        updateCneeLabelText(); // **確保點擊按鈕時標題同步變更**
    });

    // **初始化 UI**
    updateVisibility();
}

// 匯入資料後，強制更新 CNEE_C_NAME 可見性 + 更新標題
function updateCneeCNameVisibility() {
    const cneeCNameInput = document.getElementById("CNEE_C_NAME");
    if (cneeCNameInput) {
        setTimeout(() => {
            cneeCNameInput.dispatchEvent(new Event("input")); // 觸發 UI 更新
            updateCneeLabelText(); // **確保標題也更新**
        }, 50); // 確保匯入資料後 UI 更新
    }
}

// 獨立函式：更新 `toggleLabel.textContent`
function updateCneeLabelText() {
   const toggleLabel = document.getElementById("toggleCneeName");
   const cneeCNameGroup = document.getElementById("cnee_c_name_group");

   if (toggleLabel && cneeCNameGroup) {
       toggleLabel.textContent = cneeCNameGroup.classList.contains("hidden")
           ? "買方中/英名稱"
           : "買方英文名稱";
   }
}

document.addEventListener("DOMContentLoaded", function () {

    /**
     * 檢查元素是否可見（排除 display: none、visibility: hidden、hidden 屬性、.hidden 類別）
     * @param {HTMLElement} el - 欲檢查的元素
     * @returns {boolean} - 是否可見
     */
    function isVisible(el) {
        return (
            el.offsetParent !== null &&
            !el.hasAttribute("hidden") &&
            !el.classList.contains("hidden") &&
            getComputedStyle(el).visibility !== "hidden"
        );
    }

    /**
     * 套用 Alt + 上下鍵 切換功能至指定區塊
     * @param {string} containerSelector - 區塊的 CSS 選擇器
     */
    function enableAltArrowNavigation(containerSelector) {
        // 取得區塊內所有 input 與 textarea 欄位
        const focusableElements = Array.from(
            document.querySelectorAll(`${containerSelector} input, ${containerSelector} textarea`)
        );

        // 對每個欄位綁定 Alt + 上下鍵事件
        focusableElements.forEach((el, index) => {
            el.addEventListener("keydown", (e) => {
                // Alt + ↑：跳到上一個可見欄位
                if (e.altKey && e.key === "ArrowUp") {
                    e.preventDefault();
                    let prevIndex = index - 1;
                    while (prevIndex >= 0) {
                        if (isVisible(focusableElements[prevIndex])) {
                            focusableElements[prevIndex].focus();
                            break;
                        }
                        prevIndex--;
                    }
                }
                // Alt + ↓：跳到下一個可見欄位
                else if (e.altKey && e.key === "ArrowDown") {
                    e.preventDefault();
                    let nextIndex = index + 1;
                    while (nextIndex < focusableElements.length) {
                        if (isVisible(focusableElements[nextIndex])) {
                            focusableElements[nextIndex].focus();
                            break;
                        }
                        nextIndex++;
                    }
                }
            });
        });
    }

    // 套用於出口報單表頭
    enableAltArrowNavigation("#header");

    // 套用於新增項次彈跳框
    enableAltArrowNavigation("#item-modal");

});
