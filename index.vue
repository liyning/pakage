<template>
    <view style="height: 100%">
        <view class="search">
            <uni-search-bar :radius="62" :needLeft="true" :placeholder="placeholder" :searchColor="searchColor" @confirm="search" style="color: #999999"></uni-search-bar>
        </view>
        <view class="content">
            <view class="typeList">
                <view class="typeItem" @click="changeType('全部')" :class="selectedType == '全部' ? 'selectedType' : 'unselectedType'">
                    <view v-if="selectedType == '全部'" class="top-fillet"></view>
                    <view v-if="selectedType == '全部'" class="rect"></view>
                    <span>全部</span>
                </view>
                <view
                    class="typeItem"
                    v-for="(item, index) in categories"
                    :key="index"
                    @click="changeType(item.categoryName)"
                    :class="[selectedType == item.categoryName ? 'selectedType' : 'unselectedType',item.categoryName.length>8?'lessPadding':'morePadding']"
                >
                    <view v-if="selectedType == item.categoryName" class="top-rect">
                        <view class="fillet"></view>
                    </view>
                    <view v-if="selectedType == item.categoryName" class="rect" ></view>
                    <span>{{ item.categoryName }}</span>
                </view>
            </view>
            <view class="itemList">
                <view class="itemBox" v-for="(item, index) in smallCatagories" :key="index" @click="showItem(item.smallCategoryName)">
                    <img
                        :src="
                            item.smallCategoryName == '全部'
                                ? '../../static/images/allType.png'
                                : item.smallImagePathWx || '../../static/images/defaultIcon.png'
                        "
                        style="width: 110rpx; height: 110rpx"
                    />
                    <view style="padding-top: 24rpx;line-height:22rpx;height:22rpx;font-size:0;">
                        <span style="font-size: 22rpx; color: #353535">{{ item.smallCategoryName }}</span>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { categoriesWithSub } from './index-api.js'

export default {
    data() {
        return {
            categories: [],
            selectedType: '全部',
            currentPage: 1,
            smallCatagories: [],
            placeholder:'请输入查询条件',
            searchColor:'#999999'
        }
    },

    onShow() {
        this.getCategories()
    },

    onLoad() {
        //this.getCategories()
    },

    mounted() {
        //this.getCategories()
    },

    methods: {
        search(e) {
            console.log(e)
            this.showItem(e.value)
        },

        getCategories() {
            this.categories = []
            this.smallCatagories = []
            const user = uni.getStorageSync('user')
            if (!user) {
                uni.redirectTo({
                    url: '../login/login'
                })
                return
            }
            categoriesWithSub({}, res => {
                if (res.code == 0) {
                    this.categories = res.data
                    this.getSmallCatagoriesList()
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '请登录后查看'
                    })
                }
            })
        },

        getSmallCatagoriesList() {
            this.smallCatagories = []
            if (this.selectedType != '全部') {
                this.categories.forEach(item => {
                    if (item.categoryName == this.selectedType) {
                        this.smallCatagories = item.smallCategories
                    }
                })
            } else {
                let allItem = {
                    smallCategoryName: '全部',
                    smallImagePath: ''
                }
                this.smallCatagories.push(allItem)
                this.categories.forEach(item => {
                    item.smallCategories.forEach(smallItem => {
                        this.smallCatagories.push(smallItem)
                    })
                })
            }
        },

        changeType(type) {
            this.selectedType = type
            this.getSmallCatagoriesList()
            if(type=='全部'){
                this.placeholder='请输入查询条件';
                this.searchColor='#999999'
            }else{
                this.placeholder=type;
                this.searchColor='@primaryBlue'

            }
        },

        showItem(name) {
            let type = name
            uni.navigateTo({
                url: '../place-order/index?itemType=' + type
            })
        }
    }
}
</script>

<style scoped lang="less">
.search {
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
}

.content {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    background: rgba(248, 248, 248, 1);
}

.typeList {
    // height: 100%;
    width: 180rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: scroll;
    // background: rgba(248, 248, 248, 1);
    background: white;

    .typeItem {
        position: relative;
        width: 180rpx;
        height: 120rpx;
        padding: 30rpx 20rpx;
        box-sizing: border-box;
        text-align: center;
        line-height: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(248, 248, 248, 1);

        .rect {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 8rpx;
            height: 30rpx;
            background: #456CFA;
        }

        .top-rect {
            position: absolute;
            top: -24rpx;
            right: 0;
            width: 24rpx;
            height: 24rpx; 
            background: white;
            z-index: 1;

            .fillet {
                width: 24rpx;
                height: 24rpx;
                border-bottom-right-radius: 24rpx;
                background: rgba(248, 248, 248, 1);
            }
        }
    }
    .lessPadding{
        padding: 30rpx 20rpx!important;
    }
    .morePadding{
        padding: 30rpx 33rpx!important;
    }
    .selectedType {
        background: rgba(255, 255, 255, 1);
        font-size: 28rpx;
        font-weight: bold;
        color: #000;
    }

    .selectedType + .unselectedType {
        border-top-right-radius: 24rpx;
    }

    .unselectedType {
        background: rgba(248, 248, 248, 1);
        font-size: 24rpx;
        font-weight: 500;
        color: #353535;
    }
}

.itemList {
    height: 100%;
    width: 570rpx;
    display: inline;
    overflow-y: scroll;
    background: white;

    .itemBox {
        padding-top: 32rpx;
        // width: 142rpx;
        float: left;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 33.333%;
        

        img {
            background-color: rgba(241, 241, 241, 1);
            border-radius: 70rpx;
        }
    }
}
</style>
