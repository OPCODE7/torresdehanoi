const d = document;

d.addEventListener("DOMContentLoaded", e => {
    slider(".slider-content");
});

function slider(selectorSlide) {
    let counterClicks = 0;
    const $contentSlides = d.querySelectorAll(selectorSlide);
    const $indicators = d.querySelectorAll("#indicator");
    let playSlider = autoPlay();

    function autoPlay() {
        return setInterval(() => {
            nextSlide();
        }, 5000);
    }

    d.addEventListener("mouseover", e => {
        $indicators.forEach(el => {
            if (e.target === el) clearInterval(playSlider);
        })
    });

    d.addEventListener("mouseout", e => {
        let isLeave = false;
        $indicators.forEach(el => {
            if (e.target === el) isLeave = true;
        })

        if (isLeave) {
            playSlider = autoPlay();
        }

    });


    d.addEventListener("click", (e) => {
        
        $indicators.forEach((indicator, index) => {
            if (e.target === indicator) {
                e.preventDefault();
                $contentSlides[counterClicks].classList.remove("visible-slide");
                $indicators[counterClicks].style.backgroundColor = "rgb(141, 138, 138)";

                counterClicks = index;
                indicator.style.backgroundColor = "rgb(214, 214, 214)";
                $contentSlides[counterClicks].classList.add("visible-slide");
            }

        });
    });

    function prevSlide(){
        $contentSlides[counterClicks].classList.remove("visible-slide");
        $indicators[counterClicks].style.backgroundColor = "rgb(141, 138, 138)";
        counterClicks--;

        if (counterClicks < 0) counterClicks = $contentSlides.length - 1;

        $contentSlides[counterClicks].classList.add("visible-slide");
        $indicators[counterClicks].style.backgroundColor = "rgb(214, 214, 214)";
    }

    function nextSlide() {
        $contentSlides[counterClicks].classList.remove("visible-slide");
        $indicators[counterClicks].style.backgroundColor = "rgb(141, 138, 138)";
        counterClicks++;

        if (counterClicks >= $contentSlides.length) counterClicks = 0;

        $contentSlides[counterClicks].classList.add("visible-slide");
        $indicators[counterClicks].style.backgroundColor = "rgb(214, 214, 214)";
    }
}

d.addEventListener("click", e => {
    if(e.target.matches(".add-disks")){
        let numberOfDisks= parseInt(d.querySelector(".disks").value);
        if(numberOfDisks>0){
            d.querySelector(".best-movements").textContent= `Movimientos mínimos requeridos: ${Math.pow(2,(numberOfDisks-1))}`;
        }
    }
});