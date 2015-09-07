#### Map
***
API各种类中的核心部分，它用来在页面创建地图并操纵它      

##### 应用实例
```javascript
// 初始化一个地图在ID为map的div元素上，并指定地图中心位置以及缩放比例
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
});
```
##### 创建
|                           工厂函数                          | 描述          |
| ----------------------------------------------------------- |:-------------:|
|L.map( <HTMLElement|String> id, <Map options> options? )     | right-aligned |
