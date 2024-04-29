export const wrapCharacters = (container, tag = "span", className) => {
  container.innerHTML = container.textContent.replace(
    /\S/g,
    `<${tag} ${className ? `class="${className}"` : ""}>$&</${tag}>`
  );

  return container;
};

export const wrapWords = (container, tag = "span", className) => {
  container.innerHTML = container.textContent.replace(
    /\S+/g,
    `<${tag} ${className ? `class="${className}"` : ""}>$&</${tag}>`
  );

  return container;
};

export const wrapLines = (container, tag = "span", className) => {
  const spans = wrapWords(container).children;

  const spansArray = Array.from(spans);

  const linesDict = spansArray.reduce((dict, span, index, arr) => {
    const { top } = span.getBoundingClientRect();

    return {
      ...dict,
      [top]: [...(dict[top] ? dict[top] : []), span],
    };
  }, {});

  Object.values(linesDict).map((line) => {
    const lineWrapper = document.createElement(tag);
    lineWrapper.className = className || "";

    line.forEach((span) => lineWrapper.appendChild(span));

    container.appendChild(lineWrapper);
  });

  return container;
};
