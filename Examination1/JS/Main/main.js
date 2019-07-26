$(document).ready(function(){
    /**
     * Khởi tạo Main object xử lý các sự kiện trên màn xuất kho
     * createby nmduy 24/07
     */
    mainJS = new MainJS();

    /**
     * Ẩn combobox menu khi click ra vùng ngoài
     * Createby NMDuy 25/07/2019 
     */
    $(document).click(function (e) {
        var container = $(".input-combobox");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            var container2 = $(".icon-arrow-down");
            if (!container2.is(e.target) && container2.has(e.target).length === 0) {
                $(".dropdown-content").removeClass("show-hide");
            }
        }
    });

    /**
     * Toggle combobox menu khi focus vào ô input chứa combobox
     * Createby NMDuy 25/07/2019
     */
    $('.input-combobox').focus(function () {
        var thisInputComboboxName = $(this).attr("inputCombobox");
        var comboboxes = $('.dropdown-content');
        for (let i = 0; i < comboboxes.length; i++) {
            if ($(comboboxes[i]).hasClass('show-hide')) {
                var inputComboboxName = $(comboboxes[i]).attr("comboboxName");
                if (thisInputComboboxName != inputComboboxName) {
                    $(comboboxes[i]).removeClass("show-hide");
                }
            };  
        }
    })

    $('.date-input').mask("99/99/9999");
    $('.time-input').mask("99:99");
})

/**
 * MainJS object xử lý tác vụ có trong màn xuất kho
 * Createby NMDuy 25/07/2019
 */

class MainJS {

    /**
     * Hàm khởi tạo các đối tượng và biến dùng trong chương trình
     * Createby NMDuy 25/07/2019
     */
    constructor(){
        this.AjaxJS = new AjaxJS();
        this.DatabindingJS = new DataBindingJS();
        this.DatafomaterJS = new DataFormaterJS();
        this.NewExportReceiptDialog = new Dialog("Thêm phiếu xuất kho khác", 1000, 700, "dialogNewExport");
        this.DialogSaveData = new Dialog("Dữ liệu chưa được lưu", 400, 'auto', 'dialogSaveDataNotification');
        this.NotificationDialog = new Dialog("MShopKeeper", 400, 'auto', 'dialogNotification');
        this.SearchObjectDialog = new Dialog("Chọn đối tượng", 800, 'auto', 'dialogSearchObject');
        this.exportTableData = [];
        this.today = getInitialDate();
        this.mode = '';
        this.receiptNumber = 40;
        this.receiptCodeNumber = '';
        this.selectedRowItemId = '';
        this.currentRowIndex = 0;
        this.isDeleteItem = false;
        this.objectComboboxData = [];
        this.goodsComboboxData = [];
        this.InitEvents();
    }

    /**
     * Hàm khởi tạo các event listener, load data
     * Createby NMDuy 25/07/2019
     */

    InitEvents() {
        var _this = this;
        this.exportTableData = this.AjaxJS.getExportMasterTableData();

        this.loadData("export-master-table");
        changeDateTimeByCase("3", "#get-data-from-day-input", "#get-data-to-day-input");
        $(document).on("focus", ".form-control-input", this.selectAllValue);

        $(document).on("click", "#btnAdd", { type: 'add' }, this.showNewExportReceiptDialog.bind(this));
        $(document).on("click", "#btnDuplicate", { type: 'duplicate' }, this.showNewExportReceiptDialog.bind(this));
        $(document).on("click", "#btnEdit", { type: 'edit' }, this.showNewExportReceiptDialog.bind(this));
        $(document).on("click", "#btnCheck", { type: 'check' }, this.showNewExportReceiptDialog.bind(this));

        $(document).on("click", "#btnReturn", { type: 'return' }, this.subToolbarBtnClickHandle.bind(this));
        $(document).on("click", "#btnAddNew", { type: 'addnew' }, this.subToolbarBtnClickHandle.bind(this));
        $(document).on("click", "#btnRepair", { type: 'repair' }, this.subToolbarBtnClickHandle.bind(this));
        $(document).on("click", ".delete-item-btn", this.deleteExportReceipt.bind(this));


        $(document).on("click", ".export-master-table tr", this.onSelectRowOnMasterExportTable.bind(this));


        $(document).on("click", ".cls-other", { mode: 1 }, this.tabs.bind(this));
        $(document).on("click", ".cls-pay", { mode: 2 }, this.tabs.bind(this));

        $(document).on("click", ".time-range-item", this.onSelectTimeRangeFilter.bind(this));

        $(document).on("click", ".icon-arrow-down", this.showCombobox.bind(this));
        $(document).on("keyup", ".input-combobox", this.filterComboboxData.bind(this));
        //$(document).on("keydown", ".input-combobox", this.hideComboboxDataByTabPress);
        $(document).on("focus", ".input-combobox", this.selectAllValue);

        $(document).on("click", ".dropdown-bootstrap", this.bindBootstrapComboboxData);

        $(document).on("keypress", ".positive-num-input", this.validateNumberInput);
        $(document).on("keyup", ".positive-num-input", this.displayCustomNumber.bind(this));
        $(document).on("focusout", ".positive-num-input", this.checkNegativeNumber);
        $(document).on("focus", ".positive-num-input", this.selectAllValue);

        $(document).on("click", ".amount-arrow", this.changeAmountValue.bind(this));

        $(document).on("keyup", ".unit-price", {mode: 1},  this.onChangeCalculateValue.bind(this));
        $(document).on("keyup", ".amount", {mode: 1}, this.onChangeCalculateValue.bind(this));
        $(document).on("keyup", ".sum-money",{mode: 2}, this.onChangeCalculateValue.bind(this));

        $(document).on("click", ".get-store-data",{type: 1}, this.getStoreDataByFilter.bind(this));
        $(document).on("keyup", ".search-input-filter",{type: 2}, this.getStoreDataByFilter.bind(this));
        $(document).on("click", ".compare-operator-item",{type: 2}, this.getStoreDataByFilter.bind(this));
        $(document).on("click", ".receipt-type-item",{type: 2}, this.getStoreDataByFilter.bind(this));
        
        $(document).on("click", ".icon-double-arrow-left", {type: 1}, this.getNextPage.bind(this));
        $(document).on("click", ".icon-arrow-left", {type: 2}, this.getNextPage.bind(this));
        
        $(document).on("click", ".icon-arrow-right", {type: 3}, this.getNextPage.bind(this));
        $(document).on("click", ".icon-double-arrow-right", {type: 4}, this.getNextPage.bind(this));       
        
        $(document).on("focusout", ".input-pagination", {type: 5}, this.getNextPage.bind(this));

        $(document).on("click", ".icon-refresh-pagination", {type: 6}, this.getNextPage.bind(this));

        $(document).on("click", ".object-combobox-data>tr", this.onSelectItemOnObjectCombobox.bind(this));
        $(document).on("click", ".goods-combobox-data tr", this.onSelectGoodsOnComboBox.bind(this));


        $(document).on("click", "#btnClose", this.closeDialog.bind(this));

        $(document).on("click", ".cancel-dialog-btn", {option: 1} , this.notificationDialogHandle.bind(this));
        $(document).on("click", ".not-save-export-btn", {option: 2}, this.notificationDialogHandle.bind(this));
        $(document).on("click", ".save-export-btn", {option: 3}, this.notificationDialogHandle.bind(this));
        $(document).on("click", "#btnSave", {option: 3}, this.notificationDialogHandle.bind(this));
        
        $(document).on("click", ".delete-detail-item-btn", this.deleteDetailItem.bind(this));

        $(document).on("click", ".btn-confirm-dialog", this.confirmDialog.bind(this));

        $(document).on("click", ".btn-confirm-dialog", this.confirmDialog.bind(this));

        $(document).on("click", ".icon-object-quick-search", this.showObjectSearchDialog.bind(this));

        $(document).on("focusout", ".date-input",{type: 1} ,this.validateTime.bind(this));
        $(document).on("focusout", ".time-input", {type: 2}, this.validateTime.bind(this));

        


        $(document).keydown(function(e) {
            for(let i = 0;i<$('.dropdown-content').length;i++){
                var target = $('.dropdown-content')[i];
                if($(target).hasClass("show-hide")){
                    _this.checkKeyOnComboboxInput(e,target, _this);
                }
            }
        });

        /**
         * Filter dữ liệu trong bảng phiếu xuất kho theo ngày
         * Createby NMDuy 25/07/2019
         */
        $("#export-date-filter-input").datepicker({
            onSelect: function (dateText) {                
                var date = $(this).val();
                date = formatDate(date);
                $("#export-date-filter-input").val(date);
                _this.getStoreDataFilterByDate(date);
            }
        });
    }

    /**
     * Hàm load dữ liệu vào bảng
     * @param {any} tableId id bảng cần load dữ liệu 
     * Createby NMDuy 25/07/2019
     */

    loadData(tableId){
        var _this = this;
        switch(tableId){
            case "export-master-table":
                var data = this.exportTableData;
                data.sort(function(a,b){
                    var dateA = convertToISODate(a.receiptDate), dateB = convertToISODate(b.receiptDate);
                    if(dateA > dateB){
                        return -1;
                    } else if(dateA < dateB){
                        return 1;
                    } else {
                        if(a.receiptNumber>b.receiptNumber){
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                })
                this.DatabindingJS.bindDatatoExportMasterTable(data);
        }
    }

    /**
     * Hàm lọc dữ liệu trên bảng chứng từ xuất kho
     * Createby NMDuy 25/07/2019
     */

    getStoreDataByFilter(sender){
        var _this = this;
        var type = sender.data['type'];
        switch (type) {
            case 1:
                var startDate = $("#get-data-from-day-input").val();
                var endDate = $("#get-data-to-day-input").val();
                startDate = convertToISODate(startDate);
                endDate = convertToISODate(endDate);
                if(startDate>endDate){
                    alert("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
                } else {
                    var filterData = this.exportTableData.filter(function (item) {
                        var isoDateItem = convertToISODate(item.receiptDate);
                        if(isoDateItem >= startDate && isoDateItem <= endDate){
                            return true;
                        }
                    });
                    this.DatabindingJS.bindDatatoExportMasterTable(filterData);
                }
                break;
            case 2:
                var receiptNumberKeyword = $('.search-input-filter[filterIndex=1]').val();
                var objectKeyword = $('.search-input-filter[filterIndex=2]').val();
                var noteKeyword = $('.search-input-filter[filterIndex=4]').val();
                var receiptType = $('.receipt-type').html().trim();
                if(receiptType == "Tất cả"){
                    receiptType = '';
                }
                var filterData = this.exportTableData.filter(function (item) {
                    if(item.receiptNumber.toLowerCase().includes(receiptNumberKeyword.toLowerCase())
                     && item.objectName.toLowerCase().includes(objectKeyword.toLowerCase()) 
                     && item.receiptType.toLowerCase().includes(receiptType.toLowerCase()) 
                     && _this.checkValidSumAmountValue(item.sumMoney)
                     && item.exportExplain.toLowerCase().includes(noteKeyword.toLowerCase())
                     ){
                        return true;
                    }        
                });
                this.DatabindingJS.bindDatatoExportMasterTable(filterData);
                break;
        
            default:
                break;
        }
    }

    /**
     * Hàm lọc dữ liệu theo ngày chứng từ
     * @param {any} date : ngày chứng từ
     * Createby NMDuy 25/07/2019
     */

    getStoreDataFilterByDate(date){
        var _this = this;
        var filterData = this.exportTableData.filter(function (item) {
            if(checkEqualDate(date, item.receiptDate)){
                return true;
            }
        });
        this.DatabindingJS.bindDatatoExportMasterTable(filterData);
    }

    /**
     * Hàm chọn 1 hàng trên bảng phiếu xuất kho, bind thông tin chi tiết tương ứng vào bảng chi tiết
     * @param {any} sender : đối tượng được click 
     * Createby NMDuy 25/07/2019
     */

    onSelectRowOnMasterExportTable(sender){

        $('.export-master-table tr').removeClass('selected-row');
        var target = $(sender.currentTarget);
        target.addClass('selected-row');
        $('.enable-if-selected').removeClass('custom-disabled-btn');
        $('.export-detail-table').html('');
        var itemId = $(sender.currentTarget).attr("id");
        this.selectedRowItemId = itemId;
        var detailExportReceipt = this.AjaxJS.getDetailExportReceipt(itemId);
      
        this.DatabindingJS.bindDetailExportReceiptData(detailExportReceipt);
    }

    /**
     * Hiển thị form thêm mới phiếu xuất kho
     * @param {any} sender : đối tượng được click 
     * Createby NMDuy 25/07/2019
     */

    showNewExportReceiptDialog(sender){
        var type = sender.data['type'];
        $('.toolbar-dialog-item').addClass('custom-disabled-btn');
        this.resetNewExportForm();
        this.objectComboboxData = this.AjaxJS.getComboboxData("object");
        this.goodsComboboxData = this.AjaxJS.getComboboxData("goods");
        this.DatabindingJS.bindingComboboxData("object", this.objectComboboxData);
        this.DatabindingJS.bindingComboboxData("goods", this.goodsComboboxData);
        if(type == 'add'){
            this.addNewExportReceipt();
            this.NewExportReceiptDialog.open();
            $(".object-code-input").focus();
            $(".move-to-other-store").removelass("custom-disabled-btn");

        } else if(type == 'edit'){
           this.editExportReceipt();
           this.NewExportReceiptDialog.open();
           $(".object-code-input").focus();
           $(".move-to-other-store").removeClass("custom-disabled-btn");

        } else if(type == 'check'){
            this.NewExportReceiptDialog.Dialog.dialog({title: "Xem phiếu xuất kho"});
            $('.enable-when-check-btn').removeClass('custom-disabled-btn');
            $('.alway-enable-btn').removeClass('custom-disabled-btn');
            this.bindExportDataToForm(this.selectedRowItemId);
            $(".form-control-input").addClass("custom-disabled-btn");
            $(".move-to-other-store").addClass("custom-disabled-btn");
            this.NewExportReceiptDialog.open();
        } else if (type == 'duplicate') {

            this.editExportReceipt();
            this.NewExportReceiptDialog.Dialog.dialog({title: "Nhân bản phiếu xuất kho"});
            this.mode == 'duplicate';
            this.receiptCodeNumber = "XK000"+this.receiptNumber;
            $(".receipt-number").val(this.receiptCodeNumber);
            this.NewExportReceiptDialog.open();
            $(".object-code-input").focus();
            $(".move-to-other-store").removeClass("custom-disabled-btn");
        }
    }


    showObjectSearchDialog(){
        this.SearchObjectDialog.open();
    }

    /**
     * Xử lý hiển thị trên form khi người dùng ấn thêm mới
     * Createby NMDuy 25/07/2019
     */

    addNewExportReceipt(){
        this.NewExportReceiptDialog.Dialog.dialog({title: "Thêm phiếu xuất kho"});
        this.resetNewExportForm();
        $('.new-export-detail-box').html('');
        $('.toolbar-dialog-item').addClass('custom-disabled-btn');
        $(".form-control-input").removeClass("custom-disabled-btn");
        this.currentRowIndex = 0;
        
        this.appendEmptyRowToNewExportDetail();
        $('.enable-when-add-btn').removeClass('custom-disabled-btn');
        $('.alway-enable-btn').removeClass('custom-disabled-btn');
        this.receiptCodeNumber = "XK000"+this.receiptNumber;
        $(".receipt-number").val(this.receiptCodeNumber);
        $(".export-day-input").val(this.today);
        $(".export-hour-input").val(getCurrentTime());
        this.mode = 'add';
        this.onOtherPurposeRadioSelection();   

        

    }

    /**
     * Xử lý hiển thị trên form khi người dùng ấn chỉnh sửa
     * Createby NMDuy 25/07/2019
     */

    editExportReceipt(){
        this.NewExportReceiptDialog.Dialog.dialog({title: "Sửa phiếu xuất kho"});
        $('.enable-when-edit-btn').removeClass('custom-disabled-btn');
        $(".form-control-input").removeClass("custom-disabled-btn");
        $('.alway-enable-btn').removeClass('custom-disabled-btn');
        this.bindExportDataToForm(this.selectedRowItemId);
        this.appendEmptyRowToNewExportDetail();
        this.mode = 'edit';
        $(".object-code-input").focus();

    }

    /**
     * Hiển thị dialog xác nhận xóa phiếu xuất kho được chọn
     * Createby NMDuy 25/07/2019
     */

    deleteExportReceipt(){
        this.showNotificationDialog('delete');
    }

    /**
     * Bind dữ liệu của phiếu xuất kho được chọn vào form
     * @param {any} id : id phiếu xuất kho được chọn
     * Createby NMDuy 25/07/2019
     */

    bindExportDataToForm(id){
        var _this = this;
        var exportReceipt = this.exportTableData.filter(function(item){
            return item.id == _this.selectedRowItemId
        });

        $(".object-code-input").val(exportReceipt[0].objectCode);
        $(".object-name-input").val(exportReceipt[0].objectName);
        $(".object-address-input").val(exportReceipt[0].objectAddress);
        $(".export-explain-input").val(exportReceipt[0].exportExplain);
        $(".receipt-number").val(exportReceipt[0].receiptNumber);
        $(".export-day-input").val(exportReceipt[0].receiptDate);
        $(".export-hour-input").val(exportReceipt[0].receiptTime);

        var detailExportItemData = this.AjaxJS.detailExportReceipt.filter(function(item){
            return item.id == _this.selectedRowItemId
        });

        for(let i = 0;i<detailExportItemData.length;i++){
            this.appendNewRowToNewExportDetailTable(detailExportItemData[i]);
        }

    }

    /**
     * Hàm xử lý hiển thị khi người dùng click vào button trên form thêm mới phiếu xuất kho
     * @param {any} sender : đối tượng được click
     * Createby NMDuy 25/07/2019
     */

    subToolbarBtnClickHandle(sender){
        var type = sender.data['type'];
        if(type == 'return'){
            this.bindExportDataToForm(this.selectedRowItemId);
        } else if (type == 'addnew'){
            this.addNewExportReceipt();
        } else if (type == 'repair'){
            this.editExportReceipt();
        }

    }

    /**
     * Hàm bind dữ liệu vào form khi người dùng thực hiện chọn trên combobox đối tượng
     * @param {any} sender : đối tượng được click 
     * Createby NMDuy 25/07/2019
     */

    onSelectItemOnObjectCombobox(sender){
        var objectCode = '';
        var objectName = '';
        var objectAddress = '';
        if(sender.length == 1){
        } else {
            sender = sender.currentTarget;
        }

        objectName = $(sender).attr("objectName");
        objectCode = $(sender).attr("objectCode");
        objectAddress = $(sender).attr("objectAddress");
        
        $('.object-code-input').val(objectCode);
        $('.object-name-input').val(objectName);
        $('.object-address-input').val(objectAddress);

        $('.export-explain-input').focus();
    }

    /**
     * Hàm ẩn hiện combobox
     * @param {any} sender : đối tượng được thực hiện thao tác 
     * Createby NMDuy 25/07/2019
     */

    showCombobox(sender){
        var comboboxName = $(sender.currentTarget).attr("comboboxName");
        $('input[inputCombobox='+comboboxName+']').focus();
        if(comboboxName == "goods"){
            this.DatabindingJS.bindingComboboxData("goods", this.goodsComboboxData);
            var tableLenght = $('.new-export-detail-box').children().length;
            if(tableLenght>=3){
                $('.goods').css("top","-240px");
            } else {
                $('.goods').css("top","unset");

            }
        }
        if ($('.' + comboboxName).hasClass('show-hide')) {
            $('.dropdown-content').removeClass("show-hide");
        } else {
            $('.dropdown-content').removeClass("show-hide");
            $('.' + comboboxName).addClass('show-hide');
        }
    }

    /**
     * Hàm xử lý hiển thị khi lựa chọn giữa 2 radio button trên form thêm mới phiếu xuất kho
     * @param {any} sender : đối tượng được thực hiện thao tác
     * Createby NMDuy 25/07/2019 
     */

    tabs(sender) {
        var mode = sender.data["mode"];
        if (mode == 1) {
            this.onOtherPurposeRadioSelection();
        }
        if (mode == 2) {
            this.onRadioSelection();
        }
    }

    /**
     * Hàm lọc dữ liệu combobox
     * @param {any} sender : đối tượng được thực hiện thao tác 
     * Createby NMDuy 25/07/2019
     */
    filterComboboxData(sender) {
        var key = sender.originalEvent.keyCode;
        if (key == 38 || key == 40 || key == 9) {
        } else {
            var inputName = $(sender.target).attr("inputCombobox");
            var keyword = $('input[inputCombobox=' + inputName + ']').val();
            if (keyword == '') {
                $('.dropdown-content').removeClass('show-hide');
            } else {
                switch (inputName) {
                    case 'object':
                        var filterData = this.objectComboboxData.filter(function (item) {
                            return item.name.toLowerCase().includes(keyword.toLowerCase());
                        });
                        if (filterData.length == 0) {
                            $('.object').removeClass('show-hide');
                        } else {
                            $('.object').addClass('show-hide');
                            this.DatabindingJS.bindingComboboxData("object", filterData);
                        }
                        break;
                    case 'goods':
                        var filterData = this.goodsComboboxData.filter(function (item) {
                            if(item.itemName.toLowerCase().includes(keyword.toLowerCase()) || item.itemCode.toLowerCase().includes(keyword.toLowerCase())){
                                return true;
                            }
                        });
                        if (filterData.length == 0) {
                            $('.goods').removeClass('show-hide');
                        } else {
                            debugger
                            var tableLenght = $('.new-export-detail-box').children().length;
                            if(tableLenght>=3){
                                $('.goods').css("top","240px");
                            } else {
                                $('.goods').css("top","unset");
                            }
                            $('.goods').addClass('show-hide');
                            this.DatabindingJS.bindingComboboxData("goods", filterData);
                        }
                        break;
                }
            }
        }
    }

    /**
     * Hàm xử lý tăng giảm giá trị khi click mũi tên lên xuống ô input
     * @param {any} sender : đối tượng được thực hiện thao tác 
     * Createby NMDuy 25/07/2019
     */
    changeAmountValue(sender){
        var targetName = $(sender.currentTarget).attr("amountItem");
        var index = targetName.replace("amount-", "");
        if(targetName){
            var targetVal = parseInt($("."+targetName).val());
            if($(sender.currentTarget).hasClass('arrow-up')){
                $("."+targetName).val(targetVal+1);
            } else if(targetVal>0) {
                $("."+targetName).val(targetVal-1);
            }
        }
        this.calculateSumMoney(index);
    }

    /**
     * Thực hiện lại việc tính toán khi có thay đổi trên đơn giá, số lượng hoặc tổng tiền
     * @param {any} sender : đối tượng được thực hiện thao tác 
     * Createby NMDuy 25/07/2019
     */
    onChangeCalculateValue(sender){
        var index = $(sender.currentTarget).attr("index");
        var mode = sender.data['mode'];
        if(mode == 1){
            this.calculateSumMoney(index);
        } else {
            this.calculateUnitPrice(index);
        }
    }

    /**
     * Hàm tính toán giá trị tổng tiền
     * @param {any} index : chỉ số của dòng cần thực hiện việc tính toán 
     * Createby NMDuy 25/07/2019
     */


    calculateSumMoney(index){
        var unitPrice = $('.unit-price-'+index).val();
        var amount = $('.amount-'+index).val();
        if(unitPrice == "" || amount == ""){
            $('.sumMoney-'+index).val(0);
        } else {
            var sumMoney = this.DatafomaterJS.formatToIntNumber(unitPrice)*parseInt(amount);
            sumMoney = this.DatafomaterJS.formatToStringNumber(sumMoney);
            $('.sumMoney-'+index).val(sumMoney);
        }
        this.calculateSumAllAmount()

    }

    /**
     * Hàm tính toán đơn giá
     * @param {any} index : chỉ số của dòng cần thực hiện việc tính toán 
     * Createby NMDuy 25/07/2019
     */

    calculateUnitPrice(index){
        var sumMoney = this.DatafomaterJS.formatToIntNumber($('.sumMoney-'+index).val());
        var amount = this.DatafomaterJS.formatToIntNumber($('.amount-'+index).val());
        if(isNaN(sumMoney) || amount == 0){
            $('.unit-price-'+index).val(0);
        } else {
            var unitPrice = sumMoney/amount;
            unitPrice = this.DatafomaterJS.formatToStringNumber(unitPrice);
            $('.unit-price-'+index).val(unitPrice);
        }
        this.calculateSumAllAmount()

    }

    /**
     * Hàm tính tổng tiền của bảng chi tiết phiếu xuất kho
     * Createby NMDuy 25/07/2019
     */

    calculateSumAllAmount(){
        var tableLenght = $('.new-export-detail-box').children().length;
        var sumAllAmount = 0;
        if(tableLenght>1)
        for(let i = 0;i<tableLenght-1;i++){
            var trElement = $('.new-export-detail-box').children()[i];
            var rowIndex = $(trElement).attr("rowIndex");
            var sumAmount = this.DatafomaterJS.formatToIntNumber($('.sumMoney-'+rowIndex).val());
            sumAllAmount+=sumAmount;
        }
        sumAllAmount = this.DatafomaterJS.formatToStringNumber(sumAllAmount);
        $('.sum-all-amount').html(sumAllAmount);
    }

    /**
     * Binding dữ liệu từ dòng được lựa chọn vào vị trí đích,
     * Createby NMDuy 25/07/2019
     */

    bindBootstrapComboboxData(){
        var value = this.innerText;
        var dropdownName = $(this).attr("dropdownName");
        if(dropdownName == "compare-operator"){
            var operator = $(this).attr("operator");
            $('.'+dropdownName).html(operator);
        } else {
            $('.'+dropdownName).html(value);
        }
    }
    
    /**
     * Xóa mặt hàng được đã được trong bảng chi tiết
     * @param {any} sender : đối tượng được thực hiện thao tác 
     * Createby NMDuy 25/07/2019
     */

    deleteDetailItem(sender){
        var rowIndex = $(sender.currentTarget).attr("rowIndex");
        $('.garbage-icon[rowIndex='+rowIndex+']').closest('tr').remove()
   
    }

    /**
     * Hàm so sánh giá trị tổng tiền để thực hiện lọc theo tổng tiền trên bảng xuất kho
     * @param {any} itemSumAmount : tổng tiền cần thực hiện so sánh
     * Createby NMDuy 25/07/2019
     */

    checkValidSumAmountValue(itemSumAmount){
        var sumMoneyKeyword = $('.search-input-filter[filterIndex=3]').val();
        sumMoneyKeyword = this.DatafomaterJS.formatToIntNumber(sumMoneyKeyword);
        var itemSumAmountValue = this.DatafomaterJS.formatToIntNumber(itemSumAmount);
        if(sumMoneyKeyword){
            var operator = $(".compare-operator").html().trim();
            switch (operator) {
                case "=":
                    if(sumMoneyKeyword == itemSumAmountValue){
                        return true;
                    }
                    return false;
                case "&gt;":
                    if(sumMoneyKeyword < itemSumAmountValue){
                        return true;
                    }
                    return false;
                case "&gt;=":
                    if(sumMoneyKeyword <= itemSumAmountValue){
                        return true;
                    }
                    return false;
                case "&lt;":
                    if(sumMoneyKeyword > itemSumAmountValue){
                        return true;
                    }
                    return false;
                case "&lt;=":
                    if(sumMoneyKeyword >= itemSumAmountValue){
                        return true;
                    }
                    return false;
            
                default:
                    break;
            }
        } else {
            return true;
        }
    }

    /**
     * Chọn một mặt hàng trên combobox mặt hàng
     * @param {any} sender : đối tượng được thực hiện thao tác  
     * Createby NMDuy 25/07/2019
     */

    onSelectGoodsOnComboBox(sender) {
        this.currentRowIndex += 1;
        if(sender.length == 1){
        } else {
            sender=sender.currentTarget;
        }
        var ele = $(sender);
        var itemCode = ele.attr("itemCode");
        var itemName = ele.attr("itemName");
        var countUnit = ele.attr("countUnit");
        var unitPrice = ele.attr("unitPrice");


        var good = {
            itemIndex: this.currentRowIndex,
            itemCode: itemCode,
            itemName: itemName,
            countUnit: countUnit,
            unitPrice: unitPrice,
            amount: 1,
            sumMoney: unitPrice
        }


        var lastRowIndex = $('.new-export-detail-box').children().length;
        $('.new-export-detail-box').children()[lastRowIndex-1].remove();
        
        this.appendNewRowToNewExportDetailTable(good);
        this.appendEmptyRowToNewExportDetail();

        var rowCount = lastRowIndex;

        $('.row-count').html("Số dòng = "+rowCount);

        this.calculateSumAllAmount();
        
    }

    /**
     * Append dòng mới vào bảng chi tiết với dữ liệu mặt hàng được chọn từ combobox
     * @param {any} data : mặt hàng được chọn
     * Createby NMDuy 25/07/2019
     */
    appendNewRowToNewExportDetailTable(data){
        var storePlace = '';
        if(!data.storePlace){
            if($(".cls-other").hasClass("icon-radio-true")){
                storePlace = "Chi nhánh Cầu Giấy"
            } else {
                storePlace = $('.store-place').html();
            }
        } else {
            storePlace = data.storePlace;
        }

        var row = 
                `<tr class="no-padding-data-row" rowIndex="${data.itemIndex}">
                    <td> <div class="data-cell item-code-${data.itemIndex}"> ${data.itemCode} <div> </td>
                    <td class="disabled-cell"> <div class="data-cell item-name-${data.itemIndex}">  ${data.itemName}</div> </td>
                    <td>
                        <div class="dropdown">
                            <div class="dropdown-toggle store-place-dropdown" data-toggle="dropdown">
                                    <span class="store-place-${data.itemIndex}"> ${storePlace} </span>
                                    <div class="add-arrow-down-icon">
                                            <i class="fa fa-caret-down icon-dropdown"></i>
                                    </div>
                            </div>
                            <ul class="dropdown-menu time-filter-selection" role="menu" aria-labelledby="menu1">
                                <li dropdownName="store-place-${data.itemIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Cầu Giấy</a></li>
                                <li dropdownName="store-place-${data.itemIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Duy Tân</a></li>
                                <li dropdownName="store-place-${data.itemIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Bưởi</a></li>
                                <li dropdownName="store-place-${data.itemIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Phạm Hùng</a></li>
                                <li dropdownName="store-place-${data.itemIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Nhổn</a></li>
                                <li dropdownName="store-place-${data.itemIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Mỹ Đình</a></li>
                            </ul> 
                        </div>
                    </td>
                    <td> <div class="data-cell count-unit-${data.itemIndex}"> ${data.countUnit}  </div></td>
                    <td>
                        <div>
                            <input class="input-inside-cell positive-num-input text-align-right unit-price unit-price-${data.itemIndex}" index="${data.itemIndex}" style="width: 100px" value= "${data.unitPrice }" type="text">
                        </div>
                    </td>
                    <td>
                        <div style="display:flex">
                            <input class="input-inside-cell positive-num-input text-align-center amount amount-${data.itemIndex}" index="${data.itemIndex}" style="width: 80px" value="${data.amount}" type="text">
                            <div class="up-down-arrow"> <div class="amount-arrow arrow-up" amountItem="amount-${data.itemIndex}"></div> <div class="amount-arrow arrow-down" amountItem="amount-${data.itemIndex}"></div> </div>
                        </div>
                    </td>
                    <td>
                        <div>
                            <input class="input-inside-cell positive-num-input text-align-right sum-money sumMoney-${data.itemIndex}" index="${data.itemIndex}" style="width: 100px" value= "${ data.sumMoney }" type="text">
                        </div>
                    </td>
                    <td>
                        <div class="garbage-icon delete-detail-item-btn" rowIndex="${data.itemIndex}"></div>
                    </td>
                </tr>`

                $('.new-export-detail-box').append(row);
                $('.unit-price-'+data.itemIndex).focus();

    }

    /**
     * Append dòng trống vào bảng chi tiết
     * Createby NMDuy 25/07/2019
     */

    appendEmptyRowToNewExportDetail(){
        var row = 
                `<tr class="no-padding-data-row">
                    <td>
                        <div style="position:relative">
                            <div class="dropdown-div filter-table-input">
                                <input type="text" class="input-day-from dialog-input input-combobox detail-row-input" inputCombobox="goods" placeholder="Tìm tên, mã"/>
                                <div class="dropdown-content goods" comboboxName="goods">
                                    <div>
                                        <div class="thead-dropdown">
                                            <div style="width: 130px" class="dropdown-column-name">
                                                Mã
                                            </div>
                                            <div style="width: 251px" class="dropdown-column-name center-dropdown-column">
                                                Tên
                                            </div>
                                            
                                        </div>
                                        <div class="tbody-dropdown" style="height: 200px; overflow-y:scroll">
                                            <table>
                                                <tbody class="goods-combobox-data">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="btn-icon-dialog icon-arrow-down" style="left:95px;bottom: 3px" comboboxName="goods">
                                <img src="../../Contents/Icons/arrow-down-line.png" />
                            </div>

                            <div class="btn-icon-dialog icon-quick-search" style="left:120px;bottom:3px ">
                                <img src="../../Contents/Images/Quick-search.png">
                            </div>
                        </div>
                        </td>
                    <td class="disabled-cell">  </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                </tr>`;
        $('.new-export-detail-box').append(row);
    }

    /**
     * Hàm xử lý click vào các icon next trang trên bảng phiếu xuất kho
     * @param {any} sender : đối tượng được thực hiện thao tác
     * Createby NMDuy 25/07/2019
     */

    getNextPage(sender){
        var type = sender.data['type'];
        var pageNumber = 1;
        switch (type) {
            case 1:
                $('.input-pagination').val(1);
                $('.icon-arrow-left').addClass('custom-disabled-btn');
                $('.icon-double-arrow-left').addClass('custom-disabled-btn');
                $('.icon-arrow-right').removeClass('custom-disabled-btn');
                $('.icon-double-arrow-right').removeClass('custom-disabled-btn');
                break;
            case 2:
                pageNumber =  parseInt($('.input-pagination').val());
                if(pageNumber - 1 == 1){
                    $('.icon-arrow-left').addClass('custom-disabled-btn');
                    $('.icon-double-arrow-left').addClass('custom-disabled-btn');
                } 
                $('.input-pagination').val(pageNumber-1);
                $('.icon-arrow-right').removeClass('custom-disabled-btn');
                $('.icon-double-arrow-right').removeClass('custom-disabled-btn');
                break;
            case 3:
                pageNumber =  parseInt($('.input-pagination').val());
                if(pageNumber+1 == 10){
                    $('.icon-arrow-right').addClass('custom-disabled-btn');
                    $('.icon-double-arrow-right').addClass('custom-disabled-btn');
                }
                $('.input-pagination').val(pageNumber+1);
                $('.icon-arrow-left').removeClass('custom-disabled-btn');
                $('.icon-double-arrow-left').removeClass('custom-disabled-btn');

                break;
            case 4:
                $('.input-pagination').val(10);
                $('.icon-arrow-left').removeClass('custom-disabled-btn');
                $('.icon-double-arrow-left').removeClass('custom-disabled-btn');
                $('.icon-arrow-right').addClass('custom-disabled-btn');
                $('.icon-double-arrow-right').addClass('custom-disabled-btn');
                break;
            case 5:
                break;
            case 6:
                this.loadData("export-master-table");
            default:
                break;
        }
        
        var pageIndex = $('.input-pagination').val();
        var startRecord = 30*(pageIndex-1)+1;
        var endRecord = 30*pageIndex;
        var recordRange = startRecord + ' - ' + endRecord;
        $('.record-range').html(recordRange);
        this.exportTableData = this.AjaxJS.getExportMasterTableData();
        this.loadData("export-master-table");
    }

    /**
     * Lấy ngày cụ thể khi người dùng chọn khoảng thời gian
     * @param {any} sender : đối tượng được thực hiện thao tác
     * Createby NMDuy 25/07/2019
     */
    onSelectTimeRangeFilter(sender){
        var timeRangeCode = $(sender.currentTarget).attr("caseCode");
        if(timeRangeCode == "12"){
            $("#get-data-from-day-input").val(this.today);
            $("#get-data-to-day-input").val(this.today);
        } else {
            changeDateTimeByCase(timeRangeCode, "#get-data-from-day-input", "#get-data-to-day-input");
        }
    }

    /**
     * Xử lý hiển thị khi lựa chọn mục đích xuất kho là Khác
     * Createby NMDuy 25/07/2019
     */

    onOtherPurposeRadioSelection(){
        $(".cls-other").removeClass("icon-radio-false");
        $(".cls-other").addClass("icon-radio-true");
        $(".cls-pay").removeClass("icon-radio-true");
        $(".cls-pay").addClass("icon-radio-false");
        $(".store-dropdown-list").addClass("custom-disabled-btn");
        this.NewExportReceiptDialog.Dialog.dialog({title: "Thêm phiếu xuất kho khác"});
    }

    /**
     * Xử lý hiển thị khi lựa chọn mục đích xuất kho là Điều chuyển
     * Createby NMDuy 25/07/2019
     */
    onRadioSelection(){
        $(".cls-pay").removeClass("icon-radio-false");
        $(".cls-pay").addClass("icon-radio-true");
        $(".cls-other").removeClass("icon-radio-true");
        $(".cls-other").addClass("icon-radio-false");
        $(".store-dropdown-list").removeClass("custom-disabled-btn");
        this.NewExportReceiptDialog.Dialog.dialog({title: "Thêm phiếu xuất kho điều chuyển"});
    }

   
    /**
     * Hiển thị lại số được format theo dạng tiền
     * @param {any} sender : đối tượng được thực hiện thao tác
     * Createby NMDuy 25/07/2019
     */

    displayCustomNumber(sender) {
        var _this = sender.target;
        var value = $(_this).val();
        if (value) {
            $(_this).val(this.DatafomaterJS.formatToStringNumber(value));
        }
    }

    /**
    * Kiểm tra hợp lệ khi nhập số
    * @param {any} event : đối tượng được thực hiện thao tác
    * Createby NMDuy 25/07/2019
    */

   

    validateNumberInput(event) {
        var key = window.event ? event.keyCode : event.which;
        var value = $(this).val();
        if (event.keyCode === 8 || event.keyCode === 46) {
            return true;
        } else if ((key >= 48 && key <= 57)) {
            return true;
        } else if (key === 45) {
            if (!value.includes('-')) {
            return true;
            } else {
            return false;
            }
        } else {
            return false;
        }
    }

    checkKeyOnComboboxInput(e, target, _this) {
        e = e || window.event;
        var selectedRow;
        var trElementList = $(target).find('tbody').children();

        if (e.keyCode == '38') {
            for (let i = 0; i < trElementList.length; i++) {
                var trItem = $(trElementList)[i];
                if ($(trItem).hasClass('selected-combobox-row')) {
                    if (i > 0) {
                        $(trItem).removeClass('selected-combobox-row');
                        $((trElementList)[i - 1]).addClass('selected-combobox-row');
                        selectedRow = $((trElementList)[i - 1]);
                        $(target).find('.tbody-dropdown').scrollTop((i - 1) * 38);
                        break;
                    }
                }
            }

        }
        else if (e.keyCode == '40') {
            for (let i = 0; i < trElementList.length; i++) {
                var trItem = $(trElementList)[i];
                if ($(trItem).hasClass('selected-combobox-row')) {
                    if (i < trElementList.length - 1) {
                        $(trItem).removeClass('selected-combobox-row');
                        $((trElementList)[i + 1]).addClass('selected-combobox-row');
                        selectedRow = $((trElementList)[i + 1]);
                        $(target).find('.tbody-dropdown').scrollTop((i + 1) * 38);
                        break;
                    }
                }
            }
        }
        else if (e.keyCode == '13') {
            for (let i = 0; i < trElementList.length; i++) {
                var trItem = $(trElementList)[i];
                if ($(trItem).hasClass('selected-combobox-row')) {
                    selectedRow = $((trElementList)[i])
                    if ($(target).hasClass('object')) {
                        _this.onSelectItemOnObjectCombobox(selectedRow);
                        $('.dropdown-content').removeClass('show-hide');
                    } else if ($(target).hasClass('goods')) {
                        _this.onSelectGoodsOnComboBox(selectedRow);
                    }
                }
            }
        } else if (e.keyCode == '9') {
            $('.dropdown-content').removeClass('show-hide');
        }
     }

    /**
     * Kiểm tra số âm gán lại giá trị = 0
     * Createby NMDuy 25/07/2019
     */

    checkNegativeNumber() {
        var value = $(this).val();
        if (value < 0 || value == '' || value.includes('-')) {
            if($(this).hasClass("sum-amount-filter-input")){
                $(this).val("");
            } else {
                $(this).val(0);
            }
        }
    }

    /**
     * Kiểm tra dữ liệu trên form thêm mới phiếu xuất kho khi đóng, hiển thị dialog thông báo
     * Createby NMDuy 25/07/2019
     */

    closeDialog(){
        var objectCodeInput = $(".object-code-input").val().trim();
        var objectNameInput = $(".object-name-input").val().trim();
        var objectAddressInput = $(".object-address-input").val().trim();
        var exportExplainInput = $(".export-explain-input").val().trim();
        var detailTableLenght = $('.new-export-detail-box').children().length;
        if(objectCodeInput != "" || objectNameInput != "" || objectAddressInput != "" || exportExplainInput != "" || detailTableLenght > 1){
            this.DialogSaveData.open();
        } else {
            this.NewExportReceiptDialog.close();
        }
    }

    /**
     * Reset giá trị trên form
     * Createby NMDuy 25/07/2019
     */

    resetNewExportForm(){
        $(".object-code-input").val('');
        $(".object-name-input").val('');
        $(".object-address-input").val('');
        $(".export-explain-input").val('');
        $(".new-export-detail-box").html('');
    }

    /**
     * Xử lý hiển thị trên dialog thông báo với loại tương ứng
     * @param {any} sender : đối tượng được thực hiện thao tác
     * Createby NMDuy 25/07/2019
     */

    notificationDialogHandle(sender){
        var option = sender.data['option'];
        if(option == 1){
            this.DialogSaveData.close();
        } else if(option == 2){
            this.DialogSaveData.close();
            this.NewExportReceiptDialog.close();
        } else {
            var objectCodeInput = $(".object-code-input").val().trim();
            var objectNameInput = $(".object-name-input").val().trim();
            var objectAddressInput = $(".object-address-input").val().trim();
            var exportExplainInput = $(".export-explain-input").val().trim();
            var detailTableLenght = $('.new-export-detail-box').children().length;
            if(objectCodeInput == "" || objectNameInput == "" || objectAddressInput == "" || exportExplainInput == "" || detailTableLenght == 1){
                this.showNotificationDialog('empty-form');
            } else {
                if(this.mode == 'add'){
                    var id = idGenerate();
                    var receiptNumber = $(".receipt-number").val();
                    var receiptDate = $(".export-day-input").val();
                    var receiptTime = $(".export-hour-input").val();
                    var sumMoney = $('.sum-all-amount').html().trim();
                    
                    var receiptType = '';
                    if($(".cls-other").hasClass("icon-radio-true")){
                        receiptType = "Phiếu xuất kho khác";
                    } else {
                        receiptType = "Phiếu xuất kho điều chuyển sang cửa hàng khác";
                    }
                    var newExportReceipt = {
                        id: id,
                        receiptNumber: receiptNumber,
                        receiptDate: receiptDate,
                        receiptTime: receiptTime,
                        receiptType: receiptType,
                        sumMoney: sumMoney,
                        objectCode: objectCodeInput,
                        objectName: objectNameInput,
                        objectAddress: objectAddressInput,
                        exportExplain: exportExplainInput,
                    }

                    this.exportTableData.push(newExportReceipt);
                    this.loadData("export-master-table");

                    var tableLength = $('.new-export-detail-box').children().length;

                    var detailTable = [];
                    for (let i = 0 ; i < tableLength-1; i++){
                        var trElement = $('.new-export-detail-box').children()[i];
                        var rowIndex = $(trElement).attr("rowIndex");
                        var itemCode = $('.item-code-'+rowIndex)[0].innerText;
                        var itemName = $('.item-name-'+rowIndex)[0].innerText;
                        var storePlace = $('.store-place-'+rowIndex)[0].innerText;
                        var countUnit = $('.count-unit-'+rowIndex)[0].innerText;
                        var unitPrice = $('.unit-price-'+rowIndex).val();
                        var amount = $('.amount-'+rowIndex).val();
                        var sumMoney = $('.sumMoney-'+rowIndex).val();

                        var good = {
                            id: id,
                            itemCode: itemCode,
                            itemName: itemName,
                            storePlace: storePlace,
                            countUnit: countUnit,
                            unitPrice: unitPrice,
                            amount: amount,
                            sumMoney: sumMoney
                        }
                        detailTable.push(good);
                    }
                    
                    this.AjaxJS.addReceiptDetailToDataTable(detailTable);
                    this.NewExportReceiptDialog.close();
                    this.receiptNumber += 1;
                } else if(this.mode == 'edit') {
                    this.loadData("export-master-table");
                } else if(this.mode == 'duplicate'){
                    this.loadData("export-master-table");
                }
                this.NewExportReceiptDialog.close();
            }
        }
    }

    /**
     * Hiển thị loại thông báo tương ứng với tham số truyền vào
     * @param {any} type loại thông báo 
     * Createby NMDuy 25/07/2019
     */

    showNotificationDialog(type){
        if(type == 'delete'){
            this.isDeleteItem = true;
            $('.popup-message').html('Bạn có muốn xóa phiếu xuất kho này?');
            
        } else {
            this.isDeleteItem = false
            $('.popup-message').html('Các trường dữ liệu không được để trống, phải có ít nhất một dòng chi tiết!');
        }
        this.NotificationDialog.open();
    }

    /**
     * Xử lý khi người dùng ấn đồng ý trên dialog thông báo 
     * Createby NMDuy 25/07/2019
     */

    confirmDialog(){
        if(this.isDeleteItem){
            var _this = this;
            this.exportTableData = this.exportTableData.filter(function(item){
                return item.id != _this.selectedRowItemId
            })
            this.AjaxJS.detailExportReceipt = this.AjaxJS.detailExportReceipt.filter(function(item){
                return item.id != _this.selectedRowItemId
            })
            this.loadData("export-master-table");
            $('.export-detail-table').html('');
            $('.enable-if-selected').addClass('custom-disabled-btn');
        }
        this.NotificationDialog.close();
        this.DialogSaveData.close();
    }
    
    /**
     * Validate ngày giờ nhập liệu, set thời gian hiện tại hôm nay
     * @param {any} sender : đối tượng thực hiện thao tác
     * Createby NMDuy 25/4/2019
     */
    
    validateTime(sender){
        var type = sender.data['type'];

        if (type == 1) {
            var date = $(sender.target).val();
            if (!checkValidDate(date)) {
                debugger
                 console.log($(this))
                 if ($(sender.target).hasClass('date-filter-input')) {
                    $(sender.target).val('');
                } else {
                    $(sender.target).val(this.today);
                }
            }
            
        } else {
            var hour = $(sender.target).val();
            if(!checkValidTime(hour)){
                $(sender.target).val(getCurrentTime());
            }
        }
    }

    /**
     * Select toàn bộ giá trị trong ô input khi được focus 
     * Createby NMDuy 25/04/2019
     */

    selectAllValue() {
        $(this).select();
    }
}

