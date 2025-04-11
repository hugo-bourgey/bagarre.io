// Afficher l'indicateur de dégâts au-dessus du joueur
function showDamageIndicator(player, amount, canvas) {
    const damageElem = document.createElement('div');
    damageElem.className = 'damage-indicator';
    damageElem.textContent = '-' + amount;
    
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + player.x + player.width / 2;
    const y = rect.top + player.y;
    
    damageElem.style.left = x + 'px';
    damageElem.style.top = y + 'px';
    
    document.body.appendChild(damageElem);
    
    setTimeout(() => {
      document.body.removeChild(damageElem);
    }, 1000);
  }
  
  // Mettre à jour la barre de vie d'un joueur
  function updateHealthBar(playerId, health) {
    // Mise à jour visuelle de la barre de vie
    const healthBar = document.getElementById('health' + playerId);
    const healthText = document.getElementById('health-text-' + playerId);
    
    if (healthBar && healthText) {
      // Forcer la mise à jour immédiate en supprimant la transition
      healthBar.style.transition = 'none';
      // Appliquer la nouvelle largeur
      healthBar.style.width = health + '%';
      // Réactiver la transition après un court délai
      setTimeout(() => {
        healthBar.style.transition = 'width 0.1s linear';
      }, 10);
      
      // Mettre à jour le texte de la barre de vie
      healthText.textContent = `${health}/100`;
      
      // Changer la couleur de la barre de vie en fonction de la santé
      if (health > 70) {
        healthBar.style.background = 'limegreen';
      } else if (health > 30) {
        healthBar.style.background = 'yellow';
      } else {
        healthBar.style.background = 'red';
      }
      
      console.log(`Barre de vie du joueur ${playerId} mise à jour: ${health}%`);
    } else {
      console.error(`Élément de barre de vie non trouvé pour le joueur ${playerId}`);
    }
  }
  
  // Afficher le message de victoire
  function showWinner(player1, player2) {
    const winner = player1.health <= 0 ? 'Joueur 2 gagne !' : 'Joueur 1 gagne !';
    document.getElementById('winner').textContent = winner;
    document.getElementById('winner').style.color = player1.health <= 0 ? 'orange' : 'cyan';
    document.getElementById('resetButton').style.display = 'inline-block';
  }
  
  // Réinitialiser l'interface pour une nouvelle partie
  function resetUI() {
    document.getElementById('winner').textContent = '';
    document.getElementById('resetButton').style.display = 'none';
  }