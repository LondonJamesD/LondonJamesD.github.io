document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.square-card');
    
    cards.forEach(card => {
        let randomHue;
        
        const isBlue = Math.random() > 0.3;
        
        if (isBlue) {
            randomHue = Math.floor(Math.random() * 40) + 195;
        } else {
            randomHue = Math.floor(Math.random() * 30) + 5;
        }
        
        const bgColor = `hsl(${randomHue}, 50%, 50%)`;
        
        card.style.backgroundColor = bgColor;
        card.style.color = "#ffffff"; 
    });
});