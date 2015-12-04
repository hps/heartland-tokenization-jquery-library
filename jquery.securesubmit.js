//JSON2
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,a=e[t];switch(a&&"object"==typeof a&&"function"==typeof a.toJSON&&(a=a.toJSON(t)),"function"==typeof rep&&(a=rep.call(e,t,a)),typeof a){case"string":return quote(a);case"number":return isFinite(a)?a+"":"null";case"boolean":case"null":return a+"";case"object":if(!a)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(a)){for(f=a.length,r=0;f>r;r+=1)u[r]=str(r,a)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));else for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","    ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

/*global $, jQuery*/
var hps = (function ($) {
    "use strict";

    var HPS;

    HPS = {

        Tag: "SecureSubmit",

        Urls: {
            CERT: "https://cert.api2.heartlandportico.com/Hps.Exchange.PosGateway.Hpf.v1/api/token",
            PROD: "https://api2.heartlandportico.com/SecureSubmit.v1/api/token",
            iframeCERT: "https://hps.github.io/token/2.0/",
            iframePROD: "https://api2.heartlandportico.com/SecureSubmit.v1/token/2.0/"
        },

        tokenize: function (options) {
            var gateway_url, params, env;
            var number = $.trim(options.data.number);
            var exp_month = $.trim(options.data.exp_month);
            var exp_year = $.trim(options.data.exp_year);

            // add additional service parameters
            params = $.param({
                "api_key": options.data.public_key,
                "object": "token",
                "token_type": "supt",
                "_method": "post",
                "card[number]": number,
                "card[cvc]": $.trim(options.data.cvc),
                "card[exp_month]": exp_month,
                "card[exp_year]": exp_year
            });

            env = options.data.public_key.split("_")[1];

            if (env === "cert") {
                gateway_url = HPS.Urls.CERT;
            } else {
                gateway_url = HPS.Urls.PROD;
            }


            var d = new Date();
            if (parseInt(exp_year) < d.getFullYear()) {
                options.error("The expiration year is in the past.");
                return;
            }

            var cardType = '';

            var re = {
                visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                mastercard: /^5[1-5][0-9]{14}$/,
                amex: /^3[47][0-9]{13}$/,
                diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
                discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
                jcb: /^(?:2131|1800|35\d{3})\d{11}$/
            };

            if (re.visa.test(number)) {
                cardType = 'visa';
            } else if (re.mastercard.test(number)) {
                cardType = 'mastercard';
            } else if (re.amex.test(number)) {
                cardType = 'amex';
            } else if (re.diners.test(number)) {
                cardType = 'diners';
            } else if (re.discover.test(number)) {
                cardType = 'discover';
            } else if (re.jcb.test(number)) {
                cardType = 'jcb';
            }

            // request token
            $.ajax({
                cache: false,
                url: gateway_url,
                data: params,
                dataType: "jsonp",
                success: function (response) {

                    // Request failed, handle error
                    if (typeof response.error === 'object') {
                        // call error handler if provided and valid
                        if (typeof options.error === 'function') {
                            options.error(response.error);
                        }
                        else {
                            // handle exception
                            HPS.error(response.error.message);
                        }
                    } else if (typeof options.success === 'function') {
                        response.card_type = cardType;
                        response.exp_month = exp_month;
                        response.exp_year = exp_year;

                        options.success(response);
                    }
                }
            });
        },

        tokenize_swipe: function (options) {
            var gateway_url, params, env;

            params = $.param({
                "api_key": options.data.public_key,
                "object": "token",
                "token_type": "supt",
                "_method": "post",
                "card[track_method]": "swipe",
                "card[track]": $.trim(options.data.track)
            });

            env = options.data.public_key.split("_")[1];

            if (env === "cert") {
                gateway_url = HPS.Urls.CERT;
            } else {
                gateway_url = HPS.Urls.PROD;
            }

            // request token
            $.ajax({
                cache: false,
                url: gateway_url,
                data: params,
                dataType: "jsonp",
                success: function (response) {

                    // Request failed, handle error
                    if (typeof response.error === 'object') {
                        // call error handler if provided and valid
                        if (typeof options.error === 'function') {
                            options.error(response.error);
                        } else {
                            // handle exception
                            HPS.error(response.error.message);
                        }
                    } else if (typeof options.success === 'function') {
                        options.success(response);
                    }
                }
            });
        },

        tokenize_encrypted_card: function (options) {
            var gateway_url, params, env;

            params = $.param({
                "api_key": options.data.public_key,
                "object": "token",
                "token_type": "supt",
                "_method": "post",
                "encryptedcard[track]": $.trim(options.data.track),
                "encryptedcard[track_method]": "swipe",
                "encryptedcard[track_number]": $.trim(options.data.track_number),
                "encryptedcard[ktb]": $.trim(options.data.ktb),
                "encryptedcard[pin_block]": $.trim(options.data.pin_block)
            });

            env = options.data.public_key.split("_")[1];

            if (env === "cert") {
                gateway_url = HPS.Urls.CERT;
            } else {
                gateway_url = HPS.Urls.PROD;
            }

            // request token
            $.ajax({
                cache: false,
                url: gateway_url,
                data: params,
                dataType: "jsonp",
                success: function (response) {

                    // Request failed, handle error
                    if (typeof response.error === 'object') {
                        // call error handler if provided and valid
                        if (typeof options.error === 'function') {
                            options.error(response.error);
                        } else {
                            // handle exception
                            HPS.error(response.error.message);
                        }
                    } else if (typeof options.success === 'function') {
                        options.success(response);
                    }
                }
            });
        },

        tokenize_iframe: function (public_key) {
            var tokenValue;

            HPS.tokenize({
                data: {
                  public_key: public_key,
                  number: document.getElementById('heartland-card-number').value,
                  cvc: document.getElementById('heartland-cvv').value,
                  exp_month: document.getElementById('heartland-expiration-month').value,
                  exp_year: document.getElementById('heartland-expiration-year').value
                },
                success: function(response) {
                    HPS.Messages.postMessage({action: "onTokenSuccess", response: response}, HPS.parent_url, 'parent');
                },
                error: function (response) {
                    HPS.Messages.postMessage({action: "onTokenError", response: response}, HPS.parent_url, 'parent');
                }
            });
        },

        _setStyle: function (elementid, htmlstyle) {
            document.getElementById(elementid).setAttribute('style', htmlstyle);
            HPS._resizeFrame();
        },

        _appendStyle: function (elementid, htmlstyle) {
            var currstyle = $('#' + elementid).attr('style');
            var newstyle = (currstyle ? currstyle : '') + htmlstyle;
            document.getElementById(elementid).setAttribute('style', newstyle);
            HPS._resizeFrame();
        },

        _setText: function (elementid, text) {
            document.getElementById(elementid).innerHTML = text;
        },

        _setPlaceholder: function (elementid, text) {
            document.getElementById(elementid).placeholder = text;
        },

        _resizeFrame: function () {
            var docHeight = jQuery('html').height();
            HPS.Messages.postMessage({action: "resize", height: docHeight}, HPS.parent_url, 'parent');
        },

        _styles: {
          body: function () {
            HPS.setStyle('heartland-body',
              'margin: 0;' +
              "font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;" +
              'color: #666;'
            );
          },
          labelsAndLegend: function () {
            var ids = [
              'heartland-card-number-label',
              'heartland-expiration-date-legend',
              'heartland-expiration-month-label',
              'heartland-expiration-year-label',
              'heartland-cvv-label'
            ];
            $.each(ids, function (i) {
              HPS.setStyle(ids[i],
                'font-size: 13px;' +
                'text-transform: uppercase;' +
                'font-weight: bold;' +
                'display: block;' +
                'width: 100%;' +
                'clear: both;'
              );
            });
          },
          inputsAndSelects: function () {
            var ids = [
              'heartland-card-number',
              'heartland-expiration-month',
              'heartland-expiration-year',
              'heartland-cvv'
            ];
            $.each(ids, function (i) {
              HPS.setStyle(ids[i],
                'width: 309px;' +
                'padding: 5px;' +
                'font-size: 14px;' +
                'margin: 3px 0px 15px 0px;' +
                'border: 1px #ccc solid;' +
                /* IE10 Consumer Preview */
                'background-image: -ms-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
                /* Mozilla Firefox */
                'background-image: -moz-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
                /* Opera */
                'background-image: -o-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
                /* Webkit (Safari/Chrome 10) */
                'background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0, #F7F7F7), color-stop(1, #EFEFEF));' +
                /* Webkit (Chrome 11+) */
                'background-image: -webkit-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
                /* W3C Markup, IE10 Release Preview */
                'background-image: linear-gradient(to top, #F7F7F7 0%, #EFEFEF 100%);'
              );
            });
          },
          fieldset: function () {
            HPS.setStyle('heartland-expiration-date-container',
              'border: 0;' +
              'margin: 0 25px 0px 1px;' +
              'padding: 0;' +
              'width: 173px;' +
              'display: inline-block;' +
              'float:  left;'
            );
          },
          selects: function () {
            var ids = ['heartland-expiration-month', 'heartland-expiration-year'];
            $.each(ids, function (i) {
              HPS.appendStyle(ids[i],
                'border: 0;' +
                'outline: 1px solid #ccc;' +
                'height: 28px;' +
                'width: 80px;' +
                '-webkit-appearance: none;' +
                '-moz-appearance: none;' +
                '-webkit-border-radius: 0px;' +
                'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzA5MTZFN0RFMDY2MTFFNEIyODZFMURFRTA3REUxMjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzA5MTZFN0VFMDY2MTFFNEIyODZFMURFRTA3REUxMjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMDkxNkU3QkUwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMDkxNkU3Q0UwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvMrdUAAAABiSURBVHjaYkxLS3vNwMAgwoAfvGUCEjkMhEE285kzZ65u2bLlJ5DjgkNRxUwgYPz//z+Yl56ePhNIpaEpAqnJADGYkASzgHgnEn8HyEoYB24i1FReILUPynUEmvYFJgcQYACYah+uDhpKGAAAAABJRU5ErkJggg==);' +
                'background-position: 65px 12px;' +
                'background-repeat: no-repeat;' +
                'background-color:  #F7F7F7;' +
                'float: left;' +
                'margin-right: 6px'
              );
            });
          },
          selectLabels: function () {
            var ids = ['heartland-expiration-month-label', 'heartland-expiration-year-label'];
            $.each(ids, function (i) {
              HPS.setStyle(ids[i],
                'position:absolute;' +
                'width:1px;' +
                'height:1px;' +
                'padding:0;' +
                'margin:-1px;' +
                'overflow:hidden;' +
                'clip:rect(0,0,0,0);' +
                'border:0;'
              );
            });
          },
          cvvContainer: function () {
            HPS.setStyle('heartland-cvv-container',
              'width: 110px;' +
              'display: inline-block;' +
              'float: left;'
            );
          },
          cvv: function () {
            HPS.appendStyle('heartland-cvv', 'width: 110px;', false);
          }
        },

        resizeIFrame: function (frame, height) {
            frame.style.height = (parseInt(height, 10)) + 'px';
        },

        setText: function (elementid, elementtext) {
            HPS.Messages.postMessage({action: "setText", id: elementid, text: elementtext}, HPS.iframe_url, 'child');
        },

        setStyle: function (elementid, elementstyle) {
            HPS.Messages.postMessage({action: "setStyle", id: elementid, style: elementstyle}, HPS.iframe_url, 'child');
        },

        appendStyle: function (elementid, elementstyle) {
            HPS.Messages.postMessage({action: "appendStyle", id: elementid, style: elementstyle}, HPS.iframe_url, 'child');
        },

        trim: function (string) {
            if (string !== undefined && typeof string === "string" ) {
                string = string.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            }

            return string;
        },

        empty: function (val) {
            return val === undefined || val.length === 0;
        },

        error: function (message) {
            $.error([HPS.Tag, ": ", message].join(""));
        },

        configureElement: function (options) {
            // set plugin data
            $(this).data(HPS.Tag, {
                public_key: options.public_key,
                success: options.success,
                error: options.error
            });

            // add event handler for form submission
            $(this).submit(function (e) {

                var theForm, data, i, cardType;

                // stop form from submitting
                e.preventDefault();

                // remove name attributes from sensitive fields
                $("#card_number").removeAttr("name");
                $("#card_cvc").removeAttr("name");
                $("#exp_month").removeAttr("name");
                $("#exp_year").removeAttr("name");

                theForm = $(this);

                // get data from storage
                data = theForm.data(HPS.Tag);

                // validate form - jQuery validate plugin
                if (typeof theForm.validate === 'function') {
                    theForm.validate();
                    // validation failed
                    if (!theForm.valid()) {
                        return;
                    }
                }

                var number = $.trim($("#card_number").val());
                var exp_month = $.trim($("#exp_month").val());
                var exp_year = $.trim($("#exp_year").val());

                var d = new Date();
                if (parseInt(exp_year) < d.getFullYear()) {
                    HPS.error("The expiration year is in the past.");
                    return;
                }

                HPS.tokenize({
                    data: {
                        public_key: data.public_key,
                        number: number,
                        cvc: $.trim($("#card_cvc").val()),
                        exp_month: exp_month,
                        exp_year: exp_year
                    },
                    success: function (response) {
                        // create field and append to form
                        $("<input>").attr({
                            type: "hidden",
                            id: "token_value",
                            name: "token_value",
                            value:  response.token_value
                        }).appendTo(theForm);

                        var re = {
                            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                            mastercard: /^5[1-5][0-9]{14}$/,
                            amex: /^3[47][0-9]{13}$/,
                            diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
                            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
                            jcb: /^(?:2131|1800|35\d{3})\d{11}$/
                        };

                        if (re.visa.test(number)) {
                            cardType = 'visa';
                        } else if (re.mastercard.test(number)) {
                            cardType = 'mastercard';
                        } else if (re.amex.test(number)) {
                            cardType = 'amex';
                        } else if (re.diners.test(number)) {
                            cardType = 'diners';
                        } else if (re.discover.test(number)) {
                            cardType = 'discover';
                        } else if (re.jcb.test(number)) {
                            cardType = 'jcb';
                        }

                        $("<input>").attr({
                            type: "hidden",
                            id: "card_type",
                            name: "card_type",
                            value: cardType
                        }).appendTo(theForm);

                        $("<input>").attr({
                            type: "hidden",
                            id: "exp_month",
                            name: "exp_month",
                            value: exp_month
                        }).appendTo(theForm);

                        $("<input>").attr({
                            type: "hidden",
                            id: "exp_year",
                            name: "exp_year",
                            value: exp_year
                        }).appendTo(theForm);

                        $("<input>").attr({
                            type: "hidden",
                            id: "last_four",
                            name: "last_four",
                            value: number.slice(-4)
                        }).appendTo(theForm);

                        // success handler provided
                        if (typeof data.success === 'function') {
                            // call the handler with payload
                            if (data.success(response) === false) {
                                return; // stop processing
                            }
                        }

                        theForm.unbind('submit'); // unbind event handler
                        theForm.submit(); // submit the form
                    },
                    error: function (response) {
                        if (typeof data.error === 'function') {
                            data.error(response);
                        }
                    }
                });

            });
        },

        parent: null,
        parent_url: '',
        configureInternalIframe: function (options) {
            HPS.parent = window.parent;
            HPS.Messages = new window.Messages();
            HPS.parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ''));

            $(window).on("load", function () {
                HPS._resizeFrame();
            });

            $(document).on('receiveMessageHandlerAdded', function () {
                HPS.Messages.postMessage({action: "receiveMessageHandlerAdded"}, HPS.parent_url, 'parent');
            });

            HPS.Messages.receiveMessage(function(m){
                var data = JSON.parse(m.data);
                switch(data.action) {
                    case 'tokenize': {
                        HPS.tokenize_iframe(data.message);
                        break;
                    }
                    case 'setStyle': {
                        HPS._setStyle(data.id, data.style);
                        HPS._resizeFrame();
                        break;
                    }
                    case 'appendStyle': {
                        HPS._appendStyle(data.id, data.style);
                        HPS._resizeFrame();
                        break;
                    }
                    case 'setText': {
                        HPS._setText(data.id, data.text);
                        HPS._resizeFrame();
                        break;
                    }
                    case 'setPlaceholder': {
                        HPS._setPlaceholder(data.id, data.text);
                        break;
                    }
                }
            }, '*');
        },

        // for iframe hash updates
        mailbox: [],
        cache_bust: 1,

        child: null,
        iframe_url: '',
        configureIframe: function (options) {
            var useDefaultStyles = true;
            var env = options.public_key.split("_")[1];
            var frame;
            HPS.Messages = new window.Messages();

            if (env === "cert") {
                HPS.iframe_url = HPS.Urls.iframeCERT;
            } else {
                HPS.iframe_url = HPS.Urls.iframePROD;
            }

            if (options.targetType === 'myframe') {
                frame = $(options.iframeTarget).get(0); // jq selector will pull back an array if more than one match.
                HPS.iframe_url = frame.src;
            } else {
                frame = document.createElement('iframe');
                frame.id = 'securesubmit-iframe';
                frame.style.border = '0';
                frame.scrolling = 'no';
                $(options.iframeTarget).append(frame);
            }

            HPS.iframe_url = HPS.iframe_url + '#' + encodeURIComponent(document.location.href.split('#')[0]);
            frame.src = HPS.iframe_url;

            HPS.frame = frame;
            if (window['postMessage']) {
                HPS.child = frame.contentWindow;
            } else {
                HPS.child = frame;
            }

            if (typeof options.useDefaultStyles !== 'undefined' && options.useDefaultStyles === false) {
                useDefaultStyles = false;
            }

            $(options.buttonTarget).click(function () {
                HPS.Messages.postMessage({action: "tokenize", message: options.public_key}, HPS.iframe_url, 'child');
            });

            HPS.Messages.receiveMessage(function(m){
                var data = JSON.parse(m.data);
                switch(data.action) {
                    case 'onTokenSuccess': {
                        options.onTokenSuccess(data.response);
                        break;
                    }
                    case 'onTokenError': {
                        options.onTokenError(data.response);
                        break;
                    }
                    case 'resize': {
                        HPS.resizeIFrame(frame, data.height);
                        break;
                    }
                    case 'receiveMessageHandlerAdded': {
                        if (useDefaultStyles) {
                            HPS._styles.body();
                            HPS._styles.labelsAndLegend();
                            HPS._styles.inputsAndSelects();
                            HPS._styles.fieldset();
                            HPS._styles.selects();
                            HPS._styles.selectLabels();
                            HPS._styles.cvvContainer();
                            HPS._styles.cvv();
                        }
                        $(document).trigger('securesubmitIframeReady');
                        break;
                    }
                }
            }, '*');
        }
    };

    $.fn.SecureSubmit = function (options) {

        return this.each(function () {
            if (!$(this).is("form") || typeof options !== 'object' || $.hasData($(this))) {
                return;
            }

            if (typeof options.type !== 'undefined' && options.type === 'iframe') {
              HPS.configureIframe.apply(this, [options]);
            } else {
              HPS.configureElement.apply(this, [options]);
            }
        });
    };

    return HPS;
}(jQuery));

var Messages = function(){
    this.interval_id = null;
    this.last_hash = null;
    this.window = window;
    this.pushIntervalStarted = false;
};

Messages.prototype.pushMessages = function () {
    var message = [];
    var i = length = 0;
    var target_url = current = targetNode = null;

    length = window.hps.mailbox.length;
    if (!length) {
        return;
    }

    for (i = 0; i < length; i++) {
        current = window.hps.mailbox.shift();
        if (!target_url) {
            target_url = current.targetUrl;
            targetNode = current.targetNode;
        }
        message.push(current.message);
    }

    if (message !== []) {
        message = JSON.stringify(message);
        targetNode.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (window.hps.cache_bust++) + '&' + encodeURIComponent(message);
    }

    message.length = 0;
    window.hps.mailbox.length = 0;
};

Messages.prototype.postMessage = function(message, target_url, target) {
    var targetNode;
    if (!target_url) {
       return;
    }

    message = JSON.stringify(message);
    targetNode = this.window.hps[target];

    if (this.window['postMessage']) {
        targetNode['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));
    } else if (target_url) {
        this.window.hps.mailbox.push({
            message: message,
            targetUrl: target_url,
            targetNode: targetNode
        });
        if (!this.pushIntervalStarted) {
            setInterval(this.pushMessages, 100);
        }
    }
};

Messages.prototype.receiveMessage = function(callback, source_origin) {
    if (this.window['postMessage']) {
        if (window['addEventListener']) {
            window[callback ? 'addEventListener' : 'removeEventListener']('message', callback, !1);
        } else {
            window[callback ? 'attachEvent' : 'detachEvent']('onmessage', callback);
        }
    } else {
        this.interval_id && clearInterval(this.interval_id);
        this.interval_id = null;

        if (callback) {
            this.interval_id = setInterval(function(){
                var hash = document.location.hash,
                re = /^#?\d+&/;
                if (hash !== this.last_hash && re.test(hash)) {
                    var m = {};
                    var i;
                    m.data = JSON.parse(decodeURIComponent(hash.replace(re, '')));
                    this.last_hash = hash;
                    if (Object.prototype.toString.call(m.data) !== '[object Array]') {
                        callback(m);
                        return;
                    }

                    for (i in m.data) {
                        callback({data: m.data[i]});
                    }
                }
            }, 100);
        }
    }
    jQuery(document).trigger('receiveMessageHandlerAdded');
};
