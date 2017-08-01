// JavaScript Document
'use strict';

(function(){
    var app = {
        data: {},
        localization: {
            defaultCulture: 'en',
            cultures: [{
                name: "English",
                code: "en"
            }]
        },
        navigation: {
            viewModel: kendo.observable()
        },
        showMore: {
            viewModel: kendo.observable()
        }
    };

    var bootstrap = function() {
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                layout: "mobile-tabstrip",
                skin: 'nova',
                initial: '#login-view'              
            });
            //kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });
    };

    $(document).ready(function() {

        var navigationShowMoreView = $('#navigation-show-more-view').find('ul'),
            allItems = $('#navigation-container-more').find('a'),
            navigationShowMoreContent = '';

        allItems.each(function(index) {
            navigationShowMoreContent += '<li>' + allItems[index].outerHTML + '</li>';
        });

        navigationShowMoreView.html(navigationShowMoreContent);
        kendo.bind($('#navigation-show-more-view'), app.showMore.viewModel);

        app.notification = $("#notify");

    });

    app.listViewClick = function _listViewClick(item) {
        var tabstrip = app.mobileApp.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip');
        tabstrip.clear();
    };

    app.showNotification = function(message, time) {
        var autoHideAfter = time ? time : 3000;
        app.notification.find('.notify-pop-up__content').html(message);
        app.notification.fadeIn("slow").delay(autoHideAfter).fadeOut("slow");
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function() {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function(url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function(itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function(event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function(formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function(key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function(widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function() {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
})(window);

/// start app modules
(function localization(app) {
    var localization = app.localization = kendo.observable({
            cultures: app.localization.cultures,
            defaultCulture: app.localization.defaultCulture,
            currentCulture: '',
            strings: {},
            viewsNames: [],
            registerView: function(viewName) {
                app[viewName].set('strings', getStrings() || {});

                this.viewsNames.push(viewName);
            }
        }),
        i, culture, cultures = localization.cultures,
        getStrings = function() {
            var code = localization.get('currentCulture'),
                strings = localization.get('strings')[code];

            return strings;
        },
        updateStrings = function() {
            var i, viewName, viewsNames,
                strings = getStrings();

            if (strings) {
                viewsNames = localization.get('viewsNames');

                for (i = 0; i < viewsNames.length; i++) {
                    viewName = viewsNames[i];

                    app[viewName].set('strings', strings);
                }

                app.navigation.viewModel.set('strings', strings);
                app.showMore.viewModel.set('strings', strings);
            }
        },
        loadCulture = function(code) {
            $.getJSON('cultures/' + code + '/app.json',
                function onLoadCultureStrings(data) {
                    localization.strings.set(code, data);
                });
        };

    localization.bind('change', function onLanguageChange(e) {
        if (e.field === 'currentCulture') {
            var code = e.sender.get('currentCulture');

            updateStrings();
        } else if (e.field.indexOf('strings') === 0) {
            updateStrings();
        } else if (e.field === 'cultures' && e.action === 'add') {
            loadCulture(e.items[0].code);
        }
    });

    for (i = 0; i < cultures.length; i++) {
        loadCulture(cultures[i].code);
    }

    localization.set('currentCulture', localization.defaultCulture);
})(window.app);
/// end app modules

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp



var currentSecurityCode;
var authenticatedUserId;
var platform;
var deviceRegId;
var serverURL="http://192.168.88.126:8400";

var UserObject=function(id,userId,password,email,mobileDeviceId,mobileDeviceType,securitycode){
	this.id=id;
	this.userId=userId;
	this.password=password;
	this.email=email;
	this.mobileDeviceId=mobileDeviceId;
	this.mobileDeviceType=mobileDeviceType;
	this.securitycode=securitycode;
};



(function(window) {
    app.initScheduler = function _initScheduler() {
        $("#scheduler").kendoScheduler({
            date: new Date("2013/6/26"),
            startTime: new Date("2013/6/26 07:00 AM"),
            height: 'auto',
            views: [
                { type: "day", selected: true },
                { type: "week", selectedDateFormat: "{0:ddd,MMM dd,yyyy} - {1:ddd,MMM dd,yyyy}" },
                "month",
                { type: "agenda", selectedDateFormat: "{0:ddd, M/dd/yyyy} - {1:ddd, M/dd/yyyy}" }
            ],
            mobile: "phone",
            timezone: "Etc/UTC",
            dataSource: {
                batch: true,
                transport: {
                    read: {
                        url: "https://demos.telerik.com/kendo-ui/service/meetings",
                        dataType: "jsonp"
                    },
                    update: {
                        url: "https://demos.telerik.com/kendo-ui/service/meetings/update",
                        dataType: "jsonp"
                    },
                    create: {
                        url: "https://demos.telerik.com/kendo-ui/service/meetings/create",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: "https://demos.telerik.com/kendo-ui/service/meetings/destroy",
                        dataType: "jsonp"
                    },
                    parameterMap: function(options, operation) {
                        if (operation !== "read" && options.models) {
                            return {models: kendo.stringify(options.models)};
                        }
                    }
                },
                schema: {
                    model: {
                        id: "meetingID",
                        fields: {
                            meetingID: { from: "MeetingID", type: "number" },
                            title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                            start: { type: "date", from: "Start" },
                            end: { type: "date", from: "End" },
                            startTimezone: { from: "StartTimezone" },
                            endTimezone: { from: "EndTimezone" },
                            description: { from: "Description" },
                            recurrenceId: { from: "RecurrenceID" },
                            recurrenceRule: { from: "RecurrenceRule" },
                            recurrenceException: { from: "RecurrenceException" },
                            roomId: { from: "RoomID", nullable: true },
                            attendees: { from: "Attendees",  defaultValue: [] },
                            isAllDay: { type: "boolean", from: "IsAllDay" }
                        }
                    }
                }
            },
            group: {
                    resources: ["Rooms"]
                    //orientation: $scope.schedulerOptions_groupOrientation
            },
            resources: [
            {
                field: "roomId",
                name:"Rooms",
                dataSource: [
                    { text: "Meeting Room 101", value: 1, color: "#6eb3fa" },                   
                    { text: "Meeting Room 201", value: 2, color: "#f58a8a" }
                ],
                title: "Room"
            },
            {
                field: "attendees",
                dataSource: [
                    { text: "Alex", value: 1, color: "#f8a398" },
                    { text: "Bob", value: 2, color: "#51a0ed" },
                    { text: "Charlie", value: 3, color: "#56ca85" }
                ],
                multiple: true,
                title: "Attendees"
            }
            ]
        });
    }

	window.app.initGrid = function _initGrid() {
        var crudServiceBaseUrl = "https://demos.telerik.com/kendo-ui/service";
        var dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: crudServiceBaseUrl + "/Products",
                    dataType: "jsonp"
                },
                update: {
                    url: crudServiceBaseUrl + "/Products/Update",
                    dataType: "jsonp"
                },
                destroy: {
                    url: crudServiceBaseUrl + "/Products/Destroy",
                    dataType: "jsonp"
                },
                create: {
                    url: crudServiceBaseUrl + "/Products/Create",
                    dataType: "jsonp"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                }
            },
            batch: true,
            
            pageSize: 20,
            schema: {
                model: {
                    id: "ProductID",
                    fields: {
                        ProductID: { editable: false, nullable: true },
                        ProductName: { validation: { required: true } },
                        UnitPrice: { type: "number", validation: { required: true, min: 1} },
                        Discontinued: { type: "boolean" },
                        UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                    }
                }
            }
        });

        $("#grid").kendoGrid({
            dataSource: dataSource,
            pageable: true,
            mobile: "phone",
            height: 'auto',
            resizable: true,
            toolbar: ["create"],
            columns: [
                { field:"ProductName", title: "Product Name"},
                { field: "UnitPrice", title:"Unit Price", format: "{0:c}" },
                { field: "UnitsInStock", title:"In Stock"},              
                { command: ["edit"], title: "&nbsp;" }
            ],
            editable: "popup",
            filterable: true,
            sortable: true,
            columnMenu: true
        });
    }

		window.app.loginModel = kendo.observable({
        userId: "test",
		password:"test",
        testlogin: function() {
            console.log('test..login');
			var user=new UserObject(0,app.loginModel.userId,app.loginModel.password,"email","","","","");
            $.ajax({
        		type       : "POST",
        		url        : "http://192.168.88.14:8400/BookingSystem/mobile/loginByMobile",
       			crossDomain: true,
				contentType: "application/json; charset=utf-8",
        		dataType   : 'json',
				data:JSON.stringify(user),
        		success    : function(response) {

					if(response==="Y"){
                        $("#main-footer").css("display","block");
                        app.mobileApp.navigate("#clinic-listview");
                        
					}
					else{
						 navigator.notification.alert("Invalid User!",
                    function () { }, "Login failed", 'OK');
					}

        	},
        		error: function(error) {
           	 		console.error(error);

								navigator.notification.alert("Invalid User!",
                    function () { }, "Login failed", 'OK');
        		}
	  		});
        }
    });
    app.cardListModel = kendo.observable({
       
          cardDS : new kendo.data.DataSource({
                     transport: {
                       read: {
                           url:"http://192.168.88.14:8400/BookingSystem/medicalCard/listForSelect",
                           dataType: "json",
                           type: "POST",
                           contentType: "application/json"
                       }
                     }
                   }) 
        
    });
    kendo.bind($("#medicalCardId"), app.cardListModel);
    
    app.test = function _test(){
        app.showNotification('<font color=red >'+new Date()+'</font>',5000);
    }
     
    

 //window.app = new kendo.mobile.Application(document.body, { transition: "slide", layout: "mobile-tabstrip",skin: "nova"});
})(window);



var crudServiceBaseUrl = "http://192.168.88.14:8400/HKCDC",
        dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: crudServiceBaseUrl + "/clinic/list",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json"
                },
                update: {
                    url: crudServiceBaseUrl + "/clinic/dpdate",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json"
                },
                destroy: {
                    url: crudServiceBaseUrl + "/clinic/destroy",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        clinicName: "clinicName"
                    }
                }
            }
        });

    function listClinicsInit(e) {
        e.view.element.find("#clinic-list").kendoMobileListView({
            dataSource: dataSource,
            template: $("#clinic-list-emplate").html()
        })
        .kendoTouch({
            filter: ">li",
            enableSwipe: true,
            touchstart: touchstartForClinic,
            tap: navigateForClinic,
            swipe: swipeForClinic
        });
    }

    var selectedClinicId=0;
    function navigateForClinic(e) {
        console.log($(e.touch.target).data("uid"))
        var itemUID = $(e.touch.target).data("uid");
        selectedClinicId = itemUID;
        doctorDataSource.read();
        kendo.mobile.application.navigate("#doctor-listview?uid=" + itemUID);
    }

    function swipeForClinic(e) {
        var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
        button.expand().duration(30).play();
    }

    function touchstartForClinic(e) {
        var target = $(e.touch.initialTouch),
            listview = $("#clinic-list").data("kendoMobileListView"),
            model,
            button = $(e.touch.target).find("[data-role=button]:visible");

        if (target.closest("[data-role=button]")[0]) {
            model = dataSource.getByUid($(e.touch.target).attr("data-uid"));
            dataSource.remove(model);

            //prevent `swipe`
            this.events.cancel();
            e.event.stopPropagation();
        } else if (button[0]) {
            button.hide();

            //prevent `swipe`
            this.events.cancel();
        } else {
            listview.items().find("[data-role=button]:visible").hide();
        }
    }
    var doctorDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/assignDoctor/list",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                    else{
                        return {clinicId:selectedClinicId}
                    }
                }
            },
            sort: {
                field: "doctorName",
                dir: "asc"
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            pageSize: 50
        });
    function listDoctorsInit() {
        

        $("#doctor-filterable-listview").kendoMobileListView({
            dataSource: doctorDataSource,
            template: $("#doctor-list-template").html(),
            filterable: {
                field: "doctorName",
                operator: "startswith"
            },
            autoBind:false
        }).kendoTouch({
            filter: ">li",
            enableSwipe: true,
            tap: navigateForDoctor,
            swipe: swipeForDoctor
        });
    }
    function navigateForDoctor(e) {
        console.log($(e.touch.target).data("uid"))
        var itemUID = $(e.touch.target).data("uid");
        kendo.mobile.application.navigate("#patient-listview?uid=" + itemUID);
    }

    function swipeForDoctor(e) {
        var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
        button.expand().duration(30).play();
    }

    function listPatientsInit() {
        var dataSource = new kendo.data.DataSource({
            type: "odata",
            transport: {
                read: {
                    url: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
                }
            },
            sort: {
                field: "ProductName",
                dir: "desc"
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            pageSize: 50
        });

        $("#patient-filterable-listview").kendoMobileListView({
            dataSource: dataSource,
            template: $("#patient-list-template").html(),
            filterable: {
                field: "ProductName",
                operator: "startswith"
            },
            endlessScroll: true
        }).kendoTouch({
            filter: ">li",
            enableSwipe: true,
            tap: navigateForPatient,
            swipe: swipeForPatient
        });
    }
    function navigateForPatient(e) {
        console.log($(e.touch.target).data("uid"))
        var itemUID = $(e.touch.target).data("uid");
        kendo.mobile.application.navigate("#patient-detailview?uid=" + itemUID);
    }

    function swipeForPatient(e) {
        var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
        button.expand().duration(30).play();
    }

    function showPatientsInit(){
        $("#products").kendoComboBox({
                        placeholder: "Select product",
                        dataTextField: "ProductName",
                        dataValueField: "ProductID",
                        filter: "contains",
                        autoBind: false,
                        minLength: 3,
                        autoWidth: true,
                        dataSource: {
                            type: "odata",
                            serverFiltering: true,
                            transport: {
                                read: {
                                    url: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products",
                                }
                            }
                        }
                    });
    }
var serviceRoot = "http://192.168.88.14:8400/BookingSystem"
var readDate=new Date("2017/7/27");
var readView = "day";
var scheduleDataSource=new kendo.data.SchedulerDataSource({
                             batch:true,

                             transport: {
                                 read: {
                                     url: serviceRoot+"/booking/read/scheduler",
                                     dataType: "json",
                                     type: "POST",
                                     contentType: "application/json"
                                 },
                                 update: {
                                     url: serviceRoot+"/booking/update",
                                     dataType: "json",
                                     type: "POST",
                                     contentType: "application/json"

                                 },
                                 create: {
                                     url: serviceRoot+"/booking/create",
                                     dataType: "json",
                                     type: "POST",
                                     contentType: "application/json"
                                 },
                                 destroy: {
                                     url: serviceRoot+"/booking/destroy",
                                     dataType: "json",
                                     type: "POST",
                                     contentType: "application/json"
                                 },
                                 parameterMap:function(options, operation) {

                                     if (operation !== "read" && options.models) {

                                         return JSON.stringify(options.models);
                                       //  return {models: kendo.stringify(options.models)};
                                     }
                                     else if(operation==="read"){
                                        
                                       
    	                                if(typeof scheduler !=="undefined" ){
                                            var result = {
                                             //convert iso8601 format
                                              start:moment(readDate).format("YYYY-MM-DDTHH:mm:ss.sss")+"Z",
                                              view: readView,
                                              clinicId: 1
                                        };
                                        var models=[result];

                                       if(result.clinicId!==null){

                                           return JSON.stringify(models);
                                       }
                                       else {
                                         return JSON.stringify([]);
                                       }
                                        }
                                       
                                     }

                                 }
                             }
                         });
    function initTestScheduler() {
        var cardDS = new kendo.data.DataSource({
                        transport: {
                                read: {
                                    url:"http://192.168.88.14:8400/BookingSystem/medicalCard/listForSelect",
                                    dataType: "json",
                                    type: "POST",
                                    contentType: "application/json"
                                }
                        }
                    });
        
        $("#testScheduler").kendoScheduler({
            date: new Date("2017/7/27"),
            //startTime: new Date("2013/6/26 07:00 AM"),
            height: 'auto',
            allDaySlot: false,
            majorTick:30,
            minorTickCount :2,
            views: [
                { type: "day", selected: true },
                { type: "week", selectedDateFormat: "{0:ddd,MMM dd,yyyy} - {1:ddd,MMM dd,yyyy}" },
                "month",
                { type: "agenda", selectedDateFormat: "{0:ddd, M/dd/yyyy} - {1:ddd, M/dd/yyyy}" },
                "timeline"
            ],
            editable: {
                                 //confirmation: $scope.BookDeleteItem,
                                 //create: $scope.editable,
                                 //destroy: false,
                                 //move: true,
                                 //resize: true
                                 mode:"popup",
                                 template: kendo.template($("#patientEditorTemplate").html(), {useWithBlock:false})
                               },
            mobile: "phone",
            timezone: "Etc/UTC",
            dataSource: scheduleDataSource,
            edit:function(e){
                /*$("#medicalCardId").kendoDropDownList({
                    dataSource: new kendo.data.DataSource({
                     transport: {
                       read: {
                           url:"http://192.168.88.14:8400/BookingSystem/medicalCard/listForSelect",
                           dataType: "json",
                           type: "POST",
                           contentType: "application/json"
                       }
                    }}),
                    dataTextField: "cardDesc",
                    dataValueField: "id",
                    height:200
                });*/
                //console.log("edit",e.event);
                kendo.unbind($("#medicalCard"));
                var viewModel = kendo.observable({
                    medicalCardId: e.event.medicalCardId,
                    isPrimitive: false,
                    isVisible: true,
                    isEnabled: true,
                                      
                    onOpen: function() {
                        //console.log("event :: open");
                    },
                    onChange: function() {
                        //this.set("medicalCardId", null);
                        e.event.set("medicalCardId", this.get("medicalCardId"));
                        //console.log("event :: change ( test )"+this.get("medicalCardId"));
                    },
                    onClose: function() {
                        //console.log("event :: close");
                    },
                    products: cardDS
                });
                kendo.bind($("#medicalCard"), viewModel);
                viewModel.set("medicalCardId", e.event.medicalCardId);
                
                var durationModel = kendo.observable({
                    bookDuration: 5,                  
                    onChange: function() {
                        e.event.set("bookDuration", this.get("bookDuration"));
                    }
                });
                kendo.bind($("#bookDurationId"), durationModel);
                durationModel.set("bookDuration",e.event.bookDuration);
                
            },
            save:function(e){
                e.event.set("title",e.event.lastName);
                //e.event.set("medicalCardId",$("#medicalCard").val());
            },  
            cancel:function(e){
                //console.log("cancel:",e.event);
                scheduleDataSource.read();
            },
            navigate:function(e){
                readDate=e.date;
                readView=e.view;
                scheduleDataSource.read();
            },
            resources: [
            {
                field: "itemId",
                name:"Rooms",
                dataSource: [
                    { text: "Meeting Room 101", value: 1, color: "#6eb3fa" },                   
                    { text: "Meeting Room 201", value: 2, color: "#f58a8a" }
                ],
                title: "Item"
            },
            /*{
                field: "medicalCardId",
                name:"card",
                dataSource: new kendo.data.DataSource({
                     transport: {
                       read: {
                           url:"http://192.168.88.14:8400/BookingSystem/medicalCard/listForSelect",
                           dataType: "json",
                           type: "POST",
                           contentType: "application/json"
                       }
                     },schema: {
                                 model: {
                                     id: "id",
                                     fields: {
                                         value: { from: "id", type: "number" },
                                         text:{from:"cardDesc"}
                                     }
                                 }
                     }
                   }) ,
                title: "card"
            },*/
            ]
        });
    }
    
        

