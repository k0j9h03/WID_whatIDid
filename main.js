const textareas = document.querySelectorAll('.card-textarea');
let draggedTextarea = null;
let clonedCard = null; // clonedCard 변수를 전역으로 선언합니다.


textareas.forEach(e => {
    adjustTextareaHeight(e);
    e.addEventListener('input', () => adjustTextareaHeight(e));
    e.addEventListener('mousedown', dragStart);
});

document.addEventListener('mouseup', dragEnd);
document.addEventListener('mousemove', drag); // 이 부분을 추가하여 한 번만 등록되도록 합니다.

function adjustTextareaHeight(textarea) {
    textarea.style.height = '0';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function dragStart(event) {
    event.stopPropagation();
    draggedTextarea = this;
    this.style.opacity = '1';
    this.style.zIndex = '9999';
    // this.style.position = 'absolute'; <=이거 진짜 조심하자
    this.style.pointerEvents = 'none';
    this.startX = event.clientX;
    this.startY = event.clientY;

    clonedCard = draggedTextarea.cloneNode(true);
    clonedCard.style.left = draggedTextarea.offsetLeft + 'px'; // 원래 카드와 같은 위치에서 시작합니다.
    clonedCard.style.top = draggedTextarea.offsetTop + 'px';
    clonedCard.style.opacity = '0'; // 투명도를 줘서 드래그 중임을 표시합니다.
    clonedCard.style.position = 'absolute'; // 절대 위치로 설정하여 마우스를 따라다닐 수 있도록 합니다.
    this.parentNode.appendChild(clonedCard); // 원래의 텍스트 박스와 같은 컨테이너에 클론된 카드를 추가합니다.
    document.body.appendChild(clonedCard);
    clonedCard.style.zIndex = '9999';

}

function drag(event) {
    if (!draggedTextarea) return;
    
    const offsetX = event.clientX - draggedTextarea.startX;
    const offsetY = event.clientY - draggedTextarea.startY;
    draggedTextarea.style.opacity = '0';
    draggedTextarea.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    const dropZone = document.elementFromPoint(event.clientX, event.clientY);
    const dropZoneTextarea = dropZone.closest('.card-textarea');
    clonedCard.style.opacity = '1'; // 투명도를 줘서 드래그 중임을 표시합니다.
    clonedCard.style.left = event.clientX - clonedCard.offsetWidth / 2 + 'px'; // 마우스의 X 좌표를 따라 이동합니다.
    clonedCard.style.top = event.clientY - clonedCard.offsetHeight / 2 + 'px'; // 마우스의 Y 좌표를 따라 이동합니다.
    
    if (dropZoneTextarea && draggedTextarea !== dropZoneTextarea) {
        // 드롭된 위치에 다른 텍스트 박스가 있는 경우 위치를 바꿉니다.
        // 텍스트 박스의 부모 노드인 container에서 두 텍스트 박스의 인덱스를 찾습니다.
        const container = draggedTextarea.parentNode;
        const draggedIndex = Array.from(container.children).indexOf(draggedTextarea);
        const dropIndex = Array.from(container.children).indexOf(dropZoneTextarea);
        const indexDifference = draggedIndex - dropIndex;
    
        // DOM 조작을 통해 두 텍스트 박스의 순서를 변경합니다.
        if (draggedIndex < dropIndex) {
            container.insertBefore(draggedTextarea, dropZoneTextarea.nextSibling);
        } else {
            container.insertBefore(draggedTextarea, dropZoneTextarea);
        }
    }
    

}

function dragEnd(event) {
  if (!draggedTextarea) return;
  draggedTextarea.style.opacity = '1';
  draggedTextarea.style.zIndex = 'auto';
  draggedTextarea.style.pointerEvents = 'auto';
  draggedTextarea.style.transform = 'none';

  // 드롭된 위치의 카드 엘리먼트를 찾습니다.
  const dropZone = document.elementFromPoint(event.clientX, event.clientY);
  const dropZoneTextarea = dropZone.closest('.card-textarea');

  if (dropZoneTextarea && draggedTextarea !== dropZoneTextarea) {
    // 드롭된 위치에 다른 텍스트 박스가 있는 경우 위치를 바꿉니다.
    // 텍스트 박스의 부모 노드인 container에서 두 텍스트 박스의 인덱스를 찾습니다.
    const container = draggedTextarea.parentNode;
    const draggedIndex = Array.from(container.children).indexOf(draggedTextarea);
    const dropIndex = Array.from(container.children).indexOf(dropZoneTextarea);

    // DOM 조작을 통해 두 텍스트 박스의 순서를 변경합니다.
    if (draggedIndex < dropIndex) {
        container.insertBefore(draggedTextarea, dropZoneTextarea.nextSibling);
    } else {
        container.insertBefore(draggedTextarea, dropZoneTextarea);
    }
}

if (clonedCard) {
    clonedCard.remove();
}

clonedCard = null;
draggedTextarea = null;
}
