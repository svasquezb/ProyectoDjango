let games = []; 

const gamesContainer = $('#games-list');

// Función para renderizar los juegos
function renderGames(gameData) {
  gamesContainer.empty(); // Vaciar el contenedor antes de agregar nuevos juegos

  gameData.forEach((game, index) => {
    const gameCard = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${game.foto}" class="card-img-top" alt="${game.nombre}">
          <div class="card-body">
            <h5 class="card-title">${game.nombre}</h5>
            <p class="card-text">${game.descripcion}</p>
            <p class="card-text"><strong>Precio: $${game.precio}</strong></p>
            <p class="card-text">Stock: ${game.stock}</p>
            <button type="button" class="btn btn-primary add-to-cart" data-id="${game.id}">Agregar al carrito</button> 
            <button type="button" class="btn btn-primary ver-detalles" data-toggle="modal" data-target="#gameModal" 
                    data-id="${game.id}" 
                    data-nombre="${game.nombre}" 
                    data-descripcion="${game.descripcion}" 
                    data-precio="${game.precio}"
                    data-foto="${game.foto}"
                    data-stock="${game.stock}">
              Ver detalles
            </button>
          </div>
        </div>
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
    window.location.href = '/login/';  // Asegúrate de que esta ruta sea correcta
    return;
  }

  $.ajax({
    url: `/agregar-al-carrito/${game.id}/`,
    method: 'POST',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    },
    success: function(response) {
      if(response.status === 'success') {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItem = cartItems.find(item => item.id === response.item_id);

        if (existingItem) {
          existingItem.cantidad++;
          existingItem.subtotal = existingItem.precio * existingItem.cantidad;
        } else {
          const newItem = {
            id: response.item_id,
            nombre: game.nombre,
            precio: parseFloat(game.precio), 
            imagen: game.foto,
            cantidad: 1,
            subtotal: parseFloat(game.precio)
          };
          cartItems.push(newItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartItemCount();
        $('#gameModal').modal('hide');  // Cierra el modal de detalles si está abierto
        $('#addToCartModal').modal('show');  // Muestra el modal de confirmación
      }
    },
    error: function(xhr) {
      console.error('Error al agregar al carrito:', xhr);
      alert('Hubo un error al agregar el producto al carrito. Por favor, inténtalo de nuevo.');
    }
  });
}

// Evento para agregar un producto al carro (desde la lista y desde el modal)
$(document).on('click', '.add-to-cart, #addToCartBtn', function() {
  const gameId = $(this).data('id');
  const game = games.find(game => game.id === gameId);
  if (game) {
    addToCart(game);
  } else {
    console.error('Juego no encontrado con ID:', gameId);
  }
});

// Evento para mostrar detalles del juego en el modal
$(document).on('click', '.ver-detalles', function() {
  const id = $(this).data('id');
  const nombre = $(this).data('nombre');
  const descripcion = $(this).data('descripcion');
  const precio = $(this).data('precio');
  const foto = $(this).data('foto');
  const stock = $(this).data('stock');
  
  $('#gameModalLabel').text(nombre);
  $('#gameModalDescription').text(descripcion);
  $('#gameModalImage').attr('src', foto);
  $('#gameModalPrice').text(precio);
  $('#gameModalStock').text(stock);
  
  $('#addToCartBtn').data('id', id);
});

// Función para actualizar el contador de items en el carrito
function updateCartItemCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const itemCount = cartItems.reduce((total, item) => total + item.cantidad, 0);
  $('#cartItemCount').text(itemCount);
}

// Obtener los juegos del backend de Django
fetch('/api/videojuegos/')
  .then(response => response.json())
  .then(data => {
    renderGames(data);
  })
  .catch(error => console.error('Error al obtener los juegos:', error));

// Cargar los items del carrito desde localStorage al iniciar
$(document).ready(function() {
  updateCartItemCount();
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}