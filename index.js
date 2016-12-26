/**
 * @file 行情 - 主页面
 * @author nobody<nobody@kavout.com>
 */

import React, {Component} from 'react';
import Dimensions from 'Dimensions';

import {
    RefreshControl,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';

import styles from './View.css.js';
import Nav from './component/Nav.js';
import Market from './component/Market.js';
import CellSection from './component/CellSection.js';
import ListSection from './component/ListSection.js';
import {
    loadAllMarketData
} from '../common/resource.js';
import {safeRound} from '../../common/util/wsNumber';
import Toast from '../../common/component/Toast';


export default class MarketMainView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            marketData: null,
            resMsg: '',
        };

        this.timer = null;
        this.fetchData = this.fetchData.bind(this);
        this.showToast = this.showToast.bind(this);
    }

    async componentDidMount() {
        await this.fetchData();
    }

    // 每次进入"行情"首页, 重新请求数据
    // 否则, 离线状态首次进入"行情" 会定格为 loading. 即使网络恢复, 再次进入仍显示 loading.
    async componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', nextProps);
        const {
            navigator,
            route
        } = nextProps;
        const routes = navigator.getCurrentRoutes(); // 获取栈中所有路由
        const currentRoute = routes[routes.length - 1]; // 获取当前路由
        // 返回(pop)到当前路由 or 再次点击对应的 tab
        if (currentRoute.index === route.index || currentRoute.name === route.name) {
            await this.fetchData();
        }
    }

    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
    }

    async fetchData() {

        // resp 数据格式:
        /*
            {
                status: 0,
                data: {
                    quotes: {},         // 指数(道琼斯, 纳斯达克, 标普500)
                    hot: {},            // 行业板块(分类)
                    hot_adrs: {},       // 热点中概股
                    hot_stocks: {},     // 热点美股
                    hot_etfs: {},       // 热门 ETF
                    adrs_asc: {}        // 中概股涨幅榜
                    adrs_desc: {},      // 中概股跌幅榜
                    stocks_asc: {},     // 美股涨幅榜
                    stocks_desc: {},    // 美股跌幅榜
                }
            }
        */

        // stocks_asc 数据格式:
        /*
            {
                data: [
                    {
                        ChangeFromPreviousClose: -0.56,
                        Last: 3.59
                        Name: "ATA公司"
                        PercentChangeFromPreviousClose: -13.494
                        marketValue: "8104万"
                        symbol: "ATAI",
                    },
                ],
                status: 0,
                total: 102
            }
        */

        try {
            const resp = await loadAllMarketData();
            // 返回数据出错
            if(resp.status !== 0) {
                this.showToast(String(resp.data));
                return;
            }

            // 返回正确数据
            const {
                quotes,         // 指数(道琼斯, 纳斯达克, 标普500)
                hot,            // 行业板块(分类)
                hot_adrs,       // 热点中概股
                hot_stocks,     // 热点美股
                hot_etfs,       // 热门 ETF
                adrs_asc,       // 中概股跌幅榜
                adrs_desc,      // 中概股涨幅榜
                stocks_asc,     // 美股跌幅榜
                stocks_desc,    // 美股涨幅榜
            } = resp.data;

            // 字段映射, 便于阅读和维护
            const marketData = {
                quotation: quotes,
                industries_plate: hot.data,
                china_hots: hot_adrs.data,
                us_hots: hot_stocks.data,
                etf_hots: hot_etfs.data,
                china_hots_asc: adrs_asc.data,
                china_hots_desc: adrs_desc.data,
                us_hots_asc: stocks_asc.data,
                us_hots_desc: stocks_desc.data,
            };

            this.setState({
                marketData
            });
        }
        catch (e) {
            this.showToast('获取行情信息失败');
            console.debug('Exception-MarketMainView-fetchData:', e.message);
        }
    }

    showToast(msg){
        this.setState({
            resMsg: msg,
        });
        if(msg){
            // Toast 组件存在首次出现不能自动消失问题... 额外加定时器解决!
            this.timer = setTimeout(()=>{
               this.setState({
                   resMsg: '',
               })
           }, 1000);
        }
    }

    render() {
        const {route, navigator} = this.props;
        const {refreshing, marketData, resMsg} = this.state;
        let marketMianView = null;
        const WIDTH = Dimensions.get('window').width;
        const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? 18 : 14);

        if (! marketData) {
            marketMianView = (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator animating={true} />
                </View>
            );
        } else {
            const {
                quotation,
                industries_plate,
                china_hots,
                us_hots,
                etf_hots,
                china_hots_asc,
                china_hots_desc,
                us_hots_asc,
                us_hots_desc
            } = marketData;

            marketMianView = (
                <ScrollView
                    ref={(_this) => this._scrollView = _this}
                    automaticallyAdjustContentInsets={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => this.fetchData()} />}
                >

                    {/* 指数(道琼斯, 纳斯达克, 标普500) */}
                    <Market {...quotation} {...this.props} />

                    <CellSection
                        title='行业板块'
                        cells={industries_plate}
                        onMore={() => navigator.push({
                            name: '/market/sectionboard',
                            route: route.index + 1,
                            section: 'sector',
                            title: '热门行业'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/market/leaderboard',
                            index: route.index,
                            title: cell.sector_zh,
                            id: cell.sector_id,
                            type: 'sector'
                        })}
                    />

                    <ListSection
                        title='热点中概股'
                        dataSource={china_hots.map(item => {
                            const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? (item.Name.length > 8 ? 16 : 18) : (item.Name.length > 6 ? 14 : 16));
                            return {
                                name: item.Name,
                                fontSize:autoFontSize,
                                exchange: item.exchange,
                                symbol: item.symbol,
                                closePrice: safeRound(item.Last, 2),
                                quoteRate: (item.PercentChangeFromPreviousClose > 0 ? '+' : '') + safeRound(item.PercentChangeFromPreviousClose, 2) + '%',
                                color: item.PercentChangeFromPreviousClose > 0 ? '#e93030' : (item.PercentChangeFromPreviousClose < 0 ? '#009900' : '#999'),
                            }
                        })}
                        onMore={() => navigator.push({
                            name: '/market/leaderboard',
                            route: route.index + 1,
                            title: '热点中概股',
                            type: 'china'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/instruments/detail',
                            index: route.index,
                            instrument: {
                                symbol: cell.symbol,
                                exchange: cell.exchange,
                                name: cell.name
                            }
                        })}
                    />

                    <ListSection
                        title='热点美股'
                        dataSource={us_hots.map(item => {
                            const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? (item.Name.length > 8 ? 16 : 18) : (item.Name.length > 6 ? 14 : 16));
                            return {
                                name: item.Name,
                                fontSize:autoFontSize,
                                exchange: item.exchange,
                                symbol: item.symbol,
                                closePrice: safeRound(item.Last, 2),
                                quoteRate: (item.PercentChangeFromPreviousClose > 0 ? '+' : '') + safeRound(item.PercentChangeFromPreviousClose, 2) + '%',
                                color: item.PercentChangeFromPreviousClose > 0 ? '#e93030' : (item.PercentChangeFromPreviousClose < 0 ? '#009900' : '#999'),
                            }
                        })}
                        onMore={() => navigator.push({
                            name: '/market/leaderboard',
                            route: route.index + 1,
                            title: '热点美股',
                            type: 'us'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/instruments/detail',
                            index: route.index,
                            instrument: {
                                symbol: cell.symbol,
                                exchange: cell.exchange,
                                name: cell.name
                            }
                        })}
                    />

                    <ListSection
                        title='热点ETF'
                        dataSource={etf_hots.map(item => {
                            const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? (item.Name.length > 8 ? 16 : 18) : (item.Name.length > 6 ? 14 : 16));
                            return {
                                name: item.Name,
                                fontSize:autoFontSize,
                                exchange: item.exchange,
                                symbol: item.symbol,
                                closePrice: safeRound(item.Last, 2),
                                quoteRate: (item.PercentChangeFromPreviousClose > 0 ? '+' : '') + safeRound(item.PercentChangeFromPreviousClose, 2) + '%',
                                color: item.PercentChangeFromPreviousClose > 0 ? '#e93030' : (item.PercentChangeFromPreviousClose < 0 ? '#009900' : '#999'),
                            }
                        })}
                        onMore={() => navigator.push({
                            name: '/market/leaderboard',
                            route: route.index + 1,
                            title: 'ETF',
                            type: 'etf'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/instruments/detail',
                            index: route.index,
                            instrument: {
                                symbol: cell.symbol,
                                exchange: cell.exchange,
                                name: cell.name
                            }
                        })}
                    />

                    <ListSection
                        title='中概股涨幅榜'
                        dataSource={china_hots_desc.map(item => {
                            const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? (item.Name.length > 8 ? 16 : 18) : (item.Name.length > 6 ? 14 : 16));
                            return {
                                name: item.Name,
                                fontSize:autoFontSize,
                                exchange: item.exchange,
                                symbol: item.symbol,
                                closePrice: safeRound(item.Last, 2),
                                quoteRate: (item.PercentChangeFromPreviousClose > 0 ? '+' : '') + safeRound(item.PercentChangeFromPreviousClose, 2) + '%',
                                color: item.PercentChangeFromPreviousClose > 0 ? '#e93030' : (item.PercentChangeFromPreviousClose < 0 ? '#009900' : '#999'),
                            }
                        })}
                        onMore={() => navigator.push({
                            name: '/market/leaderboard',
                            route: route.index + 1,
                            title: '中概股涨幅榜',
                            type: 'chinaUp'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/instruments/detail',
                            index: route.index,
                            instrument: {
                                symbol: cell.symbol,
                                exchange: cell.exchange,
                                name: cell.name
                            }
                        })}
                    />

                    <ListSection
                        title='中概股跌幅榜'
                        dataSource={china_hots_asc.map(item => {
                            const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? (item.Name.length > 8 ? 16 : 18) : (item.Name.length > 6 ? 14 : 16));
                            return {
                                name: item.Name,
                                fontSize:autoFontSize,
                                exchange: item.exchange,
                                symbol: item.symbol,
                                closePrice: safeRound(item.Last, 2),
                                quoteRate: (item.PercentChangeFromPreviousClose > 0 ? '+' : '') + safeRound(item.PercentChangeFromPreviousClose, 2) + '%',
                                color: item.PercentChangeFromPreviousClose > 0 ? '#e93030' : (item.PercentChangeFromPreviousClose < 0 ? '#009900' : '#999'),
                            }
                        })}
                        onMore={() => navigator.push({
                            name: '/market/leaderboard',
                            route: route.index + 1,
                            title: '中概股跌幅榜',
                            type: 'chinaDown'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/instruments/detail',
                            index: route.index,
                            instrument: {
                                symbol: cell.symbol,
                                exchange: cell.exchange,
                                name: cell.name
                            }
                        })}
                    />

                    <ListSection
                        title='美股涨幅榜'
                        dataSource={us_hots_desc.map(item => {
                            const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? (item.Name.length > 8 ? 16 : 18) : (item.Name.length > 6 ? 14 : 16));
                            return {
                                name: item.Name,
                                fontSize:autoFontSize,
                                exchange: item.exchange,
                                symbol: item.symbol,
                                closePrice: safeRound(item.Last, 2),
                                quoteRate: (item.PercentChangeFromPreviousClose > 0 ? '+' : '') + safeRound(item.PercentChangeFromPreviousClose, 2) + '%',
                                color: item.PercentChangeFromPreviousClose > 0 ? '#e93030' : (item.PercentChangeFromPreviousClose < 0 ? '#009900' : '#999'),
                            }
                        })}
                        onMore={() => navigator.push({
                            name: '/market/leaderboard',
                            route: route.index + 1,
                            title: '美股涨幅榜',
                            type: 'usUp'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/instruments/detail',
                            index: route.index,
                            instrument: {
                                symbol: cell.symbol,
                                exchange: cell.exchange,
                                name: cell.name
                            }
                        })} />

                    <ListSection
                        title='美股跌幅榜'
                        lastIndex={true}
                        dataSource={us_hots_asc.map(item => {
                            const autoFontSize = WIDTH > 410 ? 18 : (WIDTH > 370 ? (item.Name.length > 8 ? 16 : 18) : (item.Name.length > 6 ? 14 : 16));
                            return {
                                name: item.Name,
                                fontSize:autoFontSize,
                                exchange:item.exchange,
                                symbol: item.symbol,
                                closePrice: safeRound(item.Last, 2),
                                quoteRate: (item.PercentChangeFromPreviousClose > 0 ? '+' : '') + safeRound(item.PercentChangeFromPreviousClose, 2) + '%',
                                color: item.PercentChangeFromPreviousClose > 0 ? '#e93030' : (item.PercentChangeFromPreviousClose < 0 ? '#009900' : '#999'),
                            }
                        })}
                        onMore={() => navigator.push({
                            name: '/market/leaderboard',
                            route: route.index + 1,
                            title: '美股跌幅榜',
                            type: 'usDown'
                        })}
                        onSelect={cell => navigator.push({
                            name: '/instruments/detail',
                            index: route.index,
                            instrument: {
                                symbol: cell.symbol,
                                exchange: cell.exchange,
                                name: cell.name
                            }
                        })}
                    />
                </ScrollView>
            );
        }

        return (
            <View style={styles.container}>
                {marketMianView}
                <Nav
                    onSearch={() => navigator.push({
                        name: '/instruments/search',
                        index: route.index + 1
                    })} />
                <Toast message={resMsg} position="center" timeout={2000} fadeTime={300} />
            </View>
        );

    }

}