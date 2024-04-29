import "intersection-observer";

class Animation {
  constructor({ el }) {
    this.el = el;

    this.observe();
  }

  animateIn() {}

  animateOut() {}

  observe() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    });

    this.observer.observe(this.el);
  }

  removeObserve() {
    if (this.observer && this.observer.unobserve) {
      this.observer.unobserve(this.el);
    }
  }
}

export default Animation;
