module.exports = function( {login}) {
  return (
    `<section class='view view__registerSuccess'>
      <img class='view__registerSuccess--image' src="pato-madre-plana-sentirse-feliz-patitos_23-2148281518.jpg" alt="" />
      <h2 class='view__registerSuccess--title'>You have successfully registered!</h2>
      <a href="${login}">
        <button class='form__button form__button--register-back'
        >Back to login</button>
      </a>
    </section>`
  )
}
