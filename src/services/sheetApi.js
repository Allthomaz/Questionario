const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3vlfUppxkUNldq6qzVlKbKnXUV3hz9mtKwWtrg46bGLhehRYJom1rYwk9-t4BVUbiMw/exec';

export async function sendDataToSheet(patientData) {
    if (GOOGLE_SCRIPT_URL.includes('SUA_URL')) {
        console.warn('URL da API não configurada.');
        return false;
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(patientData)
        });

        console.log('Enviado para planilha. Verifique lá.');
        return true;
    } catch (error) {
        console.error('Falha no envio:', error);
        return false;
    }
}
