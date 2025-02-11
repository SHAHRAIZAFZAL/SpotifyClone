console.log('Let’s start JavaScript');

let currentSong = new Audio();

async function getSongs() {
    try {
        let a = await fetch('http://127.0.0.1:3000/SpotifyClone/songs/');
        let response = await a.text();

        let parser = new DOMParser();
        let doc = parser.parseFromString(response, "text/html");

        let as = doc.getElementsByTagName("a");
        let songs = [];

        for (let element of as) {
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href);
            }
        }

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track) => {
    currentSong.src = track;  // FIXED: Use the full URL directly
    currentSong.play();
};

async function main() {
    let songs = await getSongs();
    console.log(songs);

    if (songs.length > 0) {
        let songUL = document.querySelector(".songList ul");
        if (!songUL) return; // FIXED: Prevent errors if `.songList` is missing

        songUL.innerHTML = "";
        for (const song of songs) {
            songUL.innerHTML += `<li data-song="${song}">
                <img class="invert" width="34" src="img/music.svg" alt="">
                <div class="info">
                    <div> ${decodeURIComponent(song)}</div>  <!-- FIXED: Decode full URL -->
                    <div>Sherry</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div> 
            </li>`;
        }

        // FIXED: Use dataset.song instead of extracting text
        document.querySelectorAll(".songList li").forEach(e => {
            e.addEventListener("click", () => {
                playMusic(e.dataset.song);
            });
        });
    }
}

main();
