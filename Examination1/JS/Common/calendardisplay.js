
$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd'
});

// Hiển thị datepicker ngày bắt đầu lấy dữ liệu xuất kho khi click icon calendar
// Create by NMDuy (10/7/2019)

$(".get-data-from-day-icon").click(function () {
    $("#get-data-from-day-input").focus();
});

// Gán giá trị được chọn cho ngày bắt đầu lấy dữ liệu thu/chi tiền mặt

$("#get-data-from-day-input").datepicker({
    onSelect: function (dateText) {
        var date = $(this).val();
        $("#get-data-from-day-input").val(formatDate(date));
    }
});

// Hiển thị datepicker ngày kết thúc lấy dữ liệu thu/chi tiền mặt khi click icon calendar

$(".get-data-to-day-icon").click(function () {
    $("#get-data-to-day-input").focus();
});

// Gán giá trị được chọn cho ngày kết thúc lấy dữ liệu thu/chi tiền mặt

$("#get-data-to-day-input").datepicker({
    onSelect: function (dateText) {
        var date = $(this).val();
        $("#get-data-to-day-input").val(formatDate(date));
    }
});


$(".export-date-filter-icon").click(function () {
    $("#export-date-filter-input").focus();
});

// Gán giá trị được chọn cho ngày chứng từ

// Hiển thị datepicker ngày xuất click icon calendar

$('.export-day-icon').click(function () {
    $("#export-date-input").focus();
});


$(".get-receipt-day-icon").click(function () {
    $(".export-hour-input").focus();
})

// Gán giá trị được chọn cho ngày thu chứng từ, custom vị trí hiển thị calendar

$("#export-date-input").datepicker({
    onSelect: function (dateText) {
        var date = $(this).val();
        $("#export-date-input").val(formatDate(date));
    }
});


$('.timepicker').timepicker({
    timeFormat: 'H:i',
    show24Hours: false,
    step: 30
})
