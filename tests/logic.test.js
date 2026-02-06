import { describe, it, expect } from 'vitest';
import { calculateInflammationScore, calculateMentalRiskScore } from '../src/logic.js';

describe('Cálculo de Escore de Inflamação', () => {
    it('deve retornar Normal para pontuação < 10', () => {
        const answers = [1, 1, 1]; // Total 3
        const result = calculateInflammationScore(answers);
        expect(result.total).toBe(3);
        expect(result.level).toBe('Normal');
    });

    it('deve retornar Leve para pontuação entre 10 e 49', () => {
        const answers = [4, 4, 4]; // Total 12
        const result = calculateInflammationScore(answers);
        expect(result.total).toBe(12);
        expect(result.level).toBe('Leve');
    });

    it('deve retornar Moderada para pontuação entre 50 e 99', () => {
        // Simulando 13 questões com pontuação 4 = 52
        const answers = Array(13).fill(4);
        
        const result = calculateInflammationScore(answers);
        expect(result.total).toBe(52);
        expect(result.level).toBe('Moderada');
    });

    it('deve retornar Grave para pontuação >= 100', () => {
        // Simulando 25 questões com pontuação 4 = 100
        const answers = Array(25).fill(4);

        const result = calculateInflammationScore(answers);
        expect(result.total).toBe(100);
        expect(result.level).toBe('Grave');
    });
});

describe('Cálculo de Risco Mental', () => {
    it('deve retornar Ideal para pontuação 0', () => {
        const answers = [0, 0];
        const result = calculateMentalRiskScore(answers);
        expect(result.total).toBe(0);
        expect(result.level).toBe('Ideal');
    });

    it('deve retornar Leve para pontuação entre 1 e 9', () => {
        const answers = [1, 1, 1]; // Total 3
        const result = calculateMentalRiskScore(answers);
        expect(result.total).toBe(3);
        expect(result.level).toBe('Leve');
    });
    
    it('deve retornar Moderado para pontuação entre 10 e 20', () => {
        const answers = Array(10).fill(1); // 10 Sim
        const result = calculateMentalRiskScore(answers);
        expect(result.total).toBe(10);
        // Nota: Código diz <=9 Leve, <=20 Moderado. Então 10 é Moderado.
        expect(result.level).toBe('Moderado'); 
    });
});
