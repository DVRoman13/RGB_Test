
class Inputs {
  constructor(parent, el, type, error, isValid) {
    this.parent = parent;
    this.el = el;
    this.value = el.value;
    this.type = type;
    this.errorEl = error;
    this._isValid = isValid;
    this.commonError = 'Поле обязательно для заполнения';
    this.phoneCountry = 'ukraine'
    this.types = {
      text:  {
        error: 'Поле обязательно для заполнения'
      },
      textarea:  {
        error: 'Поле обязательно для заполнения'
      },
      email: {
        error: 'Пожалуйста, проверьте правильность введенного email'
      },
      phone: {
        error: 'Пожалуйста, проверьте правильность введенного номера'
      }
    };
    this.phoneTypes = {
      usa: {
        img: '../img/us.svg',
        mask: '(999)-999-9999'
      },
      ukraine: {
        img: '../img/ukraine.svg',
        mask: '+380 99 999 9999'
      }
    }
    this.addListeners();
  }

  updateValue(val) {
    this.value = val
  }

  addListeners() {
    this.el.addEventListener('focusout', function (e) {
      let val = e.target.value;
      this.updateValue(val);
      this.validate(this.type, val)
      let name = this.parent.querySelector('.label_name')
      if(!this.value) {
        name.classList.remove('show')
      }
      this.el.classList[this._isValid ? 'add' : 'remove']('success')

    }.bind(this))
    this.el.addEventListener('focus', function (e) {
      let name = this.parent.querySelector('.label_name')
      name.classList.add('show')
    }.bind(this))
    if(this.type === 'phone') {
      this.phoneChanger(this.parent, this.el)
    }
  }


  isEmpty(val) {
    if (val.length === 0 || val.length === false) {
      this.toggleError(this._isValid, this.commonError)
    }
  }

  phoneChanger(parent, el) {
    $(el).inputmask(this.phoneTypes.ukraine.mask);
    let trigger = parent.querySelector('.phone_country');
    let popUp = parent.querySelector('.phone_country_dropdown');
    let buttons = popUp.querySelectorAll('li')

    parent.addEventListener('click', function (e) {
      e.stopPropagation();
    })

    trigger.addEventListener('click', function (e) {
      popUp.classList.toggle('hide')
    })

    buttons.forEach((btn) => {
      btn.addEventListener('click', function (e){
        let country = e.currentTarget.getAttribute('data-name')
        this.phoneCountry = country
        $(el).inputmask(this.phoneTypes[country].mask);
        let img = trigger.querySelector('img')
        img.setAttribute('src', this.phoneTypes[country].img)
        popUp.classList.add('hide')
        this.el.value = ''
        this.value = ''
      }.bind(this))
    })



    document.onclick = function(e){
      popUp.classList.add('hide')
    };
  }

  validate(type, val) {
    switch (type) {
      case 'text':
        val = val.replace(/^\s*/, '').replace(/\s*$/, '');
        this.isValid = (val != false);
        this.isEmpty(val);
        break;

      case 'email':
        const regExMail = /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/;
        val = val.replace(/^\s*/, '').replace(/\s*$/, '');
        val = val.toLowerCase();
        this.isValid = regExMail.test(val);
        this.isEmpty(val);
        break;

      case 'phone':
        let newVal = val.replace(/[^+\d]/g, '');
        const regExеPhoneUk = /^((\+?3)?8)?0\d{9}$/;
        const regExеPhoneUsa = /^[0-9]{3}[0-9]{3}[0-9]{4}$/;
        switch (this.phoneCountry) {
          case 'ukraine':
            this.isValid = regExеPhoneUk.test(newVal);
            break;
          case 'usa':
            this.isValid = regExеPhoneUsa.test(newVal);
            break;
        }
        this.isEmpty(val);
        break;
    }
  }

  toggleError(remove, text){
    this.errorEl.innerText = text;
    this.errorEl.classList[remove? 'remove': 'add']('show');
    this.el.classList[remove? 'remove': 'add']('error');
  }


  set isValid (value) {
    this.toggleError(value, value ? this.commonError : this.types[this.type].error)
    this._isValid = value
  }

  get isValid () {
    return this._isValid
  }
}

class CustomSelect {
  constructor(el, options) {
    this.el = el;
    this.field = el.querySelector('.custom-select-field');
    this.dropdown = el.querySelector('.custom-select-dropdown')
    this.options = options
    this.label = el.querySelector('.label_name')
    this.error = el.querySelector('.error-valid')
    this.picked = []
    this.addListeners();
  }

  addListeners() {
    this.options.forEach((option) => {
      this.dropdown.appendChild(this.renderOption(option))
    })

    this.field.addEventListener('click',  (e) => {
      e.stopPropagation()
      this.dropdown.classList.toggle('hide')
    })


    document.onclick = (e) => {
      this.dropdown.classList.add('hide')
    };

  }

  renderOption(value) {
    let span = document.createElement('span')
    span.innerText = value
    span.setAttribute('data-value', value)
    span.addEventListener('click',  () => {
      this.selectOption(value)
    })
    return span
  }

  get isOptions()  {
    return this.picked.length > 0
  }

  get values() {
    return this.picked
  }

  renderSelectOption(value) {
    let span = document.createElement('span')
    span.innerText = value
    span.classList.add('selected_options')
    let delSelected = document.createElement('span')
    delSelected.classList.add('del')
    delSelected.addEventListener('click', ()=> {
      this.deleteSelectOption(value)
    })
    span.appendChild(delSelected)
    return span
  }

  deleteSelectOption(value) {
    let index = this.picked.indexOf(value);
    if(index < 0) return
    this.picked.splice(index, 1)
    this.selectedOptionseChanged()
  }

  selectOption(value) {
    this.label.classList.add('hide')
    this.error.classList.add('hide')
    let index = this.picked.indexOf(value);
    if(index >= 0) return
    this.picked.push(value)
    this.selectedOptionseChanged()
  }

  selectedOptionseChanged() {
    this.field.innerHTML = ''
    if(this.picked.length > 0) {
      this.picked.forEach((el) => {
        this.field.appendChild(this.renderSelectOption(el))
      })
    }

    if(this.picked.length < 1) {
      this.label.classList.remove('hide')
    }
  }
}

function createInputObj(inputs) {
  let arr = []
    for (let i = 0; i < inputs.length; i++) {
      let parent = inputs[i].parentNode;
      let errorEl = parent.querySelector('.error-valid');
      let input = new Inputs(parent, inputs[i], inputs[i].getAttribute('data-type'), errorEl,  false);
      arr.push(input);
  }
  return arr
}

function getRequsetData(inputs) {
  const data = {}
  inputs.forEach((input) => {
    data[input.el.getAttribute('data-name')] = input.value
  })

  return data
}

const inputs = document.querySelectorAll('.custom_inputs')
const createInputs = createInputObj(inputs);
const selectOptions = ['Html/CSS', 'JavaScript', 'jQuery', 'Bootstrap', 'Sass', 'React.js', 'Vue.js', 'node.js']
const customSelect = new CustomSelect (document.querySelector('.custom-select'), selectOptions)

const btn = document.querySelector('#form_button');

btn.addEventListener('click', function () {
  createInputs.forEach((input) => {
    input.value = input.el.value;
    input.validate(input.type, input.value);
    input.el.classList[input.isValid ? 'add' : 'remove']('success')
  })

  let isValidForm = createInputs.every(el => el.isValid)
  let isSelectPicked = customSelect.isOptions

  const error = document.querySelector('.custom-select').querySelector('.error-valid');
  error.classList[isSelectPicked ? 'add' :  'remove']('hide')


  if(isValidForm && isSelectPicked) {
    let data = getRequsetData(createInputs);
    data.skills = customSelect.values
    data.admin_email = 'dunaeroman1@gmail.com'
    $.ajax({
      url: 'mail.php',
      type: 'post',
      data: data,
      dataType: 'json',
      success: function (json) {
        console.log(json)
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr)
      }
    });
  }
})


