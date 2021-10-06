const _getDOMelem = (attribute, value) => {
  return document.querySelector(`[${attribute}="${value}"]`);
};

export const mapListToDOMElements = (listOfValues, attribute) => {
  const _viewElems = {};

  for (const value of listOfValues) {
    _viewElems[value] = _getDOMelem(attribute, value);
  }

  return _viewElems;
};

export const createDOMElem = (tagName, className, innerText, src, backgroundImage) => {
  const tag = document.createElement(tagName);
  tag.classList = className;

  if (innerText) tag.innerText = innerText;
  if (src) tag.src = src;
  if (backgroundImage) tag.style.backgroundImage = `url(${backgroundImage})`;

  return tag;
};

export function disableScrolling() {
  var x = window.scrollX;
  var y = window.scrollY;
  window.onscroll = function () {
    window.scrollTo(x, y);
  };
}

export function enableScrolling() {
  window.onscroll = function () {};
}
