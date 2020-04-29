function createOption(value) {
  const option = document.createElement("option");

  option.value = value;
  option.selected = true;
  option.textContent = value;

  return option;
}

function createTag(value) {
  const tag = document.createElement("div");
  tag.setAttribute("data-type", "tag");
  tag.textContent = value;

  return tag;
}

class TypedSelect extends HTMLElement {
  constructor() {
    super();

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  connectedCallback() {
    const DATALIST_ID = `datalist_${this.getAttribute("select")}`;

    const select = document.getElementById(this.getAttribute("select"));
    select.onchange = this.onSelectChange;
    this.select = select;

    const input = document.createElement("input");
    input.autocomplete = false;
    input.setAttribute("list", DATALIST_ID);
    input.onchange = this.onInputChange;
    input.onkeydown = this.onInputKeyDown;
    this.input = input;
    this.appendChild(input);

    const datalist = document.createElement("datalist");
    datalist.id = DATALIST_ID;
    this.datalist = datalist;
    this.appendChild(datalist);

    this.createDatalistOptions();
    this.createTags();
  }

  onSelectChange() {
    this.input.value = "";
    // this.input.dispatchEvent(new Event("change", { bubbles: true }));
    this.createDatalistOptions();
    this.createTags();
  }

  onInputChange(e) {
    e.stopPropagation();
    this.updateSelect(e.target.value);
  }

  onInputKeyDown(e) {
    const value = e.target.value;

    if (e.keyCode === 8 && value.length === 0) {
      const options = [...this.select.options];
      options.reverse().every((option) => {
        if (option.selected) {
          option.selected = false;
          return false;
        }
        return true;
      });

      this.select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (e.keyCode === 13 && value.length > 0) {
      e.preventDefault();
      this.updateSelect(value);
    }
  }

  updateSelect(value) {
    const option = this.select.querySelector(`[value="${value}"]`);

    if (option !== null) {
      if (!option.selected) {
        option.selected = true;
        this.select.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        this.input.value = "";
      }
    } else {
      if (this.hasAttribute("creatable")) {
        this.select.appendChild(createOption(value));
        this.select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }

  createTags() {
    const tags = this.querySelectorAll("[data-type='tag'");
    tags.forEach((tag) => {
      tag.remove();
    });

    for (const option of this.select.options) {
      if (option.selected == true) {
        this.insertBefore(createTag(option.value), this.input);
      }
    }
  }

  createDatalistOptions() {
    this.datalist.innerHTML = "";

    for (const option of this.select.options) {
      if (option.selected != true) {
        const o = document.createElement("option");
        o.value = option.value;
        this.datalist.appendChild(o);
      }
    }
  }
}

customElements.define("typed-select", TypedSelect);
