import React, { useState, useRef, useEffect } from 'react';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number; // width / height
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
  fileName: string;
}

export default function ImageCropper({ imageSrc, aspectRatio, onCrop, onCancel, fileName }: ImageCropperProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeRatio, setActiveRatio] = useState(aspectRatio);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scale and offset when imageSrc changes
  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  // Reset scale and offset when activeRatio changes
  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [activeRatio]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for mobile/tablet editing
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { 
        x: e.touches[0].clientX - offset.x, 
        y: e.touches[0].clientY - offset.y 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y
    });
  };

  const handleCrop = () => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport cutout sizing
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Output high-resolution dimension settings
    const targetWidth = 900;
    const targetHeight = targetWidth / activeRatio;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Calculate crop window limits
    let cropBoxWidth = containerWidth * 0.8;
    let cropBoxHeight = cropBoxWidth / activeRatio;
    if (cropBoxHeight > containerHeight * 0.8) {
      cropBoxHeight = containerHeight * 0.8;
      cropBoxWidth = cropBoxHeight * activeRatio;
    }

    const cropBoxX = (containerWidth - cropBoxWidth) / 2;
    const cropBoxY = (containerHeight - cropBoxHeight) / 2;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Calculate rendering scale of image in container
    const renderScale = Math.min(containerWidth / imgWidth, containerHeight / imgHeight) * 0.8;
    const initialRenderWidth = imgWidth * renderScale;
    const initialRenderHeight = imgHeight * renderScale;

    const currentRenderWidth = initialRenderWidth * scale;
    const currentRenderHeight = initialRenderHeight * scale;

    const imgCenterX = containerWidth / 2 + offset.x;
    const imgCenterY = containerHeight / 2 + offset.y;

    const imgRenderX = imgCenterX - currentRenderWidth / 2;
    const imgRenderY = imgCenterY - currentRenderHeight / 2;

    const relativeX = cropBoxX - imgRenderX;
    const relativeY = cropBoxY - imgRenderY;

    // Convert coordinates back to source size mapping
    const sourceX = (relativeX / currentRenderWidth) * imgWidth;
    const sourceY = (relativeY / currentRenderHeight) * imgHeight;
    const sourceWidth = (cropBoxWidth / currentRenderWidth) * imgWidth;
    const sourceHeight = (cropBoxHeight / currentRenderHeight) * imgHeight;

    // Render cropped details on background canvas
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Convert canvas image into file blob
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], fileName || 'cropped-image.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        onCrop(croppedFile);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl flex flex-col gap-5">
        <div>
          <h3 className="text-base font-serif font-bold text-gray-900">Adjust Photo Crop</h3>
          <p className="text-[11px] text-gray-500 mt-1">Drag the image to position it. Use the slider below to zoom in/out.</p>
        </div>

        {/* Viewport container */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-square bg-gray-950 rounded-2xl overflow-hidden cursor-move touch-none flex items-center justify-center select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="To crop"
            className="pointer-events-none max-w-none select-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              width: '85%',
              height: 'auto',
              maxHeight: '85%',
              objectFit: 'contain'
            }}
          />

          {/* Transparent dark mask with crop bounding box cutout */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            <div className="w-full bg-black/60 flex-grow" />
            <div className="w-full flex">
              <div className="bg-black/60 flex-grow" />
              {/* Outer frame dashed border */}
              <div 
                className="border-2 border-white border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                style={{
                  width: '80%',
                  aspectRatio: `${activeRatio}`,
                  maxHeight: '80%'
                }}
              />
              <div className="bg-black/60 flex-grow" />
            </div>
            <div className="w-full bg-black/60 flex-grow" />
          </div>
        </div>

        {/* Aspect Ratio Presets */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#062B04]">Frame Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Portrait (3:4)', value: 3 / 4 },
              { label: 'Square (1:1)', value: 1 },
              { label: 'Landscape (16:9)', value: 16 / 9 },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setActiveRatio(opt.value)}
                className={`py-2 px-3 text-[10px] font-bold font-sans uppercase rounded-xl border transition-all cursor-pointer ${
                  Math.abs(activeRatio - opt.value) < 0.01
                    ? 'bg-[#062B04] border-[#062B04] text-white shadow-md font-black'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            <span>Zoom Out</span>
            <span>Zoom In</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.02"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#062B04]"
          />
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            className="px-4.5 py-2.5 bg-[#062B04] hover:bg-[#062B04]/90 text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
          >
            Crop & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
