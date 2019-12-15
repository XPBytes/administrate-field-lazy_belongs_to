function bindLazyBelongsTos() {
  const lazySelects = document.querySelectorAll('[data-component="lazy-belongs-to"]')

  lazySelects.forEach(lazySelect => {
    const target = lazySelect.querySelector('input[type="hidden"]')
    const input = lazySelect.querySelector('input[type="search"]')
    const button = lazySelect.querySelector('button[type="button"]')
    const popout = lazySelect.querySelector('[data-target="popout"]')
    const output = lazySelect.querySelector('[data-target="output"]')
    const select = output.querySelector('select')

    const options = JSON.parse(lazySelect.getAttribute('data-lazy-belongs-to'))

    let controller = undefined
    let lastResult = undefined
    let lastDebounce = undefined

    function onQuery (event) {
      const value = event.currentTarget.value

      if (controller) {
        // abort the previous request
        controller.abort()
        controller = new AbortController()
      } else {
        controller = new AbortController()
      }

      if (lastDebounce) {
        clearTimeout(lastDebounce)
      }

      const { signal } = controller

      lastDebounce = setTimeout(() => {
        lastDebounce = undefined

        fetch(options.url.replace('{q}', value).replace('%7Bq%7D', value), {
          signal,
          headers: { Accept: 'application/json' }
        })
          .then(r => r.json())
          .then(r => r.map(e => ({ value: e[options.value], label: e[options.label] })))
          .then(rs => {
            const currentResult = JSON.stringify((rs))

            if (lastResult && lastResult === currentResult) {
              return
            }

            lastResult = currentResult

            while (select.lastChild) {
              select.removeChild(select.lastChild);
            }

            const currentValue = target.value

            rs.forEach(r => {
              const option = document.createElement('option')
              option.setAttribute('value', r.value)
              option.innerText = r.label
              option.selected = currentValue === r.value
              select.appendChild(option)
            })

            select.setAttribute('size', "" + Math.max(2, Math.min(Number(select.getAttribute('data-max-size')), rs.length)))

            // Deselect if there was nothing selected
            if (!currentValue) {
              select.selectedIndex = -1
            }
          })
          .catch(error => {
            if (error.name === 'AbortError') {
              return /* ignore, this is an aborted promise */
            }
            console.error(error)
          })
      }, 250)
    }

    function showPopout() {
      popout.classList.add('active')
    }

    function hidePopout() {
      popout.classList.remove('active')
    }

    input.addEventListener('input', onQuery)
    button.addEventListener('click', showPopout)

    document.addEventListener('click', (e) => {
      const lazy = e.target && e.target.closest('[data-component="lazy-belongs-to"]')
      if (lazy !== lazySelect) {
        hidePopout()
      }
    })

    function pickValue(value, label) {
      target.value = value
      button.textContent = label
      hidePopout()
    }

    select.addEventListener('click', (e) => {
      if (e.target.value && e.target.value === e.currentTarget.value) {
        pickValue(
          e.target.value,
          e.target.textContent
        )

        e.stopImmediatePropagation()
        return
      }
    })

    select.addEventListener('change', (e) => {
      if (!e.currentTarget.value) {
        return
      }

      pickValue(
        e.currentTarget.value,
        e.currentTarget.selectedOptions[0].textContent
      )
    })

    button.removeAttribute('disabled')
  })
}

if (window.Turbolinks && window.Turbolinks.supported) {
  document.addEventListener("turbolinks:load", function () {
    bindLazyBelongsTos()
  })
} else {
  document.addEventListener('DOMContentLoaded', bindLazyBelongsTos)
}
