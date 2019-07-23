class AjaxJS {
    constructor() {
        this.receiptNumber = "XK0000012";
    }

    getExportMasterTableData(){
        var data = [];        
        for(let i = 0;i<30;i++){
            var item = {
                receiptCode: Math.floor((Math.random() * 3) + 1),
                date: this.randomDate(),
                receiptNumber: this.randomNumber(),
                object: this.randomName(),
                sumMoney: this.randomMoney(),
                note: this.randomNote(),
                receiptType: this.randomReceiptType()
            }
            data.push(item);
        }
        return data;
    }

    getDetailExportReceipt(receiptCode){
        var data = [];
        switch (receiptCode) {
            case "1":
                var item = {
                    itemCode: this.randomGoodCode(),
                    itemName: this.randomGoods(),
                    storePlace: this.randomPlace(),
                    countUnit: this.randomUnit(),
                    unitPrice: this.randomMoney(),
                    amount: this.randomAmount(),
                    sumMoney: this.randomMoney()
                }
                data.push(item);
                break;
            case "2":
                for(let i=0;i<2;i++){
                    var item = {
                        itemCode: this.randomGoodCode(),
                        itemName: this.randomGoods(),
                        storePlace: this.randomPlace(),
                        countUnit: this.randomUnit(),
                        unitPrice: this.randomMoney(),
                        amount: this.randomAmount(),
                        sumMoney: this.randomMoney()
                    }
                    data.push(item);
                }
                break;
            case "3":
                for(let i=0;i<3;i++){
                    var item = {
                        itemCode: this.randomGoodCode(),
                        itemName: this.randomGoods(),
                        storePlace: this.randomPlace(),
                        countUnit: this.randomUnit(),
                        unitPrice: this.randomMoney(),
                        amount: this.randomAmount(),
                        sumMoney: this.randomMoney()
                    }
                    data.push(item);
                }
                break;
            default:
                break;
        }
        return data;
    }

    getComboboxData(comboboxName) {
        var object = [];
        switch (comboboxName) {
            case "object":
                var comboboxData1 = {
                    id: 'nmd2310',
                    code: 'KH0000'+this.randomTwoDigitNumber(),
                    name: this.randomName(),
                    type: 'Khách hàng',
                    address: 'Duy Tân'
                }

                var comboboxData2 = {
                    id: '0213nmd',
                    code: 'NV0000'+this.randomTwoDigitNumber(),
                    name: this.randomName(),
                    type: 'Nhân viên',
                    address: 'Lò Đúc'
                }

                var comboboxData3 = {
                    id: 'nm0230d',
                    code: 'NCC0000'+this.randomTwoDigitNumber(),
                    name: this.randomName(),
                    type: 'Nhà cung cấp',
                    address: 'Bưởi'
                }

                for (let i = 1; i <= 5; i++) {
                    object.push(comboboxData1);
                    object.push(comboboxData2);
                    object.push(comboboxData3);
                }
                return object;

            case "goods":
                var goods = [];
                for (let i = 1; i <= 20; i++) {
                    var item = {
                        itemCode: this.randomGoodCode(),
                        itemName: this.randomGoods(),
                        storePlace: this.randomPlace(),
                        countUnit: this.randomUnit(),
                        unitPrice: this.randomMoney(),
                        amount: this.randomAmount(),
                        sumMoney: this.randomMoney()
                    }
    
                    goods.push(item);
                }
                return goods;
        }
    }

    getRepaymentDocumentFromCustomerById(id) {
        var repaymentDocument = [];
        switch (id) {
            case 'nmd2310':
                repaymentDocument = [
                    {
                        RecordedDate: new Date("2019-5-15"),
                        RecordNumber: "17154500005",
                        GetAmount: 200000,
                        NotGetAmount: 200000,
                    },
                    {
                        RecordedDate: new Date("2019-6-20"),
                        RecordNumber: "5321265405",
                        GetAmount: 300000,
                        NotGetAmount: 100000,
                    }
                ];
                break;
            case 'nm0230d':
                repaymentDocument = [
                    {
                        RecordedDate: new Date("2019-6-1"),
                        RecordNumber: "064300541",
                        GetAmount: 120000,
                        NotGetAmount: 230000,
                    }
                ];
                break;
            case '0213nmd':
                repaymentDocument = [
                    {
                        RecordedDate: new Date("2019-07-03"),
                        RecordNumber: "036205004",
                        GetAmount: 500000,
                        NotGetAmount: 100000,
                    },
                    {
                        RecordedDate: new Date("2019-10-03"),
                        RecordNumber: "0127206943",
                        GetAmount: 600000,
                        NotGetAmount: 200000,
                    },
                    {
                        RecordedDate: new Date("2019-06-18"),
                        RecordNumber: "97300153047",
                        GetAmount: 150000,
                        NotGetAmount: 300000,
                    }
                ];
                break;
        }
            return repaymentDocument;
    }

    getReceiptNumber() {
        var receiptNumber = this.receiptNumber.slice(0,2);
        return "XK00004";
    }

    randomDate(){
        var date = Math.floor(Math.random() * 30) + 1;
        var month = Math.floor(Math.random() * 12) + 1;
        return date+'/'+month+'/2019';
    }

    randomName(){
        var lastNameArr = ['Nguyễn', 'Phạm', 'Hoàng','Đào','Bùi','Lê', 'Trần'];
        var midNameArr = ['Mạnh', 'Văn', 'Đình', 'Tiến', 'Đức', 'Minh'];
        var firstNameArr = ['Duy', 'Trọng', 'Dũng', 'Quang', 'Hoàn','Hùng'];
        var lastName = lastNameArr[Math.floor(Math.random()*lastNameArr.length)];
        var midName = midNameArr[Math.floor(Math.random()*midNameArr.length)];
        var firstName = firstNameArr[Math.floor(Math.random()*firstNameArr.length)];
        return lastName+' '+ midName + ' '+ firstName;
    }

    randomNumber(){
        return Math.floor((Math.random() * 10000000) + 1000000);
    }

    randomTwoDigitNumber(){
        return Math.floor((Math.random() * 90) + 1);
    }

    randomMoney(){
        
        return this.randomTwoDigitNumber()+'0.000';
    }

    randomReceiptType(){
        var receiptTypeArr = [
            'Xuất kho bán hàng',
             'Xuất mua hàng',
              'Nhập kho bán hàng',
              'Nhập hàng vào kho',
              'Xuất kho vào hàng'
            ];
        var receiptType = receiptTypeArr[Math.floor(Math.random()*receiptTypeArr.length)];
        return receiptType;
    }

    randomNote(){
        var noteArr = [
            'Bán cho Công ty cổ phần MISA',
             'Nhập hàng từ Công ty ABC',
              'Bản sỉ nhập lẻ từ chợ trời',
              'Buôn bán hàng bãi, âm thanh loa đài',
              'Hàng xách tay chung cuốc'
            ];
        var note = noteArr[Math.floor(Math.random()*noteArr.length)];
        return note;
    }

    randomGoods(){
        var typeArr = ['Áo khoác kaki', 'Quần đùi', 'Áo ba lỗ','Áo sơ mi','Quần âu','Quần bò', 'Quần lửng'];
        var genders = ['nam', 'nữ'];
        var type = typeArr[Math.floor(Math.random()*typeArr.length)];
        var gender = genders[Math.floor(Math.random()*genders.length)];
        return type+' '+ gender;
    }
    
    randomGoodCode(){
        var goodsCodeArrr = [
            'AKK0231001',
            'QAK00030234',
            'KAA023494',
            'PAA032944',
            'OPA0434102',
            'THY092344',
            ];
        return goodsCodeArrr[Math.floor(Math.random()*goodsCodeArrr.length)];
    }

    randomPlace(){
        var placeArr = [
            'Chi nhánh Cầu Giấy',
            'Chi nhánh Duy Tân',
            'Chi nhánh Bưởi',
            'Chi nhánh Phạm Hùng',
            'Chi nhánh Nhổn',
            'Chi nhánh Mỹ Đình',
            ];
        return placeArr[Math.floor(Math.random()*placeArr.length)];
    }

    randomUnit(){
        var unitArr = [
            'Chiếc',
            'Cái',
            'Đôi',
            'Bộ'           
            ];
        return unitArr[Math.floor(Math.random()*unitArr.length)];
    }

    randomAmount(){
        return Math.floor((Math.random() * 10) + 1);

    }

}
