function scrollToElement() {
  let cursoSection = document.getElementById('cursos')
  var posicion = cursoSection.getBoundingClientRect().top;

  var posicionScroll = window.pageYOffset + posicion - 80;

  window.scrollTo({
    top: posicionScroll,
    behavior: 'smooth'
  });

}