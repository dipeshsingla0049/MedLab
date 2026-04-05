var API_URL = 'https://69c16e00085e1a9fae410108.mockapi.io/api/v1/Hospitals';
var allHospitals = [];

document.addEventListener('DOMContentLoaded',function(){
    if(document.getElementById('hospital-grid')) {
        initBedsPage();
    }
    if (document.getElementById('favorites-grid')) {
    initFavoritesPage();
  }
  if (document.getElementById('hero-search')) {
    initHeroSearch();
  }
});
function initHeroSearch() {
    let input = document.getElementById('hero-search');
    let btn = document.getElementById('btn-hero-search');
    if(!btn || !input) {
        return};
    let handleSearch = function() {
        let query = input.value.trim();
        if (query) {
            window.location.href = 'beds.html?q=' + encodeURIComponent(query);
        } else {
            window.location.href = 'beds.html';
        }
}
btn.addEventListener('click', handleSearch);}


