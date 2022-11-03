const d = document;
const $opacityDiv = d.createElement("div");
$opacityDiv.classList.add("opacity-to-body");

const $modalViewCard = d.querySelector(".card-mode-center-screen");

d.addEventListener("mouseover", e => {
    if (e.target.matches(".video-card")) {
        const $video = e.target.querySelector("video");
        $video.play();
    }
});

d.addEventListener("mouseout", e => {
    if (e.target.matches(".video-card")) {
        const $video = e.target.querySelector("video");
        $video.pause();
        $video.currentTime = 0;
    }
});

d.addEventListener("click", e => {

    if (e.target.matches(".look-more") || e.target.matches(".video-card")) {
        let $closestContainer = e.target.closest("article").cloneNode(true);
        let $button;
        let $elementsCard = [...$closestContainer.children];
        $opacityDiv.style.display = "block";
        d.body.appendChild($opacityDiv);
        $elementsCard.forEach(el => $modalViewCard.append(el));
        $modalViewCard.style.display = "block";
        $button= $modalViewCard.querySelector(".info-card-principal > button");
        $button.textContent= "Volver";
        $button.classList.remove("look-more");
        $button.id= "back";
    }
    if(e.target.matches("#back")){
        $modalViewCard.style.display= "none";
        $opacityDiv.style.display= "none";
        d.querySelectorAll(".card-mode-center-screen > div").forEach(el => $modalViewCard.removeChild(el));
        e.target.id= "";

    }
});