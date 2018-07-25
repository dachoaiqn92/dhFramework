/// <reference path="../control.js" />

var dh_image_capture = {
    init: function () {
        var stick_record = dh.IO.sticky();
        stick_record.setTop(5).setRight(5);
        stick_record.width(20).height(20);

        var video = $ot(document.createElement("video"));
        video.toFillParent();
     ;
        stick_record.background("#FFF");

      
        stick_record.addView(video);
        navigator.getUserMedia({ video: true, audio: false }, function (localMediaStream) {
            video.getDOM().src = window.URL.createObjectURL(localMediaStream);

            video.onloadedmetadata = function (e) {
            };
        }, function (e) {
        });

    }
}