class DataFormaterJS {
    constructor() {
    }

/**
 * Định dạng ngày theo định dạng dd/MM/yyyy
 * @param {any} date : ngày cần format
 */
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

    /**
     * format tiền ra định dạng số nguyên
     * @param {any} stringNumber: giá trị số định dạng tiền
     */

    formatToIntNumber(stringNumber){
        return parseInt(stringNumber.split('.').join(''));
    }

    /**
     * format số ra định dạng tiền
     * @param {any} stringNumber: giá trị số
     */

    formatToStringNumber(value) {
        value = value.toString();
        var plain = value.split('.').join('');
        var reversed = plain.split('').reverse().join('');
        var reversedWithDots = reversed.match(/.{1,3}/g).join('.');
        var normal = reversedWithDots.split('').reverse().join('');
        return normal;
    }
}