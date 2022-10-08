const d = document;
let $= selector => d.querySelector(selector);
let $All= selector => d.querySelectorAll(selector);  
let numberOfMovements = 0;
const $towerA= $(".tower-A"),$towerB= $(".tower-B"),$towerC= $(".tower-C"),$bestMovements= $(".best-movements"), $counterMovements= $(".counter-movements");


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
        $disk.style.width = `calc(100% - ${width}%)`;
        $fragmentDisks.appendChild($disk);
    }

    $towerInitial.appendChild($fragmentDisks);

}

d.addEventListener("click", e => {
    if (e.target.matches(".add-disks")) {
        numberOfMovements= 0;
        let numberOfDisks = parseInt($(".disks").value);
        if (numberOfDisks > 0 && numberOfDisks <= 8) {
            $bestMovements.textContent = `Movimientos mínimos requeridos: ${Math.pow(2, (numberOfDisks - 1))}`;
            addDisks(numberOfDisks, $towerA);
        }
        $counterMovements.textContent= `${numberOfMovements} movimientos`;
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
        let idDiskSelected= parseInt($diskSelected.getAttribute("id"));
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
        if(e.target.parentElement=== $towerC){
            if($towerA.children.length<2 && $towerB.children.length<2){
                // let id= [];
                // d.querySelector(".tower-C").querySelectorAll(".disk").forEach(el => {
                //     id.push(parseInt(el.getAttribute("id")));
                // });

                // if(id.sort()===id) 
                $(".opacity-to-body").style.display= "block";
                $(".win-game").style.display= "flex";
                $(".total-movements").textContent= `En hora buena has completado el juego con un total de ${numberOfMovements} movimientos`;
            }
        }
        
    }

    if(e.target.matches(".opacity-to-body")){
        $(".opacity-to-body").style.display= "none";
        $(".win-game").style.display= "none";
        $All(".tower-C > .disk").forEach(el => $towerC.removeChild(el));
        $(".disks").value= "";
        $bestMovements.textContent= "Movimientos mínimos requeridos: ";
        $counterMovements.textContent= "0 Movimientos";
        
    }


});

d.querySelector(".disks").addEventListener("keyup", e => {
    let value = e.target.value;
    const $button = d.querySelector(".add-disks");
    const $validateMessage = d.querySelector(".validate-message");
    $button.disabled = "true";


    $button.disabled = true;
    $button.classList.add("disabled");
    if (!/[0-9]/g.test(value) && !(e.key === "Backspace")) {
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







