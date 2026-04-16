// Nequibot Product Hub - JavaScript
// Todas las funcionalidades en un solo archivo

// ============================================
// NAVEGACIÓN DE TABS
// ============================================
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// ============================================
// OKRs
// ============================================
function toggleOKR(header) {
    header.parentElement.classList.toggle('open');
}

function updateProgress(bar, event) {
    const rect = bar.getBoundingClientRect();
    const percent = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    bar.querySelector('.progress-fill').style.width = percent + '%';
    showToast();
}

// ============================================
// EXPORTAR Y DESCARGAR
// ============================================
function exportPDF() {
    window.print();
}

function downloadHTML() {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nequibot-hub-' + new Date().toISOString().split('T')[0] + '.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ HTML descargado');
}

// ============================================
// TOAST (NOTIFICACIONES)
// ============================================
function showToast(msg = '✓ Cambios guardados localmente') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============================================
// PERSISTENCIA LOCAL
// ============================================
document.addEventListener('input', () => {
    localStorage.setItem('nequibot-data', document.documentElement.outerHTML);
    showToast();
});


// ============================================
// DRAG & DROP DEL ROADMAP
// ============================================
function initDragAndDrop() {
    const initiatives = document.querySelectorAll('.initiative');
    const cells = document.querySelectorAll('.roadmap-cell');
    
    // Configurar iniciativas como arrastrables
    initiatives.forEach(init => {
        init.setAttribute('draggable', 'true');
        
        init.addEventListener('dragstart', (e) => {
            init.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', init.innerHTML);
        });
        
        init.addEventListener('dragend', () => {
            init.classList.remove('dragging');
        });
    });
    
    // Configurar celdas como zonas de drop
    cells.forEach(cell => {
        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            cell.classList.add('drag-over');
        });
        
        cell.addEventListener('dragleave', () => {
            cell.classList.remove('drag-over');
        });
        
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                // Mover la iniciativa a la nueva celda
                cell.appendChild(dragging);
                showToast('✓ Iniciativa movida');
                
                // Guardar cambios
                localStorage.setItem('nequibot-data', document.documentElement.outerHTML);
            }
        });
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================
window.addEventListener('load', () => {
    // Cargar datos guardados
    const saved = localStorage.getItem('nequibot-data');
    if (saved && confirm('¿Cargar cambios guardados anteriormente?')) {
        document.documentElement.innerHTML = new DOMParser()
            .parseFromString(saved, 'text/html')
            .documentElement.innerHTML;
    }
    
    // Inicializar drag & drop
    initDragAndDrop();
    
    console.log('✓ Nequibot Product Hub cargado correctamente');
});
