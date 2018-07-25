/// <reference path="../control.js" />


var mYoutube = {

    newInstance: function (apiKey, oAuthV2) {
        var config = {
            limit_load_each_times: 50
        }
        oAuthV2 = "sBVbqgadz_8QDLkWZh9C8uXH";
        var self = new Object();

        self.openVideo = function (videoId, width, height, onPlayerReady, onPlayerStateChange) {
            var frame = new Object();
            player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: videoId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            frame.player = player;
            return frame;
        }
        var waiter = null, search_key;

        self.findVideo = function (key, onFounded, onFailed) {
            if (waiter != null) {
                waiter.remove();
            }
            search_key = key;
            waiter = dh.Waiter.create(function () {
                waiter = null;
                var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/search?maxResults=15&part=snippet&q=" + key + "&key=" + apiKey
                    + "&access_token=" + oAuthV2,
                    function (request, body) {
                        if (search_key != key) {
                            return;
                        }
                        var m_result = JSON.parse(body);
                        self.loadVideosDetail(dh.List(m_result.items).entityToList("id").entityToList("videoId").toArray(), function (results) {
                            m_result.items = results.items;
                            onFounded(m_result);

                        });
                    }, function () {
                        if (onFailed != undefined) {
                            onFailed()
                        }
                    }, false);
                //request.addHeader("authorization", "Bearer " + oAuthV2);
                request.execute();
            }, 200);
        }

        self.findVideoByLocation = function (lat, lng, onFounded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/search?type=video&locationRadius=100km&part=snippet&location=" + lat + "," + lng + "&key=" + apiKey
                + "&access_token=" + oAuthV2,
                function (request, body) {
                    onFounded(JSON.parse(body));
                }, function () {
                    if (onFailed != undefined) {
                        onFailed()
                    }
                }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        self.findPopularVideos = function (onFounded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/videos?chart=mostPopular&regionCode=VN&maxResults=" + config.limit_load_each_times + "&part=snippet,contentDetails,statistics&key=" + apiKey
            + "&access_token=" + oAuthV2,
            function (request, body) {
                onFounded(JSON.parse(body));
            }, function () {
                if (onFailed != undefined) {
                    onFailed()
                }
            }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        self.getVideoByPlayListId = function (id, onFounded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/playlistItems?maxResults=" + config.limit_load_each_times
                + "&part=contentDetails&key=" + apiKey
                 + "&playlistId=" + id
            + "&access_token=" + oAuthV2,
            function (request, body) {
                var m_result = JSON.parse(body);
                self.loadVideosDetail(dh.List(m_result.items).entityToList("contentDetails").entityToList("videoId").toArray(), function (results) {
                    m_result.items = results.items;
                    onFounded(m_result);
                });
            }, function () {
                if (onFailed != undefined) {
                    onFailed()
                }
            }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }


        self.getMoreVideoByPlayListId = function (id,token, onFounded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/playlistItems?maxResults=" + config.limit_load_each_times
                + "&part=contentDetails&key=" + apiKey
                 + "&playlistId=" + id
                 + "&pageToken=" + token
            + "&access_token=" + oAuthV2,
            function (request, body) {
                var m_result = JSON.parse(body);
                self.loadVideosDetail(dh.List(m_result.items).entityToList("contentDetails").entityToList("videoId").toArray(), function (results) {
                    m_result.items = results.items;
                    onFounded(m_result);
                });
            }, function () {
                if (onFailed != undefined) {
                    onFailed()
                }
            }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        self.findRelateVideo = function (videoId, onFounded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/search?relatedToVideoId=" + videoId + "&maxResults=" + config.limit_load_each_times + "&part=snippet&type=video&key=" + apiKey
                + "&access_token=" + oAuthV2,
                function (request, body) {
                    var m_result = JSON.parse(body);
                    self.loadVideosDetail(dh.List(m_result.items).entityToList("id").entityToList("videoId").toArray(), function (results) {
                        m_result.items = results.items;
                        onFounded(m_result);
                    });
                }, function () {
                    if (onFailed != undefined) {
                        onFailed()
                    }
                }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }
        self.loadMorePopularVideo = function (pageToken, onLoaded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/videos?&chart=mostPopular&pageToken=" + pageToken + "&maxResults=" + config.limit_load_each_times + "&part=snippet,statistics,contentDetails&type=video&key=" + apiKey
             + "&access_token=" + oAuthV2,
             function (request, body) {
                 onLoaded(JSON.parse(body));
             }, function () {
                 if (onFailed != undefined) {
                     onFailed()
                 }
             }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        self.loadMoreVideo = function (key, pageToken, onLoaded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/search?q=" + key + "&pageToken=" + pageToken + "&maxResults=" + config.limit_load_each_times + "&part=snippet&type=video&key=" + apiKey
             + "&access_token=" + oAuthV2,
             function (request, body) {
                 var m_result = JSON.parse(body);
                 self.loadVideosDetail(dh.List(m_result.items).entityToList("id").entityToList("videoId").toArray(), function (results) {
                     m_result.items = results.items;
                     onLoaded(m_result);
                 });
             }, function () {
                 if (onFailed != undefined) {
                     onFailed()
                 }
             }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        self.loadComments = function (videoId, onLoaded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/commentThreads?"
                + "&maxResults=25&part=snippet,replies&order=relevance&videoId=" + videoId + "&key=" + apiKey
                + "&textFormat=plainText"
           + "&access_token=" + oAuthV2,
           function (request, body) {
               onLoaded(JSON.parse(body));
           }, function () {
               if (onFailed != undefined) {
                   onFailed()
               }
           }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        self.loadReply = function (parentId, pageToken, onLoaded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/comments?"
              + "&parentId=" + parentId + (pageToken != null ? "&pageToken=" + pageToken : "")
              + "&maxResults=20&part=snippet&order=relevance&key=" + apiKey
              + "&textFormat=plainText"
              + "&access_token=" + oAuthV2,
              function (request, body) {
                  onLoaded(JSON.parse(body));
              }, function () {
                  if (onFailed != undefined) {
                      onFailed()
                  }
              }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }
        var auto_complete_script;

        self.findTitleSuggestion = function (key, onFounded, onFailed) {
            if (waiter != null) {
                waiter.remove();
            }
            search_key = key;
            waiter = dh.Waiter.create(function () {
                waiter = null;
                dh.NetWork.setIsCORSRequest(true);
                if (auto_complete_script != null) {
                    document.head.removeChild(auto_complete_script);
                    auto_complete_script = null;
                }
                auto_complete_script = document.createElement("script");
                auto_complete_script.src = "http://suggestqueries.google.com/complete/search?q=" + key + "&client=firefox&ds=yt&callback=onAutoCompleted";

                onAutoCompleted = function (result) {
                    if (auto_complete_script != null) {
                        document.head.removeChild(auto_complete_script);
                        auto_complete_script = null;
                    }
                    onFounded(result[1]);
                }
                document.head.appendChild(auto_complete_script);


                //var request = dh.NetWork.GET(",
                //    function (request, body) {
                //        if (search_key != key) {
                //            return;
                //        }
                //        console.log(body);
                //        var m_result = JSON.parse(body);
                //        console.log(dh.List(m_result.items).entityToList("snippet").entityToList("title").toArray());
                //        onFounded(dh.List(m_result.items).entityToList("snippet").entityToList("title").toArray());
                //    }, function () {
                //        if (onFailed != undefined) {
                //            onFailed()
                //        }
                //    }, false);
                //request.addHeader("authorization", "Bearer " + oAuthV2);
                //request.execute();
            }, 100);
        }

        self.loadVideosDetail = function (ids, onLoaded) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/videos?&id=" + ids.toString() + "&part=snippet,statistics,contentDetails&type=video&key=" + apiKey
              + "&access_token=" + oAuthV2,
              function (request, body) {
                  onLoaded(JSON.parse(body));
              }, function () {

              }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }


        self.findMyLikeVideos = function (onLoaded, onFailed) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&key=" + apiKey
                + "&myRating=like"
                + "&access_token=" + oAuthV2,
                function (request, body) {
                    onLoaded(JSON.parse(body));
                }, function () {

                }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        self.loadCategories = function (onLoaded) {
            var request = dh.NetWork.GET("https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&key=" + apiKey
               + "&hl=vi"
               + "&regionCode=VN"
               + "&access_token=" + oAuthV2,
               function (request, body) {
                   onLoaded(JSON.parse(body));
               }, function () {

               }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            request.execute();
        }

        return self;

    },
    Utils: {
        YTDurationToString: function (duration, format) {

            var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
            if (match == null) {
                return "";
            }
            match = match.slice(1).map(function (x) {
                if (x != null) {
                    return x.replace(/\D/, '');
                }
            });

            var hours = (parseInt(match[0]) || 0);
            var minutes = (parseInt(match[1]) || 0);
            var seconds = (parseInt(match[2]) || 0);

            if (format.indexOf("HH") != -1 && hours > 0) {
                return format.replace("HH", hours > 9 ? hours : "0" + hours).replace("mm", minutes > 9 ? minutes : "0" + minutes).replace("SS", seconds > 9 ? seconds : "0" + seconds);
            } else if (format.indexOf("HH") != -1 && hours == 0) {
                return format.replace("HH:", "").replace("mm", minutes > 9 ? minutes : "0" + minutes).replace("SS", seconds > 9 ? seconds : "0" + seconds);
            } else {
                return format.replace("mm", minutes > 9 ? minutes : "0" + minutes).replace("SS", seconds > 9 ? seconds : "0" + seconds);
            }
        },
        YTDurationToMinutes: function () {
            var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

            match = match.slice(1).map(function (x) {
                if (x != null) {
                    return x.replace(/\D/, '');
                }
            });

            var hours = (parseInt(match[0]) || 0);
            var minutes = (parseInt(match[1]) || 0);
            var seconds = (parseInt(match[2]) || 0);

            return hours * 60 + minutes;
        },
        YTDurationToSecond: function () {
            var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

            match = match.slice(1).map(function (x) {
                if (x != null) {
                    return x.replace(/\D/, '');
                }
            });

            var hours = (parseInt(match[0]) || 0);
            var minutes = (parseInt(match[1]) || 0);
            var seconds = (parseInt(match[2]) || 0);

            return hours * 3600 + minutes * 60 + seconds;
        }
    }
}


var onAutoCompleted = null;