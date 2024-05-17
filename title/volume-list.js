// 显示模态框的函数
function showModal(imagePath) {
  var modal = document.getElementById("imageModal");
  var modalImg = document.getElementById("img01");
  modal.style.display = "block";
  modalImg.src = imagePath; // 使用传入的 imagePath 而不是从元素中提取
  setTimeout(function() { 
    modal.classList.add("show");
  }, 10); // 这将同时触发背景和图片的渐变效果
}

// 初始化模态框和关闭按钮
document.addEventListener("DOMContentLoaded", function() {
  var modal = document.getElementById("imageModal");
  var closeModal = document.getElementById("closeModal");
  // 创建模态框的 HTML 结构
  var modalHTML = `
    <div id="imageModal" class="modal">
      <span id="closeModal" class="close">&times;</span>
      <img class="modal-content" id="img01">
      <div id="caption"></div>
    </div>
  `;
  // 将模态框的 HTML 结构添加到 body 的末尾
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  var modal = document.getElementById("imageModal");
  var closeModal = document.getElementById("closeModal");

  // 点击关闭按钮隐藏模态框
  closeModal.onclick = function() {
    modal.classList.remove("show"); // 移除 show 类来启动渐变效果
    modal.addEventListener('transitionend', function handler() {
      modal.style.display = "none";
      modal.removeEventListener('transitionend', handler); // 移除监听器，避免重复触发
    });
  };

  // 点击关闭按钮或遮罩层隐藏模态框
  closeModal.onclick = modal.onclick = function(event) {
    if (event.target === modal || event.target === closeModal) {
      modal.classList.remove("show"); // 触发渐变效果
      modal.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'opacity') { // 确保是透明度变化完成后再执行
          modal.style.display = "none";
          modal.removeEventListener('transitionend', handler);
        }
      });
    }
  };
});


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
      const coverPath = './cover.jpg';

      let htmlContent = `
          <div class="l-content_n l-content_n-sp">
            <article class="title-intro">
              <div class="title-intro__layout_image image-hover-text">
                <div class="title-intro__jk">
                  <a href="${titleData.url}" target="_blank">
                    <img src="${coverPath}" alt="" class="c-cardbox__thumb c-cardbox__thumb--shadow p-link_fade u-sz_w_100"></a>
                </div>
              </div>
              <div class="title-intro__layout_text">
                <header class="title-intro__header">
                  <h1 class="title-intro__title">${titleData.name}</h1>
                  <span class="title-intro__creator">${titleData.author.join('×')}</span>
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
        const imagePath = imagePathParts.slice(2).join("/");
        const volumeName = imagePathParts[2]; // 提取卷名
        const thumbnailPath = imagePath.split('/').slice(0, -1).join('/') + '.jpg'; // 生成缩略图路径
      
        htmlContent += `
            <div class="title-comics__item">
              <section class="c-cardbox">
                <span class="c-cardbox__thumb c-cardbox__thumb--shadow p-bgimg p-bgimg--b6 p-bgimg--cover p-link_fade u-mg_b_n"
                  style="background-image:url('./${thumbnailPath}')" onclick="showModal('./${imagePath}')"></span>
                <span class="c-cardbox__text">
                <span class="c-cardbox__title">${volume.volumeName} [${volume.volumeNumber}]</span>
                <span class="c-cardbox__date">Page: ${volume.pageCount}</span>
                <span class="c-cardbox__btn-wrap">
                  <a href="./${volumeName}.html" target="_blank" class="p-btn p-btn--primary u-sz_w_100">Read</a>
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
