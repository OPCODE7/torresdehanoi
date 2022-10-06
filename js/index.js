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

    function prevSlide() {
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

function addDisks(numberOfDisks, towerA) {
    const $towerInitial = d.querySelector(towerA);
    const $fragmentDisks = d.createDocumentFragment();
    const $disks = d.querySelectorAll(".tower-A > .disk");

    if ($towerInitial.children.length > 0) {
        $disks.forEach(el => $towerInitial.removeChild(el));
    }

    let width = numberOfDisks * 10;
    for (let i = 1; i <= numberOfDisks; i++) {
        width -= 10;
        let $disk = d.createElement("div");
        $disk.setAttribute("id", i);
        $disk.classList.add("disk");
        $disk.style.width = `calc(100% - ${width}%)`;
        $fragmentDisks.appendChild($disk);
    }

    $towerInitial.appendChild($fragmentDisks);

}

d.addEventListener("click", e => {
    if (e.target.matches(".add-disks")) {
        let numberOfDisks = parseInt(d.querySelector(".disks").value);
        if (numberOfDisks > 0 && numberOfDisks <= 8) {
            d.querySelector(".best-movements").textContent = `Movimientos mínimos requeridos: ${Math.pow(2, (numberOfDisks - 1))}`;
            addDisks(numberOfDisks, ".tower-A");
        }
    }
});

d.querySelector(".disks").addEventListener("keyup", e => {
    let value = e.target.value;
    const $button = d.querySelector(".add-disks");
    const $validateMessage = d.querySelector(".validate-message");
    $button.disabled = "true";


    $button.disabled = true;
    $button.classList.add("disabled");
    if (!/[0-9]/g.test(value) && !(e.key==="Backspace")) {
        $validateMessage.style.display = "block";
        $validateMessage.textContent = "Ingresar solo números!";
        e.target.style.border = "1px solid red";
    } else {
        $button.removeAttribute("disabled");
        $validateMessage.style.display = "none";
        e.target.style.border = "1px solid #ccc";
        $button.classList.remove("disabled");

        if (parseInt(value) <= 0 || parseInt(value) > 8) {
            $button.classList.add("disabled");
            $button.disabled = true;
            $validateMessage.style.display = "block";
            $validateMessage.textContent = "Ingresar cantidad en el rango 1-8";
            e.target.style.border = "1px solid red";
        } else {
            $button.removeAttribute("disabled");
            $button.classList.remove("disabled");
            $validateMessage.style.display = "none";
            e.target.style.border = "1px solid #ccc";
        }
    }

});

