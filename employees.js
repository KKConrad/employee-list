var map;
var geocoder;

function initializeMap() {
    var mapOptions = {
        center: { lat: 40.397, lng: -105.12},
        zoom: 8
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    geocoder = new google.maps.Geocoder();
}
google.maps.event.addDomListener(window, 'load', initializeMap);

var employees = [
    {
        name: "Wendy",
        phone: "800-555-5555",
        address: "455 S. Boulder Rd, Lafayette, CO"
    },
    {
        name: "Ronald",
        phone: "(303) 776-9383",
        address: "245 S Main St Longmont, CO"
    }
];

$(document).ready(function(){
    render_employee_table(employees);
    $("#add").click(function() {
        console.log('clicked!');
        render_edit_box('add');
    });
});

function terminate_employee(index){
    console.log(index);
    employees.splice(index, 1);
    render_employee_table(employees)
}

function render_edit_box(type, employee, index){
    var pre_name = "";
    var pre_phone = "";
    var pre_address= "";

    if (type == "edit") {
        console.log(employee);
        pre_name = employee.name;
        pre_phone = employee.phone;
        pre_address = employee.address;
    }

    var html = '<div><label id="namelabel">Name </label><input id="edit_name" value="' +
        pre_name + '"></div><div><label id="phonelabel">Phone</label> <input id="edit_phone" value="'+
        pre_phone + '"></div><div><label id="addresslabel">Address </label><input id="edit_address" value="' +
        pre_address + '"></div>';
    var button_name = type == "add" ? "add it" : "update it";

    html += "<button id='saveit'>"+ button_name + "</button>";

    $('#edit_box').html(html);

    $('#saveit').click(function(){
        var e = {
            name : $("#edit_name").val(),
            phone: $("#edit_phone").val(),
            address: $("#edit_address").val()
        };
        if(type=="add") {
            add_employee(e);
        }
        else if (type=="edit") {
            update_employee(e, index);
        }
        $("#edit_box").html('');
    })
}

function update_employee(data, index){
    console.log("update Employee " + index);
    console.log(data);
    employees[index] = data;
    render_employee_table(employees);
}

function add_employee(data){
    employees.push(data);
    render_employee_table(employees)
}

function render_employee_table(data) {
    console.log('render employee table')
    var html;

    html = "<table class='table table-striped'>";
    html += "<thead><tr>";
    html += "<th>Name</th>";
    html += "<th>Phone</th>";
    html += "<th>Address</th>";
    html += "</tr></thead>";

    data.forEach(function (employee, index) {

        html += "<tr>";
        html += "<td>" + employee.name + "</td>";
        html += "<td>" + employee.phone + "</td>";
        html += "<td>" + employee.address + "</td>";
        html += "<td><button class='delete' index='" + index + "'>Delete</button></td>";
        html += "<td><button index=" + index + " class='edit'>Edit</button></td>";
        html += "<td><button index=" + index + " class='show_map'>Map it!</button></td>";

        html += "</tr>";
    });

    html += "</table>";

    $("#employee_list").html(html);

    $(".delete").click(function () {
        console.log('delete clicked');
        terminate_employee($(this).attr("index"));
    });

    $('.edit').click(function () {
        console.log('clicked to update existing');
        render_edit_box('edit', employees[$(this).attr("index")], $(this).attr("index"));
    });

    $('.show_map').click(function () {
        console.log('show map click.');
        map_location(employees[$(this).attr("index")].address);
    });

    function map_location(address) {
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $("#map-canvas").show();
                google.maps.event.trigger(map,'resize'); // tells googlemaps that we resized it, without this it would bug out.
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                $("#map-canvas").hide();
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}