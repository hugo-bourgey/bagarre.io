// Fonction pour dessiner un cercle
function drawCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  // Fonction pour dessiner un rectangle
  function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  
  // Dessiner le sol
  function drawGround(ctx, canvas) {
    // Sol principal
    ctx.fillStyle = '#333';
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    
    // Lignes du sol
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, GROUND_Y);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    // Points aléatoires (petits détails)
    ctx.fillStyle = '#2a2a2a';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = GROUND_Y + Math.random() * (canvas.height - GROUND_Y);
      const size = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }