$(document).ready(function(){
    $(".master-tbl-note-item").css({
        'width': ($(".master-tbl-note").width()+10 + 'px')
    });
    
    $(".master-tbl-note-bottom-cell").css({
        'width': ($(".master-tbl-note").width()+10 + 'px')
    });
    
    window.onresize = function(event) {
    
        $(".master-tbl-note-item").css({
            'width': ($(".master-tbl-note").width()+10 + 'px')
        });
        
        $(".master-tbl-note-bottom-cell").css({
            'width': ($(".master-tbl-note").width()+10 + 'px')
        });
    };
})
