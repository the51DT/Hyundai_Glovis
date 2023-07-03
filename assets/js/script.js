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
function vh(){
    const innerHeight = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${innerHeight}px`);
}
vh();

window.addEventListener(`resize`, function() {
    vw();
    vh();
    // document.querySelector(".btm_fixed_section").classList.toggle("active")
});


// dropdown
$(".myPage").click(function(){
    $(".gnb-dropdown").toggleClass("active");
 })