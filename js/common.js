const htmlElem = document.querySelector('html');
const bodyElem = document.querySelector('body');
const mainHeader = document.querySelector('.main_header');
const btnHam = document.querySelector('.btn_ham');
const dimmedLayer = document.querySelector('.dimmed_layer');
const gnbMenu = document.querySelector('.gnb_list');
const gnbLis = gnbMenu.querySelectorAll('.list_item');
const gnbLine = document.querySelector('.gnb_line');
const btnSearch = document.querySelector('.list_item.search');
const btnCloseSearch = document.querySelector('.search_box .btn_close');
const slide = document.querySelector('.staple_item');
const contBox = document.querySelector('.contents');
const contBunch = document.querySelectorAll('.contents_list');
const asideCont = document.querySelector('.contents_aside');
const btnInfoToggle = document.querySelector('.btn_toggle');

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  layoutSize();
  setMediaQuery();
})
setSlide();
window.addEventListener('resize', layoutSize);
window.addEventListener('resize', resizeTimer);
btnSearch.addEventListener('click', actSearch);
btnCloseSearch.addEventListener('click', closeSearch);

// 미디어쿼리
function resizeTimer() {
  let resizeAlarm = '';
  clearTimeout(resizeAlarm);
  resizeAlarm = setTimeout(setMediaQuery, 100);
}
function setMediaQuery() {
  if (innerWidth >= 960) {
    // mobile 이벤트 제거
    btnHam.removeEventListener('click', mOpenMenu);
    gnbMenu.removeEventListener('click', mOpenSub);
    btnInfoToggle.removeEventListener('click', mShowFInfo);
    btnHam.classList.remove('on');
    mainHeader.classList.remove('hidden');
    dimmedLayer.classList.remove('active');
    bodyElem.classList.remove('prevent_scroll');
    // wide 이벤트 붙이기
    slideFix();
    window.addEventListener('resize', slideFix);
    window.addEventListener('scroll', slideFix);
    for (let li of gnbLis) {
      li.classList.remove('on');
      li.addEventListener('mouseenter', wideOpenSub);
      li.addEventListener('mouseleave', wideCloseSub);
    }
  } else {
    // wide 이벤트 제거
    window.removeEventListener('resize', slideFix);
    window.removeEventListener('scroll', slideFix);
    for (let li of gnbLis) {
      li.removeEventListener('mouseenter', wideOpenSub);
      li.removeEventListener('mouseleave', wideCloseSub);
    }
    slide.classList.remove('fix');
    slide.style.top = 'auto';
    // mobile 이벤트 붙이기
    btnHam.addEventListener('click', mOpenMenu);
    gnbMenu.addEventListener('click', mOpenSub);
    btnInfoToggle.addEventListener('click', mShowFInfo);
  }
}

// 헤더
// c - subMenu 있을 때 dropdown 클래스 추가
for (li of gnbLis) {
  if (li.querySelector('.gnb_sub')) li.classList.add('dropdown');
}
// c - 검색
function actSearch(ev) {
  if (ev.target.parentNode.parentNode !== btnSearch) return;
  btnSearch.classList.add('active');
  dimmedLayer.classList.add('active');
  bodyElem.classList.add('prevent_scroll');
}
function closeSearch(ev) {
  if (ev.target.parentNode !== btnCloseSearch) return;
  btnSearch.classList.remove('active'); 
  dimmedLayer.classList.remove('active');
  bodyElem.classList.remove('prevent_scroll');
}
// m - 햄버거버튼
function mOpenMenu() {
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
}
// m - 서브메뉴
function mOpenSub(ev) {
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
}
// m - 푸터 정보 더보기
function mShowFInfo() {
  this.classList.toggle('on');
}
// w - 서브 메뉴
function wideOpenSub() {
  const gnbTit = this.querySelector('.gnb_tit');
  let compStyles = window.getComputedStyle(gnbTit).paddingRight.split('px')[0];
  gnbLine.style.width = gnbTit.offsetWidth - compStyles + 'px';
  gnbLine.style.transform = `translateX(${gnbTit.offsetLeft}px)`;
  if (!this.classList.contains('dropdown')) return;
  this.classList.add('on');
  dimmedLayer.classList.add('active');
}
function wideCloseSub() {
  gnbLine.style.width = '0';
  gnbLine.style.transform = 'translateX(0)';
  if (!this.classList.contains('dropdown')) return;
  this.classList.remove('on');
  dimmedLayer.classList.remove('active');
}

// 본문 컨테이너
// c - 미디어 너비 별 레이아웃
function layoutSize() {
  if (innerWidth >= 720 && innerWidth < 960) {
    setLayout(contBunch[0], 2);
    setLayout(contBunch[1], 2);
  } else if (innerWidth >= 960 && innerWidth < 1199) { 
    setLayout(contBunch[0], 2);
    setLayout(contBunch[1], 3, 80);
  } else if (innerWidth >= 1200) { 
    setLayout(contBunch[0], 2);
    setLayout(contBunch[1], 3, 130);
  } else {
    contBox.style.height = 'auto';
    contBunch[0].style.height = 'auto';
    contBunch[1].style.height = 'auto';
  }
}
// c - 핀터레스트 레이아웃
function setLayout(item, num, brunchMargin=0) {
  let contLis = item.querySelectorAll('.list_item');
  let addHeight = [];
  let totalHeight = 0;
  // num 값만큼 배열의 공간 생성
  for (let j = 0; j < num; j++) {
    addHeight[j] = 0
  }
  for (let k = 0; k < contLis.length; k++) {
    // left값 지정
    if (k % num !== 0) contLis[k].style.left = contLis[k - 1].offsetLeft + contLis[k - 1].offsetWidth + 'px';
    else contLis[k].style.left = 0 + 'px';
    // top값 지정
    if (k >= num) contLis[k].style.top = contLis[k - num].offsetTop + contLis[k - num].offsetHeight + 'px';
    else contLis[k].style.top = 0 + 'px';
    // 각 열의 높이 구하기
    for (let j = 0; j < num; j++) {
      if (k % num === j) addHeight[j] = addHeight[j] + contLis[k].offsetHeight;
    }
  }
  // height 지정
  item.style.height = `${Math.max.apply(null, addHeight)}px`;
  // 2번째 이상의 contBrunch의 top값 조정과 contBox의 height 지정
  for (let i = 0; i < contBunch.length; i++) {
    if (i !== 0) contBunch[i].style.top = `${contBunch[i - 1].offsetHeight + brunchMargin}px`;
    totalHeight += contBunch[i].offsetHeight;
  }
  contBox.style.height = `${totalHeight + brunchMargin}px`;
}
// c - 슬라이드
function setSlide() {
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
    // 자동재생 타이머 걸기
    if (isTimerOn === true) {
      clearTimeout(timerId);
      timerId = setTimeout(() => showSlide(slideNext), timerSpeed);
    }
  }
  // 첫번째 슬라이드를 기본으로 시작
  showSlide(slideFirst);
}
// w - 슬라이드 픽스
function slideFix() {
  let diff = asideCont.offsetHeight - slide.offsetHeight;
  if (htmlElem.scrollTop > diff) {
    slide.classList.add('fix');
    slide.style.top = diff + asideCont.parentNode.offsetTop + 'px';
  } else {
    slide.classList.remove('fix');
    slide.style.top = 'auto';
  }
}