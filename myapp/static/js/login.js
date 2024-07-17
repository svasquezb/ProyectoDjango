document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      fetch('/login/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('loggedInUser', username);
          alert('Inicio de sesión exitoso');
          window.location.href = '/';  // Redirige a la página principal de Django
        } else {
          alert(data.message || 'Error al iniciar sesión');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
      });
    });
  }
});