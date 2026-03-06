import React, { useState } from 'react'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`bg-foreground/5 border border-foreground/10 flex items-center justify-center ${className ?? ''}`}
      style={style}
    >
      <span className="text-xs font-mono tracking-widest uppercase text-foreground/20">
        Image
      </span>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={() => setDidError(true)} />
  )
}
