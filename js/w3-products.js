import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";
const site = "https://vue3-course-api.hexschool.io/v2";
const api_path = "yuling202202";

let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, //確認是編輯或新增所使用的
    };
  },
  methods: {
    getProducts() {
      const url = `${site}/api/${api_path}/admin/products/all`;
      axios
        .get(url)
        .then((res) => {
          console.log(res);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 建立產品按鈕點選後會打開modal
    openModal(status, product) {
      //productModal.show();
      console.log(status);
      if (status === "create") {
        productModal.show();
        this.isNew = true;
        // 會帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === "edit") {
        productModal.show();
        this.isNew = false;
        // 會帶入當前要編輯資料
        // 加入imagesUrl: [],會顯示"新增圖片"按鈕可切換"刪除按鈕"圖片
        this.tempProduct = { imagesUrl: [], ...product };
        // 67分沒有array時更深層判斷??
      } else if (status === "delete") {
        delProductModal.show();
        this.tempProduct = { ...product }; //等等取id使用
      }
    },
    // 打開modal，輸入新增產品資訊，按儲存後關閉視窗
    updateProduct() {
      //console.log("updateProduct");
      let url = `${site}/api/${api_path}/admin/product`;
      //   用rhis.isNew判斷API要怎麼運行
      let method = "post";
      //   如果不適新增時，url及method要更換
      if (!this.isNew) {
        url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      axios[method](url, { data: this.tempProduct })
        .then((res) => {
          //console.log(res);
          this.getProducts();
          productModal.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteProduct() {
      const url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then(() => {
          this.getProducts();
          delProductModal.hide(); //關閉modal
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    console.log(cookieValue);
    // axios headers
    // axios請求預設headers Authorization帶入token
    axios.defaults.headers.common["Authorization"] = cookieValue;
    this.getProducts();
    //https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
    console.log(bootstrap);
    // 1.初始化new
    //2.呼叫方法.show .hide
    productModal = new bootstrap.Modal("#productModal");
    //productModal.show(); //確保他會動
    delProductModal = new bootstrap.Modal("#delProductModal");
  },
});
app.mount("#app");
