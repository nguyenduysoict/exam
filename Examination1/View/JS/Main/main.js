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
})

class MainJS {
    constructor(){
        this.AjaxJS = new AjaxJS();
        this.DatabindingJS = new DataBindingJS();
        this.DatafomaterJS = new DataFormaterJS();
        this.NewExportReceiptDialog = new Dialog("Thêm phiếu xuất kho khác", 1000, 700, "dialogNewExport");
        this.today = this.getInitialDate();
        this.InitEvents();
        this.receiptNumber = '';
        this.objectComboboxData = [];
        this.goodsComboboxData = [];
        this.lastStorePlace = '';
    }

    InitEvents(){
        this.loadData("export-master-table");
        this.DatafomaterJS.changeDateTimeByCase("3", "#get-data-from-day-input", "#get-data-to-day-input");
        $("#btnAdd").click(this.showNewExportReceiptDialog.bind(this))
        $(document).on("click", ".export-master-table tr", this.showDetailExportReceipt.bind(this));
        $(document).on("click", ".goods-combobox-data tr", this.onSelectGoodsOnComboBox.bind(this));
        $(document).on("click", ".cls-other", { mode: 1 }, this.tabs.bind(this));
        $(document).on("click", ".cls-pay", { mode: 2 }, this.tabs.bind(this));
        $(document).on("click", ".time-range", this.onSelectTimeRangeFilter.bind(this));
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
    }

    loadData(tableId){
        var _this = this;
        switch(tableId){
            case "export-master-table":
                var data = this.AjaxJS.getExportMasterTableData();
                data.sort(function(a,b){
                    var dateA = _this.DatafomaterJS.convertToISODate(a.date), dateB = _this.DatafomaterJS.convertToISODate(b.date);
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

    showDetailExportReceipt(sender){
        $('.export-detail-table').html('');
        var exportReceiptCode = $(sender.currentTarget).attr("receiptCode");
        var detailExportReceipt = this.AjaxJS.getDetailExportReceipt(exportReceiptCode);
        this.DatabindingJS.bindDetailExportReceiptData(detailExportReceipt);
    }

    showNewExportReceiptDialog(){
        this.receiptNumber = this.AjaxJS.getReceiptNumber();
        this.objectComboboxData = this.AjaxJS.getComboboxData("object");
        this.goodsComboboxData = this.AjaxJS.getComboboxData("goods");
        this.DatabindingJS.bindingComboboxData("object", this.objectComboboxData);
        this.DatabindingJS.bindingComboboxData("goods", this.goodsComboboxData);
        this.lastStorePlace = '';
        $('.new-export-detail-box').html('');
        this.appendEmptyRowToNewExportDetail();

        $(".receipt-number").val(this.receiptNumber);

        $(".export-day-input").val(this.today);

        this.NewExportReceiptDialog.open();
        this.onOtherPurposeRadioSelection();
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
            // this.resetNewReceiptForm();
            this.onOtherPurposeRadioSelection();

        }
        if (mode == 2) {
            this.onRadioSelection();
            // this.resetNewReceiptForm();
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
            var sumAmount = this.DatafomaterJS.formatToIntNumber($('.sumMoney-'+i).val());
            sumAllAmount+=sumAmount;
        }
        debugger
        sumAllAmount = this.DatafomaterJS.formatToStringNumber(sumAllAmount);
        $('.sum-all-amount').html(sumAllAmount);
    }

    bindBootstrapComboboxData(){
        var value = this.innerText;
        var dropdownName = $(this).attr("dropdownName");
        $('.'+dropdownName).html(value);
    }

    onSelectGoodsOnComboBox(sender){
        var ele = $(sender.currentTarget);
        var itemCode = ele.attr("itemCode");
        var itemName = ele.attr("itemName");
        var storePlace = ele.attr("storePlace");
        var countUnit = ele.attr("countUnit");
        var unitPrice = ele.attr("unitPrice");
        var amount = ele.attr("amount");
        var sumMoney = ele.attr("sumMoney");

        var good = {
            itemCode: itemCode,
            itemName: itemName,
            storePlace: storePlace,
            countUnit: countUnit,
            unitPrice: unitPrice,
            amount: amount,
            sumMoney: sumMoney
        }

        var lastRowIndex = $('.new-export-detail-box').children().length;
        $('.new-export-detail-box').children()[lastRowIndex-1].remove();
        
        this.appendNewRowToNewExportDetailTable(good);
        this.appendEmptyRowToNewExportDetail();

        var rowCount = lastRowIndex;

        $('.row-count').html("Số dòng = "+rowCount);
        debugger
        this.calculateSumAllAmount();
        
    }

    appendNewRowToNewExportDetailTable(data){
        if(!this.lastStorePlace){
            this.lastStorePlace = data.storePlace;
        } else {
            data.storePlace = this.lastStorePlace;
        }

        var rowIndex = $('.new-export-detail-box').children().length;
        
        var sumMoney = this.DatafomaterJS.formatToIntNumber(data.unitPrice)*data.amount;

        sumMoney = this.DatafomaterJS.formatToStringNumber(sumMoney);

        var row = 
                `<tr class="no-padding-data-row">
                    <td> <div class="data-cell"> ${data.itemCode} <div> </td>
                    <td class="disabled-cell"> <div class="data-cell">  ${data.itemName}</div> </td>
                    <td>
                        <div class="dropdown">
                            <div class="dropdown-toggle store-place-dropdown" data-toggle="dropdown">
                                    <span class="store-place-in-table-${rowIndex}"> ${data.storePlace} </span>
                                    <div class="add-arrow-down-icon">
                                            <i class="fa fa-caret-down icon-dropdown"></i>
                                    </div>
                            </div>
                            <ul class="dropdown-menu time-filter-selection" role="menu" aria-labelledby="menu1">
                                <li dropdownName="store-place-in-table-${rowIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Cầu Giấy</a></li>
                                <li dropdownName="store-place-in-table-${rowIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Duy Tân</a></li>
                                <li dropdownName="store-place-in-table-${rowIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Bưởi</a></li>
                                <li dropdownName="store-place-in-table-${rowIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Phạm Hùng</a></li>
                                <li dropdownName="store-place-in-table-${rowIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Nhổn</a></li>
                                <li dropdownName="store-place-in-table-${rowIndex}" class="dropdown-bootstrap"><a role="menuitem" tabindex="-1" href="#">Chi nhánh Mỹ Đình</a></li>
                            </ul> 
                        </div>
                    </td>
                    <td> <div class="data-cell"> ${data.countUnit}  </div></td>
                    <td>
                        <div>
                            <input class="input-inside-cell positive-num-input text-align-right unit-price unit-price-${rowIndex}" index="${rowIndex}" style="width: 100px" value= "${data.unitPrice }" type="text">
                        </div>
                    </td>
                    <td>
                        <div style="display:flex">
                            <input class="input-inside-cell positive-num-input text-align-center amount amount-${rowIndex}" index="${rowIndex}" style="width: 80px" value="${data.amount}" type="text">
                            <div class="up-down-arrow"> <div class="amount-arrow arrow-up" amountItem="amount-${rowIndex}"></div> <div class="amount-arrow arrow-down" amountItem="amount-${rowIndex}"></div> </div>
                        </div>
                    </td>
                    <td>
                        <div>
                            <input class="input-inside-cell positive-num-input text-align-right sum-money sumMoney-${rowIndex}" index="${rowIndex}" style="width: 100px" value= "${ sumMoney }" type="text">
                        </div>
                    </td>
                    <td>
                        <div class="garbage-icon"></div>
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

    onSelectTimeRangeFilter(sender){
        var timeRangeCode = $(sender.currentTarget).attr("caseCode");
        this.DatafomaterJS.changeDateTimeByCase(timeRangeCode, "#get-data-from-day-input", "#get-data-to-day-input");
    }

    onOtherPurposeRadioSelection(){
        $(".cls-other").removeClass("icon-radio-false");
        $(".cls-other").addClass("icon-radio-true");
        $(".cls-pay").removeClass("icon-radio-true");
        $(".cls-pay").addClass("icon-radio-false");
    }

    onRadioSelection(){
        $(".cls-pay").removeClass("icon-radio-false");
        $(".cls-pay").addClass("icon-radio-true");
        $(".cls-other").removeClass("icon-radio-true");
        $(".cls-other").addClass("icon-radio-false");
    }

    getInitialDate() {
        var toDay = new Date();
        this.today = this.DatafomaterJS.formatDate(toDay)
        return this.today;
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
            $(this).val(0);
        }
    }

}