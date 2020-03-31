// ==UserScript==
// @name         Steam买买买
// @namespace    https://greasyfork.org/users/471937
// @version      0.5.1
// @description  在软锁区游戏商店页面自动显示widget、社区与愿望单链接
// @author       油油
// @match        *://store.steampowered.com/*
// @grant        none
// ==/UserScript==

window.addEventListener('load', function () {
    var url_path = location.pathname.split('/'),
        id = url_path[url_path.indexOf('app') + 1]
    var tmp;

    // 反锁区
    tmp = document.getElementById('error_box')
    if (tmp) {
        add_frame(`${location.origin}/widget/${id}`, tmp)
        var btn_div = document.createElement('div')
        tmp.appendChild(btn_div)
        add_btn('添加到愿望单', `javascript:AddToWishlist(${id});`, btn_div)
        add_btn('社区中心', `https://steamcommunity.com/app/${id}/`, btn_div)
    }

    switch (url_path[1]) {
        case 'agecheck':
            // 自动agegate
            tmp = document.getElementsByClassName('agegate_birthday_selector')
            if (tmp.length) {
                document.getElementById('ageDay').value = 1
                document.getElementById('ageMonth').value = 'January'
                document.getElementById('ageYear').value = 1901
                console.log('test') // 未完成
            }
            break
    }

    function add_btn(text, action, pool) {
        // 创建按钮
        var btn = document.createElement('a')
        btn.className = 'btnv6_blue_blue_innerfade btn_medium noicon'
        var btn_text = document.createElement('span')
        btn_text.innerText = text
        btn.appendChild(btn_text)
        pool.appendChild(btn)

        // 绑定动作
        if (typeof action == 'function') btn.onclick = action
        else btn.href = action
    }

    function add_frame(url, pool) {
        var ifr = document.createElement('iframe')
        ifr.style.width = '100%'
        ifr.addEventListener('load', () => {
            ifr.style.height = `${ifr.contentWindow.document.body.scrollHeight}px`
        })
        ifr.src = url
        pool.appendChild(ifr)
    }
});