import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '0.25rem',
  style = {},
  className = ''
}) => (
  <div 
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius,
      display: 'block',
      ...style
    }}
  />
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        width={i === lines - 1 ? '70%' : '100%'} 
        height="0.875rem" 
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <Skeleton width={40} height={40} borderRadius="0.5rem" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="1rem" />
        <Skeleton width="40%" height="0.75rem" style={{ marginTop: '0.25rem' }} />
      </div>
    </div>
    <div style={{ marginTop: '0.75rem' }}>
      <SkeletonText lines={2} />
    </div>
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton width={size} height={size} borderRadius="50%" />
);

export const SkeletonRepoGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Skeleton;
