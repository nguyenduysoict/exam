$(document).ready(function(){
    mainJS = new MainJS();
})

class MainJS {
    constructor(){
        this.AjaxJS = new AjaxJS();
        this.DatabindingJS = new DataBindingJS();
        this.DatafomaterJS = new DataFormaterJS()
        this.InitEvents();
    }

    InitEvents(){
        this.loadData("export-master-table");
        $(document).on("click", ".export-master-table tr", this.showDetailExportReceipt.bind(this))

    }

    loadData(tableId){
        switch(tableId){
            case "export-master-table":
                var data = this.AjaxJS.getExportMasterTableData();
                this.DatabindingJS.bindDatatoExportMasterTable(data);

        }
    }

    showDetailExportReceipt(sender){
        $('.export-detail-table').html('');
        var exportReceiptCode = $(sender.currentTarget).attr("receiptCode");
        var detailExportReceipt = this.AjaxJS.getDetailExportReceipt(exportReceiptCode);
        this.DatabindingJS.bindDetailExportReceiptData(detailExportReceipt);

    }

}