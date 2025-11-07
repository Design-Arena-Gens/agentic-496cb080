'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const generateVideo = async () => {
    setIsGenerating(true);
    setVideoUrl(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setIsGenerating(false);
    };

    mediaRecorder.start();

    // Animation timeline
    const fps = 30;
    const duration = 6000; // 6 seconds
    const totalFrames = (duration / 1000) * fps;
    let frame = 0;

    const animate = () => {
      if (frame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      const progress = frame / totalFrames;

      // Clear canvas
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road
      ctx.fillStyle = '#555';
      ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

      // Road lines
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 4;
      ctx.setLineDash([30, 20]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 100);
      ctx.lineTo(canvas.width, canvas.height - 100);
      ctx.stroke();
      ctx.setLineDash([]);

      // Scene 1: Girl on motorcycle (0-2s)
      if (progress < 0.33) {
        const girlX = 200 + (progress / 0.33) * 400;
        const girlY = canvas.height - 200;

        // Motorcycle
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.ellipse(girlX, girlY, 60, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(girlX - 30, girlY + 20, 15, 0, Math.PI * 2);
        ctx.arc(girlX + 30, girlY + 20, 15, 0, Math.PI * 2);
        ctx.fill();

        // Girl
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.arc(girlX, girlY - 40, 25, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(girlX - 20, girlY - 15, 40, 50);

        // Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Cô gái đang đi xe máy...', canvas.width / 2, 80);
      }

      // Scene 2: Falling (2-3s)
      else if (progress < 0.5) {
        const fallProgress = (progress - 0.33) / 0.17;
        const girlX = 600;
        const girlY = canvas.height - 200 + fallProgress * 50;
        const rotation = fallProgress * Math.PI / 4;

        ctx.save();
        ctx.translate(girlX, girlY);
        ctx.rotate(rotation);

        // Motorcycle falling
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.ellipse(0, 0, 60, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Girl falling
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.arc(-20, -40, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(-40, -15, 40, 50);

        ctx.restore();

        // Text
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ÔI! BỊ NGÃ!', canvas.width / 2, 80);
      }

      // Scene 3: On ground (3-4s)
      else if (progress < 0.67) {
        const girlX = 600;
        const girlY = canvas.height - 150;

        // Motorcycle on ground
        ctx.fillStyle = '#E74C3C';
        ctx.save();
        ctx.translate(girlX + 100, girlY);
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, 60, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Girl sitting on ground
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.arc(girlX, girlY - 20, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(girlX - 30, girlY, 60, 30);

        // Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Cô gái ngồi dậy...', canvas.width / 2, 80);
      }

      // Scene 4: Standing and speaking (4-6s)
      else {
        const girlX = 600;
        const girlY = canvas.height - 200;

        // Motorcycle on ground (background)
        ctx.fillStyle = '#E74C3C';
        ctx.save();
        ctx.translate(girlX + 150, canvas.height - 150);
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, 60, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Girl standing
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.arc(girlX, girlY - 60, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(girlX - 20, girlY - 35, 40, 60);

        // Arms up (relieved gesture)
        ctx.strokeStyle = '#FFD1DC';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(girlX - 20, girlY - 20);
        ctx.lineTo(girlX - 50, girlY - 40);
        ctx.moveTo(girlX + 20, girlY - 20);
        ctx.lineTo(girlX + 50, girlY - 40);
        ctx.stroke();

        // Speech bubble
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(girlX - 280, girlY - 200, 560, 120, 15);
        ctx.fill();
        ctx.stroke();

        // Speech bubble tail
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(girlX - 30, girlY - 80);
        ctx.lineTo(girlX - 10, girlY - 95);
        ctx.lineTo(girlX + 10, girlY - 80);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Text in speech bubble
        ctx.fillStyle = '#000';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('May quá, hôm qua vừa mua', girlX, girlY - 155);
        ctx.fillText('bảo hiểm của anh Vinh mama!', girlX, girlY - 105);

        // Top text
        ctx.fillStyle = '#2ECC71';
        ctx.font = 'bold 38px Arial';
        ctx.fillText('😊 AN TÂM VỚI BẢO HIỂM! 😊', canvas.width / 2, 70);
      }

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'bao-hiem-vinh-mama.webm';
    a.click();
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '48px',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🏍️ Video Bảo Hiểm Vinh Mama 🏍️
        </h1>

        <p style={{
          color: 'white',
          fontSize: '20px',
          marginBottom: '40px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          Cô gái bị ngã xe máy - May có bảo hiểm!
        </p>

        <canvas
          ref={canvasRef}
          style={{
            display: 'none'
          }}
        />

        {!videoUrl && (
          <button
            onClick={generateVideo}
            disabled={isGenerating}
            style={{
              padding: '20px 50px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              background: isGenerating ? '#95a5a6' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '50px',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: isGenerating ? 'scale(0.95)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
              }
            }}
          >
            {isGenerating ? '⏳ Đang tạo video...' : '🎬 Tạo Video'}
          </button>
        )}

        {isGenerating && (
          <div style={{
            marginTop: '30px',
            color: 'white',
            fontSize: '18px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid rgba(255,255,255,0.3)',
              borderTop: '5px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ marginTop: '15px' }}>Vui lòng đợi 6 giây...</p>
          </div>
        )}

        {videoUrl && (
          <div style={{
            marginTop: '40px',
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              color: '#333',
              marginBottom: '25px',
              fontSize: '32px'
            }}>
              ✅ Video đã hoàn thành!
            </h2>

            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              style={{
                width: '100%',
                maxWidth: '1280px',
                borderRadius: '15px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                marginBottom: '25px'
              }}
            />

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={downloadVideo}
                style={{
                  padding: '15px 40px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                💾 Tải Video
              </button>

              <button
                onClick={() => {
                  setVideoUrl(null);
                  setIsGenerating(false);
                }}
                style={{
                  padding: '15px 40px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                🔄 Tạo Video Mới
              </button>
            </div>

            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '10px',
              textAlign: 'left'
            }}>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>📝 Về video này:</h3>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>🎬 4 cảnh: Đi xe → Ngã xe → Ngồi dậy → Nói về bảo hiểm</li>
                <li>⏱️ Thời lượng: 6 giây</li>
                <li>🎨 Hoạt hình 2D được tạo bằng HTML5 Canvas</li>
                <li>💬 Nội dung: "May quá, hôm qua vừa mua bảo hiểm của anh Vinh mama!"</li>
              </ul>
            </div>
          </div>
        )}

        <div style={{
          marginTop: '50px',
          padding: '30px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '24px' }}>
            🎯 Cách sử dụng:
          </h3>
          <ol style={{
            color: 'white',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontSize: '18px'
          }}>
            <li>Nhấn nút "Tạo Video"</li>
            <li>Đợi 6 giây để video được tạo</li>
            <li>Xem video trực tiếp trên trình duyệt</li>
            <li>Tải xuống hoặc tạo video mới</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
