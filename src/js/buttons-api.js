export default class ButtonsAPI {
  constructor(spinner, content) {
    this.btn = '';
    this.elements = [
      spinner,
      content
    ]
  }

  setButton(button) {
    this.btn = button;
  }
  
  toggleSpinner(button) {
    this.setButton(button);
    this.btn.disabled = this.btn.disabled ? false : true;
    this.elements.forEach(element => {
      const buttonEl = this.btn.querySelector(`${element}`);
      if (buttonEl) {
        buttonEl.classList.toggle('d-none');
      }
    })
  }
}
