export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Salary not specified';
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getCompanyInitials(company: string): string {
  return company
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getCompanyColor(company: string): string {
  const colors = [
    'bg-blue-500', 'bg-violet-500', 'bg-pink-500', 'bg-orange-500',
    'bg-teal-500', 'bg-green-500', 'bg-red-500', 'bg-indigo-500',
  ];
  let hash = 0;
  for (const c of company) hash += c.charCodeAt(0);
  return colors[hash % colors.length];
}
