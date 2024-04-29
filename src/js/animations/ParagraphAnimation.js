import anime from "animejs/lib/anime.es.js";
import Animation from "../classes/Animation";
import { wrapLines } from "../utils/text";

class ParagraphAnimation extends Animation {
  constructor({ el }) {
    super({ el });

    this.addSpansToTitle();
  }

  addSpansToTitle() {
    wrapLines(this.el, "div", "inline-block flex justify-between");
  }

  animateIn() {
    const { height } = this.el.getBoundingClientRect();
    anime({
      targets: this.el.querySelectorAll("div"),
      opacity: [0, 1],
      translateY: [height, 0],
      delay: anime.stagger(300, { start: 1500 }),
      duration: 1000,
      easing: "spring(1, 100, 50, 0)",
    });
  }

  animateOut() {
    anime({
      targets: this.el,
      opacity: [1, 0],
      duration: 500,
    });
  }
}

export default ParagraphAnimation;
