import { execSync } from 'child_process';
import fs from 'fs';
import * as XLSX from 'xlsx';

console.log('Iniciando análise automatizada...');

const reportData = [];

// 1. Executar Testes
try {
    console.log('Executando testes...');
    // Roda os testes e captura a saída
    // Vitest output can be tricky to parse if not in JSON mode, but let's try basic execution
    // Using --reporter=json requires installing @vitest/ui or similar sometimes, or just standard vitest.
    // Let's use simple execution first.
    execSync('npm test', { stdio: 'inherit' });
    
    reportData.push({
        Categoria: 'Testes Unitários',
        Métrica: 'Status Geral',
        Valor: 'Sucesso',
        Status: 'Aprovado'
    });

} catch (error) {
    console.error('Alerta: Alguns testes falharam ou houve erro na execução.');
    reportData.push({
        Categoria: 'Testes Unitários',
        Métrica: 'Status Geral',
        Valor: 'Falha',
        Status: 'Reprovado'
    });
}

// 2. Análise de Arquivos
const files = ['src/logic.js', 'src/dom.js', 'src/main.js', 'index.html'];
files.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf-8');
            const lines = content.split('\n').length;
            reportData.push({
                Categoria: 'Métricas de Código',
                Métrica: `Linhas em ${file}`,
                Valor: lines,
                Status: lines > 300 ? 'Atenção (Arquivo Grande)' : 'Bom'
            });
        }
    } catch (e) {
        console.error(`Erro ao ler ${file}:`, e.message);
    }
});

// 3. Exportar para Excel
try {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    
    // Ajustar largura das colunas
    const wscols = [
        {wch: 20}, // Categoria
        {wch: 30}, // Métrica
        {wch: 15}, // Valor
        {wch: 20}  // Status
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Relatório de Análise");

    const reportFileName = 'Relatorio_Analise_Projeto.xlsx';
    XLSX.writeFile(wb, reportFileName);

    console.log(`\n✅ Análise concluída! Relatório salvo em: ${reportFileName}`);
} catch (error) {
    console.error('Erro ao gerar planilha:', error.message);
}
