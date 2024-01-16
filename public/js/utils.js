!function(e){e(["jquery"],function(e){return function(){var t,n,s,o=0,i={error:"error",info:"info",success:"success",warning:"warning"},a={clear:function(n,s){var o=u();t||r(o);l(n,o,s)||function(n){for(var s=t.children(),o=s.length-1;o>=0;o--)l(e(s[o]),n)}(o)},remove:function(n){var s=u();t||r(s);if(n&&0===e(":focus",n).length)return void p(n);t.children().length&&t.remove()},error:function(e,t,n){return d({type:i.error,iconClass:u().iconClasses.error,message:e,optionsOverride:n,title:t})},getContainer:r,info:function(e,t,n){return d({type:i.info,iconClass:u().iconClasses.info,message:e,optionsOverride:n,title:t})},options:{},subscribe:function(e){n=e},success:function(e,t,n){return d({type:i.success,iconClass:u().iconClasses.success,message:e,optionsOverride:n,title:t})},version:"2.1.4",warning:function(e,t,n){return d({type:i.warning,iconClass:u().iconClasses.warning,message:e,optionsOverride:n,title:t})}};return a;function r(n,s){return n||(n=u()),(t=e("#"+n.containerId)).length?t:(s&&(t=function(n){return(t=e("<div/>").attr("id",n.containerId).addClass(n.positionClass)).appendTo(e(n.target)),t}(n)),t)}function l(t,n,s){var o=!(!s||!s.force)&&s.force;return!(!t||!o&&0!==e(":focus",t).length)&&(t[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){p(t)}}),!0)}function c(e){n&&n(e)}function d(n){var i=u(),a=n.iconClass||i.iconClass;if(void 0!==n.optionsOverride&&(i=e.extend(i,n.optionsOverride),a=n.optionsOverride.iconClass||a),!function(e,t){if(e.preventDuplicates){if(t.message===s)return!0;s=t.message}return!1}(i,n)){o++,t=r(i,!0);var l=null,d=e("<div/>"),f=e("<div/>"),g=e("<div/>"),m=e("<div/>"),h=e(i.closeHtml),v={intervalId:null,hideEta:null,maxHideTime:null},C={toastId:o,state:"visible",startTime:new Date,options:i,map:n};return n.iconClass&&d.addClass(i.toastClass).addClass(a),function(){if(n.title){var e=n.title;i.escapeHtml&&(e=w(n.title)),f.append(e).addClass(i.titleClass),d.append(f)}}(),function(){if(n.message){var e=n.message;i.escapeHtml&&(e=w(n.message)),g.append(e).addClass(i.messageClass),d.append(g)}}(),i.closeButton&&(h.addClass(i.closeClass).attr("role","button"),d.prepend(h)),i.progressBar&&(m.addClass(i.progressClass),d.prepend(m)),i.rtl&&d.addClass("rtl"),i.newestOnTop?t.prepend(d):t.append(d),function(){var e="";switch(n.iconClass){case"toast-success":case"toast-info":e="polite";break;default:e="assertive"}d.attr("aria-live",e)}(),d.hide(),d[i.showMethod]({duration:i.showDuration,easing:i.showEasing,complete:i.onShown}),i.timeOut>0&&(l=setTimeout(T,i.timeOut),v.maxHideTime=parseFloat(i.timeOut),v.hideEta=(new Date).getTime()+v.maxHideTime,i.progressBar&&(v.intervalId=setInterval(D,10))),function(){i.closeOnHover&&d.hover(b,O);!i.onclick&&i.tapToDismiss&&d.click(T);i.closeButton&&h&&h.click(function(e){e.stopPropagation?e.stopPropagation():void 0!==e.cancelBubble&&!0!==e.cancelBubble&&(e.cancelBubble=!0),i.onCloseClick&&i.onCloseClick(e),T(!0)});i.onclick&&d.click(function(e){i.onclick(e),T()})}(),c(C),i.debug&&console&&console.log(C),d}function w(e){return null==e&&(e=""),e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function T(t){var n=t&&!1!==i.closeMethod?i.closeMethod:i.hideMethod,s=t&&!1!==i.closeDuration?i.closeDuration:i.hideDuration,o=t&&!1!==i.closeEasing?i.closeEasing:i.hideEasing;if(!e(":focus",d).length||t)return clearTimeout(v.intervalId),d[n]({duration:s,easing:o,complete:function(){p(d),clearTimeout(l),i.onHidden&&"hidden"!==C.state&&i.onHidden(),C.state="hidden",C.endTime=new Date,c(C)}})}function O(){(i.timeOut>0||i.extendedTimeOut>0)&&(l=setTimeout(T,i.extendedTimeOut),v.maxHideTime=parseFloat(i.extendedTimeOut),v.hideEta=(new Date).getTime()+v.maxHideTime)}function b(){clearTimeout(l),v.hideEta=0,d.stop(!0,!0)[i.showMethod]({duration:i.showDuration,easing:i.showEasing})}function D(){var e=(v.hideEta-(new Date).getTime())/v.maxHideTime*100;m.width(e+"%")}}function u(){return e.extend({},{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,closeMethod:!1,closeDuration:!1,closeEasing:!1,closeOnHover:!0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",escapeHtml:!1,target:"body",closeHtml:'<button type="button">&times;</button>',closeClass:"toast-close-button",newestOnTop:!0,preventDuplicates:!1,progressBar:!1,progressClass:"toast-progress",rtl:!1},a.options)}function p(e){t||(t=r()),e.is(":visible")||(e.remove(),e=null,0===t.children().length&&(t.remove(),s=void 0))}}()})}("function"==typeof define&&define.amd?define:function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):window.toastr=t(window.jQuery)});
$('.Home-wrapper, .profile-wrapper').on("click", ".card-icon", function() {
    var $this = $(this);var postLink = $this.attr("data-permlink");var postAuthor = $this.attr("data-author");$this.addClass('hov_ani');
    $.ajax({ type: "POST",url: "/upvote", data: {author: postAuthor, postLink: postLink}, success: function(data) {
        if (data.error == false) {$this.removeClass('hov_ani');$this.addClass('hov_done');
            $this.parent().find('.card-icon-value').css("color", "#e0245e").html(data.likes);
            if(data.income>0){postIncome=((data.income)/1000000).toString()}else{postIncome=0}
            $this.closest('.likes_section').find('.post-income').html(postIncome);toastr['success']("Upvoted Successfully!");
        } else { $this.removeClass('hov_ani');toastr['error'](data.message);return false}} 
    });
});

$('.btn_follow_catg').click(function() { let $this=$(this);var catgName = $(this).attr("data-catg");$(this).html('Following...').attr("disabled", true); $.ajax({url: '/followCatg',type: 'POST',data: JSON.stringify({ catgName: catgName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {$this.html('Following').attr("disabled", true);;toastr['success']("Category Subscribed Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$this.html('Follow').attr("disabled", false);return false} } }); });
$('.btn_unfollow_catg').click(function() { let $this=$(this);var catgName = $(this).attr("data-catg");$(this).html('UNFollowing...').attr("disabled", true); $.ajax({url: '/unfollowCatg',type: 'POST',data: JSON.stringify({ catgName: catgName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {$this.html('Follow').attr("disabled", true);;toastr['success']("UNFollowed Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$this.html('Following').attr("disabled", false);return false} } }); });
$(".back_btn").click(function (){window.history.back();});
$("#main_login_btn").click(function (){window.location.href = '/welcome';});
$(".stk_page").click(function (){window.open('https://tmac.finance/staking', '_blank')});
$(".farm_page").click(function (){window.open('https://tipmeacoffee.help', '_blank')});
$('#logout_btn, #logout_btn_inn').click(function(){
    $.ajax({type: 'POST',data: JSON.stringify({}),contentType: 'application/json',url: '/logout',            
        success: function(data) { if (data.error == false) {toastr['success']("Logout Success");setTimeout(function(){window.location.href = '/';}, 40); } else {toastr['error'](data.message);return false;} } })
})
$('.btn_app_wit').click(function() {var nodeName = $(this).attr("data-node");$(this).closest("tr").find(".btn_txt_app").html('Approving..');$.ajax({url: '/witup',type: 'POST',data: JSON.stringify({ nodeName: nodeName }),contentType: 'application/json', success: function(data)  {if (data.error == false) {toastr['success']("Approved Successfully!");setTimeout(function(){window.location.reload();}, 300);} else {toastr['error'](data.message);$(this).closest("tr").find(".btn_txt_app").html('Approve');return false}} });});
$('.btn_unapp_wit').click(function() {var nodeName = $(this).attr("data-node");$(this).closest("tr").find(".btn_txt_unapp").html('...');$.ajax({url: '/witunup',type: 'POST',data: JSON.stringify({ nodeName: nodeName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("UnApproved Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(this).closest("tr").find(".btn_txt_unapp").html('unapprove');return false} } });});
const show_categories = () => {$('#explore_cat_trends').hide();$('#explore_trends').removeClass('activeTab'); $('#explore_cat_content').show();$('#explore_categories').addClass('activeTab'); }
const show_trends = () => {$('#explore_cat_content').hide();$('#explore_categories').removeClass('activeTab'); $('#explore_cat_trends').show();$('#explore_trends').addClass('activeTab');}
$('#explore_categories, #sidebar_categories').click(function() {show_categories();});
$('#explore_trends, sidebar_trends').click(function() {show_trends();});
$('#moremenu').click(function() { $('.more-menu-background').toggle();});
$('#uiModeChange').on('click', function(){ $('body').toggleClass('dark_mode'); })
let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.getElementById('uiModeChange');
const enableDarkMode = ()=>{ document.querySelector('body').classList.add('dark_mode'); localStorage.setItem('darkMode', 'enabled')}
const disableDarkMode = ()=>{ document.querySelector('body').classList.remove('dark_mode'); localStorage.setItem('darkMode',null) }
if(darkMode === 'enabled') {enableDarkMode();}
darkModeToggle.addEventListener('click', ()=> { darkMode = localStorage.getItem('darkMode'); if(darkMode !== 'enabled') { enableDarkMode(); } else { disableDarkMode() } })
switch(nav_val){case"home":case"wallet":case"notic":case"feed":case"profile":case"reward":case"staking":case"mining":case"witnesses":case"explorer":case"help":var item;(item=document.getElementById(nav_val)).classList.add("active-Nav")}
let trimString = function (string, length) {return string.length > length ? string.substring(0, length) : string;};

$('form').on('submit', function(event) {
    event.preventDefault();
});
$('.rnav-ask').on('click', function() {
    let rnav_input_ask = $("#rnav_ask_field").val().trim();  
    if (!rnav_input_ask){ $("#rnav_ask_field").css("border-color", "RED");toastr.error('phew... You forgot to ask question');return false;}
    window.location.href = '/ask?query=' + encodeURIComponent(rnav_input_ask);
})
