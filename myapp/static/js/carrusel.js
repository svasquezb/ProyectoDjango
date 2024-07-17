document.addEventListener('DOMContentLoaded', function() {
    const carouselGames = document.getElementById('carouselGames');
    const carouselInner = carouselGames.querySelector('.carousel-inner');
    const carouselIndicators = carouselGames.querySelector('.carousel-indicators');
  
    fetch('https://api.rawg.io/api/games?key=d03f6e1112694da0bcc1dd1bd019343b&dates=2019-01-01,2019-12-31&ordering=-rating&page_size=5')
      .then(response => response.json())
      .then(data => {
        const games = data.results;
  
        // Generar los indicadores del carrusel
        games.forEach((game, index) => {
          const indicator = document.createElement('li');
          indicator.setAttribute('data-target', '#carouselGames');
          indicator.setAttribute('data-slide-to', index);
          if (index === 0) {
            indicator.classList.add('active');
          }
          carouselIndicators.appendChild(indicator);
        });
  
        // Generar los elementos del carrusel
        games.forEach((game, index) => {
          const carouselItem = document.createElement('div');
          carouselItem.classList.add('carousel-item');
          if (index === 0) {
            carouselItem.classList.add('active');
          }
          carouselItem.innerHTML = `
            <a href="productos.html?game=${encodeURIComponent(game.name)}">
              <img src="${game.background_image}" alt="${game.name}">
              <div class="carousel-caption">
                <h3>${game.name}</h3>
              </div>
            </a>
          `;
          carouselInner.appendChild(carouselItem);
        });
      })
      .catch(error => {
        console.error('Error al obtener los juegos:', error);
      });
  });