<h1 align="center"><a href="https://github.com/wangjianan1103/pica_pay" target="_blank">Pica_pay</a></h1>

> Pica_pay 是模拟微信支付前端Demo。


------------------------------

## 简介

**Pica_pay**

使用 vue 开发的微信支付前台服务。


## 微信支付系列文章
1. [微信支付-java后端实现](https://www.oopmind.com/archives/wechat-pay-java)
2. [微信支付-vue 前端实现](https://www.oopmind.com/archives/wechat-pay-vue)


## 快速开始

### 下载最新的 Pica_pay 源码包

```bash
git clone https://github.com/wangjianan1103/pica_pay.git
```

### Project setup

```bash
npm install
```


### 启动服务

```bash
npm run serve
```


### 构建部署文件

```bash
npm run build
```


## vue支付业务流程文档

| 接口地址 | 描述 | 调用方 |
| --- | --- | --- |
| src/components/index/Index.vue => created() | 初始化微信支付jsApi配置，初始化参数由后端返回, url 为前端当前域名，需与微信后台配置相同, chooseWXPay 代表使用微信支付插件，还有很多其他插件，详情移步微信官方文档 | 前端 => 后端 => 微信sdk |
| src/components/index/Index.vue => methods.pay() | 用户点击确认支付，请求后端发起下单，拿到后端的统一下单id, 调用微信jsApi.chooseWXPay 调起微信支付页面。支付成功后会调用success方法, 支付失败后会调用fail方法, 取消支付会调用cancel方法, 此处拿到的成功，不能作为支付成功依据，支付结果需要调用后端接口异步拿到 | 前端 => 后端 => 微信sdk |
| src/components/index/Index.vue => methods.doWxPayCallback() | 微信支付结果处理, 循环调用后端获取支付结果，查询一定次数后跳转到账单或者结果页面，依据个人业务需求即可 | 微信sdk => 前端 => 后端 |

## 博客

请移步： <https://www.oopmind.com>。


## 许可证

> Pica_pay 使用 GPL-v3.0 协议开源，请尽量遵守开源协议。


## 联系方式

> 如果 Pica_pay 对你有帮助，可以关注作者支持一下，每天会不定时回复留言(有任何问题都可以留言哦)。

| 微信公众号  |
| :------------: |
| <img src="https://i.loli.net/2019/12/16/rQuBaUTc7Ld5V86.jpg" width="200"/>  |

## 预览图

![zhifu1.jpeg](https://i.loli.net/2019/12/16/EMInaKYep4SDCkB.jpg)

![zhifu2.jpeg](https://i.loli.net/2019/12/16/dVcmCt3qljYP6GZ.jpg)

![zhifu3.jpeg](https://i.loli.net/2019/12/16/L1lbFaMyg4zPU3I.jpg)

![zhifu4.jpeg](https://i.loli.net/2019/12/16/aAvl2o13rG6HdYe.jpg)
