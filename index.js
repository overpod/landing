class Slider {
  constructor(props) {
    this.rootElement = props.element;
    this.slides = Array.from(this.rootElement.querySelectorAll('.slider-list__item'));
    this.slidesLength = this.slides.length;
    this.current = 0;
    this.isAnimating = false;
    this.direction = 1; // -1
    this.duration = 0.5;
    this.navBar = this.rootElement.querySelector('.slider__nav-bar');
    this.slides.forEach((_, index) => {
      let link = this.navBar.appendChild(document.createElement('a'));
      link.className = index === 0 ? 'nav-control nav-control_active' : 'nav-control';
    });
    this.thumbs = Array.from(this.rootElement.querySelectorAll('.nav-control'));
    this.prevButton = this.rootElement.querySelector('.slider__arrow_prev');
    this.nextButton = this.rootElement.querySelector('.slider__arrow_next');

    this.slides[this.current].classList.add('slider-list__item_active');
    this.thumbs[this.current].classList.add('nav-control_active');

    this._bindEvents();
    setInterval(() => this.goNext(), 3000);
  }

  goTo(index, dir) {
    if (this.isAnimating) return;
    const self = this;
    let prevSlide = this.slides[this.current];
    let nextSlide = this.slides[index];

    self.isAnimating = true;
    self.current = index;

    const changeNextFrame = () => {
      nextSlide.classList.add('slider-list__item_active');
      prevSlide.classList.remove('slider-list__item_active');
      self.thumbs.forEach((item, index) => {
        const action = index === self.current ? 'add' : 'remove';
        item.classList[action]('nav-control_active');
      });
      prevSlide.style.left = null;
      nextSlide.style.opacity = null;
      self.isAnimating = false;
    };

    const showNextSlide = () => {
      const timeout = 1;
      let i = dir ? 0 : 100;
      nextSlide.style.opacity = 1;
      nextSlide.style.left = dir === 1 ? '100%' : '-100%';
      setTimeout(function run() {
        i = dir === 1 ? (i = i - 1) : (i = i + 1);
        if (i < -100 || i > 100) {
          changeNextFrame();
          return;
        }
        prevSlide.style.left = `${i}%`;
        nextSlide.style.left = `${dir === 1 ? 100 + i : -100 + i}%`;
        setTimeout(run, timeout);
      }, timeout);
    };

    showNextSlide();
  }

  goStep(dir) {
    let index = this.current + dir;
    let len = this.slidesLength;
    let currentIndex = (index + len) % len;
    this.goTo(currentIndex, dir);
  }

  goNext() {
    this.goStep(1);
  }

  goPrev() {
    this.goStep(-1);
  }

  _navClickHandler(e) {
    const self = this;
    if (self.isAnimating) return;
    let target = e.target.closest('.nav-control');
    if (!target) return;
    let index = self.thumbs.indexOf(target);
    if (index === self.current) return;
    let direction = index > self.current ? 1 : -1;
    self.goTo(index, direction);
  }

  _bindEvents() {
    const self = this;
    ['goNext', 'goPrev', '_navClickHandler'].forEach((method) => {
      self[method] = self[method].bind(self);
    });
    self.nextButton.addEventListener('click', self.goNext);
    self.prevButton.addEventListener('click', self.goPrev);
    self.navBar.addEventListener('click', self._navClickHandler);
  }
}

new Slider({
  element: document.querySelector('.slider'),
});
