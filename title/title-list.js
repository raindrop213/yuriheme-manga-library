fetch("title_structure.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("app-title-list");
    let htmlContent =
      '<section class="title-list-list l-grid l-grid--5 l-grid--2-sp l-grid--gap-c_m l-grid--gap-r_l u-mg_b_3l">';

    data.forEach((item) => {
      const path = item.folderName;
      htmlContent += `
            <a href="../title/${path}/index.html" class="c-cardbox p-link_fade">
              <span class="c-cardbox__thumb c-cardbox__thumb--shadow p-bgimg p-bgimg--b6 p-bgimg--cover u-mg_b_n"
                style="background-image:url('../title/${path}/cover.jpg')">
              </span>
              <span class="c-cardbox__text">
                <span class="c-cardbox__title">${item.name}</span>
                <span class="c-cardbox__meta">${item.author.join('×')}</span>
              </span>
            </a>
          `;
    });

    htmlContent += "</section>";
    container.innerHTML = htmlContent;
  });
