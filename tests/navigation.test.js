import { describe, expect, it, vi } from 'vitest';
import { getStepPresentation, goToPreviousStep } from '../src/navigation.js';

describe('navegação do questionário', () => {
    it('configura a etapa anterior ao resultado', () => {
        expect(getStepPresentation(3, 4)).toEqual({
            showPrevious: true,
            showNavigation: true,
            nextLabel: 'Ver resultados',
            progress: 67,
        });
    });

    it('oculta a navegação no resultado', () => {
        expect(getStepPresentation(4, 4)).toMatchObject({
            showPrevious: true,
            showNavigation: false,
            progress: 100,
        });
    });

    it('renderiza a etapa anterior ao voltar', () => {
        const renderStep = vi.fn();

        const step = goToPreviousStep(3, 4, renderStep);

        expect(step).toBe(2);
        expect(renderStep).toHaveBeenCalledWith(2, 4);
    });
});
