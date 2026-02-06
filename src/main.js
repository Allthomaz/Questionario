import { initializeForm, showStep, validateStep, displayResults, generatePDF } from './dom.js';
import { calculateInflammationScore, calculateMentalRiskScore, inflammationData, mentalRiskData } from './logic.js';
import { sendDataToSheet } from './services/sheetApi.js';
import { inject } from '@vercel/analytics';

inject();

let currentStep = 1;
const totalSteps = 4;

// Inicializa o formulário ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    updateProgress();
});

// Navegação
document.getElementById('nextBtn').addEventListener('click', async () => {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateProgress();
            
            // Se chegou ao último passo (Resultados), calcula e exibe
            if (currentStep === 4) {
                processResults();
            }
        }
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
});

function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').innerText = `${Math.round(progress)}%`;
}

/**
 * Processa os resultados, exibe na tela e envia para a planilha
 */
async function processResults() {
    // 1. Calcular Escores
    const inflammationScore = calculateInflammationScore();
    const mentalRiskScore = calculateMentalRiskScore();

    // 2. Exibir na Tela
    displayResults(inflammationScore, mentalRiskScore);

    // 3. Coletar Dados do Paciente
    const patientData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        nascimento: document.getElementById('nascimento').value,
        telefone: document.getElementById('telefone').value,
        escore_inflamacao: inflammationScore.score,
        nivel_inflamacao: inflammationScore.classification,
        escore_risco_mental: mentalRiskScore.score,
        nivel_risco_mental: mentalRiskScore.classification
    };

    // 4. Enviar para Planilha (Google Sheets)
    // O envio é feito em "background", sem bloquear a visualização do usuário
    sendDataToSheet(patientData).then(success => {
        if (success) {
            console.log("Dados sincronizados com a planilha.");
        } else {
            console.log("Atenção: Configure a URL da planilha em src/services/sheetApi.js");
        }
    });
}
