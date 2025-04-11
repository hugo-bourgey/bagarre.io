class Player {
    constructor(x, colors, leftKey, rightKey, attackKey, facing, playerId, ctx, canvas) {
      this.x = x;
      this.y = 200;
      this.width = 50;
      this.height = 60;
      this.colors = colors;
      this.health = 100;
      this.maxHealth = 100;
      this.leftKey = leftKey;
      this.rightKey = rightKey;
      this.attackKey = attackKey;
      this.attackCooldown = 0;
      this.isAttacking = false;
      this.facing = facing; // 'right' ou 'left'
      this.playerId = playerId;
      this.velocity = 0;
      this.maxVelocity = 8;
      this.acceleration = 1;
      this.friction = 0.8;
      this.hits = [];
      this.attackStrength = 10;
      this.lastHealth = this.health;
      this.isHit = false;
      this.hitTimer = 0;
      this.walkFrame = 0;
      this.walkTimer = 0;
      this.isWalking = false;
      this.blinkTimer = 0;
      this.isBlinking = false;
      this.idleTimer = 0;
      this.ctx = ctx;
      this.canvas = canvas;
      this.shadow = {
        x: this.x + this.width / 2,
        y: GROUND_Y,
        radius: this.width * 0.7
      };
    }
  
    draw() {
      this.ctx.save();
      
      // Ombre sous le personnage
      this.ctx.beginPath();
      this.ctx.ellipse(
        this.x + this.width / 2, 
        GROUND_Y, 
        this.width * 0.4, 
        10, 
        0, 0, Math.PI * 2
      );
      this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
      this.ctx.fill();
      
      // Effet quand touché
      if (this.isHit) {
        this.ctx.globalAlpha = Math.sin(this.hitTimer * 0.5) * 0.3 + 0.7;
      }
      
      // Déterminer les couleurs (normales ou touché)
      const mainColor = this.isHit ? '#ff6666' : this.colors.main;
      const secondaryColor = this.isHit ? '#ff4444' : this.colors.secondary;
      const highlightColor = this.isHit ? '#ff8888' : this.colors.highlight;
      
      // Jambes
      const legWidth = 12;
      const legHeight = 20;
      const legSpacing = 15;
      let leftLegX, rightLegX;
      
      if (this.isWalking) {
        // Animation des jambes pendant la marche
        const legMove = Math.sin(this.walkFrame) * 8;
        leftLegX = this.x + (this.width / 2) - legSpacing/2 - legWidth/2;
        rightLegX = this.x + (this.width / 2) + legSpacing/2 - legWidth/2;
        
        // Dessiner les jambes
        drawRect(this.ctx, leftLegX, this.y + this.height - legHeight + legMove, legWidth, legHeight, secondaryColor);
        drawRect(this.ctx, rightLegX, this.y + this.height - legHeight - legMove, legWidth, legHeight, secondaryColor);
      } else {
        // Jambes au repos
        leftLegX = this.x + (this.width / 2) - legSpacing/2 - legWidth/2;
        rightLegX = this.x + (this.width / 2) + legSpacing/2 - legWidth/2;
        drawRect(this.ctx, leftLegX, this.y + this.height - legHeight, legWidth, legHeight, secondaryColor);
        drawRect(this.ctx, rightLegX, this.y + this.height - legHeight, legWidth, legHeight, secondaryColor);
      }
      
      // Pieds
      const footWidth = 16;
      const footHeight = 6;
      drawRect(this.ctx, leftLegX - 2, this.y + this.height, footWidth, footHeight, secondaryColor);
      drawRect(this.ctx, rightLegX - 2, this.y + this.height, footWidth, footHeight, secondaryColor);
      
      // Corps
      drawRect(this.ctx, this.x, this.y, this.width, this.height - legHeight, mainColor);
      
      // Ceinture
      drawRect(this.ctx, this.x, this.y + (this.height - legHeight) - 8, this.width, 8, secondaryColor);
      
      // Tête
      const headSize = 40;
      const headX = this.x + this.width / 2;
      const headY = this.y - headSize/2 + 5;
      drawCircle(this.ctx, headX, headY, headSize/2, highlightColor);
      
      // Visage (dépend de la direction)
      const faceDirection = this.facing === 'right' ? 1 : -1;
      const eyeOffset = 7 * faceDirection;
      
      // Yeux
      const eyeY = headY - 5;
      const baseEyeX = headX + 2 * faceDirection;
      
      if (!this.isBlinking) {
        // Yeux ouverts
        drawCircle(this.ctx, baseEyeX - eyeOffset, eyeY, 4, 'white');
        drawCircle(this.ctx, baseEyeX + eyeOffset, eyeY, 4, 'white');
        
        const pupilOffset = Math.min(5, Math.abs(this.velocity)) * Math.sign(this.velocity) * 0.3;
        
        drawCircle(this.ctx, baseEyeX - eyeOffset + (2 * faceDirection) + pupilOffset, eyeY, 2, 'black');
        drawCircle(this.ctx, baseEyeX + eyeOffset + (2 * faceDirection) + pupilOffset, eyeY, 2, 'black');
      } else {
        // Yeux fermés (clignement)
        this.ctx.beginPath();
        this.ctx.moveTo(baseEyeX - eyeOffset - 4, eyeY);
        this.ctx.lineTo(baseEyeX - eyeOffset + 4, eyeY);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(baseEyeX + eyeOffset - 4, eyeY);
        this.ctx.lineTo(baseEyeX + eyeOffset + 4, eyeY);
        this.ctx.stroke();
      }
      
      // Sourcils (expression selon la santé)
      const browY = eyeY - 8;
      const browLength = 6;
      const healthRatio = this.health / this.maxHealth;
      const browAngle = (1 - healthRatio) * 0.5; // Plus la santé est basse, plus les sourcils sont froncés
      
      this.ctx.beginPath();
      this.ctx.moveTo(baseEyeX - eyeOffset - browLength, browY + browLength * browAngle);
      this.ctx.lineTo(baseEyeX - eyeOffset + browLength, browY - browLength * browAngle);
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(baseEyeX + eyeOffset - browLength, browY - browLength * browAngle);
      this.ctx.lineTo(baseEyeX + eyeOffset + browLength, browY + browLength * browAngle);
      this.ctx.stroke();
      
      // Bouche (expression selon la santé)
      const mouthY = headY + 5;
      const mouthWidth = 12;
      
      this.ctx.beginPath();
      if (healthRatio > 0.5) {
        // Sourire
        this.ctx.arc(headX, mouthY, mouthWidth, 0, Math.PI, false);
      } else if (healthRatio > 0.2) {
        // Neutre
        this.ctx.moveTo(headX - mouthWidth, mouthY);
        this.ctx.lineTo(headX + mouthWidth, mouthY);
      } else {
        // Triste
        this.ctx.arc(headX, mouthY + mouthWidth, mouthWidth, Math.PI, 0, false);
      }
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Bras
      const shoulderY = this.y + 15;
      const armWidth = this.isAttacking ? 30 : 15;
      const armHeight = 10;
      const armX = this.facing === 'right' ? this.x + this.width : this.x - armWidth;
      
      // Épaule
      drawCircle(
        this.ctx,
        this.facing === 'right' ? this.x + this.width : this.x,
        shoulderY, 
        8, 
        mainColor
      );
      
      // Bras
      drawRect(this.ctx, armX, shoulderY - armHeight/2, armWidth, armHeight, mainColor);
      
      // Poing
      drawCircle(
        this.ctx,
        this.facing === 'right' ? armX + armWidth : armX,
        shoulderY, 
        7, 
        highlightColor
      );
      
      // Zone de frappe (visualisation subtile)
      if (this.isAttacking) {
        this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
        const strikeX = this.facing === 'right' ? this.x + this.width : this.x - 40;
        this.ctx.fillRect(strikeX, this.y, 40, this.height);
        
        // Effet visuel de l'attaque
        const effectX = this.facing === 'right' ? this.x + this.width + 30 : this.x - 30;
        
        // Lignes d'impact
        this.ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 5; i++) {
          const angle = Math.random() * Math.PI;
          const length = 10 + Math.random() * 15;
          
          this.ctx.beginPath();
          this.ctx.moveTo(effectX, this.y + this.height/2);
          this.ctx.lineTo(
            effectX + Math.cos(angle) * length * (this.facing === 'right' ? 1 : -1),
            this.y + this.height/2 + Math.sin(angle) * length
          );
          this.ctx.stroke();
        }
        
        drawCircle(this.ctx, effectX, this.y + this.height/2, 10, 'rgba(255,255,255,0.5)');
      }
      
      this.ctx.restore();
      
      // Dessiner les indicateurs de dégâts
      this.hits.forEach((hit) => {
        this.ctx.fillStyle = `rgba(255,0,0,${hit.opacity})`;
        this.ctx.font = `bold ${hit.size}px Arial`;
        this.ctx.fillText('-' + hit.damage, hit.x, hit.y);
      });
    }
  
    move(direction) {
      const wasMoving = Math.abs(this.velocity) > 0.5;
      
      // Accélération avec inertie
      if (direction !== 0) {
        this.velocity += direction * this.acceleration;
        this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));
        this.facing = direction > 0 ? 'right' : 'left';
        this.isWalking = true;
      } else {
        // Friction quand aucune touche n'est pressée
        this.velocity *= this.friction;
        if (Math.abs(this.velocity) < 0.5) {
          this.isWalking = false;
        }
      }
      
      // Mouvement avec la vélocité
      if (Math.abs(this.velocity) > 0.1) {
        this.x += this.velocity;
        this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));
        
        // Mise à jour de l'animation de marche
        if (this.isWalking) {
          this.walkFrame += 0.2;
        }
      } else {
        this.velocity = 0;
      }
      
      // Mise à jour de l'ombre
      this.shadow.x = this.x + this.width / 2;
    }
  
    attack(opponent) {
      if (this.attackCooldown === 0) {
        this.isAttacking = true;
        this.attackCooldown = 30;
  
        const attackRange = 40;
        const attackStart = this.facing === 'right' ? this.x + this.width : this.x - attackRange;
        const inRange = (
          opponent.x + opponent.width > attackStart &&
          opponent.x < attackStart + attackRange &&
          Math.abs(this.y - opponent.y) < this.height
        );
  
        if (inRange) {
          const damage = this.attackStrength;
          opponent.health -= damage;
          opponent.health = Math.max(0, opponent.health);
          
          // Mettre à jour immédiatement la barre de vie
          updateHealthBar(opponent.playerId, opponent.health);
          
          // Effet de recul
          const knockback = this.facing === 'right' ? 15 : -15;
          opponent.velocity = knockback;
          
          // Marquer comme touché pour l'effet visuel
          opponent.isHit = true;
          opponent.hitTimer = 0;
          
          // Ajouter un indicateur de dégât
          opponent.hits.push({
            damage: damage, 
            x: opponent.x + opponent.width / 2,
            y: opponent.y - 10,
            color: 'red',
            size: 24,
            opacity: 1,
            time: 0
          });
          
          // Créer un élément DOM pour l'animation des dégâts
          showDamageIndicator(opponent, damage, this.canvas);
          
          console.log("Joueur " + opponent.playerId + " touché, santé restante: " + opponent.health);
        }
  
        setTimeout(() => {
          this.isAttacking = false;
        }, 150);
      }
    }
  
    update(deltaTime) {
      if (this.attackCooldown > 0) this.attackCooldown--;
      
      // Mettre à jour l'indicateur de coup
      if (this.isHit) {
        this.hitTimer += deltaTime;
        if (this.hitTimer > 300) {
          this.isHit = false;
        }
      }
      
      // Mettre à jour les indicateurs de dégâts
      for (let i = this.hits.length - 1; i >= 0; i--) {
        this.hits[i].time += deltaTime;
        this.hits[i].y -= 0.5 * deltaTime / 16;
        this.hits[i].opacity = 1 - (this.hits[i].time / 1000);
        
        if (this.hits[i].time > 1000) {
          this.hits.splice(i, 1);
        }
      }
      
      // Gestion du clignement des yeux
      this.blinkTimer += deltaTime;
      if (this.blinkTimer > 3000 + Math.random() * 5000) {
        this.isBlinking = true;
        setTimeout(() => {
          this.isBlinking = false;
          this.blinkTimer = 0;
        }, 150);
      }
      
      // Animation en idle
      this.idleTimer += deltaTime;
      if (this.idleTimer > 2000) {
        this.idleTimer = 0;
      }
      
      // Vérifier si la santé a changé et mettre à jour la barre
      if (this.lastHealth !== this.health) {
        this.lastHealth = this.health;
        updateHealthBar(this.playerId, this.health);
      }
    }
  
    reset() {
      this.health = 100;
      this.isHit = false;
      this.hits = [];
      this.lastHealth = 100;
      this.velocity = 0;
      
      // Réinitialiser à la position de départ
      this.x = this.playerId === 1 ? 100 : 650;
    }
  }