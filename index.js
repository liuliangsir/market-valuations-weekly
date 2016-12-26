/**
 * @file App
 * @author nobody<nobody@kavout.com>
 */

import React, {Component} from 'react';
import {TabBarIOS, ActivityIndicator, Alert} from 'react-native';
import WatchList from './watchlist/list/View.js';
import TradeLoginView from './trade/login/View.js';
import TradeMainView from './trade/main/View.js';
import MarketView from './market/main/View.js';
import MineView from './mine/user/View.js';
// import ExploreMainView from './explore/main/View.js';
import OpenMain from './open/main/View.js';

import auth, {user} from './common/user/auth';
import {getProfile} from './common/user';

/**
 * tabbar 默认的 View 视图
 *
 * @type {Object}
 */
const defaultTabBarViewMod = {
    watchList: WatchList,
    tradeView: TradeLoginView,
    marketView: MarketView,
    mineView: MineView,
    // exploreMainView: ExploreMainView
};

export default class App extends Component {

    constructor(props) {
        super(props);

        const {navigator, route} = this.props;
        let {activeTab='watchlist'} = route;

        // 方便开发调试, 临时设置为[交易]模块
        // activeTab = 'trade';

        this.state = {
            tradeSignIn: auth.isTradeSignIn,
            tradeAccountStatus: user.status,
            activeTab: activeTab,
        };

        this.state = Object.assign(this.state, {
            activeTab: props.activeTab || this.state.activeTab
        });

        this.signinValidate = this.signinValidate.bind(this);
        this.syncTradeAccountStatus = this.syncTradeAccountStatus.bind(this);

        this.mounted = true;
        this.setSafeState = this.setSafeState.bind(this);
    }

    setSafeState(josn) {
        if(this.mounted) {
            this.setState(josn);
        }
    }

    async componentWillMount(){
        await this.syncTradeAccountStatus();
    }

    async componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    signinValidate(){
        const {navigator, route} = this.props;
        if(!auth.isSignIn){
            navigator.replace({
                name: '/mine/signin',
                index: route.index + 1,
                activeTab: this.state.activeTab,
            });
            return false;
        }
        return true;
    }

    async syncTradeAccountStatus(){
        if(this.signinValidate()){
            // 每次切换到 "交易", 同步用户交易账户状态(API有10种账户状态)
            const response = await getProfile();
            if(response.status === 0){
                const userInfo = response.data;
                if(userInfo.status){
                    global.gTradeAccountInfo = userInfo;
                    this.setSafeState({
                        tradeAccountStatus: userInfo.status
                    });
                    if(user.status !== userInfo.status){
                        auth.sync(userInfo);
                    }
                }
            }
            this.setSafeState({
                tradeSignIn: auth.isTradeSignIn,
            });
        }
    }

    render() {

        const {navigator, route, tabBarViewMod} = this.props;

        const activeTab = this.state.activeTab;

        // 如果不存在自己设置的，说明是首页，那么用默认的
        const curTabBarViewMod = tabBarViewMod
            ? Object.assign(defaultTabBarViewMod, tabBarViewMod)
            : defaultTabBarViewMod;

        // === 交易 TabBar === //
        if(activeTab === 'trade'){
            // 如果没有开户，则进入开户主页
            if (this.state.tradeAccountStatus !== 'NORM') {
                if(curTabBarViewMod.tradeView != OpenMain) {
                    curTabBarViewMod.tradeView = OpenMain;
                }
            } else {
                // 根据交易账户 cookie 判断是否需要重新登录
                if (this.state.tradeSignIn) {
                    if(curTabBarViewMod.tradeView != TradeMainView) {
                        curTabBarViewMod.tradeView = TradeMainView;
                    }
                }else{
                    if(curTabBarViewMod.tradeView != TradeLoginView) {
                        curTabBarViewMod.tradeView = TradeLoginView;
                    }
                }
            }
        }

        return (
            <TabBarIOS
                unselectedTintColor="#666"
                tintColor="#e93030"
                barTintColor="white">
                <TabBarIOS.Item
                    title="自选"
                    icon={require('./common/img/tabbar/tab-icon-watchlist-nor.png')}
                    selectedIcon={require('./common/img/tabbar/tab-icon-watchlist-sel.png')}
                    selected={activeTab === 'watchlist'}
                    onPress={e => {
                        this.signinValidate();
                        this.setSafeState({activeTab: 'watchlist'});
                    }}>
                    <curTabBarViewMod.watchList navigator={navigator} route={route} />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="行情"
                    icon={require('./common/img/tabbar/tab-icon-market-nor.png')}
                    selectedIcon={require('./common/img/tabbar/tab-icon-market-sel.png')}
                    selected={activeTab === 'market'}
                    onPress={e => {
                        this.signinValidate();
                        this.setSafeState({activeTab: 'market'});
                    }}>
                    <curTabBarViewMod.marketView navigator={navigator} route={route} />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="交易"
                    icon={require('./common/img/tabbar/tab-icon-trading-nor.png')}
                    selectedIcon={require('./common/img/tabbar/tab-icon-trading-sel.png')}
                    selected={activeTab === 'trade'}
                    onPress={e => {
                        this.syncTradeAccountStatus();
                        this.setSafeState({activeTab: 'trade'});
                    }}>
                    <curTabBarViewMod.tradeView navigator={navigator} route={route} />
                </TabBarIOS.Item>
                {/* <TabBarIOS.Item
                    title="发现"
                    icon={require('./common/img/tabbar/tab-icon-discover-nor.png')}
                    selectedIcon={require('./common/img/tabbar/tab-icon-discover-sel.png')}
                    selected={activeTab === 'explore'}
                    onPress={e => {
                        this.signinValidate();
                        this.setSafeState({activeTab: 'explore'});
                    }}>
                    <curTabBarViewMod.exploreMainView navigator={navigator} route={route} />
                </TabBarIOS.Item> */}
                <TabBarIOS.Item
                    title="我的"
                    icon={require('./common/img/tabbar/tab-icon-user-nor.png')}
                    selectedIcon={require('./common/img/tabbar/tab-icon-user-sel.png')}
                    selected={activeTab === 'mine'}
                    onPress={e => {
                        this.signinValidate();
                        this.setSafeState({activeTab: 'mine'});
                    }}>
                    <curTabBarViewMod.mineView navigator={navigator} route={route} />
                </TabBarIOS.Item>
            </TabBarIOS>
         );

    }
}