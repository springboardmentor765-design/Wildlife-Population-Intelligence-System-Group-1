export default function Avatar({ user, size = 40, className = "" }) {
  const url = user?.avatar_url || null;
  const letter = (user?.name || "U").charAt(0).toUpperCase();
  const style = { width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.38)) };

  if (url) {
    return (
      <img
        src={url}
        alt={user?.name || "Profile"}
        className={`rounded-full object-cover ${className}`}
        style={style}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center rounded-full bg-forest-500 font-bold text-white ${className}`}
      style={style}
    >
      {letter}
    </span>
  );
}
