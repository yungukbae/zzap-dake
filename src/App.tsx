import { useEffect, useRef, useState } from "react";

function App() {
  const [draw, setDraw] = useState(false);
  const [pos, setPos] = useState({ drawable: false, x: -1, y: -1 });
  const isRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    const ctx = isRef.current?.getContext("2d");
    if (!ctx) return () => {};

    img1.src = "https://capa.ai/static/services/one_stop.jpg";
    img2.src = "https://capa.ai/static/services/cutting.jpg";

    const pattern1 = ctx.createPattern(img1, "no-repeat");
    const pattern2 = ctx.createPattern(img2, "no-repeat");

    ctx.lineWidth = 80;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = pattern2 as CanvasPattern;
    if (!draw) {
      ctx.fillStyle = pattern1 as CanvasPattern;
      ctx.fillRect(0, 0, 1100, 1100);
      setDraw(true);
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
    <div className="App">
      <div style={{ width: "100%", height: "100%" }}>
        <canvas ref={isRef} width={"1100px"} height={"1100px"}></canvas>
      </div>
    </div>
  );
}

export default App;
