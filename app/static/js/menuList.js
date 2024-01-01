let menuData;
let cachingData = null;
let basket = new Array;
let currentMenu = null;
let menuAllData = [];
let order_history = [];
let cancel_order_list = [];

// 메뉴판 메뉴 리스트 가져오기
fetch(`/pos/get_menu_list/${lastPath}`, {
  method: 'GET',
})
.then(response => response.json())
.then(data => {
  // 받은 데이터 처리
  console.log(data);
  menuData = data;
  createHtml(data);
})
.catch(error => {
  console.error('Error:', error);
});

// 테이블 주문 내역 가져오기
fetch(`/pos/get_table_order_list/${lastPath}`, {
  method: 'GET',
})
.then(response => response.json())
.then(data => {
  // 받은 데이터 처리
  console.log(data)
  if(data.length != 0){
    const _orderListBtns = document.querySelectorAll('.basket_container > .count_btns button.order_history, .basket_container > .count_btns button.new_order')
    _orderListBtns.forEach(btn => btn.dataset.active = true);
  }
  order_history=data.map((order)=>({
    id: order.id,
    masterName : setMasterName(order),
    name: order.name,
    price: order.price,
    count: 1,
    options: order.options,
  }))

})
.catch(error => {
  console.error('Error:', error);
});

// 주문내역 버튼 클릭 시
const clickOrderHistoryBtn = (event) => {
  document.querySelector('.basket_container .count_btns').innerHTML = posMenuListOrderListTopBtnsHtml();

  const _orderHistoryBtn = event.currentTarget;
  _orderHistoryBtn.dataset.check = true;
  const _basketContainer = document.querySelector('.basket_container');
  _basketContainer.dataset.type="order_list";
  changeOrderHtml(setBasketData(order_history))
  const _countBtns = document.querySelectorAll('.count_btns button.minus, .count_btns button.plus, .count_btns button.delete');
  _countBtns.forEach(btn=>btn.dataset.active=false);
  closeOptionContainer();

}

// 장바구니 버튼 클릭 시
const clickBasketBtn = (event) => {
  document.querySelector('.basket_container .count_btns').innerHTML = posMenuListBasketTopBtnsHtml();

  changeBasketHtml(setBasketData(menuAllData));
  const _basketContainer = document.querySelector('.basket_container');
  _basketContainer.dataset.type="basket";
  const _orderHistoryBtn = document.querySelector('.basket_container > .count_btns button.order_history');

  _orderHistoryBtn.dataset.check = false;
  const _countBtns = document.querySelectorAll('.count_btns button.minus, .count_btns button.plus, .count_btns button.delete');
  _countBtns.forEach(btn=>btn.dataset.active=false);
  closeOptionContainer();
}


// 메뉴판 HTML 만들기
const createHtml = (menuPageData) => {
  const _menuCatgory = document.querySelector('main section nav ul');
  const _menu = document.querySelector('main section article .items');
  let nav_html = '';
  menuPageData.forEach(({categoryId, category, pageList}, index)=>{
    
    nav_html += `
      <li data-id="${categoryId}" data-state="${index == 0 ? 'active': ''}">
        <button onclick="changeMenuCategory(event, ${index})">${category}</button>
      </li>
    `
    _menuCatgory.innerHTML =  nav_html;
    if(index != 0) return;
    const PAGE_INDEX = 0;
    const menus = pageList[PAGE_INDEX].menuList;
    const menus_html = changeMenuHtml(menus);
    _menu.innerHTML = menus_html;
    _menu.setAttribute('data-page', PAGE_INDEX);
    createPageNationBtnHtml();
    const _article = document.querySelector('main section article');
    const curCategoryId = document.querySelector('main section nav ul li[data-state="active"]').dataset.id;
    const pageLen = menuData.find((category)=>category.categoryId == Number(curCategoryId)).pageList.length;
    if(0 < PAGE_INDEX){_article.classList.add('hasPrevPage')};
    if(PAGE_INDEX < pageLen-1){_article.classList.add('hasNextPage')};
  })
}

// 메뉴 카테고리 변경
const changeMenuCategory = (event, index) => {
  const prevBtn = document.querySelector('main section nav ul li[data-state="active"]');
  prevBtn.dataset.state = '';

  const _li = event.target.closest('li');
  const _menu = document.querySelector('main section article .items');

  _li.dataset.state = 'active'
  const PAGE_INDEX = 0;
  let menus_html
  if(cachingData != null) {
    menus_html = changeMenuHtml(cachingData[index].pageList[PAGE_INDEX].menuList);
  }else {
    menus_html = changeMenuHtml(menuData[index].pageList[PAGE_INDEX].menuList);  
  }
  _menu.innerHTML = menus_html;
  _menu.setAttribute('data-page', PAGE_INDEX);

  const _article = document.querySelector('main section article');
  _article.classList.remove('hasNextPage');
  _article.classList.remove('hasPrevPage');


  const curCategoryId = document.querySelector('main section nav ul li[data-state="active"]').dataset.id;
  const pageLen = menuData.find((category)=>category.categoryId == Number(curCategoryId)).pageList.length;
  if(PAGE_INDEX < pageLen-1){_article.classList.add('hasNextPage')};
}

// 메뉴 html 변경
const changeMenuHtml = (menus) => {
  menus.sort((a,b)=> a.position-b.position);
  const forArray = Array.from({ length: 24 }, () => false);
  menus.forEach((menu)=>forArray[menu.position-1] = menu);
  return forArray.map((menu)=> `
    ${menu == false ? `
      <button class="menu item hidden"></button>` 
      : `
      <button class="menu item" data-id="${menu.menuId}" onclick="clickMenu(event)">
        <div class="title">
          <h2 class="ellipsis">${menu.menu}</h2>
        </div>
        <span class="price">${menu.price.toLocaleString()}원</span>
      </button>
    ` }
  `).join('');
}


// 메뉴 클릭 시
const clickMenu = (event) => {
  clickBasketBtn();
  const categoryId = document.querySelector('main section nav ul li[data-state="active"]').dataset.id;
  const page = document.querySelector('main section article .items').dataset.page;
  const menuId = event.currentTarget.dataset.id;
  const menu = getMenuData(menuData, categoryId, page, menuId);
  const _optionHtml = document.querySelector('#container.order main section aside');
  const __menu = document.querySelectorAll('main section article .item');

  resetMenuBackground(__menu);

  let hasMenu = false;

  currentMenu = {
    id: menu.menuId,
    name: menu.menu,
    price: menu.price,
    count: 1,
    options: [],
  }
  currentMenu.masterName = setMasterName(currentMenu);

  menuAllData.push(currentMenu);
  
  changeBasketHtml(setBasketData(menuAllData))

  const targetType = 'menu';
  const optionIndex = undefined;

  const basketItems = document.querySelectorAll('.basket li');
  const menuIndex = Array
    .from(basketItems)
    .findIndex(el=> el.querySelector('div').dataset.master == currentMenu.masterName);

  maintainActive(targetType, menuIndex, optionIndex);


  // 메뉴 옵션 HTML 토글
  if(menu.optionList.length != 0){
    showMenuOptionHtml(menu.optionList)
    _optionHtml.classList.add('active');
    setMenuDisabled(__menu, event.currentTarget);
    document.querySelector('.option_background').classList.add('active');
    
  }else {
    _optionHtml.classList.remove('active');
  }
}

// 옵션 상자 외부 클릭 시 옵션 상자 닫기
const closeOptionContainer = (event) => {
  document.querySelector('.option_container').classList.remove('active');
  document.querySelector('.option_background').classList.remove('active');
  const __menu = document.querySelectorAll('main section article .item');
    resetMenuBackground(__menu)
}



// 카테고리id, 메뉴id 로 메뉴 찾기
const getMenuData = (data, categoryId, page, menuId) => {
  const category = data.find(item => Number(item.categoryId) == Number(categoryId)).pageList[page]?.menuList;
  return category?.find(item => Number(item.menuId) == Number(menuId)) || null;
};

// 카테고리id, 메뉴id, 옵션id 로 옵션 찾기
const getMenuOptionData = (data, categoryId, page, menuId, optionId) => {
  const category = data.find(item => item.categoryId == categoryId).pageList[page]?.menuList;
  const menu = category?.find(item => item.menuId == menuId);
  const option = menu?.optionList.find(option => option.optionId == optionId);
  return option || null;
};



const showMenuOptionHtml = (optionDatas) => {
  const _optionHtml = document.querySelector('main section aside .items');
  let curPage = 0;
  const optionPageData = optionDatas.reduce((result, item, index) => {
    const groupIndex = Math.floor(index / 8);
    if (!result[groupIndex]) result[groupIndex] = []; 
    result[groupIndex].push(item);
    return result;
  }, []);
  _optionHtml.innerHTML = createMenuOptionsHtml(optionPageData[curPage]);
  const _optionContainer = document.querySelector('.option_container')
  _optionContainer.classList.remove('hasNextPage')
  _optionContainer.classList.remove('hasPrevPage')
  const optionPageLen = optionPageData.length;
  if(optionPageLen>1){
    
    _optionContainer.classList.add('hasNextPage')
    const _nextBtn = document.querySelector('.option_container .next_page_btn');
    const _prevBtn = document.querySelector('.option_container .prev_page_btn');
    _nextBtn.addEventListener('click',(event)=>{
      curPage += 1;
      if(!optionPageData[curPage]) {
        curPage -= 1; 
        return
      };
      if(curPage > 0) { // prev 버튼 보이게 하기
        _optionContainer.classList.add('hasPrevPage')
      }
      if(curPage == optionPageLen-1 ) { // next 버튼 안보이게 하기
        _optionContainer.classList.remove('hasNextPage')
      }
      _optionHtml.innerHTML = createMenuOptionsHtml(optionPageData[curPage]);
    })
    _prevBtn.addEventListener('click',(event)=>{
      curPage -= 1;
      if(!optionPageData[curPage]) {
        curPage += 1; 
        return
      };
      if(curPage == 0){ // prev 버튼 안보이게 하기
        _optionContainer.classList.remove('hasPrevPage')
      }
      if(curPage != optionPageLen -1){
        _optionContainer.classList.add('hasNextPage')
      }
      _optionHtml.innerHTML = createMenuOptionsHtml(optionPageData[curPage]);
    })
  }
}

// 옵션 리스트 HTML 만들기
const createMenuOptionsHtml = (optionPageData) => {
  let html = ``;
  for(let i=0; i<8; i++){
    html += `
    ${optionPageData[i] ? `
    <button data-id="${optionPageData[i].optionId}" class="menu item" onclick="clickMenuOption(event)" >
      <div class="title">
        <h2>${optionPageData[i].option}</h2>
      </div>
      <span class="price">${optionPageData[i].price.toLocaleString()}원</span>
    </button>
    ` : `<button class="menu item hidden"></button>`}
    
    `
  }
  return html
}

// 메뉴 백그라운드 활성화
const setMenuDisabled = (__menu, target) => {
  __menu.forEach((_menu, index)=>{
    _menu.classList.add('disabled');
  })
  target.classList.remove('disabled');
  target.classList.add('active');
}

// 메뉴 백그라운드 제거
const resetMenuBackground = (__menu) => {
  __menu.forEach((_menu, index)=>{
    _menu.classList.remove('disabled');
    _menu.classList.remove('active');
  })
}


// 메뉴 옵션 클릭 시
const clickMenuOption = (event) => {
  const categoryId = document.querySelector('main section nav ul li[data-state="active"]').dataset.id;
  const page = document.querySelector('main section article .items').dataset.page;
  const menuId = document.querySelector('main section article .item.active').dataset.id;
  const optionId = event.currentTarget.dataset.id;
  const option = getMenuOptionData(menuData, categoryId, page, menuId, optionId);
  const newOption = {
    id: option.optionId,
    name: option.option,
    price: option.price,
    count: 1,
  }
  let isHas = false;
  currentMenu = menuAllData[menuAllData.length-1]
  currentMenu.options.forEach((option)=>{
    if(option.id == newOption.id){
      option.count = option.count + 1; 
      isHas = true;
    }
  })
  if(!isHas || currentMenu.length == 0){
    currentMenu.options.push(newOption)
  }
  currentMenu.masterName = setMasterName(currentMenu);
  changeBasketHtml(setBasketData(menuAllData))

  const targetType = 'menu_option';
  const basketItems = document.querySelectorAll('.basket li');
  const menuIndex = Array
    .from(basketItems)
    .findIndex(el=> el.querySelector('div').dataset.master == currentMenu.masterName);
  const optionData = [...basketItems][menuIndex].querySelectorAll('[data-type="menu_option"]')
  const optionIndex = [...optionData].findIndex(el=> el.dataset.id == option.optionId)

  maintainActive(targetType, menuIndex, optionIndex);

}

// 장바구니 아이템 클릭 시
const clickBasketMenu = (event) => {
  const __basketMenu = document.querySelectorAll('.basket_container .basket li > div');
  const target = event.currentTarget;
  __basketMenu.forEach((_basketMenu)=>{
    _basketMenu.classList.remove('active');
  })
  target.classList.add('active');
  const _countBtns = document.querySelectorAll('.count_btns button.minus, .count_btns button.plus, .count_btns button.delete');
  _countBtns.forEach(btn=>btn.dataset.active=true);
  closeOptionContainer();
}

// 주문내역 아이템 클릭 시
const clickOrderMenu = (event) => {
  const __basketMenu = document.querySelectorAll('.basket_container .basket li');
  const target = event.currentTarget;
  __basketMenu.forEach((_basketMenu)=>{
    _basketMenu.classList.remove('active');
  })
  target.classList.add('active');
  const _countBtns = document.querySelectorAll('.count_btns button.minus, .count_btns button.plus, .count_btns button.delete');
  _countBtns.forEach(btn=>btn.dataset.active=true);
  closeOptionContainer();
}

// 장바구니 - 클릭 시
const minusBasketMenu = (event) => {
  if(menuAllData.length == 0) return;
  const basketItems = document.querySelectorAll('.basket li');
  let menuIndex;
  menuIndex = Array
    .from(basketItems)
    .findIndex(el => el.querySelector('div').classList.contains('active'))
  if(menuIndex == -1) {
    menuIndex = Array
      .from(basketItems)
      .findIndex((el)=>el.querySelector('div.active[data-type="menu_option"]') != undefined)
  }

  const target = document.querySelector('.basket li div.active');
  const targetType = target.dataset.type;
  const pargetEl = target.closest('li').querySelector('[data-type="menu"]')
  const masterName = targetType == "menu" ? target.dataset.master : pargetEl.dataset.master;

  let optionIndex = undefined;

  if(targetType == 'menu'){
    const dataIndex = menuAllData.findIndex(data=>data.masterName == masterName)
    menuAllData.splice(dataIndex, 1);
  }
  if(targetType == 'menu_option'){
    const filterData = menuAllData
      .filter(data=>data.masterName == masterName);
    optionIndex = filterData[0].options
      .findIndex(option => Number(option.id) == Number(target.dataset.id));
    if(filterData[0].options[optionIndex].count > 1) {
      filterData.forEach(({options}) => options[optionIndex].count -= 1 );
    }else{
      filterData.forEach((data)=>data.options.splice(optionIndex, 1))
    }
  }
  menuAllData.forEach(data =>data.masterName = setMasterName(data))
  changeBasketHtml(setBasketData(menuAllData))
  maintainActive(targetType, menuIndex, optionIndex);
  closeOptionContainer();

}

// 주문내역에서 '-' 클릭 시
const minusOrderListMenu = () => {
  const basketItems = document.querySelectorAll('.basket li');
  let menuIndex;
  menuIndex = Array
    .from(basketItems)
    .findIndex(el => el.classList.contains('active'))
  const target = document.querySelector('.basket li.active');
  const dataList = order_history.filter((order)=>order.masterName == target.dataset.master);
  const maxCount = dataList.length;
  const data = dataList[0];
  if(!stringToBooleanMap[target.dataset.iscancel]){
    target.dataset.iscancel = true;
    const html = `<li class="cancel" data-count="0"></li>`
    target.insertAdjacentHTML("afterend", html);
  }
  const _nextLi = target.nextElementSibling;
  const count = Number(_nextLi.dataset.count) + 1;
  if(count > maxCount){ 
    return 
  }else{
    cancel_order_list.push(data);
    _nextLi.dataset.count = count;
    const html = `
      <div 
        data-id="${data.id}" 
        data-type="menu"
        data-count="${count}" 
        data-master="${data.masterName}" 
        class="menu cancel" 
        >
        <div class="count"><span>${count}</span></div>
        <h2>${data.name}</h2>
        <span class="price">-${(data.price * count).toLocaleString()}원</span>
      </div>
      ${data.options.map((option)=>`
      <div data-id="${option.id}" data-type="menu_option" class="menu_option">
        <div class="option_name_count">
          <h2>${option.name}</h2>
          <span>x</span>
          <span>${option.count}</span>
        </div>
        <span class="price">-${(option.price * count).toLocaleString()}원</span>
      </div>
      `).join('')}
    `
    _nextLi.innerHTML = html;
  }
}
// 주문내역에서 '+' 클릭 시
const plusOrderListMenu = () => {
  const basketItems = document.querySelectorAll('.basket li');
  let menuIndex;
  menuIndex = Array
    .from(basketItems)
    .findIndex(el => el.classList.contains('active'))
  const target = document.querySelector('.basket li.active');
  const dataList = order_history.filter((order)=>order.masterName == target.dataset.master);
  const data = dataList[0];
  if(!stringToBooleanMap[target.dataset.iscancel])return;
  const _nextLi = target.nextElementSibling;
  if(!_nextLi.classList.contains('cancel'))return;
  const count = Number(_nextLi.dataset.count) - 1;
  const index = cancel_order_list.findIndex(order=>order.masterName == target.dataset.master);
  if (index !== -1) {
    cancel_order_list.splice(index, 1);
  }
  if(count == 0){ // cancel 제거
    target.dataset.iscancel = false;
    _nextLi.remove();
  }else{ // count -1; 
    _nextLi.dataset.count = count;
    const html = `
      <div 
        data-id="${data.id}" 
        data-type="menu"
        data-count="${count}" 
        data-master="${data.masterName}" 
        class="menu cancel" 
        >
        <div class="count"><span>${count}</span></div>
        <h2>${data.name}</h2>
        <span class="price">-${(data.price * count).toLocaleString()}원</span>
      </div>
      ${data.options.map((option)=>`
      <div data-id="${option.id}" data-type="menu_option" class="menu_option">
        <div class="option_name_count">
          <h2>${option.name}</h2>
          <span>x</span>
          <span>${option.count}</span>
        </div>
        <span class="price">-${(option.price * count).toLocaleString()}원</span>
      </div>
      `).join('')}
    `
    _nextLi.innerHTML = html;
  }
}
// 주문내역에서 '삭제' 클릭 시
const deleteOrderListMenu = () => {}

// 장바구니 + 클릭 시
const plusBasketMenu = (event) => {
  const type = findParentTarget(event.currentTarget, 'aside').dataset.type
  if(type == 'order_list'){
    console.log('주문내역에서 플러스 클릭함')
  }
  if(type == 'basket'){
    if(menuAllData.length == 0) return;
    const basketItems = document.querySelectorAll('.basket li');
    let menuIndex;
    menuIndex = Array
      .from(basketItems)
      .findIndex(el => el.querySelector('div').classList.contains('active'))
    if(menuIndex == -1) {
      menuIndex = Array
        .from(basketItems)
        .findIndex((el)=>el.querySelector('div.active[data-type="menu_option"]') != undefined)
    }
  
    const target = document.querySelector('.basket li div.active');
    const targetType = target.dataset.type;
    const pargetEl = target.closest('li').querySelector('div[data-type="menu"]')
    const masterName = targetType == "menu" ? target.dataset.master : pargetEl.dataset.master;
    let optionIndex = undefined;
    if(targetType == 'menu'){
      const data = menuAllData.find(data=>data.masterName == masterName);
      menuAllData.push(deepCopy(data));
    }
    if(targetType == 'menu_option'){
      const filterData = menuAllData
        .filter(data =>data.masterName == masterName);
      optionIndex = filterData[0].options
        .findIndex(option => Number(option.id) == Number(target.dataset.id));
      filterData.forEach(({options}) => options[optionIndex].count+=1 );
  
    }
    
    menuAllData.forEach(data =>data.masterName = setMasterName(data))
    changeBasketHtml(setBasketData(menuAllData))
    
    maintainActive(targetType, menuIndex, optionIndex);
    closeOptionContainer();
  }
  
}

// 장바구니 클릭 상태 유지
const maintainActive = (targetType, menuIndex, optionIndex) => {
  const basketItems = document.querySelectorAll('.basket li');
  const basketLength = basketItems.length;
  const _countBtns = document.querySelectorAll('.count_btns button.minus, .count_btns button.plus, .count_btns button.delete');
  if (basketLength === 0) {
    _countBtns.forEach( btn => btn.dataset.active = false);
    return
  };
  let targetEl;
  if(targetType == 'menu'){
    targetEl = basketItems[menuIndex]?.querySelector('[data-type="menu"]');
    if(targetEl == undefined){
      while(menuIndex >= 0){
        if(basketItems[menuIndex]?.querySelector('[data-type="menu"]') != undefined) {
          targetEl = basketItems[menuIndex].querySelector('[data-type="menu"]');
          break
        }
        menuIndex -= 1;
      }
    }
  }else {
    targetEl = basketItems[menuIndex].querySelectorAll('[data-type="menu_option"]')[optionIndex]
    if(targetEl == undefined) {
      while(optionIndex >= 0){
        if(basketItems[menuIndex].querySelectorAll('[data-type="menu_option"]')[optionIndex] != undefined) {
          targetEl = basketItems[menuIndex].querySelectorAll('[data-type="menu_option"]')[optionIndex]
          break
        }
        optionIndex -= 1;
      }
      if(optionIndex == -1){
        targetEl = basketItems[menuIndex].querySelector('[data-type="menu"]');
      }
    }
  }
  _countBtns.forEach( btn => btn.dataset.active = true);
  targetEl.classList.add('active');
}

// 장바구니 삭제 클릭 시
const deleteBasketMenu = (event) => {
  const type = findParentTarget(event.currentTarget, 'aside').dataset.type
  if(type == 'order_list'){
    console.log('주문내역에서 휴지통 클릭함')
  }
  if(type == 'basket'){
    if(menuAllData.length == 0) return;
  
    const target = document.querySelector('.basket .active');
    const targetType = target.dataset.type;
    const pargetEl = target.closest('li').querySelector('[data-type="menu"]')
    const masterName = targetType == "menu" ? target.dataset.master : pargetEl.dataset.master;
  
    const basketItems = document.querySelectorAll('.basket li');
    let menuIndex;
    menuIndex = Array
      .from(basketItems)
      .findIndex(el => el.querySelector('div').classList.contains('active'))
    if(menuIndex == -1) {
      menuIndex = Array
        .from(basketItems)
        .findIndex((el)=>el.querySelector('div.active[data-type="menu_option"]') != undefined)
    }
  
    let optionIndex = undefined;
    if(targetType == 'menu'){
      menuAllData = deepCopy(menuAllData.filter(data => data.masterName != masterName))
    }
    if(targetType == 'menu_option'){
      const filterData = menuAllData
        .filter(data => data.masterName == masterName);
      optionIndex = filterData[0].options
        .findIndex(option => Number(option.id) == Number(target.dataset.id));
  
      filterData.forEach((data)=>data.options.splice(optionIndex, 1))
    }
    menuAllData.forEach(data =>data.masterName = setMasterName(data))
    changeBasketHtml(setBasketData(menuAllData))
    
    maintainActive(targetType, menuIndex, optionIndex);
    closeOptionContainer();
  }
  
}

// 주문하기 클릭 시
const clickOrder = (event) => {
  const data = {
    table_id : lastPath,
    order_list : deepCopy(menuAllData)
  }
  fetch(`/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    // 받은 데이터 처리
    console.log(data);
    if(data == 'Success'){
      window.location.href = '/pos/tableList'
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
// 결제하기 클릭 시
const clickPayment = (event) => {
  window.location.href = `/pos/payment/${lastPath}`
}