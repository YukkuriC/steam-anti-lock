# Steam买买买 v0.6

油猴脚本，在软锁区游戏商店页面自动显示widget、社区与愿望单链接

    处理您的请求时遇到错误：

    您所在的国家/地区不允许看到此内容。

[GreasyFork链接](https://greasyfork.org/scripts/399015/)
[Github项目地址](https://github.com/YukkuriC/steam-anti-lock)

## 实现功能

1. 匹配链接中的商品ID，自动生成购买链接的widget iframe与

2. 自动创建功能按钮
   1. 添加至愿望单
   2. 查看社区主页

3. 跨域接入[SteamDB](https://steamdb.info/)
   1. 通过游戏ID查询Sub ID、游戏标题、游戏图像
   2. 可访问Sub购买页面
   3. 可访问SteamDB查询页面

## TODO(或许有)

* 根据名称搜索游戏ID的API
* steam内部创建购物车sub form的API