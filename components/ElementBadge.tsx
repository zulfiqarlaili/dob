const ELEMENT_CONFIG: Record<string, { emoji: string; colorVar: string; glowVar: string }> = {
  Fire: { emoji: '🔥', colorVar: 'var(--element-fire)', glowVar: 'var(--element-fire-glow)' },
  Water: { emoji: '💧', colorVar: 'var(--element-water)', glowVar: 'var(--element-water-glow)' },
  Earth: { emoji: '🌍', colorVar: 'var(--element-earth)', glowVar: 'var(--element-earth-glow)' },
  Metal: { emoji: '⚔️', colorVar: 'var(--element-metal)', glowVar: 'var(--element-metal-glow)' },
  Wood: { emoji: '🌿', colorVar: 'var(--element-wood)', glowVar: 'var(--element-wood-glow)' },
};

type ElementBadgeProps = {
  name: string;
  count?: number;
  size?: 'sm' | 'lg';
};

export default function ElementBadge({ name, count, size = 'sm' }: ElementBadgeProps) {
  const config = ELEMENT_CONFIG[name] || {
    emoji: '✨',
    colorVar: 'var(--primary-purple)',
    glowVar: 'var(--surface-glass)',
  };

  return (
    <span
      className={`element-badge ${size === 'lg' ? 'element-badge--lg' : ''}`}
      style={{
        '--element-color': config.colorVar,
        '--element-glow': config.glowVar,
      } as React.CSSProperties}
    >
      <span>{config.emoji}</span>
      <span>{name}</span>
      {count !== undefined && (
        <span style={{ opacity: 0.7 }}>· {count}</span>
      )}
    </span>
  );
}

export function getElementColor(name: string): string {
  return ELEMENT_CONFIG[name]?.colorVar || 'var(--primary-purple)';
}

export function getElementEmoji(name: string): string {
  return ELEMENT_CONFIG[name]?.emoji || '✨';
}
