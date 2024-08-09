const navLinks = document.querySelectorAll(".nav-menu li");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Xóa class "active" khỏi tất cả các phần tử
    navLinks.forEach((item) => {
      item.classList.remove("active");
    });

    // Thêm class "active" vào phần tử vừa được click
    link.classList.add("active");
  });
});

const toogleMenu = () => {
  const btnMenu = document.getElementById("btnMenu");
  const navbar = document.getElementById("navbar");
  const contentContainer = document.getElementById("contentContainer");
  btnMenu.classList.toggle("close");
  navbar.classList.toggle("navInactive");
  contentContainer.classList.toggle("fullScreen");
  console.log(navbar);
};
