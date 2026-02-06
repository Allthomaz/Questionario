export const inflammationData = [
    { title: "Trato Digestivo", questions: ["Náusea ou vômitos", "Diarréia", "Constipação / prisão de ventre", "Estufamento abdominal", "Arrotos ou gases", "Queimação (azia) no peito", "Dor estomacal / intestinal"] },
    { title: "Energia / Atividade", questions: ["Fadiga ou lentidão", "Apatia, letargia", "Hiperatividade", "Inquietude, dificuldade em relaxar"] },
    { title: "Ouvidos", questions: ["Coceira", "Dor de ouvido ou otites", "Presença de secreção no ouvido", "Zumbido ou perda auditiva"] },
    { title: "Emoções", questions: ["Alterações de humor", "Ansiedade, medo ou nervosismo", "Depressão"] },
    { title: "Olhos", questions: ["Lacrimejando ou coceira ocular", "Olhos inchados/vermelhos/cílios colando", "Bolsas ou olheiras abaixo dos olhos", "Visão borrada ou em túnel"] },
    { title: "Cabeça", questions: ["Dor de cabeça", "Sensação de desmaio", "Tonturas", "Insônia"] },
    { title: "Pulmões", questions: ["Congestão no peito", "Asma, bronquite", "Respiração rápida, pouco fôlego", "Dificuldade de respirar"] },
    { title: "Mente", questions: ["Pouca memória", "Confusão, má compreensão", "Dificuldade de concentração", "Má coordenação motora", "Dificuldade em tomar decisões", "Gagueira ou incoordenação da voz", "Fala arrastada", "Pronúncia de forma confusa", "Dificuldade de aprendizado"] },
    { title: "Articulações / Músculos", questions: ["Dor ou inchaços nas juntas", "Artrite / Artrose", "Rigidez ou limitação de movimento", "Dor ou inchaço muscular", "Sensação de fraqueza ou cansaço"] },
    { title: "Coração", questions: ["Batimentos cardíacos irregulares", "Batidas rápidas demais (Taquicardia)", "Dor torácica"] },
    { title: "Peso", questions: ["Compulsão alimentar / álcool", "Fissura por certos alimentos", "Ganho de peso", "Compulsão alimentar", "Retenção de líquidos", "Perda de peso"] },
    { title: "Nariz", questions: ["Entupido", "Sinusite", "Corrimento nasal, espirros, lacrimejamento e coceira dos olhos", "Ataques de espirro", "Excessiva secreção nasal"] },
    { title: "Pele", questions: ["Acne", "Feridas que coçam, erupções ou pele seca", "Perda de cabelo", "Vermelhidão, calorões", "Suor excessivo"] },
    { title: "Outros", questions: ["Doenças frequentes", "Aumento da frequência ou urgência urinária", "Coceira ou secreção genitais", "Edema / inchaço de mãos / pernas / pés"] },
    { title: "Boca / Garganta", questions: ["Tosse crônica", "Necessidade frequente de limpar a garganta", "Dor de garganta, rouquidão, perda da voz", "Língua, gengiva ou lábios inchados descoloridos ou pálidos", "Aftas"] }
];

export const mentalRiskData = [
    "Eu como pão quase diariamente", "Tomo suco de frutas (de qualquer tipo)", "Como mais de três frutas por dia", "Uso adoçante artificial", "Caminho menos de 50 min/dia na maior parte dos dias", "Fico ofegante ao caminhar", "Como pouca salada", "Estou acima do peso (IMC > 24.9)", "Como arroz, massa ou pão à noite", "Tomo leite pasteurizado", "Tenho histórico familiar de problemas neurológicos", "Evito comer gorduras de qualquer tipo", "Tomo remédio para colesterol", "Tomo refrigerante (seja diet ou normal)", "Tomo pouca água (menos de 2 litros por dia)", "Tomo cerveja", "Como cereais (aveia, granola, musli, sucrilhos, trigo, etc)", "Tive problemas auditivos por 10 anos", "Durmo com celular no quarto", "Fumei pelo menos 10 anos", "Tive depressão/ansiedade por 10 anos", "Tomei remédio para dormir por 10 anos", "Ronco à noite e/ou tenho apnéia do sono", "Minha pressão é maior que 120/80 mmHg às vezes", "Meu colesterol HDL é inferior a 50 mg/dl", "Minha vitamina B12 é inferior a 500 pg/ml", "Minha vitamina D é inferior a 50 ng/dl", "Minha glicose é superior a 89 mg/ml", "Minha insulina de jejum é > 6 uU/ml", "Minha homocisteína é > 7 micromol/L", "Meu PCR-us é > 0.7 mg/dL"
];

export function calculateInflammationScore(answers) {
    let total = 0;
    // Iterate over values; keys might be inflamacao_0, inflamacao_1 etc.
    // The passed object 'answers' is expected to contain only inflammation values or we filter them.
    // To keep it pure and simple, let's assume 'answers' is an array of values or an object where all values are numbers.
    // However, the original code used FormData entries.
    // Let's adapt: input is a list of values (numbers).
    
    if (Array.isArray(answers)) {
        total = answers.reduce((acc, val) => acc + Number(val), 0);
    } else {
         for (const value of Object.values(answers)) {
            total += Number(value);
        }
    }
    
    let level;
    if (total < 10) level = 'Normal';
    else if (total < 50) level = 'Leve';
    else if (total < 100) level = 'Moderada';
    else level = 'Grave';

    return { total, level };
}

export function calculateMentalRiskScore(answers) {
    let total = 0;
    if (Array.isArray(answers)) {
        total = answers.reduce((acc, val) => acc + Number(val), 0);
    } else {
        for (const value of Object.values(answers)) {
            total += Number(value);
        }
    }

    let level;
    if (total === 0) level = 'Ideal';
    else if (total <= 9) level = 'Leve';
    else if (total <= 20) level = 'Moderado';
    else level = 'Grave';

    return { total, level };
}
