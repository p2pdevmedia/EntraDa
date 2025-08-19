import { useState, useEffect } from 'react';

interface EventSliderProps {
  images: string[];
}

export default function EventSlider({ images }: EventSliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-64 overflow-hidden mb-4">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
}
