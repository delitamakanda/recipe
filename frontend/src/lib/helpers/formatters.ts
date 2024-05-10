export const formatText = (text: string) => {
    const replacedText = text.replace(/_/g, " ");
    return replacedText.charAt(0).toUpperCase() + replacedText.slice(1);
}

export const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
