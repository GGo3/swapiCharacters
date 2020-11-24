let el = document.querySelector('.films');
let charEl = document.querySelector('.chars');
let loader = document.querySelector('.loader');

if (el) {
    el.addEventListener('change', (ev) => {
        charEl.style.display = "none";
        loader.style.display = "block";
        document.location.replace(`/${ev.target.value}`);
    });
};  


