import anime from "animejs/lib/anime.es.js";
import Animation from "../classes/Animation";
import { wrapWords } from "../utils/text";

class TitleAnimation extends Animation {
  constructor({ el, delay = 0 }) {
    super({ el });

    this.delay = delay;
    this.animated = false;
  }

  animateIn() {
    if (this.animated) return;
    this.animated = true;

    const { height } = this.el.getBoundingClientRect();

    const timeline = anime.timeline();

    timeline.add({
      targets: this.el,
      opacity: [0, 1],
      translateY: [height / 2, 0],
      duration: 2000,
      easing: "spring(1, 80, 50, 0)",
      delay: this.delay,
    });
  }

  animateOut() {}
}

export default TitleAnimation;