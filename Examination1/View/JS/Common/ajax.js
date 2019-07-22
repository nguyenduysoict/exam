class AjaxJS {
    constructor() {
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
                    itemCode: 'AKK0231001',
                    itemName: this.randomGoods(),
                    storePlace: 'Chi nhánh Cầu Giấy',
                    countUnit: 'Chiếc',
                    unitPrice: this.randomMoney(),
                    amount: '2',
                    sumMoney: '700.000'
                }
                data.push(item);
                break;
            case "2":
                var item1 = {
                    itemCode: 'QAK00030234',
                    itemName: this.randomGoods(),
                    storePlace: 'Chi nhánh Đống Đa',
                    countUnit: 'Chiếc',
                    unitPrice: this.randomMoney(),
                    amount: '1',
                    sumMoney: '300.000'
                }
                data.push(item1);

                var item2 = {
                    itemCode: 'KAA023494',
                    itemName: this.randomGoods(),
                    storePlace: 'Chi nhánh Thanh Xuân',
                    countUnit: 'Cái',
                    unitPrice: this.randomMoney(),
                    amount: '2',
                    sumMoney: '400.000'
                }
                data.push(item2);

                break;
            case "3":
                var item1 = {
                    itemCode: 'PAA032944',
                    itemName: this.randomGoods(),
                    storePlace: 'Chi nhánh Bưởi',
                    countUnit: 'Chiếc',
                    unitPrice: this.randomMoney(),
                    amount: '1',
                    sumMoney: '600.000'
                }
                data.push(item1);

                var item2 = {
                    itemCode: 'OPA0434102',
                    itemName: this.randomGoods(),
                    storePlace: 'Chi nhánh Đào Tấn',
                    countUnit: 'Cái',
                    unitPrice: this.randomMoney(),
                    amount: '2',
                    sumMoney: '500.000'
                }
                data.push(item2);

                var item3 = {
                    itemCode: 'THY092344',
                    itemName: this.randomGoods(),
                    storePlace: 'Chi nhánh Phạm Hùng',
                    countUnit: 'Cái',
                    unitPrice: this.randomMoney(),
                    amount: '3',
                    sumMoney: '800.000'
                }
                data.push(item3);
                break;
        
            default:
                break;
        }
        return data;
    }

    getComboboxData(comboboxName) {
        switch (comboboxName) {
            case "customer-repayment":
                var customerComboboxDataOnRepaymentDialog = [];
                var comboboxData1 = {
                    id: 'nmd2310',
                    code: 'KH0001',
                    name: 'Nguyễn Văn A',
                    type: 'Khách hàng',
                    address: 'Duy Tân'
                }

                var comboboxData2 = {
                    id: '0213nmd',
                    code: 'KH0002',
                    name: 'Đỗ Mạnh B',
                    type: 'Khách hàng',
                    address: 'Lò Đúc'
                }

                var comboboxData3 = {
                    id: 'nm0230d',
                    code: 'KH0003',
                    name: 'Hoàng Văn C',
                    type: 'Khách hàng',
                    address: 'NoWhere'
                }

                for (let i = 1; i <= 2; i++) {
                    customerComboboxDataOnRepaymentDialog.push(comboboxData1);
                    customerComboboxDataOnRepaymentDialog.push(comboboxData2);
                    customerComboboxDataOnRepaymentDialog.push(comboboxData3);
                }
                return customerComboboxDataOnRepaymentDialog;
                break;

            case "customer-receipt":
                var customerComboboxDataOnReceiptDialog = [];
                var comboboxData1 = {
                    id: 'nmd2310',
                    code: 'KH0001',
                    name: 'Đặng Trần Tùng',
                    type: 'Khách hàng'
                }

                var comboboxData2 = {
                    id: 'lmr0231',
                    code: 'KH0002',
                    name: 'Lê Hoàng Hải',
                    type: 'Nhà cung cấp'
                }

                for (let i = 1; i <= 5; i++) {
                    customerComboboxDataOnReceiptDialog.push(comboboxData1);
                    customerComboboxDataOnReceiptDialog.push(comboboxData2);
                }
                return customerComboboxDataOnReceiptDialog;
                break;

            case "staff":
                var staffComboboxData = [];
                var comboboxData1 = {
                    id: 'staff0608',
                    code: 'MV0456',
                    name: 'Hoàng Đạo Thúy',
                }

                var comboboxData2 = {
                    id: 'staff0608',
                    code: 'NV02323',
                    name: 'Nguyễn Mạnh Duy',
                }

                for (let i = 1; i <= 1; i++) {
                    staffComboboxData.push(comboboxData1);
                    staffComboboxData.push(comboboxData2);
                }

                return staffComboboxData;
                break;
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
        return "PT00007";
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

    randomMoney(){
        var begin = Math.floor((Math.random() * 90) + 1);
        return begin+'0.000';
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

}
