/*global $, jQuery*/
var hps = (function ($) {
    "use strict";

    var HPS;

    HPS = {

        Tag: "SecureSubmit",

        Urls: {
            CERT: "https://posgateway.cert.secureexchange.net/Hps.Exchange.PosGateway.Hpf.v1/api/token",
            PROD: "https://api.heartlandportico.com/SecureSubmit.v1/api/token"
        },
				
		tokenize: function (options) {			
			var gateway_url, params, env;

            // add additional service parameters
            params = $.param({
                "api_key": options.data.public_key,
                "object": "token",
                "token_type": "supt",
                "_method": "post",
                "card[number]": HPS.trim(options.data.number),
                "card[cvc]": HPS.trim(options.data.cvc),
                "card[exp_month]": HPS.trim(options.data.exp_month),
                "card[exp_year]": HPS.trim(options.data.exp_year)
            });

            env = options.data.public_key.split("_")[1];

            if (env === "uat") {
                gateway_url = HPS.Urls.UAT;
            } else if (env === "cert") {
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
                        }
						else {
	                        // handle exception
	                        HPS.error(response.error.message);							
						}
                    }
					else if(typeof options.success === 'function') {
						options.success(response);
					}
                }
            });

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

                var theForm, data, i;

                // stop form from submitting
                e.preventDefault();

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
				
                // remove name attributes from sensitive fields
                $("#card_number").removeAttr("name");
                $("#card_cvc").removeAttr("name");
                $("#exp_month").removeAttr("name");
                $("#exp_year").removeAttr("name");				

				HPS.tokenize({
					data: {
						public_key: data.public_key,
		                number: $("#card_number").val(),
		                cvc: $("#card_cvc").val(),
		                exp_month: $("#exp_month").val(),
		                exp_year: $("#exp_year").val()
					},
					success: function(response){

		                // create field and append to form
		                $("<input>").attr({
		                    type: "hidden",
		                    id: "token_value",
		                    name: "token_value",
		                    value: response.token_value
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
					error: function(response){
	                    if (typeof data.error === 'function') {
	                        data.error(response);
	                    }
					}
				});

            });
        }
    };

    $.fn.SecureSubmit = function (options) {

        return this.each(function () {
			
            if ($(this).is("form") === false || typeof options !== 'object' || typeof $(this).data(HPS.Tag) === 'object') {
                return;
            }

            HPS.configureElement.apply(this, [options]);
        });
    };
	
	return HPS;

}(jQuery));
