const Button = ({ href, onClick, children, variant = 'primary', className = '', target }) => {
  const base = 'inline-block px-4 py-2 rounded-xl font-semibold transition border focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles = variant === 'primary'
    ? 'bg-emerald-700 text-white hover:brightness-95 focus:ring-emerald-700'
    : 'bg-white text-emerald-700  border-emerald-600 hover:bg-emerald-50 focus:ring-emerald-600';
  return href ? (
    <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className={`${base} ${styles} ${className}`}>{children}</a>
  ) : (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>
  );
};

export default Button;