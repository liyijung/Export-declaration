// 轉檔客戶 - 23570158 利保國際股份有限公司
function importCustomer23570158(event) {

    // 先清空現有數據
    clearExistingData();

    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var data = new Uint8Array(event.target.result);
        var workbook = XLSX.read(data, { type: 'array' });

        // 獲取第一個工作表
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        var sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // 替換表：鍵為原始 CCC_CODE，值為替換後的代碼
        var cccCodeMapping = {
            '58013300': '58013300002',
            '54075200': '54075200006',
            '59039090': '59039090000',
            '39211310': '39211310904',
            '56039410': '56039490009',
            '58071000': '58071010001',
            '39209990': '39209991003',
            '56031410': '56031490006',
            '39269090': '39269090908',
            '59069990': '59069990008',
            '39206200': '39206210004',
            '32151900': '32151990005',
            '56039290': '56039290001',
            '56039390': '56039390000',
            '58061090': '58061090005',
            '61179000': '61179090000',
            '39199090': '39199090006',
            '39191099': '39191000002',
            '39100000': '39100030007',
            '35069190': '35069110001',
            '32041700': '32041719909',
            '59032020': '59032010002',
            '39211391': '39211310904',
            '39211392': '39211310904',
            '56031400': '56031490006',
            '39209939': '39209911000',
            '741980': '74198090005',
        };

        // 用來保存上一個項次的 DESCRIPTION 和 CCC_CODE
        var lastDescription = '';
        var lastCccCode = '';

        // 用來追蹤 CERT_NO_ITEM 的編號
        var certNoItemCount = 1;

        // 用來追蹤 TRADE_MARK 狀態，初始設置為 false
        var useFigForTrademark = false;
        
        // 讀取指定的欄位數據，並檢查是否存在數據
        var a7 = sheetData[6] ? sheetData[6][0] || '' : '';
        var a10 = sheetData[9] ? sheetData[9][0] || '' : '';
        var a11 = sheetData[10] ? sheetData[10][0] || '' : '';
        var a12 = sheetData[11] ? sheetData[11][0] || '' : '';
        var a13 = sheetData[12] ? sheetData[12][0] || '' : '';
        var e9 = sheetData[8] ? sheetData[8][4] || '' : '';
        var e10 = sheetData[9] ? sheetData[9][4] || '' : '';
        var e17 = sheetData[16] ? sheetData[16][4] || '' : '';
        var g17 = sheetData[16] ? sheetData[16][6] || '' : '';
        var g18 = sheetData[17] ? sheetData[17][6] || '' : '';
        var h20 = sheetData[19] ? sheetData[19][7] || '' : '';

        // 如果 e9 為空，取 a10 的值
        if (!e9) {
            e9 = a10;
        }

        // 如果 e10 為空，取 a11, a12 和 a13 的值並合併
        if (!e10) {
            e10 = a11 + a12 + a13;
        }

        // 如果 e17 為空，取 g18 的值
        if (!e17) {
            if (!g18) {
                e17 = g17;
            } else {
                e17 = g18;
            }
        }

        // 設置 CNEE_COUNTRY_CODE 根據 CNEE_E_NAME 的內容
        var cneeCountryCode = '';
        var toCode = '';
        var toDesc = '';
        if (e9.includes('VIETNAM')) {
            cneeCountryCode = 'VN';
            toCode = 'VNLBT';
            toDesc = 'LONG BINH TAN';
        } else if (e9.includes('BINH DUONG')) {
            cneeCountryCode = 'VN';
            toCode = 'VNBDU';
            toDesc = 'BINH DUONG';
        } else if (e9.includes('東莞')) {
            cneeCountryCode = 'CN';
            toCode = 'CNDGG';
            toDesc = 'Dongguan';
        } else if (e9.includes('無錫')) {
            cneeCountryCode = 'CN';
            toCode = 'CNWUX';
            toDesc = 'Wuxi';
        }

        // 找到 H 列最後有值的位置並檢查對應的 C 列是否有 "TOTAL"
        var calIpTotItemAmt = '';
        for (var i = sheetData.length - 1; i >= 0; i--) {
            var hValue = sheetData[i][7] || '';
            var cValue = sheetData[i][2] || '';
            if (hValue && cValue.includes('TOTAL')) {
                calIpTotItemAmt = hValue.toFixed(2); // 保存最後一個 H 列有值且 C 列包含 "TOTAL" 的行的值
                break;
            }
        }

        // 獲取第二個工作表
        var secondSheet = workbook.Sheets[workbook.SheetNames[1]];
        var sheetDataSecond = XLSX.utils.sheet_to_json(secondSheet, { header: 1 });


        // 遍歷第二個工作頁的數據
        for (var i = 0; i < sheetDataSecond.length; i++) {
            var aValue = sheetDataSecond[i][0] || '';  // A 列的值
            var bValue = sheetDataSecond[i][1] || '';  // B 列的值
            var cValue = sheetDataSecond[i][2] || '';  // C 列的值
            var dValue = sheetDataSecond[i][3] || '';  // D 列的值

            // 確保 aValue 是字串
            aValue = String(aValue);
            
            if (aValue.includes('S.TOTAL')) {
                // 如果 bValue 不包含 '+' 號，則將 ctnDesc 設置為空
                if (!bValue.includes('+')) {
                    var ctnDesc = ''; // 如果 bValue 不包含 '+'，設為空
                } else {
                    // 去除 "ONLY" 及其後的所有內容，包括 "-" 符號
                    var ctnDesc = bValue.replace(/ONLY[\s\S]*/i, '').replace(/-$/, '').trim();
                }

                // 將提取到的值設置到 CTN_DESC 欄位
                var ctnDescElement = document.getElementById('CTN_DESC');
                if (ctnDescElement) {
                    ctnDescElement.value = ctnDesc;
                }
                break; // 找到後退出循環
            }
        }

        // 獲取 F16 欄位的值 (第 16 行，第 6 列)
        var f16Value = sheetDataSecond[15] ? sheetDataSecond[15][5] || '' : '';

        // 組合 DOC_MARKS_DESC 字符串
        if (e9.includes('無錫') || a10 === 'LEE BOU INTERNATIONAL BINH DUONG COMPANY LIMITED') {
            var docMarksDesc = 'LB\n(IN REC.)\n' + f16Value;
        } else {
            var docMarksDesc = 'LB\n(IN TRI.)\n' + f16Value;
        }

        // 將資料填入對應的欄位
        document.getElementById('DOC_MARKS_DESC').value = docMarksDesc;

        // 獲取 B 列的最後一行數據
        var lastBValue = "";
        for (var i = sheetDataSecond.length - 1; i >= 0; i--) {
            if (sheetDataSecond[i][1]) { // B 列數據位於索引 1
                lastBValue = sheetDataSecond[i][1];
                break;
            }
        }

        // 檢查並設置 TOT_CTN
        var totCtnElement = document.getElementById('TOT_CTN');
        if (totCtnElement) {
            totCtnElement.value = lastBValue;
        }

        // 字符串 "SAY TOTAL : XX PKG ONLY" 在第二個工作表
        var totalString = sheetDataSecond.find(row => row[1] && row[1].includes("SAY TOTAL"));

        if (totalString) {
            // 使用正則表達式提取
            var match = totalString[1].match(/TOTAL\s*:\s*(\d+)\s*(\w+)\s*ONLY/i);
            if (match) {
                var totalCtnValue = match[1]; // 提取數字部分
                var totalCtnUnit = match[2];  // 提取單位部分

                // 如果單位是 ROLL，改成 ROL
                if (totalCtnUnit === 'ROLL') {
                    totalCtnUnit = 'ROL';
                }

                // 如果單位是 CARTON，改成 CTN
                if (totalCtnUnit === 'CARTON') {
                    totalCtnUnit = 'CTN';
                }
                
                // 設置數字部分到 TOT_CTN
                var totCtnElement = document.getElementById('TOT_CTN');
                if (totCtnElement) {
                    totCtnElement.value = totalCtnValue;
                }

                // 設置單位部分到 DOC_CTN_UM
                var docCtnUmElement = document.getElementById('DOC_CTN_UM');
                if (docCtnUmElement) {
                    docCtnUmElement.value = totalCtnUnit;
                }
            }
        }

        // 獲取 E 列中最後一個數字作為 DCL_GW
        var lastEValue = "";
        for (var i = sheetDataSecond.length - 1; i >= 0; i--) {
            var eValue = parseFloat(sheetDataSecond[i][4]); // E列數據位於索引 4
            if (!isNaN(eValue)) {
                lastEValue = eValue;
                break;
            }
        }

        // 獲取 D 列中最後一個數字作為 DCL_NW
        var lastDValue = "";
        for (var i = sheetDataSecond.length - 1; i >= 0; i--) {
            var dValue = parseFloat(sheetDataSecond[i][3]); // D列數據位於索引 3
            if (!isNaN(dValue)) {
                lastDValue = dValue;
                break;
            }
        }

        // 設置 DCL_GW 和 DCL_NW 到相應的欄位，並限制小數位數
        var dclGwElement = document.getElementById('DCL_GW');
        var dclNwElement = document.getElementById('DCL_NW');
        
        if (dclGwElement) {
            dclGwElement.value = lastEValue.toFixed(2); // 確保顯示 2 位小數
        }

        if (dclNwElement) {
            dclNwElement.value = lastDValue.toFixed(2); // 確保顯示 2 位小數
        }

        // 將資料填入對應的欄位
        document.getElementById('SHPR_BAN_ID').value = '23570158';
        document.getElementById('DCL_DOC_EXAM').value = '58';
        document.getElementById('SHPR_C_NAME').value = '利保國際股份有限公司';
        document.getElementById('SHPR_E_NAME').value = 'LEE BOU INTERNATIONAL CO., LTD.';
        document.getElementById('SHPR_C_ADDR').value = '彰化縣和美鎮竹園里彰新路4段291-1號';
        document.getElementById('SHPR_E_ADDR').value = 'No. 291-1, Sec. 4, Zhangxin Rd., Zhuyuan Vil., Hemei Township, Changhua County 50847, Taiwan (R.O.C.)';
        document.getElementById('SHPR_TEL').value = '04-7364480';
        document.getElementById('CNEE_E_NAME').value = e9;
        document.getElementById('CNEE_COUNTRY_CODE').value = cneeCountryCode;
        document.getElementById('TO_CODE').value = toCode;
        document.getElementById('TO_DESC').value = toDesc;
        document.getElementById('LOT_NO').value = e17;
        document.getElementById('DCL_DOC_TYPE').value = 'G5';
        document.getElementById('TERMS_SALES').value = 'CIF';
        document.getElementById('CURRENCY').value = h20;
        document.getElementById('CAL_IP_TOT_ITEM_AMT').value = calIpTotItemAmt;
        
        // 定義 itemContainer 用來放置生成的項次
        var itemContainer = document.getElementById('item-container');

        // 從第23行開始
        for (var i = 22; i < sheetData.length; i++) {
            var cValue = sheetData[i][2] || ''; // C列數據
            var dValue = sheetData[i][3] || ''; // D列數據
            var eValue = sheetData[i][4] || ''; // E列數據
            var iValue = sheetData[i][8] || ''; // I列數據
            var jValue = sheetData[i][9] || ''; // J列數據

            // 如果C列和D列同時為空，則跳過該項次
            if (cValue === '' && dValue === '') {
                break; // 終止處理
            }

            // 如果 C 列是符號，使用上一個項次的數據
            var description = '';
            var cccCode = '';
            var goodsModel = '';
            var goodsSpec = '';

            if (cValue === '"') {
                description = lastDescription + '\n' + dValue;
                cccCode = lastCccCode;
            } else {
                // 否則，合併C列與D列作為 DESCRIPTION
                description = cValue + '\n' + dValue;

                // 取C列的前8碼做為 CCC_CODE
                cccCode = (sheetData[i][2] || '').toString().substring(0, 8); // 確保為字串後再取前8碼

                // 檢查C列前8碼是否為數字，如果不是，使用 M 列 或 L 列
                var isNumeric = /^\d{8}$/.test(cccCode); // 正則檢查是否為8位數字
                var hsCodePattern = /HS\s*CODE/; // 正則檢查是否包含 HS CODE

                // M 列 (第 13 列) 和 L 列 (第 12 列) 的值
                var m22Value = sheetData[21][12];
                var l22Value = sheetData[21][11];

                if (!isNumeric) {
                    // 使用 M 列，如果 M 列符合 HS CODE，則使用 M 列的值
                    if (hsCodePattern.test(m22Value)) {
                        cccCode = (sheetData[i][12] || '').toString();
                    }
                    // 否則檢查 L 列是否符合 HS CODE，使用 L 列的值
                    else if (hsCodePattern.test(l22Value)) {
                        cccCode = (sheetData[i][11] || '').toString();
                    }
                }

                // 檢查是否需要替換 CCC_CODE
                if (cccCodeMapping[cccCode]) {
                    cccCode = cccCodeMapping[cccCode];
                }

                // 保存當前項次的 DESCRIPTION 和 CCC_CODE 以備下次使用
                lastDescription = cValue;
                lastCccCode = cccCode;
            }

            // 處理 CERT_NO，如果內含 "不申請ECFA" 或 "不做ECFA"，則設置為空
            var certNo = String(iValue || '');
            if (certNo.includes('不申請ECFA') || certNo.includes('不做ECFA') || certNo.includes('*') || certNo.includes('以下')) {
                certNo = '';
            }

            // 如果 CERT_NO 是 "申請ECFA" 或 "做ECFA" 或 "ECFA"，CERT_NO_ITEM 從 1 開始依序編號
            var certNoItem = '';
            if (certNo === '申請ECFA' || certNo === '做ECFA' || certNo === 'ECFA') {
                goodsModel = 'NIL';
                goodsSpec = 'NIL';
                certNoItem = certNoItemCount++;
            }

            // 檢查 I 列 或 J 列是否為 "以下有LOGO"
            if (String(iValue).includes('以下有LOGO') || String(jValue).includes('以下有LOGO')) {
                useFigForTrademark = true; // 後續的項次 TRADE_MARK 設為 "FIG"
            }

            // 設置 TRADE_MARK，如果標誌為 true，則設為 "FIG"
            var tradeMark = useFigForTrademark ? 'FIG' : 'NO BRAND';

            // 匹配第二個工作表品名數量後獲取項次淨重
            var netWeight = 0;
            
            for (var j = 0; j < sheetDataSecond.length; j++) {
                var secondSheetBValue = sheetDataSecond[j][1] || ''; // 第二個工作表 B 列
                var secondSheetCValue = sheetDataSecond[j][2] || ''; // 第二個工作表 C 列
                var secondSheetDValue = sheetDataSecond[j][3] || ''; // 第二個工作表 D 列 (NET_WT)

                // 確保先將 secondSheetCValue 轉換為字串
                var secondSheetCValueStr = secondSheetCValue ? secondSheetCValue.toString() : '';

                // 檢查是否包含 (@數字*數字) 格式，並同時忽略字母單位
                var matchC = secondSheetCValueStr.match(/\(@(\d+(\.\d+)?)[A-Za-z]*\*?(\d+(\.\d+)?)?\)[A-Za-z]*/);
                if (matchC) {
                    // 提取有效數字並進行計算，如果第二個數字不存在，默認為 1
                    var firstNumC = parseFloat(matchC[1]);
                    var secondNumC = parseFloat(matchC[3]) || 1; // 默認為 1
                    var calculatedValueC = firstNumC * secondNumC;

                    // 將計算結果替換到原始值中，移除單位字符
                    secondSheetCValueStr = calculatedValueC.toString();
                }

                // 確保先將 secondSheetDValue 轉換為字串
                var secondSheetDValueStr = secondSheetDValue ? secondSheetDValue.toString() : '';

                // 檢查是否包含 (@數字*數字) 格式，並同時忽略字母單位
                var matchD = secondSheetDValueStr.match(/\(@(\d+(\.\d+)?)[A-Za-z]*\*?(\d+(\.\d+)?)?\)[A-Za-z]*/);
                if (matchD) {
                    // 提取數字並進行計算，如果第二個數字不存在，默認為 1
                    var firstNumD = parseFloat(matchD[1]);
                    var secondNumD = parseFloat(matchD[3]) || 1; // 默認為 1
                    var calculatedValueD = firstNumD * secondNumD;

                    // 將計算結果替換到原始值中
                    secondSheetDValueStr = calculatedValueD.toString();
                }

                var cleanedDValue = dValue ? dValue.toString() : '';
                var cleanedEValue = eValue ? eValue.toString().replace(/[^\d.]/g, '') : ''; // 移除非數字字符
                var cleanedSecondSheetBValue = secondSheetBValue.toString();
                var cleanedSecondSheetCValueStr = secondSheetCValueStr.replace(/[^\d.]/g, ''); // 移除非數字字符

                // 檢查 D 列和 E 列是否與第二個工作表的 B 列和 C 列匹配
                if (cleanedSecondSheetBValue.includes(cleanedDValue) && cleanedEValue === cleanedSecondSheetCValueStr) {
                    netWeight = secondSheetDValueStr; // 如果匹配，將 D 列的值設置為 NET_WT
                    break; // 找到匹配後可以退出循環
                } else if (cleanedDValue.includes(cleanedSecondSheetBValue) && cleanedEValue === cleanedSecondSheetCValueStr) {
                    netWeight = secondSheetDValueStr; // 如果匹配，將 D 列的值設置為 NET_WT
                    break; // 找到匹配後可以退出循環
                }
            }

            // F 列的值
            var fValue = (sheetData[i][5] || '').toUpperCase(); // 將值轉為大寫

            // 只有當 F 列的值是 Y 或 M 時，才執行寬度的提取
            var wideValue = ''; // 預設寬度為空
            var wideUm = '';    // 預設寬度單位為空
            var lengthValue = ''; // 預設長度為空
            var lengthUmValue = ''; // 預設長度單位為空

            if (fValue === 'Y' || fValue === 'M') {
                var j22Value = sheetData[21][9];
                var i22Value = sheetData[21][8];

                if ((j22Value && j22Value.includes("幅寬"))) {
                    // 如果 J22 包含 "幅寬"，從 J 欄提取寬度
                    // 使用正則表達式匹配類似 "142cm" 的部分來提取寬度
                    var wideMatch = jValue.match(/(\d+)\s*cm/);
                    if (wideMatch) {
                        wideValue = (parseFloat(wideMatch[1]) / 100).toFixed(2); // 提取數字部分，並除以100轉換成米
                        wideUm = 'MTR'; // 如果提取到寬度，設置單位為 MTR
                    }
                } else if ((i22Value && i22Value.includes("幅寬"))) {
                    // 如果 I22 包含 "幅寬"，從 I 欄提取寬度
                    // 使用正則表達式匹配類似 "142cm" 的部分來提取寬度
                    var wideMatch = iValue.match(/(\d+)\s*cm/);
                    if (wideMatch) {
                        wideValue = (parseFloat(wideMatch[1]) / 100).toFixed(2); // 提取數字部分，並除以100轉換成米
                        wideUm = 'MTR'; // 如果提取到寬度，設置單位為 MTR
                    }
                } else {
                    // 如果 I / J 欄沒有值，從第二工作表查找
                    var descriptionS = sheetData[i][2] || ''; // 獲取當前行的品名

                    // 在第二工作表中查找對應品名
                    for (var j = 0; j < sheetDataSecond.length; j++) {
                        var secondSheetDescription = sheetDataSecond[j][1] || ''; // 第二工作表 B 列品名

                        if (secondSheetDescription.includes(descriptionS)) {
                            // 找到匹配的品名，往下繼續查找 Width 格式的文字
                            for (var k = j + 1; k < sheetDataSecond.length; k++) {
                                var secondSheetText = sheetDataSecond[k][1] || ''; // 第二工作表 B 列內容

                                // 使用正則表達式匹配類似 "142cm Width" 的部分
                                var widthMatch = secondSheetText.match(/(\d+)\s*cm\s*Width/);
                                if (widthMatch) {
                                    wideValue = (parseFloat(widthMatch[1]) / 100).toFixed(2); // 提取數字部分並除以100轉換成米
                                    wideUm = 'MTR'; // 設置單位為 MTR
                                    break; // 找到後退出循環
                                }
                            }
                            break; // 找到品名後退出循環
                        }
                    }
                }

                // 設置長度為 QTY 的值
                lengthValue = sheetData[i][4] || ''; // 設置 lengthValue 為 QTY 的值
                lengthUmValue = sheetData[i][5] || ''; // 設置 lengthUmValue 為 DOC_UM 的值
            }

            // 構造 itemData 對象傳遞給 createItemRow 函數
            var stMtd = '02'; // 預設值
            if (String(sheetData[i][7]).trim() === 'FOC-04') {
                stMtd = '04';
            }

            var qty = parseFloat(sheetData[i][4]) || 0;
            var docUnitP = parseFloat(sheetData[i][6]) || 0;
            var docTotP = (qty * docUnitP).toFixed(2);

            var itemData = {
                DESCRIPTION: description,
                QTY: sheetData[i][4] || '',
                DOC_UM: sheetData[i][5] || '',
                DOC_UNIT_P: sheetData[i][6] || '',
                DOC_TOT_P: docTotP,
                GOODS_MODEL: goodsModel,
                GOODS_SPEC: goodsSpec,
                CERT_NO: certNo,
                CERT_NO_ITEM: certNoItem,
                TRADE_MARK: tradeMark,
                CCC_CODE: cccCode,
                ST_MTD: stMtd,
                NET_WT: netWeight || '',      // 淨重，並限制為兩位小數
                WIDE: wideValue || '',        // 設置提取到的寬度，只有符合條件時才會有值
                WIDE_UM: wideUm || '',        // 設置提取到的寬度單位，只有符合條件時才會有值
                LENGT_: lengthValue  || '',        // 設置提取到的長度，只有符合條件時才會有值
                LENGTH_UM: lengthUmValue || '', // 設置提取到的長度單位，只有符合條件時才會有值
                ST_UM: '',
            };

            // 使用 createItemRow 函數生成項次並加入 itemContainer
            const itemRow = createItemRow(itemData);
            itemContainer.appendChild(itemRow);
        }

        // 初始化 DOC_OTR_DESC 的變數
        var docOtrDesc = a7 || ""; // 確保初始值來自 a7，如果 a7 沒有值則為空字符串

        // 遍歷每一行，查找第一個工作頁的 I 列是否包含 "申請ECFA" 或 "做ECFA"
        for (var i = 0; i < sheetData.length; i++) {
            var iValue = sheetData[i][8]; // I列的數據位於索引 8

            if (iValue && iValue === "申請ECFA" || iValue && iValue === "做ECFA") {
                // 如果 I 列包含 "申請ECFA" 或 "做ECFA"，則在 DOC_OTR_DESC 中加入備註"
                if (certNoItemCount === 2) {
                    docOtrDesc += `\nITEM 1 申請ECFA，產證編號：`;
                } else {
                    docOtrDesc += `\nITEM 1-${certNoItemCount-1} 申請ECFA，產證編號：`;
                }
                break; // 只需要添加一次，找到後退出循環
            }
        }

        // 設置 DOC_OTR_DESC 到相應的欄位
        var docOtrDescElement = document.getElementById('DOC_OTR_DESC');
        if (docOtrDescElement) {
            docOtrDescElement.value = docOtrDesc;
        }

        // 初始化功能
        initializeListeners();
        renumberItems(); // 重新編號所有項次
        updateFieldVisibility(); // 更新欄位顯示

        // 自動計算運費和保險費，並將結果帶入到欄位中
        calculateFreight();
        calculateInsurance();

        handleCheck(); // 長期委任字號

        // 清空布貨品欄位
        document.querySelectorAll(`#item-container .WIDE, #item-container .WIDE_UM, #item-container .LENGT_, #item-container .LENGTH_UM`)
        .forEach(input => {
            input.value = '';
            input.dispatchEvent(new Event('input')); // 觸發 input 事件，確保相關監聽函式更新
        });
    };

    reader.readAsArrayBuffer(file);
}
