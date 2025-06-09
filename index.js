document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();//chặn sự kiế submit làm reset trang
    let name = document.querySelector("#name").value;//lấy giá trị của input#name
    //tạo ra 1 đối tượng 
    let item = {
        id: new Date().toISOString(), //biến về chuỗi để lưu vào database chuẩn ISO
        name: name.trim(),
    };
    //hiển thị item lên giao diện: addItemToUI(item)
    addItemToUI(item);
    //lưu item vào database (localStorage): addItemToLS(item)
    addItemToLS(item);
});

//getList(): khi gọi hàm này sẽ nhận được danh sách các item
const getList = () => {
    // if(localStorage.getItem("list") != null){
    //     return  JSON.parse(localStorage.getItem("list"))
    // }else{
    //     return [];
    // }
    return JSON.parse(localStorage.getItem("list")) || [];//có thì đưa chuỗi rồi ép kiểu thành cái mảng | null
};

//hàm nhận vào 1 item và hiển thị lên ui
const addItemToUI = (item) => {
    let newCard = document.createElement("div");
    newCard.className = "card d-flex flex-row justify-content-between align-items-center p-2 mb-3";
    newCard.innerHTML = `
        <span>${item.name}</span>
        <button data-id="${item.id}" class="btn btn-danger btn-sm btn-remove">Remove</button>
    `;
    document.querySelector(".list").appendChild(newCard);//truy cập vào list nhét newCard vào
}; 

//hàm nhận item và lưu nó vào list trong localStorage
const addItemToLS = (item) => {
      //lấy list từ localStorage VỀ
      let list = getList();
      //nhét item vào list
      list.push(item);
      //lưu lên lại localStorage
      localStorage.setItem("list", JSON.stringify(list));//biến thành chuỗi đẩy lên lại
};

//init: rander ra các item trong list
const init = () => {
    //lấy danh sách về
    let list = getList();
    list.forEach((item) => {
        addItemToUI(item);
    });
};
init();

//sự kiện xóa 1 item
document.addEventListener("click", (event) => {
    //nếu node mà mình vừa nhấn có class btn-remove thì
    if(event.target.classList.contains("btn-remove")){
        let nameItem = event.target.previousElementSibling.textContent;
        let isConfirmed = confirm(`Bạn có chắc là muốn xóa item: ${nameItem} ?`);
        if(isConfirmed){
            //xóa trên ui
            let card = event.target.parentElement;
            card.remove();
            //xóa item trong localStorage bằng id của item: removeItemFromLS(idRemove)
            let idRemove = event.target.dataset.id;// lấy dât-id của btn-remove
            removeItemFromLS(idRemove);
        }
    }
});

const removeItemFromLS = (idRemove) => {
    //lấy danh sách 
    let list = getList();
    //xóa item có id == idRemove
    list = list.filter((item) => item.id != idRemove);//trong danh sách này có thằng nào có id khác id này thì lấy hết
    //cập nhật danh sách mới vào localStorage
    localStorage.setItem("list", JSON.stringify(list));//lưu lên bằng chuỗi
}


//removeAll
document.querySelector("#btn-remove-all").addEventListener("click", () => {
    let isConfirmed = confirm("Bạn có chắc là muốn xóa toàn bộ danh sách không?");
    if(isConfirmed){
        //xóa trên ui
        document.querySelector(".list").innerHTML = "";
        //xóa trên localStorage
        localStorage.removeItem("list");
    }
});

//CHỨC NĂNG FILTER: LỌC
document.querySelector("#filter").addEventListener("keyup", (event) => {
    let inputValue = event.target.value;//lấy giá trị của ô nhập
    let list = getList();//lấy danh sách các item
    //lọc ra item nào có name chưa giá trị vừa lấy
    let filterList = list.filter((item) => item.name.includes(inputValue));
    //xóa danh schs cũ trước khi render danh sách mới lọc
    document.querySelector(".list").innerHTML = "";
    //render danh sách mới lọc
    filterList.forEach((item) => {
        addItemToUI(item);
    });
});