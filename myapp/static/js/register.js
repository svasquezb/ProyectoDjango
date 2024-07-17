document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password1 = document.getElementById('password1').value;
      const password2 = document.getElementById('password2').value;

      if (password1 !== password2) {
        alert('Las contraseñas no coinciden');
        return;
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password1', password1);
      formData.append('password2', password2);

      fetch('/register/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          window.location.href = '/login/';  // Redirige a la página de login
        } else {
          let errorMessage = '';
          for (let field in data.errors) {
            errorMessage += `${field}: ${data.errors[field].join(', ')}\n`;
          }
          alert('Error en el registro:\n' + errorMessage);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar el usuario');
      });
    });
  }
});