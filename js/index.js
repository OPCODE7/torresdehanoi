
const d = document;
let $ = selector => d.querySelector(selector);
let $All = selector => d.querySelectorAll(selector);
let numberOfMovements = 0, movements = [];
const $towerA = $(".tower-A"), $towerB = $(".tower-B"), $towerC = $(".tower-C"), $bestMovements = $(".best-movements"), $counterMovements = $(".counter-movements"), $guideSolution= $(".guide-solution");


d.addEventListener("DOMContentLoaded", e => {
    slider(".slider-content");
});

function HanoiAlgorithm(numberOfDisks, towerInitial, towerAux, towerFinal) {
    if (numberOfDisks === 1) {
        movements.push({ numberOfDisks, towerInitial, towerFinal });
    } else {
        HanoiAlgorithm(numberOfDisks - 1, towerInitial, towerFinal, towerAux);
        movements.push({ numberOfDisks, towerInitial, towerFinal });
        HanoiAlgorithm(numberOfDisks - 1, towerAux, towerInitial, towerFinal);
    }
}

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
            if (e.target === el || e.target.matches(".slider-content")) clearInterval(playSlider);
        })
    });

    d.addEventListener("mouseout", e => {
        let isLeave = false;
        $indicators.forEach(el => {
            if (e.target === el || e.target.matches(".slider-content")) isLeave = true;
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

function reset() {
    addDisks(parseInt($(".disks").value), $towerA);
    $(".guide-solution").style.display = "none";

    $counterMovements.textContent = `0 Movimientos`;
}

function addDisks(numberOfDisks, towerA) {
    const $towerInitial = towerA;
    const $fragmentDisks = d.createDocumentFragment();

    $All(".container-tower").forEach(el => {
        el.querySelectorAll(".disk").forEach(disk => el.removeChild(disk));
    });

    let width = numberOfDisks * 10;
    for (let i = 1; i <= numberOfDisks; i++) {
        width -= 10;
        let $disk = d.createElement("div");
        $disk.setAttribute("id", i);
        $disk.classList.add("disk");
        $disk.textContent = `${i}`;
        $disk.style.width = `calc(100% - ${width}%)`;
        $fragmentDisks.appendChild($disk);
    }

    $towerInitial.appendChild($fragmentDisks);

}

d.addEventListener("click", e => {
    if (e.target.matches(".add-disks")) {
        const $validateMessage = d.querySelector(".validate-message");
        numberOfMovements = 0;
        let numberOfDisks = parseInt($(".disks").value);
        if (numberOfDisks > 0 && numberOfDisks <= 8) {
            $bestMovements.textContent = `Movimientos mínimos requeridos: ${Math.pow(2, numberOfDisks) - 1}`;
            addDisks(numberOfDisks, $towerA);
            HanoiAlgorithm(numberOfDisks, "A", "B", "C");
            $(".guide-solution").style.display= "none";

        }
        if ($(".disks").value === "") {
            $validateMessage.style.display = "block";
            $validateMessage.textContent = "Ingresar número de discos";
        }
        $counterMovements.textContent = `${numberOfMovements} movimientos`;
    }

    if (!e.target.classList.contains("selected-disk") && e.target === $(".disk")) {
        $All(".container-tower").forEach(el => {
            el.setAttribute("data-ejector", "");
            el.removeAttribute("data-receiver");
        });
    }

    if (e.target.parentElement.hasAttribute("data-ejector")) {
        if (e.target === e.target.parentElement.children[1]) {
            e.target.classList.add("selected-disk");
            d.querySelectorAll(".container-tower").forEach(el => {
                el.setAttribute("data-receiver", "");
                el.removeAttribute("data-ejector");
            });
        };
    } else if (e.target.parentElement.hasAttribute("data-receiver")) {
        const $diskSelected = d.querySelector(".selected-disk");
        let idDiskSelected = parseInt($diskSelected.getAttribute("id"));
        let moveDisk = () => {
            e.target.parentElement.querySelector(".tower").insertAdjacentElement("afterend", $diskSelected);
            $diskSelected.classList.remove("selected-disk");
            $All(".container-tower").forEach(el => {
                el.setAttribute("data-ejector", "");
                el.removeAttribute("data-receiver");
            });
        }

        if (e.target.parentElement.children.length > 1) {
            let idTopDisk = parseInt(e.target.parentElement.children[1].getAttribute("id"));

            if (idTopDisk > idDiskSelected) {
                moveDisk();
                numberOfMovements++;

            } else if (idTopDisk === idDiskSelected) {
                moveDisk();
                numberOfMovements++;
            }
        } else {
            moveDisk();
            numberOfMovements++;
        }

        $counterMovements.textContent = `${numberOfMovements} movimientos`;
        if (e.target.parentElement === $towerC) {
            if ($towerA.children.length < 2 && $towerB.children.length < 2) {
                const $disksFromC = [...$towerC.querySelectorAll(".disk")];
                if ($disksFromC === $disksFromC.sort()) {

                    $(".opacity-to-body").style.display = "block";
                    $(".win-game").style.display = "flex";
                    $(".total-movements").textContent = `En hora buena has completado el juego con un total de ${numberOfMovements} movimientos`;
                    reset();
                }
            }
        }


    }
    if (e.target.matches(".fa-rotate")) {
        reset();
    };

    if (e.target.matches(".opacity-to-body")) {
        $(".opacity-to-body").style.display = "none";
        $(".win-game").style.display = "none";
        $All(".tower-C > .disk").forEach(el => $towerC.removeChild(el));
        $(".disks").value = "";
        $bestMovements.textContent = "Movimientos mínimos requeridos: ";
        $counterMovements.textContent = "0 Movimientos";

    }

    if (e.target.matches(".auto-solve")) {
        //funcional pero sin animación
        /*
        movements.forEach((el) => {
            let towerInitial = el.towerInitial, towerFinal = el.towerFinal;
            const $disksA = $All(".tower-A > .disk");
            const $disksB = $All(".tower-B > .disk");
            const $disksC = $All(".tower-C > .disk");

            if (towerInitial === "A" && towerFinal === "B") {
                $disksA.forEach(disk => {
                    if (el.numberOfDisks == disk.getAttribute("id")) {
                        $towerB.prepend(disk);
                    }
                });
            } else if (towerInitial === "A" && towerFinal === "C") {
                $disksA.forEach(disk => {
                    if (el.numberOfDisks == disk.getAttribute("id")) {
                        $towerC.prepend(disk);
                    }
                });
            } else if (towerInitial === "B" && towerFinal === "A") {
                $disksB.forEach(disk => {
                    if (el.numberOfDisks == disk.getAttribute("id")) {
                        $towerA.prepend(disk);
                    }
                });
            } else if (towerInitial === "B" && towerFinal === "C") {
                $disksB.forEach(disk => {
                    if (el.numberOfDisks == disk.getAttribute("id")) {
                        $towerC.prepend(disk);
                    }
                });
            } else if (towerInitial === "C" && towerFinal === "A") {
                $disksC.forEach(disk => {
                    if (el.numberOfDisks == disk.getAttribute("id")) {
                        $towerA.prepend(disk);
                    }
                });
            } else if (towerInitial === "C" && towerFinal === "B") {
                $disksC.forEach(disk => {
                    if (el.numberOfDisks == disk.getAttribute("id")) {
                        $towerB.prepend(disk);
                    }
                });
            }
        });
        */


        if($towerA.querySelectorAll(".disk").length>0){
            $(".guide-solution > ol").querySelectorAll("li").forEach(el => $(".guide-solution > ol").removeChild(el));
            
            movements.forEach(el => {
                $(".guide-solution > ol").innerHTML += `<li>Mover disco ${el.numberOfDisks} de la torre ${el.towerInitial}  a la torre ${el.towerFinal}</li>`
            });
            $guideSolution.style.display = "block";
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
    $validateMessage.style.display = "block";
    if (!/\d/g.test(value) && !(e.key === "Backspace")) {
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









