// Initialisation du jeu
document.addEventListener('DOMContentLoaded', function() {
    initGame();
  });
  
  function initGame() {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    let gameActive = true;
    const resetButton = document.getElementById('resetButton');
    
    // Utiliser requestAnimationFrame pour une animation plus fluide
    let lastTime = 0;
  
    // Configuration des touches pour clavier AZERTY
    const keys = {};
    
    // Création des joueurs
    const player1 = new Player(100, COLORS.PLAYER1, 'q', 'd', 'z', 'right', 1, ctx, canvas);
    const player2 = new Player(650, COLORS.PLAYER2, 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'left', 2, ctx, canvas);
  
    function checkWinner() {
      if (player1.health <= 0 || player2.health <= 0) {
        showWinner(player1, player2);
        gameActive = false;
      }
    }
  
    function resetGame() {
      player1.reset();
      player2.reset();
        
      // Réinitialiser les barres de vie
      updateHealthBar(1, 100);
      updateHealthBar(2, 100);
      
      resetUI();
      gameActive = true;
      window.requestAnimationFrame(gameLoop);
    }
  
    function gameLoop(timestamp) {
      // Calcul du delta time pour des animations cohérentes
      const deltaTime = timestamp - lastTime || 0;
      lastTime = timestamp;
      
      if (!gameActive) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner le fond et le sol
      drawGround(ctx, canvas);
      
      // Traitement des entrées
      let direction1 = 0;
      let direction2 = 0;
      
      if (keys[player1.leftKey]) direction1 = -1;
      if (keys[player1.rightKey]) direction1 = 1;
      if (keys[player1.attackKey]) player1.attack(player2);
      
      if (keys[player2.leftKey]) direction2 = -1;
      if (keys[player2.rightKey]) direction2 = 1;
      if (keys[player2.attackKey]) player2.attack(player1);
      
      // Mouvement
      player1.move(direction1);
      player2.move(direction2);
      
      // Mise à jour
      player1.update(deltaTime);
      player2.update(deltaTime);
      
      // Dessin des joueurs
      player1.draw();
      player2.draw();
      
      // Vérification de la victoire
      checkWinner();
      
      // Continuer la boucle si le jeu est actif
      if (gameActive) {
        window.requestAnimationFrame(gameLoop);
      }
    }
  
    // Gestion des événements clavier
    document.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      // Empêcher le défilement de la page avec les flèches
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'z', 'q', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });
    
    // Événement du bouton de réinitialisation
    resetButton.addEventListener('click', resetGame);
  
    // Initialiser les barres de vie au démarrage
    updateHealthBar(1, player1.health);
    updateHealthBar(2, player2.health);
    console.log("Barres de vie initialisées");
    
    // Démarrer la boucle de jeu
    window.requestAnimationFrame(gameLoop);
  }