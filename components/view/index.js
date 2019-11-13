module.exports = function({ body }) {
  return (
    `<!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Duck App</title>
          <link rel="stylesheet" href="/style.css">
          <link rel="shortcut icon" href="/icon.png" type="image/x-icon">
          <script src="https://kit.fontawesome.com/c0a664ee11.js"></script>
      </head>
      <body>
        ${body}
      </body>
    </html>`
  )
}
