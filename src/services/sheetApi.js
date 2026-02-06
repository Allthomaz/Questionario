/**
 * Serviço responsável por enviar os dados para a Planilha Google
 */

// ATENÇÃO: Substitua esta URL pela URL gerada na sua Implantação do Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwm1hWoaDIsZBfWdm7tnr5UlAhduvQdh4UQS844ghWWJBcHoWBowWMOzu2TR41SaF8kJQ/exec';

/**
 * Envia os dados do paciente para a planilha
 * @param {Object} patientData - Objeto com os dados do paciente e resultados
 * @returns {Promise<boolean>} - True se sucesso, False se erro
 */
export async function sendDataToSheet(patientData) {
    if (GOOGLE_SCRIPT_URL === 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI') {
        console.warn('URL da API do Google Sheets não configurada. Os dados não serão salvos na nuvem.');
        return false;
    }

    try {
        // Usamos mode: 'no-cors' para evitar problemas de CORS com Google Apps Script
        // Isso significa que a resposta será "opaque" (não legível), mas o envio funciona.
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Importante para evitar preflight OPTIONS
            },
            body: JSON.stringify(patientData),
            keepalive: true // Garante o envio mesmo se a aba for fechada
        });

        console.log('Dados enviados para a planilha com sucesso (modo no-cors).');
        return true;
    } catch (error) {
        console.error('Erro ao enviar dados para a planilha:', error);
        return false;
    }
}
