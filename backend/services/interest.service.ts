// Calculate monthly interest accrual for a debt
export const calculateMonthlyInterest = (
    currentBalance: number,
    annualInterestRate: number
): number => {
    const monthlyRate = annualInterestRate / 100 / 12
    return parseFloat((currentBalance * monthlyRate).toFixed(2))
}

// Apply interest to a debt's current balance
export const applyInterest = (
    currentBalance: number,
    annualInterestRate: number
): number => {
    const interest = calculateMonthlyInterest(currentBalance, annualInterestRate)
    return parseFloat((currentBalance + interest).toFixed(2))
}

// Calculate how many months until a debt is paid off
// given a fixed monthly payment
export const monthsUntilPaidOff = (
    currentBalance: number,
    annualInterestRate: number,
    monthlyPayment: number
): number => {
    if (monthlyPayment <= 0) return Infinity
    const monthlyRate = annualInterestRate / 100 / 12

    // If payment doesn't cover interest, never paid off
    if (monthlyPayment <= currentBalance * monthlyRate) return Infinity

    const months = Math.ceil(
        -Math.log(1 - (currentBalance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate)
    )
    
    return months
}