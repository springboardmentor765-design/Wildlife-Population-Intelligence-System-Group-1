export default function Logo({ size = 40, className = "" }) {
  return (
    <img
      src="/wildlife-logo.png"
      alt="Wildlife Intelligence"
      width={size}
      height={size}
      className={`rounded-full object-cover shadow-lg ${className}`}
    />
  );
}
