// 處理 CCC_CODE 欄位按 Enter 鍵的功能
function handleCCCCodeEnter(event, inputElement) {
    if (event.key === 'Enter') {
        event.preventDefault();
        openTaxModal(inputElement); // 打開彈跳框
        searchTariff(inputElement, true); // 查詢稅則數據
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

function searchTariff(inputElement, isModal = false) {
    let keyword = inputElement.value.toLowerCase();
    keyword = keyword.replace(/[.\-]/g, ''); // 移除 '.' 和 '-' 符號
    const resultsDiv = isModal ? document.getElementById('modal-results') : document.getElementById('results');
    resultsDiv.innerHTML = '';

    // 加入提示訊息
    const hint = document.createElement('p');
    hint.textContent = '【可使用上下鍵移動並按Enter選取或點選稅則，按Esc取消】';
    hint.style.fontWeight = 'bold';
    hint.style.color = '#0000b7'; // 自定義提示訊息顏色
    resultsDiv.appendChild(hint);

    const results = window.taxData.filter(item => {
        const cleanedItemCode = item['貨品分類號列'].toString().toLowerCase().replace(/[.\-]/g, '');
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
                        closeTaxModal();
                        inputElement.focus(); // 選中項目後焦點返回輸入框
                        searchTariff(inputElement);
                    });
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

// 初始化 CCC_CODE 輸入框
function initializeCCCCodeInputs() {
    const inputs = document.querySelectorAll('.CCC_CODE, .tax-code-input');
    inputs.forEach(input => {
        input.addEventListener('keydown', (event) => handleCCCCodeEnter(event, input));
    });
}

document.addEventListener('DOMContentLoaded', initializeCCCCodeInputs);