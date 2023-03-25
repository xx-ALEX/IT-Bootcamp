let characters = document.querySelectorAll('.character');
let okButton = document.querySelectorAll('.close')[0];
let toTopButton = document.querySelectorAll('#myBtn')[0];
let avatars, page = 1, pages, next;

const getAll = () => {
    (async () => {
        let responseLink = await fetch(`https://rickandmortyapi.com/api`);
        if (!responseLink.ok) {
            throw new Error (`An error has occurred: ${responseLink.status}`);
        }
        const objectLink = await responseLink.json();
        sessionStorage.setItem(`charactersLink`, objectLink[`characters`]);

        let responseCharacters = await fetch(sessionStorage.getItem(`charactersLink`));
        if (!responseCharacters.ok) {
            throw new Error (`An error has occurred: ${responseCharacters.status}`);
        }
        const objectCharacters = await responseCharacters.json();
        sessionStorage.characters1 = JSON.stringify(objectCharacters);
        pages = JSON.parse(sessionStorage.characters1)['info']['pages'];
        next = JSON.parse(sessionStorage.characters1)['info']['next'];

        characters = document.querySelectorAll('.character');
        JSON.parse(sessionStorage.characters1).results.forEach((a,i) => {characters[i].innerHTML =
            `<a href="#modal" id="${a.id}" data-page="1"><img src="${a.image}" alt="avatar"></a><p>${a.name}</p>`});

        avatars = document.querySelectorAll('img');
        avatars.forEach(a => a.addEventListener('click', showModal));
    })();
}
const showNext = () => {
    (async () => {
        let responseCharacters = await fetch(next);
        if (!responseCharacters.ok) {
            throw new Error (`An error has occurred: ${responseCharacters.status}`);
        }
        const objectCharacters = await responseCharacters.json();
        page++;
        sessionStorage['characters' + page] = JSON.stringify(objectCharacters);
        pages = JSON.parse(sessionStorage['characters' + page])['info']['pages'];
        next = JSON.parse(sessionStorage['characters' + page])['info']['next'];
        await addElements();

        characters = Array.from(document.querySelectorAll('.character')).slice(-20);
        JSON.parse(sessionStorage['characters' + page]).results.forEach((a,i) => {characters[i].innerHTML =
            `<a href="#modal" id="${a.id}" data-page="${page}"><img src="${a.image}" alt="avatar"></a><p>${a.name}</p>`});

        avatars = Array.from(document.querySelectorAll('img')).slice(-20);
        avatars.forEach(a => a.addEventListener('click', showModal));
    })();
}
const showModal = (e) => {
    let avatar = document.querySelectorAll('div.info>img');
    avatar[0].setAttribute(`src`, `${e.target.src}`);
    let currentPage = e.target.parentElement.getAttribute('data-page');

    let currentDataCharacter = JSON.parse(sessionStorage['characters' + currentPage]).results.filter(a => a.id === +e.target.parentElement.id);

    let name = document.getElementById('name');
    name.innerHTML = `${currentDataCharacter[0]['name']}`;
    let status = document.getElementById('status');
    status.innerHTML = `${currentDataCharacter[0]['status']}`;
    let species = document.getElementById('species');
    species.innerHTML = `${currentDataCharacter[0]['species']}`;
    let origin = document.getElementById('origin');
    origin.innerHTML = `${currentDataCharacter[0]['origin']['name']}`;
    let location = document.getElementById('location');
    location.innerHTML = `${currentDataCharacter[0]['location']['name']}`;
    let gender = document.getElementById('gender');
    gender.innerHTML = `${currentDataCharacter[0]['gender']}`;

    document.body.style.overflowY = 'hidden';
    toTopButton.style.visibility = 'hidden';
}
const checkPosition = () => {
    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;
    const scrolled = window.scrollY;
    const threshold = height - screenHeight / 4;
    const position = scrolled + screenHeight;

    if (position >= threshold && page < pages) {
        showNext();
    }
}
const throttle = (callee, timeout) => {
    let timer = null;

    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            callee(...args);
            clearTimeout(timer)
            timer = null;
        }, timeout);
    }
}
const addElements = () => {
    let parent = document.querySelectorAll('.parent');
    for (let i = 0; i < 20; i++) {
        let newCharacter = document.createElement('div');
        newCharacter.classList.add('character');
        parent[0].appendChild(newCharacter);
    }
}
const scrollFunction = () => {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}
const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

$(window).on("load", function() {
    $(".loader_inner").fadeOut();
    $(".loader").delay(500).fadeOut("slow");
});
window.addEventListener('load', getAll);
window.addEventListener('load', () => document.body.classList.add('loaded'));
window.addEventListener('scroll', scrollFunction);
window.addEventListener('scroll', throttle(checkPosition, 500));
window.addEventListener('resize', throttle(checkPosition, 500));
okButton.addEventListener('click', () => {document.body.style.overflowY = 'auto'; toTopButton.style.visibility = 'visible';});
toTopButton.addEventListener('click', topFunction);