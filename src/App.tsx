import { useEffect, useRef, useState } from "react";
import { loadImage } from "./util/loadImg";

function App() {
  const [draw, setDraw] = useState(false);
  const [pos, setPos] = useState({ drawable: false, x: -1, y: -1 });
  const isRef = useRef<HTMLCanvasElement>(null);
  const pixRatio = window.devicePixelRatio ?? 1;
  const contWidth = window.innerWidth;
  const contHeight = window.innerHeight;
  const size = Math.max(contWidth, contHeight) / 8;
  const colParts = Math.round(contWidth / size);
  const numParts = colParts * Math.round(contHeight / size);
  console.log(numParts);
  useEffect(() => {
    const img1 = new Image(contWidth, contHeight);
    const img2 = new Image(contWidth, contHeight);
    let imageData: ImageData;
    img1.crossOrigin = "Anonymous";
    img2.crossOrigin = "Anonymous";
    const ctx = isRef.current?.getContext("2d");
    if (!ctx) return () => {};

    (async () =>
      await loadImage("https://capa.ai/static/services/cutting.jpg", img2))();
    const pattern2 = ctx.createPattern(img2, "no-repeat");

    ctx.lineWidth = 150;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = pattern2 as CanvasPattern;

    if (!draw) {
      (async () => {
        await loadImage("https://capa.ai/static/services/one_stop.jpg", img1);
        ctx.drawImage(img1, 0, 0, contWidth, contHeight);
        const imageData = ctx.getImageData(0, 0, contWidth, contHeight);
        ctx.putImageData(imageData, 0, 0);
        setDraw(true);
      })();
    }

    const handleUp = () => {
      setPos((va) => ({ ...va, drawable: false }));
    };

    const handleDown = (e: MouseEvent) => {
      const target = e as MouseEvent;
      ctx.beginPath();
      ctx.moveTo(target.offsetX, target.offsetY);
      setPos({ drawable: true, x: target.offsetX, y: target.offsetY });
    };

    const handleMove = (e: MouseEvent) => {
      const target = e as MouseEvent;
      if (pos.drawable) {
        ctx.lineTo(target.offsetX, target.offsetY);
        ctx.stroke();
        console.log(imageData);
      }
    };

    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [isRef, pos]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <canvas ref={isRef} width={contWidth} height={contHeight}></canvas>
    </div>
  );
}

export default App;
