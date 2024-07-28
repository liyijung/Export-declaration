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

    const results = window.taxData.filter(item => {
        const cleanedItemCode = item['貨品分類號列'].toString().toLowerCase().replace(/[.\-]/g, '');
        return cleanedItemCode.startsWith(keyword) ||
            (item['中文貨名'] && item['中文貨名'].toLowerCase().startsWith(keyword)) ||
            (item['英文貨名'] && item['英文貨名'].toLowerCase().startsWith(keyword)) ||
            (item['統計數量單位'] && item['統計數量單位'].toLowerCase().startsWith(keyword)) ||
            (item['稽徵規定'] && item['稽徵規定'].toLowerCase().startsWith(keyword)) ||
            (item['輸入規定'] && item['輸入規定'].toLowerCase().startsWith(keyword)) ||
            (item['輸出規定'] && item['輸出規定'].toLowerCase().startsWith(keyword));
    });

    if (results.length > 0) {

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // 建立表頭
        const headerRow = document.createElement('tr');
        const headers = [
            '貨品分類號列', '中文貨名', '英文貨名',
            '統計數量單位', '稽徵規定', '輸入規定', '輸出規定'
        ];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 填充表格數據
        results.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header] ? item[header] : '';
                if (header === '貨品分類號列') {
                    td.classList.add('clickable'); // 添加可點擊的 class
                    td.addEventListener('click', function() {
                        const formattedCode = formatCode(item['貨品分類號列'].toString());
                        inputElement.value = formattedCode; // 填入關鍵字欄位
                        closeTaxModal();
                        searchTariff(inputElement);
                    });
                }
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        resultsDiv.appendChild(table);
    } else {
        resultsDiv.innerHTML = '<br><p>未找到相關稅則。</p>'; // 添加空行
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
    document.addEventListener('keydown', handleEscKey);
    modal.currentInputElement = inputElement;
}

function closeTaxModal() {
    const modal = document.getElementById('taxmodal');
    modal.style.display = 'none';

    // 移除 ESC 鍵的監聽
    document.removeEventListener('keydown', handleEscKey);
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

function initializeCCCCodeInputs() {
    const inputs = document.querySelectorAll('.CCC_CODE, .tax-code-input');
    inputs.forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // 防止表單提交等默認行為
                openTaxModal(input);
                searchTariff(input, true);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeCCCCodeInputs);
