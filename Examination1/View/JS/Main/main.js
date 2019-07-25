$(document).ready(function(){
    mainJS = new MainJS();
    $(document).click(function (e) {
        var container = $(".input-combobox");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            var container2 = $(".icon-arrow-down");
            if (!container2.is(e.target) && container2.has(e.target).length === 0) {
                $(".dropdown-content").removeClass("show-hide");
            }
        }
    });

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
    

    // Hiển thị datepicker chọn ngày chứng từ khi click icon calendar
    $(".export-date-filter-icon").click(function () {
        $("#export-date-filter-input").focus();
    });

    
})

class MainJS {
    constructor(){
        this.AjaxJS = new AjaxJS();
        this.DatabindingJS = new DataBindingJS();
        this.DatafomaterJS = new DataFormaterJS();
        this.NewExportReceiptDialog = new Dialog("Thêm phiếu xuất kho khác", 1000, 700, "dialogNewExport");
        this.DialogSaveData = new Dialog("Dữ liệu chưa được lưu", 400, 'auto', 'dialogSaveDataNotification');
        this.NotificationDialog = new Dialog("MShopKeeper", 400, 'auto', 'dialogNotification');
        this.today = this.getInitialDate();
        this.exportTableData = [];
        this.receiptNumber = 40;
        this.receiptCodeNumber = '';
        this.selectedRowItemId = '';
        this.currentRowIndex = 0;
        this.isDeleteItem = false;
        this.objectComboboxData = [];
        this.goodsComboboxData = [];
        this.InitEvents();
    }

    InitEvents(){
        var _this = this;
        this.exportTableData = this.AjaxJS.getExportMasterTableData();
        this.loadData("export-master-table");
        this.DatafomaterJS.changeDateTimeByCase("3", "#get-data-from-day-input", "#get-data-to-day-input");

        $(document).on("click", "#btnAdd", {type: 'add'}, this.showNewExportReceiptDialog.bind(this));
        $(document).on("click", "#btnEdit", {type: 'edit'}, this.showNewExportReceiptDialog.bind(this));
        $(document).on("click", "#btnCheck", {type: 'check'}, this.showNewExportReceiptDialog.bind(this));
        $(document).on("click", "#btnReturn", {type: 'return'}, this.subToolbarBtnClickHandle.bind(this));
        $(document).on("click", "#btnAddNew", {type: 'addnew'}, this.subToolbarBtnClickHandle.bind(this));
        $(document).on("click", "#btnRepair", {type: 'repair'}, this.subToolbarBtnClickHandle.bind(this));
        $(document).on("click", ".delete-item-btn", this.deleteExportReceipt.bind(this));


        $(document).on("click", ".export-master-table tr", this.onSelectRowOnMasterExportTable.bind(this));
        $(document).on("click", ".goods-combobox-data tr", this.onSelectGoodsOnComboBox.bind(this));
        $(document).on("click", ".cls-other", { mode: 1 }, this.tabs.bind(this));
        $(document).on("click", ".cls-pay", { mode: 2 }, this.tabs.bind(this));
        $(document).on("click", ".time-range-item", this.onSelectTimeRangeFilter.bind(this));
        $(document).on("click", ".icon-arrow-down", this.showCombobox.bind(this));
        $(document).on("keyup", ".input-combobox", this.filterComboboxData.bind(this));
        $(document).on("click", ".dropdown-bootstrap", this.bindBootstrapComboboxData);
        $(document).on("keypress", ".positive-num-input", this.validateNumberInput);
        $(document).on("keyup", ".positive-num-input", this.displayCustomNumber.bind(this));
        $(document).on("focusout", ".positive-num-input", this.checkNegativeNumber);
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

        $(document).on("click", ".object-combobox-data>tr", this.onSelectItemOnObjectCombobox.bind(this));

        $(document).on("click", "#btnClose", this.closeDialog.bind(this));

        $(document).on("click", ".cancel-dialog-btn", {option: 1} , this.notificationDialogHandle.bind(this));
        $(document).on("click", ".not-save-export-btn", {option: 2}, this.notificationDialogHandle.bind(this));
        $(document).on("click", ".save-export-btn", {option: 3}, this.notificationDialogHandle.bind(this));
        $(document).on("click", "#btnSave", {option: 3}, this.notificationDialogHandle.bind(this));
        
        $(document).on("click", ".delete-detail-item-btn", this.deleteDetailItem.bind(this));

        $(document).on("click", ".btn-confirm-dialog", this.confirmDialog.bind(this));


        


        // Gán giá trị được chọn cho ngày chứng từ
        $("#export-date-filter-input").datepicker({
            onSelect: function (dateText) {                
                var date = $(this).val();
                date = formatDate(date);
                $("#export-date-filter-input").val(date);
                _this.getStoreDataFilterByDate(date);
            }
        });

    }

    loadData(tableId){
        var _this = this;
        switch(tableId){
            case "export-master-table":
                var data = this.exportTableData;
                data.sort(function(a,b){
                    var dateA = _this.DatafomaterJS.convertToISODate(a.receiptDate), dateB = _this.DatafomaterJS.convertToISODate(b.receiptDate);
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

    getStoreDataByFilter(sender){
        var _this = this;
        var type = sender.data['type'];
        switch (type) {
            case 1:
                var startDate = $("#get-data-from-day-input").val();
                var endDate = $("#get-data-to-day-input").val();
                startDate = this.DatafomaterJS.convertToISODate(startDate);
                endDate = this.DatafomaterJS.convertToISODate(endDate);
                if(startDate>endDate){
                    alert("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
                } else {
                    var filterData = this.exportTableData.filter(function (item) {
                        var isoDateItem = _this.DatafomaterJS.convertToISODate(item.date);
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
                     && item.object.toLowerCase().includes(objectKeyword.toLowerCase()) 
                     && item.receiptType.toLowerCase().includes(receiptType.toLowerCase()) 
                     && _this.checkValidSumAmountValue(item.sumMoney)
                     && item.note.toLowerCase().includes(noteKeyword.toLowerCase())
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

    getStoreDataFilterByDate(date){
        var _this = this;
        var filterData = this.exportTableData.filter(function (item) {
            if(_this.DatafomaterJS.checkEqualDate(date, item.date)){
                return true;
            }
        });
        this.DatabindingJS.bindDatatoExportMasterTable(filterData);
    }

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

    showNewExportReceiptDialog(sender){
        var type = sender.data['type'];
        $('.toolbar-dialog-item').addClass('custom-disabled-btn');
        this.resetNewExportForm();
        if(type == 'add'){
            this.addNewExportReceipt();
        } else if(type == 'edit'){
           this.editExportReceipt();
        } else if(type == 'check'){
            this.NewExportReceiptDialog.Dialog.dialog({title: "Xem phiếu xuất kho"});
            $('.enable-when-check-btn').removeClass('custom-disabled-btn');
            $('.alway-enable-btn').removeClass('custom-disabled-btn');
            this.bindExportDataToForm(this.selectedRowItemId);
            $(".form-control-input").addClass("custom-disabled-btn");
        }
        this.NewExportReceiptDialog.open();
    }

    addNewExportReceipt(){
        this.NewExportReceiptDialog.Dialog.dialog({title: "Thêm phiếu xuất kho"});
        this.resetNewExportForm();
        $('.new-export-detail-box').html('');
        $('.toolbar-dialog-item').addClass('custom-disabled-btn');
        $(".form-control-input").removeClass("custom-disabled-btn");
        this.currentRowIndex = 0;
        this.objectComboboxData = this.AjaxJS.getComboboxData("object");
        this.goodsComboboxData = this.AjaxJS.getComboboxData("goods");
        this.DatabindingJS.bindingComboboxData("object", this.objectComboboxData);
        this.DatabindingJS.bindingComboboxData("goods", this.goodsComboboxData);
        this.appendEmptyRowToNewExportDetail();
        $('.enable-when-add-btn').removeClass('custom-disabled-btn');
        $('.alway-enable-btn').removeClass('custom-disabled-btn');
        this.receiptCodeNumber = "XK000"+this.receiptNumber;
        $(".receipt-number").val(this.receiptCodeNumber);
        $(".export-day-input").val(this.today);
        $(".export-hour-input").val(this.getCurrentTime());
        $(".object-code-input").focus();
        this.onOtherPurposeRadioSelection();
    }

    editExportReceipt(){
        this.NewExportReceiptDialog.Dialog.dialog({title: "Sửa phiếu xuất kho"});
        $('.enable-when-edit-btn').removeClass('custom-disabled-btn');
        $(".form-control-input").removeClass("custom-disabled-btn");
        $('.alway-enable-btn').removeClass('custom-disabled-btn');
        this.bindExportDataToForm(this.selectedRowItemId);
        this.appendEmptyRowToNewExportDetail();
    }

    deleteExportReceipt(){
        this.showNotificationDialog('delete');
    }

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

    onSelectItemOnObjectCombobox(sender){
        var objectName = $(sender.currentTarget).children()[1].innerHTML;
        var objectCode = $(sender.currentTarget).children()[0].innerHTML;
        var objectAddress = $(sender.currentTarget).attr("objectAddress");
        $('.object-code-input').val(objectCode);
        $('.object-name-input').val(objectName);
        $('.object-address-input').val(objectAddress);
    }



    showCombobox(sender){
        var comboboxName = $(sender.currentTarget).attr("comboboxName");
        $('input[inputCombobox='+comboboxName+']').focus();
        if(comboboxName == "goods"){
            this.DatabindingJS.bindingComboboxData("goods", this.goodsComboboxData);
        }
        console.log(comboboxName);
        if ($('.' + comboboxName).hasClass('show-hide')) {
            $('.dropdown-content').removeClass("show-hide");
        } else {
            $('.dropdown-content').removeClass("show-hide");
            $('.' + comboboxName).addClass('show-hide');
        }
    }

    tabs(sender) {
        var mode = sender.data["mode"];
        if (mode == 1) {

            this.onOtherPurposeRadioSelection();
            

        }
        if (mode == 2) {
            this.onRadioSelection();
        }
    }

    
    filterComboboxData(sender) {
        var inputName = $(sender.target).attr("inputCombobox");

        // if (inputName == 'repayment-customer') {
        //     var dataTable = $('.' + inputName + '-data').find('tr').length;
        //     if (dataTable != 0) {
        //         $('.' + inputName + '-data').html('');
        //     }
        //     $('.repayment-amount').val(0);
        // }

        var keyword = $('input[inputCombobox=' + inputName + ']').val();

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
                    $('.goods').addClass('show-hide');
                    this.DatabindingJS.bindingComboboxData("goods", filterData);
                }
                break;
        }
    }

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

    onChangeCalculateValue(sender){
        var index = $(sender.currentTarget).attr("index");
        var mode = sender.data['mode'];
        if(mode == 1){
            this.calculateSumMoney(index);
        } else {
            this.calculateUnitPrice(index);
        }
    }


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
    }

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
    }

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

    deleteDetailItem(sender){
        var rowIndex = $(sender.currentTarget).attr("rowIndex");
        $('.garbage-icon[rowIndex='+rowIndex+']').closest('tr').remove()
   
    }

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

    onSelectGoodsOnComboBox(sender){
        this.currentRowIndex += 1;
        var ele = $(sender.currentTarget);
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
    }

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

    onSelectTimeRangeFilter(sender){
        var timeRangeCode = $(sender.currentTarget).attr("caseCode");
        if(timeRangeCode == "12"){
            $("#get-data-from-day-input").val(this.today);
            $("#get-data-to-day-input").val(this.today);
        } else {
        }
        this.DatafomaterJS.changeDateTimeByCase(timeRangeCode, "#get-data-from-day-input", "#get-data-to-day-input");
    }

    onOtherPurposeRadioSelection(){
        $(".cls-other").removeClass("icon-radio-false");
        $(".cls-other").addClass("icon-radio-true");
        $(".cls-pay").removeClass("icon-radio-true");
        $(".cls-pay").addClass("icon-radio-false");
        $(".store-dropdown-list").addClass("custom-disabled-btn");
        this.NewExportReceiptDialog.Dialog.dialog({title: "Thêm phiếu xuất kho khác"});

    }

    onRadioSelection(){
        $(".cls-pay").removeClass("icon-radio-false");
        $(".cls-pay").addClass("icon-radio-true");
        $(".cls-other").removeClass("icon-radio-true");
        $(".cls-other").addClass("icon-radio-false");
        $(".store-dropdown-list").removeClass("custom-disabled-btn");
        this.NewExportReceiptDialog.Dialog.dialog({title: "Thêm phiếu xuất kho điều chuyển"});


    }

    getInitialDate() {
        var toDay = new Date();
        this.today = this.DatafomaterJS.formatDate(toDay)
        return this.today;
    }

    getCurrentTime(){
        var now = new Date();
        var currentTime = now.getHours() + ":" + now.getMinutes();
        return currentTime;
    }

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

    displayCustomNumber(sender) {
        var _this = sender.target;
        var value = $(_this).val();
        if (value) {
            $(_this).val(this.DatafomaterJS.formatToStringNumber(value));
        }
    }

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

    resetNewExportForm(){
        $(".object-code-input").val('');
        $(".object-name-input").val('');
        $(".object-address-input").val('');
        $(".export-explain-input").val('');
        $(".new-export-detail-box").html('');

    }

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
                this.DialogCheckEmpty.open();
            } else {
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
            }
        }
    }

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
        this.NewExportReceiptDialog.close();
    }

}

function idGenerate(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}