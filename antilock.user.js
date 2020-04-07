// ==UserScript==
// @name         Steam买买买
// @namespace    https://greasyfork.org/users/471937
// @version      0.5.2
// @description  在软锁区游戏商店页面自动显示widget、社区与愿望单链接
// @author       油油
// @match        *://store.steampowered.com/*
// @grant        none
// ==/UserScript==

window.addEventListener('load', function () {
    var url_path = location.pathname.split('/'),
        game_id = url_path[url_path.indexOf('app') + 1]
    var tmp;

    // 绑定全局变量
    var $ = window.jQuery,
        AddToWishlist = window.AddToWishlist

    // 匹配用户主页
    var user_id;
    tmp = $('a.user_avatar')
    if (tmp) user_id = tmp.attr('href').match(/(id|profiles)\/.+?\//)[0]
    console.log(user_id)

    // 反锁区
    tmp = $('#error_box')
    if (tmp[0]) {
        add_frame(`${location.origin}/widget/${game_id}`, tmp)
        var btn_div = $('<div>')
        tmp.append(btn_div)
        add_btn('添加到愿望单', () => {
            AddToWishlist(game_id)
            window.open(`https://store.steampowered.com/wishlist/${user_id}#sort=dateadded`)
        }, btn_div)
        add_btn('社区中心', `https://steamcommunity.com/app/${game_id}/`, btn_div)
    }

    // TODO: 分域名小功能
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
        var btn = $('<a>').append($('<span>').append(text))
            .addClass('btnv6_blue_blue_innerfade btn_medium noicon')
        pool.append(btn)
        if (typeof action == 'function') btn.on('click', action)
        else btn.attr('href', action)
    }

    function add_frame(url, pool) {
        pool.append(
            $('<iframe>').css('width', '100%')
                .attr('src', url)
                .on('load', function (x) {
                    this.style.height = `${this.contentWindow.document.body.scrollHeight}px`
                })
        )
    }
});