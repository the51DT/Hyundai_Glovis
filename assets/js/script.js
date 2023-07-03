// vw
function vw(){
    const innerWidth = window.innerWidth;
    if(innerWidth <= 1920){
        document.documentElement.style.setProperty('--vw', `1920`);
    } if(innerWidth <= 1600){
        document.documentElement.style.setProperty('--vw', `1600`);
    } if(innerWidth <= 1200){
        document.documentElement.style.setProperty('--vw', `1200`);
    } else if(1920 < innerWidth){
        document.documentElement.style.setProperty('--vw', `${innerWidth}`);
    }
}
vw();

window.addEventListener(`resize`, function() {
  vw();
});


// dropdown
$(".myPage").click(function(){
    $(".gnb-dropdown").toggleClass("active");
 })