console.log("js here")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();


    let div = document.createElement("div");
    div.innerHTML = response;
    let lis = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < lis.length; index++) {
        const element = lis[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="22" src="img/musicsvg.svg" alt="">
                            <div class="info">
                            <div> ${song.replace(/%20/g, " ").replace(/\.mp3/g, " ")} </div>
                              
                                
                                
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    return songs;
}



const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track



    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}



async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainers = document.querySelector(".cardContainers")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs/")  && !e.href.includes(".htaccess")){
            let folder = e.href.split("/").slice(-1)[0]

            //meta data of folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();


            cardContainers.innerHTML = cardContainers.innerHTML + `<div data-folder="${folder}" class="card">

            <div class="spotify-play-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                    <polygon points="21.57 12 5.98 3 5.98 21 21.57 12"></polygon>
                </svg>
            </div>    
            <img src = "/songs/${folder}/cover.jpg" alt="">
           
                 
                <h2>${response.title}</h2>

            
        </div>`

        }
    }
    //load playlist when card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })



}

async function main() {
    await getSongs("songs/sads")
    playMusic(songs[0], true);


    //dis[lay all the albums on the page


    displayAlbums();
    // next and previous song 

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // listen time update event 

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    });


    //add event listner for previous 

    previous.addEventListener("click", () => {



        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);


        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])

        }


    })
    // for automatic next song when one neds



    //add event listner for  next is clicked
    next.addEventListener("click", () => {


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);



        if ((index + 1) > length) {

            playMusic(songs[index + 1])

        }


    })
    // EVENT LISTNER FOR VOLUME

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = e.target.value / 100

    })

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}

main();



