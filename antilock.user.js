// ==UserScript==
// @name         Steam买买买
// @namespace    https://greasyfork.org/users/471937
// @version      0.6.0
// @description  在软锁区游戏商店页面自动显示widget、社区与愿望单链接
// @author       油油
// @match        store.steampowered.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      steamdb.info
// ==/UserScript==

window.addEventListener('load', function () {
    var url_path = location.pathname.split('/'),
        game_id = url_path[url_path.indexOf('app') + 1],
        user_id, game_title, game_image, game_subid,
        steamdb_url = `https://steamdb.info/app/${game_id}/subs/`,
        tmp;

    // 绑定全局变量
    var $ = unsafeWindow.jQuery,
        AddToWishlist = unsafeWindow.AddToWishlist

    // 分域名处理
    switch (url_path[1]) {
        case 'widget':
        case 'sub': // 不作处理
            return
        case 'agecheck':
            // 自动agegate
            tmp = document.getElementsByClassName('agegate_birthday_selector')
            if (tmp.length) {
                document.getElementById('ageDay').value = 1
                document.getElementById('ageMonth').value = 'January'
                document.getElementById('ageYear').value = 1901
                console.log('test') // 未完成
            }
        case 'app':
            match_user()
            if (game_id) anti_lock()
            break
    }

    // 匹配用户主页
    function match_user() {
        tmp = $('a.user_avatar').attr('href')
        if (tmp) user_id = tmp.match(/(id|profiles)\/.+?\//)[0]
    }

    // 反锁区
    function anti_lock() {
        tmp = $('#error_box')
        if (tmp[0]) {
            tmp.html('')// 清除原始内容

            // widget iframe
            add_frame(`${location.origin}/widget/${game_id}`, tmp)
            var my_widget = $('<div>').css('width', '100%')
            tmp.append(my_widget)

            // 查询按钮
            var btn_div = $('<div>')
            tmp.append(btn_div)
            add_btn('添加到愿望单', () => {
                AddToWishlist(game_id)
                var wishlist_url = `/wishlist/${user_id}#sort=dateadded`
                if (game_title) wishlist_url += '&term=' + encodeURI(game_title)
                window.open(wishlist_url)
            }, btn_div)
            add_btn('社区中心', `https://steamcommunity.com/app/${game_id}/`, btn_div)

            // SteamDB查询信息
            query_steamDB(page => {
                // 匹配信息
                var title = page.find('.pagehead h1'),
                    icon = page.find('.row.app-row .span4 img'),
                    sub_tables = page.find('#subs table')
                game_title = title.text()
                game_image = icon[0]
                for (var i = 0; i < sub_tables.length; i++) {// 搜索游戏本地subID
                    var table = sub_tables[i]
                    try {
                        if (table.rows[0].cells[0].innerText.toUpperCase() == 'SUBID') {
                            for (var j = 1; j < table.rows.length; j++) {
                                var row = table.rows[j].cells
                                if (row[2].innerText.indexOf('Store') >= 0
                                    && $(row[1]).find('a').length > 0) {
                                    game_subid = row[0].innerText
                                }
                            }
                            break
                        }
                    } catch (e) { }
                }

                // 写入信息
                if (game_title) $('.pageheader').html(document.title = `买买买: ${game_title}`)
                if (game_image) my_widget.append(
                    $('<a>').attr('title', 'SteamDB').attr('href', steamdb_url).append(game_image)
                )
                if (game_subid) add_btn(`SubID: ${game_subid}`, `/sub/${game_subid}/?utm_source=SteamDB`, btn_div)
            })
        }
    }

    // 添加按钮
    function add_btn(text, action, pool) {
        var btn = $('<a>').append($('<span>').append(text))
            .addClass('btnv6_blue_blue_innerfade btn_medium noicon')
        pool.append(btn)
        if (typeof action == 'function') btn.on('click', action)
        else btn.attr('href', action)
    }

    // 添加iframe
    function add_frame(url, pool) {
        var loader
        pool.append(
            loader = $('<iframe>').css('width', '100%')
                .attr('src', url)
                .on('load', () => {
                    var ifr = loader[0]
                    if ($(ifr.contentWindow.document).find('img').length)
                        ifr.style.height = `${ifr.contentWindow.document.body.scrollHeight}px`
                    else ifr.parentNode.removeChild(ifr)
                })
        )
    }

    // SteamDB查询游戏信息
    var cached_page = null
    function query_steamDB(callback) {
        if (cached_page) callback(cached_page)
        else GM_xmlhttpRequest({
            method: 'GET',
            url: steamdb_url,
            onload: response => { callback(cached_page = $(response.responseText)) }
        })
    }
});