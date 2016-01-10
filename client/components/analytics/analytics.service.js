'use strict';

angular.module('cmeasyApp')
  .service('Analytics', function ($window, $log, $analytics) {

    //TODO configure this
    const CATERGORY = 'Cmeasy';

    return {
      trackEvent: trackEvent
    };

    /**
     *
     * @param analyticsEvent
     * @param analyticsLabel
     */
    function trackEvent(analyticsEvent, analyticsLabel){

      var analyticsData = { category: CATERGORY };

      //We have to ensure that our labels are strings - if we pass a number off to Google then it cries.
      analyticsData.label = (analyticsLabel && analyticsLabel.toString()) || undefined;

      $log.debug('AnalyticsEvent: ' + analyticsEvent + ' AnalyticsData: ' + JSON.stringify(analyticsData));

      $analytics.eventTrack(analyticsEvent, analyticsData);
    }


  });
