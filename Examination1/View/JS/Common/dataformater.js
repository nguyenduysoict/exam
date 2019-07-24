class DataFormaterJS {
    constructor() {
    }

    formatDate(date) {
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


    convertToISODate(date) {
        var date = date.split("/");
        var dd = date[0];
        var mm = date[1];
        var yyyy = date[2];
        var newDate = yyyy + '/' + mm + '/' + dd;
        return new Date(newDate);
    }

    formatToIntNumber(stringNumber){
        return parseInt(stringNumber.split('.').join(''));
    }

    formatToStringNumber(value) {
        value = value.toString();
        var plain = value.split('.').join('');
        var reversed = plain.split('').reverse().join('');
        var reversedWithDots = reversed.match(/.{1,3}/g).join('.');
        var normal = reversedWithDots.split('').reverse().join('');
        return normal;
    }

    changeDateTimeByCase(val, dtpElementStart, dtpElementEnd) {
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
                $(dtpElementStart).val(this.formatDate(startDate));
                $(dtpElementEnd).val(this.formatDate(endDate));
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
        $(dtpElementStart).val(this.formatDate(startDate));
        $(dtpElementEnd).val(this.formatDate(endDate));
    }

    checkEqualDate(stringDateA, stringDateB){
        stringDateA = this.convertToISODate(stringDateA);
        stringDateB = this.convertToISODate(stringDateB);
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

}