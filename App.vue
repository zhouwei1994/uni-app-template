<script>
import store from "@/config/store";
export default {
  // 只有 app 才会有 onLaunch 的生命周期
  onLaunch: function() {
    //取出缓存数据
    store.commit("setCacheData");
    this.appUpdate();
  },
  onShow: function() {
  },
  onHide: function() {
  },
  methods: {
    //小程序更新
    appUpdate: function() {
      if (uni.getUpdateManager) {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          // 请求完新版本信息的回调
          // console.log(res.hasUpdate);
        });
        updateManager.onUpdateReady(function(res) {
          uni.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          });
        });
        updateManager.onUpdateFailed(function(res) {
          // 新的版本下载失败
          uni.showModal({
            title: "已经有新版本了哟~",
            content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
            showCancel: false
          });
        });
      }
    }
  },
  // 捕获 app error
  onError(err) {
    console.log(err);
  }
};
</script>

<style lang="scss">
@import "./style/common.scss";
@import "./style/icon.scss";
page {
  height: 100%;
  background-color: #f5f5f5;
}
</style>
