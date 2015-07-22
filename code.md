# UC Demo Code

## Require LayerList Widget

[LayerList](https://developers.arcgis.com/javascript/jsapi/layerlist-amd.html)

```javascript
    "esri/dijit/LayerList",
```

```javascript
    LayerList
```

## Add LayerList widget

```javascript
    var layerList = new LayerList({
      map: this.map
    },"layerListDom");
    layerList.startup();
```   
        
```html
    <div id="layerListDom"></div>
```   
        
## Side Drawer

Add HTML for title, and side drawer
        
```html
    <div class="drawer-container">
      <div class="drawer-side drawer-animation theme-background">
        <h1 id="mapTitle"></h1>
        <div id="layerListDom"></div>
      </div>
      <div class="drawer-center">
        <div class="drawer-top drawer-animation theme-background">
          <div id="toggle" class="toggle">
            <span class="esri-icon-expand"></span>
            <span class="esri-icon-collapse"></span>
            <span>Info</span>
          </div>
        </div>
        <div id="mapDiv" dir="ltr"></div>
      </div>
    </div>
```

## CSS Styles for app

Add CSS Styles for the drawer and template theme.

```css
    h1 {
      margin: 0 0 10px 0;
      padding: 0;
      font-weight: normal;
    }

    .esriSimpleSlider {
      top: 75px;
    }

    .drawer-open .esriSimpleSlider {
      left: 300px;
    }

    .toggle {
      text-align: center;
      padding: 6px 10px;
      margin: 0 10px;
      box-sizing: border-box;
      cursor: pointer;
      line-height: normal;
      display: inline-block;
      vertical-align: middle;
      background-color: rgba(0,0,0,0.15);
    }

    .toggle:hover,
    .toggle:focus {
      color:#eee;
      border-color: rgba(0,0,0,0.15);
    }

    .toggle span {
      display: inline-block;
      vertical-align: middle;
    }

    .toggle .esri-icon-expand {
      display: none;
    }

    .drawer-open .toggle .esri-icon-expand {
      display: inline-block;
    }

    .toggle .esri-icon-collapse {
      display: inline-block;
    }

    .drawer-open .toggle .esri-icon-collapse {
      display: none;
    }

    #mapDiv {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .esriSimpleSlider,
    .drawer-animation,
    .esriUI {
      -webkit-transition: left 250ms ease;
      -moz-transition: left 250ms ease;
      -ms-transition: left 250ms ease;
      -o-transition: left 250ms ease;
      transition: left 250ms ease;
    }

    .drawer-top {
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      position: absolute;
      z-index: 36;
      top: 0;
      left: 0px;
      width: 100%;
      height: 54px;
      padding: 10px 0;
      box-sizing: border-box;
    }

    .drawer-open .drawer-top {
      left: 280px;
    }

    .drawer-container {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
      position: relative;
    }

    .drawer-side {
      color: #fff;
      position: absolute;
      top: 0;
      left: -280px;
      z-index: 37;
      width: 280px;
      height: 100%;
      padding: 20px;
      margin: 0;
      border-right: 1px solid rgba(0,0,0,0.15);
      overflow: hidden;
      box-sizing: border-box;
    }

    .drawer-open .drawer-side {
      left: 0;
      overflow: auto;
      overflow-x: hidden;
    }

    .drawer-center {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
    }
```

## Template color theme

Template theme style

```html
    <style>
      .theme-background{
        background-color: rgba(25, 111, 166, 0.8);
      }
    </style>
```

## Drawer JavaScript

Drawer responsive code

```javascript
    // document window
    var w = win.get(document);

    // toggle button
    var btn = dom.byId("toggle");

    // When toggle button is clicked
    on(btn, "click", function (evt) {
      // toggle class
      toggle(!domClass.contains(document.body, "drawer-open"));
    }.bind(this));

    // toggles drawer open or closed
    function toggle(value) {
      domClass.toggle(document.body, "drawer-open", value);
    }

    //Sets drawer open or closed depending on the size of the window
    function drawer() {
      var vs = win.getBox(),
        value;
      // if window width is less than specified size
      if (vs.w < 850) {
        // hide drawer
        value = false;
      } else {
        // show drawer
        value = true;
      }
      toggle(value);
    }

    // When window is resized
    on(w, 'resize', function () {
      drawer();
    });
    drawer();
```  

## Drawer code requires

Requires for the drawer.

```javascript
    "dojo/window",
    "dojo/on",
``` 
  
```javascript
    win,
    on
```  

## LayerList Styling

LayerList styles to match theme.

```css
    .esriLayerList .esriList,
    .esriLayerList .esriTitle {
      background-color: transparent;
      color: #fff;
      border-color: rgba(0,0,0,0.15);
    }
```

## LayerList Layers

LayerList layers that are not basemap layers.

```javascript
    var layers = arcgisUtils.getLayerList(response);
        
    var layerList = new LayerList({
      layers: layers,
      map: this.map
    },"layerListDom");
    layerList.startup();
```

## Title and Summary

Config title & Summary

```javascript
    "title": "My Map",
    "summary": "",
```

## Add Title

Set title from config title or map title

```javascript
    var title = this.config.title || response.itemInfo.item.title;
    document.title = title;

    dom.byId("mapTitle").innerHTML = title;
```

## Add Summary

```javascript
    var summary = this.config.summary || response.itemInfo.item.snippet;
    dom.byId("mapSummary").innerHTML = summary;
```

```html
    <p id="mapSummary"></p>
```

## Add other config options

```javascript
    "color": null,
    "enableSearch": true,
    "enableLayerList": true,
    "enableSummary": true,
    "summary": "",
    "search": "",
```
  
## Search Widget

```javascript
    "esri/dijit/Search",
```       
              
```javascript      
    var search = new Search({
      map: this.map
    },"search");
    search.startup();
```       
        
```html     
    <div id="search"></div>
```      
        
```css  
    #search {
      position: absolute;
      top: 75px;
      right: 20px;
      z-index: 35;
    }
```

## Remove Style tag

Remove style tag in HTML for customizable theme.

## Dojo color for theme

Require dojo color

```javascript
    "dojo/_base/Color",
```

```javascript
    Color,
```

```javascript
    var color, colorArr, colorCSS;
    if(this.config.color){
      var c = new Color(this.config.color);
      colorArr = c.toRgb();
      colorArr.push(0.8);
      color = new Color(colorArr);
    }
    else{
      color = new Color([25, 111, 166, 0.8]);
    }

    colorCSS = color.toCss(true);
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".theme-background { background-color: " + colorCSS + "; }";
    document.body.appendChild(css);
```

## Boolean template options

Set boolean config options

```javascript
    if (this.config.enableLayerList){}
```

```javascript
    if(this.config.enableSearch){}
```

```javascript
    if(this.config.enableSummary){}
```

## URL Param for search

Search url param option.

Add "search" to config params array in template config.

```javascript
    "urlItems": [
      "search",
      "center",
      "extent",
      "level",
      "theme" // example param. ?theme=<my theme>
    ],
```

```javascript
    console.log("My Config:", this.config);
```

```javascript
    if(this.config.search){
      search.set("value", this.config.search);
      search.search(); 
    }
```

## Configurable JSON

Configuration panel JSON

[Configurable Templates](doc.arcgis.com/en/arcgis-online/create-maps/configurable-templates.htm)
[jsonformatter.curiousconcept.com](http://jsonformatter.curiousconcept.com/)

```javascript
    {  
      "configurationSettings":[  
        {  
          "category":"<b>Configure template</b>",
          "fields":[  
            {  
              "type":"webmap"
            },
            {  
              "type":"color",
              "label":"Choose a color for the theme",
              "fieldName":"color"
            },
            {  
              "type":"string",
              "fieldName":"title",
              "label":"Title",
              "tooltip":"",
              "stringFieldOption":"textbox"
            },
            {  
              "type":"string",
              "fieldName":"summary",
              "label":"Summary",
              "tooltip":"",
              "stringFieldOption":"textarea"
            },
            {  
              "type":"boolean",
              "fieldName":"enableSearch",
              "label":"Show Search",
              "tooltip":""
            },
            {  
              "type":"boolean",
              "fieldName":"enableLayerList",
              "label":"Show Layer List",
              "tooltip":""
            },
            {  
              "type":"boolean",
              "fieldName":"enableSummary",
              "label":"Show Summary",
              "tooltip":""
            }
          ]
        }
      ],
      "values":{  
        "title": "",
        "enableSearch": true,
        "enableLayerList": true,
        "enableSummary": true,
        "summary": "",
        "search": ""
      }
    }
```