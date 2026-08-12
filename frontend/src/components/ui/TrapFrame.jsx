import { useState } from 'react';

export function TrapFrame({
  image,
  activeBox,
  className = '',
}) {

  const [loaded, setLoaded] = useState(false);

  const boxes = image?.boxes || [];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-black ${className}`}
    >

      <img
        src={image?.url}
        alt={image?.filename || 'Wildlife image'}
        className="absolute inset-0 h-full w-full object-cover"
        onLoad={() => setLoaded(true)}
      />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Loading image...
        </div>
      )}

      {loaded && boxes.map((box, index) => {

        /*
         * YOLO coordinates are based on the original image.
         * The image uses object-cover, so percentages are used
         * to make the boxes scale with the image.
         */

        const x = box.x1;
        const y = box.y1;
        const width = box.x2 - box.x1;
        const height = box.y2 - box.y1;

        return (
          <div
            key={box.id || index}
            className={`absolute border-2 ${
              activeBox === index
                ? 'border-white'
                : 'border-moss-400'
            }`}
            style={{
              left: `${(x / 927.62) * 100}%`,
              top: `${(y / 576) * 100}%`,
              width: `${(width / 927.62) * 100}%`,
              height: `${(height / 576) * 100}%`,
            }}
          >

            <div className="absolute left-0 top-0 -translate-y-full whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white">
              {box.common || 'Unknown'}
              {' '}
              {Math.round((box.confidence || 0) * 100)}%
            </div>

          </div>
        );
      })}

    </div>
  );
}