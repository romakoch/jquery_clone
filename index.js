class ElementCollection extends Array {

    ready(callback) {
        const isReady = this.some(e => {
            return e.readyState != null && e.readyState != 'loading'
        })
        if(isReady) {
            console.log(this)
            callback()
        } else {
            console.log(this)
            this.on('DOMContentLoaded', callback)
        }
        return this
    }

    on(event, callbackOrSelector, callback) {
        if (typeof(callbackOrSelector) === 'function') {
            this.forEach(e => e.addEventListener(event, callbackOrSelector))
        } else {
            this.forEach(elem => {
                elem.addEventListener(event, (e) => {
                    if (e.target.matches(callbackOrSelector)) {
                        callback(e)
                    }
                })
            })
        }
        return this
    }

    click(callbackOrSelector, callback) {
        this.on('click', callbackOrSelector, callback)
        return this
    }

    next() {
        return this.map(e => e.nextElementSibling).filter(e => e != null)
    }

    prev() {
        return this.map(e => e.previousElementSibling).filter(e => e != null)
    }

    removeClass(className) {
        this.forEach(e => e.classList.remove(className))
        return this
    }

    addClass(className) {
        this.forEach(e => e.classList.add(className))
        return this
    }

    toggleClass(className) {
        this.forEach(e => e.classList.toggle(className))
        return this
    }

    css(property, value) {
        this.forEach(e => {
            console.log(e)
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

}

function $(param) {
    if (typeof(param) === 'string') {
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
        this.promise = this.promise.then(data => {
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

$.get = function({url, data={}, success = () => {}, dataType}) {
    const queryString = Object.entries(data).map(([key, value]) => {
        return `${key}=${value}`
    }).join('&')
    return new AjaxPromise(fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': dataType
        }
    }).then(res => {
        if (res.ok) {
            return res.json()
        } else {
            throw new Error(res.status)
        }
    }).then(data => success(data)))
}

$(document).ready(() => {
    $(document).on('click', 'div', () => console.log('click!'))
})

// $('div').on('click', (e) => {
//     $('div').toggleClass('yellow').css('border', '1px solid #ccc')
//     $(e.target).hide()
// })

// $('div').click((e) => {
//     $('div').toggleClass('yellow').css('border', '1px solid #ccc')
//     $(e.target).hide()
// })