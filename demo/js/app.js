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
     app.checkSimulator=  function _checkSimulator() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.screen === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        };
    window.app.initCanvas = function _initCanvas(){
        if(!app.checkSimulator)
            window.screen.lockOrientation('landscape');
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




    var today=new Date();
        var events=[];
    function initCalendar(){
        
                   events[+new Date(today.getFullYear(), today.getMonth(), 8)]="exhibition";
                   events[+new Date(today.getFullYear(), today.getMonth(), 12)]="party";

                    /*$("#calendar").kendoCalendar({
                        value: today,
                        dates: events,
                        
                        month: {
                            // template for dates in month view
                            content: '# if (typeof data.dates[+data.date] === "string") { #' +
                                      '<div class="#= data.dates[+data.date] #">' +
                                      '#= data.value #' +
                                      '</div>' +
                                      '# } else { #' +
                                      '#= data.value #' +
                                      '# } #'
                        }
                    });*/
                    $("#calendar").kendoScheduler({
                        date: new Date("2013/6/6"),
                        editable: false,
                        mobile:"phone",
                        views: [{
                            type: "month"
                        }],
                        dataSource: [
                            {
                                id: 1,
                                start: new Date("2013/6/6 08:00 AM"),
                                end: new Date("2013/6/6 09:00 AM"),
                                title: "",
                                status:"H",
                            },
                            {
                                id: 2,
                                start: new Date("2013/6/7 08:00 AM"),
                                end: new Date("2013/6/7 09:00 AM"),
                                title: "",
                                status:"F"
                            },
                            {
                                id: 3,
                                start: new Date("2013/6/8 08:00 AM"),
                                end: new Date("2013/6/8 09:00 AM"),
                                title: "",
                                status:"P",
                            }
                        ],
                        
                        navigate: function(e) {
                            console.log("navigate", e.view);
                            var navigateTo=true;
                            if(e.view=="day"){
                                var datas=e.sender.data();
                                for(var i=0;i<datas.length;i++){
                                    if(kendo.toString(e.date, "d")==kendo.toString(datas[i].start, "d")){
                                            if(datas[i].status=="H")
                                                navigateTo=false;
                                    }
                                }
                                if(navigateTo)
                                    kendo.mobile.application.navigate("#patient-listview?uid=1");
                                else
                                    centered.show("Book is not allowed on holiday","error");
                            }
                                
                        },
                        dataBound: function (e) {                       
                            $(e.sender.element).find(".k-resize-handle").remove();
                            var events = $(e.sender.element).find(".k-event").height("100%").width("80%").css("text-align","center");
                            e.sender._data.forEach(function(eventDetails) {
                                if(eventDetails['status'] === "H"){
                                    $('div.k-event[data-uid="'+eventDetails['uid']+'"]').css("background", "red").css("border-style","groove");
                                }
                                else if(eventDetails['status'] === "F"){
                                    $('div.k-event[data-uid="'+eventDetails['uid']+'"]').css("background", "orange").css("border-style","groove");
                                }
                                else
                                    $('div.k-event[data-uid="'+eventDetails['uid']+'"]').css("background", "yellow").css("border-style","groove");
                            });
                        }
                    });
                    

    }
var serviceRoot = "http://192.168.88.14:8400/BookingSystem"
var readDate=new Date("2017/7/27");
var readView = "day";
var scheduleDataSource;
    var centered = $("#centeredNotification").kendoNotification({
                        stacking: "down",
                        show: onShow,
                        button: true
                    }).data("kendoNotification");
    var currentDate;
    var resetBackground=true;
    var schedulerNoneWorkHours;
    var resourceDS;
    var workhoursArray;
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
        
        
        
        $.ajax({
            url: 'http://192.168.88.14:8400/BookingSystem/booking/schedulerParas/1',
            type: 'post',                  
            contentType: "application/json",
            success: function fbs_click1(data) {  
            resourceDS =  new kendo.data.DataSource({data: data.resourceDs});  
            currentDate = new Date(data.date);
            readDate = currentDate;
            scheduleDataSource=new kendo.data.SchedulerDataSource({
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
            $("#testScheduler").kendoScheduler({
                date: new Date(data.date),
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                height:"auto",
                allDaySlot:data.allDaySlot,
                majorTick:data.majorTick,
                minorTickCount :data.minorTickCount,
                mobile: "phone",
                footer:data.footer,
                //views: $scope.schedulerOptions_allDaySlotviews,
                eventTemplate: $("#event-template").html(),
                timezone:"Etc/UTC",
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
                dataSource: scheduleDataSource,
                add:function(e){
                    //kendo.ui.progress($("#testScheduler"), true);
                    console.log(e.event.start);
                    if (!checkAvailability(e.event.start, e.event.end, e.event)) {
                        //kendo.ui.progress($("#testScheduler"), false);
                        e.preventDefault();
                    }
                    
                },
                edit:function(e){    
                    e.preventDefault();   
                    if(e.event.isNew()){
                        e.event.set('clinicId', 1);
                        e.event.set('bookId', 0);
                        e.event.set('itemId',1);
                        e.event.set('title','1');                                         
                            var action="/booking/create2";
                            //e.event.set('lastUpdateUser',$scope.currentEditUser);
                            //console.log("e.event:",e.event);
                            var models=[e.event];
                            $.ajax({                                                            
                                url: serviceRoot+action,
                                type: 'post',
                                contentType: "application/json",
                                data:JSON.stringify(models),
                                success: function fbs_click1() {                                   
                                    scheduleDataSource.read();
                                }
                            });
                    } else{
                        /*kendo.unbind($("#medicalCard"));
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
                        durationModel.set("bookDuration",e.event.bookDuration);*/
                    }         
                        
                        
                    },
                    save:function(e){
                         e.preventDefault();
                        e.event.set("title",e.event.lastName);
                        //e.event.set("medicalCardId",$("#medicalCard").val());
                        if(e.event.isNew()){
                            var action="/booking/create";
                            //e.event.set('lastUpdateUser',$scope.currentEditUser);
                            var models=[e.event];
                            $.ajax({                                                            
                                url: serviceRoot+action,
                                type: 'post',
                                data:JSON.stringify(models),
                                success: function fbs_click1() {
                                    console.log('success..........');
                                    scheduleDataSource.read();
                                }
                            });
                        }
                    },  
                    cancel:function(e){
                        //console.log("cancel:",e.event);
                        scheduleDataSource.read();
                    },
                    navigate:function(e){
                        if(e.view=="day" || e.view=="week")
                            resetBackground=true;
                        readDate=e.date;
                        readView=e.view;
                        scheduleDataSource.read();
                    },
                    /*group: {
                        resources: ["Rooms"],
                        orientation: data.groupOrientation
                    },
                    resources: [
                    {
                        field: "itemId",
                        name:"Rooms",
                        dataSource: new kendo.data.DataSource({data: data.resourceDs}),
                        title: "Item"
                    }          
                    ],*/
                    dataBound: function(e) {

                      
                               if(resetBackground){
                                   var self=this;

                                   workhoursArray=[];
                                   $.get(serviceRoot+"/booking/schedulerNoneWorkHours/"+this.view().name+"/"+this.date()+"/1",
                                     function(result){
                                     schedulerNoneWorkHours=result;
                                     var container = self.view().element;
                                     var cells = container.find("td[role=gridcell]");
                                     
                                     for (var i = 0; i < cells.length; i++) {
                                       var cell = $(cells[i]);
                                       
                                       if(!cell.hasClass("k-nonwork-hour"))
                                         cell.addClass("k-nonwork-hour");
                                       if(cell.hasClass("k-today"))
                                           cell.removeClass("k-today");
                                     }
                                     //var now=new Date();
                                     for (var i = 0; i < cells.length; i++) {
                                       var cell = $(cells[i]);

                                       if(self!=null){
                                         var slot = self.slotByElement(cell);
                                         if(slot!=null){
                                         var startHour = slot.startDate.getHours();
                                         var endHour = slot.endDate.getHours();
                                         //cell.removeClass("k-nonwork-hour");
                                         var dslength=resourceDS.options.data.length;
                                         
                                         /*var groupItemIndex=0;

                                         if(self.view().name=="week"){
                                           for(var k=0;k<dslength;k++){
                                             if(cell.context.cellIndex-k*7<=0){
                                               groupItemIndex=k;
                                               break;
                                             }
                                           }
                                         }
                                         else {
                                           groupItemIndex=cell.context.cellIndex
                                         }
                                         var groupItemId=(resourceDS.options.data[groupItemIndex].value);*/
                                         //console.log("groupItemId",groupItemId);
                                         for(var j=0;j<schedulerNoneWorkHours.length;j++){
                                           var tempObject=schedulerNoneWorkHours[j];
                                           console.log("tempObejct",tempObject);
                                           var hstartTime=new Date(tempObject.startTime);// kendo.timezone.convert(new Date(tempObject.startTime), now.getTimezoneOffset(), "Etc/UTC");
                                           var hendTime=new Date(tempObject.endTime);//kendo.timezone.convert(new Date(tempObject.endTime), now.getTimezoneOffset(), "Etc/UTC");

                                           //if(groupItemId==tempObject.itemId && slot.endDate.getYear()==hstartTime.getYear() && slot.endDate.getMonth()==hstartTime.getMonth()&& slot.endDate.getDate()==hstartTime.getDate()){
                                           if(slot.endDate.getYear()==hstartTime.getYear() && slot.endDate.getMonth()==hstartTime.getMonth()&& slot.endDate.getDate()==hstartTime.getDate()){
    
                                               if(tempObject.isHoliday){
                                                 //cell.css("background", "red");
                                                 if(!cell.hasClass("k-nonwork-hour"))
                                                   cell.addClass("k-nonwork-hour");
                                                 break;
                                               }
                                               else{
                                                 if(slot.startDate.getTime()>=hstartTime.getTime() && slot.endDate.getTime()<=hendTime.getTime()){

                                                  if(slot.startDate.getMinutes()%tempObject.sectionTime===0){
                                                    if(cell.hasClass("k-nonwork-hour"))
                                                      cell.removeClass("k-nonwork-hour");
                                                      //cell.css("background", "lightblue");
                                                      var workhourObj=new Object();
                                                      workhourObj.startTime=slot.startDate;
                                                      workhourObj.endTime=slot.endDate;
                                                      workhourObj.itemId=tempObject.itemId;
                                                      workhourObj.clinicId=tempObject.clinicId;
                                                      workhoursArray.push(workhourObj);

                                                  }
                                                   //cell.css("background", "#A19D99");

                                                   break;
                                                 }

                                               }
                                               
                                             }


                                           }
                                         }//slot !=null

                                           }
                                       }

                                       resetBackground=false;

                                     });
                                   }
                                   
                    }
                });
            }
        });
        
    }
    function onShow(e) {
                    if (e.sender.getNotifications().length == 1) {
                        var element = e.element.parent(),
                            eWidth = element.width(),
                            eHeight = element.height(),
                            wWidth = $(window).width(),
                            wHeight = $(window).height(),
                            newTop, newLeft;
                        
                        newLeft = Math.floor(wWidth / 2 - eWidth / 2);
                        newTop = Math.floor(wHeight / 2 - eHeight / 2);

                        e.element.parent().css({top: newTop, left: newLeft,'width':'100%'});
                    }
                }
    function checkAvailability(start, end, event, resources) {


                    /* if (eventExpiredOccupied(start, end, event, resources)) {
                         setTimeout(function() {
                           centered.show(kendo.toString(start, 'HH:MM:ss.') + kendo.toString(start.getMilliseconds(), "000"));
                           //toastr.error($scope.BookExpired,"",{positionClass: "toast-top-center",preventDuplicates:true,closeButton:true,escapeHtml:true});

                         }, 0);

                         return false;
                     }*/
                     
                     if (nonworkhoursOccupied(start, end, event, resources)) {
                         setTimeout(function() {
                           centered.show("Book is not allowed in this area","error");
                         }, 0);

                         return false;
                     }

                     return true;
        }
    function nonworkhoursOccupied(start, end, event, resources) {

                     if(workhoursArray.length>0 && typeof event!=="undefined"){
                       var isWorkhours=true;
                        var slotStart=moment(start);
                         var slotWorkhours=false;
                         for(var i=0;i<workhoursArray.length;i++){
                           var tempTime=workhoursArray[i];
                           /*var endItemId=event.itemId;
                           if(typeof resources!=="undefined")
                             endItemId=resources.itemId;
                           if(tempTime.itemId===endItemId){*/
                             console.log(slotStart,tempTime.startTime);
                             if(slotStart.isSame(moment(tempTime.startTime)) ){//|| slotStart.isBetween(moment(tempTime.startTime),moment(tempTime.endTime))
                               slotWorkhours=true;
                             }
                           //}
                         }
                         if(!slotWorkhours){
                           isWorkhours=false;
                           
                         }                     
                       if(!isWorkhours){
                         return true;
                       }
                     }
                     return false;
                   }
        

        function eventExpiredOccupied(start, end, event, resources) {
                     if(start.getTime()<currentDate.getTime()){
                       return true;
                     }
                     return false;
        }

   var canvas = document.getElementById('sketcher');
		var atrament = atrament(canvas, window.innerWidth, window.innerHeight);

		var clearButton = document.getElementById('clear');
		canvas.addEventListener('dirty', function(e) {
			clearButton.style.display = atrament.dirty ? 'inline-block' : 'none';
		});     
    function uploadImg(){
        $.ajax({
                   url: 'http://192.168.88.14:8400/BookingSystem/mobile/uploadImg',
                   type: 'post',
                   data: atrament.toImage(),               
                   contentType: "text/html",
                   success: function fbs_click1() {
                      console.log('success..........');
                   }
        });
    }
    