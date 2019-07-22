//Khởi tạo dialog với title và width
//Created by: NMDuy (9/7/19)

class Dialog {
    constructor(title, width, height, dialogName) {
        this.Dialog = $('.' + dialogName).dialog({
            width: width,
            height: height,
            fluid: true,
            autoOpen: true,
            title: title,
            modal: true,
            resizable: false
        });
    }

    open() {
        this.Dialog.dialog("open");
    }

    close() {
        this.Dialog.dialog("close");
    }
}