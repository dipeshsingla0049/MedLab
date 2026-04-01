const url = 'https://69c16e00085e1a9fae410108.mockapi.io/api/v1/Hospitals';

function renderHospitals() {
    const grid = document.getElementById('hospital-grid');
    
    if (!grid) return;
    
    fetch(url)
    .then(res => res.json())
    .then(hospitals => {
        hospitals.map(h => {
            const card = document.createElement('div');
            card.className = 'hospital-card';

            const img = document.createElement('img');
            img.src = h.image;

            const name = document.createElement('h3');
            name.innerText = h.name;

            const city = document.createElement('p');
            city.innerText = h.city;

            const general = document.createElement('p');
            general.innerText = 'General Beds: ' + h.generalBeds;

            const icu = document.createElement('p');
            icu.innerText = 'ICU Beds: ' + h.icuBeds;

            const avail = document.createElement('p');
            avail.innerText = 'Available: ' + h.availBeds;

            const phone = document.createElement('p');
            phone.innerText = h.phone;

            card.append(img, name, city, general, icu, avail, phone);
            grid.append(card);
        });
    })
    .catch(err => console.error('Error fetching hospitals:', err));
}
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('hospital-grid')) {
        renderHospitals();
    }
});
