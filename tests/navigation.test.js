import { describe, expect, it } from 'vitest';
import { getStepPresentation } from '../src/navigation.js';

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
});
