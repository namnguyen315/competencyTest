const listImages = [
  {
    src: "./images/image1.jpg",
    alt: "Gallery-Image-1",
  },
  {
    src: "./images/image2.jpg",
    alt: "Gallery-Image-2",
  },
  {
    src: "./images/image3.jpg",
    alt: "Gallery-Image-3",
  },
  {
    src: "./images/image4.jpg",
    alt: "Gallery-Image-4",
  },
  {
    src: "./images/image5.jpg",
    alt: "Gallery-Image-5",
  },
  {
    src: "./images/image6.jpg",
    alt: "Gallery-Image-6",
  },
  {
    src: "./images/image7.jpg",
    alt: "Gallery-Image-7",
  },
  {
    src: "./images/image8.jpg",
    alt: "Gallery-Image-8",
  },
  {
    src: "./images/image9.jpg",
    alt: "Gallery-Image-9",
  },
  {
    src: "./images/image10.jpg",
    alt: "Gallery-Image-10",
  },
  {
    src: "./images/image11.jpg",
    alt: "Gallery-Image-11",
  },
  {
    src: "./images/image12.jpg",
    alt: "Gallery-Image-12",
  },
  {
    src: "./images/image13.jpg",
    alt: "Gallery-Image-13",
  },
  {
    src: "./images/image14.jpg",
    alt: "Gallery-Image-14",
  },
  {
    src: "./images/image15.jpg",
    alt: "Gallery-Image-15",
  },

  {
    src: "./images/image16.jpg",
    alt: "Gallery-Image-16",
  },
];

const gallery = document.getElementById("gallery");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("fullImage");
const captionText = document.getElementById("caption");
const btnClose = document.querySelector(".close");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

const body = document.body;
let currentIndex;

listImages.forEach((image) => {
  const imgElement = document.createElement("img");
  imgElement.src = image.src;
  imgElement.alt = image.alt;
  imgElement.classList.add("thumbnail");
  gallery.appendChild(imgElement);
});

const thumbnails = document.querySelectorAll(".thumbnail");

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => {
    modal.style.display = "block";
    body.style.overflow = "hidden";
    modalImg.src = thumbnail.src;
    modalImg.alt = thumbnail.alt;
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
    currentIndex = index;
  });
});

btnClose.addEventListener("click", () => {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
    body.style.overflow = "auto";
  }, 500);
});

btnPrev.addEventListener("click", () => {
  changeImage(-1);
});

btnNext.addEventListener("click", () => {
  changeImage(1);
});

function changeImage(direction) {
  modalImg.classList.add("fade-in");
  currentIndex =
    (currentIndex + direction + thumbnails.length) % thumbnails.length;

  setTimeout(() => {
    modalImg.classList.remove("fade-in");
    modalImg.classList.remove("fade-out");
    modalImg.style.transition = "none";
    modalImg.src = thumbnails[currentIndex].src;
    captionText.innerHTML = thumbnails[currentIndex].alt;
    modalImg.style.transform = "translateX(0)";
    modalImg.style.transition =
      "transform 1s ease-in-out, opacity 1s ease-in-out";
  }, 800);
}
