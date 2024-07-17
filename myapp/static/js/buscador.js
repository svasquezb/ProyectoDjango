function filterGames(games, searchTerm) {
    return games.filter(game => {
      const name = game.name.toLowerCase();
      const description = game.description_raw.toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || description.includes(term);
    });
  }
  
  let games = []; // Declarar la variable 'games' fuera de la función de renderizado
  
  // Función para renderizar los juegos
  function renderGames(gameData, filteredGames, searchTerm) {
    const filteredGamesContainer = $('#filtered-games-list');
    const allGamesContainer = $('#all-games-list');
  
    filteredGamesContainer.empty();
    allGamesContainer.empty();
  
    const gamesToRender = searchTerm ? filteredGames : gameData;
  
    gamesToRender.forEach((game, index) => {
      const gameCard = `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
            <div class="card-body">
              <h5 class="card-title">${game.name}</h5>
              <p class="card-text">Fecha de lanzamiento: ${game.released}</p>
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#gameModal${index}">Ver más</button>
            </div>
          </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="gameModal${index}" tabindex="-1" role="dialog" aria-labelledby="gameModalLabel${index}" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="gameModalLabel${index}">${game.name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-4">
                    <img src="${game.background_image}" class="img-fluid" alt="${game.name}">
                  </div>
                  <div class="col-md-8">
                    <p><strong>Descripción:</strong> ${game.description_raw}</p>
                    <p><strong>Fecha de lanzamiento:</strong> ${game.released}</p>
                    <p><strong>Rating:</strong> ${game.rating}</p>
                    <button type="button" class="btn btn-success add-to-cart" data-name="${game.name}">Agregar al carrito</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  
      if (searchTerm) {
        filteredGamesContainer.append(gameCard);
      } else {
        allGamesContainer.append(gameCard);
      }
    });
  
    games = gameData; // Asignar los datos de los juegos a la variable 'games'
  }
  
  // Función para agregar un producto al carro
  function addToCart(game) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.name === game.name);
  
    if (existingItem) {
      existingItem.quantity++;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      const newItem = {
        name: game.name,
        price: game.price,
        image: game.background_image,
        quantity: 1,
        subtotal: game.price // Asegurarse de que subtotal sea un número
      };
      cartItems.push(newItem);
    }
  
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
    // Mostrar el modal de confirmación
    $('#addToCartModal').modal('show');
  }
  
  // Evento para agregar un producto al carro
  $('#all-games-list, #filtered-games-list').on('click', '.add-to-cart', function() {
    const gameName = $(this).data('name');
    if (gameName) {
      const game = games.find(game => game.name === gameName);
      if (game) {
        addToCart(game);
      } else {
        console.error('Game not found with name:', gameName);
      }
    } else {
      console.error('Invalid game name');
    }
  });
  
  // Agregar un event listener para el botón de búsqueda
  $('#search-btn').on('click', function() {
    const searchTerm = $('#search-input').val().trim();
    fetch('https://api.rawg.io/api/games?key=d03f6e1112694da0bcc1dd1bd019343b&dates=2019-09-01,2019-09-30&platforms=18,1,7')
      .then(response => response.json())
      .then(data => {
        const games = data.results;
        const filteredGames = filterGames(games, searchTerm);
        renderGames(games, filteredGames, searchTerm);
      })
      .catch(error => console.error('Error al obtener los juegos:', error));
  });                                                           