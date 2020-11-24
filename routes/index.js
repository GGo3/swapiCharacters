var express = require('express');
var router = express.Router();
var axios = require('axios');
const url = 'https://swapi.dev/api/films/';

const films = {
    nav: '',
    selectedFilm: '',
    arrFilmsNames: [],
    filmUrl: '',
    charList: '',
    loaderStat: `display:none;`
}

const list = new Promise((res, rej) => {
    axios.get(url)
    .then((res1) => {
        let arrFilms = res1.data.results;
        return arrFilms;
    })
    .then((res2) => {
        let strList = `<select class="films">\n
        <option selected="selected">Выберите фильм</option>\n`;
        res2.forEach(element => {
            films.arrFilmsNames.push(element.title);
            strList = `${strList}<option>${element.title}</option>\n`
        });
        strList = `${strList}</select>`
        res(strList);
    })
    .catch((err) => {console.log('axios err list', err)});
});


router.get('/', (req, res, next) => {
    Promise.resolve(list)
    .then((select) => {
        films.nav = select;
        films.charList = '';
        res.render('index', films)
    })
})

const getURL = (name, arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == name) {
            films.filmUrl = `https://swapi.dev/api/films/${(i + 1)}/`;
        }
    }
}

router.get('/:film', (req, res, next) => {
    films.selectedFilm = req.params.film;
    getURL(req.params.film, films.arrFilmsNames);
    axios.get(films.filmUrl)
    .then((resp1) => {
        const characters = resp1.data.characters.map(el => {
            return axios.get(el);
        })
        Promise.all(characters)
        .then((resp2) => {
            let charStr = `<ul>\n`;
            resp2.forEach(el => {
                charStr = `${charStr}<li>${el.data.name}</li>\n`
            })
            charStr = `${charStr}</ul>\n`;
            films.charList = charStr;
            let strLestSelected = `<select class="films">\n
            <option selected="selected">${films.selectedFilm}</option>\n`;
            films.arrFilmsNames.forEach((el) => {
                if (el !== films.selectedFilm) {
                    strLestSelected = `${strLestSelected}<option>${el}</option>\n`
                }
            })
            strLestSelected = `${strLestSelected}</select>`
            films.nav = strLestSelected;
            res.render('index', films)
        }) 
    })
})

module.exports = router;
