
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

function changeDateTimeByCase(val, dtpElementStart, dtpElementEnd) {
    var datetime = new Date();
    var startDate;
    var endDate;
    switch (val) {
        //set thời gian cho hôm nay
        case '1':
            startDate = datetime;
            endDate = datetime;
            break;
        //hôm qua
        case '2':
            startDate = new Date(datetime.setDate(datetime.getDate() - 1));
            endDate = startDate;
            $(dtpElementStart).val(startDate.formatddMMyyyy());
            $(dtpElementEnd).val(endDate.formatddMMyyyy());
            break;
        //tuần này
        case '3':
            startDate = new Date(datetime.setDate(datetime.getDate() - datetime.getDay()));
            endDate = new Date();
            break;
        //tuần trước
        case '4':
            startDate = new Date(datetime.setDate(datetime.getDate() - 7 - datetime.getDay()));
            endDate = new Date(new Date().setDate(startDate.getDate() + 6));
            break;
        //tháng này
        case '5':
            startDate = new Date(datetime.setDate(1));
            endDate = new Date();
            break;
        //tháng trước
        case '6':
            startDate = new Date(datetime.setMonth(datetime.getMonth() - 1));
            startDate.setDate(1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            break;
        //quý này
        case '7':
            startDate = new Date(datetime.setMonth(datetime.getMonth() - parseInt(datetime.getMonth() % 3)));
            startDate.setDate(1);
            endDate = new Date();
            break;
        //quý trước
        case '8':
            startMonth = (parseInt(datetime.getMonth() / 3) - 1) * 3;
            startDate = new Date(datetime.setMonth(datetime.getMonth() - 3 - parseInt(datetime.getMonth() % 3)));
            startDate.setDate(1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
            break;
        //6 tháng trước
        case '9':
            startDate = new Date(datetime.setMonth(datetime.getMonth() - 6));
            startDate.setDate(1);
            datetime = new Date();
            endDate = new Date(datetime.setMonth(datetime.getMonth()));
            endDate.setDate(0);
            break;
        //năm nay
        case '10':
            startDate = new Date(datetime.getFullYear(), 0, 1);
            endDate = new Date();
            break;
        //năm trước
        case '11':
            startDate = new Date(datetime.getFullYear() - 1, 0, 1);
            endDate = new Date(datetime.getFullYear() - 1, 12, 0);
            break;
        //khác
        case '12':
            break;
    }
    $(dtpElementStart).val(startDate.formatddMMyyyy());
    $(dtpElementEnd).val(endDate.formatddMMyyyy());
}