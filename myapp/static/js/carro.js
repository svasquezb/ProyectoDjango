$(document).ready(function() {
  // Nuevo event listener para el ícono del carrito
  $('#carro-link').on('click', function(e) {
      e.preventDefault();
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) {
          window.location.href = loginUrl;
      } else {
          window.location.href = carroUrl;
      }
  });

  // Cargar items del carrito al iniciar
  loadCartItems();

  // Actualizar cantidad
  $(document).on('change', '.quantity-input', function() {
      const itemId = $(this).closest('.cart-item').data('id');
      const newQuantity = $(this).val();
      updateCartItem(itemId, newQuantity);
  });

  // Eliminar item
  $(document).on('click', '.remove-item', function(e) {
      e.preventDefault();
      const itemId = $(this).data('id');
      removeCartItem(itemId);
  });

  // Proceder al pago
  $('#proceedToCheckout').on('click', function() {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      if (cartItems.length === 0) {
          $('#checkoutMessage').text('No hay artículos en el carrito.').show();
      } else {
          window.location.href = '/checkout/';
      }
  });

  function loadCartItems() {
      const loggedInUser = localStorage.getItem('loggedInUser');

      if (!loggedInUser) {
          $('#cartItems').html('<tr><td colspan="5">Debes iniciar sesión para ver los productos en el carrito.</td></tr>');
          $('#cartTotal').text('$0');
          return;
      }

      try {
          const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          let cartHTML = '';
          let total = 0;

          cartItems.forEach(item => {
              const precio = parseFloat(item.precio);
              const cantidad = parseInt(item.cantidad);
              const subtotal = precio * cantidad;

              cartHTML += `
                  <tr class="cart-item" data-id="${item.id}">
                      <td>
                          <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
                          ${item.nombre}
                      </td>
                      <td>$${precio.toFixed(2)}</td>
                      <td>
                          <input type="number" class="form-control quantity-input" value="${cantidad}" min="1">
                      </td>
                      <td>$${subtotal.toFixed(2)}</td>
                      <td>
                          <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Eliminar</button>
                      </td>
                  </tr>
              `;
              total += subtotal;
          });

          $('#cartItems').html(cartHTML);
          $('#cartTotal').text(`$${total.toFixed(2)}`);
          updateCartItemCount();
      } catch (error) {
          $('#cartItems').html('<tr><td colspan="5">Error al cargar los items del carrito. Por favor, intenta de nuevo más tarde.</td></tr>');
          $('#cartTotal').text('$0');
      }
  }

  function updateCartItem(itemId, quantity) {
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const item = cartItems.find(item => item.id === itemId);
      if (item) {
          item.cantidad = parseInt(quantity);
          item.subtotal = parseFloat(item.precio) * item.cantidad;
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          loadCartItems();
      }
  }

  function removeCartItem(itemId) {
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItems = cartItems.filter(item => item.id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      loadCartItems();
      updateCartItemCount();
  }

  function updateCartItemCount() {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const itemCount = cartItems.reduce((total, item) => total + parseInt(item.cantidad), 0);
      $('#cartItemCount').text(itemCount);
  }

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
});
