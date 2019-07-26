/**
 * Hàm sinh id
* Createby NMDuy 25/07/2019
 * 
 */

function idGenerate(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/**
 * Lấy ngày hiện tại
 * Createby NMDuy 25/07/2019
 */

function getInitialDate() {
    var toDay = new Date();
    return formatDate(toDay)
}

/**
 * Lấy giờ hiện tại
 * Createby NMDuy 25/07/2019
 */
function getCurrentTime(){
    var now = new Date();
    var currentTime = now.getHours() + ":" + now.getMinutes();
    return currentTime;
}


/**
 * Format ngày truyền vào sang định dạng dd/MM/yyyy
 * @param {any} date : ngày cần formmat
 * Createby NMDuy 25/07/2019
 */

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

/**
 * Xử lý chuyển đổi từ thời gian tương đối sang ngày cụ thể
 * Createby NMDuy 25/07/2019
 */

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
            $(dtpElementStart).val(formatDate(startDate));
            $(dtpElementEnd).val(formatDate(endDate));
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
    $(dtpElementStart).val(formatDate(startDate));
    $(dtpElementEnd).val(formatDate(endDate));
}

/**
 * Kiểm tra 2 ngày bằng nhau
 * @param {any} stringDateA : ngày 1
 * @param {any} stringDateB : ngày 2
 * Createby NMDuy 25/07/2019
 */

function checkEqualDate(stringDateA, stringDateB){
    stringDateA = convertToISODate(stringDateA);
    stringDateB = convertToISODate(stringDateB);
    var dateA = stringDateA.getDate();
    var dateB = stringDateB.getDate();
    var monthA = stringDateA.getMonth();
    var monthB = stringDateB.getMonth();
    var yearA = stringDateA.getFullYear();
    var yearB = stringDateB.getFullYear();
    if(dateA == dateB && monthA == monthB && yearA == yearB){
        return true;
    } else {
        return false;
    }
}

/**
 * Convert sang ngày chuẩn
 * @param {any} date : ngày truyền vào 
 * Createby NMDuy 25/07/2019
 */

function convertToISODate(date) {
    var date = date.split("/");
    var dd = date[0];
    var mm = date[1];
    var yyyy = date[2];
    var newDate = yyyy + '/' + mm + '/' + dd;
    return new Date(newDate);
}

/**
 * Hàm kiểm tra ngày nhập liệu có hợp lệ
 * @param {any} date ngày cần kiểm tra
 * Createby NMDuy 25/07/2019
 */
function checkValidDate(date) {
    var dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return dateRegex.test(date);
}


/**
 * Hàm kiểm tra giờ nhập liệu có hợp lệ
 * @param {any} time giờ cần kiểm tra 
 * Createby NMDuy 25/07/2019
 */

function checkValidTime(time) {
    var timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
}
