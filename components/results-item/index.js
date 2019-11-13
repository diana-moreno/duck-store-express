module.exports = function ({ item: { id, title, imageUrl, price, isFav }, favPath, detailPath }) {
  return(
    `<li class="duck duck--clicked">

      <form class='duck__favorite' method="post" action="${favPath}">
          <input type="hidden" name="id" value="${id}">
          <button class='duck__favorite' type="submit">
            <i class="${isFav
              ? 'fas fa-heart'
              : 'far fa-heart' }">
            </i>
          </button>
      </form>

      <h1 class='duck__title'>${title}</h1>
      <a href="${`${detailPath}/${id}`}">
        <img class='duck__image' src="${imageUrl}"/>
      </a>
      <button class='duck__button'>${price}</button>
    </li>`
  )
}
