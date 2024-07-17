// Obtener el ID del juego de la URL
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

// Función para mostrar los detalles del juego
function showGameDetails(game) {
    $('#game-name').text(game.name);
    $('#game-image').attr('src', game.background_image);
    $('#release-date').text(game.released);
    $('#genre').text(game.genres.map(genre => genre.name).join(', '));
  }

// Función para agregar el juego al carro
function addToCart(game) {
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (!loggedInUser) {
    alert('Debes iniciar sesión para agregar productos al carro');
    window.location.href = 'login.html';
    return;
  } else {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === game.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      const newItem = {
        id: game.id,
        name: game.name,
        price: game.rating,
        image: game.background_image,
        quantity: 1
      };
      cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('El juego se ha agregado al carro');
  }
}

// Obtener los detalles del juego de la API
fetch(`https://api.rawg.io/api/games/${gameId}?key=d03f6e1112694da0bcc1dd1bd019343b`)
  .then(response => response.json())
  .then(data => {
    showGameDetails(data);

    // Evento para agregar el juego al carro
    $('#add-to-cart').on('click', function() {
      addToCart(data);
    });
  })
  .catch(error => console.error('Error al obtener los detalles del juego:', error));