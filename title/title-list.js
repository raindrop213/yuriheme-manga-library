fetch("title_structure.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("app-title-list");
    let htmlContent =
      '<section class="title-list-list l-grid l-grid--5 l-grid--2-sp l-grid--gap-c_m l-grid--gap-r_l u-mg_b_3l">';

    data.forEach((item) => {
      const path = encodeURIComponent(item.folderName);
      const imagePath = item.volumes[0].coverImagePath;
      htmlContent += `
            <a href="./${path}/" class="c-cardbox p-link_fade">
              <span class="c-cardbox__thumb c-cardbox__thumb--shadow p-bgimg p-bgimg--b6 p-bgimg--cover"
                style="background-image:url('${imagePath}')"></span>
              <span class="c-cardbox__text">
                <span class="c-cardbox__title">${item.title}</span>
                <span class="c-cardbox__meta">${item.author}</span>
              </span>
            </a>
          `;
    });

    htmlContent += "</section>";
    container.innerHTML = htmlContent;
  });
