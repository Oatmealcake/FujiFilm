const htmlElem = document.querySelector('html');
const bodyElem = document.querySelector('body');
const mainHeader = document.querySelector('.main_header');
const btnHam = document.querySelector('.btn_ham');
const dimmedLayer = document.querySelector('.dimmed_layer');
const gnbMenu = document.querySelector('.gnb_list');
const gnbLis = gnbMenu.querySelectorAll('.list_item');
const btnSearch = document.querySelector('.list_item.search');
const btnCloseSearch = document.querySelector('.search_box .btn_close');
const slide = document.querySelector('.staple_item');
const asideCont = document.querySelector('.contents_aside');
const contLis = document.querySelectorAll('.contents_list > .list_item');
const service = document.querySelector('.service');
const sloganText = document.querySelector('.slogan_p');
const btnInfoToggle = document.querySelector('.btn_toggle');
let resizeAlarm = '';
let scrollAlarm = '';

// subMenu 있을 때 dropdown 클래스 추가
for (li of gnbLis) {
  if (li.querySelector('.gnb_sub')) li.classList.add('dropdown');
}
// 공통
const commonAct = {
  resizeTimer: function () {
    clearTimeout(resizeAlarm);
    resizeAlarm = setTimeout(commonAct.setMediaQuery, 100);
  },
  setMediaQuery: function () {
    if (innerWidth >= 960) {
      wideAct.start();
    } else {
      mobileAct.start();
    }
  },
  // 슬라이드
  setSlide: function () {
    const slideItem = document.querySelector('.staple_item .slide');
    const slideLiElem = document.querySelectorAll('.staple_item .slide .slide_item');
    const slideIndicator = document.querySelector('.staple_item .indicator');
    const indicatorAElem = document.querySelectorAll('.staple_item .indicator .item_link');
    const slideControlBtn = document.querySelectorAll('.staple_item .btn_control');
    let slideNow = 0;
    let slideNext = 0;
    let slideFirst = 0;
    let timerId = '';
    let isTimerOn = true;
    let timerSpeed = 3000;
  
    slideIndicator.addEventListener('click', slideActive);
  
    for (btn of slideControlBtn) {
      // 자동재생중일 경우와 아닐경우
      if (isTimerOn === true) {
        btn.classList.remove('on');
        if (btn.classList.contains('stop')) btn.classList.add('on');
      } else {
        btn.classList.remove('on');
        if (btn.classList.contains('play')) btn.classList.add('on');
      }
      // 재생, 멈춤 버튼
      btn.addEventListener('click', playControl);
    }
    function playControl(ev) {
      if (isTimerOn === true) {
        clearTimeout(timerId);
        ev.target.classList.remove('on');
        for (btn of slideControlBtn) {
          if (btn.classList.contains('play')) btn.classList.add('on');
        }
        isTimerOn = false;
      } else {
        timerId = setTimeout(() => showSlide(slideNext), timerSpeed);
        ev.target.classList.remove('on');
        for (btn of slideControlBtn) {
          if (btn.classList.contains('stop')) btn.classList.add('on');
        }
        isTimerOn = true;
      }
    }
    // 인디케이터 - 클릭된 것의 인덱스를 찾아 보여주기
    function slideActive(ev) {
      ev.preventDefault();
      if (ev.target.tagName !== 'A') return;
      for (let i = 0; i < indicatorAElem.length; i++) {
        if (indicatorAElem[i] === ev.target) {
          let num = i;
          showSlide(num);
        }
      }
    }
    // index번째의 슬라이드 보여주기
    function showSlide(index) {
      for (let i = 0; i < indicatorAElem.length; i++) {
        // 모든 on 지우기
        indicatorAElem[i].classList.remove('on');
        slideLiElem[i].classList.remove('on');
      }
      // index번째에 on 붙이기
      indicatorAElem[index].classList.add('on');
      slideLiElem[index].classList.add('on');
      // 현재와 다음 슬라이드 넘버링
      slideNow = index;
      slideNext = (slideNow === (indicatorAElem.length - 1)) ? 0 : (slideNow + 1);
      // console.log(slideNow, slideNext);
      // 자동재생 타이머 걸기
      if (isTimerOn === true) {
        clearTimeout(timerId);
        timerId = setTimeout(() => showSlide(slideNext), timerSpeed);
      }
    }
    // 첫번째 슬라이드를 기본으로 시작
    showSlide(slideFirst);
  },
  // 검색
  actSearch: function (ev) {
    if (ev.target.parentNode.parentNode !== btnSearch) return;
    btnSearch.classList.add('active');
    dimmedLayer.classList.add('active');
    bodyElem.classList.add('prevent_scroll');
  },
  closeSearch: function (ev) {
    if (ev.target.parentNode !== btnCloseSearch) return;
    btnSearch.classList.remove('active'); 
    dimmedLayer.classList.remove('active');
    bodyElem.classList.remove('prevent_scroll');
  },
  // msnry 레이아웃
  contentsLayout: function () {
    var elem = document.querySelectorAll('.contents_list');
    for (item of elem) {
      var msnry = new Masonry(item, {
        // options
        itemSelector: '.contents_list > .list_item',
        columnWidth: '.contents_list > .list_item',
        percentPosition: true,
        horizontalOrder: true
      });
    }
  },
  // 컨텐츠 애니메이션
  scrollEffect: function () {
    clearTimeout(scrollAlarm);
    scrollAlarm = setTimeout(commonAct.showCont, 70);
  },
  showCont: function () {
    for (let li of contLis) {
      if (htmlElem.scrollTop > (li.parentNode.offsetTop + li.offsetTop - window.innerHeight)) {
        li.style.transform = 'translateY(0)';
        li.style.visibility = 'visible';
        li.style.opacity = '1';
      }
    }
  },
  start: function () {
    window.addEventListener('resize', commonAct.resizeTimer);
    window.addEventListener('scroll', commonAct.scrollEffect);
    btnSearch.addEventListener('click', commonAct.actSearch);
    btnCloseSearch.addEventListener('click', commonAct.closeSearch);
    commonAct.setMediaQuery();
    commonAct.setSlide();
    commonAct.contentsLayout();
    commonAct.showCont();
  }
}
// 모바일
const mobileAct = {
  // 햄버거버튼
  mOpenMenu: function () {
    if (btnHam.classList.contains('on')) {
      btnHam.classList.remove('on');
      mainHeader.classList.remove('hidden');
      dimmedLayer.classList.remove('active');
      bodyElem.classList.remove('prevent_scroll');
    } else {
      btnHam.classList.add('on');
      mainHeader.classList.add('hidden');
      dimmedLayer.classList.add('active');
      bodyElem.classList.add('prevent_scroll');
    }
  },
  // 서브메뉴
  mOpenSub: function (ev) {
    ev.preventDefault();
    const targetLi = ev.target.parentNode;
    if (!targetLi.classList.contains('dropdown')) return;
    if (targetLi.classList.contains('on')) targetLi.classList.remove('on');
    else {
      for (li of gnbLis) {
        li.classList.remove('on');
      }
      targetLi.classList.add('on');
    }
  },
  mShowFInfo: function () {
    this.classList.toggle('on');
  },
  start: function () {
    // wide 제거
    window.removeEventListener('scroll', wideAct.wideScroll);
    for (let li of gnbLis) {
      if (!li.classList.contains('dropdown')) break;
      li.removeEventListener('mouseenter', wideAct.wideOpenSub);
      li.removeEventListener('mouseleave', wideAct.wideCloseSub);
    }
    slide.classList.remove('fix');
    slide.style.top = 'auto';
    // mobile
    btnHam.addEventListener('click', mobileAct.mOpenMenu);
    gnbMenu.addEventListener('click', mobileAct.mOpenSub);
    btnInfoToggle.addEventListener('click', mobileAct.mShowFInfo);
  }
}
// pc
const wideAct = {
  // 슬라이드 픽스
  wideScroll: function () {
    let diff = asideCont.offsetHeight - slide.offsetHeight;
    if (htmlElem.scrollTop > diff) {
      slide.classList.add('fix');
      slide.style.top = diff + asideCont.offsetTop + 'px';
    } else {
      slide.classList.remove('fix');
      slide.style.top = 'auto';
    }
  },
  // 서브 메뉴
  wideOpenSub: function () {
    this.classList.add('on');
    dimmedLayer.classList.add('active');
  },
  wideCloseSub: function () {
    this.classList.remove('on');
    dimmedLayer.classList.remove('active');
  },
  start: function () {
    // mobile 제거
    btnHam.removeEventListener('click', mobileAct.mOpenMenu);
    gnbMenu.removeEventListener('click', mobileAct.mOpenSub);
    btnInfoToggle.removeEventListener('click', mobileAct.mShowFInfo);
    btnHam.classList.remove('on');
    mainHeader.classList.remove('hidden');
    dimmedLayer.classList.remove('active');
    bodyElem.classList.remove('prevent_scroll');
    // wide
    wideAct.wideScroll();
    window.addEventListener('scroll', wideAct.wideScroll);
    for (let li of gnbLis) {
      if (!li.classList.contains('dropdown')) break;
      li.classList.remove('on');
      li.addEventListener('mouseenter', wideAct.wideOpenSub);
      li.addEventListener('mouseleave', wideAct.wideCloseSub);
    }
  }
}
commonAct.start();