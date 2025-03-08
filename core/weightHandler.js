// 開啟攤重彈跳框
function openSpreadWeightModal(mode = "1") {
    const modal = document.getElementById("spread-weight-modal");
    const confirmButton = document.getElementById("confirm-button");
    const spreadMode = document.getElementById("spread-mode");
    const specificRange = document.getElementById("specific-range");
    const specificWeight = document.getElementById("specific-weight");

    // 設定模式
    spreadMode.value = mode;

    // 初始化 specific-range 和 specific-weight
    specificRange.value = ""; // 清空指定範圍
    specificWeight.value = ""; // 清空指定總重量
    
    const specificOptions = document.getElementById("specific-options");
    specificOptions.style.display = mode === "2" ? "block" : "none";

    // 顯示彈跳框
    modal.style.display = "block";

    // 焦點設置根據模式
    if (mode === "1") {
        confirmButton.focus(); // 焦點設置到確定按鈕
    } else if (mode === "2") {
        specificRange.focus(); // 焦點設置到指定範圍的輸入框
    }

    // 啟用焦點循環
    trapFocus(modal);
}

// 關閉攤重彈跳框
function closeSpreadWeightModal() {
    const modal = document.getElementById("spread-weight-modal");

    // 隱藏彈跳框
    modal.style.display = "none";

    // 停止焦點循環
    document.removeEventListener("keydown", focusHandler);
}

// 初始化事件（只執行一次）
document.addEventListener("DOMContentLoaded", function () {
    const spreadMode = document.getElementById("spread-mode");

    // 模式切換事件
    spreadMode.addEventListener("change", function () {
        const specificOptions = document.getElementById("specific-options");
        if (this.value === "2") {
            specificOptions.style.display = "block";
        } else {
            specificOptions.style.display = "none";
        }
    });

    // 啟用拖動功能
    enableModalDrag();

    // 快捷鍵事件
    document.addEventListener("keydown", function (event) {
        if (event.altKey && event.key === "1") {
            // Alt+1 開啟全部項次模式
            openSpreadWeightModal("1");
            event.preventDefault();
        } else if (event.altKey && event.key === "2") {
            // Alt+2 開啟指定項次模式
            openSpreadWeightModal("2");
            event.preventDefault();
        } else if (event.altKey && event.key === "Enter") {
            // Alt+Enter 確定
            const modal = document.getElementById("spread-weight-modal");
            if (modal && modal.style.display === "block") {
                applySpreadWeight(); // 觸發確定邏輯
                event.preventDefault(); // 防止預設行為
            }
        } else if (event.key === "Escape") {
            // Esc 取消
            const modal = document.getElementById("spread-weight-modal");
            if (modal && modal.style.display === "block") {
                closeSpreadWeightModal(); // 關閉模態框
                event.preventDefault(); // 防止預設行為
            }
        }
    });
});

// 啟用焦點循環
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const focusHandler = (event) => {
        if (event.key === "Tab") {
            if (event.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    };

    document.addEventListener("keydown", focusHandler);
}

// 啟用彈跳框拖動功能
function enableModalDrag() {
    const modal = document.getElementById("spread-weight-modal");
    const header = modal.querySelector("#modal-header");

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    header.addEventListener("mousedown", (event) => {
        isDragging = true;
        offsetX = event.clientX - modal.offsetLeft;
        offsetY = event.clientY - modal.offsetTop;

        // 禁用文字選取
        document.body.style.userSelect = "none";

        document.addEventListener("mousemove", moveModal);
        document.addEventListener("mouseup", stopDrag);
    });

    function moveModal(event) {
        if (isDragging) {
            modal.style.left = `${event.clientX - offsetX}px`;
            modal.style.top = `${event.clientY - offsetY}px`;
        }
    }

    function stopDrag() {
        isDragging = false;

        // 恢復文字選取
        document.body.style.userSelect = "";
        
        document.removeEventListener("mousemove", moveModal);
        document.removeEventListener("mouseup", stopDrag);
    }
}

// 套用攤重
function applySpreadWeight() {
    const mode = document.getElementById("spread-mode").value; // 獲取模式
    const weightDecimalPlaces = parseInt(document.getElementById("weight-decimal-places").value, 10); // 獲取小數位數

    if (isNaN(weightDecimalPlaces) || weightDecimalPlaces < 0 || weightDecimalPlaces > 6) {
        alert("請輸入有效的小數位數 (0-6)");
        return;
    }

    if (mode === "2") {
        // 指定項次攤重模式
        const specificWeight = parseFloat(document.getElementById("specific-weight").value); // 獲取指定總重量
        const rangeInput = document.getElementById("specific-range").value; // 獲取指定範圍

        // 獲取「攤重後是否鎖定」選項
        const lockAfterDistribution = document.querySelector('input[name="lock-after-distribution"]:checked').value === "yes";

        if (isNaN(specificWeight) || specificWeight <= 0) {
            alert("請輸入有效的攤重總重量");
            return;
        }

        if (!rangeInput) {
            alert("請輸入有效的項次範圍");
            return;
        }

        // 使用 parseRanges 函數解析範圍
        const ranges = parseRanges(rangeInput);
        if (!ranges || ranges.length === 0) {
            alert("請輸入有效的項次範圍");
            return;
        }

        spreadWeightSpecific(ranges, specificWeight, weightDecimalPlaces, lockAfterDistribution);
    } else {
        // 默認全部項次攤重
        spreadWeightDefault(weightDecimalPlaces); // 執行全部項次攤重
    }

    closeSpreadWeightModal(); // 關閉彈跳框
}

// 計算總重量的輔助函數
function calculateTotalWeight(items) {
    return items.reduce((sum, item) => {
        const netWeight = parseFloat(item.querySelector('.NET_WT').value);
        return sum + (isNaN(netWeight) ? 0 : netWeight);
    }, 0);
}

// 默認全部項次攤重
function spreadWeightDefault(weightDecimalPlaces) {
    const totalNetWeight = parseFloat(document.getElementById('DCL_NW').value);
    if (isNaN(totalNetWeight) || totalNetWeight <= 0) {
        alert('請先填寫有效的總淨重');
        return;
    }

    const items = document.querySelectorAll('#item-container .item-row');
    if (items.length === 0) {
        alert('請先新增至少一個項次');
        return;
    }

    let fixedWeights = [];
    let lockedWeightTotal = 0; // 已鎖定項次的總重量
    let remainingNetWeight = totalNetWeight;
    let totalQuantity = 0;

    // 確認哪些項次是固定的
    items.forEach((item, index) => {
        const checkbox = item.querySelector('.ISCALC_WT');
        let netWeight = parseFloat(item.querySelector('.NET_WT').value);

        // 如果值無效或為零，重置為零並取消選中
        if (!netWeight || isNaN(netWeight)) {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
            netWeight = 0;
        }

        if (checkbox && checkbox.checked) {
            fixedWeights.push({ index, netWeight });
            lockedWeightTotal += netWeight; // 累加已鎖定項次的重量
        } else {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            if (!isNaN(quantity)) {
                totalQuantity += quantity;
            }
        }
    });

    // 檢查已鎖定的總重量是否超過總淨重
    if (lockedWeightTotal > totalNetWeight) {
        alert(`攤重失敗！\n已鎖定項次的重量加總 (${parseFloat(lockedWeightTotal.toFixed(6))}) 超過總淨重 (${parseFloat(totalNetWeight.toFixed(6))})`);
        return;
    }

    remainingNetWeight -= lockedWeightTotal;

    if (totalQuantity <= 0) {
        alert('未鎖定的數量總和必須大於零');
        return;
    }

    // 分配剩餘重量
    const distributedWeights = [];
    const minWeight = Math.pow(10, -weightDecimalPlaces);
    items.forEach((item, index) => {
        if (!fixedWeights.some(fixed => fixed.index === index)) {
            const quantity = parseFloat(item.querySelector('.QTY').value);
            if (!isNaN(quantity) && quantity > 0) {
                let netWeight = parseFloat(((quantity / totalQuantity) * remainingNetWeight).toFixed(weightDecimalPlaces));
                netWeight = netWeight <= 0 ? 0 : netWeight;
                distributedWeights.push({ index, netWeight });
            }
        }
    });

    // 應用分配的重量
    distributedWeights.forEach(item => {
        const netWtElement = items[item.index].querySelector('.NET_WT');
        netWtElement.value = item.netWeight.toFixed(weightDecimalPlaces);
    });

    // 確保固定項次的值不變
    fixedWeights.forEach(fixed => {
        const netWtElement = items[fixed.index].querySelector('.NET_WT');
        netWtElement.value = fixed.netWeight;
    });

    // 確保重量總和等於總淨重
    let finalTotalWeight = calculateTotalWeight(Array.from(items));
    let discrepancy = totalNetWeight - finalTotalWeight;

    if (Math.abs(discrepancy) > 0) {
        const largestItem = distributedWeights.reduce((prev, current) => {
            return (prev.netWeight > current.netWeight) ? prev : current;
        });

        const netWtElement = items[largestItem.index].querySelector('.NET_WT');
        netWtElement.value = (parseFloat(netWtElement.value) + discrepancy).toFixed(weightDecimalPlaces);
    }

    // 最終結果
    finalTotalWeight = calculateTotalWeight(Array.from(items));
    alert(`報單表頭的總淨重為：${totalNetWeight}\n各項次的淨重加總為：${parseFloat(finalTotalWeight.toFixed(weightDecimalPlaces))}`);
}

// 指定項次攤重
function spreadWeightSpecific(ranges, specificWeight, weightDecimalPlaces, lockAfterDistribution) {
    const items = document.querySelectorAll('#item-container .item-row');
    let totalQuantity = 0; // 未鎖定項次的總數量
    let validItems = []; // 可分配重量的項次
    let lockedWeight = 0; // 已鎖定的總重量
    const minWeight = Math.pow(10, -weightDecimalPlaces); // 最小分配重量

    // 檢查範圍內的項次
    items.forEach((item, index) => {
        const checkbox = item.querySelector('.ISCALC_WT');
        let netWeight = parseFloat(item.querySelector('.NET_WT').value);

        // 如果值無效或為零，重置為零並取消選中
        if (!netWeight || isNaN(netWeight)) {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
            netWeight = 0;
        }
                
        const itemNo = index + 1; // 假設項次從1開始
        if (ranges.includes(itemNo)) {
            const checkbox = item.querySelector('.ISCALC_WT');
            const netWeight = parseFloat(item.querySelector('.NET_WT').value);
            const quantity = parseFloat(item.querySelector('.QTY').value);

            if (!isNaN(netWeight) && checkbox && checkbox.checked) {
                // 已鎖定項次的重量加總
                lockedWeight += netWeight;
            } else if (!isNaN(quantity) && quantity > 0) {
                // 未鎖定項次，加入到可分配列表
                validItems.push({ index, quantity });
                totalQuantity += quantity;
            }
        }
    });

    // 計算剩餘重量
    let remainingWeight = specificWeight - lockedWeight;

    if (remainingWeight <= 0) {
        alert(`攤重失敗！\n已鎖定項次的重量加總 (${lockedWeight.toFixed(weightDecimalPlaces)}) 超過指定項次總重量 (${specificWeight})`);
        return;
    }

    if (totalQuantity <= 0) {
        alert("指定的範圍內無有效的未鎖定項次。");
        return;
    }

    // 計算每個單位的重量
    const weightPerUnit = remainingWeight / totalQuantity;

    // 分配重量到未鎖定的項次
    let distributedWeights = [];
    validItems.forEach(item => {
        let weight = parseFloat((item.quantity * weightPerUnit).toFixed(weightDecimalPlaces));
        weight = weight <= 0 ? 0 : weight;
        distributedWeights.push({ index: item.index, netWeight: weight });
    });

    // 計算分配後的實際加總重量
    const allocatedTotalWeight = distributedWeights.reduce((sum, item) => sum + item.netWeight, 0);

    // 調整誤差值
    let discrepancy = specificWeight - lockedWeight - allocatedTotalWeight;
    if (Math.abs(discrepancy) > 0) {
        const largestItem = distributedWeights.reduce((prev, current) => {
            return (prev.netWeight > current.netWeight) ? prev : current;
        });

        const netWtElement = items[largestItem.index].querySelector('.NET_WT');
        netWtElement.value = (parseFloat(netWtElement.value) + discrepancy).toFixed(weightDecimalPlaces);
    }

    // 更新 DOM
    distributedWeights.forEach(item => {
        const netWtElement = items[item.index].querySelector('.NET_WT');
        netWtElement.value = item.netWeight.toFixed(weightDecimalPlaces);
    });

    // 是否鎖定攤重後的項次
    if (lockAfterDistribution) {
        validItems.forEach(item => {
            const lockCheckbox = items[item.index].querySelector('.ISCALC_WT');
            if (lockCheckbox) lockCheckbox.checked = true;
        });
    }

    // 確保最終加總等於指定重量（僅限指定範圍）
    let finalTotalWeight = validItems.reduce((sum, item) => {
        const netWeight = parseFloat(items[item.index].querySelector('.NET_WT').value);
        return sum + (isNaN(netWeight) ? 0 : netWeight);
    }, lockedWeight);

    discrepancy = specificWeight - finalTotalWeight;

    if (Math.abs(discrepancy) > 0) {
        // 找出指定範圍內未鎖定的最大重量項次
        const largestItem = distributedWeights.reduce((prev, current) => {
            return (prev.netWeight > current.netWeight) ? prev : current;
        });

        const netWtElement = items[largestItem.index].querySelector('.NET_WT');
        netWtElement.value = (parseFloat(netWtElement.value) + discrepancy).toFixed(weightDecimalPlaces);
    }
}

// 將範圍字串轉換為數字陣列
function parseRanges(rangeInput) {
    try {
        let ranges = [];
        const parts = rangeInput.split(",");
        parts.forEach(part => {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(num => parseInt(num.trim(), 10));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        ranges.push(i);
                    }
                }
            } else {
                const num = parseInt(part.trim(), 10);
                if (!isNaN(num)) {
                    ranges.push(num);
                }
            }
        });
        return ranges;
    } catch (error) {
        return null;
    }
}