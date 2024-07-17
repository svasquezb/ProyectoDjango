let games = []; 
let cartItems = []; // Declaración única y global de cartItems

const gamesContainer = $('#games-list');

// Función para renderizar los juegos
function renderGames(gameData) {
  gamesContainer.empty(); // Vaciar el contenedor antes de agregar nuevos juegos

  gameData.forEach((game, index) => {
    const gameCard = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
          <div class="card-body">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text">Fecha de lanzamiento: ${game.released}</p>
            <button type="button" class="btn btn-primary add-to-cart" data-id="${game.id}">Agregar al carrito</button> 
            <button type="button" class="btn btn-primary" onclick="window.location.href='detalleJuego.html?id=${game.id}'">Ver más</button>
          </div>
        </div>
      </div>
      <div class="modal fade" id="gameModal${index}" tabindex="-1" ...>
        </div>
    `;
    gamesContainer.append(gameCard); // Agregar el juego al contenedor
  });

  games = gameData; // Almacenar los datos de los juegos en la variable global
}

// Función para agregar un producto al carro
function addToCart(game) {
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (!loggedInUser) {
    alert('Debes iniciar sesión para agregar productos al carro');
    window.location.href = 'login.html';
    return;
  }

  const existingItem = cartItems.find(item => item.name === game.name);

  if (existingItem) {
    existingItem.quantity++;
    existingItem.subtotal = existingItem.price * existingItem.quantity;
  } else {
    const newItem = {
      name: game.name,
      price: game.rating, // Asegúrate de que el precio sea correcto
      image: game.background_image,
      quantity: 1,
      subtotal: game.rating // Asegúrate de que el subtotal sea correcto
    };
    cartItems.push(newItem);
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartItemCount(); // Asegúrate de tener esta función definida

  $('#addToCartModal').modal('show'); // Si tienes un modal de confirmación
}

// Evento para agregar un producto al carro
gamesContainer.on('click', '.add-to-cart', function() {
  const gameId = $(this).data('id');
  const game = games.find(game => game.id === gameId);

  if (game) {
    addToCart(game);
  } else {
    console.error('Juego no encontrado con ID:', gameId);
  }
});

// Obtener los juegos de la API
fetch('https://api.rawg.io/api/games?key=d03f6e1112694da0bcc1dd1bd019343b&dates=2019-09-01,2019-09-30&platforms=18,1,7')
  .then(response => response.json())
  .then(data => {
    renderGames(data.results);
  })
  .catch(error => console.error('Error al obtener los juegos:', error));
