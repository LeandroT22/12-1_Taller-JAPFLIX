// 1- Fetch a la API
let movies = [];

fetch('https://japceibal.github.io/japflix_api/movies-data.json')
  .then(response => response.json())
  .then(data => {
    movies = data; // Guardar las películas en la variable global
  })
  .catch(error => {
    console.error('Hubo un problema con el fetch:', error);
  });

// 2- Función para mostrar resultados
function mostrarResultados(filtradas) {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; // Limpiar la lista

  filtradas.forEach(pelicula => {
    // Crear un elemento de lista para cada película
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'bg-dark', 'text-light', 'd-flex', 'justify-content-between', 'align-items-center');

    // Título y tagline
    const infoPelicula = document.createElement('div');
    const titulo = document.createElement('h5');
    titulo.textContent = pelicula.title;
    const tagline = document.createElement('p');
    tagline.textContent = pelicula.tagline || 'No tagline available';
    infoPelicula.appendChild(titulo);
    infoPelicula.appendChild(tagline);

    // Puntuación (vote_average)
    const estrellas = document.createElement('span');
    estrellas.innerHTML = generarEstrellas(pelicula.vote_average);

    // Añadir título/tagline y estrellas al item
    item.appendChild(infoPelicula);
    item.appendChild(estrellas);

    // Añadir evento de click para mostrar detalles en el Offcanvas
    item.addEventListener('click', () => mostrarDetallesPelicula(pelicula));

    // Añadir el item a la lista
    lista.appendChild(item);
  });
}

// Función para generar estrellas según el promedio de votos
function generarEstrellas(vote_average) {
  const estrellasTotales = 5;
  const estrellasLlenas = Math.round((vote_average / 10) * estrellasTotales);
  let estrellasHTML = '';

  for (let i = 0; i < estrellasTotales; i++) {
    if (i < estrellasLlenas) {
      estrellasHTML += '<i class="fa fa-star"></i>';
    } else {
      estrellasHTML += '<i class="fa fa-star-o"></i>';
    }
  }

  return estrellasHTML;
}

// Función para mostrar los detalles de la película en el Offcanvas
function mostrarDetallesPelicula(pelicula) {
  const offcanvasTitulo = document.getElementById('offcanvasPeliculaLabel');
  const offcanvasOverview = document.getElementById('overviewPelicula');
  const offcanvasGenres = document.getElementById('genresPelicula');
  const offcanvasDropdown = document.getElementById('dropdownPelicula');

  // Asignar los datos de la película seleccionada
  offcanvasTitulo.textContent = pelicula.title;
  offcanvasOverview.textContent = pelicula.overview || 'No overview available';

  // Extraer y mostrar los géneros
  if (pelicula.genres && Array.isArray(pelicula.genres)) {
    const generoNames = pelicula.genres.map(genero => genero.name).join(' - ');
    offcanvasGenres.textContent = generoNames;
  } else {
    offcanvasGenres.textContent = 'Genres not available';
  }

  // Crear el contenido del dropdown con año de lanzamiento, duración, presupuesto y ganancias
  const releaseYear = pelicula.release_date.split('-')[0]; // Obtener solo el año de la fecha
  const runtime = pelicula.runtime || 'N/A';
  const budget = pelicula.budget ? `$${pelicula.budget.toLocaleString()}` : 'N/A';
  const revenue = pelicula.revenue ? `$${pelicula.revenue.toLocaleString()}` : 'N/A';

  // Actualizar el contenido del dropdown
  offcanvasDropdown.innerHTML = `
    <li><strong>Release Year:</strong> ${releaseYear}</li>
    <li><strong>Runtime:</strong> ${runtime} mins</li>
    <li><strong>Budget:</strong> ${budget}</li>
    <li><strong>Revenue:</strong> ${revenue}</li>
  `;

  // Abrir el Offcanvas
  const offcanvasElement = new bootstrap.Offcanvas(document.getElementById('offcanvasPelicula'));
  offcanvasElement.show();
}

// Buscar películas al hacer clic en el botón
document.getElementById('btnBuscar').addEventListener('click', () => {
  const inputBuscar = document.getElementById('inputBuscar').value.toLowerCase();

  // Filtrar películas
  const filtradas = movies.filter(pelicula =>
    pelicula.title.toLowerCase().includes(inputBuscar) ||
    pelicula.genres.map(genero => genero.name.toLowerCase()).join(', ').includes(inputBuscar) ||
    (pelicula.tagline && pelicula.tagline.toLowerCase().includes(inputBuscar)) ||
    (pelicula.overview && pelicula.overview.toLowerCase().includes(inputBuscar))
  );

  // Mostrar los resultados filtrados
  mostrarResultados(filtradas);
});
