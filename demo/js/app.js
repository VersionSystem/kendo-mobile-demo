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

    window.app = app;
    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
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

var UserObject=function(id,userId,password,email,mobileDeviceId,mobileDeviceType,securitycode,clinicCode){
	this.id=id;
	this.userId=userId;
	this.password=password;
	this.email=email;
	this.mobileDeviceId=mobileDeviceId;
	this.mobileDeviceType=mobileDeviceType;
	this.securitycode=securitycode;
    this.clinicCode=clinicCode;
};
var Book=function(bookNo,clinic,doctorCode,date,bookTime,patientName,phone1,usageTime,visitFlag,remark,specialDate){
    this.bookNo=bookNo;
	this.clinic=clinic;
	this.doctorCode=doctorCode;
    this.date=date;
	this.bookTime=bookTime;
	this.patientName=patientName;
	this.phone1=phone1;
	this.usageTime=usageTime;
	this.visitFlag=visitFlag;
    this.remark=remark;
    this.specialDate=specialDate;
};


var selectedDoctor;
var selectedMonth=moment(new Date()).format("YYYY-MM-DD");
var selectedAvailableTime;
var selectedClinicId=0;
var selectedClinic="";
var selectedDate=moment(new Date()).format("YYYY-MM-DD");
var selectedBook;


(function(window) {
 
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

 //window.app = new kendo.mobile.Application(document.body, { transition: "slide", layout: "mobile-tabstrip",skin: "nova"});
})(window);


window.app.loginModel = kendo.observable({
        userId: "BUT",
		password:"123",
        testlogin: function() {
            
			var user=new UserObject(0,app.loginModel.userId,app.loginModel.password,"email","","","","");
            
            $.ajax({
        		type       : "POST",
        		url        : "http://192.168.88.14:8400/MobileBooking/mobile/loginByMobile",
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

    //--Clinic View-------------------------------------------------------------

    var crudServiceBaseUrl = "http://192.168.88.14:8400/MobileBooking";
       var dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: crudServiceBaseUrl + "/book/getClinics",
                    dataType: "json",
                    type: "GET",
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
                    id: "code",
                    fields: {
                        code: { editable: false, nullable: true },
                        name: "name"
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
            tap: navigateForClinic,
            swipe: navigateForClinic
        });
    }
    
    function navigateForClinic(e) {
        var i=$(e.touch.target).index();
        console.log(i, dataSource.data()[i]);
        var itemUID = dataSource.data()[i].code;
        selectedClinicId = itemUID;
        selectedClinic = itemUID;
        doctorDataSource.read();
        kendo.mobile.application.navigate("#doctor-listview?uid=" + itemUID);
        $("#doctor-list-header").html("<span class='k-icon k-i-myspace' style='color:white'></span>&nbsp;Clinic:"+dataSource.data()[i].name);
    }
    //--Doctor list-------------------------------------------------------

    var doctorDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/book/getDoctors",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                    else{
                        var model={};
                        model.selectedClinic=selectedClinic;
                        return kendo.stringify(model);
                    }
                }
            },
            schema: {
                model: {
                    id: "code",
                    fields: {
                        code: { editable: false, nullable: true },
                        name: "name"
                    }
                }
            },
            sort: {
                field: "code",
                dir: "asc"
            }
        });   
    function listDoctorsInit() {
       
        $("#doctor-filterable-listview").kendoMobileListView({
            dataSource: doctorDataSource,
            template: $("#doctor-list-template").html(),
            autoBind:false,
            filterable: {
                field: "code",
                operator: "startswith"
            }
        }).kendoTouch({
            filter: ">li",
            enableSwipe: true,           
            tap: navigateForDoctor,
            swipe: navigateForDoctor
        });
    }
    function navigateForDoctor(e) {
         var i=$(e.touch.target).index();
        //console.log(i, doctorDataSource.data()[i]);
        var itemUID = doctorDataSource.data()[i].code;      
        selectedDoctor = itemUID;
        monthDataSource.read();
        kendo.mobile.application.navigate("#calendar-view?uid=" + itemUID);
        $("#calendar-header").html("<div><span class='k-icon k-i-myspace' style='color:white' ></span>&nbsp;Clinic:"+selectedClinic+"</div><div><span  class='k-icon k-i-user' style='color:white'></span>&nbsp;Doctor:"+selectedDoctor+"</div>");
        //$(".k-reset .k-header .k-scheduler-navigation").append("Clinic:Doctor:");
        //console.log($(".k-reset .k-header .k-scheduler-navigation"));
    }


    //--Month view----------------------------------------------------------------------------------------
    
    var today=new Date();
    var events=[];
    var monthDataSource=new kendo.data.SchedulerDataSource({
                             batch:true,
                             transport: {
                                 read: {
                                     url:"http://192.168.88.14:8400/MobileBooking/book/getMonthData2",
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
                                        
                                       
    	                                //if(typeof scheduler !=="undefined" ){
                                            var result = {};
                                            result.clinic=selectedClinic;
                                            result.doctor=selectedDoctor;
                                            result.date=selectedMonth;
                                                                                
                                            return JSON.stringify(result);                                                                             
                                        //}
                                       
                                     }

                                 }
                             }
                         });
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
                        //date: new Date(),
                        editable: false,
                        mobile:"phone",
                        views: [{
                            type: "month"
                        }],
                        dataSource:monthDataSource,
                        autoBind:false,
                        navigate: function(e) {
                            
                            var navigateTo=true;
                            var bookStatus;
                            if(e.view=="day"){
                                selectedDate = moment(e.date).format("YYYY-MM-DD");
                                console.log("selectedDate:",selectedDate);
                                var datas=e.sender.data();
                                for(var i=0;i<datas.length;i++){
                                    if(kendo.toString(e.date, "d")==kendo.toString(datas[i].start, "d")){
                                            if(datas[i].status=="H" || datas[i].status=="B"){
                                                bookStatus=datas[i].status;
                                                navigateTo=false;
                                            }
                                                
                                    }
                                }
                                if(navigateTo){
                                    refreshCalendar=false;
                                    availabelTimeDataSource.read();
                                    availabelTimeDataSource.filter({field: "bookCount", operator: "eq", value: ""});
                                    kendo.mobile.application.navigate("#available-book-time-view?uid=1");
                                    $("#time-header").html("<div><span class='k-icon k-i-myspace' style='color:white'></span>&nbsp;Clinic:"+selectedClinic+"</div><div><span class='k-icon k-i-user' style='color:white'></span>&nbsp;Doctor:"+selectedDoctor+"</div><div><span class='k-icon k-i-calendar-date' style='color:white'></span>&nbsp;Date:"+selectedDate+"</div>");
                                    $("#moreId").show();
                                    $("#replyId").hide();
                                    
                                }                                  
                                else{
                                    if(bookStatus=="H")
                                        centered.show("Book is not allowed on holiday!","error");
                                    else
                                        centered.show("Book service is not available now!","error");
                                }
                                    
                            }else if(e.view=="month"){
                                //console.log("navigate", e);
                                selectedMonth = moment(e.date).format("YYYY-MM-DD");
                                monthDataSource.read();
                            }
                                
                        },
                        dataBound: function (e) {                       
                            $(e.sender.element).find(".k-resize-handle").remove();
                            var events = $(e.sender.element).find(".k-event").height("100%").width("80%").css("text-align","center");
                            e.sender._data.forEach(function(eventDetails) {
                                if(eventDetails['status'] === "H" || eventDetails['status'] === "B"){
                                    $('div.k-event[data-uid="'+eventDetails['uid']+'"]').css("background", "red").css("border-style","groove");
                                }
                                else if(eventDetails['status'] === "F"){
                                    $('div.k-event[data-uid="'+eventDetails['uid']+'"]').css("background", "orange").css("border-style","groove");
                                }
                                else
                                    $('div.k-event[data-uid="'+eventDetails['uid']+'"]').css("background", "green").css("border-style","groove");
                            });
                        }
                    });
                    

    }
    var refreshCalendar=false;
    function showCalendar(){
        if(refreshCalendar)
            monthDataSource.read();
    }

    //-- Available book time view----------------------------------------------------------------------------------------

    var availabelTimeDataSource = new kendo.data.DataSource({           
            transport: {
                read: {
                    url: crudServiceBaseUrl+"/book/findAvailableTime2",///SWH/SW.KONG/2017-05-09"
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                    else{
                        var result = {};
                        result.clinic=selectedClinic;
                        result.doctor=selectedDoctor;
                        result.date=selectedDate;                                                                               
                        return JSON.stringify(result);     
                    }
                }
            },
            filter: { field: "bookCount", operator: "eq", value: "" }
        });
    function listBookTimeInit(e) {
        $("#replyId").hide();            
        $("#book-time-listview").kendoMobileListView({
            autoBind:false,
            dataSource: availabelTimeDataSource,
            template: $("#booktime-list-template").html(),          
            filterable: {
                field: "bookTimeShow",
                operator: "startswith"
            }
        }).kendoTouch({
            filter: ">li",
            enableSwipe: true,
            touchstart: touchstartForDetail,
            tap: navigateForDetail,
            swipe: swipeForDetail
        });
    }
    
    function navigateForDetail(e) {
        selectedAvailableTime = availabelTimeDataSource.getByUid($(e.touch.target).attr("data-uid"));
        //console.log(selectedAvailableTime);
        returnDetailList=false;
        kendo.mobile.application.navigate("#bookform-view?uid=");
        $("#form-header").html("<div><span class='k-icon k-i-myspace' style='color:white'></span>&nbsp;Clinic:"+selectedClinic+"</div><div><span class='k-icon k-i-user' style='color:white'></span>&nbsp;Doctor:"+selectedDoctor+"</div><div><span class='k-icon k-i-calendar-date' style='color:white'></span>&nbsp;Date:"+selectedDate+"</div><div><span class='k-icon k-i-clock' style='color:white'></span>&nbsp;Time:"+selectedAvailableTime.bookTimeShow+"</div>");
        $("#deleteBtn").hide();
    }

    function swipeForDetail(e) {
        selectedAvailableTime = availabelTimeDataSource.getByUid($(e.touch.target).attr("data-uid"));
        if(selectedAvailableTime.bookCount!=""){
            var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
            button.expand().duration(30).play();
        }
        
    }
    function touchstartForDetail(e) {
        var target = $(e.touch.initialTouch),
            listview = $("#book-time-listview").data("kendoMobileListView"),
            model,
            button = $(e.touch.target).find("[data-role=button]:visible");

        if (target.closest("[data-role=button]")[0]) {
            selectedAvailableTime = availabelTimeDataSource.getByUid($(e.touch.target).attr("data-uid"));
            //console.log("selectedAvailableTime",selectedAvailableTime);
            //availabelTimeDataSource.remove(model);
            returnDetailList=false;
            kendo.mobile.application.navigate("#book-detail-view");
            bookDetailDataSource.read();
            $("#detail-header").html("<div><span class='k-icon k-i-myspace' style='color:white'></span>&nbsp;Clinic:"+selectedClinic+"</div><div><span class='k-icon k-i-user' style='color:white'></span>&nbsp;Doctor:"+selectedDoctor+"</div><div><span class='k-icon k-i-calendar-date' style='color:white'></span>&nbsp;Date:"+selectedDate+"</div><div><span class='k-icon k-i-clock' style='color:white'></span>&nbsp;Time:"+selectedAvailableTime.bookTimeShow+"</div>");
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
    function showBookTimeList(){
        
        var listview= $("#book-time-listview").data('kendoMobileListView');
        listview.items().find("[data-role=button]:visible").hide();
    }
    function showAllTime(){
        var listview= $("#book-time-listview").data('kendoMobileListView');
        listview.dataSource.filter({});
        $("#moreId").hide();
        $("#replyId").show();
    }
    function showTime(){
        var listview= $("#book-time-listview").data('kendoMobileListView');
        listview.dataSource.filter({field: "bookCount", operator: "eq", value: ""});
        $("#moreId").show();
        $("#replyId").hide();
    }

    //--Book Detail view----------------------------------------------------------------------------

    var bookDetailDataSource = new kendo.data.DataSource({           
            transport: {
                read: {
                    url: crudServiceBaseUrl+"/book/findBookDetails",///SWH/SW.KONG/2017-05-09"
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read" && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                    else{
                        var result = {};
                        result.clinic=selectedClinic;
                        result.doctor=selectedDoctor;
                        result.date=selectedDate;
                        result.bookTime=selectedAvailableTime.bookTime;                                                                               
                        return JSON.stringify(result);     
                    }
                }
            }
    });
    function listBookDetailInit(e) {      
         
        
        e.view.element.find("#book-detail-listview").kendoMobileListView({
            dataSource: bookDetailDataSource,
            autoBind:false,
            template: $("#bookdetail-list-template").html()
        }).kendoTouch({
            filter: ">li",
            enableSwipe: true,
            touchstart: touchstartForForm,
            tap: navigateForForm,
            swipe: swipeForForm
        });
    }
    var returnDetailList=false;
    function navigateForForm(e) {
        returnDetailList=true;
        var i=$(e.touch.target).index();       
        selectedBook = bookDetailDataSource.data()[i];
        kendo.mobile.application.navigate("#bookform-view?uid=");
        $("#form-header").html("<div><span class='k-icon k-i-myspace' style='color:white'></span>&nbsp;Clinic:"+selectedClinic+"</div><div><span class='k-icon k-i-user' style='color:white'></span>&nbsp;Doctor:"+selectedDoctor+"</div><div><span class='k-icon k-i-calendar-date' style='color:white'></span>&nbsp;Date:"+selectedDate+"</div><div><span class='k-icon k-i-clock' style='color:white'></span>&nbsp;Time:"+selectedBook.bookTime+"</div>");
        $("#deleteBtn").show();
        app.bookModel.set("patientName",selectedBook.patientName);
        app.bookModel.set("phone1",selectedBook.phone1);
        app.bookModel.set("remark",selectedBook.remark);
        app.bookModel.set("usageTime",selectedBook.usageTime);
        app.bookModel.set("bookNo",selectedBook.bookNo);
        if(selectedBook.visitFlag=="1st")
            $("#visit1").prop('checked', true);
        else
            $("#visit2").prop('checked', true);
    }

    function swipeForForm(e) {
        var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
        button.expand().duration(30).play();
    }
    function touchstartForForm(e) {
        var target = $(e.touch.initialTouch),
            listview = $("#book-time-listview").data("kendoMobileListView"),
            model,
            button = $(e.touch.target).find("[data-role=button]:visible");

        if (target.closest("[data-role=button]")[0]) {
            selectedBook = bookDetailDataSource.getByUid($(e.touch.target).attr("data-uid"));
            showConfirm();
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

    //-- Book form view--------------------------------------------------------

    window.app.bookModel = kendo.observable({
        patientName: "",
		phone1:"",
        usageTime:0,
        remark:"",
        firstFlag:"",
        bookNo:0,

        
        cancelBook:function(){
             app.bookModel.reset();        
             //console.log("returnDetailList",returnDetailList);    
             if(returnDetailList)
                kendo.mobile.application.navigate("#book-detail-view?uid=1");
             else
                kendo.mobile.application.navigate("#available-book-time-view?uid=1");
        },
        reset:function(){
             app.bookModel.set("patientName","");
             app.bookModel.set("phone1","");
             app.bookModel.set("remark","");
             app.bookModel.set("usageTime",0);
             app.bookModel.set("bookNo",0);                       
             $("#visit1").prop('checked', true); 
        },
        saveBook: function() {
            
			//console.log(app.bookModel.patientName,$('input[name="visitFlag"]:checked').val());            
            var book =new Book(app.bookModel.bookNo,selectedAvailableTime.clinic,selectedAvailableTime.doctor,selectedDate,selectedAvailableTime.bookTime,app.bookModel.patientName,app.bookModel.phone1,app.bookModel.usageTime,$('input[name="visitFlag"]:checked').val(),app.bookModel.remark,selectedAvailableTime.specialDate);
            console.log(book);
            $.ajax({
        		type       : "POST",
        		url        : crudServiceBaseUrl+"/book/saveBook",
       			crossDomain: true,
				contentType: "application/json; charset=utf-8",
        		dataType   : 'json',
				data:JSON.stringify(book),
        		success : function(response) {
					if(response){                        
                        if(returnDetailList)
                            kendo.mobile.application.navigate("#book-detail-view?uid=1");
                        else{
                            kendo.mobile.application.navigate("#available-book-time-view?uid=1");
                            availabelTimeDataSource.read();
                        }
                        app.bookModel.reset();            
					}
					else{
						navigator.notification.alert("Failed to book!",function () { }, "Failed to book!", 'OK');
					}
        	},
        		error: function(error) {
           	 		console.error(error);
					navigator.notification.alert("Failed to book!",function () { }, "Failed to book!", 'OK');
        		}
	  		});
        },
        deleteBook: function() {
            showConfirm();
        }
    });

    // process the confirmation dialog result
function onConfirm(buttonIndex) {
    //alert('You selected button ' + buttonIndex);
    if(buttonIndex==1){
       
            $.ajax({
        		type       : "POST",
        		url        : crudServiceBaseUrl+"/book/deleteBook",
       			crossDomain: true,
				contentType: "application/json; charset=utf-8",
        		dataType   : 'json',
				data:JSON.stringify(selectedBook),
        		success : function(response) {
					if(response){
                        app.bookModel.reset();    
                        availabelTimeDataSource.read();   //refresh available time list                 
                        if(selectedAvailableTime.bookCount=="1"){                                                     
                            kendo.mobile.application.navigate("#available-book-time-view?uid=1");
                            $("#moreId").hide();
                            $("#replyId").show();
                            refreshCalendar=true;
                        }else{
                            kendo.mobile.application.navigate("#book-detail-view?uid=");
                            bookDetailDataSource.read(); //refresh book detail list
                        }    
					}
					else{
						navigator.notification.alert("Failed to delete!",function () { }, "Failed to delete!", 'OK');
					}
        	},
        		error: function(error) {
           	 		console.error(error);
					navigator.notification.alert("Failed to delete!",function () { }, "Failed to delete!", 'OK');
        		}
	  		});
    }
    
}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'Are you sure to delete the book?',  // message
        onConfirm,              // callback to invoke with index of button pressed
        'Warning',            // title
        'Confirm,Cancel'          // buttonLabels
    );
}

    //-- notification-----------------------------------------------------
    var centered = $("#centeredNotification").kendoNotification({
                        stacking: "down",
                        show: onShow,
                        button: true
                    }).data("kendoNotification");

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
    