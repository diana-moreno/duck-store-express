const Feedback = require('../feedback')

module.exports = function({ path, register, error }) {
  return (
    `<div class='view view__login'>
      <h1 class='view__login--title'>Duck Store</h1>
      <form
        class="form form--login" method="POST" action="${path}">
        <input class='form__input' type="text" name="username"
          placeholder="email"/>
        <input class='form__input' type="password" name="password"
          placeholder="password"/>
        <button type='submit' class='form__button form__button--login'>Login</button>
      </form>
      <a href="${register}">
        <button class='form__button form__button--register'>Create account
        </button>
      </a>
      <div class='feedback'>
        ${error ? Feedback({ message: error }) : ''}
      </div>
      <img  class='view__login--image' src="pato-madre-plano-patitos_23-2148282441.jpg" alt="family-ducks"/>
    </div>`
  )
}
