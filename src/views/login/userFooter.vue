<template>
  <div class="footer-container">
    <div class="img-logo fl" />
    <span class="csg-line fl" />
    <div class="foot-text text-[12px] text-[#ffffffb3] fl">
      <p class="leading-[22px] flex">
        服务支持电话：021-54278188
        <i class="mr-[10px]" />
        投诉热线：18616383588
        <i class="mr-[10px]" />
        <a href="http://www.campsg.cn"> 官方网址：www.campsg.cn </a>
      </p>
      <p class="leading-[22px] flex">
        CopyRight2018
        <i class="mr-[10px]" />
        上海尚强信息科技有限公司
        <i class="mr-[10px]" />
        All Rights Reserved
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer-container {
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 54px;
  .img-logo {
    width: 125px;
    height: 26px;
    background: url("@/assets/login/footer-logo.png") no-repeat;
  }
  .csg-line {
    height: 29px;
    width: 1px;
    margin: 0 10px;
    background: #c5d0da;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
