/**
 * Removes all underscores from strings and formats into clean Title Case.
 * Enforces strict compliance with the user prompt rule: "don't use underscore between words in frontend"
 */
export const formatText = (str) => {
  if (!str) return '';
  if (typeof str !== 'string') return String(str);
  
  // Replace underscores with spaces
  const cleanStr = str.replace(/_/g, ' ');
  
  // Capitalize words cleanly
  return cleanStr
    .split(' ')
    .map(word => {
      if (!word) return '';
      // Retain uppercase acronyms like DPIIT, AI, OPD, KPI, SMS, IoT, IT
      if (['DPIIT', 'AI', 'OPD', 'KPI', 'SMS', 'IOT', 'IT', 'ISO', 'MERN'].includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
};
