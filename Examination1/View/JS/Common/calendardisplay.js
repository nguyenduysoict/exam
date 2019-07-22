
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

// Hiển thị datepicker ngày thu chứng từ khi click icon calendar

// $('.get-receipt-day-icon').click(function () {
//     $("#get-receipt-day-input").focus();
// });

// // Gán giá trị được chọn cho ngày thu chứng từ, custom vị trí hiển thị calendar

// $("#get-receipt-day-input").datepicker({
//     onSelect: function (dateText) {
//         var date = $(this).val();
//         $("#get-receipt-day-input").val(mainJS.formatDate(date));
//     },

//     beforeShow: function (input, inst) {
//         var inputPosition = $("#get-receipt-day-input").offset();
//         setTimeout(function () {
//             inst.dpDiv.css({
//                 top: inputPosition.top + 34,
//                 left: inputPosition.left - 85
//             });
//         }, 0);
//     }
// });

// // Hiển thị datepicker ngày thu nợ khi click icon calendar

// $('.repayment-day-icon').click(function () {
//     $("#repayment-day-input").focus();
// });

// // Gán giá trị được chọn cho ngày thu nợ

// $("#repayment-day-input").datepicker({
//     onSelect: function (dateText) {
//         var date = $(this).val();
//         $("#repayment-day-input").val(mainJS.formatDate(date));
//     }
// });

function formatDate(date) {
    var date = new Date(date);
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var formatedDate = dd + '/' + mm + '/' + yyyy;
    return formatedDate;
}