"use strict";
var _start = 0,
    _limit = 500;
(function() {
    // to get the keys
    function getKeys(keys) {
        $('thead>tr>th').each(function(index) {
            keys.push($(this).text());
        });
    }

    //create Modal 
    function createUpdateModal(keys, id, modalId) {
        var button, title;
        if (id == 'add') {
            button = "Add";
            title = "Add Address";
        } else {
            button = "Save";
            title = "Update Address"
        }
        $('body').append('<div class="modal fade" tabindex="-1" id="' + modalId + '">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button class="close" data-dismiss="modal">&times;</button>\
                        <h4 class="modal-title">' + title + '</h4>\
                    </div><!-- end modal-header -->\
                    <div class="modal-body">\
                        <form class="form-horizontal">\
                        </form>\
                    </div><!-- end modal-body -->\
                    <div class="modal-footer">\
                        <button class="btn btn-primary" type="button" id="' + button + '">' + button + '</button>\
                        <button class="btn btn-danger" data-dismiss="modal" type="button">Cancel</button>\
                    </div><!-- end modal-footer -->\
                </div><!-- end modal-content -->\
            </div><!-- end modal-dialog -->\
        </div>');
        var form = $('#' + modalId + ' .modal-body form');
        var values = $('#' + id + ' td');
        if (values.length == 0) {
            values = [];
            keys.forEach(function(key, i) {
                values[i] = {};
                values[i].innerText = key;
            });
        }
        keys.forEach(function(key, i) {

            if (key != 'id')
                form.append('<div class="form-group">\
						    	<label for="' + key + '" class="col-lg-2 control-label">' + key + '</label>\
						    	<div class="col-lg-10">\
						    		<input class="form-control" id="' + key + '" placeholder="' + values[i]["innerText"] + ' ">\
						    	</div>\
						  	</div>');
            else if (values[i]["innerText"] != 'id') form.append('<div class="form-group">\
						    	<label for="' + key + '" class="col-lg-2 control-label">' + key + '</label>\
						    	<div class="col-lg-10">\
						    		<input class="form-control" disabled="disabled" id="' + key + '" value="' + values[i]["innerText"] + ' ">\
						    	</div>\
						  	</div>');

        });
    }

    //loading whole data at starting
    $('document').ready(function() {
        var response = $.ajax({
            url: "http://localhost:8080/addresses?_start=" + _start + "&_limit=" + _limit,
            dataType: "json"
        });
        response.done(function(data) {
            var keys, keylen;
            var table = $('#table');
            if (data[0]) {
                keys = Object.keys(data[0]);
                keylen = keys.length;
                $('<thead><tr></tr></thead>').appendTo(table);
                var thead = $('thead>tr');
                for (var i = 0; i < keylen; i++) {
                    thead.append('<th>' + keys[i] + '</th>');
                }
                var tbody = table.append('<tbody></tbody>');
                data.forEach(function(d) {
                    tbody.append('<tr id="' + d["id"] + '"></tr>');
                    var appender = $('tbody>tr:nth-last-child(1)');
                    for (var i = 0; i < keylen; i++) {
                        appender.append('<td>' + d[keys[i]] + '</td>');
                    }
                    appender.append('<td><button class="btn btn-primary update">Update</button></td>');
                    appender.append('<td><button class="btn btn-danger delete">delete</button></td>');
                });
                if ($('#addmore').length == 0) $('.container>.row>h2').after('\
                	<button class="btn btn-success pull-right"\
                  style="margin-top:20px;margin-bottom=10px;" id="addmore"\
             >Add More</button>');
                if ($('#loadMore').length == 0) $('.container').append('<button class="btn btn-success"\
                  style="margin-top:20px;margin-bottom=10px;" id="loadMore"\
             >Load More</button>')
                _start = data[data.length - 1]["id"];
            }
        });
    });
    //open update data modal
    $('#table').delegate('.update', 'click', function() {
        var id = $(this).parent().parent().attr('id');
        var detail = $('#' + id),
            modalId = "modal-" + id;
        //remove all modal of type modal-*
        $("div[id^='modal-']").remove();
        var Keys = [];
        getKeys(Keys);
        // creating a Modal
        createUpdateModal(Keys, id, modalId);
        //show Modal
        $('#modal-' + id).modal('show');
    });
    //deleting data in database
    $('#table').delegate('.delete', 'click', function() {
        var $this = $(this);
        var row = $this.parent().parent()
        var id = row.attr('id');
        //deleting from data base
        $.ajax({
            url: "http://localhost:8080/addresses/" + id,
            method: "DELETE",
            success: function() {
                alert("successfully deleted");
                row.remove();
            }
        });
    });
    //open Add Modal
    $('body').delegate('#addmore', 'click', function() {
        $("div[id^='modal-']").remove();
        var modalId = 'modal-add';
        var Keys = [];
        getKeys(Keys);
        createUpdateModal(Keys, "add", modalId);
        $('#' + modalId).modal('show');
    });
    //update the data into data base
    $('body').delegate('#Save', 'click', function() {
        var Keys = [];
        var id;
        getKeys(Keys);
        var updateRecordData = {};
        Keys.forEach(function(key) {
            if (key == 'id') id = $('#' + key).val();
            else if ($('#' + key).val()) updateRecordData[key] = $('#' + key).val();
        });
        $.ajax({
            url: "http://localhost:8080/addresses/" + id,
            method: "PATCH",
            "Content-Type": "application/json",
            data: updateRecordData,
            success: function(result) {
                var updateRow = $('#' + id);
                updateRow.empty();
                Keys.forEach(function(key) {
                    updateRow.append('<td>' + result[key] + '</td>');
                });
                updateRow.append('<td><button class="btn btn-primary update">Update</button></td>')
                    .append('<td><button class="btn btn-danger delete">delete</button></td>');
                $('#modal-' + id).modal('hide');
            }
        });
    });
    //add event listener for adding data into data base
    $('body').delegate('#Add', 'click', function() {
        var Keys = [];
        var id;
        getKeys(Keys);
        var updateRecordData = {};
        Keys.forEach(function(key) {
            if (key != 'id') updateRecordData[key] = $('#' + key).val();
        });
        $.ajax({
            url: "http://localhost:8080/addresses/",
            method: "POST",
            "Content-Type": "application/json",
            data: updateRecordData,
            success: function(result) {
                var table = $('tbody').append('<tr id="' + result['id'] + '""></tr>');
                var updateRow = $('tbody>tr:nth-last-child(1)');

                Keys.forEach(function(key) {
                    updateRow.append('<td>' + result[key] + '</td>');
                });
                updateRow.append('<td><button class="btn btn-primary update">Update</button></td>')
                    .append('<td><button class="btn btn-danger delete">delete</button></td>');
                $('#modal-add').modal('hide');
            }
        });
    });
    //loading more data in the page
    $('.container').delegate('#loadMore', 'click', function() {
        $.ajax({
            url: "http://localhost:8080/addresses?_start=" + _start + "&_limit=" + _limit,
            dataType: "json",
            success: function(data) {
                var keys = [];
                $('thead>tr>th').each(function(index) {
                    keys.push($(this).text());
                });
                if (data[0]) {
                    var tbody = $('tbody');
                    data.forEach(function(d) {
                        tbody.append('<tr id="' + d["id"] + '"></tr>');
                        var appender = $('tbody>tr:nth-last-child(1)');
                        keys.forEach(function(key) {
                            appender.append('<td>' + d[key] + '</td>');
                        });
                        appender.append('<td><button class="btn btn-primary update">Update</button></td>');
                        appender.append('<td><button class="btn btn-danger delete">delete</button></td>');
                    });
                }
                _start = data[data.length - 1]["id"];
            }
        });
    });
})();

/*

$(window).on("scroll touchmove", function() {
            if ($(document).scrollTop() > ($(document).height()) * (3 / 4)) {
                $.ajax({
                        url: "http://localhost:8080/addresses?_start=" + _start + "&_limit=" + _limit,
                        dataType: "json",
                        success: function(data) {
                            var keys = [];
                            $('thead>tr>th').each(function(index) {
                                keys.push($(this).text());
                            });
                            if (data[0]) {
                                var tbody = $('tbody');
                                data.forEach(function(d) {
                                    tbody.append('<tr id="' + d["id"] + '"></tr>');
                                    var appender = $('tbody>tr:nth-last-child(1)');
                                    keys.forEach(function(key) {
                                        appender.append('<td>' + d[key] + '</td>');
                                    });
                                    appender.append('<td><button class="btn btn-primary update">Update</button></td>');
                                    appender.append('<td><button class="btn btn-danger delete">delete</button></td>');
                                });
                            }
                            _start = data[data.length - 1]["id"];
                        });
                    //console.log("done");
                }
            });
*/
