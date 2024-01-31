fetch("../title_structure.json")
  .then((response) => response.json())
  .then((data) => {
    // 获取当前页面的路径
    const path = window.location.pathname;

    // 提取并解码文件夹名称
    const folderName = decodeURIComponent(path.split("/").slice(-2, -1)[0]);
    const titleData = data.find((item) => item.folderName === folderName);

    if (titleData) {
      const mainContent = document.getElementById("main-content");
      const coverImagePathParts =
        titleData.volumes[0].coverImagePath.split("/");
      const coverImagePath = coverImagePathParts.slice(1).join("/"); // 使用第一卷的封面图片

      let htmlContent = `
          <div class="l-content_n l-content_n-sp">
            <article class="title-intro">
              <div class="title-intro__layout_image">
                <div class="title-intro__jk">
                  <img src="./${coverImagePath}" alt="" class="u-sz_w_100">
                </div>
              </div>
              <div class="title-intro__layout_text">
                <header class="title-intro__header">
                  <h1 class="title-intro__title">${titleData.title}</h1>
                  <span class="title-intro__creator">${titleData.author}</span>
                </header>
                <div class="title-intro__note">${titleData.summary}</div>
              </div>
              <a href="../" class="title-intro__back p-nav-btn p-nav-btn--prev" title="戻る"></a>
            </article>
          </div>
          <div class="l-content_l l-content_n-sp u-mg_b_5l">
            <section class="title-comics l-grid l-grid--5 l-grid--2-sp l-grid--gap-c_m l-grid--gap-r_2l">
        `;

      // 生成漫画卷列表部分
      titleData.volumes.forEach((volume) => {
        const imagePathParts = volume.coverImagePath.split("/");
        const imagePath = imagePathParts.slice(1).join("/");

        htmlContent += `
            <div class="title-comics__item">
              <section class="c-cardbox">
                <span class="c-cardbox__thumb c-cardbox__thumb--shadow p-bgimg p-bgimg--b6 p-bgimg--cover u-mg_b_n"
                  style="background-image:url('./${imagePath}')"></span>
                <span class="c-cardbox__text">
                  <span class="c-cardbox__title">${titleData.title} (${volume.volumeNumber})</span>
                  <span class="c-cardbox__date">Page: ${volume.pageCount}</span>
                  <span class="c-cardbox__btn-wrap">
                    <a href="./${volume.volumeName}.html?page=1" target="_blank" class="p-btn p-btn--primary u-sz_w_100">Read</a>
                  </span>
                </span>
              </section>
            </div>
          `;
      });

      htmlContent += `</section></div>`;
      mainContent.innerHTML = htmlContent;
    }
  })
  .catch((error) =>
    console.error("Error loading title_structure.json:", error)
  );
