class AjaxJS {
    constructor() {
        this.receiptNumber = "XK0000012";
        this.detailExportReceipt = []
    }

    /**
     * Sinh dữ liệu giả và trả về cho bảng phiếu xuất kho
     * Createby NMDuy 25/07/2019
     */

    getExportMasterTableData(){
        var data = [];        
        for(let i = 0;i<30;i++){
            var objectCode = this.randomObjectCode();
            var item = {
                id: Math.floor((Math.random() * 3) + 1),
                receiptDate: this.randomDate(),
                receiptNumber: 'XK000'+(i+10),
                objectName: this.randomName(),
                sumMoney: this.randomMoney(),
                exportExplain: this.randomNote(),
                receiptType: this.randomReceiptType(),
                objectCode: objectCode+this.randomTwoDigitNumber(),
                objectAddress: 'Cầu Giấy',
                receiptTime: '10:34',
            }
            data.push(item);
        }
        return data;
    }

    /**
     * Lấy dữ liệu thông tin chi tiết phiếu xuất kho 
     * @param {any} id : id phiếu xuất kho 
     * Createby NMDuy 25/07/2019
     */

    getDetailExportReceipt(id){
        var data = [];
        switch (id) {
            case "1":
                var item = {
                    id: 1,
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
                        id: 2,
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
                        id: 3,
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
                data = this.detailExportReceipt.filter(function(item){
                    return item.id == id
                })
                break;
        }
        return data;
    }

    /**
     * Thêm mới các mặt hàng vào bảng chi tiết phiếu xuất kho
     * @param {any} receiptDetails : mảng các mặt hàng
     * Createby NMDuy 25/07/2019
     */

    addReceiptDetailToDataTable(receiptDetails){
        this.detailExportReceipt = [...this.detailExportReceipt, ...receiptDetails];
    }
    
    /**
     * Lấy dữ liệu combobox tương ứng với tên truyền vào
     * @param {any} comboboxName : tên combobox
     * Createby NMDuy 25/07/2019
     */

    getComboboxData(comboboxName) {
        var object = [];
        switch (comboboxName) {
            case "object":

                for (let i = 1; i <= 20; i++) {
                    var objectCode = this.randomObjectCode();
                    var objectType = '';
                    var objectTypeOrder = '';
                    if(objectCode == 'KH'){
                        objectCode = 'KH0000';
                        objectType = 'Khách hàng';
                        objectTypeOrder = 1;
                    } else if(objectCode == 'NCC') {
                        objectCode = 'NCC0000';
                        objectType = 'Nhà cung cấp';
                        objectTypeOrder = 2;

                    } else {
                        objectCode = 'NV0000';
                        objectType = 'Nhân viên';
                        objectTypeOrder = 3;

                    }
                    
                    var item = {
                        id: 'nmd2310',
                        code: objectCode+this.randomTwoDigitNumber(),
                        name: this.randomName(),
                        type: objectType,
                        objectTypeOrder: objectTypeOrder,
                        address: 'Duy Tân'
                    }
                    object.push(item);
                
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
                    }
    
                    goods.push(item);
                }
                return goods;
        }
    }

    //#region hàm sinh dữ liệu giả

    randomDate(){
        var date = Math.floor(Math.random() * 30) + 1;
        var month = Math.floor(Math.random() * 6) + 1;
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
        return Math.floor((Math.random() * 90) + 10);
    }

    randomMoney(){
        return this.randomTwoDigitNumber()+'0.000';
    }

    randomReceiptType(){
        var receiptTypeArr = [
            'Phiếu xuất kho bán hàng',
            'Phiếu trả lại hàng mua - Tiền mặt',
            'Phiếu trả lại hàng mua - Tiền gửi',
            'Phiếu trả lại hàng mua - Giảm trừ công nợ',
            'Phiếu xuất kho kiểm kê',
            'Phiếu xuất kho điều chuyển sang cửa hàng khác',
            'Phiếu xuất kho khác',
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

    randomObjectCode(){
        var objectCodeArr = [
            'KH',
            'NCC',
            'NV'
            ];
        return objectCodeArr[Math.floor(Math.random()*objectCodeArr.length)];
    }

    //#endregion
}
