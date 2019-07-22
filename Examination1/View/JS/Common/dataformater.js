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


}