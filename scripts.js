document.addEventListener("DOMContentLoaded", function() {
    const girl = document.querySelector('.dancing-girl');
    let posX = 0;
    let posY = 0;
    let directionX = 1;
    let directionY = 1;
    const speed = 2;

    function moveGirl() {
        const maxX = window.innerWidth - girl.offsetWidth;
        const maxY = window.innerHeight - girl.offsetHeight;

        posX += directionX * speed;
        posY += directionY * speed;

        if (posX <= 0 || posX >= maxX) {
            directionX *= -1;
        }
        if (posY <= 0 || posY >= maxY) {
            directionY *= -1;
        }

        girl.style.left = posX + 'px';
        girl.style.top = posY + 'px';

        requestAnimationFrame(moveGirl);
    }

    moveGirl();
});
