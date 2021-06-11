'use strict';

///////////////////////////////////////

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (elems) {
  elems.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//button scrolling##########################
const btnscrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnscrollto.addEventListener('click', function (e) {
  //getting cordinnates of element we wanna scroll to
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords, window.pageYOffset);
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  //morderrn way only supports mordern browser
  // section1.scrollIntoView({behavior:'smooth'})
});

// //rgb 255 255 255
// const randomint=function(min,max){
//   return Math.floor(Math.random()*(max-min+1)+min)
// }
// const randomecolor=()=>`rgb(${randomint(0,255)},${randomint(0,255)},${randomint(0,255)})`

// document.querySelector('.nav__link').addEventListener('click',function(e){
//   e.target.style.backgroundColor=randomecolor()//e target also works
//   console.log(e.target,e.currentTarget)
//   console.log("link")
//   //stopping propogation
//   e.stopPropagation()

// })
// document.querySelector('.nav__links').addEventListener('click',function(e){
//   this.style.backgroundColor=randomecolor()
//   console.log("container")
// })
// document.querySelector('.nav').addEventListener('click',function(e){
//   this.style.backgroundColor=randomecolor()
//   console.log("navbar")
// },true)

//page scroll#############################also page navigation click on any feature operator will scroll to that section

//event delegation

document.querySelectorAll('.nav__links').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault(); //bcz href will send to the section with id that is given to that href

    //matching strategy
    if (e.target.classList.contains('nav__link')) {
      const hrefid = e.target.getAttribute('href');
      document.querySelector(hrefid).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

//tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabscontent = document.querySelectorAll('.operations__content');
//event delegation
//adding event to common parent we are intersting in
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  if (!clicked) return;
  //removing class before adding in bcz buttons will stay lifted mup
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  //adding content
  //also removing active class to show only one content
  tabscontent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade

//event delegation
const nav = document.querySelector('.nav');
//mouseenter does not support bubbling
const hoverfunc = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //we didnt use closest method bcz there is no child element we can click in this

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  hoverfunc(e, 0.5);
});
//opposise of mouse over
nav.addEventListener('mouseout', function (e) {
  hoverfunc(e, 1);
});

//stickynav
// const initialcoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialcoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//sticky nav better intersection observer api

const navheight=nav.getBoundingClientRect().height
const header=document.querySelector(".header")
const stickynav=function(enteries){
  const [entry]=enteries
  // console.log(entry)
  if(!entry.isIntersecting)nav.classList.add("sticky")
  else nav.classList.remove("sticky")
}
const headerobserver=new IntersectionObserver(stickynav,{root:null,threshold:0,rootMargin:`-${navheight}px`,})//percentage and rem doesent work only pixel
headerobserver.observe(header)

//section revealing

const revealfunc=function(enteries,observer){
  const [entry]=enteries
  // console.log(entry)
  if(!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target)
}
const allsection=document.querySelectorAll(".section")
const revealoption={
  root:null,
  threshold:0.15,
}

const revealsection=new IntersectionObserver(revealfunc,revealoption)
allsection.forEach(function(section){
  revealsection.observe(section)
  section.classList.add("section--hidden")
})

//lazy loading

const imageTarget=document.querySelectorAll("img[data-src]")//selecting img with this special data attribute only

const loadImg=function(enteries,observer){
  const [entry]=enteries
  if(!entry.isIntersecting) return

  //replacing src with data-src
  entry.target.src=entry.target.dataset.src;
  //entry.target.classList.remove("lazy-img") if this is outside then slow new will be in problem
  //means the blur will be removed but img is still loading in bg bcz it adds a load event
  entry.target.addEventListener("load",function(){
    entry.target.classList.remove("lazy-img")
  })
  observer.unobserve(entry.target)
}

const imageobserver=new IntersectionObserver(loadImg,{
  root:null,
  threshold:0,
  rootMargin:"200px",
})

imageTarget.forEach(img=>{imageobserver.observe(img)})

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
