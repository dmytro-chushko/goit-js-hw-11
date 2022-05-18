import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import FetchPixabayAPI from './js/fetch-pixabay';
import ButtonsAPI from './js/buttons-api';
import galleryMarkup from './teamplates/gallery-markup.hbs';

const REQUEST_LINK = 'https://pixabay.com/api/';
const KEY = '27389649-f5df395754432ead8290902de';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const pixabay = new FetchPixabayAPI(KEY, REQUEST_LINK);
const buttons = new ButtonsAPI('span', 'i');
const galleryInit = new SimpleLightbox('.gallery a');

async function onSubmit(e) {
  e.preventDefault();

  if (!btnLoadMore.classList.contains('d-none')) {
    btnLoadMore.classList.add('d-none');
  }
      
  gallery.innerHTML = '';

  const { elements: { searchQuery: { value } } } = e.target;

  if (value === '' || value === ' ') {
    Notify.failure("Input search word or sentence");
    return
  }

  pixabay.searchTerm = value;

  const btn = e.target.elements.searchButton;
  buttons.toggleSpinner(btn);

  await fetchAndRender();
  
  const totalHits = pixabay.showTotalHits();
  if (totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
   
  pixabay.resetPage();

  buttons.toggleSpinner(btn);

  btnLoadMore.classList.toggle('d-none');
}

async function onLoadMore(e) {
  buttons.toggleSpinner(e.target);

  await fetchAndRender();
  smoothScroll();
  
  buttons.toggleSpinner(e.target);
}

async function fetchAndRender() {
  const {theGallery, isTheGallery, isTheGalleryOver} = await pixabay.quary();
   
  if (!isTheGallery) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    btnLoadMore.classList.remove('d-none');
    return;
  }

  if (isTheGalleryOver) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    btnLoadMore.classList.toggle('d-none');
  }

  gallery.insertAdjacentHTML('beforeend', galleryMarkup(theGallery));
    
  galleryInit.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = gallery
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
});
}

form.addEventListener('submit', onSubmit);
btnLoadMore.addEventListener('click', onLoadMore);


