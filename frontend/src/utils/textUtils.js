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

/**
 * Validates if a user account is authorized to access the Governance Audit Trail.
 * Restricted strictly to Government Admin and Platform / Super Admin roles.
 */
export const isAuditAdmin = (user) => {
  if (!user) return false;
  const role = (user.role || user.roleName || '').toLowerCase().trim();
  const email = (user.email || '').toLowerCase().trim();
  
  return (
    role === 'government admin' ||
    role === 'super admin' ||
    role === 'platform admin' ||
    email.startsWith('govtadmin') ||
    email.startsWith('superadmin') ||
    (role.includes('admin') && !role.includes('startup'))
  );
};
