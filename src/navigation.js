export function getStepPresentation(step, totalSteps) {
    const progress = Math.round(((step - 1) / (totalSteps - 1)) * 100);

    return {
        showPrevious: step > 1,
        showNavigation: step < totalSteps,
        nextLabel: step === totalSteps - 1 ? 'Ver resultados' : 'Continuar',
        progress,
    };
}
