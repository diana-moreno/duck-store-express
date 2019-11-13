const Feedback = require('../feedback')

module.exports = function({ items, error, onItemRender }) {
  return (
    `<section class='view'>
      <div class='view__list'>
        <ul class='duck__list'>
          ${items ? items.map(item => onItemRender(item)).join('') : ""}
        </ul>
      </div>

      <div class='feedback--search'>
        ${error ? Feedback({ message: error }) : ''}
      </div>

    </section>`
  )
}
//join ?? hay que añadir join para transformar el array en string porque sino renderizará el string literal añadiendo las comas de separación.
