
    document.addEventListener('DOMContentLoaded', function() {
      // Obtener la ruta actual
      const path = window.location.pathname;

      // Seleccionar todos los enlaces de navegación
      const navLinks = document.querySelectorAll('.nav-link');

      // Remover la clase 'active' de todos los enlaces
      navLinks.forEach(link => link.classList.remove('active'));

      // Agregar la clase 'active' al enlace que corresponde a la ruta actual
      navLinks.forEach(link => {
        if (link.getAttribute('href') === path) {
          link.classList.add('active');
        }
      });
    });