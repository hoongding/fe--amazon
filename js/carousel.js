import Timer from './timer.js';
class Carousel {
  constructor(obj) {
    this.leftButton = document.querySelector(obj.CAROUSEL_LEFT_CLASS);
    this.rightButton = document.querySelector(obj.CAROUSEL_RIGHT_CLASS);
    this.carouselWindow = document.querySelector(obj.CAROUSEL_WINDOW_CLASS);
    this.container = this.carouselWindow.querySelector(
      obj.CAROUSEL_CONTAINER_CLASS,
    );
    this.IMG_COUNT = obj.imgCount; // 배경 이미지 개수만 변경하면 됨.
    this.timer = new Timer();
    this.startTime = obj.startTime;
  }

  init() {
    this.createCells();
    this.addBtnEvents();
    this.autoSlide();
  }

  addBtnEvents() {
    this.leftButton.addEventListener('click', () => {
      this.leftBtnClickEvent(0);
    });
    this.rightButton.addEventListener('click', () => {
      this.rightBtnClickEvent(1);
    });
  }

  createCells() {
    const imgSrcArr = Array.from(
      { length: this.IMG_COUNT },
      (_, i) => `../../asset/main_image${i + 1}.jpg`,
    );

    imgSrcArr.map((imgSrc) => {
      this.container.appendChild(this.createCellHTML(imgSrc));
    });
  }

  createCellHTML(imgSrc) {
    let cellHTML = document.createElement('div');
    cellHTML.setAttribute('class', 'carousel_img');
    cellHTML.style.backgroundImage = `url(${imgSrc})`;
    return cellHTML;
  }

  leftBtnClickEvent(direction) {
    this.container.style.transitionDuration = '500ms';
    this.container.style.transform = `translateX(${100 / this.IMG_COUNT}%)`;
    this.container.ontransitionend = () => {
      this.controlChildNodes(direction);
    };
    this.resetTimer();
  }

  rightBtnClickEvent(direction) {
    this.container.style.transitionDuration = '500ms';
    this.container.style.transform = `translateX(${
      (100 / this.IMG_COUNT) * -1
    }%)`;
    this.container.ontransitionend = () => {
      this.controlChildNodes(direction);
    };

    this.resetTimer();
  }

  controlChildNodes(direction) {
    this.container.removeAttribute('style');
    // style을 삭제해줌으로써 다음 슬라이드에 적용 가능하게끔!
    direction === 1
      ? this.container.appendChild(this.container.firstElementChild)
      : this.container.insertBefore(
          this.container.lastElementChild,
          this.container.firstElementChild,
        );
  }

  rightAnimation(timestamp) {
    if (this.startTime === null) this.startTime = timestamp;
    const now = timestamp;
    const duration = now - this.startTime;

    if (duration >= 5000) {
      this.container.style.transitionDuration = '500ms';
      this.container.style.transform = `translateX(${
        (100 / this.IMG_COUNT) * -1
      }%)`;
      this.container.ontransitionend = () => {
        this.controlChildNodes(1);
      };
      this.startTime = now;
    }

    const rightAnimationWithBoundThis = this.rightAnimation.bind(this);
    this.timer.playAnimation(rightAnimationWithBoundThis);
  }

  autoSlide() {
    this.timer.playAnimation((timestamp) => {
      this.rightAnimation(timestamp);
    });
  }
  resetTimer() {
    this.startTime = null;
    this.timer.resetAnimation(this.autoRightAnimation.bind(this));
  }
}

const obj = {
  imgCount: '5',
  startTime: null,
  CAROUSEL_LEFT_CLASS: '.carousel_left',
  CAROUSEL_RIGHT_CLASS: '.carousel_right',
  CAROUSEL_WINDOW_CLASS: '.carousel_window',
  CAROUSEL_CONTAINER_CLASS: '.carousel_container',
};

const carousel = new Carousel(obj);

carousel.init();
