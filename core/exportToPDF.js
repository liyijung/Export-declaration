// 出口報單預覽
async function exportToPDF() {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block'; // 顯示提示訊息

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            precision: 2, // 精度設定
            compress: true, // 開啟壓縮
        });

        // 字體轉換與載入
        await loadAndEmbedFont(doc, "NotoSansCJKtc-Regular.ttf", "NotoSansCJKtc");
        async function loadAndEmbedFont(doc, fontPath, fontName) {
            try {
                if (!doc.existsFileInVFS(fontName)) {
                    // 獲取字體檔案的二進制數據
                    const fontBytes = await fetch(fontPath).then(res => res.arrayBuffer());
                    
                    // 將字體數據轉換為 Base64 編碼格式
                    const fontBase64 = arrayBufferToBase64(fontBytes);
    
                    // 添加字體到 VFS (虛擬文件系統)
                    doc.addFileToVFS(fontName, fontBase64);
                    doc.addFont(fontName, fontName, "normal");
    
                    // 設定字體
                    doc.setFont(fontName, "normal");
                }
            } catch (error) {
                console.error("字體載入或嵌入時出現錯誤：", error);
            }
        }

        // 將 ArrayBuffer 轉換為 Base64 編碼的函數
        function arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const chunkSize = 4096; // 每次處理的塊大小

            for (let i = 0; i < bytes.length; i += chunkSize) {
                binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
            }
            return btoa(binary);
        }

        // 設置字體顏色
        doc.setTextColor(0, 0, 0); // 黑色

        // 加載模板 PDF
        const templateHomeBytes = await fetch('Template_Home.pdf').then(res => res.arrayBuffer());
        const templateContinuationBytes = await fetch('Template_Continuation.pdf').then(res => res.arrayBuffer());

        const templateHome = await pdfjsLib.getDocument({ data: templateHomeBytes }).promise;
        const templateContinuation = await pdfjsLib.getDocument({ data: templateContinuationBytes }).promise;

        // 獲取並渲染模板頁面
        async function renderTemplate(doc, templatePdf, pageNum, scale = 3.0) {
            const page = await templatePdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;

            const imgData = canvas.toDataURL('image/jpeg', 0.5);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = doc.internal.pageSize.getHeight();
            doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }

        // 渲染第一頁模板
        await renderTemplate(doc, templateHome, 1);

        doc.setFontSize(9.5);
        doc.text(`空運`, 75, 10)

        // 獲取報單類別的值和文本
        const dclDocTypeElement = document.getElementById('DCL_DOC_TYPE');
        const dclDocTypeValue = dclDocTypeElement.value;
        const optionElement = dclDocTypeElement.list.querySelector(`option[value="${dclDocTypeValue}"]`);
        const dclDocTypeText = optionElement ? optionElement.text : '';
        doc.text(`${dclDocTypeValue}${dclDocTypeText}`, 103, 10)

        // 檢查是否勾選一般倉
        const generalWarehouseChecked = document.getElementById('general-warehouse').checked;

        var { Fymd, yearPart, CustomsDeclarationDate } = getCustomsDeclarationDate();

        // 取得報單後5碼
        const docNoLast5 = document.getElementById("DOC_DOC_NO_Last5").value.trim().toUpperCase();
        
        // 設定 OrderNumber
        var OrderNumber = generalWarehouseChecked 
            ? `CW/  /${yearPart}/696/` + (docNoLast5 ? docNoLast5 : '') // 若有5碼則加上
            : `CX/  /${yearPart}/696/`;
        
        doc.text(OrderNumber, 75, 18.5)
        
        // 生成對應的條碼數據
        const barcodeText = generalWarehouseChecked 
            ? `CW  ${yearPart}696` + (docNoLast5 ? `${docNoLast5}` : '') // 若有5碼則加上
            : `CX  ${yearPart}696`;

        // 添加二維條碼
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, barcodeText, {
            format: 'CODE128',
            width: 3,           // 調整寬度，讓條碼變長（默認為 2）
            height: 40,         // 可以適當調低高度來強調長度
            displayValue: true  // 數字顯示
        });
        const barcodeImgData = barcodeCanvas.toDataURL('image/jpeg');
        doc.addImage(barcodeImgData, 'JPEG', 118, 12, 40, 10); // 調整圖像的顯示寬度

        doc.text(CustomsDeclarationDate, 62, 35) // 報關日期
        doc.text(`TWTPE`,30.5, 40.5)
        doc.text(`TAOYUAN`, 24, 44)
        doc.text(`AIRPORT`, 24, 48)
        doc.text(document.getElementById('TO_CODE').value, 70,  40.5)

        // 拆分 TO_DESC 為多行，每行最多寬度25
        const toDescElement = document.getElementById('TO_DESC');
        const toDescText = toDescElement.value;
        const toDescLines = doc.splitTextToSize(toDescText, 25)
        doc.text(toDescLines.join('\n'), 61, 44)

        // 在 PDF 上指定位置顯示 "Y" 或 "N"，根據 copy_3_e 和 copy_3 checkbox 狀態
        if (document.getElementById('copy_3_e').checked || document.getElementById('copy_3').checked) {
            doc.text('Y', 106, 44);
        } else {
            doc.text('N', 106, 44);
        }

        if (generalWarehouseChecked) {
            doc.text(`41`, 136, 44) // 運輸方式(一般倉)
            if (dclDocTypeValue === 'F5') {
                doc.text(`C2040 遠雄自由貿易港區`, 30, 53.5)
            } else {
                doc.text(`C2036 遠雄航空出口一般倉貨棧`, 30, 53.5)
            }
        } else {
            doc.text(`42`, 136, 44) // 運輸方式(快遞倉)
            doc.text(`C2051 遠雄第四快遞貨棧`, 30, 53.5)
        }

        // 獲取並格式化數字值
        const calIpTotItemAmt = formatNumberValue('CAL_IP_TOT_ITEM_AMT');
        const frtAmt = formatNumberValue('FRT_AMT');
        const insAmt = formatNumberValue('INS_AMT');
        const addAmt = formatNumberValue('ADD_AMT');
        const subtractAmt = formatNumberValue('SUBTRACT_AMT');

        function formatNumberValue(elementId) {
            const value = document.getElementById(elementId).value;
            return value ? parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'NIL';
        }

        // 獲取匯率數據
        const exchangeRates = await fetchExchangeRates();
        if (!exchangeRates) {
            throw new Error('無法獲取匯率數據');
        }

        // 獲取 CURRENCY 的值並查找對應的匯率
        const currency = document.getElementById('CURRENCY').value;
        const exchangeRate = exchangeRates[currency] ? exchangeRates[currency].buyValue : 'NIL';
        
        // 檢查數值是否為 NIL
        const formattedFrtAmt = frtAmt !== 'NIL' ? frtAmt : 'NIL';
        const formattedInsAmt = insAmt !== 'NIL' ? insAmt : 'NIL';
        const formattedAddAmt = addAmt !== 'NIL' ? addAmt : 'NIL';
        const formattedSubtractAmt = subtractAmt !== 'NIL' ? subtractAmt : 'NIL';

        // 計算右對齊的 x 位置，考慮到文本內容的寬度
        const calculateRightAlignedX = (value, minWidth, maxWidth) => {
            const textWidth = doc.getTextWidth(value);
            const calculatedWidth = Math.max(textWidth, minWidth);
            return maxWidth - calculatedWidth;
        };

        // 去除數值中的逗號並轉換為浮點數
        function parseNumber(value) {
            return value !== 'NIL' ? parseFloat(value.replace(/,/g, '')) : 0;
        }

        // 計算 totalFobPrice
        let totalFobPrice = parseNumber(calIpTotItemAmt) 
                            - parseNumber(frtAmt) 
                            - parseNumber(insAmt);

        const termsSales = document.getElementById('TERMS_SALES').value.toUpperCase();

        // 根據 TERMS_SALES 的值進行不同的處理
        if (termsSales === 'EXW') {
            totalFobPrice += parseNumber(addAmt); // EXW 情況下加上 addAmt
        } else if (['FOB', 'CFR', 'C&I', 'CIF'].includes(termsSales)) {
            totalFobPrice -= parseNumber(addAmt); // FOB、CFR、C&I、CIF 情況下減去 addAmt
        }

        // 最後加上 subtractAmt
        totalFobPrice += parseNumber(subtractAmt);

        // 計算 totalFobPriceTw，使用匯率乘以 totalFobPrice
        let totalFobPriceTw = totalFobPrice * (exchangeRate ? exchangeRate : 1);

        // 取整數後保留兩位小數並加入千分位逗號
        let formattedTotalFobPrice = totalFobPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        let formattedTotalFobPriceTw = Math.round(totalFobPriceTw).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // 計算文字寬度以達到靠右對齊
        let totalFobPriceX = 205 - doc.getTextWidth(formattedTotalFobPrice);
        let totalFobPriceTwX = 205 - doc.getTextWidth(formattedTotalFobPriceTw);
        
        let totalFobPriceY = 58; // 設定 y 值顯示 totalFobPrice
        let totalFobPriceTwY = 61.5; // 設定 y 值顯示 totalFobPriceTw

        doc.text(currency, 171, 29)
        doc.text(calIpTotItemAmt, calculateRightAlignedX(calIpTotItemAmt, 0, 205), 29)
        doc.text(formattedFrtAmt, calculateRightAlignedX(formattedFrtAmt, 0, 205), 36)
        doc.text(formattedInsAmt, calculateRightAlignedX(formattedInsAmt, 0, 205), 43)
        doc.text(formattedAddAmt, calculateRightAlignedX(formattedAddAmt, 0, 205), 49)
        doc.text(formattedSubtractAmt, calculateRightAlignedX(formattedSubtractAmt, 0, 205), 54)
        doc.text(formattedFrtAmt !== 'NIL' ? currency : '', 171, 36)
        doc.text(formattedInsAmt !== 'NIL' ? currency : '', 171, 43)
        doc.text(formattedAddAmt !== 'NIL' ? currency : '', 171, 49)
        doc.text(formattedSubtractAmt !== 'NIL' ? currency : '', 171, 54)

        // 總離岸價格
        doc.text(currency, 171, totalFobPriceY);
        doc.text(formattedTotalFobPrice, totalFobPriceX, totalFobPriceY);

        // 當旬匯率日期區間
        const { startDate, endDate } = await fetchDateRange();
        console.log("匯率日期區間：", { startDate, endDate });
        
        if (exchangeRate && (Fymd >= startDate && Fymd <= endDate)) {
            // 在 x: 171, y: totalFobPriceTwY 顯示 "TWD"
            doc.text("TWD", 171, totalFobPriceTwY);
            doc.text(formattedTotalFobPriceTw, totalFobPriceTwX, totalFobPriceTwY);
            
            // 添加匯率，顯示在 x: 192.5, y: 100.5
            doc.text(exchangeRate.toString(), 192.5, 100.5);
        }

        // 出口人
        doc.text(document.getElementById('SHPR_BAN_ID').value, 30, 60)
        doc.text(document.getElementById('SHPR_BONDED_ID').value, 94, 60)
        doc.text(document.getElementById('SHPR_C_NAME').value, 30, 66.5)
        doc.text(document.getElementById('SHPR_E_NAME').value, 30, 71.5)
        doc.text(document.getElementById('SHPR_C_ADDR').value, 30, 76.5)

        // 取得 SHPR_BAN_ID 的值
        const shprBanId = document.getElementById('SHPR_BAN_ID').value;
        
        // 顯示 AEO 編號
        const shprAeo = await getAeoNumber(shprBanId);  // 呼叫共用函數取得 AEO 編號
        doc.text(shprAeo, 175, 65.5);
        
        // 買方中文名稱
        doc.text(document.getElementById('CNEE_C_NAME').value, 30, 83)

        // 買方中/英名稱
        doc.text(document.getElementById('CNEE_E_NAME').value, 30, 87)

        // 處理地址自動換行
        const cneeEAddrElement = document.getElementById('CNEE_E_ADDR');
        const cneeEAddrText = cneeEAddrElement.value;

        // 將地址限制在特定寬度內並自動換行
        const maxWidth = 175; // 最大寬度
        const cneeEAddrLines = doc.splitTextToSize(cneeEAddrText, maxWidth);

        // 使用現有的 startY 和 lineHeight 變數
        let cneeAddressY = 91; // 使用不同名稱的變數來避免衝突
        const cneeLineHeight = 4; // 使用不同名稱的變數來避免衝突

        // 繪製地址，每行一段
        cneeEAddrLines.forEach(line => {
            doc.text(line, 30, cneeAddressY);
            cneeAddressY += cneeLineHeight;
        });
        
        doc.text(document.getElementById('CNEE_COUNTRY_CODE').value, 30, 100.5)
        doc.text(document.getElementById('CNEE_BAN_ID').value, 63, 100.5)
        doc.text(document.getElementById('TERMS_SALES').value, 165, 100.5)
        doc.text(document.getElementById('TOT_CTN').value, 43, 201.5)
        doc.text(document.getElementById('DOC_CTN_UM').value, 50, 201.5)
        doc.text(document.getElementById('CTN_DESC').value, 85, 201.5)
        doc.text(document.getElementById('DCL_GW').value, 190, 201.5)
        doc.text(`台灣順豐速運`, 148, 271)
        doc.text(`股份有限公司`, 148, 276)
        doc.text(`696`, 148, 281)
        doc.text(`紀書琴`, 188, 271)
        doc.text(`00718`, 188, 276)
        
        // 檢查統計方式及輸出許可號碼欄位，決定是否更新 EXAM_TYPE 為 '8'
        let shouldSetExamType = false;
        document.querySelectorAll("#item-container .item-row").forEach((item) => {
            const stMtdValue = item.querySelector('.ST_MTD')?.value.toUpperCase() || '';
            const expNoValue = item.querySelector('.EXP_NO')?.value || '';
            const expSeqNoValue = item.querySelector('.EXP_SEQ_NO')?.value || '';

            // 判斷 ST_MTD 是否為 '1A', '8A', '8D'，或 EXP_NO 是否為 14 碼，或 EXP_NO 與 EXP_SEQ_NO 皆有值
            if (['1A', '8A', '8D'].includes(stMtdValue) || expNoValue.length === 14 || (expNoValue && expSeqNoValue)) {
                // shouldSetExamType = true; 暫取消查驗
            }
        });

        // 檢查 copy_3, copy_4, copy_5 的 checkbox 狀態，決定是否更新 EXAM_TYPE 為 '8'
        if (document.getElementById('copy_3').checked || document.getElementById('copy_4').checked || document.getElementById('copy_5').checked) {
            shouldSetExamType = true;
        }

        // 如果需要顯示 "8"，顯示在指定位置
        if (shouldSetExamType) {
            document.getElementById('EXAM_TYPE').value = '8';
            doc.text('8', 199, 248); // 這裡設置顯示 "8" 的 X 和 Y 坐標
        }

        // 首先計算所有項次的 docTotP 加總
        let docTotPTotal = 0;
        document.querySelectorAll("#item-container .item-row").forEach(item => {
            const docTotP = parseFloat(item.querySelector('.DOC_TOT_P')?.value) || 0;
            docTotPTotal += docTotP;
        });

        // 獲取 'DOC_MARKS_DESC' 的完整內容
        const docMarksDescElement = document.getElementById('DOC_MARKS_DESC');
        const docMarksDescText = docMarksDescElement.value.replace(/\t/g, '  '); // 將 Tab 替換成空格

        // 將 'DOC_MARKS_DESC' 分割為多行，行寬限制在一定寬度
        const docMarksDescLines = doc.splitTextToSize(docMarksDescText, 135);

        // 初始顯示行與溢出行分開存放
        const initialLines = docMarksDescLines.slice(0, 10); // 取前十行
        const overflowLines = docMarksDescLines.slice(10);   // 第十行以後

        // 如果第十行以後有值，則在 initialLines 的最後一行添加 '\n- CONTINUE -'
        if (overflowLines.length > 0) {
            initialLines[initialLines.length - 1] += '\n- CONTINUE -';
        }
        
        // 將初始顯示行顯示在指定位置（例如 x: 8, y: 211）
        let docMarksDescY = 211;
        initialLines.forEach(line => {
            doc.text(line, 8, docMarksDescY);
            docMarksDescY += 4; // 行高，根據需要調整
        });

        // 獲取 'DOC_OTR_DESC' 的完整內容
        const docOtrDescElement = document.getElementById('DOC_OTR_DESC');
        const docOtrDescText = docOtrDescElement.value.replace(/\t/g, '  '); // 將 Tab 替換成空格

        // 將 'DOC_OTR_DESC' 分割為多行，行寬限制在一定寬度
        const docOtrDescLines = doc.splitTextToSize(docOtrDescText, 135);

        // 前六行與其餘行分開存放
        const firstSixLines = docOtrDescLines.slice(0, 6); // 取前六行
        const remainingLines = docOtrDescLines.slice(6);   // 第七行以後

        // 將前六行顯示在指定位置（例如 x: 7, y: 260）
        let docOtrDescY = 260;
        firstSixLines.forEach(line => {
            doc.text(line, 8, docOtrDescY);
            docOtrDescY += 4; // 行高，根據需要調整
        });

        // 添加項次資料
        const itemsData = [];
        document.querySelectorAll("#item-container .item-row").forEach((item, index) => {
            const docTotP = parseFloat(item.querySelector('.DOC_TOT_P')?.value) || 0; // 取得 .DOC_TOT_P 值
            const fobTw = docTotP * exchangeRate * (totalFobPrice / docTotPTotal); // 使用 docTotPTotal 計算 fobTw

            itemsData.push({
                index: item.querySelector('.ITEM_NO')?.checked ? '*' : index + 1,  // 如果選中則顯示'*'，否則顯示編號
                tradeMark: item.querySelector('.TRADE_MARK')?.value.trim().replace(/\t/g, '  ') || '', // 商標
                expNo: item.querySelector('.EXP_NO')?.value.trim().replace(/\t/g, '  ') || '', // 輸出許可號碼
                expSeqNo: item.querySelector('.EXP_SEQ_NO')?.value.trim().replace(/\t/g, '  ') || '', // 輸出許可項次
                currency: document.getElementById('CURRENCY')?.value.trim().replace(/\t/g, '  ') || '', // 確保獲取正確的幣別值
                netWt: parseFloat(item.querySelector('.NET_WT')?.value.trim().replace(/\t/g, '  ')) || 0, // 淨重
                description: item.querySelector('.DESCRIPTION')?.value.trim().replace(/\t/g, '  ').replace(/ {10,}/g, '\n').replace(/\n\s*\n/g, '\n') || '', // 品名
                statQty: parseFloat(item.querySelector('.ST_QTY')?.value.trim().replace(/\t/g, '  ')) || 0, // 統計數量
                statUnit: item.querySelector('.ST_UM')?.value.trim().replace(/\t/g, '  ') || '', // 統計單位
                origImpDclNo: item.querySelector('.ORG_IMP_DCL_NO')?.value.trim().replace(/\t/g, '  ') || '', // 原進口報單號碼
                origImpDclNoItem: item.querySelector('.ORG_IMP_DCL_NO_ITEM')?.value.trim().replace(/\t/g, '  ') || '', // 原進口報單項次
                certNo: item.querySelector('.CERT_NO')?.value.trim().replace(/\t/g, '  ') || '', // 產證號碼
                certNoItem: item.querySelector('.CERT_NO_ITEM')?.value.trim().replace(/\t/g, '  ') || '', // 產證項次
                origDclNo: item.querySelector('.ORG_DCL_NO')?.value.trim().replace(/\t/g, '  ') || '', // 原進倉報單號碼
                origDclNoItem: item.querySelector('.ORG_DCL_NO_ITEM')?.value.trim().replace(/\t/g, '  ') || '', // 原進倉報單項次
                sellerItemCode: item.querySelector('.SELLER_ITEM_CODE')?.value.trim().replace(/\t/g, '  ') || '', // 賣方料號
                goodsModel: item.querySelector('.GOODS_MODEL')?.value.trim().replace(/\t/g, '  ') || '', // 型號
                goodsSpec: item.querySelector('.GOODS_SPEC')?.value.trim().replace(/\t/g, '  ') || '', // 規格
                bondNote: item.querySelector('.BOND_NOTE')?.value.trim().replace(/\t/g, '  ') || '', // 保稅貨物註記
                fobTw: fobTw.toFixed(0), // 計算的初始 fobTw 值
                values: [
                    { value: item.querySelector('.CCC_CODE')?.value.trim().replace(/\t/g, '  ') || '', x: 89 },
                    { value: item.querySelector('.DOC_UNIT_P')?.value.trim().replace(/\t/g, '  ') || '', x: 130 },
                    { value: (item.querySelector('.QTY')?.value.trim().replace(/\t/g, '  ') || '') + ' ' + (item.querySelector('.DOC_UM')?.value.trim().replace(/\t/g, '  ') || ''), x: 160 },
                    { value: item.querySelector('.ST_MTD')?.value.trim().replace(/\t/g, '  ') || '', x: 200 },
                ],
                qty: parseFloat(item.querySelector('.QTY')?.value.trim().replace(/\t/g, '  ')) || 0, // 數量
                unit: item.querySelector('.DOC_UM')?.value.trim().replace(/\t/g, '  ') || '', // 單位
                itemAmt: parseFloat(item.querySelector('.ITEM_AMT')?.value.trim().replace(/\t/g, '  ')) || 0 // 金額
            });
        });

        // 計算加總值，根據單位分組
        const totalNetWt = itemsData.reduce((sum, item) => sum + item.netWt, 0);
        const totalAmt = itemsData.reduce((sum, item) => sum + item.itemAmt, 0);

        const totalQtyMap = itemsData.reduce((acc, item) => {
            if (item.unit) {
                if (!acc[item.unit]) {
                    acc[item.unit] = 0;
                }
                acc[item.unit] += item.qty;
            }
            return acc;
        }, {});

        const totalStatQtyMap = itemsData.reduce((acc, item) => {
            if (item.statUnit) {
                if (!acc[item.statUnit]) {
                    acc[item.statUnit] = 0;
                }
                acc[item.statUnit] += item.statQty;
            }
            return acc;
        }, {});

        // 添加項次資料到 PDF
        let startY = 130;  // 設置初始的 Y 坐標
        const maxYHome = 188;  // 首頁的頁面底部的 Y 坐標
        const maxYContinuation = 279;  // 續頁的頁面底部的 Y 坐標
        const lineHeight = 4;  // 每行的高度

        let itemCounter = 1; // 用於標記項次編號
        let lastY = startY; // 用於保存最後一個項次的位置

        function addUnderlinedText(doc, text, x, y, lineHeight) {
            doc.text(text, x, y);
            const textWidth = doc.getTextWidth(text);
            doc.line(x, y + 1, x + textWidth, y + 1); // 添加底線，+1 是為了讓底線在文字下方
        }

        let currentMaxY = maxYHome;

        startY = 130;  // 重置初始的 Y 坐標
        currentMaxY = maxYHome;

        function addPageNumber(doc, currentPage) {
            doc.setFontSize(9.5);
            if (currentPage === 1) {
                // 首頁頁碼位置
                doc.text(`${currentPage}`, 186, 10);
            } else {
                // 續頁頁碼位置
                doc.text(`${currentPage}`, 184, 13);
            }
        }

        // 取得 FILE_NO 及 LOT_NO 的值
        const fileNo = document.getElementById('FILE_NO').value || '';
        const lotno = document.getElementById('LOT_NO').value || '';

        // 添加 FILE_NO 到左下角
        function addFileNoToBottomLeft(doc, fileNo) {
            const pageHeight = doc.internal.pageSize.height;
            const leftX = 7; // 靠左邊的 X 坐標
            const bottomY = pageHeight - 8; // 靠近底部的 Y 坐標
            doc.text(fileNo, leftX, bottomY);
        }

        // 添加 LOT_NO 到左下角
        function addlotnoToBottomLeft(doc, lotno) {
            const pageHeight = doc.internal.pageSize.height;
            const leftX = 30; // 靠左邊的 X 坐標
            const bottomY = pageHeight - 8; // 靠近底部的 Y 坐標
            doc.text(lotno, leftX, bottomY);
        }

        // 首頁顯示文件編號及運單號
        addFileNoToBottomLeft(doc, fileNo);
        addlotnoToBottomLeft(doc, lotno);
        
        for (const item of itemsData) {
            const itemDescriptionLines = doc.splitTextToSize(item.description, 150).length;
            const itemLinesNeeded = item.index === '*' ? itemDescriptionLines + 2 : itemDescriptionLines + 1;

            if (startY + lineHeight * itemLinesNeeded > currentMaxY) {
                doc.addPage();  // 換頁
                await renderTemplate(doc, templateContinuation, 1); // 渲染新頁面的模板
                startY = 63;  // 新頁面的起始 Y 坐標
                currentMaxY = maxYContinuation; // 更新續頁的頁面底部 Y 坐標

                // 在新頁面右上角添加頁碼
                const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
                addPageNumber(doc, currentPage, false);

                // 每頁顯示文件編號及運單號
                addFileNoToBottomLeft(doc, fileNo);
                addlotnoToBottomLeft(doc, lotno);
            }

            // 在首頁右上角添加頁碼
            if (doc.internal.getCurrentPageInfo().pageNumber === 1) {
                const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
                addPageNumber(doc, currentPage, true);
            }

            // 顯示項次編號
            doc.text(`${item.index === '*' ? '*' : itemCounter}`, 7, startY); // 顯示項次編號

            // 顯示商標
            const tradeMarkLines = doc.splitTextToSize(item.tradeMark, 30); // 將商標文本拆分為多行，每行最多寬度30
            let tradeMarkY = startY;
            const tradeMarkX = 61;
            tradeMarkLines.forEach(line => {
                const textWidth = doc.getTextWidth(line); // 取得文本寬度
                const x = tradeMarkX + (20 - textWidth); // 計算右對齊的 x 位置
                doc.text(line, x, tradeMarkY);
                tradeMarkY += lineHeight;
            });

            let descriptionTextY = tradeMarkY;

            // 顯示前置描述和品名
            const descriptionText = [
                item.sellerItemCode ? `S/N:${item.sellerItemCode}` : '',
                item.goodsModel ? `MODEL:${item.goodsModel}` : '',
                item.goodsSpec ? `SPEC:${item.goodsSpec}` : '',
                item.description || '' // 確保 description 不為 undefined 或 null
            ].filter(Boolean); // 過濾掉空字串

            // 顯示指定欄位
            const fields = [
                { label: '原進倉報單', value: item.origDclNo, itemValue: item.origDclNoItem },
                { label: '原進口報單', value: item.origImpDclNo, itemValue: item.origImpDclNoItem },
                { label: '產證號碼', value: item.certNo, itemValue: item.certNoItem },
            ];

            const fieldsToShow = fields.filter(field => field.value || field.itemValue); // 過濾掉空值

            // 如果 fieldsToShow 有值，併入 descriptionText
            fieldsToShow.forEach(field => {
                const combinedValue = `${field.label}: ${field.value || ''}${field.itemValue ? ` 項次${field.itemValue}` : ''}`;
                descriptionText.push(combinedValue.trim());
            });

            if (item.index === '*') {
                const combinedDescription = descriptionText.join('\n');
                const descriptionLines = doc.splitTextToSize(combinedDescription, 67);
                descriptionLines.forEach(line => {
                    addUnderlinedText(doc, line, 14, descriptionTextY, lineHeight);
                    descriptionTextY += lineHeight;
                });
            } else {
                const combinedDescription = descriptionText.join('\n');
                const descriptionLines = doc.splitTextToSize(combinedDescription, 67);
                const statUnit = item.statUnit || ''; // 統計單位

                // 根據統計數量和品名行數進行處理
                if (descriptionLines.length === 1) {
                    descriptionLines.push(''); // 添加一行空白
                    if (statUnit) {
                        descriptionLines.push(''); // 如果統計單位有值，再添加多一行空白
                    }
                } else if (descriptionLines.length === 2 && statUnit) {
                    descriptionLines.push(''); // 如果統計單位有值，且已有兩行描述，再添加一行空白
                }

                descriptionLines.forEach(line => {
                    doc.text(line, 14, descriptionTextY);
                    descriptionTextY += lineHeight;
                });
                itemCounter++; // 增加項次計數器
            }

            if (item.index !== '*') {
                // 顯示輸出許可號碼和輸出許可項次，居中對齊
                const expNoX = 102;
                const combinedText = item.expNo ? `${item.expNo}-${item.expSeqNo}` : 'NIL';
                const combinedTextWidth = doc.getTextWidth(combinedText);
                const startX = expNoX - combinedTextWidth / 2;
                doc.text(combinedText, startX, startY);
        
                // 顯示幣別
                const currencyX = 131;
                doc.text(item.currency, currencyX, startY);
        
                // 顯示淨重，靠右對齊
                const netWtX = 172.5;
                const netWtWidth = doc.getTextWidth(`${item.netWt}KGM`);
                doc.text(`${formatWithThousandsSeparator(item.netWt)}KGM`, netWtX - netWtWidth, startY);

                // 加總誤差修正邏輯 - 在 itemsData 完成後進行調整
                let fobTwTotal = itemsData.reduce((sum, item) => sum + parseFloat(item.fobTw), 0);
                const targetFobTwTotal = parseFloat(formattedTotalFobPriceTw.replace(/,/g, '')); // 去除千分位逗號
                let fobTwError = Math.round(targetFobTwTotal - fobTwTotal);

                for (let i = itemsData.length - 1; i >= 0 && fobTwError !== 0; i--) {
                    if (fobTwError > 0) {
                        itemsData[i].fobTw = (parseFloat(itemsData[i].fobTw) + 1).toFixed(0);
                        fobTwError -= 1;
                    } else if (fobTwError < 0) {
                        itemsData[i].fobTw = (parseFloat(itemsData[i].fobTw) - 1).toFixed(0);
                        fobTwError += 1;
                    }
                }

                if (exchangeRate && (Fymd >= startDate && Fymd <= endDate)) {
                    // 顯示離岸價格(新台幣)，靠右對齊並加入千分位逗號
                    const fobTwX = 197.5;
                    const formattedFobTw = parseFloat(item.fobTw).toLocaleString('en-US'); // 將 fobTw 格式化為千分位
                    const fobTwWidth = doc.getTextWidth(formattedFobTw);
                    doc.text(formattedFobTw, fobTwX - fobTwWidth, startY);
                }
            }

            startY += lineHeight

            // 顯示稅則、單價、數量、統計方式
            const taxX = 102;
            const unitPriceX = 134;
            const qtyX = 172.5;
            const statMethodX = 200;

            // 稅則居中對齊
            const taxWidth = doc.getTextWidth(item.values[0].value);
            const taxStartX = taxX - taxWidth / 2;
            doc.text(item.values[0].value, taxStartX, startY);
            
            // 千分號格式化函數，僅在小數點前加上千分號
            function formatWithThousandsSeparator(value) {
                const [integerPart, decimalPart] = value.toString().split('.'); // 分離整數與小數部分
                const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 只在整數部分加上千分號
                return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
            }

            // 單價居中對齊，顯示時加入千分號
            const unitPriceDisplay = formatWithThousandsSeparator(item.values[1].value); // 格式化單價用於顯示
            const unitPriceWidth = doc.getTextWidth(unitPriceDisplay);
            const unitPriceStartX = unitPriceX - unitPriceWidth / 2;
            doc.text(unitPriceDisplay, unitPriceStartX, startY);

            // 數量靠右對齊，顯示時加入千分號並去除空格
            const qtyDisplay = formatWithThousandsSeparator(item.values[2].value).replace(/\s+/g, ''); // 格式化數量並去除空格
            const qtyWidth = doc.getTextWidth(qtyDisplay);
            doc.text(qtyDisplay, qtyX - qtyWidth, startY);

            // 統計方式顯示
            doc.text(item.values[3].value, statMethodX, startY);

            // 顯示統計數量及統計單位在數量的下方
            const statQtyX = 172.5;
            const statQty = item.statQty || ''; // 統計數量
            const statUnit = item.statUnit || ''; // 統計單位
            const combinedStatText = statQty ? `(${formatWithThousandsSeparator(statQty)}${statUnit})` : '' ;
            const combinedStatTextWidth = doc.getTextWidth(combinedStatText);

            // 統計數量和統計單位一起顯示，靠右對齊
            doc.text(combinedStatText, statQtyX - combinedStatTextWidth, startY + lineHeight);

            // 顯示保稅貨物註記
            const bondNoteText = item.bondNote ? item.bondNote : '';
            const bondNoteWidth = doc.getTextWidth(bondNoteText);
            const bondNoteX = 102 - bondNoteWidth / 2;
            doc.text(bondNoteText, bondNoteX, startY + lineHeight);
            
            startY = descriptionTextY;
            lastY = startY
        }

        // 在最後一頁的最後一行位置顯示加總，靠右對齊距離右邊38px
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginRight = 38;
        let yPosition = lastY + 1;

        // 檢查加總部分是否會超過首頁的頁面底部的 Y 坐標
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        if (currentPage === 1 && yPosition + lineHeight > maxYHome) {
            doc.addPage();
            await renderTemplate(doc, templateContinuation, 1);
            yPosition = 63; // 續頁的起始 Y 坐標

            // 在新頁面右上角添加頁碼
            addPageNumber(doc, currentPage + 1, false);

            // 每頁顯示文件編號及運單號
            addFileNoToBottomLeft(doc, fileNo);
            addlotnoToBottomLeft(doc, lotno);
            
        } else if (yPosition + lineHeight > maxYContinuation) {
            doc.addPage();
            await renderTemplate(doc, templateContinuation, 1);
            yPosition = 63; // 續頁的起始 Y 坐標

            // 在新頁面右上角添加頁碼
            addPageNumber(doc, currentPage + 1, false);

            // 每頁顯示文件編號及運單號
            addFileNoToBottomLeft(doc, fileNo);
            addlotnoToBottomLeft(doc, lotno);    
        }

        // 添加分隔線
        const separator = '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -';
        const separatorWidth = doc.getTextWidth(separator);
        doc.text(separator, pageWidth - separatorWidth - 6, yPosition - 3);

        if (exchangeRate && (Fymd >= startDate && Fymd <= endDate)) {
            // 顯示離岸價格(新台幣)，靠右對齊並加入千分位逗號
            let formattedTotalFobPriceTw = Math.round(totalFobPriceTw).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            const fobTwX = 197.5;
            const fobTwWidth = doc.getTextWidth(formattedTotalFobPriceTw);
            doc.text(formattedTotalFobPriceTw, fobTwX - fobTwWidth, yPosition);
            doc.text('VVVVVVVVVV', 178, yPosition + 4)
        }
        
        const totalData = [
            { label: '', value: totalNetWt > 0 ? formatWithThousandsSeparator(parseFloat(totalNetWt.toFixed(6))) + 'KGM' : '', y: yPosition },
        ];

        Object.entries(totalQtyMap).forEach(([unit, qty]) => {
            if (qty > 0) {
                totalData.push({
                    label: '',
                    value: formatWithThousandsSeparator(parseFloat(qty.toFixed(6))) + '' + unit,
                });
            }
        });

        Object.entries(totalStatQtyMap).forEach(([unit, qty]) => {
            if (qty > 0) {
                totalData.push({
                    label: '',
                    value: `(${formatWithThousandsSeparator(parseFloat(qty.toFixed(6)))}${unit})`,
                });
            }
        });

        if (totalAmt > 0) {
            totalData.push({
                label: '',
                value: formatWithThousandsSeparator(parseFloat(totalAmt.toFixed(6))),
            });
        }

        // 更新 yPosition 為新頁面的起始座標
        totalData.forEach(row => {
            if (row.value) {
                const text = row.label + row.value;
                const textWidth = doc.getTextWidth(text);
                doc.text(text, pageWidth - textWidth - marginRight, yPosition);
                yPosition += 4;
            }
        });

        // 根據 totalStatQtyMap 顯示情況動態調整 'VVVVVVVVVVVVVVVVVVVVV' 的位置
        const vvvText = 'VVVVVVVVVVVVVVVVVVVVV';
        const vvvTextWidth = doc.getTextWidth(vvvText);
        doc.text(vvvText, pageWidth - vvvTextWidth - marginRight, yPosition);

        // 在生成 PDF 前的最後一行位置（yPosition）顯示剩餘行
        yPosition += 10; // 加大間距以便和前面的內容分隔

        // 使用 for...of 迴圈來允許在迴圈內使用 await
        for (const line of overflowLines) {
            // 檢查是否為首頁
            const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
            if (currentPage === 1) {
                // 若為首頁則新增續頁
                doc.addPage(); // 新增一頁
                await renderTemplate(doc, templateContinuation, 1); // 渲染續頁模板

                // 在新頁面右上角添加頁碼
                addPageNumber(doc, currentPage + 1, false);

                // 每頁顯示文件編號及運單號
                addFileNoToBottomLeft(doc, fileNo);
                addlotnoToBottomLeft(doc, lotno);

                yPosition = 63; // 續頁的初始 Y 坐標
            } 
            // 如果已是續頁，則檢查 yPosition 是否超過 maxYContinuation
            else if (yPosition > maxYContinuation) {
                doc.addPage(); // 新增一頁
                await renderTemplate(doc, templateContinuation, 1); // 渲染續頁模板

                // 在新頁面右上角添加頁碼
                addPageNumber(doc, currentPage + 1, false);

                // 每頁顯示文件編號及運單號
                addFileNoToBottomLeft(doc, fileNo);
                addlotnoToBottomLeft(doc, lotno);

                yPosition = 63; // 續頁的初始 Y 坐標
            }

            // 顯示當前行內容
            doc.text(line, 14, yPosition); 
            yPosition += 4; // 行高
        }

        // 在生成 PDF 前的最後一行位置（yPosition）顯示剩餘行
        yPosition += 10; // 加大間距以便和前面的內容分隔

        // 使用 for...of 迴圈來允許在迴圈內使用 await
        for (const line of remainingLines) {
            // 檢查是否為首頁
            const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
            if (currentPage === 1) {
                // 若為首頁則新增續頁
                doc.addPage(); // 新增一頁
                await renderTemplate(doc, templateContinuation, 1); // 渲染續頁模板
        
                // 在新頁面右上角添加頁碼
                addPageNumber(doc, currentPage + 1, false);

                // 每頁顯示文件編號及運單號
                addFileNoToBottomLeft(doc, fileNo);
                addlotnoToBottomLeft(doc, lotno);

                yPosition = 63; // 續頁的初始 Y 坐標
            } 
            // 如果已是續頁，則檢查 yPosition 是否超過 maxYContinuation
            else if (yPosition > maxYContinuation) {
                doc.addPage(); // 新增一頁
                await renderTemplate(doc, templateContinuation, 1); // 渲染續頁模板
        
                // 在新頁面右上角添加頁碼
                addPageNumber(doc, currentPage + 1, false);

                // 每頁顯示文件編號及運單號
                addFileNoToBottomLeft(doc, fileNo);
                addlotnoToBottomLeft(doc, lotno);

                yPosition = 63; // 續頁的初始 Y 坐標
            }

            // 顯示當前行內容
            doc.text(line, 14, yPosition); 
            yPosition += 4; // 行高
        }

        // **完成所有頁面後，獲取總頁數**
        const totalPages = doc.internal.getNumberOfPages();

        // 定義一個函數來添加頁碼
        function addPageNumbers(doc, totalPages) {
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);  // 設置到當前頁
                const yPosition = (i === 1) ? 10 : 13;  // 根據是否首頁設置不同的 y 值
                const xPosition = (totalPages < 10) ? 198 : 197; // 根據 totalPages 設置不同的 x 值
                doc.text(`${totalPages}`, xPosition, yPosition);
            }
        }

        // 最後在每頁添加頁碼
        addPageNumbers(doc, totalPages);

        // 取得文件名的值
        const fileName = document.getElementById('FILE_NO').value.trim() || '';
        const exporterName = document.getElementById('SHPR_C_NAME').value.trim() || '';
        const lotNo = document.getElementById('LOT_NO').value.trim() || '';

        let exportFileName = '';

        if (fileName && exporterName && lotNo) {
            exportFileName = `${fileName}-${exporterName}-${lotNo}.pdf`;
        } else if (fileName && exporterName) {
            exportFileName = `${fileName}-${exporterName}.pdf`;
        } else if (fileName && lotNo) {
            exportFileName = `${fileName}-${lotNo}.pdf`;
        } else if (exporterName && lotNo) {
            exportFileName = `${exporterName}-${lotNo}.pdf`;
        } else if (fileName) {
            exportFileName = `${fileName}.pdf`;
        } else if (exporterName) {
            exportFileName = `${exporterName}.pdf`;
        } else if (lotNo) {
            exportFileName = `-${lotNo}.pdf`;
        } else {
            exportFileName = 'export.pdf';
        }

        // 保存 PDF
        doc.save(exportFileName);
    } catch (error) {
        console.error("生成PDF時出現錯誤：", error);
    } finally {
        loadingMessage.style.display = 'none'; // 隱藏提示訊息
    }
}

// 為輸出PDF按鈕添加事件監聽器
document.getElementById('export-to-pdf').addEventListener('click', exportToPDF);

async function fetchDateRange() {
    try {
        const response = await fetch('gc331_current.json');
        if (!response.ok) {
            throw new Error('無法讀取 gc331_current.json');
        }
        const data = await response.json();

        // 將西元年轉換為民國年
        function convertToTaiwanDateFormat(dateStr) {
            if (dateStr.length !== 8) {
                throw new Error("日期格式錯誤，應為 YYYYMMDD");
            }
            const year = parseInt(dateStr.substring(0, 4), 10); // 取出西元年
            const monthDay = dateStr.substring(4);              // 取出 MMDD
            const taiwanYear = year - 1911;                     // 民國年 = 西元年 - 1911
            return taiwanYear.toString() + monthDay;            // 組合民國年與 MMDD
        }

        return {
            startDate: convertToTaiwanDateFormat(data.start), // 動態讀取並轉換開始日期
            endDate: convertToTaiwanDateFormat(data.end)      // 動態讀取並轉換結束日期
        };
    } catch (error) {
        console.error('讀取日期區間時發生錯誤：', error);
        return {
            startDate: '0000000', // 默認值：民國年格式
            endDate: '9999999'
        };
    }
}

let cachedAeoMapping = null;

// 取得 AEO 對照表並快取
async function getAeoMapping() {
    if (cachedAeoMapping) return cachedAeoMapping;  // 若已有緩存，直接返回

    try {
        const response = await fetch('AEO_mapping.csv');
        const csvText = await response.text();
        const aeoData = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        }).data;

        const aeoMapping = {};
        aeoData.forEach(row => {
            aeoMapping[row['統一編號']] = row['AEO編號'];  // 儲存 AEO 編號
        });

        cachedAeoMapping = aeoMapping;  // 快取對照表
        return aeoMapping;
    } catch (error) {
        console.error('載入 AEO 對照表時發生錯誤:', error);
        return {};
    }
}

// 取得 AEO 編號的通用函數
async function getAeoNumber(shprBanId) {
    const aeoMapping = await getAeoMapping();
    return aeoMapping[shprBanId] || '';  // 若查不到則返回空字串
}

// 全域變數：快取匯率數據，避免頻繁請求
let cachedExchangeRates = null;

// 從 gc331_current.json 檔案中獲取匯率數據（使用快取）
async function fetchExchangeRates() {
    if (cachedExchangeRates) {
        return cachedExchangeRates; // 若已有快取則直接返回
    }

    try {
        const response = await fetch('gc331_current.json');
        if (!response.ok) {
            throw new Error(`HTTP 錯誤！狀態碼：${response.status}，URL：${response.url}`);
        }
        const data = await response.json();
        
        // 轉換為 { "TWD": { buyValue: "1", sellValue: "1" }, ... } 格式
        const exchangeRates = {};
        if (data.items) {
            data.items.forEach(item => {
                exchangeRates[item.code] = {
                    buyValue: item.buyValue,
                    sellValue: item.sellValue
                };
            });
        }

        cachedExchangeRates = exchangeRates; // 快取數據
        return exchangeRates;
    } catch (error) {
        console.error('獲取匯率數據時出錯:', error.message);
        return {}; // 返回空物件，避免 `null` 造成 TypeError
    }
}

// 查找並更新匯率
async function lookupExchangeRate() {
    const currencyInput = document.getElementById("CURRENCY");
    const errorSpan = document.getElementById("currency-error");
    const exchangeRateInput = document.getElementById("exchange-rate"); // 匯率欄位
    const usdExchangeRateInput = document.getElementById("usd-exchange-rate"); // 美金匯率欄位

    // 取得輸入的幣別並轉換為大寫
    const currencyCode = currencyInput.value.trim().toUpperCase();

    // 只在輸入滿 3 碼時進行查找
    if (currencyCode.length < 3) {
        errorSpan.style.display = "none";
        exchangeRateInput.value = ""; // 清空匯率欄位
        return;
    }

    // 獲取匯率數據
    const exchangeRates = await fetchExchangeRates();

    // 當旬匯率日期區間
    var { Fymd, yearPart, CustomsDeclarationDate } = getCustomsDeclarationDate();
    const { startDate, endDate } = await fetchDateRange();

    // 先處理 USD 匯率（不論輸入什麼幣別都要顯示）
    if (exchangeRates["USD"]) {
        usdExchangeRateInput.value = exchangeRates["USD"].buyValue;
    } else {
        usdExchangeRateInput.value = "";
    }
    
    // 檢查是否存在該幣別
    if (exchangeRates[currencyCode] && (Fymd >= startDate && Fymd <= endDate)) {
        const buyValue = exchangeRates[currencyCode].buyValue;
        exchangeRateInput.value = buyValue; // 顯示買入價
        errorSpan.style.display = "none";
    } else if (Fymd < startDate || Fymd > endDate) {
        exchangeRateInput.value = ""; // 清空匯率欄位
        errorSpan.style.display = "none";
    } else {
        exchangeRateInput.value = ""; // 清空匯率欄位
        errorSpan.style.display = "inline";
    }
}

// 解析 FILE_NO 取得報關日期
function getCustomsDeclarationDate() {
    var today = new Date();
    var Tyear = today.getFullYear();
    var Tmonth = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() 返回 0-11
    var Tday = String(today.getDate()).padStart(2, '0');
    var Tymd = (Tyear - 1911) + Tmonth + Tday; // 民國年格式 YYYMMDD
    var defaultYearPart = Tymd.substring(1, 3); // 當前年份（民國年）的第 2-3 位
    var defaultFormattedDate = (Tyear - 1911) + '/' + Tmonth + '/' + Tday; // YYY/MM/DD 格式

    var fileNo = document.getElementById('FILE_NO').value;
    if (!fileNo || fileNo.length < 7) {
        return { Fymd: Tymd, yearPart: defaultYearPart, CustomsDeclarationDate: defaultFormattedDate };
    }

    var year = fileNo.substring(0, 3);  // 民國年格式前 3 位
    var month = fileNo.substring(3, 5); // 第 4-5 位為月份
    var day = fileNo.substring(5, 7);   // 第 6-7 位為日期
    var yearPart = fileNo.substring(1, 3); // 第 2-3 位為年份
    var CustomsDeclarationDate = year + '/' + month + '/' + day; // YYY/MM/DD

    return { Fymd: year + month + day, yearPart: yearPart, CustomsDeclarationDate: CustomsDeclarationDate };
}

// 監聽事件
document.getElementById("FILE_NO").addEventListener("blur", lookupExchangeRate);
document.getElementById("CURRENCY").addEventListener("input", lookupExchangeRate);
