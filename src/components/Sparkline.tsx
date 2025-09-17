import React from 'react';

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  showMarkers?: boolean;
  showTooltip?: boolean;
  labels?: string[];
  responsive?: boolean;
  area?: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({
  values,
  width = 200,
  height = 60,
  stroke = '#38bdf8',
  strokeWidth = 2,
  fill = 'none',
  showMarkers = true,
  showTooltip = true,
  labels,
  responsive = true,
  area = false,
}) => {
  if (!values || values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const stepX = width / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const [hover, setHover] = React.useState<{ x: number; y: number; value: number; label?: string } | null>(null);
  const handleMouse = (evt: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip) return;
    const rect = (evt.target as SVGElement).closest('svg')!.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const idx = Math.min(values.length - 1, Math.max(0, Math.round(x / stepX)));
    const vx = idx * stepX;
    const vy = height - ((values[idx] - min) / range) * height;
    setHover({ x: vx, y: vy, value: values[idx], label: labels?.[idx] });
  };
  const clearHover = () => setHover(null);

  const svgProps = {
    width: responsive ? '100%' as const : width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'trend chart',
    onMouseMove: handleMouse,
    onMouseLeave: clearHover,
  };

  return (
    <svg {...svgProps}>
      {area && (
        <polyline points={`0,${height} ${points} ${width},${height}`} fill={fill !== 'none' ? fill : '#ffffff10'} stroke="none" />
      )}
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {showMarkers && values.map((v, i) => {
        const cx = i * stepX;
        const cy = height - ((v - min) / range) * height;
        return <circle key={i} cx={cx} cy={cy} r={1.8} fill={stroke} />
      })}
      {hover && (
        <g>
          <line x1={hover.x} y1={0} x2={hover.x} y2={height} stroke="#9ca3af" strokeDasharray="3 3" />
          <circle cx={hover.x} cy={hover.y} r={3} fill="#fbbf24" stroke="#111827" />
          <rect x={Math.min(Math.max(0, hover.x + 6), width - 96)} y={Math.max(0, hover.y - 30)} width={90} height={22} rx={4} ry={4} fill="#111827" stroke="#374151" />
          <text x={Math.min(Math.max(0, hover.x + 48), width - 48)} y={Math.max(12, hover.y - 16)} textAnchor="middle" className="fill-white text-[10px]">
            {hover.value}{hover.label ? ` • ${hover.label}` : ''}
          </text>
        </g>
      )}
    </svg>
  );
};

export default Sparkline;


