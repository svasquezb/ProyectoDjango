$(document).ready(function() {
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
        console.log("Botón Eliminar clickeado");
        const itemId = $(this).data('id');
        console.log("ID del item a eliminar:", itemId);
        if (!itemId) {
          console.error("No se pudo obtener el ID del item");
          return;
        }
        removeCartItem(itemId);
      });
    // Proceder al pago
    $('#proceedToCheckout').on('click', function() {
      window.location.href = '/checkout/';  // Asegúrate de tener esta URL definida
    });
  
    function loadCartItems() {
        try {
          const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          console.log("Cargando items del carrito:", cartItems);
          let cartHTML = '';
          let total = 0;
      
          cartItems.forEach(item => {
            console.log("Procesando item:", item);
            const precio = parseFloat(item.precio);
            const cantidad = parseInt(item.cantidad);
            const subtotal = precio * cantidad;
      
            if (isNaN(precio) || isNaN(cantidad) || isNaN(subtotal)) {
              console.error('Datos inválidos para el item:', item);
              return; // Salta este item si los datos no son válidos
            }
      
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
          
          console.log("Carrito cargado exitosamente");
        } catch (error) {
          console.error('Error al cargar los items del carrito:', error);
          $('#cartItems').html('<tr><td colspan="5">Error al cargar los items del carrito. Por favor, intenta de nuevo más tarde.</td></tr>');
          $('#cartTotal').text('$0.00');
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
        console.log("Función removeCartItem llamada con ID:", itemId);
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log("Items en el carrito antes de eliminar:", cartItems);
      
        if (!itemId) {
          console.error("El itemId es inválido");
          return;
        }
      
        cartItems = cartItems.filter(item => item.id !== itemId);
      
        console.log("Items en el carrito después de eliminar:", cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        loadCartItems();
        updateCartItemCount();
      }
  
    function updateCartItemCount() {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const itemCount = cartItems.reduce((total, item) => total + parseInt(item.cantidad), 0);
      $('#cartItemCount').text(itemCount);
      console.log("Contador del carrito actualizado:", itemCount);
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