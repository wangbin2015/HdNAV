### 一、Map
***
API各种类中的核心部分，它用来在页面创建地图并操纵它      

#### 1、应用实例
```javascript
// 初始化一个地图在ID为map的div元素上，并指定地图中心位置以及缩放比例
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
});
```
#### 2、创建

|工厂函数|描述|
|---|:---:|
|`L.map( <HTMLElement|String> id, options? )`|通过div元素和带有地图选项的描述的文字对象来实例化一个地图对象，其中文字对象是可选的|

#### 3、可选参数
##### （1）地图状态选项
|Option|Type|Default|Description|
|:---:|:---:|:---:|:---|
|center|LatLng|null|初始化地图的地理中心|
|zoom|Number|null|初始化地图的缩放|
|layers|ILayer[]|null|初始化将要加载到地图上的图层|
|minZoom|Number|null|地图的最小视图，可以重写任何地图图层上的最小视图|
|maxZoom|Number|null|地图的最大视图，可以重写任何地图图层上的最大视图|
|maxBounds|LatLngBounds|null|当这个选项被设置后，地图被限制在给定的地理边界内，当用户平移将地图拖动到视图以外的范围时会出现弹回的效果，并且也不允许缩小视图到给定范围以外的区域（这取决于地图的尺寸），使用setMaxBounds方法可以动态地设置这种约束|
|crs|CRS|L.CRS.EPSG3857|使用的坐标系，当你不确定坐标系是什么时请不要更改|

##### （2）交互选项
|Option|Type|Default|Description|
|:---:|:---:|:---:|:---|
|dragging|Boolean|true|地图是否可被鼠标或触摸拖动|
|touchZoom|Boolean|true|地图是否可被两指缩放|
|scrollWheelZoom|Boolean|true|地图是否可被鼠标滚轮缩放， If passed 'center', it will zoom to the center of the view regardless of where the mouse was.|
|doubleClickZoom|Boolean|true|地图是否可以双击放大或者按住shift双击缩小If passed 'center', double-click zoom will zoom to the center of the view regardless of where the mouse was.|
|boxZoom|Boolean|true|当按住shift键时，地图是否可被缩放到鼠标拖拽出的矩形的视图|
|tap|Boolean|true|Enables mobile hacks for supporting instant taps (fixing 200ms click delay on iOS/Android) and touch holds (fired as contextmenu events).|
|tapTolerance|Number|15|The max number of pixels a user can shift his finger during touch for it to be considered a valid tap.|
|trackResize|Boolean|true|浏览器窗口大小改变时，地图是否可以自动更新视图|
|worldCopyJump|Boolean|false|当这个选项可用时，当你平移地图到其另一个领域时会被地图捕获到，并无缝地跳转到原始的领域以保证所有标注、矢量图层之类的覆盖物仍然可见|
|closePopupOnClick|Boolean|true|当你不想用户点击地图关闭消息弹出框时，请将其设置为false|
|bounceAtZoomLimits|Boolean|true|如果你不想变焦操作时超出设置的最大/最小视图，并且当修改缩放比例时弹回，请将其设置为false|

##### （3）键盘操纵选项
|Option|Type|Default|Description|
|:---:|:---:|:---:|:---|
|keyboard|Boolean|true|使地图可聚焦，允许用户使用键盘方向键或者+/-操纵地图|
|keyboardPanOffset|Number|80|平移补偿：确定按键盘方向键时地图平移的像素|
|keyboardZoomOffset|Number|1|缩放补偿：确定键盘加减键对于的缩放级数|

##### （4）平移惯性选项
|Option|Type|Default|Description|
|:---:|:---:|:---:|:---|
|inertia|Boolean|true|如果该选项可用，平移地图时会有惯性效果，触屏设备体验更佳|
|inertiaDeceleration|Number|3000|惯性移动减速的速率，单位是像素每秒的二次方|
|inertiaMaxSpeed|Number|1500|惯性移动的最大速率，单位是像素每秒|
|inertiaThreshold|Number|depends|释放鼠标或是触摸来停止惯性移动与移动停止之间的毫秒数，触摸设备默认值32，其余默认值14|

##### （5）控制选项
|Option|Type|Default|Description|
|:---:|:---:|:---:|:---|
|zoomControl|Boolean|true|缩放控制是否默认加载在地图上|
|attributionControl|Boolean|true|属性控制是否默认加载在地图上|

##### （6）动画选项
|Option|Type|Default|Description|
|:---:|:---:|:---:|:---|
|fadeAnimation|Boolean|depends|tile淡出动画是否可用，通常默认在所有浏览器中都支持CSS3 Transitions属性 ，android例外|
|zoomAnimation|Boolean|depends|tile变焦动画是否可用，通常默认在所有浏览器中都支持CSS3 Transitions属性 ，android例外|
|zoomAnimationThreshold|Number|4|如果变焦比例超过设定值，不会产生变焦动画|
|markerZoomAnimation|Boolean|depends|标记是否随地图的变焦操作而放大或缩小，如果被禁用，标记会在动画时消失，通常默认在所有浏览器中都支持CSS3 Transitions属性，android例外|

#### 4、事件
你可以用这些方法订阅以下事件      

|Event|Data|Description|
|:---:|:---:|:---|
|click|MouseEvent|用户点击或触摸地图时触发|
|dblclick|MouseEvent|用户双击或连续两次触摸地图时触发|
|mousedown|MouseEvent|用户按下鼠标按键时触发|
|mouseup|MouseEvent|用户释放鼠标按键时触发|
|mouseover|MouseEvent|鼠标进入地图时触发|
|mouseout|MouseEvent|鼠标离开地图时触发|
|mousemove|MouseEvent|鼠标在地图上移动时触发|
|contextmenu|MouseEvent|当用户在地图上按下鼠标右键时触发，如果这个事件上有注册事件，则浏览器默认的右键菜单被禁用，在移动端当用户长按屏幕同样触发|
|focus|Event|当用户通过设置标记、点击或平移聚焦地图时触发|
|blur|Event|当地图失去焦点时触发|
|preclick|MouseEvent|当鼠标在地图上点击之前触发（当你想要一些事件，在任何已存在的点击事件开始运行之前，点击鼠标发生）|
|load|Event|当地图初始化时触发。（当地图的中心点和缩放比例初次设置时）|
|unload|Event|当地图通过remove方法移除时发生|
|viewreset|Event|当地图需要重绘内容时触发（通常在地图缩放和载入时发生）创建自定义的叠置图层时非常有用|
|movestart|Event|地图视图开始改变时触发。（比如用户开始拖动地图）|
|move|Event|所有的地图视图移动时触发|
|moveend|Event|当地图视图结束改变时触发。（比如用户停止拖动地图）Fired when the view of the map stops changing (e.g. user stopped dragging the map).|
|dragstart|Event|用户开始拖动地图时触发。Fired when the user starts dragging the map.|
|drag|Event|用户拖动地图时不断重复地触发。Fired repeatedly while the user drags the map.|
|dragend|DragEndEvent|用户停止拖动时触发。Fired when the user stops dragging the map.|
|zoomstart|Event|当地图缩放即将发生时触发。（比如缩放动作开始前）Fired when the map zoom is about to change (e.g. before zoom animation).|
|zoomend|Event|当地图缩放时触发。Fired when the map zoom changes.|
|zoomlevelschange|Event|Fired when the number of zoomlevels on the map is changed due to adding or removing a layer.|
|resize|ResizeEvent|Fired when the map is resized.|
|autopanstart|Event|Fired when the map starts autopanning when opening a popup.|
|layeradd|LayerEvent|Fired when a new layer is added to the map.|
|layerremove|LayerEvent|Fired when some layer is removed from the map.|
|baselayerchange|LayerEvent|Fired when the base layer is changed through the layer control.|
|overlayadd|LayerEvent|Fired when an overlay is selected through the layer control.|
|overlayremove|LayerEvent|Fired when an overlay is deselected through the layer control.|
|locationfound|LocationEvent|Fired when geolocation (using the locate method) went successfully.|
|locationerror|ErrorEvent|Fired when geolocation (using the locate method) failed.|
|popupopen|PopupEvent|Fired when a popup is opened (using openPopup method).|
|popupclose|PopupEvent|Fired when a popup is closed (using closePopup method).|
