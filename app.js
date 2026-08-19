// Lógica Global de la Aplicación Falmed

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Lógica del Validador Público ---
    const validationForm = document.getElementById('validation-form');
    if (validationForm) {
        validationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-submit');
            const originalContent = btn.innerHTML;
            const resultMsg = document.getElementById('result-msg');
            
            resultMsg.classList.add('hidden');
            btn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Conectando...';
            btn.disabled = true;
            btn.classList.add('opacity-90', 'cursor-not-allowed');
            
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                btn.classList.remove('opacity-90', 'cursor-not-allowed');
                resultMsg.classList.remove('hidden');
                document.getElementById('folio').value = '';
                document.getElementById('codigo').value = '';
            }, 1800);
        });
    }

    // --- 2. Lógica del Panel de Administración ---
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    const btnUpload = document.getElementById('btn-upload');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if(e.target.files.length > 0) {
                fileNameDisplay.textContent = "Archivo seleccionado: " + e.target.files[0].name;
                fileNameDisplay.classList.add('text-falmed-blue', 'font-medium');
                btnUpload.disabled = false;
                btnUpload.classList.remove('opacity-50', 'cursor-not-allowed');
                document.getElementById('success-msg').classList.add('hidden');
            }
        });
    }
});

// --- Funciones Globales ---

// Generar PDF y QR (Index)
window.generarPDF = async function() {
    const btn = document.getElementById('btn-descarga');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    btn.disabled = true;

    try {
        const folio = "FAL-" + Math.floor(Math.random() * 1000000);
        const codigoVerificacion = Math.random().toString(36).substring(2, 8).toUpperCase();
        const urlValidacion = 'https://falmed.cl/validar?folio=' + folio + '&codigo=' + codigoVerificacion;
        
        const qrContainer = document.getElementById('qr-container');
        qrContainer.innerHTML = ''; 
        
        await new Promise((resolve) => {
            new QRCode(qrContainer, {
                text: urlValidacion,
                width: 100, height: 100,
                correctLevel : QRCode.CorrectLevel.H
            });
            setTimeout(resolve, 500); 
        });

        const qrDataUrl = qrContainer.querySelector('canvas').toDataURL("image/png");
        window.jsPDF = window.jspdf.jsPDF;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(30, 58, 138); 
        doc.text("FALMED", 105, 30, null, null, "center");
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("CERTIFICADO DE AFILIACIÓN", 105, 45, null, null, "center");

        doc.setFontSize(12);
        doc.text("Por el presente documento, certificamos que:", 20, 70);
        doc.setFontType("bold");
        doc.text("Nombre: Dr. Juan Pérez González", 20, 85);
        doc.text("RUT: 12.345.678-9", 20, 95);
        doc.text("ICM: 45678", 20, 105);
        doc.setFontType("normal");
        doc.text("Se encuentra en calidad de AFILIADO ACTIVO en la Fundación.", 20, 125);
        
        const fechaActual = new Date().toLocaleDateString('es-CL');
        doc.text("Santiago, Chile a " + fechaActual + ".", 20, 150);

        doc.setDrawColor(200);
        doc.line(20, 240, 190, 240); 
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("Folio de Emisión: " + folio, 20, 250);
        doc.text("Código de Verificación: " + codigoVerificacion, 20, 255);
        doc.text("Valide este documento escaneando el código QR.", 20, 265);
        
        doc.addImage(qrDataUrl, 'PNG', 160, 245, 30, 30);
        doc.save("Certificado_Falmed_Prueba.pdf");

    } catch (error) {
        console.error(error);
        alert("Error al generar certificado");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Simular Carga de Base de Datos (Admin)
window.simularCarga = function() {
    const btnUpload = document.getElementById('btn-upload');
    btnUpload.disabled = true;
    btnUpload.classList.add('opacity-50');
    btnUpload.innerText = "Procesando...";
    
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    progressContainer.classList.remove('hidden');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                btnUpload.innerText = "Sincronización Completada";
                document.getElementById('success-msg').classList.remove('hidden');
                document.getElementById('progress-status').innerText = "Datos guardados";
                document.getElementById('total-users').innerText = "30.000";
                document.getElementById('last-sync').innerText = "Hoy a las " + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
                document.getElementById('last-sync').classList.add('text-green-600');
            }, 500);
        }
        progressBar.style.width = progress + '%';
        progressPercentage.innerText = progress + '%';
    }, 400);
}
