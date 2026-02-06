import { inflammationData, mentalRiskData, calculateInflammationScore, calculateMentalRiskScore } from './logic.js';

/**
 * Função auxiliar para criar um elemento HTML
 */
function createElement(tag, classes = [], text = '') {
    const element = document.createElement(tag);
    if (classes.length) element.classList.add(...classes);
    if (text) element.textContent = text;
    return element;
}

/**
 * Inicializa o formulário, criando e inserindo as perguntas na página.
 */
export function initializeForm() {
    const inflammationContainer = document.getElementById('inflammation-questions');
    const mentalRiskContainer = document.getElementById('mental-risk-questions');
    
    // Clear containers to prevent duplication if re-initialized
    inflammationContainer.innerHTML = '';
    mentalRiskContainer.innerHTML = '';

    let questionIndex = 0; // Usar um único índice para nomes únicos

    inflammationData.forEach(category => {
        // Título da categoria
        const catTitle = createElement('h3', ['text-lg', 'font-bold', 'text-cyan-700', 'mt-4', 'mb-2'], category.title);
        inflammationContainer.appendChild(catTitle);

        category.questions.forEach(q => {
            const questionWrapper = createElement('div', ['flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'sm:justify-between', 'py-2', 'border-b', 'border-gray-200', 'last:border-0']);
            const questionName = `inflamacao_${questionIndex}`; 
            const label = createElement('label', ['flex-1', 'mr-4', 'text-sm', 'mb-2', 'sm:mb-0'], q);
            const radioGroup = createElement('div', ['flex', 'items-center', 'space-x-2', 'inflammation-radio']);
            
            for (let i = 0; i <= 4; i++) {
                const radioId = `q-${questionIndex}-${i}`;
                const radioInput = createElement('input');
                radioInput.type = 'radio';
                radioInput.name = questionName;
                radioInput.id = radioId;
                radioInput.value = i;
                
                const radioLabel = createElement('label', [], i.toString());
                radioLabel.htmlFor = radioId;
                
                radioGroup.append(radioInput, radioLabel);
            }
            questionWrapper.append(label, radioGroup);
            inflammationContainer.appendChild(questionWrapper);
            questionIndex++;
        });
    });

    mentalRiskData.forEach(q => {
        const questionWrapper = createElement('div', ['flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'sm:justify-between', 'p-3', 'border', 'border-gray-200', 'rounded-lg']);
        const label = createElement('label', ['flex-1', 'mr-4', 'text-sm', 'mb-2', 'sm:mb-0'], q);
        const radioGroup = createElement('div', ['flex', 'items-center', 'space-x-2', 'mental-radio']);
        const questionName = `risco_mental_${questionIndex}`; 

        // Opção "Não"
        const radioNoId = `q-${questionIndex}-0`;
        const radioNoInput = createElement('input');
        radioNoInput.type = 'radio';
        radioNoInput.name = questionName;
        radioNoInput.id = radioNoId;
        radioNoInput.value = '0';
        
        const radioNoLabel = createElement('label', [], 'Não');
        radioNoLabel.htmlFor = radioNoId;

        // Opção "Sim"
        const radioYesId = `q-${questionIndex}-1`;
        const radioYesInput = createElement('input');
        radioYesInput.type = 'radio';
        radioYesInput.name = questionName;
        radioYesInput.id = radioYesId;
        radioYesInput.value = '1';
        
        const radioYesLabel = createElement('label', [], 'Sim');
        radioYesLabel.htmlFor = radioYesId;

        radioGroup.append(radioNoInput, radioNoLabel, radioYesInput, radioYesLabel);
        questionWrapper.append(label, radioGroup);
        mentalRiskContainer.appendChild(questionWrapper);
        questionIndex++;
    });
}

/**
 * Exibe os resultados calculados na tela.
 */
export function displayResults(inflammationTotal, mentalRiskTotal, inflammationLevel, mentalRiskLevel) {
    const inflammationScoreEl = document.getElementById('inflammation-score');
    const inflammationLevelEl = document.getElementById('inflammation-level');
    const inflammationResultEl = document.getElementById('inflammation-result');
    
    let iColorClass;
    if (inflammationTotal < 10) iColorClass = 'bg-green-100 text-green-700';
    else if (inflammationTotal < 50) iColorClass = 'bg-yellow-100 text-yellow-700';
    else if (inflammationTotal < 100) iColorClass = 'bg-orange-100 text-orange-700';
    else iColorClass = 'bg-red-100 text-red-700';

    inflammationScoreEl.textContent = inflammationTotal;
    inflammationLevelEl.textContent = inflammationLevel;
    inflammationResultEl.className = `p-4 rounded-lg ${iColorClass.split(' ')[0]}`;
    inflammationScoreEl.className = `text-5xl font-bold my-2 ${iColorClass.split(' ')[1]}`;

    const mentalRiskScoreEl = document.getElementById('mental-risk-score');
    const mentalRiskLevelEl = document.getElementById('mental-risk-level');
    const mentalRiskResultEl = document.getElementById('mental-risk-result');
    
    let mColorClass;
    if (mentalRiskTotal === 0) mColorClass = 'bg-green-100 text-green-700';
    else if (mentalRiskTotal <= 9) mColorClass = 'bg-yellow-100 text-yellow-700';
    else if (mentalRiskTotal <= 20) mColorClass = 'bg-orange-100 text-orange-700';
    else mColorClass = 'bg-red-100 text-red-700';

    mentalRiskScoreEl.textContent = `${mentalRiskTotal} / ${mentalRiskData.length}`;
    mentalRiskLevelEl.textContent = mentalRiskLevel;
    mentalRiskResultEl.className = `p-4 rounded-lg ${mColorClass.split(' ')[0]}`;
    mentalRiskScoreEl.className = `text-5xl font-bold my-2 ${mColorClass.split(' ')[1]}`;
}

export function updateProgressBar(currentStep, totalSteps) {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

export function showStep(step, totalSteps) {
    // Esconder todos os passos
    for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        if (stepEl) {
            stepEl.classList.add('hidden');
        }
    }

    // Mostrar passo atual
    const currentStepEl = document.getElementById(`step-${step}`);
    if (currentStepEl) {
        currentStepEl.classList.remove('hidden');
    }

    // Atualizar botões
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navContainer = document.getElementById('navigation-container');

    if (step === 1) {
        prevBtn.classList.add('hidden');
        nextBtn.textContent = 'Próximo';
        navContainer.classList.remove('hidden');
    } else if (step === totalSteps) {
        navContainer.classList.add('hidden'); // Esconder botões de navegação no passo final
    } else {
        prevBtn.classList.remove('hidden');
        nextBtn.textContent = step === totalSteps - 1 ? 'Ver Resultados' : 'Próximo';
        navContainer.classList.remove('hidden');
    }

    updateProgressBar(step, totalSteps);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function validateStep(step) {
    const currentStepEl = document.getElementById(`step-${step}`);
    let isValid = true;

    // 1. Validar campos required (inputs de texto, etc)
    const inputs = currentStepEl.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add('border-red-500', 'ring-1', 'ring-red-500');
            input.addEventListener('input', () => {
                input.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
            }, { once: true });
        }
    });

    // 2. Validar Radio Buttons (Perguntas)
    const radios = currentStepEl.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) {
        const radioGroups = {};
        // Agrupar por nome
        radios.forEach(radio => {
            if (!radioGroups[radio.name]) {
                radioGroups[radio.name] = [];
            }
            radioGroups[radio.name].push(radio);
        });

        // Verificar cada grupo
        for (const name in radioGroups) {
            const group = radioGroups[name];
            const isChecked = group.some(radio => radio.checked);
            
            if (!isChecked) {
                isValid = false;
                // O wrapper da pergunta é o avô do input (input -> div.radio-group -> div.wrapper)
                const questionWrapper = group[0].parentElement.parentElement;
                
                if (questionWrapper) {
                    // Adicionar feedback visual de erro
                    questionWrapper.classList.add('bg-red-50', 'border-red-300'); // Estilo mais sutil para o bloco
                    
                    // Remover feedback ao selecionar
                    group.forEach(radio => {
                        radio.addEventListener('change', () => {
                            questionWrapper.classList.remove('bg-red-50', 'border-red-300');
                        }, { once: true });
                    });
                }
            }
        }
    }

    if (!isValid) {
        alert('Por favor, responda todas as perguntas obrigatórias antes de prosseguir.');
        
        // Rolar para o primeiro erro
        const firstError = currentStepEl.querySelector('.border-red-500, .bg-red-50');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

/**
 * Gera o PDF com os resultados
 */
export async function generatePDF(inflammationData, mentalRiskData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Dados do Formulário
    const nome = document.getElementById('nome').value || "Paciente";
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const scoreInflamacao = document.getElementById('escore_inflamacao').value;
    const nivelInflamacao = document.getElementById('nivel_inflamacao').value;
    const scoreMental = document.getElementById('escore_risco_mental').value;
    const nivelMental = document.getElementById('nivel_risco_mental').value;

    // --- Cabeçalho ---
    doc.setFontSize(18);
    doc.setTextColor(0, 150, 136); // Cor Teal (similar ao design)
    doc.text("Relatório de Saúde Integrativa", 105, 20, null, null, "center");
    doc.setFontSize(14);
    doc.text("Dr. Bruno Paschoalini", 105, 28, null, null, "center");
    
    // --- Dados do Paciente ---
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Paciente: ${nome}`, 20, 45);
    doc.text(`Data: ${dataAtual}`, 150, 45);

    // --- Resumo dos Escores ---
    doc.setDrawColor(0, 150, 136);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
    
    doc.setFontSize(14);
    doc.text("Resumo dos Resultados", 20, 60);
    
    doc.setFontSize(12);
    // Inflamação
    doc.text(`Inflamação:`, 20, 70);
    doc.setFont("helvetica", "bold");
    doc.text(`${scoreInflamacao} - ${nivelInflamacao}`, 50, 70);
    
    // Risco Mental
    doc.setFont("helvetica", "normal");
    doc.text(`Risco Mental:`, 110, 70);
    doc.setFont("helvetica", "bold");
    doc.text(`${scoreMental} - ${nivelMental}`, 140, 70);
    doc.setFont("helvetica", "normal");

    // --- Tabela de Destaques ---
    const rows = [];
    const formData = new FormData(document.getElementById('questionnaireForm'));
    let globalIndex = 0;

    // Processar Inflamação (Valores 3 ou 4)
    inflammationData.forEach(cat => {
        cat.questions.forEach(q => {
            const val = formData.get(`inflamacao_${globalIndex}`);
            if (val && parseInt(val) >= 3) {
                rows.push([q, "Inflamação", val + "/4 (Alto)"]);
            }
            globalIndex++;
        });
    });

    // Processar Risco Mental (Valor 1 = Sim)
    mentalRiskData.forEach(q => {
        const val = formData.get(`risco_mental_${globalIndex}`);
        if (val && parseInt(val) === 1) {
            rows.push([q, "Risco Mental", "Sim"]);
        }
        globalIndex++;
    });

    if (rows.length > 0) {
        doc.autoTable({
            startY: 80,
            head: [['Sintoma / Fator', 'Categoria', 'Resultado']],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [0, 150, 136] },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 100 },
                2: { fontStyle: 'bold', textColor: [220, 53, 69] } // Vermelho para destacar
            }
        });
    } else {
         doc.setFontSize(11);
         doc.setTextColor(0, 128, 0);
         doc.text("Parabéns! Nenhum ponto de atenção grave foi identificado neste questionário.", 20, 90);
    }

    // --- Rodapé ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text("Este documento é informativo e não substitui consulta médica.", 105, pageHeight - 10, null, null, "center");

    // Baixar PDF
    doc.save(`Relatorio_DrBruno_${nome.replace(/\s+/g, '_')}.pdf`);
}
