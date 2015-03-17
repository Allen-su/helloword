;(function($){
    //选项卡插件
    $.fn.tabs = function(control, defautOpenItem){
        var element = $(this);
        control = $(control);
        //遍历选项卡名称
        element.on('click', 'li', function(){
           var tabName = $(this).attr('data-tab');
           element.trigger('change:tabs',tabName);//触发
           return false;
        });
        //绑定自定义事件
        element.bind('change:tabs', function(e,tabName){
            element.find('li').removeClass('active');
            element.find('[data-tab="'+tabName+'"]').addClass('active');
        });
        element.bind('change:tabs', function(e,tabName){
            control.find('[data-tab]').removeClass('active');
            control.find('[data-tab="'+tabName+'"]').addClass('active');
        });
        defautOpenItem = parseInt(defautOpenItem, 10);
        if ( defautOpenItem >= 0) {
            var firstName = element.find('li').eq(0).attr('data-tab');
            element.trigger('change:tabs',firstName);
        }
    };


})(Zepto);