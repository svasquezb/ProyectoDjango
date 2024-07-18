document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filteredGamesList = document.getElementById('filtered-games-list');
    const allGamesList = document.getElementById('all-games-list');
    let games = [];

    // Función para obtener los videojuegos del servidor
    function fetchGames() {
        fetch('/api/videojuegos/')
            .then(response => response.json())
            .then(data => {
                games = data;
                renderGames(games, allGamesList);
            })
            .catch(error => console.error('Error al obtener los videojuegos:', error));
    }

    // Llamar a fetchGames cuando se carga la página
    fetchGames();

    // Función para filtrar videojuegos
    function filterGames(searchTerm) {
        return games.filter(game => 
            game.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Función para renderizar los videojuegos
    function renderGames(gameData, container) {
        container.innerHTML = '';
        gameData.forEach(game => {
            const gameElement = createGameElement(game);
            container.appendChild(gameElement);
        });
    }

    // Función para crear un elemento de videojuego
    function createGameElement(game) {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'col-md-4 mb-4';
        gameDiv.innerHTML = `
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
        `;
        return gameDiv;
    }

    // Event listener para el botón de búsqueda
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const filteredGames = filterGames(searchTerm);
            renderGames(filteredGames, filteredGamesList);
            allGamesList.style.display = 'none';
            filteredGamesList.style.display = 'flex';
        } else {
            filteredGamesList.innerHTML = '';
            filteredGamesList.style.display = 'none';
            allGamesList.style.display = 'flex';
        }
    });

    // Event listener para la tecla Enter en el campo de búsqueda
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Event delegation para los botones "Ver detalles" y "Agregar al carrito"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('ver-detalles')) {
            const game = games.find(g => g.id == e.target.dataset.id);
            if (game) {
                showGameModal(game);
            }
        } else if (e.target.classList.contains('add-to-cart')) {
            const game = games.find(g => g.id == e.target.dataset.id);
            if (game) {
                addToCart(game);
            }
        }
    });

    // Función para mostrar el modal con los detalles del videojuego
    function showGameModal(game) {
        document.getElementById('gameModalLabel').textContent = game.nombre;
        document.getElementById('gameModalImage').src = game.foto;
        document.getElementById('gameModalDescription').textContent = game.descripcion;
        document.getElementById('gameModalPrice').textContent = `$${game.precio}`;
        document.getElementById('gameModalStock').textContent = game.stock;
        document.querySelector('#gameModal .add-to-cart').dataset.id = game.id;
        $('#gameModal').modal('show');
    }

    // Función para agregar al carrito (reutilizando tu función existente)
    function addToCart(game) {
        const loggedInUser = localStorage.getItem('loggedInUser');

        if (!loggedInUser) {
            alert('Debes iniciar sesión para agregar productos al carro');
            window.location.href = '/login/';
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
                    $('#gameModal').modal('hide');
                    $('#addToCartModal').modal('show');
                }
            },
            error: function(xhr) {
                console.error('Error al agregar al carrito:', xhr);
                alert('Debe iniciar sesion para agregar productos al carrito. Por favor, inicie sesion.');
            }
        });
    }

    // Función para actualizar el contador de items en el carrito
    function updateCartItemCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemCount = cartItems.reduce((total, item) => total + item.cantidad, 0);
        document.getElementById('cartItemCount').textContent = itemCount;
    }

    // Función para obtener el valor de una cookie
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

    // Inicializar el contador del carrito al cargar la página
    updateCartItemCount();
});