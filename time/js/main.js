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
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/query", "dojo/on", "dojo/string", "dojo/date/locale", "dojo/dom-construct", "dojo/dom-style", "dojo/_base/array", "esri/arcgis/utils", "esri/lang", "esri/layers/FeatureLayer", "esri/TimeExtent", "esri/dijit/TimeSlider", "dojo/dom", "dojo/dom-class", "dojo/domReady!"], function (
declare, lang, query, on, string, locale, domConstruct, domStyle, array, arcgisUtils, esriLang, FeatureLayer, TimeExtent, TimeSlider, dom, domClass) {
    return declare(null, {
        config: {},
        startup: function (config) {
            // config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information.
            if (config) {
                this.config = config;
                //supply either the webmap id or, if available, the item info
                var itemInfo = this.config.itemInfo || this.config.webmap;
                this._createWebMap(itemInfo);
            } else {
                var error = new Error("Main:: Config is not defined");
                this.reportError(error);
            }
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
        },
        _createDialog: function (title, content, dialogDiv, dialogBtn) {
            require(["dijit/Dialog"], lang.hitch(this, function (Dialog) {
                var window = new Dialog({
                    title: title,
                    content: content
                });
                //Update panel color
                if (this.config.panelbackground) {
                    query(".dijitDialogTitleBar").style("background", this.config.panelbackground.toString());
                }
                if (this.config.panelcolor) {
                    query(".dijitDialogTitle").style("color", this.config.panelcolor.toString());
                    query(".dijitDialogCloseIcon").style("color", this.config.panelcolor.toString());
                }
                on(dom.byId(dialogDiv), "click", function () {
                    domClass.add(dialogBtn, "toggle-grey");
                    window.show();
                });

                //Remove grayed out color
                on(query(".dijitDialogCloseIcon"), "click", function () {
                    query(".button-container").forEach(function (node) {
                        domClass.remove(node, "toggle-grey");
                    });
                });


            }));
        },
        _createWidgets: function () {

            //Specify the app title
            document.title = this.config.response.itemInfo.item.title;
            if (this.config.title || this.config.about || this.config.share || this.config.logo) {
                domClass.add(document.body, "showtitle");
                if (this.config.title) {
                    var title = this.config.titletext || this.config.response.itemInfo.item.title;
                    dom.byId("title").innerHTML = title;
                }
            } else {
                domClass.add(dom.byId("titleContainer"), "hide");
            }
            //Add a logo
            if (this.config.logo) {
                domClass.remove(dom.byId("logo"), "hide");
                var link = null;
                if (this.config.logolink) {
                    link = domConstruct.create("a", {
                        href: this.config.logolink,
                        target: "_blank"
                    }, dom.byId("logo"));
                }

                var logoDiv = link || dom.byId("logo");
                domConstruct.create("img", {
                    src: this.config.logo
                }, logoDiv);
            }

            //add share dialog
            if (this.config.share) {
                require(["application/ShareDialog"], lang.hitch(this, function (ShareDialog) {
                    domClass.add(dom.byId("shareDiv"), "show");
                    dom.byId("shareLabel").innerHTML = this.config.i18n.share.title;
                    dom.byId("shareBtn").title = this.config.i18n.share.title;
                    var shareWidget = new ShareDialog({
                        map: this.map,
                        image: this.config.sharinghost + "/sharing/rest/content/items/" + this.config.response.itemInfo.item.id + "/info/" + this.config.response.itemInfo.thumbnail,
                        title: this.config.response.itemInfo.item.title,
                        summary: this.config.response.itemInfo.item.snippet || ""
                    }, domConstruct.create("div"));
                    shareWidget.startup();
                    this._createDialog(this.config.i18n.share.title, shareWidget.domNode, "shareDiv", "shareBtn");
                }));
            }
            //add about dialog
            if (this.config.about) {
                //Content can be configured or come from the item description
                //or snippet 
                var aboutText = this.config.abouttext || this.config.response.itemInfo.item.description || this.config.response.itemInfo.item.snippet;
                if (!aboutText) {
                    aboutText = this.config.i18n.about.error;
                }
                domClass.add(dom.byId("aboutDiv"), "show");
                dom.byId("aboutLabel").innerHTML = this.config.i18n.about.title;
                dom.byId("aboutBtn").title = this.config.i18n.about.title;

                this._createDialog(this.config.i18n.about.title, aboutText, "aboutDiv", "aboutBtn");
            }

            //add scale bar
            if (this.config.scale) {
                require(["esri/dijit/Scalebar"], lang.hitch(this, function (Scalebar) {
                    var scalebar = new Scalebar({
                        map: this.map,
                        scalebarUnit: this.config.units
                    });
                }));
            } else {
                domClass.add(document.body, "noscale");
            }
            //add legend
            if (this.config.legend) {
                require(["esri/dijit/Legend"], lang.hitch(this, function (Legend) {
                    //on small screens show/hide the legend time slider
                    var legendButton = dom.byId("legendButton");
                    var legendContainer = dom.byId("legendContainer");
                    var timeContainer = dom.byId("timeContainer");

                    on(legendButton, "click", lang.hitch(this, function () {

                        if (domClass.contains(legendButton, "icon-menu-open")) {
                            domClass.add(legendButton, ["icon-menu-close", "move"]);
                            domClass.remove(legendButton, "icon-menu-open");
                            domClass.remove(legendContainer, "legend-hide");
                            domClass.add(legendContainer, "legend-show");
                            if (this.config.time) {
                                domClass.remove(timeContainer, "show");
                                domClass.add(timeContainer, "hide");
                            }
                        } else {
                            domClass.remove(legendButton, ["icon-menu-close", "move"]);
                            domClass.add(legendButton, "icon-menu-open");
                            domClass.remove(legendContainer, "legend-show");
                            domClass.add(legendContainer, "legend-hide");
                            if (this.config.time) {
                                domClass.remove(timeContainer, "hide");
                                domClass.add(timeContainer, "show");
                            }

                        }
                    }));
                    var legendLayers = arcgisUtils.getLegendLayers(this.config.response);
                    if (legendLayers.length < 1) {
                        domClass.add(legendContainer, "legend-hide");
                        domStyle.set("legendContainer","display", "none");     
                        return;
                    }
                    var legend = new Legend({
                        map: this.map,
                        layerInfos: legendLayers
                    }, domConstruct.create("div", {}, "legendDiv"));

                    legend.startup();
                    dom.byId("legendButton").title = this.config.i18n.legend.title;
                    domClass.add(legendContainer, "window-top-right");

                }));
            } else {
                domClass.add(dom.byId("legendContainer"), "legend-hide");
                domStyle.set("legendContainer","display", "none");
                domClass.add(dom.byId("legendContainer"), "hide");
                domClass.add(dom.byId("legendButton"), "hide");
                domClass.remove(dom.byId("legendButton"), "legendButtonDiv");
            }
            if (this.config.search) {
                this._addSearch();
            }

        },
        _addSearch: function () {
            //Add the search widget
            require(["esri/dijit/Search", "esri/tasks/locator", "application/SearchSources"], lang.hitch(this, function (Search, Locator, SearchSources) {
                if (!Search && !Locator && !SearchSources) {
                    return;
                }
                var searchOptions = {
                    map: this.map,
                    itemData: this.config.response.itemInfo.itemData
                };
                if (this.config.searchConfig) {
                    searchOptions.applicationConfiguredSources = this.config.searchConfig.sources || [];
                } else {
                    //Default search options if nothing is configured. 
                    searchOptions.geocoders = this.config.helperServices.geocode;
                }


                var searchSources = new SearchSources(searchOptions);
                var createdOptions = searchSources.createOptions();
                createdOptions.enableButtonMode = true;
                createdOptions.expanded = false;

                if (this.config.searchConfig && this.config.searchConfig.activeSourceIndex) {
                    createdOptions.activeSourceIndex = this.config.searchConfig.activeSourceIndex;
                }
                var search = new Search(createdOptions, domConstruct.create("div", {
                    id: "search"
                }, "mapDiv"));


                search.startup();


            }));

        },
        _updateTheme: function () {
            if (this.config.panelbackground) {
                query(".bg").style("backgroundColor", this.config.panelbackground.toString());
            }
            if (this.config.panelcolor) {
                query(".fg").style("color", this.config.panelcolor.toString());
            }

            if (this.config.timecolor) {
                var c = this.config.timecolor.toString();
                query(".tc").style("color", c);
                query(".dijitSliderImageHandleH").style("background-color", c);
            }
            if (this.config.slidercolor) {
                query(".dijitSliderProgressBarH").style("backgroundColor", this.config.slidercolor.toString());
            }
        },
        _updatePlayButton: function (add, remove) {
            //switch play/pause icon 
            var play = dom.byId("playSlider");
            domClass.remove(play, remove);
            domClass.add(play, add);
        },
        _updateClock: function(d){
            var clock = dom.byId("clock");
            var currTime = locale.format(d,{
                timePattern: "h:m a",
                selector: ('time')
            });

            clock.innerHTML = currTime;
        },
        _displayTime: function () { 
      
            //Add the time slider the map is time aware or there are time aware layers
            var timeProperties = null,
                timeExtent = null;

            if (this.config.response.itemInfo.itemData.widgets && this.config.response.itemInfo.itemData.widgets.timeSlider) {
                timeProperties = this.config.response.itemInfo.itemData.widgets.timeSlider.properties;
                timeExtent = new TimeExtent(new Date(timeProperties.startTime), new Date(timeProperties.endTime));
            }
            if (timeProperties && timeExtent) {
                //Add the time slider widget
                var timeSlider = new TimeSlider({
                    loop: this.config.looptime
                });
                this.map.setTimeExtent(timeExtent);
                this.map.setTimeSlider(timeSlider);

                if (timeProperties.numberOfStops) {
                    timeSlider.createTimeStopsByCount(timeExtent, timeProperties.numberOfStops);
                } else {
                    timeSlider.createTimeStopsByTimeInterval(timeExtent, timeProperties.timeStopInterval.interval, timeProperties.timeStopInterval.units);
                }

                timeSlider.setThumbCount(timeProperties.thumbCount);
                timeSlider.setThumbMovingRate(timeProperties.thumbMovingRate);

                timeSlider.startup();
        

                if (this.config.sliderrate) {
                    timeSlider.setThumbMovingRate(this.config.sliderrate);
                }
                // auto play the slider 
                timeSlider.play();
          

                on(timeSlider, "time-extent-change", lang.hitch(this, function (e) {
                    this._updateClock(new Date(e.endTime));
                }));
      
            }            
            this._updateTheme();
        },
        // create a map based on the input web map id
        _createWebMap: function (itemInfo) {
            itemInfo = this._setExtent(itemInfo);
            var mapOptions = {};
            mapOptions = this._setLevel(mapOptions);
            mapOptions = this._setCenter(mapOptions);
            mapOptions.slider = this.config.zoomslider;

            if (this.config.zoomslider === false) {
                domClass.add(document.body, "nozoom");
            }

            arcgisUtils.createMap(itemInfo, "mapDiv", {
                mapOptions: mapOptions,
                usePopupManager: true,
                layerMixins: this.config.layerMixins || [],
                editable: false,
                bingMapsKey: this.config.bingKey
            }).then(lang.hitch(this, function (response) {
                this.map = response.map;
                this.config.response = response;
                // remove loading class from body
                domClass.remove(document.body, "app-loading");
                this._createWidgets();
                if (this.config.time) {
                    this._displayTime();
                } else {
                  //  domClass.add(dom.byId("timeContainer"), "hide");
                }
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
                    info.item.extent = [
                        [parseFloat(extArray[0]), parseFloat(extArray[1])],
                        [parseFloat(extArray[2]), parseFloat(extArray[3])]
                    ];
                }
            }
            return info;
        }
    });
});