"use strict";
var _start = 0,
    _limit = 12,
    _count = 0,
    _keys = ["id", "name"],
    _url = "http://localhost:8080/addresses?";
(function() {
    // to use for counter that is recorded there
    var updateCount = function() {
        var response = $.ajax({
            url: _url,
            dataType: "json",
            error: function(e) {
                alert("error" + e);
            },
            success: function(data) {
                _count = data.length;
                $('#count').html(_count);
            }
        });
    };
    //creating url
    var createUrl = function(sortby, order, searchby, search) {
            var newurl = "http://localhost:8080/addresses" + "?";
            if (sortby) {
                newurl += "&_sort=" + sortby;
                if (order) newurl += "&_order=" + order;
                else newurl += "&_order=ASC";
            }
            if (search) {
                if (searchby) newurl += "&" + searchby + "_like=" + search;
                else newurl += "&q=" + search;
            }
            _url = newurl;
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
                    <form class="form-horizontal" id="' + button + '">\
                        <div class="modal-body">\
                    </div><!-- end modal-body -->\
                    <div class="modal-footer">\
                        <button class="btn btn-danger" data-dismiss="modal" type="button">Cancel</button>\
                        <button class="btn btn-primary" type="submit" id="UU">' + button + '</button>\
                    </div><!-- end modal-footer -->\
                    </form>\
                </div><!-- end modal-content -->\
            </div><!-- end modal-dialog -->\
        </div>');
        var form = $('#' + modalId + ' form .modal-body');
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
                                    <input type="' + key + '"class="form-control" required id="' + key + '" value="' + values[i]["innerText"] + ' ">\
                                </div>\
                            </div>');
            else if (values[i]["innerText"] != 'id')
                form.append('<div class="form-group sr-only">\
                                <label for="' + key + '" class="col-lg-2 control-label">' + key + '</label>\
                                <div class="col-lg-10">\
                                    <input type="' + key + '"class="form-control" required disabled="disabled" id="' + key + '" value="' + values[i]["innerText"] + ' ">\
                                </div>\
                            </div>');
        });
    }
    //update keys
    var updateKeys = function() {
            $.ajax({
                url: _url + "_start=0&_limit=1",
                method: "GET",
                dataType: "json",
                success: function(data) {
                    if (data[0]) {
                        _keys = Object.keys(data[0]);
                        createNavbar();
                        createTableHeader();
                    } else {
                        createNavbar();
                        createTableHeader();
                    }
                },
                error: function(err) {
                    alert("your data base not available");
                }
            });
        }
        //Creating Navbar
    var createNavbar = function() {
            _keys.forEach(function(key) {
                $('.searchby,.sortby').append('<option value="' + key + '">' + key.toUpperCase() + '</option')
            });
        }
        //creating header
    var createTableHeader = function() {
            var table = $('#table');
            $('<thead><tr></tr></thead>').appendTo(table);
            var thead = $('thead>tr');
            _keys.forEach(function(key) {
                thead.append('<th>' + key.toUpperCase() + '</th>');
            });
            $('<tbody></tbody>').appendTo(table);
        }
        //update or append row
    var appendRow = function(appender, data) {
        _keys.forEach(function(key) {
            appender.append('<td data-title="' + key.toUpperCase() + '">' + data[key] + '</td>');
        });
        appender.append('<td data-title="ACTION"><button class="btn btn-primary update">Update</button><button class="btn btn-danger delete">delete</button></td>');
    }

    //loading whole data at starting
    $('document').ready(function() {
        updateKeys();
    });

    //open update data modal
    $('#table').delegate('.update', 'click', function() {
        var id = $(this).parent().parent().attr('id');
        var detail = $('#' + id),
            modalId = "modal-" + id;
        //remove all modal of type modal-*
        $("div[id^='modal-']").remove();
        // creating a Modal
        createUpdateModal(_keys, id, modalId);
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
                _count--;
                $('#count').html(_count);
            },
            error: function(e) {
                alert("error" + e);
            }
        });
    });
    //open Add Modal
    $('body').delegate('#addmore', 'click', function(evt) {
        evt.preventDefault();
        $("div[id^='modal-']").remove();
        var modalId = 'modal-add';
        createUpdateModal(_keys, "add", modalId);
        $('#' + modalId).modal('show');
    });
    //update the data into data base
    $('body').delegate('#Save', 'submit', function(evt) {
        evt.preventDefault();
        if (true) {
            var id;
            var updateRecordData = {};
            _keys.forEach(function(key) {
                if (key == 'id') id = $('#' + key).val();
                else if ($('#' + key).val()) updateRecordData[key] = $('#' + key).val();
            });
            console.log(JSON.stringify(updateRecordData));
            //modifying data in server
            $.ajax({
                url: "http://localhost:8080/addresses/" + id,
                method: "PATCH",
                "Content-Type": "application/json",
                data: updateRecordData,
                success: function(result) {
                    var updateRow = $('#' + id);
                    updateRow.empty();
                    appendRow(updateRow, result);
                    $('#modal-' + id).modal('hide');
                    alert("successfully updated");
                },
                error: function(err) {
                    alert("error" + err.message);
                }
            });
        }
    });
    //add event listener for adding data into data base
    $('body').delegate('#Add', 'submit', function(evt) {
        evt.preventDefault();
        if (true) {
            var id;
            var updateRecordData = {};
            _keys.forEach(function(key) {
                if (key != 'id') updateRecordData[key] = $('#' + key).val();
            });
            $.ajax({
                url: "http://localhost:8080/addresses/",
                method: "POST",
                "Content-Type": "application/json",
                data: updateRecordData,
                success: function(result) {
                    alert('successfully added the record');
                    $('#modal-add').modal('hide');
                    _count++;
                    $('#count').html(_count);
                },
                error: function(e) {
                    alert("error" + e);
                }
            });
        }
    });
    $('body').delegate('#search', 'click', function(evt) {
        evt.preventDefault();
        var sortby = $('#searchInput .sortby option:selected').val(),
            search = $('#searchInput input').val(),
            order = $('#searchInput .order option:selected').val(),
            searchby = $('#searchInput .searchby option:selected').val();
        createUrl(sortby, order, searchby, search);
        _start = 0;
        $.ajax({
            url: _url + "&_start=" + _start + "&_limit=" + _limit,
            dataType: "json",
            method: "GET",
            error: function(err) {
                alert("error" + err.message);
            },
            success: function(data) {
                if (data[0]) {
                    var tbody = $('tbody');
                    tbody.empty();
                    data.forEach(function(d) {
                        tbody.append('<tr id="' + d["id"] + '"></tr>');
                        var appender = $('tbody>tr:nth-last-child(1)');
                        appendRow(appender, d);
                    });
                    updateCount();
                } else {
                    alert("No Record Found");
                    $('tbody').empty();
                    updateCount();
                }
            },
            error: function(err) {
                alert("Not successfully" + err.message);
            }
        });
    });
    $('body').delegate('#showDB', 'click', function(evt) {
        evt.preventDefault();
        var sortby = $('#inputShowDB .sortby option:selected').val(),
            order = $('#inputShowDB .order option:selected').val(),
            searchby = $('#inputShowDB .searchby option:selected').val();
        createUrl(sortby, order);
        _start = 0;
        $.ajax({
            url: _url + "&_start=" + _start + "&_limit=" + _limit,
            dataType: "json",
            method: "GET",
            error: function(err) {
                alert("error" + err.message);
            },
            success: function(data) {
                if (data[0]) {
                    var tbody = $('tbody');
                    tbody.empty();
                    data.forEach(function(d) {
                        tbody.append('<tr id="' + d["id"] + '"></tr>');
                        var appender = $('tbody>tr:nth-last-child(1)');
                        appendRow(appender, d);
                    });
                    updateCount();
                }
            },
            error: function(err) {
                alert("Not successfully" + err.message);
            }
        });
    });
    //pagination
    $('body').delegate('.loadMore', 'click', function(evt) {
        evt.preventDefault();
        var $this = $(this),
            parent = $this.parent(),
            prev = parent.hasClass('previous'),
            next = parent.hasClass('next');
        if (prev) _start -= _limit;
        else if (next) _start += _limit;
        if (_start < 0) _start = _count + _start;
        else if (_start > _count - _limit) _start = 0;
        $.ajax({
            url: _url + "&_start=" + _start + "&_limit=" + _limit,
            dataType: "json",
            success: function(data) {
                if (data[0]) {
                    var tbody = $('tbody');
                    tbody.empty();
                    data.forEach(function(d) {
                        tbody.append('<tr id="' + d["id"] + '"></tr>');
                        var appender = $('tbody>tr:nth-last-child(1)');
                        appendRow(appender, d);
                    });
                    updateCount();
                } else {
                    alert("No More data available");
                }
            },
            error: function(err) {
                alert("error" + err.message);
            }
        });
    });
})();
