import axios from "axios";

export default class FetchPixabayAPI{
  #searchTerm;
  constructor(key, url) {
    this.#searchTerm = '';
    this.url = url;
    this.totalHits = '';
    this.params = {
      key,
      q: this.searchTerm,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: 1,
      per_page: 40
    }
  }

  get searchTerm() {
    return this.#searchTerm;
  }

  set searchTerm(value) {
    this.#searchTerm = value;
    this.params.q = this.searchTerm;
  }

  showTotalHits() {
    return this.totalHits;
  }

  async quary() {
    try {
    
      const response = await axios.get(`${this.url}`, {
        params: this.params,
        validateStatus(status) {
          return status < 300;
        }
      });

      this.params.page += 1;
      console.log(response);

      
      this.totalHits = response.data.totalHits;
      const theGallery = response.data.hits;
      const isTheGallery = theGallery.length > 0;
      const isTheGalleryOver = this.params.page > Math.ceil(this.totalHits/this.params.per_page);

      return { theGallery, isTheGallery, isTheGalleryOver };
      

    } catch (error) {
      console.log(error.response);
    }
  }

  resetPage() {
    this.params.page = 1;
  }

}  
  
