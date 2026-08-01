import { ImageUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from '@/components/ui/index.js';

const OUTPUT_WIDTH = 1600;
const OUTPUT_HEIGHT = 900;

const readImageSize = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export function BlogImageCropModal({ open, imageSrc, fileName, onClose, onApply, loading }) {
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const dragRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!imageSrc) return undefined;

    let active = true;
    readImageSize(imageSrc).then((image) => {
      if (!active) return;
      imageRef.current = image;
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
      setOffset({ x: 0, y: 0 });
      setZoom(1);
    });

    return () => {
      active = false;
    };
  }, [imageSrc]);

  const getRenderedImage = () => {
    const frame = frameRef.current?.getBoundingClientRect();

    if (!frame) {
      return null;
    }

    const baseScale = Math.max(frame.width / imageSize.width, frame.height / imageSize.height);
    const scale = baseScale * zoom;
    const width = imageSize.width * scale;
    const height = imageSize.height * scale;

    return { frame, scale, width, height };
  };

  const handlePointerDown = (event) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setOffset({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    });
  };

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  const handleApply = async () => {
    const rendered = getRenderedImage();
    const sourceImage = imageRef.current;

    if (!rendered || !sourceImage) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;

    const context = canvas.getContext('2d');
    context.fillStyle = '#02100d';
    context.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

    const outputScaleX = OUTPUT_WIDTH / rendered.frame.width;
    const outputScaleY = OUTPUT_HEIGHT / rendered.frame.height;
    const drawWidth = rendered.width * outputScaleX;
    const drawHeight = rendered.height * outputScaleY;
    const drawX = (rendered.frame.width / 2 + offset.x - rendered.width / 2) * outputScaleX;
    const drawY = (rendered.frame.height / 2 + offset.y - rendered.height / 2) * outputScaleY;

    context.drawImage(sourceImage, drawX, drawY, drawWidth, drawHeight);
    await onApply({
      image: canvas.toDataURL('image/webp', 0.86),
      fileName,
    });
  };

  const rendered = getRenderedImage();

  return (
    <Modal
      open={open}
      title="Crop Blog Image"
      description="Drag to position the image. Zoom below 1x to pull the image back inside the frame."
      onClose={loading ? undefined : onClose}
      size="xl"
      className="blog-crop-modal"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button loading={loading} leftIcon={<ImageUp className="h-4 w-4" />} onClick={handleApply}>
            Use Image
          </Button>
        </>
      }
    >
      <div className="blog-cropper">
        <div
          ref={frameRef}
          className="blog-cropper-frame"
          role="presentation"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {imageSrc && rendered && (
            <img
              src={imageSrc}
              alt=""
              draggable="false"
              style={{
                width: `${rendered.width}px`,
                height: `${rendered.height}px`,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
          )}
          <div className="blog-cropper-grid" aria-hidden="true" />
        </div>

        <label className="blog-cropper-control" htmlFor="blog-image-zoom">
          <span>Zoom</span>
          <input
            id="blog-image-zoom"
            type="range"
            min="0.35"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <strong>{Math.round(zoom * 100)}%</strong>
        </label>
      </div>
    </Modal>
  );
}
