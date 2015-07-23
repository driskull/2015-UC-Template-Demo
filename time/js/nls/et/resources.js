﻿/*global define */
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
define(
   ({
    map: {
      error: "Võimetu koostama kaarti"
    },
    legend:{
      title: "Legendiga kaart"
    },
    share: {
      title: "Jaga"
    },
    about: {
      title: "Info",
      error: "Vaikimisi kasutatakse veebikaardi kirjeldust või mingit osa sellest. Kohandage rakendust, lisades vastava tekstilõigu juhtpaneeli kohta."
    },
    time: {
        enableTimeMessage: "Veebikaart ei sisalda kaardi tuuri jaoks sobivat kihti. Vaadake üksikasju <a target=\'_blank\' href=\'http://doc.arcgis.com/en/arcgis-online/create-maps/configure-time.htm#ESRI_SECTION1_F1D4A275B4AB4CC79198CBA9D0AD8727\'>Ajaseadete konfigureerimise</a> spikris. Malli kasutamiseks kellaaega kuvamata kasutage konfiguratsioonipaneeli, millel saate ajavaliku keelata.",
        datePattern: "d. MMMM yyyy",
        hourTimePattern: "H",
        millisecondTimePattern: "h:mm:ss",
        minuteTimePattern: "h:mm",
        secondTimePattern: "h:mm:ss",
        timeRange: "${startTime} kuni ${endTime}",
        yearPattern: "aaaa"
    },
    histogram:{
      error: "Veebikaardi läbilõikerežiimis pole ajafunktsiooni kihid saadaval. Kohandage rakendus mõne muu veebikaardi kasutamiseks või keelake histogrammi valik."
    }
  })
);