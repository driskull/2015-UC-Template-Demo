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
      error: "לא ניתן ליצור מפה"
    },
    legend:{
      title: "מקרא"
    },
    share: {
      title: "שתף"
    },
    about: {
      title: "אודות",
      error: "כברירת מחדל, המערכת תשתמש במקטע או בתיאור של מפת האינטרנט. התאם אישית את האפליקציה להוספת מקטע מותאם אישית עבור החלונית \'אודות\'."
    },
    time: {
        enableTimeMessage: "מפת האינטרנט שצוינה אינה מכילה שכבות עם הגדרות זמן. לפרטים, הצג את נושא העזרה <a target=\'_blank\' href=\'http://doc.arcgis.com/en/arcgis-online/create-maps/configure-time.htm#ESRI_SECTION1_F1D4A275B4AB4CC79198CBA9D0AD8727\'>הגדרת הגדרות זמן</a>. השתמש בתבנית מבלי להציג זמן. השתמש בחלונית הקונפיגורציה כדי להשבית את אפשרות הזמן.",
        datePattern: "d, MMMM ,yyyy",
        hourTimePattern: "h a",
        millisecondTimePattern: "h:mm:ss a",
        minuteTimePattern: "h:mm a",
        secondTimePattern: "h:mm:ss a",
        timeRange: "${startTime} ל- ${endTime}",
        yearPattern: "yyyy"
    },
    histogram:{
      error: "במצב Snapshot, אין שכבות זמינות עם הגדרות זמן של ישויות במפת האינטרנט. הגדר את האפליקציה כך שתשתמש במפת אינטרנט אחרת או תשבית את אפשרות ההיסטוגרמות."
    }
  })
);