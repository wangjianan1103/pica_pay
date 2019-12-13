<template>
    <div class="addOrder">
        <div class="order-fare">
            <div class="fare-left">支付金额</div>
            <div class="fare-right">￥{{payAmount}}</div>
        </div>

        <div class="order-footer">
            <div class="content">
                <div class="pay in-enough" @click.stop.prevent="pay">支付</div>
            </div>
        </div>
    </div>
</template>
<script>
    import Http from '../utils/Http';
    import wx from 'weixin-js-sdk';

    export default {
        name: 'Index',
        data() {
            return {
                payAmount: 0.01,
                wx: null
            };
        },
        created() {
            <!--
             微信支付
             初始化微信支付jsApi配置，初始化参数由后端返回
             url 为前端当前域名，需与微信后台配置相同

             chooseWXPay 代表使用微信支付插件，还有很多其他插件，详情移步微信官方文档
             -->
            let config = {
                url: 'https://app.lianjia.oopmind.com/'
            };
            let promises = Http.post('/wx/getSdkConfig', config);
            promises.then((response) => {
                let content = response.content;
                config.nonceStr = content.nonceStr;
                config.signature = content.signature;
                config.timestamp = content.timestamp;
                config.appId = content.appId;
                config.debug = true;
                config.jsApiList = [
                    'chooseWXPay'
                ];
                wx.config(config);
                wx.ready(() => {
                    this.wx = wx;
                });
                wx.error(function (res) {
                    console.info('error 验证失败', res);
                });
            });
        },
        mounted() {
        },
        methods: {
            <!--
             微信支付
             用户点击确认支付，请求后端发起下单，拿到后端的统一下单id, 调用微信jsApi.chooseWXPay 调起微信支付页面。
             支付成功后会调用success方法
             支付失败后会调用fail方法
             取消支付会调用cancel方法

             此处拿到的成功，不能作为支付成功依据，支付结果需要调用后端接口异步拿到
             -->
            pay() {
                let params = {
                    payAmount: this.payAmount
                };
                let promises = Http.post('/transaction/do', params);
                let that = this;
                promises.then((response) => {
                    if (response.status === 0) {
                        let recordOrderGid = response.content.recordOrderGid;
                        try {
                            this.wx.chooseWXPay({
                                timestamp: response.content.timeStamp, // 支付签名时间戳，注意微信js sdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                nonceStr: response.content.nonceStr, // 支付签名随机串，不长于 32 位
                                package: 'prepay_id=' + response.content.prepayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                                signType: response.content.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                paySign: response.content.sign, // 支付签名
                                success: function () {
                                    that.doWxPayCallback(recordOrderGid);
                                },
                                fail: function () {
                                    that.doWxPayCallback(recordOrderGid);
                                },
                                cancel: function () {
                                    console.info('取消支付，如需支付请继续。');
                                }
                            });
                        } catch (e) {
                            console.info('订单支付异常, 请稍后重试。');
                        }
                    } else {
                        console.info(response.message);
                    }
                });
            },
            <!--
             微信支付结果处理
             循环调用后端获取支付结果，查询一定次数后跳转到账单或者结果页面，依据个人业务需求即可
             -->
            doWxPayCallback: function (recordOrderGid) {
                let taskCount = 0;
                this.intervalid1 = setInterval(() => {
                    taskCount++;
                    if (taskCount > 5) {
                        clearInterval(this.intervalid1);
                    }
                    let statusPromise = this.queryOrderStatus(recordOrderGid);
                    statusPromise.then(sta => {
                        if (sta.status === 0) {
                            console.info(sta.content);
                            let orderStatus = sta.content.status;
                            if (orderStatus === 1) {
                                clearInterval(this.intervalid1);
                                this.$router.push({
                                    path: 'resultOrder', query: {}
                                });
                            } else if (orderStatus === 2) {
                                clearInterval(this.intervalid1);
                                console.info('订单支付失败。');
                            } else if (orderStatus === 0) {
                                console.info('订单支付处理中');
                            }
                        }
                    });
                }, 2000);
            },
            queryOrderStatus(orderGid) {
                let params = {
                    orderGid: orderGid
                };
                return Http.post('/transaction/order/status', params);
            }
        },
        components: {}
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
    .addOrder
        width: 100%
        margin-bottom: 46px
        .order-fare
            display: flex
            width: 100%
            justify-content: space-between
            padding: 10px
            .fare-left
                font-size: 15px
            .fare-right
                margin-right: 15px
                font-size: 15px
                .order_desc
                    font-size: 10px
                    color: #2b343c
        .order-footer
            position: fixed
            left: 0
            bottom: 0
            z-index: 10
            width: 100%
            height: 48px
            .content
                font-size: 12px
                height: 48px
                line-height: 48px
                text-align: center
                background: #00b43c
                color: #fff
                .pay
                    font-size: 14px
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-weight: 700
                    &.not-enough
                        background: #2b333b
                    &.in-enough
                        background: #00b43c
                        color: #fff
</style>
