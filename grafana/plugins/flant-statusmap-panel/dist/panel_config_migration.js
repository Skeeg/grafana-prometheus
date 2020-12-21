"use strict";

System.register(["lodash"], function (_export, _context) {
  "use strict";

  var _;

  function migrate_V0_V1(panel) {
    // Remove unused fields.
    if (_.has(panel, "xAxis.labelFormat")) {
      delete panel.xAxis.labelFormat;
    }

    if (_.has(panel, "xAxis.minBucketWidthToShowWeekends")) {
      delete panel.xAxis.minBucketWidthToShowWeekends;
    }

    if (_.has(panel, "xAxis.showCrosshair")) {
      delete panel.xAxis.showCrosshair;
    }

    if (_.has(panel, "xAxis.showWeekends")) {
      delete panel.xAxis.showWeekends;
    }

    if (_.has(panel, "yAxis.showCrosshair")) {
      delete panel.yAxis.showCrosshair;
    }

    if (_.has(panel, "data.unitFormat")) {
      delete panel.data;
    } // Migrate cardSpacing value. Seems rare (update from version 0.0.2).


    if (_.has(panel, "cards.cardSpacing")) {
      if (!_.has(panel, "cards.cardVSpacing")) {
        if (panel.cards.cardSpacing) {
          panel.cards.cardVSpacing = panel.cards.cardSpacing;
          panel.cards.cardHSpacing = panel.cards.cardSpacing;
        }
      }

      delete panel.cards.cardSpacing;
    } // Migrate initial config for urls in tooltip (pull/86).
    // 'usingUrl' was used to show tooltip with urls on click or not.


    if (_.has(panel, "usingUrl")) {
      if (!_.has(panel, "tooltip.freezeOnClick")) {
        panel.tooltip.freezeOnClick = panel.usingUrl;
      }

      delete panel.usingUrl;
    } // 'urls' array is now tooltip.items array. Also items are changed.


    if (_.has(panel, "urls")) {
      if (!_.has(panel, "tooltip.items")) {
        panel.tooltip.items = [];
        var hasRealItems = true;

        if (panel.urls.length == 0) {
          hasRealItems = false;
        }

        if (panel.urls.length == 1) {
          var url = panel.urls[0];

          if (url.base_url === '' && url.label === '') {
            hasRealItems = false;
          }
        }

        if (hasRealItems) {
          panel.tooltip.showItems = true;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = panel.urls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _url = _step.value;
              var item = {
                urlTemplate: _.toString(_url.base_url),
                urlText: _.toString(_url.label),
                urlIcon: _.toString(_url.icon_fa),
                urlToLowerCase: _url.forcelowercase,
                valueDateFormat: ''
              }; // replace $vars with new ${__vars} if url template is not empty

              if (item.urlTemplate !== "") {
                // $time was a graph time with prepended &
                item.urlTemplate = _.replace(_url.base_url, /\$time/g, "&${__url_time_range}"); // $series_label was a y axis label

                item.urlTemplate = _.replace(item.urlTemplate, /\$series_label/, "${__y_label}"); // $series_extra was a value from bucket. This value has format options and index.

                var valueVar = "__value";

                if (_url.useExtraSeries === true) {
                  // index?
                  if (_url.extraSeries.index > -1) {
                    valueVar += "_" + _url.extraSeries.index;
                  }

                  var format = _.toString(_url.extraSeries.format);

                  if (format === 'YYYY/MM/DD/HH_mm_ss') {
                    valueVar += '_date';
                    item.valueDateFormat = format;
                  }
                }

                item.urlTemplate = _.replace(item.urlTemplate, /\$series_extra/, "${".concat(valueVar, "}"));
              }

              panel.tooltip.items.push(item);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }

      delete panel.urls;
    } // create statusmap metadata


    panel.statusmap = {
      "ConfigVersion": "v1"
    };
  }

  function migratePanelConfig(panel) {
    if (_.has(panel, "statusmap")) {
      if (panel.statusmap.ConfigVersion == "v1") {
        return;
      }
    } else {
      migrate_V0_V1(panel);
    }

    return;
  }

  _export("migratePanelConfig", migratePanelConfig);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=panel_config_migration.js.map
