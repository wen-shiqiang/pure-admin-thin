<template>
  <el-container class="footer-container">
    <el-footer>
      <div>
        <div class="img-logo fl"></div>
        <span class="csg-line fl"></span>
        <div class="foot-text fl">
          <p>服务支持电话：021-54278188<i></i>投诉热线：18616383588<i></i><a href="http://www.campsg.cn">官方网址：www.campsg.cn</a></p>
          <p>CopyRight2018<i></i>上海尚强信息科技有限公司<i></i>All Rights Reserved</p>
        </div>
      </div>
    </el-footer>
  </el-container>

</template>
<style lang="less" type="text/less">
  .footer-container {
    width: 100%;
    height: 125px;
    text-align: center;
    .el-footer{
      width: 664px;
      height: auto!important;
      position: absolute;
      left: 50%;
      margin-left: -332px;
      bottom: 54px;
    }
    .img-logo{
      width: 125px;
      height: 26px;
      background: url("../../assets/images/footer-logo.png") no-repeat;
    }
    .foot-text{
      margin-top: -1px;
      font-size: 12px;
      line-height: 15px;
      color: rgba(81,96,110,.8);
      text-align: left;
      a{
        color: rgba(81,96,110,.8);
      }
    }
    .csg-line{
      height: 29px;
      margin: 0 10px;
    }
    i{
      display: inline-block;
      margin-right: 10px;
    }
  }
</style>
