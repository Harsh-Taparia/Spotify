let currentSong = new Audio()
let play = document.querySelector('.song-play')
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Ensure two-digit formatting
    var formattedMinutes = String(minutes);
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds with ':'
    var result = formattedMinutes + ':' + formattedSeconds;

    return result;
}




// getting songs from server
async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`${folder}`)
    let resonse = await a.text();

    let div = document.createElement("div");
    div.innerHTML = resonse

    let as = div.getElementsByTagName('a')

    let songs = []

    for (let i = 0; i < as.length; i++) {
        const element = as[i]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    // show all the songs in the playlist
    let songul = document.querySelector('.song-lists').getElementsByTagName('ul')[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `
        <li>
            <img src="images/music.jpg" alt="">
            <div class="song-info">
                <div class="song-name">${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
            </div>
            <div class="play-now"><i class="fa-regular fa-circle-play song-play"></i></div>
        </li>`
    }

    // adding event listeners on each song
    Array.from(document.querySelector('.song-lists').getElementsByTagName('li')).forEach(e => {

        e.addEventListener('click', () => {
            playmusic(e.querySelector('.song-info').firstElementChild.innerHTML)
        })

    })

    return songs
}


function playmusic(track, pause = false) {
    currentSong.src = `/${currFolder}/` + track + ".mp3"

    if (!pause) {
        currentSong.play()
        play.src = "images/circle-pause-regular.svg"
    }
    document.querySelector('.songinfo').innerHTML = track.replaceAll("%20", " ");
    document.querySelector('.songtime').innerHTML = "00:00 / 00:00"
}


async function displayAlbums() {
    let a = await fetch(`new-songs`)
    let resonse = await a.text();

    let div = document.createElement("div");
    div.innerHTML = resonse

    let linkTags = div.getElementsByTagName('a')
    let cardcont = document.querySelector('.card-cont')

    let array = Array.from(linkTags)

    for (let index = 0; index < array.length; index++) {

        const e = array[index];

        if (e.href.includes('/new-songs/')) {
            let folder = (e.href.split('/new-songs/').slice(-2)[1]);

            // getting data of each folder
            let a = await fetch(`new-songs/${folder}/info.json`)
            let resonse = await a.json();

            cardcont.innerHTML = cardcont.innerHTML + `
            <div data-folder="${folder}" class="card">
                <div class="play"><i class="fa-solid fa-play"></i></div>
                <img src="new-songs/${folder}/cover.jpg" alt="">
                <h2>${resonse.title}</h2>
                <p>${resonse.description}</p>
            </div>`
        }
    }


    // loading songs when playlists is clicked
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async (item) => {
            songs = await getSongs(`new-songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

async function main() {

    songs = await getSongs("new-songs/a-romantic")
    playmusic(songs[0].replaceAll(".mp3", ""), true)


    // displaying all albums on the page
    displayAlbums()



    // play pause next previous
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            play.src = "images/circle-pause-regular.svg"
            currentSong.play()
        }
        else {
            play.src = "images/circle-play-regular.svg"
            currentSong.pause()
        }
    })


    // listening time update events
    currentSong.addEventListener('timeupdate', () => {

        document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })


    // forwading song through seekbar
    document.querySelector('.seekbar').addEventListener('click', (e) => {
        document.querySelector('.circle').style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%"
        currentSong.currentTime = ((currentSong.duration) * ((e.offsetX / e.target.getBoundingClientRect().width) * 100)) / 100
    })

    // making hamburger
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = "0"
        document.querySelector('.close-ham').style.display = "block"
    })

    document.querySelector('.close-ham').addEventListener('click', () => {
        document.querySelector('.left').style.left = "-150%"
        document.querySelector('.close-ham').style.display = "none"
    })

    // changing songs
    document.querySelector('.song-back').addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])

        if ((index - 1) >= length) {
            playmusic(songs[index - 1].replaceAll('.mp3', ""))
        }
        else {
            alert('This is first song of this playlist')
        }
    })

    document.querySelector('.song-next').addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) > length) {
            playmusic(songs[index + 1].replaceAll('.mp3', ""))
        }
    })

}

main()


