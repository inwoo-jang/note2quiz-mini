interface Props {
  size?: number;
  spinning?: boolean;
}

export default function Acorn({ size = 32, spinning = false }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={spinning ? 'animate-spin' : ''}
      style={spinning ? { animationDuration: '2.5s' } : undefined}
    >
      <ellipse cx="32" cy="38" rx="14" ry="18" fill="#1A1A1A" />
      <path d="M18 24 Q32 16 46 24 L44 30 Q32 24 20 30 Z" fill="#FF6B35" />
      <rect x="30" y="11" width="4" height="7" rx="1" fill="#1A1A1A" />
    </svg>
  );
}
