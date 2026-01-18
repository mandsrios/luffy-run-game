const luffy = document.querySelector('.luffy');
const gameover = document.querySelector('.game-over-message');
const restartButton = document.querySelector('.restart-button');

let loop;
let spawnInterval;
let obstacles = [];
const obstacleImages = ['./imagens/agua.png', './imagens/aguamenor.png', './imagens/nuvemchuva.png'];
const gameBoard = document.querySelector('.game-board');

//Criar para o Luffy pular sempre que for pressionado uma tecla
const jump = () => {
    luffy.classList.add('jump');
    setTimeout(() => {
        luffy.classList.remove('jump');
    }, 500);
}

//Função para criar obstáculo
const createObstacle = () => {
    const obstacle = document.createElement('img');
    const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    obstacle.src = randomImage;
    obstacle.className = 'obstacle';

    // Se for nuvem de chuva, adicionar classe especial
    if (randomImage.includes('nuvemchuva')) {
        obstacle.classList.add('cloud');
    }

    gameBoard.appendChild(obstacle);
    obstacles.push(obstacle);

    // Remover obstáculo após a animação
    setTimeout(() => {
        if (obstacle.parentNode) {
            obstacle.parentNode.removeChild(obstacle);
            obstacles = obstacles.filter(obs => obs !== obstacle);
        }
    }, 2000);
}

//Função para reiniciar o jogo
const restartGame = () => {
    //Reset Luffy
    luffy.src = './imagens/luffy.gif';
    luffy.style.marginLeft = '';
    luffy.style.rotate = '';
    luffy.style.bottom = '0px';

    //Remover todos os obstáculos existentes
    obstacles.forEach(obstacle => {
        if (obstacle.parentNode) {
            obstacle.parentNode.removeChild(obstacle);
        }
    });
    obstacles = [];

    //Esconder mensagens de game over
    gameover.style.display = 'none';
    restartButton.style.display = 'none';

    //Reiniciar o loop do jogo
    loop = setInterval(() => {
        const luffyPosition = +window.getComputedStyle(luffy).bottom.replace('px', '');

        // Verificar colisão com todos os obstáculos
        obstacles.forEach(obstacle => {
            const obstaclePosition = obstacle.offsetLeft;
            const isCloud = obstacle.classList.contains('cloud');

            // Para nuvens de chuva, colisão acontece quando o personagem pular (altura > 150)
            // Para obstáculos terrestres, colisão acontece quando o personagem estiver no chão
            let collisionCondition = false;

            if (isCloud) {
                // Nuvem: colisão sempre que encostar
                collisionCondition = (obstaclePosition <= 100 && obstaclePosition > 0 && luffyPosition > 150);
            } else {
                // Obstáculos terrestres: colisão se o personagem estiver no chão
                collisionCondition = (obstaclePosition <= 130 && obstaclePosition > 0 && luffyPosition < 80);
            }

            if (collisionCondition) {
                // Parar todos os obstáculos
                obstacles.forEach(obs => {
                    obs.style.animation = 'none';
                    obs.style.left = `${obs.offsetLeft}px`;
                });

                luffy.src = './imagens/gameover.png';
                //if (!isCloud) {
                //    obstacle.src = './imagens/gameoveragua.png';
                //}

                gameover.src = './imagens/gameoverfundo.png';
                gameover.style.display = 'block';
                restartButton.style.display = 'block';

                luffy.style.marginLeft = '50px'
                luffy.style.rotate = "-25deg"
                if (!isCloud) {
                    obstacle.style.width = '150px'
                }

                clearInterval(loop);
                clearInterval(spawnInterval);
            }
        });
    }, 10);

    // Iniciar spawn de obstáculos
    spawnInterval = setInterval(createObstacle, 1500 + Math.random() * 1000);
}

//Reiniciar o jogo
restartGame();

//Adicionar evento de clique ao botão de reiniciar
restartButton.addEventListener('click', restartGame);

//criando evento de teclado que dispara no momento em que uma tecla for pressionada
document.addEventListener('keydown', jump);
