// 開啟調整順序的彈跳框
function openAdjustOrderModal() {
    const itemContainer = document.getElementById('item-container');
    const items = itemContainer.querySelectorAll('.item-row');

    const orderList = document.getElementById('order-list');
    orderList.innerHTML = ''; // 清空列表

    items.forEach((item, index) => {
        const description = item.querySelector('.DESCRIPTION').value; // 獲取品名
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${index + 1} - 品名: ${description}</span>
            <input type="hidden" class="original-order" value="${index}">
        `;
        orderList.appendChild(orderItem);

        // 添加觸摸事件處理
        orderItem.addEventListener('touchstart', handleTouchStart, { passive: true });
        orderItem.addEventListener('touchmove', handleTouchMove, { passive: false });
        orderItem.addEventListener('touchend', handleTouchEnd);
    });

    // 初始化 Sortable.js
    Sortable.create(orderList, {
        animation: 150
    });

    const adjustOrderModal = document.getElementById('adjust-order-modal');
    adjustOrderModal.style.display = 'flex';

    // 監聽 ESC 鍵，表示取消
    document.addEventListener('keydown', handleEscKeyForAdjustOrderCancel);
}

function handleEscKeyForAdjustOrderCancel(event) {
    if (event.key === 'Escape') {
        closeAdjustOrderModal();
    }
}

function closeAdjustOrderModal() {
    const adjustOrderModal = document.getElementById('adjust-order-modal');
    adjustOrderModal.style.display = 'none';
    document.removeEventListener('keydown', handleEscKeyForAdjustOrderCancel);
}

// 關閉調整順序的彈跳框
function closeOrderModal() {
    document.getElementById('adjust-order-modal').style.display = 'none';
}

// 儲存新的順序
function saveNewOrder() {
    const orderList = document.getElementById('order-list');
    const orderItems = orderList.querySelectorAll('.order-item');
    const newOrder = Array.from(orderItems).map(item => parseInt(item.querySelector('.original-order').value));

    const itemContainer = document.getElementById('item-container');
    const items = Array.from(itemContainer.querySelectorAll('.item-row'));
    itemContainer.innerHTML = '';
    newOrder.forEach(index => {
        itemContainer.appendChild(items[index]);
    });

    renumberItems();
    closeOrderModal();
}

let draggedItem = null;

function handleTouchStart(event) {
    draggedItem = event.target.closest('.order-item');
    draggedItem.classList.add('dragging');
    event.preventDefault();
}

function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementUnderTouch && elementUnderTouch.classList.contains('order-item') && elementUnderTouch !== draggedItem) {
        const target = elementUnderTouch;
        const parent = target.parentNode;
        parent.insertBefore(draggedItem, target.nextSibling || target);
    }
}

function handleTouchEnd(event) {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
}