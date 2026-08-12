/** Tiny classnames helper — joins truthy class strings. */
export const clsx = (...parts) => parts.filter(Boolean).join(' ');
export default clsx;
