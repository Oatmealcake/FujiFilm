# 후지필름 홈페이지 클론

## 목표

- 시멘틱 마크업
- 모바일 퍼스트
- 반응형 웹사이트
- 슬라이드 구현
- Masonry 레이아웃 구현

## 사용 스택

**HTML, CSS, Vanilla JS**를 사용해 제작된 페이지입니다.

## 미리보기

|                   헤더 애니메이션                    |                  하단부 애니메이션                   |
| :--------------------------------------------------: | :--------------------------------------------------: |
| ![작은화면에서의 헤더](./readmeimg/mobileHeader.gif) | ![작은화면에서의 푸터](./readmeimg/mobileFooter.gif) |
|                   헤더 애니메이션                    |                스크롤시 슬라이드 고정                |
|  ![넓은화면에서의 헤더](./readmeimg/WideHeader.gif)  | ![넓은화면에서의 슬라이드](./readmeimg/slideFix.gif) |

## 구현 방식

### **1. Masonry Layout**

- 콘텐츠의 높이에 상관없이 순서대로 Z방향으로 정렬 되는 레이아웃
- 열의 갯수가 달라도 적용될 수 있도록 한다

처음엔 [Masonry](https://masonry.desandro.com/)의 라이브러리를 사용하고자 하였으나, 컨텐츠가 겹치거나 원하지 않는 공백이 나타나 직접 구현하게 되었다.

각각의 콘텐츠를 `position: absolute;`로 띄워야 했고, top값과 height값을 찾아 지정해 준 후 이 콘텐츠들을 감싸는 부모박스에 height값을 주어 위치를 잡을 수 있도록 해야했다.<br>

우선 n열일 경우 콘텐츠가 가지는 top값과 left값의 규칙을 찾아보자면 이랬다.<br>
top값 = 인덱스가 n보다 작으면 ? 0 , 크면 인덱스-n의 높이<br>
left값 = 인덱스를 n으로 나눈 나머지가 0이면 ? 0, 아니라면 인덱스-1의 넓이<br>

위의 규칙을 가지고 2열을 기준으로 테스트를 해 본 결과 맞아 떨어졌고, 이제 열의 갯수가 달라도 적용 될 수 있도록 만들어야 했다.

```js
function setLayout(item, num, brunchMargin = 0) {
  let contLis = item.querySelectorAll('.list_item');
  let addHeight = [];
  let totalHeight = 0;
  // num 값만큼 배열의 공간 생성
  for (let j = 0; j < num; j++) {
    addHeight[j] = 0;
  }
  for (let k = 0; k < contLis.length; k++) {
    // left값 지정
    if (k % num !== 0)
      contLis[k].style.left =
        contLis[k - 1].offsetLeft + contLis[k - 1].offsetWidth + 'px';
    else contLis[k].style.left = 0 + 'px';
    // top값 지정
    if (k >= num)
      contLis[k].style.top =
        contLis[k - num].offsetTop + contLis[k - num].offsetHeight + 'px';
    else contLis[k].style.top = 0 + 'px';
    // 각 열의 높이 구하기
    for (let j = 0; j < num; j++) {
      if (k % num === j) addHeight[j] = addHeight[j] + contLis[k].offsetHeight;
    }
  }
  // height 지정
  item.style.height = `${Math.max.apply(null, addHeight)}px`;
  // 2번째 이상의 contBrunch의 top값 조정
  for (let i = 0; i < contBunch.length; i++) {
    if (i !== 0)
      contBunch[i].style.top = `${
        contBunch[i - 1].offsetHeight + brunchMargin
      }px`;
    totalHeight += contBunch[i].offsetHeight;
  }
  // contBox의 height 지정
  contBox.style.height = `${totalHeight + brunchMargin}px`;
}
```

인자로는 레이아웃이 적용 될 박스를 item, 열의 갯수를 num, 박스 간 띄우고자 하는 간격을 brunchMargin 으로 받을 수 있도록 했다.<br>
콘텐츠의 길이가 모두 다르다보니, 각 열의 높이를 구해 제일 긴열을 기준으로 부모박스의 height가 될 수 있게 만들어 주는 것이 중요했다.<br>
빈 배열을 만들고 모든 콘텐츠를 돌면서 열의 합을 배열에 담았고, `Math.max.apply()`를 통해 배열에서 가장 큰 값을 찾아 할당 될 수 있게 했다.<br>
이 결과 한 페이지안에서 열의 갯수가 달라도 적용이 가능하게 되었다.<br>

이 방식을 이용할 때 주의점은 콘텐츠가 모두 로드 된 이후에 사용해야 한다는 점이다. 그 전에 이 함수를 사용하게 되면 높이를 받아오는 과정에서 이미지가 빠진 높이를 갖게 되며 콘텐츠들이 겹치는 현상이 발생한다.

### **2. 슬라이드**

```js
function setSlide() {
  const slideLiElem = document.querySelectorAll(
    '.staple_item .slide .slide_item'
  );
  const slideIndicator = document.querySelector('.staple_item .indicator');
  const indicatorAElem = document.querySelectorAll(
    '.staple_item .indicator .item_link'
  );
  const slideControlBtn = document.querySelectorAll(
    '.staple_item .btn_control'
  );
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
    // 재생, 멈춤 버튼 클릭 이벤트
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
    slideNext = slideNow === indicatorAElem.length - 1 ? 0 : slideNow + 1;
    // 자동재생 타이머 걸기
    if (isTimerOn === true) {
      clearTimeout(timerId);
      timerId = setTimeout(() => showSlide(slideNext), timerSpeed);
    }
  }
  // 첫번째 슬라이드를 기본으로 시작
  showSlide(slideFirst);
}
```

### **3. 스크롤시 슬라이드 고정**

`position:fixed;`로 고정되어 있다가 옆의 콘텐츠와 밑 변의 위치가 같아졌을 때, `position:absolute;`가 되며 위치가 고정되어야했다.<br>
슬라이드의 높이와 옆의 콘텐츠의 높이 차를 diff라는 변수에 저장해 scrollTop이 diff를 넘어섰을 때, top값이 지정되도록 했다.

```js
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
```
