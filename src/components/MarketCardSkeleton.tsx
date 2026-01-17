export function MarketCardSkeleton() {
  return (
    <div className="flex gap-3 md:gap-4 py-3 md:py-4" style={{ borderBottom: '1px solid #e0ded8', alignItems: 'flex-start' }}>
      {/* Thumbnail skeleton - Responsive */}
      <div className="flex-shrink-0">
        <div
          className="animate-pulse w-20 h-20 md:w-24 md:h-24"
          style={{ borderRadius: '4px', backgroundColor: '#f5f3ef', border: '1px solid #d4d4d4' }}
        />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
        {/* Title skeleton - 3 lines with truncation */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
          <div className="h-4 w-5/6 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
          <div className="h-4 w-4/6 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-3 w-20 animate-pulse" style={{ backgroundColor: '#f5f3ef', borderRadius: '2px' }} />
          <div className="h-3 w-16 animate-pulse" style={{ backgroundColor: '#f5f3ef', borderRadius: '2px' }} />
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-2">
          <div className="h-9 md:h-10 w-20 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
          <div className="h-9 md:h-10 w-20 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-start" style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '2rem' }}>
      {/* Left: Text Content */}
      <div className="flex-1 space-y-4 md:space-y-5">
        {/* Badge skeleton */}
        <div className="h-7 w-28 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />

        {/* Title skeleton - Responsive */}
        <div className="space-y-2">
          <div className="h-8 md:h-10 w-full animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
          <div className="h-8 md:h-10 w-5/6 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
          <div className="h-8 md:h-10 w-4/6 animate-pulse hidden md:block" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 md:gap-3">
          <div className="h-4 w-20 animate-pulse" style={{ backgroundColor: '#f5f3ef', borderRadius: '2px' }} />
          <div className="h-4 w-16 animate-pulse" style={{ backgroundColor: '#f5f3ef', borderRadius: '2px' }} />
          <div className="h-4 w-24 animate-pulse hidden sm:block" style={{ backgroundColor: '#f5f3ef', borderRadius: '2px' }} />
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <div className="h-11 md:h-12 flex-1 md:flex-none md:w-32 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
          <div className="h-11 md:h-12 flex-1 md:flex-none md:w-32 animate-pulse" style={{ backgroundColor: '#e8e4dc', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Right: Image skeleton - Responsive */}
      <div className="flex-shrink-0 mx-auto md:mx-0">
        <div
          className="animate-pulse w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
          style={{ borderRadius: '4px', backgroundColor: '#f5f3ef', border: '1px solid #d4d4d4' }}
        />
      </div>
    </section>
  );
}
