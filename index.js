class ElementCollection extends Array {
  ready(callback) {
    const isReady = this.some((e) => {
      return e.readyState != null && e.readyState != 'loading'
    })
    if (isReady) {
      console.log(this)
      callback()
    } else {
      console.log(this)
      this.on('DOMContentLoaded', callback)
    }
    return this
  }

  on(event, callbackOrSelector, callback) {
    if (typeof callbackOrSelector === 'function') {
      this.forEach((e) => e.addEventListener(event, callbackOrSelector))
    } else {
      this.forEach((elem) => {
        elem.addEventListener(event, (e) => {
          if (e.target.matches(callbackOrSelector)) {
            callback(e)
          }
        })
      })
      return this
    }
    return this
  }

  click(callbackOrSelector, callback) {
    this.on('click', callbackOrSelector, callback)
    return this
  }

  next() {
    return this.map((e) => e.nextElementSibling).filter((e) => e != null)
  }

  prev() {
    return this.map((e) => e.previousElementSibling).filter((e) => e != null)
  }

  removeClass(className) {
    this.forEach((e) => e.classList.remove(className))
    return this
  }

  addClass(className) {
    this.forEach((e) => e.classList.add(className))
    return this
  }

  toggleClass(className) {
    this.forEach((e) => e.classList.toggle(className))
    return this
  }

  css(property, value) {
    this.forEach((e) => {
      //   console.log(e)
      e.style.setProperty(property, value)
    })
    return this
  }

  hide() {
    this.css('display', 'none')
    return this
  }

  show(display = 'block') {
    this.css('display', display)
    return this
  }

  fadeIn(howLong = 1) {
    console.log(this)
    this.css('transition', `opacity ${howLong}s ease-in`)
    this.css('opacity', '0')

    setTimeout(() => {
      this.hide()
      // this.css('transition', `none`)
    }, howLong * 1000)

    return this
  }

  fadeOut(howLong = 1, display = 'block') {
    // console.log(this)
    this.show(display)

    this.css('transition', `opacity ${howLong}s ease-in`)

    setTimeout(() => {
      this.css('opacity', '1')
    })

    return this
  }

  fadeTo(to, howLong = 1) {
    this.css('transition', `opacity ${howLong}s ease-in`)
    this.css('opacity', to)
    return this
  }

  fadeToggle(howLong) {
    const param = this.some(
      (e) => e.style.opacity === '1' || e.style.opacity === ''
    )
    if (param) {
      this.fadeIn(howLong)
    } else {
      this.fadeOut(howLong)
    }
  }
}

function $(param) {
  if (typeof param === 'string') {
    return new ElementCollection(...document.querySelectorAll(param))
  } else {
    return new ElementCollection(param)
  }
}

class AjaxPromise {
  constructor(promise) {
    this.promise = promise
  }

  done(callback) {
    this.promise = this.promise.then((data) => {
      callback(data)
      return data
    })
    return this
  }

  fail(callback) {
    this.promise = this.promise.catch(callback)
    return this
  }

  always(callback) {
    this.promise = this.promise.finally(callback)
    return this
  }
}

$.get = function ({ url, data = {}, success = () => {}, dataType }) {
  const queryString = Object.entries(data)
    .map(([key, value]) => {
      return `${key}=${value}`
    })
    .join('&')
  return new AjaxPromise(
    fetch(`${url}?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': dataType,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(res.status)
        }
      })
      .then((data) => success(data))
  )
}

$(document).ready(() => {
  // $(document).on('click', 'div', () => console.log('click!'))
  console.log('Loaded!')
  $('#button').on('click', (e) => {
    $('div').fadeIn()
  })
  $('#button2').on('click', (e) => {
    $('div').fadeOut()
  })
  $('#button3').on('click', (e) => {
    $('div').fadeTo(0.4)
  })
  $('#button4').on('click', (e) => {
    $('div').fadeToggle(0.4)
  })
})

// $('div').on('click', (e) => {
//     $('div').toggleClass('yellow').css('border', '1px solid #ccc')
//     $(e.target).hide()
// })

// $('div').click((e) => {
//     $('div').toggleClass('yellow').css('border', '1px solid #ccc')
//     $(e.target).hide()
// })

$('div').click((e) => {
  $(e.target).css('opacity', '0')
})

// $('#button').click((e) => {
//   e.preventDefault()
//   console.log(e.target.style)
// })
