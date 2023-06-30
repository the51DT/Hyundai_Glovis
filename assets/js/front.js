$(()=>{
    _front.init();
})

const _front = {
    init: function(){
        _front.vh();
        _front.tab();
        _front.accordion();
        _front.select();
        
        $(window).on("resize", function(){ _front.vh() })

        $(document).on("click", "a[href='#'], a[href='#none']", function(e){ e.preventDefault() });
    },
    vh: function(){
        const innerHeight = window.innerHeight;
        document.documentElement.style.setProperty('--vh', `${innerHeight}px`);
    },
    /**
     * html, body에 no_scroll 클래스 부여, 해제
     * @param {*} number [0, 1] 0:no_Scroll, 1:no_Scroll 해제
     */
    noScroll:function(type){
        if(type){
            $("html, body").removeClass("no_scroll");
        } else {
            $("html, body").addClass("no_scroll");
        }
    },
    tab: function(){
        const tabGroups = document.querySelectorAll('[data-role="tab"]');
        if( tabGroups.length < 1 ){ return }

        let currentTarget, targetTabWrap, targetTabListWrap, targetPanelWrap;
        // 이벤트 타겟 변수 설정
        const init = (e) => {
            currentTarget = e.target.tagName;
            currentTarget === "BUTTON" || "A"
                ? (currentTarget = e.target)
                : (currentTarget =
                    e.target.closest("button") || e.target.closest("a"));
            targetTabWrap = currentTarget.closest('[data-role="tab"]');
            targetTabListWrap = targetTabWrap.querySelector('[role="tablist"]');
            targetPanelWrap = targetTabWrap.querySelector(".wrap-tab-contents");
        };
        // 클릭 이벤트
        const tabClickEvt = (e) => {
            init(e);
            // if (currentTarget.ariaSelected === "false") {
            if(currentTarget.getAttribute("aria-selected")){
                tabRemoveEvt(targetTabListWrap, targetPanelWrap);   // 미선택된 탭 속성 false 상태로 만들기
                tabAddEvt(currentTarget, targetTabWrap);            // 선택 된 탭 속성 true 상태로 만들기
            }
        };
        // 키보드 접근 이벤트
        const tabKeyUpEvt = (e) => {
            init(e);
            const targetBtnWrap = currentTarget.parentElement;
            if (e.key == "ArrowRight") {
                // 키보드 -> 화살표를 눌렀을 때
                if (targetBtnWrap.nextElementSibling) {
                    targetBtnWrap.nextElementSibling.children[0].focus();
                    tabRemoveEvt(targetTabListWrap, targetPanelWrap);
                    tabAddEvt(
                        targetBtnWrap.nextElementSibling.children[0],
                        targetTabWrap
                    );
                } else
                    homeKeyEvt(
                        targetTabListWrap,
                        targetTabWrap,
                        targetPanelWrap
                    );
            } else if (e.key == "ArrowLeft") {
                // 키보드 <- 화살표를 눌렀을 때
                if (targetBtnWrap.previousElementSibling) {
                    targetBtnWrap.previousElementSibling.children[0].focus();
                    tabRemoveEvt(targetTabListWrap, targetPanelWrap);
                    tabAddEvt(
                        targetBtnWrap.previousElementSibling.children[0],
                        targetTabWrap
                    );
                } else
                    endKeyEvt(
                        targetTabListWrap,
                        targetTabWrap,
                        targetPanelWrap
                    );
            }
            // 키보드 End 키 눌렀을 때
            else if (e.key == "End")
                endKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
            // 키보드 Home 키 눌렀을 때
            else if (e.key == "Home")
                homeKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
        };
        // tab active event
        const tabAddEvt = (currentTarget, targetPanelWrap) => {
            // 선택 된 탭 속성 true 로 변경
            currentTarget.setAttribute("aria-selected", "true");
            currentTarget.removeAttribute("tabindex");
            currentTarget.parentElement.classList.add("active");
            // 연결 된 tabpanel 숨김 해제
            targetPanelWrap
                .querySelector(`[aria-labelledby="${currentTarget.id}"]`)
                .removeAttribute("hidden");
            targetPanelWrap
                .querySelector(`[aria-labelledby="${currentTarget.id}"]`)
                .setAttribute("tabindex", "0");
        };
        // tab active remove event
        const tabRemoveEvt = (tabListWrap, tabPanelWrap) => {
            targetTabListWrap.querySelectorAll("li").forEach((tabBtnWrap) => {
                // 기존에 선택 된 탭 속성 false 로 변경
                if (tabBtnWrap.classList.contains("active")) {
                    tabBtnWrap.classList.remove("active");
                    tabBtnWrap
                        .querySelector('[role="tab"]')
                        .setAttribute("aria-selected", "false");
                    tabBtnWrap
                        .querySelector('[role="tab"]')
                        .setAttribute("tabindex", "-1");
                }
            });
            // 기존에 선택 된 tabpanel 숨김
            for (let tabPanel of targetPanelWrap.children) {
                tabPanel.setAttribute("hidden", "false");
                tabPanel.setAttribute("tabindex", "-1");
            }
        };
        // 키보드 Home key Event (선택된 탭 리스트 중 첫 번째 리스트로 포커스 이동)
        const homeKeyEvt = (
            targetTabListWrap,
            targetTabWrap,
            targetPanelWrap
        ) => {
            targetTabListWrap.children[0].children[0].focus();
            tabRemoveEvt(targetTabListWrap, targetPanelWrap);
            tabAddEvt(targetTabListWrap.children[0].children[0], targetTabWrap);
        };
        // 키보드 End key Event (선택된 탭 리스트 중 마지막 리스트로 포커스 이동)
        const endKeyEvt = (
            targetTabListWrap,
            targetTabWrap,
            targetPanelWrap
        ) => {
            const targetTabLists = targetTabListWrap.querySelectorAll("li");
            targetTabLists[targetTabLists.length - 1].children[0].focus();
            tabRemoveEvt(targetTabListWrap, targetPanelWrap);
            tabAddEvt(
                targetTabLists[targetTabLists.length - 1].children[0],
                targetTabWrap
            );
        };
        // 클릭/키보드 탭 이벤트 제거/할당
        tabGroups.forEach((tabWrapper) => {
            const tabBtns = tabWrapper.querySelectorAll('[role="tab"]');
            tabBtns.forEach((tabBtn) => {
                tabBtn.removeEventListener("click", tabClickEvt);
                tabBtn.addEventListener("click", tabClickEvt);
                tabBtn.removeEventListener("keyup", tabKeyUpEvt);
                tabBtn.addEventListener("keyup", tabKeyUpEvt);
            });
        });
    },
    accordion:function(){
        const accordion = $(document).find(".wrap-accordion-group");
        if( accordion.length < 1 ) return;

        let _this;

        accordion.attr("data-role", "accordion-group");
        accordion.find("li").each((idx, item)=>{
            $(item).find(".wrap-accordion-contents").attr({"role":"region"});
            if( $(item).hasClass("on") ){
                $(item).find(".accordion-btn").attr({"aria-expanded":"true"});
            } else {
                $(item).find(".accordion-btn").attr({"aria-expanded":"false"});
            }
        })

        // click
        accordion.find(".accordion-btn").on("click", function(){
            _this = $(this).parents(".wrap-accordion-group");
            const li = $(this).parents("li");
            const liAll = li.siblings();

            const isOnly = _this.attr("accordion-option") == "only";
            console.log(isOnly);

            if(isOnly){
                liAll.removeClass("on");
                liAll.find(".accordion-btn").attr("aria-expanded", false);
                liAll.find(".wrap-accordion-contents").slideUp();
            }

            if( li.hasClass("on") ){
                li.removeClass("on");
                li.find(".accordion-btn").attr("aria-expanded", false);
                li.find(".wrap-accordion-contents").slideUp();
            } else {
                li.addClass("on");
                li.find(".accordion-btn").attr("aria-expanded", true);
                li.find(".wrap-accordion-contents").slideDown();
            }

        })
    },
    select: function(){
        const select = $(document).find(".select_box");
        if( select.length < 1){ return };

        select.each((idx, item)=>{
            const _this = $(item);

            _this.find('.btn_select').attr({'aria-owns': _this.find('.select_list_box').attr('id'), 'data-toggle' :'dropdown', 'role' : 'combobox', 'aria-haspopup' : 'listbox', 'aria-expanded': 'false'});
            _this.find('.select_list_box').attr({ 'role' : 'listbox' , 'aria-expanded' : 'false' });
            _this.find('.select_list_box .select_list').attr('role', 'presentation');
            _this.find('.select_list_box .select_list > li').attr('role', 'option');
            _this.find('.select_list input[type="radio"] + label').attr({'aria-selected' : 'false', 'tabindex' : '0'});
            _this.find('.select_list_box .select_list > li').each((idx, item)=>{
                $(item).find('label').attr( 'aria-posinset', idx+1 );
            });

            // click
            _this.find(".btn_select").on("click", function(){
                const select_box = $(this).parents(".select_box");

                $(document).find(".select_box").filter((idx, item2)=> $(item2)[0] != select_box[0] ).each((idx, item3)=>{
                    selectOff( $(item3) );
                });

                ($(this).hasClass("on")) ? selectOff(_this) : selectOn(_this);
            });

            // change
            _this.find("input[type='radio']").on("change", function(){
                const value = $(this).next().text();
                _this.find(".btn_select").text(value).addClass("selected");
                selectOff(_this);
            });

            // const selectOn = function(){
            //     _this.find(".btn_select").addClass('on').attr( 'aria-expanded', 'true');
            //     _this.find('.select_list_box').addClass('on').attr( 'aria-expanded', 'true');
            // };
            // const selectOff = function(){
            //     _this.find(".btn_select").removeClass('on').attr("aria-expanded", "false")
            //     _this.find('.select_list_box').removeClass("on").attr("aria-expanded", "false");
            // }
        });
        

        const selectOn = function(elem){
            elem.find(".btn_select").addClass('on').attr( 'aria-expanded', 'true');
            elem.find('.select_list_box').addClass('on').attr( 'aria-expanded', 'true');
        };
        const selectOff = function(elem){
            elem.find(".btn_select").removeClass('on').attr("aria-expanded", "false")
            elem.find('.select_list_box').removeClass("on").attr("aria-expanded", "false");
        }

    }
   
}


