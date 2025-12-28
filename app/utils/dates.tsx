export const formatDate = (value: string | Date): string => {
  const d = typeof value === 'string' ? new Date(value) : value;

  if (Number.isNaN(d.getTime())) return '';

  return d.toISOString().split('T')[0]; // YYYY-MM-DD
};
