class DataBindingJS {
    constructor() {
    }

    bindDatatoExportMasterTable(data){
        $(".export-master-table").html("");
        for(let i = 0;i<data.length;i++){
            if(i%2 == 0){
                var row = `<tr class="f5f5f5-background" id="${data[i].id}">
                            <td class="text-align-center width-170">${data[i].receiptDate}</td>
                            <td class=" width-230">${data[i].receiptNumber}</td>
                            <td class=" width-250">${data[i].objectName}</td>
                            <td class=" width-170 text-align-right">${data[i].sumMoney}</td>
                            <td class="">${data[i].exportExplain}</td>
                            <td class=" width-368">${data[i].receiptType}</td>
                        </tr>`;
            } else{
                var row = `<tr id="${data[i].id}">
                            <td class="text-align-center width-170">${data[i].receiptDate}</td>
                            <td class=" width-230">${data[i].receiptNumber}</td>
                            <td class=" width-250">${data[i].objectName}</td>
                            <td class=" width-170 text-align-right">${data[i].sumMoney}</td>
                            <td class="">${data[i].exportExplain}</td>
                            <td class=" width-368">${data[i].receiptType}</td>
                        </tr>`;
            }
            $('.export-master-table').append(row);
        }

        $("#sumMoneyMasterTable").html("53.000.000");
    }

    bindDetailExportReceiptData(data){
        $.each(data, function (index, item) {
            var row = `<tr>
                        <td>${item.itemCode}</td>
                        <td>${item.itemName}</td>
                        <td>${item.storePlace}</td>
                        <td>${item.countUnit}</td>
                        <td class="text-align-right">${item.unitPrice}</td>
                        <td class="text-align-right">${item.amount}</td>
                        <td class="text-align-right">${item.sumMoney}</td>
                    </tr>`;
            $('.export-detail-table').append(row);
        })
    }

    bindNewExportDetailData(){
        var row = `<tr>
                        <td>AKK12312321</td>
                        <td>Áo khoác kaki nam</td>
                        <td> Chi nhánh Cầu Giấy </td>
                        <td>Chiếc</td>
                        <td>
                            2
                        </td>
                        <td>
                            350.000
                        </td>
                        <td>
                            700.000
                        </td>
                        <td><div class="garbage-icon"></div></td>
                    </tr>`
    }

    bindingComboboxData(comboboxName, comboboxData) {
        switch (comboboxName) {
            case "object":
                comboboxData = comboboxData.sort(function(a, b){
                    var fullNameA = a.name.split(" ");
                    var firstNameA = fullNameA[fullNameA.length - 1];
                    var fullNameB = b.name.split(" ");
                    var firstNameB = fullNameB[fullNameB.length - 1];
                    if(firstNameA < firstNameB ) return -1;
                    if(firstNameA > firstNameB ) return 1;
                    if(firstNameA == firstNameB) {
                        if(a.objectTypeOrder > b.objectTypeOrder){
                            return -1;
                        } else if(a.objectTypeOrder < b.objectTypeOrder){
                            return 1;
                        } else {
                            if(a.code>b.code){
                                return 1;
                            } else {
                                return -1;
                            }
                        }
                    }
                    return 0;
                })
                $(".object-combobox-data").html('');
                $.each(comboboxData, function (index, item) {
                    var row = `<tr customerRepaymentId="${item.id}" objectAddress="${item.address}" customerCode="${item.code}"> <td width="130px">${item.code}</td> <td width="250px" class="center-td">${item.name}</td> <td width="150px">${item.type}</td></tr >`;
                    $(".object-combobox-data").append(row);
                })
                $(".object-combobox-data").children().first().addClass('first-row-dropdown');
                break;

            case "goods":
                $(".goods-combobox-data").html('');
                $.each(comboboxData, function (index, item) {
                    var row = `<tr itemCode="${item.itemCode}" itemName="${item.itemName}" storePlace="${item.storePlace}" countUnit="${item.countUnit}" unitPrice="${item.unitPrice}" amount="${item.amount}" sumMoney="${item.sumMoney}">
                        <td width="130px">${item.itemCode}</td> <td width="250px" class="center-td">${item.itemName}</td>
                     </tr >`;
                    $(".goods-combobox-data").append(row);
                })
                $(".goods-combobox-data").children().first().addClass('first-row-dropdown');
                break;
        }
    }

    // bindRepaymentDocument(repaymentDocument) {
    //     let _this = this;
    //     $(".repayment-customer-data").html('');
    //     $.each(repaymentDocument, function (index, item) {
    //         var row = `'<tr><td class="first-cell-in-row" width= "41px" ><div style="padding-left: 4px"> <div class="custom-checkbox repayment-checkbox-item uncheck-status" checkboxIndex="${index}"></div> </div> </td>
    //             <td class="disabled-cell-backcolor text-align-center recorded-date" width="129px"> ${_this.formatDate(item.RecordedDate)} </td>
    //             <td class="disabled-cell-backcolor record-number" width="159px"> ${item.RecordNumber} </td>
    //             <td class="disabled-cell-backcolor text-align-right must-get-amount must-get-amount-${index}" width="202px"> ${_this.formatNumber(item.GetAmount)} </td>
    //             <td class="disabled-cell-backcolor text-align-right not-get-amount not-get-amount-${index}" width="140px"> ${_this.formatNumber(item.NotGetAmount)} </td>
    //             <td class="last-cell-in-row text-align-right amount" width="139px"> <input type="text" class="text-align-right number-input positive-num-input amount-${index}" value="0"/> <div class="up-down-arrow"> <div class="amount-arrow arrow-up"></div> <div class="amount-arrow arrow-down"></div> </div> </td></tr > '`;
    //         $(".repayment-customer-data").append(row);
    //     })
    // }

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

    formatNumber(number) {
        var value = number.toString();
        if (value) {
            var plain = value.split('.').join('');
            var reversed = plain.split('').reverse().join('');
            var reversedWithDots = reversed.match(/.{1,3}/g).join('.');
            var normal = reversedWithDots.split('').reverse().join('');
            return normal;
        }
    }
}