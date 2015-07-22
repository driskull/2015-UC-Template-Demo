/*global define,document */
/*jslint sloppy:true,nomen:true */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define([
  "dojo/_base/declare",
  "dojo/_base/lang",

  "dojo/Deferred",

  "dojo/dom",
  "dojo/dom-class",

  "esri/arcgis/utils",
  
  "esri/dijit/LayerList",
  
  "dojo/window",
  "dojo/on",
  
  "esri/dijit/Search",
  
   "dojo/_base/Color",

  "dojo/domReady!"
], function (
  declare, lang,
  Deferred,
  dom, domClass,
  arcgisUtils,
  LayerList,
  win,
  on,
  Search,
  Color
) {
  return declare(null, {
    config: {},
    startup: function (config) {
      var promise;
      // config will contain application and user defined info for the template such as i18n strings, the web map id
      // and application id
      // any url parameters and any application specific configuration information.
      if (config) {
        this.config = config;
        //supply either the webmap id or, if available, the item info
        var itemInfo = this.config.itemInfo || this.config.webmap;
        promise = this._createWebMap(itemInfo);
      } else {
        var error = new Error("Main:: Config is not defined");
        this.reportError(error);
        var def = new Deferred();
        def.reject(error);
        promise = def.promise;
      }
      return promise;
    },
    reportError: function (error) {
      // remove loading class from body
      domClass.remove(document.body, "app-loading");
      domClass.add(document.body, "app-error");
      // an error occurred - notify the user. In this example we pull the string from the
      // resource.js file located in the nls folder because we've set the application up
      // for localization. If you don't need to support multiple languages you can hardcode the
      // strings here and comment out the call in index.html to get the localization strings.
      // set message
      var node = dom.byId("loading_message");
      if (node) {
        if (this.config && this.config.i18n) {
          node.innerHTML = this.config.i18n.map.error + ": " + error.message;
        } else {
          node.innerHTML = "Unable to create map: " + error.message;
        }
      }
      return error;
    },

    // create a map based on the input web map id
    _createWebMap: function (itemInfo) {
      // set extent from config/url
      itemInfo = this._setExtent(itemInfo);
      // Optionally define additional map config here for example you can
      // turn the slider off, display info windows, disable wraparound 180, slider position and more.
      var mapOptions = {};
      // set zoom level from config/url
      mapOptions = this._setLevel(mapOptions);
      // set map center from config/url
      mapOptions = this._setCenter(mapOptions);
      // create webmap from item
      return arcgisUtils.createMap(itemInfo, "mapDiv", {
        mapOptions: mapOptions,
        usePopupManager: true,
        layerMixins: this.config.layerMixins || [],
        editable: this.config.editable,
        bingMapsKey: this.config.bingKey
      }).then(lang.hitch(this, function (response) {
        // Once the map is created we get access to the response which provides important info
        // such as the map, operational layers, popup info and more. This object will also contain
        // any custom options you defined for the template. In this example that is the 'theme' property.
        // Here' we'll use it to update the application to match the specified color theme.
        // console.log(this.config);
        this.map = response.map;
        // remove loading class from body
        domClass.remove(document.body, "app-loading");
        // Start writing code
        /* ---------------------------------------- */
        /*  Map is ready. Start writing code        */
        /* ---------------------------------------- */
        
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
        
        
        if (this.config.enableLayerList){
          var layers = arcgisUtils.getLayerList(response);

          var layerList = new LayerList({
            layers: layers,
            map: this.map
          },"layerListDom");
          layerList.startup();
        }
        
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
        
        var title = this.config.title || response.itemInfo.item.title;
        document.title = title;

        dom.byId("mapTitle").innerHTML = title;
        
        if(this.config.enableSummary){
          var summary = this.config.summary || response.itemInfo.item.snippet;
          dom.byId("mapSummary").innerHTML = summary;
        }
        
        if(this.config.enableSearch){
          var search = new Search({
            map: this.map
          },"search");
          search.startup();
          
          if(this.config.search){
            search.set("value", this.config.search);
            search.search(); 
          }
          
        }
        
        console.log("My Config:", this.config);
        
        
        
        /* ---------------------------------------- */
        /*                                          */
        /* ---------------------------------------- */
        // return for promise
        return response;
        // map has been created. You can start using it.
        // If you need map to be loaded, listen for it's load event.
      }), this.reportError);
    },

    _setLevel: function (options) {
      var level = this.config.level;
      //specify center and zoom if provided as url params 
      if (level) {
        options.zoom = level;
      }
      return options;
    },

    _setCenter: function (options) {
      var center = this.config.center;
      if (center) {
        var points = center.split(",");
        if (points && points.length === 2) {
          options.center = [parseFloat(points[0]), parseFloat(points[1])];
        }
      }
      return options;
    },

    _setExtent: function (info) {
      var e = this.config.extent;
      //If a custom extent is set as a url parameter handle that before creating the map
      if (e) {
        var extArray = e.split(",");
        var extLength = extArray.length;
        if (extLength === 4) {
          info.item.extent = [[parseFloat(extArray[0]), parseFloat(extArray[1])], [parseFloat(extArray[2]), parseFloat(extArray[3])]];
        }
      }
      return info;
    }

  });
});