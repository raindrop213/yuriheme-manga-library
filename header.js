(function(){
    var content = `
    <div id="commonheader">
      <div id="commonheader_inner">
        <h1><a href="">Yuri·Hime·Lib</a></h1>
        <a href="/index.html">Yuri·Hime·Lib</a>
        
        <ul>
          <li class="head"><a href="https://www.ichijinsha.co.jp/yurihime/" target="_blank">Origin↗</a></li>
          <li class="tail"><a href="https://github.com/raindrop213/yuriheme-manga-library" target="_blank">Github↗</a></li>
        </ul>
      </div>
      <div id="commonheadertail"></div>
    </div>
    <svg display="none">
      <defs>
        <symbol id="logo" viewBox="0 0 160 50">
          <path class="p-logo-path" d="M39.69 5.61c-1.83 6.45-10.09 9.78-11.13 9.82 3.76.04 11.61-2.57 13.89-9.82h-2.76zM54.8 16.87H26.36v27.81c2.02 0 9.47 5.31 14.22 5.31s12.19-5.31 14.22-5.31V16.87zm-26.3 1.8h24.15v8.81H28.5v-8.81zm12.08 29.18c-3.04.16-8.66-3.37-12.08-4.85V29.28h24.15V43c-3.41 1.48-9.04 5.01-12.07 4.85zM21.02 4.31h38.31v-1.8H21.02v1.8zM89.13 0c-2.21 2.99-9.62 13.18-21.25 20.33 5.69-.81 15.35-9.16 21.25-16.54 5.89 7.38 15.56 15.73 21.24 16.54C98.74 13.18 91.34 2.99 89.13 0zM78.48 17.64v1.8h21.29v-1.8H78.48zm22.72 6.01H74.91v21.03c2.02 0 9.47 5.31 14.22 5.31s12.19-5.31 14.21-5.31V23.65h-2.14zm0 19.35c-3.42 1.48-9.04 5.01-12.07 4.85-3.04.16-8.66-3.37-12.08-4.85V25.45h24.15V43zm48.57 4.47V30.54h9.01V18.69h-9.01V5.56h8.65v-1.8h-21.38v41.8c2.18 0 6.37 4.43 11.48 4.43s9.3-4.43 11.48-4.43v-2.63c-2.37 0-6.44 3.92-10.23 4.54zm6.87-18.72h-17.46v-8.27h17.46v8.27zm-9.01-23.19v13.13h-8.45V5.56h8.45zm-8.45 24.98h8.45v16.98c-2.92-.32-6.04-2.74-8.45-3.93V30.54zm-5.1-18.43h-8.97l1.62-10.71h-2.22l-1.57 10.71h-4.85v1.8h4.59L120.8 26.7l6.85 8.95a34.539 34.539 0 0 1-10.78 13.18 26.856 26.856 0 0 0 12.04-11.52l5.64 7.36v-3.45l-4.6-5.97c2.83-6.18 4.13-13.93 4.13-23.14zm-11.1 14.09l1.86-12.29h7.15a53.544 53.544 0 0 1-3.4 19.57zM.66 10.85l5.55-.11.11.57h1.24V3.19l-.11-.8H6.32L.55 2.5l.11.8 5.55-.11.11 6.74-5.77.11zm-.09 4.93l.11.8a16.012 16.012 0 0 1 6.89 1.51l.15.07v-.17l-.07-1.28a17.761 17.761 0 0 0-6.16-.95c-.31 0-.62 0-.92.02zm6.39 6.18v-.22l-.05-1.33a11.365 11.365 0 0 0-5.23-1.71c-.09-.01-.17-.03-.26-.04v.01a.41.41 0 0 0-.11-.01l.09.67a13.151 13.151 0 0 1 5.39 2.49zm-6.28-.02v.01c-.03 0-.07-.01-.11-.01l.09.69a16.979 16.979 0 0 1 6.89 3.08l.17.13v-.21l-.05-1.35a13.571 13.571 0 0 0-6.72-2.3c-.09-.01-.17-.03-.27-.04zm1.96 9.79h1.15l-.02-.13a5.169 5.169 0 0 0-1.86-3.15h-.82l.13.18a7.886 7.886 0 0 1 1.42 3.1zm1.39-3.28h-.82l.13.18a7.886 7.886 0 0 1 1.42 3.1H5.9l-.02-.13a5.107 5.107 0 0 0-1.85-3.15zm-1.09 5.64v.51l.06.27.12-.03a11.2 11.2 0 0 0 4.86-2.83v-1.77l-.19.21a14.177 14.177 0 0 1-4.85 3.64zm5.21 5.78l.03-.11H6.63l-2.35.11h-.94l.29-.67h-.17l-1.35.08a12.193 12.193 0 0 1-1.98 4.57l-.13.18h.22L.86 44a10 10 0 0 0 2.05-3.33l2.81-.11h.77a17.953 17.953 0 0 1-5.02 8.69l-.17.18h1.11l.03-.02a17.336 17.336 0 0 0 5.39-8.51c.12-.34.24-.67.35-1.03h-.03z" fill-rule="evenodd"></path>
        </symbol>
      </defs>
    </svg>

    <div class="p-bg-head"></div>
    <header class="c-header js-scroll-amount js-sp-menu" data-sp-menu="init">

    <h1 class="c-header__logo">
      <a href="/" class="c-header__logo-link p-link_fade" title="一迅社 百合姫">
        <svg viewBox="0 0 160 50" class="c-header__logo-image">
          <use x="0" y="0" xlink:href="#logo"></use>
        </svg>
      </a>
    </h1>

    <nav class="c-header__menu e-sp-menu e-sp-menu--popup js-sp-menu" data-sp-menu="init">
      <ul class="c-mainmenu js-scroll-amount">

        <li class="c-mainmenu__item">
          <a href="/" class="c-mainmenu__link" data-menu-item="home">
            トップ
          </a>
        </li>

        <li class="c-mainmenu__item">
          <a href="/title/" class="c-mainmenu__link" data-menu-item="title">
            作品紹介
          </a>
        </li>

        <li class="c-mainmenu__item">
          <a href="/magazine/" class="c-mainmenu__link" data-menu-item="magazine">
            最新号
          </a>
        </li>

        <li class="c-mainmenu__item">
          <a href="/backnumber/" class="c-mainmenu__link" data-menu-item="backnumber">
            バックナンバー
          </a>
        </li>

        <li class="c-mainmenu__item">
          <a href="/logs/" class="c-mainmenu__link" data-menu-item="logs">
            開発日記
          </a>
        </li>

      </ul>
    </nav>

    <a class="p-hamburger js-hamburger" href="" data-hamburger-open="false">
      <span class="p-hamburger__line"></span>
      <span class="p-hamburger__line"></span>
      <span class="p-hamburger__line"></span>
    </a>

  </header>
    `
    document.write(content)
    })();
