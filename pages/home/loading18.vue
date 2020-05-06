<template>
  <view class="preloader">
    <view class="loader"></view>
  </view>
</template>

<script>
export default {
  name: "loading18",
  data() {
    return {};
  }
};
</script>

<style scoped="true">
.loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 120upx;
  height: 120upx;
  margin: -60upx 0 0 -60upx;
  border-radius: 50%;
  border: 3upx solid transparent;
  border-top-color: #9370db;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
.loader::before {
  content: "";
  position: absolute;
  top: 5upx;
  left: 5upx;
  right: 5upx;
  bottom: 5upx;
  border-radius: 50%;
  border: 3upx solid transparent;
  border-top-color: #ba55d3;
  -webkit-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}
.loader::after {
  content: "";
  position: absolute;
  top: 15upx;
  left: 15upx;
  right: 15upx;
  bottom: 15upx;
  border-radius: 50%;
  border: 3upx solid transparent;
  border-top-color: #ff00ff;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
