fetch("../title/title_structure.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("app-backnumber-list");
    let items = []; // 创建一个空数组来存储所有项

    data.forEach((item) => {
      // 检查标题是否包含指定字符串，如果不需要这个条件，可以去掉这个if语句
      if (item.title.includes("コミック百合姫")) {
        item.volumes.forEach((volume) => { // 遍历每个作品的所有卷
          const path = encodeURIComponent(item.folderName);
          const imagePath = volume.coverImagePath; // 使用卷的封面图片路径
          // 将每个项作为字符串添加到数组中
          items.push(`<div class="home-comics__item">
              <a href="../title/${path}/" class="c-cardbox p-link_fade">
                <span class="c-cardbox__thumb c-cardbox__thumb--shadow p-bgimg p-bgimg--b6 p-bgimg--cover u-mg_b_n" style="background-image:url('../title/${imagePath}')"></span>
                <span class="c-cardbox__text">
                  <span class="c-cardbox__title">${volume.volumeName}</span> <!-- 使用卷名(volumeName) -->
                </span>
              </a>
            </div>
          `);
        });
      }
    });

    // 反转数组
    items = items.reverse();

    // 初始化htmlContent并添加反转后的items
    let htmlContent = '<section class="backnumber-list l-grid l-grid--5 l-grid--2-sp l-grid--gap-c_m l-grid--gap-r_m">';
    items.forEach((item) => {
      htmlContent += item;
    });
    htmlContent += "</section>";
    
    // 将构建好的htmlContent设置到container中
    container.innerHTML = htmlContent;
  });
