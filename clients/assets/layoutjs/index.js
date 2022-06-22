// menu icon
let dem = 0;
document.querySelector(".menuToggle").onclick = function () {
  document.querySelector(".sidenav").classList.toggle("open");
  document.querySelector(".wrapper__content").classList.toggle("sidenav-open");
  document.querySelector(".menuToggle").classList.toggle("open");
  document.querySelector(".header").classList.toggle("sidenav-open");

  // ẩn logo khi mở menu
  let element = document.querySelector(".header__logo-img");
  if (element.style.opacity === "0") {
    element.style.opacity = "1";
  } else {
    element.style.opacity = "0";
  }

  // disable scroll when menu open
  dem++;
  if (dem % 2 != 0) {
    let scrollY = document.documentElement.style.getPropertyValue("--scroll-y");
    let element = document.querySelector(".wrapper__content");
    element.style.position = "fixed";
    element.style.top = `-${scrollY}`;
  } else {
    let element = document.querySelector(".wrapper__content");
    let scrollY = element.style.top;
    document.querySelector(".wrapper__content").style.position = "";
    document.querySelector(".wrapper__content").style.top = "";
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    dem = 0;
  }
};
// lấY giá trị scroll top
window.addEventListener("scroll", () => {
  document.documentElement.style.setProperty(
    "--scroll-y",
    `${window.scrollY}px`
  );
});


let scrollFunction = () => {
  let element = document.querySelector(".header");

  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    element.classList.add("header-scroll");
  } else {
    element.classList.remove("header-scroll");
  }
};

window.onscroll = function () {
  scrollFunction();
};
