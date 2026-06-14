const galleryImages =
document.querySelectorAll(".gallery img");

const modal =
document.getElementById("modal");

const modalImage =
document.getElementById("modal-image");

const closeButton =
document.getElementById("close");

galleryImages.forEach(image => {

    image.addEventListener("click", () => {

        modal.style.display = "flex";

        modalImage.src = image.dataset.full;
    });

});

closeButton.addEventListener("click", () => {

    modal.style.display = "none";

});

modal.addEventListener("click", (e) => {

    if(e.target === modal){

        modal.style.display = "none";
    }

});