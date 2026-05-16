const domUtils = {
  getElementByLabel: (labelText) => {
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
      if (label.innerText.toLowerCase().includes(labelText.toLowerCase())) {
        if (label.control) return label.control;
        const forId = label.getAttribute('for');
        if (forId) return document.getElementById(forId);
      }
    }
    return null;
  },
  
  simulateInput: (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  }
};
